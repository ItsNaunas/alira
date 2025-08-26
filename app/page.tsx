'use client'

import { useEffect, useState } from 'react'

import HeroCards from '@/components/HeroCards'
import ProcessDiagram from '@/components/ProcessDiagram'
import ProcessFlow from '@/components/ProcessFlow'
import OurPhilosophy from '@/components/OurPhilosophy'
import SignatureEngagements from '@/components/SignatureEngagements'
import Experience from '@/components/Experience'
import FinalCTA from '@/components/FinalCTA'
import Reveal from '@/components/Reveal'
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
            {/* Brand Eyebrow */}
            <Reveal>
              <div className="mb-6">
                <span className="block text-2xl tracking-[0.14em] uppercase text-alira-onyx font-semibold mb-6 font-serif">
                  ALIRA.
                </span>
                <div className="w-16 h-[2px] bg-alira-gold mx-auto mb-8"></div>
              </div>
            </Reveal>
            
            {/* Headline */}
            <Reveal delay={150}>
              <h1 id="hero-heading" className="text-5xl md:text-7xl font-bold text-alira-onyx leading-[0.95] tracking-tight mb-6">
                Business clarity. One click away.
              </h1>
            </Reveal>
            
            {/* Subheadline */}
            <Reveal delay={300}>
              <p className="text-xl md:text-2xl text-alira-ink/80 max-w-[50ch] mx-auto leading-snug mb-12">
                We turn your inputs into a ready-to-use business case. Instantly.
              </p>
            </Reveal>
            
            {/* CTA Button */}
            <Reveal delay={450}>
              <button
                type="button"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-alira-porcelain bg-alira-onyx rounded-full hover:bg-alira-onyx/90 focus:outline-none focus:ring-2 focus:ring-alira-gold focus:ring-offset-2 focus:ring-offset-alira-porcelain transition-all duration-200 active:scale-95"
                onClick={() => document.getElementById('start')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Your Business Case
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Hero Cards Section */}
      <section className="relative bg-alira-porcelain z-[2] mt-24 sm:mt-28 lg:mt-32">
        {/* Optional hairline divider */}
        <div className="absolute -top-6 left-0 right-0 h-px max-w-7xl mx-auto bg-alira-onyx/5"></div>
        
        {/* Overlap gradient underlay */}
        <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-transparent via-alira-porcelain/40 to-alira-porcelain pointer-events-none"></div>
        
        <div className="container mx-auto px-6 lg:px-8 relative pb-8">
          <Reveal>
            <HeroCards />
          </Reveal>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white relative z-[1]" id="how-it-works">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
              {/* Step 1 */}
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-alira-gold/10 rounded-2xl flex items-center justify-center mx-auto border border-alira-gold/20">
                  <span className="text-2xl font-bold text-alira-gold">1</span>
                </div>
                <div className="space-y-3">
                  <h3 className="h3">
                    Complete the Form
                  </h3>
                  <p className="copy">
                    Share your business context, challenges, and objectives through our structured intake form. Takes 10-15 minutes.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-alira-gold/10 rounded-2xl flex items-center justify-center mx-auto border border-alira-gold/20">
                  <span className="text-2xl font-bold text-alira-gold">2</span>
                </div>
                <div className="space-y-3">
                  <h3 className="h3">
                    Engine Processing
                  </h3>
                  <p className="copy">
                    Our strategic framework analyzes your inputs and maps them to proven business case structures and methodologies.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-alira-gold/10 rounded-2xl flex items-center justify-center mx-auto border border-alira-gold/20">
                  <span className="text-2xl font-bold text-alira-gold">3</span>
                </div>
                <div className="space-y-3">
                  <h3 className="h3">
                    Receive Your Draft
                  </h3>
                  <p className="copy">
                    Get a structured business case with problem statement, objectives, proposed solution, and next steps within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal delay={400}>
            <div className="text-center mt-12">
              <Link
                href="#start"
                className="btn-primary inline-flex items-center"
              >
                Start Your Business Case
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Our Philosophy Section */}
      <OurPhilosophy />

      {/* Signature Engagements Section */}
      <SignatureEngagements />

      {/* The Engine Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <div className="heading-eyebrow">Our Process</div>
                <h2 className="h2 mb-6">The Engine</h2>
                <div className="w-16 h-px bg-alira-gold mx-auto"></div>
              </div>
            </Reveal>
            
            <Reveal delay={200}>
              <ProcessDiagram />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <Experience />

      {/* Final CTA Section */}
      <FinalCTA />
    </div>
  )
}
