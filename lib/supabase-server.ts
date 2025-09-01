import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side database operations
export const db = {
  // Insert a new lead
  async insertLead(data: any) {
    const { data: lead, error } = await supabase
      .from('leads')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return lead
  },

  // Insert a new business case
  async insertBusinessCase(data: any) {
    const { data: businessCase, error } = await supabase
      .from('business_cases')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return businessCase
  },

  // Track an analytics event
  async trackEvent(name: string, metadata?: any) {
    const { error } = await supabase
      .from('events')
      .insert({
        name,
        metadata,
        user_agent: metadata?.userAgent
      })
    
    if (error) console.error('Failed to track event:', error)
  },

  // Get business case by ID
  async getBusinessCase(id: string) {
    const { data, error } = await supabase
      .from('business_cases')
      .select(`
        *,
        leads (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
}
