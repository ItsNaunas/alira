'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card, CardContent } from './ui/card'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { conversionEvents } from '@/lib/analytics'
import { miniFormSchema, type MiniFormData } from '@/lib/schema'

interface MiniFormProps {
  onSuccess?: (data: MiniFormData) => void
}

export default function MiniForm({ onSuccess }: MiniFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<MiniFormData>({
    resolver: zodResolver(miniFormSchema)
  })

  const onSubmit = async (data: MiniFormData) => {
    setIsSubmitting(true)
    try {
      // Create draft record
      const response = await fetch('/api/draft/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.firstName,
          email: data.email,
          data: {
            mini_idea_one_liner: data.idea || ''
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create draft')
      }

      const result = await response.json()
      
      // Track mini form completion
      conversionEvents.formStarted('mini_form')
      conversionEvents.formCompleted('mini_form')
      
      setIsSuccess(true)
      reset()
      
      // Redirect to full form with resume token
      if (onSuccess) {
        onSuccess(data)
      } else {
        window.location.href = `/form?resume=${result.resume_token}`
      }
    } catch (error) {
      console.error('Error submitting mini form:', error)
      alert('There was an error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="max-w-md mx-auto border-2 border-alira-gold/20">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-alira-gold mx-auto mb-4" />
          <h3 className="text-lg font-serif font-normal text-alira-primary dark:text-alira-white mb-2">
            Draft Created!
          </h3>
          <p className="text-alira-primary/70 dark:text-alira-white/70 text-sm">
            Taking you to your personalized form...
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-sans font-light text-alira-primary dark:text-alira-white mb-2">
              First Name *
            </label>
            <Input
              {...register('firstName')}
              placeholder="Your first name"
              className="w-full text-alira-primary dark:text-alira-white placeholder:text-alira-primary/40 dark:placeholder:text-alira-white/40"
            />
            {errors.firstName && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-sans font-light text-alira-primary dark:text-alira-white mb-2">
              Email *
            </label>
            <Input
              {...register('email')}
              type="email"
              placeholder="your@email.com"
              className="w-full text-alira-primary dark:text-alira-white placeholder:text-alira-primary/40 dark:placeholder:text-alira-white/40"
            />
            {errors.email && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-sans font-light text-alira-primary dark:text-alira-white mb-2">
              Tell us your idea in one line (optional)
            </label>
            <Textarea
              {...register('idea')}
              placeholder="e.g., A mobile app for local food delivery"
              rows={2}
              className="w-full resize-none text-alira-primary dark:text-alira-white placeholder:text-alira-primary/40 dark:placeholder:text-alira-white/40"
            />
          </div>

          <Button
            type="submit"
            variant="alira"
            loading={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              'Creating Draft...'
            ) : (
              <>
                Start My Plan
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
