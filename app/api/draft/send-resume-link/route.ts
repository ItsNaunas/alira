import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Lazy-load clients to avoid build-time errors
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Supabase environment variables are not configured')
  }
  return createClient(url, key)
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('Resend API key is not configured')
  }
  return new Resend(apiKey)
}

export async function POST(request: NextRequest) {
  try {
    const { draftId, email } = await request.json()

    if (!draftId || !email) {
      return NextResponse.json(
        { error: 'Draft ID and email are required' },
        { status: 400 }
      )
    }

    // Get draft to retrieve resume token
    const supabase = getSupabaseClient()
    const { data: draft, error: draftError } = await supabase
      .from('intake_forms')
      .select('resume_token, name')
      .eq('id', draftId)
      .single()

    if (draftError || !draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      )
    }

    if (!draft.resume_token) {
      return NextResponse.json(
        { error: 'Draft does not have a resume token' },
        { status: 400 }
      )
    }

    // Generate resume link
    const resumeLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/form?resume=${draft.resume_token}`

    // Send email
    const resend = getResendClient()
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: 'ALIRA <noreply@alirapartners.co.uk>',
      to: email,
      subject: 'Continue Your Business Plan Form',
      html: `
        <div style="font-family: 'Lato', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a; margin-bottom: 20px;">Don't lose your progress!</h1>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            Hi${draft.name ? ` ${draft.name}` : ''},
          </p>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            We've saved your progress on the business plan form. Click the button below to continue where you left off:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a 
              href="${resumeLink}" 
              style="display: inline-block; padding: 12px 30px; background-color: #d4af37; color: #1a1a1a; text-decoration: none; border-radius: 6px; font-weight: 600;"
            >
              Continue Form
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            Or copy and paste this link into your browser:<br/>
            <a href="${resumeLink}" style="color: #d4af37; word-break: break-all;">${resumeLink}</a>
          </p>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            This link will expire in 30 days. If you have any questions, feel free to reach out to us.
          </p>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 20px;">
            Best regards,<br/>
            The ALIRA Team
          </p>
        </div>
      `
    })

    if (emailError) {
      console.error('Error sending resume link email:', emailError)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messageId: emailResult?.id
    })

  } catch (error: any) {
    console.error('Error in send-resume-link API:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

