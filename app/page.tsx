'use client'

import { useEffect, useState } from 'react'
import React from 'react'

import WhatYouGet from '@/components/WhatYouGet'
import TeamFlipCards from '@/components/TeamFlipCards'
import HowItWorksScroll from '@/components/HowItWorksScroll'
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
import { GradientBars } from '@/components/ui/gradient-bars'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, CheckCircle, Users, Target, Zap, FileCheck } from 'lucide-react'
import VercelV0Chat from '@/components/VercelV0Chat'
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
        className="min-h-screen flex items-center justify-center bg-bg-page relative overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Animated Gradient Bars Background */}
        <GradientBars bars={20} colors={['var(--brand)', 'transparent']} />
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-none mx-auto">
            {/* ALIRA Logo - Smaller */}
            <Reveal>
              <div className="text-center mb-8">
                <span className="block font-serif font-normal tracking-tight text-alira-gold mb-4 text-2xl md:text-3xl lg:text-4xl" style={{ fontSize: 'clamp(24px, 3vw, 48px)' }}>
                  ALIRA<span className="text-alira-gold">.</span>
                </span>
                <div className="w-16 h-[1px] bg-alira-gold mx-auto mb-6"></div>
              </div>
            </Reveal>
            
            {/* Centered Content */}
            <div className="text-center">
              {/* Main Headline */}
              <Reveal delay={200}>
                <h1 id="hero-heading" className="font-serif font-normal text-text-primary leading-tight tracking-tight mb-6 text-4xl md:text-5xl lg:text-6xl xl:text-7xl" style={{ fontSize: 'clamp(48px, 8vw, 96px)' }}>
                  Turn your idea into a business<br />
                  in a few clicks.
                </h1>
              </Reveal>
              
              {/* Subtext */}
              <Reveal delay={250}>
                <p className="text-text-secondary text-lg md:text-xl lg:text-2xl font-sans font-light max-w-3xl mx-auto mb-16">
                  We scale brands with content, websites, and smart systems
                </p>
              </Reveal>
              
              {/* Chatbot UI */}
              <Reveal delay={300}>
                <div id="start-chat">
                  <VercelV0Chat />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>


      {/* How It Works Section */}
      <HowItWorksScroll />

      {/* Choose Your Service Section */}
      <HomeServices />

      {/* Meet the Team Section */}
      <TeamFlipCards />

      {/* FAQ Section */}
      <FAQ />
      
      {/* Sticky CTA for Mobile */}
      <StickyCTA />
    </div>
  )
}
