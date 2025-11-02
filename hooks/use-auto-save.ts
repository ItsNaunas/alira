'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-client'
import type { WizardFormData } from '@/lib/schema'

interface UseAutoSaveOptions {
  enabled: boolean
  userId?: string
  formData: Partial<WizardFormData>
  currentStep: number
  intervalMs?: number
  initialDashboardId?: string | null
  onSaveStart?: () => void
  onSaveComplete?: () => void
  onSaveError?: (error: Error) => void
}

interface AutoSaveState {
  isSaving: boolean
  lastSaved: Date | null
  error: Error | null
  dashboardId: string | null
}

/**
 * Auto-save hook for authenticated users
 * Saves form data to dashboards.form_data every intervalMs (default 30s)
 */
export function useAutoSave({
  enabled,
  userId,
  formData,
  currentStep,
  intervalMs = 30000, // 30 seconds default
  initialDashboardId,
  onSaveStart,
  onSaveComplete,
  onSaveError
}: UseAutoSaveOptions): AutoSaveState {
  const [state, setState] = useState<AutoSaveState>({
    isSaving: false,
    lastSaved: null,
    error: null,
    dashboardId: null
  })

  const dashboardIdRef = useRef<string | null>(initialDashboardId || null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  // Initialize dashboard ID from prop if provided
  useEffect(() => {
    if (initialDashboardId && initialDashboardId !== dashboardIdRef.current) {
      dashboardIdRef.current = initialDashboardId
      setState(prev => ({ ...prev, dashboardId: initialDashboardId }))
    }
  }, [initialDashboardId])

  // Find or create dashboard for user
  const findOrCreateDashboard = useCallback(async (): Promise<string | null> => {
    if (!userId || !enabled) return null

    try {
      const supabase = createClient()

      // First, try to find an existing draft dashboard
      const { data: existing, error: findError } = await supabase
        .from('dashboards')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'draft')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (findError && findError.code !== 'PGRST116') {
        console.error('Error finding dashboard:', findError)
        throw findError
      }

      // If we found a draft, use it
      if (existing?.id) {
        dashboardIdRef.current = existing.id
        setState(prev => ({ ...prev, dashboardId: existing.id }))
        return existing.id
      }

      // Otherwise, create a new draft dashboard
      const businessName = formData.business_idea?.substring(0, 100) || 'Untitled Business'
      
      const { data: newDashboard, error: createError } = await supabase
        .from('dashboards')
        .insert({
          user_id: userId,
          business_name: businessName,
          status: 'draft',
          form_data: {
            ...formData,
            currentStep
          }
        })
        .select('id')
        .single()

      if (createError) {
        console.error('Error creating dashboard:', createError)
        throw createError
      }

      if (newDashboard?.id) {
        dashboardIdRef.current = newDashboard.id
        setState(prev => ({ ...prev, dashboardId: newDashboard.id }))
        return newDashboard.id
      }

      return null
    } catch (error) {
      console.error('Error in findOrCreateDashboard:', error)
      setState(prev => ({ ...prev, error: error as Error }))
      if (onSaveError && error instanceof Error) {
        onSaveError(error)
      }
      return null
    }
  }, [userId, enabled, formData.business_idea, currentStep, onSaveError])

  // Save function
  const save = useCallback(async () => {
    if (!enabled || !userId || !isMountedRef.current) return

    const dashboardId = dashboardIdRef.current || await findOrCreateDashboard()
    if (!dashboardId) return

    setState(prev => ({ ...prev, isSaving: true, error: null }))
    onSaveStart?.()

    try {
      const supabase = createClient()
      const businessName = formData.business_idea?.substring(0, 100) || 'Untitled Business'

      const { error } = await supabase
        .from('dashboards')
        .update({
          business_name: businessName,
          current_challenges: formData.current_challenges || null,
          immediate_goals: formData.immediate_goals || null,
          service_interest: formData.service_interest || null,
          current_tools: formData.current_tools || null,
          business_stage: formData.business_stage || null,
          form_data: {
            ...formData,
            currentStep,
            lastSaved: new Date().toISOString()
          },
          status: 'draft',
          updated_at: new Date().toISOString()
        })
        .eq('id', dashboardId)
        .eq('user_id', userId) // Security: ensure user owns this dashboard

      if (error) {
        throw error
      }

      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          isSaving: false,
          lastSaved: new Date(),
          error: null
        }))
        onSaveComplete?.()
      }
    } catch (error) {
      console.error('Auto-save error:', error)
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          isSaving: false,
          error: error as Error
        }))
        if (onSaveError && error instanceof Error) {
          onSaveError(error)
        }
      }
    }
  }, [enabled, userId, formData, currentStep, findOrCreateDashboard, onSaveStart, onSaveComplete, onSaveError])

  // Set up interval
  useEffect(() => {
    if (!enabled || !userId) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      return
    }

    // Initial save after a short delay (don't save immediately on mount)
    timeoutRef.current = setTimeout(() => {
      save()
    }, 2000) // Wait 2 seconds after mount before first save

    // Set up recurring saves
    const intervalId = setInterval(() => {
      if (isMountedRef.current && enabled) {
        save()
      }
    }, intervalMs)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      clearInterval(intervalId)
    }
  }, [enabled, userId, intervalMs, save])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return state
}

