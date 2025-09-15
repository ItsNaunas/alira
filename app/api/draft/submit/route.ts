import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'
import { env } from '@/lib/env'
import { z } from 'zod'
import { sendPersonalPlanEmail } from '@/lib/enhanced-email'
import { PersonalPlanPDFData } from '@/lib/enhanced-pdf'

export const runtime = 'nodejs'

const submitDraftSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email()
})

export async function POST(request: NextRequest) {
  console.log('[SUBMIT] Starting form submission')
  console.time('[SUBMIT] total')
  
  try {
    // 1) validate env early
    console.log('[SUBMIT] Environment check:', {
      hasResendKey: !!env.RESEND_API_KEY,
      resendKeyLength: env.RESEND_API_KEY?.length || 0,
      hasFromEmail: !!env.RESEND_FROM_EMAIL,
      fromEmail: env.RESEND_FROM_EMAIL
    })
    
    // 2) parse and validate input
    let body: any
    try {
      body = await request.json()
    } catch {
      console.error('[submit] No/invalid JSON body')
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    console.log('[submit] body keys:', Object.keys(body))
    
    const { id, email } = submitDraftSchema.parse(body)

    // Get the draft data
    const { data: draft, error: fetchError } = await supabase
      .from('intake_forms')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Database error fetching draft:', fetchError)
      
      if (fetchError.code === 'PGRST116') { // Row not found
        return NextResponse.json(
          { error: 'Draft not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to retrieve draft. Please try again.' },
        { status: 500 }
      )
    }

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      )
    }

    // Check if draft is already submitted
    if (draft.status === 'submitted') {
      return NextResponse.json(
        { error: 'Draft has already been submitted' },
        { status: 409 }
      )
    }

    // Update draft status to submitted and email
    const { error: updateError } = await supabase
      .from('intake_forms')
      .update({
        status: 'submitted',
        email: email,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (updateError) {
      console.error('Error updating draft:', updateError)
      return NextResponse.json(
        { error: 'Failed to submit draft' },
        { status: 500 }
      )
    }

    // Prepare PDF data for enhanced service
    const pdfData: PersonalPlanPDFData = {
      name: draft.name || 'Valued Client',
      email: email,
      business_idea: draft.data?.business_idea || 'Business concept not provided',
      current_challenges: draft.data?.current_challenges || 'Challenges not specified',
      immediate_goals: draft.data?.immediate_goals || 'Goals not specified',
      service_interest: draft.data?.service_interest || [],
      current_tools: draft.data?.current_tools || undefined,
      generatedDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }

    console.log('PDF data prepared:', {
      name: pdfData.name,
      hasBusinessIdea: !!pdfData.business_idea,
      hasChallenges: !!pdfData.current_challenges,
      hasGoals: !!pdfData.immediate_goals,
      serviceCount: pdfData.service_interest?.length || 0
    })

    // 4) call email
    console.log('[SUBMIT] Calling sendPersonalPlanEmail with data:', {
      to: email,
      name: pdfData.name,
      hasPdfData: !!pdfData,
      mode: 'personal-plan'
    })
    
    const emailResult = await sendPersonalPlanEmail({
      to: email,
      name: pdfData.name,
      pdfData: pdfData,
      mode: 'personal-plan'
    })

    if (!emailResult.success) {
      console.error('[SUBMIT_ERROR] Email failed:', {
        error: emailResult.error,
        details: emailResult.error,
        timestamp: new Date().toISOString()
      })
      return NextResponse.json(
        { 
          error: 'Email failed', 
          details: emailResult.error 
        },
        { status: 500 }
      )
    }

    console.log('[submit] success:', emailResult.messageId)

    // Upload PDF to Supabase Storage for backup/access
    try {
      const { generatePersonalPlanPDF } = await import('@/lib/enhanced-pdf')
      const pdfBuffer = await generatePersonalPlanPDF(pdfData)
      
      const fileName = `personal-plan-${id}.pdf`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(fileName, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true
        })

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('pdfs')
          .getPublicUrl(fileName)

        // Update draft with PDF URL
        await supabase
          .from('intake_forms')
          .update({ pdf_url: urlData.publicUrl })
          .eq('id', id)

        console.log('PDF uploaded to storage:', urlData.publicUrl)
      } else {
        console.warn('PDF storage upload failed:', uploadError)
      }
    } catch (storageError) {
      console.warn('PDF storage backup failed:', storageError)
      // Don't fail the request if storage backup fails
    }

    return NextResponse.json({ 
      ok: true, 
      messageId: emailResult.messageId,
      success: true,
      message: 'Personal plan generated and sent successfully',
      email_sent: true,
      message_id: emailResult.messageId,
      pdf_size: emailResult.pdfSize,
      recipient: email
    })
  } catch (err: any) {
    console.error('[SUBMIT_ERROR] Unhandled error:', {
      message: err?.message || 'Unknown error',
      stack: err?.stack || undefined,
      raw: err,
      timestamp: new Date().toISOString()
    })
    
    // Handle validation errors
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: err.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      )
    }
    
    // Handle JSON parsing errors
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Server error', 
        details: err?.message || String(err) 
      },
      { status: 500 }
    )
  } finally {
    console.timeEnd('[submit] total')
  }
}

