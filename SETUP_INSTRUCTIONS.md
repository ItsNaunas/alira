# 🚀 ALIRA Setup Instructions

## Quick Start

Follow these steps to get your new conversational ALIRA platform up and running.

---

## ✅ Step 1: Install Dependencies

Already done! ✨

---

## 📝 Step 2: Configure Environment Variables

### Required Environment Variables

Create a `.env.local` file in the root directory with:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Supabase Configuration (Server-side)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Configuration (Client-side - Required for Auth!)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend Email Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=contact@alirapartners.co.uk

# Analytics (Optional)
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
```

### Getting Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for both `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use for both `SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> ⚠️ **Important**: You need BOTH the regular and `NEXT_PUBLIC_` versions for authentication to work!

---

## 🗄️ Step 3: Run Database Migrations

### Option A: Using Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **SQL Editor**
4. Click **New query**
5. Copy the entire contents of `db/migrations/002_add_auth.sql`
6. Paste into the SQL editor
7. Click **Run** or press `Ctrl+Enter`
8. Verify success (should see "Success. No rows returned")

### Option B: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

### What This Migration Does:
- ✅ Links all tables to authenticated users
- ✅ Creates user profiles table
- ✅ Sets up Row Level Security (RLS) policies
- ✅ Auto-creates user profile on signup
- ✅ Ensures data privacy (users only see their own data)

---

## 🔐 Step 4: Enable Email Authentication

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Email** provider
5. Make sure it's **ENABLED** (toggle should be green)
6. Optional: Configure email templates
   - Go to **Authentication** → **Email Templates**
   - Customize signup confirmation, password reset, etc.

### Email Provider Settings:
- ✅ **Enable Email Confirmations**: Recommended for production
- ✅ **Enable Email Change Confirmations**: Recommended
- ✅ **Secure Email Change**: Recommended

---

## 🧪 Step 5: Test the System

### 1. Start the Development Server

```bash
npm run dev
```

Server should start at `http://localhost:3000`

### 2. Test Signup Flow

1. Open `http://localhost:3000`
2. Scroll to the hero chat section
3. Type a business idea (e.g., "An AI-powered fitness app")
4. Click **Send**
5. Auth modal should appear
6. Fill in:
   - Name: Your name
   - Email: Your test email
   - Password: At least 6 characters
7. Click **Create Account & Continue**

**Expected Result:** 
- Should redirect to `/form-chat`
- Your idea should be pre-filled
- Conversational form should start

### 3. Test Login Flow

1. Go back to homepage
2. Type another idea
3. Click **Send**
4. In auth modal, click **"Already have an account? Sign in"**
5. Enter your email and password
6. Click **Sign In & Continue**

**Expected Result:**
- Should redirect to `/form-chat`
- Should be authenticated

### 4. Test Dashboard

1. After completing the form (or while testing), navigate to `/dashboard`
2. You should see:
   - Your name/email in header
   - Stats cards
   - List of your business plans
   - Sign out button

**Expected Result:**
- Dashboard loads
- Shows your plans
- Sign out works

---

## 🐛 Troubleshooting

### Error: "Module not found: @supabase/ssr"
**Solution:** Already fixed! Package is installed.

### Error: "Invalid API key" or "Unauthorized"
**Solution:** 
1. Check your `.env.local` file exists
2. Verify environment variables are correct
3. Make sure you have BOTH regular and `NEXT_PUBLIC_` versions
4. Restart dev server (`Ctrl+C` then `npm run dev`)

### Error: "Email not confirmed"
**Solution:**
1. Check your email inbox for confirmation
2. Or, in Supabase Dashboard:
   - Go to **Authentication** → **Users**
   - Find your user
   - Click the three dots → **Confirm user**

### Auth modal doesn't appear
**Solution:**
1. Check browser console for errors
2. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
3. Clear browser cache and cookies
4. Try incognito/private browsing

### Database errors
**Solution:**
1. Verify migration ran successfully
2. Check Supabase logs:
   - Dashboard → **Logs** → **Database logs**
3. Verify RLS policies are active:
   - Dashboard → **Database** → **Tables**
   - Check each table has RLS enabled

### Can't see plans in dashboard
**Solution:**
1. Make sure you're logged in
2. Check browser console for errors
3. Verify RLS policies were created:
   - Dashboard → **Database** → **Policies**
4. Check data exists:
   - Dashboard → **Table Editor**
   - Look at `intake_forms` table

---

## 📚 Next Steps

Once everything is working:

1. **Implement Business Plan Generation**
   - Update `lib/openai.ts` with `generateBusinessPlan` function
   - Test AI generation

2. **Add PDF Generation**
   - Implement PDF creation in `app/api/generate-plan/route.ts`
   - Test PDF downloads

3. **Email Notifications**
   - Configure Resend API
   - Send emails when plans are ready

4. **Deploy to Production**
   - Add environment variables to Vercel
   - Deploy and test

5. **Optional Enhancements**
   - Password reset flow
   - Social authentication (Google, GitHub)
   - Plan sharing
   - Team features

---

## 📖 Documentation

- [NEW_ARCHITECTURE.md](./NEW_ARCHITECTURE.md) - Full system architecture
- [FLOW_DIAGRAM.md](./FLOW_DIAGRAM.md) - Visual user flow
- [RESPONSIVE_OPTIMIZATION.md](./RESPONSIVE_OPTIMIZATION.md) - Responsive design guide

---

## 🆘 Need Help?

1. Check the console for error messages
2. Review Supabase logs in dashboard
3. Verify all environment variables
4. Make sure migration completed
5. Check that Email auth is enabled

---

## ✨ You're All Set!

Your conversational ALIRA platform is ready to go. Users can now:
- ✅ Sign up and log in
- ✅ Chat through the form
- ✅ Access their personal dashboard
- ✅ Save and retrieve their business plans

Happy building! 🚀

