'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { ArrowRight, ArrowLeft, CheckCircle, Save } from 'lucide-react'
import { conversionEvents } from '@/lib/analytics'
import { wizardFormSchema, type WizardFormData, resourceOptions } from '@/lib/schema'

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
          setCurrentStep(result.draft.step)
          // Populate form with existing data
          Object.keys(result.draft.data || {}).forEach(key => {
            setValue(key as keyof WizardFormData, result.draft.data[key])
          })
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
    const isValid = await trigger()
    if (isValid && currentStep < 4) {
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
      const response = await fetch('/api/draft/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: draftId,
          data
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      const result = await response.json()
      conversionEvents.formCompleted('wizard_form')
      
      // Redirect to success page
      window.location.href = `/form/success?pdf=${encodeURIComponent(result.pdf_url)}`
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error submitting your form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-alira-onyx mb-4">
                What is your idea or business about?
              </h3>
              <Textarea
                {...register('idea')}
                placeholder="Describe your business idea or concept. For example: 'A mobile app that connects local farmers directly with consumers' or 'A consulting service helping small businesses implement AI tools'"
                rows={6}
                className="w-full"
              />
              {errors.idea && (
                <p className="text-red-500 text-sm mt-1">{errors.idea.message}</p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-alira-onyx mb-4">
                What is the biggest challenge holding you back?
              </h3>
              <Textarea
                {...register('challenge')}
                placeholder="What's preventing you from moving forward? For example: 'Lack of technical expertise', 'Unclear target market', 'Limited funding', 'Time constraints'"
                rows={6}
                className="w-full"
              />
              {errors.challenge && (
                <p className="text-red-500 text-sm mt-1">{errors.challenge.message}</p>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-alira-onyx mb-4">
                What is your goal in the next 90 days?
              </h3>
              <Textarea
                {...register('goal_90d')}
                placeholder="What do you want to achieve in the next 3 months? For example: 'Launch MVP and get first 10 customers', 'Validate the market with a pilot program', 'Secure initial funding'"
                rows={6}
                className="w-full"
              />
              {errors.goal_90d && (
                <p className="text-red-500 text-sm mt-1">{errors.goal_90d.message}</p>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-alira-onyx mb-4">
                What resources do you already have?
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {resourceOptions.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={option.value}
                      {...register('resources')}
                      className="rounded border-alira-onyx/20"
                    />
                    <span className="text-sm text-alira-onyx">{option.label}</span>
                  </label>
                ))}
              </div>
              <Input
                {...register('other_resource')}
                placeholder="Other resources (optional)"
                className="w-full"
              />
              {errors.resources && (
                <p className="text-red-500 text-sm mt-1">{errors.resources.message}</p>
              )}
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-alira-onyx">
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
        <div className="w-full bg-alira-onyx/10 rounded-full h-2">
          <div
            className="bg-alira-gold h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl alira-heading">
              {currentStep === 1 && "About Your Idea"}
              {currentStep === 2 && "Your Challenge"}
              {currentStep === 3 && "Your 90-Day Goal"}
              {currentStep === 4 && "Resources & Contact"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="bg-alira-onyx hover:bg-alira-onyx/90"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-alira-onyx hover:bg-alira-onyx/90"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating My Plan...
                </>
              ) : (
                'Generate My Plan'
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
