import SignatureEngagements from '@/components/SignatureEngagements'
import ServicesDeliverables from '@/components/ServicesDeliverables'
import Reveal from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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
                Our Services
              </h1>
            </Reveal>
            
                         {/* Subheadline */}
             <Reveal delay={250}>
               <p className="text-xl md:text-2xl text-alira-ink/80 max-w-[50ch] mx-auto leading-snug mb-16">
                 Signature engagements designed to cut through complexity and deliver lasting clarity. Each service is crafted to meet you where you are and take you where you want to go.
               </p>
             </Reveal>
          </div>
        </div>
      </section>

      {/* Services Deliverables Section */}
      <ServicesDeliverables />

      {/* Services Grid Section */}
      <section className="py-24 bg-gradient-to-r from-alira-porcelain/20 via-white to-alira-porcelain/20 relative z-[1]">
        <div className="container mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
                             <h2 className="h2 mb-6">
                 Signature Engagements
               </h2>
               
               {/* Gold hairline */}
               <div className="w-16 h-px bg-alira-gold mx-auto mb-6"></div>
               
               <p className="copy text-xl md:text-2xl max-w-[65ch] mx-auto">
                 Four distinct approaches to deliver clarity, structure, and systems that last.
               </p>
            </div>
          </Reveal>
          
                     <Reveal delay={200}>
             <SignatureEngagements />
           </Reveal>
        </div>
      </section>

      {/* Service Philosophy Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                                     <div>
                     <h2 className="h2 mb-6">
                       Clarity Over Complexity
                     </h2>
                     <div className="w-16 h-px bg-alira-gold mb-8"></div>
                   </div>
                   <div className="space-y-6">
                     <p className="copy text-lg leading-relaxed">
                       Every engagement is designed to cut through the noise and deliver actionable clarity. We don't create generic templates — we build systems that endure.
                     </p>
                     <p className="copy text-lg leading-relaxed">
                       Whether you're resetting, scaling, adopting AI, or seeking long-term guidance, the outcome is always the same: lasting clarity and systems that work.
                     </p>
                   </div>
                </div>
                <div className="bg-alira-onyx/5 p-8 rounded-lg border border-alira-onyx/10">
                                   <h3 className="h3 mb-6">
                   Our Approach
                 </h3>
                 <ul className="space-y-4">
                   <li className="flex items-start space-x-4">
                     <span className="text-alira-gold font-bold text-lg">•</span>
                     <span className="copy">Outcome-focused engagements, not time-based billing</span>
                   </li>
                   <li className="flex items-start space-x-4">
                     <span className="text-alira-gold font-bold text-lg">•</span>
                     <span className="copy">Systems that endure beyond the engagement</span>
                   </li>
                   <li className="flex items-start space-x-4">
                     <span className="text-alira-gold font-bold text-lg">•</span>
                     <span className="copy">Clarity as the foundation for all decisions</span>
                   </li>
                   <li className="flex items-start space-x-4">
                     <span className="text-alira-gold font-bold text-lg">•</span>
                     <span className="copy">Elegant solutions to complex problems</span>
                   </li>
                 </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-alira-onyx">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <div className="space-y-12">
                <div className="relative">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    Not Sure Which Service Fits?
                  </h2>
                  <div className="w-20 h-px bg-alira-gold mx-auto"></div>
                </div>
                
                <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                  Complete our intake form and we'll recommend the best approach for your situation, or schedule a call to discuss your options.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <div className="inline-block group">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center px-12 py-5 text-lg font-semibold text-alira-gold border-2 border-alira-gold rounded-full hover:bg-alira-gold hover:text-alira-onyx focus:outline-none focus:ring-4 focus:ring-alira-gold/20 focus:ring-offset-2 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
                    >
                      Start with Intake Form
                      <ArrowRight className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                  <div className="inline-block group">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center px-12 py-5 text-lg font-semibold text-white border-2 border-white rounded-full hover:bg-white hover:text-alira-onyx focus:outline-none focus:ring-4 focus:ring-white/20 focus:ring-offset-2 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
                    >
                      Schedule a Call
                      <ArrowRight className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
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
