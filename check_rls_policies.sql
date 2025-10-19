-- Check RLS policies on generations table
-- Run this in Supabase SQL Editor to see what policies exist

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'generations'
ORDER BY policyname;

-- Also check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'generations';

