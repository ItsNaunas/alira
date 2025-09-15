import PDFDocument from 'pdfkit'
import fs from 'node:fs'
import path from 'node:path'

// ALIRA Brand Colors
const BRAND_COLORS = {
  primary: '#1a1a1a',      // ALIRA Black
  accent: '#d4af37',       // ALIRA Gold
  neutral: '#666666',      // Neutral Gray
  light: '#f8f9fa'         // Light Background
}

// Safe string helper to prevent undefined/null issues
const safe = (s?: string | null): string => {
  if (!s || typeof s !== 'string') return '—'
  return s.toString().trim() || '—'
}

// Font configuration with TTF fallback
const FONT_CONFIG = {
  // Use built-in fonts that don't require external files
  regular: 'Helvetica',
  bold: 'Helvetica-Bold',
  italic: 'Helvetica-Oblique'
}

// Try to register a TTF font if available
function registerTTFFont(doc: PDFDocument): void {
  try {
    // Try to load Inter font from public directory
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Inter-Regular.ttf')
    if (fs.existsSync(fontPath)) {
      const fontBuffer = fs.readFileSync(fontPath)
      doc.registerFont('Inter', fontBuffer)
      FONT_CONFIG.regular = 'Inter'
      FONT_CONFIG.bold = 'Inter'
      console.log('[PDF] Successfully registered Inter TTF font')
    } else {
      console.log('[PDF] Inter TTF font not found, using built-in fonts')
    }
  } catch (error) {
    console.warn('[PDF] Failed to register TTF font, using built-in fonts:', error)
  }
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

      // Register TTF font if available, otherwise use built-in fonts
      registerTTFFont(doc)
      
      // Set the font after registration
      doc.font(FONT_CONFIG.regular)

      const buffers: Buffer[] = []
      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers)
        resolve(pdfData)
      })

      // Helper function to add section with proper spacing
      const addSection = (title: string, content: string, yPos: number): number => {
        // Section title with gold accent
        doc.font(FONT_CONFIG.bold)
          .fontSize(16)
          .fillColor(BRAND_COLORS.primary)
          .text(title, 50, yPos)
        
        // Gold underline
        doc.rect(50, yPos + 25, 150, 2)
          .fill(BRAND_COLORS.accent)
        
        // Content with proper wrapping
        doc.font(FONT_CONFIG.regular)
          .fontSize(11)
          .fillColor(BRAND_COLORS.neutral)
          .text(content, 50, yPos + 40, {
            width: 500,
            align: 'left',
            lineGap: 3
          })
        
        return yPos + 40 + (doc.heightOfString(content, { width: 500 }) + 30)
      }

      // Header with ALIRA branding
      doc.font(FONT_CONFIG.bold)
        .fontSize(28)
        .fillColor(BRAND_COLORS.primary)
        .text('ALIRA.', 50, 50)
      
      doc.font(FONT_CONFIG.regular)
        .fontSize(12)
        .fillColor(BRAND_COLORS.accent)
        .text('Strategic Business Solutions', 50, 85)

      // Personalized title
      doc.font(FONT_CONFIG.bold)
        .fontSize(18)
        .fillColor(BRAND_COLORS.primary)
        .text(`Personal Business Plan for ${safe(data.name)}`, 50, 115)

      // Date
      const generatedDate = data.generatedDate || new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      
      doc.font(FONT_CONFIG.regular)
        .fontSize(10)
        .fillColor(BRAND_COLORS.neutral)
        .text(`Generated on ${generatedDate}`, 50, 145)

      let yPosition = 175

      // Business Overview Section
      yPosition = addSection('Business Overview', safe(data.business_idea), yPosition)
      yPosition += 20

      // Current Challenges Section
      yPosition = addSection('Current Challenges', safe(data.current_challenges), yPosition)
      yPosition += 20

      // Immediate Goals Section
      yPosition = addSection('Immediate Goals (3-6 months)', safe(data.immediate_goals), yPosition)
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
        yPosition = addSection('Current Tools & Systems', safe(data.current_tools), yPosition)
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
      doc.font(FONT_CONFIG.regular)
        .fontSize(8)
        .fillColor(BRAND_COLORS.neutral)
        .text('ALIRA. Confidential Business Plan', 50, footerY)
        .text(`Generated for ${safe(data.name)}`, 300, footerY)
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
        },
        // Use built-in fonts to avoid file system issues
        font: FONT_CONFIG.regular
      })

      const buffers: Buffer[] = []
      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers)
        resolve(pdfData)
      })

      // Professional header
      doc.font(FONT_CONFIG.bold)
        .fontSize(24)
        .fillColor(BRAND_COLORS.primary)
        .text('ALIRA.', 50, 50)
      
      doc.font(FONT_CONFIG.regular)
        .fontSize(16)
        .fillColor(BRAND_COLORS.accent)
        .text('Business Case Analysis', 50, 85)

      // Add your business case content here
      doc.font(FONT_CONFIG.regular)
        .fontSize(12)
        .fillColor(BRAND_COLORS.neutral)
        .text('Business case content would go here...', 50, 120)

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}
