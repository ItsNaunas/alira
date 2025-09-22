'use client'

import { useEffect, useState } from 'react'
import CTAButton from './CTAButton'

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsVisible(scrollY > 300) // Show after scrolling 300px
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-alira-onyx/10 p-4 z-50 lg:hidden">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex-1">
          <CTAButton 
            href="/form" 
            variant="alira"
            className="w-full"
          />
        </div>
                 <div className="ml-4 text-xs text-alira-onyx/70">
           <div>✓ Delivered in minutes</div>
           <div>🔒 Private & secure</div>
         </div>
      </div>
    </div>
  )
}
