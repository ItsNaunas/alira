import Reveal from './Reveal'
import { ArrowRight, Sparkles, Clock, TrendingUp } from 'lucide-react'

const caseStudies = [
  {
    headline: "From Stuck to Launched in 3 Weeks",
    metric: "+300% Clarity",
    timeframe: "3 weeks",
    before: "Overloaded priorities, scattered focus, no clear direction",
    after: "Strategic reset with clear roadmap and actionable next steps",
    context: "Manufacturing leader, 150 employees",
    icon: TrendingUp
  },
  {
    headline: "90 Days from Chaos to Clarity", 
    metric: "40% Revenue",
    timeframe: "6 months",
    before: "Scattered growth efforts across multiple channels",
    after: "Unified blueprint driving consistent growth and measurable results",
    context: "Tech startup, Series A",
    icon: Sparkles
  },
  {
    headline: "Turning Conversations into Systems",
    metric: "60% Efficiency",
    timeframe: "90 days", 
    before: "Manual processes creating bottlenecks and delays",
    after: "AI integration streamlining operations with zero job losses",
    context: "Professional services firm",
    icon: Clock
  }
]

export default function ProofOfClarity() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-brand via-brand/80 to-bg-page relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <div className="text-sm font-sans font-semibold tracking-wide text-text-inverse uppercase mb-4">
              Case Studies
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-text-inverse mb-6">
              Proof of Clarity
            </h2>
            <div className="w-16 h-px bg-accent mx-auto"></div>
          </div>
        </Reveal>
        
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {caseStudies.map((study, index) => {
            const IconComponent = study.icon
            return (
              <Reveal key={index} delay={index * 200}>
                 <div className="bg-surface rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 border border-borderToken-subtle shadow-token-lg hover:shadow-token-lg hover:border-accent transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
                    {/* Left side - Metric & Icon */}
                    <div className="text-center lg:text-left">
                      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-accent/10 rounded-2xl mb-4 sm:mb-6">
                        <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
                      </div>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-accent-dark mb-2">
                        {study.metric}
                      </div>
                      <div className="text-base sm:text-lg text-text-secondary font-sans font-medium">
                        {study.timeframe}
                      </div>
                    </div>
                    
                    {/* Right side - Story & Outcome */}
                    <div className="space-y-4 sm:space-y-6">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-normal text-text-primary leading-tight">
                        {study.headline}
                      </h3>
                      
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <div className="text-sm font-sans font-medium text-text-secondary mb-1">Before:</div>
                            <p className="text-text-secondary leading-relaxed text-sm sm:text-base">{study.before}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <ArrowRight className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-sans font-medium text-text-secondary mb-1">After:</div>
                            <p className="text-text-secondary leading-relaxed text-sm sm:text-base">{study.after}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-3 sm:pt-4 border-t border-borderToken-subtle">
                        <p className="text-sm text-text-secondary font-sans font-medium">
                          {study.context}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}