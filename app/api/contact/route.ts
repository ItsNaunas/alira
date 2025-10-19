/**
 * Contact Form API Route (Layer 2 Security)
 * 
 * This route follows the standardized 9-step security pattern:
 * 1. Type definitions
 * 2. Request handler
 * 3. Input validation
 * 4. Business logic
 * 5. Database operations
 * 6. Success response
 * 7. Error handling
 */

import { NextRequest } from 'next/server'
import { sendContactFormEmail, sendAutoReply } from '@/lib/email'
import { ContactFormSchema, validateOrThrow } from '@/lib/server/validation'
import { handleApiError, successResponse } from '@/lib/server/errors'

export async function POST(request: NextRequest) {
  try {
    // Step 1: Parse request body
    const body = await request.json()
    
    // Step 2: Validate input using Zod schema
    const validatedData = validateOrThrow(ContactFormSchema, body)
    
    // Step 3: Business Logic - Send email to ALIRA team
    const emailResult = await sendContactFormEmail({
      name: validatedData.name,
      email: validatedData.email,
      message: validatedData.message,
    })
    
    if (!emailResult.success) {
      console.error('Failed to send contact form email:', emailResult.error)
      throw new Error('Failed to send email')
    }
    
    // Step 4: Send auto-reply to the user (non-blocking)
    const autoReplyResult = await sendAutoReply(validatedData.email, 'contact')
    
    if (!autoReplyResult.success) {
      console.error('Failed to send auto-reply:', autoReplyResult.error)
      // Don't fail the request if auto-reply fails
    }
    
    // Step 5: Return success response
    return successResponse({
      message: 'Message sent successfully',
      emailId: emailResult.messageId
    })
    
  } catch (error) {
    // Step 6: Centralized error handling
    return handleApiError(error)
  }
}
