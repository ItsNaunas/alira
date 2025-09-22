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
        className="min-h-screen flex items-center justify-center bg-alira-porcelain dark:bg-alira-onyx relative overflow-hidden"
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
              className="text-alira-onyx dark:text-alira-porcelain/10 dark:text-alira-porcelain/10"
              opacity="0.35"
            />
            {/* Subtle major lines */}
            <g className="text-alira-onyx dark:text-alira-porcelain/15 dark:text-alira-porcelain/15" opacity="0.25">
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
                <span className="block text-3xl tracking-[0.2em] uppercase text-alira-onyx dark:text-alira-porcelain font-bold mb-4 font-serif">
                  ALIRA.
                </span>
                <div className="w-20 h-[3px] bg-alira-gold mx-auto mb-12"></div>
              </div>
            </Reveal>
            
            {/* Headline */}
            <Reveal delay={200}>
              <h1 id="hero-heading" className="text-5xl md:text-7xl font-bold text-alira-onyx dark:text-alira-porcelain leading-[0.95] tracking-tight mb-8">
                Get a <span className="text-alira-gold">simple plan</span> for your idea or business in minutes.
              </h1>
            </Reveal>
            
            {/* Subheadline */}
            <Reveal delay={250}>
              <p className="text-2xl md:text-3xl text-alira-onyx dark:text-alira-porcelain font-serif italic font-light max-w-[60ch] mx-auto leading-tight mb-8">
                Answer a few quick questions and receive a clear PDF plan with next steps. Free, private, no card required.
              </p>
            </Reveal>
            
            {/* Mini Form */}
            <Reveal delay={300}>
              <div className="space-y-4">
                <MiniForm />
                <p className="text-sm text-alira-onyx dark:text-alira-porcelain/70 font-medium">
                  Free • Private • No card required • Delivered in minutes
                </p>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <WhatYouGet />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Home Services Section */}
      <HomeServices />

      {/* Meet the Team Section */}
      <MeetTheTeam />

      {/* Experience Section */}
      <Experience />

      {/* Client Results Section */}
      <ClientResults />

      {/* Proven Outcomes Section */}
      <ProvenOutcomes />

              {/* FAQ Section */}
      <FAQ />

        {/* Our Philosophy Section */}
      <OurPhilosophy />

      {/* Final CTA Section */}
      <FinalCTA />
      
      {/* Sticky CTA for Mobile */}
      <StickyCTA />
    </div>
  )
}