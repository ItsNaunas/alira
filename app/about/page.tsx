'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Reveal from '@/components/Reveal'
import CTAButton from '@/components/CTAButton'

export default function AboutPage() {
  const [activeStat, setActiveStat] = useState(0)
  const [hoveredPrinciple, setHoveredPrinciple] = useState<number | null>(null)
  const [activeTeamMember, setActiveTeamMember] = useState<number | null>(null)

  const stats = [
    { number: "10+", label: "Years of experience", description: "Over a decade of helping businesses grow" },
    { number: "3", label: "Specialist team members", description: "Strategy, marketing, and systems experts" },
    { number: "100%", label: "Client-focused approach", description: "Every decision puts your success first" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-alira-porcelain/30 via-white to-alira-porcelain/20 dark:from-alira-onyx/30 dark:via-alira-onyx dark:to-alira-onyx/20 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="max-w-5xl mx-auto text-center">
              <div className="text-alira-gold text-sm tracking-wide uppercase mb-4 font-sans font-medium">
                About Us
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-8">
                Our Story
              </h1>
              <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
              <p className="text-xl text-alira-onyx/80 dark:text-alira-porcelain/80 leading-relaxed max-w-3xl mx-auto mb-8">
                ALIRA was created to solve a simple problem: brilliant ideas getting stuck in complexity. 
                We believe every ambitious person deserves a clear path forward, not another complicated framework.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className={`text-center p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                      activeStat === index 
                        ? 'bg-alira-gold/10 border-2 border-alira-gold/30 shadow-lg' 
                        : 'hover:bg-alira-gold/5 hover:border border-alira-onyx/10'
                    }`}
                    onClick={() => setActiveStat(index)}
                    onMouseEnter={() => setActiveStat(index)}
                  >
                    <div className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
                      activeStat === index ? 'text-alira-gold' : 'text-alira-gold'
                    }`}>
                      {stat.number}
                    </div>
                    <div className="text-alira-onyx/70 dark:text-alira-porcelain/70 mb-2">{stat.label}</div>
                    <div className={`text-sm text-alira-onyx/60 dark:text-alira-porcelain/60 transition-all duration-300 ${
                      activeStat === index ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'
                    }`}>
                      {stat.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-white dark:bg-alira-onyx/20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <Reveal>
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-6">
                    Our Mission
                  </h2>
                  <div className="w-12 h-px bg-alira-gold mb-6"></div>
                  <p className="text-lg text-alira-onyx/80 dark:text-alira-porcelain/80 leading-relaxed mb-6">
                    To strip away the noise and give ambitious people what they actually need: 
                    a simple plan, clear steps, and the confidence to move forward.
                  </p>
                  <p className="text-lg text-alira-onyx/80 dark:text-alira-porcelain/80 leading-relaxed">
                    We believe that complexity is the enemy of progress. Every great idea deserves 
                    a straightforward path to reality, not another complicated system to navigate.
                  </p>
                </div>
              </Reveal>
              
              <Reveal delay={200}>
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-6">
                    Our Vision
                  </h2>
                  <div className="w-12 h-px bg-alira-gold mb-6"></div>
                  <p className="text-lg text-alira-onyx/80 dark:text-alira-porcelain/80 leading-relaxed mb-6">
                    A world where every ambitious person has access to clear, actionable guidance 
                    that transforms their ideas into reality without unnecessary complexity.
                  </p>
                  <p className="text-lg text-alira-onyx/80 dark:text-alira-porcelain/80 leading-relaxed">
                    We envision a future where starting and growing something meaningful is 
                    accessible to everyone, regardless of their background or resources.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
        <section className="py-24 bg-gradient-to-br from-alira-porcelain/30 via-white to-alira-porcelain/20 dark:from-alira-onyx/30 dark:via-alira-onyx dark:to-alira-onyx/20 relative overflow-hidden" aria-labelledby="team-heading">
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
                  <h2 id="team-heading" className="text-4xl md:text-5xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-6">
                    Meet the Team
                  </h2>
                  <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
                </div>
              </Reveal>

            {/* Our Founder Subsection */}
            <div className="mb-16">
              <Reveal delay={100}>
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-4">Our Founder</h3>
                  <p className="text-lg text-alira-onyx/70 dark:text-alira-porcelain/70 max-w-2xl mx-auto">
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
                    <p className="text-2xl text-alira-onyx dark:text-alira-porcelain font-serif italic leading-relaxed pl-6">
                      "I know what it feels like to have ambition but no clear path."
                    </p>
                  </div>

                  {/* Personal journey */}
                  <div className="space-y-6">
                    <p className="text-lg text-alira-onyx/80 dark:text-alira-porcelain/80 leading-relaxed">
                      For over a decade, I worked in project management and operations — leading teams, fixing systems, and delivering projects that saved organisations time and money.
                    </p>
                    
                    <p className="text-lg text-alira-onyx/80 dark:text-alira-porcelain/80 leading-relaxed">
                      But I kept seeing the same pattern: great ideas getting stuck in complexity. Simple problems becoming complicated messes.
                    </p>
                    
                    <p className="text-lg text-alira-onyx/80 dark:text-alira-porcelain/80 leading-relaxed">
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
                            <div className="w-full h-80 rounded-2xl overflow-hidden border border-alira-onyx/10 dark:border-alira-porcelain/10 shadow-lg">
                              <Image 
                                src="/images/assets/founder.jpg" 
                                alt="ALIRA Founder - Professional headshot"
                                width={400}
                                height={320}
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
                      <span className="text-alira-onyx/80 dark:text-alira-porcelain/80 font-sans font-medium">10+ years in project management</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-alira-gold rounded-full"></div>
                      <span className="text-alira-onyx/80 dark:text-alira-porcelain/80 font-sans font-medium">Experience leading teams across multiple industries</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-alira-gold rounded-full"></div>
                      <span className="text-alira-onyx/80 dark:text-alira-porcelain/80 font-sans font-medium">Delivered projects that saved organisations time and money</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="text-center pt-4">
                    <CTAButton 
                      href="/contact" 
                      variant="alira"
                      className="px-8 py-4 text-lg font-sans font-medium"
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
                  <h3 className="text-3xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-4">Our Team Capabilities</h3>
                  <p className="text-lg text-alira-onyx/70 dark:text-alira-porcelain/70 max-w-2xl mx-auto">
                    Three specialists working together to deliver clarity, reach, and systems that work.
                  </p>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* The Strategist */}
                <Reveal delay={700}>
                  <div 
                    className={`bg-white/80 dark:bg-alira-onyx/80 backdrop-blur-sm p-10 rounded-2xl border transition-all duration-500 text-center group relative overflow-hidden cursor-pointer ${
                      activeTeamMember === 0 
                        ? 'border-alira-gold/50 shadow-2xl bg-alira-gold/10 scale-105' 
                        : 'border-alira-onyx/10 hover:border-alira-gold/30 hover:shadow-2xl hover:bg-alira-gold/5'
                    }`}
                    onClick={() => setActiveTeamMember(activeTeamMember === 0 ? null : 0)}
                    onMouseEnter={() => setActiveTeamMember(0)}
                    onMouseLeave={() => setActiveTeamMember(null)}
                  >
                    {/* Accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
                      activeTeamMember === 0 
                        ? 'bg-gradient-to-r from-alira-gold to-alira-gold h-2' 
                        : 'bg-gradient-to-r from-alira-gold to-alira-gold/60'
                    }`}></div>
                    
                    <div className={`w-24 h-24 bg-gradient-to-br from-alira-gold/10 to-alira-gold/5 rounded-full mx-auto mb-8 flex items-center justify-center transition-all duration-300 ${
                      activeTeamMember === 0 ? 'scale-125' : 'group-hover:scale-110'
                    }`}>
                      <svg className="w-12 h-12 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-4">The Strategist</h4>
                    <p className="text-alira-onyx/80 dark:text-alira-porcelain/80 leading-relaxed mb-6">
                      Sees the bigger picture and turns ideas into steps you can act on.
                    </p>
                    <div className="text-sm text-alira-onyx/70 dark:text-alira-porcelain/70 space-y-3 text-left">
                      <p><span className="font-semibold text-alira-onyx dark:text-alira-porcelain">Runs clarity sessions and workshops</span> to define goals</p>
                      <p><span className="font-semibold text-alira-onyx dark:text-alira-porcelain">Creates 90-day and 1-year growth roadmaps</span> for clear direction</p>
                      <p><span className="font-semibold text-alira-onyx dark:text-alira-porcelain">Breaks complex challenges</span> into simple, actionable projects</p>
                    </div>
                    
                    {/* Interactive button */}
                    <div className={`mt-6 transition-all duration-300 ${
                      activeTeamMember === 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <button className="text-alira-gold text-sm font-sans font-medium hover:text-alira-onyx dark:text-alira-porcelain dark:hover:text-alira-porcelain transition-colors">
                        See How We Work →
                      </button>
                    </div>
                  </div>
                </Reveal>

                {/* The Marketing Lead */}
                <Reveal delay={800}>
                  <div 
                    className={`bg-white/80 dark:bg-alira-onyx/80 backdrop-blur-sm p-10 rounded-2xl border transition-all duration-500 text-center group relative overflow-hidden cursor-pointer ${
                      activeTeamMember === 1 
                        ? 'border-alira-gold/50 shadow-2xl bg-alira-gold/10 scale-105' 
                        : 'border-alira-onyx/10 hover:border-alira-gold/30 hover:shadow-2xl hover:bg-alira-gold/5'
                    }`}
                    onClick={() => setActiveTeamMember(activeTeamMember === 1 ? null : 1)}
                    onMouseEnter={() => setActiveTeamMember(1)}
                    onMouseLeave={() => setActiveTeamMember(null)}
                  >
                    {/* Accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
                      activeTeamMember === 1 
                        ? 'bg-gradient-to-r from-alira-gold to-alira-gold h-2' 
                        : 'bg-gradient-to-r from-alira-gold to-alira-gold/60'
                    }`}></div>
                    
                    <div className={`w-24 h-24 bg-gradient-to-br from-alira-gold/10 to-alira-gold/5 rounded-full mx-auto mb-8 flex items-center justify-center transition-all duration-300 ${
                      activeTeamMember === 1 ? 'scale-125' : 'group-hover:scale-110'
                    }`}>
                      <svg className="w-12 h-12 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 8h6m-6 4h6m-6 4h6" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-4">The Marketing Lead</h4>
                    <p className="text-alira-onyx/80 dark:text-alira-porcelain/80 leading-relaxed mb-6">
                      Knows how to make your brand impossible to ignore.
                    </p>
                    <div className="text-sm text-alira-onyx/70 dark:text-alira-porcelain/70 space-y-3 text-left">
                      <p><span className="font-semibold text-alira-onyx dark:text-alira-porcelain">Improves your social media content</span> and campaigns for better engagement</p>
                      <p><span className="font-semibold text-alira-onyx dark:text-alira-porcelain">Builds content calendars</span> to grow visibility and reach</p>
                      <p><span className="font-semibold text-alira-onyx dark:text-alira-porcelain">Helps you reach the right customers</span> with clear, compelling messaging</p>
                    </div>
                    
                    {/* Interactive button */}
                    <div className={`mt-6 transition-all duration-300 ${
                      activeTeamMember === 1 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <button className="text-alira-gold text-sm font-sans font-medium hover:text-alira-onyx dark:text-alira-porcelain dark:hover:text-alira-porcelain transition-colors">
                        See How We Work →
                      </button>
                    </div>
                  </div>
                </Reveal>

                {/* The Systems Engineer */}
                <Reveal delay={900}>
                  <div 
                    className={`bg-white/80 dark:bg-alira-onyx/80 backdrop-blur-sm p-10 rounded-2xl border transition-all duration-500 text-center group relative overflow-hidden cursor-pointer ${
                      activeTeamMember === 2 
                        ? 'border-alira-gold/50 shadow-2xl bg-alira-gold/10 scale-105' 
                        : 'border-alira-onyx/10 hover:border-alira-gold/30 hover:shadow-2xl hover:bg-alira-gold/5'
                    }`}
                    onClick={() => setActiveTeamMember(activeTeamMember === 2 ? null : 2)}
                    onMouseEnter={() => setActiveTeamMember(2)}
                    onMouseLeave={() => setActiveTeamMember(null)}
                  >
                    {/* Accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
                      activeTeamMember === 2 
                        ? 'bg-gradient-to-r from-alira-gold to-alira-gold h-2' 
                        : 'bg-gradient-to-r from-alira-gold to-alira-gold/60'
                    }`}></div>
                    
                    <div className={`w-24 h-24 bg-gradient-to-br from-alira-gold/10 to-alira-gold/5 rounded-full mx-auto mb-8 flex items-center justify-center transition-all duration-300 ${
                      activeTeamMember === 2 ? 'scale-125' : 'group-hover:scale-110'
                    }`}>
                      <svg className="w-12 h-12 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-4">The Systems Engineer</h4>
                    <p className="text-alira-onyx/80 dark:text-alira-porcelain/80 leading-relaxed mb-6">
                      Builds the tools and processes that unlock growth.
                    </p>
                    <div className="text-sm text-alira-onyx/70 dark:text-alira-porcelain/70 space-y-3 text-left">
                      <p><span className="font-semibold text-alira-onyx dark:text-alira-porcelain">Designs and launches websites</span> and online platforms that convert</p>
                      <p><span className="font-semibold text-alira-onyx dark:text-alira-porcelain">Integrates AI into daily workflows</span> to boost efficiency and insights</p>
                      <p><span className="font-semibold text-alira-onyx dark:text-alira-porcelain">Automates repetitive tasks</span> to free up time and reduce chaos</p>
                    </div>
                    
                    {/* Interactive button */}
                    <div className={`mt-6 transition-all duration-300 ${
                      activeTeamMember === 2 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <button className="text-alira-gold text-sm font-sans font-medium hover:text-alira-onyx dark:text-alira-porcelain dark:hover:text-alira-porcelain transition-colors">
                        See How We Work →
                      </button>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>

            {/* How We Work Together Section */}
            <div className="mt-20">
              <Reveal delay={1000}>
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-4">How We Work Together</h3>
                  <p className="text-lg text-alira-onyx/70 dark:text-alira-porcelain/70 max-w-2xl mx-auto">
                    Our collaborative approach ensures you get the best of all three specializations working in harmony.
                  </p>
                </div>
              </Reveal>

              <div className="max-w-4xl mx-auto">
                <Reveal delay={1100}>
                  <div className="bg-white/60 dark:bg-alira-onyx/60 backdrop-blur-sm p-8 rounded-2xl border border-alira-onyx/10 dark:border-alira-porcelain/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                      <div>
                        <h4 className="text-lg font-serif font-semibold text-alira-onyx dark:text-alira-porcelain mb-3">Strategy First</h4>
                        <p className="text-alira-onyx/70 dark:text-alira-porcelain/70 text-sm">
                          Every project begins with clear objectives and a roadmap that makes sense for your situation.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-serif font-semibold text-alira-onyx dark:text-alira-porcelain mb-3">Marketing Integration</h4>
                        <p className="text-alira-onyx/70 dark:text-alira-porcelain/70 text-sm">
                          Your message and reach are built into the plan from day one, not added as an afterthought.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-serif font-semibold text-alira-onyx dark:text-alira-porcelain mb-3">Systems That Scale</h4>
                        <p className="text-alira-onyx/70 dark:text-alira-porcelain/70 text-sm">
                          Everything we build is designed to grow with you and reduce complexity over time.
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
                    </section>

      {/* Our Principles Section */}
      <section className="py-24 bg-white dark:bg-alira-onyx/20">
        <div className="container mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-6">
                Our Principles
              </h2>
              <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
              <p className="text-xl text-alira-onyx/70 dark:text-alira-porcelain/70 max-w-2xl mx-auto">
                The core beliefs that guide everything we do and every solution we create.
              </p>
            </div>
          </Reveal>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Clarity over complexity */}
              <Reveal delay={200}>
                <div 
                  className={`bg-white dark:bg-alira-onyx/20 p-8 rounded-xl border transition-all duration-300 cursor-pointer ${
                    hoveredPrinciple === 0 
                      ? 'border-alira-gold/30 shadow-xl bg-alira-gold/5 scale-105' 
                      : 'border-alira-onyx/10 hover:border-alira-gold/20 hover:shadow-lg'
                  }`}
                  onMouseEnter={() => setHoveredPrinciple(0)}
                  onMouseLeave={() => setHoveredPrinciple(null)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      hoveredPrinciple === 0 ? 'bg-alira-gold/20 scale-110' : 'bg-alira-gold/10'
                    }`}>
                      <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-3">Clarity over complexity</h3>
                      <p className="text-alira-onyx/80 dark:text-alira-porcelain/80 leading-relaxed">
                        Simple solutions win over complicated frameworks every time. We believe in stripping away the noise to reveal what actually works.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Small tests beat big theories */}
              <Reveal delay={300}>
                <div 
                  className={`bg-white dark:bg-alira-onyx/20 p-8 rounded-xl border transition-all duration-300 cursor-pointer ${
                    hoveredPrinciple === 1 
                      ? 'border-alira-gold/30 shadow-xl bg-alira-gold/5 scale-105' 
                      : 'border-alira-onyx/10 hover:border-alira-gold/20 hover:shadow-lg'
                  }`}
                  onMouseEnter={() => setHoveredPrinciple(1)}
                  onMouseLeave={() => setHoveredPrinciple(null)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      hoveredPrinciple === 1 ? 'bg-alira-gold/20 scale-110' : 'bg-alira-gold/10'
                    }`}>
                      <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-3">Small tests beat big theories</h3>
                      <p className="text-alira-onyx/80 dark:text-alira-porcelain/80 leading-relaxed">
                        Progress is proven in action, not speculation. We prefer quick experiments over lengthy planning sessions.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Focus creates movement */}
              <Reveal delay={400}>
                <div 
                  className={`bg-white dark:bg-alira-onyx/20 p-8 rounded-xl border transition-all duration-300 cursor-pointer ${
                    hoveredPrinciple === 2 
                      ? 'border-alira-gold/30 shadow-xl bg-alira-gold/5 scale-105' 
                      : 'border-alira-onyx/10 hover:border-alira-gold/20 hover:shadow-lg'
                  }`}
                  onMouseEnter={() => setHoveredPrinciple(2)}
                  onMouseLeave={() => setHoveredPrinciple(null)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      hoveredPrinciple === 2 ? 'bg-alira-gold/20 scale-110' : 'bg-alira-gold/10'
                    }`}>
                      <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-3">Focus creates movement</h3>
                      <p className="text-alira-onyx/80 dark:text-alira-porcelain/80 leading-relaxed">
                        Clear priorities are what drive results. We help you identify what matters most and eliminate distractions.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Systems should serve you */}
              <Reveal delay={500}>
                <div 
                  className={`bg-white dark:bg-alira-onyx/20 p-8 rounded-xl border transition-all duration-300 cursor-pointer ${
                    hoveredPrinciple === 3 
                      ? 'border-alira-gold/30 shadow-xl bg-alira-gold/5 scale-105' 
                      : 'border-alira-onyx/10 hover:border-alira-gold/20 hover:shadow-lg'
                  }`}
                  onMouseEnter={() => setHoveredPrinciple(3)}
                  onMouseLeave={() => setHoveredPrinciple(null)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      hoveredPrinciple === 3 ? 'bg-alira-gold/20 scale-110' : 'bg-alira-gold/10'
                    }`}>
                      <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-3">Systems should serve you</h3>
                      <p className="text-alira-onyx/80 dark:text-alira-porcelain/80 leading-relaxed">
                        Work smarter, not harder. We build tools and processes that free up your time and reduce chaos.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Company Credentials & Trust Section */}
      <section className="py-24 bg-gradient-to-r from-alira-porcelain/20 via-white to-alira-porcelain/20 dark:from-alira-onyx/20 dark:via-alira-onyx dark:to-alira-onyx/20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-6">
                  Trust & Credibility
                </h2>
                <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
                <p className="text-lg text-alira-onyx/70 dark:text-alira-porcelain/70 max-w-2xl mx-auto">
                  We're committed to transparency, security, and delivering on our promises.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Reveal delay={200}>
                <div className="bg-white dark:bg-alira-onyx/20 p-6 rounded-xl border border-alira-onyx/10 dark:border-alira-porcelain/10 text-center hover:border-alira-gold/30 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <div className="w-12 h-12 bg-alira-gold/10 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-alira-gold/20 group-hover:scale-110 transition-all duration-300">
                    <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-alira-onyx dark:text-alira-porcelain mb-3">Company Registration</h3>
                  <p className="text-alira-onyx/70 dark:text-alira-porcelain/70 text-sm">
                    ALIRA Capital Ventures Ltd<br />
                    Registered in England & Wales<br />
                    Company No: 16419663
                  </p>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="bg-white dark:bg-alira-onyx/20 p-6 rounded-xl border border-alira-onyx/10 dark:border-alira-porcelain/10 text-center hover:border-alira-gold/30 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <div className="w-12 h-12 bg-alira-gold/10 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-alira-gold/20 group-hover:scale-110 transition-all duration-300">
                    <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-alira-onyx dark:text-alira-porcelain mb-3">Privacy & Security</h3>
                  <p className="text-alira-onyx/70 dark:text-alira-porcelain/70 text-sm">
                    All client information is kept strictly confidential. We use secure systems and never share your data without permission.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <div className="bg-white dark:bg-alira-onyx/20 p-6 rounded-xl border border-alira-onyx/10 dark:border-alira-porcelain/10 text-center hover:border-alira-gold/30 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <div className="w-12 h-12 bg-alira-gold/10 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-alira-gold/20 group-hover:scale-110 transition-all duration-300">
                    <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-alira-onyx dark:text-alira-porcelain mb-3">Our Commitment</h3>
                  <p className="text-alira-onyx/70 dark:text-alira-porcelain/70 text-sm">
                    We're committed to delivering clear value in every interaction. No hidden fees, no complicated contracts, just straightforward results.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-alira-onyx to-alira-onyx/90 dark:from-alira-porcelain dark:to-alira-porcelain/90">
        <div className="container mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white dark:text-alira-onyx mb-6">
                Ready to work with us?
              </h2>
              <p className="text-xl text-white/80 dark:text-alira-onyx/80 mb-8 leading-relaxed">
                Let's turn your ambition into clear action. Start with a simple plan and build from there.
              </p>
              <CTAButton 
                href="#start-form" 
                variant="alira"
                className="px-8 py-4 text-lg font-sans font-medium"
              >
                Get Started Today
              </CTAButton>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
