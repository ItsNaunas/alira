import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'

export async function GET(request: NextRequest) {
  try {
    console.log('[DEBUG_ENV] Checking environment variables')
    
    const envCheck = {
      // Required server-side variables
      RESEND_API_KEY: {
        present: !!env.RESEND_API_KEY,
        length: env.RESEND_API_KEY?.length || 0,
        startsWith: env.RESEND_API_KEY?.startsWith('re_') || false
      },
      RESEND_FROM_EMAIL: {
        present: !!env.RESEND_FROM_EMAIL,
        value: env.RESEND_FROM_EMAIL || null,
        isValid: env.RESEND_FROM_EMAIL?.includes('@') || false
      },
      OPENAI_API_KEY: {
        present: !!env.OPENAI_API_KEY,
        length: env.OPENAI_API_KEY?.length || 0,
        startsWith: env.OPENAI_API_KEY?.startsWith('sk-') || false
      },
      SUPABASE_URL: {
        present: !!env.SUPABASE_URL,
        isValid: env.SUPABASE_URL?.startsWith('http') || false
      },
      SUPABASE_ANON_KEY: {
        present: !!env.SUPABASE_ANON_KEY,
        length: env.SUPABASE_ANON_KEY?.length || 0
      },
      // Environment info
      NODE_ENV: env.NODE_ENV,
      timestamp: new Date().toISOString()
    }
    
    console.log('[DEBUG_ENV] Environment check completed:', envCheck)
    
    return NextResponse.json({
      success: true,
      environment: envCheck,
      message: 'Environment variables checked successfully'
    })
    
  } catch (error) {
    console.error('[DEBUG_ENV_ERROR]', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      raw: error
    })
    
    return NextResponse.json({
      success: false,
      error: 'Environment check failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}