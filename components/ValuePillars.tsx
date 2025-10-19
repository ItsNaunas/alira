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
          <Card key={pillar.title} className="border-alira-primary/10 dark:border-alira-white/10 hover:border-alira-gold/30 transition-all duration-300 hover:shadow-lg group bg-white dark:bg-alira-primary">
            <CardHeader className="pb-4">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-alira-gold/20 to-alira-gold/10 flex items-center justify-center group-hover:from-alira-gold/30 group-hover:to-alira-gold/20 transition-all duration-300 border border-alira-gold/20">
                  <IconComponent className="h-8 w-8 text-alira-gold" />
                </div>
                <div>
                  <CardTitle className="text-xl alira-heading text-alira-primary dark:text-alira-white">
                    {pillar.title}
                    <span className="text-alira-gold font-light"> {pillar.subtitle}</span>
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
