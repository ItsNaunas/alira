'use client'

import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { CheckCircle } from 'lucide-react'

interface LivePreviewProps {
  data: {
    idea?: string
    challenge?: string
    goal_90d?: string
    resources?: string[]
    name?: string
  }
}

export default function LivePreview({ data }: LivePreviewProps) {
  const generatePreview = () => {
    return {
      snapshot: {
        whatYouShared: data.idea || 'Your business idea will appear here...',
        whatMattersMost: data.goal_90d || 'Your 90-day goal will appear here...',
        thingsToBeMindfulOf: data.challenge || 'Your main challenge will appear here...'
      },
      biggerPicture: {
        purpose: data.idea ? `Building ${data.idea.toLowerCase()}` : 'Your business purpose will appear here...',
        desiredOutcomes: data.goal_90d || 'Your desired outcomes will appear here...',
        audience: 'Your target audience will be identified based on your idea'
      },
      insights: {
        currentPosition: data.resources && data.resources.length > 0 
          ? `You have: ${data.resources.join(', ')}` 
          : 'Your current resources will be listed here...',
        opportunities: 'Key opportunities will be identified based on your inputs',
        aliraPerspective: 'ALIRA will provide strategic insights based on your situation'
      },
      nextSteps: [
        'Validate your target market',
        'Develop a minimum viable product',
        'Create a go-to-market strategy',
        'Set up key performance indicators'
      ]
    }
  }

  const preview = generatePreview()

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-alira-onyx">
          Your Plan Preview
        </CardTitle>
        <p className="text-sm text-alira-onyx/70">
          This updates as you type
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Snapshot Summary */}
        <div>
          <h4 className="font-semibold text-alira-onyx mb-3 text-sm uppercase tracking-wide">
            Snapshot Summary
          </h4>
          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-medium text-alira-gold mb-1">What you shared</h5>
              <p className="text-sm text-alira-onyx/80 leading-relaxed">
                {preview.snapshot.whatYouShared}
              </p>
            </div>
            <div>
              <h5 className="text-sm font-medium text-alira-gold mb-1">What matters most</h5>
              <p className="text-sm text-alira-onyx/80 leading-relaxed">
                {preview.snapshot.whatMattersMost}
              </p>
            </div>
            <div>
              <h5 className="text-sm font-medium text-alira-gold mb-1">Things to be mindful of</h5>
              <p className="text-sm text-alira-onyx/80 leading-relaxed">
                {preview.snapshot.thingsToBeMindfulOf}
              </p>
            </div>
          </div>
        </div>

        {/* The Bigger Picture */}
        <div>
          <h4 className="font-semibold text-alira-onyx mb-3 text-sm uppercase tracking-wide">
            The Bigger Picture
          </h4>
          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-medium text-alira-gold mb-1">Purpose</h5>
              <p className="text-sm text-alira-onyx/80 leading-relaxed">
                {preview.biggerPicture.purpose}
              </p>
            </div>
            <div>
              <h5 className="text-sm font-medium text-alira-gold mb-1">Desired outcomes (6–12 months)</h5>
              <p className="text-sm text-alira-onyx/80 leading-relaxed">
                {preview.biggerPicture.desiredOutcomes}
              </p>
            </div>
            <div>
              <h5 className="text-sm font-medium text-alira-gold mb-1">Audience</h5>
              <p className="text-sm text-alira-onyx/80 leading-relaxed">
                {preview.biggerPicture.audience}
              </p>
            </div>
          </div>
        </div>

        {/* Insights + Opportunities */}
        <div>
          <h4 className="font-semibold text-alira-onyx mb-3 text-sm uppercase tracking-wide">
            Insights + Opportunities
          </h4>
          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-medium text-alira-gold mb-1">Current position</h5>
              <p className="text-sm text-alira-onyx/80 leading-relaxed">
                {preview.insights.currentPosition}
              </p>
            </div>
            <div>
              <h5 className="text-sm font-medium text-alira-gold mb-1">Opportunities</h5>
              <p className="text-sm text-alira-onyx/80 leading-relaxed">
                {preview.insights.opportunities}
              </p>
            </div>
            <div>
              <h5 className="text-sm font-medium text-alira-gold mb-1">How ALIRA sees it</h5>
              <p className="text-sm text-alira-onyx/80 leading-relaxed">
                {preview.insights.aliraPerspective}
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Next Steps */}
        <div>
          <h4 className="font-semibold text-alira-onyx mb-3 text-sm uppercase tracking-wide">
            Recommended Next Steps
          </h4>
          <div className="space-y-2">
            {preview.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-alira-gold font-bold text-sm mt-0.5">{index + 1}.</span>
                <span className="text-sm text-alira-onyx/80">{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-alira-gold/5 rounded-lg border border-alira-gold/20">
            <p className="text-xs text-alira-onyx/60 italic">
              Reflection Space: Take time to consider how these steps align with your values and long-term vision.
            </p>
          </div>
        </div>

        {/* Preview Note */}
        <div className="pt-4 border-t border-alira-onyx/10">
          <p className="text-xs text-alira-onyx/50 text-center">
            This is a preview. Your complete plan will include detailed analysis, implementation timelines, and strategic recommendations.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
