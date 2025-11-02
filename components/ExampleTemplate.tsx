'use client'

import { useState } from 'react'
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

  const templates = getTemplatesForQuestion(questionId)
  const previewTemplate = getRandomTemplate(questionId)

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

            {/* Examples Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-8 left-0 z-50 w-full sm:w-[500px] bg-white dark:bg-alira-primary rounded-xl border border-alira-primary/20 dark:border-alira-white/20 shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-alira-primary/10 dark:border-alira-white/10">
                <h3 className="text-sm font-medium text-alira-primary dark:text-alira-white">
                  Example Answers
                </h3>
                <button
                  type="button"
                  onClick={() => setShowExamples(false)}
                  className="text-text-tertiary hover:text-text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Templates List */}
              <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-all",
                      selectedTemplate?.id === template.id
                        ? "border-alira-gold bg-alira-gold/5"
                        : "border-alira-primary/10 dark:border-alira-white/10 hover:border-alira-gold/40"
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
                        className="mt-3 flex gap-2"
                      >
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopy(template)
                          }}
                          className="text-xs"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
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
                            className="text-xs bg-alira-gold text-alira-primary hover:bg-alira-gold/90"
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
                  <p className="text-xs text-text-secondary italic line-clamp-2">
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
