-- Migration: Add Performance Indexes
-- Purpose: Improve query performance on frequently queried columns
-- Date: 2025-10-19
-- Reference: Audit Report LOW-006

-- Add missing indexes for intake_forms table (if it exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'intake_forms') THEN
    CREATE INDEX IF NOT EXISTS idx_intake_forms_email ON public.intake_forms(email);
    CREATE INDEX IF NOT EXISTS idx_intake_forms_status ON public.intake_forms(status);
    CREATE INDEX IF NOT EXISTS idx_intake_forms_resume_token ON public.intake_forms(resume_token);
    CREATE INDEX IF NOT EXISTS idx_intake_forms_user_id ON public.intake_forms(user_id);
    CREATE INDEX IF NOT EXISTS idx_intake_forms_user_status ON public.intake_forms(user_id, status);
    RAISE NOTICE 'Created indexes for intake_forms table';
  END IF;
END $$;

-- Add index for email notifications
CREATE INDEX IF NOT EXISTS idx_email_notifications_sent_at ON public.email_notifications(sent_at DESC);

-- Add index for transactions (not present in base schema, so already has FK index)
-- CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);

-- Note: generations already has these indexes from base schema (000_base_schema.sql):
-- - idx_generations_dashboard_id
-- - idx_generations_type
-- - idx_generations_created_at

-- Add index for plan_versions table (if it exists from migration 008)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'plan_versions') THEN
    -- These might already exist from migration 008, but IF NOT EXISTS will handle it
    CREATE INDEX IF NOT EXISTS idx_plan_versions_dashboard_id ON public.plan_versions(dashboard_id);
    CREATE INDEX IF NOT EXISTS idx_plan_versions_created_at ON public.plan_versions(created_at DESC);
    RAISE NOTICE 'Created indexes for plan_versions table';
  END IF;
END $$;

