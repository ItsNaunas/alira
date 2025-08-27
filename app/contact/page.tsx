import Reveal from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Mail, Calendar, MessageSquare, ArrowRight, Users, Target, Clock, Award } from 'lucide-react'
import Link from 'next/link'
import SectionHeading from '@/components/ui/SectionHeading'

export default function Contact() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="min-h-screen flex items-center justify-center bg-alira-porcelain relative overflow-hidden"
        aria-labelledby="contact-heading"
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
                id="alira-grid-contact"
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
              fill="url(#alira-grid-contact)"
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
              <h1 id="contact-heading" className="text-5xl md:text-7xl font-bold text-alira-onyx leading-[0.95] tracking-tight mb-8">
                Start Your Journey
              </h1>
            </Reveal>
            
            {/* Subheadline */}
            <Reveal delay={250}>
              <p className="text-xl md:text-2xl text-alira-ink/80 max-w-[50ch] mx-auto leading-snug mb-16">
                Choose your preferred way to begin. Complete our intake form for an immediate business case, or schedule a call to discuss your options.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Contact Options Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-alira-porcelain/20 via-white to-alira-porcelain/20 relative z-[1]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Intake Form Option */}
              <div className="group text-center">
                <div className="mx-auto w-16 h-16 bg-alira-gold/10 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="h-8 w-8 text-alira-gold" />
                </div>
                <h3 className="text-xl font-serif font-bold text-alira-onyx mb-4">
                  Intake Form
                </h3>
                <p className="text-alira-onyx/70 mb-6 leading-relaxed">
                  Complete our structured form and receive a personalized Draft Business Case within minutes.
                </p>
                <div className="inline-block group">
                  <Link
                    href="/form"
                    className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-white bg-alira-onyx rounded-full hover:bg-alira-onyx/90 transition-colors"
                  >
                    Start Form
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Schedule Call Option */}
              <div className="group text-center">
                <div className="mx-auto w-16 h-16 bg-alira-gold/10 rounded-full flex items-center justify-center mb-6">
                  <Calendar className="h-8 w-8 text-alira-gold" />
                </div>
                <h3 className="text-xl font-serif font-bold text-alira-onyx mb-4">
                  Schedule Call
                </h3>
                <p className="text-alira-onyx/70 mb-6 leading-relaxed">
                  Book a 30-minute consultation to discuss your business challenges and explore solutions.
                </p>
                <div className="inline-block group">
                  <a
                    href="https://calendly.com/alira-consulting"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-alira-onyx border-2 border-alira-onyx rounded-full hover:bg-alira-onyx hover:text-white transition-colors"
                  >
                    Book Call
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Email Option */}
              <div className="group text-center">
                <div className="mx-auto w-16 h-16 bg-alira-gold/10 rounded-full flex items-center justify-center mb-6">
                  <Mail className="h-8 w-8 text-alira-gold" />
                </div>
                <h3 className="text-xl font-serif font-bold text-alira-onyx mb-4">
                  Email Us
                </h3>
                <p className="text-alira-onyx/70 mb-6 leading-relaxed">
                  Send us a direct message with your questions or specific requirements.
                </p>
                <div className="inline-block group">
                  <a
                    href="mailto:hello@alira.com"
                    className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-alira-onyx border-2 border-alira-onyx rounded-full hover:bg-alira-onyx hover:text-white transition-colors"
                  >
                    Send Email
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* About ALIRA Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading>
              Why Choose ALIRA?
            </SectionHeading>
          </Reveal>
          
          <Reveal delay={200}>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-alira-gold/10 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-alira-gold" />
                </div>
                <h3 className="text-lg font-serif font-bold text-alira-onyx mb-3">
                  Clarity-First
                </h3>
                <p className="text-sm text-alira-onyx/70">
                  We cut through complexity to deliver actionable insights that drive real results.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-alira-gold/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-alira-gold" />
                </div>
                <h3 className="text-lg font-serif font-bold text-alira-onyx mb-3">
                  Expert Team
                </h3>
                <p className="text-sm text-alira-onyx/70">
                  Seasoned consultants with deep experience across industries and business stages.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-alira-gold/10 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-alira-gold" />
                </div>
                <h3 className="text-lg font-serif font-bold text-alira-onyx mb-3">
                  Rapid Delivery
                </h3>
                <p className="text-sm text-alira-onyx/70">
                  Get your business case within minutes, not weeks. Immediate value from day one.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-alira-gold/10 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-alira-gold" />
                </div>
                <h3 className="text-lg font-serif font-bold text-alira-onyx mb-3">
                  Proven Results
                </h3>
                <p className="text-sm text-alira-onyx/70">
                  Systems that endure beyond the engagement, delivering lasting clarity and growth.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-16 md:py-20 bg-alira-onyx/5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold text-alira-onyx mb-6">
                  Our Approach
                </h2>
                <div className="w-16 h-px bg-alira-gold mb-8"></div>
                <div className="space-y-6">
                  <p className="text-alira-onyx/70 leading-relaxed">
                    We believe every business owner deserves to start with clarity, not confusion. Our approach is built on the principle that the best strategies emerge from understanding, not assumptions.
                  </p>
                  <p className="text-alira-onyx/70 leading-relaxed">
                    Whether you're resetting operations, scaling growth, integrating AI, or seeking ongoing guidance, we deliver systems that endure beyond the engagement.
                  </p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg border border-alira-onyx/10">
                <h3 className="text-xl font-serif font-bold text-alira-onyx mb-6">
                  What Sets Us Apart
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-4">
                    <span className="text-alira-gold font-bold text-lg">•</span>
                    <span className="text-alira-onyx/70">Outcome-focused engagements, not time-based billing</span>
                  </li>
                  <li className="flex items-start space-x-4">
                    <span className="text-alira-gold font-bold text-lg">•</span>
                    <span className="text-alira-onyx/70">Immediate value through instant business case generation</span>
                  </li>
                  <li className="flex items-start space-x-4">
                    <span className="text-alira-gold font-bold text-lg">•</span>
                    <span className="text-alira-onyx/70">Tailored solutions, never generic templates</span>
                  </li>
                  <li className="flex items-start space-x-4">
                    <span className="text-alira-gold font-bold text-lg">•</span>
                    <span className="text-alira-onyx/70">Ongoing support for complex transitions</span>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-alira-onyx">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <Reveal>
              <div className="space-y-12">
                <div className="relative">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    Ready to Get Started?
                  </h2>
                  <div className="w-20 h-px bg-alira-gold mx-auto"></div>
                </div>
                
                <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                  Choose your preferred way to begin your journey with ALIRA. Every path leads to clarity.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <div className="inline-block group">
                    <Link
                      href="/form"
                      className="inline-flex items-center justify-center px-12 py-5 text-lg font-semibold text-alira-gold border-2 border-alira-gold rounded-full hover:bg-alira-gold hover:text-alira-onyx focus:outline-none focus:ring-4 focus:ring-alira-gold/20 focus:ring-offset-2 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
                    >
                      Start with Form
                      <ArrowRight className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                  <div className="inline-block group">
                    <a
                      href="https://calendly.com/alira-consulting"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-12 py-5 text-lg font-semibold text-white border-2 border-white rounded-full hover:bg-white hover:text-alira-onyx focus:outline-none focus:ring-4 focus:ring-white/20 focus:ring-offset-2 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
                    >
                      Schedule Call
                      <ArrowRight className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
