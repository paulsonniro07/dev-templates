# /plan
# Usage: /plan [describe what you want to build]
# Always run FIRST. Claude plans and WAITS — no code until you say "go".

Analyze: **$ARGUMENTS**

DO NOT write any code yet. Deliver this plan:

### 1. Understanding
Restate in your own words. Call out assumptions.

### 2. Architecture Check
Which layer does this touch? Any layer boundary concerns?

### 3. Files to Create
Path + one-line purpose each.

### 4. Files to Modify
File + what specifically changes.

### 5. Implementation Order
Numbered steps respecting dependencies.

### 6. Data Model Impact
- New entity fields? IsDeleted + timestamps included?
- Migration needed?
- NumberSequence needed?

### 7. API Impact
- New endpoints? Follows REST conventions?
- Dropdown endpoint needed?
- Pagination filter fields?

### 8. Risks / Questions
Anything ambiguous or worth discussing first.

### 9. Complexity
Simple / Medium / Complex — why.

---
Wait for "go" before writing any code.
