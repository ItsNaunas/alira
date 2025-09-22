import { BusinessCaseOutline } from './openai'

// Enhanced PDF generation with full business case content
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

  // Create a comprehensive PDF content with all business case sections
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
/Length 5000
>>
stream
BT
/F1 16 Tf
72 720 Td
(ALIRA. Business Case Analysis) Tj
0 -25 Td
/F1 12 Tf
(Generated for ${businessName}) Tj
0 -20 Td
(${generatedDate}) Tj
0 -40 Td
/F1 14 Tf
(Problem Statement) Tj
0 -20 Td
/F1 10 Tf
(${outline.problem_statement}) Tj
0 -30 Td
/F1 14 Tf
(Objectives) Tj
0 -20 Td
/F1 10 Tf
${outline.objectives.map(obj => `(• ${obj}) Tj 0 -15 Td`).join(' ')}
0 -20 Td
/F1 14 Tf
(Current State) Tj
0 -20 Td
/F1 10 Tf
(${outline.current_state}) Tj
0 -30 Td
/F1 14 Tf
(Proposed Solution) Tj
0 -20 Td
/F1 10 Tf
${outline.proposed_solution.map(solution => `
(${solution.pillar}) Tj 0 -15 Td
${solution.actions.map(action => `(• ${action}) Tj 0 -12 Td`).join(' ')}
(Effort: ${solution.effort.toUpperCase()} | Impact: ${solution.impact.toUpperCase()}) Tj 0 -20 Td
`).join(' ')}
0 -20 Td
/F1 14 Tf
(Expected Outcomes) Tj
0 -20 Td
/F1 10 Tf
${outline.expected_outcomes.map(outcome => `(• ${outcome}) Tj 0 -15 Td`).join(' ')}
0 -20 Td
/F1 14 Tf
(Next Steps) Tj
0 -20 Td
/F1 10 Tf
${outline.next_steps.map(step => `(• ${step}) Tj 0 -15 Td`).join(' ')}
0 -40 Td
/F1 8 Tf
(ALIRA. Confidential | Generated for ${businessName} | ${generatedDate}) Tj
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
5000
%%EOF
  `

  // Convert to Buffer
  return Buffer.from(pdfContent, 'utf-8')
}
