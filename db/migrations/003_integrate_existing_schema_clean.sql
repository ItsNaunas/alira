ALTER TABLE public.dashboards 
ADD COLUMN IF NOT EXISTS current_challenges text,
ADD COLUMN IF NOT EXISTS immediate_goals text,
ADD COLUMN IF NOT EXISTS service_interest text[],
ADD COLUMN IF NOT EXISTS current_tools text,
ADD COLUMN IF NOT EXISTS form_data jsonb DEFAULT '{}'::jsonb;

DO $$ 
BEGIN
  UPDATE public.dashboards 
  SET status = 'draft' 
  WHERE status = 'incomplete';
END $$;

CREATE INDEX IF NOT EXISTS idx_dashboards_user_id ON public.dashboards(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_status ON public.dashboards(status);
CREATE INDEX IF NOT EXISTS idx_dashboards_created_at ON public.dashboards(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_generations_dashboard_id ON public.generations(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_generations_type ON public.generations(type);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON public.generations(created_at DESC);

ALTER TABLE public.dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own dashboards" ON public.dashboards;
DROP POLICY IF EXISTS "Users can create own dashboards" ON public.dashboards;
DROP POLICY IF EXISTS "Users can update own dashboards" ON public.dashboards;
DROP POLICY IF EXISTS "Users can delete own dashboards" ON public.dashboards;

DROP POLICY IF EXISTS "Users can view own generations" ON public.generations;
DROP POLICY IF EXISTS "Users can create own generations" ON public.generations;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

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

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON COLUMN public.dashboards.current_challenges IS 'User''s current operational challenges (from conversational form)';
COMMENT ON COLUMN public.dashboards.immediate_goals IS 'User''s 3-6 month goals (from conversational form)';
COMMENT ON COLUMN public.dashboards.service_interest IS 'Array of services user is interested in';
COMMENT ON COLUMN public.dashboards.current_tools IS 'Current tools/tech stack user has';
COMMENT ON COLUMN public.dashboards.form_data IS 'Complete form data as JSON for flexibility';

DO $$ 
BEGIN
  RAISE NOTICE 'Migration completed successfully! Your existing schema has been integrated with the conversational form system.';
END $$;

