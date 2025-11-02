import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error('[SUGGESTIONS] ❌ OPENAI_API_KEY is missing')
}

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

interface SuggestionsRequest {
  fieldName: string
  currentValue: string
  businessStage?: 'idea' | 'early' | 'growing' | 'established'
  businessIdea?: string
  industry?: 'tech_saas' | 'retail_ecommerce' | 'service' | 'other'
}

export async function POST(request: NextRequest) {
  try {
    // Fallback to static suggestions if OpenAI is not configured
    if (!openai || !process.env.OPENAI_API_KEY) {
      console.warn('[SUGGESTIONS] OpenAI not configured, returning empty suggestions')
      return NextResponse.json({ suggestions: [] })
    }

    const body: SuggestionsRequest = await request.json()
    const { fieldName, currentValue, businessStage, businessIdea, industry } = body

    // Don't generate suggestions for very short inputs
    if (!currentValue || currentValue.trim().length < 3) {
      return NextResponse.json({ suggestions: [] })
    }

    // Build context-aware prompt
    const systemPrompt = `You are ALIRA's intelligent form assistant. Generate helpful, contextual suggestions to help users complete form fields more effectively. Your suggestions should be:
- Short phrases (3-8 words) that can complete or expand the user's current input
- Relevant to their business stage and industry context
- Actionable and specific, not generic
- Natural continuations of their thought

Return ONLY a JSON array of 3-5 suggestion strings. Example: ["increase revenue by 25%", "automate customer onboarding", "reduce manual data entry"]`

    const contextParts: string[] = []
    
    if (businessIdea) {
      contextParts.push(`Their business idea: ${businessIdea}`)
    }
    
    if (businessStage) {
      const stageLabels: Record<string, string> = {
        idea: 'early idea/concept stage',
        early: 'early stage (just launched or pre-revenue)',
        growing: 'growth stage (revenue coming in, scaling)',
        established: 'established business (mature operations)'
      }
      contextParts.push(`Business stage: ${stageLabels[businessStage] || businessStage}`)
    }
    
    if (industry && industry !== 'other') {
      const industryLabels: Record<string, string> = {
        tech_saas: 'Tech/SaaS business',
        retail_ecommerce: 'Retail/E-commerce business',
        service: 'Service business (consultancy, agency, etc.)'
      }
      contextParts.push(`Industry: ${industryLabels[industry] || industry}`)
    }

    const userPrompt = `Generate smart suggestions for the "${fieldName}" field.

User's current input: "${currentValue}"

${contextParts.length > 0 ? `Context:\n${contextParts.join('\n')}` : ''}

Field type: ${fieldName === 'business_idea' ? 'Business idea/description' : fieldName === 'current_challenges' ? 'Current business challenges/problems' : 'Immediate business goals'}

Generate 3-5 short, actionable suggestions that:
1. Build on or complete what they've typed
2. Are relevant to their ${businessStage || 'business'} stage
3. Help them think deeper about this topic
4. Use their specific context (not generic templates)

Return as JSON array of strings only.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 150,
      response_format: { type: 'json_object' }
    })

    const response = completion.choices[0].message.content
    if (!response) {
      return NextResponse.json({ suggestions: [] })
    }

    try {
      const parsed = JSON.parse(response)
      // Handle both { suggestions: [...] } and direct array formats
      const suggestions = parsed.suggestions || parsed.suggestion || (Array.isArray(parsed) ? parsed : [])
      
      // Ensure suggestions are strings and limit to 5
      const sanitized = Array.isArray(suggestions) 
        ? suggestions
            .slice(0, 5)
            .map(s => typeof s === 'string' ? s.trim() : String(s).trim())
            .filter(s => s.length > 0 && s.length < 100)
        : []

      return NextResponse.json({ suggestions: sanitized })
    } catch (parseError) {
      console.error('[SUGGESTIONS] Error parsing OpenAI response:', parseError)
      return NextResponse.json({ suggestions: [] })
    }
  } catch (error: any) {
    console.error('[SUGGESTIONS] Error generating suggestions:', error)
    // Return empty suggestions on error - don't break the form
    return NextResponse.json({ suggestions: [] })
  }
}

