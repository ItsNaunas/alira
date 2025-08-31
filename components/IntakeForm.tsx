'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  intakeFormSchema, 
  type IntakeFormData,
  businessStages,
  budgetRanges,
  timelineOptions,
  services
} from '@/lib/schema'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { CheckCircle, ArrowRight, Download, Mail } from 'lucide-react'
import { conversionEvents } from '@/lib/analytics'

export default function IntakeForm() {
  const [step, setStep] = useState<'initial' | 'preview' | 'full-form'>('initial')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<IntakeFormData>({
    resolver: zodResolver(intakeFormSchema),
  })

  const generatePreview = async () => {
    const formData = watch()
    const { businessName, industry, stage, challenges } = formData
    
    if (businessName && industry && stage && challenges) {
      setIsSubmitting(true)
      try {
        // Call AI generation API with only the required fields for preview
        const response = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            businessName,
            industry,
            stage,
            challenges,
            goalsShort: formData.goalsShort || '',
            goalsLong: formData.goalsLong || '',
            resources: formData.resources || '',
            budget: formData.budget || '',
            timeline: formData.timeline || '',
            service: formData.service || '',
            notes: formData.notes || ''
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to generate preview')
        }

        const result = await response.json()
        if (result.success) {
          setStep('preview')
          // Store the AI-generated outline for later use
          setValue('aiOutline', result.outline)
          // Track preview generation
          conversionEvents.previewGenerated(businessName || 'Unknown Business')
        } else {
          throw new Error(result.error || 'Failed to generate preview')
        }
      } catch (error) {
        console.error('Error generating preview:', error)
        alert('There was an error generating your preview. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const requestFullCase = () => {
    setStep('full-form')
    // Track form progression
    conversionEvents.formStarted('business_case_full')
  }

  const onSubmit = async (data: IntakeFormData) => {
    setIsSubmitting(true)
    try {
      // Get the AI-generated outline from the form
      const aiOutline = watch('aiOutline')
      if (!aiOutline) {
        throw new Error('No AI outline available. Please generate a preview first.')
      }

      // Generate PDF
      const pdfResponse = await fetch('/api/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outline: aiOutline,
          businessName: data.businessName,
          contactName: data.contactName
        }),
      })

      if (!pdfResponse.ok) {
        throw new Error('Failed to generate PDF')
      }

      const pdfBlob = await pdfResponse.blob()
      const pdfBuffer = await pdfBlob.arrayBuffer()
      const uint8Array = new Uint8Array(pdfBuffer)
      const base64PDF = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)))

      // Save to database and get download URL
      const saveResponse = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lead: data,
          businessCase: {
            outline: aiOutline,
            pdfBuffer: base64PDF
          }
        }),
      })

      if (!saveResponse.ok) {
        throw new Error('Failed to save business case')
      }

      const saveResult = await saveResponse.json()
      if (saveResult.success) {
        // Download the PDF
        const url = window.URL.createObjectURL(pdfBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = saveResult.businessCase.fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        setIsSuccess(true)
        reset()
        // Track successful business case generation
        conversionEvents.businessCaseGenerated(data.businessName)
        conversionEvents.formCompleted('business_case_full')
      } else {
        throw new Error(saveResult.error || 'Failed to save business case')
      }
    } catch (error) {
      console.error('Error generating business case:', error)
      alert('There was an error generating your business case. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const generatePreviewContent = () => {
    const aiOutline = watch('aiOutline')
    if (!aiOutline) {
      return {
        problemStatement: 'AI-generated problem statement will appear here...',
        objectives: ['AI-generated objectives will appear here...'],
        currentState: 'AI-generated current state analysis will appear here...',
        proposedSolution: ['AI-generated solution will appear here...'],
        expectedOutcomes: ['AI-generated outcomes will appear here...'],
        nextSteps: ['AI-generated next steps will appear here...']
      }
    }
    
    return {
      problemStatement: aiOutline.problem_statement,
      objectives: aiOutline.objectives,
      currentState: aiOutline.current_state,
      proposedSolution: aiOutline.proposed_solution.map((s: any) => s.pillar),
      expectedOutcomes: aiOutline.expected_outcomes,
      nextSteps: aiOutline.next_steps,
      solutionFramework: [
        'Strategic assessment and gap analysis',
        'Process optimization and system implementation',
        'Performance monitoring and continuous improvement'
      ],
      outline: [
        'Problem Statement',
        'Objectives',
        'Current State',
        'Proposed Solution',
        'Expected Outcomes',
        'Next Steps'
      ]
    }
  }

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl alira-heading text-alira-gold">
            Business Case Generated
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your Draft Business Case has been downloaded. We'll review your information and be in touch within minutes to discuss next steps.
          </p>
          <Button 
            onClick={() => setIsSuccess(false)}
            variant="outline"
          >
            Generate Another
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Initial step - just key fields for preview
  if (step === 'initial') {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl alira-heading">Get Your Business Case Preview</CardTitle>
            <p className="text-alira-onyx/70">
              Answer 4 quick questions to see your customized business case structure
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Business Name</label>
                <Input
                  {...register('businessName')}
                  placeholder="Your business name"
                />
                {errors.businessName && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Industry</label>
                <Input
                  {...register('industry')}
                  placeholder="e.g., Technology, Healthcare"
                />
                {errors.industry && (
                  <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Business Stage</label>
              <Select onValueChange={(value) => setValue('stage', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your business stage" />
                </SelectTrigger>
                <SelectContent>
                  {businessStages.map((stage) => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.stage && (
                <p className="text-red-500 text-sm mt-1">{errors.stage.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Current Challenges</label>
              <Textarea
                {...register('challenges')}
                placeholder="Describe the main challenges your business is facing..."
                rows={3}
              />
              {errors.challenges && (
                <p className="text-red-500 text-sm mt-1">{errors.challenges.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

                 <div className="text-center">
           <Button 
             onClick={generatePreview}
             disabled={!watch('businessName') || !watch('industry') || !watch('stage') || !watch('challenges')}
             size="lg"
             className="px-8 bg-alira-onyx hover:bg-alira-onyx/90"
           >
             {isSubmitting ? (
               <>
                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                 Generating Preview...
               </>
             ) : (
               <>
                 Generate Preview
                 <ArrowRight className="ml-2 w-4 h-4" />
               </>
             )}
           </Button>
          <p className="text-xs text-alira-onyx/60 mt-4">
            Takes 30 seconds • No email required for preview
          </p>
        </div>
      </div>
    )
  }

  // Preview step
  if (step === 'preview') {
    const preview = generatePreviewContent()
    const { businessName } = watch()
    
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-alira-onyx mb-4">
            Your Business Case Preview
          </h2>
          <p className="text-alira-onyx/70">
            This is just a preview of your customized business case structure
          </p>
        </div>
        
        <Card className="border-2 border-alira-gold/20">
          <CardHeader className="bg-alira-gold/5">
            <CardTitle className="text-xl font-bold text-alira-onyx">
              {businessName} - Business Case Framework
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-alira-onyx mb-2">Problem Statement</h3>
              <p className="text-alira-onyx/80 leading-relaxed">
                {preview.problemStatement}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-alira-onyx mb-2">Key Objectives</h3>
              <ul className="space-y-2">
                {preview.objectives?.map((objective: any, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-alira-gold mt-0.5 flex-shrink-0" />
                    <span className="text-alira-onyx/80">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-alira-onyx mb-2">Solution Framework</h3>
              <ul className="space-y-2">
                {preview.solutionFramework?.map((solution: any, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-alira-gold mt-0.5 flex-shrink-0" />
                    <span className="text-alira-onyx/80">{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-alira-onyx mb-2">Your Business Case Outline</h3>
              <div className="grid grid-cols-2 gap-2">
                {preview.outline?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-alira-gold flex-shrink-0" />
                    <span className="text-sm text-alira-onyx/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center space-y-4">
          <div className="bg-alira-gold/10 rounded-lg p-4 border border-alira-gold/20">
            <h3 className="font-semibold text-alira-onyx mb-2">
              Get Your Complete Business Case
            </h3>
            <p className="text-alira-onyx/70 mb-4">
              Receive your full customized business case with detailed analysis, recommendations, and implementation roadmap.
            </p>
                         <Button 
               onClick={requestFullCase}
               className="bg-alira-onyx hover:bg-alira-onyx/90"
               disabled={isSubmitting}
             >
               {isSubmitting ? (
                 <>
                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                   Processing...
                 </>
               ) : (
                 <>
                   Get Full Business Case
                   <Download className="ml-2 w-4 h-4" />
                 </>
               )}
             </Button>
          </div>
          
          <p className="text-sm text-alira-onyx/60">
            ✓ Professional formatting • ✓ Detailed analysis • ✓ Implementation roadmap • ✓ 24-hour delivery
          </p>
        </div>
      </div>
    )
  }

  // Full form step
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl alira-heading">Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Business Name</label>
              <Input
                {...register('businessName')}
                placeholder="Your business name"
              />
              {errors.businessName && (
                <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <Input
                {...register('industry')}
                placeholder="e.g., Technology, Healthcare"
              />
              {errors.industry && (
                <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Business Stage</label>
            <Select onValueChange={(value) => setValue('stage', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your business stage" />
              </SelectTrigger>
              <SelectContent>
                {businessStages.map((stage) => (
                  <SelectItem key={stage.value} value={stage.value}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.stage && (
              <p className="text-red-500 text-sm mt-1">{errors.stage.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl alira-heading">Challenges & Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Current Challenges</label>
            <Textarea
              {...register('challenges')}
              placeholder="Describe the main challenges your business is facing..."
              rows={4}
            />
            {errors.challenges && (
              <p className="text-red-500 text-sm mt-1">{errors.challenges.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Short-term Goals (3-6 months)</label>
            <Textarea
              {...register('goalsShort')}
              placeholder="What do you want to achieve in the next 3-6 months?"
              rows={3}
            />
            {errors.goalsShort && (
              <p className="text-red-500 text-sm mt-1">{errors.goalsShort.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Long-term Goals (1-3 years)</label>
            <Textarea
              {...register('goalsLong')}
              placeholder="What are your longer-term business objectives?"
              rows={3}
            />
            {errors.goalsLong && (
              <p className="text-red-500 text-sm mt-1">{errors.goalsLong.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Available Resources</label>
            <Textarea
              {...register('resources')}
              placeholder="Describe your team, budget, time, and other resources..."
              rows={3}
            />
            {errors.resources && (
              <p className="text-red-500 text-sm mt-1">{errors.resources.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl alira-heading">Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Budget Range</label>
              <Select onValueChange={(value) => setValue('budget', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((budget) => (
                    <SelectItem key={budget.value} value={budget.value}>
                      {budget.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.budget && (
                <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Timeline</label>
              <Select onValueChange={(value) => setValue('timeline', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  {timelineOptions.map((timeline) => (
                    <SelectItem key={timeline.value} value={timeline.value}>
                      {timeline.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.timeline && (
                <p className="text-red-500 text-sm mt-1">{errors.timeline.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Preferred Service</label>
            <Select onValueChange={(value) => setValue('service', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.value} value={service.value}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service && (
              <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl alira-heading">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Contact Name</label>
              <Input
                {...register('contactName')}
                placeholder="Your full name"
              />
              {errors.contactName && (
                <p className="text-red-500 text-sm mt-1">{errors.contactName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <Input
                {...register('email')}
                type="email"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional Notes</label>
            <Textarea
              {...register('notes')}
              placeholder="Any additional information you'd like to share..."
              rows={3}
            />
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="consent"
              onCheckedChange={(checked) => setValue('consent', checked as boolean)}
            />
            <div className="space-y-1">
              <label htmlFor="consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I agree to the terms and conditions
              </label>
              <p className="text-sm text-muted-foreground">
                By submitting this form, you agree to our privacy policy and consent to being contacted about your business case.
              </p>
            </div>
          </div>
          {errors.consent && (
            <p className="text-red-500 text-sm">{errors.consent.message}</p>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
                 <Button 
           type="submit" 
           size="lg" 
           disabled={isSubmitting}
           className="px-8"
         >
           {isSubmitting ? (
             <>
               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
               Generating Business Case...
             </>
           ) : (
             'Generate Business Case'
           )}
         </Button>
      </div>
    </form>
  )
}
