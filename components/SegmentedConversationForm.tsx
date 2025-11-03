'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
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
import { ArrowUpIcon, Bot, ArrowRight, Edit2, Check, X } from 'lucide-react'
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
  showOptionalFollowUp?: boolean // Track if optional follow-up is being shown
}

interface SegmentedConversationFormProps {
  initialData?: Partial<WizardFormData>
  onComplete: (data: WizardFormData) => Promise<void>
  useAuthenticatedFlow?: boolean
  userId?: string
  skipDraftLoad?: boolean // If true, skip loading drafts (for new plans)
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

// Helper functions for segment-specific thresholds
function getThresholdForSegment(segmentIndex: number): number {
  // Different segments need different detail levels
  const thresholds: Record<number, number> = {
    0: 7, // Business idea - needs good detail
    1: 6, // Challenges - moderate detail okay
    2: 6, // Goals - moderate detail okay
    3: 5  // Services - minimal (selection-based)
  }
  return thresholds[segmentIndex] ?? 7
}

function getMaxLengthForSegment(segmentIndex: number): number {
  // Accept longer responses even if score is lower
  const maxLengths: Record<number, number> = {
    0: 150, // Business idea
    1: 120, // Challenges
    2: 120, // Goals
    3: 50   // Services
  }
  return maxLengths[segmentIndex] ?? 150
}

export default function SegmentedConversationForm({
  initialData,
  onComplete,
  useAuthenticatedFlow = false,
  userId,
  skipDraftLoad = false
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
      data: '',
      showOptionalFollowUp: false
    }))
  })

  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>(initialData?.service_interest || [])
  const [showReview, setShowReview] = useState(false)
  const [isLoadingDraft, setIsLoadingDraft] = useState(true)
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>('')

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
      // Skip draft loading if explicitly requested (for new plans)
      if (skipDraftLoad) {
        setIsLoadingDraft(false)
        initializeFirstQuestion()
        return
      }
      
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

          // Resume from last incomplete segment, or start fresh if all complete
          if (lastIncompleteIndex === -1) {
            // All segments complete - this draft was likely abandoned or user wants new plan
            // Start fresh instead of showing review for old draft
            console.log('Found complete draft - starting fresh instead of showing review')
            initializeFirstQuestion()
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
  }, [useAuthenticatedFlow, userId, skipDraftLoad])

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

      const evalData = await evalResponse.json()
      if (!evalData.success || !evalData.evaluation) {
        throw new Error('Invalid evaluation response')
      }
      const { evaluation } = evalData

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
      // Use smart multi-tier logic with segment-specific thresholds
      const responseLength = messageContent.trim().length
      const segmentThreshold = getThresholdForSegment(currentSegmentIndex)
      const maxLength = getMaxLengthForSegment(currentSegmentIndex)
      
      // Primary check: Use hasEnoughDetail boolean as primary gate
      const definitelyNeedsFollowUp = !evaluation.hasEnoughDetail 
        && evaluation.detailScore < segmentThreshold
        && responseLength < maxLength
        && currentSegment.followUpCount < currentSegment.maxFollowUps
      
      // Optional follow-up check: For "good but could be better" (scores 6-7)
      const optionalFollowUp = evaluation.hasEnoughDetail 
        && evaluation.detailScore >= 6 
        && evaluation.detailScore < 8
        && currentSegment.followUpCount === 0
        && (evaluation.suggestedImprovements?.length ?? 0) > 0
      
      if (definitelyNeedsFollowUp) {
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
          // If follow-up generation fails, just accept the response and move on
          console.warn('Follow-up generation failed, accepting response as-is')
          setSegments(prev => {
            const updated = [...prev]
            updated[currentSegmentIndex].data = messageContent
            updated[currentSegmentIndex].isComplete = true
            return updated
          })
          if (!isLastSegment) {
            // Will show completion screen
          } else {
            setShowReview(true)
          }
          return
        }

        const responseData = await followUpResponse.json()
        if (!responseData.success || !responseData.followUpQuestion) {
          // Invalid response, accept and move on
          console.warn('Invalid follow-up response, accepting answer')
          setSegments(prev => {
            const updated = [...prev]
            updated[currentSegmentIndex].data = messageContent
            updated[currentSegmentIndex].isComplete = true
            return updated
          })
          if (!isLastSegment) {
            // Will show completion screen
          } else {
            setShowReview(true)
          }
          return
        }

        const { followUpQuestion } = responseData

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
      } else if (optionalFollowUp) {
        // Auto-ask optional follow-up (no card interruption)
        const contextForFollowUp = buildContext(currentSegmentIndex)
        try {
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

          if (followUpResponse.ok) {
            const responseData = await followUpResponse.json()
            if (responseData.success && responseData.followUpQuestion) {
              const followUpMessage: Message = {
                id: `msg-followup-opt-${Date.now()}`,
                role: 'assistant',
                content: responseData.followUpQuestion,
                timestamp: new Date()
              }

              setSegments(prev => {
                const updated = [...prev]
                updated[currentSegmentIndex].messages.push(followUpMessage)
                updated[currentSegmentIndex].followUpCount += 1
                return updated
              })
            } else {
              // Fallback: accept response and complete segment
              setSegments(prev => {
                const updated = [...prev]
                updated[currentSegmentIndex].data = messageContent
                updated[currentSegmentIndex].isComplete = true
                return updated
              })
              if (isLastSegment) {
                setShowReview(true)
              }
            }
          } else {
            // Fallback: accept response and complete segment
            setSegments(prev => {
              const updated = [...prev]
              updated[currentSegmentIndex].data = messageContent
              updated[currentSegmentIndex].isComplete = true
              return updated
            })
            if (isLastSegment) {
              setShowReview(true)
            }
          }
        } catch (error) {
          console.error('Error generating optional follow-up:', error)
          // Fallback: accept response and complete segment
          setSegments(prev => {
            const updated = [...prev]
            updated[currentSegmentIndex].data = messageContent
            updated[currentSegmentIndex].isComplete = true
            return updated
          })
          if (isLastSegment) {
            setShowReview(true)
          }
        }
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

  // Auto-scroll when segment completes
  const completionRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (currentSegment.isComplete && currentSegmentIndex < segments.length - 1) {
      // Small delay to ensure completion card is rendered, then scroll to show it and hint at floating button
      setTimeout(() => {
        if (completionRef.current) {
          completionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        // Also scroll a bit more on mobile to show floating button hint
        if (isMobile) {
          setTimeout(() => {
            window.scrollBy({ top: 100, behavior: 'smooth' })
          }, 500)
        }
      }, 300)
    }
  }, [currentSegment.isComplete, currentSegmentIndex, isMobile, segments.length])

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

  // Calculate estimated time remaining (average 2-3 minutes per segment)
  const totalSegments = segments.length
  const estimatedTimeRemaining = useMemo(() => {
    const averageTimePerSegment = 2.5 // minutes
    const remainingSegments = totalSegments - (currentSegmentIndex + 1)
    return Math.ceil(remainingSegments * averageTimePerSegment)
  }, [currentSegmentIndex, totalSegments])

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
          autoSaveState={useAuthenticatedFlow ? {
            isSaving: autoSaveState.isSaving,
            lastSaved: autoSaveState.lastSaved,
            error: autoSaveState.error
          } : undefined}
          estimatedTimeRemaining={estimatedTimeRemaining}
        />

        <div className="flex-1 container mx-auto px-4 sm:px-6 py-6 max-w-5xl">
          <div className={cn(
            "mx-auto",
            isMobile ? "max-w-full" : "max-w-4xl"
          )}>
            {/* Section heading with clear hierarchy */}
            <header className="mb-6">
              <h2 className="text-2xl font-sans font-semibold text-text-primary mb-2">
                {currentSegment.title}
              </h2>
              <p className="text-base text-text-secondary leading-relaxed">
                Which of our service areas would be most valuable to you? Select all that apply.
              </p>
            </header>

            {/* Accessible checkbox group */}
            <fieldset className="space-y-3 mb-8">
              <legend className="sr-only">
                Select service areas of interest. You can select multiple options.
              </legend>
              
              {serviceInterestOptions.map((option, index) => {
                const isSelected = selectedServices.includes(option.value)
                const optionId = `service-option-${option.value}`
                
                return (
                  <label
                    key={option.value}
                    htmlFor={optionId}
                    className={cn(
                      // Base styles - 8px-based padding, minimum 44px touch target
                      'flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer',
                      'transition-all duration-200 min-h-[60px]', // Exceeds 44px minimum for better UX
                      'focus-within:ring-2 focus-within:ring-alira-gold focus-within:ring-offset-2',
                      
                      // Selected state - Clear visual feedback
                      isSelected
                        ? [
                            'border-alira-gold bg-alira-gold/10',
                            'shadow-md shadow-alira-gold/20',
                            'ring-1 ring-alira-gold/20'
                          ]
                        : [
                            // Default state with hover feedback
                            'border-alira-primary/20 dark:border-alira-white/20',
                            'bg-white dark:bg-alira-primary/5',
                            'hover:border-alira-gold/50 hover:bg-alira-gold/5',
                            'hover:shadow-md'
                          ]
                    )}
                    aria-label={`${option.label}${option.description ? ': ' + option.description : ''}`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <Checkbox
                        id={optionId}
                        checked={isSelected}
                        onCheckedChange={() => handleServiceToggle(option.value)}
                        aria-describedby={`${optionId}-description`}
                        className="w-5 h-5" // 20px checkbox with padding = ~44px touch area
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-sans font-medium text-base text-text-primary mb-1">
                        {option.label}
                      </div>
                      {option.description && (
                        <div 
                          id={`${optionId}-description`}
                          className="text-sm text-text-secondary leading-relaxed"
                        >
                          {option.description}
                        </div>
                      )}
                    </div>
                  </label>
                )
              })}
            </fieldset>

            {/* Submit button with clear state feedback */}
            <Button
              onClick={handleServicesComplete}
              disabled={selectedServices.length === 0 || isSubmitting}
              loading={isSubmitting}
              aria-label={
                selectedServices.length === 0 
                  ? "Select at least one service to continue"
                  : isSubmitting
                  ? "Processing your selection"
                  : `Continue with ${selectedServices.length} service${selectedServices.length === 1 ? '' : 's'} selected`
              }
              aria-busy={isSubmitting}
              className={cn(
                'w-full min-h-[52px] font-medium',
                'bg-gradient-to-br from-alira-gold to-[#7a5000] text-alira-primary',
                'hover:from-[#c79000] hover:to-alira-gold',
                'focus-visible:ring-2 focus-visible:ring-alira-gold focus-visible:ring-offset-2',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'disabled:hover:from-alira-gold disabled:hover:to-[#7a5000]'
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span>Processing...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Continue</span>
                  <ArrowUpIcon className="w-4 h-4" aria-hidden="true" />
                </span>
              )}
            </Button>
            
            {/* Helper text for selection count */}
            {selectedServices.length > 0 && (
              <p className="mt-3 text-sm text-text-tertiary text-center" role="status" aria-live="polite">
                {selectedServices.length} service{selectedServices.length === 1 ? '' : 's'} selected
              </p>
            )}
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
          autoSaveState={useAuthenticatedFlow ? {
            isSaving: autoSaveState.isSaving,
            lastSaved: autoSaveState.lastSaved,
            error: autoSaveState.error
          } : undefined}
          estimatedTimeRemaining={0}
        />

        <div className="flex-1 container mx-auto px-4 sm:px-6 py-6 max-w-5xl">
          <div className={cn(
            "mx-auto",
            isMobile ? "max-w-full" : "max-w-4xl"
          )}>
            {/* Review section header */}
            <header className="mb-8">
              <h2 className="text-2xl font-sans font-semibold text-text-primary mb-2">
                Review Your Answers
              </h2>
              <p className="text-base text-text-secondary leading-relaxed">
                Please review your answers before we generate your personalized business plan.
              </p>
            </header>

            {/* Review cards with proper semantic structure */}
            <div className="space-y-4 mb-8" role="region" aria-label="Your answers review">
              {segments.slice(0, 3).map((segment, index) => {
                const isEditing = editingSegmentId === segment.id
                return (
                  <motion.article
                    key={segment.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="bg-alira-primary/5 dark:bg-alira-primary/10 rounded-xl p-5 lg:p-6 border border-alira-primary/10 dark:border-alira-white/10 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-sans font-semibold text-base text-text-primary flex items-center gap-2">
                        <span 
                          className="w-2 h-2 rounded-full bg-alira-gold flex-shrink-0" 
                          aria-hidden="true"
                        />
                        {segment.title}
                      </h3>
                      {!isEditing ? (
                        <button
                          onClick={() => {
                            setEditingSegmentId(segment.id)
                            setEditValue(segment.data)
                          }}
                          className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-alira-gold transition-colors px-2 py-1 rounded-md hover:bg-alira-primary/5 dark:hover:bg-alira-primary/10"
                          aria-label={`Edit your answer for ${segment.title}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span className={cn(isMobile && "hidden")}>Edit</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              // Save edited answer
                              setSegments(prev => {
                                const updated = [...prev]
                                const segmentIndex = updated.findIndex(s => s.id === segment.id)
                                if (segmentIndex !== -1) {
                                  updated[segmentIndex].data = editValue.trim()
                                }
                                return updated
                              })
                              setEditingSegmentId(null)
                              setEditValue('')
                            }}
                            className="flex items-center justify-center w-8 h-8 rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors"
                            aria-label="Save changes"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingSegmentId(null)
                              setEditValue('')
                            }}
                            className="flex items-center justify-center w-8 h-8 rounded-md bg-text-tertiary/20 hover:bg-text-tertiary/30 transition-colors"
                            aria-label="Cancel editing"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    {isEditing ? (
                      <Textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full min-h-[100px] text-sm resize-none"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setEditingSegmentId(null)
                            setEditValue('')
                          }
                        }}
                      />
                    ) : (
                      <p className="text-sm text-text-secondary leading-relaxed pl-4">
                        {segment.data}
                      </p>
                    )}
                  </motion.article>
                )
              })}

              {/* Services selection review */}
              <motion.article
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.15 }}
                className="bg-alira-primary/5 dark:bg-alira-primary/10 rounded-xl p-5 lg:p-6 border border-alira-primary/10 dark:border-alira-white/10 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="font-sans font-semibold text-base text-text-primary mb-3 flex items-center gap-2">
                  <span 
                    className="w-2 h-2 rounded-full bg-alira-gold flex-shrink-0"
                    aria-hidden="true"
                  />
                  Services of Interest
                </h3>
                <div className="flex flex-wrap gap-2 pl-4" role="list" aria-label="Selected services">
                  {selectedServices.map((service) => {
                    const option = serviceInterestOptions.find(o => o.value === service)
                    return (
                      <span
                        key={service}
                        role="listitem"
                        className="px-3 py-1.5 bg-alira-gold/20 text-alira-primary rounded-full text-sm font-medium shadow-sm border border-alira-gold/30"
                      >
                        {option?.label || service}
                      </span>
                    )
                  })}
                </div>
              </motion.article>
            </div>

            {/* Submit button with proper accessibility */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              loading={isSubmitting}
              aria-label={isSubmitting ? "Generating your business plan, please wait" : "Generate my business plan"}
              aria-busy={isSubmitting}
              className={cn(
                'w-full min-h-[52px] text-base font-semibold',
                'bg-gradient-to-br from-alira-gold to-[#7a5000] text-alira-primary',
                'hover:from-[#c79000] hover:to-alira-gold',
                'focus-visible:ring-2 focus-visible:ring-alira-gold focus-visible:ring-offset-2',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'disabled:hover:from-alira-gold disabled:hover:to-[#7a5000]',
                'shadow-lg hover:shadow-xl hover:shadow-alira-gold/30'
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span>Generating Your Business Plan...</span>
                </span>
              ) : (
                <span>Generate My Business Plan</span>
              )}
            </Button>
            
            {/* Processing status message */}
            {isSubmitting && (
              <p 
                className="text-center text-sm text-text-tertiary mt-4" 
                role="status" 
                aria-live="polite"
                aria-atomic="true"
              >
                This may take a few moments. Please do not close this page.
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
        autoSaveState={useAuthenticatedFlow ? {
          isSaving: autoSaveState.isSaving,
          lastSaved: autoSaveState.lastSaved,
          error: autoSaveState.error
        } : undefined}
        estimatedTimeRemaining={estimatedTimeRemaining}
      />

      {/* Messages - Better layout structure */}
      <div className="flex-1 overflow-y-auto">
        <div className={cn(
          "mx-auto transition-all duration-300",
          // Optimized container widths with 8px-based spacing
          isMobile 
            ? "w-full px-4 py-4" // 16px padding = 2x 8px grid
            : "max-w-3xl px-6 lg:px-8 py-6 lg:py-8" // 24px/32px padding on desktop
        )}>
          {/* Show completion if segment just completed - 8px-based spacing */}
          {currentSegment.isComplete && currentSegmentIndex < segments.length - 1 && (
            <div ref={completionRef} className="mb-6">
              <SegmentCompletion
                segmentTitle={currentSegment.title}
                summary={`We've gathered enough detail about ${currentSegment.title.toLowerCase()}. Ready to move on?`}
                onContinue={moveToNextSegment}
              />
            </div>
          )}

          {/* Messages Container - 8px-based vertical rhythm */}
          <div 
            className={cn(
              "space-y-4", // 16px = 2x 8px grid unit for clear message separation
              !isMobile && "space-y-5" // 20px on desktop for slightly more breathing room
            )}
            role="log"
            aria-live="polite"
            aria-label="Conversation messages"
          >
            <AnimatePresence>
              {currentSegment.messages.map((message) => (
                <div key={message.id} className="w-full">
                  <MessageBubble
                    role={message.role}
                    content={message.content}
                    timestamp={message.timestamp}
                  />
                </div>
              ))}
            </AnimatePresence>
          </div>

          {/* AI Processing indicator */}
          {isEvaluating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 mt-3"
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-alira-primary/20 dark:bg-alira-primary/80 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-alira-primary dark:text-alira-white animate-pulse" />
                </div>
              </div>
              <div className={cn(
                "rounded-2xl rounded-bl-sm px-4 py-3 bg-alira-primary/10 dark:bg-alira-primary/80 border border-alira-primary/20 dark:border-alira-white/20",
                isMobile ? "max-w-[85%]" : "max-w-[65%] md:max-w-[70%]"
              )}>
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

          <div ref={messagesEndRef} className="h-2" />
        </div>
      </div>

      {/* Floating Continue Button - Shows when segment is complete */}
      {currentSegment.isComplete && currentSegmentIndex < segments.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed left-1/2 transform -translate-x-1/2 z-50 px-4 w-full mx-auto",
            isMobile ? "bottom-4 pb-safe" : "bottom-6",
            !isMobile && "max-w-sm"
          )}
          style={isMobile ? { paddingBottom: 'env(safe-area-inset-bottom)' } : {}}
        >
          <Button
            onClick={moveToNextSegment}
            className={cn(
              'w-full bg-alira-gold text-alira-primary hover:bg-alira-gold/90',
              'shadow-2xl shadow-alira-gold/30',
              'font-medium rounded-xl transition-all',
              'active:scale-95',
              !isMobile && 'hover:scale-105',
              isMobile 
                ? 'text-base py-4 px-5 min-h-[52px]' // Larger mobile touch target
                : 'text-base py-4 px-6'
            )}
          >
            Continue to Next Section
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      )}

      {/* Input area - Hidden when segment is complete - Better alignment */}
      {!currentSegment.isComplete && (
        <div className="sticky bottom-0 bg-bg-page/98 backdrop-blur-md border-t border-borderToken-subtle safe-area-inset-bottom shadow-2xl">
          <div className={cn(
            "mx-auto transition-all duration-300",
            // Match message container width for perfect alignment
            isMobile 
              ? "w-full px-4 py-4" 
              : "max-w-3xl px-6 lg:px-8 py-4 lg:py-5"
          )}>
            {/* Form with proper accessibility and semantic structure */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleUserMessage(inputValue)
              }}
              className={cn(
                "flex flex-col gap-3", // Vertical stack on mobile, cleaner spacing
                !isMobile && "flex-row items-end gap-4" // Horizontal on desktop
              )}
              aria-label="Answer input form"
              noValidate
            >
              {/* Input wrapper with label and helper text */}
              <div className="flex-1 relative">
                {/* Visually hidden label for screen readers */}
                <label
                  htmlFor="conversation-input"
                  className="sr-only"
                >
                  Type your answer
                </label>
                
                <Textarea
                  id="conversation-input"
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
                  placeholder={isEvaluating ? "AI is analyzing your response..." : "Type your answer here..."}
                  rows={isMobile ? 3 : 4}
                  disabled={isEvaluating}
                  aria-invalid="false"
                  aria-describedby={isEvaluating ? "analyzing-helper" : inputValue.trim() ? "submit-helper" : "input-helper"}
                  aria-label="Your answer"
                  autoComplete="off"
                  autoFocus={false}
                  className={cn(
                    // Base styles - 8px-based padding for consistency
                    'flex-1 resize-none rounded-xl border-2 transition-all duration-200',
                    'min-h-[44px]', // Minimum touch target (44px)
                    'text-base leading-relaxed', // 16px base to prevent iOS zoom, comfortable line-height
                    'focus:outline-none', // Remove default outline, use custom focus ring
                    
                    // State-specific styles - Clear visual feedback for each state
                    isEvaluating 
                      ? [
                          // Disabled/processing state
                          'bg-alira-primary/5 dark:bg-alira-primary/40',
                          'border-alira-primary/20 dark:border-alira-white/10',
                          'cursor-wait',
                          'placeholder:text-text-tertiary/50',
                          'opacity-75'
                        ]
                      : [
                          // Default/interactive state
                          'bg-white dark:bg-alira-primary/90',
                          'border-alira-primary/20 dark:border-alira-white/20',
                          'placeholder:text-text-tertiary',
                          'focus:border-alira-gold focus:ring-2 focus:ring-alira-gold/20 focus:ring-offset-2',
                          'hover:border-alira-primary/40 dark:hover:border-alira-white/40',
                          'disabled:opacity-50 disabled:cursor-not-allowed'
                        ],
                    
                    // Responsive padding - 8px grid system
                    isMobile 
                      ? 'px-4 py-3' // 16px/12px = 4px grid
                      : 'px-5 py-4', // 20px/16px = 4px grid
                  )}
                />
                
                {/* Helper text for screen readers and visual users */}
                <div id="input-helper" className="sr-only">
                  {isEvaluating 
                    ? "AI is analyzing your response, please wait"
                    : "Type your answer and press Enter to submit, or Shift+Enter for a new line"
                  }
                </div>
                
                {isEvaluating && (
                  <div id="analyzing-helper" className="sr-only" role="status" aria-live="polite">
                    Analyzing your response
                  </div>
                )}
                
                {/* Submit helper - screen reader only */}
                {!isEvaluating && inputValue.trim() && (
                  <div id="submit-helper" className="sr-only" role="status" aria-live="polite">
                    Press Enter to send, or Shift+Enter for a new line
                  </div>
                )}
                
                {/* Word count feedback - subtle guidance */}
                {!isEvaluating && inputValue.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-5 left-0 text-[11px] text-text-tertiary"
                  >
                    {(() => {
                      const wordCount = inputValue.trim().split(/\s+/).filter(w => w.length > 0).length
                      const charCount = inputValue.trim().length
                      
                      // Provide encouraging feedback based on length
                      if (wordCount >= 20 && charCount >= 150) {
                        return <span className="text-green-600 dark:text-green-400">Good detail ✓</span>
                      } else if (wordCount >= 10) {
                        return `${wordCount} words`
                      } else {
                        return `${charCount} characters`
                      }
                    })()}
                  </motion.div>
                )}
              </div>
              
              {/* Submit button with proper accessibility */}
              <Button
                type="submit"
                disabled={!inputValue.trim() || isEvaluating}
                aria-label={isEvaluating ? "Processing your answer" : inputValue.trim() ? "Submit your answer" : "Submit button disabled"}
                aria-busy={isEvaluating}
                className={cn(
                  // Base button styles - ensure 44px minimum touch target
                  'rounded-xl font-medium transition-all duration-200',
                  'min-w-[52px] min-h-[52px]', // 52px exceeds 44px minimum for better usability
                  'flex-shrink-0', // Prevent button from shrinking
                  
                  // Visual states with clear feedback
                  'bg-gradient-to-br from-alira-gold to-[#7a5000] text-alira-primary',
                  'hover:from-[#c79000] hover:to-alira-gold',
                  'focus-visible:ring-2 focus-visible:ring-alira-gold focus-visible:ring-offset-2',
                  'active:scale-[0.97]', // Subtle press feedback
                  
                  // Disabled state
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'disabled:hover:from-alira-gold disabled:hover:to-[#7a5000]',
                  
                  // Desktop enhancements - subtle hover effects
                  !isMobile && [
                    'hover:shadow-lg hover:shadow-alira-gold/30',
                    'hover:-translate-y-0.5' // Subtle lift on hover
                  ],
                  
                  // Mobile: maintain large touch target without hover effects
                  isMobile && 'touch-manipulation' // Optimize for touch
                )}
              >
                {isEvaluating ? (
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <ArrowUpIcon className="w-5 h-5 opacity-50" />
                    </motion.div>
                    <span className="sr-only">Processing</span>
                  </div>
                ) : (
                  <ArrowUpIcon 
                    className="w-5 h-5 transition-transform" 
                    aria-hidden="true"
                  />
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

