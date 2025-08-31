// Analytics utility for tracking conversion events
// Supports multiple analytics providers (Google Analytics, Facebook Pixel, etc.)

interface AnalyticsEvent {
  event: string
  category?: string
  action?: string
  label?: string
  value?: number
  [key: string]: any
}

// Google Analytics 4 (GA4) tracking
export const trackGA4Event = (event: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event.event, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event
    })
  }
}

// Facebook Pixel tracking
export const trackFacebookEvent = (event: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', event.event, {
      content_name: event.label,
      content_category: event.category,
      value: event.value,
      ...event
    })
  }
}

// Universal analytics function
export const trackEvent = (event: AnalyticsEvent) => {
  // Track in GA4
  trackGA4Event(event)
  
  // Track in Facebook Pixel
  trackFacebookEvent(event)
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', event)
  }
}

// Predefined conversion events
export const conversionEvents = {
  // Form interactions
  formStarted: (formType: string) => trackEvent({
    event: 'form_start',
    category: 'engagement',
    action: 'form_start',
    label: formType
  }),
  
  formCompleted: (formType: string) => trackEvent({
    event: 'form_complete',
    category: 'conversion',
    action: 'form_complete',
    label: formType
  }),
  
  // CTA clicks
  ctaClicked: (ctaLocation: string, ctaText: string) => trackEvent({
    event: 'cta_click',
    category: 'engagement',
    action: 'cta_click',
    label: `${ctaLocation}: ${ctaText}`
  }),
  
  // Page views
  pageView: (pageName: string) => trackEvent({
    event: 'page_view',
    category: 'navigation',
    action: 'page_view',
    label: pageName
  }),
  
  // Business case generation
  businessCaseGenerated: (businessName: string) => trackEvent({
    event: 'business_case_generated',
    category: 'conversion',
    action: 'business_case_generated',
    label: businessName
  }),
  
  // Preview generated
  previewGenerated: (businessName: string) => trackEvent({
    event: 'preview_generated',
    category: 'engagement',
    action: 'preview_generated',
    label: businessName
  }),
  
  // Scroll depth
  scrollDepth: (depth: number) => trackEvent({
    event: 'scroll_depth',
    category: 'engagement',
    action: 'scroll',
    label: `${depth}%`,
    value: depth
  }),
  
  // Time on page
  timeOnPage: (seconds: number, pageName: string) => trackEvent({
    event: 'time_on_page',
    category: 'engagement',
    action: 'time_on_page',
    label: pageName,
    value: seconds
  })
}

// Hook for tracking scroll depth
export const useScrollTracking = (pageName: string) => {
  if (typeof window === 'undefined') return

  let maxScrollDepth = 0
  let startTime = Date.now()

  const trackScroll = () => {
    const scrollTop = window.pageYOffset
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = Math.round((scrollTop / docHeight) * 100)
    
    if (scrollPercent > maxScrollDepth) {
      maxScrollDepth = scrollPercent
      
      // Track at 25%, 50%, 75%, 100%
      if ([25, 50, 75, 100].includes(scrollPercent)) {
        conversionEvents.scrollDepth(scrollPercent)
      }
    }
  }

  const trackTimeOnPage = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    conversionEvents.timeOnPage(timeSpent, pageName)
  }

  // Add event listeners
  window.addEventListener('scroll', trackScroll)
  window.addEventListener('beforeunload', trackTimeOnPage)

  // Cleanup function
  return () => {
    window.removeEventListener('scroll', trackScroll)
    window.removeEventListener('beforeunload', trackTimeOnPage)
  }
}
