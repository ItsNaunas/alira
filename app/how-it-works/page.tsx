import HowItWorksSteps from '@/components/HowItWorksSteps'
import Reveal from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HowItWorks() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold alira-heading text-alira-onyx mb-6">
              How It Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our streamlined process transforms your business challenges into actionable strategic documents in three simple steps.
            </p>
          </div>
        </Reveal>

        {/* Process Steps */}
        <Reveal delay={200}>
          <HowItWorksSteps />
        </Reveal>

        {/* Detailed Explanation */}
        <section className="mt-24">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold alira-heading text-alira-onyx">
                  From Form to Framework
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Every business case we generate is built on proven strategic frameworks, tailored to your specific industry, stage, and challenges. No generic templates — just sharp, actionable insights.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our engine processes your information through multiple lenses: market analysis, competitive positioning, resource optimization, and growth potential. The result is a document that speaks directly to your situation.
                </p>
              </div>
              <div className="bg-alira-onyx/5 p-8 rounded-lg">
                <h3 className="text-xl font-semibold alira-heading text-alira-onyx mb-4">
                  What You Get
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start space-x-3">
                    <span className="text-alira-gold font-bold">•</span>
                    <span>Comprehensive problem statement and objectives</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-alira-gold font-bold">•</span>
                    <span>Strategic recommendations based on your service choice</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-alira-gold font-bold">•</span>
                    <span>Expected outcomes and success metrics</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-alira-gold font-bold">•</span>
                    <span>Clear next steps and implementation roadmap</span>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        {/* CTA Section */}
        <section className="mt-24 text-center">
          <Reveal>
            <div className="max-w-2xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold alira-heading text-alira-onyx">
                Ready to See It in Action?
              </h2>
              <p className="text-lg text-muted-foreground">
                Complete our intake form and receive your personalized Draft Business Case within minutes.
              </p>
              <Button asChild size="lg" className="px-8">
                <Link href="/contact">
                  Generate Your Business Case
                </Link>
              </Button>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  )
}
