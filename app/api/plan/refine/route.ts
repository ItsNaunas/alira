/**
 * Plan Refinement API Route (Layer 2 Security)
 * 
 * Protected Route - Requires Authentication
 * 
 * Enables iterative improvement of business plans through AI-powered refinement
 */

import { NextRequest } from 'next/server'
import { requireUser, getServiceClient } from '@/lib/server/auth'
import { handleApiError, successResponse, errors } from '@/lib/server/errors'
import { refineBusinessPlan } from '@/lib/openai-refine'
import { z } from 'zod'

// Request validation schema
const RefineRequestSchema = z.object({
  planId: z.string().uuid(),
  message: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
  focusSection: z.string().optional(),
  includeHistory: z.boolean().default(true)
})

export async function POST(request: NextRequest) {
  try {
    // Step 1: Authenticate user
    const user = await requireUser()
    
    // Step 2: Parse and validate input
    const body = await request.json()
    const validatedData = RefineRequestSchema.parse(body)
    
    const { planId, message, focusSection, includeHistory } = validatedData

    // Step 3: Get plan and verify ownership
    const supabase = getServiceClient()
    
    const { data: dashboard, error: dashboardError } = await supabase
      .from('dashboards')
      .select(`
        *,
        generations (
          id,
          type,
          content,
          created_at
        )
      `)
      .eq('id', planId)
      .eq('user_id', user.id)
      .single()

    if (dashboardError || !dashboard) {
      throw errors.notFound('Plan not found or access denied')
    }

    if (!dashboard.generations || dashboard.generations.length === 0) {
      throw errors.badRequest('Plan has no content to refine')
    }

    const currentContent = dashboard.generations[0].content

    // Step 4: Get conversation history if requested
    let conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
    
    if (includeHistory) {
      const { data: chatHistory } = await supabase
        .from('plan_refinement_chats')
        .select('message_type, content')
        .eq('dashboard_id', planId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(10) // Last 10 messages for context

      if (chatHistory) {
        conversationHistory = chatHistory.map((msg: any) => ({
          role: msg.message_type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      }
    }

    // Step 5: Call AI refinement
    const refinementResult = await refineBusinessPlan({
      currentContent,
      userMessage: message,
      focusSection,
      conversationHistory
    })

    // Step 6: Save user message to chat history
    await supabase
      .from('plan_refinement_chats')
      .insert({
        dashboard_id: planId,
        message_type: 'user',
        content: message,
        user_id: user.id
      })

    // Step 7: Save assistant response with suggestions
    await supabase
      .from('plan_refinement_chats')
      .insert({
        dashboard_id: planId,
        message_type: 'assistant',
        content: refinementResult.changes_summary,
        suggested_changes: refinementResult.refined_content,
        applied: false,
        user_id: user.id
      })

    // Step 8: Return refinement suggestions
    return successResponse({
      refined_content: refinementResult.refined_content,
      changes_summary: refinementResult.changes_summary,
      affected_sections: refinementResult.affected_sections,
      current_content: currentContent
    })

  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return handleApiError(
        errors.badRequest('Invalid request: ' + error.errors.map(e => e.message).join(', '))
      )
    }
    
    return handleApiError(error)
  }
}

// Get refinement chat history
export async function GET(request: NextRequest) {
  try {
    // Step 1: Authenticate user
    const user = await requireUser()
    
    // Step 2: Get plan ID from query params
    const { searchParams } = new URL(request.url)
    const planId = searchParams.get('planId')
    
    if (!planId) {
      throw errors.badRequest('planId is required')
    }

    // Step 3: Verify plan ownership
    const supabase = getServiceClient()
    
    const { data: dashboard, error: dashboardError } = await supabase
      .from('dashboards')
      .select('id')
      .eq('id', planId)
      .eq('user_id', user.id)
      .single()

    if (dashboardError || !dashboard) {
      throw errors.notFound('Plan not found or access denied')
    }

    // Step 4: Get chat history
    const { data: chatHistory, error: chatError } = await supabase
      .from('plan_refinement_chats')
      .select('*')
      .eq('dashboard_id', planId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (chatError) {
      throw errors.internal('Failed to fetch chat history')
    }

    return successResponse({
      messages: chatHistory || []
    })

  } catch (error) {
    return handleApiError(error)
  }
}

