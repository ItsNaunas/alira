import { NextRequest, NextResponse } from 'next/server'
import { sendContactFormEmail, sendAutoReply } from '@/lib/email'
import { z } from 'zod'

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the form data
    const validatedData = contactFormSchema.parse(body)
    
    // Send email to ALIRA team
    const emailResult = await sendContactFormEmail(validatedData)
    
    if (!emailResult.success) {
      console.error('Failed to send contact form email:', emailResult.error)
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      )
    }
    
    // Send auto-reply to the user
    const autoReplyResult = await sendAutoReply(validatedData.email, 'contact')
    
    if (!autoReplyResult.success) {
      console.error('Failed to send auto-reply:', autoReplyResult.error)
      // Don't fail the request if auto-reply fails
    }
    
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      emailId: emailResult.messageId
    })
    
  } catch (error) {
    console.error('Contact form error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
