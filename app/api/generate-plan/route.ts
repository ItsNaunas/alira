import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';
// Note: You'll need to implement generateBusinessPlan in lib/openai.ts
// import { generateBusinessPlan } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      env.SUPABASE_URL!,
      env.SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { formId, formData } = await request.json();

    // Generate business plan using AI
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

    // Store the generated plan in the database as a generation
    const { data: generation, error: insertError } = await supabase
      .from('generations')
      .insert({
        dashboard_id: formId,
        type: 'business_plan',
        content: businessPlan,
        version: 1
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Update the dashboard with the generation reference
    await supabase
      .from('dashboards')
      .update({
        form_data: { ...formData, generation_id: generation.id }
      })
      .eq('id', formId);

    return NextResponse.json({
      success: true,
      generation: generation,
      dashboardId: formId
    });

  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

