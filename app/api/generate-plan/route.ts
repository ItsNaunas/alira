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
// Note: You'll need to implement generateBusinessPlan in lib/openai.ts
// import { generateBusinessPlan } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    // Step 1: Authenticate user (Layer 2 security)
    const user = await requireUser();
    
    // Step 2: Parse and validate input
    const body = await request.json();
    const validatedData = validateOrThrow(GeneratePlanSchema, body);
    
    // Step 3: Verify user owns the dashboard (if userId is provided)
    if (validatedData.userId && validatedData.userId !== user.id) {
      throw errors.forbidden('You do not have permission to generate a plan for this user');
    }

    // Step 4: Get form data from validated answers
    const formData = validatedData.answers;
    
    // Step 5: Generate business plan using AI
    // TODO: Implement generateBusinessPlan in lib/openai.ts
    // For now, return a placeholder structure
    const businessPlan = {
      problem_statement: formData.current_challenges || 'Challenge analysis pending',
      objectives: [formData.immediate_goals || 'Goals to be defined'],
      proposed_solution: [
        {
          pillar: 'Strategy',
          actions: ['Action items based on selected services'],
          effort: 'medium',
          impact: 'high'
        }
      ],
      expected_outcomes: ['Outcomes based on goals'],
      next_steps: ['Next steps to be defined']
    };
    
    // Uncomment when generateBusinessPlan is implemented:
    // const businessPlan = await generateBusinessPlan({
    //   business_idea: formData.business_idea,
    //   current_challenges: formData.current_challenges,
    //   immediate_goals: formData.immediate_goals,
    //   service_interest: formData.service_interest,
    //   current_tools: formData.current_tools
    // });

    // Step 6: Store the generated plan in the database
    const supabase = getServiceClient();
    
    // Create or get dashboard ID
    const dashboardId = formData.dashboardId;
    
    if (dashboardId) {
      // Verify ownership of existing dashboard
      await verifyOwnership('dashboards', dashboardId, user.id, 'Dashboard');
    }
    
    // Store the generated plan
    const { data: generation, error: insertError } = await supabase
      .from('generations')
      .insert({
        dashboard_id: dashboardId || null,
        type: 'business_plan',
        content: businessPlan,
        version: 1,
        user_id: user.id
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database error:', insertError);
      throw errors.internal('Failed to save generated plan');
    }

    // Update the dashboard if it exists
    if (dashboardId) {
      await supabase
        .from('dashboards')
        .update({
          form_data: { ...formData, generation_id: generation.id }
        })
        .eq('id', dashboardId)
        .eq('user_id', user.id); // Additional security check
    }

    // Step 7: Return success response
    return successResponse({
      generation: generation,
      dashboardId: dashboardId || null
    });

  } catch (error) {
    // Step 8: Centralized error handling (never leaks sensitive data)
    return handleApiError(error);
  }
}

