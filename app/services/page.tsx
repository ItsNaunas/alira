import SignatureEngagements from '@/components/SignatureEngagements'
import ServicesDeliverables from '@/components/ServicesDeliverables'
import Reveal from '@/components/Reveal'
import CTAButton from '@/components/CTAButton'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

export default function Services() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="min-h-screen flex items-center justify-center bg-alira-porcelain relative overflow-hidden"
        aria-labelledby="services-heading"
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
                id="alira-grid-services"
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
              fill="url(#alira-grid-services)"
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
              <h1 id="services-heading" className="text-5xl md:text-7xl font-bold text-alira-onyx leading-[0.95] tracking-tight mb-8">
                Pick your path
              </h1>
            </Reveal>
            
            {/* Subheadline */}
            <Reveal delay={250}>
              <p className="text-xl md:text-2xl text-alira-ink/80 max-w-[50ch] mx-auto leading-snug mb-8">
                Every option starts with a clear outcome and simple deliverables. Choose what matches where you are right now.
              </p>
            </Reveal>
            
            {/* CTA Button */}
            <Reveal delay={300}>
              <div className="mt-6 flex justify-center">
                <CTAButton 
                  href="/form" 
                  variant="alira"
                  className="px-6 py-3 text-sm font-medium tracking-tight"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-16">
              
              {/* Quick Chat - Free */}
              <Reveal>
                <div className="bg-gradient-to-r from-alira-porcelain/30 to-white p-8 rounded-2xl border border-alira-onyx/10">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold text-alira-onyx">Quick Chat — Free</h3>
                        <span className="bg-alira-gold text-white px-3 py-1 rounded-full text-sm font-medium">Free</span>
                      </div>
                      <p className="text-lg text-alira-onyx/80 mb-4">
                        A short 15-minute call to point you in the right direction.
                      </p>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-alira-onyx mb-2">What you leave with:</h4>
                          <p className="text-alira-onyx/70">One clear next step.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-alira-onyx mb-2">Best for:</h4>
                          <p className="text-alira-onyx/70">If you are unsure where to start.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-alira-onyx mb-2">Price note:</h4>
                          <p className="text-alira-onyx/70">Free. No payment or commitment required.</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center lg:text-right">
                      <CTAButton 
                        href="/contact" 
                        variant="aliraOutline"
                        className="w-full lg:w-auto"
                      >
                        Start Free Chat
                      </CTAButton>
                      <p className="text-sm text-alira-onyx/60 mt-2">Book your 15-minute call today</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Clarity Session - £150 */}
              <Reveal delay={200}>
                <div className="bg-white p-8 rounded-2xl border-2 border-alira-gold/20 shadow-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold text-alira-onyx">Clarity Session — starting from £150</h3>
                        <span className="bg-alira-gold text-white px-3 py-1 rounded-full text-sm font-medium">£150+</span>
                      </div>
                      <p className="text-lg text-alira-onyx/80 mb-4">
                        A focused 90-minute session to cut the noise and give you direction.
                      </p>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-alira-onyx mb-2">What you leave with:</h4>
                          <ul className="text-alira-onyx/70 space-y-1">
                            <li>• A one-page plan</li>
                            <li>• Your top priorities</li>
                            <li>• Three actions you can start this week</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-alira-onyx mb-2">Best for:</h4>
                          <p className="text-alira-onyx/70">If you feel stuck and need clear direction right now.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-alira-onyx mb-2">Price note:</h4>
                          <p className="text-alira-onyx/70">Starting from £150. Final price is confirmed before you book — no surprises.</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center lg:text-right">
                      <CTAButton 
                        href="/contact" 
                        variant="alira"
                        className="w-full lg:w-auto"
                      >
                        Get Clarity Now
                      </CTAButton>
                      <p className="text-sm text-alira-onyx/60 mt-2">Book your 90-minute session today</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Idea to Action - £950 */}
              <Reveal delay={300}>
                <div className="bg-gradient-to-r from-alira-porcelain/20 to-white p-8 rounded-2xl border border-alira-onyx/10">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold text-alira-onyx">Idea to Action — starting from £950</h3>
                        <span className="bg-alira-gold text-white px-3 py-1 rounded-full text-sm font-medium">£950+</span>
                      </div>
                      <p className="text-lg text-alira-onyx/80 mb-4">
                        A guided 2–3 week journey to turn your idea into something real.
                      </p>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-alira-onyx mb-2">What you leave with:</h4>
                          <ul className="text-alira-onyx/70 space-y-1">
                            <li>• A clear offer people understand</li>
                            <li>• A simple test you can run</li>
                            <li>• A 90-day path to build from</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-alira-onyx mb-2">Best for:</h4>
                          <p className="text-alira-onyx/70">If you have an idea and want proof it can work.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-alira-onyx mb-2">Price note:</h4>
                          <p className="text-alira-onyx/70">Starting from £950. Final price is confirmed before you book — no surprises.</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center lg:text-right">
                      <CTAButton 
                        href="/contact" 
                        variant="aliraOutline"
                        className="w-full lg:w-auto"
                      >
                        Turn Idea Into Action
                      </CTAButton>
                      <p className="text-sm text-alira-onyx/60 mt-2">Begin your 2–3 week guided journey</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Operational Reset - £1,500 */}
              <Reveal delay={400}>
                <div className="bg-white p-8 rounded-2xl border border-alira-onyx/10">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold text-alira-onyx">Operational Reset — starting from £1,500</h3>
                        <span className="bg-alira-gold text-white px-3 py-1 rounded-full text-sm font-medium">£1,500+</span>
                      </div>
                      <p className="text-lg text-alira-onyx/80 mb-4">
                        A 30-day reset to clear bottlenecks, simplify processes, and get momentum back.
                      </p>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-alira-onyx mb-2">What you leave with:</h4>
                          <ul className="text-alira-onyx/70 space-y-1">
                            <li>• One-page view of how your work flows</li>
                            <li>• Three key changes that unlock speed</li>
                            <li>• A weekly rhythm that keeps you moving</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-alira-onyx mb-2">Best for:</h4>
                          <p className="text-alira-onyx/70">If you are already running something but feel stuck.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-alira-onyx mb-2">Price note:</h4>
                          <p className="text-alira-onyx/70">Starting from £1,500. Final price is confirmed before you book — no surprises.</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center lg:text-right">
                      <CTAButton 
                        href="/contact" 
                        variant="aliraOutline"
                        className="w-full lg:w-auto"
                      >
                        Start Your Reset
                      </CTAButton>
                      <p className="text-sm text-alira-onyx/60 mt-2">Begin your 30-day reset programme</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Build With Us - £2,000 */}
              <Reveal delay={500}>
                <div className="bg-gradient-to-r from-alira-onyx/5 to-alira-porcelain/20 p-8 rounded-2xl border-2 border-alira-gold/30 shadow-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold text-alira-onyx">Build With Us — starting from £2,000</h3>
                        <span className="bg-alira-gold text-white px-3 py-1 rounded-full text-sm font-medium">£2,000+</span>
                      </div>
                      <p className="text-lg text-alira-onyx/80 mb-4">
                        Hands-on partnership to build and launch with you.
                      </p>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-alira-onyx mb-2">What you leave with:</h4>
                          <ul className="text-alira-onyx/70 space-y-1">
                            <li>• Working tools in place</li>
                            <li>• A clear way to sell or deliver</li>
                            <li>• Support through your first launch or reset</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-alira-onyx mb-2">Best for:</h4>
                          <p className="text-alira-onyx/70">If you are ready to grow quickly and need more than advice.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-alira-onyx mb-2">Price note:</h4>
                          <p className="text-alira-onyx/70">Starting from £2,000. Final price is confirmed before you book — no surprises.</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center lg:text-right">
                      <CTAButton 
                        href="/contact" 
                        variant="alira"
                        className="w-full lg:w-auto"
                      >
                        Build With Us Today
                      </CTAButton>
                      <p className="text-sm text-alira-onyx/60 mt-2">Discuss your project with our team</p>
                    </div>
                  </div>
                </div>
              </Reveal>

            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-r from-alira-porcelain/20 via-white to-alira-porcelain/20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-alira-onyx mb-6">
                  FAQ
                </h2>
                <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
              </div>
            </Reveal>

            <div className="space-y-8">
              <Reveal delay={200}>
                <div className="bg-white p-6 rounded-lg border border-alira-onyx/10">
                  <h3 className="text-xl font-semibold text-alira-onyx mb-3">How fast can I start?</h3>
                  <p className="text-alira-onyx/70">Most sessions can begin within a few days.</p>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="bg-white p-6 rounded-lg border border-alira-onyx/10">
                  <h3 className="text-xl font-semibold text-alira-onyx mb-3">How does pricing work?</h3>
                  <p className="text-alira-onyx/70">Each service has a starting price. The final cost depends on the scope of work. You will always know the price before we begin.</p>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <div className="bg-white p-6 rounded-lg border border-alira-onyx/10">
                  <h3 className="text-xl font-semibold text-alira-onyx mb-3">Do I need to prepare anything?</h3>
                  <p className="text-alira-onyx/70">No heavy prep. Just be ready to share where you are stuck or what you want to achieve.</p>
                </div>
              </Reveal>

              <Reveal delay={500}>
                <div className="bg-white p-6 rounded-lg border border-alira-onyx/10">
                  <h3 className="text-xl font-semibold text-alira-onyx mb-3">Is this only for new ideas?</h3>
                  <p className="text-alira-onyx/70">No. It works whether you are starting, building, or already running something.</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-20 bg-alira-onyx">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <Reveal>
              <div className="space-y-12">
                <div className="relative">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    Choose your path and let's get started.
                  </h2>
                  <div className="w-20 h-px bg-alira-gold mx-auto"></div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <CTAButton 
                    href="/contact" 
                    variant="aliraOutline"
                    className="px-8 py-4 text-lg font-medium"
                  >
                    Take the Next Step
                  </CTAButton>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
