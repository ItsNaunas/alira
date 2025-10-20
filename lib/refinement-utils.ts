/**
 * Client-safe refinement utilities
 * These can be imported in client components without bundling OpenAI
 */

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
} as const

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

