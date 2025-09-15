import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'
import { z } from 'zod'

const saveDraftSchema = z.object({
  id: z.string().uuid(),
  step: z.number().min(1).max(4),
  data: z.any() // Form data object
})

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const { id, data } = body

    if (!id || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: id and data' },
        { status: 400 }
      )
    }

    // Update draft record with form data
    const { data: draft, error } = await supabase
      .from('intake_forms')
      .update({
        data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error saving draft:', error)
      
      // Handle specific database errors
      if (error.code === 'PGRST116') { // Row not found
        return NextResponse.json(
          { error: 'Draft not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to save draft. Please try again.' },
        { status: 500 }
      )
    }

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      draft
    })
  } catch (error) {
    console.error('Error in save draft API:', error)
    
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

export async function PUT(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const { id, step, data } = saveDraftSchema.parse(body)

    // Validate step range
    if (step < 1 || step > 4) {
      return NextResponse.json(
        { error: 'Step must be between 1 and 4' },
        { status: 400 }
      )
    }

    // Update draft record
    const { data: draft, error } = await supabase
      .from('intake_forms')
      .update({
        step,
        data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error saving draft:', error)
      
      // Handle specific database errors
      if (error.code === 'PGRST116') { // Row not found
        return NextResponse.json(
          { error: 'Draft not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to save draft. Please try again.' },
        { status: 500 }
      )
    }

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      draft
    })
  } catch (error) {
    console.error('Error in save draft API:', error)
    
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
