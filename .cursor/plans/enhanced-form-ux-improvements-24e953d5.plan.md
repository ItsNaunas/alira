<!-- 24e953d5-db3c-4166-89e2-704689cf5654 722401c0-9f25-41dc-b55b-36be2c40a067 -->
# Enhanced Plan Generation & Security Fixes

## Phase 1: Security Fixes - Plan Ownership Protection

### 1.1 Database Migration: Secure Generations Table

**File**: `db/migrations/009_secure_generations_user_id.sql`

- Backfill any NULL user_ids from dashboard ownership
- Delete orphaned generations that can't be recovered
- Add NOT NULL constraint to `generations.user_id` column
- Ensure RLS is enabled
- Recreate RLS policies with explicit NULL checks
- Add index on `user_id` for performance

**Security Impact**: Prevents future orphaned plans and ensures all plans are properly associated with users.

### 1.2 API Code Fix: Remove Fallback Logic

**File**: `app/api/generate-plan/route.ts` (lines 188-294)

- Remove fallback logic that creates plans without user_id
- Require user_id in insertData (never optional)
- Fail hard with clear error if user_id column issue detected
- Add verification check after insert to ensure user_id was set correctly
- Delete and throw error if generation created without proper user_id
- Always filter dashboard updates by user_id for security

**Security Impact**: Prevents bypassing user ownership checks and ensures API enforces security.

## Phase 2: Enhanced Plan Generation - Active Methodology Application

### 2.1 Enhanced Business Case Prompt Structure

**File**: `lib/openai.ts` - `buildBusinessCasePrompt()` function (lines 41-118)

**Changes**:

- Transform from passive methodology mention to mandatory framework application
- Require explicit "5 Whys" chain in problem statement output
- Mandate quantified impact using UK benchmarks
- Force industry-specific metrics in objectives and outcomes
- Require stage-appropriate timeline and investment ranges
- Add explicit framework demonstration requirements

**Key Enhancement**: Change from "Use 5 Whys" to "MUST include 5 Whys chain: [format]"

### 2.2 Extended Business Case Interface

**File**: `lib/openai.ts` - `BusinessCaseOutline` interface (lines 120-136)

**Add new fields**:

```typescript
root_cause_analysis: {
  five_whys_chain: string[]  // Explicit chain
  root_cause: string
  symptoms_vs_causes: { symptom: string, root_cause: string }[]
}
industry_analysis: {
  context: string
  benchmarks_comparison: Record<string, string>
  stage_specific_insights: string
}
methodology_applied: string[]  // ["5 Whys", "UK Benchmarking", etc.]
```

### 2.3 Enhanced Prompt Instructions

**File**: `lib/openai.ts` - Update prompt JSON schema (lines 79-117)

**Changes**:

- Update problem_statement requirement to explicitly format 5 Whys chain
- Add root_cause_analysis section with mandatory chain
- Add industry_analysis section requiring benchmark comparisons
- Add methodology_applied array tracking which frameworks were used
- Enhance expected_outcomes to require specific metric comparisons to benchmarks

### 2.4 Methodology Context Extraction from Conversation

**File**: `app/api/generate-plan/route.ts` (around line 111)

**Add before generateBusinessCase call**:

- Extract methodology insights from conversation segments
- Build explicit 5 Whys chain from user's challenge responses
- Extract mentioned metrics and quantify impacts
- Pass methodology context to AI generation

### 2.5 Conversation Integration - Methodology Indicators

**File**: `components/SegmentedConversationForm.tsx`

**Add visual indicators**:

- Show methodology badges during conversation ("Applying 5 Whys Analysis", "Industry Context Active")
- Display mini-progress: "Analyzing root causes...", "Applying UK benchmarks..."
- Add contextual hints explaining why specific questions are asked
- Show which frameworks are being applied in real-time

**Location**: Around message rendering area (lines 1087-1102)

## Phase 3: Output Display Enhancements

### 3.1 Dashboard Plan Display

**Files**: Dashboard components showing generated plans

**Add**:

- Methodology framework badges on plan sections
- Visual indicators showing which frameworks were applied
- Framework-specific sections display (5 Whys chain visualization, benchmark comparisons)
- Industry analysis section with metrics comparison

### 3.2 PDF Generation Updates

**File**: `lib/enhanced-pdf.ts` or PDF generation files

**Add**:

- Methodology sections in PDF output
- Visual representation of 5 Whys chain
- Industry benchmark comparison tables
- Framework badges/indicators in PDF layout

## Phase 4: Validation & Quality Checks

### 4.1 Enhanced Quality Validation

**File**: `lib/business-case-quality.ts` (if exists) or create new

**Add checks**:

- Verify 5 Whys chain exists and is complete
- Validate root cause vs symptoms distinction
- Check industry metrics are included
- Verify UK benchmarks are referenced
- Ensure methodology_applied array is populated

### 4.2 Logging & Monitoring

**Files**: `app/api/generate-plan/route.ts`, `lib/openai.ts`

**Add**:

- Log which methodologies were applied
- Track if root cause analysis was properly executed
- Monitor benchmark usage in generated plans
- Alert if methodology sections are missing

## Implementation Order

1. **Phase 1** (Security) - Critical, do first
2. **Phase 2.1-2.3** (Prompt & Interface) - Core methodology enhancement
3. **Phase 2.4** (Context Extraction) - Improves AI input
4. **Phase 2.5** (UI Indicators) - User experience
5. **Phase 3** (Display) - Output presentation
6. **Phase 4** (Validation) - Quality assurance

## Testing Requirements

- Security: Verify all plans have user_id and RLS blocks unauthorized access
- Methodology: Verify 5 Whys chains appear in generated plans
- Industry Context: Verify benchmarks and metrics are used appropriately
- UI: Verify methodology indicators show during conversation
- Output: Verify framework badges appear on generated plans

### To-dos

- [ ] Implement enhanced progress indicators with milestones and time estimates in FormWizard
- [ ] Add real-time answer quality feedback with character count and suggestions
- [ ] Create example templates library and add See Example buttons to form steps
- [ ] Implement mobile optimizations: touch targets, swipe gestures, voice input
- [ ] Add conditional question branching based on business type and stage
- [ ] Implement smart answer suggestions with autocomplete functionality
- [ ] Add file upload feature with document extraction and pre-fill
- [ ] Implement exit intent capture with email save functionality
- [ ] Add contextual help system with inline explanations and tips
- [ ] Create completion preview showing plan sections before submission
- [ ] Enhance analytics tracking for all new features and drop-off points