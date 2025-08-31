import { NextRequest, NextResponse } from 'next/server'
import { generateBusinessCase } from '@/lib/openai'
import { aiGenerateSchema } from '@/lib/schema'
import { db } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = aiGenerateSchema.parse(body)
    
    // Generate business case using OpenAI
    const outline = await generateBusinessCase(validatedData)
    
    // Track the generation event
    await db.trackEvent('ai_business_case_generated', {
      businessName: validatedData.businessName,
      industry: validatedData.industry,
      service: validatedData.service
    })
    
    return NextResponse.json({
      success: true,
      outline
    })
    
  } catch (error) {
    console.error('AI Generation error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate business case' 
      },
      { status: 500 }
    )
  }
}
