# Plan Generation 500 Error - Root Cause Analysis

**Date:** October 19, 2025  
**Error:** `/api/generate-plan` returns 500 Internal Server Error  
**Status:** ✅ ROOT CAUSE IDENTIFIED

---

## Error Summary

Your form successfully saves to the database, but then fails when generating the business plan with a 500 error:

```
Failed to load resource: the server responded with a status of 500 ()
❌ Generate plan error: {"success":false,"error":"An unexpected error occurred","code":"INTERNAL_ERROR"}
```

---

## Root Cause Analysis

### The Problem: Module Import-Time Error

The issue is in **`lib/openai.ts`** at lines 4-7:

```typescript
// API key validation
if (!process.env.OPENAI_API_KEY) {
  console.error('[OPENAI] ❌ OPENAI_API_KEY is missing from environment variables!')
  throw new Error('Missing OPENAI_API_KEY environment variable')
}
```

**What's happening:**

1. When `/api/generate-plan/route.ts` tries to execute, it needs to import `generateBusinessCase` from `lib/openai.ts` (line 81)
2. **The moment Node.js imports the `openai.ts` module**, it executes all top-level code
3. The validation check runs **immediately during import** (not during function execution)
4. If `OPENAI_API_KEY` is missing/undefined, it throws an error **before any route logic can execute**
5. This causes the entire API route to fail with a 500 error
6. The error handler in the route never gets a chance to run because the import itself failed

### Why This Keeps Happening

You keep encountering this error because:

1. **Environment Variable Not Loaded**: Your `.env.local` file might not have `OPENAI_API_KEY` set, or it's not being loaded properly
2. **Import-Time Validation**: The validation happens at module import time, not function execution time
3. **No Graceful Degradation**: The code doesn't allow the module to load without the API key

---

## Evidence Trail

### File Analysis

#### 1. `lib/openai.ts` (Lines 1-16)
```typescript
import OpenAI from 'openai'

// API key validation
if (!process.env.OPENAI_API_KEY) {
  console.error('[OPENAI] ❌ OPENAI_API_KEY is missing from environment variables!')
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

// Only log in development - no key metadata in production
if (process.env.NODE_ENV === 'development') {
  console.log('[OPENAI] ✅ OPENAI_API_KEY configured')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
```

**Problem**: Top-level validation throws error during module import.

#### 2. `app/api/generate-plan/route.ts` (Line 81)
```typescript
const { generateBusinessCase } = await import('@/lib/openai');
```

**Problem**: Dynamic import still loads the module, triggering the validation check.

#### 3. `lib/env.ts` (Line 6)
```typescript
OPENAI_API_KEY: z.string().optional(),
```

**Problem**: Marks API key as optional, but `openai.ts` requires it.

---

## How to Verify This Is Your Issue

### Check 1: Look at Server/Build Logs

Look for this error in your terminal or Vercel deployment logs:
```
[OPENAI] ❌ OPENAI_API_KEY is missing from environment variables!
Error: Missing OPENAI_API_KEY environment variable
```

This error would appear when the server starts or when the route is first accessed.

### Check 2: Verify Environment Variables

Run in your terminal:
```powershell
# Check if .env.local exists and has the key
Get-Content .env.local | Select-String "OPENAI_API_KEY"
```

Expected output:
```
OPENAI_API_KEY=sk-proj-...
```

If you get nothing or the line is commented out, **that's your problem**.

---

## Solutions

### Option 1: Add the Missing API Key (Recommended)

1. **Check your `.env.local` file**:
   ```powershell
   notepad .env.local
   ```

2. **Ensure you have this line** (uncommented):
   ```env
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```

3. **Get your API key** from [OpenAI Platform](https://platform.openai.com/api-keys)

4. **Restart your development server**:
   ```bash
   npm run dev
   ```

### Option 2: Refactor to Runtime Validation (Better Architecture)

**Problem with current approach**: Import-time validation prevents graceful error handling.

**Better approach**: Validate at function execution time, not module import time.

**Proposed Fix** for `lib/openai.ts`:

```typescript
import OpenAI from 'openai'

// Lazy initialization - only create client when needed
let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  // Validate on first use, not on import
  if (!process.env.OPENAI_API_KEY) {
    console.error('[OPENAI] ❌ OPENAI_API_KEY is missing from environment variables!')
    throw new Error('Missing OPENAI_API_KEY environment variable')
  }

  if (!openaiClient) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[OPENAI] ✅ OPENAI_API_KEY configured')
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  return openaiClient
}

export async function generateBusinessCase(formData: any): Promise<BusinessCaseOutline> {
  // Debug logging (only in development - no sensitive data)
  if (process.env.NODE_ENV === 'development') {
    console.log("========================================")
    console.log("🚀 OPENAI: generateBusinessCase() CALLED")
    console.log("========================================")
    console.log("Form data received:", JSON.stringify(formData, null, 2))
    console.log("Current timestamp:", new Date().toISOString())
  }
  
  try {
    const openai = getOpenAIClient() // Validate here, not at import time
    
    // ... rest of function stays the same
  } catch (error) {
    console.error('OpenAI API error:', error)
    
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorDetails = {
      message: errorMessage,
      status: (error as any)?.status || 'unknown',
      code: (error as any)?.code || 'unknown',
      type: (error as any)?.type || 'unknown'
    }
    
    console.error('Error details:', errorDetails)
    throw new Error(`Failed to generate business case: ${errorMessage}`)
  }
}
```

**Benefits**:
- ✅ Module can import without throwing errors
- ✅ Error happens during function execution, not module import
- ✅ Error handler in API route can catch and handle properly
- ✅ Better error messages for users
- ✅ Lazy initialization - only creates client when needed

### Option 3: For Vercel Deployment

If this works locally but fails on Vercel:

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Add**:
   - Key: `OPENAI_API_KEY`
   - Value: Your OpenAI API key (`sk-proj-...`)
   - Environments: Select Production, Preview, and Development
3. **Redeploy your application**

---

## Why This Wasn't Caught Earlier

1. **Import-time errors are hard to debug**: They happen before any logging or error handling can run
2. **Generic 500 error**: The API route's error handler never gets called, so you get a generic error
3. **Multiple code changes**: Recent security improvements may have obscured this underlying issue

---

## Verification Steps After Fix

1. **Check server logs on startup** - should see:
   ```
   [OPENAI] ✅ OPENAI_API_KEY configured
   ```

2. **Submit the form** - should see console logs:
   ```
   === FORM COMPLETION STARTED ===
   ✅ Saved to database
   Attempting to generate business plan...
   🚀 OPENAI: generateBusinessCase() CALLED
   ```

3. **Successful completion** - should redirect to results page

---

## Additional Issues (Non-Critical)

### Vercel Analytics Blocked
```
Failed to load resource: net::ERR_BLOCKED_BY_CLIENT
/_vercel/insights/script.js
/_vercel/speed-insights/script.js
```

**Cause**: Ad blocker or browser extension blocking Vercel's analytics scripts  
**Impact**: None - analytics just won't track, app still works  
**Fix**: Not needed unless you need analytics data

### Lazy Loading Images
```
[Intervention] Images loaded lazily and replaced with placeholders
```

**Cause**: Browser optimization for performance  
**Impact**: None - this is normal and actually good for performance  
**Fix**: Not needed - this is expected browser behavior

---

## Recommended Actions

### Immediate (Do Right Now)
1. ✅ Verify `.env.local` has `OPENAI_API_KEY` set
2. ✅ Restart development server
3. ✅ Test form submission

### Short-term (This Week)
1. ✅ Refactor `lib/openai.ts` to use lazy initialization (Option 2)
2. ✅ Update `lib/env.ts` to mark `OPENAI_API_KEY` as required:
   ```typescript
   OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
   ```
3. ✅ Add better error logging in `/api/generate-plan/route.ts`

### Long-term (This Month)
1. ✅ Create environment variable validation script
2. ✅ Add health check endpoint that validates all required env vars
3. ✅ Add CI/CD check to verify env vars before deployment

---

## Summary

**Root Cause**: Missing or undefined `OPENAI_API_KEY` environment variable causing module import-time error

**Quick Fix**: Add `OPENAI_API_KEY` to `.env.local` and restart server

**Better Fix**: Refactor `lib/openai.ts` to use lazy initialization with runtime validation

**Verification**: Check server logs for `[OPENAI] ✅ OPENAI_API_KEY configured` message

---

## ⚠️ CONFIRMED ISSUES FOUND IN YOUR `.env.local`

I've examined your `.env.local` file and found **TWO CRITICAL ISSUES**:

### Issue 1: Invalid OPENAI_API_KEY (Placeholder Value)
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Problem**: This is a placeholder value from `env.example`, not a real API key.

**Impact**: 
- Even though the variable is "set", OpenAI API calls will fail with authentication errors
- This causes the 500 error when trying to generate business plans

**Fix**: Replace with your actual OpenAI API key from https://platform.openai.com/api-keys

### Issue 2: Missing SUPABASE_SERVICE_ROLE_KEY
```env
# SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Problem**: This line is commented out (the `#` at the start disables it).

**Impact**:
- The API route calls `getServiceClient()` which requires this variable (see `lib/server/auth.ts:34`)
- If missing, it throws: `Error: Missing Supabase configuration`
- This is likely causing the 500 error

**Fix**: 
1. Uncomment the line (remove the `#`)
2. Get the actual Service Role Key from your Supabase dashboard:
   - Go to https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
   - Copy the "service_role" key (marked as "secret")
   - **⚠️ WARNING**: Never commit this to git - it's extremely sensitive!

---

## 🔧 EXACT STEPS TO FIX

### Step 1: Update `.env.local`

1. Open `.env.local` in your editor
2. Replace the placeholder OPENAI_API_KEY with your real key:
   ```env
   OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_KEY_HERE
   ```
3. Uncomment and add your real Supabase Service Role Key:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ACTUAL_KEY_HERE
   ```
   **Note**: The variable name should be `SUPABASE_SERVICE_ROLE_KEY` (not `SUPABASE_SERVICE_ROLE`)

### Step 2: Get Your API Keys

**OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-proj-...`)
4. Paste it into `.env.local`

**Supabase Service Role Key:**
1. Go to https://supabase.com/dashboard/project/ibpdwrouobzaqhfvcaxp/settings/api
2. Find "service_role" in the "Project API keys" section
3. Click to reveal and copy the key
4. Paste it into `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Restart Your Development Server

```powershell
# Press Ctrl+C to stop the current server
# Then restart:
npm run dev
```

### Step 4: Verify It's Working

Look for these success messages in your terminal:
```
[OPENAI] ✅ OPENAI_API_KEY configured
```

Then test the form - it should now successfully generate plans!

---

## 🎯 Root Cause Confirmed

**Exact cause of your 500 error:**

1. **Primary Issue**: Invalid OpenAI API key (placeholder value)
   - Module imports successfully
   - API call fails with authentication error
   - Returns generic 500 error

2. **Secondary Issue**: Missing SUPABASE_SERVICE_ROLE_KEY
   - `getServiceClient()` throws: "Missing Supabase configuration"
   - Prevents database operations in the API route
   - Also returns 500 error

Both need to be fixed for the plan generation to work.

---

## Questions to Answer

After you update your `.env.local` file with real API keys:

1. Does the development server start without errors?
2. Do you see the `[OPENAI] ✅ OPENAI_API_KEY configured` message?
3. Does the form submission now complete successfully?
4. Would you like me to implement Option 2 (lazy initialization refactor) for better error handling?


