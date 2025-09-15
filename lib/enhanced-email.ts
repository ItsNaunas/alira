import { Resend } from 'resend'
import { generatePersonalPlanPDF, getPDFBase64, PersonalPlanPDFData } from './enhanced-pdf'
import { env } from './env'

// Enhanced email data interface
export interface EmailData {
  to: string
  name: string
  pdfData: PersonalPlanPDFData
  mode?: 'personal-plan' | 'business-case'
}

// Professional email template for personal plans
const personalPlanEmailTemplate = (data: PersonalPlanPDFData) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Personal Business Plan - ALIRA</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); color: #ffffff; padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #d4af37;">ALIRA.</h1>
            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Strategic Business Solutions</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px;">Hello ${data.name},</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                Your personalized business plan is ready! We've analyzed your inputs and created a comprehensive 
                strategic assessment tailored specifically to your business situation.
            </p>
            
            <!-- Download Button -->
            <div style="text-align: center; margin: 35px 0;">
                <a href="#" style="background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%); color: #ffffff; padding: 15px 35px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">
                    📄 Download Your Plan
                </a>
            </div>
            
            <!-- What's Included -->
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin: 30px 0;">
                <h3 style="color: #1a1a1a; font-size: 18px; margin-bottom: 15px;">Your Plan Includes:</h3>
                <ul style="color: #666; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Strategic Assessment:</strong> Analysis of your current business position</li>
                    <li><strong>Challenge Analysis:</strong> Key obstacles and opportunities identified</li>
                    <li><strong>90-Day Roadmap:</strong> Clear next steps for immediate impact</li>
                    <li><strong>Service Recommendations:</strong> Tailored ALIRA services for your needs</li>
                    <li><strong>Implementation Guide:</strong> Practical steps to move forward</li>
                </ul>
            </div>
            
            <!-- Next Steps -->
            <div style="border-left: 4px solid #d4af37; padding-left: 20px; margin: 30px 0;">
                <h3 style="color: #1a1a1a; font-size: 18px; margin-bottom: 15px;">Ready to Get Started?</h3>
                <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                    Book a free 30-minute consultation to discuss your plan and explore how we can help 
                    you implement these recommendations.
                </p>
                <a href="https://calendly.com/its-naunas/30min" style="background-color: #1a1a1a; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 20px; display: inline-block; font-weight: bold; font-size: 14px;">
                    📅 Book Consultation Call
                </a>
            </div>
            
            <!-- Important Notice -->
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.5;">
                    <strong>📧 Important:</strong> If you don't see this email in your inbox, please check your 
                    spam/junk folder. The PDF attachment contains your complete business plan.
                </p>
            </div>
            
            <!-- Contact Info -->
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e0e0e0;">
                <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
                    Questions? Contact us at <a href="mailto:contact@alirapartners.co.uk" style="color: #d4af37; text-decoration: none;">contact@alirapartners.co.uk</a>
                </p>
                <p style="color: #999; font-size: 12px; margin: 0;">
                    ALIRA. | Strategic Business Solutions | alirapartners.co.uk
                </p>
            </div>
        </div>
    </div>
</body>
</html>
`

// Main email sending function
export async function sendPersonalPlanEmail(data: EmailData) {
  try {
    console.log('=== EMAIL SENDING STARTED ===')
    console.log('Generating PDF for:', data.name)
    
    // Generate PDF
    const pdfBuffer = await generatePersonalPlanPDF(data.pdfData)
    console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes')
    
    // Convert to base64 for attachment
    const pdfBase64 = getPDFBase64(pdfBuffer)
    
    // Initialize Resend client
    console.log('Resend API Key available:', !!env.RESEND_API_KEY)
    console.log('Resend API Key length:', env.RESEND_API_KEY?.length || 0)
    
    if (!env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured')
    }
    
    const resend = new Resend(env.RESEND_API_KEY)
    
    // Send email with PDF attachment
    console.log('Sending email to:', data.to)
    const { data: result, error } = await resend.emails.send({
      from: 'ALIRA <contact@alirapartners.co.uk>',
      to: [data.to],
      subject: `Your Personal Business Plan is Ready - ${data.name}`,
      html: personalPlanEmailTemplate(data.pdfData),
      attachments: [
        {
          filename: `personal-business-plan-${data.name.replace(/\s+/g, '-').toLowerCase()}.pdf`,
          content: pdfBase64
        }
      ]
    })

    if (error) {
      console.error('Resend API error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return { success: false, error: error.message || 'Unknown email error' }
    }

    console.log('Email sent successfully:', result)
    return { 
      success: true, 
      messageId: result?.id,
      pdfSize: pdfBuffer.length
    }
  } catch (error) {
    console.error('Error in sendPersonalPlanEmail:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Auto-reply email function
export async function sendAutoReply(to: string, name: string) {
  try {
    const resend = new Resend(env.RESEND_API_KEY)
    const { data: result, error } = await resend.emails.send({
      from: 'ALIRA <contact@alirapartners.co.uk>',
      to: [to],
      subject: 'Thank you for requesting your Personal Business Plan',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #1a1a1a; color: #ffffff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #d4af37;">ALIRA.</h1>
          </div>
          <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
            <h2 style="color: #1a1a1a;">Thank you, ${name}!</h2>
            <p style="color: #666; line-height: 1.6;">We've received your request and are preparing your personalized business plan. You'll receive it within the next few minutes.</p>
            <p style="color: #666; line-height: 1.6;">If you don't see our email within 10 minutes, please check your spam folder.</p>
            <p style="color: #666; line-height: 1.6;">Best regards,<br>The ALIRA Team</p>
          </div>
        </div>
      `
    })

    return { success: !error, result, error }
  } catch (error) {
    console.error('Error sending auto-reply:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Test email function for development
export async function sendTestEmail(to: string) {
  try {
    const testData: PersonalPlanPDFData = {
      name: 'Test User',
      email: to,
      business_idea: 'This is a test business idea for PDF generation testing.',
      current_challenges: 'Testing PDF generation and email delivery system.',
      immediate_goals: 'Verify that the enhanced system works correctly.',
      service_interest: ['digital_solutions'],
      current_tools: 'Test tools and systems'
    }

    return await sendPersonalPlanEmail({
      to,
      name: 'Test User',
      pdfData: testData
    })
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
