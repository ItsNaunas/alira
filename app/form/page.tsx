import IntakeForm from '@/components/IntakeForm'
import Reveal from '@/components/Reveal'
import SectionHeading from '@/components/ui/SectionHeading'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function Form() {
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
              <path d="M0 80 H100%" stroke="currentColor" strokeWidth="0.6" />
              <path d="M0 160 H100%" stroke="currentColor" strokeWidth="0.6" />
              <path d="M120 0 V100%" stroke="currentColor" strokeWidth="0.6" />
              <path d="M240 0 V100%" stroke="currentColor" strokeWidth="0.6" />
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
                  href="/contact"
                  className="inline-flex items-center text-alira-onyx/70 hover:text-alira-onyx transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Contact
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
                Generate Your Business Case
              </h1>
            </Reveal>
            
            {/* Subheadline */}
            <Reveal delay={250}>
              <p className="text-xl md:text-2xl text-alira-ink/80 max-w-[50ch] mx-auto leading-snug mb-16">
                Complete the form below to receive a comprehensive Draft Business Case tailored to your specific situation. This is the first step in your journey with ALIRA.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <IntakeForm />
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
                    <span className="text-alira-onyx/70">Complete the intake form and receive your Draft Business Case</span>
                  </li>
                  <li className="flex items-start space-x-4">
                    <span className="text-alira-gold font-bold text-lg">2.</span>
                    <span className="text-alira-onyx/70">We'll review your information and reach out within 24 hours</span>
                  </li>
                  <li className="flex items-start space-x-4">
                    <span className="text-alira-gold font-bold text-lg">3.</span>
                    <span className="text-alira-onyx/70">Schedule a consultation call to discuss your business case</span>
                  </li>
                  <li className="flex items-start space-x-4">
                    <span className="text-alira-gold font-bold text-lg">4.</span>
                    <span className="text-alira-onyx/70">Refine the approach and begin your engagement</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-alira-onyx mb-6">
                  Why This Approach?
                </h3>
                <p className="text-alira-onyx/70 leading-relaxed">
                  We believe every business owner deserves to start with clarity, not confusion. Our intake form ensures we capture the essential information needed to create a meaningful business case, while our immediate PDF generation gives you tangible value from the very first interaction.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
