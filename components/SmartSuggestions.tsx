'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSmartSuggestions } from '@/hooks/use-smart-suggestions'
import { conversionEvents } from '@/lib/analytics'
import type { BusinessStage } from '@/lib/conditional-questions'

interface SmartSuggestionsProps {
  fieldName: string
  currentValue: string
  businessStage?: BusinessStage
  businessIdea?: string
  industry?: 'tech_saas' | 'retail_ecommerce' | 'service' | 'other'
  onSuggestionClick: (suggestion: string) => void
  className?: string
}

export function SmartSuggestions({
  fieldName,
  currentValue,
  businessStage,
  businessIdea,
  industry,
  onSuggestionClick,
  className
}: SmartSuggestionsProps) {
  const { suggestions, isLoading } = useSmartSuggestions({
    fieldName,
    currentValue,
    businessStage,
    businessIdea,
    industry
  })

  useEffect(() => {
    if (suggestions.length > 0 && !isLoading) {
      conversionEvents.smartSuggestionShown(fieldName, suggestions.length)
    }
  }, [suggestions.length, isLoading, fieldName])

  const handleSuggestionClick = (suggestion: string) => {
    conversionEvents.smartSuggestionClicked(fieldName, suggestion)
    onSuggestionClick(suggestion)
  }

  // Show loading state or suggestions if available
  const shouldShow = currentValue.length >= 3 && (isLoading || suggestions.length > 0)

  if (!shouldShow) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className={cn(
          "mt-4 p-3 sm:p-4 rounded-xl border-2 bg-gradient-to-br",
          "from-alira-gold/5 via-alira-gold/5 to-alira-gold/10 dark:from-alira-gold/10 dark:via-alira-gold/10 dark:to-alira-gold/20",
          "border-alira-gold/30 dark:border-alira-gold/40",
          "shadow-lg shadow-alira-gold/10 dark:shadow-alira-gold/20",
          className
        )}
      >
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            animate={{ rotate: isLoading ? 360 : 0 }}
            transition={{ duration: 2, repeat: isLoading ? Infinity : 0, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-4 text-alira-gold" />
          </motion.div>
          <span className="text-sm sm:text-xs font-semibold text-alira-primary dark:text-alira-white">
            AI Suggestions
          </span>
          {isLoading && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-xs text-alira-primary/60 dark:text-alira-white/60"
            >
              Thinking...
            </motion.span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-alira-primary/70 dark:text-alira-white/70 w-full">
              <div className="w-4 h-4 border-2 border-alira-gold border-t-transparent rounded-full animate-spin" />
              <span>Analyzing your input and generating suggestions...</span>
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.id}
                type="button"
                onClick={() => handleSuggestionClick(suggestion.text)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border-2 transition-all",
                  "bg-alira-gold/20 dark:bg-alira-gold/30 border-alira-gold/40 dark:border-alira-gold/50",
                  "hover:bg-alira-gold/30 dark:hover:bg-alira-gold/40 hover:border-alira-gold/60",
                  "hover:shadow-md hover:shadow-alira-gold/20",
                  "text-sm sm:text-xs font-medium text-alira-primary dark:text-alira-white",
                  "cursor-pointer touch-manipulation",
                  "active:scale-95 sm:active:scale-100"
                )}
                title={`Tap to add: ${suggestion.text}`}
              >
                <span className="mr-1.5">✨</span>
                {suggestion.text}
              </motion.button>
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

