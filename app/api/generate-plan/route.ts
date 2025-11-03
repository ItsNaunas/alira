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
    
    // Extract methodology insights from conversation data
    const extractMethodologyInsights = (formData: Record<string, any>) => {
      const insights: {
        challengeKeywords: string[]
        mentionedMetrics: string[]
        quantifiedImpacts: Array<{ type: string; value: string }>
        rootCauseIndicators: string[]
      } = {
        challengeKeywords: [],
        mentionedMetrics: [],
        quantifiedImpacts: [],
        rootCauseIndicators: []
      }
      
      // Extract from challenges
      const challengesText = (formData.current_challenges || '').toLowerCase()
      const goalsText = (formData.immediate_goals || '').toLowerCase()
      const businessIdeaText = (formData.business_idea || '').toLowerCase()
      
      // Extract challenge keywords (potential symptoms)
      const symptomKeywords = ['not getting', 'struggling', 'failing', 'low', 'high', 'lack of', 'unable to', 'difficult', 'slow']
      symptomKeywords.forEach(keyword => {
        if (challengesText.includes(keyword)) {
          insights.challengeKeywords.push(keyword)
        }
      })
      
      // Extract mentioned metrics from industry-specific metrics
      const industryMetrics = {
        tech_saas: ['mrr', 'ltv', 'cac', 'churn', 'conversion', 'activation', 'retention'],
        retail_ecommerce: ['aov', 'conversion', 'inventory', 'return rate', 'lifetime value', 'repeat purchase'],
        service: ['utilization', 'margin', 'acquisition cost', 'nps', 'retention', 'project value'],
        other: ['revenue', 'growth', 'acquisition cost', 'conversion', 'retention', 'efficiency']
      }
      
      const relevantMetrics = industryMetrics[inferredIndustry] || industryMetrics.other
      relevantMetrics.forEach(metric => {
        if (challengesText.includes(metric) || goalsText.includes(metric) || businessIdeaText.includes(metric)) {
          insights.mentionedMetrics.push(metric)
        }
      })
      
      // Extract quantified impacts (numbers, percentages, time periods)
      const numberPattern = /£?\d+[kkm]?|\d+%|\d+\s*(hours?|days?|weeks?|months?|years?)/gi
      const challengesMatches = challengesText.match(numberPattern) || []
      const goalsMatches = goalsText.match(numberPattern) || []
      
      ;[...challengesMatches, ...goalsMatches].forEach(match => {
        if (!insights.quantifiedImpacts.find(i => i.value === match)) {
          insights.quantifiedImpacts.push({
            type: match.includes('£') ? 'cost' : match.includes('%') ? 'percentage' : match.match(/\d+\s*(hour|day|week|month|year)/) ? 'time' : 'number',
            value: match
          })
        }
      })
      
      // Identify root cause indicators
      const rootCauseIndicators = ['because', 'due to', 'result of', 'caused by', 'lack of', 'missing', 'no', 'without']
      rootCauseIndicators.forEach(indicator => {
        if (challengesText.includes(indicator)) {
          insights.rootCauseIndicators.push(indicator)
        }
      })
      
      return insights
    }
    
    const methodologyInsights = extractMethodologyInsights(formData)
    
    // Enhance mappedFormData with methodology context
    const enhancedMappedFormData = {
      ...mappedFormData,
      methodologyContext: {
        challengeKeywords: methodologyInsights.challengeKeywords,
        mentionedMetrics: methodologyInsights.mentionedMetrics,
        quantifiedImpacts: methodologyInsights.quantifiedImpacts,
        rootCauseIndicators: methodologyInsights.rootCauseIndicators,
        industry: inferredIndustry,
        stage: businessStage
      },
      // Add explicit context for 5 Whys analysis
      rootCausePrompt: formData.current_challenges 
        ? `Analyze this challenge using 5 Whys: "${formData.current_challenges}". Identify the root cause, not just symptoms.`
        : undefined
    }
    
    console.log('Mapped form data for AI:', mappedFormData);
    console.log('Methodology insights extracted:', methodologyInsights);
    console.log('Inferred industry:', inferredIndustry, 'Stage:', businessStage);
    
    // Import and use the actual generateBusinessCase function
    const { generateBusinessCase, generateAIPlanSummary } = await import('@/lib/openai');
    const businessPlan = await generateBusinessCase(enhancedMappedFormData, {
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
    
    // Store the generated plan - user_id is REQUIRED (security critical)
    const insertData = {
      dashboard_id: dashboardId || null,
      type: 'business_plan',
      content: filteredBusinessPlan,
      version: 1,
      user_id: user.id // REQUIRED - security critical, never optional
    };
    
    // Insert generation - fail hard if user_id cannot be set (removed fallback logic)
    const { data: generation, error: insertError } = await supabase
      .from('generations')
      .insert(insertData)
      .select()
      .single();
    
    if (insertError) {
      console.error('Failed to insert generation:', insertError);
      
      // Security: If user_id column issue, this is a critical error - DO NOT FALLBACK
      if (insertError.message.includes('user_id') || 
          insertError.code === '42703' || 
          (insertError.message.includes('column') && insertError.message.includes('user_id'))) {
        throw errors.internal(
          'Security: Database schema issue - user_id column missing or invalid. ' +
          'Please run migration 009_secure_generations_user_id.sql'
        );
      }
      
      throw errors.internal('Failed to save generated plan');
    }
    
    // Verify user_id was actually set (defense in depth)
    if (!generation?.user_id || generation.user_id !== user.id) {
      console.error('SECURITY ALERT: Generation created without correct user_id', {
        generationId: generation?.id,
        expectedUserId: user.id,
        actualUserId: generation?.user_id
      });
      
      // Delete the incorrectly created generation if it exists
      if (generation?.id) {
        await supabase
          .from('generations')
          .delete()
          .eq('id', generation.id);
      }
      
      throw errors.internal('Security: Plan generation failed - user association error');
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
        .eq('user_id', user.id); // Security: Always filter by user_id
    }
    
    return successResponse({
      generation: generation,
      dashboardId: dashboardId || null
    });

  } catch (error) {
    // Step 8: Centralized error handling (never leaks sensitive data)
    return handleApiError(error);
  }
}

