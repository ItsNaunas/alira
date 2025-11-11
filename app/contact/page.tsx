'use client'

import { useState } from 'react'
import Reveal from '@/components/Reveal'
import CTAButton from '@/components/CTAButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getUserFriendlyError, errorMessages } from '@/lib/error-messages'
import { FormField } from '@/components/ui/form-field'
import { FormSuccess } from '@/components/ui/form-success'
import { InlineError } from '@/components/ui/error-state'
import { GradientBars } from '@/components/ui/gradient-bars'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || errorMessages.contactSubmitFailed)
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(getUserFriendlyError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-page">
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-bg-page relative overflow-hidden pt-28 md:pt-32">
        <GradientBars />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-alira-gold text-sm tracking-wide uppercase mb-4 font-sans font-light">
                Get in Touch
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-normal text-text-primary mb-8">
                Contact Us
              </h1>
              <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
              <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
                Every enquiry is private and secure. We'll get back to you within 24 hours.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact Form & Details Section */}
      <section className="py-24 bg-bg-page">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* Contact Form */}
              <Reveal delay={200}>
                <div className="bg-surface p-8 rounded-2xl border border-borderToken-subtle">
                  <h2 className="text-3xl font-serif font-normal text-text-primary mb-6">Send us a message</h2>
                  <p className="text-text-secondary mb-8">
                    Tell us about your project, idea, or challenge. We're here to help you move forward.
                  </p>
                  
                  {/* Success Message */}
                  {submitStatus === 'success' && (
                    <FormSuccess
                      title="Message Sent!"
                      message="Thank you for reaching out. We'll get back to you within 24 hours."
                      className="mb-6"
                    />
                  )}

                  {/* Error Message */}
                  {submitStatus === 'error' && (
                    <InlineError
                      message={errorMessage}
                      onRetry={() => setSubmitStatus('idle')}
                      className="mb-6"
                    />
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <FormField
                      label="Name"
                      htmlFor="name"
                      required
                      hint="Please provide your full name"
                    >
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full"
                        placeholder="Your full name"
                      />
                    </FormField>
                    
                    <FormField
                      label="Email"
                      htmlFor="email"
                      required
                      hint="We'll use this to get back to you"
                    >
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full"
                        placeholder="your.email@example.com"
                      />
                    </FormField>
                    
                    <FormField
                      label="Message"
                      htmlFor="message"
                      required
                      hint="Tell us about your project, idea, or what you'd like to achieve"
                    >
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full resize-none"
                        placeholder="Your message here..."
                      />
                    </FormField>
                    
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      className="w-full bg-alira-gold hover:bg-alira-gold/90 text-alira-black py-3 px-6 font-sans font-medium transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </div>
              </Reveal>

              {/* Contact Details */}
              <Reveal delay={400}>
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-serif font-normal text-text-primary mb-6">Direct Contact</h2>
                    <p className="text-text-secondary mb-8">
                      Prefer to reach out directly? Here's how you can get in touch with us.
                    </p>
                  </div>

                  {/* Email */}
                  <div className="bg-surface p-6 rounded-xl border border-borderToken-subtle hover:border-accent transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-alira-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-normal text-text-primary mb-2">Email</h3>
                        <a 
                          href="mailto:Enquiries@aliracapital.co.uk" 
                          className="text-alira-gold hover:text-accent-dark transition-colors font-sans font-light"
                        >
                          Enquiries@aliracapital.co.uk
                        </a>
                        <p className="text-text-secondary text-sm mt-1">
                          We typically respond within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="bg-surface p-6 rounded-xl border border-borderToken-subtle">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-alira-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-normal text-text-primary mb-2">Company Details</h3>
                        <div className="text-text-secondary space-y-1 font-sans">
                          <p><strong>ALIRA Capital Ventures Ltd</strong></p>
                          <p>Registered in England & Wales</p>
                          <p>Company No: 16419663</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="bg-surface p-6 rounded-xl border border-accent">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-alira-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-normal text-text-primary mb-2">Quick Response</h3>
                        <p className="text-text-secondary font-sans">
                          We understand that time matters. Most enquiries receive a response within 24 hours, 
                          and urgent matters are prioritized.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-alira-primary to-alira-primary/90">
        <div className="container mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-text-inverse mb-6">
                Ready to get started?
              </h2>
              <p className="text-xl text-white mb-8 leading-relaxed">
                Don't wait for the perfect moment. The best time to start is now.
              </p>
              <CTAButton 
                href="/#hero"
                variant="alira"
                className="px-8 py-4 text-lg font-sans font-light"
                location="contact-cta"
              >
                Start My Plan
              </CTAButton>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
