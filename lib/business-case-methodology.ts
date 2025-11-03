/**
 * Business Case Development Methodology
 * 
 * Provides industry-specific and stage-aware context for business case development.
 * Integrates with AI prompts and question flows to enhance relevance and quality.
 */

export type IndustryType = 'tech_saas' | 'retail_ecommerce' | 'service' | 'other'
export type BusinessStageType = 'idea' | 'early' | 'growing' | 'established'

/**
 * Industry-specific focus areas by business stage
 */
export function getIndustryContext(industry: IndustryType, stage: BusinessStageType): string {
  const contexts: Record<IndustryType, Record<BusinessStageType, string>> = {
    tech_saas: {
      idea: "Focus on MVP validation, technical feasibility, and initial user acquisition. Common challenges: proving market demand, defining product scope, identifying early adopters.",
      early: "Focus on product-market fit, user onboarding optimisation, churn reduction, and feature prioritisation. Common challenges: low user retention, unclear value proposition, inefficient onboarding.",
      growing: "Focus on scaling infrastructure, expanding user base, optimising CAC/LTV ratios, and international expansion. Common challenges: technical scalability, customer acquisition costs, market expansion strategy.",
      established: "Focus on optimisation, feature diversification, market expansion, and retention strategies. Common challenges: competitive differentiation, market saturation, innovation pipeline."
    },
    retail_ecommerce: {
      idea: "Focus on market research, supplier relationships, pricing strategy, and channel selection. Common challenges: identifying viable products, establishing supplier networks, determining pricing models.",
      early: "Focus on inventory management, customer acquisition, conversion optimisation, and brand positioning. Common challenges: inventory forecasting, customer acquisition cost, website conversion rates.",
      growing: "Focus on supply chain scaling, multi-channel expansion, customer retention, and operational efficiency. Common challenges: inventory turnover, fulfilment efficiency, customer lifetime value.",
      established: "Focus on profit margin optimisation, market expansion, digital transformation, and competitive differentiation. Common challenges: margin pressure, market saturation, omnichannel integration."
    },
    service: {
      idea: "Focus on service definition, pricing models, client acquisition, and delivery systems. Common challenges: defining service offerings, setting competitive pricing, identifying target clients.",
      early: "Focus on service standardisation, client retention, referral systems, and capacity planning. Common challenges: inconsistent service delivery, client acquisition, resource utilisation.",
      growing: "Focus on team scaling, process automation, service diversification, and market positioning. Common challenges: hiring and training, service quality consistency, scaling delivery capacity.",
      established: "Focus on operational excellence, premium positioning, strategic partnerships, and sustainable growth. Common challenges: maintaining service quality at scale, competitive differentiation, innovation."
    },
    other: {
      idea: "Focus on core business development and strategic clarity. Common challenges: defining business model, identifying market opportunity, resource planning.",
      early: "Focus on establishing operational systems and growth foundations. Common challenges: process standardisation, customer acquisition, operational efficiency.",
      growing: "Focus on scaling operations and optimising performance. Common challenges: resource management, market expansion, operational scalability.",
      established: "Focus on optimisation and strategic positioning. Common challenges: maintaining competitive advantage, operational excellence, market leadership."
    }
  }
  
  return contexts[industry]?.[stage] || contexts.other[stage]
}

/**
 * Root Cause Analysis Guidance for AI Prompts
 */
export const ROOT_CAUSE_ANALYSIS_PROMPT = `
Apply root cause analysis techniques when developing problem statements:

1. "5 Whys" Methodology: Ask "why" 5 times to reach the root cause
   - Surface problem: "We're not getting enough customers"
   - Why 1: "Our marketing isn't working"
   - Why 2: "We don't know who our target audience is"
   - Why 3: "We haven't defined our value proposition clearly"
   - Why 4: "We haven't done market research"
   - Why 5: "We rushed to market without proper validation"
   - Root Cause: "Lack of market validation and clear value proposition"

2. Distinguish Symptoms from Root Causes:
   - Symptoms: "Low sales", "High churn", "Slow growth", "Team confusion"
   - Root Causes: "Unclear messaging", "Poor product-market fit", "Inefficient processes", "Lack of systems"

3. Consider Systemic Issues:
   - Not just individual problems, but underlying systems that create problems
   - Example: "Low sales" might be a symptom of "lack of sales process" (systemic)

4. Quantify Impact:
   - Time lost: "X hours per week wasted on..."
   - Cost: "£X per month in lost revenue" or "£X in opportunity cost"
   - Opportunity: "Missing out on £X per month in potential revenue"

5. Connect to Business Outcomes:
   - Revenue: How does this affect income?
   - Growth: How does this limit expansion?
   - Efficiency: How does this waste resources?
   - Customer satisfaction: How does this impact retention?
`

/**
 * Problem Statement Development Guidance
 */
export const PROBLEM_STATEMENT_GUIDANCE = `
A strong problem statement should:

1. Clearly identify the core challenge (not symptoms):
   - Weak: "We're not getting enough customers"
   - Strong: "Our messaging fails to clearly communicate value to our target audience, resulting in low conversion rates"

2. Explain root causes using "5 Whys" analysis:
   - Include the underlying reason, not just the surface issue
   - Show the chain of causation if relevant

3. Quantify impact (time, cost, opportunity loss):
   - Include specific numbers: "£X lost per month", "Y hours wasted weekly", "Z% slower growth"
   - UK market context: Use realistic figures for UK businesses
   - Reference industry benchmarks where appropriate

4. Connect to business outcomes:
   - How does this affect revenue, growth, efficiency, or customer satisfaction?
   - What's the opportunity cost if this isn't addressed?

5. Be specific to their industry and stage:
   - Use industry-appropriate terminology
   - Reference stage-specific challenges
   - Avoid generic consultant-speak

6. UK Market Context:
   - Consider UK business culture (relationship-focused, conservative growth, regulatory environment)
   - Reference UK market dynamics where relevant (e.g., Brexit impacts, UK consumer behaviour)
   - Use realistic timelines and budgets for UK businesses (typically 2-4 weeks for quick wins, 3-6 months for strategic initiatives)
   - Consider UK-specific challenges (data protection, employment law, VAT, etc.)
`

/**
 * Industry-specific KPIs and Metrics
 */
export const INDUSTRY_METRICS: Record<IndustryType, string[]> = {
  tech_saas: ['MRR', 'LTV', 'CAC', 'Churn Rate', 'Conversion Rate', 'Activation Rate', 'Net Revenue Retention'],
  retail_ecommerce: ['AOV', 'Conversion Rate', 'Inventory Turnover', 'CAC', 'Return Rate', 'Customer Lifetime Value', 'Repeat Purchase Rate'],
  service: ['Utilization Rate', 'Project Margin', 'Client Acquisition Cost', 'NPS', 'Client Retention Rate', 'Average Project Value'],
  other: ['Revenue Growth', 'Customer Acquisition Cost', 'Conversion Rate', 'Customer Retention', 'Operational Efficiency']
}

/**
 * UK Market Benchmarks (context for problem quantification)
 */
export const UK_MARKET_BENCHMARKS: Record<Exclude<IndustryType, 'other'>, Record<string, string>> = {
  tech_saas: {
    avgCAC: '£500-2,000',
    avgChurn: '5-10% monthly',
    avgLTV: '£5,000-15,000',
    avgMRRGrowth: '10-20% monthly'
  },
  retail_ecommerce: {
    avgAOV: '£40-80',
    avgConversion: '2-4%',
    avgInventoryTurnover: '4-6x annually',
    avgReturnRate: '5-15%'
  },
  service: {
    avgUtilization: '60-80%',
    avgProjectMargin: '20-40%',
    avgCAC: '£1,000-3,000',
    avgNPS: '30-50'
  }
}

/**
 * Get UK market benchmark context for an industry
 */
export function getUKMarketBenchmarks(industry: IndustryType): string {
  if (industry === 'other') {
    return "Use UK market standards for small to mid-market businesses"
  }
  
  const benchmarks = UK_MARKET_BENCHMARKS[industry]
  if (!benchmarks) {
    return "Use UK market standards for small to mid-market businesses"
  }
  
  const entries = Object.entries(benchmarks).map(([key, value]) => 
    `- ${key.replace(/([A-Z])/g, ' $1').trim()}: ${value}`
  ).join('\n')
  
  return `UK Market Benchmarks for ${industry.replace('_', '/').toUpperCase()}:\n${entries}`
}

/**
 * Get stage-appropriate timeline guidance
 */
export function getStageAppropriateTimeline(stage: BusinessStageType): string {
  const timelines: Record<BusinessStageType, string> = {
    idea: "2-4 weeks for validation and quick wins, 2-3 months for initial setup",
    early: "2-4 weeks for quick wins, 1-2 months for foundational systems, 3-6 months for strategic initiatives",
    growing: "1-2 months for optimization, 3-6 months for scaling initiatives, 6-12 months for expansion",
    established: "1-3 months for optimization, 3-6 months for strategic shifts, 6-12 months for transformation"
  }
  
  return timelines[stage] || timelines.early
}

