<!-- 24e953d5-db3c-4166-89e2-704689cf5654 722401c0-9f25-41dc-b55b-36be2c40a067 -->
# Smart Follow-Up Question System Implementation

## Overview

Reduce annoying follow-up questions by implementing smarter evaluation logic that uses segment-specific thresholds, respects AI's boolean assessment, and offers optional clarifications instead of forced prompts.

## Files to Modify

### 1. `components/SegmentedConversationForm.tsx`

#### Add Helper Functions (after SEGMENT_DEFINITIONS, around line 110)

- Add `getThresholdForSegment(segmentIndex: number): number` function
  - Returns segment-specific detail score thresholds
  - Business idea (0): 7, Challenges (1): 6, Goals (2): 6, Services (3): 5
- Add `getMaxLengthForSegment(segmentIndex: number): number` function
  - Returns maximum acceptable response length per segment
  - Business idea: 150 chars, Challenges: 120, Goals: 120, Services: 50

#### Update Follow-Up Logic (replace lines 419-495)

Replace current `needsFollowUp` calculation with smart multi-tier logic:

1. **Primary check**: Use `hasEnoughDetail` boolean as primary gate
   ```typescript
   const definitelyNeedsFollowUp = !evaluation.hasEnoughDetail 
     && evaluation.detailScore < getThresholdForSegment(currentSegmentIndex)
     && responseLength < getMaxLengthForSegment(currentSegmentIndex)
     && currentSegment.followUpCount < currentSegment.maxFollowUps
   ```

2. **Optional follow-up check**: For "good but could be better" (scores 6-7)
   ```typescript
   const optionalFollowUp = evaluation.hasEnoughDetail 
     && evaluation.detailScore >= 6 
     && evaluation.detailScore < 8
     && currentSegment.followUpCount === 0
     && evaluation.suggestedImprovements?.length > 0
   ```

3. **Flow control**:

   - If `definitelyNeedsFollowUp`: Show required follow-up question (current behavior)
   - Else if `optionalFollowUp`: Show optional prompt with "Add More Detail" button
   - Else: Accept and complete segment

#### Add Optional Follow-Up UI Component (new component or inline)

Create inline optional prompt UI that shows when `optionalFollowUp` is true:

- Display friendly message: "This is good! Want to add more detail? It'll help us create an even better plan."
- Show "Add More Detail" button (triggers follow-up question)
- Show "That's Enough" button (accepts and completes segment)
- Style similar to SegmentCompletion but with gold/blue accent
- Position after user message, before completion screen

#### Update Segment Completion Flow

When optional follow-up is skipped, show standard completion screen. When "Add More Detail" is clicked, generate and show follow-up question.

### 2. `lib/ai-conversation.ts`

#### Improve Evaluation Prompt (lines 49-79)

Update system prompt to be more lenient for "good enough" answers:

1. Update scoring guidance:

   - Change "5-7: Good but could use more detail" to "6-7: Good detail, acceptable but could be enhanced"
   - Add note: "Accept answers with score 6+ as sufficient unless they're very short"

2. Improve `hasEnoughDetail` logic:

   - Set `hasEnoughDetail: true` for scores 6+ if response shows understanding
   - Only set `hasEnoughDetail: false` for scores < 6 or very vague answers
   - Add instruction: "Be reasonable - if answer addresses the question clearly, mark hasEnoughDetail: true even if score is 6-7"

3. Update consistency check (lines 106-111):

   - Adjust to accept scores 6+ as "hasEnoughDetail: true"
   - Only force `hasEnoughDetail: false` for scores < 5

### 3. Optional: Create `components/OptionalFollowUp.tsx` (optional - can be inline)

If we extract to separate component:

- Props: `onAddMore: () => void`, `onSkip: () => void`, `suggestions?: string[]`
- Styling: Matches existing design system (alira-gold accents, rounded borders)
- Animation: Fade in similar to SegmentCompletion
- Mobile: Responsive button layout

## Implementation Details

### Smart Threshold Logic

- Business Idea segment: Needs most detail (threshold: 7, max length: 150)
- Challenges segment: Moderate detail okay (threshold: 6, max length: 120)
- Goals segment: Moderate detail okay (threshold: 6, max length: 120)
- Services segment: Minimal (threshold: 5, max length: 50) - though this is selection-based

### User Experience Flow

1. User submits answer
2. AI evaluates (returns score + hasEnoughDetail boolean)
3. If definitely needs follow-up (score < threshold AND hasEnoughDetail = false):

   - Show required follow-up question

4. Else if optional follow-up (score 6-7 AND first follow-up):

   - Show optional prompt with two buttons

5. Else (good enough):

   - Accept and show completion screen

### Error Handling

- Maintain existing error handling for API failures
- If optional follow-up generation fails, just accept the answer (better UX than blocking)

## Testing Considerations

- Test with very short answers (<50 chars) - should trigger required follow-up
- Test with medium answers (100-150 chars, score 6-7) - should show optional prompt
- Test with good answers (200+ chars, score 8+) - should accept immediately
- Test each segment to ensure thresholds work correctly
- Test edge cases: API failures, invalid responses

## Expected Outcomes

- 60-70% reduction in forced follow-up questions
- Better user experience with choice-based flow
- Still maintains quality by asking when truly needed
- More respectful of user intent via AI's boolean assessment

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