import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

// ALIRA brand voice tokens
const ALIRA_BRAND_VOICE = `
Clarity over clutter.
Discipline over distraction.
Elegance over noise.
Systems that last.
British English, calm authority, concise structured writing.
`

// Business case generation prompt
const BUSINESS_CASE_PROMPT = `
You are ALIRA's strategy writer. Write with clarity, discipline, and calm authority. Short, precise sentences.

${ALIRA_BRAND_VOICE}

ALIRA provides three core services:
1. Brand & Product Management - Strategic positioning, market analysis, product development
2. Content Management - Content strategy, creation, and distribution systems
3. Digital Solutions & AI Integration - Technology implementation, automation, AI tools

Generate a professional business case based on the provided information. Structure the response as a JSON object with the following sections:

{
  "problem_statement": "Clear, concise problem description based on their challenges",
  "objectives": ["Specific, measurable objective 1", "Specific, measurable objective 2", "Specific, measurable objective 3"],
  "current_state": "Analysis of their current business situation and challenges",
  "proposed_solution": [
    {
      "pillar": "Brand & Product Management|Content Management|Digital Solutions & AI Integration",
      "actions": ["Specific ALIRA service action 1", "Specific ALIRA service action 2", "Specific ALIRA service action 3"],
      "effort": "low|med|high",
      "impact": "low|med|high"
    }
  ],
  "expected_outcomes": ["Specific business outcome 1", "Specific business outcome 2", "Specific business outcome 3"],
  "next_steps": ["Immediate action step 1", "Immediate action step 2", "Immediate action step 3"]
}

Requirements:
- Use British English
- Focus on how ALIRA services can solve their specific challenges
- Make solutions actionable and specific to their business
- Maximum 1200 tokens total
- No placeholders - provide specific, actionable content
- Maintain professional, authoritative tone
- For effort and impact fields, use exactly: "low", "med", or "high" (not "medium")
- Tailor the pillar to their service interests and challenges
- Make actions specific to ALIRA's service offerings
`

export interface BusinessCaseOutline {
  problem_statement: string
  objectives: string[]
  current_state: string
  proposed_solution: Array<{
    pillar: string
    actions: string[]
    effort: 'low' | 'med' | 'medium' | 'high'
    impact: 'low' | 'med' | 'medium' | 'high'
  }>
  expected_outcomes: string[]
  next_steps: string[]
}

export async function generateBusinessCase(formData: any): Promise<BusinessCaseOutline> {
  console.log("=== OPENAI FUNCTION DEBUG ===")
  console.log("Form data received:", JSON.stringify(formData, null, 2))
  console.log("OpenAI API Key present:", !!process.env.OPENAI_API_KEY)
  
  try {
    const userPrompt = `
Business Information:
- Business Name: ${formData.businessName}
- Industry: ${formData.industry}
- Stage: ${formData.stage}

Challenges & Goals:
- Challenges: ${formData.challenges}
- Short-term Goals: ${formData.goalsShort}
- Long-term Goals: ${formData.goalsLong}
- Available Resources: ${formData.resources}

Project Details:
- Budget: ${formData.budget}
- Timeline: ${formData.timeline}
- Service Focus: ${formData.service}
- Additional Notes: ${formData.notes || 'None provided'}
`

    console.log("Making OpenAI API call...")
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: BUSINESS_CASE_PROMPT
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1200,
      response_format: { type: 'json_object' }
    })
    console.log("OpenAI API call completed successfully")

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    const outline = JSON.parse(content) as BusinessCaseOutline
    
    // Validate the response structure
    if (!outline.problem_statement || !outline.objectives || !outline.proposed_solution) {
      throw new Error('Invalid response structure from OpenAI')
    }

    return outline
  } catch (error) {
    console.error('OpenAI API error:', error)
    
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorDetails = {
      message: errorMessage,
      status: (error as any)?.status || 'unknown',
      code: (error as any)?.code || 'unknown',
      type: (error as any)?.type || 'unknown'
    }
    
    console.error('Error details:', errorDetails)
    throw new Error(`Failed to generate business case: ${errorMessage}`)
  }
}
