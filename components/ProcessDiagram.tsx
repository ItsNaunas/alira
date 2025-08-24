import { ArrowRight } from 'lucide-react'

const nodes = [
  {
    title: 'Form',
    description: 'Complete our structured intake form with your business details, challenges, and goals.',
  },
  {
    title: 'Engine',
    description: 'Our system processes your information through strategic frameworks and business logic.',
  },
  {
    title: 'Output',
    description: 'Receive a comprehensive Draft Business Case PDF tailored to your specific situation.',
  },
]

export default function ProcessDiagram() {
  return (
    <div className="max-w-md mx-auto">
      <div className="relative flex items-center justify-between">
        {nodes.map((node, index) => (
          <div key={node.title} className="flex flex-col items-center relative">
            {/* Node */}
            <div className="w-16 h-16 rounded-full border-2 border-alira-onyx flex items-center justify-center mb-4 bg-alira-porcelain">
              <span className="text-sm font-medium text-alira-onyx">
                {node.title}
              </span>
            </div>
            
            {/* Description */}
            <p className="text-xs text-muted-foreground text-center max-w-32 leading-relaxed">
              {node.description}
            </p>
            
            {/* Arrow connector */}
            {index < nodes.length - 1 && (
              <div className="absolute top-8 left-full transform -translate-x-1/2 flex items-center">
                <div className="w-12 h-px bg-alira-gold"></div>
                <ArrowRight className="h-3 w-3 text-alira-gold mx-1" />
                <div className="w-12 h-px bg-alira-gold"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
