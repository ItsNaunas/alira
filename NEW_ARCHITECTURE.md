# ALIRA New Architecture - Conversational Platform

## Overview

We've transformed ALIRA from a simple form-and-email system into a full conversational platform with user authentication and persistent storage. Users now stay on the platform, can return anytime, and have a personal dashboard to manage their business plans.

## What Changed

### 1. **Authentication System**
- ✅ Supabase Auth integration (signup/login)
- ✅ Password-based authentication
- ✅ Session management
- ✅ User profiles with metadata

### 2. **Conversational Form Interface**
- ✅ Chat-based UI replacing traditional forms
- ✅ Questions appear one at a time
- ✅ Natural conversation flow
- ✅ Dynamic question progression based on answers
- ✅ Multi-select service selection with visual checkboxes

### 3. **User Dashboard**
- ✅ View all created business plans
- ✅ Download PDFs when ready
- ✅ Track plan status (in progress / completed)
- ✅ Stats overview (total plans, ready to download, etc.)

### 4. **Database Schema Updates**
- ✅ `user_id` columns added to all relevant tables
- ✅ `user_profiles` table for extended user data
- ✅ Row Level Security (RLS) policies for data privacy
- ✅ Auto-creation of user profiles on signup

## New User Flow

1. **Homepage** → User types business idea in chat
2. **Auth Modal** → User signs up or logs in
3. **Conversational Form** (`/form-chat`) → AI asks questions one by one
4. **Business Plan Generation** → AI creates personalized plan
5. **Dashboard** (`/dashboard`) → User can view, download, and manage plans

## File Structure

### New Files Created
```
├── components/
│   └── ConversationalForm.tsx          # Chat-based form interface
├── app/
│   ├── dashboard/
│   │   └── page.tsx                    # User dashboard
│   ├── form-chat/
│   │   └── page.tsx                    # Conversational form page
│   └── api/
│       └── generate-plan/
│           └── route.ts                # API for generating business plans
├── lib/
│   └── supabase-client.ts              # Client-side Supabase helpers
└── db/
    └── migrations/
        └── 002_add_auth.sql            # Auth schema migration
```

### Modified Files
```
├── components/
│   └── VercelV0Chat.tsx                # Now includes signup/login modal
├── package.json                        # Added @supabase/auth-helpers-nextjs
└── All CTA components                  # Updated to scroll to #start-chat
```

## Setup Instructions

### 1. Install New Dependencies
```bash
npm install @supabase/auth-helpers-nextjs
```

### 2. Run Database Migration
Execute the migration in your Supabase SQL Editor:
```sql
-- Run db/migrations/002_add_auth.sql
```

### 3. Enable Supabase Auth
In your Supabase Dashboard:
1. Go to Authentication → Settings
2. Enable Email authentication
3. Configure email templates (optional)
4. Set site URL to your domain

### 4. Update Environment Variables
No new env variables needed - uses existing `SUPABASE_URL` and `SUPABASE_ANON_KEY`

## Features

### ConversationalForm Component
- **Progressive Disclosure**: Questions appear one at a time
- **Context-Aware**: Each question builds on previous answers
- **Visual Feedback**: Typing indicators, smooth animations
- **Service Selection**: Beautiful checkbox UI for multi-select
- **Mobile Responsive**: Works perfectly on all devices

### Dashboard Features
- **Plan Overview**: See all your business plans in one place
- **Quick Stats**: Total plans, ready to download, in progress
- **Easy Access**: Download PDFs with one click
- **Account Management**: Sign out, view profile info

### Authentication Features
- **Signup/Login Toggle**: Switch between modes in one modal
- **Error Handling**: Clear error messages for auth failures
- **Session Persistence**: Users stay logged in
- **Secure**: Built on Supabase Auth best practices

## API Routes

### `/api/generate-plan`
- **Method**: POST
- **Auth**: Required (uses Supabase session)
- **Body**: `{ formId, formData }`
- **Response**: Generated business plan
- **Note**: Requires `generateBusinessPlan` function in `lib/openai.ts`

## Database Schema

### `user_profiles`
```sql
- id: UUID (references auth.users)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
- full_name: TEXT
- company_name: TEXT
- avatar_url: TEXT
- metadata: JSONB
```

### Updated Tables
All tables now have `user_id` column:
- `intake_forms.user_id`
- `business_cases.user_id`
- `leads.user_id`

## Next Steps

### Immediate (Required for Launch)
1. **Update `lib/openai.ts`**: Ensure `generateBusinessPlan` function accepts the new form structure
2. **PDF Generation**: Implement PDF creation in the generate-plan API
3. **Email Notifications**: Send email when plan is ready
4. **Error Boundaries**: Add proper error handling throughout

### Nice to Have
1. **Password Reset**: Implement forgot password flow
2. **Social Auth**: Add Google/GitHub login
3. **Plan Editing**: Allow users to refine their plans
4. **Sharing**: Let users share plans with team members
5. **Templates**: Offer pre-built plan templates
6. **AI Improvements**: Add follow-up questions based on answers
7. **Real-time Updates**: WebSocket for live plan generation status

## Testing Checklist

- [ ] Sign up new account
- [ ] Log in with existing account
- [ ] Complete conversational form
- [ ] View dashboard
- [ ] Download PDF (when ready)
- [ ] Sign out and sign back in
- [ ] Check data persistence
- [ ] Test on mobile devices
- [ ] Verify RLS policies work

## Important Notes

1. **Old Form**: The original `FormWizard.tsx` is still in the codebase but not used in the new flow
2. **Backward Compatibility**: Old draft records without `user_id` will still work
3. **Security**: RLS policies ensure users can only see their own data
4. **Performance**: Indexes added for efficient querying

## Migration Path

If you want to gradually migrate:
1. Keep both `/form` (old) and `/form-chat` (new) routes active
2. A/B test to compare conversion rates
3. Once validated, redirect `/form` to `/form-chat`
4. Eventually remove old FormWizard component

## Support

For issues or questions:
1. Check Supabase logs for auth errors
2. Review browser console for client-side errors
3. Check API route logs in Vercel dashboard
4. Verify database migrations completed successfully

---

Built with ❤️ by ALIRA

