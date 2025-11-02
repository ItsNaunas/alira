-- Migration 012: Add plan generation fields to dashboards
-- Purpose: Add mini_free_plan, ai_plan_summary, and call_to_action columns

ALTER TABLE public.dashboards 
ADD COLUMN IF NOT EXISTS mini_free_plan jsonb,
ADD COLUMN IF NOT EXISTS ai_plan_summary text,
ADD COLUMN IF NOT EXISTS call_to_action text;

COMMENT ON COLUMN public.dashboards.mini_free_plan IS 'Free tier plan containing only Action Items section for idea stage users';
COMMENT ON COLUMN public.dashboards.ai_plan_summary IS 'AI-generated summary with bullet points, key challenges, and recommended next steps';
COMMENT ON COLUMN public.dashboards.call_to_action IS 'Next action: schedule_call or generate_paid_plan';

