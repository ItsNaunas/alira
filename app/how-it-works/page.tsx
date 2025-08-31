import ProcessDiagram from '@/components/ProcessDiagram'
import CTAButton from '@/components/CTAButton'

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-alira-porcelain/20 via-white to-alira-porcelain/20">
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-alira-onyx mb-6">
              How It Works
            </h1>
            <p className="text-xl lg:text-2xl text-alira-onyx/70 mb-12 leading-relaxed">
              From enquiry to actionable business case in three streamlined steps
            </p>
            
            <CTAButton 
              href="/form"
              variant="alira"
              className="mb-8"
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-alira-onyx mb-4">
              Our Streamlined Process
            </h2>
            <p className="text-xl text-alira-onyx/70 max-w-3xl mx-auto">
              Experience the power of instant clarity with our proven methodology
            </p>
          </div>
          <ProcessDiagram />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-alira-onyx">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              See your business case preview in minutes, then get the complete version delivered to your inbox
            </p>
            
            <CTAButton 
              href="/form"
              variant="aliraOutline"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
