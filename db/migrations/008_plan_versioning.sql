-- Migration 008: Plan Versioning and Refinement Chat
-- Purpose: Enable version history and AI refinement chat for business plans

-- Create plan_versions table for version history
CREATE TABLE IF NOT EXISTS plan_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
  generation_id UUID REFERENCES generations(id) ON DELETE SET NULL,
  version_number INTEGER NOT NULL,
  content JSONB NOT NULL,
  changes_summary TEXT,
  parent_version_id UUID REFERENCES plan_versions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(dashboard_id, version_number)
);

-- Create plan_refinement_chats table for AI chat history
CREATE TABLE IF NOT EXISTS plan_refinement_chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL CHECK (message_type IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  suggested_changes JSONB,
  applied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add version_number column to generations table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'generations' AND column_name = 'version_number'
  ) THEN
    ALTER TABLE generations ADD COLUMN version_number INTEGER DEFAULT 1;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_plan_versions_dashboard ON plan_versions(dashboard_id, version_number DESC);
CREATE INDEX IF NOT EXISTS idx_plan_versions_user ON plan_versions(user_id);
CREATE INDEX IF NOT EXISTS idx_plan_refinement_chats_dashboard ON plan_refinement_chats(dashboard_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_plan_refinement_chats_user ON plan_refinement_chats(user_id);

-- Enable Row Level Security
ALTER TABLE plan_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_refinement_chats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for plan_versions
-- Users can view their own plan versions
CREATE POLICY "Users can view own plan versions"
  ON plan_versions
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can create versions for their own plans
CREATE POLICY "Users can create own plan versions"
  ON plan_versions
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own plan versions (for corrections)
CREATE POLICY "Users can update own plan versions"
  ON plan_versions
  FOR UPDATE
  USING (user_id = auth.uid());

-- RLS Policies for plan_refinement_chats
-- Users can view their own refinement chats
CREATE POLICY "Users can view own refinement chats"
  ON plan_refinement_chats
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can create refinement chat messages for their own plans
CREATE POLICY "Users can create own refinement chats"
  ON plan_refinement_chats
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own refinement chat messages (mark as applied)
CREATE POLICY "Users can update own refinement chats"
  ON plan_refinement_chats
  FOR UPDATE
  USING (user_id = auth.uid());

-- Create function to automatically create initial version when generation is created
CREATE OR REPLACE FUNCTION create_initial_plan_version()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create version if it's a business_plan type
  IF NEW.type = 'business_plan' THEN
    INSERT INTO plan_versions (
      dashboard_id,
      generation_id,
      version_number,
      content,
      changes_summary,
      user_id
    ) VALUES (
      NEW.dashboard_id,
      NEW.id,
      1,
      NEW.content,
      'Initial version created by AI',
      NEW.user_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic version creation
DROP TRIGGER IF EXISTS trigger_create_initial_version ON generations;
CREATE TRIGGER trigger_create_initial_version
  AFTER INSERT ON generations
  FOR EACH ROW
  EXECUTE FUNCTION create_initial_plan_version();

-- Add comments for documentation
COMMENT ON TABLE plan_versions IS 'Stores version history of business plans for tracking changes and enabling rollback';
COMMENT ON TABLE plan_refinement_chats IS 'Stores AI refinement chat history for iterative plan improvements';
COMMENT ON COLUMN plan_versions.version_number IS 'Sequential version number starting from 1';
COMMENT ON COLUMN plan_versions.changes_summary IS 'Human-readable summary of what changed in this version';
COMMENT ON COLUMN plan_refinement_chats.message_type IS 'Type of message: user, assistant, or system';
COMMENT ON COLUMN plan_refinement_chats.suggested_changes IS 'JSON object containing AI-suggested changes to plan sections';
COMMENT ON COLUMN plan_refinement_chats.applied IS 'Whether the suggested changes were accepted and applied by user';

