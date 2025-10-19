-- Database State Checker SQL
-- Run this in your Supabase SQL Editor to check current state

-- 1. Check what tables exist in public schema
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Check generations table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'generations' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check dashboards table structure  
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'dashboards' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 5. Check if user_id exists in generations (this will error if column doesn't exist)
SELECT 
  COUNT(*) as total_records,
  COUNT(user_id) as records_with_user_id
FROM public.generations;

-- 6. Check indexes on generations table
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'generations' 
  AND schemaname = 'public';

-- 7. Check foreign key relationships
SELECT 
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('generations', 'dashboards')
ORDER BY tc.table_name, kcu.column_name;
