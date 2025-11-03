-- Migration 009: Secure Generations Table - Make user_id Required
-- Purpose: Prevent orphaned plans by requiring user_id and enforcing RLS
-- Date: 2025-01-XX

-- Step 1: Backfill any NULL user_ids from dashboard ownership (safety check)
UPDATE public.generations g
SET user_id = d.user_id
FROM public.dashboards d
WHERE g.dashboard_id = d.id
  AND g.user_id IS NULL
  AND d.user_id IS NOT NULL;

-- Step 2: Delete any orphaned generations that can't be recovered
DELETE FROM public.generations 
WHERE user_id IS NULL;

-- Step 3: Make user_id NOT NULL (enforces requirement at database level)
ALTER TABLE public.generations
ALTER COLUMN user_id SET NOT NULL;

-- Step 4: Ensure index exists for performance
CREATE INDEX IF NOT EXISTS idx_generations_user_id 
ON public.generations(user_id);

-- Step 5: Ensure RLS is enabled
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- Step 6: Drop existing policies (if any) to recreate with proper constraints
DROP POLICY IF EXISTS "Users can view own generations" ON public.generations;
DROP POLICY IF EXISTS "Users can create own generations" ON public.generations;
DROP POLICY IF EXISTS "Users can update own generations" ON public.generations;
DROP POLICY IF EXISTS "Users can delete own generations" ON public.generations;

-- Step 7: Create secure RLS policies

-- SELECT: Users can only see their own generations
CREATE POLICY "Users can view own generations" 
ON public.generations FOR SELECT 
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- INSERT: Users can only create generations with their own user_id
CREATE POLICY "Users can create own generations" 
ON public.generations FOR INSERT 
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

-- UPDATE: Users can only update their own generations
CREATE POLICY "Users can update own generations" 
ON public.generations FOR UPDATE 
USING (auth.uid() = user_id AND user_id IS NOT NULL)
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

-- DELETE: Users can only delete their own generations
CREATE POLICY "Users can delete own generations" 
ON public.generations FOR DELETE 
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Success message
DO $$ 
BEGIN
  RAISE NOTICE 'Migration 009 completed: generations.user_id is now required and secured';
END $$;

