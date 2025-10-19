-- Fix RLS policies for dashboards
ALTER TABLE public.dashboards ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they're correct
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

-- Success message
DO $$ 
BEGIN
  RAISE NOTICE 'RLS policies fixed for dashboards table!';
END $$;


