import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Eye, Target, Sparkles, Layers } from 'lucide-react'

const pillars = [
  {
    title: 'Clarity',
    subtitle: 'over clutter',
    description: 'Strip away the noise and focus on what matters most.',
    icon: Eye,
  },
  {
    title: 'Discipline',
    subtitle: 'over distraction',
    description: 'Build systems that keep you on track and moving forward.',
    icon: Target,
  },
  {
    title: 'Elegance',
    subtitle: 'over noise',
    description: 'Simple, refined solutions that work beautifully.',
    icon: Sparkles,
  },
  {
    title: 'Systems',
    subtitle: 'that last',
    description: 'Create foundations that scale with your ambitions.',
    icon: Layers,
  },
]

export default function ValuePillars() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {pillars.map((pillar, index) => {
        const IconComponent = pillar.icon
        return (
          <Card key={pillar.title} className="border-borderToken-subtle hover:border-accent/30 transition-all duration-300 hover:shadow-lg group bg-surface dark:bg-brand">
            <CardHeader className="pb-4">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent/20 transition-all duration-300 border border-accent/20">
                  <IconComponent className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-xl alira-heading text-brand dark:text-text-inverse">
                    {pillar.title}
                    <span className="text-accent font-light"> {pillar.subtitle}</span>
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
