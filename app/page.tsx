'use client'

import { useEffect, useState } from 'react'
import React from 'react'

import WhatYouGet from '@/components/WhatYouGet'
import ProcessDiagram from '@/components/ProcessDiagram'
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
        className="min-h-screen flex items-center justify-center bg-alira-porcelain relative overflow-hidden"
        aria-labelledby="hero-heading"
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
                id="alira-grid"
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
              fill="url(#alira-grid)"
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
            {/* Brand Seal */}
            <Reveal>
              <div className="mb-16">
                <span className="block text-3xl tracking-[0.2em] uppercase text-alira-onyx font-bold mb-4 font-serif">
                  ALIRA.
                </span>
                <div className="w-20 h-[3px] bg-alira-gold mx-auto mb-12"></div>
              </div>
            </Reveal>
            
            {/* Headline */}
            <Reveal delay={200}>
              <h1 id="hero-heading" className="text-5xl md:text-7xl font-bold text-alira-onyx leading-[0.95] tracking-tight mb-8">
                Get a <span className="text-alira-gold">simple plan</span> for your idea or business in minutes.
              </h1>
            </Reveal>
            
            {/* Subheadline */}
            <Reveal delay={250}>
              <p className="text-2xl md:text-3xl text-alira-onyx font-serif italic font-light max-w-[60ch] mx-auto leading-tight mb-8">
                Answer a few quick questions and receive a clear PDF plan with next steps. Free, private, no card required.
              </p>
            </Reveal>
            
            {/* CTA Button */}
            <Reveal delay={300}>
              <div className="space-y-4">
                <CTAButton 
                  href="/form" 
                  variant="alira"
                  className="px-8 py-4 text-lg font-medium"
                  location="hero"
                />
                <p className="text-sm text-alira-onyx/70 font-medium">
                  Free • Private • No card required • Delivered in minutes
                </p>
              </div>
            </Reveal>



          </div>
        </div>
      </section>

      {/* Proven Outcomes Section */}
      <ProvenOutcomes />

      {/* What You Get Section */}
      <WhatYouGet />

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-r from-alira-porcelain/20 via-white to-alira-porcelain/20 relative z-[1]" id="how-it-works">
        <div className="container mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="h2 mb-6">
                How it works
              </h2>
              
              {/* Gold hairline */}
              <div className="w-16 h-px bg-alira-gold mx-auto mb-6"></div>
              
              <p className="copy text-xl md:text-2xl max-w-[65ch] mx-auto">
                Simple steps to get your plan ready in minutes.
              </p>
            </div>
          </Reveal>
          
          <Reveal delay={200}>
            <div className="max-w-5xl mx-auto">
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

          {/* CTA */}
          <Reveal delay={400}>
            <div className="text-center mt-20">
              <CTAButton 
                href="/form" 
                variant="alira"
                className="px-8 py-4 text-lg font-medium"
                location="how-it-works"
              />
              <p className="text-sm text-alira-onyx/70 mt-4">
                Free • Private • No card required • Delivered in minutes
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Meet the Founder Section */}
      <section className="py-24 bg-gradient-to-br from-alira-porcelain/30 via-white to-alira-porcelain/20 relative overflow-hidden" aria-labelledby="founder-heading">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #0B0B0B 1px, transparent 1px),
                             linear-gradient(to bottom, #0B0B0B 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-20">
                <h2 id="founder-heading" className="text-4xl md:text-5xl font-bold text-alira-onyx mb-6">
                  Meet the Founder
                </h2>
                <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
              </div>
            </Reveal>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left column - Story */}
              <Reveal delay={200}>
                <div className="space-y-8">
                  {/* Opening statement */}
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-alira-gold/30"></div>
                    <p className="text-2xl text-alira-onyx font-serif italic leading-relaxed pl-6">
                      "I know what it feels like to have ambition but no clear path."
                    </p>
                  </div>

                  {/* Personal journey */}
                  <div className="space-y-6">
                    <p className="text-lg text-alira-onyx/80 leading-relaxed">
                      For over a decade, I worked in project management and operations, leading teams, fixing systems, and delivering projects that saved organisations time and money.
                    </p>
                    
                    <p className="text-lg text-alira-onyx/80 leading-relaxed">
                      But I kept seeing the same pattern: brilliant people with great ideas getting stuck in complexity. Projects that should take weeks taking months. Simple problems becoming complicated messes.
                    </p>
                    
                    <p className="text-lg text-alira-onyx/80 leading-relaxed">
                      The frustration was real. I'd watch talented founders and teams spin their wheels, not because they lacked vision, but because they lacked clarity on the next step.
                    </p>
                  </div>

                  {/* The solution */}
                  <div className="bg-alira-onyx/5 p-6 rounded-lg border-l-4 border-alira-gold">
                    <p className="text-lg text-alira-onyx font-medium leading-relaxed">
                      That's why I built ALIRA. To strip away the noise and give people what they actually need: a simple plan, clear steps, and the confidence to move forward.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Right column - Visual elements and CTA */}
              <Reveal delay={400}>
                <div className="space-y-8">
                                            {/* Founder photo with elegant styling */}
                          <div className="relative">
                            <div className="w-full h-80 rounded-2xl overflow-hidden border border-alira-onyx/10 shadow-lg">
                              <img 
                                src="/images/assets/founder.jpg" 
                                alt="ALIRA Founder - Professional headshot"
                                className="w-full h-full object-cover object-top"
                              />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-8 h-8 bg-alira-gold/20 rounded-full"></div>
                            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-alira-gold/30 rounded-full"></div>
                          </div>

                  {/* Credentials/Experience */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-alira-gold rounded-full"></div>
                      <span className="text-alira-onyx/80 font-medium">10+ years in project management</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-alira-gold rounded-full"></div>
                      <span className="text-alira-onyx/80 font-medium">Led teams across multiple industries</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-alira-gold rounded-full"></div>
                      <span className="text-alira-onyx/80 font-medium">Saved organisations time and money</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="text-center pt-4">
                    <CTAButton 
                      href="/contact" 
                      variant="alira"
                      className="px-8 py-4 text-lg font-medium"
                      location="founder-section"
                    >
                      Contact Us
                    </CTAButton>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy Section */}
      <OurPhilosophy />

      {/* Signature Engagements Section */}
      <HomeServices />

      {/* Final CTA Section */}
      <FinalCTA />
      
      {/* Sticky CTA for Mobile */}
      <StickyCTA />
    </div>
  )
}
