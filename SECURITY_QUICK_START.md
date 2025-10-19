# 🚀 Security Quick Start Guide

Quick reference for implementing security in new API routes.

## 30-Second Checklist

When creating a **new protected API route**:

1. ✅ Add to `PROTECTED_ROUTES` in `middleware.ts`
2. ✅ Create Zod schema in `lib/server/validation.ts`
3. ✅ Follow the 7-step pattern below
4. ✅ Test authentication (401), authorization (403), validation (400)

---

## Copy-Paste Template

```typescript
/**
 * [Your Feature] API Route (Layer 2 Security)
 * 
 * Protected Route - Requires Authentication
 */

import { NextRequest } from 'next/server'
import { requireUser, verifyOwnership, getServiceClient } from '@/lib/server/auth'
import { YourSchema, validateOrThrow } from '@/lib/server/validation'
import { handleApiError, successResponse, errors } from '@/lib/server/errors'

export async function POST(request: NextRequest) {
  try {
    // Step 1: Authenticate
    const user = await requireUser();
    
    // Step 2: Validate input
    const body = await request.json();
    const validatedData = validateOrThrow(YourSchema, body);
    
    // Step 3: Verify ownership (if accessing existing resource)
    await verifyOwnership('table_name', validatedData.resourceId, user.id);
    
    // Step 4: Business logic
    // ... your code here ...
    
    // Step 5: Database operations
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from('your_table')
      .insert({ ...validatedData, user_id: user.id })
      .select()
      .single();
    
    if (error) {
      throw errors.internal('Failed to create resource');
    }
    
    // Step 6: Return success
    return successResponse({ data });
    
  } catch (error) {
    // Step 7: Handle errors
    return handleApiError(error);
  }
}
```

---

## Common Patterns

### 1. Simple Protected Route (No Resource Ownership)

```typescript
export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const data = validateOrThrow(YourSchema, body);
    
    // Do something...
    const result = await doSomething(data);
    
    return successResponse({ result });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### 2. Protected Route with Ownership Check

```typescript
export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const { resourceId } = validateOrThrow(YourSchema, body);
    
    // Verify user owns the resource
    const resource = await verifyOwnership('resources', resourceId, user.id);
    
    // Do something with the resource...
    
    return successResponse({ resource });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### 3. Protected Route with Purchase Requirement

```typescript
export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    
    // Check if user has purchased access
    await requirePurchase(user.id);
    
    const body = await request.json();
    const data = validateOrThrow(YourSchema, body);
    
    // Premium feature...
    
    return successResponse({ data });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### 4. Public Route with Validation

```typescript
// No authentication required
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = validateOrThrow(ContactFormSchema, body);
    
    // Process public form...
    await sendEmail(data);
    
    return successResponse({ message: 'Email sent' });
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

## Creating Validation Schemas

### Simple Schema

```typescript
// lib/server/validation.ts
export const YourSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  email: validators.email,
  count: z.number().int().positive(),
});

export type YourInput = z.infer<typeof YourSchema>;
```

### Complex Schema

```typescript
export const YourSchema = z.object({
  name: z.string().min(1).max(100),
  email: validators.email,
  preferences: z.object({
    theme: z.enum(['light', 'dark']),
    notifications: z.boolean(),
  }),
  tags: z.array(z.string()).max(10),
  metadata: z.record(z.any()).optional(),
});
```

---

## Error Handling

### Throw Errors

```typescript
import { errors } from '@/lib/server/errors';

// Authentication error (401)
throw errors.unauthorized('Must be logged in');

// Authorization error (403)
throw errors.forbidden('No permission');

// Not found (404)
throw errors.notFound('Dashboard');

// Bad request (400)
throw errors.badRequest('Invalid input');

// Payment required (402)
throw errors.paymentRequired('Purchase needed');

// Conflict (409)
throw errors.conflict('Already exists');

// Internal error (500)
throw errors.internal('Something went wrong');
```

### Custom Errors

```typescript
import { AppError } from '@/lib/server/errors';

throw new AppError('Custom message', 418, 'CUSTOM_CODE');
```

---

## Middleware Configuration

Add protected routes to `middleware.ts`:

```typescript
const PROTECTED_ROUTES = [
  '/dashboard',
  '/your-new-route',           // ← Add here
  '/api/your-new-api',          // ← Add here
] as const;
```

---

## Database Operations

### Using Service Client (Admin Access)

```typescript
const supabase = getServiceClient();

// Insert with user_id
const { data, error } = await supabase
  .from('your_table')
  .insert({
    ...validatedData,
    user_id: user.id,  // Always associate with user
  })
  .select()
  .single();
```

### Verify Ownership Before Update

```typescript
const resource = await verifyOwnership('resources', resourceId, user.id);

const { error } = await supabase
  .from('resources')
  .update({ status: 'updated' })
  .eq('id', resourceId)
  .eq('user_id', user.id);  // Extra safety check
```

---

## Testing Your Route

### Test 1: Unauthenticated Access (should return 401)

```bash
curl -X POST http://localhost:3000/api/your-route \
  -H "Content-Type: application/json" \
  -d '{"field": "value"}'
```

Expected: `{ "success": false, "error": "Authentication required", "code": "UNAUTHORIZED" }`

### Test 2: Invalid Input (should return 400)

```bash
curl -X POST http://localhost:3000/api/your-route \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -d '{"field": ""}'  # Invalid empty field
```

Expected: `{ "success": false, "error": "Validation failed: ...", "code": "VALIDATION_ERROR" }`

### Test 3: Unauthorized Access (should return 403)

```bash
# Login as User A, try to access User B's resource
curl -X POST http://localhost:3000/api/your-route \
  -H "Content-Type: application/json" \
  -H "Cookie: user-a-cookie" \
  -d '{"resourceId": "user-b-resource-id"}'
```

Expected: `{ "success": false, "error": "You do not have permission...", "code": "FORBIDDEN" }`

### Test 4: Valid Request (should return 200)

```bash
curl -X POST http://localhost:3000/api/your-route \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -d '{"field": "valid value"}'
```

Expected: `{ "success": true, "data": {...} }`

---

## Common Mistakes to Avoid

### ❌ DON'T

```typescript
// Don't trust client-provided user IDs
const { userId } = await request.json();
await db.getUser(userId); // ❌ NEVER DO THIS

// Don't skip validation
const body = await request.json();
await db.insert(body); // ❌ NO VALIDATION

// Don't expose errors
catch (error) {
  return NextResponse.json({ error: error.stack }); // ❌ LEAKS INFO
}

// Don't skip ownership checks
const { resourceId } = await request.json();
const resource = await db.get(resourceId); // ❌ NO OWNERSHIP CHECK
```

### ✅ DO

```typescript
// Get user from session
const user = await requireUser(); // ✅
await db.getUser(user.id);

// Validate input
const body = await request.json();
const validated = validateOrThrow(Schema, body); // ✅
await db.insert(validated);

// Use centralized error handling
catch (error) {
  return handleApiError(error); // ✅ SAFE
}

// Always check ownership
const user = await requireUser();
const resource = await verifyOwnership('table', resourceId, user.id); // ✅
```

---

## Quick Reference: Import Statements

```typescript
// Always need these for protected routes
import { NextRequest } from 'next/server'
import { requireUser, getServiceClient } from '@/lib/server/auth'
import { handleApiError, successResponse } from '@/lib/server/errors'
import { YourSchema, validateOrThrow } from '@/lib/server/validation'

// Optional: For ownership checks
import { verifyOwnership, requireOwnership } from '@/lib/server/auth'

// Optional: For custom errors
import { errors, AppError } from '@/lib/server/errors'

// Optional: For purchase checks
import { requirePurchase } from '@/lib/server/auth'
```

---

## Environment Variables Required

```bash
# Authentication
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key  # Server-side only!

# Development mode (optional)
NEXT_PUBLIC_DEV_MODE=true  # Bypasses payment checks
```

---

## Need Help?

1. **Full Documentation:** See `SECURITY.md`
2. **Audit Report:** See `AUDIT_REPORT.md`
3. **Example Routes:** Check `app/api/contact/route.ts` or `app/api/generate-plan/route.ts`

---

**Remember:** Security is not optional. Follow this pattern for EVERY protected route! 🔒

