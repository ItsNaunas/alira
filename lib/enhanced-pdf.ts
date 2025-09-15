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
    
    // 1. COVER PAGE
    doc.setFontSize(32)
    doc.setTextColor(26, 26, 26) // #1a1a1a
    doc.text('Your Personal Plan', margin, currentY)
    currentY += 25
    
    doc.setFontSize(16)
    doc.setTextColor(212, 175, 55) // #d4af37
    doc.text(`Prepared for ${safe(data.name)}`, margin, currentY)
    currentY += 15
    
    doc.setFontSize(12)
    doc.setTextColor(102, 102, 102) // #666666
    doc.text(`Generated on ${generatedDate}`, margin, currentY)
    currentY += 20
    
    // Confidentiality notice
    doc.setFontSize(10)
    doc.setTextColor(150, 150, 150)
    doc.text('ALIRA. Confidential Business Plan', margin, currentY)
    currentY += 30

    // 2. SNAPSHOT SUMMARY
    addSection('Snapshot Summary', 
      `What you shared → ${safe(data.business_idea)}\n\n` +
      `What matters most → ${data.aiAnalysis?.objectives?.slice(0, 3).join(', ') || 'Strategic growth and operational efficiency'}\n\n` +
      `Things to be mindful of → ${data.aiAnalysis?.risk_assessment || 'Market competition and resource allocation'}`)

    // 3. THE BIGGER PICTURE
    const purpose = data.aiAnalysis?.problem_statement || `Building a sustainable business around ${safe(data.business_idea)}`
    const outcomes = data.aiAnalysis?.expected_outcomes?.slice(0, 3) || [
      'Establish market presence and customer base',
      'Develop efficient operational systems',
      'Achieve sustainable growth metrics'
    ]
    const audience = data.aiAnalysis?.current_state || 'Target market and customer segments to be defined'
    
    addSection('The Bigger Picture', 
      `Purpose → ${purpose}\n\n` +
      `Desired Outcomes (6-12 months) →\n${outcomes.map((outcome, i) => `• ${outcome}`).join('\n')}\n\n` +
      `Audience → ${audience}`)

    // 4. INSIGHTS + OPPORTUNITIES
    const currentPosition = data.aiAnalysis?.current_state || 'Early stage business development'
    const opportunities = data.aiAnalysis?.proposed_solution?.map(s => s.pillar) || ['Strategic positioning', 'Operational efficiency', 'Market expansion']
    const aliraView = data.aiAnalysis?.competitive_advantage || 'Focus on clarity over complexity, small tests over big theories, and systematic execution'
    
    addSection('Insights + Opportunities', 
      `Current Position → ${currentPosition}\n\n` +
      `Opportunities →\n${opportunities.map((opp, i) => `• ${opp}`).join('\n')}\n\n` +
      `ALIRA's View → ${aliraView}`)

    // 5. RECOMMENDED NEXT STEPS
    const coreAim = data.aiAnalysis?.objectives?.[0] || 'Establish clear business direction and market position'
    const obstacles = data.aiAnalysis?.problem_statement || safe(data.current_challenges) || 'Resource allocation and market positioning'
    const ninetyDayOutcome = data.aiAnalysis?.next_steps?.[0] || safe(data.immediate_goals) || 'Complete initial market validation and customer discovery'
    const firstTest = data.aiAnalysis?.next_steps?.[1] || 'Launch a minimum viable product or service offering'
    const timeProtection = data.aiAnalysis?.next_steps?.[2] || 'Establish dedicated weekly business development time'
    
    addSection('Recommended Next Steps', 
      `Step 1: Name the Core Aim → ${coreAim}\n\n` +
      `Step 2: Face the Obstacles → ${obstacles}\n\n` +
      `Step 3: Define a 90-Day Outcome → ${ninetyDayOutcome}\n\n` +
      `Step 4: Create the First Test → ${firstTest}\n\n` +
      `Step 5: Protect the Time → ${timeProtection}`)

    // 6. HOW ALIRA CAN HELP
    const serviceMap: Record<string, string> = {
      'brand_product': 'Brand & Product Management → Clarify offer, shape brand, first 100 customers',
      'content_management': 'Content Management → Capture leads, nurture, automate follow-ups',
      'digital_solutions': 'Digital Solutions & AI Integration → MVP build, website, AI integrations'
    }
    
    const selectedServices = data.service_interest?.map((service: string) => 
      serviceMap[service] || `${service} → Strategic implementation and optimization`
    ) || ['Brand & Product Management → Clarify offer, shape brand, first 100 customers']
    
    addSection('How ALIRA Can Help', 
      selectedServices.join('\n\n') + '\n\n' +
      'Current Tools & Systems → ' + (safe(data.current_tools) || 'Standard business tools and processes'))

    // 7. RISKS & MITIGATIONS
    const risks = [
      { risk: data.aiAnalysis?.risk_assessment || 'Market competition and resource constraints', mitigation: 'Focus on unique value proposition and efficient resource allocation' },
      { risk: 'Time management and prioritization challenges', mitigation: 'Implement systematic approach with clear milestones and accountability' },
      { risk: 'Customer acquisition and retention', mitigation: 'Develop targeted marketing strategy and customer experience optimization' }
    ]
    
    let risksText = 'Risk | Mitigation\n'
    risksText += '--- | ---\n'
    risks.forEach(risk => {
      risksText += `${risk.risk} | ${risk.mitigation}\n`
    })
    
    addSection('Risks & Mitigations', risksText)

    // 8. REFLECTION SPACE
    addSection('Reflection Space', 
      'What excites you most about this plan?\n\n' +
      'What\'s one step you\'ll act on this week?\n\n' +
      'What happens if you do nothing?')

    // 9. CLOSING PRINCIPLES
    addSection('Closing Principles', 
      'Clarity over complexity\n' +
      'Small tests over big theories\n' +
      'Focus creates momentum\n' +
      'Systems that last\n' +
      'Discipline over distraction\n\n' +
      'Ready to move forward? Contact ALIRA for strategic implementation support.')

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
