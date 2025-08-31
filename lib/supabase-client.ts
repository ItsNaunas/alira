import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Lead {
  id: string
  created_at: string
  business_name: string
  industry?: string
  stage?: string
  challenges?: string
  goals_short?: string
  goals_long?: string
  resources?: string
  budget?: string
  timeline?: string
  service?: string
  contact_name?: string
  email: string
  notes?: string
  consent: boolean
}

export interface BusinessCase {
  id: string
  created_at: string
  lead_id: string
  outline: any
  pdf_url?: string
  status: string
  file_name?: string
}

export interface Event {
  id: number
  created_at: string
  name: string
  metadata?: any
  page_name?: string
  user_agent?: string
}
