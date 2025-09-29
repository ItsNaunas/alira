'use client'

import FormWizard from '@/components/FormWizard'
import Reveal from '@/components/Reveal'
import SectionHeading from '@/components/ui/SectionHeading'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { conversionEvents } from '@/lib/analytics'
import React from 'react'

export default function Form() {
  const [resumeToken, setResumeToken] = React.useState<string | undefined>()
  const [initialData, setInitialData] = React.useState<any>(null)
  const [draftId, setDraftId] = React.useState<string | undefined>()

  // Track page view
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      conversionEvents.pageView('form_page')
      conversionEvents.formStarted('business_case_initial')
      
      // Check for resume token in URL
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('resume')
      if (token) {
        setResumeToken(token)
      }
    }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="min-h-screen flex items-center justify-center bg-alira-porcelain dark:bg-alira-onyx relative overflow-hidden"
        aria-labelledby="form-heading"
      >
        {/* Clean background */}
        <div className="absolute inset-0 bg-gradient-to-br from-alira-porcelain/20 via-white to-alira-porcelain/10 dark:from-alira-onyx/20 dark:via-alira-onyx dark:to-alira-onyx/10"></div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Back Link */}
            <Reveal>
              <div className="mb-8">
                <Link
                  href="/"
                  className="inline-flex items-center text-alira-onyx/70 dark:text-alira-porcelain/70 hover:text-alira-onyx dark:text-alira-porcelain dark:hover:text-alira-porcelain transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </div>
            </Reveal>

            {/* Brand Seal */}
            <Reveal delay={100}>
              <div className="mb-16">
                <span className="block text-3xl tracking-[0.2em] uppercase text-alira-onyx dark:text-alira-porcelain font-serif font-bold mb-4 font-serif">
                  ALIRA.
                </span>
                <div className="w-20 h-[3px] bg-alira-gold mx-auto mb-12"></div>
              </div>
            </Reveal>
            
            {/* Headline */}
            <Reveal delay={200}>
              <h1 id="form-heading" className="text-5xl md:text-7xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain leading-[0.95] tracking-tight mb-8">
                Start Your Business Case
              </h1>
            </Reveal>
            
            {/* Subheadline */}
            <Reveal delay={250}>
              <p className="text-xl md:text-2xl text-alira-ink/80 dark:text-alira-porcelain/80 max-w-[50ch] mx-auto leading-snug mb-16">
                Answer 4 quick questions to see your business case preview, then get your complete customized business case delivered to your inbox.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-8 md:py-12 bg-gradient-to-br from-alira-porcelain/20 via-white to-alira-porcelain/10 dark:from-alira-onyx/20 dark:via-alira-onyx dark:to-alira-onyx/10 relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 relative z-10">
          <Reveal>
            <FormWizard 
              resumeToken={resumeToken}
              initialData={initialData}
              draftId={draftId}
            />
          </Reveal>
        </div>
      </section>

      {/* Process Information */}
      <section className="py-16 md:py-20 bg-alira-onyx/5 dark:bg-alira-onyx/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h3 className="text-2xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-6">
                  What Happens Next?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-4">
                    <span className="text-alira-gold font-serif font-bold text-lg">1.</span>
                    <span className="text-alira-onyx/70 dark:text-alira-porcelain/70">Answer 4 quick questions to see your business case preview</span>
                  </li>
                  <li className="flex items-start space-x-4">
                    <span className="text-alira-gold font-serif font-bold text-lg">2.</span>
                    <span className="text-alira-onyx/70 dark:text-alira-porcelain/70">Complete the full form to get your complete business case</span>
                  </li>
                  <li className="flex items-start space-x-4">
                    <span className="text-alira-gold font-serif font-bold text-lg">3.</span>
                    <span className="text-alira-onyx/70 dark:text-alira-porcelain/70">We'll review your information and reach out within minutes</span>
                  </li>
                  <li className="flex items-start space-x-4">
                    <span className="text-alira-gold font-serif font-bold text-lg">4.</span>
                    <span className="text-alira-onyx/70 dark:text-alira-porcelain/70">Schedule a consultation call to discuss your business case</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-6">
                  Why This Approach?
                </h3>
                <p className="text-alira-onyx/70 dark:text-alira-porcelain/70 leading-relaxed">
                  We believe every business owner deserves to see value before committing. Our preview-first approach ensures you understand exactly what you'll receive, while our comprehensive form captures all the details needed for your complete, customized business case.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
