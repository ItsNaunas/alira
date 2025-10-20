# Environment Variables Comparison Checklist

**Use this to verify your Vercel settings match what's required.**

---

## ✅ REQUIRED VARIABLES CHECKLIST

### Print this table and check off each one in Vercel:

| ✓ | Variable Name | Where to Get It | Environment | Value Starts With | Length |
|---|---|---|---|---|---|
| [ ] | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL | Production, Preview, Dev | `https://` | ~40 chars |
| [ ] | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public | Production, Preview, Dev | `eyJhbGci` | ~200+ chars |
| [ ] | `SUPABASE_URL` | Same as NEXT_PUBLIC_SUPABASE_URL | Production, Preview, Dev | `https://` | ~40 chars |
| [ ] | `SUPABASE_ANON_KEY` | Same as NEXT_PUBLIC_SUPABASE_ANON_KEY | Production, Preview, Dev | `eyJhbGci` | ~200+ chars |
| [ ] | `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role | **Production ONLY** | `eyJhbGci` | ~200+ chars |
| [ ] | `OPENAI_API_KEY` | OpenAI Platform → API Keys | Production, Preview, Dev | `sk-proj-` | ~100+ chars |
| [ ] | `RESEND_API_KEY` | Resend Dashboard → API Keys | Production, Preview, Dev | `re_` | ~40+ chars |
| [ ] | `RESEND_FROM_EMAIL` | Your verified email in Resend | Production, Preview, Dev | `contact@` | email format |
| [ ] | `NEXT_PUBLIC_SITE_URL` | Your production domain | Production, Preview, Dev | `https://` | URL format |

**Total Required: 9 variables**

---

## 🔍 VERIFICATION STEPS

### In Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Click your ALIRA project
3. Click "Settings"
4. Click "Environment Variables"

### Count Variables:
```
Production: Should show 9 variables
Preview: Should show 8 variables (no SUPABASE_SERVICE_ROLE_KEY)
Development: Should show 8 variables (no SUPABASE_SERVICE_ROLE_KEY)
```

### Check Each Variable:

#### ✅ Variable Name Check:
- [ ] Exact spelling (case-sensitive!)
- [ ] No extra spaces
- [ ] No typos (e.g., `SUPABASE_UR` instead of `SUPABASE_URL`)

#### ✅ Value Check:
- [ ] Complete (not truncated)
- [ ] No leading/trailing spaces
- [ ] Correct format (JWT, URL, email, etc.)
- [ ] From correct Supabase project (production, not dev)

#### ✅ Environment Scope:
- [ ] Production checked for all 9
- [ ] Preview checked for 8 (NOT service_role key)
- [ ] Development checked for 8 (NOT service_role key)

---

## 🎯 COMMON MISTAKES GUIDE

### Mistake #1: Typo in Variable Name
```
❌ WRONG: NEXT_PUBLIC_SUPABASE_UR (missing L)
✅ RIGHT: NEXT_PUBLIC_SUPABASE_URL

❌ WRONG: SUPABASE_ANON_KEY (missing NEXT_PUBLIC_ prefix for client var)
✅ RIGHT: Need BOTH SUPABASE_ANON_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Mistake #2: Incomplete Value
```
❌ WRONG: eyJhbGciOiJIUzI1NiIsInR5cCI... (truncated)
✅ RIGHT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi... (full ~200+ chars)
```

### Mistake #3: Wrong Supabase Project
```
❌ WRONG: Using local development Supabase URL
✅ RIGHT: Using production Supabase project URL
```

### Mistake #4: Service Role Key in Preview/Dev
```
❌ WRONG: SUPABASE_SERVICE_ROLE_KEY in Preview environment
✅ RIGHT: SUPABASE_SERVICE_ROLE_KEY ONLY in Production
```

### Mistake #5: Forgetting NEXT_PUBLIC_ Prefix
```
❌ WRONG: Only SUPABASE_URL (server-side)
✅ RIGHT: Both SUPABASE_URL (server) and NEXT_PUBLIC_SUPABASE_URL (client)
```

---

## 📝 QUICK VALIDATION SCRIPT

Copy this into your browser console AFTER deployment to verify client-side variables:

```javascript
console.table({
  'Supabase URL': process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ Missing',
  'Supabase Key': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
  'Site URL': process.env.NEXT_PUBLIC_SITE_URL || '❌ Missing',
  'GA4 ID': process.env.NEXT_PUBLIC_GA4_ID || 'Not set (optional)'
});
```

**Expected Output:**
```
Supabase URL: https://your-project.supabase.co
Supabase Key: ✅ Set
Site URL: https://your-domain.com
GA4 ID: G-XXXXXXXXXX or Not set (optional)
```

---

## 🎯 STEP-BY-STEP ADD PROCESS

### For Each Missing Variable:

1. **Click "Add New"** in Vercel

2. **Fill in:**
   ```
   Key: [Variable name from table above]
   Value: [Copy from source]
   Environments: [Check appropriate boxes]
   ```

3. **Click "Save"**

4. **Verify:**
   - Variable appears in list
   - Correct environments selected
   - No typos in name

5. **Repeat** for all missing variables

6. **Final count:**
   - Production: 9 variables ✅
   - Preview: 8 variables ✅
   - Development: 8 variables ✅

---

## 🔐 WHERE TO GET EACH VALUE

### Supabase Variables (5 total):

**Source:** Supabase Dashboard → Your Project → Settings → API

**Get:**
1. **Project URL:**
   - Copy and use for BOTH:
     - `SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_URL`
   
2. **anon public key:**
   - Copy and use for BOTH:
     - `SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **service_role key:**
   - Copy and use for:
     - `SUPABASE_SERVICE_ROLE_KEY` (Production ONLY!)
   - ⚠️ **CRITICAL:** This should NEVER be in client-side code!
   - ⚠️ **NEVER** add to Preview or Development environments

### OpenAI Variable (1 total):

**Source:** https://platform.openai.com/api-keys

**Get:**
1. Click "Create new secret key"
2. Copy the key (starts with `sk-proj-`)
3. Store safely - you can't view it again!
4. Use for: `OPENAI_API_KEY`

### Resend Variables (2 total):

**Source:** https://resend.com/api-keys

**Get:**
1. **API Key:**
   - Create new API key
   - Copy (starts with `re_`)
   - Use for: `RESEND_API_KEY`

2. **From Email:**
   - Go to Domains section
   - Verify your domain
   - Use verified email for: `RESEND_FROM_EMAIL`
   - Example: `contact@alirapartners.co.uk`

### Site URL (1 total):

**Source:** Your domain or Vercel URL

**Get:**
1. Use your production domain: `https://alirapartners.co.uk`
2. Or Vercel subdomain: `https://alira.vercel.app`
3. Use for: `NEXT_PUBLIC_SITE_URL`
4. No trailing slash!

---

## ✅ AFTER ADDING ALL VARIABLES

### Checklist:
- [ ] All 9 variables added to Production
- [ ] All 8 variables added to Preview (no service_role)
- [ ] All 8 variables added to Development (no service_role)
- [ ] No typos in variable names
- [ ] All values complete (not truncated)
- [ ] Service role key ONLY in Production

### Deploy:
```powershell
git commit --allow-empty -m "Environment variables configured"
git push origin main
```

### Wait:
- 1-2 minutes for build and deployment

### Verify:
- Deployment succeeds ✅
- Site loads ✅
- Authentication works ✅
- Forms submit ✅

---

## 🚨 IF DEPLOYMENT STILL FAILS

After verifying all variables are correct:

1. **Take screenshot** of Environment Variables page (variable names visible, values hidden)

2. **Check Vercel logs** for specific error message

3. **Reply with:**
   - "All 9 variables are set correctly"
   - "Here's the deployment error: [paste error]"
   - "Screenshot attached showing all variables"

4. **I'll help with:** Next level troubleshooting

---

## 💡 PRO TIP

**Copy-paste trap:** When copying JWT tokens or long keys, make sure you get the ENTIRE value:

```
❌ BAD: Select partial text → Copy
✅ GOOD: Triple-click to select all → Copy
✅ BETTER: Click the "Copy" button in dashboard
```

**Verify by pasting into notepad first:**
- Check length (JWT tokens are ~200+ characters)
- No line breaks
- No extra spaces at start/end
- Complete value

---

**Ready? Check those variables and let's get this deployed! 🚀**

