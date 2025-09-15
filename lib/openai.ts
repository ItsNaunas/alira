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

// Enhanced comprehensive business case generation prompt
const BUSINESS_CASE_PROMPT = `
You are ALIRA's senior strategy consultant. Conduct a comprehensive business analysis with precision, authority, and strategic depth. Write with clarity, discipline, and calm authority.

${ALIRA_BRAND_VOICE}

ALIRA provides three core services:
1. Brand & Product Management - Strategic positioning, market analysis, product development, brand strategy, competitive positioning
2. Content Management - Content strategy, creation, distribution systems, editorial calendars, brand voice development
3. Digital Solutions & AI Integration - Technology implementation, automation, AI tools, system optimization, digital transformation

Your role: Conduct a thorough strategic analysis that identifies root causes, expands on business challenges, and positions ALIRA as the definitive solution provider.

Generate a comprehensive business case with detailed analysis. Structure the response as a JSON object with the following sections:

{
  "problem_statement": "Comprehensive problem analysis with root causes, business impact, and urgency assessment (2-3 sentences)",
  "objectives": ["Specific, measurable objective 1 with timeline", "Specific, measurable objective 2 with timeline", "Specific, measurable objective 3 with timeline", "Additional strategic objectives as needed"],
  "current_state": "Detailed analysis of current business situation, including: operational challenges, market position, resource constraints, competitive landscape, and growth barriers (3-4 sentences)",
  "proposed_solution": [
    {
      "pillar": "Brand & Product Management|Content Management|Digital Solutions & AI Integration",
      "actions": ["Specific ALIRA service implementation 1 with expected outcome", "Specific ALIRA service implementation 2 with expected outcome", "Specific ALIRA service implementation 3 with expected outcome", "Additional ALIRA services as needed"],
      "effort": "low|med|high",
      "impact": "low|med|high",
      "timeline": "Specific implementation timeline (e.g., '2-4 weeks', '1-2 months', '3-6 months')",
      "investment": "Estimated investment level (e.g., '£2,000-5,000', '£5,000-10,000', '£10,000+')"
    }
  ],
  "expected_outcomes": ["Specific business outcome 1 with metrics", "Specific business outcome 2 with metrics", "Specific business outcome 3 with metrics", "Additional outcomes as needed"],
  "next_steps": ["Immediate ALIRA engagement step 1", "Immediate ALIRA engagement step 2", "Immediate ALIRA engagement step 3", "Additional engagement steps as needed"],
  "risk_assessment": "Analysis of potential risks if issues are not addressed, including business impact and timeline implications",
  "competitive_advantage": "How ALIRA's approach will provide competitive advantage and market differentiation"
}

Requirements:
- Use British English throughout
- Position ALIRA as the definitive solution provider - use "ALIRA will..." and "Our team will..."
- Expand on each challenge with specific business impact and root causes
- Provide detailed, actionable recommendations that only ALIRA can deliver
- Include specific metrics, timelines, and investment levels where appropriate
- Maximum 2000 tokens total for comprehensive analysis
- No placeholders - provide specific, actionable content based on their business
- Maintain professional, authoritative tone that demonstrates expertise
- For effort and impact fields, use exactly: "low", "med", or "high" (not "medium")
- Make every recommendation specific to ALIRA's unique service offerings
- Include risk assessment and competitive advantage sections
- Focus on how ALIRA's expertise will solve their specific challenges
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

    console.log("Making OpenAI API call...")
    console.log("User prompt:", userPrompt)
    
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
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    })
    
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
