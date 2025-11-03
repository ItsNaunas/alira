'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, X, Copy, Check } from 'lucide-react'
import { FormTemplate, getTemplatesForQuestion, getRandomTemplate } from '@/lib/form-templates'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface ExampleTemplateProps {
  questionId: 'business_idea' | 'current_challenges' | 'immediate_goals'
  onFillExample?: (content: string) => void
  className?: string
}

export function ExampleTemplate({ questionId, onFillExample, className }: ExampleTemplateProps) {
  const [showExamples, setShowExamples] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null)
  const [copied, setCopied] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const templates = getTemplatesForQuestion(questionId)
  const previewTemplate = getRandomTemplate(questionId)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleCopy = async (template: FormTemplate) => {
    try {
      await navigator.clipboard.writeText(template.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleFillExample = (template: FormTemplate) => {
    if (onFillExample) {
      onFillExample(template.content)
    }
    setShowExamples(false)
    setSelectedTemplate(null)
  }

  return (
    <div className={cn("relative", className)}>
      {/* See Example Button */}
      <button
        type="button"
        onClick={() => setShowExamples(!showExamples)}
        className="inline-flex items-center gap-1.5 text-xs text-alira-gold hover:text-alira-gold/80 transition-colors font-medium"
      >
        <Eye className="w-3.5 h-3.5" />
        See Example
      </button>

      {/* Example Preview (Quick View) */}
      <AnimatePresence>
        {showExamples && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExamples(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Examples Panel - Mobile: Bottom Sheet, Desktop: Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: isMobile ? 400 : -10, scale: isMobile ? 1 : 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: isMobile ? 400 : -10, scale: isMobile ? 1 : 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "z-50 bg-white dark:bg-alira-primary border border-alira-primary/20 dark:border-alira-white/20 shadow-xl overflow-hidden",
                // Mobile: Full-screen bottom sheet
                "fixed inset-x-0 bottom-0 rounded-t-3xl sm:rounded-xl",
                // Desktop: Dropdown
                "sm:absolute sm:top-8 sm:left-0 sm:w-[500px] sm:max-h-[600px] sm:rounded-xl",
                // Mobile: Max height
                "h-[85vh] sm:h-auto"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-4 border-b border-alira-primary/10 dark:border-alira-white/10">
                <div className="flex items-center gap-3">
                  {/* Mobile: Drag handle */}
                  <div className="sm:hidden w-10 h-1 bg-alira-primary/30 dark:bg-alira-white/30 rounded-full mx-auto" />
                  <h3 className="text-base sm:text-sm font-medium text-alira-primary dark:text-alira-white">
                    Example Answers
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowExamples(false)}
                  className="p-2 -mr-2 text-text-tertiary hover:text-text-primary hover:bg-alira-primary/5 dark:hover:bg-alira-white/5 rounded-lg transition-colors touch-manipulation"
                  aria-label="Close examples"
                >
                  <X className="w-5 h-5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Templates List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-4 sm:max-h-[400px] space-y-3 pb-6 sm:pb-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={cn(
                      "p-4 sm:p-4 rounded-lg border cursor-pointer transition-all touch-manipulation",
                      "active:scale-[0.98] sm:active:scale-100",
                      selectedTemplate?.id === template.id
                        ? "border-alira-gold bg-alira-gold/5"
                        : "border-alira-primary/10 dark:border-alira-white/10 hover:border-alira-gold/40 active:border-alira-gold/40"
                    )}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-alira-primary dark:text-alira-white mb-2">
                          {template.label}
                        </h4>
                        {selectedTemplate?.id === template.id ? (
                          <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">
                            {template.content}
                          </p>
                        ) : (
                          <p className="text-xs text-text-tertiary line-clamp-2">
                            {template.content.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                    </div>

                    {selectedTemplate?.id === template.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 flex flex-col sm:flex-row gap-2"
                      >
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopy(template)
                          }}
                          className="text-xs min-h-[44px] sm:min-h-0 touch-manipulation"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 sm:w-3 sm:h-3 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 sm:w-3 sm:h-3 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                        {onFillExample && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleFillExample(template)
                            }}
                            className="text-xs bg-alira-gold text-alira-primary hover:bg-alira-gold/90 min-h-[44px] sm:min-h-0 touch-manipulation"
                          >
                            Fill This Example
                          </Button>
                        )}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Preview (Default) */}
              {!selectedTemplate && (
                <div className="p-4 border-t border-alira-primary/10 dark:border-alira-white/10">
                  <p className="text-xs text-text-tertiary mb-2">Quick Preview:</p>
                  <p className="text-xs text-text-secondary line-clamp-2">
                    "{previewTemplate.content.substring(0, 150)}..."
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
