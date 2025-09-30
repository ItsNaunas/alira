import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'
import { z } from 'zod'
import { sendPersonalPlanEmail, EmailData } from '@/lib/enhanced-email'
import { PersonalPlanPDFData } from '@/lib/enhanced-pdf'
import { generateBusinessCase } from '@/lib/openai'

const submitDraftSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email()
})

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const { id, email } = submitDraftSchema.parse(body)

    console.log('Processing draft submission:', { id, email })

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

    console.log('Draft found:', { 
      id: draft.id, 
      name: draft.name, 
      status: draft.status,
      hasData: !!draft.data 
    })

    // Generate AI analysis
    let aiAnalysis = null
    try {
      console.log('[SUBMIT-ENHANCED] Generating AI analysis...')
      
      const aiInput = {
        businessName: draft.name || 'Business',
        industry: draft.data?.service_interest?.join(', ') || 'General business',
        stage: 'Early stage',
        challenges: draft.data?.current_challenges || 'Business development challenges',
        goalsShort: draft.data?.immediate_goals || 'Short-term business goals',
        goalsLong: 'Long-term business growth and sustainability',
        resources: draft.data?.current_tools || 'Available business resources',
        budget: 'To be determined',
        timeline: 'Flexible timeline',
        service: draft.data?.service_interest?.join(', ') || 'General business improvement',
        notes: draft.data?.business_idea || 'Business concept not provided'
      }
      
      console.log('[SUBMIT-ENHANCED] AI input data:', JSON.stringify(aiInput, null, 2))
      console.log('[SUBMIT-ENHANCED] OpenAI API Key present:', !!process.env.OPENAI_API_KEY)
      console.log('[SUBMIT-ENHANCED] OpenAI API Key length:', process.env.OPENAI_API_KEY?.length || 0)
      
      aiAnalysis = await generateBusinessCase(aiInput)
      console.log('[SUBMIT-ENHANCED] AI analysis generated successfully:', {
        hasProblemStatement: !!aiAnalysis?.problem_statement,
        objectivesCount: aiAnalysis?.objectives?.length || 0,
        solutionsCount: aiAnalysis?.proposed_solution?.length || 0
      })
    } catch (error) {
      console.error('[SUBMIT-ENHANCED] AI analysis failed:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        raw: error
      })
      // Continue without AI analysis if it fails, but log the failure
      console.warn('[SUBMIT-ENHANCED] Continuing without AI analysis due to generation failure')
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

    // Prepare PDF data
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
      }),
      aiAnalysis: aiAnalysis // Include AI analysis
    }

    console.log('PDF data prepared:', {
      name: pdfData.name,
      hasBusinessIdea: !!pdfData.business_idea,
      hasChallenges: !!pdfData.current_challenges,
      hasGoals: !!pdfData.immediate_goals,
      serviceCount: pdfData.service_interest?.length || 0,
      hasAiAnalysis: !!pdfData.aiAnalysis,
      aiAnalysisDetails: pdfData.aiAnalysis ? {
        hasProblemStatement: !!pdfData.aiAnalysis.problem_statement,
        objectivesCount: pdfData.aiAnalysis.objectives?.length || 0,
        solutionsCount: pdfData.aiAnalysis.proposed_solution?.length || 0
      } : null
    })

    // Send email with PDF using enhanced service
    const emailResult = await sendPersonalPlanEmail({
      to: email,
      name: pdfData.name,
      pdfData: pdfData,
      mode: 'personal-plan'
    })

    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error)
      return NextResponse.json(
        { 
          error: 'Plan generated but email delivery failed. Please contact support.',
          details: emailResult.error 
        },
        { status: 500 }
      )
    }

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

    console.log('Draft submission completed successfully:', {
      draftId: id,
      email: email,
      messageId: emailResult.messageId,
      pdfSize: emailResult.pdfSize
    })

    return NextResponse.json({
      success: true,
      message: 'Personal plan generated and sent successfully',
      email_sent: true,
      message_id: emailResult.messageId,
      pdf_size: emailResult.pdfSize,
      recipient: email
    })

  } catch (error) {
    console.error('Error in enhanced submit draft API:', error)
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      )
    }
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}

// Test endpoint for development
export async function GET() {
  try {
    const { sendTestEmail } = await import('@/lib/enhanced-email')
    const testEmail = process.env.TEST_EMAIL || 'test@example.com'
    
    const result = await sendTestEmail(testEmail)
    
    return NextResponse.json({
      success: result.success,
      message: 'Test email sent',
      details: result
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
