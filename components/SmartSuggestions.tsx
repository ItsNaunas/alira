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
  onSuggestionClick: (suggestion: string) => void
  className?: string
}

export function SmartSuggestions({
  fieldName,
  currentValue,
  businessStage,
  businessIdea,
  onSuggestionClick,
  className
}: SmartSuggestionsProps) {
  const { suggestions, isLoading } = useSmartSuggestions({
    fieldName,
    currentValue,
    businessStage,
    businessIdea
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

  if (suggestions.length === 0 && !isLoading) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn("mt-3", className)}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3 h-3 text-alira-gold" />
          <span className="text-xs font-medium text-alira-primary/70 dark:text-alira-white/70">
            Suggestions
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {isLoading ? (
            <div className="flex items-center gap-2 text-xs text-text-tertiary">
              <div className="w-3 h-3 border-2 border-alira-gold border-t-transparent rounded-full animate-spin" />
              Generating suggestions...
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <motion.button
                key={suggestion.id}
                type="button"
                onClick={() => handleSuggestionClick(suggestion.text)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-lg border transition-all",
                  "bg-alira-gold/10 dark:bg-alira-gold/20 border-alira-gold/30",
                  "hover:bg-alira-gold/20 dark:hover:bg-alira-gold/30",
                  "text-alira-primary dark:text-alira-white",
                  "cursor-pointer"
                )}
                title={`Insert: ${suggestion.text}`}
              >
                + {suggestion.text}
              </motion.button>
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

