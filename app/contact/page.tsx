'use client'

import { useState } from 'react'
import Reveal from '@/components/Reveal'
import CTAButton from '@/components/CTAButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

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
        setErrorMessage(result.error || 'Failed to send message')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-alira-white/30 via-white to-alira-white/20 dark:from-alira-primary/30 dark:via-alira-primary dark:to-alira-primary/20 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-alira-gold text-sm tracking-wide uppercase mb-4 font-sans font-light">
                Get in Touch
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-normal text-alira-primary dark:text-alira-white mb-8">
                Contact Us
              </h1>
              <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
              <p className="text-xl text-alira-primary/80 dark:text-alira-white/80 leading-relaxed max-w-2xl mx-auto">
                Every enquiry is private and secure. We'll get back to you within 24 hours.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact Form & Details Section */}
      <section className="py-24 bg-white dark:bg-alira-primary/20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* Contact Form */}
              <Reveal delay={200}>
                <div className="bg-alira-white/30 dark:bg-alira-primary/20 p-8 rounded-2xl border border-alira-primary/10 dark:border-alira-white/10">
                  <h2 className="text-3xl font-serif font-normal text-alira-primary dark:text-alira-white mb-6">Send us a message</h2>
                  <p className="text-alira-primary/70 dark:text-alira-white/70 mb-8">
                    Tell us about your project, idea, or challenge. We're here to help you move forward.
                  </p>
                  
                  {/* Success Message */}
                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-green-800 font-sans font-light">Message sent successfully!</p>
                      </div>
                      <p className="text-green-700 text-sm mt-1">We'll get back to you within 24 hours.</p>
                    </div>
                  )}

                  {/* Error Message */}
                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <p className="text-red-800 font-sans font-light">Failed to send message</p>
                      </div>
                      <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm sm:text-base font-sans font-light text-alira-primary dark:text-alira-white mb-2">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-alira-primary/20 rounded-lg focus:border-alira-gold focus:ring-2 focus:ring-alira-gold/20 transition-colors disabled:opacity-50 text-base"
                        placeholder="Your full name"
                        aria-required="true"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm sm:text-base font-sans font-light text-alira-primary dark:text-alira-white mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-alira-primary/20 rounded-lg focus:border-alira-gold focus:ring-2 focus:ring-alira-gold/20 transition-colors disabled:opacity-50 text-base"
                        placeholder="your.email@example.com"
                        aria-required="true"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm sm:text-base font-sans font-light text-alira-primary dark:text-alira-white mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-alira-primary/20 rounded-lg focus:border-alira-gold focus:ring-2 focus:ring-alira-gold/20 transition-colors resize-none disabled:opacity-50 text-base"
                        placeholder="Tell us about your project, idea, or what you'd like to achieve..."
                        aria-required="true"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-alira-primary dark:bg-alira-white hover:bg-alira-primary/90 dark:hover:bg-alira-white/90 text-white dark:text-alira-black py-3 px-6 rounded-lg font-sans font-light transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white dark:border-alira-primary mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </form>
                </div>
              </Reveal>

              {/* Contact Details */}
              <Reveal delay={400}>
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-serif font-normal text-alira-primary dark:text-alira-white mb-6">Direct Contact</h2>
                    <p className="text-alira-primary/70 dark:text-alira-white/70 mb-8">
                      Prefer to reach out directly? Here's how you can get in touch with us.
                    </p>
                  </div>

                  {/* Email */}
                  <div className="bg-white dark:bg-alira-primary/20 p-6 rounded-xl border border-alira-primary/10 dark:border-alira-white/10 hover:border-alira-gold/20 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-alira-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-normal text-alira-primary dark:text-alira-white mb-2">Email</h3>
                        <a 
                          href="mailto:Enquiries@aliracapital.co.uk" 
                          className="text-alira-gold hover:text-alira-gold/80 dark:hover:text-alira-gold transition-colors font-sans font-light"
                        >
                          Enquiries@aliracapital.co.uk
                        </a>
                        <p className="text-alira-primary/70 dark:text-alira-white/70 text-sm mt-1">
                          We typically respond within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="bg-white dark:bg-alira-primary/20 p-6 rounded-xl border border-alira-primary/10 dark:border-alira-white/10">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-alira-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-normal text-alira-primary dark:text-alira-white mb-2">Company Details</h3>
                        <div className="text-alira-primary/80 dark:text-alira-white/80 space-y-1 font-sans">
                          <p><strong>ALIRA Capital Ventures Ltd</strong></p>
                          <p>Registered in England & Wales</p>
                          <p>Company No: 16419663</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="bg-gradient-to-r from-alira-gold/10 to-alira-white/20 dark:from-alira-gold/20 dark:to-alira-primary/30 p-6 rounded-xl border border-alira-gold/20">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-alira-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-normal text-alira-primary dark:text-alira-white mb-2">Quick Response</h3>
                        <p className="text-alira-primary/80 dark:text-alira-white/80 font-sans">
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
              <h2 className="text-4xl md:text-5xl font-serif font-normal text-white dark:text-alira-black mb-6">
                Ready to get started?
              </h2>
              <p className="text-xl text-white/80 dark:text-alira-black/80 dark:text-alira-white/80 mb-8 leading-relaxed">
                Don't wait for the perfect moment. The best time to start is now.
              </p>
              <CTAButton 
                href="/#start-chat" 
                variant="alira"
                className="px-8 py-4 text-lg font-sans font-light"
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
