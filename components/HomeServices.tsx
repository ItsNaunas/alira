import Reveal from './Reveal'
import CTAButton from './CTAButton'

const services = [
  {
    title: "Quick Chat",
    price: "Free",
    duration: "15 minutes",
    description: "A short call to point you in the right direction.",
    highlight: "One clear next step",
    cta: "Start Free Chat",
    featured: false
  },
  {
    title: "Clarity Session",
    price: "£150+",
    duration: "90 minutes",
    description: "Cut the noise and get clear direction.",
    highlight: "One-page plan + priorities",
    cta: "Get Clarity Now",
    featured: true
  },
  {
    title: "Idea to Action",
    price: "£950+",
    duration: "2-3 weeks",
    description: "Turn your idea into something real.",
    highlight: "Clear offer + test + 90-day path",
    cta: "Turn Idea Into Action",
    featured: false
  },
  {
    title: "Operational Reset",
    price: "£1,500+",
    duration: "30 days",
    description: "Clear bottlenecks and get momentum back.",
    highlight: "Work flow + key changes + rhythm",
    cta: "Start Your Reset",
    featured: false
  },
  {
    title: "Build With Us",
    price: "£2,000+",
    duration: "Ongoing",
    description: "Hands-on partnership to build and launch.",
    highlight: "Working tools + clear delivery + support",
    cta: "Build With Us Today",
    featured: false
  }
]

export default function HomeServices() {
  return (
    <section className="py-24 bg-alira-porcelain/40">
      <div className="container mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <div className="text-alira-gold text-sm tracking-wide uppercase mb-4 font-medium">
              What We Offer
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-alira-onyx mb-6">
              Choose Your Service
            </h2>
            <p className="text-xl text-alira-onyx/70 max-w-2xl mx-auto mb-8">
              From quick guidance to hands-on partnership. Every option delivers clear outcomes.
            </p>
            <div className="w-16 h-px bg-alira-gold mx-auto"></div>
          </div>
        </Reveal>
        
        {/* Enhanced Services Layout */}
        <div className="max-w-6xl mx-auto">
          
          {/* Decision Helper */}
          <Reveal>
            <div className="bg-alira-onyx/5 p-6 rounded-lg border border-alira-onyx/10 mb-8 text-center">
              <h3 className="text-lg font-bold text-alira-onyx mb-4">Which service is right for you?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-alira-gold font-bold">•</span>
                  <span><strong>Just exploring?</strong> → Quick Chat</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-alira-gold font-bold">•</span>
                  <span><strong>Need direction now?</strong> → Clarity Session</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-alira-gold font-bold">•</span>
                  <span><strong>Ready to build?</strong> → Build With Us</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Recommended Pathway */}
          <Reveal delay={100}>
            <div className="bg-gradient-to-r from-alira-gold/10 to-alira-porcelain/20 p-4 rounded-lg border border-alira-gold/20 mb-8">
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-alira-onyx/80">Most people start with</span>
                <span className="font-bold text-alira-gold">Clarity Session</span>
                <span className="text-alira-onyx/60">→</span>
                <span className="font-bold text-alira-gold">Idea to Action</span>
                <span className="text-alira-onyx/60">→</span>
                <span className="font-bold text-alira-gold">Build With Us</span>
              </div>
            </div>
          </Reveal>

          {/* Services Grid - Better Layout */}
          <div className="space-y-8">
            
            {/* Top Row - Quick Wins (2 services) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Quick Chat - Free */}
              <Reveal delay={200}>
                <div className="bg-white p-6 rounded-lg border border-alira-onyx/10 hover:border-alira-gold/20 hover:shadow-lg transition-all duration-300 text-center">
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-alira-onyx mb-2">{services[0].title}</h4>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {services[0].price}
                    </span>
                  </div>
                  <h5 className="font-bold text-alira-onyx mb-2">Walk away with 1 clear next step</h5>
                  <p className="text-alira-onyx/80 mb-3 text-sm">{services[0].description}</p>
                  <p className="text-alira-onyx/60 text-xs mb-4">{services[0].duration}</p>
                  <CTAButton 
                    href="/contact" 
                    variant="aliraOutline"
                    className="w-full text-sm py-2"
                  >
                    Book Free Call
                  </CTAButton>
                </div>
              </Reveal>

              {/* Clarity Session - Featured & Dominant */}
              <Reveal delay={300}>
                <div className="bg-gradient-to-br from-alira-gold/12 to-white p-8 rounded-xl border-2 border-alira-gold/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative text-center">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-alira-gold text-white px-4 py-1 rounded-full text-xs font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-alira-onyx mb-2">{services[1].title}</h4>
                    <span className="bg-alira-gold text-white px-3 py-1 rounded-full text-sm font-medium">
                      From £150
                    </span>
                  </div>
                  <h5 className="font-bold text-alira-onyx mb-2">Get your one-page plan + 3 priorities</h5>
                  <p className="text-alira-onyx/80 mb-3 text-sm">{services[1].description}</p>
                  <p className="text-alira-onyx/60 text-xs mb-4">Price confirmed before booking</p>
                  <CTAButton 
                    href="/contact" 
                    variant="alira"
                    className="w-full text-sm py-2"
                  >
                    Get My Plan
                  </CTAButton>
                </div>
              </Reveal>
            </div>

            {/* Bottom Row - Deep Work (3 services) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Idea to Action */}
              <Reveal delay={400}>
                <div className="bg-white p-6 rounded-lg border border-alira-onyx/10 hover:border-alira-gold/20 hover:shadow-lg transition-all duration-300 text-center">
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-alira-onyx mb-2">{services[2].title}</h4>
                    <span className="bg-alira-gold text-white px-3 py-1 rounded-full text-sm font-medium">
                      From £950
                    </span>
                  </div>
                  <h5 className="font-bold text-alira-onyx mb-2">Turn your idea into a real test</h5>
                  <p className="text-alira-onyx/80 mb-3 text-sm">{services[2].description}</p>
                  <p className="text-alira-onyx/60 text-xs mb-4">Price confirmed before booking</p>
                  <CTAButton 
                    href="/contact" 
                    variant="aliraOutline"
                    className="w-full text-sm py-2"
                  >
                    Start My Journey
                  </CTAButton>
                </div>
              </Reveal>

              {/* Operational Reset */}
              <Reveal delay={500}>
                <div className="bg-white p-6 rounded-lg border border-alira-onyx/10 hover:border-alira-gold/20 hover:shadow-lg transition-all duration-300 text-center">
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-alira-onyx mb-2">{services[3].title}</h4>
                    <span className="bg-alira-gold text-white px-3 py-1 rounded-full text-sm font-medium">
                      From £1,500
                    </span>
                  </div>
                  <h5 className="font-bold text-alira-onyx mb-2">Reset your workflow in 30 days</h5>
                  <p className="text-alira-onyx/80 mb-3 text-sm">{services[3].description}</p>
                  <p className="text-alira-onyx/60 text-xs mb-4">Price confirmed before booking</p>
                  <CTAButton 
                    href="/contact" 
                    variant="aliraOutline"
                    className="w-full text-sm py-2"
                  >
                    Reset My Business
                  </CTAButton>
                </div>
              </Reveal>

              {/* Build With Us */}
              <Reveal delay={600}>
                <div className="bg-white p-6 rounded-lg border border-alira-onyx/10 hover:border-alira-gold/20 hover:shadow-lg transition-all duration-300 text-center">
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-alira-onyx mb-2">{services[4].title}</h4>
                    <span className="bg-alira-gold text-white px-3 py-1 rounded-full text-sm font-medium">
                      From £2,000
                    </span>
                  </div>
                  <h5 className="font-bold text-alira-onyx mb-2">Build and launch with hands-on support</h5>
                  <p className="text-alira-onyx/80 mb-3 text-sm">{services[4].description}</p>
                  <p className="text-alira-onyx/60 text-xs mb-4">Price confirmed before booking</p>
                  <CTAButton 
                    href="/contact" 
                    variant="aliraOutline"
                    className="w-full text-sm py-2"
                  >
                    Partner With Us
                  </CTAButton>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* View All Services CTA */}
        <Reveal delay={600}>
          <div className="text-center mt-12">
            <CTAButton 
              href="/services" 
              variant="alira"
              className="px-8 py-4 text-lg font-medium"
            >
              View All Services
            </CTAButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
