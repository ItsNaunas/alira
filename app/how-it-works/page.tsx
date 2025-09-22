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
        className="min-h-screen flex items-center justify-center bg-alira-porcelain dark:bg-alira-onyx relative overflow-hidden"
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
                <span className="block text-3xl tracking-[0.2em] uppercase text-alira-onyx dark:text-alira-porcelain font-bold mb-4 font-serif">
                  ALIRA.
                </span>
                <div className="w-20 h-[3px] bg-alira-gold mx-auto mb-12"></div>
              </div>
            </Reveal>
            
            {/* Headline */}
            <Reveal delay={200}>
              <div className="text-center mb-16">
                <h1 id="how-it-works-heading" className="text-5xl md:text-7xl font-bold text-alira-onyx dark:text-alira-porcelain leading-[0.95] tracking-tight mb-8">
                  Three steps to your <span className="text-alira-gold">business plan</span>
                </h1>
              </div>
            </Reveal>
            
            {/* Process Flow */}
            <Reveal delay={300}>
              <div className="max-w-6xl mx-auto mb-16">
                {/* Horizontal Process Flow */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8 relative">
                  
                  {/* Step 1: Sign up & load funds */}
                  <div className="flex flex-col items-center text-center group flex-1">
                  {/* Large Step Number */}
                  <div className="mb-6">
                    <span className="text-6xl font-bold text-alira-gold/80 group-hover:text-alira-gold transition-colors duration-300">1</span>
                  </div>
                    
                    <h3 className="text-xl font-semibold text-alira-onyx dark:text-alira-porcelain mb-4 group-hover:text-alira-gold transition-colors duration-300">
                      Answer questions
                    </h3>
                    <p className="text-alira-onyx/70 dark:text-alira-porcelain/70 leading-relaxed mb-8">
                      Tell us about your idea or business through our quick, structured questionnaire.
                    </p>
                    
                    {/* Device Illustration - Larger */}
                    <div className="w-72 h-54 flex items-center justify-center">
                      <Image 
                        src="/images/how-it-works/step1-signup.png" 
                        alt="Step 1: Answer questions"
                        width={288}
                        height={216}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Connecting Arrow 1 - Improved */}
                  <div className="hidden lg:flex items-center justify-center w-16 h-12 relative">
                    <svg className="w-16 h-12 text-alira-gold" viewBox="0 0 64 48" fill="none">
                      <path d="M4 24 Q32 6 60 24" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5,3" fill="none"/>
                      <path d="M54 20 L60 24 L54 28" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                    </svg>
                  </div>

                  {/* Step 2: Set your spending rules */}
                  <div className="flex flex-col items-center text-center group flex-1">
                    {/* Large Step Number */}
                    <div className="mb-6">
                      <span className="text-6xl font-bold text-alira-gold/80 group-hover:text-alira-gold transition-colors duration-300">2</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-alira-onyx dark:text-alira-porcelain mb-4 group-hover:text-alira-gold transition-colors duration-300">
                      AI analysis
                    </h3>
                    <p className="text-alira-onyx/70 dark:text-alira-porcelain/70 leading-relaxed mb-8">
                      Our AI processes your information using strategic frameworks to create actionable insights.
                    </p>
                    
                    {/* Device Illustration - Larger */}
                    <div className="w-72 h-54 flex items-center justify-center">
                      <Image 
                        src="/images/how-it-works/step3-invite-team.png" 
                        alt="Step 2: AI analysis"
                        width={288}
                        height={216}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Connecting Arrow 2 - Improved */}
                  <div className="hidden lg:flex items-center justify-center w-20 h-16 relative">
                    <svg className="w-20 h-16 text-alira-gold" viewBox="0 0 80 64" fill="none">
                      <path d="M5 32 Q40 8 75 32" stroke="currentColor" strokeWidth="3" strokeDasharray="6,4" fill="none"/>
                      <path d="M68 26 L75 32 L68 38" stroke="currentColor" strokeWidth="3" fill="none"/>
                    </svg>
                  </div>

                  {/* Step 3: Invite your team */}
                  <div className="flex flex-col items-center text-center group flex-1">
                    {/* Large Step Number */}
                    <div className="mb-6">
                      <span className="text-6xl font-bold text-alira-gold/80 group-hover:text-alira-gold transition-colors duration-300">3</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-alira-onyx dark:text-alira-porcelain mb-4 group-hover:text-alira-gold transition-colors duration-300">
                      Get your plan
                    </h3>
                    <p className="text-alira-onyx/70 dark:text-alira-porcelain/70 leading-relaxed mb-8">
                      Receive a comprehensive PDF business plan tailored to your specific situation and goals.
                    </p>
                    
                    {/* Device Illustration - Larger */}
                    <div className="w-72 h-54 flex items-center justify-center">
                      <Image 
                        src="/images/how-it-works/step2-spending-rules.png" 
                        alt="Step 3: Get your plan"
                        width={288}
                        height={216}
                        className="w-full h-full object-contain"
                      />
                    </div>
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
                <p className="text-sm text-alira-onyx/70 dark:text-alira-porcelain/70 font-medium">
                  Free • Private • No card required • Delivered in minutes
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Detailed Explanation Section */}
      <section className="py-24 bg-white dark:bg-alira-onyx/20">
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
                <div className="bg-alira-onyx/5 dark:bg-alira-porcelain/5 p-8 rounded-lg border border-alira-onyx/10 dark:border-alira-porcelain/10">
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
      <section className="py-24 bg-alira-onyx dark:bg-alira-porcelain">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <div className="space-y-12">
                <div className="relative">
                  <h2 className="text-4xl md:text-5xl font-bold text-white dark:text-alira-onyx mb-6 leading-tight">
                    Ready to See It in Action?
                  </h2>
                  <div className="w-20 h-px bg-alira-gold mx-auto"></div>
                </div>
                
                <p className="text-xl text-white/80 dark:text-alira-onyx/80 max-w-2xl mx-auto leading-relaxed">
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
