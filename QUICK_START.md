# ⚡ Quick Start Guide

## You're Almost There!

The app is running, but you need to complete the database setup.

---

## 🚨 Error You're Seeing

```
Failed to load resource: the server responded with a status of 400
Error completing form
```

### Why?
The database tables haven't been updated with the authentication columns yet.

---

## ✅ Fix in 3 Steps (Takes 2 minutes)

### Step 1: Open Supabase Dashboard

1. Go to [https://app.supabase.com/](https://app.supabase.com/)
2. Select your project
3. Click **SQL Editor** in the left sidebar

### Step 2: Run the Migration

1. Click **New query** button
2. Open the file `db/migrations/002_add_auth.sql` from your project
3. Copy ALL the contents (Ctrl+A, Ctrl+C)
4. Paste into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)

You should see: **"Success. No rows returned"** ✅

### Step 3: Refresh Your Browser

1. Go back to `http://localhost:3002`
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Try the form again

---

## 📋 What the Migration Does

The migration adds:
- `user_id` column to all tables
- User profiles table
- Security policies (RLS)
- Auto-profile creation on signup

---

## 🧪 Test It Works

After running the migration:

1. **Sign up** for a new account (or login)
2. **Type a business idea** in the chat
3. **Click Send**
4. Should go to conversational form ✅
5. **Complete the questions**
6. Should redirect to dashboard ✅

---

## ❌ Still Getting Errors?

### Error: "column user_id does not exist"
**Solution:** Migration didn't run successfully
- Check for SQL syntax errors in Supabase logs
- Make sure you copied the entire migration file
- Try running it again

### Error: "permission denied"
**Solution:** Using wrong Supabase key
- Check `.env.local` has correct `SUPABASE_URL` and keys
- Make sure you have `NEXT_PUBLIC_` versions too

### Error: "JWT expired" or "Invalid token"
**Solution:** Session issue
- Clear browser cookies
- Log out and log in again
- Check middleware is running

---

## 🎯 Quick Checklist

Before testing, make sure:

- [ ] Migration ran successfully in Supabase
- [ ] `.env.local` has all required variables:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
  SUPABASE_URL=https://your-project.supabase.co
  SUPABASE_ANON_KEY=eyJhbGciOi...
  ```
- [ ] Email authentication is enabled in Supabase Dashboard
- [ ] Dev server restarted after env changes
- [ ] Browser refreshed (hard reload)

---

## 📖 Need More Help?

See the full guides:
- **SETUP_INSTRUCTIONS.md** - Complete setup guide
- **AUTHENTICATION_FIXES.md** - Auth system details
- **NEW_ARCHITECTURE.md** - System architecture

---

## ⚡ TL;DR

```bash
# 1. Copy db/migrations/002_add_auth.sql
# 2. Paste in Supabase SQL Editor
# 3. Run it
# 4. Refresh browser
# Done! ✨
```

Your conversational ALIRA platform is ready to go! 🚀

