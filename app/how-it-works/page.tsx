'use client'

import React from 'react'
import HowItWorksScroll from '@/components/HowItWorksScroll'
import Reveal from '@/components/Reveal'
import CTAButton from '@/components/CTAButton'
import { conversionEvents } from '@/lib/analytics'

export default function HowItWorksPage() {
  // Track page view
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      conversionEvents.pageView('how-it-works')
    }
  }, [])

  return (
    <div className="min-h-screen">
      <HowItWorksScroll />
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-alira-primary via-alira-primary to-alira-gold/20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-serif font-normal text-text-inverse mb-6 leading-tight">
                    Ready to get your plan?
                  </h2>
                  <p className="text-xl text-text-inverse/80 mb-8 max-w-2xl mx-auto">
                    Answer a few quick questions and receive your personalized business plan in minutes.
                  </p>
                  <div className="w-20 h-px bg-alira-gold mx-auto mb-8"></div>
                </div>
                
                <div className="space-y-4">
                  <CTAButton 
                    href="/#start-chat" 
                    variant="aliraOutline"
                    className="px-12 py-6 text-xl font-sans font-light"
                    location="how-it-works-cta"
                  >
                    Start My Plan
                  </CTAButton>
                  <p className="text-sm text-text-inverse/70">
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
