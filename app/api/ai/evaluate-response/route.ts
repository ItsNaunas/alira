import { NextRequest, NextResponse } from 'next/server'
import { evaluateResponse } from '@/lib/ai-conversation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, userResponse, context } = body

    if (!question || !userResponse) {
      return NextResponse.json(
        { error: 'Question and userResponse are required' },
        { status: 400 }
      )
    }

    const evaluation = await evaluateResponse(question, userResponse, context)

    return NextResponse.json({ success: true, evaluation })
  } catch (error) {
    console.error('Error evaluating response:', error)
    return NextResponse.json(
      { error: 'Failed to evaluate response' },
      { status: 500 }
    )
  }
}
