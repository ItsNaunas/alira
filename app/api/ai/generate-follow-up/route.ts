import { NextRequest, NextResponse } from 'next/server'
import { generateFollowUpQuestion } from '@/lib/ai-conversation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { originalQuestion, userResponse, context } = body

    if (!originalQuestion || !userResponse) {
      return NextResponse.json(
        { error: 'originalQuestion and userResponse are required' },
        { status: 400 }
      )
    }

    const followUpQuestion = await generateFollowUpQuestion(
      originalQuestion,
      userResponse,
      context
    )

    return NextResponse.json({ followUpQuestion })
  } catch (error) {
    console.error('Error generating follow-up question:', error)
    return NextResponse.json(
      { error: 'Failed to generate follow-up question' },
      { status: 500 }
    )
  }
}

