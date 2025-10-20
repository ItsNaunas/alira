import React from 'react'
import SignatureEngagements from '@/components/SignatureEngagements'
import ServicesDeliverables from '@/components/ServicesDeliverables'
import Reveal from '@/components/Reveal'
import CTAButton from '@/components/CTAButton'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { GradientBars } from '@/components/ui/gradient-bars'

export default function Services() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section 
        className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden"
        aria-labelledby="services-heading"
      >
        <GradientBars />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Brand Seal */}
            <Reveal>
              <div className="mb-16">
                <span className="block text-3xl tracking-[0.2em] uppercase text-alira-white font-serif font-normal mb-4 font-serif">
                  ALIRA.
                </span>
                <div className="w-20 h-[3px] bg-alira-gold mx-auto mb-12"></div>
              </div>
            </Reveal>
            
            {/* Headline */}
            <Reveal delay={200}>
              <h1 id="services-heading" className="text-5xl md:text-7xl font-serif font-normal text-alira-white leading-[0.95] tracking-tight mb-8">
                Choose your <span className="text-alira-gold">service</span>
              </h1>
            </Reveal>
            
            {/* Subheadline */}
            <Reveal delay={250}>
              <p className="text-2xl md:text-3xl text-alira-white font-serif italic font-light max-w-[60ch] mx-auto leading-tight mb-8">
                Content strategy, systems automation, or complete growth solutions. Pick what matches your needs right now.
              </p>
            </Reveal>
            
            {/* CTA Button */}
            <Reveal delay={300}>
              <div className="space-y-4">
                <CTAButton 
                  href="/#start-chat" 
                  variant="alira"
                  className="px-8 py-4 text-lg font-sans font-light"
                  location="services-hero"
                >
                  Start Your Simple Plan
                </CTAButton>
                <p className="text-sm text-alira-white/70 font-sans font-light">
                  Free • Private • No card required • Delivered in minutes
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Content & Growth */}
              <Reveal>
                <div className="bg-white/[0.02] p-8 rounded-2xl border border-white/10 hover:border-alira-gold hover:shadow-xl hover:shadow-alira-gold/10 hover:-translate-y-1 transition-all duration-500 text-center flex flex-col h-full relative overflow-hidden group">
                  <div className="mb-4">
                    <h3 className="text-2xl font-serif font-normal text-alira-white mb-3">Content & Growth</h3>
                    <span className="bg-alira-gold text-alira-black px-3 py-1 rounded-full text-sm font-sans font-medium">
                      From £500
                    </span>
                  </div>
                  <h4 className="font-serif font-normal text-alira-white mb-3">Strategic content + growth systems</h4>
                  <p className="text-alira-white/80 mb-6 text-sm flex-grow font-sans">Content strategy, campaigns, copy, and distribution that drives growth.</p>
                  
                  {/* Features List */}
                  <div className="mb-6">
                    <ul className="text-left space-y-2">
                      <li className="flex items-center gap-2 text-sm text-alira-white/80">
                        <span className="text-alira-gold font-serif font-normal">✓</span>
                        <span>Content strategy & planning</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-alira-white/80">
                        <span className="text-alira-gold font-serif font-normal">✓</span>
                        <span>Campaign development</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-alira-white/80">
                        <span className="text-alira-gold font-serif font-normal">✓</span>
                        <span>Copywriting & messaging</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-alira-white/80">
                        <span className="text-alira-gold font-serif font-normal">✓</span>
                        <span>Distribution & growth systems</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-auto">
                    <p className="text-alira-white/60 text-xs">2-4 weeks</p>
                  </div>
                </div>
              </Reveal>

              {/* Systems & Automation */}
              <Reveal delay={200}>
                <div className="bg-white/[0.02] p-8 rounded-2xl border border-white/10 hover:border-alira-gold hover:shadow-xl hover:shadow-alira-gold/10 hover:-translate-y-1 transition-all duration-500 text-center flex flex-col h-full relative overflow-hidden group">
                  <div className="mb-4">
                    <h3 className="text-2xl font-serif font-normal text-alira-white mb-3">Systems & Automation</h3>
                    <span className="bg-alira-gold text-alira-black px-3 py-1 rounded-full text-sm font-sans font-medium">
                      From £750
                    </span>
                  </div>
                  <h4 className="font-serif font-normal text-alira-white mb-3">Automated workflows + efficiency</h4>
                  <p className="text-alira-white/80 mb-6 text-sm flex-grow font-sans">Internal systems, dashboards, automations, and tooling that scale your operations.</p>
                  
                  {/* Features List */}
                  <div className="mb-6">
                    <ul className="text-left space-y-2">
                      <li className="flex items-center gap-2 text-sm text-alira-white/80">
                        <span className="text-alira-gold font-serif font-normal">✓</span>
                        <span>Process automation</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-alira-white/80">
                        <span className="text-alira-gold font-serif font-normal">✓</span>
                        <span>Dashboard development</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-alira-white/80">
                        <span className="text-alira-gold font-serif font-normal">✓</span>
                        <span>Tool integration</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-alira-white/80">
                        <span className="text-alira-gold font-serif font-normal">✓</span>
                        <span>Operational efficiency</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-auto">
                    <p className="text-alira-white/60 text-xs">3-6 weeks</p>
                  </div>
                </div>
              </Reveal>

              {/* Complete Growth Package - Featured */}
              <Reveal delay={300}>
                <div className="bg-white/[0.05] p-8 rounded-2xl border-2 border-alira-gold shadow-xl hover:shadow-2xl hover:shadow-alira-gold/20 transition-all duration-500 transform hover:-translate-y-2 relative text-center flex flex-col h-full group overflow-hidden">
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-alira-gold text-alira-black px-4 py-1 rounded-full text-xs font-serif font-medium">
                      MOST POPULAR
                    </span>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-2xl font-serif font-normal text-alira-white mb-3">Complete Growth Package</h3>
                    <span className="bg-alira-gold text-alira-black px-3 py-1 rounded-full text-sm font-sans font-medium">
                      From £1,200
                    </span>
                  </div>
                  <h4 className="font-serif font-normal text-alira-white mb-3">Everything you need to scale</h4>
                  <p className="text-alira-white/80 mb-6 text-sm flex-grow font-sans">Full-service growth solution combining content strategy, systems automation, and operational excellence.</p>
                  
                  {/* Features List */}
                  <div className="mb-6">
                    <ul className="text-left space-y-2">
                      <li className="flex items-center gap-2 text-sm text-alira-white/80">
                        <span className="text-alira-gold font-serif font-normal">✓</span>
                        <span>Content strategy & campaigns</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-alira-white/80">
                        <span className="text-alira-gold font-serif font-normal">✓</span>
                        <span>Systems automation & dashboards</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-alira-white/80">
                        <span className="text-alira-gold font-serif font-normal">✓</span>
                        <span>Process optimisation</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-alira-white/80">
                        <span className="text-alira-gold font-serif font-normal">✓</span>
                        <span>Growth tracking & analytics</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-alira-white/80">
                        <span className="text-alira-gold font-serif font-normal">✓</span>
                        <span>Ongoing support & optimisation</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-auto">
                    <p className="text-alira-white/60 text-xs">4-8 weeks</p>
                  </div>
                </div>
              </Reveal>

            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <GradientBars />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-serif font-normal text-alira-white mb-6">
                  FAQ
                </h2>
                <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
              </div>
            </Reveal>

            <div className="space-y-8">
              <Reveal delay={200}>
                <div className="bg-white/[0.02] p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-serif font-normal text-alira-white mb-3">How fast can I start?</h3>
                  <p className="text-alira-white/70">Most sessions can begin within a few days.</p>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="bg-white/[0.02] p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-serif font-normal text-alira-white mb-3">How does pricing work?</h3>
                  <p className="text-alira-white/70">Each service has a starting price. The final cost depends on the scope of work. You will always know the price before we begin.</p>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <div className="bg-white/[0.02] p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-serif font-normal text-alira-white mb-3">Do I need to prepare anything?</h3>
                  <p className="text-alira-white/70">No heavy prep. Just be ready to share where you are stuck or what you want to achieve.</p>
                </div>
              </Reveal>

              <Reveal delay={500}>
                <div className="bg-white/[0.02] p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-serif font-normal text-alira-white mb-3">Is this only for new ideas?</h3>
                  <p className="text-alira-white/70">No. It works whether you are starting, building, or already running something.</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
