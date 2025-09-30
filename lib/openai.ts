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

// Universal Business Plan Analysis Prompt
const BUSINESS_CASE_PROMPT = `
You are ALIRA's senior strategy consultant. Create a comprehensive business analysis that works for ANY business type - from fitness apps to streetwear brands to SaaS tools. Write with clarity, discipline, and calm authority.

${ALIRA_BRAND_VOICE}

ALIRA provides three core services:
1. Brand & Product Management - Strategic positioning, market analysis, product development, brand strategy, competitive positioning
2. Content Management - Content strategy, creation, distribution systems, editorial calendars, brand voice development  
3. Digital Solutions & AI Integration - Technology implementation, automation, AI tools, system optimisation, digital transformation

Your role: Generate a universal business analysis that identifies core challenges, opportunities, and positions ALIRA as the strategic solution provider. This analysis will be used in a structured PDF with 9 sections.

Generate a comprehensive business analysis. Structure the response as a JSON object with the following sections:

{
  "problem_statement": "Core business challenge with root causes and impact (2-3 sentences, universal for any business type)",
  "objectives": ["Primary strategic objective 1", "Primary strategic objective 2", "Primary strategic objective 3"],
  "current_state": "Current business position and key challenges (3-4 sentences covering market position, operational status, growth barriers)",
  "proposed_solution": [
    {
      "pillar": "Brand & Product Management|Content Management|Digital Solutions & AI Integration",
      "actions": ["ALIRA service action 1", "ALIRA service action 2", "ALIRA service action 3"],
      "effort": "low|med|high",
      "impact": "low|med|high",
      "timeline": "Implementation timeline (e.g., '2-4 weeks', '1-2 months', '3-6 months')",
      "investment": "Investment level (e.g., '£2,000-5,000', '£5,000-10,000', '£10,000+')"
    }
  ],
  "expected_outcomes": ["Business outcome 1 with metrics", "Business outcome 2 with metrics", "Business outcome 3 with metrics"],
  "next_steps": ["Immediate action step 1", "Immediate action step 2", "Immediate action step 3"],
  "risk_assessment": "Key risks if challenges are not addressed (2-3 sentences about business impact)",
  "competitive_advantage": "How ALIRA's systematic approach provides competitive advantage (2-3 sentences about differentiation)"
}

Requirements:
- Use British English throughout
- Make analysis universal - works for any business type (tech, retail, service, etc.)
- Position ALIRA as the strategic solution provider
- Focus on clarity, simplicity, and systematic execution
- Provide actionable recommendations that demonstrate ALIRA's expertise
- Maximum 2000 tokens total for comprehensive analysis
- No placeholders - provide specific, actionable content based on their business
- Maintain professional, authoritative tone
- For effort and impact fields, use exactly: "low", "med", or "high" (not "medium")
- Make recommendations specific to ALIRA's service offerings
- Focus on systematic business development and strategic clarity
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
    timeline: string
    investment: string
  }>
  expected_outcomes: string[]
  next_steps: string[]
  risk_assessment: string
  competitive_advantage: string
}

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      console.log(`Attempt ${attempt} failed:`, error.message)
      
      // If it's a rate limit error and we have retries left
      if (error.status === 429 && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1) // Exponential backoff
        console.log(`Rate limited. Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      
      // If it's not a rate limit error or we're out of retries, throw
      throw error
    }
  }
  throw new Error('Max retries exceeded')
}

export async function generateBusinessCase(formData: any): Promise<BusinessCaseOutline> {
  console.log("=== OPENAI FUNCTION DEBUG ===")
  console.log("Form data received:", JSON.stringify(formData, null, 2))
  console.log("OpenAI API Key present:", !!process.env.OPENAI_API_KEY)
  console.log("OpenAI API Key length:", process.env.OPENAI_API_KEY?.length || 0)
  console.log("OpenAI API Key starts with sk-:", process.env.OPENAI_API_KEY?.startsWith('sk-') || false)
  
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

    console.log("Making OpenAI API call with retry logic...")
    console.log("User prompt:", userPrompt)
    
    const completion = await retryWithBackoff(async () => {
      return await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
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
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })
    }, 3, 2000) // 3 retries, 2 second base delay
    
    console.log("OpenAI API call completed successfully")
    console.log("Completion object:", {
      hasChoices: !!completion.choices,
      choicesLength: completion.choices?.length || 0,
      hasContent: !!completion.choices?.[0]?.message?.content
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    console.log("Raw content from OpenAI:", content)
    
    let outline: BusinessCaseOutline
    try {
      outline = JSON.parse(content) as BusinessCaseOutline
      console.log("Parsed outline:", {
        hasProblemStatement: !!outline.problem_statement,
        objectivesCount: outline.objectives?.length || 0,
        solutionsCount: outline.proposed_solution?.length || 0
      })
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      console.error("Content that failed to parse:", content)
      throw new Error(`Failed to parse OpenAI response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`)
    }
    
    // Validate the response structure
    if (!outline.problem_statement || !outline.objectives || !outline.proposed_solution) {
      console.error("Invalid response structure:", {
        hasProblemStatement: !!outline.problem_statement,
        hasObjectives: !!outline.objectives,
        hasProposedSolution: !!outline.proposed_solution,
        outline: outline
      })
      throw new Error('Invalid response structure from OpenAI')
    }

    console.log("AI analysis generated successfully")
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
