import { ArrowRight, FileText, Cpu, FileCheck, MessageSquare } from 'lucide-react'

const steps = [
  {
    title: 'Form',
    description: 'Answer questions',
    icon: FileText,
  },
  {
    title: 'Engine',
    description: 'Process & analyze',
    icon: Cpu,
  },
  {
    title: 'Draft',
    description: 'Generate document',
    icon: FileCheck,
  },
  {
    title: 'Conversation',
    description: 'Start engagement',
    icon: MessageSquare,
  },
]

export default function ProcessFlow() {
  return (
    <div className="flex justify-center items-center space-x-6 mt-8">
      {steps.map((step, index) => {
        const IconComponent = step.icon
        return (
          <div key={step.title} className="flex items-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-alira-gold/10 border border-alira-gold/20 flex items-center justify-center group-hover:bg-alira-gold/20 transition-colors">
                <IconComponent className="h-6 w-6 text-alira-gold" />
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-alira-onyx">{step.title}</div>
                <div className="text-xs text-muted-foreground">{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="mx-4">
                <ArrowRight className="h-4 w-4 text-alira-gold" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
