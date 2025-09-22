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
    // Parse and validate request body
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
      console.error('Database error creating draft:', error)
      
      // Handle specific database errors
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'A draft with this email already exists' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to create draft. Please try again.' },
        { status: 500 }
      )
    }

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft was not created successfully' },
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
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      )
    }
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}
