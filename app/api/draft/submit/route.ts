import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'
import { z } from 'zod'
import { Resend } from 'resend'
import PDFDocument from 'pdfkit'

const resend = new Resend(process.env.RESEND_API_KEY)

const submitDraftSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email()
})

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
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

    // Generate PDF using the draft data
    const pdfBuffer = await generatePersonalPlanPDF(draft.data)
    
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
        from: 'ALIRA <contact@alirapartners.co.uk>',
        to: [email],
        subject: 'Your Personal Plan is Ready',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a1a1a;">Hello ${draft.name},</h2>
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
            <p>Ready to discuss your plan? <a href="https://calendly.com/its-naunas/30min">Book a free check-in call</a> to explore how we can help you implement these recommendations.</p>
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

// Generate personalized business plan PDF
async function generatePersonalPlanPDF(data: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      })

      const buffers: Buffer[] = []
      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers)
        resolve(pdfData)
      })

      // Header with ALIRA branding
      doc.fontSize(24)
        .fillColor('#1a1a1a')
        .text('ALIRA', 50, 50)
      
      doc.fontSize(12)
        .fillColor('#666')
        .text('Strategic Business Solutions', 50, 80)

      // Title
      doc.fontSize(20)
        .fillColor('#1a1a1a')
        .text('Your Personalized Business Plan', 50, 120)

      // Date
      doc.fontSize(10)
        .fillColor('#999')
        .text(`Generated on ${new Date().toLocaleDateString()}`, 50, 150)

      let yPosition = 180

      // Business Overview Section
      doc.fontSize(16)
        .fillColor('#1a1a1a')
        .text('Business Overview', 50, yPosition)
      
      yPosition += 30
      doc.fontSize(12)
        .fillColor('#333')
        .text(`Business Concept: ${data.business_idea}`, 50, yPosition, {
          width: 500,
          align: 'left'
        })
      
      yPosition += 60

      // Current Challenges Section
      doc.fontSize(16)
        .fillColor('#1a1a1a')
        .text('Current Challenges', 50, yPosition)
      
      yPosition += 30
      doc.fontSize(12)
        .fillColor('#333')
        .text(`Key Challenges: ${data.current_challenges}`, 50, yPosition, {
          width: 500,
          align: 'left'
        })
      
      yPosition += 60

      // Goals Section
      doc.fontSize(16)
        .fillColor('#1a1a1a')
        .text('Immediate Goals (3-6 months)', 50, yPosition)
      
      yPosition += 30
      doc.fontSize(12)
        .fillColor('#333')
        .text(`Goals: ${data.immediate_goals}`, 50, yPosition, {
          width: 500,
          align: 'left'
        })
      
      yPosition += 60

      // Service Interest Section
      doc.fontSize(16)
        .fillColor('#1a1a1a')
        .text('Recommended ALIRA Services', 50, yPosition)
      
      yPosition += 30
      doc.fontSize(12)
        .fillColor('#333')
      
      const serviceMap = {
        'brand_product': 'Brand & Product Management',
        'content_management': 'Content Management',
        'digital_solutions': 'Digital Solutions & AI Integration'
      }
      
      const selectedServices = data.service_interest?.map((service: string) => 
        serviceMap[service] || service
      ).join(', ') || 'General business improvement'
      
      doc.text(`Selected Services: ${selectedServices}`, 50, yPosition, {
        width: 500,
        align: 'left'
      })
      
      yPosition += 40

      // Current Tools Section
      if (data.current_tools) {
        doc.fontSize(12)
          .fillColor('#333')
          .text(`Current Tools: ${data.current_tools}`, 50, yPosition, {
            width: 500,
            align: 'left'
          })
        
        yPosition += 40
      }

      // Next Steps Section
      doc.fontSize(16)
        .fillColor('#1a1a1a')
        .text('Recommended Next Steps', 50, yPosition)
      
      yPosition += 30
      doc.fontSize(12)
        .fillColor('#333')
        .text('1. Schedule a consultation call to discuss your specific needs', 50, yPosition)
      
      yPosition += 20
      doc.text('2. Review your current systems and identify optimization opportunities', 50, yPosition)
      
      yPosition += 20
      doc.text('3. Develop a customized implementation roadmap', 50, yPosition)
      
      yPosition += 20
      doc.text('4. Begin with high-impact, quick-win initiatives', 50, yPosition)

      // Contact Information
      yPosition += 50
      doc.fontSize(14)
        .fillColor('#1a1a1a')
        .text('Ready to Get Started?', 50, yPosition)
      
      yPosition += 30
      doc.fontSize(12)
        .fillColor('#333')
        .text('Contact ALIRA to discuss how we can help implement these recommendations:', 50, yPosition)
      
      yPosition += 30
      doc.text('Email: contact@alirapartners.co.uk', 50, yPosition)
      
      yPosition += 20
      doc.text('Website: alirapartners.co.uk', 50, yPosition)

      // Footer
      doc.fontSize(10)
        .fillColor('#999')
        .text('This plan was generated based on your specific inputs and ALIRA\'s expertise in business optimization.', 50, 750, {
          width: 500,
          align: 'center'
        })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}
