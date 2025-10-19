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
    <section className="py-16 md:py-24 bg-gradient-to-b from-black to-alira-primary relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <div className="text-sm font-sans font-semibold tracking-wide text-alira-gold uppercase mb-4">
              Case Studies
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-white mb-6">
              Proof of Clarity
            </h2>
            <div className="w-16 h-px bg-alira-gold mx-auto"></div>
          </div>
        </Reveal>
        
        <div className="max-w-6xl mx-auto space-y-8">
          {caseStudies.map((study, index) => {
            const IconComponent = study.icon
            return (
              <Reveal key={index} delay={index * 200}>
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10 shadow-lg hover:shadow-xl hover:border-alira-gold/30 transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left side - Metric & Icon */}
                    <div className="text-center lg:text-left">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-alira-gold/20 to-alira-gold/10 rounded-2xl mb-6">
                        <IconComponent className="w-10 h-10 text-alira-gold" />
                      </div>
                      <div className="text-4xl md:text-5xl font-serif font-bold text-alira-gold mb-2">
                        {study.metric}
                      </div>
                      <div className="text-lg text-white/70 font-sans font-medium">
                        {study.timeframe}
                      </div>
                    </div>
                    
                    {/* Right side - Story & Outcome */}
                    <div className="space-y-6">
                      <h3 className="text-2xl md:text-3xl font-serif font-normal text-white leading-tight">
                        {study.headline}
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <div className="text-sm font-sans font-medium text-white/60 mb-1">Before:</div>
                            <p className="text-white/80 leading-relaxed">{study.before}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <ArrowRight className="w-5 h-5 text-alira-gold mt-1 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-sans font-medium text-white/60 mb-1">After:</div>
                            <p className="text-white/80 leading-relaxed">{study.after}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-white/20">
                        <p className="text-sm text-white/60 font-sans font-medium">
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