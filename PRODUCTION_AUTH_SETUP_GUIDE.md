# Production Authentication Setup Guide

## 🎯 Overview

This guide will walk you through fixing the authentication email redirect issue and ensuring successful deployment.

## ✅ What We've Already Fixed

1. ✅ **Fixed Build Errors** - Corrected `GradientBars` import statements in 4 files
2. ✅ **Created Auth Callback Route** - Added `app/auth/callback/route.ts` to handle Supabase redirects
3. ✅ **Updated Environment Variables Template** - Added `NEXT_PUBLIC_SITE_URL` to `env.example`

## 🚀 What You Need to Do Now

### Step 1: Add Environment Variable to Vercel

**This is the CRITICAL step to fix email links pointing to localhost**

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your Alira project
3. Click on **Settings** in the top navigation
4. Click on **Environment Variables** in the left sidebar
5. Add a new environment variable:
   - **Key:** `NEXT_PUBLIC_SITE_URL`
   - **Value:** Your production URL (e.g., `https://alira.vercel.app` or your custom domain)
   - **Environment:** Select **Production**, **Preview**, and **Development**
6. Click **Save**

**Important Notes:**
- Make sure to include `https://` in the URL
- Don't include a trailing slash
- Example: `https://alira-website-git-main-yourname.vercel.app`

### Step 2: Update Supabase Redirect URLs

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Update the following settings:

   **Site URL:**
   ```
   https://your-production-domain.com
   ```

   **Redirect URLs:** Add these URLs (one per line):
   ```
   https://your-production-domain.com/auth/callback
   http://localhost:3000/auth/callback
   https://*.vercel.app/auth/callback
   ```

5. Click **Save**

### Step 3: Redeploy Your Application

After adding the environment variable, you need to trigger a new deployment:

**Option A: Via Vercel Dashboard**
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Make sure **Use existing Build Cache** is UNCHECKED
5. Click **Redeploy**

**Option B: Via Git (Recommended)**
1. Commit the changes we just made:
   ```bash
   git add .
   git commit -m "Fix: Add auth callback route and fix GradientBars imports"
   git push origin main
   ```
2. Vercel will automatically deploy the new version

### Step 4: Test the Authentication Flow

Once deployed, test the complete flow:

1. **Sign Up Test:**
   - Go to your production site
   - Click "Get Started" or "Sign Up"
   - Enter your email and password
   - Submit the form

2. **Check Email:**
   - Open the confirmation email from Supabase
   - **Verify the link points to your production domain** (not localhost)

3. **Click Confirmation Link:**
   - Click the link in the email
   - You should be redirected to `/auth/callback`
   - Then automatically redirected to `/dashboard`
   - You should be logged in successfully

4. **Verify Dashboard Access:**
   - Check that you can see the dashboard
   - Try creating a plan to ensure everything works

## 🔍 How to Find Your Production URL

### If Using Vercel Default Domain:
1. Go to your Vercel dashboard
2. Select your project
3. Look for the **Domains** section
4. Copy the `.vercel.app` URL (e.g., `alira-git-main-username.vercel.app`)
5. Add `https://` prefix: `https://alira-git-main-username.vercel.app`

### If Using Custom Domain:
Use your custom domain with `https://` prefix

## 🐛 Troubleshooting

### Issue: Build Still Failing

**Check:**
- Look at the build logs in Vercel
- Ensure all TypeScript errors are resolved
- Run `npm run build` locally to test

**Solution:**
The GradientBars fixes should resolve the build errors. If you still see issues, check for any other import errors.

### Issue: Email Links Still Point to Localhost

**Possible Causes:**
1. Environment variable not set correctly
2. Need to redeploy after setting environment variable
3. Cached build using old configuration

**Solution:**
1. Verify the environment variable is set in Vercel
2. Trigger a new deployment with cache disabled
3. Wait for the new deployment to complete
4. Test with a new signup (old emails will still have old links)

### Issue: "Authentication Required" Error After Clicking Email

**Possible Causes:**
1. Auth callback route not deployed
2. Redirect URLs not configured in Supabase
3. Session cookies not being set

**Solution:**
1. Ensure the new deployment is live
2. Check Supabase redirect URL configuration
3. Check browser console for errors
4. Try in incognito mode to rule out cookie issues

### Issue: Redirected to Homepage Instead of Dashboard

**Possible Causes:**
1. Middleware blocking unauthenticated access
2. Session not being established properly

**Solution:**
1. Check that the auth callback route is setting cookies correctly
2. Check browser Network tab to see if session cookies are being set
3. Check middleware logs in Vercel

## 📝 Technical Details

### What Changed

**File: `app/auth/callback/route.ts` (NEW)**
- Handles OAuth callback from Supabase
- Exchanges auth code for session
- Sets session cookies
- Redirects to dashboard

**Files: Import Fixes**
- `app/about/page.tsx`
- `app/contact/page.tsx`
- `app/services/page.tsx`
- `app/what-you-get/page.tsx`

Changed from:
```typescript
import GradientBars from '@/components/ui/gradient-bars'
```

To:
```typescript
import { GradientBars } from '@/components/ui/gradient-bars'
```

### How Email Confirmation Works Now

1. **User Signs Up** → `lib/supabase-client.ts` calls Supabase with `emailRedirectTo`
2. **getURL() Function** → Checks environment variables in this order:
   - `NEXT_PUBLIC_SITE_URL` (now set in Vercel) ✅
   - `NEXT_PUBLIC_VERCEL_URL` (automatically set by Vercel)
   - Falls back to `localhost:3000` (only if neither is set)
3. **Supabase Sends Email** → Link points to production domain
4. **User Clicks Link** → Redirected to `/auth/callback` with auth code
5. **Callback Route** → Exchanges code for session, sets cookies
6. **User Redirected** → To `/dashboard` (logged in)

## ✅ Success Checklist

Before considering this complete, verify:

- [ ] Environment variable `NEXT_PUBLIC_SITE_URL` is set in Vercel
- [ ] Supabase redirect URLs are configured
- [ ] Application has been redeployed
- [ ] Build completed successfully (no errors)
- [ ] Test signup sends email with correct production URL
- [ ] Clicking email link logs user in and redirects to dashboard
- [ ] User can access dashboard after authentication

## 🎉 Expected Results

After completing these steps:

1. ✅ Build will succeed (no more import errors)
2. ✅ Email confirmation links will point to your production domain
3. ✅ Users can complete signup and login successfully
4. ✅ Dashboard will be accessible after authentication

## 📞 Need Help?

If you encounter issues:

1. Check the Vercel deployment logs for build errors
2. Check browser console for JavaScript errors
3. Check Supabase logs for authentication errors
4. Verify all environment variables are set correctly
5. Try the authentication flow in incognito mode

## 🔄 Next Steps After Setup

Once authentication is working:

1. Test the complete user journey (signup → email → login → dashboard)
2. Test plan generation in production
3. Monitor error logs for any issues
4. Consider adding custom email templates in Supabase
5. Consider adding a custom domain (optional)

---

**Need the quick version?**

1. Set `NEXT_PUBLIC_SITE_URL` in Vercel environment variables
2. Add redirect URLs in Supabase dashboard
3. Redeploy your application
4. Test signup and email confirmation

That's it! 🚀

