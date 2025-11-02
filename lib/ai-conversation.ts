import 'server-only'
import OpenAI from 'openai'

// API key validation
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Response evaluation from AI
 */
export interface ResponseEvaluation {
  hasEnoughDetail: boolean
  detailScore: number // 1-10
  followUpQuestion?: string
  reasoning: string
  suggestedImprovements?: string[]
}

/**
 * Evaluates if a user's response has enough detail
 * @param question - The question that was asked
 * @param userResponse - The user's answer
 * @param context - Additional context about the conversation
 * @returns Evaluation with follow-up question if needed
 */
export async function evaluateResponse(
  question: string,
  userResponse: string,
  context?: {
    businessIdea?: string
    previousAnswers?: Record<string, string>
  }
): Promise<ResponseEvaluation> {
  try {
    const systemPrompt = `You are ALIRA's AI conversation assistant. Your role is to evaluate user responses and determine if they provide enough detail to create a comprehensive business plan.

EVALUATION CRITERIA:
- Specificity: Does the answer include concrete details, numbers, or examples?
- Actionability: Can a consultant take action based on this information?
- Completeness: Does it address all aspects of the question?
- Clarity: Is the answer clear and understandable?

SCORING:
- 8-10: Excellent detail, move to next question
- 5-7: Good but could use more detail, ask ONE clarifying follow-up
- 1-4: Too vague, needs substantial clarification

FOLLOW-UP QUESTIONS:
- Be conversational and friendly
- Ask ONE specific follow-up at a time
- Reference their answer to show you're listening
- Make it easy to answer (provide examples if helpful)

Context:
${context?.businessIdea ? `Business Idea: ${context.businessIdea}` : ''}
${context?.previousAnswers ? `Previous Answers: ${JSON.stringify(context.previousAnswers, null, 2)}` : ''}

Return ONLY valid JSON with this structure:
{
  "hasEnoughDetail": boolean,
  "detailScore": number,
  "followUpQuestion": "string or null",
  "reasoning": "brief explanation",
  "suggestedImprovements": ["array", "of", "suggestions"]
}`

    const userPrompt = `Question: "${question}"

User's Response: "${userResponse}"

Evaluate this response and determine if we need a follow-up question.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    })

    const response = completion.choices[0].message.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    const evaluation: ResponseEvaluation = JSON.parse(response)
    
    // Ensure hasEnoughDetail is consistent with detailScore
    if (evaluation.detailScore >= 8) {
      evaluation.hasEnoughDetail = true
      evaluation.followUpQuestion = undefined
    } else if (evaluation.detailScore < 5) {
      evaluation.hasEnoughDetail = false
    }

    return evaluation
  } catch (error) {
    console.error('Error evaluating response:', error)
    
    // Fallback: Accept response if it's longer than 20 characters
    const isLongEnough = userResponse.trim().length > 20
    
    return {
      hasEnoughDetail: isLongEnough,
      detailScore: isLongEnough ? 7 : 3,
      reasoning: 'Fallback evaluation due to AI error',
      followUpQuestion: isLongEnough ? undefined : 'Could you provide a bit more detail about that?'
    }
  }
}

/**
 * Generates an intelligent follow-up question based on context
 * @param originalQuestion - The original question asked
 * @param userResponse - User's response so far
 * @param context - Additional context including business stage, industry, etc.
 * @returns A conversational follow-up question
 */
export async function generateFollowUpQuestion(
  originalQuestion: string,
  userResponse: string,
  context?: {
    specificArea?: string
    businessStage?: 'idea' | 'early' | 'growing' | 'established'
    industry?: 'tech_saas' | 'retail_ecommerce' | 'service' | 'other'
    businessIdea?: string
    previousAnswers?: Record<string, string>
  }
): Promise<string> {
  try {
    const industryExamples = context?.industry ? {
      tech_saas: "Example: If user says 'low sales', probe: 'In SaaS, sales issues usually break down into messaging clarity, channel effectiveness, or conversion. Which do you think is the biggest blocker?'",
      retail_ecommerce: "Example: If user says 'not enough customers', probe: 'Are people finding your products but not buying (conversion issue), or not finding you at all (discovery issue)?'",
      service: "Example: If user says 'not enough clients', probe: 'Are you having trouble attracting leads, or converting inquiries into clients?'",
      other: ""
    }[context.industry] : ""

    const systemPrompt = `You are ALIRA's AI conversation assistant. Generate a single, specific follow-up question using progressive questioning methodology.

PROGRESSIVE QUESTIONING TECHNIQUES:
1. Start broad, then narrow down (funnel approach)
2. Ask "why" to get to root causes (5 Whys technique)
3. Probe for quantification (how much, how often, how many)
4. Uncover hidden challenges (what's not working that they haven't mentioned?)
5. Connect to business outcomes (revenue, growth, efficiency)

${context?.industry ? `Industry Context: ${context.industry}. Use industry-specific terminology and examples.` : ''}
${context?.businessStage ? `Business Stage: ${context.businessStage}. Ask stage-appropriate questions.` : ''}
${industryExamples ? `Industry Example: ${industryExamples}` : ''}

GUIDELINES:
- Be conversational and friendly
- Reference what they already said to show you're listening
- Ask about ONE specific thing
- Use industry-specific examples if applicable
- Probe for root causes, not symptoms (use "5 Whys" approach)
- Ask for numbers when possible (quantify impact)
- Make it easy to answer
- Don't be repetitive

Example:
Original Q: "What are your biggest challenges?"
User: "We're not getting enough customers"
Follow-up: "I see. That usually breaks down into either people not finding you, or finding you but not converting. Which do you think is the bigger issue?"`

    const userPrompt = `Original Question: "${originalQuestion}"
User's Response: "${userResponse}"
${context?.specificArea ? `Focus Area: ${context.specificArea}` : ''}
${context?.businessIdea ? `Business Context: ${context.businessIdea}` : ''}

Generate ONE specific follow-up question that uses progressive questioning to dig deeper:`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 150
    })

    return completion.choices[0].message.content?.trim() || 
      'Could you tell me more about that?'
  } catch (error) {
    console.error('Error generating follow-up:', error)
    return 'Could you provide more details about that?'
  }
}

/**
 * Generates a smooth transition message to the next question
 * @param currentQuestion - The question just completed
 * @param nextQuestion - The next question to ask
 * @param userResponse - User's last response
 * @returns A natural transition message
 */
export async function generateTransition(
  currentQuestion: string,
  nextQuestion: string,
  userResponse: string
): Promise<string> {
  try {
    const systemPrompt = `You are ALIRA's AI conversation assistant. Generate a brief, natural transition message that:
- Acknowledges their previous answer
- Creates a smooth bridge to the next question
- Is 1-2 sentences max
- Sounds conversational and encouraging

Example: "Perfect, that gives me a clear picture of your business! Now let's talk about..."`

    const userPrompt = `Previous question completed: "${currentQuestion}"
User's answer: "${userResponse}"
Next question: "${nextQuestion}"

Generate a brief transition:`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 100
    })

    return completion.choices[0].message.content?.trim() || 
      "Great! Let's move on to the next question."
  } catch (error) {
    console.error('Error generating transition:', error)
    return "Thanks for that! Now, "
  }
}

/**
 * Analyzes if the conversation is ready to generate a business plan
 * @param responses - All user responses so far
 * @returns Whether we have enough information
 */
export async function canGeneratePlan(
  responses: Record<string, string>
): Promise<{
  ready: boolean
  missingAreas?: string[]
  overallQuality: number
}> {
  try {
    const systemPrompt = `You are ALIRA's AI quality checker. Evaluate if we have enough information to create a comprehensive business plan.

REQUIREMENTS:
- Business idea is clearly defined
- Challenges are specific and actionable
- Goals are measurable
- We understand their needs

Return JSON:
{
  "ready": boolean,
  "missingAreas": ["array", "of", "missing", "info"],
  "overallQuality": 1-10
}`

    const userPrompt = `User Responses:
${JSON.stringify(responses, null, 2)}

Can we create a quality business plan with this information?`

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

    return JSON.parse(response)
  } catch (error) {
    console.error('Error checking plan readiness:', error)
    
    // Fallback: Check if all required fields are present
    const required = ['business_idea', 'current_challenges', 'immediate_goals']
    const missing = required.filter(field => !responses[field] || responses[field].length < 20)
    
    return {
      ready: missing.length === 0,
      missingAreas: missing,
      overallQuality: missing.length === 0 ? 7 : 4
    }
  }
}

