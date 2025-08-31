'use client'

import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { conversionEvents } from '@/lib/analytics'

interface CTAButtonProps {
  href: string
  variant?: 'alira' | 'aliraOutline'
  className?: string
  showArrow?: boolean
  // A/B testing props
  testVariants?: string[]
  testKey?: string
  // Analytics props
  location?: string
  children?: React.ReactNode
}

export default function CTAButton({ 
  href, 
  variant = 'alira', 
  className = '',
  showArrow = true,
  testVariants,
  testKey,
  location = 'unknown',
  children
}: CTAButtonProps) {
  const [buttonText, setButtonText] = useState('Start Your Business Case')

  useEffect(() => {
    // A/B testing logic - can be expanded later
    if (testVariants && testKey) {
      // For now, use a simple hash-based selection
      // In production, this could integrate with analytics tools
      const hash = testKey.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
      }, 0)
      const selectedVariant = testVariants[Math.abs(hash) % testVariants.length]
      setButtonText(selectedVariant)
    }
  }, [testVariants, testKey])

  const handleClick = () => {
    // Track CTA click
    const finalText = children || buttonText
    conversionEvents.ctaClicked(location, finalText)
  }

  return (
    <Link href={href} className="inline-block group" onClick={handleClick}>
      <Button 
        variant={variant} 
        className={className}
      >
        {children || buttonText}
        {showArrow && (
          <ArrowRight className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </Button>
    </Link>
  )
}

// Predefined CTA text variations for easy A/B testing
export const CTA_VARIANTS = {
  DEFAULT: 'Start Your Business Case',
  SPEED: 'Your 24-Hour Business Case',
  BRAND: 'Get Your Clarity',
  ACTION: 'Begin Your Business Case',
  SIMPLE: 'Get Started'
} as const

/*
A/B Testing Usage Examples:

1. Basic usage (default text):
   <CTAButton href="/form" variant="alira" />

2. A/B test between two variants:
   <CTAButton 
     href="/form" 
     variant="alira"
     testVariants={['Start Your Business Case', 'Your 24-Hour Business Case']}
     testKey="homepage-hero"
   />

3. A/B test using predefined variants:
   <CTAButton 
     href="/form" 
     variant="aliraOutline"
     testVariants={[CTA_VARIANTS.DEFAULT, CTA_VARIANTS.SPEED, CTA_VARIANTS.BRAND]}
     testKey="services-cta"
   />

4. Speed-focused test:
   <CTAButton 
     href="/form" 
     variant="alira"
     testVariants={['Start Your Business Case', 'Get Your Business Case in Minutes']}
     testKey="speed-test"
   />

The testKey should be unique for each test location to ensure consistent
variant assignment for the same user across page refreshes.
*/
