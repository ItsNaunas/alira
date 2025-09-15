import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const draftId = searchParams.get('id')
    
    if (!draftId) {
      return NextResponse.json({ error: 'Draft ID required' }, { status: 400 })
    }
    
    console.log('[DEBUG_DRAFT] Fetching draft data for ID:', draftId)
    
    const { data: draft, error } = await supabase
      .from('intake_forms')
      .select('*')
      .eq('id', draftId)
      .single()
    
    if (error) {
      console.error('[DEBUG_DRAFT] Database error:', error)
      return NextResponse.json({ error: 'Database error', details: error }, { status: 500 })
    }
    
    if (!draft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }
    
    console.log('[DEBUG_DRAFT] Draft found:', {
      id: draft.id,
      name: draft.name,
      email: draft.email,
      status: draft.status,
      step: draft.step,
      dataKeys: Object.keys(draft.data || {}),
      data: draft.data
    })
    
    return NextResponse.json({
      success: true,
      draft: {
        id: draft.id,
        name: draft.name,
        email: draft.email,
        status: draft.status,
        step: draft.step,
        data: draft.data,
        dataKeys: Object.keys(draft.data || {}),
        current_challenges: draft.data?.current_challenges,
        immediate_goals: draft.data?.immediate_goals,
        business_idea: draft.data?.business_idea
      }
    })
    
  } catch (error) {
    console.error('[DEBUG_DRAFT] Error:', error)
    return NextResponse.json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
