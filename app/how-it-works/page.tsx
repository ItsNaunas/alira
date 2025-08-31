import Reveal from '@/components/Reveal'
import ProcessDiagram from '@/components/ProcessDiagram'
import CTAButton from '@/components/CTAButton'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-gradient-to-r from-alira-porcelain/20 via-white to-alira-porcelain/20 relative z-[1]">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <h1 className="text-5xl md:text-7xl font-bold text-alira-onyx leading-[0.95] tracking-tight mb-8">
                How It Works
              </h1>
            </Reveal>
            
            <Reveal delay={100}>
              <p className="text-xl md:text-2xl text-alira-ink/80 max-w-[60ch] mx-auto leading-snug mb-16">
                From enquiry to structured business case in three clear steps. No complexity, no confusion - just clarity and action.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Process Section */}
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
            <ProcessDiagram />
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
                      Every business case we generate is built on proven strategic frameworks, tailored to your specific industry, stage, and challenges. No generic templates - just sharp, actionable insights.
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
                  <CTAButton 
                    href="/form" 
                    variant="aliraOutline"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
