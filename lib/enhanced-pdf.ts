import PDFDocument from 'pdfkit'

// ALIRA Brand Colors
const BRAND_COLORS = {
  primary: '#1a1a1a',      // ALIRA Black
  accent: '#d4af37',       // ALIRA Gold
  neutral: '#666666',      // Neutral Gray
  light: '#f8f9fa'         // Light Background
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

// Enhanced PDF generation with professional styling
export function generatePersonalPlanPDF(data: PersonalPlanPDFData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      if (!data) {
        reject(new Error('No data provided for PDF generation'))
        return
      }

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
        resolve(pdfData)
      })

      // Helper function to add section with proper spacing
      const addSection = (title: string, content: string, yPos: number): number => {
        // Section title with gold accent
        doc.fontSize(16)
          .fillColor(BRAND_COLORS.primary)
          .text(title, 50, yPos)
        
        // Gold underline
        doc.rect(50, yPos + 25, 150, 2)
          .fill(BRAND_COLORS.accent)
        
        // Content with proper wrapping
        doc.fontSize(11)
          .fillColor(BRAND_COLORS.neutral)
          .text(content, 50, yPos + 40, {
            width: 500,
            align: 'left',
            lineGap: 3
          })
        
        return yPos + 40 + (doc.heightOfString(content, { width: 500 }) + 30)
      }

      // Header with ALIRA branding
      doc.fontSize(28)
        .fillColor(BRAND_COLORS.primary)
        .text('ALIRA.', 50, 50)
      
      doc.fontSize(12)
        .fillColor(BRAND_COLORS.accent)
        .text('Strategic Business Solutions', 50, 85)

      // Personalized title
      doc.fontSize(18)
        .fillColor(BRAND_COLORS.primary)
        .text(`Personal Business Plan for ${data.name}`, 50, 115)

      // Date
      const generatedDate = data.generatedDate || new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      
      doc.fontSize(10)
        .fillColor(BRAND_COLORS.neutral)
        .text(`Generated on ${generatedDate}`, 50, 145)

      let yPosition = 175

      // Business Overview Section
      yPosition = addSection('Business Overview', data.business_idea || 'No business concept provided', yPosition)
      yPosition += 20

      // Current Challenges Section
      yPosition = addSection('Current Challenges', data.current_challenges || 'No challenges specified', yPosition)
      yPosition += 20

      // Immediate Goals Section
      yPosition = addSection('Immediate Goals (3-6 months)', data.immediate_goals || 'No goals specified', yPosition)
      yPosition += 20

      // Service Interest Section
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

      // Current Tools Section (if provided)
      if (data.current_tools) {
        yPosition = addSection('Current Tools & Systems', data.current_tools, yPosition)
        yPosition += 20
      }

      // Strategic Recommendations Section
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
        .fillColor(BRAND_COLORS.neutral)
        .text('ALIRA. Confidential Business Plan', 50, footerY)
        .text(`Generated for ${data.name}`, 300, footerY)
        .text(generatedDate, 500, footerY)

      doc.end()
    } catch (error) {
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
        resolve(pdfData)
      })

      // Professional header
      doc.fontSize(24)
        .fillColor(BRAND_COLORS.primary)
        .text('ALIRA.', 50, 50)
      
      doc.fontSize(16)
        .fillColor(BRAND_COLORS.accent)
        .text('Business Case Analysis', 50, 85)

      // Add your business case content here
      doc.fontSize(12)
        .fillColor(BRAND_COLORS.neutral)
        .text('Business case content would go here...', 50, 120)

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}
