---
name: plan
description: Specification mode with planning interview
---

# Plan Skill (Specification Mode)

## When to Use

Use Plan mode when you need:
- Detailed planning before implementation
- Complex feature design
- Multi-step projects
- User approval before execution

## Instructions

When Plan mode is active:

1. **Analyze** requirements thoroughly
2. **Create** detailed specification with:
   - Acceptance criteria
   - Implementation plan
   - File-by-file breakdown
   - Testing strategy
   - Security considerations
3. **Present** plan to user
4. **Get** explicit approval
5. **Only then** proceed to implementation
6. **Use** ExitSpecMode tool when planning is complete

## Specification Format

```markdown
# Specification: [Feature Name]

## Overview
[Brief description]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Implementation Plan
1. Step 1
2. Step 2

## Files to Modify
- `path/to/file.ts` - [changes]

## Testing Strategy
[How to test]

## Security Considerations
[Security notes]
```

## Usage

```
plan: design the authentication system
```

Or use the slash command:
```
/plan the authentication system
```

Or enter spec mode with Shift+Tab in Droid CLI.
