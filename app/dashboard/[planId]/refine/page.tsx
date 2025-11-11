'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient, auth } from '@/lib/supabase-client'
import { PlanDetail, BusinessCaseOutline } from '@/lib/schema'
import DashboardLayout from '@/components/DashboardLayout'
import PlanHeader from '@/components/PlanHeader'
import PlanViewer from '@/components/PlanViewer'
import RefinementChat from '@/components/RefinementChat'
import PlanDiffViewer from '@/components/PlanDiffViewer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertCircle, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

export default function RefinePlanPage() {
  const router = useRouter()
  const params = useParams()
  const planId = params.planId as string

  const [user, setUser] = useState<any>(null)
  const [plan, setPlan] = useState<PlanDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentContent, setCurrentContent] = useState<BusinessCaseOutline | null>(null)
  const [pendingSuggestion, setPendingSuggestion] = useState<{
    content: Partial<BusinessCaseOutline>
    sections: string[]
    summary?: string
    messageId?: string
  } | null>(null)
  const [showPreview, setShowPreview] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastAppliedMessageId, setLastAppliedMessageId] = useState<string | null>(null)

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
            version,
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
          version: planData.generations[0].version || 1,
          created_at: planData.generations[0].created_at,
        } : undefined,
      }

      setPlan(planDetail)
      if (planDetail.generation?.content) {
        setCurrentContent(planDetail.generation.content)
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

  const handleSuggestionAccepted = (suggestion: {
    content: Partial<BusinessCaseOutline>
    sections: string[]
    summary?: string
    messageId?: string
  }) => {
    setPendingSuggestion(suggestion)
  }

  const handleAcceptChanges = async () => {
    if (!pendingSuggestion || !currentContent) return

    try {
      setIsSaving(true)

      // Merge changes into current content
      const updatedContent = {
        ...currentContent,
        ...pendingSuggestion.content
      }

      const response = await fetch('/api/plan/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          content: updatedContent,
          changesSummary: pendingSuggestion.summary || 'AI refinement applied',
          createVersion: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save changes')
      }

      setCurrentContent(updatedContent)
      setPlan((prev) =>
        prev
          ? {
              ...prev,
              generation: prev.generation
                ? { ...prev.generation, content: updatedContent }
                : prev.generation,
            }
          : prev,
      )

      const appliedMessageId = pendingSuggestion.messageId ?? null
      setLastAppliedMessageId(appliedMessageId)
      setPendingSuggestion(null)
      if (appliedMessageId) {
        setTimeout(() => setLastAppliedMessageId(null), 0)
      }
      await loadPlan()
    } catch (error) {
      console.error('Failed to save changes:', error)
      window.alert('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRejectChanges = () => {
    setPendingSuggestion(null)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-alira-gold animate-spin mx-auto mb-4" />
            <p className="text-text-tertiary">Loading plan...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !plan || !currentContent) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="bg-surface border-borderToken-subtle max-w-md">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-serif text-text-primary mb-2">
                Unable to Load Plan
              </h2>
              <p className="text-text-tertiary mb-6">
                This plan has no content to refine yet.
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
        <PlanHeader 
          plan={plan}
          showActions={false}
        />

        {/* Main Content - Split View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Side - Plan Preview or Diff */}
          <div className={`${
            showPreview ? 'w-full md:w-1/2' : 'w-0 md:w-0'
          } transition-all duration-300 overflow-hidden border-r border-borderToken-subtle`}>
            <div className="h-full overflow-y-auto">
              <div className="p-4 md:p-6">
                {/* Toggle Button */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-serif text-text-primary">
                    {pendingSuggestion ? 'Review Changes' : 'Current Plan'}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-text-tertiary hover:text-text-primary md:hidden"
                  >
                    {showPreview ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                  </Button>
                </div>

                {pendingSuggestion ? (
                  <PlanDiffViewer
                    original={currentContent}
                    refined={pendingSuggestion.content}
                    affectedSections={pendingSuggestion.sections}
                    summary={pendingSuggestion.summary}
                    onAccept={handleAcceptChanges}
                    onReject={handleRejectChanges}
                  />
                ) : (
                  <PlanViewer 
                    content={currentContent}
                    collapsible={true}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Chat */}
          <div className={`${
            showPreview ? 'w-full md:w-1/2' : 'w-full'
          } transition-all duration-300 flex flex-col`}>
            <div className="flex-1 flex flex-col min-h-0">
              <RefinementChat
                planId={planId}
                onSuggestionAccepted={handleSuggestionAccepted}
                appliedMessageId={lastAppliedMessageId}
                pendingMessageId={pendingSuggestion?.messageId ?? null}
                className="h-full"
              />
            </div>
          </div>
        </div>

        {/* Mobile Toggle for Preview */}
        {!showPreview && (
          <div className="fixed bottom-4 left-4 md:hidden z-20">
            <Button
              onClick={() => setShowPreview(true)}
              className="bg-alira-gold hover:bg-alira-gold/90 text-alira-black shadow-2xl"
              size="sm"
            >
              <PanelLeftOpen className="w-4 h-4 mr-2" />
              Show Plan
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

