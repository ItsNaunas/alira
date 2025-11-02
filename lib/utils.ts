import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Answer Quality Evaluation Utilities
export type AnswerQuality = 'needs_more' | 'good' | 'excellent'

export interface AnswerQualityResult {
  quality: AnswerQuality
  remaining: number
  ratio: number
  suggestions: string[]
}

/**
 * Evaluate the quality of a form answer based on length and content
 */
export function evaluateAnswerQuality(
  text: string,
  minChars: number
): AnswerQualityResult {
  const trimmed = text.trim()
  const length = trimmed.length
  const ratio = length / minChars

  let quality: AnswerQuality
  if (ratio < 0.5) {
    quality = 'needs_more'
  } else if (ratio < 1) {
    quality = 'good'
  } else {
    quality = 'excellent'
  }

  const remaining = Math.max(0, minChars - length)
  const suggestions = generateSuggestions(trimmed, minChars)

  return {
    quality,
    remaining,
    ratio,
    suggestions
  }
}

/**
 * Generate contextual suggestions based on answer content
 */
function generateSuggestions(text: string, minChars: number): string[] {
  const suggestions: string[] = []
  const lowerText = text.toLowerCase()

  // Business idea specific suggestions
  if (minChars >= 100) {
    if (!lowerText.includes('customer') && !lowerText.includes('client') && !lowerText.includes('target')) {
      suggestions.push("Consider adding who your target customers are")
    }
    if (!lowerText.includes('problem') && !lowerText.includes('solve') && !lowerText.includes('help')) {
      suggestions.push("Mention what problem your business solves")
    }
    if (!lowerText.includes('unique') && !lowerText.includes('different') && !lowerText.includes('advantage')) {
      suggestions.push("Explain what makes your approach unique")
    }
  }

  // Challenges specific suggestions
  if (text.length > 0 && text.length < minChars * 0.6) {
    suggestions.push(`Add more detail - aim for at least ${minChars} characters`)
  }

  // Goals specific suggestions
  if (minChars >= 80) {
    if (!lowerText.match(/\d+/)) {
      suggestions.push("Include specific numbers or metrics if possible")
    }
    if (!lowerText.includes('month') && !lowerText.includes('week') && !lowerText.includes('timeline')) {
      suggestions.push("Add a timeline for achieving these goals")
    }
  }

  return suggestions
}

/**
 * Get quality indicator color class
 */
export function getQualityColorClass(quality: AnswerQuality): string {
  switch (quality) {
    case 'needs_more':
      return 'text-red-500 dark:text-red-400'
    case 'good':
      return 'text-yellow-600 dark:text-yellow-500'
    case 'excellent':
      return 'text-green-600 dark:text-green-500'
  }
}

/**
 * Get quality indicator label
 */
export function getQualityLabel(quality: AnswerQuality): string {
  switch (quality) {
    case 'needs_more':
      return 'Needs More Detail'
    case 'good':
      return 'Good Start'
    case 'excellent':
      return 'Excellent!'
  }
}