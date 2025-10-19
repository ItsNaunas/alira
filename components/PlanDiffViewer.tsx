'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, X, ArrowRight } from 'lucide-react'
import { BusinessCaseOutline, planSectionLabels } from '@/lib/schema'

interface PlanDiffViewerProps {
  original: Partial<BusinessCaseOutline>
  refined: Partial<BusinessCaseOutline>
  affectedSections: string[]
  onAccept: () => void
  onReject: () => void
  className?: string
}

function DiffSection({ 
  title, 
  original, 
  refined 
}: { 
  title: string
  original: any
  refined: any 
}) {
  // Handle arrays
  if (Array.isArray(original) || Array.isArray(refined)) {
    const origArray = Array.isArray(original) ? original : []
    const refArray = Array.isArray(refined) ? refined : []

    return (
      <div className="space-y-3">
        <h4 className="text-sm font-serif text-alira-white/80">{title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original */}
          <div className="space-y-2">
            <div className="text-xs text-alira-white/40 uppercase tracking-wide">Before</div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
              {origArray.length > 0 ? (
                <ul className="space-y-2">
                  {origArray.map((item: any, idx: number) => (
                    <li key={idx} className="text-sm text-alira-white/70 leading-relaxed">
                      {typeof item === 'object' ? JSON.stringify(item, null, 2) : item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-alira-white/40 italic">None</p>
              )}
            </div>
          </div>

          {/* Refined */}
          <div className="space-y-2">
            <div className="text-xs text-alira-white/40 uppercase tracking-wide">After</div>
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
              {refArray.length > 0 ? (
                <ul className="space-y-2">
                  {refArray.map((item: any, idx: number) => (
                    <li key={idx} className="text-sm text-alira-white/80 leading-relaxed">
                      {typeof item === 'object' ? JSON.stringify(item, null, 2) : item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-alira-white/40 italic">None</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Handle strings
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-serif text-alira-white/80">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <div className="space-y-2">
          <div className="text-xs text-alira-white/40 uppercase tracking-wide">Before</div>
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
            <p className="text-sm text-alira-white/70 leading-relaxed">
              {original || <span className="italic text-alira-white/40">None</span>}
            </p>
          </div>
        </div>

        {/* Refined */}
        <div className="space-y-2">
          <div className="text-xs text-alira-white/40 uppercase tracking-wide">After</div>
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
            <p className="text-sm text-alira-white/80 leading-relaxed">
              {refined || <span className="italic text-alira-white/40">None</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PlanDiffViewer({
  original,
  refined,
  affectedSections,
  onAccept,
  onReject,
  className = ''
}: PlanDiffViewerProps) {
  if (affectedSections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-alira-white/60">No changes to review</p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-serif text-alira-white mb-1">
            Review Changes
          </h3>
          <p className="text-sm text-alira-white/60">
            {affectedSections.length} section{affectedSections.length > 1 ? 's' : ''} updated
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onReject}
            variant="outline"
            size="sm"
            className="border-white/20 text-alira-white hover:bg-white/5"
          >
            <X className="w-4 h-4 mr-2" />
            Reject All
          </Button>
          <Button
            onClick={onAccept}
            size="sm"
            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
          >
            <Check className="w-4 h-4 mr-2" />
            Accept All
          </Button>
        </div>
      </div>

      {/* Changes */}
      <div className="space-y-6">
        {affectedSections.map((section) => {
          const sectionKey = section as keyof BusinessCaseOutline
          const origValue = (original as any)[sectionKey]
          const refValue = (refined as any)[sectionKey]

          if (!refValue) return null

          return (
            <Card key={section} className="bg-white/[0.02] border-white/10">
              <CardContent className="p-6">
                <DiffSection
                  title={planSectionLabels[section as keyof typeof planSectionLabels] || section}
                  original={origValue}
                  refined={refValue}
                />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Visual Indicator */}
      <div className="flex items-center justify-center gap-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500/30 rounded-full"></div>
          <span className="text-xs text-alira-white/60">Removed/Original</span>
        </div>
        <ArrowRight className="w-4 h-4 text-alira-white/40" />
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500/30 rounded-full"></div>
          <span className="text-xs text-alira-white/60">Added/Refined</span>
        </div>
      </div>
    </div>
  )
}

