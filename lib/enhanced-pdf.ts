import jsPDF from 'jspdf'

// Safe string helper to prevent undefined/null issues
const safe = (s?: string | null): string => {
  if (!s || typeof s !== 'string') return '—'
  return s.toString().trim() || '—'
}

// Import the AI analysis interface
import type { BusinessCaseOutline } from './openai'

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
  aiAnalysis?: BusinessCaseOutline | null
}

// Enhanced PDF generation with jsPDF (serverless-friendly)
export function generatePersonalPlanPDF(data: PersonalPlanPDFData): Promise<Buffer> {
  try {
    if (!data) {
      throw new Error('No data provided for PDF generation')
    }

    console.log('[PDF] Generating PDF with jsPDF (serverless-friendly)')
    console.log('[PDF] Received data:', JSON.stringify(data, null, 2))
    console.log('[PDF] Business idea:', data.business_idea)
    console.log('[PDF] Current challenges:', data.current_challenges)
    console.log('[PDF] Immediate goals:', data.immediate_goals)
    
    // Create PDF document
    const doc = new jsPDF('p', 'mm', 'a4')
    
    // Page dimensions and margins
    const pageWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const margin = 20
    const contentWidth = pageWidth - (margin * 2)
    const footerHeight = 20
    const maxContentHeight = pageHeight - margin - footerHeight
    
    let currentY = margin
    let isFirstPage = true
    
    // Helper function to check if we need a new page
    const checkPageBreak = (requiredHeight: number): void => {
      if (currentY + requiredHeight > maxContentHeight) {
        doc.addPage()
        currentY = margin
        isFirstPage = false
      }
    }
    
    // Helper function to add footer to current page
    const addFooter = (): void => {
      const footerY = pageHeight - 10
      doc.setFontSize(8)
      doc.setTextColor(102, 102, 102) // #666666
      doc.text('ALIRA. Confidential Business Plan', margin, footerY)
      doc.text(`Generated for ${safe(data.name)}`, pageWidth / 2, footerY)
      doc.text(generatedDate, pageWidth - margin - 20, footerY)
    }
    
    // Helper function to add section with automatic page breaks
    const addSection = (title: string, content: string): void => {
      // Calculate required height for this section
      const titleHeight = 25 // Title + underline + spacing
      const contentLines = doc.splitTextToSize(content, contentWidth)
      const contentHeight = (contentLines.length * 5) + 20 // Line height + spacing
      const totalHeight = titleHeight + contentHeight
      
      // Check if we need a new page
      checkPageBreak(totalHeight)
      
      // Add section title
      doc.setFontSize(16)
      doc.setTextColor(26, 26, 26) // #1a1a1a
      doc.text(title, margin, currentY)
      
      // Gold underline
      doc.setDrawColor(212, 175, 55) // #d4af37
      doc.setLineWidth(2)
      doc.line(margin, currentY + 5, pageWidth - margin, currentY + 5)
      
      // Add content
      doc.setFontSize(11)
      doc.setTextColor(102, 102, 102) // #666666
      doc.text(contentLines, margin, currentY + 15)
      
      // Update current Y position
      currentY += totalHeight
    }

    // Date
    const generatedDate = data.generatedDate || new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    
    // Header (only on first page)
    doc.setFontSize(28)
    doc.setTextColor(26, 26, 26) // #1a1a1a
    doc.text('ALIRA.', margin, currentY)
    currentY += 15
    
    doc.setFontSize(12)
    doc.setTextColor(212, 175, 55) // #d4af37
    doc.text('Strategic Business Solutions', margin, currentY)
    currentY += 20

    // Title
    doc.setFontSize(18)
    doc.setTextColor(26, 26, 26) // #1a1a1a
    doc.text(`Personal Business Plan for ${safe(data.name)}`, margin, currentY)
    currentY += 15
    
    doc.setFontSize(10)
    doc.setTextColor(102, 102, 102) // #666666
    doc.text(`Generated on ${generatedDate}`, margin, currentY)
    currentY += 20

    // Sections
    console.log('[PDF] Adding Business Overview section with:', safe(data.business_idea))
    addSection('Business Overview', safe(data.business_idea))
    
    console.log('[PDF] Adding Current Challenges section with:', safe(data.current_challenges))
    addSection('Current Challenges', safe(data.current_challenges))
    
    console.log('[PDF] Adding Immediate Goals section with:', safe(data.immediate_goals))
    addSection('Immediate Goals (3-6 months)', safe(data.immediate_goals))

    // Service Interest
    const serviceMap: Record<string, string> = {
      'brand_product': 'Brand & Product Management',
      'content_management': 'Content Management',
      'digital_solutions': 'Digital Solutions & AI Integration'
    }
    
    const selectedServices = data.service_interest?.map((service: string) => 
      serviceMap[service] || service
    ).join(', ') || 'General business improvement'

    addSection('Recommended ALIRA Services', selectedServices)

    // Current Tools
    if (data.current_tools) {
      addSection('Current Tools & Systems', safe(data.current_tools))
    }

    // AI Analysis Section (if available)
    if (data.aiAnalysis) {
      addSection('ALIRA Strategic Analysis', data.aiAnalysis.problem_statement)
      
      // Current State Analysis
      if (data.aiAnalysis.current_state) {
        addSection('Current State Assessment', data.aiAnalysis.current_state)
      }
      
      // Objectives
      if (data.aiAnalysis.objectives && data.aiAnalysis.objectives.length > 0) {
        const objectivesText = data.aiAnalysis.objectives.map((obj, index) => `${index + 1}. ${obj}`).join('\n')
        addSection('Strategic Objectives', objectivesText)
      }
      
      // Proposed Solutions with Service Implementation
      if (data.aiAnalysis.proposed_solution && data.aiAnalysis.proposed_solution.length > 0) {
        let solutionsText = 'ALIRA Service Implementation Plan:\n\n'
        
        data.aiAnalysis.proposed_solution.forEach((solution, index) => {
          solutionsText += `${index + 1}. ${solution.pillar}\n`
          solutionsText += `   Impact: ${solution.impact.toUpperCase()} | Effort: ${solution.effort.toUpperCase()}\n`
          solutionsText += `   Timeline: ${solution.timeline || 'To be determined'}\n`
          solutionsText += `   Investment: ${solution.investment || 'To be discussed'}\n`
          solutionsText += `   ALIRA Implementation:\n`
          solution.actions.forEach(action => {
            solutionsText += `   • ${action}\n`
          })
          solutionsText += '\n'
        })
        
        addSection('ALIRA Service Implementation', solutionsText)
      }
      
      // Expected Outcomes
      if (data.aiAnalysis.expected_outcomes && data.aiAnalysis.expected_outcomes.length > 0) {
        const outcomesText = data.aiAnalysis.expected_outcomes.map((outcome, index) => `${index + 1}. ${outcome}`).join('\n')
        addSection('Expected Business Outcomes', outcomesText)
      }
      
      // Next Steps
      if (data.aiAnalysis.next_steps && data.aiAnalysis.next_steps.length > 0) {
        const nextStepsText = data.aiAnalysis.next_steps.map((step, index) => `${index + 1}. ${step}`).join('\n')
        addSection('Recommended Next Steps', nextStepsText)
      }
      
      // Risk Assessment
      if (data.aiAnalysis.risk_assessment) {
        addSection('Risk Assessment', data.aiAnalysis.risk_assessment)
      }
      
      // Competitive Advantage
      if (data.aiAnalysis.competitive_advantage) {
        addSection('Competitive Advantage', data.aiAnalysis.competitive_advantage)
      }
    } else {
      // Fallback recommendations if AI analysis is not available
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

      addSection('Strategic Recommendations', recommendations)
    }

    // Add footers to all pages
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      addFooter()
    }

    // Convert to buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
    console.log('[PDF] PDF generated successfully with jsPDF, size:', pdfBuffer.length, 'bytes, pages:', totalPages)
    
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
