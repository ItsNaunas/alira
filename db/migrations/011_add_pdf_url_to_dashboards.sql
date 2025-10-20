-- Add pdf_url column to dashboards table
-- This allows storing the generated PDF URL for each dashboard/plan

ALTER TABLE public.dashboards 
ADD COLUMN IF NOT EXISTS pdf_url text;

-- Add comment for documentation
COMMENT ON COLUMN public.dashboards.pdf_url IS 'URL to the generated PDF plan stored in Supabase storage';

