import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  pdf
} from '@react-pdf/renderer'
import { BusinessCaseOutline } from './openai'

// Register fonts
Font.register({
  family: 'Times New Roman',
  src: 'https://fonts.gstatic.com/s/timesnewroman/v1/TimesNewRoman.ttf'
})

Font.register({
  family: 'Helvetica Neue',
  src: 'https://fonts.gstatic.com/s/helveticaneue/v1/HelveticaNeue.ttf'
})

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 72, // 1 inch margins
    fontFamily: 'Times New Roman',
    fontSize: 12,
    lineHeight: 1.5,
    color: '#0B0B0B'
  },
  
  // Header
  header: {
    marginBottom: 40,
    borderBottom: '2px solid #C5A572',
    paddingBottom: 20
  },
  
  logo: {
    fontSize: 24,
    fontFamily: 'Helvetica Neue',
    fontWeight: 'bold',
    color: '#0B0B0B',
    marginBottom: 8
  },
  
  subtitle: {
    fontSize: 14,
    color: '#1A2238',
    fontFamily: 'Helvetica Neue'
  },
  
  // Content sections
  section: {
    marginBottom: 24
  },
  
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica Neue',
    fontWeight: 'bold',
    color: '#C5A572',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  
  content: {
    fontSize: 12,
    lineHeight: 1.6,
    marginBottom: 8
  },
  
  listItem: {
    fontSize: 12,
    lineHeight: 1.6,
    marginBottom: 4,
    paddingLeft: 16
  },
  
  // Solution matrix
  solutionMatrix: {
    marginTop: 12
  },
  
  solutionItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FDFDFD',
    border: '1px solid #C5A572'
  },
  
  solutionPillar: {
    fontSize: 14,
    fontFamily: 'Helvetica Neue',
    fontWeight: 'bold',
    color: '#1A2238',
    marginBottom: 8
  },
  
  solutionActions: {
    marginBottom: 8
  },
  
  solutionMeta: {
    fontSize: 10,
    color: '#1A2238',
    fontFamily: 'Helvetica Neue'
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 72,
    left: 72,
    right: 72,
    textAlign: 'center',
    fontSize: 10,
    color: '#1A2238',
    fontFamily: 'Helvetica Neue',
    borderTop: '1px solid #C5A572',
    paddingTop: 12
  },
  
  pageNumber: {
    position: 'absolute',
    bottom: 36,
    left: 72,
    right: 72,
    textAlign: 'center',
    fontSize: 10,
    color: '#1A2238',
    fontFamily: 'Helvetica Neue'
  }
})

// PDF Document Component
interface BusinessCasePDFProps {
  outline: BusinessCaseOutline
  businessName: string
  contactName?: string
  generatedDate: string
}

export const BusinessCasePDF: React.FC<BusinessCasePDFProps> = ({
  outline,
  businessName,
  contactName,
  generatedDate
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>ALIRA.</Text>
        <Text style={styles.subtitle}>Business Case Analysis</Text>
      </View>
      
      {/* Problem Statement */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Problem Statement</Text>
        <Text style={styles.content}>{outline.problem_statement}</Text>
      </View>
      
      {/* Objectives */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Objectives</Text>
        {outline.objectives.map((objective, index) => (
          <Text key={index} style={styles.listItem}>
            • {objective}
          </Text>
        ))}
      </View>
      
      {/* Current State */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current State</Text>
        <Text style={styles.content}>{outline.current_state}</Text>
      </View>
      
      {/* Proposed Solution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Proposed Solution</Text>
        <View style={styles.solutionMatrix}>
          {outline.proposed_solution.map((solution, index) => (
            <View key={index} style={styles.solutionItem}>
              <Text style={styles.solutionPillar}>{solution.pillar}</Text>
              <View style={styles.solutionActions}>
                {solution.actions.map((action, actionIndex) => (
                  <Text key={actionIndex} style={styles.listItem}>
                    • {action}
                  </Text>
                ))}
              </View>
              <Text style={styles.solutionMeta}>
                Effort: {solution.effort.toUpperCase()} | Impact: {solution.impact.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Expected Outcomes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expected Outcomes</Text>
        {outline.expected_outcomes.map((outcome, index) => (
          <Text key={index} style={styles.listItem}>
            • {outcome}
          </Text>
        ))}
      </View>
      
      {/* Next Steps */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Next Steps</Text>
        {outline.next_steps.map((step, index) => (
          <Text key={index} style={styles.listItem}>
            • {step}
          </Text>
        ))}
      </View>
      
      {/* Footer */}
      <Text style={styles.footer}>
        ALIRA. Confidential | Generated for {businessName} | {generatedDate}
      </Text>
      
      {/* Page Number */}
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `Page ${pageNumber} of ${totalPages}`
      )} />
    </Page>
  </Document>
)

// PDF Generation Function
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
  
  const pdfDoc = (
    <BusinessCasePDF
      outline={outline}
      businessName={businessName}
      contactName={contactName}
      generatedDate={generatedDate}
    />
  )
  
  const pdfBuffer = await pdf(pdfDoc).toBuffer()
  return pdfBuffer as any
}
