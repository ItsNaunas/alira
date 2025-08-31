import ValuePreview from '@/components/ValuePreview'
import CTAButton from '@/components/CTAButton'
import Link from 'next/link'
import { Calendar, Mail } from 'lucide-react'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-alira-porcelain/20 via-white to-alira-porcelain/20">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-alira-onyx mb-6">
            Get Started with ALIRA
          </h1>
          <p className="text-xl text-alira-onyx/70 max-w-3xl mx-auto">
            See your business case preview instantly, then get the complete version delivered to your inbox
          </p>
        </div>
        
        {/* Primary Conversion Path */}
        <div className="mb-20">
          <ValuePreview />
        </div>
        
        {/* Alternative Contact Methods */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center space-x-8">
            <Link 
              href="mailto:hello@alira.com" 
              className="inline-flex items-center text-alira-onyx/70 hover:text-alira-onyx transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              hello@alira.com
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center text-alira-onyx/70 hover:text-alira-onyx transition-colors"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule a call
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
