# 🔧 Troubleshooting Guide

## Common Issues & Solutions

---

## ❌ "Nothing happens when I click Continue"

### Symptoms:
- Complete the form
- Select services and check the box
- Click "Continue"
- Button shows "Processing..." but nothing happens
- No error message visible

### Root Cause:
Database migration hasn't been run, so the app can't save your data.

### Solution:
Run the database migration (takes 2 minutes):

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com/
   - Select your project
   - Click **SQL Editor** in sidebar

2. **Run Migration**
   - Click **New query**
   - Copy contents of `db/migrations/002_add_auth.sql`
   - Paste into SQL Editor
   - Click **Run** (or Ctrl+Enter)

3. **Verify Success**
   - Should see: "Success. No rows returned" ✅
   - Check browser console (F12)
   - Should see: "✅ Saved to database"

4. **Try Again**
   - Refresh page
   - Complete form again
   - Should redirect to dashboard ✅

---

## 🔍 How to Check What's Wrong

### Open Browser Console:
1. Press **F12** (or right-click → Inspect)
2. Click **Console** tab
3. Look for error messages

### What to Look For:

#### ✅ Good Signs:
```
=== FORM COMPLETION STARTED ===
Attempting to save to database...
✅ Saved to database
Attempting to generate business plan...
✅ Business plan generated
Redirecting to dashboard...
```

#### ❌ Bad Signs:

**"column user_id does not exist"**
```
❌ Database error: column "user_id" does not exist
```
**Solution:** Run the migration (see above)

**"Failed to load resource: 400"**
```
Failed to load resource: the server responded with a status of 400
```
**Solution:** Database migration needed

**"JWT expired" or "Unauthorized"**
```
❌ Database error: JWT expired
```
**Solution:** 
- Log out and log in again
- Check env variables are correct
- Clear browser cookies

---

## 🐛 Other Common Issues

### Issue: Button stays on "Processing..." forever

**Causes:**
1. Database migration not run
2. Network error
3. API route not working

**Debug Steps:**
1. Open console (F12)
2. Look for red error messages
3. Check Network tab for failed requests
4. Run migration if you see column errors

**Quick Fix:**
```bash
# Restart dev server
# Stop with Ctrl+C
npm run dev
```

---

### Issue: "Invalid API key" or "Unauthorized"

**Causes:**
- Missing or incorrect environment variables
- Supabase keys not set

**Solution:**
Check `.env.local` has all these:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
```

Then restart dev server:
```bash
npm run dev
```

---

### Issue: Keeps asking me to log in

**Causes:**
- Middleware not running
- Session not persisting
- Cookies blocked

**Solutions:**

1. **Check middleware.ts exists** in project root
2. **Clear browser data:**
   - Open DevTools (F12)
   - Application → Storage → Clear site data
   - Refresh page
3. **Check cookies are enabled** in browser
4. **Try incognito/private mode** to test

---

### Issue: Form data not saving

**Check These:**

1. **Migration ran successfully?**
   ```sql
   -- In Supabase SQL Editor, run:
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'intake_forms' AND column_name = 'user_id';
   ```
   Should return `user_id` column ✅

2. **User is authenticated?**
   - Check header shows "Dashboard" (not "Sign Up")
   - Open console, type: `localStorage`
   - Should see Supabase auth tokens

3. **RLS policies active?**
   - Supabase Dashboard → Database → Tables
   - Click `intake_forms` table
   - Check RLS is enabled (shield icon)

---

## 🎯 Step-by-Step Debugging

### When clicking Continue does nothing:

1. **Open Console** (F12)
2. **Clear it** (trash icon or Ctrl+L)
3. **Click Continue again**
4. **Read the errors** from top to bottom

### Most Common Error Patterns:

**Pattern 1: Migration Issue**
```
❌ Database error: column "user_id" of relation "intake_forms" does not exist
```
→ **Run migration** (see top of this doc)

**Pattern 2: Auth Issue**
```
❌ Database error: new row violates row-level security policy
```
→ **Check you're logged in** (header should show "Dashboard")
→ **Run migration** (sets up RLS policies)

**Pattern 3: Network Issue**
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
```
→ **Check Supabase URL** is correct in .env.local
→ **Check internet connection**

---

## 💡 Quick Checks

Before asking for help, verify:

- [ ] Database migration ran successfully
- [ ] `.env.local` has all required variables (including `NEXT_PUBLIC_` versions)
- [ ] Dev server is running (no errors in terminal)
- [ ] You're logged in (header shows "Dashboard", not "Sign Up")
- [ ] Browser console shows detailed error messages
- [ ] Tried in incognito/private browsing mode

---

## 📞 Still Stuck?

If you've tried everything above:

1. **Share these details:**
   - Console errors (F12 → Console)
   - Network errors (F12 → Network tab)
   - Steps you tried
   - What you see vs. what you expect

2. **Check these files exist:**
   - `middleware.ts` (in project root)
   - `db/migrations/002_add_auth.sql`
   - `.env.local` (not committed to git)

3. **Verify Supabase setup:**
   - Tables exist: `intake_forms`, `user_profiles`
   - Email auth is enabled
   - API keys are correct

---

## 🚀 Success Checklist

When everything works, you should see:

✅ Can sign up / log in from header
✅ Header shows "Dashboard" when logged in
✅ Chat redirects to form-chat after login
✅ Form questions appear one by one
✅ Can select services and check consent
✅ "Continue" button shows "Processing..."
✅ Console shows "✅ Saved to database"
✅ Redirects to dashboard automatically
✅ Dashboard shows your plan
✅ Can log out and log back in
✅ Previous plans are still there

---

**Most issues are solved by running the database migration!** 

See **QUICK_START.md** for the fastest path to getting everything working.

