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
      className="bg-alira-gold/20 dark:bg-alira-gold/10 border border-alira-gold/30 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg"
    >
      <div className="flex items-start gap-3 sm:gap-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-alira-gold flex items-center justify-center">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-alira-primary" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-sans font-medium text-text-primary mb-2">
            {segmentTitle} - Complete! ✨
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {summary}
          </p>
        </div>
      </div>

      {/* Note: Buttons are hidden here since we use floating button instead */}
      <div className="text-center pt-2">
        <p className="text-xs sm:text-sm text-text-tertiary animate-pulse">
          👇 Continue button below 👇
        </p>
      </div>
    </motion.div>
  )
}

