import ServicesGrid from '@/components/ServicesGrid'
import Reveal from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Services() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold alira-heading text-alira-onyx mb-6">
              Our Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Four distinct approaches to bring clarity, structure, and lasting systems to your business. Choose the engagement that matches your current needs and ambitions.
            </p>
          </div>
        </Reveal>

        {/* Services Grid */}
        <Reveal delay={200}>
          <ServicesGrid />
        </Reveal>

        {/* Service Philosophy */}
        <section className="mt-24">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold alira-heading text-alira-onyx">
                  Tailored to Your Stage
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Whether you're just starting out or scaling an established business, our services are designed to meet you where you are and take you where you want to go.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Each engagement is built on the same foundation of clarity, discipline, elegance, and systems — but delivered in the format and timeframe that serves your current situation best.
                </p>
              </div>
              <div className="bg-alira-onyx/5 p-8 rounded-lg">
                <h3 className="text-xl font-semibold alira-heading text-alira-onyx mb-4">
                  What Makes Us Different
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start space-x-3">
                    <span className="text-alira-gold font-bold">•</span>
                    <span>No generic templates or one-size-fits-all approaches</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-alira-gold font-bold">•</span>
                    <span>Proven frameworks adapted to your specific context</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-alira-gold font-bold">•</span>
                    <span>Immediate value through structured thinking and planning</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-alira-gold font-bold">•</span>
                    <span>Clear deliverables and measurable outcomes</span>
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
                Not Sure Which Service Fits?
              </h2>
              <p className="text-lg text-muted-foreground">
                Complete our intake form and we'll recommend the best approach for your situation, or schedule a call to discuss your options.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="px-8">
                  <Link href="/contact">
                    Start with Intake Form
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8">
                  <Link href="/contact">
                    Schedule a Call
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  )
}
