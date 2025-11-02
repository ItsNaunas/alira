-- Migration 013: Plan Progress Tracking (FIX - If table already exists)
-- Use this if you already ran the old version and want to fix it without losing data

-- Add missing completed_at column
ALTER TABLE plan_progress 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Drop the old unique constraint (without user_id)
ALTER TABLE plan_progress 
DROP CONSTRAINT IF EXISTS plan_progress_dashboard_id_item_type_item_index_key;

-- Add the correct unique constraint (with user_id)
ALTER TABLE plan_progress
ADD CONSTRAINT plan_progress_unique 
UNIQUE(dashboard_id, item_type, item_index, user_id);

-- Add CHECK constraint for item_type if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'plan_progress_item_type_check'
  ) THEN
    ALTER TABLE plan_progress 
    ADD CONSTRAINT plan_progress_item_type_check 
    CHECK (item_type IN ('objective', 'next_step'));
  END IF;
END $$;

-- Add indexes if missing
CREATE INDEX IF NOT EXISTS idx_plan_progress_dashboard ON plan_progress(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_plan_progress_user ON plan_progress(user_id);

