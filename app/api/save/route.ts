import { NextRequest, NextResponse } from 'next/server'
import { saveRequestSchema } from '@/lib/schema'
import { db, supabase } from '@/lib/supabase-server'

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
    console.log("Attempting to insert lead...")
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
      notes: validatedData.lead.notes,
      consent: validatedData.lead.consent
    })
    console.log("Lead inserted successfully:", lead.id)
    
    // Convert base64 PDF to buffer
    const pdfBuffer = Buffer.from(validatedData.businessCase.pdfBuffer, 'base64')
    
    // Generate filename
    const fileName = `${validatedData.lead.businessName}_${new Date().toISOString().split('T')[0]}.pdf`
      .replace(/[^a-zA-Z0-9-_]/g, '_')
    
    // Upload PDF to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('business-cases')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false
      })
    
    if (uploadError) {
      throw new Error(`Failed to upload PDF: ${uploadError.message}`)
    }
    
    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('business-cases')
      .getPublicUrl(fileName)
    
    // Insert business case record
    const businessCase = await db.insertBusinessCase({
      lead_id: lead.id,
      outline: validatedData.businessCase.outline,
      pdf_url: urlData.publicUrl,
      file_name: fileName,
      status: 'generated'
    })
    
    // Track the save event
    await db.trackEvent('business_case_saved', {
      businessName: validatedData.lead.businessName,
      leadId: lead.id,
      businessCaseId: businessCase.id
    })
    
    return NextResponse.json({
      success: true,
      lead: {
        id: lead.id,
        businessName: validatedData.lead.businessName,
        email: validatedData.lead.email
      },
      businessCase: {
        id: businessCase.id,
        pdfUrl: urlData.publicUrl,
        fileName: fileName
      }
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
