'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { ArrowRight, ArrowLeft, CheckCircle, Save } from 'lucide-react'
import { conversionEvents } from '@/lib/analytics'
import { wizardFormSchema, type WizardFormData, serviceInterestOptions, currentToolsOptions } from '@/lib/schema'

interface FormWizardProps {
  resumeToken?: string
  initialData?: any
  draftId?: string
}

export default function FormWizard({ resumeToken, initialData, draftId: propDraftId }: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [draftId, setDraftId] = useState<string | null>(propDraftId || null)
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [draftData, setDraftData] = useState<any>(null)

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

  // Load draft data if resume token provided
  useEffect(() => {
    if (resumeToken && !initialData) {
      loadDraft(resumeToken)
    }
  }, [resumeToken, initialData])

  const loadDraft = async (token: string) => {
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
          
          // Pre-fill business idea from homepage if available
          if (result.draft.data?.mini_idea_one_liner) {
            setValue('business_idea', result.draft.data.mini_idea_one_liner)
          }
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error)
    }
  }

  // Autosave functionality
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (draftId && currentStep > 1) {
        await saveDraft()
      }
    }, 2000) // Save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId)
  }, [watchedValues, draftId, currentStep])

  const saveDraft = async () => {
    if (!draftId) return
    
    setIsSaving(true)
    setSaveStatus('saving')
    
    try {
      const response = await fetch('/api/draft/save', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: draftId,
          step: currentStep,
          data: watchedValues
        }),
      })

      if (response.ok) {
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      }
    } catch (error) {
      console.error('Error saving draft:', error)
    } finally {
      setIsSaving(false)
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
        fieldsToValidate = ['service_interest', 'current_tools', 'name', 'email', 'consent']
        break
    }
    
    const isValid = await trigger(fieldsToValidate)
    if (isValid && currentStep < 4) {
      // Clear the current step's field after validation (except pre-filled business idea)
      switch (currentStep) {
        case 1:
          // Don't clear if it was pre-filled from homepage
          if (!draftData?.data?.mini_idea_one_liner) {
            setValue('business_idea', '')
          }
          break
        case 2:
          setValue('current_challenges', '')
          break
        case 3:
          setValue('immediate_goals', '')
          break
      }
      
      setCurrentStep(currentStep + 1)
      conversionEvents.stepView(`step_${currentStep + 1}`)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: WizardFormData) => {
    setIsSubmitting(true)
    try {
      let currentDraftId = draftId

      // Create a draft if one doesn't exist
      if (!currentDraftId) {
        const createResponse = await fetch('/api/draft/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
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

      // Save the form data and show email gate
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

      conversionEvents.formCompleted('wizard_form')
      setShowEmailGate(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      alert(`There was an error submitting your form: ${errorMessage}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailGateSubmit = async (email: string) => {
    setIsGeneratingPlan(true)
    try {
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

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Submit error:', errorData)
        throw new Error(errorData.error || 'Failed to generate plan')
      }

      const result = await response.json()
      console.log('Plan submission result:', result)
      
      // Show success message with proper instructions
      alert(`✅ Your personalized business plan has been sent to ${email}!\n\n📧 Please check your inbox and spam/junk folder.\n\n📎 Your plan is attached as a PDF file.\n\nIf you don't see the email within a few minutes, please contact us at contact@alirapartners.co.uk`)
      
      // Reset form
      setShowEmailGate(false)
      setCurrentStep(1)
      setDraftId(null)
    } catch (error) {
      console.error('Error generating plan:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      alert(`There was an error generating your plan: ${errorMessage}. Please try again.`)
    } finally {
      setIsGeneratingPlan(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        const hasPreFilledIdea = draftData?.data?.mini_idea_one_liner
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-alira-onyx mb-3">
                What is your business idea or current venture?
              </label>
              {hasPreFilledIdea && (
                <div className="mb-3 p-3 bg-alira-gold/10 border border-alira-gold/20 rounded-lg">
                  <p className="text-sm text-alira-onyx/80">
                    ✅ We've pre-filled this with your idea from the homepage. You can edit it or click "Next Step" to continue.
                  </p>
                </div>
              )}
              <Textarea
                {...register('business_idea')}
                placeholder="Describe your business concept, what you offer, and who you serve..."
                rows={6}
                className="w-full border-2 border-alira-onyx/20 rounded-xl px-4 py-3 text-base focus:border-alira-gold focus:ring-2 focus:ring-alira-gold/20 transition-all duration-200 resize-none"
              />
              <div className="mt-3 p-3 bg-alira-gold/5 rounded-lg border border-alira-gold/20">
                <p className="text-sm text-alira-onyx/70">
                  <strong>💡 Example:</strong> "A SaaS platform helping freelancers manage client projects" or "A consulting service helping restaurants implement online ordering systems"
                </p>
              </div>
              {errors.business_idea && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              <label className="block text-lg font-semibold text-alira-onyx mb-3">
                What are your biggest operational challenges right now?
              </label>
              <Textarea
                {...register('current_challenges')}
                placeholder="What's slowing you down or preventing growth? Think about systems, processes, tools, or clarity issues..."
                rows={6}
                className="w-full border-2 border-alira-onyx/20 rounded-xl px-4 py-3 text-base focus:border-alira-gold focus:ring-2 focus:ring-alira-gold/20 transition-all duration-200 resize-none"
              />
              <div className="mt-3 p-3 bg-alira-gold/5 rounded-lg border border-alira-gold/20">
                <p className="text-sm text-alira-onyx/70">
                  <strong>⚠️ Common challenges:</strong> Unclear messaging, scattered customer data, manual processes, poor website conversion, or lack of automation
                </p>
              </div>
              {errors.current_challenges && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              <label className="block text-lg font-semibold text-alira-onyx mb-3">
                What do you want to achieve in the next 3-6 months?
              </label>
              <Textarea
                {...register('immediate_goals')}
                placeholder="What specific outcomes do you want to see? Think about growth, efficiency, or clarity goals..."
                rows={6}
                className="w-full border-2 border-alira-onyx/20 rounded-xl px-4 py-3 text-base focus:border-alira-gold focus:ring-2 focus:ring-alira-gold/20 transition-all duration-200 resize-none"
              />
              <div className="mt-3 p-3 bg-alira-gold/5 rounded-lg border border-alira-gold/20">
                <p className="text-sm text-alira-onyx/70">
                  <strong>🎯 Example goals:</strong> Increase conversion rates by 25%, automate lead follow-up, clarify brand positioning, or streamline customer onboarding
                </p>
              </div>
              {errors.immediate_goals && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              <label className="block text-lg font-semibold text-alira-onyx mb-4">
                Which ALIRA service areas interest you most?
              </label>
              <div className="space-y-3 mb-6">
                {serviceInterestOptions.map((option) => (
                  <label key={option.value} className="flex items-start space-x-3 cursor-pointer p-3 border border-alira-onyx/20 rounded-lg hover:border-alira-gold/40 transition-colors">
                    <input
                      type="checkbox"
                      value={option.value}
                      {...register('service_interest')}
                      className="mt-1 rounded border-alira-onyx/20"
                    />
                    <div>
                      <span className="text-sm font-medium text-alira-onyx block">{option.label}</span>
                      <span className="text-xs text-alira-onyx/60">{option.description}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.service_interest && (
                <p className="text-red-500 text-sm mt-1">{errors.service_interest.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-alira-onyx mb-3">
                What tools and systems do you currently use?
              </label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {currentToolsOptions.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer p-2 border border-alira-onyx/10 rounded hover:border-alira-gold/20 transition-colors">
                    <input
                      type="radio"
                      value={option.value}
                      {...register('current_tools')}
                      className="rounded border-alira-onyx/20"
                    />
                    <span className="text-xs text-alira-onyx">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-alira-onyx mb-2">
                  Full Name *
                </label>
                <Input
                  {...register('name')}
                  placeholder="Your full name"
                  className="w-full"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-alira-onyx mb-2">
                  Email *
                </label>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="your@email.com"
                  className="w-full"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent"
                onCheckedChange={(checked) => setValue('consent', checked as boolean)}
              />
              <div className="space-y-1">
                <label htmlFor="consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I agree to the terms and conditions *
                </label>
                <p className="text-sm text-muted-foreground">
                  By submitting this form, you agree to our privacy policy and consent to being contacted about your business case.
                </p>
              </div>
            </div>
            {errors.consent && (
              <p className="text-red-500 text-sm">{errors.consent.message}</p>
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
            <CardHeader className="bg-gradient-to-r from-alira-gold/5 to-alira-onyx/5 border-b border-alira-onyx/10 text-center">
              <div className="w-16 h-16 bg-alira-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-alira-gold" />
              </div>
              <CardTitle className="text-3xl alira-heading text-alira-onyx">
                Analysis Complete!
              </CardTitle>
              <p className="text-alira-onyx/60 text-lg mt-2">
                Your personalized business plan is ready
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-alira-onyx mb-3">
                    🎯 We've identified key opportunities for your business{draftData?.name ? `, ${draftData.name}` : ''}
                  </h3>
                  <p className="text-alira-onyx/70 leading-relaxed">
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Enhanced Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-semibold text-alira-onyx">
              Step {currentStep} of 4
            </span>
            <div className="flex items-center space-x-2">
              {saveStatus === 'saving' && (
                <>
                  <Save className="w-4 h-4 text-alira-gold animate-pulse" />
                  <span className="text-sm text-alira-gold">Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">Saved</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                step <= currentStep 
                  ? 'bg-alira-gold text-white shadow-lg' 
                  : 'bg-alira-onyx/10 text-alira-onyx/50'
              }`}>
                {step < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step
                )}
              </div>
              <span className={`text-xs mt-2 font-medium ${
                step <= currentStep ? 'text-alira-onyx' : 'text-alira-onyx/50'
              }`}>
                {step === 1 && 'Idea'}
                {step === 2 && 'Challenge'}
                {step === 3 && 'Goal'}
                {step === 4 && 'Contact'}
              </span>
            </div>
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-alira-onyx/10 rounded-full h-3 shadow-inner">
          <div
            className="bg-gradient-to-r from-alira-gold to-alira-gold/80 h-3 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-alira-onyx/5 to-alira-gold/5 border-b border-alira-onyx/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-alira-gold/10 rounded-xl flex items-center justify-center">
                {currentStep === 1 && (
                  <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )}
                {currentStep === 2 && (
                  <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
                {currentStep === 3 && (
                  <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
                {currentStep === 4 && (
                  <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div>
                <CardTitle className="text-2xl alira-heading text-alira-onyx">
                  {currentStep === 1 && "Your Business"}
                  {currentStep === 2 && "Current Challenges"}
                  {currentStep === 3 && "Growth Goals"}
                  {currentStep === 4 && "Service Interest & Contact"}
                </CardTitle>
                <p className="text-alira-onyx/60 text-sm mt-1">
                  {currentStep === 1 && "Help us understand your business"}
                  {currentStep === 2 && "What's slowing you down?"}
                  {currentStep === 3 && "Where do you want to be?"}
                  {currentStep === 4 && "How we can help you"}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
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
          className="mt-8 p-6 bg-gradient-to-r from-alira-onyx/5 to-alira-gold/5 rounded-xl border border-alira-onyx/10"
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
                  className="px-6 py-3 border-2 border-alira-onyx/20 hover:border-alira-onyx/40 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
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
                    className="bg-gradient-to-r from-alira-onyx to-alira-onyx/90 hover:from-alira-onyx/90 hover:to-alira-onyx/80 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Next Step
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-alira-gold to-alira-gold/90 hover:from-alira-gold/90 hover:to-alira-gold/80 text-alira-onyx px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-alira-onyx mr-2"></div>
                      Generating My Plan...
                    </>
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
        <label className="block text-sm font-medium text-alira-onyx mb-2">
          Email Address
        </label>
        <Input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="your@email.com"
          disabled={!!existingEmail}
          className={`w-full border-2 border-alira-onyx/20 rounded-xl px-4 py-3 text-base focus:border-alira-gold focus:ring-2 focus:ring-alira-gold/20 transition-all duration-200 ${existingEmail ? 'bg-alira-onyx/5 cursor-not-allowed' : ''}`}
          required
        />
        <p className="text-xs text-alira-onyx/60 mt-1">
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
          disabled={!isValid || isGenerating}
          className="w-full bg-gradient-to-r from-alira-gold to-alira-gold/90 hover:from-alira-gold/90 hover:to-alira-gold/80 text-alira-onyx px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-alira-onyx mr-2"></div>
            Generating Your Plan...
          </>
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

      <p className="text-xs text-alira-onyx/50 text-center">
        By submitting, you agree to receive your personalized business plan and occasional updates from ALIRA.
      </p>
    </form>
  )
}
