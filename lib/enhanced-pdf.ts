// lib/enhanced-pdf.ts
import jsPDF from 'jspdf'

// Safe string helper to prevent undefined/null issues
const safe = (s?: string | null): string => (s && String(s).trim() ? String(s).trim() : '—')

// --- Typographic + spacing tokens (mm) ---
const TOKENS = {
  MARGIN: 18,
  BASE: 4,
  SECTION: 8,
  PARA: 3,
  BOX_PAD_V: 6,
  BOX_PAD_H: 8,
  BOX_GAP: 6,
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

// Enhanced PDF generation with jsPDF (dark theme)
export function generatePersonalPlanPDF(data: PersonalPlanPDFData): Promise<Buffer> {
  try {
    if (!data) throw new Error('No data provided for PDF generation')

    // Create PDF document
    const doc = new jsPDF('p', 'mm', 'a4')

    // Page dimensions and margins
    const pageWidth = 210
    const pageHeight = 297
    const margin = TOKENS.MARGIN
    const contentWidth = pageWidth - margin * 2
    const footerHeight = 10
    const maxContentHeight = pageHeight - margin - footerHeight

    let currentY = margin
    doc.setLineHeightFactor(1.3)

    // ===== THEME (Dark) =====
    type RGB = [number, number, number]
    const THEME = {
      bg: [12, 12, 12] as RGB,          // page background
      panel: [18, 18, 18] as RGB,       // standard panel
      panelAlt: [24, 24, 24] as RGB,    // alt panel
      text: [235, 235, 235] as RGB,     // primary text
      textMuted: [170, 170, 170] as RGB,// secondary
      gold: [212, 175, 55] as RGB,      // accent
      line: [44, 44, 44] as RGB,        // subtle dividers
      footer: [150, 150, 150] as RGB    // footer text
    }

    // ===== Utils =====
    const measureLines = (lines: string[] | string): number => {
      const arr = Array.isArray(lines) ? lines : [lines]
      const dims = doc.getTextDimensions(arr.join('\n'))
      return dims.h
    }

    const ensureSpace = (h: number): void => {
      if (currentY + h > maxContentHeight) {
        nextPage()
      }
    }

    const paintBackground = (): void => {
      // fill entire page bg
      doc.setFillColor(...THEME.bg)
      doc.rect(0, 0, pageWidth, pageHeight, 'F')
    }

    const addFooter = (pageNum: number, total: number): void => {
      const y = pageHeight - 6
      doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(...THEME.footer)
      doc.text('ALIRA. Confidential', margin, y)
      doc.text(`Page ${pageNum}/${total}`, pageWidth - margin, y, { align: 'right' })
    }

    const addHeader = (): void => {
      // subtle header line
      doc.setDrawColor(...THEME.line).setLineWidth(0.2)
      doc.line(margin, margin - 8, pageWidth - margin, margin - 8)
      // brand tag
      doc.setFont('helvetica', 'bold').setFontSize(11).setTextColor(...THEME.text)
      doc.text('ALIRA.', margin, margin - 10)
    }

    const addPageTitle = (title: string): void => {
      doc.setFont('helvetica', 'bold').setFontSize(16).setTextColor(...THEME.text)
      doc.text(title, margin, currentY)
      doc.setDrawColor(...THEME.gold).setLineWidth(0.8)
      doc.line(margin, currentY + 5, margin + TOKENS.UNDERLINE_W, currentY + 5)
      currentY += 12
    }

    const addSubheading = (label: string): void => {
      ensureSpace(10)
      doc.setFont('helvetica', 'bold').setFontSize(12).setTextColor(...THEME.text)
      doc.text(label, margin, currentY)
      currentY += 8
    }

    const addBody = (text: string): void => {
      const lines = doc.splitTextToSize(text, contentWidth)
      doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(...THEME.textMuted)
      ensureSpace(measureLines(lines) + TOKENS.PARA)
      doc.text(lines, margin, currentY)
      currentY += measureLines(lines) + TOKENS.PARA
    }

    const addBullets = (items: string[]): void => {
      doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(...THEME.textMuted)
      for (const it of items.filter(Boolean)) {
        const bullet = `• ${it}`
        const lines = doc.splitTextToSize(bullet, contentWidth)
        ensureSpace(measureLines(lines) + TOKENS.PARA)
        doc.text(lines, margin, currentY)
        currentY += measureLines(lines) + TOKENS.PARA
      }
    }

    const addHighlightBox = (content: string, alt = false): void => {
      const innerWidth = contentWidth - TOKENS.BOX_PAD_H * 2
      const lines = doc.splitTextToSize(content, innerWidth)
      const textH = measureLines(lines)
      const boxH = textH + TOKENS.BOX_PAD_V * 2 + 4
      ensureSpace(boxH + TOKENS.BOX_GAP)

      const fill = alt ? THEME.panelAlt : THEME.panel
      doc.setFillColor(...fill)
      doc.roundedRect(margin, currentY, contentWidth, boxH, 3, 3, 'F')

      doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(...THEME.textMuted)
      doc.text(lines, margin + TOKENS.BOX_PAD_H, currentY + TOKENS.BOX_PAD_V + 4)

      currentY += boxH + TOKENS.BOX_GAP
    }

    const addTwoColumn = (leftTitle: string, leftContent: string, rightTitle: string, rightContent: string): void => {
      const gutter = 10
      const columnWidth = (contentWidth - gutter) / 2

      const leftLines = doc.splitTextToSize(leftContent, columnWidth)
      const rightLines = doc.splitTextToSize(rightContent, columnWidth)
      const headH = 8
      const blockH = Math.max(measureLines(leftLines), measureLines(rightLines)) + headH + TOKENS.PARA
      ensureSpace(blockH + TOKENS.SECTION)

      // Left header
      doc.setFont('helvetica', 'bold').setFontSize(12).setTextColor(...THEME.text)
      doc.text(leftTitle, margin, currentY)
      // Left body
      doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...THEME.textMuted)
      doc.text(leftLines, margin, currentY + 8)

      // Right header
      doc.setFont('helvetica', 'bold').setFontSize(12).setTextColor(...THEME.text)
      doc.text(rightTitle, margin + columnWidth + gutter, currentY)
      // Right body
      doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...THEME.textMuted)
      doc.text(rightLines, margin + columnWidth + gutter, currentY + 8)

      currentY += blockH + TOKENS.SECTION
    }

    const addReflectionBox = (title = 'Reflection Space'): void => {
      addSubheading(`'${title}'`)
      addHighlightBox('', true)
    }

    const addCTA = (label: string, url: string): void => {
      const boxH = 14
      ensureSpace(boxH + TOKENS.SECTION)
      doc.setFillColor(...THEME.panelAlt)
      doc.setDrawColor(...THEME.gold).setLineWidth(0.4)
      doc.roundedRect(margin, currentY, contentWidth, boxH, 3, 3, 'FD')
      doc.setFont('helvetica', 'bold').setFontSize(10).setTextColor(...THEME.text)
      doc.textWithLink(label, margin + TOKENS.BOX_PAD_H, currentY + 9, { url })
      currentY += boxH + TOKENS.SECTION
    }

    const nextPage = (): void => {
      // Footer for current page
      const total = doc.getNumberOfPages()
      doc.setPage(total)
      addFooter(total, total)

      // New page
      doc.addPage()
      currentY = margin
      paintBackground()
      addHeader()
    }

    // ===== Page chrome for first page =====
    paintBackground()
    addHeader()

    // Date
    const generatedDate = data.generatedDate || new Date().toLocaleDateString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    })

    // ====== CONTENT ORDER (Master) ======

    // PAGE 1 — COVER
    doc.setFont('helvetica', 'bold').setFontSize(22).setTextColor(...THEME.text)
    doc.text('ALIRA.', margin, currentY); currentY += TOKENS.SECTION

    doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(...THEME.gold)
    doc.text('Strategic Business Solutions', margin, currentY)
    currentY += TOKENS.SECTION * 4

    doc.setFont('helvetica', 'bold').setFontSize(22).setTextColor(...THEME.text)
    doc.text('Your Personal Plan', margin, currentY); currentY += TOKENS.SECTION * 2

    // Prepared For + Date card
    doc.setFillColor(...THEME.panel)
    doc.roundedRect(margin, currentY, contentWidth, 28, 4, 4, 'F')
    doc.setFont('helvetica', 'bold').setFontSize(12).setTextColor(...THEME.text)
    doc.text(`Prepared For ${safe(data.name)}`, margin + 10, currentY + 11)
    doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(...THEME.textMuted)
    doc.text(`Date of Issue ${generatedDate}`, margin + 10, currentY + 20)
    currentY += 28 + TOKENS.SECTION

    addSubheading('Important Notice')
    addBody('This document has been generated directly from the information you submitted. It has not been reviewed or altered by any individual. Its purpose is to give structure to your ideas, highlight areas of focus, and support reflection and forward planning.')

    addSubheading('Confidentiality & Legal Disclaimer')
    addBody('This document is confidential and intended solely for the recipient named above. The content is based entirely on your submitted responses and does not constitute professional, legal, financial, or investment advice. The structure, format, and underlying system remain the intellectual property of ALIRA Capital Ventures Ltd. No part of this document may be copied, redistributed, or reused for commercial purposes without prior written consent.')

    addSubheading('Company Information')
    addBody('ALIRA Capital Ventures Ltd\nRegistered in England & Wales\nCompany Registration No: 16419663\nRegistered Office: 4th Floor, Silverstream House, 45 Fitzroy Street, Fitzrovia, London, W1T 6EB, United Kingdom\n© ALIRA Capital Ventures Ltd. All rights reserved.')

    // PAGE 2 — SNAPSHOT SUMMARY
    nextPage()
    addPageTitle('Snapshot Summary')
    addBody('This page reflects what you shared, your starting point, what matters most, and what may need clarity before you move forward.')

    addSubheading('What you shared')
    addBody(safe(data.business_idea))

    addSubheading('What matters most to you')
    addBullets((data.aiAnalysis?.objectives?.slice(0, 3) ?? []).map(String))

    addSubheading('Things to be mindful of')
    const mindful = data.aiAnalysis?.risk_assessment
      ? data.aiAnalysis?.risk_assessment.split(/[.;]\s+/).slice(0, 3)
      : (data.aiAnalysis?.expected_outcomes ?? []).slice(0, 3)
    addBullets((mindful ?? []).map(String))

    addHighlightBox('This page is not here to answer questions.\n\nIt is here to make your current position visible, because clarity begins with seeing things as they are.')

    // PAGE 3 — THE BIGGER PICTURE
    nextPage()
    addPageTitle('The Bigger Picture')
    addBody('Every idea, project, or business begins with a reason. A plan exists to connect that reason to the people who need it.')

    addSubheading('Purpose')
    addBody(safe(data.aiAnalysis?.problem_statement) || `Building around ${safe(data.business_idea)}`)

    addSubheading('Desired Outcomes (6–12 Months)')
    addBullets((data.aiAnalysis?.expected_outcomes ?? []).slice(0, 3).map(String))

    addSubheading('Audience')
    addBody('Primary audience: (Not provided)')

    addHighlightBox('The bigger picture is not about dreaming. It is about alignment. The distance between what you believe and what you do each week defines your results.')

    // PAGE 4 — INSIGHTS + OPPORTUNITIES
    nextPage()
    addPageTitle('Insights + Opportunities')
    addBody('Every stage has its reality. The point of a plan is to see it clearly, then create movement.')

    addSubheading('Current Position')
    addBody(safe(data.aiAnalysis?.current_state) || 'Early stage business development')

    addSubheading('Opportunities')
    addBullets((data.aiAnalysis?.proposed_solution?.map(s => s.pillar) ?? ['Strategic positioning', 'Operational efficiency', 'Market expansion']).slice(0, 3))

    addSubheading('How ALIRA Sees It')
    addBody('Ideas often stall through endless conversations or scattered tasks. Progress comes from cutting through to what matters.')

    addSubheading('Summary')
    addBody('Your position is not a problem. It is a platform. The next steps exist and can be tested quickly.')

    // PAGE 5 — RECOMMENDED NEXT STEPS
    nextPage()
    addPageTitle('Recommended Next Steps')
    addBody('Clarity without movement is wasted. These are practical, near-term steps drawn from your words, reframed into action.')

    addSubheading('1. Name the Core Aim')
    addBody(data.aiAnalysis?.objectives?.[0] || safe(data.immediate_goals))

    addSubheading('2. Face the Obstacles')
    addBullets([safe(data.current_challenges)])

    addSubheading('3. Define a 90-Day Outcome')
    addBody(data.aiAnalysis?.next_steps?.[0] || 'Define one measurable outcome to reach in 90 days.')

    addSubheading('4. Create the First Test')
    addBody(data.aiAnalysis?.next_steps?.[1] || 'Design a small, real-world test like a pilot offer, landing page, or targeted outreach.')

    addSubheading('5. Protect the Time')
    addBody(data.aiAnalysis?.next_steps?.[2] || 'Block two 60-minute build slots weekly and defend them.')

    addReflectionBox()
    addSubheading('Affirmation for You')
    addBody('Momentum beats perfection. I choose movement.')

    addSubheading('Closing Note')
    addBody('Completing this plan was your first move. Keep it visible. Act on the next smallest step.')

    // PAGE 6 — ABOUT ALIRA
    nextPage()
    addPageTitle('About ALIRA')
    addBody('Every idea carries potential. With clear systems and steady focus, that potential can become something real.')

    addSubheading('What We Believe')
    addBullets([
      'Clarity is stronger than complexity.',
      'Systems should serve people, not trap them.',
      'Every idea deserves a fair chance to be real.',
      'Focus creates movement.'
    ])

    addSubheading('Our Story')
    addBody('ALIRA was built to help people cross the gap between thought and action with practical support and clean execution.')

    addSubheading('Examples From Our Work')
    addBullets([
      'From words to action: one-line pitch with a pilot launched within weeks.',
      'From chaos to focus: three measurable priorities that moved the needle in 90 days.'
    ])

    addSubheading('Why It Matters For You')
    addBody('This plan reflects your words and turns them into steps that you can execute week by week.')

    // PAGE 7 — PRIVACY & OWNERSHIP
    nextPage()
    addPageTitle('Privacy & Ownership')
    addBody('When you shared your words, you shared something personal. That deserves care.')

    addSubheading('Your Privacy')
    addBody('What you write stays yours. Your information is not shared without consent.')

    addSubheading('Your Ownership')
    addBody('This plan reflects you. Treat it as a record of what you said and where you chose to go next.')

    addSubheading('Our Responsibility')
    addBody('The framework belongs to ALIRA but your words are yours. We are custodians of the process, not owners of your story.')

    addSubheading('Why This Matters')
    addBody('Too often, systems take more than they give. This aims to give you clarity and control.')

    addReflectionBox()
    addSubheading('Affirmation for You')
    addBody('My story is mine. My words carry weight.')

    // PAGE 8 — NOTES & REFLECTIONS
    nextPage()
    addPageTitle('Notes & Reflections')
    addBody('A plan grows when you return to it and write what you learn.')

    addSubheading('Prompts to Guide You')
    addBullets([
      'What line in this plan made you stop and think?',
      'What truth do you see here that you have been avoiding?',
      'What single step feels urgent now?',
      'What would make the next 90 days a win?',
      'What happens if you do nothing?'
    ])

    addSubheading('Quote of the Day')
    addBody('"Momentum beats perfection."')

    addReflectionBox()
    addSubheading('How to Use This Page')
    addBullets([
      'Write freely. This is for you.',
      'Circle words that stand out.',
      'Return later. Add updates. Cross things out. Write wins.'
    ])

    addSubheading('Affirmation for You')
    addBody('Momentum beats perfection. I choose movement.')

    // PAGE 9 — WAYS WE CAN WORK TOGETHER
    nextPage()
    addPageTitle('Ways We Can Work Together')

    addSubheading('One Conversation')
    addBody('A 90-minute clarity session to break the deadlock and leave with direction.')

    addSubheading('A Short Guided Journey')
    addBody('Idea to Action. Two to three weeks from thought to traction.')

    addSubheading('Building Side by Side')
    addBody('Build With Us. Co-create tools, offers, and launch readiness.')

    addSubheading('Resetting What Exists')
    addBody('Operational Reset. Thirty-day reset to clear bottlenecks and restore momentum.')

    addSubheading('If You Are Unsure Where to Begin')
    addBody('We also offer a free 15-minute check-in. No agenda. No pressure. Just clarity.')

    addCTA('Click here to book your free check-in call', 'https://www.aliracapital.co.uk')
    addReflectionBox()
    addSubheading('Affirmation for You')
    addBody('The right choice is the one that keeps me moving.')

    // PAGE 10 — CLOSING PRINCIPLES
    nextPage()
    addPageTitle('Closing Principles')
    addBody('This plan was created from your words. Clarity is here. Action is next.')

    addSubheading('The ALIRA Principles')
    addBullets([
      'Clarity is stronger than complexity. If you cannot explain it simply, you do not understand it.',
      'Small tests beat big theories. Progress comes from evidence, not endless discussion.',
      'Focus creates movement. Scatter your energy and you will stall. Direct it and you will grow.',
      'Systems should serve you, not trap you. Build what frees your time.',
      'Every idea deserves the chance to be real. If you do nothing, you will never know.'
    ])

    addSubheading('Your Choice')
    addBody('You asked for clarity. You now have it. The question is whether you act.')

    addReflectionBox()
    addSubheading('Affirmation for You')
    addBody('I asked for clarity. Now I choose action.')

    addSubheading('Your Next Step')
    addCTA('Click here to book your free check-in call', 'https://www.aliracapital.co.uk')

    // CONTACT — FINAL
    nextPage()
    addPageTitle('Contact Us')
    addBody('Email: enquiries@aliracapital.co.uk\nWebsite: www.aliracapital.co.uk')

    addSubheading('Company Information')
    addBody('ALIRA Capital Ventures Ltd\nRegistered in England & Wales\nCompany Registration No: 16419663\nRegistered Office: 4th Floor, Silverstream House, 45 Fitzroy Street, Fitzrovia, London, W1T 6EB, United Kingdom\n© ALIRA Capital Ventures Ltd. All rights reserved.')

    // Footers on all pages
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      addFooter(i, totalPages)
    }

    // Buffer out
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
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

// Optional: simple business case PDF (kept for compatibility)
export function generateBusinessCasePDF(data: any): Promise<Buffer> {
  const doc = new jsPDF('p', 'mm', 'a4')
  doc.setFontSize(24).setTextColor(235,235,235)
  doc.setFillColor(12,12,12); doc.rect(0,0,210,297,'F')
  doc.text('ALIRA.', 20, 30)
  doc.setFontSize(16).setTextColor(212,175,55)
  doc.text('Business Case Analysis', 20, 50)
  doc.setFontSize(12).setTextColor(170,170,170)
  doc.text('Business case content would go here...', 20, 70)
  return Promise.resolve(Buffer.from(doc.output('arraybuffer')))
}
