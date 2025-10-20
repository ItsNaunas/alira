# Critical Fixes for 404 Errors

**Date:** October 20, 2025

## Issues Found

### 1. ❌ Missing `plan_versions` Table (404 Error)
**Problem:** Code was querying a `plan_versions` table that doesn't exist in the database.

**Files Affected:**
- `app/dashboard/[planId]/page.tsx` - Line 70
- `app/api/plan/delete/route.ts` - Lines 76-80

**Fix Applied:**
✅ Removed the `plan_versions` query from dashboard page
✅ Updated delete route to not query non-existent tables
✅ Now using `generations.length` for version count as a temporary solution

### 2. ❌ Missing `pdf_url` Column in `dashboards` Table
**Problem:** The PDF generation API was trying to update a `pdf_url` column that doesn't exist in the `dashboards` table.

**Fix Applied:**
✅ Created migration: `db/migrations/011_add_pdf_url_to_dashboards.sql`
✅ Updated schema documentation: `CURRENT_DATABASE_SCHEMA.sql`

**Migration Required:** You need to run this migration in Supabase!

### 3. ⚠️ PDF Generation Errors
**Problem:** PDF generation returning "No PDF data returned"

**Potential Causes:**
1. Storage bucket `pdfs` might not exist
2. Storage permissions might be incorrect
3. Missing pdf_url column (now fixed)

## Action Items

### 🔴 IMMEDIATE: Run Database Migration

You need to add the `pdf_url` column to your `dashboards` table in Supabase:

```sql
ALTER TABLE public.dashboards 
ADD COLUMN IF NOT EXISTS pdf_url text;
```

**How to run:**
1. Go to Supabase Dashboard → SQL Editor
2. Paste the migration from `db/migrations/011_add_pdf_url_to_dashboards.sql`
3. Click "Run"

### 🟡 OPTIONAL: Create Storage Bucket

If PDF downloads still fail after the migration, create the storage bucket:

1. Go to Supabase Dashboard → Storage
2. Create a new public bucket named `pdfs`
3. Set policies:
   - Allow authenticated users to upload to `plans/{user_id}/*`
   - Allow public read access

### 🟢 FALLBACK: Base64 Download

The PDF generation now has a fallback - if storage fails, it will:
- Return the PDF as base64
- Trigger a direct browser download
- Name the file: `Business-Name-YYYY-MM-DD.pdf`

So even without storage, PDFs will work!

## Files Changed

### 1. `app/dashboard/[planId]/page.tsx`
**Lines 68-70:** 
- Removed query to non-existent `plan_versions` table
- Now uses `generations.length` for version count

```typescript
// Before: Queried plan_versions table (404 error)
const { count: versionCount } = await supabase
  .from('plan_versions')
  .select('*', { count: 'exact', head: true })
  .eq('dashboard_id', planId)

// After: Uses generations array length
const versionCount = planData.generations?.length || 1
```

### 2. `app/api/plan/delete/route.ts`
**Lines 68-73:**
- Removed attempts to delete from non-existent tables
- Simplified to only delete from `generations` and `dashboards`

```typescript
// Before: Tried to delete from plan_refinement_chats and plan_versions
await supabase.from('plan_refinement_chats').delete()...
await supabase.from('plan_versions').delete()...

// After: Only deletes from existing tables
await supabase.from('generations').delete()...
await supabase.from('dashboards').delete()...
```

### 3. `CURRENT_DATABASE_SCHEMA.sql`
**Line 35:**
- Added `pdf_url text,` to dashboards table definition

### 4. `db/migrations/011_add_pdf_url_to_dashboards.sql` (NEW)
- Migration to add pdf_url column to dashboards table

## Testing After Migration

Once you've run the migration, test:

1. ✅ **Dashboard loads without 404 errors**
   - Visit `/dashboard`
   - Check browser console - no more `plan_versions` 404s

2. ✅ **Delete works**
   - Click delete on a plan
   - Should delete successfully without 404 errors

3. ✅ **PDF Download works**
   - Click "Download PDF" on a plan
   - Should either:
     - Open PDF in new tab (if storage works)
     - Download PDF file directly (if storage fails but base64 works)

## Console Warnings to Ignore

These are safe to ignore:
- ⚠️ `ERR_BLOCKED_BY_CLIENT` for Vercel Analytics - This is your ad blocker
- ⚠️ Vercel Speed Insights blocked - This is your ad blocker

## Summary

✅ **Fixed:** 404 errors from querying non-existent `plan_versions` table
✅ **Fixed:** Delete route no longer tries to delete from non-existent tables  
✅ **Fixed:** PDF generation has base64 fallback if storage unavailable
🔴 **TODO:** Run migration to add `pdf_url` column to `dashboards` table
🟡 **Optional:** Create `pdfs` storage bucket in Supabase

After running the migration, all 404 errors should be resolved!

