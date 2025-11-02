'use client'

import { useEffect, useRef, RefObject } from 'react'

interface UseMobileKeyboardOptions {
  enabled?: boolean
  offset?: number // Additional offset from top when scrolling (for fixed headers, etc.)
  behavior?: ScrollBehavior
}

/**
 * Hook to automatically scroll input into view on mobile when focused
 * Prevents keyboard from covering input fields
 */
export function useMobileKeyboard(
  inputRef: RefObject<HTMLElement>,
  options: UseMobileKeyboardOptions = {}
) {
  const { enabled = true, offset = 100, behavior = 'smooth' } = options
  const isMobileRef = useRef(false)

  useEffect(() => {
    if (!enabled || !inputRef.current) return

    // Check if mobile device
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth < 768 || 'ontouchstart' in window
    }
    checkMobile()

    const element = inputRef.current

    const handleFocus = () => {
      if (!isMobileRef.current) return

      // Small delay to allow keyboard to start opening
      setTimeout(() => {
        const rect = element.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const elementTop = rect.top + scrollTop

        // Calculate desired scroll position (element top minus offset)
        const targetScroll = elementTop - offset

        // Only scroll if element is not already visible with offset
        if (rect.top < offset) {
          window.scrollTo({
            top: targetScroll,
            behavior
          })
        }
      }, 300) // Wait for keyboard animation to start
    }

    element.addEventListener('focus', handleFocus)

    return () => {
      element.removeEventListener('focus', handleFocus)
    }
  }, [inputRef, enabled, offset, behavior])

  return { isMobile: isMobileRef.current }
}

/**
 * Hook to prevent body scroll when mobile keyboard is open
 * Helps prevent accidental background scrolling
 */
export function usePreventBodyScrollOnFocus(inputRef: RefObject<HTMLElement>) {
  useEffect(() => {
    if (!inputRef.current) return

    const element = inputRef.current
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window
    if (!isMobile) return

    const handleFocus = () => {
      // Store original overflow
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      
      // Restore on blur
      const handleBlur = () => {
        document.body.style.overflow = originalOverflow
        element.removeEventListener('blur', handleBlur)
      }
      
      element.addEventListener('blur', handleBlur, { once: true })
    }

    element.addEventListener('focus', handleFocus)

    return () => {
      element.removeEventListener('focus', handleFocus)
    }
  }, [inputRef])
}

