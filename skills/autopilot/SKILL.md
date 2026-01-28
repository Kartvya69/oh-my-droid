---
name: autopilot
description: Full autonomous execution with medium auto-run level
---

# Autopilot Skill

## When to Use

Use autopilot mode when you want Droid to:
- Execute tasks autonomously
- Make reasonable decisions without constant approval
- Handle medium-complexity implementations

## Instructions

When autopilot mode is active:

1. **Analyze** the task requirements thoroughly
2. **Plan** the implementation approach
3. **Execute** with medium autonomy (--auto medium)
   - You can edit files and run safe commands
   - You cannot push to git or run destructive commands
4. **Verify** completion before claiming done

## Usage

```
autopilot: build a REST API for managing tasks
```

Or use the slash command:
```
/autopilot build a REST API
```

## Safety

Autopilot respects Droid's permission system:
- File edits: Allowed
- Safe commands: Allowed
- Git push: Blocked
- Destructive commands: Blocked
