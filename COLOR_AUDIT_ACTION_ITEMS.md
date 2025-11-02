# Color Audit - Action Items Summary

Based on the color audit report, here are the specific changes needed:

## ✅ Already Fixed
- `lib/fonts.ts` - No undefined tokens found (alira-onyx, alira-porcelain were already removed)
- `app/contact/page.tsx` - Already uses semantic tokens (`bg-bg-page`, `text-text-primary`)
- `app/results/page.tsx` - Already uses semantic tokens
- `app/about/page.tsx` - Already uses semantic tokens

## 🔴 CRITICAL FIXES NEEDED (Priority 1)

### 1. Fix Brand Color - **MOST IMPORTANT**
**Issue:** Brand color is `#0B1D51` (dark navy) but should be `#0a66ff` (gradient blue)

**File:** `app/globals.css`
**Line 837:** Change:
```css
--brand: #0B1D51;  /* ❌ WRONG - dark navy */
```
To:
```css
--brand: #0a66ff;  /* ✅ CORRECT - gradient blue */
```

**Also update brand-hover:**
**Line 838:** Change:
```css
--brand-hover: #081640;  /* ❌ WRONG */
```
To:
```css
--brand-hover: #0852cc;  /* ✅ CORRECT - darker shade of blue */
```

**Impact:** This will make all brand colors match the gradient blue used throughout the site.

---

### 2. Fix CTA Section Background Colors
**Issue:** CTA sections use `from-alira-primary` instead of `from-brand`

**Files to fix:**
- `app/contact/page.tsx` (line 266): `from-alira-primary` → `from-brand`
- `app/results/page.tsx`: Check for `alira-primary` usage
- `app/about/page.tsx`: Check for `alira-primary` usage

**Example fix:**
```tsx
// Before:
className="bg-gradient-to-br from-alira-primary to-alira-primary/90"

// After:
className="bg-gradient-to-br from-brand to-brand/90"
```

---

### 3. Fix `text-white` in CTA Sections
**Issue:** CTA sections use `text-white` instead of `text-text-inverse`

**Files:** 
- Check all pages with CTA sections for `text-white` → replace with `text-text-inverse`

---

## 🟡 HIGH PRIORITY FIXES (Priority 2)

### 4. Migrate Dashboard Pages
**Issue:** Dashboard uses dark theme (`bg-black`, `text-alira-white`) while rest of site uses light theme

**Files:**
- `app/dashboard/page.tsx`
- `app/dashboard/[planId]/page.tsx`
- `app/dashboard/[planId]/edit/page.tsx`
- `app/dashboard/[planId]/refine/page.tsx`
- `components/DashboardLayout.tsx`

**Decision needed:** 
- Option A: Keep dashboard dark theme (create dark semantic tokens)
- Option B: Migrate dashboard to light theme (recommended for consistency)

**If migrating to light:**
- Replace `bg-black` → `bg-bg-page`
- Replace `text-alira-white` → `text-text-primary`
- Replace `bg-white` → `bg-surface`
- Replace `border-white/10` → `border-borderToken-subtle`

---

### 5. Migrate Form Pages
**Issue:** Form pages may still use legacy tokens

**Files to check:**
- `app/form/page.tsx`
- `app/form-chat/page.tsx`

**Replace:**
- `bg-black` → `bg-bg-page`
- `text-alira-white` → `text-text-primary`
- `bg-white` → `bg-surface`

---

### 6. Standardize Border Colors
**Issue:** Mixed usage of `border-white/10` vs `border-borderToken-subtle`

**Replace everywhere:**
- `border-white/10` → `border-borderToken-subtle`
- `border-white/20` → `border-accent` or `border-borderToken-strong`

**Files affected:** All dashboard pages, some component files

---

## 🟢 MEDIUM PRIORITY (Priority 3)

### 7. Replace Legacy Gold Tokens
**Issue:** Some places use `text-alira-gold` / `bg-alira-gold` instead of semantic tokens

**Replace:**
- `text-alira-gold` → `text-accent`
- `bg-alira-gold` → `bg-accent`

**Note:** `alira-gold` is still acceptable for accent elements, but semantic `accent` is preferred.

---

### 8. Remove Hardcoded Colors
**Issue:** 121 hardcoded color values found

**Most common locations:**
- `app/globals.css` - CSS utilities with hardcoded hex colors
- Component inline styles
- `components/ui/gradient-bars.tsx` - Has hardcoded `#0B1D51`

**Action:** Replace with CSS variables or semantic tokens where possible

---

## 📋 Quick Reference: Token Migration Map

| Legacy/Current | Replace With | Use Case |
|---------------|--------------|----------|
| `bg-black` | `bg-bg-page` | Page backgrounds (light theme) |
| `bg-white` | `bg-surface` | Card/surface backgrounds |
| `text-alira-white` | `text-text-primary` | Primary text on light backgrounds |
| `text-white` | `text-text-inverse` | Text on dark backgrounds (CTAs) |
| `text-alira-black` | `text-text-primary` | Primary text |
| `text-alira-gold` | `text-accent` | Accent text |
| `bg-alira-gold` | `bg-accent` | Accent backgrounds |
| `border-white/10` | `border-borderToken-subtle` | Subtle borders |
| `border-white/20` | `border-accent` or `border-borderToken-strong` | Accent borders |
| `from-alira-primary` | `from-brand` | Gradient backgrounds |

---

## 🎯 Recommended Implementation Order

1. **Fix brand color** (changes everything at once)
2. **Fix CTA sections** (quick wins)
3. **Decide on dashboard theme** (affects multiple files)
4. **Standardize borders** (consistency improvement)
5. **Remove hardcoded colors** (long-term cleanup)

---

## 📊 Current Status

- **52 files** with color inconsistencies
- **121 hardcoded** color values
- **Brand color mismatch** (most critical)
- **Dashboard theme** inconsistency (high priority)

---

**Next Steps:** Start with fixing the brand color, then work through CTA sections and dashboard migration.

