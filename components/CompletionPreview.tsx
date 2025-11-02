'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, CheckCircle2, Edit2, Eye, X } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { cn } from '@/lib/utils'

interface FormDataPreview {
  business_idea?: string
  business_stage?: string
  current_challenges?: string
  immediate_goals?: string
  service_interest?: string[]
  current_tools?: string
}

interface PlanSection {
  id: string
  title: string
  content: string | string[]
  icon?: React.ReactNode
}

interface CompletionPreviewProps {
  formData: FormDataPreview
  onEdit?: (sectionId: string) => void
  onConfirm?: () => void
  onCancel?: () => void
  isOpen: boolean
  onClose: () => void
}

export function CompletionPreview({
  formData,
  onEdit,
  onConfirm,
  onCancel,
  isOpen,
  onClose
}: CompletionPreviewProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const generatePlanSections = (): PlanSection[] => {
    const sections: PlanSection[] = []

    // Executive Summary Section
    if (formData.business_idea) {
      sections.push({
        id: 'executive-summary',
        title: 'Executive Summary',
        content: `Your business concept: ${formData.business_idea}`,
        icon: <FileText className="w-5 h-5" />
      })
    }

    // Business Stage & Context
    if (formData.business_stage) {
      const stageLabels: Record<string, string> = {
        idea: 'Idea Stage',
        early: 'Early Stage',
        growing: 'Growing Business',
        established: 'Established Business'
      }
      sections.push({
        id: 'business-context',
        title: 'Business Context',
        content: `Your business is in the ${stageLabels[formData.business_stage] || formData.business_stage} phase.`,
        icon: <CheckCircle2 className="w-5 h-5" />
      })
    }

    // Current Challenges
    if (formData.current_challenges) {
      sections.push({
        id: 'challenges',
        title: 'Current Challenges',
        content: formData.current_challenges,
        icon: <Edit2 className="w-5 h-5" />
      })
    }

    // Goals & Objectives
    if (formData.immediate_goals) {
      sections.push({
        id: 'goals',
        title: 'Immediate Goals',
        content: formData.immediate_goals,
        icon: <Eye className="w-5 h-5" />
      })
    }

    // Service Areas
    if (formData.service_interest && formData.service_interest.length > 0) {
      sections.push({
        id: 'services',
        title: 'Service Focus Areas',
        content: formData.service_interest,
        icon: <CheckCircle2 className="w-5 h-5" />
      })
    }

    // Current Tools
    if (formData.current_tools) {
      sections.push({
        id: 'tools',
        title: 'Current Tools & Systems',
        content: formData.current_tools,
      })
    }

    return sections
  }

  const planSections = generatePlanSections()

  const handleEdit = (sectionId: string) => {
    onEdit?.(sectionId)
    onClose()
  }

  const handleConfirm = () => {
    onConfirm?.()
  }

  const handleCancel = () => {
    onCancel?.()
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white dark:bg-alira-primary rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-alira-primary/10 dark:border-alira-white/10 bg-gradient-to-r from-alira-gold/10 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-alira-primary dark:text-alira-white">
                  Review Your Plan Preview
                </h2>
                <p className="text-sm text-text-tertiary mt-1">
                  This is what your personalized business plan will include
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-alira-primary/10 dark:hover:bg-alira-primary/20 transition-colors"
                aria-label="Close preview"
              >
                <X className="w-5 h-5 text-text-tertiary" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-4">
              {planSections.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-tertiary">No preview available yet. Please complete the form first.</p>
                </div>
              ) : (
                planSections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-alira-primary/20 dark:border-alira-white/20 hover:border-alira-gold/40 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {section.icon && (
                              <div className="p-2 rounded-lg bg-alira-gold/10 dark:bg-alira-gold/20 text-alira-gold">
                                {section.icon}
                              </div>
                            )}
                            <CardTitle className="text-base font-semibold text-alira-primary dark:text-alira-white">
                              {section.title}
                            </CardTitle>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(section.id)}
                            className="text-xs"
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {Array.isArray(section.content) ? (
                          <ul className="space-y-2">
                            {section.content.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-text-tertiary">
                                <CheckCircle2 className="w-4 h-4 text-alira-gold flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-text-tertiary leading-relaxed whitespace-pre-wrap">
                            {section.content}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 rounded-lg bg-alira-primary/5 dark:bg-alira-primary/20 border border-alira-primary/10 dark:border-alira-white/10">
              <p className="text-xs text-text-tertiary">
                <strong className="text-alira-primary dark:text-alira-white">Note:</strong> Your final plan will include detailed strategies, action items, and recommendations based on these inputs. This is just a preview of the sections that will be included.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-alira-primary/10 dark:border-alira-white/10 bg-white dark:bg-alira-primary flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Go Back
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              className="flex-1 bg-alira-gold text-alira-primary hover:bg-alira-gold/90"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Generate Plan
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

