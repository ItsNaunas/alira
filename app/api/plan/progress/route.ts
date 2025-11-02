/**
 * Plan Progress API Route
 * 
 * Protected Route - Requires Authentication
 * 
 * Manages completion tracking for objectives and next steps
 */

import { NextRequest } from 'next/server'
import { requireUser, getServiceClient } from '@/lib/server/auth'
import { handleApiError, successResponse, errors } from '@/lib/server/errors'
import { z } from 'zod'
import { validateOrThrow } from '@/lib/server/validation'

const ToggleProgressSchema = z.object({
  planId: z.string().uuid('Invalid plan ID'),
  itemType: z.enum(['objective', 'next_step']),
  itemIndex: z.number().int().min(0),
  completed: z.boolean()
})

const GetProgressSchema = z.object({
  planId: z.string().uuid('Invalid plan ID')
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser()
    const supabase = getServiceClient()
    const { searchParams } = new URL(request.url)
    const planId = searchParams.get('planId')

    if (!planId) {
      throw errors.badRequest('planId is required')
    }

    // Validate planId
    validateOrThrow(GetProgressSchema, { planId })

    // Verify plan ownership
    const { data: dashboard, error: dashboardError } = await supabase
      .from('dashboards')
      .select('id, user_id')
      .eq('id', planId)
      .eq('user_id', user.id)
      .single()

    if (dashboardError || !dashboard) {
      throw errors.notFound('Plan not found or access denied')
    }

    // Fetch all progress entries for this plan
    const { data: progress, error: progressError } = await supabase
      .from('plan_progress')
      .select('*')
      .eq('dashboard_id', planId)
      .eq('user_id', user.id)

    if (progressError) {
      throw errors.internal('Failed to fetch progress')
    }

    // Transform to a more convenient format: { objective: { 0: true, 1: false }, next_step: { 0: true } }
    const progressMap: Record<string, Record<number, boolean>> = {
      objective: {},
      next_step: {}
    }

    progress?.forEach((item: { item_type: string; item_index: number; completed: boolean }) => {
      if (!progressMap[item.item_type]) {
        progressMap[item.item_type] = {}
      }
      progressMap[item.item_type][item.item_index] = item.completed
    })

    return successResponse({ progress: progressMap })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()
    const body = await request.json()
    const { planId, itemType, itemIndex, completed } = validateOrThrow(ToggleProgressSchema, body)

    const supabase = getServiceClient()

    // Verify plan ownership
    const { data: dashboard, error: dashboardError } = await supabase
      .from('dashboards')
      .select('id, user_id')
      .eq('id', planId)
      .eq('user_id', user.id)
      .single()

    if (dashboardError || !dashboard) {
      throw errors.notFound('Plan not found or access denied')
    }

    // Upsert progress entry
    const { data, error } = await supabase
      .from('plan_progress')
      .upsert({
        dashboard_id: planId,
        item_type: itemType,
        item_index: itemIndex,
        completed: completed,
        completed_at: completed ? new Date().toISOString() : null,
        user_id: user.id
      }, {
        onConflict: 'dashboard_id,item_type,item_index,user_id'
      })
      .select()
      .single()

    if (error) {
      throw errors.internal('Failed to update progress')
    }

    return successResponse({ progress: data })
  } catch (error) {
    return handleApiError(error)
  }
}

