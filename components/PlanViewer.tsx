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
import { useState } from 'react'

interface PlanViewerProps {
  content: BusinessCaseOutline
  className?: string
  collapsible?: boolean
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
    <Card className="bg-white/[0.02] border-white/10 hover:border-white/20 transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-alira-gold/10 rounded-lg flex items-center justify-center">
              {icon}
            </div>
            <h3 className="text-xl font-serif text-alira-white">{title}</h3>
          </div>
          {collapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-alira-white/40 hover:text-alira-white transition-colors"
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

export default function PlanViewer({ content, className = '', collapsible = true }: PlanViewerProps) {
  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-alira-white/60">No plan content available</p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Problem Statement */}
      {content.problem_statement && (
        <Section
          title={planSectionLabels.problem_statement}
          icon={<Lightbulb className="w-5 h-5 text-alira-gold" />}
          collapsible={collapsible}
        >
          <p className="text-alira-white/80 leading-relaxed">
            {content.problem_statement}
          </p>
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
                <div className="flex-shrink-0 w-6 h-6 bg-alira-gold/10 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs text-alira-gold font-medium">{index + 1}</span>
                </div>
                <p className="text-alira-white/80 leading-relaxed">{objective}</p>
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
          <p className="text-alira-white/80 leading-relaxed">
            {content.current_state}
          </p>
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
              <div key={index} className="bg-white/[0.03] rounded-lg p-4 border border-white/5">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-serif text-alira-white">{solution.pillar}</h4>
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
                      <span className="text-alira-white/80 text-sm leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ul>
                {(solution as any).timeline && (
                  <div className="mt-3 text-xs text-alira-white/50">
                    Timeline: {(solution as any).timeline}
                  </div>
                )}
                {(solution as any).investment && (
                  <div className="mt-1 text-xs text-alira-white/50">
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
                <p className="text-alira-white/80 leading-relaxed">{outcome}</p>
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
                <div className="flex-shrink-0 w-7 h-7 bg-alira-gold/20 rounded-full flex items-center justify-center">
                  <span className="text-sm text-alira-gold font-medium">{index + 1}</span>
                </div>
                <p className="text-alira-white/80 leading-relaxed pt-0.5">{step}</p>
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
          <p className="text-alira-white/80 leading-relaxed">
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
          <p className="text-alira-white/80 leading-relaxed">
            {(content as any).competitive_advantage}
          </p>
        </Section>
      )}
    </div>
  )
}

