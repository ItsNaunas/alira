import 'server-only'
import OpenAI from 'openai'
import { 
  ROOT_CAUSE_ANALYSIS_PROMPT,
  PROBLEM_STATEMENT_GUIDANCE,
  getIndustryContext,
  INDUSTRY_METRICS,
  type IndustryType,
  type BusinessStageType
} from './business-case-methodology'
import { getProblemPatterns } from './industry-questions'

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
    businessStage?: BusinessStageType
    industry?: IndustryType
    businessIdea?: string
    previousAnswers?: Record<string, string>
  }
): Promise<string> {
  try {
    // Get industry context from methodology
    const industryContext = context?.industry 
      ? getIndustryContext(context.industry, context.businessStage || 'early')
      : ''
    
    // Get industry metrics to ask about
    const industryMetrics = context?.industry && context.industry !== 'other'
      ? INDUSTRY_METRICS[context.industry].join(', ')
      : ''
    
    // Get problem patterns for the industry (if challenges question)
    const problemPatterns = context?.industry && context.industry !== 'other'
      ? getProblemPatterns(context.industry)
      : []

    const systemPrompt = `You are ALIRA's senior strategy consultant. Generate a single, insightful follow-up question using proven business case development methodologies.

${ROOT_CAUSE_ANALYSIS_PROMPT}

${PROBLEM_STATEMENT_GUIDANCE}

PROGRESSIVE QUESTIONING METHODOLOGY:
1. Root Cause Analysis (5 Whys): Dig beneath symptoms to find root causes
   - Ask "why" 2-3 times mentally before generating the question
   - Focus on underlying issues, not surface problems
   - Example: If they say "low sales", don't accept that - ask "Why are sales low? Is it awareness, conversion, or retention?"

2. Quantification: Get specific numbers and measurements
   - Ask for metrics: time (hours/days), cost (£/%), volume (customers/units)
   - Quantify impact: "How many hours per week?" "How much does this cost you?"
   - Use industry-specific KPIs: ${industryMetrics || 'general business metrics'}

3. Stage-Appropriate Probing:
   ${context?.businessStage === 'idea' ? '- Focus on validation, market fit, early customer discovery' : ''}
   ${context?.businessStage === 'early' ? '- Focus on process establishment, first customers, basic operations' : ''}
   ${context?.businessStage === 'growing' ? '- Focus on scaling, efficiency, team building, systemization' : ''}
   ${context?.businessStage === 'established' ? '- Focus on optimization, modernization, profit improvement' : ''}

4. Industry-Specific Context:
${industryContext ? industryContext : '- Use general business terminology'}

${problemPatterns.length > 0 && context?.industry ? `\nCommon problem patterns in ${context.industry}: ${problemPatterns.join('; ')}` : ''}

QUESTION GUIDELINES:
- Be conversational, friendly, and supportive
- Reference their answer: "I hear you're dealing with [X]. Let me dig a bit deeper..."
- Ask ONE specific thing at a time
- Probe for root causes, not symptoms
- Ask for quantification when relevant
- Make it easy to answer (provide examples or choices)
- Don't repeat previous questions
- Use UK business context (British English, £, realistic timelines)

Example:
Original Q: "What are your biggest challenges?"
User: "We're not getting enough customers"
Bad follow-up: "Can you tell me more about that?" (too vague)
Good follow-up: "I see. In [industry], customer acquisition issues usually break down into discovery (people not finding you) or conversion (finding you but not buying). Which do you think is the bigger bottleneck right now?" (root cause + quantification)`

    const userPrompt = `Original Question: "${originalQuestion}"
User's Response: "${userResponse}"
${context?.specificArea ? `Focus Area: ${context.specificArea}` : ''}
${context?.businessIdea ? `Business Context: ${context.businessIdea}` : ''}
${context?.previousAnswers ? `Previous Answers (for context): ${JSON.stringify(context.previousAnswers)}` : ''}

Generate ONE specific follow-up question that:
1. Uses "5 Whys" to probe for root causes
2. Asks for quantification where relevant (time, cost, volume)
3. Uses ${context?.industry || 'general'} industry context appropriately
4. Is stage-appropriate for ${context?.businessStage || 'early'} stage
5. References their answer naturally
6. Is easy to answer (provide examples/choices if helpful):`

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

