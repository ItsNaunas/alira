# Environment Setup Checklist

Quick reference guide to fix the 500 error when generating business plans.

## ✅ Quick Fix Checklist

### 1. Verify Environment File Exists
```powershell
# Check if .env.local exists
Test-Path .env.local
```

If it returns `False`, create it:
```powershell
Copy-Item env.example .env.local
```

### 2. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-...`)
5. Save it somewhere safe

### 3. Get Supabase Service Role Key

1. Go to https://supabase.com/dashboard
2. Select your project: `ibpdwrouobzaqhfvcaxp`
3. Go to Settings → API
4. Find "service_role" key in the "Project API keys" section
5. Click to reveal and copy the key (starts with `eyJ`)
6. **⚠️ NEVER commit this to git!**

### 4. Update .env.local

Open `.env.local` in your editor and update these lines:

```env
# Replace the xxxxxx placeholder with your actual key
OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_KEY_FROM_STEP_2

# Uncomment and add the actual service role key
SUPABASE_SERVICE_ROLE_KEY=eyJYOUR_ACTUAL_KEY_FROM_STEP_3
```

**Before:**
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**After:**
```env
OPENAI_API_KEY=sk-proj-1A2B3C4D5E6F7G8H9I0J...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...
```

### 5. Validate Your Setup

Run the validation script:
```powershell
node scripts/validate-env.js
```

Expected output:
```
✅ Found .env.local file

Required Environment Variables:
✅ OPENAI_API_KEY: sk-proj-1A...
✅ SUPABASE_SERVICE_ROLE_KEY: eyJhbGci...
✅ NEXT_PUBLIC_SUPABASE_URL: https://...
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: eyJhb...

✅ ALL CHECKS PASSED
```

### 6. Restart Development Server

```powershell
# Press Ctrl+C to stop current server
# Then restart:
npm run dev
```

Look for this success message:
```
[OPENAI] ✅ OPENAI_API_KEY configured
```

### 7. Test Form Submission

1. Go to http://localhost:3000/form
2. Fill out the form
3. Submit
4. Should see:
   - ✅ "Saved to database"
   - ✅ "Attempting to generate business plan..."
   - ✅ Redirect to results page

---

## 🚫 Common Mistakes

### ❌ Mistake 1: Using Placeholder Values
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
**Fix**: Replace with actual key from OpenAI

### ❌ Mistake 2: Commented Out Key
```env
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**Fix**: Remove the `#` at the start

### ❌ Mistake 3: Wrong Variable Name
```env
SUPABASE_SERVICE_ROLE=... # ❌ Wrong name
```
**Fix**: Should be `SUPABASE_SERVICE_ROLE_KEY` (with `_KEY` at the end)

### ❌ Mistake 4: Extra Spaces
```env
OPENAI_API_KEY= sk-proj-123... # ❌ Space after =
```
**Fix**: No spaces between `=` and the value

### ❌ Mistake 5: Quotes Around Value
```env
OPENAI_API_KEY="sk-proj-123..." # ❌ Don't use quotes
```
**Fix**: No quotes needed in .env files

---

## 📋 Complete .env.local Template

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_KEY_HERE

# Supabase Configuration (Server-side)
SUPABASE_URL=https://ibpdwrouobzaqhfvcaxp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlicGR3cm91b2J6YXFoZnZjYXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjM1NzAsImV4cCI6MjA3MjIzOTU3MH0.sZ2e4Zv5oLk8j6DneUK8UfxIAeTH4r7LUFmkDih7ryU

# Supabase Configuration (Client-side)
NEXT_PUBLIC_SUPABASE_URL=https://ibpdwrouobzaqhfvcaxp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlicGR3cm91b2J6YXFoZnZjYXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjM1NzAsImV4cCI6MjA3MjIzOTU3MH0.sZ2e4Zv5oLk8j6DneUK8UfxIAeTH4r7LUFmkDih7ryU

# Service Role Key (CRITICAL - Get from Supabase dashboard)
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE

# Analytics (Optional)
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX

# Email (Optional - for contact form)
RESEND_API_KEY=re_YOUR_RESEND_KEY_HERE
RESEND_FROM_EMAIL=contact@alirapartners.co.uk
```

---

## 🔍 Troubleshooting

### Issue: "Failed to load resource: 500"

**Cause**: Missing or invalid API keys

**Solution**: Follow steps 1-7 above

### Issue: "Missing Supabase configuration"

**Cause**: `SUPABASE_SERVICE_ROLE_KEY` not set or commented out

**Solution**: 
1. Get key from Supabase dashboard
2. Add as `SUPABASE_SERVICE_ROLE_KEY=...` in .env.local
3. Restart server

### Issue: OpenAI returns "Invalid API key"

**Cause**: Using placeholder value or wrong key

**Solution**:
1. Verify key starts with `sk-proj-` or `sk-`
2. Check for typos
3. Generate new key if needed

### Issue: Still getting errors after fixing .env.local

**Cause**: Server needs restart to load new environment variables

**Solution**:
1. Stop server (Ctrl+C)
2. Clear Next.js cache: `rm -rf .next`
3. Restart: `npm run dev`

---

## 🎯 Verification Commands

```powershell
# Check if environment variables are loaded
node -e "require('dotenv').config({ path: '.env.local' }); console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY?.substring(0, 10) + '...')"

# Validate all environment variables
node scripts/validate-env.js

# Test OpenAI connection
# (Add this to package.json scripts if needed)
# npm run test:openai
```

---

## 📚 Related Documentation

- **Full Audit Report**: See `PLAN_GENERATION_ERROR_AUDIT.md` for detailed analysis
- **Setup Instructions**: See `SETUP_INSTRUCTIONS.md` for initial project setup
- **Security Guide**: See `SECURITY.md` for best practices

---

## ✅ Success Criteria

You've successfully fixed the issue when:

1. ✅ Validation script passes all checks
2. ✅ Server starts without errors
3. ✅ See `[OPENAI] ✅ OPENAI_API_KEY configured` in console
4. ✅ Form submission completes and generates plan
5. ✅ Redirected to results page with generated plan

---

## 🆘 Still Having Issues?

If you've followed all steps and still get errors:

1. Check the browser console for specific error messages
2. Check the server console for error logs
3. Run `node scripts/validate-env.js` and share the output
4. Check if you have the latest code: `git pull origin main`
5. Try clearing all caches:
   ```powershell
   rm -rf .next
   rm -rf node_modules
   npm install
   npm run dev
   ```

