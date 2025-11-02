/**
 * Export Plan to Markdown API Route
 * 
 * Protected Route - Requires Authentication
 * 
 * Converts plan content to markdown format for export
 */

import { NextRequest } from 'next/server'
import { requireUser, getServiceClient } from '@/lib/server/auth'
import { handleApiError, successResponse, errors } from '@/lib/server/errors'
import { z } from 'zod'
import { validateOrThrow } from '@/lib/server/validation'

const ExportMarkdownSchema = z.object({
  planId: z.string().uuid('Invalid plan ID')
})

export async function POST(request: NextRequest) {
  try {
    // Step 1: Authenticate user
    const user = await requireUser()
    
    // Step 2: Parse and validate input
    const body = await request.json()
    const { planId } = validateOrThrow(ExportMarkdownSchema, body)

    // Step 3: Get plan and verify ownership
    const supabase = getServiceClient()
    
    const { data: dashboard, error: dashboardError } = await supabase
      .from('dashboards')
      .select(`
        *,
        generations (
          id,
          type,
          content,
          created_at
        )
      `)
      .eq('id', planId)
      .eq('user_id', user.id)
      .single()

    if (dashboardError || !dashboard) {
      throw errors.notFound('Plan not found or access denied')
    }

    if (!dashboard.generations || dashboard.generations.length === 0) {
      throw errors.badRequest('Plan has no content to export')
    }

    // Step 4: Convert plan content to markdown
    const generation = dashboard.generations[0]
    const content = generation.content

    let markdown = `# ${dashboard.business_name || 'Business Plan'}\n\n`
    markdown += `*Generated on ${new Date(generation.created_at).toLocaleDateString('en-GB', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}*\n\n`

    // Problem Statement
    if (content.problem_statement) {
      markdown += `## Problem Statement\n\n${content.problem_statement}\n\n`
    }

    // Objectives
    if (content.objectives && content.objectives.length > 0) {
      markdown += `## Objectives\n\n`
      content.objectives.forEach((objective: string, index: number) => {
        markdown += `${index + 1}. ${objective}\n`
      })
      markdown += `\n`
    }

    // Current State
    if (content.current_state) {
      markdown += `## Current State\n\n${content.current_state}\n\n`
    }

    // Proposed Solution
    if (content.proposed_solution && content.proposed_solution.length > 0) {
      markdown += `## Proposed Solution\n\n`
      content.proposed_solution.forEach((solution: any, index: number) => {
        markdown += `### ${solution.pillar || `Solution ${index + 1}`}\n\n`
        if (solution.effort || solution.impact) {
          markdown += `**Effort:** ${solution.effort || 'N/A'} | **Impact:** ${solution.impact || 'N/A'}\n\n`
        }
        if (solution.actions && solution.actions.length > 0) {
          markdown += `**Actions:**\n`
          solution.actions.forEach((action: string) => {
            markdown += `- ${action}\n`
          })
          markdown += `\n`
        }
        if ((solution as any).timeline) {
          markdown += `**Timeline:** ${(solution as any).timeline}\n\n`
        }
        if ((solution as any).investment) {
          markdown += `**Investment:** ${(solution as any).investment}\n\n`
        }
      })
    }

    // Expected Outcomes
    if (content.expected_outcomes && content.expected_outcomes.length > 0) {
      markdown += `## Expected Outcomes\n\n`
      content.expected_outcomes.forEach((outcome: string) => {
        markdown += `- ${outcome}\n`
      })
      markdown += `\n`
    }

    // Next Steps
    if (content.next_steps && content.next_steps.length > 0) {
      markdown += `## Next Steps\n\n`
      content.next_steps.forEach((step: string, index: number) => {
        markdown += `${index + 1}. ${step}\n`
      })
      markdown += `\n`
    }

    // Risk Assessment (if exists)
    if ((content as any).risk_assessment) {
      markdown += `## Risk Assessment\n\n${(content as any).risk_assessment}\n\n`
    }

    // Competitive Advantage (if exists)
    if ((content as any).competitive_advantage) {
      markdown += `## Competitive Advantage\n\n${(content as any).competitive_advantage}\n\n`
    }

    // Step 5: Return markdown as download
    const filename = `${(dashboard.business_name || 'Business-Plan').replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.md`

    return new Response(markdown, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}

