-- Security Layer 3: Row Level Security Policies
-- Run this in your Supabase SQL Editor

-- Enable RLS on all tables
ALTER TABLE intake_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Intake Forms Policies
CREATE POLICY "Users can view their own intake forms"
  ON intake_forms FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own intake forms"
  ON intake_forms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own intake forms"
  ON intake_forms FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own intake forms"
  ON intake_forms FOR DELETE
  USING (auth.uid() = user_id);

-- Dashboards Policies
CREATE POLICY "Users can view their own dashboards"
  ON dashboards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own dashboards"
  ON dashboards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dashboards"
  ON dashboards FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dashboards"
  ON dashboards FOR DELETE
  USING (auth.uid() = user_id);

-- Generations Policies
CREATE POLICY "Users can view their own generations"
  ON generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generations"
  ON generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generations"
  ON generations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generations"
  ON generations FOR DELETE
  USING (auth.uid() = user_id);

-- Users Policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role bypasses all RLS policies automatically

