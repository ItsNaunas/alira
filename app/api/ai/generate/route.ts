/**
 * AI Generate Business Case API Route (Layer 2 Security)
 * 
 * Protected Route - Requires Authentication
 * 
 * Security Implementation:
 * 1. Authentication verification
 * 2. Input validation with Zod
 * 3. Rate limiting consideration
 * 4. Business logic execution
 * 5. Event tracking
 * 6. Success response
 * 7. Centralized error handling
 */

import { NextRequest } from 'next/server'
import { generateBusinessCase } from '@/lib/openai'
import { aiGenerateSchema } from '@/lib/schema'
import { db } from '@/lib/supabase-server'
import { requireUser } from '@/lib/server/auth'
import { handleApiError, successResponse, errors } from '@/lib/server/errors'
import { validateOrThrow } from '@/lib/server/validation'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Step 1: Authenticate user (Layer 2 security)
    const user = await requireUser();
    
    // Step 2: Rate limiting - 10 AI generations per minute per user
    await checkRateLimit(user.id, 'ai-generate', 10, 60000);
    
    // Step 3: Parse and validate request body
    const body = await request.json()
    
    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log("=== AI GENERATE API DEBUG ===")
      console.log("User ID:", user.id)
      console.log("Received body:", JSON.stringify(body, null, 2))
      console.log("OPENAI API KEY present:", !!process.env.OPENAI_API_KEY)
    }
    
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
    
    // Step 3: Validate input
    const validatedData = validateOrThrow(aiGenerateSchema, sanitizedBody)
    
    // Step 4: Check OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      throw errors.internal('OpenAI API key is not configured');
    }
    
    // Step 5: Generate business case using OpenAI
    if (process.env.NODE_ENV === 'development') {
      console.log("Calling OpenAI with validated data...")
    }
    
    const outline = await generateBusinessCase(validatedData)
    
    if (process.env.NODE_ENV === 'development') {
      console.log("OpenAI response received successfully")
    }
    
    // Step 6: Track the generation event (with user context)
    await db.trackEvent('ai_business_case_generated', {
      userId: user.id,
      businessName: validatedData.businessName,
      industry: validatedData.industry,
      service: validatedData.service
    })
    
    // Step 7: Return success response
    return successResponse({
      outline
    })
    
  } catch (error) {
    // Step 8: Centralized error handling (never leaks sensitive data)
    return handleApiError(error)
  }
}
