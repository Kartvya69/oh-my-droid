# Oh-My-Droid Architecture

## Overview

Oh-My-Droid is a multi-agent orchestration system for Factory Droid CLI, inspired by oh-my-claudecode. It provides intelligent task delegation, parallel execution, and verification through custom droids.

```
┌─────────────────────────────────────────────────────────────────┐
│                      OH-MY-DROID                                 │
│                 Sisyphus Orchestrator                            │
└─────────────────────────────────────────────────────────────────┘

  User Input → Magic Keywords → Skill Activation → Custom Droids
                                     ↓
                              Parallel Execution
                                     ↓
                              Oracle Verification
                                     ↓
                              Task Complete
```

## Core Components

### 1. Sisyphus Orchestrator

The central intelligence that routes tasks to appropriate agents.

**Responsibilities:**
- Intent classification
- Agent selection
- Delegation via Task tool
- Coordination of parallel execution
- Verification through Oracle

### 2. Custom Droids

Specialized agents defined as Droid custom droids:

| Droid | Role | Model |
|-------|------|-------|
| oracle | Verification specialist | claude-opus |
| librarian | Research specialist | claude-sonnet |
| architect | Architecture advisor | claude-opus |
| executor | Implementation | inherit |
| explore | Fast search | claude-haiku |

### 3. Skills

Droid-native SKILL.md files that define capabilities:

- **autopilot** - Full autonomous execution
- **ralph** - Persistence until verified
- **ultrawork** - Maximum parallel execution
- **plan** - Specification mode
- **ecomode** - Token-efficient execution

### 4. Magic Keywords

Natural language triggers:

- `autopilot:` - Autonomous execution
- `ralph:` - Persistence mode
- `ulw:` - Ultrawork mode
- `plan:` - Specification mode

### 5. State Management

**Boulder State:**
- `.omd/state/boulder.json` - Active plan tracking
- `.omd/notepads/{plan}/` - Plan-scoped wisdom

### 6. Verification Protocol

Multi-layer verification:
1. Build passes
2. Tests pass
3. Lint clean
4. Oracle approval (for critical tasks)

## Data Flow

```
1. User Input
   ↓
2. Magic Keyword Detection
   ↓
3. Skill Activation
   ↓
4. Custom Droid Spawning (via Task tool)
   ↓
5. Parallel Execution
   ↓
6. Result Synthesis
   ↓
7. Oracle Verification (if required)
   ↓
8. Task Complete
```

## Integration with Droid

Oh-My-Droid integrates with Droid's native systems:

- **AGENTS.md** - Project guidelines (not CLAUDE.md)
- **Custom Droids** - `~/.factory/droids/`
- **Skills** - `~/.factory/skills/`
- **Hooks** - Droid's hook system
- **Specification Mode** - Droid's native spec mode

## File Structure

```
oh-my-droid/
├── src/
│   ├── agents/          # Custom droid definitions
│   ├── skills/          # Skill registry
│   ├── features/        # Core features
│   ├── commands/        # Slash commands
│   ├── hooks/           # Hook definitions
│   ├── cli/             # CLI entry point
│   └── installer/       # Setup logic
├── skills/              # Droid SKILL.md files
├── droids/              # Custom droid templates
├── commands/            # Slash command definitions
└── templates/           # Project templates
```

## Execution Modes

### Autopilot
- Medium auto-run level
- Can edit files and run safe commands
- Cannot push to git

### Ralph (Persistence)
- Cannot stop until verified
- Oracle must approve
- Tracks progress in Boulder State

### Ultrawork
- Spawns multiple droids in parallel
- Uses `run_in_background=true`
- Synthesizes results

## For More Information

- [Reference](REFERENCE.md) - Complete feature documentation
- [README](../README.md) - Getting started guide
