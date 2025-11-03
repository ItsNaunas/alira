import 'server-only'
import OpenAI from 'openai'
import { 
  getIndustryContext, 
  ROOT_CAUSE_ANALYSIS_PROMPT, 
  PROBLEM_STATEMENT_GUIDANCE,
  getUKMarketBenchmarks,
  getStageAppropriateTimeline,
  INDUSTRY_METRICS,
  type IndustryType,
  type BusinessStageType
} from './business-case-methodology'
import { getIndustryMetrics } from './industry-questions'

// API key validation
if (!process.env.OPENAI_API_KEY) {
  console.error('[OPENAI] ❌ OPENAI_API_KEY is missing from environment variables!')
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

// Only log in development - no key metadata in production
if (process.env.NODE_ENV === 'development') {
  console.log('[OPENAI] ✅ OPENAI_API_KEY configured')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// ALIRA brand voice tokens
const ALIRA_BRAND_VOICE = `
Clarity over clutter.
Discipline over distraction.
Elegance over noise.
Systems that last.
British English, calm authority, concise structured writing.
`

/**
 * Build enhanced business case prompt with methodology guidance
 */
function buildBusinessCasePrompt(
  industry: IndustryType = 'other',
  stage: BusinessStageType = 'early'
): string {
  const industryContext = getIndustryContext(industry, stage)
  const ukBenchmarks = getUKMarketBenchmarks(industry)
  const industryMetrics = INDUSTRY_METRICS[industry].join(', ')

  return `
You are ALIRA's senior strategy consultant. You MUST actively apply specific business case development frameworks - don't just mention them, demonstrate them. Write with clarity, discipline, and calm authority.

${ALIRA_BRAND_VOICE}

MANDATORY FRAMEWORK APPLICATION:

1. PROBLEM STATEMENT - MUST INCLUDE:
   - Explicit "5 Whys" chain showing root cause progression
   - Quantified impact using UK market benchmarks (${ukBenchmarks})
   - Symptoms vs Root Causes distinction
   
   Format: 
   "Surface symptom: [X]
    Why 1: [Y]
    Why 2: [Z]
    Root Cause: [ACTUAL ROOT]
    Impact: £[AMOUNT] per month lost opportunity, [X]% slower growth"

2. CURRENT STATE ANALYSIS - MUST INCLUDE:
   - Industry-specific context: ${industryContext}
   - Stage-appropriate challenges: ${stage} stage
   - Reference to industry metrics: ${industryMetrics}
   - UK market position context

3. PROPOSED SOLUTION - MUST USE:
   - Impact vs Effort matrix explicitly
   - Each solution must reference which ALIRA service pillar addresses the root cause
   - Timeline based on UK market realities (${stage} stage: ${getStageAppropriateTimeline(stage)})
   - Investment levels using UK pricing: ${ukBenchmarks}

4. EXPECTED OUTCOMES - MUST INCLUDE:
   - Specific metrics from: ${industryMetrics}
   - Comparisons to UK benchmarks: ${ukBenchmarks}
   - Stage-appropriate targets for ${stage} stage

5. RISK ASSESSMENT - MUST APPLY:
   - Risk quantification using opportunity cost
   - Industry-specific risk factors
   - UK regulatory/economic context where relevant

${ROOT_CAUSE_ANALYSIS_PROMPT}

${PROBLEM_STATEMENT_GUIDANCE}

INDUSTRY & STAGE CONTEXT:
${industryContext}

${ukBenchmarks}

Industry-Specific Metrics to Consider: ${industryMetrics}

ALIRA Services:
1. Brand & Product Management - Strategic positioning, market analysis, product development, brand strategy, competitive positioning
2. Content Management - Content strategy, creation, distribution systems, editorial calendars, brand voice development  
3. Digital Solutions & AI Integration - Technology implementation, automation, AI tools, system optimisation, digital transformation

Your role: Generate a business analysis that identifies core challenges (root causes), quantifies impact, and positions ALIRA as the strategic solution provider. This analysis will be used in a structured PDF with 9 sections.

CRITICAL: You MUST show your methodology work. Don't just use it - demonstrate it.

Generate a comprehensive business analysis. Structure the response as a JSON object with the following sections:

{
  "problem_statement": "Core business challenge with root causes and quantified impact (2-3 sentences). MUST: identify root cause (not symptoms), quantify impact (time/cost/opportunity), connect to business outcomes.",
  "root_cause_analysis": {
    "five_whys_chain": ["Surface symptom: [description]", "Why 1: [first level]", "Why 2: [second level]", "Why 3: [third level]", "Why 4: [fourth level]", "Why 5: [fifth level]", "Root Cause: [final root cause]"],
    "root_cause": "Clear statement of the actual root cause identified through 5 Whys analysis",
    "symptoms_vs_causes": [
      {"symptom": "Surface symptom description", "root_cause": "Underlying root cause"}
    ]
  },
  "objectives": ["Primary strategic objective 1 with specific metrics (${industryMetrics})", "Primary strategic objective 2 with metrics", "Primary strategic objective 3 with metrics"],
  "current_state": "Current business position and key challenges (3-4 sentences covering market position, operational status, growth barriers). Reference industry-specific context where relevant.",
  "industry_analysis": {
    "context": "How ${industryContext} applies to this business",
    "benchmarks_comparison": {
      "metric_name": "Current vs UK Benchmark: [comparison]",
      "metric_name_2": "Current vs UK Benchmark: [comparison]"
    },
    "stage_specific_insights": "Stage-appropriate insights for ${stage} stage businesses"
  },
  "proposed_solution": [
    {
      "pillar": "Brand & Product Management|Content Management|Digital Solutions & AI Integration",
      "actions": ["ALIRA service action 1", "ALIRA service action 2", "ALIRA service action 3"],
      "effort": "low|med|high",
      "impact": "low|med|high",
      "timeline": "Implementation timeline (e.g., '2-4 weeks', '1-2 months', '3-6 months') - use UK market realistic timelines",
      "investment": "Investment level (e.g., '£2,000-5,000', '£5,000-10,000', '£10,000+') - use UK market pricing"
    }
  ],
  "expected_outcomes": ["Business outcome 1 with specific metrics (include ${industryMetrics}) and benchmark comparison", "Business outcome 2 with metrics and comparison", "Business outcome 3 with metrics and comparison"],
  "next_steps": ["Immediate action step 1", "Immediate action step 2", "Immediate action step 3"],
  "risk_assessment": "Key risks if challenges are not addressed (2-3 sentences about business impact). Quantify risk impact where possible using opportunity cost.",
  "competitive_advantage": "How ALIRA's systematic approach provides competitive advantage (2-3 sentences about differentiation)",
  "methodology_applied": ["5 Whys", "UK Benchmarking", "Impact vs Effort Matrix", "Industry-Specific Analysis"]
}

CRITICAL REQUIREMENTS:
- Use British English throughout
- PROBLEM STATEMENT: Must identify root cause (use "5 Whys"), not symptoms. Must quantify impact (include numbers: time, cost, opportunity loss). Must connect to business outcomes.
- ROOT_CAUSE_ANALYSIS: MUST include complete 5 Whys chain (minimum 5 levels) showing progression from symptom to root cause. MUST distinguish symptoms from root causes.
- OBJECTIVES: Must be measurable. Include industry-specific metrics (${industryMetrics}) where relevant. Set realistic timelines based on UK market context.
- INDUSTRY_ANALYSIS: MUST compare business metrics to UK benchmarks (${ukBenchmarks}). MUST reference stage-specific insights for ${stage} stage.
- EXPECTED OUTCOMES: Must include specific metrics. MUST compare to UK benchmarks (${ukBenchmarks}) where relevant.
- Stage-Appropriate: Consider ${stage} stage challenges and realistic outcomes for this stage.
- UK Market Context: Use realistic timelines (2-4 weeks for quick wins, 3-6 months for strategic initiatives) and budgets for UK businesses.
- METHODOLOGY_APPLIED: MUST list all frameworks used (e.g., ["5 Whys", "UK Benchmarking", "Impact vs Effort", "Industry Analysis"])
- Position ALIRA as the strategic solution provider
- Focus on clarity, simplicity, and systematic execution
- Provide actionable recommendations that demonstrate ALIRA's expertise
- Maximum 2500 tokens total for comprehensive analysis (increased for methodology sections)
- No placeholders - provide specific, actionable content based on their business
- Maintain professional, authoritative tone
- For effort and impact fields, use exactly: "low", "med", or "high" (not "medium")
- Make recommendations specific to ALIRA's service offerings
- Focus on systematic business development and strategic clarity
`
}

export interface BusinessCaseOutline {
  problem_statement: string
  root_cause_analysis?: {
    five_whys_chain: string[]  // Explicit chain from surface symptom to root cause
    root_cause: string
    symptoms_vs_causes: Array<{ symptom: string; root_cause: string }>
  }
  objectives: string[]
  current_state: string
  industry_analysis?: {
    context: string
    benchmarks_comparison: Record<string, string>
    stage_specific_insights: string
  }
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
  methodology_applied?: string[]  // ["5 Whys", "UK Benchmarking", "Impact vs Effort", etc.]
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

/**
 * Map form data stage to BusinessStageType
 */
function mapStageToBusinessStage(stage?: string): BusinessStageType {
  if (!stage) return 'early'
  
  const stageLower = stage.toLowerCase()
  if (stageLower.includes('idea') || stageLower.includes('concept')) return 'idea'
  if (stageLower.includes('early') || stageLower.includes('startup') || stageLower.includes('start')) return 'early'
  if (stageLower.includes('grow') || stageLower.includes('scal')) return 'growing'
  if (stageLower.includes('establish') || stageLower.includes('mature')) return 'established'
  
  return 'early' // default
}

/**
 * Infer industry type from form data
 */
function inferIndustryFromFormData(formData: any): IndustryType {
  // Check if industry is explicitly provided and matches our types
  if (formData.industry) {
    const industryLower = formData.industry.toLowerCase()
    if (industryLower.includes('saas') || industryLower.includes('software') || industryLower.includes('tech') || industryLower.includes('app')) {
      return 'tech_saas'
    }
    if (industryLower.includes('retail') || industryLower.includes('ecommerce') || industryLower.includes('e-commerce') || industryLower.includes('shop') || industryLower.includes('store')) {
      return 'retail_ecommerce'
    }
    if (industryLower.includes('service') || industryLower.includes('consult') || industryLower.includes('agency')) {
      return 'service'
    }
  }
  
  // Infer from business idea text
  const businessIdea = (formData.businessName || formData.business_idea || formData.notes || '').toLowerCase()
  
  if (businessIdea.includes('app') || businessIdea.includes('software') || businessIdea.includes('saas') || businessIdea.includes('platform') || businessIdea.includes('tool')) {
    return 'tech_saas'
  }
  if (businessIdea.includes('sell') || businessIdea.includes('product') || businessIdea.includes('shop') || businessIdea.includes('store') || businessIdea.includes('retail') || businessIdea.includes('fashion') || businessIdea.includes('clothing')) {
    return 'retail_ecommerce'
  }
  if (businessIdea.includes('service') || businessIdea.includes('consult') || businessIdea.includes('agency') || businessIdea.includes('coach') || businessIdea.includes('freelance')) {
    return 'service'
  }
  
  return 'other'
}

export async function generateBusinessCase(
  formData: any,
  options?: {
    industry?: IndustryType
    stage?: BusinessStageType
  }
): Promise<BusinessCaseOutline> {
  // Debug logging (only in development - no sensitive data)
  if (process.env.NODE_ENV === 'development') {
    console.log("========================================")
    console.log("🚀 OPENAI: generateBusinessCase() CALLED")
    console.log("========================================")
    console.log("Form data received:", JSON.stringify(formData, null, 2))
    console.log("Current timestamp:", new Date().toISOString())
  }
  
  try {
    // Determine industry and stage
    const industry = options?.industry || inferIndustryFromFormData(formData)
    const stage = options?.stage || mapStageToBusinessStage(formData.stage || formData.business_stage)
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Inferred industry: ${industry}, stage: ${stage}`)
    }
    
    // Build enhanced prompt with methodology
    const systemPrompt = buildBusinessCasePrompt(industry, stage)
    
    // Build methodology context from extracted insights (if available)
    const methodologyContext = formData.methodologyContext
    const methodologySection = methodologyContext ? `
METHODOLOGY INSIGHTS FROM CONVERSATION:
- Challenge Keywords Identified: ${methodologyContext.challengeKeywords.join(', ') || 'None'}
- Industry Metrics Mentioned: ${methodologyContext.mentionedMetrics.join(', ') || 'None'}
- Quantified Impacts Found: ${methodologyContext.quantifiedImpacts.map(i => `${i.type}: ${i.value}`).join(', ') || 'None'}
- Root Cause Indicators: ${methodologyContext.rootCauseIndicators.join(', ') || 'None'}

Use these insights to build a more accurate 5 Whys chain. The challenge keywords likely represent symptoms - dig deeper to find root causes.
` : ''

    const rootCausePrompt = formData.rootCausePrompt || ''
    
    const userPrompt = `
Business Information:
- Business Name: ${formData.businessName || formData.business_idea || 'Business concept'}
- Industry: ${formData.industry || industry}
- Stage: ${formData.stage || formData.business_stage || stage}

Challenges & Goals:
- Challenges: ${formData.challenges || formData.current_challenges || 'Not specified'}
- Short-term Goals: ${formData.goalsShort || formData.immediate_goals || 'Not specified'}
- Long-term Goals: ${formData.goalsLong || 'Not specified'}
- Available Resources: ${formData.resources || formData.current_tools || 'Not specified'}

Project Details:
- Budget: ${formData.budget || 'To be determined'}
- Timeline: ${formData.timeline || 'Flexible'}
- Service Focus: ${formData.service || formData.service_interest?.join(', ') || 'General business improvement'}
- Additional Notes: ${formData.notes || formData.business_idea || 'None provided'}

${rootCausePrompt ? `${rootCausePrompt}\n\n` : ''}${methodologySection}
`

    if (process.env.NODE_ENV === 'development') {
      console.log("Making OpenAI API call with retry logic...")
      console.log("User prompt:", userPrompt)
      console.log("Industry:", industry, "Stage:", stage)
    }
    
    const completion = await retryWithBackoff(async () => {
      return await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
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
    
    if (process.env.NODE_ENV === 'development') {
      console.log("OpenAI API call completed successfully")
      console.log("Completion object:", {
        hasChoices: !!completion.choices,
        choicesLength: completion.choices?.length || 0,
        hasContent: !!completion.choices?.[0]?.message?.content
      })
    }

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    if (process.env.NODE_ENV === 'development') {
      console.log("Raw content from OpenAI:", content)
    }
    
    let outline: BusinessCaseOutline
    try {
      outline = JSON.parse(content) as BusinessCaseOutline
      if (process.env.NODE_ENV === 'development') {
        console.log("Parsed outline:", {
          hasProblemStatement: !!outline.problem_statement,
          objectivesCount: outline.objectives?.length || 0,
          solutionsCount: outline.proposed_solution?.length || 0
        })
      }
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

    if (process.env.NODE_ENV === 'development') {
      console.log("AI analysis generated successfully")
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

// AI Plan Summary Generation
const AI_PLAN_SUMMARY_PROMPT = `
You are ALIRA's senior strategy consultant. Generate a concise summary for a business plan.

${ALIRA_BRAND_VOICE}

Generate a summary with:
1. AI Summary (3-4 bullet points) - Key insights about the business
2. Key Challenges (2-3 bullet points) - Main obstacles to address
3. Recommended Next Steps (3-4 bullet points) - Actionable immediate actions

Format your response as JSON:
{
  "ai_summary": ["insight 1", "insight 2", "insight 3"],
  "key_challenges": ["challenge 1", "challenge 2"],
  "recommended_next_steps": ["step 1", "step 2", "step 3"]
}

Requirements:
- Use British English
- Be specific and actionable
- Maximum 150 words total
- No placeholders - use real insights from the business information
`

export interface AIPlanSummary {
  ai_summary: string[]
  key_challenges: string[]
  recommended_next_steps: string[]
}

export async function generateAIPlanSummary(
  businessPlan: BusinessCaseOutline,
  formData: {
    businessName?: string
    challenges?: string
    goalsShort?: string
  }
): Promise<AIPlanSummary> {
  if (process.env.NODE_ENV === 'development') {
    console.log("========================================")
    console.log("🚀 OPENAI: generateAIPlanSummary() CALLED")
    console.log("========================================")
  }

  try {
    const contextPrompt = `
Business: ${formData.businessName || 'Business concept'}
Challenges: ${formData.challenges || 'Not specified'}
Goals: ${formData.goalsShort || 'Not specified'}

Business Plan Context:
- Problem: ${businessPlan.problem_statement}
- Objectives: ${businessPlan.objectives.join(', ')}
- Current State: ${businessPlan.current_state}
- Risk Assessment: ${businessPlan.risk_assessment}
`

    const completion = await retryWithBackoff(async () => {
      return await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: AI_PLAN_SUMMARY_PROMPT
          },
          {
            role: 'user',
            content: contextPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      })
    }, 3, 2000)

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content received from OpenAI for plan summary')
    }

    const summary = JSON.parse(content) as AIPlanSummary

    // Validate structure
    if (!summary.ai_summary || !summary.key_challenges || !summary.recommended_next_steps) {
      throw new Error('Invalid AI plan summary structure from OpenAI')
    }

    if (process.env.NODE_ENV === 'development') {
      console.log("AI plan summary generated successfully")
    }

    return summary
  } catch (error) {
    console.error('OpenAI API error generating plan summary:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    throw new Error(`Failed to generate AI plan summary: ${errorMessage}`)
  }
}
