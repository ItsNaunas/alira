/**
 * Plan Versions API Route (Layer 2 Security)
 * 
 * Protected Route - Requires Authentication
 * 
 * Manages plan version history and restoration
 */

import { NextRequest } from 'next/server'
import { requireUser, getServiceClient } from '@/lib/server/auth'
import { handleApiError, successResponse, errors } from '@/lib/server/errors'
import { VersionRestoreSchema, validateOrThrow } from '@/lib/server/validation'

// GET: List all versions for a plan
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

    // Step 4: Get all versions
    const { data: versions, error: versionsError } = await supabase
      .from('plan_versions')
      .select('*')
      .eq('dashboard_id', planId)
      .order('version_number', { ascending: false })

    if (versionsError) {
      throw errors.internal('Failed to fetch versions')
    }

    // Step 5: Return versions
    return successResponse({
      versions: versions || [],
      count: versions?.length || 0
    })

  } catch (error) {
    return handleApiError(error)
  }
}

// POST: Restore a specific version
export async function POST(request: NextRequest) {
  try {
    // Step 1: Authenticate user
    const user = await requireUser()
    
    // Step 2: Parse and validate input
    const body = await request.json()
    const validatedData = validateOrThrow(VersionRestoreSchema, body)
    
    const { planId, versionId } = validatedData

    // Step 3: Verify plan ownership
    const supabase = getServiceClient()
    
    const { data: dashboard, error: dashboardError } = await supabase
      .from('dashboards')
      .select(`
        *,
        generations (
          id,
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
      throw errors.badRequest('Plan has no generations')
    }

    // Step 4: Get the version to restore
    const { data: versionToRestore, error: versionError } = await supabase
      .from('plan_versions')
      .select('*')
      .eq('id', versionId)
      .eq('dashboard_id', planId)
      .eq('user_id', user.id)
      .single()

    if (versionError || !versionToRestore) {
      throw errors.notFound('Version not found')
    }

    // Step 5: Update the generation with restored content
    const currentGeneration = dashboard.generations[0]
    const currentVersion = currentGeneration.version_number || 1

    const { error: updateError } = await supabase
      .from('generations')
      .update({
        content: versionToRestore.content,
        version_number: currentVersion + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', currentGeneration.id)

    if (updateError) {
      console.error('Failed to restore version:', updateError)
      throw errors.internal('Failed to restore version')
    }

    // Step 6: Create a new version entry for this restoration
    const { data: latestVersion } = await supabase
      .from('plan_versions')
      .select('version_number')
      .eq('dashboard_id', planId)
      .order('version_number', { ascending: false })
      .limit(1)
      .single()

    const nextVersionNumber = latestVersion ? latestVersion.version_number + 1 : 1

    const { error: newVersionError } = await supabase
      .from('plan_versions')
      .insert({
        dashboard_id: planId,
        generation_id: currentGeneration.id,
        version_number: nextVersionNumber,
        content: versionToRestore.content,
        changes_summary: `Restored from version ${versionToRestore.version_number}`,
        parent_version_id: versionId,
        user_id: user.id,
        created_by: user.id
      })

    if (newVersionError) {
      console.error('Failed to create new version:', newVersionError)
      // Don't fail the request if version creation fails
    }

    // Step 7: Update dashboard timestamp
    await supabase
      .from('dashboards')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('id', planId)

    // Step 8: Return success
    return successResponse({
      message: 'Version restored successfully',
      restoredVersion: versionToRestore.version_number,
      newVersion: nextVersionNumber,
      planId
    })

  } catch (error) {
    return handleApiError(error)
  }
}

