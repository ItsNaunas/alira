'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient, auth } from '@/lib/supabase-client'
import { PlanDetail, BusinessCaseOutline } from '@/lib/schema'
import DashboardLayout from '@/components/DashboardLayout'
import PlanHeader from '@/components/PlanHeader'
import PlanEditor from '@/components/PlanEditor'
import VersionHistory from '@/components/VersionHistory'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertCircle, History, X } from 'lucide-react'

export default function EditPlanPage() {
  const router = useRouter()
  const params = useParams()
  const planId = params.planId as string

  const [user, setUser] = useState<any>(null)
  const [plan, setPlan] = useState<PlanDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState<BusinessCaseOutline | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)

  const checkUser = useCallback(async () => {
    const { user, error } = await auth.getUser()
    if (error || !user) {
      router.push('/dashboard')
      return null
    }
    setUser(user)
    return user
  }, [router])

  const loadPlan = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()
      
      const { data: planData, error: planError } = await supabase
        .from('dashboards')
        .select(`
          *,
          generations (
            id,
            type,
            content,
            version_number,
            created_at
          )
        `)
        .eq('id', planId)
        .single()

      if (planError || !planData) {
        setError('Failed to load plan')
        return
      }

      const planDetail: PlanDetail = {
        id: planData.id,
        business_name: planData.business_name || 'Business Plan',
        current_challenges: planData.current_challenges,
        immediate_goals: planData.immediate_goals,
        service_interest: planData.service_interest,
        form_data: planData.form_data,
        pdf_url: planData.pdf_url,
        status: planData.status,
        created_at: planData.created_at,
        updated_at: planData.updated_at,
        user_id: planData.user_id,
        generation: planData.generations?.[0] ? {
          id: planData.generations[0].id,
          type: planData.generations[0].type,
          content: planData.generations[0].content,
          version: planData.generations[0].version_number || 1,
          created_at: planData.generations[0].created_at,
        } : undefined,
      }

      setPlan(planDetail)
      if (planDetail.generation?.content) {
        setEditedContent(planDetail.generation.content)
      }
    } catch (err) {
      console.error('Error in loadPlan:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }, [planId])

  useEffect(() => {
    checkUser().then(user => {
      if (user) {
        loadPlan()
      }
    })
  }, [checkUser, loadPlan])

  useEffect(() => {
    // Warn user before leaving with unsaved changes
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const handleContentChange = (newContent: BusinessCaseOutline) => {
    setEditedContent(newContent)
    setHasUnsavedChanges(true)
  }

  const handleSave = async () => {
    if (!editedContent || !plan) return

    const changesSummary = window.prompt(
      'Describe what you changed (this will be saved in version history):',
      'Manual edits to plan content'
    )

    if (!changesSummary) return

    try {
      setIsSaving(true)

      const response = await fetch('/api/plan/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          content: editedContent,
          changesSummary,
          createVersion: true
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save changes')
      }

      setHasUnsavedChanges(false)
      alert('Changes saved successfully!')
      
      // Reload plan to get updated version
      await loadPlan()
    } catch (error) {
      console.error('Failed to save changes:', error)
      alert('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRestoreVersion = async () => {
    // Reload the plan after version restore
    await loadPlan()
    alert('Version restored successfully!')
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      )
      if (!confirmed) return
    }
    router.push(`/dashboard/${planId}`)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-alira-gold animate-spin mx-auto mb-4" />
            <p className="text-alira-white/60">Loading plan...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !plan || !editedContent) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="bg-white/[0.02] border-white/10 max-w-md">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-serif text-alira-white mb-2">
                Unable to Load Plan
              </h2>
              <p className="text-alira-white/60 mb-6">
                This plan has no content to edit yet.
              </p>
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-alira-gold hover:bg-alira-gold/90 text-alira-black"
              >
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-4 md:px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-serif font-normal text-alira-white">
                  Edit Plan
                </h1>
                <p className="text-sm text-alira-white/60 mt-1">
                  {plan.business_name}
                  {hasUnsavedChanges && (
                    <span className="ml-2 text-yellow-400">• Unsaved changes</span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowVersionHistory(!showVersionHistory)}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-alira-white hover:bg-white/5"
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-alira-white hover:bg-white/5"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-4 md:p-6">
              <PlanEditor
                content={editedContent}
                onChange={handleContentChange}
                onSave={handleSave}
                isSaving={isSaving}
              />
            </div>
          </div>

          {/* Version History Sidebar */}
          {showVersionHistory && (
            <div className="w-full md:w-96 border-l border-white/10 bg-alira-primary/50 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-serif text-alira-white">Version History</h3>
                  <Button
                    onClick={() => setShowVersionHistory(false)}
                    variant="ghost"
                    size="sm"
                    className="text-alira-white/60 hover:text-alira-white md:hidden"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <VersionHistory
                  planId={planId}
                  currentVersion={plan.generation?.version}
                  onRestoreVersion={handleRestoreVersion}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Version History Toggle */}
        {!showVersionHistory && (
          <div className="fixed bottom-4 right-4 md:hidden z-20">
            <Button
              onClick={() => setShowVersionHistory(true)}
              className="bg-alira-gold hover:bg-alira-gold/90 text-alira-black shadow-2xl"
            >
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

