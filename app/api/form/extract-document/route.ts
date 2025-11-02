import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper to extract text from PDF using pdf-parse
async function extractPDFText(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = await import('pdf-parse')
    // pdf-parse can be imported as default or named export
    const pdf = ('default' in pdfParse ? pdfParse.default : pdfParse) as (buffer: Buffer) => Promise<{ text: string }>
    const data = await pdf(buffer)
    return data.text
  } catch (error) {
    console.error('PDF extraction error:', error)
    throw new Error('Failed to extract text from PDF')
  }
}

// Helper to extract text from DOCX using mammoth
async function extractDOCXText(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  } catch (error) {
    console.error('DOCX extraction error:', error)
    throw new Error('Failed to extract text from DOCX')
  }
}

// Simple AI-based extraction using pattern matching and keywords
async function extractFormData(text: string): Promise<{
  business_idea?: string
  current_challenges?: string
  immediate_goals?: string
}> {
  const extracted: {
    business_idea?: string
    current_challenges?: string
    immediate_goals?: string
  } = {}

  const lowerText = text.toLowerCase()
  
  // Extract business idea - look for patterns like "business idea", "venture", "company", "startup"
  const ideaPatterns = [
    /(?:business\s+idea|venture|company|startup|business)[:\s]*([^.\n]{20,200})/i,
    /(?:what|describe|tell)[^.]*?\b(?:business|idea|venture)[^.]*?[:\s]*([^.\n]{20,200})/i,
    /(?:i\s+want\s+to|we\s+are|our\s+goal\s+is)[^.]*?([^.\n]{20,200})/i
  ]
  
  for (const pattern of ideaPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const idea = match[1].trim()
      if (idea.length >= 10) {
        extracted.business_idea = idea
        break
      }
    }
  }

  // Extract challenges - look for words like "challenge", "problem", "issue", "struggle"
  const challengePatterns = [
    /(?:challenges?|problems?|issues?|struggles?|difficulties?)[:\s]*([^.\n]{20,300})/i,
    /(?:what\s+are|what's|the\s+main)[^.]*?(?:challenge|problem|issue)[^.]*?[:\s]*([^.\n]{20,300})/i,
    /(?:facing|dealing\s+with|struggling\s+with)[^.]*?([^.\n]{20,300})/i
  ]
  
  for (const pattern of challengePatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const challenge = match[1].trim()
      if (challenge.length >= 10) {
        extracted.current_challenges = challenge
        break
      }
    }
  }

  // Extract goals - look for words like "goal", "objective", "target", "aim"
  const goalPatterns = [
    /(?:goals?|objectives?|targets?|aims?)[:\s]*([^.\n]{20,300})/i,
    /(?:what\s+do\s+you\s+want|plan\s+to|hope\s+to|wish\s+to)[^.]*?[:\s]*([^.\n]{20,300})/i,
    /(?:in\s+the\s+next|within\s+the\s+next)[^.]*?([^.\n]{20,300})/i
  ]
  
  for (const pattern of goalPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const goal = match[1].trim()
      if (goal.length >= 10) {
        extracted.immediate_goals = goal
        break
      }
    }
  }

  // If no structured data found, use first substantial paragraphs
  if (!extracted.business_idea || !extracted.current_challenges || !extracted.immediate_goals) {
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length >= 20)
    
    if (!extracted.business_idea && paragraphs[0]) {
      extracted.business_idea = paragraphs[0].trim().substring(0, 500)
    }
    
    if (!extracted.current_challenges && paragraphs[1]) {
      extracted.current_challenges = paragraphs[1].trim().substring(0, 500)
    }
    
    if (!extracted.immediate_goals && paragraphs[2]) {
      extracted.immediate_goals = paragraphs[2].trim().substring(0, 500)
    }
  }

  return extracted
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const fileName = file.name.toLowerCase()
    const isValidType = fileName.endsWith('.pdf') || 
                        fileName.endsWith('.docx') || 
                        fileName.endsWith('.doc')
    
    if (!isValidType) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOCX, and DOC files are supported.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text based on file type
    let extractedText = ''
    
    if (fileName.endsWith('.pdf')) {
      extractedText = await extractPDFText(buffer)
    } else if (fileName.endsWith('.docx')) {
      extractedText = await extractDOCXText(buffer)
    } else if (fileName.endsWith('.doc')) {
      // DOC files need to be converted - for now, return error
      return NextResponse.json(
        { error: 'DOC files are not yet supported. Please convert to DOCX or PDF.' },
        { status: 400 }
      )
    }

    if (!extractedText || extractedText.trim().length < 10) {
      return NextResponse.json(
        { error: 'Could not extract meaningful text from document' },
        { status: 400 }
      )
    }

    // Extract form data using pattern matching
    const extractedData = await extractFormData(extractedText)

    // Return extracted data
    return NextResponse.json({
      success: true,
      extractedData,
      extractedTextLength: extractedText.length
    })

  } catch (error: any) {
    console.error('Document extraction error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process document',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

