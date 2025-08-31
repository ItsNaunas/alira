'use client'

import { useEffect, useState } from 'react'

import WhatYouGet from '@/components/WhatYouGet'
import ProcessDiagram from '@/components/ProcessDiagram'
import OurPhilosophy from '@/components/OurPhilosophy'
import HomeServices from '@/components/HomeServices'
import Experience from '@/components/Experience'
import ClientResults from '@/components/ClientResults'
import EnhancedProof from '@/components/EnhancedProof'
import FAQ from '@/components/FAQ'

import StickyCTA from '@/components/StickyCTA'
import FinalCTA from '@/components/FinalCTA'
import Reveal from '@/components/Reveal'
import CTAButton from '@/components/CTAButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, CheckCircle, Users, Target, Zap, FileCheck } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
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
                Your <span className="text-alira-gold">Free</span> Business Case in Minutes.
              </h1>
            </Reveal>
            
            {/* Subheadline */}
            <Reveal delay={250}>
              <p className="text-xl md:text-2xl text-alira-ink/80 max-w-[50ch] mx-auto leading-snug mb-8">
                10 minutes from you → board-ready PDF in minutes.
              </p>
            </Reveal>
            
            {/* CTA Button */}
            <Reveal delay={300}>
              <div className="space-y-4">
                <CTAButton 
                  href="/form" 
                  variant="alira"
                  className="px-8 py-4 text-lg font-medium"
                />
                <p className="text-sm text-alira-onyx/70 font-medium">
                  No credit card required • Completely free • Private and secure
                </p>
              </div>
            </Reveal>



          </div>
        </div>
      </section>

      {/* Enhanced Proof Section */}
      <EnhancedProof />

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
                From enquiry to structured business case in three clear steps.
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
                    Complete the Form
                  </h3>
                  <p className="text-alira-onyx/70 leading-relaxed max-w-xs">
                    10 mins of your time.
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
                    Engine Processing
                  </h3>
                  <p className="text-alira-onyx/70 leading-relaxed max-w-xs">
                    AI + consulting discipline transforms it instantly.
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
                    Receive Your Draft
                  </h3>
                  <p className="text-alira-onyx/70 leading-relaxed max-w-xs">
                    Board-ready PDF in minutes.
                  </p>
                </div>

              </div>
            </div>
          </Reveal>

          {/* Enhanced CTA */}
          <Reveal delay={400}>
            <div className="text-center mt-20">
              <div className="inline-block group">
                <CTAButton 
                  href="/form" 
                  variant="alira"
                />
                <div className="mt-4 text-sm text-alira-onyx/60 font-medium">
                  Ready to get your business case?
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

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
