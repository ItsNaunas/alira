import { NextRequest, NextResponse } from 'next/server'
import { sendPersonalPlanEmail } from '@/lib/enhanced-email'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  try {
    console.log('=== ENHANCED EMAIL TEST STARTED ===')
    
    // Check environment variables
    console.log('RESEND_API_KEY available:', !!env.RESEND_API_KEY)
    console.log('RESEND_API_KEY length:', env.RESEND_API_KEY?.length || 0)
    console.log('RESEND_FROM_EMAIL:', env.RESEND_FROM_EMAIL)
    
    if (!env.RESEND_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'RESEND_API_KEY is not configured',
          config: {
            hasApiKey: false,
            fromEmail: env.RESEND_FROM_EMAIL
          }
        },
        { status: 500 }
      )
    }

    // Test data
    const testPdfData = {
      name: 'Test User',
      email: 'test@example.com',
      business_idea: 'Test business idea for email testing',
      current_challenges: 'Test challenges for email testing',
      immediate_goals: 'Test goals for email testing',
      service_interest: ['brand_product', 'content_management'],
      current_tools: 'Test tools',
      generatedDate: new Date().toLocaleDateString('en-GB')
    }

    console.log('Test PDF data:', testPdfData)

    // Test sending enhanced email
    const emailResult = await sendPersonalPlanEmail({
      to: 'test@example.com',
      name: testPdfData.name,
      pdfData: testPdfData,
      mode: 'personal-plan'
    })
    
    console.log('Email result:', emailResult)

    if (!emailResult.success) {
      console.error('Enhanced email test failed:', emailResult.error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Enhanced email test failed', 
          details: emailResult.error,
          config: {
            hasApiKey: true,
            fromEmail: env.RESEND_FROM_EMAIL
          }
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Enhanced email test completed successfully',
      messageId: emailResult.messageId,
      pdfSize: emailResult.pdfSize,
      config: {
        hasApiKey: true,
        fromEmail: env.RESEND_FROM_EMAIL
      }
    })
    
  } catch (error) {
    console.error('Enhanced email test error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Enhanced email test failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        config: {
          hasApiKey: !!env.RESEND_API_KEY,
          fromEmail: env.RESEND_FROM_EMAIL
        }
      },
      { status: 500 }
    )
  }
}
