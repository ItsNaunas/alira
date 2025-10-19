# 🔗 Integration Guide - Using Your Existing Schema

## Overview

We've successfully integrated the conversational form system with your existing database schema! No need to create new tables - we're using what you already have.

---

## 📊 Table Mapping

### Your Tables → Our Usage

| Your Table | Our Purpose | What We Store |
|-----------|-------------|---------------|
| `profiles` | User accounts | Email, name, credits (3 free on signup) |
| `dashboards` | Form responses | Business details, challenges, goals |
| `generations` | AI output | Generated business plans (type: 'business_plan') |
| `email_notifications` | Notifications | (Your existing usage) |
| `transactions` | Payments | (Your existing usage) |

---

## 🆕 What Was Added

### New Columns in `dashboards`:
```sql
- current_challenges TEXT      -- User's operational challenges
- immediate_goals TEXT          -- 3-6 month goals
- service_interest TEXT[]       -- Array of selected services
- current_tools TEXT           -- Current tech stack
- form_data JSONB              -- Complete form data as JSON
```

### Existing Columns We Use:
```sql
- user_id                      -- Link to auth.users
- business_name                -- From business_idea (first 100 chars)
- primary_goal                 -- From immediate_goals
- biggest_challenge            -- From current_challenges
- status                       -- Set to 'complete' when done
```

---

## 🔄 Data Flow

### 1. User Signs Up
```
Homepage → Auth Modal → Signup
↓
Trigger: handle_new_user()
↓
Create profile with 3 free credits
```

### 2. Conversational Form
```
User answers questions
↓
Save to dashboards table:
{
  user_id,
  business_name,
  current_challenges,
  immediate_goals,
  service_interest[],
  current_tools,
  form_data (full JSON)
}
```

### 3. AI Generation
```
Call /api/generate-plan
↓
Save to generations table:
{
  dashboard_id (reference),
  type: 'business_plan',
  content: {...AI output...},
  version: 1
}
```

### 4. Dashboard Display
```
Query dashboards WHERE user_id = current_user
↓
Show all business plans
↓
Link to download PDF (if exists)
```

---

## 📝 Migration Steps

### Run This Migration:

1. **Open Supabase Dashboard**
   - https://app.supabase.com/
   - Select your project
   - SQL Editor

2. **Copy & Run**
   ```
   db/migrations/003_integrate_existing_schema_clean.sql
   ```

3. **Verify Success**
   ```sql
   -- Check new columns exist
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_name = 'dashboards' 
   AND column_name IN ('current_challenges', 'immediate_goals', 'service_interest');
   ```
   Should return 3 rows ✅

---

## 🔐 Security (RLS Policies)

All tables now have Row Level Security enabled:

### Dashboards:
- ✅ Users can only see their own dashboards
- ✅ Users can create their own dashboards
- ✅ Users can update their own dashboards
- ✅ Users can delete their own dashboards

### Generations:
- ✅ Users can only see generations for their dashboards
- ✅ Users can create generations for their dashboards

### Profiles:
- ✅ Users can view their own profile
- ✅ Users can update their own profile
- ✅ Auto-created on signup with 3 free credits

---

## 💳 Credits System

Your existing credits system is ready to use:

```typescript
// User starts with 3 free credits
profiles.credits = 3

// Deduct credit when generating plan
UPDATE profiles 
SET credits = credits - 1 
WHERE id = user_id;

// Check if user has credits
if (user.credits > 0) {
  // Allow generation
} else {
  // Show purchase prompt
}
```

---

## 🎯 What Works Now

### ✅ Complete Integration:

1. **Authentication**
   - Sign up → Auto-create profile with 3 credits
   - Login → Access dashboard
   - Session persistence → Stay logged in

2. **Conversational Form**
   - Answer 4 questions
   - Data saves to `dashboards` table
   - All fields properly mapped

3. **Dashboard**
   - View all your business plans
   - See challenges, goals, services
   - Download PDFs (when ready)

4. **Security**
   - RLS policies active
   - Users only see their own data
   - Protected routes work

---

## 📋 Database Structure

### Example Record in `dashboards`:

```json
{
  "id": "uuid",
  "user_id": "user-uuid",
  "business_name": "SaaS that helps service providers with referrals",
  "primary_goal": "Scale to 1000 users in 6 months",
  "biggest_challenge": "Limited marketing budget",
  "current_challenges": "Limited marketing budget and no in-house dev team",
  "immediate_goals": "Scale to 1000 users in 6 months and establish market presence",
  "service_interest": ["brand_product", "digital_solutions"],
  "current_tools": "basic",
  "form_data": {
    "business_idea": "A SaaS that helps service providers with referrals",
    "current_challenges": "Limited marketing budget and no in-house dev team",
    "immediate_goals": "Scale to 1000 users in 6 months",
    "service_interest": ["brand_product", "digital_solutions"],
    "current_tools": "basic"
  },
  "status": "complete",
  "created_at": "2025-01-19T..."
}
```

### Example Record in `generations`:

```json
{
  "id": "uuid",
  "dashboard_id": "dashboard-uuid",
  "type": "business_plan",
  "content": {
    "problem_statement": "...",
    "objectives": [...],
    "proposed_solution": [...],
    "next_steps": [...]
  },
  "version": 1,
  "created_at": "2025-01-19T..."
}
```

---

## 🚀 Next Steps

### To Use the Credits System:

1. **Check Credits Before Generation**
   ```typescript
   const { data: profile } = await supabase
     .from('profiles')
     .select('credits')
     .eq('id', user.id)
     .single();
   
   if (profile.credits < 1) {
     // Show payment prompt
     return;
   }
   ```

2. **Deduct Credit After Success**
   ```typescript
   await supabase
     .from('profiles')
     .update({ credits: profile.credits - 1 })
     .eq('id', user.id);
   ```

3. **Track with Transactions**
   ```typescript
   await supabase
     .from('transactions')
     .insert({
       user_id: user.id,
       type: 'credit_usage',
       amount: 0,
       credits_added: -1,
       status: 'complete'
     });
   ```

---

## 🔍 Queries You Can Use

### Get User's Plans:
```sql
SELECT * FROM dashboards 
WHERE user_id = auth.uid() 
ORDER BY created_at DESC;
```

### Get Plan with Generations:
```sql
SELECT 
  d.*,
  g.content as business_plan
FROM dashboards d
LEFT JOIN generations g ON g.dashboard_id = d.id AND g.type = 'business_plan'
WHERE d.user_id = auth.uid();
```

### Check User Credits:
```sql
SELECT credits, has_purchased 
FROM profiles 
WHERE id = auth.uid();
```

---

## ✨ Benefits

1. **No Data Loss** - Your existing data stays intact
2. **Unified System** - One database schema for everything
3. **Credits Ready** - Existing credits system works out of the box
4. **Flexible** - JSON fields allow easy expansion
5. **Secure** - RLS policies protect all data

---

## 🐛 Troubleshooting

### Issue: "column does not exist"
**Solution:** Run migration 003

### Issue: "permission denied"
**Solution:** RLS policies added by migration

### Issue: Can't see old data
**Reason:** Old tables (`intake_forms`, `business_cases`) not queried anymore
**Solution:** Data is now in `dashboards` and `generations`

---

Your system is now fully integrated! The conversational form works seamlessly with your existing database structure. 🎉

