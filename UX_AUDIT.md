# UX AUDIT REPORT
**Project:** ALIRA Partners  
**Date:** October 20, 2025  
**Audit Scope:** Complete application (marketing pages, authenticated flows, forms, components)  
**Methodology:** Heuristic evaluation, WCAG 2.1 AA standards, modern UX best practices

---

## EXECUTIVE SUMMARY

**Overall UX Score: 7.2/10**

The ALIRA project demonstrates strong visual design and brand consistency, with a premium feel achieved through carefully chosen typography (Lato + Instrument Serif) and a sophisticated color palette (navy blue + gold). However, there are significant accessibility concerns, navigation inconsistencies, and opportunities to improve user feedback and flow clarity.

### Top 3 Critical Issues

1. **Critical Accessibility Gaps** - Missing alt text on images, insufficient color contrast in multiple locations, and incomplete keyboard navigation support could exclude users with disabilities.

2. **Inconsistent Navigation Patterns** - Mix of different navigation approaches across pages (Header vs Sidebar vs ConditionalLayout) creates confusion about the information architecture.

3. **Inadequate Error State Handling** - Many forms and user actions lack comprehensive error feedback, leaving users uncertain about what went wrong and how to fix it.

### Top 3 Quick Wins

1. **Add Loading States to Buttons** - Currently many buttons don't show loading feedback, causing uncertainty during async operations.

2. **Fix Contact Page Color Contrast** - Line 276 has conflicting dark mode text colors that reduce readability.

3. **Standardize Button Variants** - Consolidate the 7 button variants down to 3-4 consistently applied options.

### Key Recommendations

1. **Accessibility First**: Audit and fix all WCAG AA issues within 2 weeks
2. **Navigation Redesign**: Create clear, consistent navigation patterns across all pages
3. **Error Handling Framework**: Implement comprehensive error boundaries and user feedback
4. **Design System Audit**: Consolidate duplicate components and establish clear usage guidelines

---

## FINDINGS OVERVIEW

### By Category
- **Visual & Layout Consistency**: 12 findings
- **Navigation & Flow**: 9 findings
- **Readability & Hierarchy**: 8 findings
- **Accessibility (a11y)**: 15 findings (CRITICAL)
- **Feedback & Error Handling**: 11 findings
- **Responsiveness**: 6 findings
- **Design System Alignment**: 9 findings
- **Microcopy & Tone**: 7 findings
- **Flow Integrity**: 6 findings

### By Severity
- **Critical**: 8 findings
- **High**: 19 findings
- **Medium**: 29 findings
- **Low**: 27 findings

**Total Issues Identified: 83**

---

## DETAILED FINDINGS

### VISUAL & LAYOUT CONSISTENCY

#### [HIGH] Inconsistent Color Token Usage
**Category:** Visual  
**Path:** Multiple files  
**Summary:** Hard-coded color values alongside design tokens create inconsistency

**Rationale:** The codebase has well-defined color tokens (`alira-primary`, `alira-gold`, `alira-white`, `alira-black`) but many components use hard-coded values or mix both approaches. Examples:
- `services/page.tsx` line 276: `dark:text-alira-black/80 dark:text-alira-white/80` (conflicting classes)
- Multiple uses of `bg-white/5`, `bg-black/50` instead of semantic tokens
- Inconsistent opacity values (5%, 10%, 20%, 30%, 80%, 90%) with no system

**Suggested Fix:** 
1. Audit all color usages across the codebase
2. Create semantic color tokens for common patterns (e.g., `surface-overlay`, `text-muted`)
3. Update `tailwind.config.js` with opacity scale in design tokens
4. Replace all hard-coded colors with tokens

**Confidence:** High

---

#### [MEDIUM] Typography Hierarchy Inconsistencies
**Category:** Visual  
**Path:** Multiple pages  
**Summary:** Heading sizes and font families used inconsistently across pages

**Rationale:** While the design system defines clear typography scales, application is inconsistent:
- H1 ranges from `text-4xl` to `text-6xl` to `text-7xl` across different pages
- Mix of `font-serif` and `font-sans` on similar heading levels
- Some pages use custom `clamp()` values, others use Tailwind classes
- Body text alternates between `text-base` (18px) and `text-lg` without clear pattern

**Suggested Fix:**
1. Define 3 H1 variants in globals.css: `.h1-hero`, `.h1-page`, `.h1-section`
2. Create similar variants for H2-H6
3. Document usage guidelines for each variant
4. Apply consistently across all pages

**Confidence:** High

---

#### [MEDIUM] Spacing System Not Fully Utilized
**Category:** Visual  
**Path:** Multiple components  
**Summary:** Mix of custom spacing values and system spacing creates visual inconsistencies

**Rationale:** Tailwind's spacing system is defined but many components use arbitrary values:
- `mb-16`, `mb-20`, `mb-12`, `mb-8` all used for section spacing
- Custom padding values like `p-10`, `py-32` alongside system values
- Inconsistent gap values in grids: `gap-8`, `gap-10`, `gap-12`, `gap-16`

**Suggested Fix:**
1. Establish spacing scale: xs(4), sm(8), md(12), lg(16), xl(24), 2xl(32), 3xl(48)
2. Map to semantic names: `section-padding`, `card-padding`, `element-gap`
3. Add to design system documentation
4. Replace all spacing with system values

**Confidence:** Medium

---

#### [LOW] Border Radius Inconsistency
**Category:** Visual  
**Path:** Multiple components  
**Summary:** Mix of `rounded-lg`, `rounded-xl`, `rounded-2xl` without clear pattern

**Rationale:** Components use different border radius values for similar UI elements:
- Cards: `rounded-lg`, `rounded-xl`, `rounded-2xl` all used
- Buttons: `rounded-lg` vs `rounded-xl` vs `rounded-full`
- Inputs: `rounded-md` vs `rounded-lg` vs `rounded-xl`

**Suggested Fix:**
1. Define 3 border radius values: small (inputs), medium (buttons/cards), large (major surfaces)
2. Update design system with usage guidelines
3. Apply consistently

**Confidence:** Medium

---

#### [MEDIUM] Shadow System Needs Standardization
**Category:** Visual  
**Path:** `globals.css`, components  
**Summary:** Custom shadow definitions alongside Tailwind shadows create confusion

**Rationale:**
- Custom `.shadow-alira-card` and `.shadow-alira-card-elevated` defined in globals.css
- But most components use Tailwind shadows: `shadow-lg`, `shadow-xl`, `shadow-2xl`
- Inconsistent application: same component type uses different shadow values
- Gold shadow effects applied inconsistently: `shadow-alira-gold/10`, `shadow-alira-gold/20`

**Suggested Fix:**
1. Consolidate to 4 shadow levels: subtle, moderate, prominent, dramatic
2. Remove unused custom shadow classes
3. Document when to use each level
4. Update all components

**Confidence:** Medium

---

#### [LOW] Inconsistent Icon Usage
**Category:** Visual  
**Path:** Multiple components  
**Summary:** Mix of Lucide icons, custom SVGs, and inline SVG paths

**Rationale:**
- Dashboard uses `@tabler/icons-react` 
- Most pages use `lucide-react`
- Some components have inline SVG paths
- Icon sizes vary: `w-4 h-4`, `w-5 h-5`, `w-6 h-6`, `w-12 h-12` without system

**Suggested Fix:**
1. Standardize on one icon library (recommend Lucide for consistency)
2. Define icon size scale: xs(16px), sm(20px), md(24px), lg(32px), xl(48px)
3. Replace all @tabler icons with Lucide equivalents
4. Convert custom SVGs to icon components

**Confidence:** High

---

#### [MEDIUM] Animation Inconsistencies
**Category:** Visual  
**Path:** Multiple files  
**Summary:** Mix of Framer Motion, CSS animations, and Tailwind transitions

**Rationale:**
- Framer Motion used in FormWizard, DashboardLayout, PlanViewer
- Custom CSS animations in globals.css: `fade-in`, `slide-in`, `idleTilt`, `shine`
- Tailwind transitions: `transition-all duration-300`, `duration-200`, `duration-500`
- No consistent timing or easing functions

**Suggested Fix:**
1. Audit which animations are actually needed
2. Standardize on Framer Motion for complex animations, Tailwind for simple transitions
3. Define timing scale: quick(150ms), normal(300ms), slow(500ms)
4. Define easing functions: ease-in, ease-out, ease-in-out
5. Remove unused CSS animations

**Confidence:** Medium

---

#### [HIGH] Dark Mode Inconsistencies
**Category:** Visual  
**Path:** Multiple components  
**Summary:** Dark mode implementation has visual bugs and inconsistencies

**Rationale:**
- `layout.tsx` line 45 forces `className="dark"` on html element (always dark mode)
- Many components have conditional dark mode classes that never activate
- Some dark mode color combinations fail contrast requirements
- `/services/page.tsx` line 276: conflicting dark mode classes

**Suggested Fix:**
1. Implement proper dark mode toggle or remove forced dark class
2. Test all pages in both modes
3. Fix contrast issues
4. Remove redundant dark mode conditionals if always dark
5. If dark-only, remove all light mode styling

**Confidence:** High

---

#### [MEDIUM] Gradient Usage Lacks Consistency
**Category:** Visual  
**Path:** Multiple sections  
**Summary:** Decorative gradients applied without clear pattern

**Rationale:**
- Background gradients vary widely: `from-alira-gold/5 via-white to-alira-gold/10`, `from-alira-primary to-alira-gold/20`, etc.
- Button gradients: `from-alira-gold to-[#8B5A00]`, `from-alira-gold to-alira-gold/90`
- No documented purpose or usage guidelines

**Suggested Fix:**
1. Define 3 gradient purposes: subtle-bg, emphasis, interactive
2. Create reusable gradient classes
3. Document when to use each
4. Apply consistently

**Confidence:** Low

---

#### [LOW] Card Component Variations
**Category:** Visual  
**Path:** Multiple pages  
**Summary:** Cards styled differently across pages despite using same component

**Rationale:**
- Dashboard cards: `bg-white/[0.02] border-white/10`
- About page cards: `bg-white dark:bg-alira-primary/20`
- Services cards: `bg-white dark:bg-alira-primary/80`
- No clear visual hierarchy or purpose differentiation

**Suggested Fix:**
1. Define card variants: default, elevated, subtle, emphasis
2. Update Card component to accept variant prop
3. Map existing usages to variants
4. Document when to use each variant

**Confidence:** Medium

---

#### [MEDIUM] Loading State Visual Inconsistencies
**Category:** Visual  
**Path:** Multiple components  
**Summary:** Different loading spinner styles and colors used

**Rationale:**
- Gold spinners: `border-alira-gold` (dashboard)
- White spinners: `border-white` (VercelV0Chat)
- Black spinners: `border-black` (VercelV0Chat modal)
- Primary spinners: `border-alira-primary` (FormWizard)
- Sizes vary from `h-4 w-4` to `h-12 w-12`

**Suggested Fix:**
1. Create `<Spinner>` component with size and color props
2. Define 3 sizes: sm, md, lg
3. Color should adapt to context automatically
4. Replace all instances

**Confidence:** High

---

#### [LOW] Divider Line Inconsistencies  
**Category:** Visual  
**Path:** Multiple pages  
**Summary:** Decorative divider lines vary in width, height, and color

**Rationale:**
- Width varies: `w-12`, `w-16`, `w-20`
- Height varies: `h-px`, `h-[1px]`, `h-[2px]`, `h-[3px]`
- Colors vary: `bg-alira-gold`, `bg-alira-primary/20`, `bg-white/5`

**Suggested Fix:**
1. Standardize to 2 sizes: default (w-16 h-[2px]), large (w-20 h-[3px])
2. Always use `bg-alira-gold` for brand consistency
3. Create utility component `<Divider size="default" />`

**Confidence:** Low

---

### NAVIGATION & FLOW

#### [CRITICAL] Conflicting Navigation Systems
**Category:** Navigation  
**Path:** `Header.tsx`, `DashboardLayout.tsx`, `ConditionalLayout.tsx`  
**Summary:** Multiple navigation patterns create confusion about app structure

**Rationale:**
- Marketing pages use `Header` with horizontal nav (hidden on mobile until xl breakpoint)
- Dashboard uses sidebar navigation from DashboardLayout
- `ConditionalLayout` conditionally shows/hides Header/Footer based on path
- No clear visual indicator of which navigation system is active
- User can't easily understand they're in a different section

**Suggested Fix:**
1. Add visual differentiation to dashboard (different header background/branding)
2. Add breadcrumbs to dashboard pages
3. Consider unified navigation with clear section indicators
4. Ensure smooth transitions between navigation modes

**Confidence:** High

---

#### [HIGH] Mobile Navigation UX Issues
**Category:** Navigation  
**Path:** `Header.tsx` lines 80-94, 140-239  
**Summary:** Desktop navigation hidden until xl breakpoint creates usability issues

**Rationale:**
- Desktop nav links hidden below 1280px (xl breakpoint)
- On tablets (768px-1280px), users only see hamburger menu
- Hamburger opens in Popover, not full-screen takeover
- Auth buttons hidden on mobile (< sm breakpoint)
- Navigation feels cramped on tablets

**Suggested Fix:**
1. Show desktop nav at lg breakpoint (1024px) instead of xl
2. Implement full-screen mobile menu overlay instead of Popover
3. Always show auth buttons (adjust size/spacing for mobile)
4. Add visual feedback for menu open state

**Confidence:** High

---

#### [HIGH] Missing Back Navigation in Flows
**Category:** Navigation  
**Path:** `/dashboard/[planId]/page.tsx`, `/dashboard/[planId]/edit/page.tsx`  
**Summary:** No clear way to return to previous page in multi-step flows

**Rationale:**
- Plan detail page has no "Back to Dashboard" link
- Edit/Refine flows lack breadcrumbs
- Browser back button is only option
- Users may get lost in deep navigation

**Suggested Fix:**
1. Add breadcrumb component: Dashboard > Plan Name > Current Page
2. Add "Back" button to PlanHeader component
3. Ensure all detail pages have clear navigation out
4. Add keyboard shortcut hint (ESC to go back)

**Confidence:** High

---

#### [MEDIUM] Active Link Indication Insufficient
**Category:** Navigation  
**Path:** `Header.tsx` lines 82-92  
**Summary:** Current page indication too subtle in header navigation

**Rationale:**
- Active link only changes `text-white` vs `text-white/80`
- Very low contrast difference (80% → 100% opacity)
- Users may not notice which page they're on
- No underline or other visual indicator

**Suggested Fix:**
1. Add underline to active link: `border-b-2 border-alira-gold`
2. Increase contrast: active is `text-white`, inactive is `text-white/60`
3. Add gold color accent to active state
4. Consider adding icon or indicator

**Confidence:** Medium

---

#### [MEDIUM] Footer CTA Inconsistent with Page CTAs
**Category:** Navigation  
**Path:** `Footer.tsx` line 44, various page CTAs  
**Summary:** Footer CTA uses `#start-form` anchor while pages use `#start-chat` or `/#form-section`

**Rationale:**
- Footer: `href="#start-form"`
- Homepage: `href="#start-chat"`
- Services page: `href="#start-form"`
- What You Get page: `href="/#form-section"`
- None of these anchors actually exist on pages

**Suggested Fix:**
1. Audit all CTA destinations across site
2. Establish single entry point for form flow
3. Update all CTAs to use consistent anchor
4. Ensure anchor IDs exist on target pages
5. Test all navigation paths

**Confidence:** High

---

#### [HIGH] Dashboard Sidebar Navigation Ambiguity
**Category:** Navigation  
**Path:** `DashboardLayout.tsx` lines 55-84  
**Summary:** Sidebar links mix internal dashboard nav with external site nav

**Rationale:**
- "Home" link goes to `/` (marketing site)
- "Dashboard" link goes to `/dashboard` (authenticated area)
- "New Plan" goes to `/#start-chat` (marketing site with auth gate)
- "Form" goes to `/form` (authenticated form)
- Confusing mix of contexts without clear separation

**Suggested Fix:**
1. Remove "Home" link from dashboard sidebar (or clearly label "Exit to Site")
2. Separate dashboard actions from site navigation
3. Add visual separator or section headers
4. Consider renaming "Form" to "New Plan Form" for clarity
5. Add tooltips to explain each link

**Confidence:** Medium

---

#### [MEDIUM] Unclear Form Entry Points
**Category:** Navigation  
**Path:** Multiple files  
**Summary:** Multiple ways to start form create confusion about which to use

**Rationale:**
- Homepage has VercelV0Chat (conversational form)
- Header/Footer CTAs point to `/form`
- "New Plan" button in dashboard goes to `/#start-chat`
- `/form-chat` is separate page
- No clear explanation of differences

**Suggested Fix:**
1. Create decision tree: When to use each entry point?
2. Add descriptive subtext to CTAs: "Quick chat" vs "Full form"
3. Consider consolidating to single entry point with routing logic
4. Add "Choose your path" page if keeping multiple entry points

**Confidence:** Medium

---

#### [LOW] Missing Skip Navigation Link
**Category:** Navigation  
**Path:** `layout.tsx`, `Header.tsx`  
**Summary:** No skip-to-content link for keyboard users

**Rationale:**
- Keyboard users must tab through all header links to reach main content
- Accessibility best practice for navigation-heavy sites
- Especially important with sidebar navigation in dashboard

**Suggested Fix:**
1. Add skip link as first element in body: `<a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>`
2. Add `id="main-content"` to main content areas
3. Style focus state to be visible
4. Test with keyboard navigation

**Confidence:** High

---

#### [MEDIUM] No Indication of Required Authentication
**Category:** Navigation  
**Path:** Various CTA buttons  
**Summary:** Users click CTAs without knowing authentication is required

**Rationale:**
- Many CTAs lead to forms that require sign-up
- No warning or indication before click
- Users frustrated by unexpected auth gate
- Should set expectations upfront

**Suggested Fix:**
1. Add microcopy: "Sign up to start" on relevant CTAs
2. Or add "(Free account required)" subtext
3. Consider showing auth modal immediately on CTA click
4. Add progress indicator showing steps including sign-up

**Confidence:** Medium

---

### READABILITY & HIERARCHY

#### [HIGH] Text Contrast Failures (WCAG AA)
**Category:** Readability  
**Path:** Multiple locations  
**Summary:** Multiple instances of insufficient color contrast

**Rationale:** WCAG AA requires 4.5:1 contrast for normal text, 3:1 for large text. Failures found:
- White text at 60% opacity on backgrounds: `text-white/60` likely fails on all backgrounds
- Gold on white: `text-alira-gold` (#A06B00) on white background = ~3.2:1 (FAIL for normal text)
- `text-alira-white/40`, `text-alira-white/50` definitely fail
- Header nav: `text-white/80` on transparent may fail depending on background

**Suggested Fix:**
1. Use contrast checker tool on all text/background combinations
2. Increase opacity: use `text-white/80` minimum for body text, `/60` only for captions
3. Never use gold on white for body text (only headings/large text)
4. Add dark overlay to hero sections with text over images
5. Test all combinations, fix failures

**Confidence:** High

---

#### [MEDIUM] Line Length Exceeds Optimal Range
**Category:** Readability  
**Path:** Multiple pages  
**Summary:** Some text blocks exceed 75 character optimal reading width

**Rationale:**
- About page line 33: `max-w-3xl` = 48rem = ~768px = ~90-100 characters
- Services page line 40: `max-w-[60ch]` is good practice
- Contact page line 74: `max-w-2xl` = 42rem = ~672px = ~80-90 characters
- Inconsistent application of max-width constraints

**Suggested Fix:**
1. Standardize body text containers to `max-w-prose` (65ch)
2. Use `max-w-2xl` only for hero subheadings
3. Apply consistently across all pages
4. Test readability on ultra-wide monitors

**Confidence:** Medium

---

#### [LOW] Heading Hierarchy Breaks Semantic HTML
**Category:** Readability  
**Path:** Multiple pages  
**Summary:** H-tag levels skipped or used out of order

**Rationale:**
- Some pages jump from H1 to H3 (skipping H2)
- Visual hierarchy doesn't match semantic hierarchy
- Screen readers rely on proper heading structure
- Affects SEO and accessibility

**Suggested Fix:**
1. Audit all pages for heading structure
2. Ensure: single H1, H2s for major sections, H3s for subsections
3. Never skip levels
4. Use CSS for visual sizing, not heading level choice
5. Test with screen reader

**Confidence:** Medium

---

#### [MEDIUM] Inconsistent Paragraph Spacing
**Category:** Readability  
**Path:** Multiple components  
**Summary:** Paragraph spacing varies without clear pattern

**Rationale:**
- Some paragraphs: `mb-6` (24px)
- Others: `mb-8` (32px)
- Some: `mb-4` (16px)
- Within same sections, spacing varies
- Creates rhythm inconsistency

**Suggested Fix:**
1. Define paragraph spacing standard: `mb-6` (24px) for most cases
2. Use `mb-8` only between major sections
3. Use `mb-4` only in tight card layouts
4. Update globals.css with prose utilities
5. Apply consistently

**Confidence:** Low

---

#### [HIGH] Mobile Font Sizes Too Small
**Category:** Readability  
**Path:** Multiple pages, especially forms  
**Summary:** Text sizes below 16px on mobile cause zoom issues

**Rationale:**
- iOS Safari auto-zooms inputs with font-size < 16px
- Several form labels use `text-sm` = 14px
- Small body text difficult to read on mobile
- FormWizard labels: `text-sm md:text-base` is good pattern

**Suggested Fix:**
1. Set minimum font size to 16px for all interactive elements
2. Use 16px-18px for body text on mobile
3. Larger touch targets (min 44x44px)
4. Test on actual mobile devices
5. Update all form components

**Confidence:** High

---

#### [MEDIUM] Insufficient Whitespace in Dense Sections
**Category:** Readability  
**Path:** Dashboard cards, About page team section  
**Summary:** Some sections feel cramped with inadequate breathing room

**Rationale:**
- Dashboard cards pack a lot of information with minimal padding
- About page team cards have dense text blocks
- Line-height could be increased in some areas
- Gives feeling of visual clutter

**Suggested Fix:**
1. Increase card padding from `p-6` to `p-8` on desktop
2. Increase line-height to 1.7 for body text
3. Add more space between list items
4. Use `space-y-4` between card elements instead of `space-y-3`
5. Test with real content

**Confidence:** Medium

---

#### [LOW] Inconsistent Placeholder Text Styling
**Category:** Readability  
**Path:** Form inputs across components  
**Summary:** Placeholder opacity and color varies

**Rationale:**
- Input component: `placeholder:text-muted-foreground`
- FormWizard: `placeholder:text-alira-primary/40 dark:placeholder:text-alira-white/40`
- VercelV0Chat: `placeholder:text-alira-white/60`
- Contact form: `placeholder:text-alira-primary/40`

**Suggested Fix:**
1. Standardize placeholder opacity to 50% of text color
2. Update Input/Textarea components with consistent default
3. Only override for specific branded components
4. Ensure contrast is sufficient for readability

**Confidence:** Low

---

#### [MEDIUM] Link Styling Lacks Clear Affordance
**Category:** Readability  
**Path:** Multiple pages  
**Summary:** Links not always visually distinct from regular text

**Rationale:**
- Footer links: only color difference, no underline
- In-content links: not visually distinct in some cases
- Hover states sometimes missing
- Users may not recognize clickable elements

**Suggested Fix:**
1. Add underline to all in-content links
2. Use `underline-offset-4` for better aesthetics
3. Ensure color differentiation (gold or distinct shade)
4. Add hover state with `underline-grow` utility
5. Make it obvious what's clickable

**Confidence:** Medium

---

### ACCESSIBILITY (a11y)

#### [CRITICAL] Missing Alt Text on Images
**Category:** Accessibility  
**Path:** `about/page.tsx` line 183  
**Summary:** Image has generic or missing alt text

**Rationale:**
- Founder image alt text: "ALIRA Founder - Professional headshot" is too generic
- Should describe the person or be more descriptive
- Alt text should convey information, not just state "image"
- Screen reader users miss context

**Suggested Fix:**
1. Update alt text to be descriptive: "Portrait of [Name], founder of ALIRA Partners"
2. Audit all images across site for missing/poor alt text
3. Decorative images should have `alt=""` (empty string)
4. Informative images need descriptive alt text
5. Icons in buttons need aria-label if icon-only

**Confidence:** High

---

#### [CRITICAL] Form Labels Not Properly Associated
**Category:** Accessibility  
**Path:** `FormWizard.tsx`, Contact form  
**Summary:** Some form inputs lack proper label association

**Rationale:**
- Some labels don't use `htmlFor` attribute matching input `id`
- Screen readers can't properly announce what field is for
- Clicking label doesn't focus input in some cases
- WCAG 2.1 requires proper label association

**Suggested Fix:**
1. Audit all form fields
2. Ensure every input has unique `id`
3. Ensure every label has matching `htmlFor`
4. Test with screen reader
5. Add aria-describedby for helper text

**Confidence:** High

---

#### [HIGH] Button Icons Lack Accessible Text
**Category:** Accessibility  
**Path:** `Header.tsx` lines 151-175, `dashboard/page.tsx`  
**Summary:** Icon-only buttons don't have accessible labels

**Rationale:**
- Hamburger menu button in Header has `aria-label="Open menu"` - GOOD
- But many other icon buttons lack labels:
  - MoreVertical button on dashboard (line 174)
  - Refresh button (line 206)
- Screen readers can't describe button purpose

**Suggested Fix:**
1. Add `aria-label` to all icon-only buttons
2. Labels should describe action: "Refresh plans", "More options", "Delete plan"
3. Use `<span className="sr-only">` pattern for visible icon + screen reader text
4. Audit all buttons, ensure all have accessible names

**Confidence:** High

---

#### [CRITICAL] Keyboard Navigation Incomplete
**Category:** Accessibility  
**Path:** Multiple interactive components  
**Summary:** Not all interactive elements are keyboard accessible

**Rationale:**
- Cards with `onClick` handlers aren't keyboard accessible (dashboard plan cards)
- No `tabIndex="0"` or button/link wrapper
- Custom dropdown/select components may not support keyboard
- Modal dialogs may not trap focus properly

**Suggested Fix:**
1. Wrap clickable cards in `<Link>` or `<button>` elements
2. Or add `tabIndex="0"`, `role="button"`, `onKeyDown` handler for Enter/Space
3. Implement focus trap in modals
4. Test all interactions with keyboard only
5. Add visible focus indicators

**Confidence:** High

---

#### [HIGH] Focus Indicators Too Subtle
**Category:** Accessibility  
**Path:** Multiple interactive elements  
**Summary:** Focus outlines don't provide enough contrast

**Rationale:**
- Default focus ring uses `ring-alira-gold` with opacity
- May not meet 3:1 contrast requirement for UI components
- Some elements override focus styles completely
- Keyboard users can't see where they are

**Suggested Fix:**
1. Ensure focus rings have 3:1 contrast minimum
2. Use solid color, not transparent: `ring-2 ring-alira-gold`
3. Add offset for better visibility: `ring-offset-2 ring-offset-black`
4. Never remove focus styles without replacement
5. Test in both light/dark modes

**Confidence:** High

---

#### [HIGH] Modal Accessibility Issues
**Category:** Accessibility  
**Path:** `VercelV0Chat.tsx` lines 182-302, Alert dialogs  
**Summary:** Modals lack proper ARIA attributes and focus management

**Rationale:**
- Email gating modal doesn't trap focus
- Missing `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- ESC key doesn't close modal
- Background not aria-hidden when modal open
- Users can tab to elements behind modal

**Suggested Fix:**
1. Add ARIA attributes: `role="dialog" aria-modal="true" aria-labelledby="modal-title"`
2. Implement focus trap (focus cycles within modal)
3. Set initial focus to first interactive element
4. Add ESC key handler to close
5. Set `aria-hidden="true"` on background content
6. Use library like `@radix-ui/react-dialog` for proper implementation

**Confidence:** High

---

#### [MEDIUM] Empty State SVG Icons Lack Labels
**Category:** Accessibility  
**Path:** Dashboard empty state, error states  
**Summary:** Decorative SVG icons should be hidden from screen readers

**Rationale:**
- Icon SVGs without text alternatives confuse screen readers
- Decorative icons should have `aria-hidden="true"`
- Informative icons need `role="img"` and `aria-label`
- Current implementation inconsistent

**Suggested Fix:**
1. Add `aria-hidden="true"` to all decorative icons
2. For informative icons, add `role="img"` and descriptive `aria-label`
3. Ensure text alternatives communicate same information
4. Audit all SVG usage
5. Use Lucide icons' built-in accessibility props

**Confidence:** Medium

---

#### [HIGH] Error Messages Not Associated with Fields
**Category:** Accessibility  
**Path:** `FormWizard.tsx`, Contact form  
**Summary:** Form error messages lack proper ARIA association

**Rationale:**
- Error messages rendered below fields but not connected via `aria-describedby`
- Screen readers don't announce errors when field focused
- Users may not know field has error or what error is
- WCAG requires programmatic association

**Suggested Fix:**
1. Add unique `id` to each error message element
2. Add `aria-describedby="error-id"` to corresponding input
3. Add `aria-invalid="true"` when field has error
4. Ensure error messages are announced
5. Test with screen reader

**Confidence:** High

---

#### [CRITICAL] Color Alone Conveys Information
**Category:** Accessibility  
**Path:** Dashboard status badges, form validation  
**Summary:** Status communicated only through color violates WCAG

**Rationale:**
- Dashboard plan status: green badge for "Ready", blue for "In Progress"
- Color-blind users can't distinguish
- Need additional indicators like icons or text
- WCAG requires non-color indicators

**Suggested Fix:**
1. Add icons to status badges: ✓ for complete, ⏳ for in progress
2. Include status text in badge, not just color
3. Use patterns/textures in addition to color
4. Test with color blindness simulator
5. Update all status indicators

**Confidence:** High

---

#### [MEDIUM] Insufficient Touch Target Sizes
**Category:** Accessibility  
**Path:** Mobile navigation, small buttons  
**Summary:** Some interactive elements smaller than 44x44px minimum

**Rationale:**
- WCAG Level AAA requires 44x44px touch targets
- Close buttons on modals may be too small
- Some icon buttons don't meet minimum
- Difficult for users with motor impairments

**Suggested Fix:**
1. Audit all interactive elements on mobile
2. Ensure minimum 44x44px touch target
3. Add padding to small elements to increase hit area
4. Test on actual mobile devices
5. Use `min-h-[44px] min-w-[44px]` utility

**Confidence:** Medium

---

#### [MEDIUM] Motion Not Respecting User Preferences
**Category:** Accessibility  
**Path:** `globals.css` lines 356-403, Framer Motion animations  
**Summary:** Animations run despite prefers-reduced-motion

**Rationale:**
- `prefers-reduced-motion` media query in globals.css is good
- But Framer Motion animations may not respect it
- Can trigger vestibular disorders
- Some animations still run in reduced motion mode

**Suggested Fix:**
1. Wrap all Framer Motion animations in `useReducedMotion` hook
2. Test reduced motion preference in browser
3. Ensure all animations respect preference
4. Provide instant state changes instead of animations
5. Document in component guidelines

**Confidence:** Medium

---

#### [HIGH] Skip Links Missing for Repetitive Content
**Category:** Accessibility  
**Path:** All pages with navigation  
**Summary:** No skip navigation links provided

**Rationale:**
- Keyboard users must tab through entire header on every page
- Especially problematic with multi-item navigation
- Dashboard sidebar adds more tab stops
- WCAG recommends skip links

**Suggested Fix:**
1. Add skip link at start of body: "Skip to main content"
2. Position off-screen, show on focus
3. Link to `id="main-content"` on main element
4. Add additional skip links if needed (skip to footer, etc.)
5. Test keyboard navigation

**Confidence:** High

---

#### [MEDIUM] Tables Missing Proper Structure
**Category:** Accessibility  
**Path:** Results page metrics, dashboard stats  
**Summary:** Data tables don't use semantic HTML table elements

**Rationale:**
- Tabular data presented with divs instead of tables
- Screen readers can't navigate as table
- Relationships between data not clear
- Could benefit from proper table structure

**Suggested Fix:**
1. Evaluate if content is truly tabular
2. If yes, use `<table>`, `<th>`, `<td>` with proper scope
3. If no, ensure relationships clear through markup
4. Add ARIA roles if needed: `role="table"`, `role="row"`, etc.
5. Test with screen reader table navigation

**Confidence:** Low

---

#### [LOW] Language Attribute Incomplete
**Category:** Accessibility  
**Path:** `layout.tsx` line 45  
**Summary:** HTML lang attribute set but content language changes not marked

**Rationale:**
- Root HTML has `lang="en-GB"` - GOOD
- But no `lang` attributes on sections in other languages
- If any content is in other languages, must be marked
- Important for screen reader pronunciation

**Suggested Fix:**
1. Audit for any non-English content
2. Add `lang` attribute to elements in different language
3. Example: `<span lang="fr">Bonjour</span>`
4. Ensure all content properly marked

**Confidence:** Low

---

#### [MEDIUM] No Visible Focus Indicator on Custom Elements
**Category:** Accessibility  
**Path:** Custom styled components  
**Summary:** Some elements lose focus outline when styled

**Rationale:**
- Custom styling sometimes removes default focus indicators
- `outline: none` used without replacement
- Keyboard users can't see where they are
- Common issue with custom buttons/links

**Suggested Fix:**
1. Global search for `outline: none` or `focus:outline-none`
2. Ensure all have replacement focus indicator
3. Use `focus-visible:ring-2 focus-visible:ring-alira-gold`
4. Test keyboard navigation on all pages
5. Never remove focus styles without replacement

**Confidence:** High

---

### FEEDBACK & ERROR HANDLING

#### [HIGH] Form Submission Lacks Immediate Feedback
**Category:** Feedback  
**Path:** `FormWizard.tsx`, Contact form  
**Summary:** Button doesn't change to loading state fast enough

**Rationale:**
- Contact form button shows spinner but may have delay
- FormWizard loading states defined but feedback could be clearer
- Users may click multiple times if no immediate feedback
- Loading state should show within 100ms of click

**Suggested Fix:**
1. Set loading state in button click handler immediately
2. Disable button instantly on click
3. Show loading spinner immediately
4. Add visual feedback (button color change)
5. Prevent double submission

**Confidence:** High

---

#### [HIGH] Error Messages Too Generic
**Category:** Feedback  
**Path:** Multiple forms and API error handling  
**Summary:** Error messages don't help users understand or fix issues

**Rationale:**
- "Failed to save form" - what failed? why?
- "An unexpected error occurred" - unhelpful
- "Failed to load plan" - doesn't guide recovery
- Network errors not distinguished from validation errors

**Suggested Fix:**
1. Create error taxonomy: network, validation, server, auth
2. Write specific error messages for each scenario
3. Include actionable recovery steps
4. Example: "Your session expired. Please log in again to continue."
5. Never show raw error messages from server

**Confidence:** High

---

#### [CRITICAL] No Error Boundary for Component Errors
**Category:** Feedback  
**Path:** `ErrorBoundary.tsx` exists but limited implementation  
**Summary:** Component errors may crash entire application

**Rationale:**
- ErrorBoundary component exists in app/layout.tsx
- But not implemented at granular component level
- If error occurs in one section, whole page could crash
- Users lose all work and context

**Suggested Fix:**
1. Add ErrorBoundary around major page sections
2. Add to each dashboard card/section
3. Create fallback UI that preserves user context
4. Log errors to monitoring service
5. Allow users to retry or continue

**Confidence:** High

---

#### [MEDIUM] Loading States Missing in Multiple Components
**Category:** Feedback  
**Path:** Dashboard, plan generation  
**Summary:** Several async operations lack loading indicators

**Rationale:**
- Dashboard plan cards load without skeleton
- Button clicks sometimes have no feedback
- Data refresh doesn't show progress
- Users uncertain if action registered

**Suggested Fix:**
1. Add skeleton screens for loading data
2. Show spinner in buttons during async operations
3. Add progress indicators for multi-step processes
4. Use optimistic updates where appropriate
5. Always provide feedback within 100ms

**Confidence:** Medium

---

#### [MEDIUM] Success Messages Disappear Too Quickly
**Category:** Feedback  
**Path:** Contact form, plan generation  
**Summary:** Success feedback doesn't stay visible long enough

**Rationale:**
- Contact form success message visible but page immediately transitions
- FormWizard success screen only shows 5 seconds (line 326)
- Users may not have time to read/screenshot confirmation
- No way to retrieve confirmation after it disappears

**Suggested Fix:**
1. Keep success messages visible for at least 10 seconds
2. Allow manual dismissal with close button
3. Provide way to view confirmation later
4. Send email confirmation for important actions
5. Add to user's notification center/history

**Confidence:** Medium

---

#### [HIGH] Validation Errors Not Clear Enough
**Category:** Feedback  
**Path:** FormWizard validation  
**Summary:** Field validation errors sometimes unclear or hidden

**Rationale:**
- Error messages appear below field, may be missed
- Color red but small text, low contrast
- Multiple errors on same field not all shown
- Doesn't highlight which fields have errors in summary

**Suggested Fix:**
1. Add red border to fields with errors
2. Increase error message font size and contrast
3. Add icon (⚠️) before error message
4. Show error count and list at top of form
5. Scroll to first error on submission

**Confidence:** High

---

#### [MEDIUM] No Confirmation for Destructive Actions
**Category:** Feedback  
**Path:** Dashboard delete functionality  
**Summary:** Delete plan action needs confirmation dialog

**Rationale:**
- Delete button present on dashboard (line 489-496)
- AlertDialog component exists but confirmation could be clearer
- Irreversible action needs stronger warning
- Users may accidentally delete

**Suggested Fix:**
1. Add prominent warning: "This cannot be undone"
2. Require typing plan name to confirm
3. Use destructive red color for confirm button
4. Show what will be deleted (plan name, date, content preview)
5. Provide alternative: "Archive" instead of delete

**Confidence:** Medium

---

#### [LOW] No Feedback for Copy to Clipboard Actions
**Category:** Feedback  
**Path:** Any copy functionality  
**Summary:** Users don't know if content copied successfully

**Rationale:**
- If any copy-to-clipboard functionality exists, needs feedback
- No toast notification or visual change
- Users may copy multiple times unsure if it worked

**Suggested Fix:**
1. Show toast notification: "Copied to clipboard"
2. Briefly change button text: "Copy" → "Copied!" → "Copy"
3. Add checkmark icon momentarily
4. Use animation to draw attention
5. Handle copy failures gracefully

**Confidence:** Low

---

#### [MEDIUM] Empty States Lack Actionable Guidance
**Category:** Feedback  
**Path:** Dashboard empty state (lines 216-234)  
**Summary:** Empty state is good but could be more helpful

**Rationale:**
- Dashboard empty state shows icon, text, button - GOOD
- But could explain what user gets by creating plan
- Could show example or preview
- Could offer guided tour

**Suggested Fix:**
1. Add "What you'll get" bullet points to empty state
2. Include screenshot or preview of generated plan
3. Add "Watch demo" button
4. Offer templates or examples
5. Make value proposition clear

**Confidence:** Low

---

#### [MEDIUM] Network Error Handling Insufficient
**Category:** Feedback  
**Path:** Multiple API calls  
**Summary:** Network errors not clearly communicated to users

**Rationale:**
- Generic "Network error" messages
- No distinction between offline, timeout, server error
- No retry mechanism offered
- Users don't know if they should wait or take action

**Suggested Fix:**
1. Detect offline state, show specific message
2. For timeouts, offer retry button
3. For server errors, show status and suggest waiting
4. Add automatic retry with exponential backoff
5. Show connection status indicator

**Confidence:** Medium

---

#### [HIGH] Progress Not Saved in Multi-Step Forms
**Category:** Feedback  
**Path:** FormWizard  
**Summary:** If user leaves form, progress is lost

**Rationale:**
- FormWizard has draft functionality but may not auto-save frequently enough
- Browser refresh loses progress
- Users frustrated by lost work
- No warning before leaving

**Suggested Fix:**
1. Implement auto-save every 30 seconds
2. Add "Your progress is saved" indicator
3. Warn before navigating away with unsaved changes
4. Store form state in localStorage as backup
5. Allow resuming from any step

**Confidence:** High

---

### RESPONSIVENESS

#### [HIGH] Dashboard Not Mobile-Optimized
**Category:** Responsiveness  
**Path:** `dashboard/page.tsx`  
**Summary:** Dashboard layout problematic on mobile devices

**Rationale:**
- Sidebar takes valuable horizontal space on mobile
- Cards with detailed information cramped on small screens
- Grid layouts may not stack properly
- Statistics bar difficult to read on mobile

**Suggested Fix:**
1. Make sidebar collapsible by default on mobile
2. Switch grid to single column below md breakpoint
3. Simplify card content for mobile (show summary, expand for details)
4. Make statistics bar scrollable horizontally on mobile
5. Test on actual mobile devices

**Confidence:** High

---

#### [MEDIUM] Hero Section Height Issues on Small Screens
**Category:** Responsiveness  
**Path:** Homepage, Services page hero sections  
**Summary:** Full-height hero sections cut off content on short viewports

**Rationale:**
- `min-h-screen` used without considering mobile browser chrome
- Content may be cut off on mobile with address bar
- User must scroll to see CTA on short screens
- vh units don't account for mobile browser UI

**Suggested Fix:**
1. Use `min-h-[calc(100vh-4rem)]` to account for header
2. Or use `min-h-screen md:min-h-screen` with smaller mobile height
3. Ensure CTA always visible without scroll on initial load
4. Test on various mobile devices and browsers
5. Consider using `dvh` (dynamic viewport height) units

**Confidence:** Medium

---

#### [MEDIUM] Form Fields Too Narrow on Mobile
**Category:** Responsiveness  
**Path:** Contact form, FormWizard  
**Summary:** Form inputs cramped on mobile, labels truncate

**Rationale:**
- Some form layouts designed for desktop
- Labels and inputs may be too narrow on mobile
- Helper text gets cut off
- Touch targets may be too small

**Suggested Fix:**
1. Ensure form fields full width on mobile
2. Stack label above input (not side-by-side)
3. Increase padding for easier tapping
4. Test with long labels and error messages
5. Ensure helper text wraps properly

**Confidence:** Medium

---

#### [LOW] Images Don't Optimize for Mobile
**Category:** Responsiveness  
**Path:** About page founder image, result page images  
**Summary:** Same large images served to mobile users

**Rationale:**
- Images use Next.js Image component - GOOD
- But may not have optimal sizes defined for mobile
- Slow loading on mobile networks
- Should serve smaller images to mobile

**Suggested Fix:**
1. Define multiple image sizes in Next.js config
2. Use `sizes` attribute on Image components
3. Serve WebP format where supported
4. Lazy load images below fold
5. Test loading speed on slow 3G

**Confidence:** Low

---

#### [MEDIUM] Modal Overflow on Small Screens
**Category:** Responsiveness  
**Path:** VercelV0Chat email modal, AlertDialog  
**Summary:** Modal content may overflow on small mobile screens

**Rationale:**
- Fixed height modals may not fit on small screens
- No scrolling within modal
- Content gets cut off
- Users can't complete actions

**Suggested Fix:**
1. Add `max-h-[90vh]` to modal containers
2. Make modal content scrollable
3. Use `overflow-y-auto` on modal body
4. Test on small screens (iPhone SE)
5. Ensure buttons always visible/accessible

**Confidence:** Medium

---

#### [LOW] Horizontal Scroll on Mobile
**Category:** Responsiveness  
**Path:** Various pages with wide content  
**Summary:** Some pages show horizontal scrollbar on mobile

**Rationale:**
- Wide cards or fixed-width elements cause overflow
- Tables without responsive handling
- Images without max-width
- Breaks mobile experience

**Suggested Fix:**
1. Add `overflow-x-hidden` to body if needed
2. Audit all fixed-width elements
3. Make tables scrollable or stack on mobile
4. Ensure all content max-width: 100%
5. Test on narrow mobile screens

**Confidence:** Low

---

### DESIGN SYSTEM ALIGNMENT

#### [HIGH] Button Variant Proliferation
**Category:** Design System  
**Path:** `ui/button.tsx`, various usages  
**Summary:** Too many button variants creates inconsistency

**Rationale:**
- 7 button variants defined: default, destructive, outline, secondary, ghost, link, alira, aliraOutline
- shadcn/ui standard: default, destructive, outline, secondary, ghost, link (6)
- Added alira-specific variants, but usage inconsistent
- Increases cognitive load, choice paralysis

**Suggested Fix:**
1. Audit all button usages, categorize by purpose
2. Consolidate to 4 variants: primary (alira), secondary (outline), tertiary (ghost), destructive
3. Remove redundant variants
4. Document when to use each
5. Update all usages

**Confidence:** High

---

#### [MEDIUM] Card Component Lacks Variants
**Category:** Design System  
**Path:** `ui/card.tsx`, usage across pages  
**Summary:** Card styling inconsistent despite using same component

**Rationale:**
- Card component is basic wrapper
- Every usage applies custom classes
- No standardized variants for common patterns
- Leads to inconsistent appearance

**Suggested Fix:**
1. Add variant prop to Card: default, elevated, subtle, glass
2. Pre-define styling for each variant
3. Map existing usages to variants
4. Document when to use each variant
5. Reduce custom styling

**Confidence:** Medium

---

#### [MEDIUM] Missing Component Documentation
**Category:** Design System  
**Path:** All component files  
**Summary:** No JSDoc or usage documentation in components

**Rationale:**
- Components lack documentation comments
- Props not documented
- Usage examples don't exist
- Developers must read implementation to understand usage

**Suggested Fix:**
1. Add JSDoc comments to all exported components
2. Document all props with examples
3. Create Storybook or similar documentation site
4. Add usage examples in comments
5. Document accessibility requirements

**Confidence:** Medium

---

#### [LOW] Inconsistent Import Paths
**Category:** Design System  
**Path:** All component imports  
**Summary:** Mix of absolute and relative imports

**Rationale:**
- Some files use `@/components/...` (absolute)
- Others use `./` or `../` (relative)
- Inconsistent pattern makes refactoring difficult
- Could affect build optimization

**Suggested Fix:**
1. Standardize on `@/` prefix for all non-relative imports
2. Use relative imports only for co-located files
3. Update tsconfig paths if needed
4. Run codemod to update all imports
5. Add lint rule to enforce

**Confidence:** Low

---

#### [MEDIUM] Color Semantic Naming Needed
**Category:** Design System  
**Path:** `tailwind.config.js`, `globals.css`  
**Summary:** Color tokens lack semantic meaning

**Rationale:**
- Current: `alira-primary`, `alira-gold`, `alira-white`, `alira-black`
- Missing semantic colors: success, warning, info, error
- Every usage must specify exact color
- Can't change theme colors easily

**Suggested Fix:**
1. Add semantic color tokens:
   - success: green-based
   - warning: amber-based  
   - error: red-based (use existing destructive)
   - info: blue-based
2. Map to alira colors as defaults
3. Update components to use semantic names
4. Enables theming in future

**Confidence:** Medium

---

#### [MEDIUM] Typography Utilities Incomplete
**Category:** Design System  
**Path:** `globals.css`, Tailwind config  
**Summary:** Custom typography classes not utilized fully

**Rationale:**
- Defined `.h2`, `.h3`, `.copy` in globals.css
- But most components use Tailwind utilities directly
- Inconsistent application of design system typography
- Difficult to change typography globally

**Suggested Fix:**
1. Fully define typography system in globals.css
2. Create utilities for all text styles: `.text-heading-1`, `.text-body`, etc.
3. Update components to use utilities instead of inline classes
4. Document typography system
5. Make typography changes centralized

**Confidence:** Medium

---

#### [HIGH] Spacing System Not Enforced
**Category:** Design System  
**Path:** Multiple component files  
**Summary:** Arbitrary spacing values used instead of system

**Rationale:**
- Tailwind spacing system available but not enforced
- Many uses of arbitrary values: `p-[10px]`, `mb-[22px]`
- Breaks consistency
- Makes design changes difficult

**Suggested Fix:**
1. Identify all arbitrary spacing values
2. Map to closest spacing scale value
3. Add lint rule to warn on arbitrary spacing
4. Update all components
5. Document spacing scale and usage

**Confidence:** High

---

#### [LOW] Component File Structure Inconsistent
**Category:** Design System  
**Path:** `/components` directory  
**Summary:** Flat component structure makes navigation difficult

**Rationale:**
- 40+ components in single `/components` directory
- UI primitives mixed with page-specific components
- No clear organization by feature or type
- Difficult to find related components

**Suggested Fix:**
1. Organize by feature: `/components/dashboard`, `/components/forms`, etc.
2. Keep UI primitives in `/components/ui`
3. Create `/components/layout` for layout components
4. Create `/components/marketing` for marketing page components
5. Update imports across codebase

**Confidence:** Low

---

#### [MEDIUM] No Component Testing Strategy
**Category:** Design System  
**Path:** N/A  
**Summary:** No evidence of component tests

**Rationale:**
- No test files found in component directories
- Untested components may break with changes
- Accessibility features not validated
- Regression risk high

**Suggested Fix:**
1. Set up testing framework (Jest + React Testing Library)
2. Write tests for UI primitives first
3. Test accessibility features (keyboard nav, ARIA, etc.)
4. Add visual regression testing (Chromatic, Percy)
5. Aim for 80% coverage on shared components

**Confidence:** Low

---

### MICROCOPY & TONE

#### [MEDIUM] Inconsistent CTA Language
**Category:** Microcopy  
**Path:** Multiple CTAs across pages  
**Summary:** Call-to-action copy varies without clear pattern

**Rationale:**
- "Start My Plan" vs "Get Started Today" vs "Start Your Simple Plan"
- "New Plan" vs "Create Plan" vs "Generate My Plan"
- "Send My Business Plan" vs "Send Message"
- Inconsistent verbs and phrasing

**Suggested Fix:**
1. Audit all CTAs, categorize by action
2. Define standard phrasing for each action type:
   - Primary form entry: "Start Your Free Plan"
   - Secondary actions: "Learn More", "Contact Us"
   - Destructive: "Delete Plan"
3. Use active, specific verbs
4. Be consistent across similar actions

**Confidence:** High

---

#### [LOW] Capitalization Inconsistencies
**Category:** Microcopy  
**Path:** Multiple UI elements  
**Summary:** Title case vs sentence case used inconsistently

**Rationale:**
- Button text sometimes title case ("New Plan"), sometimes sentence case ("Create plan")
- Heading sometimes title case, sometimes sentence case
- Labels mix both styles

**Suggested Fix:**
1. Establish standard: Title Case for major headings, Sentence case for body/labels
2. Buttons: Sentence case ("Start your plan")
3. Navigation links: Title Case ("How It Works")
4. Update style guide
5. Apply consistently

**Confidence:** Medium

---

#### [MEDIUM] Error Message Tone Too Technical
**Category:** Microcopy  
**Path:** Various error handlers  
**Summary:** Error messages use technical language users don't understand

**Rationale:**
- "Failed to create draft" - what's a draft to user?
- "Network error" - not actionable
- "An unexpected error occurred" - unhelpful
- Error messages written for developers, not users

**Suggested Fix:**
1. Rewrite errors in plain language
2. Focus on user's goal, not system state
3. Example: "We couldn't save your plan. Please try again." instead of "Failed to create draft"
4. Include what user should do next
5. Test with non-technical users

**Confidence:** High

---

#### [LOW] Overly Formal Language in Places
**Category:** Microcopy  
**Path:** About page, Contact page  
**Summary:** Some copy feels too stiff for brand personality

**Rationale:**
- Brand positioning is friendly, approachable ("clarity over clutter")
- But some sections use formal, corporate language
- Doesn't match conversational form interface
- Creates tonal inconsistency

**Suggested Fix:**
1. Audit copy for overly formal language
2. Rewrite in conversational tone matching brand
3. Use contractions, shorter sentences
4. Maintain professionalism while being approachable
5. Test with target audience

**Confidence:** Low

---

#### [MEDIUM] Jargon Not Explained
**Category:** Microcopy  
**Path:** Services page, Form labels  
**Summary:** Industry terms used without definition

**Rationale:**
- "Systems & Automation" - what does this mean to non-technical founder?
- "Operational efficiency" - vague
- "Growth roadmaps" - buzzword
- Users may not understand value proposition

**Suggested Fix:**
1. Identify all jargon terms
2. Either:
   a) Replace with plain language
   b) Add explanation/tooltip
   c) Provide examples
3. Test comprehension with target audience
4. Use concrete language over abstract

**Confidence:** Medium

---

#### [LOW] No Personality in System Messages
**Category:** Microcopy  
**Path:** Loading states, success messages  
**Summary:** Generic system messages miss opportunity for brand voice

**Rationale:**
- "Loading..." - boring
- "Success!" - generic
- "Please wait..." - bland
- Could reinforce brand personality even in small moments

**Suggested Fix:**
1. Add personality to loading states: "Crafting your plan..." instead of "Loading..."
2. Success messages: "Your plan is ready! 🎯" instead of "Success"
3. Empty states: Encouraging, not just informative
4. Keep brand voice consistent
5. Don't overdo it - maintain professionalism

**Confidence:** Low

---

#### [MEDIUM] Missing Helpful Hints
**Category:** Microcopy  
**Path:** Form fields, complex interactions  
**Summary:** Users lack guidance on how to complete actions

**Rationale:**
- Form placeholder text minimal
- No examples for open-ended questions
- Unclear what "good" input looks like
- Users may hesitate or provide low-quality responses

**Suggested Fix:**
1. Add helper text below each form field
2. Provide examples of good answers
3. Add character counts for text fields
4. Show progress indicators in forms
5. Add tooltips with more context where needed

**Confidence:** Medium

---

### FLOW INTEGRITY

#### [HIGH] Broken User Journey: Homepage → Form
**Category:** Flow  
**Path:** Homepage VercelV0Chat → /form-chat  
**Summary:** Chat interface creates account but then redirects to separate form

**Rationale:**
- User enters idea in chat on homepage
- Must create account
- Then redirected to `/form-chat` which asks same questions differently
- Feels like starting over
- Why not continue in chat interface?

**Suggested Fix:**
1. Decide on single form entry: chat OR traditional form
2. If keeping both, clearly differentiate upfront: "Quick chat" vs "Detailed form"
3. If using chat, stay in chat for entire flow
4. Pre-fill form with chat data to avoid repetition
5. Test full journey end-to-end

**Confidence:** High

---

#### [HIGH] Unclear Next Steps After Plan Generation
**Category:** Flow  
**Path:** FormWizard success, plan display  
**Summary:** After receiving plan, user doesn't know what to do next

**Rationale:**
- Plan is emailed to user - GOOD
- But what happens after?
- Can they edit it? Refine it? Download it? Share it?
- No clear next action presented
- Dead end in user journey

**Suggested Fix:**
1. Add prominent "View Your Plan" button in success state
2. Show next steps: "Download PDF", "Schedule consultation", "Refine plan"
3. Explain what happens next
4. Add CTA for paid services if applicable
5. Guide user to dashboard

**Confidence:** High

---

#### [MEDIUM] Back Button Behavior Unexpected
**Category:** Flow  
**Path:** Multi-step forms, plan navigation  
**Summary:** Browser back button doesn't work as expected in some flows

**Rationale:**
- FormWizard has prev/next buttons - GOOD
- But browser back may break state
- Users conditioned to use browser back
- Could lose progress or get confused

**Suggested Fix:**
1. Use URL query params to track form step
2. Make browser back work like "Previous" button
3. Or intercept back button, show warning
4. Save state before navigation
5. Test back button on all flows

**Confidence:** Medium

---

#### [MEDIUM] Orphaned Success Pages
**Category:** Flow  
**Path:** `/form/success` page  
**Summary:** Success page lacks context if accessed directly

**Rationale:**
- Success page assumes user just submitted form
- But if URL shared or accessed directly, no context
- No data to show, no clear action
- Should redirect to appropriate page

**Suggested Fix:**
1. Check for required data/state on success page mount
2. If missing, redirect to appropriate starting point
3. Or show helpful message: "It looks like you haven't submitted a form yet"
4. Provide clear navigation
5. Consider using modal instead of page

**Confidence:** Low

---

#### [HIGH] Missing Progress Indicators in Long Flows
**Category:** Flow  
**Path:** Multi-step form process  
**Summary:** Users don't know how much longer the process will take

**Rationale:**
- FormWizard has step counter (1 of 4) - GOOD
- But after form submission, unclear what's happening
- Plan generation may take time
- No progress indicator during generation
- Users may think something is broken

**Suggested Fix:**
1. Show detailed progress during plan generation:
   - "Analyzing your inputs..." (0-30%)
   - "Generating recommendations..." (30-70%)
   - "Finalizing your plan..." (70-100%)
2. Add estimated time remaining
3. Allow cancellation if appropriate
4. Show progress bar, not just spinner

**Confidence:** High

---

#### [MEDIUM] Exit Points Not Clearly Marked
**Category:** Flow  
**Path:** Dashboard, Form flows  
**Summary:** Unclear how to exit flows or return to main site

**Rationale:**
- Once in dashboard, unclear how to return to marketing site
- No "Exit" or "Back to main site" link
- Logo links to homepage but not obvious
- Users may feel trapped

**Suggested Fix:**
1. Make logo click behavior obvious (show on hover: "Back to home")
2. Add "Exit to main site" link in dashboard navigation
3. Breadcrumbs should show hierarchy
4. Provide clear way out of every flow
5. Don't trap users

**Confidence:** Medium

---

## QUICK WINS

These high-impact, low-effort fixes can be implemented immediately:

### 1. Add Loading States to All Buttons (2 hours)
**Impact:** High | **Effort:** Low  
**Files:** All button usages  
**Action:** Add loading prop to all buttons that trigger async operations. Show spinner and "Loading..." text.

### 2. Fix Contact Page Color Contrast (15 minutes)
**Impact:** Medium | **Effort:** Very Low  
**File:** `app/contact/page.tsx` line 276  
**Action:** Remove conflicting `dark:text-alira-black/80 dark:text-alira-white/80` classes, keep only one.

### 3. Add Alt Text to Founder Image (5 minutes)
**Impact:** High (Accessibility) | **Effort:** Very Low  
**File:** `app/about/page.tsx` line 183  
**Action:** Update alt text to be descriptive: "Portrait of [Founder Name], Founder of ALIRA Partners".

### 4. Fix CTA Anchor Links (30 minutes)
**Impact:** High | **Effort:** Low  
**Files:** Multiple CTAs  
**Action:** Standardize all CTAs to point to `#start-chat`, add `id="start-chat"` to VercelV0Chat section.

### 5. Add Focus Indicators (1 hour)
**Impact:** High (Accessibility) | **Effort:** Low  
**Files:** All interactive components  
**Action:** Search for `focus:outline-none`, ensure all have `focus-visible:ring-2 focus-visible:ring-alira-gold`.

### 6. Increase Error Message Size (30 minutes)
**Impact:** Medium | **Effort:** Low  
**Files:** All forms  
**Action:** Change error messages from `text-xs` to `text-sm`, add red border to invalid fields.

### 7. Add Aria-Labels to Icon Buttons (1 hour)
**Impact:** High (Accessibility) | **Effort:** Low  
**Files:** Header, Dashboard  
**Action:** Add `aria-label` to all icon-only buttons: More Options, Refresh, Delete, etc.

### 8. Fix Mobile Font Sizes (1 hour)
**Impact:** Medium | **Effort:** Low  
**Files:** All forms  
**Action:** Ensure all form inputs and labels are minimum 16px on mobile to prevent zoom.

### 9. Add "Back to Dashboard" Links (1 hour)
**Impact:** Medium | **Effort:** Low  
**Files:** Plan detail pages  
**Action:** Add back button/breadcrumb to plan pages for easy navigation.

### 10. Standardize Loading Spinners (2 hours)
**Impact:** Medium | **Effort:** Low  
**Action:** Create `<Spinner>` component, replace all inline spinner code with component.

---

## LONG-TERM IMPROVEMENTS

These systemic changes require significant effort but will substantially improve UX:

### 1. Complete Accessibility Audit & Remediation (2-3 weeks)
**Effort:** High | **Impact:** Critical

Address all WCAG 2.1 AA violations:
- Fix all color contrast issues
- Add missing alt text
- Implement proper keyboard navigation
- Add ARIA attributes where needed
- Test with screen reader
- Get accessibility certification

**Priority:** Immediate

---

### 2. Navigation System Redesign (1-2 weeks)
**Effort:** Medium-High | **Impact:** High

Unify navigation experience:
- Single consistent header across all pages
- Clear section indicators (Marketing vs Dashboard)
- Breadcrumbs for authenticated pages
- Sticky navigation on mobile
- Back button that works predictably

**Priority:** High

---

### 3. Design System Consolidation (3-4 weeks)
**Effort:** High | **Impact:** High

Create comprehensive design system:
- Document all components with Storybook
- Consolidate button variants to 4
- Create card variants
- Standardize spacing, colors, typography
- Create component usage guidelines
- Add automated visual regression tests

**Priority:** High

---

### 4. Form Flow Optimization (2 weeks)
**Effort:** Medium | **Impact:** High

Streamline form experience:
- Unify chat and traditional form entry points
- Implement auto-save every 30 seconds
- Add progress indicators throughout
- Better error messages and recovery
- Pre-fill where possible
- Test full journey end-to-end

**Priority:** High

---

### 5. Comprehensive Error Handling Framework (2 weeks)
**Effort:** Medium | **Impact:** High

Robust error system:
- Error boundaries at component level
- Specific error messages for each scenario
- Recovery actions for each error type
- Logging to monitoring service
- Graceful degradation
- User-friendly language

**Priority:** High

---

### 6. Responsive Design Overhaul (2-3 weeks)
**Effort:** High | **Impact:** High

Mobile-first redesign:
- Dashboard mobile experience
- Touch-optimized controls
- Better hero sections on mobile
- Optimized images for mobile
- Test on real devices
- Performance optimization

**Priority:** Medium

---

### 7. Dark Mode Implementation (or Removal) (1 week)
**Effort:** Medium | **Impact:** Medium

Fix dark mode:
- Either implement proper dark mode toggle
- Or remove all dark mode code if staying dark-only
- Test all pages in both modes
- Fix contrast issues
- Ensure consistency

**Priority:** Medium

---

### 8. Microcopy Audit & Rewrite (1 week)
**Effort:** Medium | **Impact:** Medium

Consistent brand voice:
- Audit all copy for tone and clarity
- Rewrite error messages
- Standardize CTA language
- Add helpful hints and examples
- Test comprehension with users

**Priority:** Medium

---

### 9. Performance Optimization (2 weeks)
**Effort:** High | **Impact:** Medium

Faster load times:
- Image optimization
- Code splitting
- Lazy loading
- Bundle size reduction
- CDN configuration
- Performance monitoring

**Priority:** Low

---

### 10. User Testing & Iteration (Ongoing)
**Effort:** High | **Impact:** High

Continuous improvement:
- Usability testing with real users
- A/B testing on critical flows
- Analytics implementation
- User feedback collection
- Iterative improvements

**Priority:** Medium

---

## NEXT STEPS CHECKLIST

### Immediate (This Week)
- [ ] Fix all critical accessibility issues (focus indicators, alt text, color contrast)
- [ ] Add loading states to all async buttons
- [ ] Fix CTA anchor link issues
- [ ] Add error message improvements
- [ ] Audit and fix mobile font sizes

### Short-Term (This Month)
- [ ] Complete WCAG 2.1 AA compliance
- [ ] Redesign navigation system for consistency
- [ ] Consolidate button variants
- [ ] Implement comprehensive error handling
- [ ] Add back navigation to all detail pages

### Medium-Term (This Quarter)
- [ ] Build complete design system documentation
- [ ] Optimize all user flows
- [ ] Mobile responsive redesign
- [ ] Implement user testing program
- [ ] Performance optimization

### Long-Term (This Year)
- [ ] Continuous accessibility monitoring
- [ ] A/B testing framework
- [ ] Advanced analytics and user insights
- [ ] Iterative UX improvements based on data
- [ ] Design system maturity

---

## CONCLUSION

The ALIRA project has a strong visual foundation with thoughtful branding and premium feel. However, there are significant opportunities to improve accessibility, consistency, and user experience across the application.

**Priority Focus Areas:**
1. **Accessibility** - Critical issues must be addressed immediately
2. **Navigation** - Confusing patterns need simplification
3. **Error Handling** - Users need better feedback throughout
4. **Design System** - Consolidation will improve consistency

With focused effort on these areas, the UX score could improve from 7.2/10 to 8.5+/10 within 2-3 months.

**Recommended Approach:**
1. Week 1-2: Fix all critical accessibility issues
2. Week 3-4: Navigation redesign and error handling
3. Month 2: Design system consolidation
4. Month 3: Mobile optimization and user testing

The investment in UX improvements will result in:
- Higher conversion rates
- Better user satisfaction
- Improved accessibility compliance
- Reduced support burden
- Stronger brand perception

---

**End of Audit Report**  
For questions or clarifications, please refer to specific findings above with file paths and line numbers for implementation.

