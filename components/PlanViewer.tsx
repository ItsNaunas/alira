'use client'

import { BusinessCaseOutline, planSectionLabels, PlanSection } from '@/lib/schema'
import { 
  Lightbulb, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  AlertTriangle,
  Award
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useState, useEffect, useCallback } from 'react'

interface PlanViewerProps {
  content: BusinessCaseOutline
  className?: string
  collapsible?: boolean
  planId?: string
  enableProgressTracking?: boolean
}

interface SectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  collapsible?: boolean
  defaultExpanded?: boolean
}

function Section({ title, icon, children, collapsible = false, defaultExpanded = true }: SectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <Card className="bg-surface border-borderToken-subtle hover:border-accent transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-alira-gold/10 rounded-lg flex items-center justify-center">
              {icon}
            </div>
            <h3 className="text-xl font-serif text-text-primary">{title}</h3>
          </div>
          {collapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-text-tertiary hover:text-text-primary transition-colors"
            >
              <ArrowRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>
        {isExpanded && (
          <div className="ml-13">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function PlanViewer({ 
  content, 
  className = '', 
  collapsible = true,
  planId,
  enableProgressTracking = false 
}: PlanViewerProps) {
  const [progress, setProgress] = useState<Record<string, Record<number, boolean>>>({
    objective: {},
    next_step: {}
  })
  const [isLoadingProgress, setIsLoadingProgress] = useState(false)

  const loadProgress = useCallback(async () => {
    if (!planId) return
    setIsLoadingProgress(true)
    try {
      const response = await fetch(`/api/plan/progress?planId=${planId}`)
      if (!response.ok) throw new Error('Failed to load progress')
      const result = await response.json()
      setProgress(result.data?.progress || { objective: {}, next_step: {} })
    } catch (error) {
      console.error('Error loading progress:', error)
    } finally {
      setIsLoadingProgress(false)
    }
  }, [planId])

  // Load progress if tracking is enabled
  useEffect(() => {
    if (enableProgressTracking && planId) {
      loadProgress()
    }
  }, [enableProgressTracking, planId, loadProgress])

  const toggleProgress = async (itemType: 'objective' | 'next_step', index: number, completed: boolean) => {
    if (!planId) return
    
    // Optimistic update
    setProgress(prev => ({
      ...prev,
      [itemType]: {
        ...prev[itemType],
        [index]: completed
      }
    }))

    try {
      const response = await fetch('/api/plan/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          itemType,
          itemIndex: index,
          completed
        })
      })
      if (!response.ok) {
        // Revert on error
        setProgress(prev => ({
          ...prev,
          [itemType]: {
            ...prev[itemType],
            [index]: !completed
          }
        }))
        throw new Error('Failed to update progress')
      }
    } catch (error) {
      console.error('Error updating progress:', error)
      alert('Failed to update progress. Please try again.')
    }
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-text-tertiary">No plan content available</p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Methodology Badges - Show at top if available */}
      {content.methodology_applied && content.methodology_applied.length > 0 && (
        <Card className="bg-alira-gold/5 border-alira-gold/20">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-text-primary mr-2">Methodology Applied:</span>
              {content.methodology_applied.map((methodology, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-alira-gold/20 dark:bg-alira-gold/10 text-alira-gold border border-alira-gold/30"
                >
                  {methodology}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Problem Statement */}
      {content.problem_statement && (
        <Section
          title={planSectionLabels.problem_statement}
          icon={<Lightbulb className="w-5 h-5 text-alira-gold" />}
          collapsible={collapsible}
        >
          <p className="text-text-secondary leading-relaxed">
            {content.problem_statement}
          </p>
        </Section>
      )}

      {/* Root Cause Analysis - New Methodology Section */}
      {content.root_cause_analysis && (
        <Section
          title="Root Cause Analysis"
          icon={<AlertTriangle className="w-5 h-5 text-alira-gold" />}
          collapsible={collapsible}
          defaultExpanded={true}
        >
          <div className="space-y-4">
            {/* 5 Whys Chain Visualization */}
            {content.root_cause_analysis.five_whys_chain && content.root_cause_analysis.five_whys_chain.length > 0 && (
              <div className="bg-bg-muted rounded-lg p-4 border border-borderToken-subtle">
                <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs bg-alira-gold/20 text-alira-gold border border-alira-gold/30">5 Whys Chain</span>
                </h4>
                <div className="space-y-2">
                  {content.root_cause_analysis.five_whys_chain.map((why, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-alira-gold/10 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-xs text-alira-gold font-medium">
                          {index === 0 ? 'S' : index === content.root_cause_analysis!.five_whys_chain.length - 1 ? 'R' : index}
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {why}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Root Cause Summary */}
            {content.root_cause_analysis.root_cause && (
              <div className="bg-alira-gold/5 border border-alira-gold/20 rounded-lg p-4">
                <h4 className="text-sm font-medium text-text-primary mb-2">Root Cause Identified:</h4>
                <p className="text-text-secondary leading-relaxed">{content.root_cause_analysis.root_cause}</p>
              </div>
            )}
            
            {/* Symptoms vs Causes */}
            {content.root_cause_analysis.symptoms_vs_causes && content.root_cause_analysis.symptoms_vs_causes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-3">Symptoms vs Root Causes:</h4>
                <div className="space-y-3">
                  {content.root_cause_analysis.symptoms_vs_causes.map((item, index) => (
                    <div key={index} className="bg-bg-muted rounded-lg p-3 border border-borderToken-subtle">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <span className="text-xs font-medium text-red-400/80">Symptom:</span>
                        </div>
                        <p className="text-text-secondary text-sm flex-1">{item.symptom}</p>
                      </div>
                      <div className="flex items-start gap-3 mt-2">
                        <div className="flex-shrink-0">
                          <span className="text-xs font-medium text-alira-gold">Root Cause:</span>
                        </div>
                        <p className="text-text-secondary text-sm flex-1">{item.root_cause}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Objectives */}
      {content.objectives && content.objectives.length > 0 && (
        <Section
          title={planSectionLabels.objectives}
          icon={<Target className="w-5 h-5 text-alira-gold" />}
          collapsible={collapsible}
        >
          <ul className="space-y-3">
            {content.objectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-3">
                {enableProgressTracking && (
                  <Checkbox
                    checked={progress.objective[index] || false}
                    onCheckedChange={(checked) => toggleProgress('objective', index, checked === true)}
                    className="mt-1"
                    disabled={isLoadingProgress}
                  />
                )}
                <div className="flex-shrink-0 w-6 h-6 bg-alira-gold/10 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs text-alira-gold font-medium">{index + 1}</span>
                </div>
                <p className={`text-text-secondary leading-relaxed ${enableProgressTracking && progress.objective[index] ? 'line-through opacity-60' : ''}`}>
                  {objective}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Current State */}
      {content.current_state && (
        <Section
          title={planSectionLabels.current_state}
          icon={<TrendingUp className="w-5 h-5 text-alira-gold" />}
          collapsible={collapsible}
        >
          <p className="text-text-secondary leading-relaxed">
            {content.current_state}
          </p>
        </Section>
      )}

      {/* Industry Analysis - New Methodology Section */}
      {content.industry_analysis && (
        <Section
          title="Industry Analysis"
          icon={<TrendingUp className="w-5 h-5 text-alira-gold" />}
          collapsible={collapsible}
          defaultExpanded={true}
        >
          <div className="space-y-4">
            {/* Industry Context */}
            {content.industry_analysis.context && (
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-2">Industry Context:</h4>
                <p className="text-text-secondary leading-relaxed">{content.industry_analysis.context}</p>
              </div>
            )}
            
            {/* Benchmark Comparisons */}
            {content.industry_analysis.benchmarks_comparison && Object.keys(content.industry_analysis.benchmarks_comparison).length > 0 && (
              <div className="bg-bg-muted rounded-lg p-4 border border-borderToken-subtle">
                <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs bg-alira-gold/20 text-alira-gold border border-alira-gold/30">UK Benchmark Comparisons</span>
                </h4>
                <div className="space-y-2">
                  {Object.entries(content.industry_analysis.benchmarks_comparison).map(([metric, comparison], index) => (
                    <div key={index} className="flex items-start gap-3 py-2 border-b border-borderToken-subtle last:border-0">
                      <div className="flex-shrink-0 w-20">
                        <span className="text-xs font-medium text-text-primary">{metric}:</span>
                      </div>
                      <p className="text-text-secondary text-sm flex-1">{comparison}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Stage-Specific Insights */}
            {content.industry_analysis.stage_specific_insights && (
              <div className="bg-alira-gold/5 border border-alira-gold/20 rounded-lg p-4">
                <h4 className="text-sm font-medium text-text-primary mb-2">Stage-Specific Insights:</h4>
                <p className="text-text-secondary leading-relaxed">{content.industry_analysis.stage_specific_insights}</p>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Proposed Solution */}
      {content.proposed_solution && content.proposed_solution.length > 0 && (
        <Section
          title={planSectionLabels.proposed_solution}
          icon={<CheckCircle2 className="w-5 h-5 text-alira-gold" />}
          collapsible={collapsible}
        >
          <div className="space-y-4">
            {content.proposed_solution.map((solution, index) => (
              <div key={index} className="bg-bg-muted rounded-lg p-4 border border-borderToken-subtle">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-serif text-text-primary">{solution.pillar}</h4>
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      solution.effort === 'high' 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                        : solution.effort === 'med' || solution.effort === 'medium'
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        : 'bg-green-500/10 text-green-400 border border-green-500/20'
                    }`}>
                      Effort: {solution.effort}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      solution.impact === 'high'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : solution.impact === 'med' || solution.impact === 'medium'
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      Impact: {solution.impact}
                    </span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {solution.actions.map((action, actionIndex) => (
                    <li key={actionIndex} className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-alira-gold/60 flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary text-sm leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ul>
                {(solution as any).timeline && (
                  <div className="mt-3 text-xs text-text-tertiary">
                    Timeline: {(solution as any).timeline}
                  </div>
                )}
                {(solution as any).investment && (
                  <div className="mt-1 text-xs text-text-tertiary">
                    Investment: {(solution as any).investment}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Expected Outcomes */}
      {content.expected_outcomes && content.expected_outcomes.length > 0 && (
        <Section
          title={planSectionLabels.expected_outcomes}
          icon={<Award className="w-5 h-5 text-alira-gold" />}
          collapsible={collapsible}
        >
          <ul className="space-y-3">
            {content.expected_outcomes.map((outcome, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-alira-gold/70 flex-shrink-0 mt-0.5" />
                <p className="text-text-secondary leading-relaxed">{outcome}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Next Steps */}
      {content.next_steps && content.next_steps.length > 0 && (
        <Section
          title={planSectionLabels.next_steps}
          icon={<ArrowRight className="w-5 h-5 text-alira-gold" />}
          collapsible={collapsible}
        >
          <ol className="space-y-3">
            {content.next_steps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                {enableProgressTracking && (
                  <Checkbox
                    checked={progress.next_step[index] || false}
                    onCheckedChange={(checked) => toggleProgress('next_step', index, checked === true)}
                    className="mt-1"
                    disabled={isLoadingProgress}
                  />
                )}
                <div className="flex-shrink-0 w-7 h-7 bg-alira-gold/20 rounded-full flex items-center justify-center">
                  <span className="text-sm text-alira-gold font-medium">{index + 1}</span>
                </div>
                <p className={`text-text-secondary leading-relaxed pt-0.5 ${enableProgressTracking && progress.next_step[index] ? 'line-through opacity-60' : ''}`}>
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Risk Assessment */}
      {(content as any).risk_assessment && (
        <Section
          title={planSectionLabels.risk_assessment}
          icon={<AlertTriangle className="w-5 h-5 text-alira-gold" />}
          collapsible={collapsible}
          defaultExpanded={false}
        >
          <p className="text-text-secondary leading-relaxed">
            {(content as any).risk_assessment}
          </p>
        </Section>
      )}

      {/* Competitive Advantage */}
      {(content as any).competitive_advantage && (
        <Section
          title={planSectionLabels.competitive_advantage}
          icon={<Award className="w-5 h-5 text-alira-gold" />}
          collapsible={collapsible}
          defaultExpanded={false}
        >
          <p className="text-text-secondary leading-relaxed">
            {(content as any).competitive_advantage}
          </p>
        </Section>
      )}
    </div>
  )
}

