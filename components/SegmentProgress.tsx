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
}

export function SegmentProgress({ segments, currentIndex, totalSegments }: SegmentProgressProps) {
  const isMobile = useMobile()
  const progressPercentage = ((currentIndex + 1) / totalSegments) * 100

  if (isMobile) {
    return (
      <div className="sticky top-0 z-20 bg-bg-page/95 backdrop-blur-sm border-b border-borderToken-subtle px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-sans font-medium text-text-primary">
            Question {currentIndex + 1} of {totalSegments}
          </span>
          <span className="text-xs text-text-tertiary">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-alira-primary/10 dark:bg-alira-primary/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-alira-gold rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-0 z-20 bg-bg-page/95 backdrop-blur-sm border-b border-borderToken-subtle px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          {segments.map((segment, index) => (
            <div key={segment.id} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {segment.isComplete ? (
                  <CheckCircle className="w-5 h-5 text-alira-gold" />
                ) : (
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-sans font-medium',
                      index === currentIndex
                        ? 'border-alira-gold bg-alira-gold text-alira-primary'
                        : index < currentIndex
                        ? 'border-alira-gold text-alira-gold'
                        : 'border-alira-primary/30 dark:border-alira-white/30 text-text-tertiary'
                    )}
                  >
                    {index + 1}
                  </div>
                )}
                <span
                  className={cn(
                    'text-sm font-sans',
                    index === currentIndex
                      ? 'text-text-primary font-medium'
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
                    'w-8 h-0.5 mx-2',
                    segment.isComplete ? 'bg-alira-gold' : 'bg-alira-primary/20 dark:bg-alira-white/20'
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-xs text-text-tertiary">
          {Math.round(progressPercentage)}% complete
        </div>
      </div>
      <div className="w-full h-1.5 bg-alira-primary/10 dark:bg-alira-primary/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-alira-gold rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

