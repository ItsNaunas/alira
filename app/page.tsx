'use client'

import { useEffect, useState } from 'react'
import React from 'react'
import Image from 'next/image'

import WhatYouGet from '@/components/WhatYouGet'
import MeetTheTeam from '@/components/MeetTheFounder'
import HowItWorks from '@/components/HowItWorks'
import OurPhilosophy from '@/components/OurPhilosophy'
import HomeServices from '@/components/HomeServices'
import Experience from '@/components/Experience'
import ClientResults from '@/components/ClientResults'
import ProvenOutcomes from '@/components/ProvenOutcomes'
import FAQ from '@/components/FAQ'

import StickyCTA from '@/components/StickyCTA'
import FinalCTA from '@/components/FinalCTA'
import Reveal from '@/components/Reveal'
import CTAButton from '@/components/CTAButton'
import MiniForm from '@/components/MiniForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, CheckCircle, Users, Target, Zap, FileCheck } from 'lucide-react'
import Link from 'next/link'
import { conversionEvents } from '@/lib/analytics'

export default function Home() {
  // Track page view
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      conversionEvents.pageView('homepage')
    }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-alira-gold/5 via-white to-alira-gold/10 dark:from-alira-gold/10 dark:via-alira-onyx dark:to-alira-gold/5 relative overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Clean Background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Soft gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-alira-gold/3 via-white/50 to-alira-gold/5 dark:from-alira-gold/5 dark:via-alira-onyx/80 dark:to-alira-gold/3"></div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* ALIRA Logo Centered at Top */}
            <Reveal>
              <div className="text-center mb-16">
                <span className="block text-4xl md:text-5xl lg:text-6xl tracking-[0.2em] uppercase text-alira-onyx dark:text-alira-porcelain font-heading mb-6">
                  ALIRA
                </span>
                <div className="w-24 h-[2px] bg-alira-gold mx-auto mb-8"></div>
              </div>
            </Reveal>
            
            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* Left Column - Text Content */}
              <div className="text-center lg:text-left">
            {/* Headline */}
            <Reveal delay={200}>
                  <h1 id="hero-heading" className="text-3xl md:text-4xl lg:text-5xl font-heading text-alira-onyx dark:text-alira-porcelain leading-[0.95] tracking-tight mb-8">
                    Services that help you grow — <span className="text-alira-gold">strategy, content, and systems</span> that scale
              </h1>
            </Reveal>
            
            {/* Subheadline */}
            <Reveal delay={250}>
                  <p className="text-lg md:text-xl lg:text-2xl text-alira-onyx dark:text-alira-porcelain font-body italic font-light max-w-[65ch] mx-auto lg:mx-0 leading-tight mb-12">
                    Tell us about your idea, and we'll instantly generate a free, tailored plan — ready to use in minutes.
              </p>
            </Reveal>
            
                {/* CTA Button */}
            <Reveal delay={300}>
                  <div className="space-y-6">
                    <CTAButton 
                      href="#start-form" 
                      variant="alira"
                      className="px-12 py-6 text-xl font-medium"
                      location="hero"
                    >
                      Start My Plan
                    </CTAButton>
                    <p className="text-lg text-alira-onyx dark:text-alira-porcelain/70 font-medium">
                  Free • Private • No card required • Delivered in minutes
                </p>
              </div>
            </Reveal>
                </div>

              {/* Right Column - Hero Mockup */}
              <Reveal delay={400}>
                <div className="flex justify-center lg:justify-end">
                  <div className="w-full max-w-[560px] h-[400px] relative">
                    <Image 
                      src="/images/hero/laptop-mockup.png" 
                      alt="ALIRA Platform - Laptop Mockup"
                      width={560}
                      height={400}
                      className="rounded-2xl object-cover w-full h-full"
                      priority
                    />
              </div>
            </div>
          </Reveal>

            </div>
            </div>
        </div>
      </section>


      {/* How It Works Section */}
      <HowItWorks />

      {/* Choose Your Service Section */}
      <HomeServices />

      {/* Meet the Team Section */}
      <MeetTheTeam />

      {/* FAQ Section */}
      <FAQ />

      {/* Form Section */}
      <section id="start-form" className="py-24 bg-white dark:bg-alira-onyx/95">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
              <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-heading text-alira-onyx dark:text-alira-porcelain mb-6">
                  Start Your Plan
                  </h2>
                  <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
                <p className="text-xl text-alira-onyx dark:text-alira-porcelain/70 max-w-2xl mx-auto">
                  Tell us about your idea and get your personalized business plan in minutes.
                  </p>
                </div>
              </Reveal>

            <Reveal delay={200}>
              <div className="bg-white dark:bg-alira-onyx/80 p-8 rounded-2xl border border-alira-onyx/10 shadow-xl">
                <MiniForm />
                  </div>
                </Reveal>
          </div>
        </div>
                    </section>
      
      {/* Sticky CTA for Mobile */}
      <StickyCTA />
    </div>
  )
}
