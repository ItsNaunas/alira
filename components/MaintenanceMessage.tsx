'use client'

import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Wrench, Clock, Mail } from 'lucide-react'
import Link from 'next/link'

export default function MaintenanceMessage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-2 border-alira-gold/20">
        <CardHeader className="text-center bg-alira-gold/5">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-alira-gold/10 rounded-full">
              <Wrench className="w-8 h-8 text-alira-gold" />
            </div>
          </div>
          <CardTitle className="text-2xl alira-heading text-alira-onyx">
            Currently Under Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <p className="text-alira-onyx/80 leading-relaxed">
              We're currently updating our simple plan form to provide you with an even better experience. 
              Our team is working hard to bring you enhanced features and improved functionality.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-alira-onyx/70">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Expected completion: Until further notice</span>
            </div>
          </div>

          <div className="bg-alira-onyx/5 rounded-lg p-4 border border-alira-onyx/10">
            <h3 className="font-semibold text-alira-onyx mb-2">
              Need immediate assistance?
            </h3>
            <p className="text-sm text-alira-onyx/70 mb-4">
              Our team is still available to help with your planning needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </Link>
              <Link href="/services">
                <Button className="w-full sm:w-auto bg-alira-onyx hover:bg-alira-onyx/90">
                  View Services
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-xs text-alira-onyx/60">
            Thank you for your patience. We'll be back online soon!
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
