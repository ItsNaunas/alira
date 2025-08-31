'use client'

import CTAButton from './CTAButton'

export default function HeroCTAs() {
  return (
    <div className="flex items-center justify-center pt-4">
      <CTAButton 
        href="/form" 
        variant="alira"
        className="px-8 py-3 text-sm font-medium"
      />
    </div>
  )
}
