import { NextRequest, NextResponse } from 'next/server'
import { evaluateResponse, generateFollowUpQuestion } from '@/lib/ai-conversation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/ai/evaluate-response
 * Evaluates a user's response and determines if follow-up is needed
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, userResponse, context } = body

    // Validation
    if (!question || !userResponse) {
      return NextResponse.json(
        { error: 'Missing required fields: question, userResponse' },
        { status: 400 }
      )
    }

    if (typeof userResponse !== 'string' || userResponse.trim().length < 3) {
      return NextResponse.json(
        { error: 'Response too short' },
        { status: 400 }
      )
    }

    console.log('[AI Evaluate] Evaluating response for question:', question.substring(0, 50))

    // Evaluate the response
    const evaluation = await evaluateResponse(question, userResponse, context)

    console.log('[AI Evaluate] Score:', evaluation.detailScore, '| Enough detail:', evaluation.hasEnoughDetail)

    return NextResponse.json({
      success: true,
      evaluation
    })
  } catch (error) {
    console.error('[AI Evaluate] Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to evaluate response',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

