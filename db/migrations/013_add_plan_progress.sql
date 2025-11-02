-- Migration 013: Plan Progress Tracking
-- Purpose: Enable users to mark objectives and next steps as complete

-- Create plan_progress table
CREATE TABLE IF NOT EXISTS plan_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id UUID REFERENCES dashboards(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('objective', 'next_step')),
  item_index INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(dashboard_id, item_type, item_index, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_plan_progress_dashboard ON plan_progress(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_plan_progress_user ON plan_progress(user_id);

-- Enable RLS
ALTER TABLE plan_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies (users see only their own progress)
DROP POLICY IF EXISTS "users_view_own_progress" ON plan_progress;
CREATE POLICY "users_view_own_progress" ON plan_progress
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "users_update_own_progress" ON plan_progress;
CREATE POLICY "users_update_own_progress" ON plan_progress
  FOR INSERT, UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "users_delete_own_progress" ON plan_progress;
CREATE POLICY "users_delete_own_progress" ON plan_progress
  FOR DELETE USING (user_id = auth.uid());

-- Add comments for documentation
COMMENT ON TABLE plan_progress IS 'Tracks completion status of objectives and next steps in business plans';
COMMENT ON COLUMN plan_progress.item_type IS 'Type of item: objective or next_step';
COMMENT ON COLUMN plan_progress.item_index IS 'Index of the item in the objectives/next_steps array';

