import { NextRequest, NextResponse } from 'next/server'
import { generatePDFBuffer } from '@/lib/pdf'
import { businessCaseOutlineSchema } from '@/lib/schema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the business case outline
    const outline = businessCaseOutlineSchema.parse(body.outline)
    const businessName = body.businessName
    const contactName = body.contactName
    
    if (!businessName) {
      return NextResponse.json(
        { success: false, error: 'Business name is required' },
        { status: 400 }
      )
    }
    
    // Generate PDF buffer
    const pdfBuffer = await generatePDFBuffer(outline, businessName, contactName)
    
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
