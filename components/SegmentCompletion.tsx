'use client'

import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SegmentCompletionProps {
  segmentTitle: string
  summary: string
  onContinue: () => void
  onEdit?: () => void
}

export function SegmentCompletion({
  segmentTitle,
  summary,
  onContinue,
  onEdit
}: SegmentCompletionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-alira-gold/20 dark:bg-alira-gold/10 border border-alira-gold/30 rounded-2xl p-6 mb-6 shadow-lg"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-alira-gold flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-alira-primary" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-sans font-medium text-text-primary mb-2">
            {segmentTitle} - Complete!
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {summary}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        {onEdit && (
          <Button
            variant="outline"
            onClick={onEdit}
            className="flex-1 border-alira-primary/20 dark:border-alira-white/20 text-text-primary hover:bg-alira-primary/10"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Answer
          </Button>
        )}
        <Button
          onClick={onContinue}
          className={cn(
            'flex-1 bg-alira-gold text-alira-primary hover:bg-alira-gold/90',
            !onEdit && 'w-full'
          )}
        >
          Continue to Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  )
}

