import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params

    if (!token) {
      return NextResponse.json(
        { error: 'Resume token is required' },
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

    if (error || !draft) {
      return NextResponse.json(
        { error: 'Draft not found or expired' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      draft
    })
  } catch (error) {
    console.error('Error in resume draft API:', error)
    return NextResponse.json(
      { error: 'Failed to resume draft' },
      { status: 500 }
    )
  }
}
