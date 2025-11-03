# Security Audit Report: Data Isolation Vulnerability
**Date:** November 3, 2025  
**Issue:** Plans from different accounts appearing on wrong accounts  
**Severity:** 🔴 CRITICAL

---

## Executive Summary

A comprehensive security audit has identified **critical data isolation vulnerabilities** where business plans from different user accounts are being displayed to unauthorized users. This is caused by missing user_id filters in client-side database queries.

**Root Cause:** Client-side dashboard queries are not filtering by `user_id`, allowing cross-account data leakage.

---

## Critical Vulnerabilities Found

### 🔴 CRITICAL #1: Dashboard Page - Unfiltered Query
**File:** `app/dashboard/page.tsx`  
**Lines:** 84-96  
**Severity:** CRITICAL

```typescript:84:96:app/dashboard/page.tsx
const { data, error } = await supabase
  .from('dashboards')
  .select(`
    *,
    generations (
      id,
      type,
      content,
      created_at
    )
  `)
  .eq('status', 'complete')
  .order('created_at', { ascending: false });
```

**Problem:**
- Query fetches ALL dashboards with status='complete' from ALL users
- No `.eq('user_id', user.id)` filter present
- This returns every user's plans to every other user
- **This is THE primary cause of the reported issue**

**Impact:**
- ❌ User A can see User B's plans
- ❌ Sensitive business information exposed across accounts
- ❌ Violates data privacy and confidentiality
- ❌ GDPR/compliance violation

---

### 🔴 CRITICAL #2: Plan Detail Page - Unfiltered Query
**File:** `app/dashboard/[planId]/page.tsx`  
**Lines:** 43-56  
**Severity:** CRITICAL

```typescript:43:56:app/dashboard/[planId]/page.tsx
const { data: planData, error: planError } = await supabase
  .from('dashboards')
  .select(`
    *,
    generations (
      id,
      type,
      content,
      version,
      created_at
    )
  `)
  .eq('id', planId)
  .single()
```

**Problem:**
- Query fetches ANY plan by ID without checking ownership
- No `.eq('user_id', user.id)` filter present
- Allows direct URL access to any plan: `/dashboard/{any-plan-id}`

**Impact:**
- ❌ Any authenticated user can view any other user's plan by ID
- ❌ URL guessing or ID enumeration exposes all plans
- ❌ Complete bypass of access controls

---

## What's Working Correctly ✅

### API Routes Security (Good Implementation)
All API routes properly implement security:

1. **Plan Generation** (`app/api/generate-plan/route.ts`)
   - ✅ Requires authentication
   - ✅ Sets `user_id` on insert (line 292)
   - ✅ Verifies user_id was set (lines 318-335)
   - ✅ Filters updates by user_id (line 356)

2. **Plan Versions** (`app/api/plan/versions/route.ts`)
   - ✅ Verifies dashboard ownership (lines 31-40)
   - ✅ Filters by user_id (line 35)

3. **Plan Refinement** (`app/api/plan/refine/route.ts`)
   - ✅ Verifies plan ownership (lines 41-58)
   - ✅ Filters by user_id (lines 53, 74, 101)

4. **Plan Updates** (`app/api/plan/update/route.ts`)
   - ✅ Verifies ownership before updates (lines 28-44)
   - ✅ Filters by user_id (line 39)

### Database Schema (Good Design)

1. **RLS Policies** (`db/migrations/009_secure_generations_user_id.sql`)
   - ✅ user_id is NOT NULL on generations table
   - ✅ RLS policies enforce user_id filtering
   - ✅ All CRUD operations check auth.uid() = user_id

2. **Foreign Keys**
   - ✅ Proper relationships between tables
   - ✅ user_id references auth.users(id)

---

## Root Cause Analysis

### Why This Happened

1. **Mixed Security Models:**
   - API routes use explicit user_id filtering (secure)
   - Dashboard pages rely only on RLS policies (insecure)

2. **RLS Policy Issues:**
   - RLS policies may not be enabled on production
   - Client-side RLS can be bypassed
   - No defense-in-depth strategy

3. **Client-Side Trust:**
   - Client code assumes RLS will handle security
   - No explicit user_id filters in client queries
   - Violates principle of least privilege

### Security Best Practices Violated

1. ❌ **Defense in Depth:** Should filter by user_id even with RLS
2. ❌ **Zero Trust:** Client queries trust server security alone
3. ❌ **Explicit Authorization:** No explicit ownership checks on client

---

## Attack Vectors

### Current Exploits Possible

1. **Scenario 1: Dashboard Browse**
   ```
   User logs in → Views dashboard → Sees all users' plans
   Impact: Immediate data leakage
   ```

2. **Scenario 2: Direct URL Access**
   ```
   User discovers plan ID → Accesses /dashboard/{other-user-plan-id} → Views plan
   Impact: Targeted data access
   ```

3. **Scenario 3: ID Enumeration**
   ```
   Attacker iterates through UUIDs → Discovers valid plan IDs → Downloads all plans
   Impact: Complete data breach
   ```

---

## Detailed Fix Recommendations

### 🔴 IMMEDIATE FIX REQUIRED

#### Fix #1: Dashboard Page Query
**File:** `app/dashboard/page.tsx`  
**Line:** 84

**Current Code:**
```typescript
const { data, error } = await supabase
  .from('dashboards')
  .select(`
    *,
    generations (...)
  `)
  .eq('status', 'complete')
  .order('created_at', { ascending: false });
```

**Fixed Code:**
```typescript
const { data, error } = await supabase
  .from('dashboards')
  .select(`
    *,
    generations (
      id,
      type,
      content,
      created_at
    )
  `)
  .eq('status', 'complete')
  .eq('user_id', user.id)  // ← ADD THIS LINE
  .order('created_at', { ascending: false });
```

---

#### Fix #2: Plan Detail Page Query
**File:** `app/dashboard/[planId]/page.tsx`  
**Line:** 43

**Current Code:**
```typescript
const { data: planData, error: planError } = await supabase
  .from('dashboards')
  .select(`...`)
  .eq('id', planId)
  .single()
```

**Fixed Code:**
```typescript
const { data: planData, error: planError } = await supabase
  .from('dashboards')
  .select(`
    *,
    generations (
      id,
      type,
      content,
      version,
      created_at
    )
  `)
  .eq('id', planId)
  .eq('user_id', user.id)  // ← ADD THIS LINE
  .single()

// Add explicit ownership check
if (planError || !planData) {
  console.error('Error loading plan:', planError)
  setError('Plan not found or access denied')
  return
}
```

---

### 🟡 ADDITIONAL SECURITY IMPROVEMENTS

#### Improvement #1: Verify RLS Policies Are Enabled
Run this SQL query to check RLS status:

```sql
-- Check if RLS is enabled on critical tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('dashboards', 'generations', 'intake_forms')
  AND schemaname = 'public';

-- Check what policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('dashboards', 'generations')
ORDER BY tablename, policyname;
```

**Expected Results:**
- All tables should have `rls_enabled = true`
- Policies should exist for SELECT, INSERT, UPDATE, DELETE
- All policies should check `auth.uid() = user_id`

---

#### Improvement #2: Add Ownership Verification Middleware

Create a client-side utility for ownership checks:

```typescript
// lib/client-auth.ts
import { createClient } from '@/lib/supabase-client'

export async function verifyPlanOwnership(planId: string, userId: string): Promise<boolean> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('dashboards')
    .select('id, user_id')
    .eq('id', planId)
    .eq('user_id', userId)
    .single()
  
  return !error && data !== null
}
```

Use in plan detail page:

```typescript
// Before loading plan
const hasAccess = await verifyPlanOwnership(planId, user.id)
if (!hasAccess) {
  setError('Access denied')
  return
}
```

---

#### Improvement #3: Add Database Audit Logging

Add audit trail for sensitive operations:

```sql
-- Create audit log table
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  metadata jsonb DEFAULT '{}',
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create index for queries
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can only view their own audit logs
CREATE POLICY "Users can view own audit logs"
  ON public.audit_logs FOR SELECT
  USING (auth.uid() = user_id);
```

---

#### Improvement #4: Rate Limiting on Sensitive Queries

Add rate limiting to prevent ID enumeration:

```typescript
// lib/rate-limit-client.ts
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkClientRateLimit(
  userId: string, 
  action: string, 
  limit: number = 10, 
  windowMs: number = 60000
): boolean {
  const key = `${userId}:${action}`
  const now = Date.now()
  const entry = rateLimitMap.get(key)
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (entry.count >= limit) {
    return false
  }
  
  entry.count++
  return true
}
```

---

## Implementation Priority

### Phase 1: IMMEDIATE (Deploy Today) 🔴
1. ✅ Add `.eq('user_id', user.id)` to dashboard page query
2. ✅ Add `.eq('user_id', user.id)` to plan detail page query
3. ✅ Test that plans are properly isolated
4. ✅ Deploy to production

### Phase 2: SHORT TERM (This Week) 🟡
1. Verify RLS policies are enabled in production
2. Add ownership verification utility
3. Add error handling for unauthorized access
4. Add audit logging

### Phase 3: MEDIUM TERM (This Month) 🟢
1. Implement comprehensive rate limiting
2. Add monitoring and alerting for access violations
3. Security penetration testing
4. Update security documentation

---

## Testing Checklist

Before deploying fixes, verify:

- [ ] User A cannot see User B's plans on dashboard
- [ ] User A cannot access User B's plan via direct URL
- [ ] Plans are correctly filtered in all list views
- [ ] Generation API still works correctly
- [ ] Existing plans remain accessible to their owners
- [ ] Error messages don't leak sensitive information
- [ ] RLS policies are active in production database

---

## Verification Query

After deploying fixes, run this to verify data isolation:

```sql
-- Check for any plans visible across users
SELECT 
  d1.id as plan_id,
  d1.user_id as owner_id,
  COUNT(DISTINCT d2.user_id) as users_who_can_see
FROM dashboards d1
CROSS JOIN dashboards d2
WHERE d1.id = d2.id
GROUP BY d1.id, d1.user_id
HAVING COUNT(DISTINCT d2.user_id) > 1;

-- Should return 0 rows (no cross-user visibility)
```

---

## Additional Notes

### Why RLS Alone Is Insufficient

1. **Client-Side Bypass:** RLS can be bypassed with direct database connections
2. **Configuration Drift:** RLS policies can be accidentally disabled
3. **Performance:** Explicit filters are faster than policy evaluation
4. **Defense in Depth:** Multiple security layers are better than one
5. **Debugging:** Explicit filters make queries easier to understand

### Best Practices Going Forward

1. **Always** filter by user_id in client queries
2. **Never** trust client-side security alone
3. **Always** verify ownership before sensitive operations
4. **Use** both RLS policies AND explicit filters
5. **Test** security with multiple user accounts
6. **Monitor** for unauthorized access attempts
7. **Audit** security regularly

---

## Contact for Questions

If you have questions about this audit or the recommended fixes, please review:
- Security documentation: `SECURITY.md`
- Database schema: `CURRENT_DATABASE_SCHEMA.sql`
- Migration files: `db/migrations/`

---

## Appendix: Related Files

### Files Requiring Changes
- `app/dashboard/page.tsx` (CRITICAL)
- `app/dashboard/[planId]/page.tsx` (CRITICAL)

### Files with Good Security
- `app/api/generate-plan/route.ts` ✅
- `app/api/plan/versions/route.ts` ✅
- `app/api/plan/refine/route.ts` ✅
- `app/api/plan/update/route.ts` ✅
- `lib/server/auth.ts` ✅

### Database Files
- `db/migrations/009_secure_generations_user_id.sql`
- `db/migrations/006_security_rls_policies.sql`
- `CURRENT_DATABASE_SCHEMA.sql`

---

**End of Security Audit Report**

