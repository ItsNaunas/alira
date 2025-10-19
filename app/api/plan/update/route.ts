/**
 * Plan Update API Route (Layer 2 Security)
 * 
 * Protected Route - Requires Authentication
 * 
 * Updates business plan content and creates version history
 */

import { NextRequest } from 'next/server'
import { requireUser, getServiceClient } from '@/lib/server/auth'
import { handleApiError, successResponse, errors } from '@/lib/server/errors'
import { UpdatePlanSchema, validateOrThrow } from '@/lib/server/validation'

export async function POST(request: NextRequest) {
  try {
    // Step 1: Authenticate user
    const user = await requireUser()
    
    // Step 2: Parse and validate input
    const body = await request.json()
    const validatedData = validateOrThrow(UpdatePlanSchema, body)
    
    const { planId, content, changesSummary, createVersion } = validatedData

    // Step 3: Verify plan ownership
    const supabase = getServiceClient()
    
    const { data: dashboard, error: dashboardError } = await supabase
      .from('dashboards')
      .select(`
        *,
        generations (
          id,
          content,
          version_number
        )
      `)
      .eq('id', planId)
      .eq('user_id', user.id)
      .single()

    if (dashboardError || !dashboard) {
      throw errors.notFound('Plan not found or access denied')
    }

    if (!dashboard.generations || dashboard.generations.length === 0) {
      throw errors.badRequest('Plan has no content to update')
    }

    const currentGeneration = dashboard.generations[0]
    const currentVersion = currentGeneration.version_number || 1

    // Step 4: Update the generation content
    const { error: updateError } = await supabase
      .from('generations')
      .update({
        content,
        version_number: currentVersion + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', currentGeneration.id)

    if (updateError) {
      console.error('Failed to update generation:', updateError)
      throw errors.internal('Failed to update plan content')
    }

    // Step 5: Create version history if requested
    if (createVersion) {
      // Get the most recent version number
      const { data: latestVersion } = await supabase
        .from('plan_versions')
        .select('version_number')
        .eq('dashboard_id', planId)
        .order('version_number', { ascending: false })
        .limit(1)
        .single()

      const nextVersionNumber = latestVersion ? latestVersion.version_number + 1 : 1

      const { error: versionError } = await supabase
        .from('plan_versions')
        .insert({
          dashboard_id: planId,
          generation_id: currentGeneration.id,
          version_number: nextVersionNumber,
          content,
          changes_summary: changesSummary,
          user_id: user.id,
          created_by: user.id
        })

      if (versionError) {
        console.error('Failed to create version:', versionError)
        // Don't fail the request if version creation fails
      }
    }

    // Step 6: Update dashboard timestamp
    await supabase
      .from('dashboards')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('id', planId)

    // Step 7: Return success
    return successResponse({
      message: 'Plan updated successfully',
      version: currentVersion + 1,
      planId
    })

  } catch (error) {
    return handleApiError(error)
  }
}

