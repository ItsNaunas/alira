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

export default function IntakeForm() {
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

  const onSubmit = async (data: IntakeFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Draft-Business-Case-${data.businessName.replace(/\s+/g, '-')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setIsSuccess(true)
      reset()
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('There was an error generating your business case. Please try again.')
    } finally {
      setIsSubmitting(false)
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
            Your Draft Business Case has been downloaded. We'll review your information and be in touch within 24 hours to discuss next steps.
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
          {isSubmitting ? 'Generating Business Case...' : 'Generate Business Case'}
        </Button>
      </div>
    </form>
  )
}
