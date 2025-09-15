import { NextRequest, NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('=== PDF GENERATION DEBUG ===')
    
    // Test PDF generation
    let pdfError: string | undefined, pdfBuffer: Buffer | undefined
    try {
      const { generatePersonalPlanPDF } = await import('@/lib/enhanced-pdf')
      
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        business_idea: 'Test business idea',
        current_challenges: 'Test challenges',
        immediate_goals: 'Test goals',
        service_interest: ['brand_product'],
        current_tools: 'Test tools',
        generatedDate: new Date().toLocaleDateString('en-GB')
      }
      
      console.log('Generating PDF with test data:', testData)
      pdfBuffer = await generatePersonalPlanPDF(testData)
      console.log('PDF generated successfully, size:', pdfBuffer.length)
      
    } catch (error) {
      pdfError = error instanceof Error ? error.message : 'Unknown error'
      console.error('PDF generation error:', pdfError)
    }
    
    // Test base64 conversion
    let base64Error: string | undefined, base64String: string | undefined
    if (pdfBuffer) {
      try {
        const { getPDFBase64 } = await import('@/lib/enhanced-pdf')
        base64String = getPDFBase64(pdfBuffer)
        console.log('Base64 conversion successful, length:', base64String.length)
      } catch (error) {
        base64Error = error instanceof Error ? error.message : 'Unknown error'
        console.error('Base64 conversion error:', base64Error)
      }
    }
    
    return NextResponse.json({
      success: true,
      pdf: {
        generated: !!pdfBuffer,
        size: pdfBuffer?.length || 0,
        error: pdfError
      },
      base64: {
        converted: !!base64String,
        length: base64String?.length || 0,
        error: base64Error
      }
    })
    
  } catch (error) {
    console.error('PDF debug error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
