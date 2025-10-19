'use client'

import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { CheckCircle } from 'lucide-react'

interface LivePreviewProps {
  data: {
    business_idea?: string
    current_challenges?: string
    immediate_goals?: string
    service_interest?: string[]
    current_tools?: string
    name?: string
  }
}

export default function LivePreview({ data }: LivePreviewProps) {
  const generatePreview = () => {
    // Determine service focus based on selected interests
    const getServiceFocus = () => {
      if (!data.service_interest || data.service_interest.length === 0) return 'General business improvement'
      
      const serviceMap: Record<string, string> = {
        'brand_product': 'Brand & Product Management',
        'content_management': 'Content Management', 
        'digital_solutions': 'Digital Solutions & AI Integration'
      }
      
      return data.service_interest.map(service => serviceMap[service] || service).join(', ')
    }

    // Identify potential problems based on challenges
    const identifyProblems = () => {
      if (!data.current_challenges) return 'We\'ll identify key operational gaps...'
      
      const challenges = data.current_challenges.toLowerCase()
      const problems = []
      
      if (challenges.includes('manual') || challenges.includes('process')) {
        problems.push('Manual processes slowing growth')
      }
      if (challenges.includes('data') || challenges.includes('scattered') || challenges.includes('crm')) {
        problems.push('Disconnected customer data')
      }
      if (challenges.includes('website') || challenges.includes('conversion')) {
        problems.push('Poor digital conversion')
      }
      if (challenges.includes('messaging') || challenges.includes('positioning') || challenges.includes('brand')) {
        problems.push('Unclear brand positioning')
      }
      if (challenges.includes('social') || challenges.includes('content') || challenges.includes('engagement') || challenges.includes('followers')) {
        problems.push('Weak social media presence')
      }
      if (challenges.includes('automation') || challenges.includes('ai')) {
        problems.push('Missing automation opportunities')
      }
      
      return problems.length > 0 ? problems.join(', ') : 'Operational inefficiencies identified'
    }

    // Suggest ALIRA solutions
    const suggestSolutions = () => {
      if (!data.service_interest || data.service_interest.length === 0) return 'ALIRA can help streamline your operations...'
      
      const solutions = []
      if (data.service_interest.includes('brand_product')) {
        solutions.push('Brand positioning & launch strategy')
      }
      if (data.service_interest.includes('content_management')) {
        solutions.push('Social media strategy & content creation')
      }
      if (data.service_interest.includes('digital_solutions')) {
        solutions.push('AI integration & custom tools')
      }
      
      return solutions.length > 0 ? solutions.join(', ') : 'Strategic implementation support'
    }

    return {
      currentSituation: {
        business: data.business_idea || 'Your business concept will appear here...',
        challenges: data.current_challenges || 'Your current challenges will appear here...',
        goals: data.immediate_goals || 'Your growth goals will appear here...'
      },
      identifiedGaps: {
        problems: identifyProblems(),
        currentTools: data.current_tools || 'Current tech stack will be assessed...',
        serviceFocus: getServiceFocus()
      },
      aliraSolutions: {
        recommendedServices: suggestSolutions(),
        implementationApproach: 'Expert-led execution with practical results',
        expectedOutcomes: data.immediate_goals ? `Achieve: ${data.immediate_goals.substring(0, 100)}...` : 'Measurable operational improvements'
      }
    }
  }

  const preview = generatePreview()

  return (
    <Card className="shadow-xl border-0 bg-white/95 dark:bg-alira-primary/95 backdrop-blur-sm rounded-2xl overflow-hidden sticky top-8">
      <CardHeader className="bg-gradient-to-r from-alira-gold/5 to-alira-primary/5 dark:from-alira-gold/10 dark:to-alira-primary/10 border-b border-alira-primary/10 dark:border-alira-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-alira-gold/10 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <CardTitle className="text-lg font-serif font-normal text-alira-primary dark:text-alira-white">
              Your Plan Preview
            </CardTitle>
            <p className="text-xs text-alira-primary/60 dark:text-alira-white/60">
              Updates as you type
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Current Situation */}
        <div>
          <h4 className="font-light text-alira-primary dark:text-alira-white mb-3 text-xs uppercase tracking-wide">
            Current Situation
          </h4>
          <div className="space-y-3">
            <div className="p-3 bg-alira-primary/5 dark:bg-alira-primary/20 rounded-lg border border-alira-primary/10 dark:border-alira-white/10">
              <h5 className="text-xs font-sans font-light text-alira-gold mb-1">Your Business</h5>
              <p className="text-xs text-alira-primary/80 dark:text-alira-white/80 leading-relaxed line-clamp-3">
                {preview.currentSituation.business}
              </p>
            </div>
            <div className="p-3 bg-alira-primary/5 dark:bg-alira-primary/20 rounded-lg border border-alira-primary/10 dark:border-alira-white/10">
              <h5 className="text-xs font-sans font-light text-alira-gold mb-1">Current Challenges</h5>
              <p className="text-xs text-alira-primary/80 dark:text-alira-white/80 leading-relaxed line-clamp-3">
                {preview.currentSituation.challenges}
              </p>
            </div>
            <div className="p-3 bg-alira-primary/5 dark:bg-alira-primary/20 rounded-lg border border-alira-primary/10 dark:border-alira-white/10">
              <h5 className="text-xs font-sans font-light text-alira-gold mb-1">Growth Goals</h5>
              <p className="text-xs text-alira-primary/80 dark:text-alira-white/80 leading-relaxed line-clamp-3">
                {preview.currentSituation.goals}
              </p>
            </div>
          </div>
        </div>

        {/* Identified Gaps */}
        <div>
          <h4 className="font-light text-alira-primary dark:text-alira-white mb-3 text-xs uppercase tracking-wide">
            Identified Gaps
          </h4>
          <div className="space-y-2">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800/30">
              <h5 className="text-xs font-sans font-light text-red-700 dark:text-red-400 mb-1">Key Problems</h5>
              <p className="text-xs text-red-600 dark:text-red-300 leading-relaxed line-clamp-2">
                {preview.identifiedGaps.problems}
              </p>
            </div>
            <div className="p-2 bg-alira-primary/5 dark:bg-alira-primary/20 rounded border border-alira-primary/10 dark:border-alira-white/10">
              <h5 className="text-xs font-sans font-light text-alira-gold mb-1">Current Tools</h5>
              <p className="text-xs text-alira-primary/80 dark:text-alira-white/80 leading-relaxed line-clamp-2">
                {preview.identifiedGaps.currentTools}
              </p>
            </div>
            <div className="p-2 bg-alira-primary/5 dark:bg-alira-primary/20 rounded border border-alira-primary/10 dark:border-alira-white/10">
              <h5 className="text-xs font-sans font-light text-alira-gold mb-1">Service Focus</h5>
              <p className="text-xs text-alira-primary/80 dark:text-alira-white/80 leading-relaxed line-clamp-2">
                {preview.identifiedGaps.serviceFocus}
              </p>
            </div>
          </div>
        </div>

        {/* ALIRA Solutions */}
        <div>
          <h4 className="font-light text-alira-primary dark:text-alira-white mb-3 text-xs uppercase tracking-wide">
            ALIRA Solutions
          </h4>
          <div className="space-y-2">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800/30">
              <h5 className="text-xs font-sans font-light text-green-700 dark:text-green-400 mb-1">Recommended Services</h5>
              <p className="text-xs text-green-600 dark:text-green-300 leading-relaxed line-clamp-2">
                {preview.aliraSolutions.recommendedServices}
              </p>
            </div>
            <div className="p-2 bg-alira-gold/5 dark:bg-alira-gold/10 rounded border border-alira-gold/20">
              <h5 className="text-xs font-sans font-light text-alira-gold mb-1">Our Approach</h5>
              <p className="text-xs text-alira-primary/80 dark:text-alira-white/80 leading-relaxed line-clamp-2">
                {preview.aliraSolutions.implementationApproach}
              </p>
            </div>
            <div className="p-2 bg-alira-gold/5 dark:bg-alira-gold/10 rounded border border-alira-gold/20">
              <h5 className="text-xs font-sans font-light text-alira-gold mb-1">Expected Results</h5>
              <p className="text-xs text-alira-primary/80 dark:text-alira-white/80 leading-relaxed line-clamp-2">
                {preview.aliraSolutions.expectedOutcomes}
              </p>
            </div>
          </div>
        </div>


        {/* Preview Note */}
        <div className="pt-3 border-t border-alira-primary/10 dark:border-alira-white/10">
          <p className="text-xs text-alira-primary/50 dark:text-alira-white/50 text-center leading-relaxed">
            This preview identifies key gaps and ALIRA solutions. Complete the form to receive your detailed implementation roadmap and next steps.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
