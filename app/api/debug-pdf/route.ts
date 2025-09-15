import { NextRequest, NextResponse } from 'next/server'
import { generatePersonalPlanPDF } from '@/lib/enhanced-pdf'

export async function GET(request: NextRequest) {
  try {
    console.log('[DEBUG_PDF] Starting PDF generation test')
    
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      business_idea: 'Test business idea for PDF generation',
      current_challenges: 'Test challenges for PDF generation',
      immediate_goals: 'Test goals for PDF generation',
      service_interest: ['brand_product'],
      current_tools: 'Test tools and systems',
      generatedDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
    
    console.log('[DEBUG_PDF] Test data prepared:', testData)
    
    const pdfBuffer = await generatePersonalPlanPDF(testData)
    console.log('[DEBUG_PDF] PDF generated successfully, size:', pdfBuffer.length, 'bytes')
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="debug-test.pdf"',
        'Content-Length': pdfBuffer.length.toString()
      }
    })
    
  } catch (error) {
    console.error('[DEBUG_PDF_ERROR]', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      raw: error
    })
    
    return NextResponse.json({
      success: false,
      error: 'PDF generation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}