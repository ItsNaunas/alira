'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Download, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { conversionEvents } from '@/lib/analytics'

export default function SuccessPage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    // Get PDF URL from query params
    const urlParams = new URLSearchParams(window.location.search)
    const pdf = urlParams.get('pdf')
    if (pdf) {
      setPdfUrl(decodeURIComponent(pdf))
    }

    // Track success event
    conversionEvents.formCompleted('wizard_form_success')
  }, [])

  const handleDownloadPDF = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank')
      conversionEvents.ctaClicked('success_page', 'Download PDF')
    }
  }

  const handleBookCall = () => {
    conversionEvents.ctaClicked('success_page', 'Book Call')
    window.open('https://calendly.com/its-naunas/30min', '_blank')
  }

  return (
    <div className="min-h-screen bg-alira-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6">
        <Card className="border-2 border-alira-gold/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="w-16 h-16 text-alira-gold" />
            </div>
            <CardTitle className="text-3xl font-serif font-normal text-alira-primary">
              Your Personal Plan is Ready!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-alira-primary/80 dark:text-alira-white/80 text-lg">
              We've analyzed your inputs and created a comprehensive plan tailored to your specific situation. 
              Your plan has been sent to your email and is ready for download.
            </p>

            <div className="space-y-4">
              <div className="bg-alira-gold/10 rounded-lg p-4 border border-alira-gold/20">
                <h3 className="font-serif font-normal text-alira-primary dark:text-alira-white mb-2">
                  What's in your plan:
                </h3>
                <ul className="text-sm text-alira-primary/80 dark:text-alira-white/80 space-y-1">
                  <li>• Strategic assessment of your current position</li>
                  <li>• Clear next steps for the next 90 days</li>
                  <li>• Resource optimisation recommendations</li>
                  <li>• Implementation roadmap</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {pdfUrl && (
                <Button
                  onClick={handleDownloadPDF}
                  className="bg-alira-primary hover:bg-alira-primary/90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Open Your Plan
                </Button>
              )}
              
              <Button
                onClick={handleBookCall}
                variant="outline"
                className="border-alira-gold text-alira-gold hover:bg-alira-gold hover:text-alira-primary"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Free Check-in
              </Button>
            </div>

            <div className="pt-4 border-t border-alira-primary/10">
              <p className="text-sm text-alira-primary/60">
                Questions about your plan? We'll be in touch within minutes to discuss next steps.
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center text-alira-primary/70 hover:text-alira-primary dark:text-alira-white transition-colors"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
