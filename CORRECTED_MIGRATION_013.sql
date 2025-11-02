-- Migration 013: Plan Progress Tracking (CORRECTED)
-- Run this to fix the table if you already created it

-- First, drop the existing table if you already ran the old version
DROP TABLE IF EXISTS plan_progress CASCADE;

-- Create plan_progress table with correct structure
CREATE TABLE plan_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('objective', 'next_step')),
  item_index INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,  -- ✅ ADDED: This column is needed
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(dashboard_id, item_type, item_index, user_id)  -- ✅ FIXED: Added user_id
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_plan_progress_dashboard ON plan_progress(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_plan_progress_user ON plan_progress(user_id);

-- Enable RLS
ALTER TABLE plan_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies
DROP POLICY IF EXISTS "Users can view their own progress" ON plan_progress;
CREATE POLICY "Users can view their own progress"
  ON plan_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own progress" ON plan_progress;
CREATE POLICY "Users can insert their own progress"
  ON plan_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON plan_progress;
CREATE POLICY "Users can update their own progress"
  ON plan_progress FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own progress" ON plan_progress;
CREATE POLICY "Users can delete their own progress"
  ON plan_progress FOR DELETE
  USING (auth.uid() = user_id);

