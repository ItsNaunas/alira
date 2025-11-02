'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import { conversionEvents } from '@/lib/analytics'
import { wizardFormSchema, type WizardFormData, serviceInterestOptions, currentToolsOptions, businessStages } from '@/lib/schema'
import { getChallengesQuestion, getGoalsQuestion, type BusinessStage } from '@/lib/conditional-questions'
import { getUserFriendlyError, errorMessages } from '@/lib/error-messages'
import { cn, evaluateAnswerQuality, getQualityColorClass, getQualityLabel, type AnswerQuality } from '@/lib/utils'
import { FormProgress } from './ui/form-progress'
import { FormSuccess } from './ui/form-success'
import { InlineError } from './ui/error-state'
import { ExampleTemplate } from './ExampleTemplate'
import { SmartSuggestions } from './SmartSuggestions'
import { FileUpload } from './FileUpload'
import { ExitIntentModal } from './ExitIntentModal'
import { ContextualHelp } from './ContextualHelp'
import { CompletionPreview } from './CompletionPreview'
import { useMobile, useSwipe, useVoiceInput } from '@/hooks/use-mobile'
import { useAutoSave } from '@/hooks/use-auto-save'
import { useMobileKeyboard } from '@/hooks/use-mobile-keyboard'
import { Mic, MicOff, Eye } from 'lucide-react'
import { useRef } from 'react'

interface FormWizardProps {
  resumeToken?: string
  initialData?: any
  draftId?: string
  // Optional callback for custom submission handling (used for authenticated flows)
  onComplete?: (data: WizardFormData) => Promise<void>
  // If true, skips draft-based flow and uses onComplete directly
  useAuthenticatedFlow?: boolean
  // User ID for authenticated users (used for auto-save)
  userId?: string
}

export default function FormWizard({ resumeToken, initialData, draftId: propDraftId, onComplete, useAuthenticatedFlow = false, userId }: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [draftId, setDraftId] = useState<string | null>(propDraftId || null)
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [draftData, setDraftData] = useState<any>(null)
  const [collectedFormData, setCollectedFormData] = useState<Partial<WizardFormData>>({})
  const [answerQuality, setAnswerQuality] = useState<{
    business_idea?: AnswerQuality
    current_challenges?: AnswerQuality
    immediate_goals?: AnswerQuality
  }>({})
  const [voiceInputActive, setVoiceInputActive] = useState<string | null>(null)
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [restoredDashboardId, setRestoredDashboardId] = useState<string | null>(null)

  // Refs for mobile keyboard auto-scroll
  const businessIdeaRef = useRef<HTMLTextAreaElement>(null)
  const challengesRef = useRef<HTMLTextAreaElement>(null)
  const goalsRef = useRef<HTMLTextAreaElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  // Mobile detection
  const isMobile = useMobile()

  // Mobile keyboard auto-scroll
  useMobileKeyboard(businessIdeaRef, { enabled: isMobile, offset: 120 })
  useMobileKeyboard(challengesRef, { enabled: isMobile, offset: 120 })
  useMobileKeyboard(goalsRef, { enabled: isMobile, offset: 120 })
  useMobileKeyboard(emailRef, { enabled: isMobile, offset: 120 })

  // Swipe gestures for mobile navigation
  const swipeHandlers = useSwipe(
    () => {
      // Swipe left = next step
      if (currentStep < 4) {
        nextStep()
      }
    },
    () => {
      // Swipe right = previous step
      if (currentStep > 1) {
        prevStep()
      }
    }
  )

  // Voice input for current field
  const currentFieldName = currentStep === 1 ? 'business_idea' : currentStep === 2 ? 'current_challenges' : currentStep === 3 ? 'immediate_goals' : null

  const voiceInput = useVoiceInput(
    (text) => {
      if (currentFieldName) {
        const currentValue = watchedValues[currentFieldName] || ''
        setValue(currentFieldName as keyof WizardFormData, `${currentValue} ${text}`.trim())
        setVoiceInputActive(null)
      }
    },
    (error) => {
      console.error('Voice input error:', error)
      setVoiceInputActive(null)
    }
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger
  } = useForm<WizardFormData>({
    resolver: zodResolver(wizardFormSchema),
    defaultValues: initialData || {}
  })

  const watchedValues = watch()

  // Auto-save for authenticated users
  const autoSaveState = useAutoSave({
    enabled: useAuthenticatedFlow && !!userId,
    userId: userId,
    formData: {
      ...watchedValues,
      ...collectedFormData
    },
    currentStep,
    initialDashboardId: restoredDashboardId,
    onSaveStart: () => {
      // Optional: could show a subtle "Saving..." indicator
    },
    onSaveComplete: () => {
      // Optional: could show a brief "Saved" confirmation
    },
    onSaveError: (error) => {
      // Silently log errors - don't interrupt user flow
      console.error('Auto-save failed:', error)
    }
  })

  // Animation variants for smooth transitions
  const stepVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -50, scale: 0.95 }
  }

  const progressVariants = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1 }
  }

  const loadDraft = useCallback(async (token: string) => {
    try {
      const response = await fetch(`/api/draft/resume/${token}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setDraftId(result.draft.id)
          setDraftData(result.draft) // Store the full draft data
          setCurrentStep(result.draft.step)
          // Populate form with existing data
          Object.keys(result.draft.data || {}).forEach(key => {
            setValue(key as keyof WizardFormData, result.draft.data[key])
          })
          
          // Store the loaded data in collectedFormData
          setCollectedFormData(result.draft.data || {})
          
          // Pre-fill business idea from homepage if available
          if (result.draft.data?.mini_idea_one_liner) {
            setValue('business_idea', result.draft.data.mini_idea_one_liner)
          }
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error)
    }
  }, [setValue])

  // Load draft data if resume token provided
  useEffect(() => {
    if (resumeToken && !initialData) {
      loadDraft(resumeToken)
    }
  }, [resumeToken, initialData, loadDraft])

  // Load draft for authenticated users from dashboards
  const loadAuthenticatedDraft = useCallback(async () => {
    if (!useAuthenticatedFlow || !userId) return

    try {
      const { createClient } = await import('@/lib/supabase-client')
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
        console.error('Error loading authenticated draft:', error)
        return
      }

      if (draftDashboard?.form_data) {
        const draftFormData = draftDashboard.form_data as any
        
        // Restore form state
        if (draftFormData.currentStep) {
          setCurrentStep(draftFormData.currentStep)
        }
        
        // Populate form fields
        Object.keys(draftFormData).forEach(key => {
          if (key !== 'currentStep' && key !== 'lastSaved') {
            setValue(key as keyof WizardFormData, draftFormData[key])
          }
        })
        
        // Store in collectedFormData
        setCollectedFormData(draftFormData)
        
        // Store dashboard ID so auto-save can use it
        setRestoredDashboardId(draftDashboard.id)
        
        console.log('Restored draft from dashboard:', draftDashboard.id)
      } else {
        console.log('No draft found for authenticated user')
      }
    } catch (error) {
      console.error('Error loading authenticated draft:', error)
    }
  }, [useAuthenticatedFlow, userId, setValue])

  // Load authenticated draft on mount
  useEffect(() => {
    if (useAuthenticatedFlow && userId && !initialData && !resumeToken) {
      loadAuthenticatedDraft()
    }
  }, [useAuthenticatedFlow, userId, initialData, resumeToken, loadAuthenticatedDraft])

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is moving upward (toward top of page)
      if (e.clientY <= 0 && (watchedValues.business_idea || watchedValues.current_challenges || watchedValues.immediate_goals)) {
        setShowExitIntent(true)
        conversionEvents.exitIntentTriggered(currentStep, true)
      }
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only show if user has entered data
      if (watchedValues.business_idea || watchedValues.current_challenges || watchedValues.immediate_goals) {
        // Modern browsers ignore custom messages
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [watchedValues.business_idea, watchedValues.current_challenges, watchedValues.immediate_goals])

  // Save draft with email
  const handleExitIntentSave = async (email: string) => {
    try {
      conversionEvents.exitIntentSaved(currentStep)
      let currentDraftId = draftId

      // Create or update draft
      if (!currentDraftId) {
        const createResponse = await fetch('/api/draft/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: draftData?.name || email.split('@')[0],
            email: email,
            data: {
              ...collectedFormData,
              business_idea: watchedValues.business_idea,
              current_challenges: watchedValues.current_challenges,
              immediate_goals: watchedValues.immediate_goals,
              business_stage: watchedValues.business_stage
            },
            step: currentStep
          })
        })

        if (createResponse.ok) {
          const result = await createResponse.json()
          currentDraftId = result.id
          setDraftId(currentDraftId)
        }
      } else {
        // Update existing draft
        await fetch('/api/draft/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: currentDraftId,
            email: email,
            data: {
              ...collectedFormData,
              business_idea: watchedValues.business_idea,
              current_challenges: watchedValues.current_challenges,
              immediate_goals: watchedValues.immediate_goals,
              business_stage: watchedValues.business_stage
            },
            step: currentStep
          })
        })
      }

      // Send resume link email
      await fetch('/api/draft/send-resume-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftId: currentDraftId,
          email: email
        })
      })
    } catch (error) {
      console.error('Error saving draft on exit intent:', error)
      throw error
    }
  }


  const nextStep = async () => {
    // Validate only the current step's fields
    let fieldsToValidate: (keyof WizardFormData)[] = []
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['business_idea']
        break
      case 2:
        fieldsToValidate = ['current_challenges']
        break
      case 3:
        fieldsToValidate = ['immediate_goals']
        break
      case 4:
        fieldsToValidate = ['service_interest', 'current_tools', 'consent']
        break
    }
    
    const isValid = await trigger(fieldsToValidate)
    console.log('Validation result for step', currentStep, ':', isValid)
    console.log('Fields to validate:', fieldsToValidate)
    console.log('Current form values:', watchedValues)
    
    if (isValid) {
      if (currentStep < 4) {
        // Collect current step's data before moving to next step
        const currentStepData: Partial<WizardFormData> = {}
        
        switch (currentStep) {
          case 1:
            currentStepData.business_idea = watchedValues.business_idea
            currentStepData.business_stage = watchedValues.business_stage
            break
          case 2:
            currentStepData.current_challenges = watchedValues.current_challenges
            break
          case 3:
            currentStepData.immediate_goals = watchedValues.immediate_goals
            break
        }
        
        // Store the collected data
        setCollectedFormData(prev => ({ ...prev, ...currentStepData }))
        
        // Don't clear the form fields - keep them for the final submission
        // The data is already stored in collectedFormData
        
        setCurrentStep(currentStep + 1)
        conversionEvents.stepView(`step_${currentStep + 1}`)
      } else if (currentStep === 4) {
        // On step 4, collect final step data and submit
        console.log('Step 4 validation passed, triggering form submission')
        
        // Collect final step data
        const finalStepData: Partial<WizardFormData> = {
          service_interest: watchedValues.service_interest,
          current_tools: watchedValues.current_tools,
          consent: watchedValues.consent
        }
        
        // Combine all collected data
        const completeFormData = { ...collectedFormData, ...finalStepData }
        
        // Ensure all required fields are present
        const validatedFormData: WizardFormData = {
          business_idea: completeFormData.business_idea || '',
          business_stage: completeFormData.business_stage,
          current_challenges: completeFormData.current_challenges || '',
          immediate_goals: completeFormData.immediate_goals || '',
          service_interest: completeFormData.service_interest || [],
          consent: completeFormData.consent || false,
          name: completeFormData.name,
          email: completeFormData.email,
          current_tools: completeFormData.current_tools
        }
        
        console.log('Complete form data for submission:', validatedFormData)
        console.log('Current challenges:', validatedFormData.current_challenges)
        console.log('Immediate goals:', validatedFormData.immediate_goals)
        
        await onSubmit(validatedFormData)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      // Restore the data for the previous step when going back
      const prevStep = currentStep - 1
      
      switch (prevStep) {
        case 1:
          if (collectedFormData.business_idea) {
            setValue('business_idea', collectedFormData.business_idea)
          }
          if (collectedFormData.business_stage) {
            setValue('business_stage', collectedFormData.business_stage)
          }
          break
        case 2:
          if (collectedFormData.current_challenges) {
            setValue('current_challenges', collectedFormData.current_challenges)
          }
          break
        case 3:
          if (collectedFormData.immediate_goals) {
            setValue('immediate_goals', collectedFormData.immediate_goals)
          }
          break
      }
      
      setCurrentStep(prevStep)
    }
  }

  const onSubmit = async (data: WizardFormData) => {
    console.log('=== FORM SUBMISSION STARTED ===')
    console.log('Form submitted with data:', data)
    console.log('Form errors:', errors)
    console.log('Current step:', currentStep)
    console.log('Draft data:', draftData)
    console.log('Use authenticated flow:', useAuthenticatedFlow)
    
    setIsSubmitting(true)
    try {
      // If using authenticated flow with custom onComplete handler
      if (useAuthenticatedFlow && onComplete) {
        console.log('✅ Using authenticated flow, calling onComplete...')
        conversionEvents.formCompleted('wizard_form')
        await onComplete(data)
        return
      }
      
      // Default draft-based flow (original behavior)
      // Check if we have required user data
      if (!draftData?.name || !draftData?.email) {
        console.log('❌ Missing user data, showing alert')
        alert(errorMessages.required('contact information'))
        return
      }
      
      console.log('✅ User data present, starting form submission...')
      console.log('Name:', draftData.name)
      console.log('Email:', draftData.email)
      
      let currentDraftId = draftId

      // Create a draft if one doesn't exist
      if (!currentDraftId) {
        console.log('📝 Creating new draft...')
        const createResponse = await fetch('/api/draft/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: draftData.name,
            email: draftData.email,
            data: {
              mini_idea_one_liner: data.business_idea?.substring(0, 100) || ''
            }
          }),
        })

        if (!createResponse.ok) {
          throw new Error('Failed to create draft')
        }

        const createResult = await createResponse.json()
        currentDraftId = createResult.id
        setDraftId(currentDraftId)
      }

      // Save the form data
      console.log('💾 Saving form data to draft:', currentDraftId)
      console.log('💾 Form data being saved:', JSON.stringify(data, null, 2))
      console.log('💾 Data keys:', Object.keys(data || {}))
      console.log('💾 current_challenges:', data?.current_challenges)
      console.log('💾 immediate_goals:', data?.immediate_goals)
      
      const response = await fetch('/api/draft/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: currentDraftId,
          data
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Save error:', errorData)
        throw new Error(errorData.error || 'Failed to save form')
      }

      console.log('🎯 Form completed, triggering plan generation...')
      conversionEvents.formCompleted('wizard_form')
      
      // Generate and send plan directly
      await generateAndSendPlan(currentDraftId!, draftData.email!)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(getUserFriendlyError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateAndSendPlan = async (draftId: string, email: string) => {
    console.log('🚀 Starting plan generation for draft:', draftId, 'email:', email)
    setIsGeneratingPlan(true)
    try {
      console.log('📡 Calling /api/draft/submit...')
      const response = await fetch('/api/draft/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: draftId,
          email: email
        }),
      })

      console.log('📊 Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Plan generation failed:', errorData)
        throw new Error(errorData.error || 'Failed to generate plan')
      }

      const result = await response.json()
      console.log('✅ Plan generation successful:', result)
      
      // Show success state
      setIsSuccess(true)
      
      // Reset form after a delay
      setTimeout(() => {
        setShowEmailGate(false)
        setCurrentStep(1)
        setDraftId(null)
        setIsSuccess(false)
      }, 5000)
    } catch (error) {
      console.error('Error generating plan:', error)
      alert(getUserFriendlyError(error))
    } finally {
      setIsGeneratingPlan(false)
    }
  }

  const handleEmailGateSubmit = async (email: string) => {
    await generateAndSendPlan(draftId!, email)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        const hasPreFilledIdea = draftData?.data?.mini_idea_one_liner
        return (
          <div className="space-y-6">
            {hasPreFilledIdea && (
              <div className="inline-flex items-center gap-2 rounded-lg border border-alira-primary/20 dark:border-alira-white/20 bg-alira-primary/10 dark:bg-alira-primary/80 px-3 py-1.5 text-xs text-alira-primary/80 dark:text-alira-white/80">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                We pre-filled this from the homepage. You can edit it.
              </div>
            )}
            
            {/* File Upload Option */}
            <FileUpload
              onExtractComplete={(extractedData) => {
                const extractedCount = Object.keys(extractedData).filter(k => extractedData[k as keyof typeof extractedData]).length
                conversionEvents.fileUploadCompleted('document', extractedCount)
                
                if (extractedData.business_idea) {
                  setValue('business_idea', extractedData.business_idea)
                  const quality = evaluateAnswerQuality(extractedData.business_idea, 10)
                  setAnswerQuality(prev => ({ ...prev, business_idea: quality.quality }))
                }
                if (extractedData.current_challenges) {
                  // Store for step 2
                  setCollectedFormData(prev => ({ ...prev, current_challenges: extractedData.current_challenges }))
                }
                if (extractedData.immediate_goals) {
                  // Store for step 3
                  setCollectedFormData(prev => ({ ...prev, immediate_goals: extractedData.immediate_goals }))
                }
              }}
              onError={(error) => {
                console.error('File upload error:', error)
                conversionEvents.fileUploadFailed('document', error)
              }}
              className="mb-4"
            />
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="business_idea" className="block text-sm md:text-base font-light text-alira-primary/90 dark:text-alira-white/90">
                  What is your business idea or current venture?
                </label>
                <div className="flex items-center gap-2">
                  <ContextualHelp 
                    fieldId="business_idea"
                    onClick={() => conversionEvents.helpIconClicked('business_idea')}
                  />
                  <ExampleTemplate 
                    questionId="business_idea" 
                    onFillExample={(content) => setValue('business_idea', content)}
                  />
                </div>
              </div>
              <div className="relative">
                <Textarea
                  id="business_idea"
                  {...register('business_idea', {
                    onChange: (e) => {
                      const quality = evaluateAnswerQuality(e.target.value, 10)
                      setAnswerQuality(prev => ({ ...prev, business_idea: quality.quality }))
                    }
                  })}
                  ref={(e) => {
                    const { ref } = register('business_idea')
                    ref(e)
                    businessIdeaRef.current = e
                  }}
                  placeholder="e.g., a marketing agency that helps creators launch offers"
                  rows={isMobile ? 6 : 4}
                  inputMode="text"
                  autoComplete="organization"
                  className={cn(
                    "w-full rounded-xl border bg-alira-primary/10 dark:bg-alira-primary/80 px-4 py-3 text-alira-primary dark:text-alira-white placeholder:text-alira-primary/40 dark:placeholder:text-alira-white/40 focus:border-alira-gold focus:outline-none focus:ring-2 focus:ring-alira-gold/20 transition-all duration-200 resize-none",
                    isMobile && "text-base", // Larger text on mobile for better readability
                    errors.business_idea 
                      ? "border-red-500 dark:border-red-400 ring-2 ring-red-500/20" 
                      : "border-alira-primary/20 dark:border-alira-white/20"
                  )}
                  aria-invalid={errors.business_idea ? "true" : "false"}
                  aria-describedby={errors.business_idea ? "business_idea-error" : "business_idea-hint"}
                />
                {/* Voice Input Button (Mobile) */}
                {isMobile && voiceInput.isSupported && (
                  <button
                    type="button"
                    onClick={() => {
                      if (voiceInputActive === 'business_idea') {
                        voiceInput.stopListening()
                        setVoiceInputActive(null)
                      } else {
                        voiceInput.startListening()
                        setVoiceInputActive('business_idea')
                      }
                    }}
                    className={cn(
                      "absolute bottom-4 right-4 p-2 rounded-lg transition-colors",
                      voiceInputActive === 'business_idea'
                        ? "bg-red-500 text-white"
                        : "bg-alira-gold/20 text-alira-gold hover:bg-alira-gold/30"
                    )}
                    aria-label="Voice input"
                  >
                    {voiceInputActive === 'business_idea' ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
              
              {/* Smart Suggestions */}
              <SmartSuggestions
                fieldName="business_idea"
                currentValue={watchedValues.business_idea || ''}
                businessStage={watchedValues.business_stage as BusinessStage}
                businessIdea={watchedValues.business_idea}
                onSuggestionClick={(suggestion) => {
                  const currentValue = watchedValues.business_idea || ''
                  const newValue = currentValue.trim() 
                    ? `${currentValue} ${suggestion}`.trim()
                    : suggestion
                  setValue('business_idea', newValue)
                  const quality = evaluateAnswerQuality(newValue, 10)
                  setAnswerQuality(prev => ({ ...prev, business_idea: quality.quality }))
                }}
              />
              
              {/* Answer Quality Indicator */}
              {watchedValues.business_idea && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-2 sm:p-3 rounded-lg bg-alira-primary/5 dark:bg-alira-white/5 border border-alira-primary/10 dark:border-alira-white/10 flex items-center justify-between text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "px-2 py-1 rounded-md font-medium text-xs sm:text-sm",
                      getQualityColorClass(answerQuality.business_idea || 'needs_more')
                    )}>
                      {getQualityLabel(answerQuality.business_idea || 'needs_more')}
                    </div>
                    <span className="text-alira-primary/60 dark:text-alira-white/60">
                      {watchedValues.business_idea.length} characters
                    </span>
                  </div>
                  {evaluateAnswerQuality(watchedValues.business_idea || '', 10).suggestions.length > 0 && (
                    <div className="hidden sm:flex flex-wrap gap-1">
                      {evaluateAnswerQuality(watchedValues.business_idea || '', 10).suggestions.slice(0, 1).map((suggestion, idx) => (
                        <span key={idx} className="text-alira-primary/50 dark:text-alira-white/50 italic text-xs">
                          {suggestion}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
              
              <div id="business_idea-hint" className="mt-4 rounded-xl border border-alira-primary/20 dark:border-alira-white/20 bg-alira-primary/5 dark:bg-alira-primary/80 p-4">
                <p className="text-xs md:text-sm text-alira-primary/75 dark:text-alira-white/75">
                  <span className="mr-2">💡</span>
                  Example: "A SaaS for freelancers to manage projects" or "A service helping restaurants set up online ordering"
                </p>
              </div>
              
              {errors.business_idea && (
                <motion.p 
                  id="business_idea-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "mt-2 font-medium text-red-500 dark:text-red-400 flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800",
                    isMobile ? "text-base" : "text-sm"
                  )}
                  role="alert"
                >
                  <svg className={cn("flex-shrink-0", isMobile ? "w-5 h-5 mt-0.5" : "w-4 h-4")} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="flex-1">{errors.business_idea.message}</span>
                </motion.p>
              )}
            </div>

            {/* Business Stage Selection */}
            <div>
              <label className="block text-sm md:text-base font-light text-alira-primary/90 dark:text-alira-white/90 mb-3">
                What stage is your business at? (Optional - helps us tailor questions)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {businessStages.map((stage) => (
                  <label 
                    key={stage.value} 
                    className={cn(
                      "flex items-center space-x-2 cursor-pointer p-3 border rounded-lg transition-all",
                      watchedValues.business_stage === stage.value
                        ? "border-alira-gold bg-alira-gold/10 dark:bg-alira-gold/20"
                        : "border-alira-primary/20 dark:border-alira-white/20 hover:border-alira-gold/40 dark:hover:border-alira-gold/60"
                    )}
                  >
                    <input
                      type="radio"
                      value={stage.value}
                      {...register('business_stage', {
                        onChange: () => {
                          conversionEvents.businessStageSelected(stage.value)
                        }
                      })}
                      className="rounded border-alira-primary/20 dark:border-alira-white/30"
                    />
                    <span className="text-xs md:text-sm text-alira-primary dark:text-alira-white">{stage.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        // Infer industry from business idea for conditional questions (simple keyword matching)
        const businessIdeaLower = (watchedValues.business_idea || '').toLowerCase()
        const inferredIndustry: 'tech_saas' | 'retail_ecommerce' | 'service' | 'other' = 
          businessIdeaLower.includes('app') || businessIdeaLower.includes('software') || 
          businessIdeaLower.includes('saas') || businessIdeaLower.includes('platform') || 
          businessIdeaLower.includes('tool') || businessIdeaLower.includes('tech') ? 'tech_saas' :
          businessIdeaLower.includes('sell') || businessIdeaLower.includes('product') || 
          businessIdeaLower.includes('shop') || businessIdeaLower.includes('store') || 
          businessIdeaLower.includes('retail') || businessIdeaLower.includes('fashion') || 
          businessIdeaLower.includes('clothing') || businessIdeaLower.includes('ecommerce') ? 'retail_ecommerce' :
          businessIdeaLower.includes('service') || businessIdeaLower.includes('consult') || 
          businessIdeaLower.includes('agency') || businessIdeaLower.includes('coach') || 
          businessIdeaLower.includes('freelance') ? 'service' : 'other'
        
        const challengesQuestion = getChallengesQuestion(watchedValues.business_stage as BusinessStage, inferredIndustry)
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="current_challenges" className="block text-sm md:text-base font-light text-alira-primary/90 dark:text-alira-white/90">
                  {challengesQuestion.label}
                </label>
                <div className="flex items-center gap-2">
                  <ContextualHelp 
                    fieldId="current_challenges"
                    onClick={() => conversionEvents.helpIconClicked('current_challenges')}
                  />
                  <ExampleTemplate 
                    questionId="current_challenges" 
                    onFillExample={(content) => setValue('current_challenges', content)}
                  />
                </div>
              </div>
              <div className="relative">
                <Textarea
                  id="current_challenges"
                  {...register('current_challenges', {
                    onChange: (e) => {
                      const quality = evaluateAnswerQuality(e.target.value, 10)
                      setAnswerQuality(prev => ({ ...prev, current_challenges: quality.quality }))
                    }
                  })}
                  ref={(e) => {
                    const { ref } = register('current_challenges')
                    ref(e)
                    challengesRef.current = e
                  }}
                  placeholder={challengesQuestion.placeholder}
                  rows={isMobile ? 6 : 4}
                  inputMode="text"
                  className={cn(
                    "w-full rounded-xl border bg-alira-primary/10 dark:bg-alira-primary/80 px-4 py-3 text-alira-primary dark:text-alira-white placeholder:text-alira-primary/40 dark:placeholder:text-alira-white/40 focus:border-alira-gold focus:outline-none focus:ring-2 focus:ring-alira-gold/20 transition-all duration-200 resize-none",
                    isMobile && "text-base",
                    errors.current_challenges 
                      ? "border-red-500 dark:border-red-400 ring-2 ring-red-500/20" 
                      : "border-alira-primary/20 dark:border-alira-white/20"
                  )}
                  aria-invalid={errors.current_challenges ? "true" : "false"}
                  aria-describedby={errors.current_challenges ? "current_challenges-error" : "current_challenges-hint"}
                />
                {/* Voice Input Button (Mobile) */}
                {isMobile && voiceInput.isSupported && (
                  <button
                    type="button"
                    onClick={() => {
                      if (voiceInputActive === 'current_challenges') {
                        voiceInput.stopListening()
                        setVoiceInputActive(null)
                      } else {
                        voiceInput.startListening()
                        setVoiceInputActive('current_challenges')
                      }
                    }}
                    className={cn(
                      "absolute bottom-4 right-4 p-2 rounded-lg transition-colors",
                      voiceInputActive === 'current_challenges'
                        ? "bg-red-500 text-white"
                        : "bg-alira-gold/20 text-alira-gold hover:bg-alira-gold/30"
                    )}
                    aria-label="Voice input"
                  >
                    {voiceInputActive === 'current_challenges' ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
              
              {/* Smart Suggestions */}
              <SmartSuggestions
                fieldName="current_challenges"
                currentValue={watchedValues.current_challenges || ''}
                businessStage={watchedValues.business_stage as BusinessStage}
                businessIdea={watchedValues.business_idea}
                onSuggestionClick={(suggestion) => {
                  const currentValue = watchedValues.current_challenges || ''
                  const newValue = currentValue.trim() 
                    ? `${currentValue} ${suggestion}`.trim()
                    : suggestion
                  setValue('current_challenges', newValue)
                  const quality = evaluateAnswerQuality(newValue, 10)
                  setAnswerQuality(prev => ({ ...prev, current_challenges: quality.quality }))
                }}
              />
              
              {/* Answer Quality Indicator */}
              {watchedValues.current_challenges && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-2 sm:p-3 rounded-lg bg-alira-primary/5 dark:bg-alira-white/5 border border-alira-primary/10 dark:border-alira-white/10 flex items-center justify-between text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "px-2 py-1 rounded-md font-medium text-xs sm:text-sm",
                      getQualityColorClass(answerQuality.current_challenges || 'needs_more')
                    )}>
                      {getQualityLabel(answerQuality.current_challenges || 'needs_more')}
                    </div>
                    <span className="text-alira-primary/60 dark:text-alira-white/60">
                      {watchedValues.current_challenges.length} characters
                    </span>
                  </div>
                  {evaluateAnswerQuality(watchedValues.current_challenges || '', 10).suggestions.length > 0 && (
                    <div className="hidden sm:flex flex-wrap gap-1">
                      {evaluateAnswerQuality(watchedValues.current_challenges || '', 10).suggestions.slice(0, 1).map((suggestion, idx) => (
                        <span key={idx} className="text-alira-primary/50 dark:text-alira-white/50 italic text-xs">
                          {suggestion}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
              
              <div id="current_challenges-hint" className="mt-4 rounded-xl border border-alira-primary/20 dark:border-alira-white/20 bg-alira-primary/5 dark:bg-alira-primary/80 p-4">
                <p className="text-xs md:text-sm text-alira-primary/75 dark:text-alira-white/75">
                  <span className="mr-2">{challengesQuestion.hintIcon}</span>
                  {challengesQuestion.hint}
                </p>
              </div>
              {errors.current_challenges && (
                <motion.p 
                  id="current_challenges-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "mt-2 font-medium text-red-500 dark:text-red-400 flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800",
                    isMobile ? "text-base" : "text-sm"
                  )}
                  role="alert"
                >
                  <svg className={cn("flex-shrink-0", isMobile ? "w-5 h-5 mt-0.5" : "w-4 h-4")} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="flex-1">{errors.current_challenges.message}</span>
                </motion.p>
              )}
            </div>
          </div>
        )

      case 3:
        // Infer industry from business idea for conditional questions (reuse same logic)
        const businessIdeaLowerGoals = (watchedValues.business_idea || '').toLowerCase()
        const inferredIndustryGoals: 'tech_saas' | 'retail_ecommerce' | 'service' | 'other' = 
          businessIdeaLowerGoals.includes('app') || businessIdeaLowerGoals.includes('software') || 
          businessIdeaLowerGoals.includes('saas') || businessIdeaLowerGoals.includes('platform') || 
          businessIdeaLowerGoals.includes('tool') || businessIdeaLowerGoals.includes('tech') ? 'tech_saas' :
          businessIdeaLowerGoals.includes('sell') || businessIdeaLowerGoals.includes('product') || 
          businessIdeaLowerGoals.includes('shop') || businessIdeaLowerGoals.includes('store') || 
          businessIdeaLowerGoals.includes('retail') || businessIdeaLowerGoals.includes('fashion') || 
          businessIdeaLowerGoals.includes('clothing') || businessIdeaLowerGoals.includes('ecommerce') ? 'retail_ecommerce' :
          businessIdeaLowerGoals.includes('service') || businessIdeaLowerGoals.includes('consult') || 
          businessIdeaLowerGoals.includes('agency') || businessIdeaLowerGoals.includes('coach') || 
          businessIdeaLowerGoals.includes('freelance') ? 'service' : 'other'
        
        const goalsQuestion = getGoalsQuestion(watchedValues.business_stage as BusinessStage, inferredIndustryGoals)
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="immediate_goals" className="block text-sm md:text-base font-light text-alira-primary/90 dark:text-alira-white/90">
                  {goalsQuestion.label}
                </label>
                <div className="flex items-center gap-2">
                  <ContextualHelp 
                    fieldId="immediate_goals"
                    onClick={() => conversionEvents.helpIconClicked('immediate_goals')}
                  />
                  <ExampleTemplate 
                    questionId="immediate_goals" 
                    onFillExample={(content) => setValue('immediate_goals', content)}
                  />
                </div>
              </div>
              <div className="relative">
                <Textarea
                  id="immediate_goals"
                  {...register('immediate_goals', {
                    onChange: (e) => {
                      const quality = evaluateAnswerQuality(e.target.value, 10)
                      setAnswerQuality(prev => ({ ...prev, immediate_goals: quality.quality }))
                    }
                  })}
                  ref={(e) => {
                    const { ref } = register('immediate_goals')
                    ref(e)
                    goalsRef.current = e
                  }}
                  placeholder={goalsQuestion.placeholder}
                  rows={isMobile ? 6 : 4}
                  inputMode="text"
                  className={cn(
                    "w-full rounded-xl border bg-alira-primary/10 dark:bg-alira-primary/80 px-4 py-3 text-alira-primary dark:text-alira-white placeholder:text-alira-primary/40 dark:placeholder:text-alira-white/40 focus:border-alira-gold focus:outline-none focus:ring-2 focus:ring-alira-gold/20 transition-all duration-200 resize-none",
                    isMobile && "text-base",
                    errors.immediate_goals 
                      ? "border-red-500 dark:border-red-400 ring-2 ring-red-500/20" 
                      : "border-alira-primary/20 dark:border-alira-white/20"
                  )}
                  aria-invalid={errors.immediate_goals ? "true" : "false"}
                  aria-describedby={errors.immediate_goals ? "immediate_goals-error" : "immediate_goals-hint"}
                />
                {/* Voice Input Button (Mobile) */}
                {isMobile && voiceInput.isSupported && (
                  <button
                    type="button"
                    onClick={() => {
                      if (voiceInputActive === 'immediate_goals') {
                        voiceInput.stopListening()
                        setVoiceInputActive(null)
                      } else {
                        voiceInput.startListening()
                        setVoiceInputActive('immediate_goals')
                      }
                    }}
                    className={cn(
                      "absolute bottom-4 right-4 p-2 rounded-lg transition-colors",
                      voiceInputActive === 'immediate_goals'
                        ? "bg-red-500 text-white"
                        : "bg-alira-gold/20 text-alira-gold hover:bg-alira-gold/30"
                    )}
                    aria-label="Voice input"
                  >
                    {voiceInputActive === 'immediate_goals' ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
              
              {/* Smart Suggestions */}
              <SmartSuggestions
                fieldName="immediate_goals"
                currentValue={watchedValues.immediate_goals || ''}
                businessStage={watchedValues.business_stage as BusinessStage}
                businessIdea={watchedValues.business_idea}
                industry={inferredIndustryGoals}
                onSuggestionClick={(suggestion) => {
                  const currentValue = watchedValues.immediate_goals || ''
                  const newValue = currentValue.trim() 
                    ? `${currentValue} ${suggestion}`.trim()
                    : suggestion
                  setValue('immediate_goals', newValue)
                  const quality = evaluateAnswerQuality(newValue, 10)
                  setAnswerQuality(prev => ({ ...prev, immediate_goals: quality.quality }))
                }}
              />
              
              {/* Answer Quality Indicator */}
              {watchedValues.immediate_goals && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-2 sm:p-3 rounded-lg bg-alira-primary/5 dark:bg-alira-white/5 border border-alira-primary/10 dark:border-alira-white/10 flex items-center justify-between text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "px-2 py-1 rounded-md font-medium text-xs sm:text-sm",
                      getQualityColorClass(answerQuality.immediate_goals || 'needs_more')
                    )}>
                      {getQualityLabel(answerQuality.immediate_goals || 'needs_more')}
                    </div>
                    <span className="text-alira-primary/60 dark:text-alira-white/60">
                      {watchedValues.immediate_goals.length} characters
                    </span>
                  </div>
                  {evaluateAnswerQuality(watchedValues.immediate_goals || '', 10).suggestions.length > 0 && (
                    <div className="hidden sm:flex flex-wrap gap-1">
                      {evaluateAnswerQuality(watchedValues.immediate_goals || '', 10).suggestions.slice(0, 1).map((suggestion, idx) => (
                        <span key={idx} className="text-alira-primary/50 dark:text-alira-white/50 italic text-xs">
                          {suggestion}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
              
              <div id="immediate_goals-hint" className="mt-4 rounded-xl border border-alira-primary/20 dark:border-alira-white/20 bg-alira-primary/5 dark:bg-alira-primary/80 p-4">
                <p className="text-xs md:text-sm text-alira-primary/75 dark:text-alira-white/75">
                  <span className="mr-2">{goalsQuestion.hintIcon}</span>
                  {goalsQuestion.hint}
                </p>
              </div>
              {errors.immediate_goals && (
                <p 
                  id="immediate_goals-error"
                  className="mt-2 text-sm font-medium text-red-500 dark:text-red-400 flex items-center gap-1.5"
                  role="alert"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errors.immediate_goals.message}
                </p>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-serif font-normal text-alira-primary dark:text-alira-white mb-4">
                Which ALIRA service areas interest you most?
              </label>
              <div className="space-y-3 mb-6">
                {serviceInterestOptions.map((option) => (
                  <label key={option.value} className="flex items-start space-x-3 cursor-pointer p-3 border border-alira-primary/20 dark:border-alira-white/20 rounded-lg hover:border-alira-gold/40 dark:hover:border-alira-gold/60 transition-colors">
                    <input
                      type="checkbox"
                      value={option.value}
                      {...register('service_interest')}
                      className="mt-1 rounded border-alira-primary/20 dark:border-alira-white/30"
                    />
                    <div>
                      <span className="text-sm font-sans font-light text-alira-primary dark:text-alira-white block">{option.label}</span>
                      <span className="text-xs text-alira-primary/60 dark:text-alira-white/60">{option.description}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.service_interest && (
                <p 
                  id="service_interest-error"
                  className="mt-2 text-sm font-medium text-red-500 dark:text-red-400 flex items-center gap-1.5"
                  role="alert"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errors.service_interest.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-sans font-light text-alira-primary dark:text-alira-white mb-3">
                What tools and systems do you currently use?
              </label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {currentToolsOptions.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer p-2 border border-alira-primary/10 dark:border-alira-white/20 rounded hover:border-alira-gold/20 dark:hover:border-alira-gold/40 transition-colors">
                    <input
                      type="radio"
                      value={option.value}
                      {...register('current_tools')}
                      className="rounded border-alira-primary/20 dark:border-alira-white/30"
                    />
                    <span className="text-xs text-alira-primary dark:text-alira-white">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Display saved user info */}
            <div className="bg-white/30 dark:bg-alira-primary-900/70 p-4 rounded-lg border border-alira-primary/10 dark:border-alira-primary-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-sans font-light text-alira-primary/70 dark:text-alira-white/70 mb-1">
                    Full Name
                  </label>
                  <p className="text-alira-primary dark:text-alira-white font-sans font-light">
                    {draftData?.name || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-sans font-light text-alira-primary/70 dark:text-alira-white/70 mb-1">
                    Email
                  </label>
                  <p className="text-alira-primary dark:text-alira-white font-sans font-light">
                    {draftData?.email || 'Not provided'}
                  </p>
                </div>
              </div>
              {(!useAuthenticatedFlow && (!draftData?.name || !draftData?.email)) && (
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg">
                  <p className="text-amber-800 dark:text-amber-200 text-sm">
                    ⚠️ Missing contact information. Please start from the homepage to provide your name and email.
                  </p>
                  <a 
                    href="/" 
                    className="inline-block mt-2 text-amber-700 dark:text-amber-300 underline text-sm hover:text-amber-900 dark:hover:text-amber-100"
                  >
                    Go to homepage to start over
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent"
                {...register('consent')}
                onCheckedChange={(checked) => setValue('consent', checked as boolean)}
              />
              <div className="space-y-1">
                <label htmlFor="consent" className="text-sm font-sans font-light leading-none text-alira-primary dark:text-alira-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I agree to the terms and conditions *
                </label>
                <p className="text-sm text-alira-primary/60 dark:text-alira-white/60">
                  By submitting this form, you agree to our privacy policy and consent to being contacted about your business case.
                </p>
              </div>
            </div>
            {errors.consent && (
              <p 
                id="consent-error"
                className="mt-2 text-sm font-medium text-red-500 dark:text-red-400 flex items-center gap-1.5"
                role="alert"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {errors.consent.message}
              </p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  // Email Gate Component
  // Skip email gate for authenticated flow
  if (showEmailGate && !useAuthenticatedFlow) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-alira-gold/5 to-alira-primary/5 border-b border-alira-primary/10 text-center">
              <div className="w-16 h-16 bg-alira-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-alira-gold" />
              </div>
              <CardTitle className="text-3xl alira-heading text-alira-primary">
                Analysis Complete!
              </CardTitle>
              <p className="text-alira-primary/60 text-lg mt-2">
                Your personalized business plan is ready
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-serif font-normal text-alira-primary dark:text-alira-white mb-3">
                    🎯 We've identified key opportunities for your business{draftData?.name ? `, ${draftData.name}` : ''}
                  </h3>
                  <p className="text-alira-primary/70 dark:text-alira-white/70 leading-relaxed">
                    Based on your inputs, we've created a comprehensive analysis with specific recommendations 
                    for your business growth. {draftData?.email ? 'We\'ll send your personalized plan to your email.' : 'Enter your email below to receive your personalized plan.'}
                  </p>
                </div>

                <EmailGateForm 
                  onSubmit={handleEmailGateSubmit}
                  isGenerating={isGeneratingPlan}
                  existingName={draftData?.name}
                  existingEmail={draftData?.email}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Success Screen
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          
          <h2 className="text-3xl font-serif font-normal text-alira-primary dark:text-alira-white mb-4">
            Plan Generated Successfully!
          </h2>
          
          <p className="text-lg text-alira-primary/80 dark:text-alira-white/80 mb-6">
            Your personalized business plan has been sent to <strong>{draftData?.email}</strong>
          </p>
          
          <div className="bg-alira-gold/10 rounded-lg p-4 mb-6">
            <p className="text-sm text-alira-primary">
              📧 Please check your inbox and spam/junk folder<br/>
              📎 Your plan is attached as a PDF file<br/>
              ⏰ If you don't see the email within a few minutes, please contact us at contact@alirapartners.co.uk
            </p>
          </div>
          
          <div className="animate-pulse text-alira-gold">
            <p className="text-sm">This form will reset automatically in a few seconds...</p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <ExitIntentModal
        isOpen={showExitIntent}
        onClose={() => {
          setShowExitIntent(false)
          conversionEvents.exitIntentDismissed(currentStep)
        }}
        onSave={handleExitIntentSave}
        existingEmail={draftData?.email}
      />
      
      <CompletionPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        formData={{
          business_idea: watchedValues.business_idea,
          business_stage: watchedValues.business_stage,
          current_challenges: watchedValues.current_challenges,
          immediate_goals: watchedValues.immediate_goals,
          service_interest: watchedValues.service_interest,
          current_tools: watchedValues.current_tools
        }}
        onEdit={(sectionId) => {
          conversionEvents.previewEditClicked(sectionId)
          // Navigate to appropriate step based on section
          if (sectionId === 'executive-summary' || sectionId === 'business-context') {
            setCurrentStep(1)
          } else if (sectionId === 'challenges') {
            setCurrentStep(2)
          } else if (sectionId === 'goals') {
            setCurrentStep(3)
          } else if (sectionId === 'services' || sectionId === 'tools') {
            setCurrentStep(4)
          }
        }}
        onConfirm={() => {
          conversionEvents.previewConfirmed()
          setShowPreview(false)
          // Trigger form submission
          handleSubmit(onSubmit)()
        }}
        onCancel={() => {
          setShowPreview(false)
        }}
      />
      <div 
        className={cn(
          "max-w-3xl mx-auto",
          // Mobile: Better padding and spacing
          isMobile ? "px-4 sm:px-6" : "px-0",
          "pb-6 sm:pb-8"
        )}
        {...(isMobile ? swipeHandlers : {})}
      >
      {/* Enhanced Progress Indicator */}
      <FormProgress
        steps={[
          { label: "Your Business", description: "Tell us about your idea" },
          { label: "Challenges", description: "What's holding you back" },
          { label: "Goals", description: "Where you want to be" },
          { label: "Services", description: "How we can help" },
        ]}
        currentStep={currentStep}
        estimatedTimePerStep={90}
        showMilestones={true}
      />

      <form onSubmit={handleSubmit(onSubmit)} onSubmitCapture={(e) => console.log('Form submit event triggered', e)}>
        <Card className="border border-alira-primary/20 dark:border-alira-white/20 bg-alira-primary/5 dark:bg-alira-primary/70 backdrop-blur shadow-[0_10px_30px_rgba(0,0,0,0.35)] rounded-2xl">
          <CardHeader className="border-b border-alira-primary/10 dark:border-alira-white/10 bg-white/5 dark:bg-white/5 rounded-t-2xl px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-alira-gold text-alira-primary text-sm font-light">
                  {currentStep}
                </span>
                <div>
                <CardTitle className="text-lg md:text-xl font-light text-alira-primary dark:text-alira-white">
                  {currentStep === 1 && "Your Business"}
                  {currentStep === 2 && "Current Challenges"}
                  {currentStep === 3 && "Growth Goals"}
                  {currentStep === 4 && "Service Interest & Contact"}
                </CardTitle>
                <p className="text-xs md:text-sm text-alira-primary/70 dark:text-alira-white/70">
                  {currentStep === 1 && "Help us understand your business"}
                  {currentStep === 2 && "What's slowing you down?"}
                  {currentStep === 3 && "Where do you want to be?"}
                  {currentStep === 4 && "How we can help you"}
                </p>
              </div>
            </div>
            {useAuthenticatedFlow && (
              <div className="mt-2">
                {autoSaveState.isSaving && (
                  <div className="flex items-center gap-2 text-xs text-alira-primary/70 dark:text-alira-white/70">
                    <div className="w-3 h-3 border-2 border-alira-gold border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                )}
                {!autoSaveState.isSaving && autoSaveState.lastSaved && (
                  <div className="text-xs text-alira-primary/50 dark:text-alira-white/50">
                    Saved {new Date(autoSaveState.lastSaved).toLocaleTimeString()}
                  </div>
                )}
              </div>
            )}
            </div>
          </CardHeader>
          <CardContent className="px-6 py-6 md:px-8 md:py-8 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Enhanced Navigation with Animations */}
        <motion.div 
          className={cn(
            "mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-alira-primary/5 to-alira-gold/5 rounded-xl border border-alira-primary/10"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={cn(
                      "text-sm md:text-base text-alira-primary/80 dark:text-alira-white/80 hover:text-alira-primary dark:hover:text-alira-white border-0 bg-transparent hover:bg-transparent",
                      isMobile && "min-h-[44px] min-w-[44px]" // Ensure touch targets are at least 44px
                    )}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    ← Previous
                  </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              {currentStep < 4 ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="button"
                    onClick={nextStep}
                    className={cn(
                      "inline-flex items-center justify-center bg-alira-primary dark:bg-alira-primary text-alira-white dark:text-alira-white px-5 font-light ring-2 ring-alira-primary/20 dark:ring-alira-white/20 hover:bg-alira-primary/90 dark:hover:bg-alira-primary/90 focus:outline-none focus:ring-2 focus:ring-alira-gold/40 transition-all duration-200",
                      isMobile ? "min-h-[44px] text-base" : "min-h-[48px]"
                    )}
                  >
                    Next Step →
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="button"
                    loading={isSubmitting || isGeneratingPlan}
                    disabled={isSubmitting || isGeneratingPlan}
                    onClick={async () => {
                      console.log('Button clicked, current step:', currentStep, 'isSubmitting:', isSubmitting, 'isGeneratingPlan:', isGeneratingPlan)
                      if (currentStep === 4) {
                        // Show preview first
                        conversionEvents.previewViewed()
                        setShowPreview(true)
                      } else {
                        // Continue to next step
                        nextStep()
                      }
                    }}
                    className={cn(
                      "inline-flex items-center justify-center bg-alira-gold text-alira-primary px-5 font-light ring-2 ring-alira-gold/20 hover:bg-alira-gold/90 focus:outline-none focus:ring-2 focus:ring-alira-gold/40 transition-all duration-200",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      isMobile ? "min-h-[44px] text-base" : "min-h-[48px]"
                    )}
                  >
                  {isSubmitting || isGeneratingPlan ? (
                    isSubmitting ? 'Analyzing Your Inputs...' : 'Generating Your Plan...'
                  ) : (
                    <>
                      {currentStep === 4 ? (
                        <>
                          <Eye className="w-5 h-5 mr-2" />
                          Preview & Generate
                        </>
                      ) : (
                        <>
                          Generate My Plan
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </>
                      )}
                    </>
                  )}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </form>
      </div>
    </>
  )
}

// Email Gate Form Component
interface EmailGateFormProps {
  onSubmit: (email: string) => void
  isGenerating: boolean
  existingName?: string
  existingEmail?: string
}

function EmailGateForm({ onSubmit, isGenerating, existingName, existingEmail }: EmailGateFormProps) {
  const [email, setEmail] = useState(existingEmail || '')
  const [isValid, setIsValid] = useState(!!existingEmail)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setIsValid(value.includes('@') && value.includes('.'))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid && !isGenerating) {
      onSubmit(email)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-sans font-light text-alira-primary dark:text-alira-white mb-2">
          Email Address
        </label>
        <Input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="your@email.com"
          disabled={!!existingEmail}
          ref={emailRef}
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          className={`w-full border-2 border-alira-primary/20 dark:border-alira-white/20 rounded-xl px-4 py-3 text-base text-alira-primary dark:text-alira-white placeholder:text-alira-primary/40 dark:placeholder:text-alira-white/40 bg-white dark:bg-alira-primary/50 focus:border-alira-gold focus:ring-2 focus:ring-alira-gold/20 transition-all duration-200 ${existingEmail ? 'bg-alira-primary/5 dark:bg-alira-primary/20 cursor-not-allowed' : ''}`}
          required
        />
        <p className="text-xs text-alira-primary/60 mt-1">
          {existingEmail 
            ? 'We\'ll send your personalized business plan to this email address'
            : 'We\'ll send your personalized business plan to this email address'
          }
        </p>
      </div>

      <motion.div
        whileHover={{ scale: isValid && !isGenerating ? 1.02 : 1 }}
        whileTap={{ scale: isValid && !isGenerating ? 0.98 : 1 }}
      >
        <Button
          type="submit"
          disabled={!isValid}
          loading={isGenerating}
          className="w-full bg-gradient-to-r from-alira-gold to-alira-gold/90 hover:from-alira-gold/90 hover:to-alira-gold/80 text-alira-primary dark:text-alira-white px-8 py-4 text-lg font-serif font-normal shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
        {isGenerating ? (
          'Generating Your Plan...'
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send My Business Plan
          </>
        )}
        </Button>
      </motion.div>

      <p className="text-xs text-alira-primary/50 text-center">
        By submitting, you agree to receive your personalized business plan and occasional updates from ALIRA.
      </p>
    </form>
  )
}
