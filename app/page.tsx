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

              {/* Meet the Team Section */}
        <section className="py-24 bg-gradient-to-br from-alira-porcelain/30 via-white to-alira-porcelain/20 relative overflow-hidden" aria-labelledby="team-heading">
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
                  <h2 id="team-heading" className="text-4xl md:text-5xl font-bold text-alira-onyx mb-6">
                    Meet the Team
                  </h2>
                  <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
                </div>
              </Reveal>

            {/* Our Founder Subsection */}
            <div className="mb-16">
              <Reveal delay={100}>
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-alira-onyx mb-4">Our Founder</h3>
                  <p className="text-lg text-alira-onyx/70 max-w-2xl mx-auto">
                    ALIRA began with one person's frustration: seeing brilliant ideas stall in complexity.
                  </p>
                  <div className="w-12 h-px bg-alira-gold mx-auto mt-4"></div>
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
                      For over a decade, I worked in project management and operations — leading teams, fixing systems, and delivering projects that saved organisations time and money.
                    </p>
                    
                    <p className="text-lg text-alira-onyx/80 leading-relaxed">
                      But I kept seeing the same pattern: great ideas getting stuck in complexity. Simple problems becoming complicated messes.
                    </p>
                    
                    <p className="text-lg text-alira-onyx/80 leading-relaxed">
                      That's why I built ALIRA: to strip away the noise and give people what they actually need — a simple plan, clear steps, and the confidence to move forward.
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
                      <span className="text-alira-onyx/80 font-medium">Experience leading teams across multiple industries</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-alira-gold rounded-full"></div>
                      <span className="text-alira-onyx/80 font-medium">Delivered projects that saved organisations time and money</span>
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

            {/* Team Capabilities Section */}
            <div className="mt-20">
              <Reveal delay={600}>
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-alira-onyx mb-4">Our Team Capabilities</h3>
                  <p className="text-lg text-alira-onyx/70 max-w-2xl mx-auto">
                    Three specialists working together to deliver clarity, reach, and systems that work.
                  </p>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* The Strategist */}
                <Reveal delay={700}>
                  <div className="bg-white/80 backdrop-blur-sm p-10 rounded-2xl border border-alira-onyx/10 hover:border-alira-gold/30 hover:shadow-2xl hover:bg-alira-gold/5 transition-all duration-500 text-center group relative overflow-hidden">
                    {/* Accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-alira-gold to-alira-gold/60"></div>
                    
                    <div className="w-24 h-24 bg-gradient-to-br from-alira-gold/10 to-alira-gold/5 rounded-full mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-12 h-12 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-alira-onyx mb-4">The Strategist</h4>
                    <p className="text-alira-onyx/80 leading-relaxed mb-6">
                      Sees the bigger picture and turns ideas into steps you can act on.
                    </p>
                    <div className="text-sm text-alira-onyx/70 space-y-3 text-left">
                      <p><span className="font-semibold text-alira-onyx">Runs clarity sessions and workshops</span> to define goals</p>
                      <p><span className="font-semibold text-alira-onyx">Creates 90-day and 1-year growth roadmaps</span> for clear direction</p>
                      <p><span className="font-semibold text-alira-onyx">Breaks complex challenges</span> into simple, actionable projects</p>
                    </div>
                    
                    {/* Hover button */}
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="text-alira-gold text-sm font-medium hover:text-alira-onyx transition-colors">
                        See How We Work →
                      </button>
                    </div>
                  </div>
                </Reveal>

                {/* The Marketing Lead */}
                <Reveal delay={800}>
                  <div className="bg-white/80 backdrop-blur-sm p-10 rounded-2xl border border-alira-onyx/10 hover:border-alira-gold/30 hover:shadow-2xl hover:bg-alira-gold/5 transition-all duration-500 text-center group relative overflow-hidden">
                    {/* Accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-alira-gold to-alira-gold/60"></div>
                    
                    <div className="w-24 h-24 bg-gradient-to-br from-alira-gold/10 to-alira-gold/5 rounded-full mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-12 h-12 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 8h6m-6 4h6m-6 4h6" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-alira-onyx mb-4">The Marketing Lead</h4>
                    <p className="text-alira-onyx/80 leading-relaxed mb-6">
                      Knows how to make your brand impossible to ignore.
                    </p>
                    <div className="text-sm text-alira-onyx/70 space-y-3 text-left">
                      <p><span className="font-semibold text-alira-onyx">Improves your social media content</span> and campaigns for better engagement</p>
                      <p><span className="font-semibold text-alira-onyx">Builds content calendars</span> to grow visibility and reach</p>
                      <p><span className="font-semibold text-alira-onyx">Helps you reach the right customers</span> with clear, compelling messaging</p>
                    </div>
                    
                    {/* Hover button */}
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="text-alira-gold text-sm font-medium hover:text-alira-onyx transition-colors">
                        See How We Work →
                      </button>
                    </div>
                  </div>
                </Reveal>

                {/* The Systems Engineer */}
                <Reveal delay={900}>
                  <div className="bg-white/80 backdrop-blur-sm p-10 rounded-2xl border border-alira-onyx/10 hover:border-alira-gold/30 hover:shadow-2xl hover:bg-alira-gold/5 transition-all duration-500 text-center group relative overflow-hidden">
                    {/* Accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-alira-gold to-alira-gold/60"></div>
                    
                    <div className="w-24 h-24 bg-gradient-to-br from-alira-gold/10 to-alira-gold/5 rounded-full mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-12 h-12 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-alira-onyx mb-4">The Systems Engineer</h4>
                    <p className="text-alira-onyx/80 leading-relaxed mb-6">
                      Builds the tools and processes that unlock growth.
                    </p>
                    <div className="text-sm text-alira-onyx/70 space-y-3 text-left">
                      <p><span className="font-semibold text-alira-onyx">Designs and launches websites</span> and online platforms that convert</p>
                      <p><span className="font-semibold text-alira-onyx">Integrates AI into daily workflows</span> to boost efficiency and insights</p>
                      <p><span className="font-semibold text-alira-onyx">Automates repetitive tasks</span> to free up time and reduce chaos</p>
                    </div>
                    
                    {/* Hover button */}
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="text-alira-gold text-sm font-medium hover:text-alira-onyx transition-colors">
                        See How We Work →
                      </button>
                    </div>
                  </div>
                </Reveal>
              </div>
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
