# Database Migration Fix for "Failed to generate plan" Error

## Problem
The `/api/generate-plan` endpoint is failing with a 500 error because:

1. **Missing Database Column**: The `generations` table is missing a `user_id` column that the API route is trying to insert
2. **Schema Mismatch**: The API expects a `user_id` field but the database schema doesn't have it

## Solution

### Step 1: Apply Database Migration

Run this SQL in your Supabase SQL Editor:

```sql
-- Add user_id to generations table  
ALTER TABLE public.generations
ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Create index for performance
CREATE INDEX idx_generations_user_id ON public.generations(user_id);
```

### Step 2: Update RLS Policies

After adding the column, update the RLS policies:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own generations" ON public.generations;
DROP POLICY IF EXISTS "Users can create own generations" ON public.generations;

-- Create new policies that use user_id directly
CREATE POLICY "Users can view own generations" 
ON public.generations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own generations" 
ON public.generations FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

### Step 3: Backfill Existing Data (if needed)

If you have existing generations records:

```sql
-- Backfill user_id for existing generations linked to dashboards
UPDATE public.generations
SET user_id = (
  SELECT user_id FROM public.dashboards WHERE id = generations.dashboard_id LIMIT 1
)
WHERE user_id IS NULL AND dashboard_id IS NOT NULL;
```

## Verification

After applying the migration, test the form again. The error should be resolved.

## Alternative: Quick Fix (Temporary)

If you need a quick fix without running migrations, you can temporarily modify the API route to not insert the `user_id` field, but this is not recommended for production.
