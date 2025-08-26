import { ArrowRight, ClipboardList, Settings, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const steps = [
  {
    title: 'Form',
    description: 'Complete our structured intake form with your business details, challenges, and goals.',
    icon: ClipboardList,
  },
  {
    title: 'Engine',
    description: 'Our system processes your information through strategic frameworks and business logic.',
    icon: Settings,
  },
  {
    title: 'Output',
    description: 'Receive a comprehensive Draft Business Case PDF tailored to your specific situation.',
    icon: FileText,
  },
]

export default function HowItWorksSteps() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="grid grid-cols-3 gap-16 items-start">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div key={step.title} className="relative">
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
                  </div>

                  {/* Content */}
                  <div className="space-y-4 max-w-xs">
                    <h3 className="h3">
                      {step.title}
                    </h3>
                    <p className="copy">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow Connector */}
                {index < steps.length - 1 && (
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
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div key={step.title} className="relative">
                {/* Step Container */}
                <div className="flex items-start space-x-6">
                  {/* Icon */}
                  <div className="flex-shrink-0 group">
                    <div 
                      className="w-16 h-16 rounded-full border-2 border-alira-onyx bg-white flex items-center justify-center shadow-sm transition-all duration-200 hover:shadow-md hover:border-alira-gold hover:-translate-y-1"
                      role="img"
                      aria-label={`${step.title} step`}
                    >
                      <IconComponent className="w-6 h-6 text-alira-onyx transition-colors duration-200 group-hover:text-alira-gold" />
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
                  </div>
                </div>

                {/* Arrow Connector */}
                {index < steps.length - 1 && (
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
    </div>
  )
}
