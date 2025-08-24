import IntakeForm from '@/components/IntakeForm'
import Reveal from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Calendar, MessageSquare } from 'lucide-react'

export default function Contact() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold alira-heading text-alira-onyx mb-6">
              Start Your Journey
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose your preferred way to begin. Complete our intake form for an immediate business case, or schedule a call to discuss your options.
            </p>
          </div>
        </Reveal>

        {/* Contact Options */}
        <Reveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border-alira-onyx/10 hover:border-alira-gold/30 transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-alira-gold/10 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-alira-gold" />
                </div>
                <CardTitle className="text-xl alira-heading">Intake Form</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Complete our structured form and receive a personalized Draft Business Case within minutes.
                </p>
                <Button asChild className="w-full">
                  <a href="#intake-form">Start Form</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-alira-onyx/10 hover:border-alira-gold/30 transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-alira-gold/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-alira-gold" />
                </div>
                <CardTitle className="text-xl alira-heading">Schedule Call</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Book a 30-minute consultation to discuss your business challenges and explore solutions.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <a href="https://calendly.com/alira-consulting" target="_blank" rel="noopener noreferrer">
                    Book Call
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-alira-onyx/10 hover:border-alira-gold/30 transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-alira-gold/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-alira-gold" />
                </div>
                <CardTitle className="text-xl alira-heading">Email Us</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Send us a direct message with your questions or specific requirements.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <a href="mailto:hello@alira.com">Send Email</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </Reveal>

        {/* Intake Form Section */}
        <section id="intake-form">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold alira-heading text-alira-onyx mb-4">
                Generate Your Business Case
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Complete the form below to receive a comprehensive Draft Business Case tailored to your specific situation. This is the first step in your journey with ALIRA.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <IntakeForm />
          </Reveal>
        </section>

        {/* Additional Information */}
        <section className="mt-24">
          <Reveal>
            <div className="bg-alira-onyx/5 p-8 rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold alira-heading text-alira-onyx mb-4">
                    What Happens Next?
                  </h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start space-x-3">
                      <span className="text-alira-gold font-bold">1.</span>
                      <span>Complete the intake form and receive your Draft Business Case</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-alira-gold font-bold">2.</span>
                      <span>We'll review your information and reach out within 24 hours</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-alira-gold font-bold">3.</span>
                      <span>Schedule a consultation call to discuss your business case</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-alira-gold font-bold">4.</span>
                      <span>Refine the approach and begin your engagement</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold alira-heading text-alira-onyx mb-4">
                    Why This Approach?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We believe every business owner deserves to start with clarity, not confusion. Our intake form ensures we capture the essential information needed to create a meaningful business case, while our immediate PDF generation gives you tangible value from the very first interaction.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  )
}
