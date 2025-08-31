import { BusinessCaseOutline } from './openai'

// Simple PDF generation using a more compatible approach
export async function generatePDFBuffer(
  outline: BusinessCaseOutline,
  businessName: string,
  contactName?: string
): Promise<Buffer> {
  const generatedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  // Create a simple HTML-based PDF content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Business Case - ${businessName}</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          font-size: 12px;
          line-height: 1.5;
          color: #0B0B0B;
          margin: 72px;
          max-width: 800px;
        }
        .header {
          border-bottom: 2px solid #C5A572;
          padding-bottom: 20px;
          margin-bottom: 40px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #0B0B0B;
          margin-bottom: 8px;
        }
        .subtitle {
          font-size: 14px;
          color: #1A2238;
        }
        .section {
          margin-bottom: 24px;
        }
        .sectionTitle {
          font-size: 16px;
          font-weight: bold;
          color: #C5A572;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .content {
          font-size: 12px;
          line-height: 1.6;
          margin-bottom: 8px;
        }
        .listItem {
          font-size: 12px;
          line-height: 1.6;
          margin-bottom: 4px;
          padding-left: 16px;
        }
        .solutionItem {
          margin-bottom: 16px;
          padding: 12px;
          background-color: #FDFDFD;
          border: 1px solid #C5A572;
        }
        .solutionPillar {
          font-size: 14px;
          font-weight: bold;
          color: #1A2238;
          margin-bottom: 8px;
        }
        .solutionMeta {
          font-size: 10px;
          color: #1A2238;
        }
        .footer {
          position: fixed;
          bottom: 72px;
          left: 72px;
          right: 72px;
          text-align: center;
          font-size: 10px;
          color: #1A2238;
          border-top: 1px solid #C5A572;
          padding-top: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">ALIRA.</div>
        <div class="subtitle">Business Case Analysis</div>
      </div>
      
      <div class="section">
        <div class="sectionTitle">Problem Statement</div>
        <div class="content">${outline.problem_statement}</div>
      </div>
      
      <div class="section">
        <div class="sectionTitle">Objectives</div>
        ${outline.objectives.map(objective => `<div class="listItem">• ${objective}</div>`).join('')}
      </div>
      
      <div class="section">
        <div class="sectionTitle">Current State</div>
        <div class="content">${outline.current_state}</div>
      </div>
      
      <div class="section">
        <div class="sectionTitle">Proposed Solution</div>
        ${outline.proposed_solution.map(solution => `
          <div class="solutionItem">
            <div class="solutionPillar">${solution.pillar}</div>
            ${solution.actions.map(action => `<div class="listItem">• ${action}</div>`).join('')}
            <div class="solutionMeta">
              Effort: ${solution.effort.toUpperCase()} | Impact: ${solution.impact.toUpperCase()}
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="section">
        <div class="sectionTitle">Expected Outcomes</div>
        ${outline.expected_outcomes.map(outcome => `<div class="listItem">• ${outcome}</div>`).join('')}
      </div>
      
      <div class="section">
        <div class="sectionTitle">Next Steps</div>
        ${outline.next_steps.map(step => `<div class="listItem">• ${step}</div>`).join('')}
      </div>
      
      <div class="footer">
        ALIRA. Confidential | Generated for ${businessName} | ${generatedDate}
      </div>
    </body>
    </html>
  `

  // For now, return a simple text-based PDF structure
  // In production, you'd use a proper PDF library like puppeteer or jsPDF
  const pdfContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 1000
>>
stream
BT
/F1 12 Tf
72 720 Td
(ALIRA. Business Case Analysis) Tj
0 -20 Td
(Generated for ${businessName}) Tj
0 -20 Td
(${generatedDate}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF
  `

  // Convert to Buffer
  return Buffer.from(pdfContent, 'utf-8')
}
