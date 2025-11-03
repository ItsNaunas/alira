/**
 * Business Case Quality Validation
 * 
 * Validates generated business cases against quality standards:
 * - Root cause analysis (not just symptoms)
 * - Quantification (numbers/metrics)
 * - Measurable objectives
 * - Industry-specific metrics
 */

import type { BusinessCaseOutline } from './openai'
import type { IndustryType, BusinessStageType } from './business-case-methodology'
import { INDUSTRY_METRICS } from './business-case-methodology'
import { getIndustryMetrics } from './industry-questions'

export interface QualityCheckResult {
  passed: boolean
  score: number // 1-10
  issues: string[]
  suggestions: string[]
  missingElements: string[]
}

/**
 * Check quality of a generated business case
 */
export function checkBusinessCaseQuality(
  businessCase: BusinessCaseOutline,
  industry?: IndustryType,
  stage?: BusinessStageType
): QualityCheckResult {
  const issues: string[] = []
  const suggestions: string[] = []
  const missingElements: string[] = []
  let score = 10

  // Check problem statement
  if (!businessCase.problem_statement || businessCase.problem_statement.length < 50) {
    issues.push("Problem statement is too vague or short (minimum 50 characters expected)")
    suggestions.push("Expand the problem statement to provide more context and detail")
    score -= 2
  }

  // Check for root cause vs symptoms
  const problemLower = businessCase.problem_statement.toLowerCase()
  const symptomKeywords = ['not getting', 'lack of', 'need more', 'want to', 'don\'t have', 'missing']
  const rootCauseKeywords = ['because', 'root cause', 'underlying', 'systemic', 'due to', 'caused by', 'result of']
  
  const hasSymptoms = symptomKeywords.some(keyword => problemLower.includes(keyword))
  const hasRootCause = rootCauseKeywords.some(keyword => problemLower.includes(keyword))
  
  // If mentions symptoms but not root cause, it's likely describing symptoms
  if (hasSymptoms && !hasRootCause && !problemLower.includes('why')) {
    // Check if it explains causation
    const explainsCausation = problemLower.includes('causes') || problemLower.includes('leads to') || problemLower.includes('results in')
    if (!explainsCausation) {
      issues.push("Problem statement describes symptoms, not root causes")
      suggestions.push("Apply '5 Whys' methodology to identify the underlying root cause. Ask 'why' 5 times to get to the real problem.")
      score -= 1.5
    }
  }

  // Check for quantification (numbers)
  const hasNumbers = /\d+/.test(businessCase.problem_statement)
  if (!hasNumbers) {
    issues.push("Problem statement lacks quantified impact")
    suggestions.push("Include specific numbers: time lost (hours/days), cost (£X per month), or opportunity loss (£X in potential revenue)")
    score -= 1
  } else {
    // Check if numbers are meaningful (not just random numbers)
    const numbers = businessCase.problem_statement.match(/\d+/g) || []
    const hasMonetaryOrTime = businessCase.problem_statement.match(/£|pound|hour|day|week|month|year|percent|%/) || []
    if (numbers.length > 0 && hasMonetaryOrTime.length === 0) {
      suggestions.push("Consider adding context to numbers (e.g., '£500 lost per month' or '5 hours wasted weekly')")
    }
  }

  // Check for connection to business outcomes
  const outcomeKeywords = ['revenue', 'growth', 'efficiency', 'cost', 'profit', 'customer', 'retention', 'conversion']
  const hasOutcomeConnection = outcomeKeywords.some(keyword => problemLower.includes(keyword))
  if (!hasOutcomeConnection && businessCase.problem_statement.length > 100) {
    suggestions.push("Connect the problem to business outcomes (revenue, growth, efficiency, customer satisfaction)")
    score -= 0.5
  }

  // Check objectives
  if (!businessCase.objectives || businessCase.objectives.length < 2) {
    issues.push("Too few objectives specified (minimum 2 expected, recommend 3)")
    suggestions.push("Include at least 2-3 primary strategic objectives")
    score -= 1
  } else {
    businessCase.objectives.forEach((obj, index) => {
      // Check if objectives are measurable
      const hasMetrics = /\d+/.test(obj) || 
                        obj.toLowerCase().includes('increase') || 
                        obj.toLowerCase().includes('reduce') ||
                        obj.toLowerCase().includes('improve') ||
                        obj.toLowerCase().includes('achieve') ||
                        obj.toLowerCase().includes('by')
      
      if (!hasMetrics) {
        issues.push(`Objective ${index + 1} ("${obj.substring(0, 50)}...") is not measurable`)
        suggestions.push("Include specific metrics or targets (e.g., 'increase conversion by 25%' or 'reduce churn to 5%')")
        score -= 0.5
      }
      
      // Check objective length (should be substantive)
      if (obj.length < 20) {
        issues.push(`Objective ${index + 1} is too brief`)
        suggestions.push("Expand objective to include more context and specificity")
        score -= 0.3
      }
    })
  }

  // Check expected outcomes
  if (!businessCase.expected_outcomes || businessCase.expected_outcomes.length < 2) {
    issues.push("Too few expected outcomes specified")
    suggestions.push("Include at least 2-3 expected outcomes with metrics")
    score -= 0.5
  } else {
    businessCase.expected_outcomes.forEach((outcome, index) => {
      // Check if outcomes include metrics
      const hasMetrics = /\d+/.test(outcome) || 
                        outcome.toLowerCase().includes('increase') ||
                        outcome.toLowerCase().includes('reduce') ||
                        outcome.toLowerCase().includes('improve')
      
      if (!hasMetrics) {
        suggestions.push(`Expected outcome ${index + 1} could be more specific with metrics`)
        score -= 0.3
      }
    })
  }

  // Check industry-specific elements
  if (industry && INDUSTRY_METRICS[industry]) {
    const expectedMetrics = INDUSTRY_METRICS[industry]
    const allText = [
      businessCase.problem_statement,
      businessCase.current_state,
      ...businessCase.objectives,
      ...businessCase.expected_outcomes
    ].join(' ').toLowerCase()

    const hasIndustryMetrics = expectedMetrics.some(metric => 
      allText.includes(metric.toLowerCase()) || 
      allText.includes(metric.toLowerCase().replace(' ', ''))
    )

    if (!hasIndustryMetrics) {
      missingElements.push(`Missing industry-specific metrics: ${expectedMetrics.slice(0, 3).join(', ')}`)
      suggestions.push(`Consider including industry-relevant metrics: ${expectedMetrics.slice(0, 3).join(', ')}`)
      score -= 1
    }
  }

  // Check current_state depth
  if (!businessCase.current_state || businessCase.current_state.length < 100) {
    issues.push("Current state description is too brief (minimum 100 characters expected)")
    suggestions.push("Expand current state to provide more context about market position and operational status")
    score -= 0.5
  }

  // Check proposed_solution
  if (!businessCase.proposed_solution || businessCase.proposed_solution.length === 0) {
    issues.push("No proposed solutions provided")
    score -= 2
  } else {
    businessCase.proposed_solution.forEach((solution, index) => {
      if (!solution.actions || solution.actions.length < 2) {
        issues.push(`Proposed solution ${index + 1} has too few actions (minimum 2 expected)`)
        score -= 0.5
      }
      
      // Check for effort/impact consistency (high impact shouldn't be low effort usually, unless it's a quick win)
      if (solution.impact === 'high' && solution.effort === 'low') {
        // This is actually good - it's a quick win. Don't penalize.
      } else if (solution.impact === 'low' && solution.effort === 'high') {
        suggestions.push(`Proposed solution ${index + 1} might need reconsideration - low impact with high effort`)
        score -= 0.3
      }
    })
  }

  // Check risk assessment
  if (!businessCase.risk_assessment || businessCase.risk_assessment.length < 50) {
    issues.push("Risk assessment is too brief")
    suggestions.push("Expand risk assessment to provide more context about business impact")
    score -= 0.5
  } else {
    // Check if risk assessment quantifies impact
    const hasRiskQuantification = /\d+/.test(businessCase.risk_assessment)
    if (!hasRiskQuantification) {
      suggestions.push("Consider quantifying risk impact (e.g., 'could result in £X lost revenue' or 'Y% slower growth')")
    }
  }

  // Check methodology application completeness
  if (!businessCase.methodology_applied || businessCase.methodology_applied.length === 0) {
    missingElements.push("Methodology framework not explicitly applied")
    suggestions.push("Include methodology_applied array listing frameworks used (e.g., ['5 Whys', 'UK Benchmarking', 'Impact vs Effort'])")
    score -= 1
  } else {
    // Check if root cause analysis methodology is mentioned
    const hasRootCauseMethod = businessCase.methodology_applied.some(m => 
      m.toLowerCase().includes('5 whys') || 
      m.toLowerCase().includes('root cause') || 
      m.toLowerCase().includes('why')
    )
    if (!hasRootCauseMethod) {
      suggestions.push("Consider adding '5 Whys' or 'Root Cause Analysis' to methodology_applied")
    }
  }

  // Check root cause analysis section (if available)
  if (businessCase.root_cause_analysis) {
    const rca = businessCase.root_cause_analysis
    
    // Check 5 Whys chain completeness
    if (!rca.five_whys_chain || rca.five_whys_chain.length < 5) {
      issues.push("5 Whys chain is incomplete (expected minimum 5 levels)")
      suggestions.push("Complete the 5 Whys chain from symptom through to root cause (minimum 5 levels)")
      score -= 1.5
    } else if (rca.five_whys_chain.length >= 5) {
      // Validate chain progression
      const hasSymptom = rca.five_whys_chain[0]?.toLowerCase().includes('symptom') || 
                        rca.five_whys_chain[0]?.toLowerCase().includes('surface')
      const hasRootCause = rca.five_whys_chain[rca.five_whys_chain.length - 1]?.toLowerCase().includes('root') ||
                          rca.root_cause
      
      if (!hasSymptom || !hasRootCause) {
        suggestions.push("5 Whys chain should start with surface symptom and end with identified root cause")
        score -= 0.5
      }
    }
    
    // Check root cause summary
    if (!rca.root_cause || rca.root_cause.length < 20) {
      issues.push("Root cause summary is missing or too brief")
      suggestions.push("Provide a clear root cause summary statement")
      score -= 1
    }
    
    // Check symptoms vs causes
    if (!rca.symptoms_vs_causes || rca.symptoms_vs_causes.length === 0) {
      suggestions.push("Consider adding symptoms_vs_causes array to distinguish symptoms from root causes")
      score -= 0.5
    }
  } else {
    // Root cause analysis section is optional but recommended
    suggestions.push("Consider adding root_cause_analysis section with 5 Whys chain for deeper problem understanding")
    score -= 0.5
  }

  // Check industry analysis section (if available)
  if (businessCase.industry_analysis) {
    const ia = businessCase.industry_analysis
    
    // Check benchmark comparisons
    if (!ia.benchmarks_comparison || Object.keys(ia.benchmarks_comparison).length === 0) {
      missingElements.push("Industry benchmark comparisons missing")
      suggestions.push("Include benchmarks_comparison object with UK market benchmark comparisons")
      score -= 1
    } else {
      // Validate benchmark format
      const benchmarkEntries = Object.entries(ia.benchmarks_comparison)
      if (benchmarkEntries.length < 2) {
        suggestions.push("Include at least 2-3 benchmark comparisons for comprehensive industry analysis")
        score -= 0.5
      }
    }
    
    // Check industry context
    if (!ia.context || ia.context.length < 50) {
      suggestions.push("Expand industry context to provide more detailed industry-specific insights")
      score -= 0.3
    }
    
    // Check stage-specific insights
    if (!ia.stage_specific_insights || ia.stage_specific_insights.length < 30) {
      suggestions.push("Include stage_specific_insights for business stage-appropriate recommendations")
      score -= 0.3
    }
  } else {
    // Industry analysis is optional but recommended
    suggestions.push("Consider adding industry_analysis section with benchmark comparisons for industry-relevant insights")
    score -= 0.5
  }

  // Normalize score to 1-10 range
  score = Math.max(1, Math.min(10, score))

  return {
    passed: score >= 7,
    score: Math.round(score * 10) / 10, // Round to 1 decimal place
    issues,
    suggestions,
    missingElements
  }
}

/**
 * Get quality check summary for logging
 */
export function getQualitySummary(result: QualityCheckResult): string {
  const status = result.passed ? 'PASSED' : 'NEEDS IMPROVEMENT'
  return `
Quality Check: ${status} (Score: ${result.score}/10)
${result.issues.length > 0 ? `Issues: ${result.issues.length}` : ''}
${result.suggestions.length > 0 ? `Suggestions: ${result.suggestions.length}` : ''}
${result.missingElements.length > 0 ? `Missing Elements: ${result.missingElements.length}` : ''}
`
}

