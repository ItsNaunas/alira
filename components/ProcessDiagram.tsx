import { ClipboardList, Settings, FileText, ArrowRight, Info } from 'lucide-react'
import { useState } from 'react'

const processSteps = [
  {
    id: 'form',
    title: 'Form',
    description: 'Structured intake captures your reality without assumptions.',
    detailedDescription: 'Complete our strategic intake form that captures your business context, challenges, and objectives. Takes 10-15 minutes and ensures we understand your unique situation.',
    icon: ClipboardList
  },
  {
    id: 'engine', 
    title: 'Engine',
    description: 'Strategic frameworks process complexity into actionable clarity.',
    detailedDescription: 'Our proprietary engine analyzes your inputs through multiple strategic lenses: market positioning, competitive analysis, resource optimization, and growth potential.',
    icon: Settings
  },
  {
    id: 'output',
    title: 'Output', 
    description: 'Comprehensive business case tailored to your specific situation.',
    detailedDescription: 'Receive a structured business case with problem statement, objectives, proposed solution, and next steps - all tailored to your industry, stage, and challenges.',
    icon: FileText
  },
]

export default function ProcessDiagram() {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null)

  return (
    <section 
      className="w-full py-16 px-4"
      role="region"
      aria-labelledby="process-diagram-title"
    >
      {/* Hidden title for screen readers */}
      <h2 id="process-diagram-title" className="sr-only">
        Business Case Generation Process
      </h2>
      
      {/* Desktop Layout */}
      <div className="hidden md:block max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-16 items-start">
          {processSteps.map((step, index) => {
            const IconComponent = step.icon
            const isHovered = hoveredStep === step.id
            return (
              <div 
                key={step.id} 
                className="relative"
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Step Container */}
                <div className="flex flex-col items-center text-center space-y-8">
                  {/* Icon */}
                  <div className="relative group">
                    <div 
                      className="w-20 h-20 rounded-full border-2 border-alira-onyx bg-white flex items-center justify-center shadow-sm transition-all duration-200 hover:shadow-md hover:border-alira-gold hover:-translate-y-1"
                      role="img"
                      aria-label={`${step.title} step`}
                    >
                      <IconComponent className="w-8 h-8 text-alira-onyx transition-colors duration-200 group-hover:text-alira-gold" />
                    </div>
                    {/* Info indicator */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-alira-gold/10 rounded-full flex items-center justify-center border border-alira-gold/20">
                      <Info className="w-3 h-3 text-alira-gold" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4 max-w-xs">
                    <h3 className="h3">
                      {step.title}
                    </h3>
                    <p className="copy">
                      {step.description}
                    </p>
                    
                    {/* Detailed description on hover */}
                    {isHovered && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-80 bg-white border border-alira-onyx/10 rounded-lg shadow-lg p-4 z-20">
                        <div className="text-sm text-alira-onyx/80 leading-relaxed">
                          {step.detailedDescription}
                        </div>
                        {/* Arrow pointing up */}
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-alira-onyx/10 rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow Connector */}
                {index < processSteps.length - 1 && (
                  <div 
                    className="absolute top-10 left-full w-16 flex items-center justify-center -translate-x-8 z-10"
                    aria-hidden="true"
                  >
                    <ArrowRight className="w-6 h-6 text-alira-gold transition-all duration-200 hover:scale-110" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden max-w-sm mx-auto">
        <div className="space-y-12">
          {processSteps.map((step, index) => {
            const IconComponent = step.icon
            const isHovered = hoveredStep === step.id
            return (
              <div 
                key={step.id} 
                className="relative"
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Step Container */}
                <div className="flex items-start space-x-6">
                  {/* Icon */}
                  <div className="flex-shrink-0 group relative">
                    <div 
                      className="w-16 h-16 rounded-full border-2 border-alira-onyx bg-white flex items-center justify-center shadow-sm transition-all duration-200 hover:shadow-md hover:border-alira-gold hover:-translate-y-1"
                      role="img"
                      aria-label={`${step.title} step`}
                    >
                      <IconComponent className="w-6 h-6 text-alira-onyx transition-colors duration-200 group-hover:text-alira-gold" />
                    </div>
                    {/* Info indicator */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-alira-gold/10 rounded-full flex items-center justify-center border border-alira-gold/20">
                      <Info className="w-2.5 h-2.5 text-alira-gold" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3 pt-1">
                    <h3 className="h3">
                      {step.title}
                    </h3>
                    <p className="copy">
                      {step.description}
                    </p>
                    
                    {/* Detailed description on hover */}
                    {isHovered && (
                      <div className="mt-4 p-4 bg-alira-onyx/5 rounded-lg border border-alira-onyx/10">
                        <div className="text-sm text-alira-onyx/80 leading-relaxed">
                          {step.detailedDescription}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow Connector */}
                {index < processSteps.length - 1 && (
                  <div 
                    className="absolute left-8 top-16 w-12 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <ArrowRight className="w-5 h-5 text-alira-gold rotate-90 transition-all duration-200 hover:scale-110" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
