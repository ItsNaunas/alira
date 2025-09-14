'use client'

import FormWizard from '@/components/FormWizard'
import LivePreview from '@/components/LivePreview'
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
        className="min-h-screen flex items-center justify-center bg-alira-porcelain relative overflow-hidden"
        aria-labelledby="form-heading"
      >
        {/* Minimal Background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Architectural grid background */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <pattern
                id="alira-grid-form"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path 
                  d="M 40 0 L 0 0 0 40" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="0.5" 
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#alira-grid-form)"
              className="text-alira-onyx/10"
              opacity="0.35"
            />
            {/* Subtle major lines */}
            <g className="text-alira-onyx/15" opacity="0.25">
              <path d="M0,80 L500,80" stroke="currentColor" strokeWidth="0.6" />
              <path d="M0,160 L500,160" stroke="currentColor" strokeWidth="0.6" />
              <path d="M120,0 L120,300" stroke="currentColor" strokeWidth="0.6" />
              <path d="M240,0 L240,300" stroke="currentColor" strokeWidth="0.6" />
            </g>
          </svg>
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 opacity-[0.01] bg-gradient-to-br from-alira-onyx via-transparent to-alira-gold"></div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Back Link */}
            <Reveal>
              <div className="mb-8">
                <Link
                  href="/"
                  className="inline-flex items-center text-alira-onyx/70 hover:text-alira-onyx transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </div>
            </Reveal>

            {/* Brand Seal */}
            <Reveal delay={100}>
              <div className="mb-16">
                <span className="block text-3xl tracking-[0.2em] uppercase text-alira-onyx font-bold mb-4 font-serif">
                  ALIRA.
                </span>
                <div className="w-20 h-[3px] bg-alira-gold mx-auto mb-12"></div>
              </div>
            </Reveal>
            
            {/* Headline */}
            <Reveal delay={200}>
              <h1 id="form-heading" className="text-5xl md:text-7xl font-bold text-alira-onyx leading-[0.95] tracking-tight mb-8">
                Start Your Business Case
              </h1>
            </Reveal>
            
            {/* Subheadline */}
            <Reveal delay={250}>
              <p className="text-xl md:text-2xl text-alira-ink/80 max-w-[50ch] mx-auto leading-snug mb-16">
                Answer 4 quick questions to see your business case preview, then get your complete customized business case delivered to your inbox.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-8 md:py-12 bg-gradient-to-br from-alira-porcelain/20 via-white to-alira-porcelain/10 relative overflow-hidden">
        {/* Subtle background grid */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <pattern
                id="alira-grid-form-bg"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path 
                  d="M 60 0 L 0 0 0 60" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="0.5" 
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#alira-grid-form-bg)"
              className="text-alira-onyx/5"
              opacity="0.3"
            />
          </svg>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-8">
              {/* Form Wizard */}
              <div className="lg:col-span-3">
                <FormWizard 
                  resumeToken={resumeToken}
                  initialData={initialData}
                  draftId={draftId}
                />
              </div>
              
              {/* Live Preview - Sticky */}
              <div className="lg:col-span-2">
                <div className="hidden lg:block lg:sticky lg:top-8">
                  <LivePreview data={initialData || {}} />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process Information */}
      <section className="py-16 md:py-20 bg-alira-onyx/5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h3 className="text-2xl font-serif font-bold text-alira-onyx mb-6">
                  What Happens Next?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-4">
                    <span className="text-alira-gold font-bold text-lg">1.</span>
                    <span className="text-alira-onyx/70">Answer 4 quick questions to see your business case preview</span>
                  </li>
                  <li className="flex items-start space-x-4">
                    <span className="text-alira-gold font-bold text-lg">2.</span>
                    <span className="text-alira-onyx/70">Complete the full form to get your complete business case</span>
                  </li>
                  <li className="flex items-start space-x-4">
                    <span className="text-alira-gold font-bold text-lg">3.</span>
                    <span className="text-alira-onyx/70">We'll review your information and reach out within minutes</span>
                  </li>
                  <li className="flex items-start space-x-4">
                    <span className="text-alira-gold font-bold text-lg">4.</span>
                    <span className="text-alira-onyx/70">Schedule a consultation call to discuss your business case</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-alira-onyx mb-6">
                  Why This Approach?
                </h3>
                <p className="text-alira-onyx/70 leading-relaxed">
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
