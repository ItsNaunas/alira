/**
 * Generate PDF API Route (Layer 2 Security)
 * 
 * Protected Route - Requires Authentication
 * 
 * Generates PDF on-demand for existing plans
 */

import { NextRequest } from 'next/server'
import { requireUser, getServiceClient } from '@/lib/server/auth'
import { handleApiError, successResponse, errors } from '@/lib/server/errors'
import { z } from 'zod'
import { validateOrThrow } from '@/lib/server/validation'

const GeneratePDFSchema = z.object({
  planId: z.string().uuid('Invalid plan ID')
})

export async function POST(request: NextRequest) {
  try {
    // Step 1: Authenticate user
    const user = await requireUser()
    
    // Step 2: Parse and validate input
    const body = await request.json()
    const { planId } = validateOrThrow(GeneratePDFSchema, body)

    // Step 3: Get plan and verify ownership
    const supabase = getServiceClient()
    
    const { data: dashboard, error: dashboardError } = await supabase
      .from('dashboards')
      .select(`
        *,
        generations (
          id,
          type,
          content,
          created_at
        )
      `)
      .eq('id', planId)
      .eq('user_id', user.id)
      .single()

    if (dashboardError || !dashboard) {
      throw errors.notFound('Plan not found or access denied')
    }

    if (!dashboard.generations || dashboard.generations.length === 0) {
      throw errors.badRequest('Plan has no content to generate PDF from')
    }

    // Step 4: Prepare PDF data
    const generation = dashboard.generations[0]
    const pdfData = {
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      business_idea: dashboard.business_name || 'Business Plan',
      current_challenges: dashboard.current_challenges || 'Not specified',
      immediate_goals: dashboard.immediate_goals || 'Not specified',
      service_interest: dashboard.service_interest || [],
      current_tools: dashboard.current_tools || undefined,
      generatedDate: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      aiAnalysis: generation.content
    }

    // Step 5: Generate PDF
    const { generatePersonalPlanPDF } = await import('@/lib/enhanced-pdf')
    const pdfBuffer = await generatePersonalPlanPDF(pdfData)

    // Step 6: Try to upload PDF to Supabase Storage
    const fileName = `plans/${planId}/plan-${Date.now()}.pdf`
    let publicUrl: string | null = null
    
    try {
      // Check if service role key is configured
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not set - skipping storage upload')
        throw new Error('Service role key not configured')
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(fileName, pdfBuffer, {
          contentType: 'application/pdf',
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('PDF upload error:', uploadError)
        console.error('Error details:', {
          statusCode: uploadError.statusCode,
          message: uploadError.message,
          error: uploadError.error
        })
        
        // Provide helpful error messages
        if (uploadError.statusCode === '404') {
          console.error('❌ Storage bucket "pdfs" not found. Please create it in Supabase Dashboard.')
          console.error('📝 Instructions: https://supabase.com/docs/guides/storage')
        }
        
        // Continue without storage - we'll return the PDF as base64
      } else {
        // Step 7: Get public URL
        const { data: { publicUrl: url } } = supabase.storage
          .from('pdfs')
          .getPublicUrl(fileName)
        
        publicUrl = url

        // Step 8: Update dashboard with PDF URL
        const { error: updateError } = await supabase
          .from('dashboards')
          .update({
            pdf_url: publicUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', planId)

        if (updateError) {
          console.error('Failed to update dashboard with PDF URL:', updateError)
          // Don't fail the request - PDF is generated
        }
      }
    } catch (storageError) {
      console.error('Storage operation failed:', storageError)
      // Continue without storage - we'll return the PDF as base64
    }

    // Step 9: Return success with PDF URL or base64 data
    if (publicUrl) {
      return successResponse({
        message: 'PDF generated successfully',
        pdf_url: publicUrl,
        planId
      })
    } else {
      // Return PDF as base64 for direct download
      const base64Pdf = pdfBuffer.toString('base64')
      return successResponse({
        message: 'PDF generated successfully',
        pdf_base64: base64Pdf,
        planId
      })
    }

  } catch (error) {
    return handleApiError(error)
  }
}

