# Accessibility Testing Guide

**Purpose:** Verify all Phase 1 accessibility improvements are working correctly  
**Time Required:** 30-45 minutes  
**Prerequisites:** Site running locally (`npm run dev`)

---

## 🎯 QUICK START

### Test 1: Focus Indicators (5 minutes)

**What to Test:** Gold outline appears on all interactive elements

**Steps:**
1. Open homepage: `http://localhost:3000`
2. Press `Tab` key repeatedly
3. Observe gold outline appearing on:
   - Skip to main content link (first Tab press)
   - Header logo
   - Navigation links
   - Sign Up / Log In buttons
   - Chat textarea
   - Send button

**Expected Result:** 
- ✅ Gold outline (2px, #A06B00) visible on every focused element
- ✅ Outline has 2px offset for better visibility
- ✅ Never lose track of where you are

**If Failed:**
- Check `app/globals.css` lines 410-430
- Verify focus-visible styles are applied
- Check if other CSS is overriding focus styles

---

### Test 2: Skip Link (2 minutes)

**What to Test:** Keyboard users can skip navigation

**Steps:**
1. Open any page: `http://localhost:3000/about`
2. Press `Tab` key once
3. Observe "Skip to main content" link appears at top
4. Press `Enter`
5. Next Tab should focus first element in main content

**Expected Result:**
- ✅ Skip link visible when focused
- ✅ Clicking it jumps to main content
- ✅ Skip link hidden when not focused

**If Failed:**
- Check `app/layout.tsx` line 47-49
- Verify `.skip-link` class in globals.css
- Check `id="main-content"` exists on pages

---

### Test 3: Form Error Messages (10 minutes)

**What to Test:** Form errors are accessible and visible

**Steps:**
1. Go to form: `http://localhost:3000/form`
2. Click "Next Step →" without filling anything
3. Observe:
   - Business idea field has red border
   - Error message appears below field
   - Error has warning icon
   - Error text is red and larger

4. Press Tab to error message
5. Use screen reader (optional) - should announce error

**Expected Result:**
- ✅ Invalid fields have red border and red ring
- ✅ Error messages have icons and are text-sm (not text-xs)
- ✅ Error messages have `role="alert"`
- ✅ Screen readers announce errors

**Repeat for:**
- [ ] Step 2: Current challenges
- [ ] Step 3: Immediate goals
- [ ] Step 4: Consent checkbox
- [ ] Contact form: name, email, message

**If Failed:**
- Check FormWizard.tsx lines 357-390 (step 1)
- Check Contact page field implementations
- Verify error IDs are unique

---

### Test 4: Keyboard-Accessible Cards (5 minutes)

**What to Test:** Dashboard cards work with keyboard

**Steps:**
1. Log in and go to dashboard
2. Tab to a plan card in "All Plans" section
3. Observe gold focus ring appears
4. Press `Enter` key
5. Should navigate to plan detail page

6. Tab to "Strategic Plan" card
7. Press `Space` key
8. Should also navigate

**Expected Result:**
- ✅ Cards receive focus (gold ring)
- ✅ Enter key activates card
- ✅ Space key activates card
- ✅ Screen reader announces card label

**If Failed:**
- Check dashboard.tsx lines 465-478
- Verify tabIndex={0} and role="button"
- Check onKeyDown handler exists

---

### Test 5: Modal Accessibility (5 minutes)

**What to Test:** Modals are keyboard accessible

**Steps:**
1. On homepage, enter business idea in chat
2. Click Send (or press Enter)
3. Modal appears
4. Press `ESC` key - modal should close
5. Reopen modal
6. Click outside modal area - should close
7. Reopen modal
8. Tab through all fields
9. Verify form fields are labeled

**Expected Result:**
- ✅ ESC key closes modal
- ✅ Click outside closes modal
- ✅ Modal has role="dialog"
- ✅ All inputs have labels
- ✅ Tab cycles through modal only (focus trap)

**If Failed:**
- Check VercelV0Chat.tsx lines 182-280
- Verify ESC handler exists
- Check click-outside handler
- Verify ARIA attributes

---

### Test 6: Status Badges (2 minutes)

**What to Test:** Status is conveyed without color alone

**Steps:**
1. Go to dashboard
2. Look at "AI Summary" card
3. Observe status badge
4. Should see icon + text + color:
   - "Ready" = CheckCircle icon + "Ready" text + green
   - "In Progress" = Spinner icon + "In Progress" text + blue

**Expected Result:**
- ✅ Icons visible next to status text
- ✅ Colorblind users can distinguish (icon + text)
- ✅ Icons have aria-hidden="true"

**If Failed:**
- Check dashboard.tsx lines 280-293
- Verify CheckCircle import
- Check icon rendering

---

### Test 7: CTA Links (5 minutes)

**What to Test:** All CTAs go to correct location

**Steps:**
Test these CTAs navigate to `/#start-chat`:
1. Footer "Start My Plan" button
2. About page "Get Started Today" button
3. Services page "Start Your Simple Plan" button
4. Contact page "Start My Plan" button
5. Results page "Start My Plan" button
6. What You Get page "Start My Plan" button
7. How It Works page "Start My Plan" button

**Expected Result:**
- ✅ All CTAs go to homepage chat section
- ✅ Page scrolls to chat
- ✅ Chat is visible and ready

**If Failed:**
- Check homepage has `id="start-chat"` on line 79
- Verify all CTAs updated to `href="/#start-chat"`

---

### Test 8: Breadcrumbs (2 minutes)

**What to Test:** Breadcrumbs show navigation path

**Steps:**
1. Go to dashboard
2. Click on any plan
3. Look at top of page
4. Should see: Dashboard > Plan Name

**Expected Result:**
- ✅ Breadcrumbs visible at top
- ✅ "Dashboard" is link (blue/gold)
- ✅ Plan name is text (current page)
- ✅ aria-current="page" on current item

**If Failed:**
- Check plan detail page implementation
- Verify Breadcrumbs component imported
- Check breadcrumb styling

---

### Test 9: Mobile Font Sizes (3 minutes)

**What to Test:** Inputs don't trigger zoom on iOS

**Steps:**
1. Open site on iPhone or simulator
2. Or resize browser to mobile width
3. Focus on any form input
4. On real iOS device - should NOT auto-zoom

**Expected Result:**
- ✅ All form inputs are 16px minimum
- ✅ No zoom on focus (iOS Safari)
- ✅ Labels are readable

**Check These Forms:**
- [ ] FormWizard all steps
- [ ] Contact form
- [ ] VercelV0Chat modal
- [ ] Any other forms

**If Failed:**
- Verify all inputs have `text-base` class
- Check computed font size is >= 16px

---

## 🔍 ADVANCED TESTING

### Screen Reader Testing (Optional - 10 minutes)

**macOS - VoiceOver:**
```bash
# Enable VoiceOver
Press Cmd + F5

# Basic commands:
# Cmd+L = Next link
# Cmd+H = Next heading  
# Tab = Next focusable element
# VO+Space = Activate element
```

**Windows - NVDA:**
```bash
# Download NVDA (free)
https://www.nvaccess.org/

# Basic commands:
# Tab = Next element
# H = Next heading
# K = Next link
# Enter = Activate
```

**Test Flow:**
1. Navigate homepage with screen reader
2. Verify all content announced correctly
3. Test form - labels and errors announced
4. Test buttons - aria-labels read
5. Test status badges - text announced

---

### Automated Testing (Optional - 5 minutes)

**Install pa11y:**
```bash
npm install --save-dev pa11y
```

**Create test script:**
```bash
touch scripts/test-accessibility.js
```

```javascript
// scripts/test-accessibility.js
const pa11y = require('pa11y');

const urls = [
  'http://localhost:3000/',
  'http://localhost:3000/about',
  'http://localhost:3000/services',
  'http://localhost:3000/contact',
  'http://localhost:3000/form',
];

(async () => {
  console.log('Running accessibility tests...\n');
  
  for (const url of urls) {
    console.log(`Testing ${url}...`);
    try {
      const results = await pa11y(url, {
        standard: 'WCAG2AA'
      });
      
      console.log(`  Issues found: ${results.issues.length}`);
      
      if (results.issues.length > 0) {
        results.issues.slice(0, 5).forEach(issue => {
          console.log(`  - ${issue.type}: ${issue.message}`);
        });
      }
      console.log('');
    } catch (error) {
      console.error(`  Error testing ${url}:`, error.message);
    }
  }
})();
```

**Run tests:**
```bash
node scripts/test-accessibility.js
```

---

## ✅ SUCCESS CRITERIA

### Phase 1 is successful if:

- [ ] All focus indicators visible and meet 3:1 contrast
- [ ] All form fields properly labeled
- [ ] All error messages accessible and visible
- [ ] All icon buttons have aria-labels
- [ ] All clickable cards keyboard accessible
- [ ] Modal accessible (ESC, click-outside, ARIA)
- [ ] Skip link works
- [ ] Breadcrumbs visible on plan pages
- [ ] All CTAs point to correct location
- [ ] Status badges have icons
- [ ] No linter errors
- [ ] Site still functions normally

### Bonus Points:
- [ ] Tested with real screen reader
- [ ] Tested on real mobile device
- [ ] Ran automated accessibility tests
- [ ] Zero WCAG AA violations

---

## 🐛 KNOWN ISSUES (Not Critical)

These are addressed in later phases:

1. **Text Contrast:** Some `text-white/60` instances remain (Phase 3)
2. **Button Variants:** Still have 7 variants to consolidate (Phase 4)
3. **Mobile Navigation:** Header could be better on mobile (Phase 2)
4. **Loading States:** Not all buttons show loading feedback (Phase 2)

---

## 📞 TROUBLESHOOTING

### Focus Indicators Not Showing
**Problem:** Gold outline doesn't appear when tabbing  
**Solution:** 
- Check browser dev tools for CSS conflicts
- Verify `app/globals.css` changes applied
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Form Errors Not Showing
**Problem:** No red border or error message  
**Solution:**
- Check FormWizard validation logic
- Verify `cn` utility imported
- Check error state in React DevTools

### Modal Won't Close with ESC
**Problem:** ESC key doesn't close modal  
**Solution:**
- Check VercelV0Chat.tsx onKeyDown handler
- Verify modal is focused when open
- Check browser console for errors

### Cards Not Keyboard Accessible
**Problem:** Can't Tab to cards or activate with Enter  
**Solution:**
- Verify tabIndex={0} on card elements
- Check onKeyDown handler exists
- Verify role="button" attribute

---

## 📚 RESOURCES

### WCAG 2.1 Guidelines
- https://www.w3.org/WAI/WCAG21/quickref/
- Focus on Level AA compliance

### Testing Tools
- **Keyboard Testing:** Built into browser (just use Tab key!)
- **Screen Readers:** VoiceOver (Mac), NVDA (Windows)
- **Automated Testing:** pa11y, axe DevTools, Lighthouse
- **Color Contrast:** WebAIM Contrast Checker

### Accessibility Patterns
- **Forms:** https://www.w3.org/WAI/tutorials/forms/
- **ARIA:** https://www.w3.org/TR/wai-aria-practices/
- **Keyboard:** https://webaim.org/techniques/keyboard/

---

**END OF TESTING GUIDE**

All tests passing = Phase 1 success! 🎉

