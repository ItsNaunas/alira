import PDFDocument from 'pdfkit'

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

// Enhanced PDF generation with PDFKit (serverless-friendly)
export function generatePersonalPlanPDF(data: PersonalPlanPDFData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      if (!data) {
        reject(new Error('No data provided for PDF generation'))
        return
      }

      console.log('[PDF] Generating PDF with PDFKit (no external fonts)')
      
      // Create PDF document without specifying font to avoid file system issues
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 60,
          bottom: 60,
          left: 50,
          right: 50
        }
        // Don't specify font - let PDFKit use its default
      })

      const buffers: Buffer[] = []
      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers)
        console.log('[PDF] PDF generated successfully, size:', pdfData.length, 'bytes')
        resolve(pdfData)
      })

      // Helper function to add section
      const addSection = (title: string, content: string, yPos: number): number => {
        // Section title
        doc.fontSize(16)
          .fillColor('#1a1a1a')
          .text(title, 50, yPos)
        
        // Gold underline
        doc.rect(50, yPos + 25, 150, 2)
          .fill('#d4af37')
        
        // Content
        doc.fontSize(11)
          .fillColor('#666666')
          .text(content, 50, yPos + 40, {
            width: 500,
            align: 'left',
            lineGap: 3
          })
        
        return yPos + 40 + (doc.heightOfString(content, { width: 500 }) + 30)
      }

      // Header
      doc.fontSize(28)
        .fillColor('#1a1a1a')
        .text('ALIRA.', 50, 50)
      
      doc.fontSize(12)
        .fillColor('#d4af37')
        .text('Strategic Business Solutions', 50, 85)

      // Title
      doc.fontSize(18)
        .fillColor('#1a1a1a')
        .text(`Personal Business Plan for ${safe(data.name)}`, 50, 115)

      // Date
      const generatedDate = data.generatedDate || new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      
      doc.fontSize(10)
        .fillColor('#666666')
        .text(`Generated on ${generatedDate}`, 50, 145)

      let yPosition = 175

      // Sections
      yPosition = addSection('Business Overview', safe(data.business_idea), yPosition)
      yPosition += 20

      yPosition = addSection('Current Challenges', safe(data.current_challenges), yPosition)
      yPosition += 20

      yPosition = addSection('Immediate Goals (3-6 months)', safe(data.immediate_goals), yPosition)
      yPosition += 20

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
      yPosition += 20

      // Current Tools
      if (data.current_tools) {
        yPosition = addSection('Current Tools & Systems', safe(data.current_tools), yPosition)
        yPosition += 20
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
      const footerY = 750
      doc.fontSize(8)
        .fillColor('#666666')
        .text('ALIRA. Confidential Business Plan', 50, footerY)
        .text(`Generated for ${safe(data.name)}`, 300, footerY)
        .text(generatedDate, 500, footerY)

      doc.end()
    } catch (error) {
      console.error('[PDF] Error generating PDF:', error)
      reject(error)
    }
  })
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
  return new Promise((resolve, reject) => {
    try {
      console.log('[PDF] Generating business case PDF with PDFKit')
      
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 60,
          bottom: 60,
          left: 50,
          right: 50
        }
      })

      const buffers: Buffer[] = []
      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers)
        console.log('[PDF] Business case PDF generated successfully, size:', pdfData.length, 'bytes')
        resolve(pdfData)
      })

      // Simple business case content
      doc.fontSize(24)
        .fillColor('#1a1a1a')
        .text('ALIRA.', 50, 50)
      
      doc.fontSize(16)
        .fillColor('#d4af37')
        .text('Business Case Analysis', 50, 85)

      doc.fontSize(12)
        .fillColor('#666666')
        .text('Business case content would go here...', 50, 120)

      doc.end()
    } catch (error) {
      console.error('[PDF] Error generating business case PDF:', error)
      reject(error)
    }
  })
}
