import { useState, useEffect, useCallback, useRef } from 'react'
import type { BusinessStage } from '@/lib/conditional-questions'

interface Suggestion {
  id: string
  text: string
  category?: string
}

interface UseSmartSuggestionsOptions {
  fieldName: string
  currentValue: string
  businessStage?: BusinessStage
  businessIdea?: string
  industry?: 'tech_saas' | 'retail_ecommerce' | 'service' | 'other'
  debounceMs?: number
}

export function useSmartSuggestions({
  fieldName,
  currentValue,
  businessStage,
  businessIdea,
  industry,
  debounceMs = 500
}: UseSmartSuggestionsOptions) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debounceTimer = useRef<NodeJS.Timeout>()

  // Generate contextual suggestions using AI API
  const generateSuggestions = useCallback(async (value: string) => {
    // Show loading state immediately when user starts typing (after 2 chars)
    if (value.length >= 2 && value.length < 3) {
      setIsLoading(true)
      return
    }
    
    if (!value || value.length < 3) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      // Infer industry from business idea if available
      let inferredIndustry: 'tech_saas' | 'retail_ecommerce' | 'service' | 'other' | undefined = undefined
      if (businessIdea) {
        const ideaLower = businessIdea.toLowerCase()
        if (ideaLower.includes('app') || ideaLower.includes('software') || ideaLower.includes('saas') || ideaLower.includes('platform') || ideaLower.includes('tool') || ideaLower.includes('tech')) {
          inferredIndustry = 'tech_saas'
        } else if (ideaLower.includes('sell') || ideaLower.includes('product') || ideaLower.includes('shop') || ideaLower.includes('store') || ideaLower.includes('retail') || ideaLower.includes('fashion') || ideaLower.includes('clothing') || ideaLower.includes('ecommerce')) {
          inferredIndustry = 'retail_ecommerce'
        } else if (ideaLower.includes('service') || ideaLower.includes('consult') || ideaLower.includes('agency') || ideaLower.includes('coach') || ideaLower.includes('freelance')) {
          inferredIndustry = 'service'
        }
      }

      // Call AI-powered suggestions API
      const response = await fetch('/api/form/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fieldName,
          currentValue: value,
          businessStage: businessStage || undefined,
          businessIdea: businessIdea || undefined,
          industry: inferredIndustry || undefined
        }),
      })

      if (!response.ok) {
        throw new Error(`Suggestions API returned ${response.status}`)
      }

      const data = await response.json()
      
      // Convert array of strings to Suggestion objects
      const aiSuggestions: Suggestion[] = (data.suggestions || []).map((text: string, index: number) => ({
        id: `ai-${index}`,
        text,
        category: 'ai-generated'
      }))

      // If AI returns no suggestions, fall back to static templates
      if (aiSuggestions.length === 0) {
        const fallbackSuggestions = getFieldSuggestions(
          fieldName,
          value,
          businessStage,
          businessIdea
        )
        setSuggestions(fallbackSuggestions.slice(0, 5))
      } else {
        setSuggestions(aiSuggestions)
      }
    } catch (error) {
      console.error('Error generating AI suggestions, falling back to templates:', error)
      // Fallback to static suggestions on error
      const fallbackSuggestions = getFieldSuggestions(
        fieldName,
        value,
        businessStage,
        businessIdea
      )
      setSuggestions(fallbackSuggestions.slice(0, 5))
    } finally {
      setIsLoading(false)
    }
  }, [fieldName, businessStage, businessIdea])

  // Debounced suggestion generation
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      generateSuggestions(currentValue)
    }, debounceMs)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [currentValue, generateSuggestions, debounceMs])

  return { suggestions, isLoading }
}

// Generate suggestions based on field, context, and business stage
function getFieldSuggestions(
  fieldName: string,
  context: string,
  businessStage?: BusinessStage,
  businessIdea?: string
): Suggestion[] {
  const suggestions: Suggestion[] = []
  const lowerContext = context.toLowerCase()

  switch (fieldName) {
    case 'business_idea':
      suggestions.push(
        { id: '1', text: 'targeting [specific audience]', category: 'audience' },
        { id: '2', text: 'helping [target] solve [problem]', category: 'value' },
        { id: '3', text: 'using [technology/method] to [outcome]', category: 'method' },
        { id: '4', text: 'a platform for [use case]', category: 'platform' }
      )
      
      if (lowerContext.includes('agency') || lowerContext.includes('service')) {
        suggestions.push(
          { id: '5', text: 'specializing in [niche]', category: 'niche' },
          { id: '6', text: 'with a focus on [outcome]', category: 'focus' }
        )
      }
      break

    case 'current_challenges':
      const challengeTemplates = {
        idea: [
          'finding product-market fit',
          'validating the business model',
          'identifying target customers',
          'securing initial funding',
          'building the first MVP'
        ],
        early: [
          'establishing consistent processes',
          'managing manual workflows',
          'lack of clear brand positioning',
          'inconsistent customer communication',
          'limited marketing resources'
        ],
        growing: [
          'scaling operations efficiently',
          'maintaining quality while growing',
          'managing increasing customer volume',
          'team alignment and communication',
          'data scattered across multiple tools'
        ],
        established: [
          'streamlining outdated processes',
          'reducing operational inefficiencies',
          'improving profit margins',
          'optimizing existing systems',
          'modernizing legacy workflows'
        ]
      }

      const stageChallenges = challengeTemplates[businessStage || 'early'] || challengeTemplates.early
      
      if (lowerContext.includes('time') || lowerContext.includes('slow')) {
        suggestions.push(
          { id: '1', text: 'automating repetitive tasks', category: 'automation' },
          { id: '2', text: 'streamlining manual processes', category: 'efficiency' }
        )
      } else if (lowerContext.includes('customer') || lowerContext.includes('client')) {
        suggestions.push(
          { id: '3', text: 'improving customer onboarding', category: 'customer' },
          { id: '4', text: 'better customer data management', category: 'data' }
        )
      } else {
        stageChallenges.forEach((challenge, idx) => {
          suggestions.push({
            id: `challenge-${idx}`,
            text: challenge,
            category: 'general'
          })
        })
      }
      break

    case 'immediate_goals':
      const goalTemplates = {
        idea: [
          'validate market demand',
          'get first 10 paying customers',
          'build and launch MVP',
          'establish clear value proposition'
        ],
        early: [
          'increase monthly recurring revenue by 25%',
          'automate key business processes',
          'establish consistent brand identity',
          'improve customer acquisition',
          'reduce manual work by 50%'
        ],
        growing: [
          'double revenue in next 6 months',
          'reduce customer acquisition cost by 30%',
          'scale operations without quality loss',
          'build repeatable sales process',
          'expand to new market segments'
        ],
        established: [
          'increase profit margins by 20%',
          'reduce operational costs by 25%',
          'improve customer lifetime value',
          'modernize technology stack',
          'optimize existing workflows'
        ]
      }

      const stageGoals = goalTemplates[businessStage || 'early'] || goalTemplates.early

      if (lowerContext.includes('grow') || lowerContext.includes('increase')) {
        suggestions.push(
          { id: '1', text: 'increase revenue by [percentage]', category: 'revenue' },
          { id: '2', text: 'grow customer base by [number]', category: 'customers' }
        )
      } else if (lowerContext.includes('automate') || lowerContext.includes('system')) {
        suggestions.push(
          { id: '3', text: 'automate [specific process]', category: 'automation' },
          { id: '4', text: 'implement [specific system]', category: 'systems' }
        )
      } else {
        stageGoals.forEach((goal, idx) => {
          suggestions.push({
            id: `goal-${idx}`,
            text: goal,
            category: 'general'
          })
        })
      }
      break
  }

  return suggestions
}

