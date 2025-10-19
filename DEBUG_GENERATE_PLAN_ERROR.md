# Debug Generate Plan 500 Error

## The Real Issue (Since OpenAI IS Working)

You're right - if the mini chat AI is working, then OpenAI is properly configured. The issue must be something else in `/api/generate-plan`.

## Key Difference Between Working vs Broken

### ✅ WORKING: `/api/ai/generate` (Mini Chat)
- Uses `requireUser()` only
- Does NOT use `getServiceClient()`
- Saves events, not full data
- Returns immediately after OpenAI response

### ❌ BROKEN: `/api/generate-plan` (Form Submission)  
- Uses `requireUser()` ✅
- Uses `getServiceClient()` ⚠️ **This requires SUPABASE_SERVICE_ROLE_KEY**
- Tries to insert into `generations` table
- Updates `dashboards` table

## The Actual Problem

Looking at line 85 in `/api/generate-plan/route.ts`:

```typescript
const supabase = getServiceClient();
```

This calls `getServiceClient()` from `lib/server/auth.ts` (line 32-42):

```typescript
export function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration');  // ⚠️ THIS IS LIKELY THROWING
  }
  //...
}
```

## To Verify This Is The Issue

### On Vercel (Production):

1. Go to your Vercel dashboard
2. Go to Project Settings → Environment Variables
3. Check if `SUPABASE_SERVICE_ROLE_KEY` is set

**If it's missing, that's your issue!**

### On Local (Development):

Check if `.env.local` has this line (uncommented):
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## How to Get Server Logs (To Confirm)

### If Testing on Vercel:
1. Go to Vercel Dashboard → Your Project
2. Click on the latest deployment
3. Click "Functions" tab
4. Find `/api/generate-plan` 
5. Look at the error logs

You should see either:
- `Error: Missing Supabase configuration`
- Or a database error about missing columns

### If Testing Locally:
Look at your terminal where `npm run dev` is running. You should see:
```
=== GENERATE PLAN API DEBUG ===
Received body: {...}
```

Then either:
- `Error: Missing Supabase configuration`
- Or a validation error
- Or a database error

## Quick Test To Isolate the Issue

Can you check the browser console and tell me:

1. **Does the form data save to database successfully?**
   - Look for: `✅ Saved to database: {id: "..."}`

2. **Then what exactly fails?**
   - Look for: `❌ Generate plan error: {...}`

3. **What's the exact error text?**
   - Currently shows: `{"success":false,"error":"An unexpected error occurred","code":"INTERNAL_ERROR"}`
   - But there should be more detail in the server logs

## Most Likely Solutions

### Solution 1: Missing SUPABASE_SERVICE_ROLE_KEY on Vercel

**If testing on Vercel:**
1. Go to: https://supabase.com/dashboard/project/ibpdwrouobzaqhfvcaxp/settings/api
2. Copy the "service_role" key (secret, starts with `eyJ`)
3. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
4. Add:
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: (paste the service role key)
   - Environments: Production, Preview, Development (select all)
5. Redeploy your application

### Solution 2: Missing SUPABASE_SERVICE_ROLE_KEY Locally

**If testing locally:**
1. Open `.env.local`
2. Add this line:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_from_supabase
   ```
3. Restart dev server: `npm run dev`

### Solution 3: Database Schema Issues

If the above don't work, the issue might be with the database schema. The API tries to insert into the `generations` table which might not exist or have the wrong columns.

Check your Supabase dashboard:
1. Go to Table Editor
2. Look for `generations` table
3. Verify it has these columns:
   - `id` (uuid, primary key)
   - `dashboard_id` (uuid, nullable)
   - `user_id` (uuid, nullable)
   - `type` (text)
   - `content` (jsonb)
   - `version` (integer)
   - `created_at` (timestamp)

## Next Steps

Please check:

1. **Are you testing on Vercel or locally?**
2. **Is `SUPABASE_SERVICE_ROLE_KEY` set in Vercel environment variables?** (if on Vercel)
3. **Is `SUPABASE_SERVICE_ROLE_KEY` in your `.env.local`?** (if local)
4. **Can you share the server logs?** (from Vercel Functions tab or local terminal)

Once you tell me which environment you're testing in and whether SUPABASE_SERVICE_ROLE_KEY is set, I can give you the exact fix!

