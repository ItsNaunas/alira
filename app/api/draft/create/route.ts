import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'
import { z } from 'zod'

const createDraftSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  data: z.object({
    mini_idea_one_liner: z.string().optional()
  })
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, data } = createDraftSchema.parse(body)

    // Generate unique resume token
    const resume_token = crypto.randomUUID()

    // Create draft record
    const { data: draft, error } = await supabase
      .from('intake_forms')
      .insert({
        name,
        email,
        data,
        resume_token,
        status: 'draft',
        step: 1
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating draft:', error)
      return NextResponse.json(
        { error: 'Failed to create draft' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      id: draft.id,
      resume_token: draft.resume_token
    })
  } catch (error) {
    console.error('Error in create draft API:', error)
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}
