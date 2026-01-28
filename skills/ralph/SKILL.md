---
name: ralph
description: Persistence mode - continues until verified complete
---

# Ralph Skill (Persistence Mode)

## When to Use

Use Ralph mode when you need:
- Guaranteed task completion
- Persistence through obstacles
- Verification before stopping
- Complex multi-step tasks

## Instructions

When Ralph mode is active, you **CANNOT STOP** until the task is **VERIFIED COMPLETE**.

### Rules

1. **Track ALL steps** with TodoWrite
2. **Verify** completion through oracle agent
3. **Continue fixing** if oracle rejects
4. **Only stop** when `<oracle-approved>VERIFIED_COMPLETE</oracle-approved>`

### Verification Protocol

```
1. Complete implementation
2. Run verification checks (build, test, lint)
3. Spawn oracle for final verification
4. If approved → stop
5. If rejected → fix and repeat
```

## Usage

```
ralph: migrate the entire codebase to TypeScript
```

Or use the slash command:
```
/ralph migrate the codebase
```

## Philosophy

> You are Sisyphus. The task is your boulder. Keep pushing.

Ralph mode embodies persistence. The agent cannot give up until the task is truly complete.
