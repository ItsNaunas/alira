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
      business_idea: formData.business_idea || 'Business concept',
      industry: 'General business', // Will be inferred if not explicitly set
      stage: formData.business_stage || 'early',
      business_stage: formData.business_stage || 'early',
      challenges: formData.current_challenges || 'Business development challenges',
      current_challenges: formData.current_challenges || 'Business development challenges',
      goalsShort: formData.immediate_goals || 'Short-term business goals',
      immediate_goals: formData.immediate_goals || 'Short-term business goals',
      goalsLong: 'Long-term business growth and sustainability',
      resources: formData.current_tools || 'Available business resources',
      current_tools: formData.current_tools || 'Available business resources',
      budget: 'To be determined',
      timeline: 'Flexible timeline',
      service: formData.service_interest?.join(', ') || 'General business improvement',
      service_interest: formData.service_interest || [],
      notes: formData.business_idea || 'Business concept not provided'
    };
    
    // Infer industry from business idea text (simple keyword matching)
    const businessIdeaLower = (formData.business_idea || '').toLowerCase()
    let inferredIndustry: 'tech_saas' | 'retail_ecommerce' | 'service' | 'other' = 'other'
    
    if (businessIdeaLower.includes('app') || businessIdeaLower.includes('software') || 
        businessIdeaLower.includes('saas') || businessIdeaLower.includes('platform') || 
        businessIdeaLower.includes('tool') || businessIdeaLower.includes('tech')) {
      inferredIndustry = 'tech_saas'
    } else if (businessIdeaLower.includes('sell') || businessIdeaLower.includes('product') || 
               businessIdeaLower.includes('shop') || businessIdeaLower.includes('store') || 
               businessIdeaLower.includes('retail') || businessIdeaLower.includes('fashion') || 
               businessIdeaLower.includes('clothing') || businessIdeaLower.includes('ecommerce')) {
      inferredIndustry = 'retail_ecommerce'
    } else if (businessIdeaLower.includes('service') || businessIdeaLower.includes('consult') || 
               businessIdeaLower.includes('agency') || businessIdeaLower.includes('coach') || 
               businessIdeaLower.includes('freelance')) {
      inferredIndustry = 'service'
    }
    
    // Map business_stage to BusinessStageType
    const businessStage = (formData.business_stage || 'early') as 'idea' | 'early' | 'growing' | 'established'
    
    console.log('Mapped form data for AI:', mappedFormData);
    console.log('Inferred industry:', inferredIndustry, 'Stage:', businessStage);
    
    // Import and use the actual generateBusinessCase function
    const { generateBusinessCase, generateAIPlanSummary } = await import('@/lib/openai');
    const businessPlan = await generateBusinessCase(mappedFormData, {
      industry: inferredIndustry,
      stage: businessStage
    });

    // Quality validation (non-blocking, logging only)
    try {
      const { checkBusinessCaseQuality } = await import('@/lib/business-case-quality');
      const qualityResult = checkBusinessCaseQuality(businessPlan, inferredIndustry, businessStage);
      
      console.log('Business case quality check:', {
        score: qualityResult.score,
        passed: qualityResult.passed,
        issuesCount: qualityResult.issues.length,
        suggestionsCount: qualityResult.suggestions.length
      });
      
      if (!qualityResult.passed && process.env.NODE_ENV === 'development') {
        console.warn('Quality check issues:', qualityResult.issues);
        console.warn('Quality check suggestions:', qualityResult.suggestions);
      }
    } catch (qualityError) {
      // Non-blocking: continue even if quality check fails
      console.error('Quality check failed (non-blocking):', qualityError);
    }

    // Step 5.1: Handle business_stage === "idea" - extract only Action Items (next_steps)
    let miniFreePlan = null;
    
    if (businessStage === 'idea') {
      miniFreePlan = {
        tier: 'Free',
        action_items: businessPlan.next_steps
      };
      console.log('Created mini_free_plan for idea stage:', miniFreePlan);
    }

    // Step 5.2: Filter out "Other" service from proposed_solution if it exists in service_interest
    const serviceInterest = formData.service_interest || [];
    const hasOtherService = serviceInterest.includes('other');
    
    let filteredBusinessPlan = { ...businessPlan };
    if (hasOtherService) {
      // "Other" is just a signal for a call - don't create a separate section for it
      // Filter out any proposed_solution items that might reference "Other" service
      // (Though ALIRA pillars don't include "Other", we ensure no "Other" related content)
      filteredBusinessPlan = {
        ...businessPlan,
        proposed_solution: businessPlan.proposed_solution.filter(
          solution => !solution.pillar.toLowerCase().includes('other')
        )
      };
      console.log('"Other" service detected - filtered solutions, will set call_to_action to schedule_call');
    }

    // Step 5.3: Generate AI plan summary
    let aiPlanSummaryText = '';
    try {
      const aiSummary = await generateAIPlanSummary(filteredBusinessPlan, {
        businessName: formData.business_idea,
        challenges: formData.current_challenges,
        goalsShort: formData.immediate_goals
      });
      
      // Format as text with bullet points
      const formatBullets = (items: string[]) => items.map(item => `• ${item}`).join('\n');
      aiPlanSummaryText = `AI Summary:\n${formatBullets(aiSummary.ai_summary)}\n\nKey Challenges:\n${formatBullets(aiSummary.key_challenges)}\n\nRecommended Next Steps:\n${formatBullets(aiSummary.recommended_next_steps)}`;
      console.log('Generated AI plan summary');
    } catch (error) {
      console.error('Failed to generate AI plan summary:', error);
      // Continue without summary - don't fail the whole request
    }

    // Step 5.4: Set call_to_action based on whether "Other" is in service_interest
    const callToAction = hasOtherService ? 'schedule_call' : 'generate_paid_plan';
    console.log('Call to action set to:', callToAction);

    // Step 6: Store the generated plan in the database
    const supabase = getServiceClient();
    
    // Create or get dashboard ID
    const dashboardId = formData['dashboardId'];
    
    if (dashboardId) {
      // Verify ownership of existing dashboard
      await verifyOwnership('dashboards', dashboardId, user.id, 'Dashboard');
    }
    
    // Store the generated plan (use filtered version)
    const insertData: any = {
      dashboard_id: dashboardId || null,
      type: 'business_plan',
      content: filteredBusinessPlan,
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
            const dashboardUpdate: any = {
              form_data: { ...formData, generation_id: generation2.id }
            };
            
            // Add new fields if they exist
            if (miniFreePlan !== null) {
              dashboardUpdate.mini_free_plan = miniFreePlan;
            }
            if (aiPlanSummaryText) {
              dashboardUpdate.ai_plan_summary = aiPlanSummaryText;
            }
            dashboardUpdate.call_to_action = callToAction;
            
            await supabase
              .from('dashboards')
              .update(dashboardUpdate)
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
        const dashboardUpdate: any = {
          form_data: { ...formData, generation_id: generation.id }
        };
        
        // Add new fields if they exist
        if (miniFreePlan !== null) {
          dashboardUpdate.mini_free_plan = miniFreePlan;
        }
        if (aiPlanSummaryText) {
          dashboardUpdate.ai_plan_summary = aiPlanSummaryText;
        }
        dashboardUpdate.call_to_action = callToAction;
        
        await supabase
          .from('dashboards')
          .update(dashboardUpdate)
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

