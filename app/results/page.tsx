'use client'

import React from 'react'
import { TrendingUp, Users, Target, DollarSign, Calendar, Award, CheckCircle, Building, Star, Quote } from 'lucide-react'
import Reveal from '@/components/Reveal'
import CTAButton from '@/components/CTAButton'
import { GradientBars } from '@/components/ui/gradient-bars'
import { conversionEvents } from '@/lib/analytics'

export default function ResultsPage() {
  // Track page view
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      conversionEvents.pageView('results')
    }
  }, [])

  const results = [
    {
      category: "Cost Savings",
      metrics: [
        { value: "£21,000", label: "Total annual savings secured", icon: DollarSign },
        { value: "£11,000", label: "Cost reduction achieved", icon: TrendingUp },
        { value: "£10,000+", label: "Additional vendor savings", icon: Target }
      ]
    },
    {
      category: "Operational Impact",
      metrics: [
        { value: "25%", label: "Training sign-up increase", icon: TrendingUp },
        { value: "1,000+", label: "Staff trained", icon: Users },
        { value: "200+", label: "Attendees per event", icon: Calendar }
      ]
    },
    {
      category: "Scale & Reach",
      metrics: [
        { value: "3,000+", label: "Staff onboarded", icon: Users },
        { value: "20+", label: "Projects managed", icon: Target },
        { value: "10+", label: "Years experience", icon: Building }
      ]
    }
  ]

  const keyAchievements = [
    "Reduced operational costs by £11,000 through stakeholder negotiations and process optimisation",
    "Achieved £10,000+ savings by reviewing vendor contracts and agency spending",
    "Redesigned flagship training workflow, increasing sign-ups by 25% and improving user experience",
    "Designed and delivered comprehensive training and compliance systems across large organizations",
    "Planned and executed large-scale transformation events every six months for 200+ attendees",
    "Coordinated multi-workstream projects with PMO rigor, governance, and executive reporting"
  ]

  const clientTestimonials = [
    {
      quote: "I was consistently impressed by his creativity to solve problems and deliver results. His ability to quickly learn new skills and build relationships consistently contributed to the success of our team projects that had internal and external stakeholders, and a national and international reach.",
      author: "Programme Director",
      company: "National Institute for Health and Care Excellence",
      rating: 5
    },
    {
      quote: "Creativity to solve problems and deliver results. Outstanding project management skills and attention to detail.",
      author: "Auzewell Chitewe",
      company: "Former Colleague",
      rating: 5
    },
    {
      quote: "Transformed our approach to business planning. Clear, actionable insights that we could implement immediately.",
      author: "Naufal Nassor",
      company: "Client",
      rating: 5
    }
  ]

  const caseStudies = [
    {
      title: "Enterprise Training System Redesign",
      challenge: "Complex training system with low engagement and high dropout rates",
      solution: "Streamlined user journey, improved UI/UX, and optimised workflow processes",
      result: "25% increase in sign-ups, improved completion rates, and enhanced user satisfaction",
      impact: "1,000+ staff trained with new system"
    },
    {
      title: "Cost Optimization Programme",
      challenge: "Rising operational costs and inefficient vendor relationships",
      solution: "Comprehensive vendor review, stakeholder negotiations, and process optimisation",
      result: "£21,000 total annual savings across multiple cost centers",
      impact: "Sustainable cost reduction framework implemented"
    },
    {
      title: "Large-Scale Event Coordination",
      challenge: "Managing complex transformation events with multiple stakeholders",
      solution: "PMO governance, clear communication frameworks, and executive reporting",
      result: "Successfully delivered events for 200+ attendees every 6 months",
      impact: "3,000+ staff onboarded through transformation programme"
    }
  ]

  return (
    <div className="min-h-screen bg-bg-page">
      {/* Hero Section */}
      <section className="py-24 bg-bg-page relative overflow-hidden pt-28 md:pt-32">
        <GradientBars />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <div className="mb-12">
                <span className="text-alira-gold text-sm tracking-wide uppercase mb-4 font-sans font-light block">
                  PROVEN RESULTS
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-text-primary leading-tight mb-6">
                  Enterprise Transformation Results
                </h1>
                <div className="w-20 h-px bg-alira-gold mx-auto mb-8"></div>
                <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
                  Delivered comprehensive transformation programmes focused on improving efficiency, value for money, and operational performance.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="py-20 bg-bg-page">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-normal text-text-primary mb-6">
                  Measurable Impact
                </h2>
                <div className="w-16 h-px bg-alira-gold mx-auto"></div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {results.map((category, index) => (
                <Reveal key={index} delay={index * 150}>
                  <div className="bg-surface rounded-2xl p-8 border border-borderToken-subtle hover:border-accent hover:shadow-xl transition-all duration-300">
                    <h3 className="text-xl font-serif font-normal text-text-primary mb-6 text-center">
                      {category.category}
                    </h3>
                    <div className="space-y-4">
                      {category.metrics.map((metric, metricIndex) => {
                        const IconComponent = metric.icon
                        return (
                          <div key={metricIndex} className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-alira-gold/10 rounded-full flex items-center justify-center">
                              <IconComponent className="w-5 h-5 text-alira-gold" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xl font-serif font-normal text-text-primary">
                                {metric.value}
                              </div>
                              <div className="text-sm text-text-secondary">
                                {metric.label}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Impact Summary */}
            <Reveal delay={600}>
              <div className="text-center">
                <div className="inline-block bg-alira-gold/10 rounded-2xl px-12 py-8 border border-accent">
                  <div className="text-3xl font-serif font-normal text-text-primary mb-2">
                    £21,000 Total Annual Savings
                  </div>
                  <div className="text-lg text-text-secondary">
                    Secured through efficiency measures, contract reviews, and stakeholder negotiations
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Key Achievements */}
      <section className="py-20 bg-bg-page">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-normal text-text-primary mb-6">
                Key Achievements
              </h2>
                <div className="w-16 h-px bg-alira-gold mx-auto"></div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="bg-surface rounded-2xl p-8 lg:p-12 border border-borderToken-subtle shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {keyAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-alira-gold/10 rounded-full flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-4 h-4 text-alira-gold" />
                      </div>
                      <p className="text-text-secondary leading-relaxed">
                        {achievement}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-bg-page">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-normal text-text-primary mb-6">
                  Case Studies
                </h2>
                <div className="w-16 h-px bg-alira-gold mx-auto mb-6"></div>
                <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                  Real projects, real results — see how we've helped organizations transform their operations.
                </p>
              </div>
            </Reveal>

            <div className="space-y-8">
              {caseStudies.map((study, index) => (
                <Reveal key={index} delay={index * 200}>
                  <div className="bg-surface rounded-2xl p-8 border border-borderToken-subtle hover:border-accent hover:shadow-xl transition-all duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-2xl font-serif font-normal text-text-primary mb-4">
                          {study.title}
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-serif font-normal text-alira-gold mb-2">Challenge</h4>
                            <p className="text-text-secondary text-sm">
                              {study.challenge}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-serif font-normal text-alira-gold mb-2">Solution</h4>
                            <p className="text-text-secondary text-sm">
                              {study.solution}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-alira-gold/5 rounded-xl p-6 border border-accent">
                          <h4 className="font-serif font-normal text-alira-gold mb-2">Result</h4>
                          <p className="text-text-secondary text-sm mb-4">
                            {study.result}
                          </p>
                          <div className="border-t border-accent pt-4">
                            <h4 className="font-serif font-normal text-alira-gold mb-2">Impact</h4>
                            <p className="text-text-secondary text-sm font-sans font-light">
                              {study.impact}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-20 bg-bg-page relative overflow-hidden">
        <GradientBars />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-normal text-text-primary mb-6">
                  Client Testimonials
                </h2>
                <div className="w-16 h-px bg-alira-gold mx-auto"></div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {clientTestimonials.map((testimonial, index) => (
                <Reveal key={index} delay={index * 150}>
                  <div className="bg-surface rounded-2xl p-8 border border-borderToken-subtle hover:border-accent hover:shadow-xl transition-all duration-300 relative">
                    {/* Quote icon */}
                    <div className="absolute top-6 right-6">
                      <Quote className="w-8 h-8 text-alira-gold/30" />
                    </div>
                    
                    {/* Rating stars */}
                    <div className="flex space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-alira-gold text-alira-gold" />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <blockquote className="text-text-secondary mb-6 leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    {/* Author */}
                    <div className="border-t border-borderToken-subtle pt-4">
                      <div className="font-serif font-normal text-text-primary">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-text-tertiary">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#07102c] via-[#0d1b3b] to-[#1b3680]">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-text-inverse mb-6 leading-tight">
                    Ready to achieve similar results?
                  </h2>
                  <p className="text-xl text-text-inverse/80 mb-8 max-w-2xl mx-auto">
                    Let's create a clear plan for your business transformation.
                  </p>
                  <div className="w-20 h-px bg-alira-gold mx-auto mb-8"></div>
                </div>
                
                <div className="space-y-4">
                  <CTAButton 
                    href="/#start-chat" 
                    variant="aliraOutline"
                    className="px-12 py-6 text-xl font-sans font-light text-text-inverse border-white/40 hover:border-white/60"
                    location="results-cta"
                  >
                    Start My Plan
                  </CTAButton>
                  <p className="text-sm text-text-inverse/70">
                    Free • Private • No card required • Delivered in minutes
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
