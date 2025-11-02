-- ============================================
-- FINAL MIGRATION FIX - Run this in Supabase SQL Editor
-- ============================================
-- This fixes the existing tables without dropping data
-- Safe to run multiple times (uses IF NOT EXISTS / DROP IF EXISTS)

-- ============================================
-- 1. FIX plan_progress TABLE
-- ============================================

-- Add missing completed_at column
ALTER TABLE public.plan_progress 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Add CHECK constraint for item_type if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'plan_progress_item_type_check'
  ) THEN
    ALTER TABLE public.plan_progress 
    ADD CONSTRAINT plan_progress_item_type_check 
    CHECK (item_type IN ('objective', 'next_step'));
  END IF;
END $$;

-- Drop old unique constraint if it exists (without user_id)
ALTER TABLE public.plan_progress 
DROP CONSTRAINT IF EXISTS plan_progress_dashboard_id_item_type_item_index_key;

-- Add correct unique constraint (with user_id)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'plan_progress_unique'
  ) THEN
    ALTER TABLE public.plan_progress
    ADD CONSTRAINT plan_progress_unique 
    UNIQUE(dashboard_id, item_type, item_index, user_id);
  END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_plan_progress_dashboard ON public.plan_progress(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_plan_progress_user ON public.plan_progress(user_id);

-- ============================================
-- 2. ENABLE RLS FOR plan_progress
-- ============================================

ALTER TABLE public.plan_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own progress" ON public.plan_progress;
DROP POLICY IF EXISTS "users_view_own_progress" ON public.plan_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.plan_progress;
DROP POLICY IF EXISTS "users_update_own_progress" ON public.plan_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.plan_progress;
DROP POLICY IF EXISTS "Users can delete their own progress" ON public.plan_progress;
DROP POLICY IF EXISTS "users_delete_own_progress" ON public.plan_progress;

-- Create RLS policies for plan_progress
CREATE POLICY "Users can view their own progress"
  ON public.plan_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.plan_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.plan_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
  ON public.plan_progress FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 3. ENABLE RLS FOR form_drafts
-- ============================================

ALTER TABLE public.form_drafts ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage their own drafts" ON public.form_drafts;

-- Create RLS policy for form_drafts
CREATE POLICY "Users can manage their own drafts"
  ON public.form_drafts FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '✅ Migration completed successfully!';
  RAISE NOTICE '✅ plan_progress table fixed with completed_at column and correct unique constraint';
  RAISE NOTICE '✅ RLS policies enabled for plan_progress and form_drafts';
END $$;

