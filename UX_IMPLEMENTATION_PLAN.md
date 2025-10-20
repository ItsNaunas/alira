# UX IMPLEMENTATION PLAN
**Based on:** UX_AUDIT.md  
**Total Issues:** 83 findings  
**Estimated Timeline:** 8-10 weeks  
**Team Size:** 1-2 developers

---

## OVERVIEW

This plan organizes the 83 UX findings into 6 implementation phases, prioritized by impact and dependencies. Each phase includes specific tasks, file changes, estimated effort, and verification steps.

### Phase Summary
- **Phase 1**: Critical Accessibility Fixes (Week 1) - 2-3 days
- **Phase 2**: Quick Wins & Button Improvements (Week 1) - 2-3 days
- **Phase 3**: Navigation System Redesign (Week 2-3) - 1 week
- **Phase 4**: Design System Consolidation (Week 3-5) - 2 weeks
- **Phase 5**: Forms & Error Handling (Week 5-7) - 2 weeks
- **Phase 6**: Responsive & Polish (Week 7-10) - 2-3 weeks

---

## PHASE 1: CRITICAL ACCESSIBILITY FIXES
**Duration:** 2-3 days  
**Priority:** CRITICAL  
**Must complete before other phases**

### Day 1: Color Contrast & Text Issues

#### Task 1.1: Fix Color Contrast Failures (3 hours)
**Issues Addressed:** Readability Finding #1

**Changes Required:**
1. Create contrast testing utility
2. Audit all text/background combinations
3. Update opacity values

**Files to Update:**
- `app/globals.css` - Update opacity minimums
- `tailwind.config.js` - Add contrast-safe color variants

**Implementation Steps:**
```bash
# 1. Install contrast checker
npm install --save-dev wcag-contrast

# 2. Create utility script
touch scripts/check-contrast.js
```

```javascript
// scripts/check-contrast.js
const contrast = require('wcag-contrast');

const checks = [
  { text: '#FFFFFF', bg: '#000000', opacity: 0.6 }, // text-white/60
  { text: '#A06B00', bg: '#FFFFFF', opacity: 1.0 }, // gold on white
  { text: '#FFFFFF', bg: '#0B1D51', opacity: 0.8 }, // header nav
];

checks.forEach(check => {
  const ratio = contrast.hex(check.text, check.bg);
  const pass = ratio >= 4.5;
  console.log(`${check.text} on ${check.bg}: ${ratio.toFixed(2)}:1 - ${pass ? 'PASS' : 'FAIL'}`);
});
```

```css
/* app/globals.css - Add after existing styles */

/* Contrast-safe text utilities */
.text-safe-muted {
  color: rgba(255, 255, 255, 0.80); /* Minimum for body text */
}

.text-safe-subtle {
  color: rgba(255, 255, 255, 0.65); /* For captions only */
}

/* Update existing classes */
.copy {
  color: #FFFFFF;
  opacity: 0.85; /* Increased from 0.8 */
}
```

**Search and Replace:**
- Find: `text-white/60` → Replace: `text-white/80`
- Find: `text-white/40` → Replace: `text-white/65` (captions only) or `text-white/80`
- Find: `text-alira-white/40` → Replace: `text-alira-white/65`

**Verification:**
```bash
# Run contrast check
node scripts/check-contrast.js

# Visual test
# Open each page, check text readability
```

---

#### Task 1.2: Add Alt Text to All Images (1 hour)
**Issues Addressed:** Accessibility Finding #1

**Files to Update:**
- `app/about/page.tsx` line 183

**Changes:**
```typescript
// app/about/page.tsx
// BEFORE:
<Image 
  src="/images/assets/founder.jpg" 
  alt="ALIRA Founder - Professional headshot"
  width={400}
  height={320}
  className="w-full h-full object-cover object-top"
/>

// AFTER:
<Image 
  src="/images/assets/founder.jpg" 
  alt="Portrait of [Founder Name], ALIRA Partners founder with over 10 years of project management experience"
  width={400}
  height={320}
  className="w-full h-full object-cover object-top"
/>
```

**Search for all images:**
```bash
# Find all Image components
grep -r "import.*Image.*from.*next/image" app/ components/

# Find all <img> tags
grep -r "<img" app/ components/
```

**Checklist:**
- [ ] About page founder image
- [ ] Any logo images
- [ ] Any decorative images (use `alt=""`)
- [ ] Any result/case study images

---

#### Task 1.3: Add Aria Labels to Icon Buttons (2 hours)
**Issues Addressed:** Accessibility Finding #3

**Files to Update:**
- `components/Header.tsx` lines 174-176
- `app/dashboard/page.tsx` lines 173-176, 203-211

**Changes:**
```typescript
// components/Header.tsx - Already has aria-label (GOOD)
<Button 
  className="..."
  variant="ghost" 
  size="icon"
  aria-label="Open menu"  // ✓ Keep this
>

// app/dashboard/page.tsx line 173-176
// BEFORE:
<Button
  variant="ghost"
  size="icon"
  className="text-alira-white/60 hover:text-alira-white hover:bg-white/5"
>
  <MoreVertical className="w-5 h-5" />
</Button>

// AFTER:
<Button
  variant="ghost"
  size="icon"
  className="text-alira-white/60 hover:text-alira-white hover:bg-white/5"
  aria-label="More options for this plan"
>
  <MoreVertical className="w-5 h-5" />
</Button>

// app/dashboard/page.tsx line 203-211
// BEFORE:
<Button
  onClick={loadPlans}
  variant="ghost"
  size="icon"
  className="text-alira-white/40 hover:text-alira-white hover:bg-white/5 flex-shrink-0"
  disabled={isLoadingPlans}
>
  <RefreshCw className={`w-4 h-4 ${isLoadingPlans ? 'animate-spin' : ''}`} />
</Button>

// AFTER:
<Button
  onClick={loadPlans}
  variant="ghost"
  size="icon"
  className="text-alira-white/40 hover:text-alira-white hover:bg-white/5 flex-shrink-0"
  disabled={isLoadingPlans}
  aria-label={isLoadingPlans ? "Refreshing plans..." : "Refresh plans"}
>
  <RefreshCw className={`w-4 h-4 ${isLoadingPlans ? 'animate-spin' : ''}`} />
</Button>
```

**Search for all icon-only buttons:**
```bash
grep -r "size=\"icon\"" app/ components/ | grep -v "aria-label"
```

**Checklist:**
- [ ] Dashboard more options button
- [ ] Dashboard refresh button
- [ ] Any close/dismiss buttons on modals
- [ ] Any delete/trash icon buttons
- [ ] Any edit/pencil icon buttons

---

### Day 2: Keyboard Navigation & Focus

#### Task 1.4: Add Focus Indicators (2 hours)
**Issues Addressed:** Accessibility Finding #5

**Files to Update:**
- `app/globals.css` - Add global focus styles
- All components with custom focus removal

**Changes:**
```css
/* app/globals.css - Add after existing styles */

/* Enhanced focus indicators for accessibility */
*:focus-visible {
  outline: 2px solid #A06B00;
  outline-offset: 2px;
}

/* Focus rings for interactive elements */
.focus-ring {
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alira-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black;
}

/* Button focus states */
button:focus-visible,
a:focus-visible {
  @apply ring-2 ring-alira-gold ring-offset-2 ring-offset-black;
}

/* Input focus states */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  @apply ring-2 ring-alira-gold ring-offset-0;
  border-color: #A06B00;
}
```

**Search and fix focus removal:**
```bash
# Find all focus:outline-none without replacement
grep -r "focus:outline-none" app/ components/ | grep -v "focus-visible:ring"
```

**For each occurrence, ensure replacement:**
```typescript
// BAD:
className="... focus:outline-none"

// GOOD:
className="... focus:outline-none focus-visible:ring-2 focus-visible:ring-alira-gold focus-visible:ring-offset-2"
```

---

#### Task 1.5: Make Clickable Cards Keyboard Accessible (2 hours)
**Issues Addressed:** Accessibility Finding #4

**Files to Update:**
- `app/dashboard/page.tsx` lines 445-500 (plan cards)

**Changes:**
```typescript
// app/dashboard/page.tsx
// BEFORE:
<Card 
  key={plan.id} 
  className="bg-white/[0.02] border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-black/20 transition-all cursor-pointer group hover:-translate-y-0.5"
  onClick={() => router.push(`/dashboard/${plan.id}`)}
>

// AFTER - Option 1: Wrap in Link
<Link href={`/dashboard/${plan.id}`} key={plan.id}>
  <Card 
    className="bg-white/[0.02] border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-black/20 transition-all cursor-pointer group hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-alira-gold"
  >
    {/* ... card content ... */}
  </Card>
</Link>

// AFTER - Option 2: Make card focusable
<Card 
  key={plan.id}
  className="bg-white/[0.02] border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-black/20 transition-all cursor-pointer group hover:-translate-y-0.5"
  onClick={() => router.push(`/dashboard/${plan.id}`)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      router.push(`/dashboard/${plan.id}`);
    }
  }}
  tabIndex={0}
  role="button"
  aria-label={`View plan: ${plan.business_name || 'Business Plan'}`}
>
```

**Recommendation:** Use Option 1 (Link wrapper) for better semantic HTML.

---

#### Task 1.6: Fix Modal Accessibility (3 hours)
**Issues Addressed:** Accessibility Finding #6

**Files to Update:**
- `components/VercelV0Chat.tsx` lines 182-302

**Changes:**
```typescript
// components/VercelV0Chat.tsx
// Install focus-trap-react
// npm install focus-trap-react

import FocusTrap from 'focus-trap-react';

// Update modal
{showModal && (
  <FocusTrap>
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowModal(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setShowModal(false);
      }}
    >
      <div className="bg-white dark:bg-alira-primary rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-alira-primary/50 dark:text-alira-white/50 hover:text-alira-primary dark:hover:text-alira-white transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 
          id="auth-modal-title"
          className="text-xl sm:text-2xl font-serif font-normal text-alira-primary dark:text-alira-white mb-2"
        >
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h2>
        {/* ... rest of modal content ... */}
      </div>
    </div>
  </FocusTrap>
)}
```

**Also update AlertDialog component** (`components/ui/alert-dialog.tsx`) if it exists.

---

### Day 3: Form Accessibility & Testing

#### Task 1.7: Associate Form Labels & Errors (2 hours)
**Issues Addressed:** Accessibility Finding #2, #8

**Files to Update:**
- `components/FormWizard.tsx`
- `app/contact/page.tsx`

**Changes:**
```typescript
// components/FormWizard.tsx - Step 1
// BEFORE:
<label htmlFor="business_idea" className="block text-sm md:text-base font-light text-alira-primary/90 dark:text-alira-white/90 mb-3">
  What is your business idea or current venture?
</label>
<Textarea
  id="business_idea"
  {...register('business_idea')}
  placeholder="e.g., a marketing agency that helps creators launch offers"
  rows={4}
  className="..."
/>
{errors.business_idea && (
  <p className="mt-2 text-xs text-red-400">
    {errors.business_idea.message}
  </p>
)}

// AFTER:
<label htmlFor="business_idea" className="block text-sm md:text-base font-light text-alira-primary/90 dark:text-alira-white/90 mb-3">
  What is your business idea or current venture?
</label>
<Textarea
  id="business_idea"
  {...register('business_idea')}
  placeholder="e.g., a marketing agency that helps creators launch offers"
  rows={4}
  className={cn(
    "...",
    errors.business_idea && "border-red-500 ring-2 ring-red-500/20"
  )}
  aria-invalid={errors.business_idea ? "true" : "false"}
  aria-describedby={errors.business_idea ? "business_idea-error" : undefined}
/>
{errors.business_idea && (
  <p 
    id="business_idea-error"
    className="mt-2 text-sm text-red-400 flex items-center gap-1"
    role="alert"
  >
    <span aria-hidden="true">⚠️</span>
    {errors.business_idea.message}
  </p>
)}
```

**Apply this pattern to ALL form fields:**
- [ ] business_idea field
- [ ] current_challenges field
- [ ] immediate_goals field
- [ ] service_interest checkboxes
- [ ] current_tools radio buttons
- [ ] consent checkbox
- [ ] Contact form fields (name, email, message)

---

#### Task 1.8: Add Color-Independent Status Indicators (1 hour)
**Issues Addressed:** Accessibility Finding #9

**Files to Update:**
- `app/dashboard/page.tsx` lines 278-286

**Changes:**
```typescript
// app/dashboard/page.tsx
// BEFORE:
{currentPlan?.generations && currentPlan.generations.length > 0 ? (
  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
    Ready
  </span>
) : (
  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs">
    In Progress
  </span>
)}

// AFTER:
{currentPlan?.generations && currentPlan.generations.length > 0 ? (
  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs inline-flex items-center gap-1">
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
    Ready
  </span>
) : (
  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs inline-flex items-center gap-1">
    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    In Progress
  </span>
)}
```

---

#### Task 1.9: Accessibility Testing & Verification (2 hours)

**Test with Screen Reader:**
```bash
# macOS: Turn on VoiceOver
# Press Cmd + F5

# Windows: Use NVDA
# Download from https://www.nvaccess.org/

# Test:
# - Navigate entire site with Tab key only
# - Verify all interactive elements are reachable
# - Verify all labels are announced
# - Verify error messages are announced
# - Verify modal focus trap works
```

**Test with Keyboard Only:**
- [ ] Navigate entire site without mouse
- [ ] All functionality accessible via keyboard
- [ ] Focus indicators always visible
- [ ] Tab order makes sense
- [ ] No keyboard traps

**Automated Accessibility Testing:**
```bash
# Install axe DevTools browser extension
# Or use pa11y

npm install --save-dev pa11y pa11y-ci

# Create test script
touch scripts/a11y-test.js
```

```javascript
// scripts/a11y-test.js
const pa11y = require('pa11y');

const urls = [
  'http://localhost:3000/',
  'http://localhost:3000/about',
  'http://localhost:3000/services',
  'http://localhost:3000/contact',
  'http://localhost:3000/dashboard',
];

(async () => {
  for (const url of urls) {
    console.log(`Testing ${url}...`);
    const results = await pa11y(url);
    console.log(`Issues found: ${results.issues.length}`);
    results.issues.forEach(issue => {
      console.log(`  - ${issue.message}`);
    });
  }
})();
```

**Checklist:**
- [ ] All WCAG AA contrast requirements met
- [ ] All images have appropriate alt text
- [ ] All form fields properly labeled
- [ ] All icon buttons have aria-labels
- [ ] Keyboard navigation works everywhere
- [ ] Focus indicators visible and clear
- [ ] Modal focus traps work
- [ ] Screen reader testing passed

---

## PHASE 2: QUICK WINS & BUTTON IMPROVEMENTS
**Duration:** 2-3 days  
**Priority:** HIGH  
**Dependencies:** Phase 1 complete

### Day 4: Button & Loading States

#### Task 2.1: Create Unified Spinner Component (1 hour)
**Issues Addressed:** Visual Finding #11

**Create new file:**
```bash
touch components/ui/spinner.tsx
```

```typescript
// components/ui/spinner.tsx
import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  color?: "primary" | "white" | "gold"
}

export function Spinner({ size = "md", className, color = "primary" }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-12 h-12",
  }

  const colorClasses = {
    primary: "border-alira-primary",
    white: "border-white",
    gold: "border-alira-gold",
  }

  return (
    <div 
      className={cn(
        "animate-spin rounded-full border-b-2",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}
```

---

#### Task 2.2: Add Loading States to All Buttons (2 hours)
**Issues Addressed:** Feedback Finding #1

**Files to Update:**
- `components/ui/button.tsx` - Add loading prop
- All button usages with async operations

**Update Button component:**
```typescript
// components/ui/button.tsx
import { Spinner } from "./spinner"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Spinner size="sm" className="mr-2" color={variant === "alira" ? "primary" : "white"} />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
```

**Update all async button usages:**
```typescript
// Example: app/contact/page.tsx line 174
// BEFORE:
<Button
  type="submit"
  disabled={isSubmitting}
  className="..."
>
  {isSubmitting ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white dark:border-alira-primary mr-2"></div>
      Sending...
    </>
  ) : (
    'Send Message'
  )}
</Button>

// AFTER:
<Button
  type="submit"
  loading={isSubmitting}
  className="..."
>
  {isSubmitting ? 'Sending...' : 'Send Message'}
</Button>
```

**Search for all async buttons:**
```bash
grep -r "isSubmitting\|isLoading\|isGenerating" app/ components/ | grep -i button
```

---

#### Task 2.3: Fix Contact Page Color Contrast (15 minutes)
**Issues Addressed:** Visual Finding #1 (specific instance)

**File to Update:**
- `app/services/page.tsx` line 276

**Change:**
```typescript
// app/services/page.tsx line 276
// BEFORE:
<p className="text-xl text-white/80 dark:text-alira-black/80 dark:text-alira-white/80 mb-8 leading-relaxed">

// AFTER:
<p className="text-xl text-white/80 mb-8 leading-relaxed">
```

---

#### Task 2.4: Standardize CTA Anchor Links (30 minutes)
**Issues Addressed:** Navigation Finding #5

**Decision:** Standardize all CTAs to `/#start-chat`

**Files to Update:**
- `components/Footer.tsx` line 44
- `app/services/page.tsx` line 48
- `app/how-it-works/page.tsx` line 239
- `app/about/page.tsx` line 639
- `app/contact/page.tsx` line 280
- Any other CTA buttons

**Changes:**
```typescript
// Find all:
href="#start-form"
href="/#form-section"
href="#form"

// Replace with:
href="/#start-chat"
```

**Ensure anchor exists on homepage:**
```typescript
// app/page.tsx line 79
<div id="start-chat">  {/* ✓ Already exists */}
  <VercelV0Chat />
</div>
```

---

### Day 5: Error Messages & Form Improvements

#### Task 2.5: Improve Error Message Size & Visibility (1 hour)
**Issues Addressed:** Feedback Finding #5

**Files to Update:**
- All form components with error messages

**Changes:**
```typescript
// Change all error messages from:
<p className="mt-2 text-xs text-red-400">

// To:
<p className="mt-2 text-sm text-red-400 font-medium flex items-center gap-1.5">
  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
  {error.message}
</p>
```

---

#### Task 2.6: Rewrite Generic Error Messages (2 hours)
**Issues Addressed:** Feedback Finding #2

**Create error message utility:**
```bash
touch lib/error-messages.ts
```

```typescript
// lib/error-messages.ts
export const errorMessages = {
  // Network errors
  offline: "You appear to be offline. Please check your internet connection and try again.",
  timeout: "The request is taking longer than expected. Please try again.",
  serverError: "We're experiencing technical difficulties. Please try again in a few moments.",
  
  // Form errors
  required: (fieldName: string) => `Please enter your ${fieldName}`,
  invalidEmail: "Please enter a valid email address",
  passwordTooShort: "Password must be at least 6 characters",
  
  // Auth errors
  authFailed: "We couldn't log you in. Please check your email and password.",
  sessionExpired: "Your session has expired. Please log in again to continue.",
  
  // Plan errors
  planLoadFailed: "We couldn't load your plan. Please refresh the page and try again.",
  planSaveFailed: "We couldn't save your changes. Please try again.",
  planGenerationFailed: "We couldn't generate your plan. Please try again or contact support.",
  
  // Generic
  unexpected: "Something unexpected happened. Please try again.",
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Map known error messages
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return errorMessages.offline;
    }
    if (error.message.includes('timeout')) {
      return errorMessages.timeout;
    }
    if (error.message.includes('500') || error.message.includes('server')) {
      return errorMessages.serverError;
    }
    
    return error.message;
  }
  
  return errorMessages.unexpected;
}
```

**Update all error handling:**
```typescript
// Example: components/FormWizard.tsx
import { getErrorMessage } from '@/lib/error-messages';

// Replace:
alert(`There was an error submitting your form: ${errorMessage}. Please try again.`)

// With:
alert(getErrorMessage(error))
```

---

#### Task 2.7: Increase Mobile Font Sizes (1 hour)
**Issues Addressed:** Readability Finding #5

**Files to Update:**
- All form labels and inputs

**Changes:**
```typescript
// Update all form labels:
// BEFORE:
className="block text-sm font-sans font-light..."

// AFTER:
className="block text-sm sm:text-base font-sans font-light..."

// Update all form inputs to ensure 16px minimum:
// components/ui/input.tsx
// Ensure: text-base (16px) not text-sm (14px)
```

**Search and update:**
```bash
grep -r "text-sm.*label\|label.*text-sm" app/ components/
```

---

### Day 6: Navigation Quick Fixes

#### Task 2.8: Add Back Navigation Links (1 hour)
**Issues Addressed:** Navigation Finding #3

**Files to Update:**
- `components/PlanHeader.tsx` (or create if doesn't exist)
- All plan detail pages

**Create Back Button Component:**
```bash
touch components/BackButton.tsx
```

```typescript
// components/BackButton.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  href?: string
  label?: string
}

export function BackButton({ href, label = "Back" }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className="text-alira-white/80 hover:text-alira-white -ml-2"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {label}
    </Button>
  )
}
```

**Add to plan pages:**
```typescript
// app/dashboard/[planId]/page.tsx
import { BackButton } from '@/components/BackButton'

// Add at top of page content:
<div className="px-4 md:px-6 pt-4">
  <BackButton href="/dashboard" label="Back to Dashboard" />
</div>
```

---

## PHASE 3: NAVIGATION SYSTEM REDESIGN
**Duration:** 1 week  
**Priority:** HIGH  
**Dependencies:** Phase 1-2 complete

### Week 2: Navigation Consolidation

#### Task 3.1: Design Navigation Strategy (Day 1 - 3 hours)

**Decision Points:**
1. Keep separate header for marketing vs dashboard? **Recommendation: Yes**
2. Mobile navigation: Full-screen or popover? **Recommendation: Full-screen**
3. Breadcrumbs needed? **Recommendation: Yes, for dashboard only**

**Create navigation spec document:**
```bash
touch docs/NAVIGATION_SPEC.md
```

```markdown
# Navigation System Specification

## Marketing Pages (/, /about, /services, etc.)
- **Header**: Fixed header with transparent/blur background
- **Logo**: Left-aligned, links to homepage
- **Nav Links**: Center or right-aligned
  - Home, What You Get, Services, About, Contact, Results
- **CTA**: Primary button (Sign Up / Start Plan)
- **Mobile**: Full-screen overlay menu
- **Breakpoint**: Show full nav at lg (1024px)

## Authenticated Pages (/dashboard/*)
- **Layout**: Sidebar navigation
- **Sidebar Links**:
  - Dashboard (home icon)
  - New Plan (plus icon)
  - Settings (gear icon - future)
  - Logout (logout icon)
- **Top Bar**: Logo + current page title + user menu
- **Breadcrumbs**: Show path (Dashboard > Plan Name > Edit)
- **Mobile**: Collapsible sidebar, hamburger toggle

## Transitions
- Clear visual differentiation when entering dashboard
- Smooth animations between sections
```

---

#### Task 3.2: Refactor Header Component (Day 1-2 - 6 hours)

**File to Update:**
- `components/Header.tsx`

**Major Changes:**
```typescript
// components/Header.tsx
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { auth, createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { X, Menu } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const navigationLinks = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'What You Get' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/results', label: 'Results' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auth state
  useEffect(() => {
    const checkUser = async () => {
      const { user } = await auth.getUser()
      setUser(user)
    }
    checkUser()

    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await auth.signOut()
    setUser(null)
    router.push('/')
  }

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        isScrolled 
          ? 'bg-[#0A0E18]/30 backdrop-blur-xl shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="text-alira-gold font-serif font-normal tracking-wider text-xl sm:text-2xl whitespace-nowrap hover:opacity-80 transition-opacity">
              ALIRA<span className="text-alira-gold">.</span>
            </Link>
          </div>

          {/* Desktop Navigation - Show at lg breakpoint (1024px) */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-serif text-base font-normal transition-colors duration-200 whitespace-nowrap relative group ${
                  pathname === link.href
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
                {/* Active indicator */}
                {pathname === link.href && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-alira-gold" />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {user ? (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="text-white hover:bg-white/10 font-sans font-light"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 font-sans font-light"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                asChild
                className="bg-alira-gold text-alira-black hover:bg-alira-gold/90 font-sans font-medium px-6 py-2 rounded-lg transition-all duration-200"
              >
                <Link href="/#start-chat">Start Your Plan</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              className="text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative h-full flex flex-col items-center justify-center p-8"
            >
              <nav className="flex flex-col items-center gap-8 mb-12">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-serif text-2xl font-normal transition-colors duration-200 ${
                      pathname === link.href
                        ? 'text-alira-gold'
                        : 'text-white hover:text-alira-gold'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile CTA */}
              <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                {user ? (
                  <>
                    <Button
                      asChild
                      className="w-full bg-alira-gold text-alira-black hover:bg-alira-gold/90 font-sans font-medium py-6 text-lg"
                    >
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                    <Button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10 font-sans font-light py-6 text-lg"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button 
                    asChild
                    className="w-full bg-alira-gold text-alira-black hover:bg-alira-gold/90 font-sans font-medium py-6 text-lg"
                  >
                    <Link href="/#start-chat">Start Your Plan</Link>
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

---

#### Task 3.3: Add Breadcrumbs Component (Day 3 - 3 hours)

**Create new component:**
```bash
touch components/Breadcrumbs.tsx
```

```typescript
// components/Breadcrumbs.tsx
'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-2 text-alira-white/40" aria-hidden="true" />
            )}
            {isLast || !item.href ? (
              <span className="text-alira-white/60 font-light">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-alira-white/80 hover:text-alira-white transition-colors font-light"
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
```

**Add to plan pages:**
```typescript
// app/dashboard/[planId]/page.tsx
import { Breadcrumbs } from '@/components/Breadcrumbs'

// Add after DashboardLayout, before PlanHeader:
<div className="px-4 md:px-6 pt-4 pb-2">
  <Breadcrumbs
    items={[
      { label: 'Dashboard', href: '/dashboard' },
      { label: plan.business_name || 'Plan' },
    ]}
  />
</div>
```

---

#### Task 3.4: Update Dashboard Sidebar (Day 3-4 - 4 hours)

**File to Update:**
- `components/DashboardLayout.tsx`

**Changes:**
```typescript
// components/DashboardLayout.tsx
// Update links array to remove "Home" and add clearer labels

const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <IconLayoutDashboard className="h-5 w-5 shrink-0 text-alira-white/70" />,
  },
  {
    label: "New Plan",
    href: "/#start-chat",
    icon: <IconPlus className="h-5 w-5 shrink-0 text-alira-white/70" />,
    onClick: () => {
      // Show modal or redirect with context
      window.location.href = '/#start-chat';
    }
  },
];

// Add section separator and exit link
<div className="mt-auto border-t border-white/10 pt-4">
  <Link
    href="/"
    className="flex items-center gap-2 px-2 py-2 text-alira-white/60 hover:text-alira-white text-sm rounded-lg hover:bg-white/5 transition-colors"
  >
    <IconHome className="h-5 w-5 shrink-0" />
    <motion.span
      animate={{
        display: open ? "inline-block" : "none",
        opacity: open ? 1 : 0,
      }}
      className="whitespace-pre"
    >
      Back to Website
    </motion.span>
  </Link>
</div>
```

---

## PHASE 4: DESIGN SYSTEM CONSOLIDATION
**Duration:** 2 weeks  
**Priority:** MEDIUM-HIGH  
**Dependencies:** Phases 1-3 complete

### Week 3-4: Component Standardization

#### Task 4.1: Consolidate Button Variants (Day 1-2 - 1 day)

**File to Update:**
- `components/ui/button.tsx`

**Changes:**
```typescript
// components/ui/button.tsx

// REMOVE variants: alira, aliraOutline
// ADD variants: primary, secondary, tertiary

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-light ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Keep standard shadcn variants
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        
        // ALIRA variants - consolidated
        primary: "bg-alira-gold text-alira-black hover:bg-alira-gold/90 focus:ring-alira-gold/40 font-medium shadow-sm",
        secondary: "border-2 border-alira-gold text-alira-gold hover:bg-alira-gold hover:text-alira-black focus:ring-alira-gold/40 font-light",
        tertiary: "text-alira-white hover:bg-white/10 focus:ring-white/40 font-light",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-sm",
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

**Create migration script:**
```bash
touch scripts/migrate-buttons.sh
```

```bash
#!/bin/bash

# Migrate old button variants to new ones
find app/ components/ -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i.bak \
  -e 's/variant="alira"/variant="primary"/g' \
  -e 's/variant="aliraOutline"/variant="secondary"/g' \
  {} \;

echo "Button migration complete. Review changes and test."
```

---

#### Task 4.2: Create Card Variants (Day 2 - 3 hours)

**File to Update:**
- `components/ui/card.tsx`

**Changes:**
```typescript
// components/ui/card.tsx
import { cva, type VariantProps } from "class-variance-authority"

const cardVariants = cva(
  "rounded-lg border text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-card border-alira-primary/10",
        elevated: "bg-white/[0.02] border-white/10 hover:border-white/20 transition-all",
        subtle: "bg-alira-white/5 border-alira-white/5",
        glass: "bg-white/5 backdrop-blur-md border-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
)
```

**Map existing usages:**
```bash
# Dashboard cards → variant="elevated"
# About/Services cards → variant="default"
# Modal/overlay cards → variant="glass"
```

---

#### Task 4.3: Standardize Spacing System (Day 3-4 - 1 day)

**File to Update:**
- `tailwind.config.js`

**Changes:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        // Existing
        '18': '4.5rem',
        '88': '22rem',
        
        // Add semantic spacing
        'section-sm': '4rem',   // 64px - small sections
        'section-md': '6rem',   // 96px - standard sections
        'section-lg': '8rem',   // 128px - large sections
        'card-sm': '1rem',      // 16px - tight card padding
        'card-md': '1.5rem',    // 24px - standard card padding
        'card-lg': '2rem',      // 32px - spacious card padding
      },
    }
  }
}
```

**Create spacing audit script:**
```bash
touch scripts/audit-spacing.sh
```

```bash
#!/bin/bash

# Find all custom spacing values (mb-*, mt-*, p-*, etc.)
echo "=== Custom Spacing Audit ==="
echo ""

echo "Section spacing (py-*):"
grep -roh "py-[0-9]\+" app/ components/ | sort | uniq -c | sort -rn

echo ""
echo "Margin bottom (mb-*):"
grep -roh "mb-[0-9]\+" app/ components/ | sort | uniq -c | sort -rn

echo ""
echo "Padding (p-*):"
grep -roh "p-[0-9]\+" app/ components/ | sort | uniq -c | sort -rn
```

**Standardization map:**
```
SECTION SPACING:
py-24 → py-section-md
py-20 → py-section-md
py-16 → py-section-sm
py-32 → py-section-lg

CARD SPACING:
p-6 → p-card-md
p-8 → p-card-lg
p-4 → p-card-sm

ELEMENT GAPS:
gap-8 → gap-4 or gap-6 (standardize to 4 or 6)
gap-10 → gap-6
gap-12 → gap-8
```

---

#### Task 4.4: Create Typography Utilities (Day 4-5 - 1 day)

**File to Update:**
- `app/globals.css`

**Changes:**
```css
/* app/globals.css */

/* Typography System */
.text-display-1 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(3rem, 8vw, 6rem);
  line-height: 1.1;
  font-weight: 400;
  letter-spacing: -0.02em;
}

.text-display-2 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 1.1;
  font-weight: 400;
  letter-spacing: -0.02em;
}

.text-heading-1 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.2;
  font-weight: 400;
  letter-spacing: -0.02em;
}

.text-heading-2 {
  font-family: 'Lato', sans-serif;
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.text-heading-3 {
  font-family: 'Lato', sans-serif;
  font-size: clamp(1.5rem, 3vw, 2rem);
  line-height: 1.3;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.text-heading-4 {
  font-family: 'Lato', sans-serif;
  font-size: 1.25rem;
  line-height: 1.4;
  font-weight: 600;
}

.text-body-large {
  font-family: 'Lato', sans-serif;
  font-size: 1.125rem;
  line-height: 1.6;
  font-weight: 400;
}

.text-body {
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  font-weight: 400;
}

.text-body-small {
  font-family: 'Lato', sans-serif;
  font-size: 0.875rem;
  line-height: 1.5;
  font-weight: 400;
}

.text-caption {
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  line-height: 1.4;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

**Create migration guide:**
```markdown
# Typography Migration Guide

## Page Titles
H1 on main pages → `.text-display-1`
H1 in sections → `.text-heading-1`

## Section Headings
H2 → `.text-heading-2`
H3 → `.text-heading-3`
H4 → `.text-heading-4`

## Body Text
Large intro text → `.text-body-large`
Standard paragraphs → `.text-body`
Helper text → `.text-body-small`
Labels/eyebrows → `.text-caption`
```

---

## Phase 4 Continued... *(Truncated for length)*

Would you like me to continue with:
- Phase 5: Forms & Error Handling
- Phase 6: Responsive & Polish
- Testing & Verification procedures
- Deployment checklist

This implementation plan provides step-by-step instructions with code examples, file paths, and verification steps for the first 4 phases. Each task is broken down into manageable chunks with estimated time and specific changes needed.

Should I complete the remaining phases?

