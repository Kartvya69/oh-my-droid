/**
 * Magic Keywords for Oh-My-Droid
 * Adapted from oh-my-claudecode for Droid
 *
 * Special trigger words that activate enhanced behaviors
 */

import type { MagicKeyword } from '../shared/types.js';

// Default magic keyword triggers
export const DEFAULT_MAGIC_KEYWORDS: Record<string, string[]> = {
  autopilot: ['autopilot:', 'auto:', 'build me', 'create a'],
  ultrawork: ['ultrawork:', 'ulw:', 'maximum parallel', 'parallel everything'],
  ralph: ['ralph:', 'persist:', "don't stop until", 'keep going until'],
  ultrapilot: ['ultrapilot:', 'ulp:', 'parallel autopilot'],
  ecomode: ['ecomode:', 'eco:', 'efficient mode', 'budget mode'],
  swarm: ['swarm:', 'swarm ', 'parallel agents'],
  pipeline: ['pipeline:', 'pipe:', 'stage:', 'sequential:'],
  plan: ['plan:', 'spec:', 'spec mode', 'planning mode'],
  deepsearch: ['deepsearch:', 'deep:', 'exhaustive search'],
  analyze: ['analyze:', 'analysis:', 'deep analysis'],
};

// Mode descriptions for user feedback
export const MODE_DESCRIPTIONS: Record<string, string> = {
  autopilot: 'Full autonomous execution with medium auto-run level',
  ultrawork: 'Maximum parallel execution with multiple custom droids',
  ralph: 'Persistence mode - continues until verified complete',
  ultrapilot: 'Parallel autonomous execution',
  ecomode: 'Token-efficient execution with model switching',
  swarm: 'Coordinated parallel agent swarm',
  pipeline: 'Sequential multi-stage processing',
  plan: 'Specification mode with planning interview',
  deepsearch: 'Exhaustive codebase exploration',
  analyze: 'Deep codebase analysis',
};

/**
 * Detect magic keywords in user input
 */
export function detectMagicKeywords(input: string): { mode: string; remaining: string }[] {
  const detected: { mode: string; remaining: string }[] = [];
  let remaining = input;

  for (const [mode, triggers] of Object.entries(DEFAULT_MAGIC_KEYWORDS)) {
    for (const trigger of triggers) {
      if (input.toLowerCase().includes(trigger.toLowerCase())) {
        detected.push({ mode, remaining: input.replace(trigger, '').trim() });
        remaining = remaining.replace(trigger, '').trim();
        break;
      }
    }
  }

  return detected;
}

/**
 * Check if input contains any magic keyword
 */
export function hasMagicKeyword(input: string): boolean {
  return detectMagicKeywords(input).length > 0;
}

/**
 * Get the primary mode from input
 */
export function getPrimaryMode(input: string): string | null {
  const detected = detectMagicKeywords(input);
  return detected.length > 0 ? detected[0].mode : null;
}

/**
 * Create a magic keyword processor
 */
export function createMagicKeywordProcessor(
  customKeywords?: Record<string, string[]>
): {
  detect: (input: string) => { mode: string; remaining: string }[];
  hasKeyword: (input: string) => boolean;
  getMode: (input: string) => string | null;
  getDescription: (mode: string) => string;
} {
  const keywords = customKeywords || DEFAULT_MAGIC_KEYWORDS;

  return {
    detect: (input: string) => {
      const detected: { mode: string; remaining: string }[] = [];
      for (const [mode, triggers] of Object.entries(keywords)) {
        for (const trigger of triggers) {
          if (input.toLowerCase().includes(trigger.toLowerCase())) {
            detected.push({ mode, remaining: input.replace(trigger, '').trim() });
            break;
          }
        }
      }
      return detected;
    },
    hasKeyword: (input: string) => {
      for (const triggers of Object.values(keywords)) {
        for (const trigger of triggers) {
          if (input.toLowerCase().includes(trigger.toLowerCase())) {
            return true;
          }
        }
      }
      return false;
    },
    getMode: (input: string) => {
      for (const [mode, triggers] of Object.entries(keywords)) {
        for (const trigger of triggers) {
          if (input.toLowerCase().includes(trigger.toLowerCase())) {
            return mode;
          }
        }
      }
      return null;
    },
    getDescription: (mode: string) => MODE_DESCRIPTIONS[mode] || 'Unknown mode',
  };
}

/**
 * Get system prompt addition for a magic keyword mode
 */
export function getModeSystemPrompt(mode: string): string {
  const prompts: Record<string, string> = {
    autopilot: `<autopilot-mode>
You are in AUTOPILOT mode. Execute tasks with medium autonomy (--auto medium).
- You can edit files and run safe commands
- You cannot push to git or run destructive commands
- Always verify before claiming completion
</autopilot-mode>`,

    ultrawork: `<ultrawork-mode>
MAXIMUM PARALLEL EXECUTION MODE.

MANDATORY: You MUST leverage ALL available custom droids via Task tool:
- Spawn oracle for verification
- Spawn librarian for research  
- Spawn architect for design
- Spawn executor for implementation
- Run them IN PARALLEL when independent

PARALLEL EXECUTION IS REQUIRED. Never do sequential what can be parallel.
</ultrawork-mode>`,

    ralph: `<ralph-mode>
PERSISTENCE MODE ENGAGED. You CANNOT stop until the task is VERIFIED complete.

Rules:
1. Use TodoWrite to track ALL steps
2. Verify completion through oracle agent
3. If oracle rejects, continue fixing
4. Only stop when <oracle-approved>VERIFIED_COMPLETE</oracle-approved>

You are Sisyphus. The task is your boulder. Keep pushing.
</ralph-mode>`,

    plan: `<plan-mode>
SPECIFICATION MODE. Plan BEFORE implementing.

1. Analyze requirements
2. Create detailed specification
3. Get user approval
4. Only then implement

Use ExitSpecMode tool when planning is complete.
</plan-mode>`,

    ecomode: `<ecomode>
TOKEN-EFFICIENT MODE. Minimize costs:
- Use Haiku for simple tasks
- Use Sonnet for standard tasks  
- Reserve Opus for complex reasoning only
- Batch operations when possible
</ecomode>`,

    swarm: `<swarm-mode>
SWARM MODE. Launch multiple parallel agents:
- Use Task tool with run_in_background=true
- Coordinate via SQLite if needed
- Aggregate results
- Maximum parallelism
</swarm-mode>`,

    deepsearch: `<deepsearch-mode>
EXHAUSTIVE SEARCH MODE. Be thorough:
- Search all relevant files
- Check multiple patterns
- Look in tests, docs, examples
- Never stop at first result
</deepsearch-mode>`,

    analyze: `<analyze-mode>
ANALYSIS MODE. Gather context first:
- Read key files
- Search for patterns
- Understand architecture
- Report findings before acting
</analyze-mode>`,
  };

  return prompts[mode] || '';
}
