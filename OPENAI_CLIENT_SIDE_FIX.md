# OpenAI Client-Side Bundling Fix

## Problem

You were seeing this error in the browser console on Vercel:
```
Uncaught (in promise) Error: Missing OPENAI_API_KEY environment variable
```

Even though the `OPENAI_API_KEY` was set in Vercel's environment variables.

## Root Cause

The issue was **NOT** with Vercel or your environment variable configuration. The problem was that:

1. **Client-side bundling**: The `lib/openai-refine.ts` file was being imported by `components/RefinementChat.tsx`, which is a client component (marked with `'use client'`)

2. **Module-level checks**: Both `lib/openai.ts` and `lib/openai-refine.ts` check for `process.env.OPENAI_API_KEY` at the module level (lines 4-6)

3. **Browser execution**: When Next.js bundled the client component, it included the OpenAI modules, which then tried to access `process.env.OPENAI_API_KEY` in the browser. Environment variables prefixed with `process.env` (without `NEXT_PUBLIC_`) are **server-side only** and are `undefined` in the browser

4. **Security issue**: This was actually a security vulnerability - API keys should NEVER be sent to the client

## Solution Applied

### 1. Created `lib/refinement-utils.ts`
- Extracted client-safe utility functions (`getQuickActions`, `refinementPresets`)
- These don't need OpenAI and can be safely imported in client components

### 2. Updated `lib/openai-refine.ts`
- Removed the utility functions
- Re-exported them from `refinement-utils.ts`
- Added `import 'server-only'` to prevent client-side imports

### 3. Updated `components/RefinementChat.tsx`
- Changed import from `@/lib/openai-refine` to `@/lib/refinement-utils`
- Now only imports client-safe utilities

### 4. Added `server-only` package protection
- Installed `server-only` package
- Added `import 'server-only'` to both:
  - `lib/openai.ts`
  - `lib/openai-refine.ts`
- This ensures build-time errors if these modules are ever imported on the client

## Verification

✅ All OpenAI imports are now only in API routes (server-side):
- `app/api/ai/generate/route.ts`
- `app/api/generate-plan/route.ts`
- `app/api/plan/refine/route.ts`
- `app/api/draft/submit/route.ts`
- `app/api/draft/submit-enhanced/route.ts`

✅ No client components import server-only modules

✅ No linter errors

## Next Steps for Deployment

1. **Commit and push** these changes to your repository
2. **Vercel will automatically redeploy** with the new code
3. **Verify** the OPENAI_API_KEY is set in Vercel:
   - Go to your Vercel project
   - Settings → Environment Variables
   - Ensure `OPENAI_API_KEY` is set for Production, Preview, and Development

## How to Test

After deployment:
1. Visit your site on Vercel
2. Open browser DevTools console (F12)
3. Navigate to a page with the refinement chat
4. You should see **NO errors** about missing OPENAI_API_KEY
5. The chat functionality should work normally

## Why This Happened

Next.js tries to optimize bundles by tree-shaking, but when a client component imports a module, even if it only uses a small part, the entire module (including its initialization code) gets included in the client bundle. By separating the client-safe utilities into a separate file, we prevent the OpenAI client code from being bundled at all.

## Security Improvement

This fix also improves security by ensuring API keys can never be accidentally exposed to the browser, even if someone imports the wrong module in the future. The `server-only` package will cause a build error if this happens.

