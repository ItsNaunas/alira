# How to Completely Clear Database and Auth

## Why You Can Still Login After "Deleting Everything"

When you delete data from your database, you're typically only deleting from your **custom tables** (public schema). However, Supabase stores authentication data in a **separate auth schema** that requires special access to delete.

Additionally, your browser caches the authentication session in localStorage.

## Complete Cleanup Steps

### Step 1: Clear Browser Cache (Immediate)
**Option A: Sign Out**
- Just click "Sign Out" in your app

**Option B: Clear Browser Storage**
1. Open DevTools (F12)
2. Go to Application/Storage tab
3. Clear Local Storage for your site
4. Clear Session Storage
5. Refresh the page

### Step 2: Clear Supabase Auth Users (Recommended)
**Via Supabase Dashboard:**
1. Go to https://app.supabase.com
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Delete users individually or use the bulk delete option

### Step 3: Clear Custom Tables
**Via SQL Editor in Supabase:**
```sql
-- Clear all custom data (safe - doesn't affect auth)
TRUNCATE public.intake_forms CASCADE;
TRUNCATE public.user_plans CASCADE;
TRUNCATE public.users CASCADE;
```

### Step 4: Clear Auth Tables (Nuclear Option)
**⚠️ WARNING: This requires service role key and deletes ALL users**

You'll need to run this with your **service role key** (not anon key):
```sql
-- This requires elevated permissions
DELETE FROM auth.users;
```

**Better approach via Supabase API:**
```bash
# Using curl with service role key
curl -X DELETE 'https://your-project.supabase.co/auth/v1/admin/users/{user-id}' \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

## Quick Reset Script

For development, create a quick reset:

```typescript
// scripts/reset-dev-db.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE! // Service role, not anon key

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function resetDatabase() {
  // 1. Get all users
  const { data: users } = await supabase.auth.admin.listUsers()
  
  // 2. Delete all users
  if (users?.users) {
    for (const user of users.users) {
      await supabase.auth.admin.deleteUser(user.id)
    }
  }
  
  // 3. Clear tables
  await supabase.from('intake_forms').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('user_plans').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  
  console.log('✅ Database reset complete')
}

resetDatabase()
```

## Why This Happens

Your Supabase setup uses:
- **auth.users** - Managed by Supabase Auth (separate schema)
- **public.users** - Your custom user data (your schema)
- **Browser localStorage** - Cached sessions (client-side)

All three need to be cleared for a complete reset.

## For Production

**NEVER** do this in production! Instead:
- Use proper user management flows
- Implement account deletion features
- Use soft deletes (mark as deleted, don't actually delete)
- Keep audit logs

## Session Configuration

Your app is configured with (in `lib/supabase-client.ts`):
```typescript
auth: {
  autoRefreshToken: true,      // Auto-refresh expired tokens
  persistSession: true,         // Store in localStorage
  detectSessionInUrl: true,     // Handle email confirmation links
}
```

This is why sessions persist even after database deletion - they're cached client-side!

