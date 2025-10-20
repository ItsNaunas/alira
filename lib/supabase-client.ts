import { createBrowserClient } from '@supabase/ssr'

// Get the correct base URL based on environment
const getURL = () => {
  // Debug: Log what environment variables we have
  if (typeof window !== 'undefined') {
    console.log('🔍 Environment check:', {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    })
  }
  
  // Priority order: NEXT_PUBLIC_SITE_URL > NEXT_PUBLIC_VERCEL_URL > localhost
  let url = process.env.NEXT_PUBLIC_SITE_URL
  
  // If not set, try VERCEL_URL (Vercel auto-sets this)
  if (!url && process.env.NEXT_PUBLIC_VERCEL_URL) {
    url = process.env.NEXT_PUBLIC_VERCEL_URL
  }
  
  // Fallback to localhost for development
  if (!url) {
    url = 'http://localhost:3000'
  }
  
  // Ensure URL has protocol
  if (!url.startsWith('http')) {
    url = `https://${url}`
  }
  
  // Ensure URL has trailing slash
  if (!url.endsWith('/')) {
    url = `${url}/`
  }
  
  console.log('✅ getURL() returning:', url)
  return url
}

// Client-side Supabase client for browser usage
// Uses environment variables from process.env which are exposed to the client
export const createClient = () => createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    }
  }
)

// Auth helpers
export const auth = {
  async signUp(email: string, password: string, fullName: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${getURL()}auth/callback?next=/dashboard`, // Redirect to auth callback, then dashboard
      },
    })
    return { data, error }
  },

  async signIn(email: string, password: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  async signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getUser() {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  async getSession() {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },
}

