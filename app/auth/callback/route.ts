/**
 * Supabase Auth Callback Route
 * 
 * This route handles the OAuth callback from Supabase after email confirmation
 * or social authentication. It exchanges the auth code for a session and
 * redirects the user to the dashboard.
 * 
 * Flow:
 * 1. User clicks email confirmation link or completes OAuth
 * 2. Supabase redirects to this route with auth code in URL
 * 3. This route exchanges the code for a session
 * 4. User is redirected to dashboard (or specified redirect URL)
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  // Default to homepage instead of dashboard - user can navigate to dashboard manually
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            // Note: We can't set cookies on the request object here
            // They'll be set on the response below
          },
          remove(name: string, options: any) {
            // Note: We can't remove cookies on the request object here
            // They'll be removed on the response below
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Create the response with redirect
      const response = NextResponse.redirect(new URL(next, requestUrl.origin))
      
      // Get the session to set cookies
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // Set auth cookies on the response
        response.cookies.set('sb-access-token', session.access_token, {
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })
        
        response.cookies.set('sb-refresh-token', session.refresh_token, {
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        })
      }
      
      return response
    }
  }

  // If there's an error or no code, redirect to home with error
  return NextResponse.redirect(new URL('/?error=auth_callback_error', requestUrl.origin))
}

