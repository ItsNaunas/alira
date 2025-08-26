import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { services } from '@/lib/schema'
import { Settings, Target, Zap, Users } from 'lucide-react'

const serviceIcons = {
  'Business Reset': Settings,
  'Growth Blueprint': Target,
  'AI Advantage': Zap,
  'Strategic Partner': Users,
}

export default function ServicesGrid() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service) => {
          const IconComponent = serviceIcons[service.label as keyof typeof serviceIcons] || Settings
          return (
            <Card key={service.value} className="border-alira-onyx/10 hover:border-alira-gold/30 transition-all duration-300 hover:shadow-lg group">
              <CardHeader className="pb-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-alira-gold/10 rounded-full flex items-center justify-center group-hover:bg-alira-gold/20 transition-colors duration-300">
                      <IconComponent className="w-6 h-6 text-alira-gold" />
                    </div>
                    <CardTitle className="text-xl alira-heading">
                      {service.label}
                    </CardTitle>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-alira-gold">
                      {service.price}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {service.duration}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
