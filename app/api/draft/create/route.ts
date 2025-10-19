/**
 * Create Draft API Route (Layer 2 Security)
 * 
 * Protected Route - Requires Authentication
 * 
 * Security Implementation:
 * 1. Authentication verification
 * 2. Input validation with Zod
 * 3. Database operations with user context
 * 4. Secure token generation
 * 5. Conflict handling
 * 6. Centralized error handling
 */

import { NextRequest } from 'next/server'
import { CreateDraftSchema, validateOrThrow } from '@/lib/server/validation'
import { requireUser, getServiceClient } from '@/lib/server/auth'
import { handleApiError, successResponse, errors } from '@/lib/server/errors'

export async function POST(request: NextRequest) {
  try {
    // Step 1: Authenticate user (Layer 2 security)
    const user = await requireUser();
    
    // Step 2: Parse and validate input
    const body = await request.json()
    const validatedData = validateOrThrow(CreateDraftSchema, body)

    // Step 3: Generate secure unique resume token
    const resume_token = crypto.randomUUID()

    // Step 4: Create draft record with user ownership
    const supabase = getServiceClient()
    const { data: draft, error } = await supabase
      .from('intake_forms')
      .insert({
        user_id: user.id, // Associate with authenticated user
        data: validatedData.formData,
        resume_token,
        status: 'draft',
        step: validatedData.metadata?.version ? parseInt(validatedData.metadata.version) : 1
      })
      .select()
      .single()

    if (error) {
      console.error('Database error creating draft:', error)
      
      // Handle specific database errors
      if (error.code === '23505') { // Unique constraint violation
        throw errors.conflict('A draft for this session already exists');
      }
      
      throw errors.internal('Failed to create draft');
    }

    if (!draft) {
      throw errors.internal('Draft was not created successfully');
    }

    // Step 5: Return success response
    return successResponse({
      id: draft.id,
      resume_token: draft.resume_token
    }, 201)
    
  } catch (error) {
    // Step 6: Centralized error handling
    return handleApiError(error)
  }
}
