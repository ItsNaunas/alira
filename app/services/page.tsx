import SignatureEngagements from '@/components/SignatureEngagements'
import CTAButton from '@/components/CTAButton'
import { CTA_VARIANTS } from '@/components/CTAButton'

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-alira-porcelain/20 via-white to-alira-porcelain/20">
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-alira-onyx mb-6">
              Our Signature Engagements
            </h1>
            <p className="text-xl lg:text-2xl text-alira-onyx/70 mb-12 leading-relaxed">
              Tailored solutions for every stage of your business journey
            </p>
            
            {/* A/B Testing CTA */}
            <CTAButton 
              href="/form"
              variant="alira"
              testVariants={[CTA_VARIANTS.DEFAULT, CTA_VARIANTS.SPEED]}
              testKey="services-hero"
              className="mb-8"
            />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <SignatureEngagements />

      {/* Final CTA Section */}
      <section className="py-20 bg-alira-onyx">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              Get your customized business case and start your journey to clarity today
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <CTAButton 
                href="/form"
                variant="aliraOutline"
                testVariants={[CTA_VARIANTS.DEFAULT, CTA_VARIANTS.BRAND]}
                testKey="services-final"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
