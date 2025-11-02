import { NextRequest, NextResponse } from 'next/server'
import { getServerClient, requireUser } from '@/lib/server/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request)
    const supabase = await getServerClient()

    const body = await request.json()
    const { form_data, current_question_index } = body

    if (!form_data || typeof current_question_index !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: form_data, current_question_index' },
        { status: 400 }
      )
    }

    // Check if draft exists for this user
    const { data: existingDraft } = await supabase
      .from('form_drafts')
      .select('id')
      .eq('user_id', user.id)
      .single()

    let draft
    if (existingDraft) {
      // Update existing draft
      const { data, error } = await supabase
        .from('form_drafts')
        .update({
          form_data,
          current_question_index,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingDraft.id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      draft = data
    } else {
      // Create new draft
      const { data, error } = await supabase
        .from('form_drafts')
        .insert({
          user_id: user.id,
          form_data,
          current_question_index,
        })
        .select()
        .single()

      if (error) throw error
      draft = data
    }

    return NextResponse.json({
      success: true,
      draft: {
        id: draft.id,
        form_data: draft.form_data,
        current_question_index: draft.current_question_index,
        updated_at: draft.updated_at,
      },
    })
  } catch (error: any) {
    console.error('Error saving form draft:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save draft' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request)
    const supabase = await getServerClient()

    // Get the latest draft for this user
    const { data: draft, error } = await supabase
      .from('form_drafts')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is okay
      throw error
    }

    if (!draft) {
      return NextResponse.json({
        success: true,
        draft: null,
      })
    }

    return NextResponse.json({
      success: true,
      draft: {
        id: draft.id,
        form_data: draft.form_data,
        current_question_index: draft.current_question_index,
        updated_at: draft.updated_at,
      },
    })
  } catch (error: any) {
    console.error('Error loading form draft:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to load draft' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireUser(request)
    const supabase = await getServerClient()

    // Delete draft for this user
    const { error } = await supabase
      .from('form_drafts')
      .delete()
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({
      success: true,
    })
  } catch (error: any) {
    console.error('Error deleting form draft:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete draft' },
      { status: 500 }
    )
  }
}

