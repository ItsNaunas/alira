'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CheckCircle } from 'lucide-react'
import { useMobile } from '@/hooks/use-mobile'

interface Segment {
  id: string
  title: string
  isComplete: boolean
}

interface SegmentProgressProps {
  segments: Segment[]
  currentIndex: number
  totalSegments: number
  autoSaveState?: {
    isSaving?: boolean
    lastSaved?: Date | null
    error?: Error | null
  }
  estimatedTimeRemaining?: number // in minutes
}

export function SegmentProgress({ segments, currentIndex, totalSegments, autoSaveState, estimatedTimeRemaining }: SegmentProgressProps) {
  const isMobile = useMobile()
  const progressPercentage = ((currentIndex + 1) / totalSegments) * 100

  // Simplified mobile version - just progress bar
  if (isMobile) {
    return (
      <div className="sticky top-0 z-20 bg-bg-page/95 backdrop-blur-sm border-b border-borderToken-subtle px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-text-primary">
              {currentIndex + 1} of {totalSegments}
            </span>
            {/* Auto-save indicator */}
            {autoSaveState && (
              <span 
                className={cn(
                  "text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors",
                  autoSaveState.isSaving 
                    ? "text-alira-gold bg-alira-gold/10"
                    : autoSaveState.lastSaved
                    ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                    : "text-text-tertiary bg-alira-primary/5"
                )}
                role="status"
                aria-live="polite"
                aria-label={autoSaveState.isSaving ? "Saving..." : autoSaveState.lastSaved ? "Saved" : "Not saved"}
              >
                {autoSaveState.isSaving ? "Saving..." : autoSaveState.lastSaved ? "Saved" : ""}
              </span>
            )}
          </div>
          {/* Time estimate or percentage */}
          <span className="text-xs text-text-tertiary">
            {estimatedTimeRemaining !== undefined && estimatedTimeRemaining > 0
              ? estimatedTimeRemaining === 1 
                ? "~1 min left"
                : `~${estimatedTimeRemaining} min left`
              : `${Math.round(progressPercentage)}%`
            }
          </span>
        </div>
        <div className="w-full h-1.5 bg-alira-primary/10 dark:bg-alira-primary/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-alira-gold rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
    )
  }

  // Cleaner desktop version
  return (
    <div className="sticky top-0 z-20 bg-bg-page/95 backdrop-blur-sm border-b border-borderToken-subtle">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            {/* Auto-save indicator on desktop */}
            {autoSaveState && (
              <span 
                className={cn(
                  "text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors mr-2",
                  autoSaveState.isSaving 
                    ? "text-alira-gold bg-alira-gold/10"
                    : autoSaveState.lastSaved
                    ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                    : "text-text-tertiary bg-alira-primary/5"
                )}
                role="status"
                aria-live="polite"
                aria-label={autoSaveState.isSaving ? "Saving your progress" : autoSaveState.lastSaved ? "Progress saved" : "Not saved"}
              >
                {autoSaveState.isSaving ? "Saving..." : autoSaveState.lastSaved ? "Saved" : ""}
              </span>
            )}
            {segments.map((segment, index) => (
              <div key={segment.id} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {segment.isComplete ? (
                    <div className="w-5 h-5 rounded-full bg-alira-gold flex items-center justify-center">
                      <CheckCircle className="w-3.5 h-3.5 text-alira-primary" />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-medium transition-all',
                        index === currentIndex
                          ? 'border-alira-gold bg-alira-gold text-alira-primary'
                          : index < currentIndex
                          ? 'border-alira-gold/50 text-alira-gold'
                          : 'border-alira-primary/20 dark:border-alira-white/20 text-text-tertiary'
                      )}
                    >
                      {index + 1}
                    </div>
                  )}
                  <span
                    className={cn(
                      'text-xs font-medium transition-colors',
                      index === currentIndex
                        ? 'text-text-primary'
                        : segment.isComplete
                        ? 'text-text-secondary'
                        : 'text-text-tertiary'
                    )}
                  >
                    {segment.title}
                  </span>
                </div>
                {index < segments.length - 1 && (
                  <div
                    className={cn(
                      'h-px w-6 mx-1 transition-colors',
                      segment.isComplete ? 'bg-alira-gold' : 'bg-alira-primary/10 dark:bg-alira-white/10'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          {/* Time estimate or empty space on desktop */}
          <span className="text-xs text-text-tertiary">
            {estimatedTimeRemaining !== undefined && estimatedTimeRemaining > 0
              ? estimatedTimeRemaining === 1 
                ? "~1 min left"
                : `~${estimatedTimeRemaining} min left`
              : ""
            }
          </span>
        </div>
        <div className="w-full h-1.5 bg-alira-primary/10 dark:bg-alira-primary/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-alira-gold rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  )
}

