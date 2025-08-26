import { ArrowRight } from 'lucide-react'

const processSteps = [
  {
    id: 'form',
    title: 'Form',
    description: 'Complete our structured intake form with your business details, challenges, and goals.',
    stepNumber: '01'
  },
  {
    id: 'engine', 
    title: 'Engine',
    description: 'Our system processes your information through strategic frameworks and business logic.',
    stepNumber: '02'
  },
  {
    id: 'output',
    title: 'Output', 
    description: 'Receive a comprehensive Draft Business Case PDF tailored to your specific situation.',
    stepNumber: '03'
  },
]

export default function ProcessDiagram() {
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
          {processSteps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Step Container */}
              <div className="flex flex-col items-center text-center space-y-8">
                {/* Step Number & Icon */}
                <div className="relative">
                  <div 
                    className="w-20 h-20 rounded-full border-2 border-neutral-200 bg-white flex items-center justify-center shadow-sm transition-all duration-200 hover:shadow-md hover:border-neutral-300"
                    role="img"
                    aria-label={`Step ${step.stepNumber}: ${step.title}`}
                  >
                    <span className="text-lg font-semibold text-neutral-700">
                      {step.stepNumber}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4 max-w-xs">
                  <h3 className="text-xl font-semibold text-neutral-900 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-base text-neutral-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Arrow Connector */}
              {index < processSteps.length - 1 && (
                <div 
                  className="absolute top-10 left-full w-16 flex items-center justify-center -translate-x-8 z-10"
                  aria-hidden="true"
                >
                  <ArrowRight className="w-6 h-6 text-neutral-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden max-w-sm mx-auto">
        <div className="space-y-12">
          {processSteps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Step Container */}
              <div className="flex items-start space-x-6">
                {/* Step Number & Icon */}
                <div className="flex-shrink-0">
                  <div 
                    className="w-16 h-16 rounded-full border-2 border-neutral-200 bg-white flex items-center justify-center shadow-sm"
                    role="img"
                    aria-label={`Step ${step.stepNumber}: ${step.title}`}
                  >
                    <span className="text-base font-semibold text-neutral-700">
                      {step.stepNumber}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3 pt-1">
                  <h3 className="text-lg font-semibold text-neutral-900 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < processSteps.length - 1 && (
                <div 
                  className="absolute left-8 top-16 w-px h-12 bg-neutral-200"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
