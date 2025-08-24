import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { services } from '@/lib/schema'

export default function ServicesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {services.map((service) => (
        <Card key={service.value} className="border-alira-onyx/10 hover:border-alira-gold/30 transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl alira-heading">
                {service.label}
              </CardTitle>
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
      ))}
    </div>
  )
}
