import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireUser, getServiceClient } from '@/lib/server/auth'
import { handleApiError, successResponse, errors } from '@/lib/server/errors'
import { validateOrThrow } from '@/lib/server/validation'

const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  planId: z.string().uuid().optional(),
  sortOrder: z.number().int().optional()
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser()
    const supabase = getServiceClient()

    const { searchParams } = new URL(request.url)
    const planId = searchParams.get('planId')

    let query = supabase
      .from('dashboard_tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (planId) query = query.eq('plan_id', planId)

    const { data, error } = await query
    if (error) throw errors.internal('Failed to load tasks')

    return successResponse({ tasks: data })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()
    const body = await request.json()
    const { title, planId, sortOrder } = validateOrThrow(CreateTaskSchema, body)

    const supabase = getServiceClient()
    const insert = {
      title,
      plan_id: planId || null,
      user_id: user.id,
      sort_order: typeof sortOrder === 'number' ? sortOrder : 0
    }

    const { data, error } = await supabase
      .from('dashboard_tasks')
      .insert(insert)
      .select('*')
      .single()

    if (error) throw errors.internal('Failed to create task')

    return successResponse({ task: data })
  } catch (error) {
    return handleApiError(error)
  }
}


