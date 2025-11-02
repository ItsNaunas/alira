-- Migration 015: Share Tokens for Plans
-- Purpose: Enable sharing plans via public read-only links

-- Add share functionality columns to dashboards
ALTER TABLE dashboards ADD COLUMN IF NOT EXISTS share_token TEXT;
ALTER TABLE dashboards ADD COLUMN IF NOT EXISTS shared_public BOOLEAN DEFAULT false;

-- Create unique index for share token lookups (only for non-null tokens)
CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboards_share_token 
  ON dashboards(share_token) 
  WHERE share_token IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN dashboards.share_token IS 'Unique token for sharing plans via public read-only link';
COMMENT ON COLUMN dashboards.shared_public IS 'Whether this plan is publicly shareable via share_token';

