import { NextRequest, NextResponse } from 'next/server'
import { saveRequestSchema } from '@/lib/schema'

export async function POST(request: NextRequest) {
  try {
    console.log("=== SAVE API DEBUG ===")
    console.log("SUPABASE_URL present:", !!process.env.SUPABASE_URL)
    console.log("SUPABASE_ANON_KEY present:", !!process.env.SUPABASE_ANON_KEY)
    
    const body = await request.json()
    console.log("Received save request body:", JSON.stringify(body, null, 2))
    
    const validatedData = saveRequestSchema.parse(body)
    console.log("Data validation successful")
    
    // For now, skip database operations and just return success
    // This allows us to test the full flow while we debug Supabase
    console.log("Skipping database operations for now...")
    
    // Generate a mock filename
    const fileName = `${validatedData.lead.businessName}_${new Date().toISOString().split('T')[0]}.pdf`
      .replace(/[^a-zA-Z0-9-_]/g, '_')
    
    console.log("Returning mock success response")
    
    return NextResponse.json({
      success: true,
      lead: {
        id: 'mock-lead-id',
        businessName: validatedData.lead.businessName,
        email: validatedData.lead.email
      },
      businessCase: {
        id: 'mock-business-case-id',
        pdfUrl: `https://example.com/${fileName}`,
        fileName: fileName
      },
      message: "Business case generated successfully (database operations temporarily disabled)"
    })
    
  } catch (error) {
    console.error('Save error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save business case' 
      },
      { status: 500 }
    )
  }
}
