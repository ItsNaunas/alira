'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const words = ['clarity', 'structure', 'discipline', 'elegance']

export default function HeroRotator() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, 4000) // 4s interval for more elegant pacing

    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  return (
    <span 
      className="inline-block relative"
      style={{ 
        width: '10ch', // Fixed width container to prevent layout shift
        height: '1em', 
        lineHeight: '1', 
        whiteSpace: 'nowrap',
        textAlign: 'left'
      }}
      aria-live="polite"
      aria-label="Rotating brand values"
    >
      {words.map((word, index) => (
        <span
          key={word}
          className={cn(
            'absolute top-0 left-0 text-alira-gold/80 font-light tracking-wide capitalize',
            prefersReducedMotion 
              ? index === currentIndex ? 'opacity-100' : 'opacity-0'
              : 'transition-opacity duration-1000 ease-in-out', // Very smooth transition
            index === currentIndex
              ? 'opacity-100'
              : 'opacity-0'
          )}
        >
          {word}
        </span>
      ))}
    </span>
  )
}
