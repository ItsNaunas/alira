import { NextRequest, NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'
import { IntakeFormData } from '@/lib/schema'
import { generateBusinessCaseId, formatDate } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const data: IntakeFormData = await request.json()

    const pdfBuffer = await generateBusinessCase(data)

    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Draft-Business-Case-${data.businessName.replace(/\s+/g, '-')}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}

async function generateBusinessCase(data: IntakeFormData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50,
        },
      })

      const chunks: Buffer[] = []
      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))

      // Header
      doc
        .font('Times-Bold')
        .fontSize(24)
        .text('Draft Business Case', { align: 'center' })
        .fontSize(16)
        .text(data.businessName, { align: 'center' })
        .moveDown(0.5)

      // Gold divider
      doc
        .moveTo(50, doc.y + 10)
        .lineTo(545, doc.y + 10)
        .strokeColor('#C5A572')
        .lineWidth(2)
        .stroke()
        .moveDown(1)

      // Document info
      doc
        .font('Helvetica')
        .fontSize(10)
        .text(`Document ID: ${generateBusinessCaseId()}`, { align: 'right' })
        .text(`Generated: ${formatDate(new Date())}`, { align: 'right' })
        .moveDown(1)

      // Problem Statement
      addSection(doc, 'Problem Statement', [
        `Business: ${data.businessName}`,
        `Industry: ${data.industry}`,
        `Stage: ${data.stage.charAt(0).toUpperCase() + data.stage.slice(1)}`,
        '',
        'Current Challenges:',
        data.challenges,
      ])

      // Objectives
      addSection(doc, 'Objectives', [
        'Short-term Goals (3-6 months):',
        data.goalsShort,
        '',
        'Long-term Goals (1-3 years):',
        data.goalsLong,
      ])

      // Current State
      addSection(doc, 'Current State', [
        'Available Resources:',
        data.resources,
        '',
        'Business Stage:',
        `${data.stage.charAt(0).toUpperCase() + data.stage.slice(1)} stage business`,
      ])

      // Proposed Solution
      addSection(doc, 'Proposed Solution', [
        `Recommended Service: ${data.service}`,
        '',
        getServiceDescription(data.service),
        '',
        'Project Parameters:',
        `• Budget Range: ${data.budget}`,
        `• Timeline: ${data.timeline}`,
      ])

      // Expected Outcomes
      addSection(doc, 'Expected Outcomes', [
        'Based on the selected service and business context, expected outcomes include:',
        '',
        getExpectedOutcomes(data.service, data.stage),
      ])

      // Next Steps
      addSection(doc, 'Next Steps', [
        '1. Review this draft business case',
        '2. Schedule a consultation call to discuss details',
        '3. Refine the approach based on your feedback',
        '4. Begin the engagement process',
        '',
        'Contact Information:',
        `Name: ${data.contactName}`,
        `Email: ${data.email}`,
        data.notes ? `Notes: ${data.notes}` : '',
      ])

      // Footer
      doc
        .font('Helvetica')
        .fontSize(8)
        .text('ALIRA. - Build With Clarity, Scale With Confidence', { align: 'center' })
        .text('This is a draft document for discussion purposes only.', { align: 'center' })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

function addSection(doc: PDFKit.PDFDocument, title: string, content: string[]) {
  doc
    .font('Times-Bold')
    .fontSize(14)
    .text(title)
    .moveDown(0.5)

  // Gold divider
  doc
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .strokeColor('#C5A572')
    .lineWidth(1)
    .stroke()
    .moveDown(0.5)

  doc
    .font('Helvetica')
    .fontSize(11)
    .text(content.join('\n'))
    .moveDown(1)
}

function getServiceDescription(service: string): string {
  const descriptions = {
    'Business Reset': 'A private 10-day engagement to strip away overload and rebuild clarity. Focus on identifying core priorities, eliminating distractions, and establishing clear systems.',
    'Growth Blueprint': 'A 3-6 week programme that turns ideas into credible businesses. Comprehensive strategy development, market analysis, and execution planning.',
    'AI Advantage': 'Practical AI integration to make systems faster, smarter, leaner. Assessment of current processes and implementation of AI solutions for efficiency gains.',
    'Strategic Partner': 'Ongoing oversight and structured support for serious ambitions. Long-term strategic guidance and implementation support for scaling businesses.',
  }
  return descriptions[service as keyof typeof descriptions] || ''
}

function getExpectedOutcomes(service: string, stage: string): string {
  const outcomes = {
    'Business Reset': [
      '• Clear prioritization framework',
      '• Streamlined operational processes',
      '• Reduced decision fatigue',
      '• Improved team alignment',
    ],
    'Growth Blueprint': [
      '• Validated business model',
      '• Market entry strategy',
      '• Financial projections',
      '• Go-to-market plan',
    ],
    'AI Advantage': [
      '• AI implementation roadmap',
      '• Process automation opportunities',
      '• Efficiency metrics and KPIs',
      '• Technology stack recommendations',
    ],
    'Strategic Partner': [
      '• Long-term strategic roadmap',
      '• Quarterly review framework',
      '• Performance tracking systems',
      '• Continuous improvement processes',
    ],
  }
  
  const serviceOutcomes = outcomes[service as keyof typeof outcomes] || []
  return serviceOutcomes.join('\n')
}
