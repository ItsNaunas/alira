# 📋 Migration Instructions - Integrate with Existing Schema

## Quick Setup (2 Minutes)

Follow these steps to integrate the conversational form with your existing database.

---

## Step 1: Run the Migration

### Open Supabase SQL Editor

1. Go to **https://app.supabase.com/**
2. Select your project
3. Click **SQL Editor** in left sidebar
4. Click **New query**

### Copy and Run Migration

1. Open `db/migrations/003_integrate_existing_schema.sql` in your code editor
2. Copy **all contents** (Ctrl+A, Ctrl+C)
3. Paste into Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

### Expected Result:
```
NOTICE: Migration completed successfully! Your existing schema has been integrated...
Success. No rows returned
```

If you see this ✅ you're done!

---

## Step 2: Verify Changes

### Check New Columns:

Run this in SQL Editor:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'dashboards' 
AND column_name IN (
  'current_challenges', 
  'immediate_goals', 
  'service_interest', 
  'current_tools', 
  'form_data'
)
ORDER BY column_name;
```

**Should return 5 rows:**
- current_challenges (text)
- current_tools (text)
- form_data (jsonb)
- immediate_goals (text)
- service_interest (ARRAY)

---

## Step 3: Test the System

### 1. Refresh Your Browser
- Hard reload: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)

### 2. Test the Flow:

1. **Go to homepage**
   - http://localhost:3002/

2. **Type a business idea** in chat
   - e.g., "A SaaS for managing client referrals"

3. **Click Send**
   - Auth modal should appear

4. **Sign up** (if new) or **Log in**
   - Fill in details
   - Click "Create Account & Continue"

5. **Should redirect to form-chat**
   - Your idea appears in chat ✅
   - Bot asks about challenges ✅

6. **Complete the questions**
   - Answer challenges
   - Answer goals
   - Select services
   - Click Continue

7. **Check Console** (F12)
   ```
   === FORM COMPLETION STARTED ===
   Attempting to save to database...
   ✅ Saved to database
   ```

8. **Should redirect to dashboard**
   - See your plan listed
   - Can view details

---

## What Got Updated

### Code Changes:

#### `app/form-chat/page.tsx`
- Now saves to `dashboards` table
- Maps form fields to your schema
- Stores complete data in `form_data` JSON field

#### `app/dashboard/page.tsx`
- Queries `dashboards` instead of `intake_forms`
- Displays `business_name`, `current_challenges`, etc.
- Shows service interests as tags

#### `app/api/generate-plan/route.ts`
- Saves AI output to `generations` table
- Links to dashboard via `dashboard_id`
- Uses type: 'business_plan'

#### `db/migrations/003_integrate_existing_schema.sql`
- Adds columns to existing `dashboards` table
- Sets up RLS policies
- Creates auto-profile trigger with 3 free credits

---

## Data Fields Mapping

### Conversational Form → Database

| Form Field | Database Column | Table |
|-----------|----------------|-------|
| business_idea | business_name | dashboards |
| current_challenges | current_challenges | dashboards |
| immediate_goals | immediate_goals | dashboards |
| service_interest | service_interest | dashboards |
| current_tools | current_tools | dashboards |
| *all fields* | form_data | dashboards |
| AI output | content | generations |

---

## Troubleshooting

### ❌ Error: "column current_challenges does not exist"
**Solution:** Migration didn't run
- Double-check you ran 003_integrate_existing_schema.sql
- Verify in Supabase: Table Editor → dashboards → should see new columns

### ❌ Error: "permission denied for table dashboards"
**Solution:** RLS policies issue
- Migration creates policies automatically
- Check: Database → Policies → should see "Users can view own dashboards"

### ❌ Error: "relation profiles does not exist"
**Solution:** Your schema might not be set up yet
- Make sure your original schema is deployed
- Check Table Editor shows: profiles, dashboards, generations

### ✅ Success Signs:

Console shows:
```
✅ Saved to database: {id: "uuid", business_name: "...", ...}
```

Dashboard shows your plan ✅

---

## 🎉 You're Done!

Your conversational form is now fully integrated with your existing database schema. All data flows into your tables, credits system is ready, and everything is secure with RLS policies.

**Test it now:** http://localhost:3002/

---

## Optional: Clean Up

If you want to remove the old migration files we created earlier:
- `db/migrations/002_add_auth.sql` - Not needed anymore (replaced by 003)
- Keep everything else!

The old `intake_forms` and `business_cases` tables can be ignored - we're using your existing schema instead.

