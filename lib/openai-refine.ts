import OpenAI from 'openai'
import { BusinessCaseOutline } from './schema'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// ALIRA brand voice for refinement
const REFINEMENT_SYSTEM_PROMPT = `
You are ALIRA's senior strategy consultant helping refine business plans.

Your role is to improve and enhance existing business analysis while maintaining:
- Clarity over clutter
- Discipline over distraction  
- Elegance over noise
- Systems that last
- British English throughout
- Professional, authoritative tone

When refining content:
1. Preserve the original structure and intent
2. Make improvements specific and actionable
3. Maintain ALIRA's brand voice
4. Be concise and direct
5. Focus on strategic clarity
6. Use British spelling and grammar

You will receive a business plan section and a refinement request.
Return ONLY the improved content as valid JSON with this structure:
{
  "refined_content": {
    "section_name": "improved content here"
  },
  "changes_summary": "Brief description of what was changed and why"
}
`

export interface RefinementRequest {
  currentContent: BusinessCaseOutline
  userMessage: string
  focusSection?: string
  conversationHistory?: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
}

export interface RefinementResponse {
  refined_content: Partial<BusinessCaseOutline>
  changes_summary: string
  affected_sections: string[]
}

/**
 * Refine a business plan based on user feedback
 */
export async function refineBusinessPlan(
  request: RefinementRequest
): Promise<RefinementResponse> {
  const { currentContent, userMessage, focusSection, conversationHistory = [] } = request

  // Build context about the current plan
  const planContext = focusSection && (currentContent as any)[focusSection]
    ? `Current ${focusSection}: ${JSON.stringify((currentContent as any)[focusSection], null, 2)}`
    : `Current Plan: ${JSON.stringify(currentContent, null, 2)}`

  // Build conversation context
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: REFINEMENT_SYSTEM_PROMPT
    }
  ]

  // Add conversation history
  conversationHistory.forEach(msg => {
    messages.push({
      role: msg.role,
      content: msg.content
    })
  })

  // Add current refinement request
  messages.push({
    role: 'user',
    content: `${planContext}\n\nRefinement Request: ${userMessage}\n\n${
      focusSection 
        ? `Focus on improving the ${focusSection} section.` 
        : 'Suggest improvements to the relevant sections.'
    }`
  })

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    const response = JSON.parse(content) as RefinementResponse

    // Ensure required fields exist
    if (!response.refined_content) {
      throw new Error('Invalid response format: missing refined_content')
    }

    // Determine which sections were affected
    const affectedSections = Object.keys(response.refined_content)
    response.affected_sections = affectedSections

    if (!response.changes_summary) {
      response.changes_summary = 'Content refined based on your feedback'
    }

    return response
  } catch (error) {
    console.error('OpenAI refinement error:', error)
    throw new Error(
      `Failed to refine plan: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Quick refinement presets for common requests
 */
export const refinementPresets = {
  'make-shorter': 'Make this more concise while preserving key points',
  'add-detail': 'Add more specific details and actionable steps',
  'more-formal': 'Make the tone more formal and professional',
  'add-metrics': 'Add specific metrics and measurable outcomes',
  'simplify': 'Simplify the language to make it more accessible',
  'expand-solutions': 'Provide more detailed solutions with specific actions',
  'strengthen-outcomes': 'Make the expected outcomes more compelling and specific'
}

/**
 * Get quick refinement suggestions for a section
 */
export function getQuickActions(section: string): string[] {
  const commonActions = [
    'Make this more concise',
    'Add more detail',
    'Add specific metrics'
  ]

  const sectionSpecific: Record<string, string[]> = {
    problem_statement: [
      'Add root cause analysis',
      'Include business impact',
      'Make more compelling'
    ],
    objectives: [
      'Make objectives SMART',
      'Add timeline',
      'Prioritize objectives'
    ],
    proposed_solution: [
      'Add implementation steps',
      'Include resource requirements',
      'Add risk mitigation'
    ],
    expected_outcomes: [
      'Add measurable KPIs',
      'Include timeline',
      'Quantify benefits'
    ],
    next_steps: [
      'Add specific deadlines',
      'Assign responsibilities',
      'Include dependencies'
    ]
  }

  return [...commonActions, ...(sectionSpecific[section] || [])]
}

