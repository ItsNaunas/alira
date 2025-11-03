import 'server-only'
import { Resend } from 'resend'

export interface ContactFormData {
  name: string
  email: string
  message: string
}

export interface BusinessCaseFormData {
  businessName: string
  industry: string
  stage: string
  challenges: string
  goalsShort?: string
  goalsLong?: string
  resources?: string
  budget?: string
  timeline?: string
  service?: string
  contactName: string
  email: string
  notes?: string
}

export interface WizardFormData {
  idea: string
  challenge: string
  goal_90d: string
  resources: string[]
  other_resource?: string
  name: string
  email: string
  consent: boolean
}

// Email templates
const contactFormTemplate = (data: ContactFormData) => `
<div style="font-family: 'Lato', Arial, sans-serif; font-weight: 300; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
  <div style="background-color: #1a1a1a; color: #ffffff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">ALIRA.</h1>
    <p style="margin: 10px 0 0 0; color: #d4af37; font-size: 16px;">New Contact Form Submission</p>
  </div>
  
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
    <h2 style="color: #1a1a1a; margin-top: 0; font-size: 24px;">Contact Details</h2>
    
    <div style="margin-bottom: 20px;">
      <strong style="color: #1a1a1a;">Name:</strong>
      <p style="margin: 5px 0; color: #666;">${data.name}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <strong style="color: #1a1a1a;">Email:</strong>
      <p style="margin: 5px 0; color: #666;">${data.email}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <strong style="color: #1a1a1a;">Message:</strong>
      <div style="margin: 5px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #d4af37; color: #333; white-space: pre-wrap;">${data.message}</div>
    </div>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 14px;">
      <p>This message was sent from the ALIRA website contact form.</p>
      <p>Please respond within 24 hours as promised on the website.</p>
    </div>
  </div>
</div>
`

const businessCaseFormTemplate = (data: BusinessCaseFormData) => `
<div style="font-family: 'Lato', Arial, sans-serif; font-weight: 300; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
  <div style="background-color: #1a1a1a; color: #ffffff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">ALIRA.</h1>
    <p style="margin: 10px 0 0 0; color: #d4af37; font-size: 16px;">New Business Case Request</p>
  </div>
  
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
    <h2 style="color: #1a1a1a; margin-top: 0; font-size: 24px;">Business Information</h2>
    
    <div style="margin-bottom: 15px;">
      <strong style="color: #1a1a1a;">Business Name:</strong>
      <p style="margin: 5px 0; color: #666;">${data.businessName}</p>
    </div>
    
    <div style="margin-bottom: 15px;">
      <strong style="color: #1a1a1a;">Industry:</strong>
      <p style="margin: 5px 0; color: #666;">${data.industry}</p>
    </div>
    
    <div style="margin-bottom: 15px;">
      <strong style="color: #1a1a1a;">Business Stage:</strong>
      <p style="margin: 5px 0; color: #666;">${data.stage}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <strong style="color: #1a1a1a;">Challenges:</strong>
      <div style="margin: 5px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #d4af37; color: #333; white-space: pre-wrap;">${data.challenges}</div>
    </div>
    
    ${data.goalsShort ? `
    <div style="margin-bottom: 20px;">
      <strong style="color: #1a1a1a;">Short-term Goals:</strong>
      <div style="margin: 5px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #d4af37; color: #333; white-space: pre-wrap;">${data.goalsShort}</div>
    </div>
    ` : ''}
    
    ${data.goalsLong ? `
    <div style="margin-bottom: 20px;">
      <strong style="color: #1a1a1a;">Long-term Goals:</strong>
      <div style="margin: 5px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #d4af37; color: #333; white-space: pre-wrap;">${data.goalsLong}</div>
    </div>
    ` : ''}
    
    <h3 style="color: #1a1a1a; margin-top: 30px; font-size: 20px;">Contact Information</h3>
    
    <div style="margin-bottom: 15px;">
      <strong style="color: #1a1a1a;">Contact Name:</strong>
      <p style="margin: 5px 0; color: #666;">${data.contactName}</p>
    </div>
    
    <div style="margin-bottom: 15px;">
      <strong style="color: #1a1a1a;">Email:</strong>
      <p style="margin: 5px 0; color: #666;">${data.email}</p>
    </div>
    
    ${data.budget ? `
    <div style="margin-bottom: 15px;">
      <strong style="color: #1a1a1a;">Budget Range:</strong>
      <p style="margin: 5px 0; color: #666;">${data.budget}</p>
    </div>
    ` : ''}
    
    ${data.timeline ? `
    <div style="margin-bottom: 15px;">
      <strong style="color: #1a1a1a;">Timeline:</strong>
      <p style="margin: 5px 0; color: #666;">${data.timeline}</p>
    </div>
    ` : ''}
    
    ${data.notes ? `
    <div style="margin-bottom: 20px;">
      <strong style="color: #1a1a1a;">Additional Notes:</strong>
      <div style="margin: 5px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #d4af37; color: #333; white-space: pre-wrap;">${data.notes}</div>
    </div>
    ` : ''}
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 14px;">
      <p>This business case request was submitted through the ALIRA website.</p>
      <p>Please follow up within 24 hours as promised on the website.</p>
    </div>
  </div>
</div>
`

const wizardFormTemplate = (data: WizardFormData) => `
<div style="font-family: 'Lato', Arial, sans-serif; font-weight: 300; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
  <div style="background-color: #1a1a1a; color: #ffffff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">ALIRA.</h1>
    <p style="margin: 10px 0 0 0; color: #d4af37; font-size: 16px;">New Simple Plan Request</p>
  </div>
  
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
    <h2 style="color: #1a1a1a; margin-top: 0; font-size: 24px;">Plan Details</h2>
    
    <div style="margin-bottom: 20px;">
      <strong style="color: #1a1a1a;">Business Idea:</strong>
      <div style="margin: 5px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #d4af37; color: #333; white-space: pre-wrap;">${data.idea}</div>
    </div>
    
    <div style="margin-bottom: 20px;">
      <strong style="color: #1a1a1a;">Main Challenge:</strong>
      <div style="margin: 5px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #d4af37; color: #333; white-space: pre-wrap;">${data.challenge}</div>
    </div>
    
    <div style="margin-bottom: 20px;">
      <strong style="color: #1a1a1a;">90-Day Goal:</strong>
      <div style="margin: 5px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #d4af37; color: #333; white-space: pre-wrap;">${data.goal_90d}</div>
    </div>
    
    <div style="margin-bottom: 20px;">
      <strong style="color: #1a1a1a;">Available Resources:</strong>
      <div style="margin: 5px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #d4af37; color: #333;">
        ${data.resources.map(resource => `• ${resource}`).join('<br>')}
      </div>
    </div>
    
    ${data.other_resource ? `
    <div style="margin-bottom: 20px;">
      <strong style="color: #1a1a1a;">Other Resources:</strong>
      <div style="margin: 5px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #d4af37; color: #333; white-space: pre-wrap;">${data.other_resource}</div>
    </div>
    ` : ''}
    
    <h3 style="color: #1a1a1a; margin-top: 30px; font-size: 20px;">Contact Information</h3>
    
    <div style="margin-bottom: 15px;">
      <strong style="color: #1a1a1a;">Name:</strong>
      <p style="margin: 5px 0; color: #666;">${data.name}</p>
    </div>
    
    <div style="margin-bottom: 15px;">
      <strong style="color: #1a1a1a;">Email:</strong>
      <p style="margin: 5px 0; color: #666;">${data.email}</p>
    </div>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 14px;">
      <p>This simple plan request was submitted through the ALIRA website.</p>
      <p>Please follow up within 24 hours as promised on the website.</p>
    </div>
  </div>
</div>
`

// Email sending functions
export async function sendContactFormEmail(data: ContactFormData) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'contact@alirapartners.co.uk',
      to: [process.env.RESEND_FROM_EMAIL || 'contact@alirapartners.co.uk'],
      subject: `New Contact Form Submission from ${data.name}`,
      html: contactFormTemplate(data),
      reply_to: data.email,
    })

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('Error sending contact form email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function sendBusinessCaseFormEmail(data: BusinessCaseFormData) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'contact@alirapartners.co.uk',
      to: [process.env.RESEND_FROM_EMAIL || 'contact@alirapartners.co.uk'],
      subject: `New Business Case Request from ${data.businessName}`,
      html: businessCaseFormTemplate(data),
      reply_to: data.email,
    })

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('Error sending business case form email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function sendWizardFormEmail(data: WizardFormData) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'contact@alirapartners.co.uk',
      to: [process.env.RESEND_FROM_EMAIL || 'contact@alirapartners.co.uk'],
      subject: `New Simple Plan Request from ${data.name}`,
      html: wizardFormTemplate(data),
      reply_to: data.email,
    })

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('Error sending wizard form email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Auto-reply functions
export async function sendAutoReply(to: string, type: 'contact' | 'business-case' | 'wizard') {
  const templates = {
    contact: {
      subject: 'Thank you for contacting ALIRA',
      html: `
        <div style="font-family: 'Lato', Arial, sans-serif; font-weight: 300; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #1a1a1a; color: #ffffff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">ALIRA.</h1>
          </div>
          <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
            <h2 style="color: #1a1a1a;">Thank you for reaching out</h2>
            <p style="color: #666; line-height: 1.6;">We've received your message and will get back to you within 24 hours. We appreciate your interest in working with ALIRA.</p>
            <p style="color: #666; line-height: 1.6;">Best regards,<br>The ALIRA Team</p>
          </div>
        </div>
      `
    },
    'business-case': {
      subject: 'Your Business Case Request - ALIRA',
      html: `
        <div style="font-family: 'Lato', Arial, sans-serif; font-weight: 300; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #1a1a1a; color: #ffffff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">ALIRA.</h1>
          </div>
          <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
            <h2 style="color: #1a1a1a;">Business Case Request Received</h2>
            <p style="color: #666; line-height: 1.6;">Thank you for submitting your business case request. We're reviewing your information and will be in touch within 24 hours to discuss next steps.</p>
            <p style="color: #666; line-height: 1.6;">Best regards,<br>The ALIRA Team</p>
          </div>
        </div>
      `
    },
    wizard: {
      subject: 'Your Simple Plan Request - ALIRA',
      html: `
        <div style="font-family: 'Lato', Arial, sans-serif; font-weight: 300; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #1a1a1a; color: #ffffff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">ALIRA.</h1>
          </div>
          <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
            <h2 style="color: #1a1a1a;">Simple Plan Request Received</h2>
            <p style="color: #666; line-height: 1.6;">Thank you for submitting your simple plan request. We're reviewing your information and will be in touch within 24 hours to discuss next steps.</p>
            <p style="color: #666; line-height: 1.6;">Best regards,<br>The ALIRA Team</p>
          </div>
        </div>
      `
    }
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const template = templates[type]
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'contact@alirapartners.co.uk',
      to: [to],
      subject: template.subject,
      html: template.html,
    })

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('Error sending auto-reply:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
