# Delete Plans Feature
**Date:** October 19, 2025  
**Status:** ✅ IMPLEMENTED

---

## 🎯 Feature Request

> "We should have an option to delete plans"

---

## ✅ What Was Added

### Complete plan deletion functionality with:

1. **🗑️ Delete buttons** in two locations
2. **⚠️ Confirmation dialog** to prevent accidents
3. **🔒 Secure API endpoint** with proper authentication
4. **🧹 Cascade deletion** of all related data
5. **✨ Smooth UX** with loading states and feedback

---

## 📍 Where to Find Delete Buttons

### 1. Dashboard Overview (`/dashboard`)

**Location:** In the "All Plans" section, each plan card has:
- **"View" button** (primary action)
- **🗑️ Trash icon button** (delete action)

```
┌─────────────────────────────────────┐
│ My Business Plan        Oct 19, 2025 │
│                                       │
│                  [View] [🗑️]         │
└─────────────────────────────────────┘
```

### 2. Plan Detail Page (`/dashboard/[planId]`)

**Location:** In the header action buttons:
- [✏️ Edit]
- [💬 Refine with AI]
- [⬇️ Download PDF]
- [📤 Share]
- **[🗑️ Delete]** ← New!

---

## 🎨 User Flow

### Complete Deletion Flow:

1. **Click delete button** (trash icon)
2. **Confirmation dialog appears**
   ```
   ┌────────────────────────────────────┐
   │ Delete Plan?                     × │
   ├────────────────────────────────────┤
   │ Are you sure you want to delete    │
   │ "My Business Plan"? This action    │
   │ cannot be undone and will          │
   │ permanently delete all plan data,  │
   │ versions, and chat history.        │
   ├────────────────────────────────────┤
   │              [Cancel] [Delete Plan]│
   └────────────────────────────────────┘
   ```
3. **Click "Delete Plan"** to confirm
4. **Loading state** shows "Please wait..."
5. **Plan deleted** and:
   - From dashboard: Plan removed from list
   - From detail page: Redirected to dashboard

---

## 🛡️ Security Features

### API Endpoint: `/api/plan/delete`

**Security Measures:**
- ✅ Requires authentication (`requireUser()`)
- ✅ Verifies user owns the plan before deletion
- ✅ Uses service role client for database operations
- ✅ Validates plan ID with Zod schema
- ✅ Returns 404 if plan not found or access denied
- ✅ Returns 401 if user not authenticated

**Example Error Responses:**
```json
// Not authenticated
{ "error": "Unauthorized", "code": 401 }

// Plan not owned by user
{ "error": "Plan not found or access denied", "code": 404 }

// Invalid plan ID
{ "error": "Invalid plan ID", "code": 400 }
```

---

## 🧹 What Gets Deleted

When you delete a plan, the system removes:

1. **📄 The plan itself** (`dashboards` table)
2. **🤖 AI-generated content** (`generations` table)
3. **📊 Version history** (`plan_versions` table)
4. **💬 Chat refinements** (`plan_refinement_chats` table)
5. **📎 PDF files** (from Supabase Storage)

**Complete cleanup** - no orphaned data left behind!

---

## 🔧 Technical Implementation

### Files Created/Modified:

#### 1. **`components/ui/alert-dialog.tsx`** *(NEW)*
- Reusable confirmation dialog component
- Dark theme matching ALIRA design
- Loading states
- Backdrop click to close
- Escape key support

**Features:**
- `variant="destructive"` for dangerous actions (red button)
- `variant="default"` for normal confirmations (gold button)
- Loading prop disables all interactions during operation
- Clean, accessible UI

#### 2. **`app/api/plan/delete/route.ts`** *(NEW)*
- DELETE endpoint for plan deletion
- Secure with authentication and ownership verification
- Cascade deletes all related data
- Removes PDF from storage
- Comprehensive error handling

**Flow:**
```typescript
1. Authenticate user
2. Validate plan ID
3. Verify ownership
4. Delete PDF from storage (if exists)
5. Delete plan refinement chats
6. Delete plan versions
7. Delete generations
8. Delete dashboard
9. Return success
```

#### 3. **`app/dashboard/page.tsx`** *(MODIFIED)*

**Changes:**
- Added delete button to each plan card
- Added confirmation dialog
- Added delete state management
- Optimistic UI update (removes from list immediately)

**New Features:**
- `handleDeleteClick()` - Opens confirmation dialog
- `handleDeleteConfirm()` - Calls API and updates UI
- `deleteDialogOpen` state
- `planToDelete` state
- `isDeleting` loading state

#### 4. **`components/PlanHeader.tsx`** *(MODIFIED)*

**Changes:**
- Added delete button in header actions
- Added confirmation dialog
- Added redirect to dashboard after deletion

**New Features:**
- `handleDelete()` - Calls API and redirects
- `deleteDialogOpen` state
- `isDeleting` loading state
- Automatic redirect after successful deletion

---

## 🎯 UX Details

### Visual Design:

**Delete Button Styling:**
```css
/* Red text, subtle red background on hover */
border: white/20
color: red-400
hover: bg-red-500/10 border-red-500/30
```

**Confirmation Dialog:**
- Dark theme (`bg-[#0A0A0A]`)
- Clear warning message
- Destructive action button (red)
- Disabled state during deletion
- Can't accidentally click outside while deleting

### States:

1. **Idle** - Delete button visible and clickable
2. **Confirming** - Dialog open, can cancel or confirm
3. **Deleting** - Dialog shows "Please wait...", all buttons disabled
4. **Success** - Plan removed, UI updates automatically
5. **Error** - Alert shown, can try again

---

## 🧪 Testing Checklist

### Dashboard Page:
- [ ] Delete button (trash icon) appears on each plan card
- [ ] Clicking delete opens confirmation dialog
- [ ] Dialog shows correct plan name
- [ ] Clicking "Cancel" closes dialog without deleting
- [ ] Clicking "Delete Plan" removes plan from list
- [ ] Loading state shows "Please wait..." during deletion
- [ ] Can't click outside dialog while deleting
- [ ] Error alert shows if deletion fails

### Plan Detail Page:
- [ ] "Delete" button appears in header actions
- [ ] Button has red text and trash icon
- [ ] Clicking opens confirmation dialog
- [ ] Successful deletion redirects to dashboard
- [ ] Loading state disables all buttons
- [ ] Error handling works correctly

### API Endpoint:
- [ ] Requires authentication (401 without login)
- [ ] Validates plan ownership (404 if not owned)
- [ ] Deletes PDF from storage
- [ ] Deletes all related database records
- [ ] Returns success message with plan details
- [ ] Handles errors gracefully

---

## 📊 Database Impact

### Cascade Deletion Order:

```mermaid
DELETE Plan
  ↓
1. Delete PDF from Supabase Storage
  ↓
2. Delete plan_refinement_chats
  ↓
3. Delete plan_versions
  ↓
4. Delete generations
  ↓
5. Delete dashboards (main record)
```

**Why this order?**
- Start with storage (external files)
- Then child tables (foreign keys)
- Finally parent table (main record)
- Ensures no orphaned data

---

## ⚠️ Safety Features

### Prevents Accidental Deletion:

1. **Two-step process** - Must click delete, then confirm
2. **Clear warning message** - Explains what will be deleted
3. **Shows plan name** - Confirms which plan you're deleting
4. **"Cannot be undone" warning** - Makes permanence clear
5. **Destructive button color** - Red indicates danger
6. **Loading state** - Prevents double-clicks

### What's NOT Deleted:

- ✅ User account remains intact
- ✅ Other plans not affected
- ✅ User profile and settings preserved
- ✅ Credit balance unchanged

---

## 🚀 Deployment

**Files to commit:**

```bash
# New files
git add components/ui/alert-dialog.tsx
git add app/api/plan/delete/route.ts
git add DELETE_PLANS_FEATURE.md

# Modified files
git add app/dashboard/page.tsx
git add components/PlanHeader.tsx

# Commit
git commit -m "Add plan deletion feature with confirmation dialog"

# Deploy
git push origin main
```

---

## 💡 Future Enhancements

### Possible Improvements:

1. **Soft delete** - Mark as deleted instead of permanent deletion
   - Add `deleted_at` timestamp
   - Allow recovery within 30 days
   - Auto-cleanup after 30 days

2. **Bulk delete** - Select multiple plans to delete
   - Checkboxes on plan cards
   - "Delete Selected" button
   - Batch API endpoint

3. **Export before delete** - Prompt to download PDF first
   - "Delete & Download" option
   - Auto-generate PDF if none exists
   - Email copy to user

4. **Undo action** - Toast notification with undo button
   - Brief window to undo (5 seconds)
   - Restore from soft delete
   - Better UX for mistakes

5. **Archive instead** - Non-destructive alternative
   - Move to "Archived" section
   - Hidden from main list
   - Can restore anytime

---

## 📈 Impact

**Before:**
- ❌ No way to remove old/test plans
- ❌ Dashboard cluttered with unwanted plans
- ❌ Users had to contact support for deletion

**After:**
- ✅ Self-service plan management
- ✅ Clean, organized dashboard
- ✅ Full control over plan lifecycle
- ✅ Reduced support requests
- ✅ Better user experience

---

## 🎉 Summary

### What You Can Now Do:

1. **Delete from dashboard list** - Quick trash icon button
2. **Delete from plan page** - Delete button in header
3. **Safe confirmation** - Can't accidentally delete
4. **Complete cleanup** - All related data removed
5. **Smooth experience** - Loading states and feedback

### Key Features:

- 🗑️ Delete buttons in 2 locations
- ⚠️ Safety confirmation dialog
- 🔒 Secure API with authentication
- 🧹 Complete data cleanup
- ✨ Professional UX with loading states

---

**Feature Implemented By:** AI Code Assistant  
**User Request:** "we should have an option to delete plans"  
**Status:** ✅ READY FOR TESTING

