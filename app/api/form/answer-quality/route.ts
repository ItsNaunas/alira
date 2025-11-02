import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error('[ANSWER-QUALITY] ❌ OPENAI_API_KEY is missing')
}

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

interface AnswerQualityRequest {
  fieldName: string
  answer: string
  question?: string
  businessStage?: 'idea' | 'early' | 'growing' | 'established'
  industry?: 'tech_saas' | 'retail_ecommerce' | 'service' | 'other'
  businessIdea?: string
}

interface AnswerQualityResponse {
  quality: 'excellent' | 'good' | 'needs_more'
  score: number // 1-10
  feedback: string
  suggestions: string[]
  needsQuantification?: boolean
  needsRootCause?: boolean
}

export async function POST(request: NextRequest) {
  try {
    // Fallback to basic evaluation if OpenAI is not configured
    if (!openai || !process.env.OPENAI_API_KEY) {
      const body: AnswerQualityRequest = await request.json()
      const length = body.answer?.trim().length || 0
      
      return NextResponse.json({
        quality: length > 150 ? 'good' : length > 50 ? 'needs_more' : 'needs_more',
        score: Math.min(10, Math.max(1, Math.floor(length / 20))),
        feedback: length > 150 ? 'Good length. Consider adding specific details or examples.' : 'Consider adding more detail.',
        suggestions: length < 100 ? ['Add specific examples', 'Include numbers or metrics', 'Explain the impact'] : [],
        needsQuantification: length < 100,
        needsRootCause: false
      } as AnswerQualityResponse)
    }

    const body: AnswerQualityRequest = await request.json()
    const { fieldName, answer, question, businessStage, industry, businessIdea } = body

    if (!answer || answer.trim().length < 3) {
      return NextResponse.json({
        quality: 'needs_more',
        score: 1,
        feedback: 'Please provide an answer to continue.',
        suggestions: ['Start typing your answer'],
        needsQuantification: true,
        needsRootCause: false
      } as AnswerQualityResponse)
    }

    const systemPrompt = `You are ALIRA's quality assessment assistant. Evaluate answer quality using business case development methodologies.

EVALUATION CRITERIA:
1. Specificity: Does it include concrete details, examples, numbers, or metrics?
2. Actionability: Can a consultant take action based on this information?
3. Completeness: Does it address the question comprehensively?
4. Root Cause vs Symptoms: Does it identify root causes (using "5 Whys") or just symptoms?
5. Quantification: Are there specific numbers (time, cost, volume, percentages)?

FIELD-SPECIFIC FOCUS:
- business_idea: Should describe the core concept, target audience, and value proposition
- current_challenges: Should identify root causes, not just symptoms. Should quantify impact.
- immediate_goals: Should be measurable with specific outcomes and timelines

${businessStage ? `Business Stage: ${businessStage}. Expect stage-appropriate depth and focus.` : ''}
${industry && industry !== 'other' ? `Industry: ${industry}. Use industry-specific context in evaluation.` : ''}

Return JSON:
{
  "quality": "excellent" | "good" | "needs_more",
  "score": 1-10,
  "feedback": "Brief, actionable feedback (1-2 sentences)",
  "suggestions": ["suggestion 1", "suggestion 2"],
  "needsQuantification": boolean,
  "needsRootCause": boolean
}`

    const userPrompt = `Field: ${fieldName}
${question ? `Question: "${question}"` : ''}
Answer: "${answer}"
${businessIdea ? `Business Context: ${businessIdea}` : ''}

Evaluate this answer and provide quality assessment:`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 300,
      response_format: { type: 'json_object' }
    })

    const response = completion.choices[0].message.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    try {
      const evaluation: AnswerQualityResponse = JSON.parse(response)
      
      // Validate and sanitize response
      const validQuality = ['excellent', 'good', 'needs_more'].includes(evaluation.quality)
        ? evaluation.quality
        : evaluation.score >= 8 ? 'excellent' : evaluation.score >= 5 ? 'good' : 'needs_more'

      return NextResponse.json({
        quality: validQuality,
        score: Math.max(1, Math.min(10, evaluation.score || 5)),
        feedback: evaluation.feedback || 'Consider adding more detail.',
        suggestions: Array.isArray(evaluation.suggestions) 
          ? evaluation.suggestions.slice(0, 3)
          : [],
        needsQuantification: evaluation.needsQuantification ?? evaluation.score < 6,
        needsRootCause: evaluation.needsRootCause ?? (fieldName === 'current_challenges' && evaluation.score < 7)
      } as AnswerQualityResponse)
    } catch (parseError) {
      console.error('[ANSWER-QUALITY] Error parsing OpenAI response:', parseError)
      // Fallback
      const length = answer.trim().length
      return NextResponse.json({
        quality: length > 150 ? 'good' : 'needs_more',
        score: Math.min(10, Math.max(1, Math.floor(length / 20))),
        feedback: 'Consider adding more specific details.',
        suggestions: ['Add examples', 'Include metrics', 'Be more specific'],
        needsQuantification: length < 100,
        needsRootCause: false
      } as AnswerQualityResponse)
    }
  } catch (error: any) {
    console.error('[ANSWER-QUALITY] Error evaluating answer:', error)
    
    // Fallback evaluation
    const body: AnswerQualityRequest = await request.json().catch(() => ({}))
    const length = body.answer?.trim().length || 0
    
    return NextResponse.json({
      quality: length > 150 ? 'good' : length > 50 ? 'needs_more' : 'needs_more',
      score: Math.min(10, Math.max(1, Math.floor(length / 20))),
      feedback: 'Consider adding more detail.',
      suggestions: ['Add specific examples', 'Include numbers or metrics'],
      needsQuantification: length < 100,
      needsRootCause: false
    } as AnswerQualityResponse)
  }
}

