/**
 * Skills Registry for Oh-My-Droid
 * Adapted from oh-my-claudecode for Droid
 *
 * Manages Droid-native skills (SKILL.md files)
 */

import type { SkillDefinition } from '../shared/types.js';

// Core skill definitions
export const CORE_SKILLS: SkillDefinition[] = [
  {
    name: 'autopilot',
    description: 'Full autonomous execution with medium auto-run level',
    instructions: `
When autopilot mode is active:
1. Analyze the task requirements
2. Plan the implementation approach
3. Execute with medium autonomy (--auto medium)
4. You can edit files and run safe commands
5. You cannot push to git or run destructive commands
6. Verify completion before claiming done
`,
    triggerPatterns: ['autopilot:', 'auto:', 'build me', 'create a'],
  },
  {
    name: 'ultrawork',
    description: 'Maximum parallel execution with multiple custom droids',
    instructions: `
When ultrawork mode is active:
1. Identify all independent subtasks
2. Spawn custom droids IN PARALLEL via Task tool:
   - oracle for verification
   - librarian for research
   - architect for design
   - executor for implementation
3. Use run_in_background=true for independent tasks
4. Synthesize results from all droids
5. NEVER do sequential what can be parallel
`,
    triggerPatterns: ['ultrawork:', 'ulw:', 'maximum parallel'],
  },
  {
    name: 'ralph',
    description: 'Persistence mode - continues until verified complete',
    instructions: `
When ralph mode is active:
1. You CANNOT stop until the task is VERIFIED complete
2. Use TodoWrite to track ALL steps
3. Verify completion through oracle agent
4. If oracle rejects, continue fixing
5. Only stop when <oracle-approved>VERIFIED_COMPLETE</oracle-approved>
6. You are Sisyphus. The task is your boulder. Keep pushing.
`,
    triggerPatterns: ['ralph:', 'persist:', "don't stop until"],
  },
  {
    name: 'plan',
    description: 'Specification mode with planning interview',
    instructions: `
When plan mode is active:
1. Analyze requirements thoroughly
2. Create detailed specification with:
   - Acceptance criteria
   - Implementation plan
   - File-by-file breakdown
   - Testing strategy
3. Present plan to user
4. Get explicit approval
5. Only then proceed to implementation
6. Use ExitSpecMode tool when planning is complete
`,
    triggerPatterns: ['plan:', 'spec:', 'spec mode'],
  },
  {
    name: 'ecomode',
    description: 'Token-efficient execution with model switching',
    instructions: `
When ecomode is active:
1. Use Haiku for simple tasks
2. Use Sonnet for standard tasks
3. Reserve Opus for complex reasoning only
4. Batch operations when possible
5. Minimize token usage
`,
    triggerPatterns: ['ecomode:', 'eco:', 'efficient mode'],
  },
  {
    name: 'swarm',
    description: 'Coordinated parallel agent swarm',
    instructions: `
When swarm mode is active:
1. Break task into independent subtasks
2. Launch multiple custom droids in parallel
3. Coordinate via SQLite if needed
4. Aggregate results
5. Maximum parallelism
`,
    triggerPatterns: ['swarm:', 'parallel agents'],
  },
  {
    name: 'deepsearch',
    description: 'Exhaustive codebase exploration',
    instructions: `
When deepsearch mode is active:
1. Search ALL relevant files
2. Check multiple patterns
3. Look in tests, docs, examples
4. Never stop at first result
5. Be thorough and exhaustive
`,
    triggerPatterns: ['deepsearch:', 'deep:', 'exhaustive search'],
  },
  {
    name: 'analyze',
    description: 'Deep codebase analysis',
    instructions: `
When analyze mode is active:
1. Read key files for context
2. Search for patterns
3. Understand architecture
4. Report findings before acting
5. Provide comprehensive analysis
`,
    triggerPatterns: ['analyze:', 'analysis:', 'deep analysis'],
  },
  {
    name: 'git-master',
    description: 'Git workflow automation',
    instructions: `
When git-master skill is active:
1. Follow proper git workflow
2. Create meaningful commits
3. Write good commit messages
4. Handle branching strategy
5. Manage PR workflow
`,
    triggerPatterns: ['git-master', 'git workflow', 'commit'],
  },
  {
    name: 'security-review',
    description: 'Security auditing',
    instructions: `
When security-review skill is active:
1. Scan for security vulnerabilities
2. Check for common issues (XSS, SQL injection, etc.)
3. Review authentication/authorization
4. Check secret handling
5. Provide remediation advice
`,
    triggerPatterns: ['security', 'audit', 'vulnerability'],
  },
  {
    name: 'code-review',
    description: 'Code review automation',
    instructions: `
When code-review skill is active:
1. Review code for quality issues
2. Check for best practices
3. Identify bugs or issues
4. Suggest improvements
5. Provide constructive feedback
`,
    triggerPatterns: ['code review', 'review code', '/review'],
  },
];

/**
 * Get all registered skills
 */
export function getSkillRegistry(): SkillDefinition[] {
  return [...CORE_SKILLS];
}

/**
 * Get a specific skill by name
 */
export function getSkill(name: string): SkillDefinition | undefined {
  return CORE_SKILLS.find((s) => s.name === name);
}

/**
 * Detect which skill should be activated from user prompt
 */
export function detectSkillFromPrompt(prompt: string): SkillDefinition | null {
  const lowerPrompt = prompt.toLowerCase();

  for (const skill of CORE_SKILLS) {
    for (const pattern of skill.triggerPatterns) {
      if (lowerPrompt.includes(pattern.toLowerCase())) {
        return skill;
      }
    }
  }

  return null;
}

/**
 * Get skill instructions for system prompt
 */
export function getSkillInstructions(skillName: string): string {
  const skill = getSkill(skillName);
  if (!skill) return '';

  return `
<${skill.name}-skill>
${skill.instructions}
</${skill.name}-skill>
`;
}

/**
 * Get combined instructions for multiple skills
 */
export function getCombinedSkillInstructions(skillNames: string[]): string {
  return skillNames.map(getSkillInstructions).filter(Boolean).join('\n');
}
