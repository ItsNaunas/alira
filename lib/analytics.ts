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
  
  // Step view tracking
  stepView: (stepName: string) => trackEvent({
    event: 'step_view',
    category: 'engagement',
    action: 'step_view',
    label: stepName
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
  }),

  // Form feature usage
  fileUploadStarted: (fileType: string, fileSize: number) => trackEvent({
    event: 'file_upload_start',
    category: 'feature_usage',
    action: 'file_upload',
    label: fileType,
    value: fileSize
  }),

  fileUploadCompleted: (fileType: string, extractedFields: number) => trackEvent({
    event: 'file_upload_complete',
    category: 'feature_usage',
    action: 'file_upload',
    label: fileType,
    value: extractedFields
  }),

  fileUploadFailed: (fileType: string, error: string) => trackEvent({
    event: 'file_upload_failed',
    category: 'error',
    action: 'file_upload',
    label: `${fileType}: ${error}`
  }),

  smartSuggestionShown: (fieldName: string, suggestionCount: number) => trackEvent({
    event: 'smart_suggestion_shown',
    category: 'feature_usage',
    action: 'smart_suggestions',
    label: fieldName,
    value: suggestionCount
  }),

  smartSuggestionClicked: (fieldName: string, suggestionText: string) => trackEvent({
    event: 'smart_suggestion_clicked',
    category: 'feature_usage',
    action: 'smart_suggestions',
    label: `${fieldName}: ${suggestionText.substring(0, 50)}`
  }),

  exitIntentTriggered: (stepNumber: number, hasData: boolean) => trackEvent({
    event: 'exit_intent_triggered',
    category: 'conversion',
    action: 'exit_intent',
    label: `step_${stepNumber}`,
    value: hasData ? 1 : 0
  }),

  exitIntentSaved: (stepNumber: number) => trackEvent({
    event: 'exit_intent_saved',
    category: 'conversion',
    action: 'exit_intent',
    label: `step_${stepNumber}`
  }),

  exitIntentDismissed: (stepNumber: number) => trackEvent({
    event: 'exit_intent_dismissed',
    category: 'engagement',
    action: 'exit_intent',
    label: `step_${stepNumber}`
  }),

  helpIconClicked: (fieldName: string) => trackEvent({
    event: 'help_icon_clicked',
    category: 'feature_usage',
    action: 'contextual_help',
    label: fieldName
  }),

  previewViewed: () => trackEvent({
    event: 'preview_viewed',
    category: 'engagement',
    action: 'preview',
    label: 'completion_preview'
  }),

  previewEditClicked: (sectionId: string) => trackEvent({
    event: 'preview_edit_clicked',
    category: 'engagement',
    action: 'preview',
    label: sectionId
  }),

  previewConfirmed: () => trackEvent({
    event: 'preview_confirmed',
    category: 'conversion',
    action: 'preview',
    label: 'completion_preview'
  }),

  // Step drop-off tracking
  stepDropOff: (stepNumber: number, timeSpent: number) => trackEvent({
    event: 'step_drop_off',
    category: 'engagement',
    action: 'drop_off',
    label: `step_${stepNumber}`,
    value: timeSpent
  }),

  // Answer quality tracking
  answerQualityChange: (fieldName: string, quality: string, characterCount: number) => trackEvent({
    event: 'answer_quality_change',
    category: 'engagement',
    action: 'answer_quality',
    label: `${fieldName}: ${quality}`,
    value: characterCount
  }),

  // Voice input tracking
  voiceInputStarted: (fieldName: string) => trackEvent({
    event: 'voice_input_started',
    category: 'feature_usage',
    action: 'voice_input',
    label: fieldName
  }),

  voiceInputCompleted: (fieldName: string, transcriptLength: number) => trackEvent({
    event: 'voice_input_complete',
    category: 'feature_usage',
    action: 'voice_input',
    label: fieldName,
    value: transcriptLength
  }),

  voiceInputFailed: (fieldName: string, error: string) => trackEvent({
    event: 'voice_input_failed',
    category: 'error',
    action: 'voice_input',
    label: `${fieldName}: ${error}`
  }),

  // Swipe gesture tracking
  swipeGesture: (direction: 'left' | 'right', stepNumber: number) => trackEvent({
    event: 'swipe_gesture',
    category: 'feature_usage',
    action: 'mobile_gesture',
    label: `${direction}: step_${stepNumber}`
  }),

  // Example template tracking
  exampleTemplateViewed: (questionId: string) => trackEvent({
    event: 'example_template_viewed',
    category: 'feature_usage',
    action: 'example_template',
    label: questionId
  }),

  exampleTemplateCopied: (questionId: string) => trackEvent({
    event: 'example_template_copied',
    category: 'feature_usage',
    action: 'example_template',
    label: questionId
  }),

  // Conditional branching tracking
  businessStageSelected: (stage: string) => trackEvent({
    event: 'business_stage_selected',
    category: 'engagement',
    action: 'conditional_branching',
    label: stage
  }),

  // Progress milestone tracking
  milestoneReached: (milestoneName: string, stepNumber: number) => trackEvent({
    event: 'milestone_reached',
    category: 'engagement',
    action: 'progress',
    label: milestoneName,
    value: stepNumber
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
