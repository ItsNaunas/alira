/**
 * Industry-Specific Question Sets
 * 
 * Provides discovery questions, follow-up questions, metrics focus, and problem patterns
 * tailored to different industry types for enhanced questioning flows.
 */

import type { IndustryType } from './business-case-methodology'

export interface IndustryQuestionSet {
  discoveryQuestions: string[]
  followUpQuestions: string[]
  metricsFocus: string[]
  problemPatterns: string[]
  solutionFrameworks: string[]
}

/**
 * Industry-specific question sets for discovery and follow-up
 */
export const INDUSTRY_QUESTION_SETS: Record<IndustryType, IndustryQuestionSet> = {
  tech_saas: {
    discoveryQuestions: [
      "What problem does your software solve?",
      "Who is your target user? (Be specific: role, company size, pain points)",
      "What makes your solution unique compared to competitors?",
      "How do you acquire customers currently?",
      "What's your pricing model? (subscription, one-time, usage-based)",
      "How do you measure product engagement?",
      "What's your go-to-market strategy?"
    ],
    followUpQuestions: [
      "What's your current MRR and growth rate?",
      "What's your customer acquisition cost (CAC)?",
      "What's your customer lifetime value (LTV)?",
      "What's your monthly churn rate?",
      "How long is your sales cycle?",
      "What percentage of users complete onboarding?",
      "What's your product-market fit score? (if you measure it)",
      "How many active users do you have?"
    ],
    metricsFocus: ['MRR', 'LTV', 'CAC', 'Churn Rate', 'Conversion Rate', 'Activation Rate', 'Net Revenue Retention'],
    problemPatterns: [
      "Low product-market fit (users sign up but don't engage)",
      "High customer churn (users cancel subscriptions)",
      "Inefficient customer acquisition (high CAC, low LTV)",
      "Poor onboarding experience (low activation rate)",
      "Lack of product differentiation (can't compete)",
      "Slow product development (can't ship fast enough)",
      "Technical debt limiting growth (scaling challenges)"
    ],
    solutionFrameworks: [
      "User onboarding optimisation",
      "Customer retention strategies",
      "Product-market fit validation",
      "CAC/LTV optimisation",
      "Feature prioritisation frameworks",
      "Growth marketing systems"
    ]
  },
  retail_ecommerce: {
    discoveryQuestions: [
      "What products do you sell?",
      "Who is your target customer? (Demographics, psychographics, buying behaviour)",
      "Where do you sell? (Online, physical stores, marketplaces like Amazon, Etsy)",
      "How do customers find you?",
      "What's your average order value?",
      "What's your return rate?",
      "How do you handle inventory and fulfilment?"
    ],
    followUpQuestions: [
      "What's your monthly revenue?",
      "What's your average order value (AOV)?",
      "What's your website conversion rate?",
      "What's your inventory turnover rate?",
      "What's your customer acquisition cost (CAC)?",
      "What's your customer lifetime value?",
      "What percentage of customers are repeat buyers?",
      "How do you handle returns and customer service?"
    ],
    metricsFocus: ['AOV', 'Conversion Rate', 'Inventory Turnover', 'CAC', 'Return Rate', 'Customer Lifetime Value', 'Repeat Purchase Rate'],
    problemPatterns: [
      "Low conversion rates (visitors don't buy)",
      "High customer acquisition costs (expensive to get customers)",
      "Inventory management issues (overstock or stockouts)",
      "Poor customer retention (one-time buyers only)",
      "Inefficient fulfilment (slow shipping, high costs)",
      "Low average order value (not maximising customer value)",
      "High return rates (product quality or description issues)"
    ],
    solutionFrameworks: [
      "Conversion rate optimisation",
      "Customer retention systems",
      "Inventory management automation",
      "Fulfilment process optimisation",
      "AOV optimisation strategies",
      "Multi-channel expansion"
    ]
  },
  service: {
    discoveryQuestions: [
      "What services do you offer?",
      "Who is your ideal client? (Industry, company size, role)",
      "How do you deliver your services? (Remote, on-site, hybrid)",
      "How do you acquire clients?",
      "What's your pricing model? (Hourly, project-based, retainer)",
      "How do you measure service quality?",
      "What's your capacity for taking on new clients?"
    ],
    followUpQuestions: [
      "What's your client acquisition cost?",
      "What's your average project margin?",
      "What's your team utilisation rate?",
      "How long is your sales cycle?",
      "What's your client retention rate?",
      "What's your Net Promoter Score (NPS)?",
      "How many hours per week do you bill?",
      "What's your average project value?"
    ],
    metricsFocus: ['Utilization Rate', 'Project Margin', 'Client Acquisition Cost', 'NPS', 'Client Retention Rate', 'Average Project Value'],
    problemPatterns: [
      "Low utilisation rates (team members not billable enough)",
      "Inconsistent client acquisition (feast or famine)",
      "Poor client retention (clients don't return)",
      "Inefficient service delivery (manual processes, no systems)",
      "Lack of service differentiation (competing on price)",
      "Capacity constraints (can't scale without hiring)",
      "Low project margins (pricing or efficiency issues)"
    ],
    solutionFrameworks: [
      "Service standardisation systems",
      "Client acquisition automation",
      "Capacity planning frameworks",
      "Pricing strategy optimisation",
      "Service delivery automation",
      "Client retention systems"
    ]
  },
  other: {
    discoveryQuestions: [
      "What does your business do?",
      "Who is your target customer?",
      "How do you generate revenue?",
      "How do customers find you?",
      "What's your biggest challenge right now?",
      "What would success look like in 6 months?"
    ],
    followUpQuestions: [
      "What's your current revenue?",
      "How many customers do you have?",
      "What's your customer acquisition cost?",
      "What's your main growth constraint?",
      "How do you measure success?",
      "What systems or processes do you have in place?"
    ],
    metricsFocus: ['Revenue Growth', 'Customer Acquisition Cost', 'Conversion Rate', 'Customer Retention', 'Operational Efficiency'],
    problemPatterns: [
      "Unclear business model",
      "Inefficient operations",
      "Poor customer acquisition",
      "Lack of systems and processes",
      "Resource constraints",
      "Market positioning challenges"
    ],
    solutionFrameworks: [
      "Business model clarity",
      "Operational systems",
      "Customer acquisition systems",
      "Process standardisation",
      "Strategic positioning"
    ]
  }
}

/**
 * Get discovery questions for an industry (first-time discovery)
 */
export function getDiscoveryQuestions(industry: IndustryType): string[] {
  return INDUSTRY_QUESTION_SETS[industry]?.discoveryQuestions || INDUSTRY_QUESTION_SETS.other.discoveryQuestions
}

/**
 * Get follow-up questions for an industry (deepening understanding)
 */
export function getFollowUpQuestions(industry: IndustryType): string[] {
  return INDUSTRY_QUESTION_SETS[industry]?.followUpQuestions || INDUSTRY_QUESTION_SETS.other.followUpQuestions
}

/**
 * Get industry-specific metrics to focus on
 */
export function getIndustryMetrics(industry: IndustryType): string[] {
  return INDUSTRY_QUESTION_SETS[industry]?.metricsFocus || INDUSTRY_QUESTION_SETS.other.metricsFocus
}

/**
 * Get common problem patterns for an industry (for hint generation)
 */
export function getProblemPatterns(industry: IndustryType): string[] {
  return INDUSTRY_QUESTION_SETS[industry]?.problemPatterns || INDUSTRY_QUESTION_SETS.other.problemPatterns
}

/**
 * Get solution frameworks relevant to an industry
 */
export function getSolutionFrameworks(industry: IndustryType): string[] {
  return INDUSTRY_QUESTION_SETS[industry]?.solutionFrameworks || INDUSTRY_QUESTION_SETS.other.solutionFrameworks
}

/**
 * Generate industry-specific follow-up question based on user response
 * This can be used by AI to generate contextual follow-ups
 */
export function getContextualFollowUp(
  industry: IndustryType,
  questionId: string,
  userResponse: string
): string | null {
  const questionSet = INDUSTRY_QUESTION_SETS[industry] || INDUSTRY_QUESTION_SETS.other
  
  // Simple keyword matching to suggest relevant follow-ups
  // In practice, this would be enhanced with AI in lib/ai-conversation.ts
  
  const responseLower = userResponse.toLowerCase()
  
  // Check for mentions of specific metrics or problems
  if (questionId === 'current_challenges') {
    // Look for problem pattern keywords
    for (const pattern of questionSet.problemPatterns) {
      const keywords = pattern.toLowerCase().split(' ')
      if (keywords.some(keyword => responseLower.includes(keyword))) {
        // Return a relevant follow-up about that problem area
        return `Can you tell me more about ${pattern.toLowerCase()}?`
      }
    }
  }
  
  // Default: return a generic industry-appropriate follow-up
  return null
}

