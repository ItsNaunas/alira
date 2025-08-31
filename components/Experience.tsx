import Reveal from './Reveal'
import { TrendingUp, Users, Target, DollarSign, Calendar, Award, Building, Shield } from 'lucide-react'

const experiences = [
  {
    period: "2015–2019",
    title: "Operations & Process Leadership",
    context: "Large organizations",
    description: "Built foundation in operational excellence, process improvement, and team leadership across complex organizational environments.",
    results: [
      { metric: "1,000+", label: "staff trained", icon: Users },
      { metric: "12", label: "direct reports", icon: Target },
      { metric: "100%", label: "compliance maintained", icon: Shield }
    ]
  },
  {
    period: "2019–2022", 
    title: "Programme & Training Leadership",
    context: "Quality improvement & transformation",
    description: "Led large-scale training programmes and transformation initiatives, achieving significant cost savings and operational improvements.",
    results: [
      { metric: "£11,000", label: "cost reduction", icon: DollarSign },
      { metric: "200+", label: "attendees per event", icon: Users },
      { metric: "25%", label: "sign-up increase", icon: TrendingUp }
    ]
  },
  {
    period: "2022–2025",
    title: "Transformation Leadership", 
    context: "Enterprise transformation",
    description: "Delivered enterprise-wide transformation programmes focused on efficiency, value for money, and operational performance across multiple teams.",
    results: [
      { metric: "£10,000+", label: "additional savings", icon: DollarSign },
      { metric: "3,000+", label: "staff onboarded", icon: Users },
      { metric: "20+", label: "projects managed", icon: Calendar }
    ]
  },
  {
    period: "2025–Present",
    title: "Founded ALIRA.",
    context: "Strategic consultancy",
    description: "Built the Clarity Engine to turn complexity into actionable business cases, leveraging 10+ years of transformation experience.",
    results: [
      { metric: "100%", label: "tailored solutions", icon: Award },
      { metric: "24hr", label: "turnaround time", icon: Calendar },
      { metric: "0", label: "generic templates", icon: Target }
    ]
  }
]

export default function Experience() {
  return (
    <section className="py-24 bg-alira-porcelain/30 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #0B0B0B 1px, transparent 1px),
                           linear-gradient(to bottom, #0B0B0B 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <Reveal>
          <div className="text-center mb-20">
            <div className="text-sm tracking-wide uppercase text-alira-gold mb-4 font-medium">
              PROVEN RESULTS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-alira-onyx mb-6">
              Measurable Impact
            </h2>
            <div className="w-16 h-px bg-alira-gold mx-auto mb-6"></div>
            <p className="text-lg text-alira-onyx/70 max-w-3xl mx-auto">
              Real outcomes from real engagements. Every number represents a business challenge solved and value delivered across 10+ years of transformation experience.
            </p>
          </div>
        </Reveal>

        {/* Premium Timeline with Results */}
        <div className="relative">
          {/* Center line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-alira-gold/30 transform -translate-x-1/2"></div>
          
          <div className="space-y-16 lg:space-y-20">
            {experiences.map((experience, index) => (
              <Reveal key={index} delay={index * 150}>
                <div className={`relative flex items-start ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}>
                  
                  {/* Timeline dot */}
                  <div className={`absolute lg:static lg:flex-shrink-0 left-8 lg:left-1/2 lg:-ml-3 top-4 lg:top-0 w-4 h-4 bg-alira-gold rounded-full border-4 border-white shadow-lg z-10`}></div>
                  
                  {/* Content */}
                  <div className={`lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12 lg:text-left'} ml-16 lg:ml-0`}>
                    <div className="text-sm font-medium text-alira-gold mb-3 tracking-wide">
                      {experience.period}
                    </div>
                    <h3 className="text-xl font-bold text-alira-onyx mb-2">
                      {experience.title}
                    </h3>
                    <div className="text-base font-medium text-alira-onyx/80 italic mb-3">
                      {experience.context}
                    </div>
                    <p className="text-alira-onyx/70 leading-relaxed mb-6">
                      {experience.description}
                    </p>
                    
                    {/* Results Grid */}
                    <div className={`grid grid-cols-1 gap-4 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                      {experience.results.map((result, resultIndex) => {
                        const IconComponent = result.icon
                        return (
                          <div key={resultIndex} className="flex items-center space-x-3 bg-white/50 rounded-lg p-3 border border-alira-onyx/5">
                            <div className="flex-shrink-0 w-8 h-8 bg-alira-gold/10 rounded-full flex items-center justify-center">
                              <IconComponent className="w-4 h-4 text-alira-gold" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-lg font-bold text-alira-onyx">
                                {result.metric}
                              </div>
                              <div className="text-sm text-alira-onyx/70">
                                {result.label}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Mobile/Tablet connecting line */}
                  <div className="lg:hidden absolute left-11 top-8 bottom-0 w-px bg-alira-gold/20"></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Client Spotlight */}
        <Reveal delay={600}>
          <div className="mt-20 text-center">
            <div className="bg-white rounded-2xl p-8 lg:p-12 border border-alira-onyx/10 shadow-lg">
              <div className="text-sm tracking-wide uppercase text-alira-gold mb-4 font-medium">
                CLIENT SPOTLIGHT
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-alira-onyx mb-6">
                Enterprise Transformation Success
              </h3>
              <p className="text-lg text-alira-onyx/70 mb-8 max-w-3xl mx-auto">
                Delivered comprehensive transformation programmes focused on improving efficiency, value for money, and operational performance across multiple teams and departments.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-alira-gold mb-2">£21,000</div>
                  <div className="text-sm text-alira-onyx/70">Total annual savings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-alira-gold mb-2">3,000+</div>
                  <div className="text-sm text-alira-onyx/70">Staff onboarded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-alira-gold mb-2">25%</div>
                  <div className="text-sm text-alira-onyx/70">Sign-up increase</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-alira-gold mb-2">10+</div>
                  <div className="text-sm text-alira-onyx/70">Years experience</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
