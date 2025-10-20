import { NextRequest, NextResponse } from 'next/server'
import { generateTransition } from '@/lib/ai-conversation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/ai/generate-transition
 * Generates a smooth transition message to the next question
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { currentQuestion, nextQuestion, userResponse } = body

    if (!currentQuestion || !nextQuestion || !userResponse) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const transition = await generateTransition(currentQuestion, nextQuestion, userResponse)

    return NextResponse.json({
      success: true,
      transition
    })
  } catch (error) {
    console.error('[AI Transition] Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate transition',
        fallback: "Great! Let's continue."
      },
      { status: 500 }
    )
  }
}

