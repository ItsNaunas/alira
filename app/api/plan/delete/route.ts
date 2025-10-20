/**
 * Plan Delete API Route (Layer 2 Security)
 * 
 * Protected Route - Requires Authentication
 * 
 * Deletes a plan and all related data (generations, versions, chat history)
 */

import { NextRequest } from 'next/server'
import { requireUser, getServiceClient } from '@/lib/server/auth'
import { handleApiError, successResponse, errors } from '@/lib/server/errors'
import { z } from 'zod'
import { validateOrThrow } from '@/lib/server/validation'

const DeletePlanSchema = z.object({
  planId: z.string().uuid('Invalid plan ID')
})

export async function DELETE(request: NextRequest) {
  try {
    // Step 1: Authenticate user
    const user = await requireUser()
    
    // Step 2: Parse and validate input
    const body = await request.json()
    const { planId } = validateOrThrow(DeletePlanSchema, body)

    // Step 3: Verify plan ownership
    const supabase = getServiceClient()
    
    const { data: dashboard, error: dashboardError } = await supabase
      .from('dashboards')
      .select('id, business_name, pdf_url, user_id')
      .eq('id', planId)
      .eq('user_id', user.id)
      .single()

    if (dashboardError || !dashboard) {
      throw errors.notFound('Plan not found or access denied')
    }

    // Step 4: Delete PDF from storage if it exists
    if (dashboard.pdf_url) {
      try {
        // Extract file path from URL
        const url = new URL(dashboard.pdf_url)
        const pathParts = url.pathname.split('/')
        const bucketIndex = pathParts.findIndex(part => part === 'pdfs')
        
        if (bucketIndex !== -1) {
          const filePath = pathParts.slice(bucketIndex + 1).join('/')
          
          const { error: storageError } = await supabase.storage
            .from('pdfs')
            .remove([filePath])

          if (storageError) {
            console.error('Failed to delete PDF from storage:', storageError)
            // Don't fail the request if PDF deletion fails
          }
        }
      } catch (error) {
        console.error('Error parsing PDF URL:', error)
        // Continue with plan deletion
      }
    }

    // Step 5: Delete generations
    // Note: This should cascade delete from dashboard, but we'll do it explicitly
    await supabase
      .from('generations')
      .delete()
      .eq('dashboard_id', planId)

    // Step 8: Delete the dashboard itself
    const { error: deleteError } = await supabase
      .from('dashboards')
      .delete()
      .eq('id', planId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Failed to delete dashboard:', deleteError)
      throw errors.internal('Failed to delete plan')
    }

    // Step 9: Return success
    return successResponse({
      message: 'Plan deleted successfully',
      planId,
      planName: dashboard.business_name
    })

  } catch (error) {
    return handleApiError(error)
  }
}

