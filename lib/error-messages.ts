/**
 * User-friendly error messages for the application
 * Provides clear, actionable feedback to users when things go wrong
 */

export const errorMessages = {
  // Network errors
  offline: "You're offline. Please check your internet connection and try again.",
  timeout: "This is taking longer than expected. Please try again in a moment.",
  serverError: "We're experiencing technical difficulties. Please try again in a few moments.",
  networkError: "Network error. Please check your connection and try again.",
  
  // Form validation errors
  required: (fieldName: string) => `Please enter your ${fieldName}`,
  invalidEmail: "Please enter a valid email address",
  passwordTooShort: "Password must be at least 6 characters",
  passwordMismatch: "Passwords do not match",
  
  // Authentication errors
  authFailed: "Email or password incorrect. Please try again.",
  sessionExpired: "Your session has expired. Please log in again to continue.",
  signUpFailed: "Could not create your account. Please try again or contact support.",
  signInFailed: "Could not sign you in. Please check your credentials and try again.",
  notAuthenticated: "Please sign in to access this page.",
  
  // Plan errors
  planNotFound: "We couldn't find that plan. Please return to your dashboard.",
  planLoadFailed: "We couldn't load your plan. Please refresh the page and try again.",
  planSaveFailed: "We couldn't save your changes. Please try again.",
  planGenerationFailed: "We couldn't generate your plan. Please try again or contact support if the problem persists.",
  planDeleteFailed: "We couldn't delete your plan. Please try again.",
  
  // Draft errors
  draftSaveFailed: "We couldn't save your draft. Your progress may not be saved.",
  draftLoadFailed: "We couldn't load your draft. Please try again.",
  
  // Contact form errors
  contactSubmitFailed: "We couldn't send your message. Please try again or email us directly.",
  
  // File errors
  fileUploadFailed: "File upload failed. Please try again.",
  fileTooLarge: "File is too large. Maximum size is 10MB.",
  invalidFileType: "Invalid file type. Please upload a PDF, DOC, or DOCX file.",
  
  // API errors
  badRequest: "Invalid request. Please check your input and try again.",
  unauthorized: "You're not authorized to perform this action.",
  forbidden: "Access denied. You don't have permission to do this.",
  notFound: "The requested resource was not found.",
  
  // Generic errors
  unexpected: "Something unexpected happened. Please try again.",
  unknownError: "An unknown error occurred. Please try again or contact support.",
}

/**
 * Maps error objects to user-friendly messages
 * @param error - The error to map
 * @returns A user-friendly error message
 */
export function getUserFriendlyError(error: unknown): string {
  // Handle Error objects
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    
    // Network errors
    if (message.includes('network') || message.includes('failed to fetch')) {
      return errorMessages.offline
    }
    if (message.includes('timeout')) {
      return errorMessages.timeout
    }
    
    // Server errors
    if (message.includes('500') || message.includes('internal server')) {
      return errorMessages.serverError
    }
    if (message.includes('502') || message.includes('503') || message.includes('504')) {
      return errorMessages.serverError
    }
    
    // Auth errors
    if (message.includes('unauthorized') || message.includes('401')) {
      return errorMessages.notAuthenticated
    }
    if (message.includes('session')) {
      return errorMessages.sessionExpired
    }
    if (message.includes('invalid credentials') || message.includes('invalid login')) {
      return errorMessages.authFailed
    }
    
    // Validation errors
    if (message.includes('invalid email')) {
      return errorMessages.invalidEmail
    }
    if (message.includes('password') && message.includes('short')) {
      return errorMessages.passwordTooShort
    }
    
    // Plan errors
    if (message.includes('plan not found')) {
      return errorMessages.planNotFound
    }
    
    // If it's a clear, user-friendly message already, return it
    if (error.message.length > 10 && error.message.length < 200 && !message.includes('error')) {
      return error.message
    }
    
    return errorMessages.unexpected
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error
  }
  
  // Handle HTTP response errors
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as any
    
    // Check for status code
    if (errorObj.status) {
      const status = errorObj.status
      
      if (status === 400) return errorMessages.badRequest
      if (status === 401) return errorMessages.notAuthenticated
      if (status === 403) return errorMessages.forbidden
      if (status === 404) return errorMessages.notFound
      if (status >= 500) return errorMessages.serverError
    }
    
    // Check for error message property
    if (errorObj.message) {
      return getUserFriendlyError(new Error(errorObj.message))
    }
    
    // Check for error property
    if (errorObj.error) {
      return getUserFriendlyError(errorObj.error)
    }
  }
  
  // Default fallback
  return errorMessages.unknownError
}

/**
 * Logs error details for debugging while showing user-friendly message
 * @param error - The error to log
 * @param context - Optional context about where the error occurred
 * @returns A user-friendly error message
 */
export function logAndFormatError(error: unknown, context?: string): string {
  // Log full error for debugging
  if (context) {
    console.error(`Error in ${context}:`, error)
  } else {
    console.error('Error:', error)
  }
  
  // Return user-friendly message
  return getUserFriendlyError(error)
}

