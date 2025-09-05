import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'
import { z } from 'zod'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const submitDraftSchema = z.object({
  id: z.string().uuid(),
  data: z.object({
    idea: z.string(),
    challenge: z.string(),
    goal_90d: z.string(),
    resources: z.array(z.string()),
    other_resource: z.string().optional(),
    name: z.string(),
    email: z.string().email(),
    consent: z.boolean()
  })
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, data } = submitDraftSchema.parse(body)

    // Update draft status to submitted
    const { data: draft, error: updateError } = await supabase
      .from('intake_forms')
      .update({
        status: 'submitted',
        data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating draft:', updateError)
      return NextResponse.json(
        { error: 'Failed to submit draft' },
        { status: 500 }
      )
    }

    // Generate PDF (we'll implement this next)
    const pdfBuffer = await generatePersonalPlanPDF(data)
    
    // Upload PDF to Supabase Storage
    const fileName = `personal-plan-${id}.pdf`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) {
      console.error('Error uploading PDF:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload PDF' },
        { status: 500 }
      )
    }

    // Get public URL for the PDF
    const { data: urlData } = supabase.storage
      .from('pdfs')
      .getPublicUrl(fileName)

    // Update draft with PDF URL
    await supabase
      .from('intake_forms')
      .update({ pdf_url: urlData.publicUrl })
      .eq('id', id)

    // Send email with PDF
    try {
      await resend.emails.send({
        from: 'ALIRA <noreply@alira.co.uk>', // You'll need to verify this domain
        to: [data.email],
        subject: 'Your Personal Plan is Ready',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a1a1a;">Hello ${data.name},</h2>
            <p>Your personalized business plan is ready! We've analyzed your inputs and created a comprehensive plan tailored to your specific situation.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${urlData.publicUrl}" style="background-color: #1a1a1a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
                Download Your Plan
              </a>
            </div>
            <p>This plan includes:</p>
            <ul>
              <li>Strategic assessment of your current position</li>
              <li>Clear next steps for the next 90 days</li>
              <li>Resource optimization recommendations</li>
              <li>Implementation roadmap</li>
            </ul>
            <p>Ready to discuss your plan? <a href="https://calendly.com/alira/consultation">Book a free check-in call</a> to explore how we can help you implement these recommendations.</p>
            <p>Best regards,<br>The ALIRA Team</p>
          </div>
        `
      })
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      pdf_url: urlData.publicUrl,
      message: 'Plan generated and email sent successfully'
    })
  } catch (error) {
    console.error('Error in submit draft API:', error)
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}

// Placeholder for PDF generation - we'll implement this next
async function generatePersonalPlanPDF(data: any): Promise<Buffer> {
  // This will be implemented in the next step
  // For now, return a simple buffer
  return Buffer.from('PDF placeholder')
}
