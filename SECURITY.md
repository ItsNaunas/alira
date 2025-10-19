# 🔒 Security Implementation Guide

This document describes the comprehensive security architecture implemented for the ALIRA application.

## Overview

The security implementation follows a **defense-in-depth** approach with three complementary layers:

1. **Layer 1: Middleware Protection** (Route-Level)
2. **Layer 2: API Route Security** (Request-Level)
3. **Layer 3: Database Security** (Data-Level)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Request                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: Middleware (middleware.ts)                       │
│  ✓ Route-level authentication                               │
│  ✓ Allow-list pattern                                       │
│  ✓ Fail-secure redirects                                    │
│  ✓ Edge Runtime                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2: API Route Security                               │
│  ✓ requireUser() - Authentication                           │
│  ✓ validateOrThrow() - Input validation                    │
│  ✓ requireOwnership() - Authorization                       │
│  ✓ handleApiError() - Safe error handling                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3: Database Security (Supabase)                     │
│  ✓ Row Level Security (RLS) policies                        │
│  ✓ Service role restricted to server                        │
│  ✓ User context enforcement                                 │
└─────────────────────────────────────────────────────────────┘
```

## Layer 1: Middleware Protection

**File:** `middleware.ts`

### Features

- **Allow-List Pattern**: Explicitly defined protected routes
- **Automatic Session Refresh**: Keeps user sessions up to date
- **Fail-Secure**: Redirects on authentication failure
- **Edge Runtime**: Fast execution on Vercel Edge

### Protected Routes

```typescript
const PROTECTED_ROUTES = [
  '/dashboard',
  '/form-chat',
  '/results',
  '/api/generate',
  '/api/draft/create',
  '/api/draft/save',
  '/api/draft/submit',
  '/api/draft/submit-enhanced',
  '/api/generate-plan',
  '/api/ai/generate',
]
```

### Adding New Protected Routes

1. Add route to `PROTECTED_ROUTES` array in `middleware.ts`
2. Ensure the route has Layer 2 security (see below)

### Example

```typescript
// middleware.ts checks authentication
if (requiresAuth && (!user || error)) {
  if (pathname.startsWith('/api/')) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }
  return NextResponse.redirect(new URL('/', request.url));
}
```

## Layer 2: API Route Security

**Files:** 
- `lib/server/auth.ts`
- `lib/server/validation.ts`
- `lib/server/errors.ts`

### Standardized 9-Step Security Pattern

Every protected API route follows this pattern:

```typescript
import { NextRequest } from 'next/server'
import { requireUser, verifyOwnership } from '@/lib/server/auth'
import { YourSchema, validateOrThrow } from '@/lib/server/validation'
import { handleApiError, successResponse } from '@/lib/server/errors'

export async function POST(request: NextRequest) {
  try {
    // Step 1: Authenticate user
    const user = await requireUser();
    
    // Step 2: Parse and validate input
    const body = await request.json();
    const validatedData = validateOrThrow(YourSchema, body);
    
    // Step 3: Authorization - verify ownership if accessing resources
    await verifyOwnership('table_name', resourceId, user.id);
    
    // Step 4: Business logic
    // ... your business logic here ...
    
    // Step 5: Database operations
    // ... database queries ...
    
    // Step 6: Return success response
    return successResponse({ data: result });
    
  } catch (error) {
    // Step 7: Centralized error handling
    return handleApiError(error);
  }
}
```

### Authentication Functions

#### `getUser(req?)`
Returns the authenticated user or `null` if not authenticated.

```typescript
const user = await getUser();
if (!user) {
  // Handle unauthenticated state
}
```

#### `requireUser(req?)`
Returns the authenticated user or throws a 401 error.

```typescript
const user = await requireUser();
// User is guaranteed to exist here
```

#### `requireOwnership(userId, resourceUserId, resourceName?)`
Throws a 403 error if the user doesn't own the resource.

```typescript
const user = await requireUser();
requireOwnership(user.id, dashboard.user_id, 'Dashboard');
```

#### `verifyOwnership(table, resourceId, userId, resourceName?)`
Fetches a resource and verifies ownership in one step.

```typescript
const dashboard = await verifyOwnership(
  'dashboards',
  dashboardId,
  user.id,
  'Dashboard'
);
```

#### `requirePurchase(userId)`
Throws a 402 error if the user hasn't purchased access.

```typescript
await requirePurchase(user.id);
// Can be bypassed with NEXT_PUBLIC_DEV_MODE=true
```

### Input Validation

All input validation uses **Zod schemas** defined in `lib/server/validation.ts`.

#### Available Schemas

- `GenerateInputSchema` - AI generation requests
- `CreateCheckoutSessionSchema` - Checkout sessions
- `BuyCreditsSchema` - Credit purchases
- `CreateDashboardSchema` - Dashboard creation
- `ContactFormSchema` - Contact form submissions
- `CreateDraftSchema` - Draft creation
- `SubmitDraftSchema` - Draft submissions
- `SaveDraftSchema` - Draft saving
- `GeneratePlanSchema` - Plan generation

#### Creating New Validation Schemas

```typescript
// lib/server/validation.ts
export const YourNewSchema = z.object({
  field: z.string().min(1, 'Field is required'),
  email: validators.email,
  amount: z.number().positive(),
});

export type YourNewInput = z.infer<typeof YourNewSchema>;
```

#### Using Validation

```typescript
import { YourNewSchema, validateOrThrow } from '@/lib/server/validation';

const validatedData = validateOrThrow(YourNewSchema, body);
// validatedData is now typed and validated
```

### Error Handling

All errors are handled by the centralized error handler.

#### Error Factory Functions

```typescript
import { errors } from '@/lib/server/errors';

throw errors.unauthorized('Custom message');
throw errors.forbidden('No permission');
throw errors.notFound('Resource');
throw errors.badRequest('Invalid input');
throw errors.paymentRequired('Purchase required');
throw errors.conflict('Resource exists');
throw errors.tooManyRequests('Rate limited');
throw errors.internal('Server error');
```

#### Custom Errors

```typescript
import { AppError } from '@/lib/server/errors';

throw new AppError('Custom error message', 418, 'CUSTOM_CODE');
```

#### Error Response Format

```json
{
  "success": false,
  "error": "User-friendly error message",
  "code": "ERROR_CODE"
}
```

**Important:** Stack traces and sensitive details are NEVER exposed to clients in production.

## Layer 3: Database Security

**Platform:** Supabase with Row Level Security (RLS)

### RLS Policies

All tables have RLS enabled with policies that enforce:

1. **Users can only read their own data**
2. **Users can only modify their own data**
3. **Service role bypasses RLS for admin operations**

### Service Role Key

The service role key provides admin access to bypass RLS:

- **NEVER** expose to client-side code
- **ONLY** import in `lib/server/` files
- Used by `getServiceClient()` function

### Example RLS Policies

```sql
-- Users can only read their own dashboards
CREATE POLICY "Users can view own dashboards"
  ON dashboards FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only update their own dashboards
CREATE POLICY "Users can update own dashboards"
  ON dashboards FOR UPDATE
  USING (auth.uid() = user_id);
```

## Security Checklist for New Features

When adding a new protected feature:

- [ ] Add route to `PROTECTED_ROUTES` in `middleware.ts`
- [ ] Create Zod validation schema in `lib/server/validation.ts`
- [ ] Use `requireUser()` to authenticate
- [ ] Use `validateOrThrow()` to validate input
- [ ] Use `requireOwnership()` or `verifyOwnership()` for resources
- [ ] Use `getServiceClient()` for database operations
- [ ] Use `successResponse()` for success
- [ ] Use `handleApiError()` for errors
- [ ] Create/update RLS policies in Supabase
- [ ] Test authentication failure (401)
- [ ] Test authorization failure (403)
- [ ] Test validation failure (400)
- [ ] Never log sensitive data
- [ ] Never expose error details in production

## Vulnerabilities Prevented

✅ **Authorization Bypass** - Multi-layer ownership verification  
✅ **Injection Attacks** - Zod validation on all inputs  
✅ **Information Leakage** - Centralized error handling  
✅ **Unauthorized Access** - Middleware + API auth checks  
✅ **IDOR** - UUID validation + ownership checks  
✅ **Mass Assignment** - Explicit schema validation  
✅ **Session Hijacking** - HTTP-only cookies via Supabase  
✅ **CSRF** - SameSite cookie attributes  
✅ **XSS** - React automatic escaping + CSP headers  

## Development Mode

For development convenience, set:

```bash
NEXT_PUBLIC_DEV_MODE=true
```

This bypasses:
- Payment requirement checks (`requirePurchase`)

**WARNING:** Never use in production!

## Best Practices

### DO ✅

- Always use server-side utilities in `lib/server/`
- Validate all inputs with Zod schemas
- Use `requireUser()` for protected routes
- Check ownership with `requireOwnership()`
- Return success with `successResponse()`
- Handle errors with `handleApiError()`
- Log errors server-side for debugging
- Use typed schemas for type safety

### DON'T ❌

- Import service role key in client code
- Trust client-provided user IDs without verification
- Return stack traces to clients
- Skip input validation
- Expose detailed error messages in production
- Log sensitive user data
- Hardcode credentials
- Bypass RLS policies unnecessarily

## Testing Security

### Manual Testing

1. **Test unauthenticated access:**
   ```bash
   curl -X POST http://localhost:3000/api/generate-plan \
     -H "Content-Type: application/json" \
     -d '{"answers": {}}'
   # Should return 401
   ```

2. **Test unauthorized access:**
   - Login as User A
   - Try to access User B's resource
   - Should return 403

3. **Test invalid input:**
   ```bash
   curl -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -d '{"name": "", "email": "invalid"}'
   # Should return 400 with validation errors
   ```

### Automated Testing

Consider adding:
- Unit tests for auth utilities
- Integration tests for API routes
- E2E tests for auth flows

## Incident Response

If you discover a security vulnerability:

1. **DO NOT** create a public issue
2. Contact the security team immediately
3. Provide detailed reproduction steps
4. Allow time for a fix before disclosure

## Further Reading

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#security)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Last Updated:** October 2025  
**Version:** 1.0.0

