import jsPDF from 'jspdf'

// Safe string helper to prevent undefined/null issues
const safe = (s?: string | null): string => (s && String(s).trim() ? String(s).trim() : '—')

// --- Typographic + spacing tokens (mm) ---
const TOKENS = {
  MARGIN: 18,
  BASE: 4,        // baseline unit
  SECTION: 8,     // gap before section
  PARA: 3,        // gap between paragraphs
  BOX_PAD_V: 6,   // vertical padding inside boxes
  BOX_PAD_H: 8,   // horizontal padding inside boxes
  BOX_GAP: 6,     // gap after a box
  UNDERLINE_W: 40
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
    const margin = TOKENS.MARGIN
    const contentWidth = pageWidth - margin * 2
    const footerHeight = 10
    const maxContentHeight = pageHeight - margin - footerHeight
    
    let currentY = margin
    let isFirstPage = true
    doc.setLineHeightFactor(1.3)

    // Measure the height of a block of text (lines already split)
    const measureLines = (lines: string[] | string): number => {
      const arr = Array.isArray(lines) ? lines : [lines]
      const dims = doc.getTextDimensions(arr.join('\n'))
      return dims.h // jsPDF returns height in current units (mm)
    }
    
    // Helper function to check if we need a new page
    const checkPageBreak = (requiredHeight: number): void => {
      if (currentY + requiredHeight > maxContentHeight) {
        doc.addPage()
        currentY = margin
        isFirstPage = false
      }
    }

    // Helper to ensure space during writing (mid-flow page breaks)
    const ensureSpace = (h: number): void => {
      if (currentY + h > maxContentHeight) {
        doc.addPage()
        currentY = margin
      }
    }

    // Helper to force a page break
    const forcePageBreak = (): void => {
      doc.addPage()
      currentY = margin
    }
    
    // Helper function to add footer to current page
    const addFooter = (pageNum: number, total: number): void => {
      const y = pageHeight - 6
      doc.setFontSize(8).setTextColor(102)
      doc.text('ALIRA. Confidential', margin, y)
      doc.text(`Page ${pageNum}/${total}`, pageWidth - margin, y, { align: 'right' })
    }
    
    // Helper function to add a professional section
    const addSection = (title: string, content: string, isFirstSection = false): void => {
      // Skip empty sections to avoid crowding
      if (!safe(content) || safe(content) === '—') {
        return
      }

      const contentLines = doc.splitTextToSize(content, contentWidth)
      // Estimate: title block ~ 10mm + underline + spacing
      const titleBlock = 12
      const contentHeight = measureLines(contentLines) + TOKENS.PARA
      const totalHeight = (isFirstSection ? 0 : TOKENS.SECTION) + titleBlock + contentHeight

      checkPageBreak(totalHeight)

      if (!isFirstSection) currentY += TOKENS.SECTION

      doc.setFontSize(14).setTextColor(26).setFont('helvetica', 'bold')
      doc.text(title, margin, currentY)

      doc.setDrawColor(212, 175, 55).setLineWidth(0.8)
      doc.line(margin, currentY + 5, margin + TOKENS.UNDERLINE_W, currentY + 5)

      doc.setFontSize(10).setTextColor(60).setFont('helvetica', 'normal')
      const paragraphs = content.split(/\n\s*\n/).map(safe)
      let contentY = currentY + 12

      // Add mid-paragraph page breaks
      for (const p of paragraphs) {
        if (!p) continue
        const lines = doc.splitTextToSize(p, contentWidth)
        const blockH = measureLines(lines)
        // break BEFORE writing if needed
        ensureSpace(blockH + TOKENS.PARA)
        doc.text(lines, margin, currentY + 12)
        currentY += blockH + TOKENS.PARA
      }
    }
    
    // Helper function to add a highlighted box
    const addHighlightBox = (content: string, background: number[] = [248,249,250]): void => {
      const innerWidth = contentWidth - TOKENS.BOX_PAD_H * 2
      const lines = doc.splitTextToSize(content, innerWidth)
      let idx = 0
      
      while (idx < lines.length) {
        // take as many lines as fit on this page
        let chunk: string[] = []
        // Reserve box chrome and footer space
        const available = maxContentHeight - currentY - TOKENS.BOX_PAD_V * 2 - 10
        // if nothing fits, go to next page
        if (available < 8) { 
          forcePageBreak()
          continue 
        }
        // accumulate lines until height would overflow
        for (; idx < lines.length; idx++) {
          const tryChunk = [...chunk, lines[idx]]
          const h = measureLines(tryChunk)
          if (h > available) break
          chunk = tryChunk
        }
        // draw this chunk's box
        const textH = measureLines(chunk)
        const boxH = textH + TOKENS.BOX_PAD_V * 2
        doc.setFillColor(background[0], background[1], background[2])
        doc.roundedRect(margin, currentY, contentWidth, boxH, 3, 3, 'F')
        doc.setFontSize(10).setTextColor(60)
        doc.text(chunk, margin + TOKENS.BOX_PAD_H, currentY + TOKENS.BOX_PAD_V + 2)
        currentY += boxH + TOKENS.BOX_GAP
        // if more lines remain, new page for next chunk
        if (idx < lines.length) forcePageBreak()
      }
    }
    
    // Helper function to add a two-column layout
    const addTwoColumn = (leftTitle: string, leftContent: string, rightTitle: string, rightContent: string): void => {
      const gutter = 10
      const columnWidth = (contentWidth - gutter) / 2
      const leftLines = doc.splitTextToSize(leftContent, columnWidth)
      const rightLines = doc.splitTextToSize(rightContent, columnWidth)
      const leftH = measureLines(leftLines)
      const rightH = measureLines(rightLines)
      const headH = 6 // title line height
      const blockH = Math.max(leftH, rightH) + headH + TOKENS.PARA
      ensureSpace(blockH)

      // Left column
      doc.setFontSize(12).setTextColor(26).setFont('helvetica', 'bold')
      doc.text(leftTitle, margin, currentY)
      doc.setFontSize(9).setTextColor(60).setFont('helvetica', 'normal')
      doc.text(leftLines, margin, currentY + 6)

      // Right column
      doc.setFontSize(12).setTextColor(26).setFont('helvetica', 'bold')
      doc.text(rightTitle, margin + columnWidth + gutter, currentY)
      doc.setFontSize(9).setTextColor(60).setFont('helvetica', 'normal')
      doc.text(rightLines, margin + columnWidth + gutter, currentY + 6)

      currentY += blockH + TOKENS.PARA  // add a tiny gap after 2-col
    }

    // Date
    const generatedDate = data.generatedDate || new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    
    // 1. PROFESSIONAL COVER PAGE
    // Header with logo
    doc.setFontSize(24)
    doc.setTextColor(26, 26, 26) // #1a1a1a
    doc.setFont('helvetica', 'bold')
    doc.text('ALIRA.', margin, currentY)
    currentY += 8
    
    doc.setFontSize(10)
    doc.setTextColor(212, 175, 55) // #d4af37
    doc.setFont('helvetica', 'normal')
    doc.text('Strategic Business Solutions', margin, currentY)
    currentY += 40
    
    // Main title
    doc.setFontSize(28)
    doc.setTextColor(26, 26, 26)
    doc.setFont('helvetica', 'bold')
    doc.text('Your Personal Plan', margin, currentY)
    currentY += 35
    
    // Client info box
    doc.setFillColor(248, 249, 250)
    doc.roundedRect(margin, currentY, contentWidth, 60, 5, 5, 'F')
    
    doc.setFontSize(14)
    doc.setTextColor(26, 26, 26)
    doc.setFont('helvetica', 'bold')
    doc.text(`Prepared for ${safe(data.name)}`, margin + 15, currentY + 20)
    
    doc.setFontSize(10)
    doc.setTextColor(102, 102, 102)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated on ${generatedDate}`, margin + 15, currentY + 35)
    
    currentY += 80
    
    // Confidentiality notice
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('ALIRA. Confidential Business Plan', margin, currentY)
    currentY += 20

    // 2. EXECUTIVE SUMMARY - Professional layout
    // Add section title first
    if (!isFirstPage) currentY += TOKENS.SECTION
    doc.setFontSize(14).setTextColor(26).setFont('helvetica', 'bold')
    doc.text('Executive Summary', margin, currentY)
    doc.setDrawColor(212, 175, 55).setLineWidth(0.8)
    doc.line(margin, currentY + 5, margin + TOKENS.UNDERLINE_W, currentY + 5)
    currentY += 12
    
    // Create a professional summary box
    const summaryContent = `Business Concept: ${safe(data.business_idea)}\n\n` +
      `Key Objectives: ${data.aiAnalysis?.objectives?.slice(0, 3).join(' • ') || 'Strategic growth and operational efficiency'}\n\n` +
      `Primary Considerations: ${data.aiAnalysis?.risk_assessment || 'Market competition and resource allocation'}`
    
    addHighlightBox(summaryContent, [248, 249, 250])

    // 3. STRATEGIC OVERVIEW - Two column layout
    const purpose = data.aiAnalysis?.problem_statement || `Building a sustainable business around ${safe(data.business_idea)}`
    const outcomes = data.aiAnalysis?.expected_outcomes?.slice(0, 3) || [
      'Establish market presence and customer base',
      'Develop efficient operational systems', 
      'Achieve sustainable growth metrics'
    ]
    
    addSection('Strategic Overview', 'Business strategy and target outcomes overview')
    addTwoColumn(
      'Business Purpose',
      purpose,
      'Target Outcomes (6-12 months)',
      outcomes.map((outcome, i) => `${i + 1}. ${outcome}`).join('\n')
    )

    // 4. CURRENT POSITION & OPPORTUNITIES
    const currentPosition = data.aiAnalysis?.current_state || 'Early stage business development'
    const opportunities = data.aiAnalysis?.proposed_solution?.map(s => s.pillar) || ['Strategic positioning', 'Operational efficiency', 'Market expansion']
    const aliraView = data.aiAnalysis?.competitive_advantage || 'Focus on clarity over complexity, small tests over big theories, and systematic execution'
    
    addSection('Current Position & Opportunities', 'Analysis of current business position and growth opportunities')
    
    // Current position box
    addHighlightBox(`Current State: ${currentPosition}`, [245, 248, 250])
    
    // Opportunities list
    addSection('Key Opportunities', opportunities.map((opp, i) => `${i + 1}. ${opp}`).join('\n'))
    
    // ALIRA's perspective
    addHighlightBox(`ALIRA's Strategic Perspective:\n\n${aliraView}`, [252, 245, 245])

    // 5. STRATEGIC ROADMAP
    const coreAim = data.aiAnalysis?.objectives?.[0] || 'Establish clear business direction and market position'
    const obstacles = data.aiAnalysis?.problem_statement || safe(data.current_challenges) || 'Resource allocation and market positioning'
    const ninetyDayOutcome = data.aiAnalysis?.next_steps?.[0] || safe(data.immediate_goals) || 'Complete initial market validation and customer discovery'
    const firstTest = data.aiAnalysis?.next_steps?.[1] || 'Launch a minimum viable product or service offering'
    const timeProtection = data.aiAnalysis?.next_steps?.[2] || 'Establish dedicated weekly business development time'
    
    addSection('Strategic Roadmap', 'Step-by-step implementation plan for business development')
    
    // Create a professional roadmap with numbered steps
    const roadmapSteps = [
      { title: 'Define Core Aim', content: coreAim },
      { title: 'Address Key Obstacles', content: obstacles },
      { title: 'Set 90-Day Target', content: ninetyDayOutcome },
      { title: 'Create First Test', content: firstTest },
      { title: 'Protect Development Time', content: timeProtection }
    ]
    
    roadmapSteps.forEach((step, index) => {
      addHighlightBox(
        `Step ${index + 1}: ${step.title}\n\n${step.content}`,
        index % 2 === 0 ? [248, 249, 250] : [252, 252, 252]
      )
    })

    // 6. ALIRA SERVICE RECOMMENDATIONS
    const serviceMap: Record<string, string> = {
      'brand_product': 'Brand & Product Management\nClarify offer, shape brand, acquire first 100 customers',
      'content_management': 'Content Management\nCapture leads, nurture prospects, automate follow-ups',
      'digital_solutions': 'Digital Solutions & AI Integration\nBuild MVP, develop website, implement AI tools'
    }
    
    const selectedServices = data.service_interest?.map((service: string) => 
      serviceMap[service] || `${service}\nStrategic implementation and optimization`
    ) || ['Brand & Product Management\nClarify offer, shape brand, acquire first 100 customers']
    
    addSection('Recommended ALIRA Services', 'Strategic service recommendations based on business analysis')
    
    selectedServices.forEach((service, index) => {
      const [title, description] = service.split('\n')
      addHighlightBox(
        `${title}\n\n${description}`,
        [245, 248, 250]
      )
    })
    
    // Current tools section
    addSection('Current Tools & Systems', safe(data.current_tools) || 'Standard business tools and processes')

    // 7. RISK ASSESSMENT
    const risks = [
      { risk: data.aiAnalysis?.risk_assessment || 'Market competition and resource constraints', mitigation: 'Focus on unique value proposition and efficient resource allocation' },
      { risk: 'Time management and prioritization challenges', mitigation: 'Implement systematic approach with clear milestones and accountability' },
      { risk: 'Customer acquisition and retention', mitigation: 'Develop targeted marketing strategy and customer experience optimization' }
    ]
    
    addSection('Risk Assessment & Mitigation', 'Key risks and strategic mitigation approaches')
    
    risks.forEach((risk, index) => {
      addTwoColumn(
        'Risk',
        risk.risk,
        'Mitigation Strategy',
        risk.mitigation
      )
    })

    // 8. REFLECTION & ACTION
    addSection('Reflection & Action Planning', 'Strategic reflection questions for business development')
    
    const reflectionQuestions = [
      'What excites you most about this plan?',
      'What\'s one step you\'ll act on this week?',
      'What happens if you do nothing?'
    ]
    
    reflectionQuestions.forEach((question, index) => {
      addHighlightBox(question, [252, 252, 252])
    })

    // 9. ALIRA PRINCIPLES & NEXT STEPS
    addSection('ALIRA Principles', 'Core principles for systematic business development')
    
    const principles = [
      'Clarity over complexity',
      'Small tests over big theories', 
      'Focus creates momentum',
      'Systems that last',
      'Discipline over distraction'
    ]
    
    addHighlightBox(
      principles.join('\n\n'),
      [248, 249, 250]
    )
    
    // Call to action
    addHighlightBox(
      'Ready to move forward?\n\nContact ALIRA for strategic implementation support and begin your systematic business development journey.',
      [252, 245, 245]
    )

    // Add footers to all pages (small, 6mm from bottom)
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      addFooter(i, totalPages)
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
