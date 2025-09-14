import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params

    // Validate token format (basic UUID validation)
    if (!token || typeof token !== 'string' || token.length < 10) {
      return NextResponse.json(
        { error: 'Invalid resume token format' },
        { status: 400 }
      )
    }

    // Get draft by resume token
    const { data: draft, error } = await supabase
      .from('intake_forms')
      .select('*')
      .eq('resume_token', token)
      .eq('status', 'draft')
      .single()

    if (error) {
      console.error('Database error resuming draft:', error)
      
      // Handle specific database errors
      if (error.code === 'PGRST116') { // Row not found
        return NextResponse.json(
          { error: 'Draft not found or expired' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to retrieve draft. Please try again.' },
        { status: 500 }
      )
    }

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found or expired' },
        { status: 404 }
      )
    }

    // Check if draft is too old (optional - could be 7 days)
    const draftAge = Date.now() - new Date(draft.created_at).getTime()
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    
    if (draftAge > maxAge) {
      return NextResponse.json(
        { error: 'Draft has expired. Please start a new form.' },
        { status: 410 } // Gone
      )
    }

    return NextResponse.json({
      success: true,
      draft
    })
  } catch (error) {
    console.error('Error in resume draft API:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}
