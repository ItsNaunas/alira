import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'
import { z } from 'zod'

const saveDraftSchema = z.object({
  id: z.string().uuid(),
  step: z.number().min(1).max(4),
  data: z.any() // Form data object
})

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, step, data } = saveDraftSchema.parse(body)

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
      console.error('Error saving draft:', error)
      return NextResponse.json(
        { error: 'Failed to save draft' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      draft
    })
  } catch (error) {
    console.error('Error in save draft API:', error)
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}
