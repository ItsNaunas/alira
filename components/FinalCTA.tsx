import Reveal from './Reveal'
import CTAButton from './CTAButton'

export default function FinalCTA() {
  return (
    <section className="py-24 bg-alira-onyx">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <div className="space-y-12">
              <div className="relative">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Your clarity starts in minutes.
                </h2>
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  Every enquiry is the start of clarity. Start yours today.
                </p>
                <div className="w-20 h-px bg-alira-gold mx-auto mb-8"></div>
              </div>
              
              <div className="space-y-4">
                <CTAButton 
                  href="/form" 
                  variant="aliraOutline"
                />
                <p className="text-sm text-white/70">
                  No credit card • Completely free • Delivered in minutes • Private & secure
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
