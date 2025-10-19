/**
 * Generate Business Plan API Route (Layer 2 Security)
 * 
 * Protected Route - Requires Authentication
 * 
 * Security Pattern Implementation:
 * 1. Authentication verification
 * 2. Input validation
 * 3. Ownership verification
 * 4. Business logic execution
 * 5. Database operations with RLS
 * 6. Success response
 * 7. Centralized error handling
 */

import { NextRequest } from 'next/server';
import { GeneratePlanSchema, validateOrThrow } from '@/lib/server/validation';
import { requireUser, getServiceClient, verifyOwnership } from '@/lib/server/auth';
import { handleApiError, successResponse, errors } from '@/lib/server/errors';
import { checkRateLimit } from '@/lib/rate-limit';
// Note: You'll need to implement generateBusinessPlan in lib/openai.ts
// import { generateBusinessPlan } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    // Step 1: Authenticate user (Layer 2 security)
    const user = await requireUser();
    
    // Step 2: Rate limiting - 5 plan generations per minute per user
    await checkRateLimit(user.id, 'generate-plan', 5, 60000);
    
    // Step 3: Parse and validate input
    const body = await request.json();
    console.log('=== GENERATE PLAN API DEBUG ===');
    console.log('Received body:', JSON.stringify(body, null, 2));
    console.log('User ID:', user.id);
    console.log('Body type:', typeof body);
    console.log('Body keys:', Object.keys(body || {}));
    console.log('Answers field:', body?.answers);
    console.log('Answers type:', typeof body?.answers);
    console.log('Answers keys:', Object.keys(body?.answers || {}));
    let validatedData;
    try {
      validatedData = validateOrThrow(GeneratePlanSchema, body);
      console.log('✅ Validation passed:', validatedData);
    } catch (validationError) {
      console.error('❌ Validation failed:', validationError);
      console.error('❌ Validation error details:', JSON.stringify(validationError, null, 2));
      throw validationError;
    }
    
    // Step 3: Verify user owns the dashboard (if userId is provided)
    if (validatedData.userId && validatedData.userId !== user.id) {
      throw errors.forbidden('You do not have permission to generate a plan for this user');
    }

    // Step 4: Get form data from validated answers
    const formData = validatedData.answers as Record<string, any>;
    
    // Step 5: Generate business plan using AI
    console.log('Generating business plan with form data:', formData);
    
    // Map form data to the format expected by generateBusinessCase
    const mappedFormData = {
      businessName: formData.business_idea || 'Business concept',
      industry: 'General business',
      stage: 'Early stage',
      challenges: formData.current_challenges || 'Business development challenges',
      goalsShort: formData.immediate_goals || 'Short-term business goals',
      goalsLong: 'Long-term business growth and sustainability',
      resources: formData.current_tools || 'Available business resources',
      budget: 'To be determined',
      timeline: 'Flexible timeline',
      service: formData.service_interest?.join(', ') || 'General business improvement',
      notes: formData.business_idea || 'Business concept not provided'
    };
    
    console.log('Mapped form data for AI:', mappedFormData);
    
    // Import and use the actual generateBusinessCase function
    const { generateBusinessCase } = await import('@/lib/openai');
    const businessPlan = await generateBusinessCase(mappedFormData);

    // Step 6: Store the generated plan in the database
    const supabase = getServiceClient();
    
    // Create or get dashboard ID
    const dashboardId = formData['dashboardId'];
    
    if (dashboardId) {
      // Verify ownership of existing dashboard
      await verifyOwnership('dashboards', dashboardId, user.id, 'Dashboard');
    }
    
    // Store the generated plan
    const insertData: any = {
      dashboard_id: dashboardId || null,
      type: 'business_plan',
      content: businessPlan,
      version: 1
    };

    // Only add user_id if the column exists (check by trying to insert)
    try {
      const { data: generation, error: insertError } = await supabase
        .from('generations')
        .insert({
          ...insertData,
          user_id: user.id
        })
        .select()
        .single();

      if (insertError) {
        // If user_id column doesn't exist, try without it
        if (insertError.message.includes('user_id') || insertError.message.includes('column')) {
          console.log('user_id column not found, inserting without it');
          const { data: generation2, error: insertError2 } = await supabase
            .from('generations')
            .insert(insertData)
            .select()
            .single();
          
          if (insertError2) {
            console.error('Database error:', insertError2);
            throw errors.internal('Failed to save generated plan');
          }
          
          // Update the dashboard if it exists
          if (dashboardId) {
            await supabase
              .from('dashboards')
              .update({
                form_data: { ...formData, generation_id: generation2.id }
              })
              .eq('id', dashboardId)
              .eq('user_id', user.id);
          }

          return successResponse({
            generation: generation2,
            dashboardId: dashboardId || null
          });
        } else {
          console.error('Database error:', insertError);
          throw errors.internal('Failed to save generated plan');
        }
      }

      // Update the dashboard if it exists
      if (dashboardId) {
        await supabase
          .from('dashboards')
          .update({
            form_data: { ...formData, generation_id: generation.id }
          })
          .eq('id', dashboardId)
          .eq('user_id', user.id);
      }

      return successResponse({
        generation: generation,
        dashboardId: dashboardId || null
      });
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      throw errors.internal('Failed to save generated plan');
    }

  } catch (error) {
    // Step 8: Centralized error handling (never leaks sensitive data)
    return handleApiError(error);
  }
}

