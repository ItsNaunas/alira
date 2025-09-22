import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    console.log("=== SUPABASE CONNECTION TEST ===")
    console.log("SUPABASE_URL:", process.env.SUPABASE_URL)
    console.log("SUPABASE_ANON_KEY length:", process.env.SUPABASE_ANON_KEY?.length || 0)
    
    // Test basic connection
    const { data, error } = await supabase
      .from('leads')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error("Supabase connection error:", error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      })
    }
    
    console.log("Supabase connection successful")
    return NextResponse.json({
      success: true,
      message: "Supabase connection working",
      data: data
    })
    
  } catch (error) {
    console.error("Supabase test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    })
  }
}
