-- ALIRA CURRENT DATABASE SCHEMA
-- Last Updated: October 19, 2025
-- This represents the actual current state of the production database
-- Use this as reference for any future schema changes or debugging

-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.business_cases (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  lead_id uuid,
  outline jsonb,
  pdf_url text,
  status text DEFAULT 'generated'::text,
  CONSTRAINT business_cases_pkey PRIMARY KEY (id),
  CONSTRAINT business_cases_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id)
);

CREATE TABLE public.dashboards (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  user_id uuid NOT NULL,
  business_name text NOT NULL,
  industry text,
  stage text,
  status text DEFAULT 'draft'::text,
  metadata jsonb DEFAULT '{}'::jsonb,
  current_challenges text,
  immediate_goals text,
  service_interest ARRAY,
  current_tools text,
  form_data jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT dashboards_pkey PRIMARY KEY (id),
  CONSTRAINT dashboards_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE public.email_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  user_id uuid,
  email text NOT NULL,
  type text NOT NULL,
  status text DEFAULT 'pending'::text,
  sent_at timestamp with time zone,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT email_notifications_pkey PRIMARY KEY (id),
  CONSTRAINT email_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  metadata jsonb,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT events_pkey PRIMARY KEY (id)
);

CREATE TABLE public.generations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  dashboard_id uuid,
  type text NOT NULL,
  content jsonb NOT NULL,
  version integer DEFAULT 1,
  metadata jsonb DEFAULT '{}'::jsonb,
  user_id uuid,
  CONSTRAINT generations_pkey PRIMARY KEY (id),
  CONSTRAINT generations_dashboard_id_fkey FOREIGN KEY (dashboard_id) REFERENCES public.dashboards(id),
  CONSTRAINT generations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE public.intake_forms (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  status character varying DEFAULT 'draft'::character varying,
  step integer DEFAULT 1,
  email character varying,
  name character varying,
  data jsonb,
  preview_html text,
  pdf_url text,
  resume_token character varying UNIQUE,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  user_id uuid,
  CONSTRAINT intake_forms_pkey PRIMARY KEY (id),
  CONSTRAINT intake_forms_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE public.leads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  business_name text,
  industry text,
  stage text,
  challenges text,
  goals_short text,
  goals_long text,
  resources text,
  budget text,
  timeline text,
  service text,
  contact_name text,
  email text NOT NULL,
  notes text,
  CONSTRAINT leads_pkey PRIMARY KEY (id)
);

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  email text NOT NULL,
  full_name text,
  company_name text,
  avatar_url text,
  credits integer DEFAULT 3,
  has_purchased boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'GBP'::text,
  status text DEFAULT 'pending'::text,
  stripe_payment_id text,
  credits_purchased integer,
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- ============================================
-- SCHEMA SUMMARY & NOTES
-- ============================================

/*
KEY TABLES AND THEIR PURPOSES:

1. business_cases - Stores generated business plans (linked to leads)
2. dashboards - Main user dashboards with form data and business info
3. email_notifications - Email sending queue and status tracking
4. events - Analytics and event tracking
5. generations - AI-generated content (business plans, etc.) linked to dashboards
6. intake_forms - Form submissions and drafts
7. leads - Lead generation and contact information
8. profiles - User profile information and settings
9. transactions - Payment and billing information

CRITICAL RELATIONSHIPS:
- dashboards.user_id → auth.users(id)
- generations.dashboard_id → dashboards(id)
- generations.user_id → auth.users(id)
- business_cases.lead_id → leads(id)

COLUMN NOTES:
- generations.version (integer) - NOT version_number
- dashboards has all form fields: current_challenges, immediate_goals, service_interest, current_tools
- All tables use UUID primary keys with gen_random_uuid()
- Most tables have created_at timestamps
- JSONB fields for flexible metadata storage

RECENT FIXES APPLIED:
- Fixed version_number → version column mismatch in generations table queries
- Confirmed SUPABASE_SERVICE_ROLE_KEY is required for service role operations
*/
