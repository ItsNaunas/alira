import { NextRequest, NextResponse } from 'next/server'
import { sendContactFormEmail, sendAutoReply } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    // Test data
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message to verify email functionality.'
    }

    console.log('Testing email functionality...')
    console.log('RESEND_API_KEY present:', !!process.env.RESEND_API_KEY)
    console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL)

    // Test sending contact form email
    const emailResult = await sendContactFormEmail(testData)
    
    if (!emailResult.success) {
      console.error('Email test failed:', emailResult.error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email test failed', 
          details: emailResult.error 
        },
        { status: 500 }
      )
    }

    // Test sending auto-reply
    const autoReplyResult = await sendAutoReply(testData.email, 'contact')
    
    return NextResponse.json({
      success: true,
      message: 'Email test completed successfully',
      emailId: emailResult.messageId,
      autoReplyId: autoReplyResult.messageId,
      config: {
        fromEmail: process.env.RESEND_FROM_EMAIL,
        hasApiKey: !!process.env.RESEND_API_KEY
      }
    })
    
  } catch (error) {
    console.error('Email test error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Email test failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
