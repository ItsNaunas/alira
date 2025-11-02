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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-borderToken-subtle p-3 sm:p-4 z-50 xl:hidden pb-safe">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto px-4">
        <div className="flex-1 min-w-0">
          <CTAButton 
            href="#start-chat" 
            variant="alira"
            className="w-full px-4 py-2 text-sm sm:text-base whitespace-nowrap"
          />
        </div>
        <div className="hidden sm:flex flex-col text-xs text-text-secondary flex-shrink-0">
          <div>✓ Free</div>
          <div>🔒 Secure</div>
        </div>
      </div>
    </div>
  )
}
