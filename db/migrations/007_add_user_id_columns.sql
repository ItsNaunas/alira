-- Add user_id columns for security implementation
-- Run this BEFORE the RLS policies migration (006)

-- Add user_id to intake_forms table
ALTER TABLE public.intake_forms
ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Add user_id to generations table  
ALTER TABLE public.generations
ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Create indexes for performance
CREATE INDEX idx_intake_forms_user_id ON public.intake_forms(user_id);
CREATE INDEX idx_generations_user_id ON public.generations(user_id);

-- Optionally backfill existing records (if you have data)
-- This sets user_id to NULL for existing records
-- You'll need to manually assign them if needed:

-- For intake_forms with email but no user_id:
-- UPDATE public.intake_forms 
-- SET user_id = (
--   SELECT id FROM auth.users WHERE email = intake_forms.email LIMIT 1
-- )
-- WHERE user_id IS NULL AND email IS NOT NULL;

-- For generations linked to dashboards:
-- UPDATE public.generations
-- SET user_id = (
--   SELECT user_id FROM public.dashboards WHERE id = generations.dashboard_id LIMIT 1
-- )
-- WHERE user_id IS NULL AND dashboard_id IS NOT NULL;

-- Note: After backfilling, you can make user_id NOT NULL if desired:
-- ALTER TABLE public.intake_forms ALTER COLUMN user_id SET NOT NULL;
-- ALTER TABLE public.generations ALTER COLUMN user_id SET NOT NULL;

