# Oh-My-Droid Setup Guide

Complete setup instructions for Oh-My-Droid.

## Prerequisites

- [Factory Droid CLI](https://factory.ai) installed
- Node.js 20+ installed
- A Factory AI account with API key

## Installation

### Step 1: Install the Package

```bash
# Global installation (recommended)
npm install -g oh-my-droid

# Or use npx (no install)
npx oh-my-droid install
```

### Step 2: Run Setup

```bash
# Run the setup wizard
omd setup

# Or use the full command
oh-my-droid install
```

This will:
1. Create `~/.omd/` directory for configuration
2. Install custom droids to `~/.factory/droids/`
3. Create default configuration
4. Set up hook templates

### Step 3: Verify Installation

```bash
# Check status
omd status

# List available agents
omd agents

# List commands
omd commands
```

## Project Setup

### Initialize in a Project

```bash
# Navigate to your project
cd /path/to/your/project

# Install OMD to project
omd install --project
```

This creates:
```
.omd/
├── droids/          # Project-specific custom droids
├── skills/          # Project-specific skills
└── state/           # State files

AGENTS.md            # Project guidelines
```

### Create AGENTS.md

Create an `AGENTS.md` file in your project root:

```markdown
# Project Guidelines

## Build & Test
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`

## Code Style
- Use TypeScript strict mode
- Prefer functional components
- Write tests for new features

## Oh-My-Droid
- Use `autopilot:` for full features
- Use `ralph:` for complex refactors
- Use `plan:` before big changes
```

## Configuration

### Global Config (`~/.omd/config.json`)

```json
{
  "agents": {
    "coordinator": { "model": "inherit", "enabled": true },
    "oracle": { "model": "claude-opus", "enabled": true },
    "librarian": { "model": "claude-sonnet", "enabled": true },
    "architect": { "model": "claude-opus", "enabled": true },
    "executor": { "model": "inherit", "enabled": true }
  },
  "features": {
    "parallelExecution": true,
    "continuationEnforcement": true,
    "magicKeywords": true,
    "verificationProtocol": true
  },
  "magicKeywords": {
    "autopilot": ["autopilot:", "auto:"],
    "ultrawork": ["ultrawork:", "ulw:"],
    "ralph": ["ralph:", "persist:"],
    "plan": ["plan:", "spec:"]
  }
}
```

### Droid Settings Integration

Add to your `~/.factory/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Create",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'File modified: $(jq -r '.tool_input.file_path' 2>/dev/null)' >> ~/.omd/hooks.log"
          }
        ]
      }
    ]
  }
}
```

## Using Oh-My-Droid

### Magic Keywords

Just type in Droid CLI:

```
> autopilot: build a REST API for task management

> ralph: migrate the entire codebase to TypeScript

> ultrawork: refactor all components in src/

> plan: design the authentication system
```

### Custom Droids

Spawn specialized agents:

```typescript
// Research
Task(subagent_type="librarian", prompt="Research JWT best practices")

// Architecture review
Task(subagent_type="architect", prompt="Review this database schema design")

// Implementation
Task(subagent_type="executor", prompt="Implement the login form component")

// Verification
Task(subagent_type="oracle", prompt="Verify this implementation is complete")
```

### Slash Commands

```
> /autopilot build a todo app

> /ralph refactor the auth system

> /plan the microservices architecture

> /code-review

> /security audit
```

## Troubleshooting

### Check Installation

```bash
# Verify OMD is installed
which omd
omd --version

# Check Droid is installed
droid --version

# Verify custom droids
ls ~/.factory/droids/
```

### Reset Configuration

```bash
# Backup and reset
mv ~/.omd ~/.omd.backup
omd setup
```

### Uninstall

```bash
omd uninstall
npm uninstall -g oh-my-droid
```

## Next Steps

- Read the [Architecture Guide](ARCHITECTURE.md)
- See [Reference Documentation](REFERENCE.md)
- Learn about [Custom Droids](../droids/)

## Getting Help

```bash
# Show help
omd --help

# Show command help
omd install --help
```
