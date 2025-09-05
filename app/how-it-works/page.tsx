import React from 'react'
import Reveal from '@/components/Reveal'
import CTAButton from '@/components/CTAButton'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="min-h-screen flex items-center justify-center bg-alira-porcelain relative overflow-hidden"
        aria-labelledby="how-it-works-heading"
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
                id="alira-grid-how-it-works"
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
              fill="url(#alira-grid-how-it-works)"
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
          <div className="max-w-6xl mx-auto">
            {/* Brand Seal */}
            <Reveal>
              <div className="mb-16 text-center">
                <span className="block text-3xl tracking-[0.2em] uppercase text-alira-onyx font-bold mb-4 font-serif">
                  ALIRA.
                </span>
                <div className="w-20 h-[3px] bg-alira-gold mx-auto mb-12"></div>
              </div>
            </Reveal>
            
            {/* Headline */}
            <Reveal delay={200}>
              <div className="text-center mb-16">
                <h1 id="how-it-works-heading" className="text-5xl md:text-7xl font-bold text-alira-onyx leading-[0.95] tracking-tight mb-8">
                  How it <span className="text-alira-gold">works</span>
                </h1>
                
                {/* Subheadline */}
                <p className="text-2xl md:text-3xl text-alira-onyx font-serif italic font-light max-w-[60ch] mx-auto leading-tight mb-8">
                  Simple steps to get your plan ready in minutes.
                </p>
              </div>
            </Reveal>
            
            {/* Process Flow */}
            <Reveal delay={300}>
              <div className="max-w-5xl mx-auto mb-16">
                {/* Horizontal Process Flow */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-16 relative">
                  
                  {/* Step 1: Complete the Form */}
                  <div className="flex flex-col items-center text-center group flex-1">
                    <div className="w-16 h-16 bg-alira-gold/10 rounded-2xl flex items-center justify-center mx-auto border border-alira-gold/20 mb-6 group-hover:border-alira-gold/40 transition-colors duration-300">
                      <svg className="w-8 h-8 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-alira-onyx mb-4 group-hover:text-alira-gold transition-colors duration-300">
                      Tell us a little about your idea or business
                    </h3>
                    <p className="text-alira-onyx/70 leading-relaxed max-w-xs">
                      Quick questions to understand where you are.
                    </p>
                  </div>

                  {/* Connecting Arrow 1 */}
                  <div className="hidden lg:flex items-center justify-center w-16 h-16 relative">
                    <div className="w-12 h-px bg-alira-onyx/30 group-hover:bg-alira-gold transition-colors duration-300"></div>
                    <div className="absolute right-0 w-2 h-2 bg-alira-onyx/30 group-hover:bg-alira-gold border-r-2 border-t-2 border-current transform rotate-45 transition-colors duration-300"></div>
                  </div>

                  {/* Step 2: Engine Processing */}
                  <div className="flex flex-col items-center text-center group flex-1">
                    <div className="w-16 h-16 bg-alira-gold/10 rounded-2xl flex items-center justify-center mx-auto border border-alira-gold/20 mb-6 group-hover:border-alira-gold/40 transition-colors duration-300">
                      <svg className="w-8 h-8 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-alira-onyx mb-4 group-hover:text-alira-gold transition-colors duration-300">
                      We shape it into a clear plan
                    </h3>
                    <p className="text-alira-onyx/70 leading-relaxed max-w-xs">
                      Our system transforms your answers into actionable steps.
                    </p>
                  </div>

                  {/* Connecting Arrow 2 */}
                  <div className="hidden lg:flex items-center justify-center w-16 h-16 relative">
                    <div className="w-12 h-px bg-alira-onyx/30 group-hover:bg-alira-gold transition-colors duration-300"></div>
                    <div className="absolute right-0 w-2 h-2 bg-alira-onyx/30 group-hover:bg-alira-gold border-r-2 border-t-2 border-current transform rotate-45 transition-colors duration-300"></div>
                  </div>

                  {/* Step 3: Receive Your Draft */}
                  <div className="flex flex-col items-center text-center group flex-1">
                    <div className="w-16 h-16 bg-alira-gold/10 rounded-2xl flex items-center justify-center mx-auto border border-alira-gold/20 mb-6 group-hover:border-alira-gold/40 transition-colors duration-300">
                      <svg className="w-8 h-8 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-alira-onyx mb-4 group-hover:text-alira-gold transition-colors duration-300">
                      You get it in minutes — ready to use
                    </h3>
                    <p className="text-alira-onyx/70 leading-relaxed max-w-xs">
                      A simple PDF plan delivered instantly to your inbox.
                    </p>
                  </div>

                </div>
              </div>
            </Reveal>

            {/* CTA Button */}
            <Reveal delay={400}>
              <div className="text-center space-y-4">
                <CTAButton 
                  href="/form" 
                  variant="alira"
                  className="px-8 py-4 text-lg font-medium"
                  location="how-it-works-hero"
                >
                  Start Your Simple Plan
                </CTAButton>
                <p className="text-sm text-alira-onyx/70 font-medium">
                  Free • Private • No card required • Delivered in minutes
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Detailed Explanation Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div>
                    <h2 className="h2 mb-6">
                      From Form to Framework
                    </h2>
                    <div className="w-16 h-px bg-alira-gold mb-8"></div>
                  </div>
                  <div className="space-y-6">
                    <p className="copy text-lg leading-relaxed">
                      Every business case we generate is built on proven strategic frameworks, tailored to your specific industry, stage, and challenges. No generic templates - just sharp, actionable insights.
                    </p>
                    <p className="copy text-lg leading-relaxed">
                      Our engine processes your information through multiple lenses: market analysis, competitive positioning, resource optimization, and growth potential. The result is a document that speaks directly to your situation.
                    </p>
                  </div>
                </div>
                <div className="bg-alira-onyx/5 p-8 rounded-lg border border-alira-onyx/10">
                  <h3 className="h3 mb-6">
                    What You Get
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-4">
                      <span className="text-alira-gold font-bold text-lg">•</span>
                      <span className="copy">Comprehensive problem statement and objectives</span>
                    </li>
                    <li className="flex items-start space-x-4">
                      <span className="text-alira-gold font-bold text-lg">•</span>
                      <span className="copy">Strategic recommendations based on your service choice</span>
                    </li>
                    <li className="flex items-start space-x-4">
                      <span className="text-alira-gold font-bold text-lg">•</span>
                      <span className="copy">Expected outcomes and success metrics</span>
                    </li>
                    <li className="flex items-start space-x-4">
                      <span className="text-alira-gold font-bold text-lg">•</span>
                      <span className="copy">Clear next steps and implementation roadmap</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-alira-onyx">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <div className="space-y-12">
                <div className="relative">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    Ready to See It in Action?
                  </h2>
                  <div className="w-20 h-px bg-alira-gold mx-auto"></div>
                </div>
                
                <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                  Complete our intake form and receive your personalized Draft Business Case within minutes.
                </p>
                
                <div className="inline-block group">
                  <CTAButton 
                    href="/form" 
                    variant="aliraOutline"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
