-- ALIRA Base Schema - Complete Foundation
-- Creates all necessary tables for the authenticated user system

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 3,
  has_purchased BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================
-- DASHBOARDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  industry TEXT,
  stage TEXT,
  status TEXT DEFAULT 'draft',
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================
-- GENERATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  dashboard_id UUID REFERENCES public.dashboards(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GBP',
  status TEXT DEFAULT 'pending',
  stripe_payment_id TEXT,
  credits_purchased INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================
-- EMAIL_NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.email_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_dashboards_user_id ON public.dashboards(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_status ON public.dashboards(status);
CREATE INDEX IF NOT EXISTS idx_dashboards_created_at ON public.dashboards(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generations_dashboard_id ON public.generations(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_generations_type ON public.generations(type);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON public.generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_email_notifications_user_id ON public.email_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON public.email_notifications(status);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - PROFILES
-- ============================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- ============================================
-- RLS POLICIES - DASHBOARDS
-- ============================================
DROP POLICY IF EXISTS "Users can view own dashboards" ON public.dashboards;
DROP POLICY IF EXISTS "Users can create own dashboards" ON public.dashboards;
DROP POLICY IF EXISTS "Users can update own dashboards" ON public.dashboards;
DROP POLICY IF EXISTS "Users can delete own dashboards" ON public.dashboards;

CREATE POLICY "Users can view own dashboards" 
ON public.dashboards FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own dashboards" 
ON public.dashboards FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dashboards" 
ON public.dashboards FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dashboards" 
ON public.dashboards FOR DELETE 
USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES - GENERATIONS
-- ============================================
DROP POLICY IF EXISTS "Users can view own generations" ON public.generations;
DROP POLICY IF EXISTS "Users can create own generations" ON public.generations;

CREATE POLICY "Users can view own generations" 
ON public.generations FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.dashboards 
    WHERE dashboards.id = generations.dashboard_id 
    AND dashboards.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create own generations" 
ON public.generations FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.dashboards 
    WHERE dashboards.id = generations.dashboard_id 
    AND dashboards.user_id = auth.uid()
  )
);

-- ============================================
-- RLS POLICIES - TRANSACTIONS
-- ============================================
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can create own transactions" ON public.transactions;

CREATE POLICY "Users can view own transactions" 
ON public.transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions" 
ON public.transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES - EMAIL_NOTIFICATIONS
-- ============================================
DROP POLICY IF EXISTS "Users can view own notifications" ON public.email_notifications;

CREATE POLICY "Users can view own notifications" 
ON public.email_notifications FOR SELECT 
USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, credits, has_purchased)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    3,
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_dashboards ON public.dashboards;
CREATE TRIGGER set_updated_at_dashboards
  BEFORE UPDATE ON public.dashboards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE public.profiles IS 'User profiles with credits and subscription status';
COMMENT ON TABLE public.dashboards IS 'Business dashboard data for each user project';
COMMENT ON TABLE public.generations IS 'AI-generated content linked to dashboards';
COMMENT ON TABLE public.transactions IS 'Payment transactions and credit purchases';
COMMENT ON TABLE public.email_notifications IS 'Email notification queue and history';

COMMENT ON COLUMN public.profiles.credits IS 'Number of AI generation credits remaining';
COMMENT ON COLUMN public.profiles.has_purchased IS 'Whether user has made any purchases';
COMMENT ON COLUMN public.dashboards.status IS 'Status: draft, complete, archived';
COMMENT ON COLUMN public.generations.type IS 'Type: business_plan, strategy_doc, etc';
COMMENT ON COLUMN public.generations.version IS 'Version number for regenerations';

-- Success message
DO $$ 
BEGIN
  RAISE NOTICE 'Base schema created successfully! Tables: profiles, dashboards, generations, transactions, email_notifications';
END $$;

