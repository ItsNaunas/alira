-- ALIRA Database Schema
-- Migration: 002_add_auth.sql
-- Add user authentication and link existing tables to users

-- Add user_id to intake_forms table to link drafts to users
ALTER TABLE intake_forms ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to business_cases table
ALTER TABLE business_cases ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create user profiles table for additional user data
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT,
  company_name TEXT,
  avatar_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for user relationships
CREATE INDEX IF NOT EXISTS idx_intake_forms_user_id ON intake_forms(user_id);
CREATE INDEX IF NOT EXISTS idx_business_cases_user_id ON business_cases(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);

-- Enable RLS on user profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Update RLS policies to be user-specific

-- Intake forms policies (users can only see their own drafts)
DROP POLICY IF EXISTS "read_intake_forms_public" ON intake_forms;
DROP POLICY IF EXISTS "update_intake_forms_public" ON intake_forms;
DROP POLICY IF EXISTS "write_intake_forms_public" ON intake_forms;

CREATE POLICY "users_insert_own_intake_forms" ON intake_forms
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "users_select_own_intake_forms" ON intake_forms
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "users_update_own_intake_forms" ON intake_forms
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Business cases policies (users can only see their own cases)
DROP POLICY IF EXISTS "read_own_cases_public" ON business_cases;

CREATE POLICY "users_select_own_business_cases" ON business_cases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_business_cases" ON business_cases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leads policies (users can manage their own leads)
DROP POLICY IF EXISTS "write_leads_public" ON leads;

CREATE POLICY "users_insert_own_leads" ON leads
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "users_select_own_leads" ON leads
  FOR SELECT USING (auth.uid() = user_id);

-- User profiles policies (users can only manage their own profile)
CREATE POLICY "users_select_own_profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_insert_own_profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own_profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Comments
COMMENT ON TABLE user_profiles IS 'Extended user profile data linked to Supabase Auth users';
COMMENT ON COLUMN intake_forms.user_id IS 'Links draft to authenticated user';
COMMENT ON COLUMN business_cases.user_id IS 'Links business case to authenticated user';
COMMENT ON COLUMN leads.user_id IS 'Links lead to authenticated user';

