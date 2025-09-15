import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('=== ENVIRONMENT DEBUG ===')
    
    // Direct access to process.env
    const directApiKey = process.env.RESEND_API_KEY
    const directFromEmail = process.env.RESEND_FROM_EMAIL
    
    console.log('Direct RESEND_API_KEY:', !!directApiKey, directApiKey?.length || 0)
    console.log('Direct RESEND_FROM_EMAIL:', directFromEmail)
    
    // Test the env system
    let envApiKey, envFromEmail, envError
    try {
      const { env } = await import('@/lib/env')
      envApiKey = env.RESEND_API_KEY
      envFromEmail = env.RESEND_FROM_EMAIL
      console.log('Env system RESEND_API_KEY:', !!envApiKey, envApiKey?.length || 0)
      console.log('Env system RESEND_FROM_EMAIL:', envFromEmail)
    } catch (error) {
      envError = error instanceof Error ? error.message : 'Unknown error'
      console.error('Env system error:', envError)
    }
    
    // Test Resend import
    let resendError
    try {
      const { Resend } = await import('resend')
      console.log('Resend import successful')
    } catch (error) {
      resendError = error instanceof Error ? error.message : 'Unknown error'
      console.error('Resend import error:', resendError)
    }
    
    return NextResponse.json({
      success: true,
      direct: {
        hasApiKey: !!directApiKey,
        apiKeyLength: directApiKey?.length || 0,
        fromEmail: directFromEmail
      },
      env: {
        hasApiKey: !!envApiKey,
        apiKeyLength: envApiKey?.length || 0,
        fromEmail: envFromEmail,
        error: envError
      },
      imports: {
        resendError: resendError
      }
    })
    
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
