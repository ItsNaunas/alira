import { NextRequest, NextResponse } from 'next/server'
import { generatePDFBuffer } from '@/lib/pdf'
import { businessCaseOutlineSchema } from '@/lib/schema'

export async function POST(request: NextRequest) {
  try {
    console.log("=== PDF GENERATION API DEBUG ===")
    const body = await request.json()
    console.log("Received body:", JSON.stringify(body, null, 2))
    
    // Validate the business case outline
    console.log("Validating outline...")
    const outline = businessCaseOutlineSchema.parse(body.outline)
    console.log("Outline validation successful")
    
    const businessName = body.businessName
    const contactName = body.contactName
    
    console.log("Business name:", businessName)
    console.log("Contact name:", contactName)
    
    if (!businessName) {
      return NextResponse.json(
        { success: false, error: 'Business name is required' },
        { status: 400 }
      )
    }
    
    // Generate PDF buffer
    console.log("Generating PDF buffer...")
    const pdfBuffer = await generatePDFBuffer(outline, businessName, contactName)
    console.log("PDF buffer generated successfully, length:", pdfBuffer.length)
    
    // Return PDF as binary response
    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${businessName}_${new Date().toISOString().split('T')[0]}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    })
    
  } catch (error) {
    console.error('PDF Generation error:', error)
    
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
        error: 'Failed to generate PDF' 
      },
      { status: 500 }
    )
  }
}
