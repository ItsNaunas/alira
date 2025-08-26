'use client'

import { useEffect, useState } from 'react'
import HeroCTAs from '@/components/HeroCTAs'
import HeroCards from '@/components/HeroCards'
import ProcessDiagram from '@/components/ProcessDiagram'
import ProcessFlow from '@/components/ProcessFlow'
import OurPhilosophy from '@/components/OurPhilosophy'
import SignatureEngagements from '@/components/SignatureEngagements'
import ProofOfClarity from '@/components/ProofOfClarity'
import FinalCTA from '@/components/FinalCTA'
import Reveal from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, CheckCircle, Users, Target, Zap, FileCheck } from 'lucide-react'
import Link from 'next/link'

const RotatingPhrase = () => {
  const phrases = [
    "We turn complexity into ",
    "We turn confusion into ", 
    "We turn noise into "
  ]
  const [index, setIndex] = useState(0)
  const [isRotating, setIsRotating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsRotating(true)
      setTimeout(() => {
        setIndex((i) => (i + 1) % phrases.length)
        setTimeout(() => {
          setIsRotating(false)
        }, 100)
      }, 200)
    }, 2800)
    return () => clearInterval(timer)
  }, [phrases.length])

  return (
    <span className="inline-block align-baseline" style={{ minWidth: '18ch' }}>
      <span
        className={`inline-block will-change-transform transition-all duration-500 ease-in-out ${
          isRotating 
            ? 'opacity-0 transform rotate-x-90 scale-95' 
            : 'opacity-100 transform rotate-x-0 scale-100'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isRotating ? 'rotateX(90deg) scale(0.95)' : 'rotateX(0deg) scale(1)'
        }}
      >
        {phrases[index]}
      </span>
    </span>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 lg:py-32 pb-24 md:pb-28 lg:pb-32 bg-alira-porcelain relative overflow-hidden">
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
          <Reveal>
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-5xl md:text-7xl font-bold text-alira-onyx leading-[0.95] tracking-tight font-sans">
                    How business owners build <span className="text-alira-gold">clarity</span>.
                  </h1>
                  
                  {/* Gold hairline */}
                  <div className="w-16 h-px bg-alira-gold mx-auto"></div>
                </div>
                
                <div className="text-xl md:text-2xl text-alira-onyx/70 max-w-[72ch] mx-auto leading-snug space-y-2">
                  <p className="leading-snug">
                    <span className="inline-flex items-baseline gap-1 align-baseline tracking-tight">
                      <RotatingPhrase />
                      <em className="not-italic font-medium italic text-alira-gold">clarity</em>
                    </span>
                  </p>
                  <p className="leading-snug">so your decisions move faster.</p>
                </div>
                
                <HeroCTAs />
              </div>
            </div>
          </Reveal>
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
              <h2 className="text-3xl md:text-5xl font-bold text-alira-onyx font-sans leading-[0.95] tracking-tight mb-6">
                How it works
              </h2>
              
              {/* Gold hairline */}
              <div className="w-16 h-px bg-alira-gold mx-auto mb-6"></div>
              
              <p className="text-xl md:text-2xl text-alira-onyx/70 max-w-[65ch] mx-auto leading-snug">
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
                  <h3 className="text-xl font-semibold text-alira-onyx font-sans">
                    Complete the Form
                  </h3>
                  <p className="text-alira-onyx/70 leading-relaxed">
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
                  <h3 className="text-xl font-semibold text-alira-onyx font-sans">
                    Engine Processing
                  </h3>
                  <p className="text-alira-onyx/70 leading-relaxed">
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
                  <h3 className="text-xl font-semibold text-alira-onyx font-sans">
                    Receive Your Draft
                  </h3>
                  <p className="text-alira-onyx/70 leading-relaxed">
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
                className="inline-flex items-center rounded-full bg-alira-onyx text-white px-6 py-3 text-sm font-medium border border-transparent hover:border-alira-gold hover:shadow-lg hover:shadow-black/10 transition-all duration-200"
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
      <section className="w-full py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-alira-onyx font-serif leading-tight mb-6">
                The Engine
              </h2>
              <div className="w-16 h-px bg-alira-gold mx-auto"></div>
            </div>
          </Reveal>
          
          <Reveal delay={200}>
            <ProcessDiagram />
          </Reveal>
        </div>
      </section>

      {/* Proof of Clarity Section */}
      <ProofOfClarity />

      {/* Final CTA Section */}
      <FinalCTA />
    </div>
  )
}
