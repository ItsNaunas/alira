import { useState, useEffect } from 'react'

/**
 * Hook to detect if the user is on a mobile device
 */
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') {
      return
    }

    // Initial check
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // Tailwind md breakpoint
    }

    checkMobile()

    // Listen for resize events
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return isMobile
}

/**
 * Hook to detect touch capability
 */
export function useTouch() {
  const [hasTouch, setHasTouch] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    // Check for touch support
    const checkTouch = () => {
      setHasTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore - for older browsers
        navigator.msMaxTouchPoints > 0
      )
    }

    checkTouch()
  }, [])

  return hasTouch
}

/**
 * Hook for swipe gesture detection
 */
export function useSwipe(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold = 50
) {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = threshold

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft()
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight()
    }
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  }
}

/**
 * Hook for voice input using Web Speech API
 */
export function useVoiceInput(
  onResult: (text: string) => void,
  onError?: (error: Error) => void
) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    // Check if Speech Recognition API is available
    const SpeechRecognition =
      // @ts-ignore
      window.SpeechRecognition || window.webkitSpeechRecognition

    setIsSupported(!!SpeechRecognition)
  }, [])

  let recognition: any = null

  const startListening = () => {
    if (typeof window === 'undefined' || !isSupported) {
      onError?.(new Error('Speech recognition not supported'))
      return
    }

    const SpeechRecognition =
      // @ts-ignore
      window.SpeechRecognition || window.webkitSpeechRecognition

    recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('')
      onResult(transcript)
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      setIsListening(false)
      onError?.(new Error(`Speech recognition error: ${event.error}`))
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    try {
      recognition.start()
    } catch (err) {
      setIsListening(false)
      onError?.(new Error('Failed to start speech recognition'))
    }
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }

  return {
    startListening,
    stopListening,
    isListening,
    isSupported
  }
}
