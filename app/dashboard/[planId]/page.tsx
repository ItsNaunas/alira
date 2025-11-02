'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient, auth } from '@/lib/supabase-client'
import { PlanDetail } from '@/lib/schema'
import PlanHeader from '@/components/PlanHeader'
import PlanViewer from '@/components/PlanViewer'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export default function PlanDetailPage() {
  const router = useRouter()
  const params = useParams()
  const planId = params.planId as string

  const [user, setUser] = useState<any>(null)
  const [plan, setPlan] = useState<PlanDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      
      // Fetch plan with generation data
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

      if (planError) {
        console.error('Error loading plan:', planError)
        setError('Failed to load plan')
        return
      }

      if (!planData) {
        setError('Plan not found')
        return
      }

      // Transform data to PlanDetail format
      // Note: version_count is based on generations for now since plan_versions table doesn't exist yet
      const versionCount = planData.generations?.length || 1

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
        version_count: versionCount,
      }

      setPlan(planDetail)
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

  if (error || !plan) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="bg-surface border-borderToken-subtle max-w-md">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-serif text-text-primary mb-2">
                {error || 'Plan Not Found'}
              </h2>
              <p className="text-text-tertiary mb-6">
                {error 
                  ? 'There was an error loading this plan. Please try again.'
                  : 'This plan does not exist or you do not have permission to view it.'
                }
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
      <div className="min-h-screen">
        {/* Breadcrumbs */}
        <div className="px-4 md:px-6 pt-4 pb-2 border-b border-borderToken-subtle">
          <div className="max-w-5xl mx-auto">
            <Breadcrumbs
              items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: plan.business_name || 'Plan' },
              ]}
            />
          </div>
        </div>

        {/* Header */}
        <PlanHeader 
          plan={plan}
          currentVersion={plan.generation?.version || 1}
          totalVersions={plan.version_count || 1}
          showActions={true}
        />

        {/* Main Content */}
        <main className="px-4 md:px-6 py-8 w-full">
          <div className="max-w-5xl mx-auto">
            {plan.generation?.content ? (
              <>
                {/* Plan Metadata Card */}
                <Card className="bg-surface border-borderToken-subtle mb-6">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {plan.current_challenges && (
                        <div>
                          <h4 className="text-xs text-text-tertiary mb-2 uppercase tracking-wide">
                            Current Challenge
                          </h4>
                          <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                            {plan.current_challenges}
                          </p>
                        </div>
                      )}
                      {plan.immediate_goals && (
                        <div>
                          <h4 className="text-xs text-text-tertiary mb-2 uppercase tracking-wide">
                            Immediate Goals
                          </h4>
                          <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                            {plan.immediate_goals}
                          </p>
                        </div>
                      )}
                      {plan.service_interest && plan.service_interest.length > 0 && (
                        <div>
                          <h4 className="text-xs text-text-tertiary mb-2 uppercase tracking-wide">
                            Services of Interest
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {plan.service_interest.map((service, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 rounded text-xs bg-alira-gold/10 text-alira-gold border border-alira-gold/20"
                              >
                                {service.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Plan Content */}
                <PlanViewer 
                  content={plan.generation.content}
                  collapsible={true}
                />
              </>
            ) : (
              <Card className="bg-surface border-borderToken-subtle">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-alira-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <RefreshCw className="w-8 h-8 text-alira-gold animate-spin" />
                  </div>
                  <h3 className="text-xl font-serif text-text-primary mb-2">
                    Generating Plan
                  </h3>
                  <p className="text-text-secondary mb-6">
                    Your AI-powered business analysis is being created...
                  </p>
                  <Button
                    onClick={loadPlan}
                    variant="outline"
                    className="border-borderToken-subtle text-text-primary hover:bg-bg-muted"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}

