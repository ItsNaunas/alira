import HowItWorksSteps from '@/components/HowItWorksSteps'
import Reveal from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HowItWorks() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="min-h-screen flex items-center justify-center bg-alira-porcelain relative overflow-hidden"
        aria-labelledby="how-it-works-heading"
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
                id="alira-grid-how-it-works"
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
              fill="url(#alira-grid-how-it-works)"
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
              <h1 id="how-it-works-heading" className="text-5xl md:text-7xl font-bold text-alira-onyx leading-[0.95] tracking-tight mb-8">
                How It Works
              </h1>
            </Reveal>
            
                         {/* Subheadline */}
             <Reveal delay={250}>
               <p className="text-xl md:text-2xl text-alira-ink/80 max-w-[50ch] mx-auto leading-snug mb-16">
                 Our streamlined process transforms your business challenges into actionable strategic documents in three simple steps.
               </p>
             </Reveal>
             
             {/* CTA Button */}
             <Reveal delay={300}>
               <div className="inline-block group">
                                 <Link
                  href="/form"
                  className="inline-flex items-center justify-center px-12 py-5 text-lg font-semibold text-white bg-alira-onyx rounded-full hover:bg-alira-onyx/90 focus:outline-none focus:ring-4 focus:ring-alira-gold/20 focus:ring-offset-2 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl border-2 border-alira-onyx hover:border-alira-gold"
                >
                  Start Your Business Case
                  <ArrowRight className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
               </div>
             </Reveal>
           </div>
         </div>
       </section>

      {/* Process Steps Section */}
      <section className="py-24 bg-gradient-to-r from-alira-porcelain/20 via-white to-alira-porcelain/20 relative z-[1]">
        <div className="container mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="h2 mb-6">
                The Process
              </h2>
              
              {/* Gold hairline */}
              <div className="w-16 h-px bg-alira-gold mx-auto mb-6"></div>
              
              <p className="copy text-xl md:text-2xl max-w-[65ch] mx-auto">
                From enquiry to structured business case in three clear steps.
              </p>
            </div>
          </Reveal>
          
          <Reveal delay={200}>
            <HowItWorksSteps />
          </Reveal>
        </div>
      </section>

      {/* Detailed Explanation Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div>
                    <h2 className="h2 mb-6">
                      From Form to Framework
                    </h2>
                    <div className="w-16 h-px bg-alira-gold mb-8"></div>
                  </div>
                  <div className="space-y-6">
                    <p className="copy text-lg leading-relaxed">
                      Every business case we generate is built on proven strategic frameworks, tailored to your specific industry, stage, and challenges. No generic templates — just sharp, actionable insights.
                    </p>
                    <p className="copy text-lg leading-relaxed">
                      Our engine processes your information through multiple lenses: market analysis, competitive positioning, resource optimization, and growth potential. The result is a document that speaks directly to your situation.
                    </p>
                  </div>
                </div>
                <div className="bg-alira-onyx/5 p-8 rounded-lg border border-alira-onyx/10">
                  <h3 className="h3 mb-6">
                    What You Get
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-4">
                      <span className="text-alira-gold font-bold text-lg">•</span>
                      <span className="copy">Comprehensive problem statement and objectives</span>
                    </li>
                    <li className="flex items-start space-x-4">
                      <span className="text-alira-gold font-bold text-lg">•</span>
                      <span className="copy">Strategic recommendations based on your service choice</span>
                    </li>
                    <li className="flex items-start space-x-4">
                      <span className="text-alira-gold font-bold text-lg">•</span>
                      <span className="copy">Expected outcomes and success metrics</span>
                    </li>
                    <li className="flex items-start space-x-4">
                      <span className="text-alira-gold font-bold text-lg">•</span>
                      <span className="copy">Clear next steps and implementation roadmap</span>
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
                    Ready to See It in Action?
                  </h2>
                  <div className="w-20 h-px bg-alira-gold mx-auto"></div>
                </div>
                
                <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                  Complete our intake form and receive your personalized Draft Business Case within minutes.
                </p>
                
                <div className="inline-block group">
                                  <Link
                  href="/form"
                  className="inline-flex items-center justify-center px-12 py-5 text-lg font-semibold text-alira-gold border-2 border-alira-gold rounded-full hover:bg-alira-gold hover:text-alira-onyx focus:outline-none focus:ring-4 focus:ring-alira-gold/20 focus:ring-offset-2 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  Generate Your Business Case
                  <ArrowRight className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
