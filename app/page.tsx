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
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-alira-cream via-alira-light-gold to-alira-cream dark:from-alira-gold/10 dark:via-alira-onyx dark:to-alira-gold/5 relative overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Light Mode Premium Background Effects */}
        <div className="absolute inset-0 bg-gradient-radial from-alira-gold/8 via-alira-gold/3 to-transparent opacity-90"></div>
        
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0">
          {/* Diagonal mesh lines */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `linear-gradient(45deg, transparent 48%, alira-gold 49%, alira-gold 51%, transparent 52%), linear-gradient(-45deg, transparent 48%, alira-gold 49%, alira-gold 51%, transparent 52%)`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-alira-gold/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-alira-gold-light/8 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-alira-gold/6 rounded-full blur-md"></div>
          
          {/* Enhanced diagonal streaks */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-1 bg-gradient-to-r from-transparent via-alira-gold/6 to-transparent transform rotate-12 blur-sm"></div>
            <div className="absolute top-1/2 right-1/4 w-80 h-1 bg-gradient-to-r from-transparent via-alira-gold-light/5 to-transparent transform -rotate-6 blur-sm"></div>
            <div className="absolute bottom-1/3 left-1/3 w-72 h-1 bg-gradient-to-r from-transparent via-alira-gold/7 to-transparent transform rotate-45 blur-sm"></div>
          </div>
          
          {/* Subtle grain texture */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Clean Background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Soft gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-alira-gold/3 via-white/50 to-alira-gold/5 dark:from-alira-gold/5 dark:via-alira-onyx/80 dark:to-alira-gold/3"></div>
        </div>
        
        <div className="container mx-auto px-3 lg:px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* ALIRA Logo Centered at Top */}
            <Reveal>
              <div className="text-center mb-8">
                <span className="block text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-alira-onyx dark:text-alira-porcelain mb-4">
                  ALIRA<span className="text-alira-gold">.</span>
                </span>
                <div className="w-24 h-[2px] bg-alira-gold mx-auto mb-4"></div>
              </div>
            </Reveal>
            
            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
              
              {/* Left Column - Text Content */}
              <div className="text-center lg:text-left lg:col-span-2">
            {/* Headline */}
            <Reveal delay={200}>
                  <h1 id="hero-heading" className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain leading-[0.95] tracking-tight mb-8">
                    We scale brands with <span className="text-alira-gold">content, websites, and smart systems</span>
              </h1>
            </Reveal>
            
            {/* Subheadline */}
            <Reveal delay={250}>
                  <p className="text-lg md:text-xl lg:text-2xl text-alira-onyx dark:text-alira-porcelain font-serif italic font-light max-w-[65ch] mx-auto lg:mx-0 leading-tight mb-12">
                    Tell us about your idea, and we'll instantly generate a free, tailored plan — ready to use in minutes.
              </p>
            </Reveal>
            
                {/* CTA Button */}
            <Reveal delay={300}>
              <div className="space-y-4 inline-block">
                    <CTAButton 
                      href="#start-form" 
                      variant="alira"
                      className="w-full !px-12 !py-6 text-lg font-sans font-medium"
                      location="hero"
                    >
                      Start My Plan
                    </CTAButton>
                    <p className="text-sm text-alira-onyx dark:text-alira-porcelain/70 font-sans font-medium whitespace-nowrap text-center">
                  Free • Private • Ready in minutes
                </p>
              </div>
            </Reveal>
                </div>

              {/* Right Column - Hero Image */}
              <Reveal delay={400}>
                <div className="hidden lg:flex justify-center lg:justify-end lg:col-span-3">
                  <div className="w-full relative">
                    <Image 
                      src="/images/hero/hero-gear.png" 
                      alt="ALIRA - Strategic Growth Systems"
                      width={1947}
                      height={1531}
                      className="rounded-2xl w-full h-auto scale-[5] translate-x-64"
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
      <section id="start-form" className="py-16 md:py-24 bg-alira-warm-white dark:bg-alira-onyx/95 relative overflow-hidden">
        {/* Clean pattern overlay */}
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
              <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-6">
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
