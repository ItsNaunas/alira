-- Migration 014: Form Drafts Auto-Save
-- Purpose: Save form progress automatically and allow resume

-- Create form_drafts table (one per user)
CREATE TABLE IF NOT EXISTS form_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  current_question_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_form_drafts_user ON form_drafts(user_id);

-- Enable RLS
ALTER TABLE form_drafts ENABLE ROW LEVEL SECURITY;

-- RLS policies
DROP POLICY IF EXISTS "users_manage_own_drafts" ON form_drafts;
CREATE POLICY "users_manage_own_drafts" ON form_drafts
  FOR ALL USING (user_id = auth.uid());

-- Add comments for documentation
COMMENT ON TABLE form_drafts IS 'Stores draft form data to allow users to resume where they left off';
COMMENT ON COLUMN form_drafts.form_data IS 'JSON object containing all form field values';
COMMENT ON COLUMN form_drafts.current_question_index IS 'Index of the current question the user was on';

