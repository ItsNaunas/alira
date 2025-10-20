-- WARNING: This will delete ALL authentication users
-- Use with caution - this cannot be undone!

-- Delete all users from Supabase Auth
DELETE FROM auth.users;

-- Also clear any custom user data
DELETE FROM public.users;
DELETE FROM public.intake_forms;
DELETE FROM public.user_plans;

-- Note: You may need to use the Supabase Dashboard or service role key
-- for this to work, as the auth schema is protected

