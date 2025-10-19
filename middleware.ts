/**
 * Middleware Security Layer (Layer 1 of 3)
 * 
 * This middleware provides route-level authentication protection using an allow-list pattern.
 * It runs on the Edge Runtime for optimal performance.
 * 
 * Security Features:
 * - Automatic session refresh for authenticated users
 * - Protected routes require authentication
 * - Fail-secure: redirects unauthenticated users to homepage
 * - Allow-list pattern (explicit list of protected routes)
 * 
 * Protected Routes:
 * - /dashboard - User dashboard
 * - /form-chat - Conversational form
 * - /results - Results page
 * - /api/generate - AI generation endpoints
 * - /api/draft/* - Draft management endpoints
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Allow-list of protected route patterns
 * Add new protected routes here
 */
const PROTECTED_ROUTES = [
  '/dashboard',
  '/form-chat',
  '/results',
  '/api/generate',
  '/api/draft/create',
  '/api/draft/save',
  '/api/draft/submit',
  '/api/draft/submit-enhanced',
  '/api/generate-plan',
  '/api/ai/generate',
] as const;

/**
 * Check if a pathname matches any protected route pattern
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  // This ensures the session is always up to date
  const { data: { user }, error } = await supabase.auth.getUser()

  // Check if current route requires authentication
  const pathname = request.nextUrl.pathname;
  const requiresAuth = isProtectedRoute(pathname);

  if (requiresAuth) {
    // Fail-secure: If session check fails or user is not authenticated, redirect
    if (error || !user) {
      // For API routes, return 401 instead of redirect
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, error: 'Authentication required', code: 'UNAUTHORIZED' },
          { status: 401 }
        );
      }
      
      // For page routes, redirect to homepage
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Optional: Add user info to headers for API routes to access
    if (pathname.startsWith('/api/')) {
      response.headers.set('x-user-id', user.id);
      response.headers.set('x-user-email', user.email || '');
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

