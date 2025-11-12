'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Reveal from '@/components/Reveal'
import CTAButton from '@/components/CTAButton'
import { GradientBars } from '@/components/ui/gradient-bars'

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
    <div className="min-h-screen bg-bg-page">
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-bg-page relative overflow-hidden pt-28 md:pt-32">
        <GradientBars />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="max-w-5xl mx-auto text-center">
              <div className="text-alira-gold text-sm tracking-wide uppercase mb-4 font-sans font-light">
                About Us
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-normal text-text-primary mb-8">
                Our Story
              </h1>
              <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
              <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto mb-8">
                ALIRA was created to solve a simple problem: brilliant ideas getting stuck in complexity. 
                We believe every ambitious person deserves a clear path forward, not another complicated framework.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className={`text-center p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                      activeStat === index 
                        ? 'bg-surface border-2 border-alira-gold shadow-lg' 
                        : 'bg-surface border border-borderToken-subtle hover:border-accent hover:bg-bg-muted'
                    }`}
                    onClick={() => setActiveStat(index)}
                    onMouseEnter={() => setActiveStat(index)}
                  >
                    <div className={`text-3xl font-light mb-2 transition-colors duration-300 ${
                      activeStat === index ? 'text-alira-gold' : 'text-alira-gold'
                    }`}>
                      {stat.number}
                    </div>
                    <div className="text-text-secondary mb-2">{stat.label}</div>
                    <div className={`text-sm text-text-secondary transition-all duration-300 ${
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
      <section className="py-24 bg-bg-page">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <Reveal>
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif font-normal text-text-primary mb-6">
                    Our Mission
                  </h2>
                  <div className="w-12 h-px bg-alira-gold mb-6"></div>
                  <p className="text-lg text-text-secondary leading-relaxed mb-6">
                    To strip away the noise and give ambitious people what they actually need: 
                    a simple plan, clear steps, and the confidence to move forward.
                  </p>
                  <p className="text-lg text-text-secondary leading-relaxed">
                    We believe that complexity is the enemy of progress. Every great idea deserves 
                    a straightforward path to reality, not another complicated system to navigate.
                  </p>
                </div>
              </Reveal>
              
              <Reveal delay={200}>
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif font-normal text-text-primary mb-6">
                    Our Vision
                  </h2>
                  <div className="w-12 h-px bg-alira-gold mb-6"></div>
                  <p className="text-lg text-text-secondary leading-relaxed mb-6">
                    A world where every ambitious person has access to clear, actionable guidance 
                    that transforms their ideas into reality without unnecessary complexity.
                  </p>
                  <p className="text-lg text-text-secondary leading-relaxed">
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
        <section className="py-24 bg-bg-page relative overflow-hidden" aria-labelledby="team-heading">
          <GradientBars />

          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <div className="max-w-6xl mx-auto">
              <Reveal>
                <div className="text-center mb-20">
                  <h2 id="team-heading" className="text-4xl md:text-5xl font-serif font-normal text-text-primary mb-6">
                    Meet the Team
                  </h2>
                  <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
                </div>
              </Reveal>

            {/* Our Founder Subsection */}
            <div className="mb-16">
              <Reveal delay={100}>
                <div className="text-center mb-14 bg-surface rounded-3xl p-10 border border-borderToken-subtle shadow-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-alira-gold/5 via-transparent to-transparent pointer-events-none" />
                  <h3 className="text-3xl md:text-4xl font-serif font-normal text-text-primary mb-4 relative z-10">Our Founder</h3>
                  <p className="text-lg text-text-secondary max-w-2xl mx-auto relative z-10">
                    ALIRA began with one person's frustration: seeing brilliant ideas stall in complexity.
                  </p>
                  <div className="w-12 h-px bg-alira-gold mx-auto mt-5 relative z-10"></div>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-12 items-start">
                {/* Founder portrait */}
                <Reveal delay={200}>
                  <div className="flex justify-center">
                    <div className="relative flex flex-col items-center">
                      <div className="absolute -top-6 -right-6 w-20 h-20 bg-alira-gold/10 rounded-full blur-xl" />
                      <div className="absolute -bottom-6 -left-10 w-24 h-24 bg-alira-gold/10 rounded-full blur-2xl" />

                      <div className="relative">
                        <div className="absolute inset-0 rounded-full border border-alira-gold/30 [mask-image:radial-gradient(circle,rgba(0,0,0,0.35) 60%,transparent 100%)]" />
                        <div className="relative w-64 h-64 rounded-full overflow-hidden border-2 border-alira-gold bg-alira-gold/10 shadow-token-sm">
                          <Image
                            src="/images/assets/founder.png"
                            alt="Portrait of ALIRA founder with over 10 years of project management experience, specializing in business strategy and operational excellence"
                            width={256}
                            height={256}
                            className="w-full h-full object-cover object-top"
                            priority
                          />
                        </div>
                      </div>

                      <div className="mt-8 text-center bg-surface rounded-2xl px-6 py-5 border border-borderToken-subtle shadow-sm w-full max-w-xs">
                        <p className="text-sm uppercase tracking-[0.3em] text-alira-gold/80 font-sans font-light mb-2">
                          Founder & Lead Strategist
                        </p>
                        <p className="text-xl font-serif text-text-primary">Funke Alira</p>
                      </div>
                    </div>
                  </div>
                </Reveal>

                {/* Founder story and credentials */}
                <Reveal delay={350}>
                  <div className="space-y-10 bg-surface rounded-3xl p-10 border border-borderToken-subtle shadow-sm">
                    <div className="relative pl-6">
                      <div className="absolute left-0 top-1 h-16 w-1 rounded-full bg-alira-gold/40" />
                      <p className="text-2xl md:text-3xl text-text-primary font-serif leading-relaxed">
                        “I know what it feels like to have ambition but no clear path.”
                      </p>
                    </div>

                    <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
                      <p>
                        For over a decade, I worked in project management and operations — leading teams, fixing systems, and delivering projects that saved organisations time and money.
                      </p>
                      <p>
                        But I kept seeing the same pattern: great ideas getting stuck in complexity. Simple problems becoming complicated messes.
                      </p>
                      <p>
                        That's why I built ALIRA: to strip away the noise and give people what they actually need — a simple plan, clear steps, and the confidence to move forward.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="rounded-2xl border border-borderToken-subtle bg-white/30 p-4 text-center shadow-sm">
                        <div className="text-alira-gold text-xs uppercase tracking-[0.2em] mb-2">Experience</div>
                        <div className="text-text-primary font-serif text-xl">10+ years</div>
                        <p className="text-sm text-text-secondary mt-2">Project leadership & operations</p>
                      </div>
                      <div className="rounded-2xl border border-borderToken-subtle bg-white/30 p-4 text-center shadow-sm">
                        <div className="text-alira-gold text-xs uppercase tracking-[0.2em] mb-2">Industries</div>
                        <div className="text-text-primary font-serif text-xl">Multi-sector</div>
                        <p className="text-sm text-text-secondary mt-2">Cross-functional team delivery</p>
                      </div>
                      <div className="rounded-2xl border border-borderToken-subtle bg-white/30 p-4 text-center shadow-sm">
                        <div className="text-alira-gold text-xs uppercase tracking-[0.2em] mb-2">Impact</div>
                        <div className="text-text-primary font-serif text-xl">Measured</div>
                        <p className="text-sm text-text-secondary mt-2">Time & cost savings for clients</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                      <div className="text-sm text-text-secondary leading-relaxed sm:max-w-xl">
                        Ready to move beyond ideas and into action? Let’s map out the next steps together.
                      </div>
                      <CTAButton
                        href="/contact"
                        variant="alira"
                        className="px-8 py-4 text-lg font-sans font-light"
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
                  <h3 className="text-3xl font-serif font-normal text-text-primary mb-4">Our Team Capabilities</h3>
                  <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                    Three specialists working together to deliver clarity, reach, and systems that work.
                  </p>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* The Strategist */}
                <Reveal delay={700}>
                  <div 
                    className={`bg-surface p-10 rounded-2xl border transition-all duration-500 text-center group relative overflow-hidden cursor-pointer ${
                      activeTeamMember === 0 
                        ? 'border-alira-gold shadow-2xl bg-bg-muted scale-105' 
                        : 'border-borderToken-subtle hover:border-accent hover:shadow-2xl hover:bg-bg-muted'
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
                    <h4 className="text-2xl font-serif font-normal text-text-primary mb-4">The Strategist</h4>
                    <p className="text-text-secondary leading-relaxed mb-6">
                      Sees the bigger picture and turns ideas into steps you can act on.
                    </p>
                    <div className="text-sm text-text-secondary space-y-3 text-left">
                      <p><span className="font-light text-text-primary">Runs clarity sessions and workshops</span> to define goals</p>
                      <p><span className="font-light text-text-primary">Creates 90-day and 1-year growth roadmaps</span> for clear direction</p>
                      <p><span className="font-light text-text-primary">Breaks complex challenges</span> into simple, actionable projects</p>
                    </div>
                    
                    {/* Interactive button */}
                    <div className={`mt-6 transition-all duration-300 ${
                      activeTeamMember === 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <button className="text-alira-gold text-sm font-sans font-light hover:text-accent-dark transition-colors">
                        See How We Work →
                      </button>
                    </div>
                  </div>
                </Reveal>

                {/* The Marketing Lead */}
                <Reveal delay={800}>
                  <div 
                    className={`bg-surface p-10 rounded-2xl border transition-all duration-500 text-center group relative overflow-hidden cursor-pointer ${
                      activeTeamMember === 1 
                        ? 'border-alira-gold shadow-2xl bg-bg-muted scale-105' 
                        : 'border-borderToken-subtle hover:border-accent hover:shadow-2xl hover:bg-bg-muted'
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
                    <h4 className="text-2xl font-serif font-normal text-text-primary mb-4">The Marketing Lead</h4>
                    <p className="text-text-secondary leading-relaxed mb-6">
                      Knows how to make your brand impossible to ignore.
                    </p>
                    <div className="text-sm text-text-secondary space-y-3 text-left">
                      <p><span className="font-light text-text-primary">Improves your social media content</span> and campaigns for better engagement</p>
                      <p><span className="font-light text-text-primary">Builds content calendars</span> to grow visibility and reach</p>
                      <p><span className="font-light text-text-primary">Helps you reach the right customers</span> with clear, compelling messaging</p>
                    </div>
                    
                    {/* Interactive button */}
                    <div className={`mt-6 transition-all duration-300 ${
                      activeTeamMember === 1 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <button className="text-alira-gold text-sm font-sans font-light hover:text-accent-dark transition-colors">
                        See How We Work →
                      </button>
                    </div>
                  </div>
                </Reveal>

                {/* The Systems Engineer */}
                <Reveal delay={900}>
                  <div 
                    className={`bg-surface p-10 rounded-2xl border transition-all duration-500 text-center group relative overflow-hidden cursor-pointer ${
                      activeTeamMember === 2 
                        ? 'border-alira-gold shadow-2xl bg-bg-muted scale-105' 
                        : 'border-borderToken-subtle hover:border-accent hover:shadow-2xl hover:bg-bg-muted'
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
                    <h4 className="text-2xl font-serif font-normal text-text-primary mb-4">The Systems Engineer</h4>
                    <p className="text-text-secondary leading-relaxed mb-6">
                      Builds the tools and processes that unlock growth.
                    </p>
                    <div className="text-sm text-text-secondary space-y-3 text-left">
                      <p><span className="font-light text-text-primary">Designs and launches websites</span> and online platforms that convert</p>
                      <p><span className="font-light text-text-primary">Integrates AI into daily workflows</span> to boost efficiency and insights</p>
                      <p><span className="font-light text-text-primary">Automates repetitive tasks</span> to free up time and reduce chaos</p>
                    </div>
                    
                    {/* Interactive button */}
                    <div className={`mt-6 transition-all duration-300 ${
                      activeTeamMember === 2 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <button className="text-alira-gold text-sm font-sans font-light hover:text-accent-dark transition-colors">
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
                  <h3 className="text-3xl font-serif font-normal text-text-primary mb-4">How We Work Together</h3>
                  <p className="text-lg text-white max-w-2xl mx-auto">
                    Our collaborative approach ensures you get the best of all three specializations working in harmony.
                  </p>
                </div>
              </Reveal>

              <div className="max-w-4xl mx-auto">
                <Reveal delay={1100}>
                  <div className="bg-surface p-8 rounded-2xl border border-borderToken-subtle">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                      <div>
                        <h4 className="text-lg font-serif font-normal text-text-primary mb-3">Strategy First</h4>
                        <p className="text-text-secondary text-sm">
                          Every project begins with clear objectives and a roadmap that makes sense for your situation.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-serif font-normal text-text-primary mb-3">Marketing Integration</h4>
                        <p className="text-text-secondary text-sm">
                          Your message and reach are built into the plan from day one, not added as an afterthought.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-serif font-normal text-text-primary mb-3">Systems That Scale</h4>
                        <p className="text-text-secondary text-sm">
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
      <section className="py-24 bg-bg-page">
        <div className="container mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-normal text-text-primary mb-6">
                Our Principles
              </h2>
              <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                The core beliefs that guide everything we do and every solution we create.
              </p>
            </div>
          </Reveal>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Clarity over complexity */}
              <Reveal delay={200}>
                <div 
                  className={`bg-surface p-8 rounded-xl border transition-all duration-300 cursor-pointer ${
                    hoveredPrinciple === 0 
                      ? 'border-alira-gold shadow-xl bg-bg-muted scale-105' 
                      : 'border-borderToken-subtle hover:border-accent hover:shadow-lg'
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
                      <h3 className="text-xl font-serif font-normal text-text-primary mb-3">Clarity over complexity</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Simple solutions win over complicated frameworks every time. We believe in stripping away the noise to reveal what actually works.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Small tests beat big theories */}
              <Reveal delay={300}>
                <div 
                  className={`bg-surface p-8 rounded-xl border transition-all duration-300 cursor-pointer ${
                    hoveredPrinciple === 1 
                      ? 'border-alira-gold shadow-xl bg-bg-muted scale-105' 
                      : 'border-borderToken-subtle hover:border-accent hover:shadow-lg'
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
                      <h3 className="text-xl font-serif font-normal text-text-primary mb-3">Small tests beat big theories</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Progress is proven in action, not speculation. We prefer quick experiments over lengthy planning sessions.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Focus creates movement */}
              <Reveal delay={400}>
                <div 
                  className={`bg-surface p-8 rounded-xl border transition-all duration-300 cursor-pointer ${
                    hoveredPrinciple === 2 
                      ? 'border-alira-gold shadow-xl bg-bg-muted scale-105' 
                      : 'border-borderToken-subtle hover:border-accent hover:shadow-lg'
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
                      <h3 className="text-xl font-serif font-normal text-text-primary mb-3">Focus creates movement</h3>
                      <p className="text-text-secondary leading-relaxed">
                        Clear priorities are what drive results. We help you identify what matters most and eliminate distractions.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Systems should serve you */}
              <Reveal delay={500}>
                <div 
                  className={`bg-surface p-8 rounded-xl border transition-all duration-300 cursor-pointer ${
                    hoveredPrinciple === 3 
                      ? 'border-alira-gold shadow-xl bg-bg-muted scale-105' 
                      : 'border-borderToken-subtle hover:border-accent hover:shadow-lg'
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
                      <h3 className="text-xl font-serif font-normal text-text-primary mb-3">Systems should serve you</h3>
                      <p className="text-text-secondary leading-relaxed">
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
      <section className="py-24 bg-bg-page relative overflow-hidden">
        <GradientBars />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-normal text-text-primary mb-6">
                  Trust & Credibility
                </h2>
                <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  We're committed to transparency, security, and delivering on our promises.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Reveal delay={200}>
                <div className="bg-surface p-6 rounded-xl border border-borderToken-subtle text-center hover:border-alira-gold hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <div className="w-12 h-12 bg-alira-gold/10 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-alira-gold/20 group-hover:scale-110 transition-all duration-300">
                    <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-serif font-normal text-text-primary mb-3">Company Registration</h3>
                  <p className="text-text-secondary text-sm">
                    ALIRA Capital Ventures Ltd<br />
                    Registered in England & Wales<br />
                    Company No: 16419663
                  </p>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="bg-surface p-6 rounded-xl border border-borderToken-subtle text-center hover:border-alira-gold hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <div className="w-12 h-12 bg-alira-gold/10 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-alira-gold/20 group-hover:scale-110 transition-all duration-300">
                    <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-serif font-normal text-text-primary mb-3">Privacy & Security</h3>
                  <p className="text-text-secondary text-sm">
                    All client information is kept strictly confidential. We use secure systems and never share your data without permission.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <div className="bg-surface p-6 rounded-xl border border-borderToken-subtle text-center hover:border-alira-gold hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <div className="w-12 h-12 bg-alira-gold/10 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-alira-gold/20 group-hover:scale-110 transition-all duration-300">
                    <svg className="w-6 h-6 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-serif font-normal text-text-primary mb-3">Our Commitment</h3>
                  <p className="text-text-secondary text-sm">
                    We're committed to delivering clear value in every interaction. No hidden fees, no complicated contracts, just straightforward results.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-alira-primary to-alira-primary/90">
        <div className="container mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-serif font-normal text-text-inverse mb-6">
                Ready to work with us?
              </h2>
              <p className="text-xl text-white mb-8 leading-relaxed">
                Let's turn your ambition into clear action. Start with a simple plan and build from there.
              </p>
              <CTAButton 
                href="/#hero" 
                variant="alira"
                className="px-8 py-4 text-lg font-sans font-light"
                location="about-cta"
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
