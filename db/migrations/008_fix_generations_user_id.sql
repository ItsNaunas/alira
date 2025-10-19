-- Fix generations table - Add user_id column
-- This migration fixes the "Failed to generate plan" error

-- Add user_id to generations table  
ALTER TABLE public.generations
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON public.generations(user_id);

-- Update RLS policies to use user_id directly
DROP POLICY IF EXISTS "Users can view own generations" ON public.generations;
DROP POLICY IF EXISTS "Users can create own generations" ON public.generations;

CREATE POLICY "Users can view own generations" 
ON public.generations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own generations" 
ON public.generations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Backfill existing data (optional - only if you have existing generations)
-- Uncomment the following lines if you have existing data to migrate:
-- UPDATE public.generations
-- SET user_id = (
--   SELECT user_id FROM public.dashboards WHERE id = generations.dashboard_id LIMIT 1
-- )
-- WHERE user_id IS NULL AND dashboard_id IS NOT NULL;

-- Success message
DO $$ 
BEGIN
  RAISE NOTICE 'Migration 008 completed: user_id column added to generations table';
END $$;
