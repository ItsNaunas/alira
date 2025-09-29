import Reveal from './Reveal'
import CTAButton from './CTAButton'

const services = [
  {
    title: "Content & Growth",
    price: "From £500",
    duration: "2-4 weeks",
    description: "Content strategy, campaigns, copy, and distribution that drives growth.",
    highlight: "Strategic content + growth systems",
    cta: "Start Content Strategy",
    featured: false,
    features: [
      "Content strategy & planning",
      "Campaign development",
      "Copywriting & messaging",
      "Distribution & growth systems"
    ]
  },
  {
    title: "Systems & Automation",
    price: "From £750",
    duration: "3-6 weeks",
    description: "Internal systems, dashboards, automations, and tooling that scale your operations.",
    highlight: "Automated workflows + efficiency",
    cta: "Build My Systems",
    featured: false,
    features: [
      "Process automation",
      "Dashboard development",
      "Tool integration",
      "Operational efficiency"
    ]
  },
  {
    title: "Complete Growth Package",
    price: "From £1,200",
    duration: "4-8 weeks",
    description: "Full-service growth solution combining content strategy, systems automation, and operational excellence.",
    highlight: "Everything you need to scale",
    cta: "Get Complete Package",
    featured: true,
    features: [
      "Content strategy & campaigns",
      "Systems automation & dashboards",
      "Process optimisation",
      "Growth tracking & analytics",
      "Ongoing support & optimisation"
    ]
  }
]

export default function HomeServices() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-alira-light-gold/20 via-alira-gold/8 to-alira-light-gold/20 dark:from-alira-gold/8 dark:via-alira-onyx dark:to-alira-gold/3 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <div className="text-alira-gold text-sm tracking-wide uppercase mb-4 font-sans font-medium">
              What We Offer
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-6">
              Choose Your Service
            </h2>
            <p className="text-xl text-alira-onyx dark:text-alira-porcelain/70 max-w-2xl mx-auto mb-8 font-serif italic font-light">
              From quick guidance to hands-on partnership. Every option delivers clear outcomes.
            </p>
            <div className="w-16 h-px bg-alira-gold mx-auto"></div>
          </div>
        </Reveal>
        
        {/* Services Grid - Three Services */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
          {/* Content & Growth */}
          <Reveal delay={200}>
            <div className="bg-white dark:bg-alira-onyx p-6 rounded-xl border border-alira-onyx/10 dark:border-alira-porcelain/10 hover:border-alira-gold/30 hover:shadow-xl hover:shadow-alira-gold/10 hover:-translate-y-1 transition-all duration-500 text-center flex flex-col h-full relative overflow-hidden group">
              {/* Subtle inner glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-alira-gold/5 via-transparent to-alira-gold/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="mb-4">
                  <h4 className="text-xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-3">{services[0].title}</h4>
                  <span className="bg-alira-gold text-white px-3 py-1 rounded-full text-sm font-sans font-medium">
                    {services[0].price}
                  </span>
                </div>
                <h5 className="font-serif font-semibold text-alira-onyx dark:text-alira-porcelain mb-3">{services[0].highlight}</h5>
                <p className="text-alira-onyx dark:text-alira-porcelain/80 mb-4 text-sm flex-grow font-sans">{services[0].description}</p>
                
                {/* Features List */}
                <div className="mb-4">
                  <ul className="text-left space-y-1">
                    {services[0].features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-xs text-alira-onyx dark:text-alira-porcelain/80">
                        <span className="text-alira-gold font-serif font-bold">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-auto">
                  <p className="text-alira-onyx dark:text-alira-porcelain/60 text-xs mb-4">{services[0].duration}</p>
                  <CTAButton 
                    href="#start-form" 
                    variant="aliraOutline"
                    className="w-full py-2 text-sm"
                  >
                    {services[0].cta}
                  </CTAButton>
                </div>
              </div>
            </Reveal>

          {/* Systems & Automation */}
          <Reveal delay={300}>
            <div className="bg-white dark:bg-alira-onyx p-6 rounded-xl border border-alira-onyx/10 dark:border-alira-porcelain/10 hover:border-alira-gold/30 hover:shadow-xl hover:shadow-alira-gold/10 hover:-translate-y-1 transition-all duration-500 text-center flex flex-col h-full relative overflow-hidden group">
              {/* Subtle inner glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-alira-gold/5 via-transparent to-alira-gold/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="mb-4">
                  <h4 className="text-xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-3">{services[1].title}</h4>
                  <span className="bg-alira-gold text-white px-3 py-1 rounded-full text-sm font-sans font-medium">
                    {services[1].price}
                  </span>
                </div>
                <h5 className="font-serif font-semibold text-alira-onyx dark:text-alira-porcelain mb-3">{services[1].highlight}</h5>
                <p className="text-alira-onyx dark:text-alira-porcelain/80 mb-4 text-sm flex-grow font-sans">{services[1].description}</p>
                
                {/* Features List */}
                <div className="mb-4">
                  <ul className="text-left space-y-1">
                    {services[1].features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-xs text-alira-onyx dark:text-alira-porcelain/80">
                        <span className="text-alira-gold font-serif font-bold">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-auto">
                  <p className="text-alira-onyx dark:text-alira-porcelain/60 text-xs mb-4">{services[1].duration}</p>
                  <CTAButton 
                    href="#start-form" 
                    variant="aliraOutline"
                    className="w-full py-2 text-sm"
                  >
                    {services[1].cta}
                  </CTAButton>
                </div>
              </div>
            </Reveal>

          {/* Complete Growth Package - Featured */}
          <Reveal delay={400}>
            <div className="bg-gradient-to-br from-alira-gold/12 to-white p-6 pt-10 rounded-xl border-2 border-alira-gold/50 shadow-xl hover:shadow-2xl hover:shadow-alira-gold/20 transition-all duration-500 transform hover:-translate-y-2 relative text-center flex flex-col h-full group">
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-alira-gold/8 via-alira-gold-light/5 to-alira-gold/6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-alira-gold text-white px-4 py-1 rounded-full text-xs font-serif font-bold">
                    MOST POPULAR
                  </span>
                </div>
                <div className="mb-4">
                  <h4 className="text-xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-3">{services[2].title}</h4>
                  <span className="bg-alira-gold text-white px-3 py-1 rounded-full text-sm font-sans font-medium">
                    {services[2].price}
                  </span>
                </div>
                <h5 className="font-serif font-semibold text-alira-onyx dark:text-alira-porcelain mb-3">{services[2].highlight}</h5>
                <p className="text-alira-onyx dark:text-alira-porcelain/80 mb-4 text-sm flex-grow font-sans">{services[2].description}</p>
                
                {/* Features List */}
                <div className="mb-4">
                  <ul className="text-left space-y-1">
                    {services[2].features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-xs text-alira-onyx dark:text-alira-porcelain/80">
                        <span className="text-alira-gold font-serif font-bold">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-auto">
                  <p className="text-alira-onyx dark:text-alira-porcelain/60 text-xs mb-4">{services[2].duration}</p>
                  <CTAButton 
                    href="#start-form" 
                    variant="alira"
                    className="w-full py-2 text-sm"
                  >
                    {services[2].cta}
                  </CTAButton>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* View All Services CTA */}
        <Reveal delay={600}>
          <div className="text-center mt-12">
            <CTAButton 
              href="/services" 
              variant="alira"
              className="px-8 py-4 text-lg font-sans font-medium"
            >
              View All Services
            </CTAButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
