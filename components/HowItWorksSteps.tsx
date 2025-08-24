import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const steps = [
  {
    title: 'Form',
    description: 'Complete our structured intake form with your business details, challenges, and goals.',
    icon: '📝',
  },
  {
    title: 'Engine',
    description: 'Our system processes your information through strategic frameworks and business logic.',
    icon: '⚙️',
  },
  {
    title: 'Output',
    description: 'Receive a comprehensive Draft Business Case PDF tailored to your specific situation.',
    icon: '📄',
  },
]

export default function HowItWorksSteps() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={step.title} className="relative">
            <Card className="border-alira-onyx/10 hover:border-alira-gold/30 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-2">{step.icon}</div>
                <CardTitle className="text-xl alira-heading">
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
            
            {/* Arrow connector */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <div className="bg-alira-porcelain p-2 rounded-full border border-alira-onyx/10">
                  <ArrowRight className="h-4 w-4 text-alira-gold" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Mobile arrows */}
      <div className="md:hidden flex justify-center items-center space-x-4">
        {steps.slice(0, -1).map((_, index) => (
          <div key={index} className="flex items-center space-x-2">
            <ArrowRight className="h-4 w-4 text-alira-gold rotate-90" />
          </div>
        ))}
      </div>
    </div>
  )
}
