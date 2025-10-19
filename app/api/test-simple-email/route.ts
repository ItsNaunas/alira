import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  try {
    console.log('=== SIMPLE EMAIL TEST STARTED ===')
    
    // Check environment variables
    console.log('RESEND_API_KEY available:', !!env.RESEND_API_KEY)
    console.log('RESEND_API_KEY length:', env.RESEND_API_KEY?.length || 0)
    
    if (!env.RESEND_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'RESEND_API_KEY is not configured'
        },
        { status: 500 }
      )
    }

    const resend = new Resend(env.RESEND_API_KEY)
    
    // Test simple email without attachment
    console.log('Sending simple test email...')
    
    const { data: result, error } = await resend.emails.send({
      from: 'contact@alirapartners.co.uk',
      to: ['test@example.com'], // Change this to your email for testing
      subject: 'Test Email from ALIRA',
      html: `
        <div style="font-family: 'General Sans', Arial, sans-serif; font-weight: 300; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0B1D51;">ALIRA. Test Email</h1>
          <p>This is a simple test email to verify Resend configuration.</p>
          <p>If you receive this, your email setup is working!</p>
        </div>
      `
    })

    if (error) {
      console.error('Simple email test failed:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Simple email test failed', 
          details: error
        },
        { status: 500 }
      )
    }

    console.log('Simple email sent successfully:', result)

    return NextResponse.json({
      success: true,
      message: 'Simple email test completed successfully',
      messageId: result?.id
    })
    
  } catch (error) {
    console.error('Simple email test error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Simple email test failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
