import { NextRequest, NextResponse } from 'next/server'
import { saveRequestSchema } from '@/lib/schema'
import { db } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    console.log("=== SAVE API DEBUG ===")
    console.log("SUPABASE_URL present:", !!process.env.SUPABASE_URL)
    console.log("SUPABASE_ANON_KEY present:", !!process.env.SUPABASE_ANON_KEY)
    
    const body = await request.json()
    console.log("Received save request body:", JSON.stringify(body, null, 2))
    
    const validatedData = saveRequestSchema.parse(body)
    console.log("Data validation successful")
    
    // Insert lead into database
    console.log("Inserting lead into database...")
    const lead = await db.insertLead({
      business_name: validatedData.lead.businessName,
      industry: validatedData.lead.industry,
      stage: validatedData.lead.stage,
      challenges: validatedData.lead.challenges,
      goals_short: validatedData.lead.goalsShort,
      goals_long: validatedData.lead.goalsLong,
      resources: validatedData.lead.resources,
      budget: validatedData.lead.budget,
      timeline: validatedData.lead.timeline,
      service: validatedData.lead.service,
      contact_name: validatedData.lead.contactName,
      email: validatedData.lead.email,
      notes: null
    })
    console.log("Lead inserted:", lead.id)
    
    // Insert business case into database
    console.log("Inserting business case into database...")
    const businessCase = await db.insertBusinessCase({
      lead_id: lead.id,
      outline: validatedData.businessCase.outline,
      status: 'new'
    })
    console.log("Business case inserted:", businessCase.id)
    
    // Generate filename
    const fileName = `${validatedData.lead.businessName}_${new Date().toISOString().split('T')[0]}.pdf`
      .replace(/[^a-zA-Z0-9-_]/g, '_')
    
    console.log("Database operations completed successfully")
    
    return NextResponse.json({
      success: true,
      lead: {
        id: lead.id,
        businessName: validatedData.lead.businessName,
        email: validatedData.lead.email
      },
      businessCase: {
        id: businessCase.id,
        pdfUrl: `https://example.com/${fileName}`,
        fileName: fileName
      },
      message: "Business case generated and saved successfully"
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
