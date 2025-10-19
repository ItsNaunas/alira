# Supabase Authentication - Production URL Setup

## 🚨 Issue
Supabase authentication redirects are going to `localhost:3000` instead of your Vercel production domain.

## 🎯 Root Cause
Supabase projects have **allowed redirect URLs** configured in the dashboard. By default, only localhost is configured for development.

## ✅ Solution - Complete Setup Guide

### Step 1: Configure Supabase Dashboard (REQUIRED)

1. **Go to Supabase Dashboard**
   - Navigate to: https://app.supabase.com
   - Select your ALIRA project

2. **Update Authentication URLs**
   - Go to **Authentication** → **URL Configuration**
   - Or: **Settings** → **Authentication**

3. **Add Production URLs**
   
   **Site URL:**
   ```
   https://your-domain.vercel.app
   ```
   Or your custom domain:
   ```
   https://alirapartners.co.uk
   ```

   **Redirect URLs (Add ALL of these):**
   ```
   http://localhost:3000/**
   https://your-domain.vercel.app/**
   https://alirapartners.co.uk/**
   https://*.vercel.app/**
   ```

   The `**` at the end is important - it allows all paths under that domain.

4. **Additional Auth Settings**

   **Email Auth Settings:**
   - Enable Email Confirmations (if you want)
   - Set Email Templates (optional)

   **Security Settings:**
   - Enable RLS (Row Level Security) - Should already be on
   - Set JWT expiry as needed

### Step 2: Update Environment Variables

#### For Local Development (.env.local)
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server-side only
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Other config
OPENAI_API_KEY=sk-proj-...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=contact@alirapartners.co.uk
```

#### For Vercel Production

**Go to Vercel Dashboard:**
1. Project Settings → Environment Variables
2. Add these variables for **Production**, **Preview**, and **Development**:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-proj-...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=contact@alirapartners.co.uk
```

### Step 3: Add Redirect URL Detection (Code Update)

Update the Supabase client to handle redirects properly:

**File: `lib/supabase-client.ts`**

Add this configuration:

```typescript
import { createBrowserClient } from '@supabase/ssr'

// Get the correct base URL based on environment
const getURL = () => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ?? // Set this in Vercel
    process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel
    'http://localhost:3000/'
  
  // Make sure to include `https://` when not localhost
  url = url.includes('http') ? url : `https://${url}`
  // Make sure to include trailing `/`
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  
  return url
}

export const createClient = () => createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Update auth helpers to use proper redirects
export const auth = {
  async signUp(email: string, password: string, fullName: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${getURL()}dashboard`, // Redirect after email confirmation
      },
    })
    return { data, error }
  },

  async signIn(email: string, password: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  async signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getUser() {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  async getSession() {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },
}
```

### Step 4: Add Site URL to Vercel Environment Variables

In Vercel Dashboard → Environment Variables, add:

```bash
NEXT_PUBLIC_SITE_URL=https://alirapartners.co.uk
```

Or if using Vercel domain:
```bash
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

### Step 5: Redeploy

After making all changes:

```bash
git add .
git commit -m "fix: Configure Supabase auth for production URLs"
git push
```

Vercel will automatically redeploy with the new configuration.

---

## 🔍 Verification Steps

### 1. Check Supabase Dashboard
- ✅ Site URL matches your production domain
- ✅ All redirect URLs are added (localhost + production)
- ✅ Email auth is enabled

### 2. Check Vercel Environment Variables
- ✅ All `NEXT_PUBLIC_*` variables are set
- ✅ `NEXT_PUBLIC_SITE_URL` is set correctly
- ✅ Variables are set for all environments

### 3. Test Authentication Flow
1. Go to your production site
2. Try to sign up/sign in
3. Check redirect URL - should be production domain
4. Check browser console for any Supabase errors

---

## 🐛 Troubleshooting

### Still redirecting to localhost?

**Check 1: Clear browser cache and cookies**
```
Settings → Privacy → Clear browsing data
```

**Check 2: Verify Supabase configuration**
```bash
# In Supabase dashboard SQL editor, run:
SELECT * FROM auth.users LIMIT 1;
```

**Check 3: Check browser console for errors**
Look for messages like:
- "Invalid redirect URL"
- "URL not allowed"

### Error: "Email link is invalid or has expired"

This means:
1. The redirect URL wasn't in allowed list when email was sent
2. User clicked an old email link after you updated settings
3. Solution: User needs to request a new magic link/reset

### Still having issues?

**Verify environment variables are loaded:**
```typescript
// Add to a test page temporarily
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Site URL:', process.env.NEXT_PUBLIC_SITE_URL)
console.log('Vercel URL:', process.env.NEXT_PUBLIC_VERCEL_URL)
```

---

## 📋 Quick Checklist

- [ ] Supabase Dashboard: Site URL updated
- [ ] Supabase Dashboard: Redirect URLs added (including wildcards)
- [ ] Vercel: All environment variables set
- [ ] Vercel: `NEXT_PUBLIC_SITE_URL` added
- [ ] Code: Updated `supabase-client.ts` with getURL() function
- [ ] Code: Committed and pushed
- [ ] Vercel: Redeployed
- [ ] Test: Sign up flow works with production URL
- [ ] Test: Sign in flow works with production URL
- [ ] Test: Email redirects go to production domain

---

## 🎯 Expected Result

After completing these steps:

✅ Sign up → Redirects to: `https://alirapartners.co.uk/dashboard`  
✅ Sign in → Redirects to: `https://alirapartners.co.uk/dashboard`  
✅ Email links → Point to: `https://alirapartners.co.uk/...`  
❌ NO MORE: `http://localhost:3000/...` in production

---

## 📚 Additional Resources

- [Supabase Auth Configuration Docs](https://supabase.com/docs/guides/auth/redirect-urls)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

