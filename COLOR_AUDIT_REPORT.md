# ALIRA Color System Audit Report

**Generated:** $(date)  
**Files Scanned:** 110  
**Files with Color Usage:** 87  
**Files with Inconsistencies:** 52

---

## Executive Summary

This audit reveals significant inconsistencies in color usage across the ALIRA codebase. The project uses three different color systems simultaneously:

1. **Semantic Tokens** (Preferred): `bg-page`, `text-primary`, `brand`, `accent`
2. **Legacy Tokens**: `alira-primary`, `alira-gold`, `alira-black`, `alira-white`
3. **Hardcoded Values**: `bg-black`, `bg-white`, `text-white`, `text-black`

**Key Findings:**
- 52 files have color inconsistencies
- 121 hardcoded color values found across the codebase
- Undefined token references (`alira-onyx`, `alira-porcelain`) in `lib/fonts.ts`
- Mixed usage of semantic and legacy tokens throughout
- Dashboard pages use legacy black/white theme while public pages use white theme

---

## 1. Defined Color Tokens Inventory

### 1.1 Semantic Tokens (Preferred System)

These tokens are defined in `app/globals.css` and mapped in `tailwind.config.js`:

#### Backgrounds
- `--bg-page`: `#ffffff` → `bg-bg-page`
- `--bg-section`: `#f7f9fc` → `bg-bg-section`
- `--bg-muted`: `#eef2f7` → `bg-bg-muted`
- `--surface`: `#ffffff` → `bg-surface`

#### Text Colors
- `--text-primary`: `#0a0d14` → `text-text-primary`
- `--text-secondary`: `#394150` → `text-text-secondary`
- `--text-tertiary`: `#5b6474` → `text-text-tertiary`
- `--text-inverse`: `#ffffff` → `text-text-inverse`

#### Brand Colors
- `--brand`: `#0a66ff` → `text-brand`, `bg-brand`
- `--brand-hover`: `#0852cc` → `bg-brand-hover`

#### Accent Colors
- `--accent`: `#cba349` → `text-accent`, `bg-accent`
- `--accent-dark`: `#936f25` → `text-accent-dark`

#### Borders
- `--border-subtle`: `#e3e8ef` → `border-borderToken-subtle`
- `--border-strong`: `#cbd5e1` → `border-borderToken-strong`

### 1.2 Legacy ALIRA Tokens

Defined in `tailwind.config.js`:

- `alira-primary`: `#0B1D51`
- `alira-gold`: `#A06B00`
- `alira-black`: `#000000`
- `alira-white`: `#FFFFFF`
- `alira-primary-dark`: `#081640`
- `alira-primary-light`: `#0e2a6e`
- `alira-gold-light`: `#c79000`
- `alira-gold-dark`: `#7a5000`

### 1.3 Shadcn Base Tokens

These are HSL-based tokens used by shadcn/ui components:
- `background`, `foreground`, `primary`, `secondary`, `muted`, `destructive`, `accent`, `card`, `popover`, `border`, `input`, `ring`

### 1.4 Undefined Token References

**CRITICAL ISSUE:** `lib/fonts.ts` references tokens that don't exist:
- `alira-onyx` (referenced but never defined)
- `alira-porcelain` (referenced but never defined)

These should be replaced with actual token names or removed.

---

## 2. Usage Statistics

### 2.1 Background Color Usage

**Most Used Background Classes:**
- `bg-black`: Used extensively in dashboard and some public pages
- `bg-white`: Used in forms and some components
- `bg-bg-page`: Used in newer pages (About, Services, What You Get)
- `bg-surface`: Used for cards and elevated surfaces
- `bg-alira-gold`: Used for accent backgrounds
- `bg-white/[0.02]`: Used for subtle overlays (legacy pattern)

**Consistency Issues:**
- Public pages mix `bg-bg-page` (white) with legacy `bg-black`
- Dashboard exclusively uses `bg-black` and `bg-white`
- Form pages use `bg-black`

### 2.2 Text Color Usage

**Most Used Text Classes:**
- `text-alira-white`: Used extensively (legacy)
- `text-alira-gold`: Used for accents (legacy)
- `text-text-primary`: Used in newer pages (semantic)
- `text-text-secondary`: Used in newer pages (semantic)
- `text-white`: Used in some CTAs and sections
- `text-black`: Rarely used

**Consistency Issues:**
- Mixed usage of `text-alira-white` vs `text-text-primary`
- `text-white` used instead of `text-text-inverse`
- Opacity modifiers (`/80`, `/70`, `/60`) used inconsistently

### 2.3 Border Color Usage

**Most Used Border Classes:**
- `border-white/10`: Used extensively (legacy pattern)
- `border-borderToken-subtle`: Used in newer pages (semantic)
- `border-alira-gold`: Used for accent borders
- `border-accent`: Used in newer pages (semantic)

**Consistency Issues:**
- Mixed usage of `border-white/10` vs `border-borderToken-subtle`
- Opacity modifiers used inconsistently

---

## 3. Consistency Matrix

### 3.1 Pages Using Semantic Tokens (Consistent)

✅ **Consistent Pages:**
- `app/about/page.tsx` - Uses semantic tokens (after recent fix)
- `app/services/page.tsx` - Uses semantic tokens
- `app/what-you-get/page.tsx` - Uses semantic tokens
- `app/page.tsx` - Uses semantic tokens

### 3.2 Pages Using Legacy Tokens (Needs Migration)

⚠️ **Legacy Pages:**
- `app/contact/page.tsx` - Uses `bg-black`, `text-alira-white`
- `app/results/page.tsx` - Uses `bg-black`, `text-alira-white`
- `app/form-chat/page.tsx` - Uses `bg-black`, `text-alira-white`
- `app/dashboard/page.tsx` - Uses `bg-black`, `text-alira-white` (entire dashboard)
- `app/form/page.tsx` - Uses legacy tokens

### 3.3 Pages with Mixed Usage

❌ **Inconsistent Pages:**
- `app/about/page.tsx` - Mixes semantic tokens with `text-white` in CTA section
- Various component files mix legacy and semantic tokens

---

## 4. Detailed Inconsistency List

### 4.1 Hardcoded Black/White Usage

**Files using `bg-black` instead of semantic tokens:**
- `app/contact/page.tsx` - 3 instances
- `app/results/page.tsx` - 3 instances
- `app/form-chat/page.tsx` - 3 instances
- `app/dashboard/page.tsx` - 3 instances
- `app/form/page.tsx` - Multiple instances
- `app/dashboard/[planId]/page.tsx` - Multiple instances
- `app/dashboard/[planId]/edit/page.tsx` - Multiple instances
- `app/dashboard/[planId]/refine/page.tsx` - Multiple instances

**Files using `bg-white` instead of `bg-surface`:**
- `app/contact/page.tsx` - 5 instances
- `app/dashboard/page.tsx` - 15+ instances
- Various component files

**Files using `text-white` instead of `text-text-inverse`:**
- `app/about/page.tsx` - 2 instances (CTA section)
- `app/contact/page.tsx` - 2 instances (CTA section)
- `app/results/page.tsx` - Multiple instances (CTA section)
- Various component files

### 4.2 Legacy Token Usage

**Files using `text-alira-white` instead of `text-text-primary`:**
- All dashboard pages
- `app/contact/page.tsx`
- `app/results/page.tsx`
- `app/form-chat/page.tsx`
- `components/DashboardLayout.tsx`
- Many other component files

**Files using `border-white/10` instead of `border-borderToken-subtle`:**
- All dashboard pages
- `app/contact/page.tsx`
- `app/results/page.tsx`
- Many component files

### 4.3 Hardcoded Color Values

**121 hardcoded color values found:**
- Hex colors: `#A06B00`, `#0B1D51`, `#FFFFFF`, etc.
- RGBA values: `rgba(255, 255, 255, 0.8)`, `rgba(0, 0, 0, 0.5)`, etc.

**Locations:**
- `app/globals.css` - CSS custom properties and utilities
- `components/ui/gradient-bars.tsx` - Gradient definitions
- `components/ui/wobble-card.tsx` - Animation styles
- Various component files with inline styles

### 4.4 Undefined Token References

**Files referencing undefined tokens:**
- `lib/fonts.ts` - References `alira-onyx` and `alira-porcelain` which don't exist

---

## 5. Recommendations

### 5.1 Priority 1: Critical Fixes (Immediate)

1. **Fix undefined token references in `lib/fonts.ts`**
   - Replace `alira-onyx` with `alira-black` or `text-primary`
   - Replace `alira-porcelain` with `alira-white` or `text-inverse`
   - Or remove dark mode references if dark mode is disabled

2. **Standardize public pages**
   - Convert `app/contact/page.tsx` from `bg-black` to `bg-bg-page`
   - Convert `app/results/page.tsx` from `bg-black` to `bg-bg-page`
   - Update text colors from `text-alira-white` to `text-text-primary`

3. **Fix CTA sections**
   - Replace `text-white` with `text-text-inverse` in CTA sections
   - Ensure CTA backgrounds use semantic tokens

### 5.2 Priority 2: High Impact (Short-term)

1. **Migrate dashboard pages**
   - Dashboard uses dark theme (`bg-black`, `text-alira-white`)
   - Decide: Keep dark theme or migrate to light theme?
   - If keeping dark theme, create dark semantic tokens
   - If migrating to light theme, convert all dashboard pages

2. **Standardize border colors**
   - Replace `border-white/10` with `border-borderToken-subtle` everywhere
   - Replace `border-white/20` with `border-accent` or appropriate semantic token

3. **Consolidate opacity modifiers**
   - Create semantic opacity tokens instead of using `/80`, `/70`, `/60`
   - Or document opacity usage patterns

### 5.3 Priority 3: Long-term Improvements

1. **Remove hardcoded colors**
   - Replace hex colors in CSS with tokens
   - Replace RGBA values with token-based opacity utilities
   - Move all hardcoded colors to token definitions

2. **Create migration guide**
   - Document token mapping (legacy → semantic)
   - Provide examples for common patterns
   - Create ESLint rules to prevent new inconsistencies

3. **Component library standardization**
   - Audit all UI components for consistent token usage
   - Update component documentation with token requirements
   - Create component variants using semantic tokens

---

## 6. Token Migration Map

### Legacy → Semantic Token Mappings

| Legacy Token | Semantic Token | Notes |
|-------------|----------------|-------|
| `bg-black` | `bg-bg-page` | For public pages (white theme) |
| `bg-black` | `bg-bg-page` | For dashboard (if migrating to light) |
| `bg-white` | `bg-surface` | For cards and elevated surfaces |
| `text-alira-white` | `text-text-primary` | For primary text on light backgrounds |
| `text-alira-white` | `text-text-inverse` | For text on dark backgrounds (CTAs) |
| `text-alira-black` | `text-text-primary` | For primary text |
| `text-alira-gold` | `text-accent` | For accent colors |
| `border-white/10` | `border-borderToken-subtle` | For subtle borders |
| `border-white/20` | `border-accent` | For accent borders |

### Opacity Modifier Patterns

| Pattern | Recommendation |
|---------|----------------|
| `text-alira-white/80` | `text-text-secondary` |
| `text-alira-white/70` | `text-text-tertiary` |
| `text-alira-white/60` | Create `text-text-muted` token |
| `bg-white/[0.02]` | Use `bg-bg-muted` with opacity or create `bg-surface-subtle` |
| `bg-black/50` | Create `bg-overlay` token |

---

## 7. Files Requiring Updates

### 7.1 High Priority (Public Pages)

1. `app/contact/page.tsx` - Full migration to semantic tokens
2. `app/results/page.tsx` - Full migration to semantic tokens
3. `app/form-chat/page.tsx` - Full migration to semantic tokens
4. `app/form/page.tsx` - Full migration to semantic tokens

### 7.2 Medium Priority (Dashboard)

1. `app/dashboard/page.tsx` - Decide on theme strategy
2. `app/dashboard/[planId]/page.tsx` - Theme consistency
3. `app/dashboard/[planId]/edit/page.tsx` - Theme consistency
4. `app/dashboard/[planId]/refine/page.tsx` - Theme consistency
5. `components/DashboardLayout.tsx` - Theme consistency

### 7.3 Low Priority (Components)

All component files in `components/` directory need review for:
- Legacy token usage
- Hardcoded color values
- Border color consistency

---

## 8. Action Items Summary

### Immediate Actions
- [ ] Fix `lib/fonts.ts` undefined token references
- [ ] Convert `app/contact/page.tsx` to semantic tokens
- [ ] Convert `app/results/page.tsx` to semantic tokens
- [ ] Replace `text-white` with `text-text-inverse` in CTA sections

### Short-term Actions
- [ ] Decide dashboard theme strategy (dark vs light)
- [ ] Standardize border colors across all pages
- [ ] Create opacity token utilities

### Long-term Actions
- [ ] Remove all hardcoded color values
- [ ] Create migration documentation
- [ ] Implement ESLint rules for color consistency
- [ ] Audit and update all component files

---

## Appendix: Complete File List with Issues

See `color-audit-results.json` for complete file-by-file breakdown of:
- All color classes used
- Hardcoded values found
- Specific inconsistency types
- Line-by-line analysis

---

**Report Generated:** $(date)  
**Tool:** Color System Audit Script  
**Next Review:** After implementing Priority 1 fixes

