---
name: ultrawork
description: Maximum parallel execution with multiple custom droids
---

# Ultrawork Skill

## When to Use

Use Ultrawork mode when you need:
- Maximum parallelism
- Multiple agents working simultaneously
- Complex tasks broken into independent subtasks
- Fast execution through parallelization

## Instructions

When Ultrawork mode is active:

1. **Identify** all independent subtasks
2. **Spawn** custom droids IN PARALLEL via Task tool:
   - `oracle` for verification
   - `librarian` for research
   - `architect` for design
   - `executor` for implementation
3. **Use** `run_in_background=true` for independent tasks
4. **Synthesize** results from all droids
5. **NEVER** do sequential what can be parallel

## Example

```
ultrawork: implement user authentication with login, signup, and password reset
```

Spawns in parallel:
- **librarian**: Research auth best practices
- **architect**: Design auth flow
- **executor-1**: Implement login
- **executor-2**: Implement signup
- **executor-3**: Implement password reset
- **oracle**: Verify security

## Usage

```
ultrawork: [complex multi-part task]
```

Or use the slash command:
```
/ultrawork [task]
```

## Parallel Execution

```typescript
// Spawn multiple droids in parallel
Task(subagent_type="librarian", prompt="...", run_in_background=true)
Task(subagent_type="architect", prompt="...", run_in_background=true)
Task(subagent_type="executor", prompt="...", run_in_background=true)
```
