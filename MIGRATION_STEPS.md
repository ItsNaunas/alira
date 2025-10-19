# Database Migration Steps - Fix "Failed to generate plan" Error

## Problem
The `generations` table is missing a `user_id` column that the API route needs for proper user tracking and security.

## Solution: Apply Database Migration

### Step 1: Access Supabase Dashboard
1. Go to [app.supabase.com](https://app.supabase.com)
2. Sign in to your account
3. Select your ALIRA project
4. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run the Migration SQL
Copy and paste this SQL into the SQL Editor and click **Run**:

```sql
-- Add user_id to generations table  
ALTER TABLE public.generations
ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Create index for performance
CREATE INDEX idx_generations_user_id ON public.generations(user_id);
```

### Step 3: Update RLS Policies
After adding the column, run this SQL to update the security policies:

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

### Step 4: Backfill Existing Data (Optional)
If you have existing generations records, run this to link them to users:

```sql
-- Backfill user_id for existing generations linked to dashboards
UPDATE public.generations
SET user_id = (
  SELECT user_id FROM public.dashboards WHERE id = generations.dashboard_id LIMIT 1
)
WHERE user_id IS NULL AND dashboard_id IS NOT NULL;
```

### Step 5: Verify Migration
Run this query to verify the column was added:

```sql
-- Check if user_id column exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'generations' AND table_schema = 'public';
```

You should see `user_id` in the results.

## Alternative: Quick Fix (Temporary)
If you can't access Supabase right now, the API route has been updated with fallback logic that will work without the migration. However, for full security and proper user tracking, you should apply the migration.

## After Migration
1. Restart your development server: `npm run dev`
2. Test the form submission
3. The "Failed to generate plan" error should be resolved

## Troubleshooting
If you encounter any issues:
1. Check the Supabase logs for SQL errors
2. Verify you have the correct permissions
3. Make sure you're running the SQL in the correct project
