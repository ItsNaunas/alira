# Navigation System Specification

**Date Created:** October 20, 2025  
**Phase:** Phase 3 - Navigation System Redesign  
**Status:** ✅ Complete

---

## OVERVIEW

This document defines the complete navigation architecture for the ALIRA application, covering both marketing pages and authenticated dashboard pages. The navigation system provides clear wayfinding, consistent patterns, and excellent accessibility across all devices.

---

## 1. MARKETING PAGES NAVIGATION

### Scope
Applies to: `/`, `/about`, `/services`, `/how-it-works`, `/what-you-get`, `/results`, `/contact`

### Header Component
**Location:** `components/Header.tsx`  
**Status:** ✅ Fully Implemented (Phase 2)

#### Desktop Navigation (≥1024px - `lg` breakpoint)

**Layout:**
- Fixed header with transparent/blur background
- Responsive to scroll (adds backdrop blur when scrolled)
- Logo: Left-aligned, links to homepage
- Nav Links: Center/right section
- CTA Button: Right-aligned

**Navigation Links:**
1. Home (`/`)
2. What You Get (`/how-it-works`)
3. Services (`/services`)
4. About (`/about`)
5. Contact (`/contact`)
6. Results (`/results`)

**Active State Indicator:**
- Active link: White text + 2px gold underline
- Inactive link: 60% opacity white text
- Hover state: 100% opacity white text
- Smooth transitions between states

**CTA Button:**
- Unauthenticated: "Start Your Plan" → `/#start-chat`
- Authenticated: "Dashboard" (ghost) + "Sign Out" (outline)

#### Mobile Navigation (<1024px)

**Full-Screen Overlay Menu:**
- **Trigger:** Hamburger icon (top-right)
- **Animation:** Fade in backdrop + slide up content (Framer Motion)
- **Layout:** Centered, spacious vertical navigation
- **Background:** Black 95% opacity with backdrop blur
- **Links:** Text-2xl, centered alignment
- **Active State:** Gold text color
- **Inactive State:** White text, gold on hover
- **Body Scroll:** Prevented when menu open
- **Close Triggers:**
  - Click hamburger icon (becomes X icon)
  - Click backdrop
  - Navigate to any link (auto-close)
  - ESC key

**Accessibility:**
- ✅ `aria-label` on hamburger button
- ✅ `aria-expanded` state
- ✅ Keyboard accessible (Tab, Enter, ESC)
- ✅ Focus trap when menu open

---

## 2. AUTHENTICATED PAGES NAVIGATION

### Scope
Applies to: `/dashboard`, `/dashboard/[planId]/*`

### Dashboard Layout Component
**Location:** `components/DashboardLayout.tsx`  
**Status:** ✅ Fully Implemented (Phase 3)

#### Sidebar Navigation

**Layout:**
- Collapsible sidebar (hover to expand)
- Fixed left position
- Full height
- Black background
- Animated expand/collapse (Framer Motion)

**Main Navigation Links:**
1. **Dashboard** (`/dashboard`)
   - Icon: `IconLayoutDashboard`
   - Label: "Dashboard"
   - Purpose: Main dashboard view with all plans

2. **New Plan** (`/#start-chat`)
   - Icon: `IconPlus`
   - Label: "New Plan"
   - Purpose: Start creating a new business plan

**Footer Section:**
*(Visually separated with top border - `border-white/10`)*

3. **Back to Website** (`/`)
   - Icon: `IconHome`
   - Label: "Back to Website"
   - Purpose: Exit dashboard, return to marketing site

4. **Logout**
   - Icon: `IconLogout`
   - Label: "Logout"
   - Purpose: Sign out and redirect to homepage
   - Action: Calls `auth.signOut()`, navigates to `/`

**Sidebar States:**
- **Collapsed:** Shows only icons (Letter "A" for logo)
- **Expanded:** Shows icons + labels (Full "ALIRA." logo)
- **Hover Behavior:** Icon/label animates on hover
- **Active State:** Link highlighting (handled by SidebarLink component)

**Mobile Behavior:**
- Auto-collapse by default
- Hamburger toggle
- Overlay on smaller screens

#### Breadcrumbs
**Location:** `components/Breadcrumbs.tsx`  
**Status:** ✅ Fully Implemented (Phase 1)

**Usage:**
- Shown on plan detail pages (`/dashboard/[planId]`)
- Format: `Dashboard > Plan Name`
- Current page marked with `aria-current="page"`
- Separated by ChevronRight icons

**Accessibility:**
- ✅ `aria-label="Breadcrumb"` on nav element
- ✅ Semantic HTML structure
- ✅ Keyboard accessible links

---

## 3. NAVIGATION PATTERNS

### Pattern 1: Skip Navigation
**Location:** `app/layout.tsx`  
**Status:** ✅ Implemented (Phase 1)

**Implementation:**
```tsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

**Behavior:**
- Hidden off-screen until focused
- Visible on keyboard focus (Tab key)
- Jumps to `id="main-content"` when activated
- Gold outline on focus

**Target IDs:**
- Marketing pages: `#main-content` in `ConditionalLayout`
- Dashboard pages: `#main-content` in `DashboardLayout`

---

### Pattern 2: Back Button
**Location:** `components/BackButton.tsx`  
**Status:** ✅ Created (Phase 1)

**Props:**
- `href`: Destination URL
- `label`: Screen reader text (e.g., "Back to Dashboard")

**Usage:**
- Can be added to any page needing back navigation
- Currently available but not widely used
- Recommended for deep nested pages

---

### Pattern 3: Active Link Detection
**Implementation:** Uses Next.js `usePathname()` hook

**Desktop Header:**
```tsx
pathname === link.href
  ? 'text-white border-b-2 border-alira-gold'  // Active
  : 'text-white/60 hover:text-white'           // Inactive
```

**Mobile Menu:**
```tsx
pathname === link.href
  ? 'text-alira-gold'      // Active
  : 'text-white hover:text-alira-gold'  // Inactive
```

---

## 4. VISUAL DESIGN SYSTEM

### Colors

**Active States:**
- Primary: `text-alira-gold` (#A06B00)
- Active text: `text-white`
- Active indicator: `border-alira-gold` (2px underline)

**Inactive States:**
- Desktop nav: `text-white/60` (60% opacity)
- Hover: `text-white` (100% opacity)

**Backgrounds:**
- Header: Transparent → `bg-[#0A0E18]/30 backdrop-blur-xl` on scroll
- Mobile menu: `bg-black/95 backdrop-blur-xl`
- Sidebar: `bg-black`

**Borders:**
- Sidebar footer separator: `border-white/10`
- Header on scroll: `shadow-lg`

### Typography

**Font Family:**
- Logo: `font-serif` (Cormorant Garamond)
- Navigation links: `font-serif`
- Button text: `font-sans` (Inter)

**Font Sizes:**
- Desktop nav links: `text-base` (16px)
- Mobile menu links: `text-2xl` (24px)
- Logo: `text-xl sm:text-2xl` (20px-24px)
- Sidebar labels: `text-sm` (14px)

**Font Weights:**
- Logo: `font-normal`
- Nav links: `font-normal`
- Buttons: `font-medium` (primary), `font-light` (secondary)

---

## 5. RESPONSIVE BREAKPOINTS

### Key Breakpoints

**lg (1024px):**
- Desktop navigation appears
- Mobile hamburger menu hidden
- Full header with all links visible

**md (768px):**
- Sidebar width adjustments
- Dashboard layout shifts

**sm (640px):**
- Logo size adjustments
- Button sizing changes
- Typography scale adjustments

### Decision: Why 1024px (lg)?

Previously, desktop nav appeared at `xl` (1280px). Changed to `lg` (1024px) in Phase 2 for:
- ✅ Better tablet experience (tablets get desktop nav)
- ✅ More users see full navigation
- ✅ Reduced cramping on medium screens

---

## 6. ANIMATIONS

### Header Mobile Menu
**Library:** Framer Motion

**Animations:**
1. **Backdrop:**
   - Initial: `opacity: 0`
   - Animate: `opacity: 1`
   - Duration: `0.2s`

2. **Menu Content:**
   - Initial: `y: -20, opacity: 0`
   - Animate: `y: 0, opacity: 1`
   - Exit: `y: -20, opacity: 0`
   - Duration: `0.3s`

### Sidebar
**Library:** Framer Motion

**Animations:**
1. **Logo Text:**
   - Controlled by `open` state
   - Fades in/out
   - `display` and `opacity` animated

2. **Link Labels:**
   - Slide animation on hover
   - `translate-x-1` effect
   - Smooth color transitions

---

## 7. ACCESSIBILITY FEATURES

### WCAG 2.1 AA Compliance

**Focus Indicators:**
- ✅ All interactive elements have visible focus states
- ✅ Gold outline (2px) on focus-visible
- ✅ Meets 3:1 contrast requirement

**Screen Reader Support:**
- ✅ `aria-label` on icon-only buttons
- ✅ `aria-expanded` on menu toggles
- ✅ `aria-current="page"` on active breadcrumb
- ✅ `role="navigation"` on nav elements

**Keyboard Navigation:**
- ✅ Tab through all links
- ✅ Enter/Space to activate
- ✅ ESC to close mobile menu
- ✅ Skip navigation link

**Touch Targets:**
- ✅ Minimum 44x44px on mobile
- ✅ Adequate spacing between links
- ✅ Large touch areas in mobile menu

---

## 8. USER FLOWS

### Flow 1: New User → Create Plan
```
Homepage → Click "Start Your Plan"
  → Scroll to #start-chat
  → Fill conversational form
  → Create account (modal)
  → Redirected to /dashboard
```

### Flow 2: Authenticated User → View Plans
```
Any page → Header CTA "Dashboard"
  → /dashboard
  → View all plans
  → Click plan card
  → /dashboard/[planId]
  → See breadcrumbs: Dashboard > Plan Name
```

### Flow 3: Dashboard User → Create Another Plan
```
/dashboard → Sidebar "New Plan"
  → Redirect to /#start-chat
  → Start new plan flow
```

### Flow 4: Dashboard User → Return to Marketing
```
/dashboard → Sidebar "Back to Website"
  → Homepage (/)
  → Browse marketing pages
```

### Flow 5: Sign Out
```
/dashboard → Sidebar "Logout"
  → auth.signOut()
  → Redirect to homepage (/)
```

---

## 9. IMPLEMENTATION STATUS

### Phase 1 (Accessibility) ✅ COMPLETE
- ✅ Skip navigation link
- ✅ Focus indicators
- ✅ Breadcrumbs component
- ✅ ARIA labels
- ✅ Keyboard accessibility

### Phase 2 (Quick Wins) ✅ COMPLETE
- ✅ Full-screen mobile menu
- ✅ Active link indicators
- ✅ Desktop nav at 1024px
- ✅ Smooth animations
- ✅ Body scroll prevention

### Phase 3 (Navigation Redesign) ✅ COMPLETE
- ✅ Dashboard sidebar reorganization
- ✅ Removed "Home" and "Form" links
- ✅ Added "Back to Website" link
- ✅ Visual separator before footer
- ✅ Clearer navigation hierarchy
- ✅ Navigation specification document

---

## 10. FUTURE ENHANCEMENTS

### Potential Improvements
1. **User Menu in Header**
   - Show user avatar/name when authenticated
   - Dropdown with: Dashboard, Settings, Logout

2. **Settings Page**
   - Add Settings link to sidebar
   - User profile, preferences, billing

3. **Notification System**
   - Bell icon in header
   - Dropdown with recent notifications

4. **Search Functionality**
   - Global search in header
   - Search plans, help docs

5. **Contextual Help**
   - Help icon in header
   - Guided tours, tooltips

6. **Mobile Sidebar Gestures**
   - Swipe from left to open sidebar
   - Swipe right to close

---

## 11. TESTING CHECKLIST

### Manual Testing

#### Desktop (≥1024px)
- [ ] All header links visible
- [ ] Active page has gold underline
- [ ] CTA button shows correct state (authenticated vs not)
- [ ] Hover states work smoothly
- [ ] Keyboard navigation works (Tab through all links)
- [ ] Logo links to homepage

#### Mobile (<1024px)
- [ ] Hamburger menu appears
- [ ] Menu opens with smooth animation
- [ ] All links visible and centered
- [ ] Active link shows gold color
- [ ] Menu closes when clicking link
- [ ] Menu closes when clicking backdrop
- [ ] Body scroll prevented when menu open
- [ ] ESC key closes menu

#### Dashboard
- [ ] Sidebar appears on dashboard pages
- [ ] Sidebar collapses/expands on hover
- [ ] Dashboard link navigates correctly
- [ ] New Plan link goes to `/#start-chat`
- [ ] Back to Website link goes to homepage
- [ ] Logout button signs out and redirects
- [ ] Separator visible between main links and footer
- [ ] Icons visible in collapsed state

#### Breadcrumbs
- [ ] Breadcrumbs appear on plan pages
- [ ] Format: Dashboard > Plan Name
- [ ] Dashboard link navigates to /dashboard
- [ ] Current page is not a link
- [ ] Screen reader announces breadcrumb

#### Accessibility
- [ ] Press Tab on page load - skip link appears
- [ ] Tab through all navigation - focus visible
- [ ] Screen reader announces all links correctly
- [ ] ESC closes mobile menu
- [ ] Enter activates links

---

## 12. MAINTENANCE NOTES

### Adding New Marketing Page
1. Add route to `app/[page]/page.tsx`
2. Add link to `navigationLinks` array in `Header.tsx`
3. Test mobile and desktop layouts
4. Verify active state works

### Adding New Dashboard Page
1. Create page under `app/dashboard/[page]/page.tsx`
2. Wrap with `DashboardLayout`
3. Add breadcrumbs if nested
4. Consider adding sidebar link if primary feature

### Updating Navigation Links
**File to edit:** `components/Header.tsx`

**Location:** Lines 1001-1008 (navigationLinks array)

**Format:**
```typescript
{ href: '/page-url', label: 'Page Name' }
```

### Updating Sidebar Links
**File to edit:** `components/DashboardLayout.tsx`

**Location:** Lines 55-70 (links array)

**Format:**
```typescript
{
  label: "Link Name",
  href: "/url",
  icon: <IconComponent className="h-5 w-5 shrink-0 text-alira-white/70" />
}
```

---

## 13. FILES REFERENCE

### Navigation Components
| File | Purpose | Status |
|------|---------|--------|
| `components/Header.tsx` | Marketing pages header | ✅ Complete |
| `components/DashboardLayout.tsx` | Dashboard sidebar | ✅ Complete |
| `components/Breadcrumbs.tsx` | Breadcrumb navigation | ✅ Complete |
| `components/BackButton.tsx` | Back navigation utility | ✅ Complete |
| `components/ui/sidebar.tsx` | Reusable sidebar component | ✅ Complete |

### Layouts
| File | Purpose | Status |
|------|---------|--------|
| `app/layout.tsx` | Root layout with skip link | ✅ Complete |
| `components/ConditionalLayout.tsx` | Marketing pages layout | ✅ Complete |

### Documentation
| File | Purpose |
|------|---------|
| `NAVIGATION_SPEC.md` | This document |
| `UX_IMPLEMENTATION_PLAN.md` | Complete UX plan |
| `PHASE_1_COMPLETE_SUMMARY.md` | Phase 1 summary |
| `PHASE_2_COMPLETE_SUMMARY.md` | Phase 2 summary |

---

## 14. DESIGN DECISIONS LOG

### Decision 1: Full-Screen vs Popover Menu
**Date:** Phase 2  
**Decision:** Full-screen mobile menu  
**Rationale:**
- More space for navigation links
- Better touch targets
- Modern, immersive experience
- Easier to add future features

### Decision 2: Desktop Nav Breakpoint
**Date:** Phase 2  
**Decision:** Changed from xl (1280px) to lg (1024px)  
**Rationale:**
- Tablets benefit from desktop navigation
- Reduces mobile menu usage
- Better user experience on iPads

### Decision 3: Sidebar Organization
**Date:** Phase 3  
**Decision:** Remove "Home" and "Form", add "Back to Website"  
**Rationale:**
- Clearer distinction between app and marketing
- "Home" was ambiguous (Dashboard home or website home?)
- "Form" link was outdated/redundant
- "Back to Website" clearly indicates exit from dashboard

### Decision 4: Sidebar Footer Separator
**Date:** Phase 3  
**Decision:** Add visual separator before footer links  
**Rationale:**
- Visually groups primary navigation vs exit/logout
- Matches common dashboard patterns
- Improves scanability

---

## SUMMARY

The ALIRA navigation system is now comprehensive, accessible, and well-organized. All three phases of navigation improvements are complete:

✅ **Phase 1:** Accessibility foundation (skip links, breadcrumbs, ARIA)  
✅ **Phase 2:** Mobile experience (full-screen menu, active indicators)  
✅ **Phase 3:** Navigation architecture (sidebar reorganization, spec document)

**Navigation is production-ready!** 🎉

---

**Last Updated:** October 20, 2025  
**Next Review:** After Phase 4 (Design System Consolidation)

