'use client'

import { useEffect, useState } from 'react'
import HeroCTAs from '@/components/HeroCTAs'
import HeroCards from '@/components/HeroCards'
import ProcessDiagram from '@/components/ProcessDiagram'
import ProcessFlow from '@/components/ProcessFlow'
import ValuePillars from '@/components/ValuePillars'
import ServicesGrid from '@/components/ServicesGrid'
import Reveal from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, CheckCircle, Users, Target, Zap, FileCheck } from 'lucide-react'
import Link from 'next/link'

const RotatingPhrase = () => {
  const phrases = [
    "We turn complexity into",
    "We turn confusion into", 
    "We turn noise into"
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
    <span className="relative inline-block" style={{ minWidth: '20ch' }}>
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
      <section className="py-16 md:py-24 bg-alira-porcelain relative overflow-hidden">
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
                    <RotatingPhrase /> <em className="not-italic font-medium italic text-alira-gold">clarity</em>
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
      <section className="relative bg-alira-porcelain z-[2]">
        {/* Overlap gradient underlay */}
        <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-transparent via-alira-porcelain/40 to-alira-porcelain pointer-events-none"></div>
        
        <div className="container mx-auto px-6 lg:px-8 relative -mt-14 lg:-mt-16 pb-8">
          <Reveal>
            <HeroCards />
          </Reveal>
        </div>
      </section>

      {/* Value Pillars Section */}
      <section className="pt-28 lg:pt-32 pb-24 bg-white z-[0]">
        <div className="container mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold alira-heading text-alira-onyx mb-4">
                Our Approach
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Four principles that guide every engagement and deliver lasting results.
              </p>
            </div>
          </Reveal>
          
          <Reveal delay={200}>
            <ValuePillars />
          </Reveal>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-24 bg-alira-porcelain">
        <div className="container mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold alira-heading text-alira-onyx mb-4">
                Tailored to Your Stage
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Whether you're just starting out or scaling an established business, our services are designed to meet you where you are and take you where you want to go.
              </p>
            </div>
          </Reveal>
          
          <Reveal delay={200}>
            <ServicesGrid />
          </Reveal>
          
          <Reveal delay={400}>
            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link href="/services">
                  View All Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process Explanation Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold alira-heading text-alira-onyx mb-6">
                    From Form to Framework
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Every business case we generate is built on proven strategic frameworks, tailored to your specific industry, stage, and challenges. No generic templates — just sharp, actionable insights.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Our engine processes your information through multiple lenses: market analysis, competitive positioning, resource optimization, and growth potential. The result is a document that speaks directly to your situation.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-alira-gold mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-alira-onyx mb-1">Comprehensive Analysis</h3>
                      <p className="text-sm text-muted-foreground">Strategic frameworks adapted to your specific context</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Target className="h-6 w-6 text-alira-gold mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-alira-onyx mb-1">Clear Objectives</h3>
                      <p className="text-sm text-muted-foreground">Measurable outcomes and success metrics</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Zap className="h-6 w-6 text-alira-gold mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-alira-onyx mb-1">Immediate Value</h3>
                      <p className="text-sm text-muted-foreground">Structured thinking and planning from day one</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
            
            <Reveal delay={200}>
              <div className="bg-gradient-to-br from-alira-onyx/5 to-alira-gold/5 p-8 rounded-lg border border-alira-onyx/10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-alira-gold/20 flex items-center justify-center">
                    <FileCheck className="h-4 w-4 text-alira-gold" />
                  </div>
                  <h3 className="text-xl font-semibold alira-heading text-alira-onyx">
                    What You Receive
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-alira-onyx/5 transition-colors">
                    <div className="w-2 h-2 bg-alira-gold rounded-full flex-shrink-0"></div>
                    <span className="text-muted-foreground">Draft Business Case tailored to your business</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-alira-onyx/5 transition-colors">
                    <div className="w-2 h-2 bg-alira-gold rounded-full flex-shrink-0"></div>
                    <span className="text-muted-foreground">Clear problem statement and objectives</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-alira-onyx/5 transition-colors">
                    <div className="w-2 h-2 bg-alira-gold rounded-full flex-shrink-0"></div>
                    <span className="text-muted-foreground">Strategic recommendations based on your service choice</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-alira-onyx/5 transition-colors">
                    <div className="w-2 h-2 bg-alira-gold rounded-full flex-shrink-0"></div>
                    <span className="text-muted-foreground">Expected outcomes and success metrics</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-alira-onyx/5 transition-colors">
                    <div className="w-2 h-2 bg-alira-gold rounded-full flex-shrink-0"></div>
                    <span className="text-muted-foreground">Clear next steps and implementation roadmap</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-alira-porcelain">
        <div className="container mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold alira-heading text-alira-onyx mb-4">
                Trusted by Founders
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Business owners who value clarity, structure, and lasting systems.
              </p>
            </div>
          </Reveal>
          
          <Reveal delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-alira-onyx/10 bg-white">
                <CardContent className="p-6">
                  <p className="text-muted-foreground italic mb-4">
                    "ALIRA. helped us strip away the noise and focus on what actually matters. The business case they generated gave us the clarity we needed to make confident decisions."
                  </p>
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-alira-gold" />
                    <div>
                      <p className="font-semibold text-alira-onyx">Sarah Chen</p>
                      <p className="text-sm text-muted-foreground">Founder, TechFlow</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-alira-onyx/10 bg-white">
                <CardContent className="p-6">
                  <p className="text-muted-foreground italic mb-4">
                    "The structured approach and clear deliverables made all the difference. We went from feeling overwhelmed to having a clear roadmap forward."
                  </p>
                  <div className="flex items-center space-x-3">
                    <Target className="h-8 w-8 text-alira-gold" />
                    <div>
                      <p className="font-semibold text-alira-onyx">Marcus Rodriguez</p>
                      <p className="text-sm text-muted-foreground">CEO, GrowthLab</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-alira-onyx/10 bg-white">
                <CardContent className="p-6">
                  <p className="text-muted-foreground italic mb-4">
                    "Elegant solutions that actually work. ALIRA. doesn't just give you a plan—they give you the systems to make it happen."
                  </p>
                  <div className="flex items-center space-x-3">
                    <Zap className="h-8 w-8 text-alira-gold" />
                    <div>
                      <p className="font-semibold text-alira-onyx">Emma Thompson</p>
                      <p className="text-sm text-muted-foreground">Founder, ScaleUp</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-alira-onyx text-alira-porcelain">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <Reveal>
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold alira-heading">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-alira-porcelain/80 leading-relaxed">
                Every new enquiry should feel like the start of a tailored, professional journey — no blank pages, no wasted time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="px-8">
                  <Link href="/contact">
                    Start Your Journey
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="px-8 border-alira-porcelain text-alira-porcelain hover:bg-alira-porcelain hover:text-alira-onyx">
                  <Link href="/how-it-works">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
