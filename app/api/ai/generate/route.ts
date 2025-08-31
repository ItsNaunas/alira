import { NextRequest, NextResponse } from 'next/server'
import { generateBusinessCase } from '@/lib/openai'
import { aiGenerateSchema } from '@/lib/schema'
import { db } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    
    // Debug logging
    console.log("=== AI GENERATE API DEBUG ===")
    console.log("Received body:", JSON.stringify(body, null, 2))
    console.log("OPENAI API KEY present:", !!process.env.OPENAI_API_KEY)
    console.log("OPENAI API KEY length:", process.env.OPENAI_API_KEY?.length || 0)
    
    // Ensure all optional fields have default values
    const sanitizedBody = {
      businessName: body.businessName || '',
      industry: body.industry || '',
      stage: body.stage || '',
      challenges: body.challenges || '',
      goalsShort: body.goalsShort || '',
      goalsLong: body.goalsLong || '',
      resources: body.resources || '',
      budget: body.budget || '',
      timeline: body.timeline || '',
      service: body.service || '',
      notes: body.notes || ''
    }
    
    console.log("Sanitized body:", JSON.stringify(sanitizedBody, null, 2))
    
    const validatedData = aiGenerateSchema.parse(sanitizedBody)
    
    // Generate business case using OpenAI
    console.log("Calling OpenAI with validated data...")
    const outline = await generateBusinessCase(validatedData)
    console.log("OpenAI response received successfully")
    
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
