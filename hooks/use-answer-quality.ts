'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { evaluateAnswerQuality, type AnswerQuality } from '@/lib/utils'
import type { BusinessStage } from '@/lib/conditional-questions'

interface UseAnswerQualityOptions {
  fieldName: string
  answer: string
  question?: string
  businessStage?: BusinessStage
  industry?: 'tech_saas' | 'retail_ecommerce' | 'service' | 'other'
  businessIdea?: string
  useAI?: boolean
  debounceMs?: number
}

interface AnswerQualityResult {
  quality: AnswerQuality
  score?: number
  feedback?: string
  suggestions: string[]
  needsQuantification?: boolean
  needsRootCause?: boolean
  isEvaluating?: boolean
}

/**
 * Hook for evaluating answer quality with optional AI enhancement
 */
export function useAnswerQuality({
  fieldName,
  answer,
  question,
  businessStage,
  industry,
  businessIdea,
  useAI = false,
  debounceMs = 800
}: UseAnswerQualityOptions): AnswerQualityResult {
  const [result, setResult] = useState<AnswerQualityResult>({
    quality: 'needs_more',
    suggestions: []
  })
  const [isEvaluating, setIsEvaluating] = useState(false)
  const debounceTimer = useRef<NodeJS.Timeout>()

  const evaluate = useCallback(async () => {
    if (!answer || answer.trim().length < 3) {
      setResult({
        quality: 'needs_more',
        suggestions: ['Start typing your answer'],
        needsQuantification: true,
        needsRootCause: false
      })
      return
    }

    // Use basic evaluation as fallback
    const basicResult = evaluateAnswerQuality(answer, 100)
    
    // If AI is disabled or answer is very short, use basic evaluation
    if (!useAI || answer.trim().length < 20) {
      setResult({
        quality: basicResult.quality,
        suggestions: basicResult.suggestions,
        needsQuantification: basicResult.remaining > 50,
        needsRootCause: false
      })
      return
    }

    // Use AI evaluation for better feedback
    setIsEvaluating(true)
    try {
      const response = await fetch('/api/form/answer-quality', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fieldName,
          answer,
          question,
          businessStage: businessStage || undefined,
          industry: industry || undefined,
          businessIdea: businessIdea || undefined
        }),
      })

      if (!response.ok) {
        throw new Error(`Answer quality API returned ${response.status}`)
      }

      const aiResult = await response.json()
      
      setResult({
        quality: aiResult.quality || basicResult.quality,
        score: aiResult.score,
        feedback: aiResult.feedback,
        suggestions: aiResult.suggestions || basicResult.suggestions,
        needsQuantification: aiResult.needsQuantification ?? false,
        needsRootCause: aiResult.needsRootCause ?? false
      })
    } catch (error) {
      console.error('Error evaluating answer quality with AI, using basic evaluation:', error)
      // Fallback to basic evaluation
      setResult({
        quality: basicResult.quality,
        suggestions: basicResult.suggestions,
        needsQuantification: basicResult.remaining > 50,
        needsRootCause: false
      })
    } finally {
      setIsEvaluating(false)
    }
  }, [fieldName, answer, question, businessStage, industry, businessIdea, useAI])

  // Debounced evaluation
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      evaluate()
    }, debounceMs)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [answer, evaluate, debounceMs])

  return {
    ...result,
    isEvaluating
  }
}

