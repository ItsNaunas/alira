import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireUser, getServiceClient } from '@/lib/server/auth'
import { handleApiError, successResponse, errors } from '@/lib/server/errors'
import { validateOrThrow } from '@/lib/server/validation'

const UpdateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
  sortOrder: z.number().int().optional()
})

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser()
    const body = await request.json()
    const { title, completed, sortOrder } = validateOrThrow(UpdateTaskSchema, body)

    const supabase = getServiceClient()

    const updates: any = {}
    if (typeof title === 'string') updates.title = title
    if (typeof completed === 'boolean') updates.completed = completed
    if (typeof sortOrder === 'number') updates.sort_order = sortOrder

    const { data, error } = await supabase
      .from('dashboard_tasks')
      .update(updates)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select('*')
      .single()

    if (error) throw errors.internal('Failed to update task')

    return successResponse({ task: data })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser()
    const supabase = getServiceClient()

    const { error } = await supabase
      .from('dashboard_tasks')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) throw errors.internal('Failed to delete task')

    return successResponse({ id: params.id })
  } catch (error) {
    return handleApiError(error)
  }
}


