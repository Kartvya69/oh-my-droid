# Oh-My-Droid

**Multi-agent orchestration for Factory Droid. Zero learning curve.**

*Don't learn Droid. Just use OMD.*

Oh-My-Droid brings the power of [oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) to [Factory AI's Droid CLI](https://factory.ai), featuring a Sisyphus-style orchestrator, custom droids (Oracle, Librarian, Architect, Executor), and intelligent execution modes.

## Quick Start

### Option 1: Install from npm (when published)
```bash
npm install -g oh-my-droid
omd install
```

### Option 2: Install from source (local development)
```bash
git clone https://github.com/Kartvya69/oh-my-droid.git
cd oh-my-droid
./install.sh link    # or: npm link
```

### Option 3: Quick setup script
```bash
git clone https://github.com/Kartvya69/oh-my-droid.git
cd oh-my-droid
./scripts/link.sh
```

**Use Magic Keywords**
```
autopilot: build a REST API for managing tasks
```

That's it. Everything else is automatic.

## Why Oh-My-Droid?

- **Zero configuration** - Works out of the box with Droid's native systems
- **Natural language interface** - No commands to memorize, just describe what you want
- **Custom droids** - Oracle, Librarian, Architect, Executor, and more
- **Automatic parallelization** - Complex tasks distributed across specialized agents
- **Persistent execution** - Ralph mode won't give up until the job is verified complete
- **Droid-native** - Leverages Droid's skills, custom droids, and specification mode

## Features

### Execution Modes (Magic Keywords)

| Mode | Keyword | Description |
|------|---------|-------------|
| **Autopilot** | `autopilot:` | Full autonomous execution |
| **Ultrawork** | `ulw:` or `ultrawork:` | Maximum parallel execution |
| **Ralph** | `ralph:` | Persistence until verified complete |
| **Ultrapilot** | `ultrapilot:` | Parallel autonomous execution |
| **Ecomode** | `eco:` | Token-efficient execution |
| **Swarm** | `swarm:` | Coordinated parallel agents |
| **Plan** | `plan:` | Specification mode |

### Custom Droids

| Droid | Model | Purpose |
|-------|-------|---------|
| **oracle** | claude-opus | Verification & critical review |
| **librarian** | claude-sonnet | Research & documentation |
| **architect** | claude-opus | Architecture & debugging |
| **executor** | inherit | Implementation |
| **explore** | claude-haiku | Fast codebase search |
| **security-reviewer** | claude-opus | Security auditing |

### Slash Commands

- `/autopilot` - Full autonomous execution
- `/ultrawork` - Maximum parallel execution
- `/ralph` - Persistence mode
- `/plan` - Specification mode
- `/code-review` - AI-powered code review
- `/security` - Security audit
- `/analyze` - Deep codebase analysis

## Usage Examples

### Magic Keywords
```
autopilot: build a todo app with React and Node.js

ralph: migrate the entire codebase to TypeScript

ulw: refactor all components in the src/ directory

plan: design the authentication system
```

### Custom Droids
```typescript
// Spawn Oracle for verification
Task(subagent_type="oracle", prompt="Verify this implementation")

// Spawn Librarian for research
Task(subagent_type="librarian", prompt="Research best practices for JWT auth")

// Spawn Architect for design
Task(subagent_type="architect", prompt="Design the data model")
```

### Parallel Execution (Ultrawork)
```
ultrawork: implement user authentication with:
- Login/signup forms
- JWT token handling
- Password reset flow
- Email verification
```

The orchestrator will spawn multiple custom droids in parallel:
- **librarian** researches JWT best practices
- **architect** designs the auth flow
- **executor** implements the forms
- **oracle** verifies the security

## Installation

### Global Install
```bash
npm install -g oh-my-droid
omd install
```

### Project Install
```bash
npm install --save-dev oh-my-droid
npx omd install --project
```

## Configuration

Oh-My-Droid uses Droid's native configuration:

- `~/.factory/settings.json` - Droid settings
- `~/.factory/droids/` - Custom droids
- `~/.factory/skills/` - Skills
- `./AGENTS.md` - Project guidelines

## How It Works

```
User Input → Magic Keyword Detection → Skill Activation
                                              ↓
                                   Custom Droid Spawning
                                              ↓
                                   Parallel Execution
                                              ↓
                                   Oracle Verification
                                              ↓
                                   Task Complete
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md) - How OMD works
- [Reference](docs/REFERENCE.md) - Complete feature documentation
- [Migration](docs/MIGRATION.md) - Upgrade guide

## Requirements

- [Factory Droid CLI](https://factory.ai)
- Node.js 20+

## License

MIT

## Credits

Inspired by [oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) and [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode).

**Zero learning curve. Maximum power.**
