import jsPDF from 'jspdf'

// Safe string helper to prevent undefined/null issues
const safe = (s?: string | null): string => {
  if (!s || typeof s !== 'string') return '—'
  return s.toString().trim() || '—'
}

// PDF Data Interface for Personal Plans
export interface PersonalPlanPDFData {
  name: string
  email: string
  business_idea: string
  current_challenges: string
  immediate_goals: string
  service_interest: string[]
  current_tools?: string
  generatedDate?: string
}

// Enhanced PDF generation with jsPDF (serverless-friendly)
export function generatePersonalPlanPDF(data: PersonalPlanPDFData): Promise<Buffer> {
  try {
    if (!data) {
      throw new Error('No data provided for PDF generation')
    }

    console.log('[PDF] Generating PDF with jsPDF (serverless-friendly)')
    
    // Create PDF document
    const doc = new jsPDF('p', 'mm', 'a4')
    
    // Helper function to add section
    const addSection = (title: string, content: string, yPos: number): number => {
      // Section title
      doc.setFontSize(16)
      doc.setTextColor(26, 26, 26) // #1a1a1a
      doc.text(title, 20, yPos)
      
      // Gold underline
      doc.setDrawColor(212, 175, 55) // #d4af37
      doc.setLineWidth(2)
      doc.line(20, yPos + 5, 170, yPos + 5)
      
      // Content
      doc.setFontSize(11)
      doc.setTextColor(102, 102, 102) // #666666
      
      // Split content into lines that fit the page width
      const maxWidth = 170
      const lines = doc.splitTextToSize(content, maxWidth)
      doc.text(lines, 20, yPos + 15)
      
      return yPos + 15 + (lines.length * 5) + 20
    }

    // Header
    doc.setFontSize(28)
    doc.setTextColor(26, 26, 26) // #1a1a1a
    doc.text('ALIRA.', 20, 30)
    
    doc.setFontSize(12)
    doc.setTextColor(212, 175, 55) // #d4af37
    doc.text('Strategic Business Solutions', 20, 40)

    // Title
    doc.setFontSize(18)
    doc.setTextColor(26, 26, 26) // #1a1a1a
    doc.text(`Personal Business Plan for ${safe(data.name)}`, 20, 55)

    // Date
    const generatedDate = data.generatedDate || new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    
    doc.setFontSize(10)
    doc.setTextColor(102, 102, 102) // #666666
    doc.text(`Generated on ${generatedDate}`, 20, 65)

    let yPosition = 80

    // Sections
    yPosition = addSection('Business Overview', safe(data.business_idea), yPosition)
    yPosition = addSection('Current Challenges', safe(data.current_challenges), yPosition)
    yPosition = addSection('Immediate Goals (3-6 months)', safe(data.immediate_goals), yPosition)

    // Service Interest
    const serviceMap: Record<string, string> = {
      'brand_product': 'Brand & Product Management',
      'content_management': 'Content Management',
      'digital_solutions': 'Digital Solutions & AI Integration'
    }
    
    const selectedServices = data.service_interest?.map((service: string) => 
      serviceMap[service] || service
    ).join(', ') || 'General business improvement'

    yPosition = addSection('Recommended ALIRA Services', selectedServices, yPosition)

    // Current Tools
    if (data.current_tools) {
      yPosition = addSection('Current Tools & Systems', safe(data.current_tools), yPosition)
    }

    // Recommendations
    const recommendations = `Based on your inputs, we recommend focusing on:

1. Strategic Assessment: Comprehensive analysis of your current business position
2. Quick Wins: Identify and implement high-impact, low-effort improvements
3. Resource Optimization: Streamline your current tools and processes
4. Growth Roadmap: Develop a clear 90-day action plan

Next Steps:
• Schedule a consultation call to discuss your specific needs
• Review your current systems and identify optimization opportunities
• Develop a customized implementation roadmap
• Begin with high-impact, quick-win initiatives`

    yPosition = addSection('Strategic Recommendations', recommendations, yPosition)

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(102, 102, 102) // #666666
    doc.text('ALIRA. Confidential Business Plan', 20, 280)
    doc.text(`Generated for ${safe(data.name)}`, 100, 280)
    doc.text(generatedDate, 180, 280)

    // Convert to buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
    console.log('[PDF] PDF generated successfully with jsPDF, size:', pdfBuffer.length, 'bytes')
    
    return Promise.resolve(pdfBuffer)
  } catch (error) {
    console.error('[PDF] Error generating PDF:', error)
    return Promise.reject(error)
  }
}

// Convert PDF to base64 for email attachment
export function getPDFBlob(pdfBuffer: Buffer): Blob {
  const uint8Array = new Uint8Array(pdfBuffer)
  return new Blob([uint8Array], { type: 'application/pdf' })
}

export function getPDFBase64(pdfBuffer: Buffer): string {
  return pdfBuffer.toString('base64')
}

// Enhanced business case PDF (if needed for other use cases)
export function generateBusinessCasePDF(data: any): Promise<Buffer> {
  try {
    console.log('[PDF] Generating business case PDF with jsPDF')
    
    const doc = new jsPDF('p', 'mm', 'a4')
    
    // Simple business case content
    doc.setFontSize(24)
    doc.setTextColor(26, 26, 26) // #1a1a1a
    doc.text('ALIRA.', 20, 30)
    
    doc.setFontSize(16)
    doc.setTextColor(212, 175, 55) // #d4af37
    doc.text('Business Case Analysis', 20, 50)

    doc.setFontSize(12)
    doc.setTextColor(102, 102, 102) // #666666
    doc.text('Business case content would go here...', 20, 70)

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
    console.log('[PDF] Business case PDF generated successfully with jsPDF, size:', pdfBuffer.length, 'bytes')
    
    return Promise.resolve(pdfBuffer)
  } catch (error) {
    console.error('[PDF] Error generating business case PDF:', error)
    return Promise.reject(error)
  }
}
