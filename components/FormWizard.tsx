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
import { wizardFormSchema, type WizardFormData, serviceInterestOptions, currentToolsOptions } from '@/lib/schema'
import { getUserFriendlyError, errorMessages } from '@/lib/error-messages'
import { cn } from '@/lib/utils'

interface FormWizardProps {
  resumeToken?: string
  initialData?: any
  draftId?: string
}

export default function FormWizard({ resumeToken, initialData, draftId: propDraftId }: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [draftId, setDraftId] = useState<string | null>(propDraftId || null)
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [draftData, setDraftData] = useState<any>(null)
  const [collectedFormData, setCollectedFormData] = useState<Partial<WizardFormData>>({})

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
    
    // Check if we have required user data
    if (!draftData?.name || !draftData?.email) {
      console.log('❌ Missing user data, showing alert')
      alert(errorMessages.required('contact information'))
      return
    }
    
    console.log('✅ User data present, starting form submission...')
    console.log('Name:', draftData.name)
    console.log('Email:', draftData.email)
    setIsSubmitting(true)
    try {
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
            
            <div>
              <label htmlFor="business_idea" className="block text-sm md:text-base font-light text-alira-primary/90 dark:text-alira-white/90 mb-3">
                What is your business idea or current venture?
              </label>
              <Textarea
                id="business_idea"
                {...register('business_idea')}
                placeholder="e.g., a marketing agency that helps creators launch offers"
                rows={4}
                className={cn(
                  "w-full rounded-xl border bg-alira-primary/10 dark:bg-alira-primary/80 px-4 py-3 text-alira-primary dark:text-alira-white placeholder:text-alira-primary/40 dark:placeholder:text-alira-white/40 focus:border-alira-gold focus:outline-none focus:ring-2 focus:ring-alira-gold/20 transition-all duration-200 resize-none",
                  errors.business_idea 
                    ? "border-red-500 dark:border-red-400 ring-2 ring-red-500/20" 
                    : "border-alira-primary/20 dark:border-alira-white/20"
                )}
                aria-invalid={errors.business_idea ? "true" : "false"}
                aria-describedby={errors.business_idea ? "business_idea-error" : "business_idea-hint"}
              />
              
              <div id="business_idea-hint" className="mt-4 rounded-xl border border-alira-primary/20 dark:border-alira-white/20 bg-alira-primary/5 dark:bg-alira-primary/80 p-4">
                <p className="text-xs md:text-sm text-alira-primary/75 dark:text-alira-white/75">
                  <span className="mr-2">💡</span>
                  Example: "A SaaS for freelancers to manage projects" or "A service helping restaurants set up online ordering"
                </p>
              </div>
              
              {errors.business_idea && (
                <p 
                  id="business_idea-error"
                  className="mt-2 text-sm font-medium text-red-500 dark:text-red-400 flex items-center gap-1.5"
                  role="alert"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errors.business_idea.message}
                </p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="current_challenges" className="block text-sm md:text-base font-light text-alira-primary/90 dark:text-alira-white/90 mb-3">
                What are your biggest operational challenges right now?
              </label>
              <Textarea
                id="current_challenges"
                {...register('current_challenges')}
                placeholder="What's slowing you down or preventing growth?"
                rows={4}
                className={cn(
                  "w-full rounded-xl border bg-alira-primary/10 dark:bg-alira-primary/80 px-4 py-3 text-alira-primary dark:text-alira-white placeholder:text-alira-primary/40 dark:placeholder:text-alira-white/40 focus:border-alira-gold focus:outline-none focus:ring-2 focus:ring-alira-gold/20 transition-all duration-200 resize-none",
                  errors.current_challenges 
                    ? "border-red-500 dark:border-red-400 ring-2 ring-red-500/20" 
                    : "border-alira-primary/20 dark:border-alira-white/20"
                )}
                aria-invalid={errors.current_challenges ? "true" : "false"}
                aria-describedby={errors.current_challenges ? "current_challenges-error" : "current_challenges-hint"}
              />
              <div id="current_challenges-hint" className="mt-4 rounded-xl border border-alira-primary/20 dark:border-alira-white/20 bg-alira-primary/5 dark:bg-alira-primary/80 p-4">
                <p className="text-xs md:text-sm text-alira-primary/75 dark:text-alira-white/75">
                  <span className="mr-2">⚠️</span>
                  Common challenges: Unclear messaging, scattered customer data, manual processes, poor website conversion, or lack of automation
                </p>
              </div>
              {errors.current_challenges && (
                <p 
                  id="current_challenges-error"
                  className="mt-2 text-sm font-medium text-red-500 dark:text-red-400 flex items-center gap-1.5"
                  role="alert"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errors.current_challenges.message}
                </p>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="immediate_goals" className="block text-sm md:text-base font-light text-alira-primary/90 dark:text-alira-white/90 mb-3">
                What do you want to achieve in the next 3-6 months?
              </label>
              <Textarea
                id="immediate_goals"
                {...register('immediate_goals')}
                placeholder="What specific outcomes do you want to see?"
                rows={4}
                className={cn(
                  "w-full rounded-xl border bg-alira-primary/10 dark:bg-alira-primary/80 px-4 py-3 text-alira-primary dark:text-alira-white placeholder:text-alira-primary/40 dark:placeholder:text-alira-white/40 focus:border-alira-gold focus:outline-none focus:ring-2 focus:ring-alira-gold/20 transition-all duration-200 resize-none",
                  errors.immediate_goals 
                    ? "border-red-500 dark:border-red-400 ring-2 ring-red-500/20" 
                    : "border-alira-primary/20 dark:border-alira-white/20"
                )}
                aria-invalid={errors.immediate_goals ? "true" : "false"}
                aria-describedby={errors.immediate_goals ? "immediate_goals-error" : "immediate_goals-hint"}
              />
              <div id="immediate_goals-hint" className="mt-4 rounded-xl border border-alira-primary/20 dark:border-alira-white/20 bg-alira-primary/5 dark:bg-alira-primary/80 p-4">
                <p className="text-xs md:text-sm text-alira-primary/75 dark:text-alira-white/75">
                  <span className="mr-2">🎯</span>
                  Example goals: Increase conversion rates by 25%, automate lead follow-up, clarify brand positioning, or streamline customer onboarding
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
              {(!draftData?.name || !draftData?.email) && (
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
  if (showEmailGate) {
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
    <div className="max-w-3xl mx-auto">
      {/* Progress Track */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-light text-alira-primary dark:text-alira-white/70">
            Step {currentStep} of 4
          </span>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-light transition-all duration-300 ${
                step <= currentStep 
                  ? 'bg-alira-gold text-alira-primary' 
                  : 'bg-alira-primary/20 dark:bg-white/20 text-alira-primary/50 dark:text-alira-white/50'
              }`}>
                {step < currentStep ? '✓' : step}
              </div>
            ))}
          </div>
        </div>
        <div className="h-1.5 w-full rounded-full bg-alira-primary/20 dark:bg-white/20">
          <div 
            className="h-1.5 rounded-full bg-alira-gold transition-all duration-500" 
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} onSubmitCapture={(e) => console.log('Form submit event triggered', e)}>
        <Card className="border border-alira-primary/20 dark:border-alira-white/20 bg-alira-primary/5 dark:bg-alira-primary/70 backdrop-blur shadow-[0_10px_30px_rgba(0,0,0,0.35)] rounded-2xl">
          <CardHeader className="border-b border-alira-primary/10 dark:border-alira-white/10 bg-white/5 dark:bg-white/5 rounded-t-2xl px-6 py-5">
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
          className="mt-8 p-6 bg-gradient-to-r from-alira-primary/5 to-alira-gold/5 rounded-xl border border-alira-primary/10"
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
                  className="text-sm md:text-base text-alira-primary/80 dark:text-alira-white/80 hover:text-alira-primary dark:hover:text-alira-white border-0 bg-transparent hover:bg-transparent"
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
                    className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-alira-primary dark:bg-alira-primary text-alira-white dark:text-alira-white px-5 font-light ring-2 ring-alira-primary/20 dark:ring-alira-white/20 hover:bg-alira-primary/90 dark:hover:bg-alira-primary/90 focus:outline-none focus:ring-2 focus:ring-alira-gold/40 transition-all duration-200"
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
                    onClick={async () => {
                      console.log('Button clicked, current step:', currentStep, 'isSubmitting:', isSubmitting, 'isGeneratingPlan:', isGeneratingPlan)
                      if (currentStep === 4) {
                        try {
                          // Trigger form submission directly
                          const formData = watchedValues
                          console.log('Form data being submitted:', formData)
                          await onSubmit(formData)
                        } catch (error) {
                          console.error('Button click error:', error)
                          alert(getUserFriendlyError(error))
                        }
                      }
                    }}
                    className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-alira-gold text-alira-primary px-5 font-light ring-2 ring-alira-gold/20 hover:bg-alira-gold/90 focus:outline-none focus:ring-2 focus:ring-alira-gold/40 transition-all duration-200"
                  >
                  {isSubmitting || isGeneratingPlan ? (
                    isSubmitting ? 'Analyzing Your Inputs...' : 'Generating Your Plan...'
                  ) : (
                    <>
                      Generate My Plan
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
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
