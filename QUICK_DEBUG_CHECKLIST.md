# Quick Debug Checklist for 500 Error

Since the mini chat AI is working, OpenAI is configured properly. The issue is specifically with `/api/generate-plan`.

## ⚡ Quick Tests (Do These First)

### Test 1: Check What's Actually Failing

Open browser console (F12) and look for this sequence:

```
=== FORM COMPLETION STARTED ===
✅ Saved to database: {id: "uuid-here"}
Attempting to generate business plan...
❌ Generate plan error: {...}
```

**Question:** Does it successfully save to database BEFORE failing?
- ✅ YES → The problem is in the generate-plan API, not form data
- ❌ NO → The problem is earlier in the form submission

### Test 2: Are You Testing on Vercel or Locally?

This is critical because the fix is different for each:

**On Vercel (vercel.app URL):**
- Need to check Vercel environment variables
- Need to check Vercel function logs

**Locally (localhost:3000):**
- Need to check `.env.local`
- Need to check terminal output

---

## 🔍 If Testing on Vercel

### Step 1: Check Environment Variables

1. Go to: https://vercel.com/your-team/your-project/settings/environment-variables
2. Look for: `SUPABASE_SERVICE_ROLE_KEY`

**Is it there?**
- ❌ NO → **This is your problem!** Add it (instructions below)
- ✅ YES → Continue to Step 2

### Step 2: Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project
2. Click on the latest deployment
3. Click "Functions" tab  
4. Find and click on `api/generate-plan`
5. Look at the error logs

**What do you see?**
- `Missing Supabase configuration` → Need to add SUPABASE_SERVICE_ROLE_KEY
- `Column "user_id" does not exist` → Need to run database migration
- `Invalid API key` → OpenAI key issue (but you said mini chat works?)
- Something else → Share the exact error message

### Fix for Vercel: Add SUPABASE_SERVICE_ROLE_KEY

1. Get your Service Role Key:
   - Go to: https://supabase.com/dashboard/project/ibpdwrouobzaqhfvcaxp/settings/api
   - Find "service_role" key (marked as "secret")
   - Click to reveal and copy

2. Add to Vercel:
   - Go to: Project Settings → Environment Variables
   - Click "Add New"
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: (paste the key from step 1)
   - Environments: Select all (Production, Preview, Development)
   - Click "Save"

3. Redeploy:
   - Go to Deployments tab
   - Click "..." on latest deployment → "Redeploy"
   - OR push a new commit to trigger deployment

---

## 🔍 If Testing Locally (localhost)

### Step 1: Check .env.local

```powershell
# Check if SUPABASE_SERVICE_ROLE_KEY exists
Get-Content .env.local | Select-String "SUPABASE_SERVICE_ROLE_KEY"
```

**What do you see?**
- Nothing (empty result) → **Key is missing!** Add it (instructions below)
- `# SUPABASE_SERVICE_ROLE_KEY=...` → **Key is commented out!** Uncomment it
- `SUPABASE_SERVICE_ROLE_KEY=eyJ...` → **Key is set!** Continue to Step 2

### Step 2: Check Terminal Output

Look at your terminal where you ran `npm run dev`. After submitting the form, you should see:

```
=== GENERATE PLAN API DEBUG ===
Received body: {...}
User ID: ...
```

**Then what?**
- `Missing Supabase configuration` → Need SUPABASE_SERVICE_ROLE_KEY
- OpenAI logs then success → It's working!
- Database error → Need to check database schema
- Nothing (no logs) → Server might have crashed, check for error messages

### Fix for Local: Add SUPABASE_SERVICE_ROLE_KEY

1. Get your Service Role Key:
   - Go to: https://supabase.com/dashboard/project/ibpdwrouobzaqhfvcaxp/settings/api
   - Find "service_role" key
   - Click to reveal and copy

2. Add to .env.local:
   ```powershell
   notepad .env.local
   ```
   
   Add this line (or uncomment if it exists):
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. Restart dev server:
   ```powershell
   # Press Ctrl+C to stop
   npm run dev
   ```

---

## 🗄️ Database Schema Check

If you have SUPABASE_SERVICE_ROLE_KEY set but still getting errors, check your database schema:

### Check if generations table exists:

1. Go to: https://supabase.com/dashboard/project/ibpdwrouobzaqhfvcaxp/editor
2. Look for `generations` table in the left sidebar

**Do you see it?**
- ❌ NO → Need to run migration `000_base_schema.sql`
- ✅ YES → Continue to next check

### Check generations table columns:

Click on the `generations` table and verify it has these columns:
- `id` (uuid)
- `created_at` (timestamp)
- `dashboard_id` (uuid)
- `type` (text)
- `content` (jsonb)
- `version` (integer)
- `metadata` (jsonb)

**Is `user_id` column missing?**
- ✅ YES (missing) → This is normal! The code handles this
- ❌ NO (it exists) → That's fine too

---

## 🎯 Most Common Issues & Fixes

### Issue 1: SUPABASE_SERVICE_ROLE_KEY Not Set (Most Likely)

**Symptoms:**
- Form saves to database ✅
- Generate plan fails immediately ❌
- Error: "An unexpected error occurred"

**Fix:**
- Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel (if on Vercel)
- OR add to `.env.local` (if testing locally)

### Issue 2: Database Table Missing

**Symptoms:**
- Error mentions "relation does not exist"
- Error mentions table name

**Fix:**
1. Go to Supabase Dashboard → SQL Editor
2. Run the migration from: `db/migrations/000_base_schema.sql`

### Issue 3: RLS (Row Level Security) Blocking Insert

**Symptoms:**
- Error mentions "new row violates row-level security policy"

**Fix:**
1. Go to Supabase Dashboard → Authentication → Policies
2. Check `generations` table policies
3. May need to add policy to allow service role access

---

## 📊 Decision Tree

```
Form submits successfully? 
├─ NO → Check form validation, check dashboards table exists
└─ YES → Continue
    │
    Mini chat AI working?
    ├─ NO → OpenAI key issue
    └─ YES → Continue (OpenAI is fine)
        │
        Testing on Vercel or Locally?
        ├─ Vercel → Check Vercel env vars for SUPABASE_SERVICE_ROLE_KEY
        └─ Locally → Check .env.local for SUPABASE_SERVICE_ROLE_KEY
            │
            SUPABASE_SERVICE_ROLE_KEY set?
            ├─ NO → Add it! (See fix above)
            └─ YES → Check Vercel/terminal logs for specific error
                │
                What error?
                ├─ "Missing Supabase configuration" → Service key not loading properly
                ├─ "Column does not exist" → Database migration needed
                ├─ "Row level security" → RLS policy issue
                └─ Other → Share the specific error message
```

---

## 🚀 What to Share if Still Stuck

If you've tried the above and still have issues, please share:

1. **Environment**: Vercel or Local?
2. **Browser console output**: The exact error after form submission
3. **Server logs**:
   - If Vercel: Screenshot of function logs
   - If Local: Terminal output after form submission
4. **Environment variables status**:
   - Is SUPABASE_SERVICE_ROLE_KEY set? (don't share the actual value!)
5. **Database status**:
   - Does `generations` table exist in Supabase?

---

## ✅ Success Criteria

You'll know it's fixed when:

1. Form submits successfully
2. Browser console shows:
   ```
   ✅ Saved to database
   Attempting to generate business plan...
   ✅ Business plan generated
   Redirecting to dashboard...
   ```
3. Page redirects to `/dashboard`
4. Plan is visible in dashboard

No more 500 errors! 🎉

