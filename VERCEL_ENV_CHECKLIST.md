# Vercel Environment Variables Checklist

**Quick Reference:** Ensure all these variables are set in Vercel Dashboard

---

## 🔑 HOW TO SET ENVIRONMENT VARIABLES

1. Go to **Vercel Dashboard**
2. Select your **ALIRA project**
3. Click **Settings** → **Environment Variables**
4. Add each variable below

---

## ✅ REQUIRED ENVIRONMENT VARIABLES

### 1. Supabase Configuration (Client-Side) - PUBLIC

**Variable:** `NEXT_PUBLIC_SUPABASE_URL`  
**Value:** `https://your-project-id.supabase.co`  
**Environments:** ✅ Production ✅ Preview ✅ Development  
**Example:** `https://abcdefghijklmnop.supabase.co`

---

**Variable:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
**Value:** Your Supabase Anonymous Key (starts with `eyJhbGci...`)  
**Environments:** ✅ Production ✅ Preview ✅ Development  
**Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...`

---

### 2. Supabase Configuration (Server-Side) - PRIVATE

**Variable:** `SUPABASE_URL`  
**Value:** `https://your-project-id.supabase.co` (same as public URL)  
**Environments:** ✅ Production ✅ Preview ✅ Development  
**Example:** `https://abcdefghijklmnop.supabase.co`

---

**Variable:** `SUPABASE_ANON_KEY`  
**Value:** Your Supabase Anonymous Key (same as public key)  
**Environments:** ✅ Production ✅ Preview ✅ Development  
**Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...`

---

**Variable:** `SUPABASE_SERVICE_ROLE_KEY`  
**Value:** Your Supabase Service Role Key (starts with `eyJhbGci...`)  
**Environments:** ✅ Production ONLY (⚠️ NEVER in Preview/Development)  
**Security:** 🔒 **NEVER expose to client-side code**  
**Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...`

---

### 3. OpenAI Configuration

**Variable:** `OPENAI_API_KEY`  
**Value:** Your OpenAI API Key (starts with `sk-proj-...`)  
**Environments:** ✅ Production ✅ Preview ✅ Development  
**Example:** `sk-proj-abc123def456ghi789...`

---

### 4. Email Configuration (Resend)

**Variable:** `RESEND_API_KEY`  
**Value:** Your Resend API Key (starts with `re_...`)  
**Environments:** ✅ Production ✅ Preview ✅ Development  
**Example:** `re_123456789abcdefghijklmnop`

---

**Variable:** `RESEND_FROM_EMAIL`  
**Value:** Your verified sender email address  
**Environments:** ✅ Production ✅ Preview ✅ Development  
**Example:** `contact@alirapartners.co.uk`  
**Note:** Must be verified in Resend Dashboard

---

### 5. Site Configuration

**Variable:** `NEXT_PUBLIC_SITE_URL`  
**Value:** Your production domain URL  
**Environments:** ✅ Production (use production URL) ✅ Preview (can use preview URL) ✅ Development (use localhost)  
**Production Example:** `https://alirapartners.co.uk`  
**Preview Example:** `https://alira-git-main-yourname.vercel.app`  
**Development Example:** `http://localhost:3000`

---

## 📝 OPTIONAL ENVIRONMENT VARIABLES

### Google Analytics (Optional)

**Variable:** `NEXT_PUBLIC_GA4_ID`  
**Value:** Your Google Analytics 4 Measurement ID (starts with `G-...`)  
**Environments:** ✅ Production (recommended) ⚠️ Preview (optional) ❌ Development (skip)  
**Example:** `G-XXXXXXXXXX`

---

## 🎯 QUICK VERIFICATION CHECKLIST

Copy this checklist to verify all variables are set:

### In Vercel Dashboard → Settings → Environment Variables:

#### ✅ Production Environment:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (Production ONLY!)
- [ ] `OPENAI_API_KEY`
- [ ] `RESEND_API_KEY`
- [ ] `RESEND_FROM_EMAIL`
- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] `NEXT_PUBLIC_GA4_ID` (optional)

#### ✅ Preview Environment:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] ❌ ~~`SUPABASE_SERVICE_ROLE_KEY`~~ (NOT in Preview!)
- [ ] `OPENAI_API_KEY`
- [ ] `RESEND_API_KEY`
- [ ] `RESEND_FROM_EMAIL`
- [ ] `NEXT_PUBLIC_SITE_URL`

#### ✅ Development Environment:
- [ ] Same as Preview (for local development via `vercel env pull`)

---

## 🔍 WHERE TO FIND YOUR VALUES

### Supabase Keys:
1. Go to **Supabase Dashboard**
2. Select your **project**
3. Click **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use for `SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → Use for `SUPABASE_SERVICE_ROLE_KEY` (Production only!)

### OpenAI API Key:
1. Go to **OpenAI Platform**
2. Navigate to **API Keys**
3. Create new key or use existing
4. Copy key (starts with `sk-proj-...`)

### Resend API Key:
1. Go to **Resend Dashboard**
2. Navigate to **API Keys**
3. Create new key or use existing
4. Copy key (starts with `re_...`)
5. Verify your domain in **Domains** section

---

## ⚠️ IMPORTANT SECURITY NOTES

### 🔒 NEVER EXPOSE THESE TO CLIENT:
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side ONLY
- `OPENAI_API_KEY` - Server-side ONLY
- `RESEND_API_KEY` - Server-side ONLY

### ✅ SAFE TO EXPOSE (PUBLIC):
- `NEXT_PUBLIC_SUPABASE_URL` - Required for client auth
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Required for client auth
- `NEXT_PUBLIC_SITE_URL` - Used for redirects
- `NEXT_PUBLIC_GA4_ID` - Analytics tracking

### 🎯 RULE OF THUMB:
If a variable starts with `NEXT_PUBLIC_`, it's **client-side** and will be visible in browser.  
If it doesn't have `NEXT_PUBLIC_`, it's **server-side only** and stays secure.

---

## 🚀 AFTER SETTING VARIABLES

### 1. Redeploy Your Application
Variables are only applied on new deployments:

```bash
# Option 1: Push new commit
git commit --allow-empty -m "Update environment variables"
git push origin main

# Option 2: Redeploy from Vercel Dashboard
# Go to Deployments → Click "Redeploy"
```

### 2. Verify Variables Are Working
After deployment succeeds:

1. **Test Authentication:**
   - Visit your site
   - Try signing up
   - Try logging in
   - Check if dashboard loads

2. **Test AI Generation:**
   - Submit the form
   - Verify plan generates
   - Check for OpenAI errors

3. **Test Email:**
   - Submit contact form
   - Verify email arrives
   - Check spam folder

---

## 🐛 COMMON MISTAKES

### ❌ Mistake 1: Typo in Variable Name
**Wrong:** `NEXT_PUBLIC_SUPABASE_UR` (missing L)  
**Right:** `NEXT_PUBLIC_SUPABASE_URL`

### ❌ Mistake 2: Incomplete Value
**Wrong:** `eyJhbGciOiJIUzI1NiIsInR5cCI...` (truncated)  
**Right:** Full JWT token (usually ~200+ characters)

### ❌ Mistake 3: Wrong Environment Scope
**Wrong:** Service role key in Preview/Development  
**Right:** Service role key ONLY in Production

### ❌ Mistake 4: Not Redeploying After Setting
**Remember:** Variables only apply to NEW deployments!

### ❌ Mistake 5: Mixing Production/Development Values
**Wrong:** Using development Supabase URL in production  
**Right:** Use production Supabase project for production deploy

---

## ✅ VERIFICATION SCRIPT

Run this in your browser console after deployment to verify public variables:

```javascript
console.log({
  'Supabase URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
  'Supabase Key': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
  'Site URL': process.env.NEXT_PUBLIC_SITE_URL,
  'GA4 ID': process.env.NEXT_PUBLIC_GA4_ID || 'Not set (optional)'
});
```

**Expected Output:**
```
{
  'Supabase URL': 'https://your-project.supabase.co',
  'Supabase Key': '✅ Set',
  'Site URL': 'https://your-domain.com',
  'GA4 ID': 'G-XXXXXXXXXX'
}
```

---

## 📚 RELATED DOCUMENTATION

- **Full Deployment Checklist:** `PHASE_6_TASK_6.5_DEPLOYMENT_CHECKLIST.md`
- **Troubleshooting Guide:** `VERCEL_DEPLOYMENT_TROUBLESHOOTING.md`
- **Environment Example:** `env.example`
- **Setup Instructions:** `SETUP_INSTRUCTIONS.md`

---

## 🎉 READY TO DEPLOY?

Once all checkboxes are ✅:
1. Run the retry deployment script
2. Watch the build logs
3. Verify the deployment succeeds
4. Test the live site

**Your code is perfect - just needs the right configuration! 🚀**

