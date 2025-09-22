import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { env } from '@/lib/env'

export async function GET() {
  try {
    console.log('=== RESEND CONFIGURATION CHECK ===')
    
    // Check environment variables
    const hasApiKey = !!env.RESEND_API_KEY
    const apiKeyLength = env.RESEND_API_KEY?.length || 0
    const fromEmail = env.RESEND_FROM_EMAIL
    
    console.log('RESEND_API_KEY available:', hasApiKey)
    console.log('RESEND_API_KEY length:', apiKeyLength)
    console.log('RESEND_FROM_EMAIL:', fromEmail)
    
    if (!hasApiKey) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY is not configured',
        config: {
          hasApiKey: false,
          fromEmail: fromEmail
        }
      })
    }

    // Test Resend API connection
    const resend = new Resend(env.RESEND_API_KEY)
    
    try {
      // Try to get domains (this will tell us if the API key is valid)
      const domains = await resend.domains.list()
      
      return NextResponse.json({
        success: true,
        message: 'Resend configuration is valid',
        config: {
          hasApiKey: true,
          fromEmail: fromEmail,
          domains: Array.isArray(domains.data) 
            ? domains.data.map(d => ({
                name: d.name,
                status: d.status,
                region: d.region
              }))
            : []
        }
      })
    } catch (apiError: any) {
      console.error('Resend API error:', apiError)
      
      return NextResponse.json({
        success: false,
        error: 'Resend API connection failed',
        details: apiError.message || 'Unknown API error',
        config: {
          hasApiKey: true,
          fromEmail: fromEmail
        }
      })
    }
    
  } catch (error) {
    console.error('Configuration check error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Configuration check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
