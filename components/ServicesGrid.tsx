import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { services } from '@/lib/schema'
import { Settings, Target, Zap, Users } from 'lucide-react'

const serviceDetails = {
  'Business Reset': {
    icon: Settings,
    tagline: 'Rebuild order from chaos.',
    outcome: 'Clarity report + rebuilt operational system within 10 days.',
    duration: '10 days'
  },
  'Growth Blueprint': {
    icon: Target,
    tagline: 'Turn ambition into strategy.',
    outcome: 'Credible, investor-ready strategy with measurable milestones in 3–6 weeks.',
    duration: '3–6 weeks'
  },
  'AI Advantage': {
    icon: Zap,
    tagline: 'Make systems smarter and leaner.',
    outcome: 'AI integration plan + leaner workflows delivered in under 8 weeks.',
    duration: 'Under 8 weeks'
  },
  'Strategic Partner': {
    icon: Users,
    tagline: 'Clarity counsel for leaders.',
    outcome: 'Ongoing clarity counsel, leadership support, and structured oversight.',
    duration: 'Ongoing'
  },
}

export default function ServicesGrid() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Staggered Layout */}
      <div className="space-y-16">
        {services.map((service, index) => {
          const details = serviceDetails[service.label as keyof typeof serviceDetails]
          const IconComponent = details.icon
          const isEven = index % 2 === 0
          
          return (
            <div key={service.value} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
              {/* Content Side */}
              <div className={`flex-1 ${isEven ? 'lg:pr-12' : 'lg:pl-12'}`}>
                <Card className="border-alira-onyx/10 hover:border-alira-gold/30 transition-all duration-500 hover:shadow-xl group bg-white/50 hover:bg-alira-porcelain/80">
                  <CardHeader className="pb-8">
                    <div className="space-y-6">
                      {/* Icon */}
                      <div className="w-16 h-16 bg-alira-gold/10 rounded-full flex items-center justify-center group-hover:bg-alira-gold/20 transition-colors duration-300">
                        <IconComponent className="w-8 h-8 text-alira-gold" />
                      </div>
                      
                      {/* Title and Tagline */}
                      <div className="space-y-3">
                        <CardTitle className="text-3xl alira-heading group-hover:text-alira-gold transition-colors duration-300">
                          {service.label}
                        </CardTitle>
                        <p className="text-lg text-alira-gold font-medium italic">
                          {details.tagline}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Outcome */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-alira-onyx/60 uppercase tracking-wide">
                        What You Get
                      </h4>
                      <p className="text-lg text-alira-onyx leading-relaxed">
                        {details.outcome}
                      </p>
                    </div>
                    
                    {/* Duration */}
                    <div className="pt-4 border-t border-alira-onyx/10">
                      <p className="text-sm text-alira-onyx/50">
                        Duration: {details.duration}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Visual Side */}
              <div className="flex-1">
                <div className="bg-alira-onyx/5 p-12 rounded-lg border border-alira-onyx/10 h-full flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-alira-gold/10 rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="w-12 h-12 text-alira-gold" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-alira-onyx">
                        {service.label}
                      </h3>
                      <p className="text-alira-onyx/70 max-w-sm">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Why ALIRA Services Section */}
      <div className="mt-24 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h3 className="text-2xl font-semibold text-alira-onyx">
            Why ALIRA Services?
          </h3>
          <p className="text-lg text-alira-onyx/70 leading-relaxed">
            Every engagement is designed to cut through complexity and leave you with <em className="text-alira-gold font-medium">lasting clarity</em>. Whether you're resetting, scaling, adopting AI, or seeking long-term guidance - the outcome is always systems that endure.
          </p>
        </div>
      </div>
    </div>
  )
}
