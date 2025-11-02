'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { MessageBubble } from './MessageBubble'
import { SegmentProgress } from './SegmentProgress'
import { SegmentCompletion } from './SegmentCompletion'
import { useMobile, useSwipe } from '@/hooks/use-mobile'
import { useMobileKeyboard } from '@/hooks/use-mobile-keyboard'
import { useAutoSave } from '@/hooks/use-auto-save'
import { createClient } from '@/lib/supabase-client'
import { cn } from '@/lib/utils'
import { ArrowUpIcon, Bot } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import type { ResponseEvaluation } from '@/lib/ai-conversation'
import type { WizardFormData } from '@/lib/schema'
import { serviceInterestOptions } from '@/lib/schema'
import type { IndustryType, BusinessStageType } from '@/lib/business-case-methodology'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ConversationSegment {
  id: string
  title: string
  initialQuestion: string
  isComplete: boolean
  messages: Message[]
  context: {
    industry?: IndustryType
    stage?: BusinessStageType
    inferredFrom?: string[]
  }
  evaluation?: ResponseEvaluation
  followUpCount: number
  maxFollowUps: number
  data: string // Final answer for this segment
}

interface SegmentedConversationFormProps {
  initialData?: Partial<WizardFormData>
  onComplete: (data: WizardFormData) => Promise<void>
  useAuthenticatedFlow?: boolean
  userId?: string
}

// Simple industry inference from text
function inferIndustry(text: string): IndustryType {
  const lower = text.toLowerCase()
  if (lower.includes('saas') || lower.includes('software') || lower.includes('app') || lower.includes('tech') || lower.includes('platform') || lower.includes('api')) {
    return 'tech_saas'
  }
  if (lower.includes('shop') || lower.includes('store') || lower.includes('retail') || lower.includes('ecommerce') || lower.includes('e-commerce') || lower.includes('product') || lower.includes('sell')) {
    return 'retail_ecommerce'
  }
  if (lower.includes('service') || lower.includes('consulting') || lower.includes('agency') || lower.includes('freelance') || lower.includes('client')) {
    return 'service'
  }
  return 'other'
}

// Simple stage inference from text
function inferBusinessStage(text: string): BusinessStageType {
  const lower = text.toLowerCase()
  if (lower.includes('idea') || lower.includes('starting') || lower.includes('planning') || lower.includes('concept')) {
    return 'idea'
  }
  if (lower.includes('established') || lower.includes('mature') || lower.includes('years') || lower.includes('existing')) {
    return 'established'
  }
  if (lower.includes('growing') || lower.includes('scaling') || lower.includes('expanding') || lower.includes('growth')) {
    return 'growing'
  }
  return 'early'
}

const SEGMENT_DEFINITIONS = [
  {
    id: 'business_idea',
    title: 'Your Business',
    initialQuestion: "Let's start with the basics. What's your business idea or current venture?",
    maxFollowUps: 3
  },
  {
    id: 'challenges',
    title: 'Current Challenges',
    initialQuestion: "Now, what are your biggest operational challenges right now?",
    maxFollowUps: 3
  },
  {
    id: 'goals',
    title: 'Your Goals',
    initialQuestion: "What do you want to achieve in the next 3-6 months?",
    maxFollowUps: 3
  },
  {
    id: 'services',
    title: 'How We Can Help',
    type: 'selection' as const,
    initialQuestion: 'Which of our service areas would be most valuable to you?',
    maxFollowUps: 0
  }
]

export default function SegmentedConversationForm({
  initialData,
  onComplete,
  useAuthenticatedFlow = false,
  userId
}: SegmentedConversationFormProps) {
  const [segments, setSegments] = useState<ConversationSegment[]>(() => {
    return SEGMENT_DEFINITIONS.map(def => ({
      id: def.id,
      title: def.title,
      initialQuestion: def.initialQuestion || '',
      isComplete: false,
      messages: [] as Message[],
      context: {},
      followUpCount: 0,
      maxFollowUps: def.maxFollowUps,
      data: ''
    }))
  })

  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>(initialData?.service_interest || [])
  const [showReview, setShowReview] = useState(false)
  const [isLoadingDraft, setIsLoadingDraft] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const isMobile = useMobile()

  const currentSegment = segments[currentSegmentIndex]
  const isServicesSegment = currentSegment.id === 'services'
  const isLastSegment = currentSegmentIndex === segments.length - 1

  // Mobile keyboard auto-scroll
  useMobileKeyboard(inputRef, { enabled: isMobile, offset: 120 })

  // Swipe gestures for mobile
  const swipeHandlers = useSwipe(
    () => {
      // Swipe left = next (disabled in conversation)
    },
    () => {
      // Swipe right = previous (disabled in conversation)
    }
  )

  // Load draft on mount
  useEffect(() => {
    const loadDraft = async () => {
      if (!useAuthenticatedFlow || !userId) {
        setIsLoadingDraft(false)
        initializeFirstQuestion()
        return
      }

      try {
        const supabase = createClient()
        
        // Find the most recent draft dashboard
        const { data: draftDashboard, error } = await supabase
          .from('dashboards')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'draft')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (error) {
          console.error('Error loading draft:', error)
          setIsLoadingDraft(false)
          initializeFirstQuestion()
          return
        }

        if (draftDashboard?.form_data) {
          const draftFormData = draftDashboard.form_data as any
          
          // Restore segment data
          const restoredSegments = [...segments]
          let lastIncompleteIndex = -1

          // Restore Segment 1 (business_idea)
          if (draftFormData.business_idea) {
            restoredSegments[0].data = draftFormData.business_idea
            restoredSegments[0].isComplete = true
            
            // Reconstruct messages for completed segments
            restoredSegments[0].messages = [
              {
                id: `msg-init-${Date.now()}`,
                role: 'assistant',
                content: restoredSegments[0].initialQuestion,
                timestamp: new Date()
              },
              {
                id: `msg-user-${Date.now()}`,
                role: 'user',
                content: draftFormData.business_idea,
                timestamp: new Date()
              }
            ]

            // Infer context from business idea
            restoredSegments[0].context = {
              industry: inferIndustry(draftFormData.business_idea),
              stage: inferBusinessStage(draftFormData.business_idea),
              inferredFrom: ['business_idea']
            }
          } else {
            lastIncompleteIndex = 0
          }

          // Restore Segment 2 (challenges)
          if (draftFormData.current_challenges) {
            restoredSegments[1].data = draftFormData.current_challenges
            restoredSegments[1].isComplete = true
            
            restoredSegments[1].messages = [
              {
                id: `msg-init-${Date.now()}-1`,
                role: 'assistant',
                content: restoredSegments[1].initialQuestion,
                timestamp: new Date()
              },
              {
                id: `msg-user-${Date.now()}-1`,
                role: 'user',
                content: draftFormData.current_challenges,
                timestamp: new Date()
              }
            ]
            
            // Inherit context from segment 1
            if (restoredSegments[0].context.industry) {
              restoredSegments[1].context.industry = restoredSegments[0].context.industry
            }
            if (restoredSegments[0].context.stage) {
              restoredSegments[1].context.stage = restoredSegments[0].context.stage
            }
          } else if (lastIncompleteIndex === -1) {
            lastIncompleteIndex = 1
          }

          // Restore Segment 3 (goals)
          if (draftFormData.immediate_goals) {
            restoredSegments[2].data = draftFormData.immediate_goals
            restoredSegments[2].isComplete = true
            
            restoredSegments[2].messages = [
              {
                id: `msg-init-${Date.now()}-2`,
                role: 'assistant',
                content: restoredSegments[2].initialQuestion,
                timestamp: new Date()
              },
              {
                id: `msg-user-${Date.now()}-2`,
                role: 'user',
                content: draftFormData.immediate_goals,
                timestamp: new Date()
              }
            ]
            
            // Inherit context from previous segments
            if (restoredSegments[0].context.industry) {
              restoredSegments[2].context.industry = restoredSegments[0].context.industry
            }
            if (restoredSegments[0].context.stage) {
              restoredSegments[2].context.stage = restoredSegments[0].context.stage
            }
          } else if (lastIncompleteIndex === -1) {
            lastIncompleteIndex = 2
          }

          // Restore Segment 4 (services)
          if (draftFormData.service_interest && Array.isArray(draftFormData.service_interest)) {
            setSelectedServices(draftFormData.service_interest)
            restoredSegments[3].data = draftFormData.service_interest.join(', ')
            restoredSegments[3].isComplete = true
          } else if (lastIncompleteIndex === -1) {
            lastIncompleteIndex = 3
          }

          // Restore business_stage if available
          if (draftFormData.business_stage && restoredSegments[0].context) {
            restoredSegments[0].context.stage = draftFormData.business_stage as BusinessStageType
          }

          setSegments(restoredSegments)

          // Resume from last incomplete segment, or show review if all complete
          if (lastIncompleteIndex === -1) {
            // All segments complete, show review
            setShowReview(true)
            setCurrentSegmentIndex(segments.length - 1)
          } else {
            // Resume from incomplete segment
            setCurrentSegmentIndex(lastIncompleteIndex)
            
            // Initialize question for current segment if no messages
            if (restoredSegments[lastIncompleteIndex].messages.length === 0) {
              const initialMessage: Message = {
                id: `msg-init-${Date.now()}`,
                role: 'assistant',
                content: restoredSegments[lastIncompleteIndex].initialQuestion,
                timestamp: new Date()
              }
              
              setSegments(prev => {
                const updated = [...prev]
                updated[lastIncompleteIndex].messages = [initialMessage]
                return updated
              })
            }
          }
        } else {
          // No draft found, initialize normally
          initializeFirstQuestion()
        }
      } catch (error) {
        console.error('Error loading draft:', error)
        initializeFirstQuestion()
      } finally {
        setIsLoadingDraft(false)
      }
    }

    loadDraft()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useAuthenticatedFlow, userId])

  // Handle user sending a message (defined early for use in initialization)
  const handleUserMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isEvaluating) return

    const userMessage: Message = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: messageContent.trim(),
      timestamp: new Date()
    }

    // Add user message
    setSegments(prev => {
      const updated = [...prev]
      updated[currentSegmentIndex].messages.push(userMessage)
      return updated
    })

    setInputValue('')
    setIsEvaluating(true)

    try {
      // Get context for evaluation
      const context = buildContext(currentSegmentIndex)
      const currentQuestion = currentSegment.messages.find(m => m.role === 'assistant')?.content || currentSegment.initialQuestion

      // Evaluate response via API
      const evalResponse = await fetch('/api/ai/evaluate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          userResponse: messageContent,
          context: {
            businessIdea: context.businessIdea,
            previousAnswers: context.previousAnswers
          }
        })
      })

      if (!evalResponse.ok) {
        throw new Error('Failed to evaluate response')
      }

      const { evaluation } = await evalResponse.json()

      // Update segment with evaluation
      setSegments(prev => {
        const updated = [...prev]
        updated[currentSegmentIndex].evaluation = evaluation
        return updated
      })

      // Update context with inferred industry/stage if this is first segment
      if (currentSegmentIndex === 0) {
        const industry = inferIndustry(messageContent)
        const stage = inferBusinessStage(messageContent)
        setSegments(prev => {
          const updated = [...prev]
          updated[0].context = {
            industry,
            stage,
            inferredFrom: ['business_idea']
          }
          return updated
        })
      }

      // Check if we need a follow-up or can move on
      if (evaluation.detailScore < 8 && currentSegment.followUpCount < currentSegment.maxFollowUps) {
        // Need follow-up question via API
        const contextForFollowUp = buildContext(currentSegmentIndex)
        const followUpResponse = await fetch('/api/ai/generate-follow-up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            originalQuestion: currentQuestion,
            userResponse: messageContent,
            context: {
              industry: contextForFollowUp.industry,
              businessStage: contextForFollowUp.businessStage,
              businessIdea: contextForFollowUp.businessIdea,
              previousAnswers: contextForFollowUp.previousAnswers
            }
          })
        })

        if (!followUpResponse.ok) {
          throw new Error('Failed to generate follow-up question')
        }

        const { followUpQuestion } = await followUpResponse.json()

        // Add follow-up question
        const followUpMessage: Message = {
          id: `msg-followup-${Date.now()}`,
          role: 'assistant',
          content: followUpQuestion,
          timestamp: new Date()
        }

        setSegments(prev => {
          const updated = [...prev]
          updated[currentSegmentIndex].messages.push(followUpMessage)
          updated[currentSegmentIndex].followUpCount += 1
          return updated
        })
      } else {
        // Enough detail - complete this segment
        setSegments(prev => {
          const updated = [...prev]
          updated[currentSegmentIndex].data = messageContent
          updated[currentSegmentIndex].isComplete = true
          return updated
        })

        // Last segment complete - show review immediately
        if (isLastSegment) {
          setShowReview(true)
        }
        // Otherwise, show completion component and wait for user to click continue
      }
    } catch (error) {
      console.error('Error evaluating response:', error)
      // Fallback: accept the response and move on
      setSegments(prev => {
        const updated = [...prev]
        updated[currentSegmentIndex].data = messageContent
        updated[currentSegmentIndex].isComplete = true
        return updated
      })
      if (!isLastSegment) {
        setTimeout(() => {
          moveToNextSegment()
        }, 1500)
      } else {
        setShowReview(true)
      }
    } finally {
      setIsEvaluating(false)
    }
  }

  // Initialize first question (helper function)
  const initializeFirstQuestion = useCallback(() => {
    setSegments(prev => {
      if (prev[0]?.messages.length === 0) {
        const updated = [...prev]
        // Add initial question
        const initialMessage: Message = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: updated[0].initialQuestion,
          timestamp: new Date()
        }
        updated[0].messages = [initialMessage]
        return updated
      }
      return prev
    })

    // If we have initial data (business_idea from homepage), process it after a delay
    if (initialData?.business_idea) {
      setTimeout(() => {
        // Manually process initial business idea since handleUserMessage may not be ready
        setSegments(prev => {
          const updated = [...prev]
          if (updated[0].messages.length > 0) {
            const userMessage: Message = {
              id: `msg-user-init-${Date.now()}`,
              role: 'user',
              content: initialData.business_idea!,
              timestamp: new Date()
            }
            updated[0].messages.push(userMessage)
            updated[0].data = initialData.business_idea!
            updated[0].isComplete = true // Mark as complete since it came from homepage
            
            // Infer context
            updated[0].context = {
              industry: inferIndustry(initialData.business_idea!),
              stage: inferBusinessStage(initialData.business_idea!),
              inferredFrom: ['business_idea']
            }
          }
          return updated
        })
        
        // Then move to next segment after processing
        setTimeout(() => {
          setCurrentSegmentIndex(1)
          setSegments(prev => {
            const updated = [...prev]
            if (updated[1].messages.length === 0) {
              updated[1].messages = [{
                id: `msg-init-${Date.now()}-1`,
                role: 'assistant',
                content: updated[1].initialQuestion,
                timestamp: new Date()
              }]
            }
            return updated
          })
        }, 1500)
      }, 800)
    }
  }, [initialData])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentSegment.messages, isEvaluating])

  // Auto-save integration
  const formDataForAutoSave: Partial<WizardFormData> = {
    business_idea: segments[0].data || undefined,
    current_challenges: segments[1].data || undefined,
    immediate_goals: segments[2].data || undefined,
    service_interest: selectedServices,
    business_stage: segments[0].context.stage || undefined
  }

  const autoSaveState = useAutoSave({
    enabled: useAuthenticatedFlow && !!userId,
    userId: userId,
    formData: formDataForAutoSave,
    currentStep: currentSegmentIndex + 1,
    intervalMs: 30000
  })

  // Build context from all previous segments (defined early)
  const buildContext = useCallback((segmentIndex: number) => {
    const previousAnswers: Record<string, string> = {}
    let detectedIndustry: IndustryType | undefined
    let detectedStage: BusinessStageType | undefined

    // Collect answers from previous segments
    for (let i = 0; i < segmentIndex; i++) {
      const seg = segments[i]
      if (seg.data) {
        if (seg.id === 'business_idea') {
          previousAnswers.business_idea = seg.data
          // Infer from first segment
          detectedIndustry = inferIndustry(seg.data)
          detectedStage = inferBusinessStage(seg.data)
        } else if (seg.id === 'challenges') {
          previousAnswers.current_challenges = seg.data
        } else if (seg.id === 'goals') {
          previousAnswers.immediate_goals = seg.data
        }
      }
    }

    // Also check current segment for industry/stage inference
    if (currentSegment.data && currentSegmentIndex === 0) {
      detectedIndustry = inferIndustry(currentSegment.data)
      detectedStage = inferBusinessStage(currentSegment.data)
    }

    return {
      businessIdea: previousAnswers.business_idea,
      previousAnswers,
      industry: detectedIndustry,
      businessStage: detectedStage
    }
  }, [segments, currentSegment, currentSegmentIndex])


  // Move to next segment
  const moveToNextSegment = () => {
    if (currentSegmentIndex < segments.length - 1) {
      const nextIndex = currentSegmentIndex + 1
      setCurrentSegmentIndex(nextIndex)

      // Initialize next segment with initial question
      const nextSegment = segments[nextIndex]
      if (nextSegment.messages.length === 0) {
        const initialMessage: Message = {
          id: `msg-init-${Date.now()}`,
          role: 'assistant',
          content: nextSegment.initialQuestion,
          timestamp: new Date()
        }

        setSegments(prev => {
          const updated = [...prev]
          updated[nextIndex].messages = [initialMessage]
          return updated
        })
      }
    }
  }

  // Handle services selection
  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => {
      if (prev.includes(service)) {
        return prev.filter(s => s !== service)
      } else {
        return [...prev, service]
      }
    })
  }

  // Handle services segment completion
  const handleServicesComplete = () => {
    if (selectedServices.length === 0) return

    setSegments(prev => {
      const updated = [...prev]
      updated[currentSegmentIndex].isComplete = true
      updated[currentSegmentIndex].data = selectedServices.join(', ')
      return updated
    })

    setShowReview(true)
  }

  // Submit form
  const handleSubmit = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const formData: WizardFormData = {
        business_idea: segments[0].data,
        current_challenges: segments[1].data,
        immediate_goals: segments[2].data,
        service_interest: selectedServices,
        current_tools: '',
        consent: true, // Assumed for authenticated flow
        business_stage: segments[0].context.stage || 'early'
      }

      await onComplete(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error submitting your form. Please try again.')
      setIsSubmitting(false)
    }
  }

  // Show loading state while loading draft
  if (isLoadingDraft) {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="gold" />
          <p className="mt-4 text-text-secondary">Loading your progress...</p>
        </div>
      </div>
    )
  }

  // Render services selection segment
  if (isServicesSegment && !showReview) {
    return (
      <div className="min-h-screen bg-bg-page flex flex-col" {...swipeHandlers}>
        <SegmentProgress
          segments={segments.map(s => ({ id: s.id, title: s.title, isComplete: s.isComplete }))}
          currentIndex={currentSegmentIndex}
          totalSegments={segments.length}
        />

        <div className="flex-1 container mx-auto px-4 sm:px-6 py-6 max-w-4xl">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-sans font-medium text-text-primary mb-2">
              {currentSegment.title}
            </h2>
            <p className="text-text-secondary mb-6">
              Which of our service areas would be most valuable to you? Select all that apply.
            </p>

            <div className="space-y-3 mb-6">
              {serviceInterestOptions.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all shadow-sm',
                    selectedServices.includes(option.value)
                      ? 'border-alira-gold bg-alira-gold/10 shadow-md'
                      : 'border-alira-primary/20 dark:border-alira-white/20 hover:border-alira-gold/50 hover:shadow-md'
                  )}
                >
                  <Checkbox
                    checked={selectedServices.includes(option.value)}
                    onCheckedChange={() => handleServiceToggle(option.value)}
                  />
                  <div className="flex-1">
                    <div className="font-sans font-medium text-text-primary">
                      {option.label}
                    </div>
                    {option.description && (
                      <div className="text-sm text-text-tertiary mt-1">
                        {option.description}
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>

            <Button
              onClick={handleServicesComplete}
              disabled={selectedServices.length === 0 || isSubmitting}
              loading={isSubmitting}
              className="w-full bg-alira-gold text-alira-primary hover:bg-alira-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Continue'}
              {!isSubmitting && <ArrowUpIcon className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Render review screen
  if (showReview) {
    return (
      <div className="min-h-screen bg-bg-page flex flex-col">
        <SegmentProgress
          segments={segments.map(s => ({ id: s.id, title: s.title, isComplete: s.isComplete }))}
          currentIndex={segments.length - 1}
          totalSegments={segments.length}
        />

        <div className="flex-1 container mx-auto px-4 sm:px-6 py-6 max-w-4xl">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-sans font-medium text-text-primary mb-2">
              Review Your Answers
            </h2>
            <p className="text-text-secondary mb-6">
              Please review your answers before we generate your personalized business plan.
            </p>

            <div className="space-y-4 mb-6">
              {segments.slice(0, 3).map((segment) => (
                <motion.div
                  key={segment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-alira-primary/5 dark:bg-alira-primary/10 rounded-xl p-5 border border-alira-primary/10 dark:border-alira-white/10 shadow-sm"
                >
                  <h3 className="font-sans font-medium text-text-primary mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-alira-gold"></span>
                    {segment.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed pl-3.5">
                    {segment.data}
                  </p>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-alira-primary/5 dark:bg-alira-primary/10 rounded-xl p-5 border border-alira-primary/10 dark:border-alira-white/10 shadow-sm"
              >
                <h3 className="font-sans font-medium text-text-primary mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-alira-gold"></span>
                  Services of Interest
                </h3>
                <div className="flex flex-wrap gap-2 pl-3.5">
                  {selectedServices.map((service) => {
                    const option = serviceInterestOptions.find(o => o.value === service)
                    return (
                      <span
                        key={service}
                        className="px-3 py-1.5 bg-alira-gold/20 text-alira-primary rounded-full text-sm font-medium shadow-sm"
                      >
                        {option?.label || service}
                      </span>
                    )
                  })}
                </div>
              </motion.div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              loading={isSubmitting}
              className="w-full bg-alira-gold text-alira-primary hover:bg-alira-gold/90 disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px] text-base font-medium"
            >
              {isSubmitting ? 'Generating Your Business Plan...' : 'Generate My Business Plan'}
            </Button>
            
            {isSubmitting && (
              <p className="text-center text-sm text-text-tertiary mt-3">
                This may take a few moments...
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Render conversation segment
  return (
    <div className="min-h-screen bg-bg-page flex flex-col" {...swipeHandlers}>
      <SegmentProgress
        segments={segments.map(s => ({ id: s.id, title: s.title, isComplete: s.isComplete }))}
        currentIndex={currentSegmentIndex}
        totalSegments={segments.length}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto container mx-auto px-4 sm:px-6 py-6 max-w-4xl">
        <div className="max-w-2xl mx-auto">
          {/* Show completion if segment just completed */}
          {currentSegment.isComplete && currentSegmentIndex < segments.length - 1 && (
            <SegmentCompletion
              segmentTitle={currentSegment.title}
              summary={`We've gathered enough detail about ${currentSegment.title.toLowerCase()}. Ready to move on?`}
              onContinue={moveToNextSegment}
            />
          )}

          {/* Messages */}
          <AnimatePresence>
            {currentSegment.messages.map((message) => (
              <MessageBubble
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
          </AnimatePresence>

          {/* AI Processing indicator */}
          {isEvaluating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 mb-4"
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-alira-primary/20 dark:bg-alira-primary/80 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-alira-primary dark:text-alira-white animate-pulse" />
                </div>
              </div>
              <div className="max-w-[70%] sm:max-w-[75%] rounded-2xl rounded-bl-sm px-4 py-3 bg-alira-primary/10 dark:bg-alira-primary/80 border border-alira-primary/20 dark:border-alira-white/20">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-alira-primary/70 dark:text-alira-white/70">Analyzing your response</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-alira-gold"
                        animate={{
                          y: [0, -4, 0],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="sticky bottom-0 bg-bg-page/95 backdrop-blur-sm border-t border-borderToken-subtle px-4 sm:px-6 py-4 safe-area-inset-bottom">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleUserMessage(inputValue)
            }}
            className="flex items-end gap-3"
          >
            <Textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (inputValue.trim() && !isEvaluating) {
                    handleUserMessage(inputValue)
                  }
                }
              }}
              placeholder={isEvaluating ? "AI is analyzing..." : "Type your answer here..."}
              rows={isMobile ? 3 : 2}
              disabled={isEvaluating}
              className={cn(
                'flex-1 resize-none rounded-xl border-2 transition-all',
                isEvaluating 
                  ? 'bg-alira-primary/5 dark:bg-alira-primary/40 border-alira-primary/20 dark:border-alira-white/10 cursor-wait placeholder:text-alira-primary/30'
                  : 'bg-alira-primary/10 dark:bg-alira-primary/80 border-alira-primary/20 dark:border-alira-white/20 placeholder:text-alira-primary/40 dark:placeholder:text-alira-white/40 focus:border-alira-gold focus:ring-2 focus:ring-alira-gold/20',
                'text-alira-primary dark:text-alira-white',
                'text-base focus:outline-none', // Prevent zoom on iOS
                isMobile && 'text-base' // Ensure 16px+ on mobile
              )}
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isEvaluating}
              className={cn(
                'rounded-xl bg-alira-gold text-alira-primary hover:bg-alira-gold/90',
                'min-w-[44px] min-h-[44px]', // Mobile touch target
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <ArrowUpIcon className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

