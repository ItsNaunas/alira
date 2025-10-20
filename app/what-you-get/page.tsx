'use client'

import React from 'react'
import { FileText, Compass, MapPin, CheckCircle, Clock, Target, Lightbulb, TrendingUp } from "lucide-react"
import Reveal from '@/components/Reveal'
import CTAButton from '@/components/CTAButton'
import { conversionEvents } from '@/lib/analytics'

export default function WhatYouGetPage() {
  // Track page view
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      conversionEvents.pageView('what-you-get')
    }
  }, [])

  const mainBenefits = [
    {
      icon: FileText,
      title: "A clear plan",
      desc: "Simple, actionable steps you can follow immediately.",
    },
    {
      icon: Compass,
      title: "Next steps",
      desc: "Know exactly what to do first to move forward.",
    },
    {
      icon: MapPin,
      title: "Direction you can use today",
      desc: "No waiting, no confusion — just clear direction.",
    },
  ]

  const detailedFeatures = [
    {
      icon: Target,
      title: "Problem Statement & Objectives",
      description: "Clear definition of what you're solving and what success looks like",
      details: [
        "Core problem identification",
        "Success metrics defined",
        "Target audience clarified",
        "Key assumptions outlined"
      ]
    },
    {
      icon: Lightbulb,
      title: "Proposed Solution",
      description: "Practical approach tailored to your specific situation",
      details: [
        "Solution framework",
        "Implementation approach",
        "Resource requirements",
        "Risk mitigation strategies"
      ]
    },
    {
      icon: TrendingUp,
      title: "90-Day Action Plan",
      description: "Immediate steps to get started and build momentum",
      details: [
        "Week 1-4: Foundation setup",
        "Month 2: Core implementation",
        "Month 3: Testing & refinement",
        "Key milestones & checkpoints"
      ]
    },
    {
      icon: CheckCircle,
      title: "Next Steps & Resources",
      description: "Everything you need to continue beyond the initial 90 days",
      details: [
        "Priority action items",
        "Recommended tools & resources",
        "Follow-up opportunities",
        "Long-term growth pathway"
      ]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-alira-gold/5 via-white to-alira-gold/10 dark:from-alira-gold/10 dark:via-alira-primary dark:to-alira-gold/5">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <div className="mb-12">
                <span className="text-alira-gold text-sm tracking-wide uppercase mb-4 font-sans font-light block">
                  WHAT YOU GET
                </span>
                <h1 className="text-5xl md:text-6xl font-serif font-normal text-alira-primary dark:text-alira-white leading-tight mb-6">
                  Your Complete Business Plan
                </h1>
                <div className="w-20 h-px bg-alira-gold mx-auto mb-8"></div>
                <p className="text-xl md:text-2xl text-alira-primary dark:text-alira-white/70 max-w-3xl mx-auto leading-relaxed">
                  In minutes, you'll receive a comprehensive PDF that shows everything you need to move forward with confidence.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Main Benefits */}
      <section className="py-20 bg-gradient-to-br from-alira-gold/3 via-alira-gold/5 to-alira-gold/8 dark:from-alira-gold/8 dark:via-alira-primary dark:to-alira-gold/3">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-normal text-alira-primary dark:text-alira-white mb-6">
                  Three Things You Get Immediately
                </h2>
                <div className="w-16 h-px bg-alira-gold mx-auto"></div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
              {mainBenefits.map(({ icon: Icon, title, desc }, index) => (
                <Reveal key={title} delay={index * 100}>
                  <article className="group rounded-2xl border border-alira-primary/5 dark:border-alira-white/5 bg-white dark:bg-alira-primary/80 p-8 lg:p-10 transition-all duration-300 hover:-translate-y-1 hover:border-alira-gold/20 hover:shadow-xl">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-xl bg-alira-gold/10 text-alira-gold">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="w-12 h-[2px] bg-alira-gold mb-4"></div>
                        <h3 className="text-lg font-serif font-normal text-alira-primary dark:text-alira-white mb-3 leading-tight">
                          {title}
                        </h3>
                        <p className="text-alira-primary dark:text-alira-white/70 leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            {/* Quick Stats */}
            <Reveal delay={400}>
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12 text-center bg-alira-white/20 dark:bg-alira-white/5 rounded-2xl p-8">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-serif font-normal text-alira-primary dark:text-alira-white">Ready in minutes</span>
                  <span className="text-sm text-alira-primary dark:text-alira-white/60 mt-1">delivered instantly</span>
                </div>
                <div className="hidden md:block w-px h-8 bg-alira-primary/20"></div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-serif font-normal text-alira-primary dark:text-alira-white">100% custom</span>
                  <span className="text-sm text-alira-primary dark:text-alira-white/60 mt-1">tailored to your business</span>
                </div>
                <div className="hidden md:block w-px h-8 bg-alira-primary/20"></div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-serif font-normal text-alira-primary dark:text-alira-white">Ready to use</span>
                  <span className="text-sm text-alira-primary dark:text-alira-white/60 mt-1">implement immediately</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-20 bg-white dark:bg-alira-primary">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-normal text-alira-primary dark:text-alira-white mb-6">
                  What's Inside Your Plan
                </h2>
                <div className="w-16 h-px bg-alira-gold mx-auto mb-6"></div>
                <p className="text-xl text-alira-primary dark:text-alira-white/70 max-w-3xl mx-auto">
                  Every plan is structured to give you maximum clarity and actionable next steps.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {detailedFeatures.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <Reveal key={index} delay={index * 150}>
                    <div className="bg-white dark:bg-alira-primary/80 rounded-2xl p-8 border border-alira-primary/10 hover:border-alira-gold/20 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-alira-gold/10 rounded-xl flex items-center justify-center mr-4">
                          <IconComponent className="w-6 h-6 text-alira-gold" />
                        </div>
                        <div>
                          <h3 className="text-xl font-serif font-normal text-alira-primary dark:text-alira-white">
                            {feature.title}
                          </h3>
                        </div>
                      </div>
                      
                      <p className="text-alira-primary dark:text-alira-white/80 mb-6 leading-relaxed">
                        {feature.description}
                      </p>

                      <ul className="space-y-3">
                        {feature.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-alira-gold rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-alira-primary dark:text-alira-white/70 text-sm">
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-alira-primary via-alira-primary to-alira-gold/20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-serif font-normal text-white mb-6 leading-tight">
                    Ready to get your plan?
                  </h2>
                  <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                    Answer a few quick questions and receive your personalized business plan in minutes.
                  </p>
                  <div className="w-20 h-px bg-alira-gold mx-auto mb-8"></div>
                </div>
                
                <div className="space-y-4">
                  <CTAButton 
                    href="/#start-chat" 
                    variant="aliraOutline"
                    className="px-12 py-6 text-xl font-sans font-light"
                    location="what-you-get-cta"
                  >
                    Start My Plan
                  </CTAButton>
                  <p className="text-sm text-white/70">
                    Free • Private • No card required • Delivered in minutes
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
