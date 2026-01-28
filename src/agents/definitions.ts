/**
 * Agent Definitions for Oh-My-Droid
 *
 * This module provides:
 * 1. Base agents (oracle, librarian, architect, executor, etc.)
 * 2. Tiered agent variants for smart model routing
 * 3. getAgentDefinitions() for agent registry
 * 4. omdSystemPrompt for the main orchestrator
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import type { AgentConfig, ModelType } from './types.js';

// Re-export base agents
export { oracleAgent, ORACLE_PROMPT_METADATA } from './oracle.js';
export { librarianAgent, LIBRARIAN_PROMPT_METADATA } from './librarian.js';
export { architectAgent, ARCHITECT_PROMPT_METADATA } from './architect.js';
export { executorAgent, EXECUTOR_PROMPT_METADATA } from './executor.js';
export { coordinatorAgent, COORDINATOR_PROMPT_METADATA } from './coordinator.js';
export { researcherAgent, RESEARCHER_PROMPT_METADATA } from './researcher.js';
export { designerAgent, DESIGNER_PROMPT_METADATA } from './designer.js';
export { writerAgent, WRITER_PROMPT_METADATA } from './writer.js';
export { criticAgent, CRITIC_PROMPT_METADATA } from './critic.js';
export { analystAgent, ANALYST_PROMPT_METADATA } from './analyst.js';
export { plannerAgent, PLANNER_PROMPT_METADATA } from './planner.js';
export { qaTesterAgent, QA_TESTER_PROMPT_METADATA } from './qa-tester.js';
export { scientistAgent, SCIENTIST_PROMPT_METADATA } from './scientist.js';
export { visionAgent, VISION_PROMPT_METADATA } from './vision.js';
export { securityReviewerAgent, SECURITY_REVIEWER_PROMPT_METADATA } from './security-reviewer.js';
export { buildFixerAgent, BUILD_FIXER_PROMPT_METADATA } from './build-fixer.js';
export { tddGuideAgent, TDD_GUIDE_PROMPT_METADATA } from './tdd-guide.js';
export { codeReviewerAgent, CODE_REVIEWER_PROMPT_METADATA } from './code-reviewer.js';
export { prometheusAgent, PROMETHEUS_PROMPT_METADATA } from './prometheus.js';
export { momusAgent, MOMUS_PROMPT_METADATA } from './momus.js';
export { metisAgent, METIS_PROMPT_METADATA } from './metis.js';

// Import base agents for use in getAgentDefinitions
import { oracleAgent } from './oracle.js';
import { librarianAgent } from './librarian.js';
import { architectAgent } from './architect.js';
import { executorAgent } from './executor.js';
import { coordinatorAgent } from './coordinator.js';
import { researcherAgent } from './researcher.js';
import { designerAgent } from './designer.js';
import { writerAgent } from './writer.js';
import { criticAgent } from './critic.js';
import { analystAgent } from './analyst.js';
import { plannerAgent } from './planner.js';
import { qaTesterAgent } from './qa-tester.js';
import { scientistAgent } from './scientist.js';
import { visionAgent } from './vision.js';
import { securityReviewerAgent } from './security-reviewer.js';
import { buildFixerAgent } from './build-fixer.js';
import { tddGuideAgent } from './tdd-guide.js';
import { codeReviewerAgent } from './code-reviewer.js';
import { prometheusAgent } from './prometheus.js';
import { momusAgent } from './momus.js';
import { metisAgent } from './metis.js';

// ============================================================
// DYNAMIC PROMPT LOADING
// ============================================================

/**
 * Get the package root directory
 */
function getPackageDir(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return join(__dirname, '..', '..');
}

/**
 * Load a custom droid template from /droids/{name}.md
 */
function loadDroidTemplate(name: string): string {
  try {
    const droidPath = join(getPackageDir(), 'droids', `${name}.md`);
    const content = readFileSync(droidPath, 'utf-8');
    // Extract content after YAML frontmatter
    const match = content.match(/^---[\s\S]*?---\s*([\s\S]*)$/);
    return match ? match[1].trim() : content.trim();
  } catch (error) {
    console.warn(`Warning: Could not load droid template for ${name}`);
    return `Droid: ${name}\n\nTemplate file not found.`;
  }
}

// ============================================================
// TIERED AGENT VARIANTS
// For Droid, we use model inheritance and reasoning effort
// ============================================================

/**
 * Architect-Low Agent - Quick Analysis (Haiku)
 */
export const architectLowAgent: AgentConfig = {
  name: 'architect-low',
  description: 'Quick code questions & simple lookups (Haiku). Use for simple questions that need fast answers.',
  prompt: loadDroidTemplate('architect-low') || architectAgent.prompt,
  tools: ['Read', 'Glob', 'Grep'],
  model: 'claude-haiku',
  defaultModel: 'claude-haiku',
};

/**
 * Architect-Medium Agent - Standard Analysis (Sonnet)
 */
export const architectMediumAgent: AgentConfig = {
  name: 'architect-medium',
  description: 'Architecture & Debugging Advisor - Medium complexity (Sonnet). Use for moderate analysis.',
  prompt: loadDroidTemplate('architect-medium') || architectAgent.prompt,
  tools: ['Read', 'Glob', 'Grep', 'Execute', 'WebSearch', 'FetchUrl'],
  model: 'claude-sonnet',
  defaultModel: 'claude-sonnet',
};

/**
 * Executor-Low Agent - Simple Execution (Haiku)
 */
export const executorLowAgent: AgentConfig = {
  name: 'executor-low',
  description: 'Simple single-file task executor (Haiku). Use for trivial tasks.',
  prompt: loadDroidTemplate('executor-low') || executorAgent.prompt,
  tools: ['Read', 'Glob', 'Grep', 'Edit', 'Create', 'TodoWrite'],
  model: 'claude-haiku',
  defaultModel: 'claude-haiku',
};

/**
 * Executor-High Agent - Complex Execution (Opus)
 */
export const executorHighAgent: AgentConfig = {
  name: 'executor-high',
  description: 'Complex task executor for multi-file changes (Opus). Use for tasks requiring deep reasoning.',
  prompt: loadDroidTemplate('executor-high') || executorAgent.prompt,
  tools: ['Read', 'Glob', 'Grep', 'Edit', 'Create', 'ApplyPatch', 'Execute', 'TodoWrite', 'WebSearch', 'FetchUrl'],
  model: 'claude-opus',
  defaultModel: 'claude-opus',
  reasoningEffort: 'high',
};

// ============================================================
// AGENT REGISTRY
// ============================================================

/**
 * Get all agent definitions
 */
export function getAgentDefinitions(): Record<string, AgentConfig> {
  return {
    // Core orchestrator
    coordinator: coordinatorAgent,
    
    // Base agents
    oracle: oracleAgent,
    librarian: librarianAgent,
    architect: architectAgent,
    executor: executorAgent,
    
    // Phase 1: Core agents
    researcher: researcherAgent,
    designer: designerAgent,
    writer: writerAgent,
    
    // Phase 2: Specialized agents
    vision: visionAgent,
    critic: criticAgent,
    analyst: analystAgent,
    planner: plannerAgent,
    'qa-tester': qaTesterAgent,
    scientist: scientistAgent,
    
    // Phase 3: Utility agents
    'security-reviewer': securityReviewerAgent,
    'build-fixer': buildFixerAgent,
    'tdd-guide': tddGuideAgent,
    'code-reviewer': codeReviewerAgent,
    prometheus: prometheusAgent,
    momus: momusAgent,
    metis: metisAgent,
    
    // Tiered variants
    'architect-low': architectLowAgent,
    'architect-medium': architectMediumAgent,
    'executor-low': executorLowAgent,
    'executor-high': executorHighAgent,
  };
}

/**
 * Get agent by name
 */
export function getAgent(name: string): AgentConfig | undefined {
  return getAgentDefinitions()[name];
}

// ============================================================
// ORCHESTRATOR SYSTEM PROMPT
// ============================================================

export const omdSystemPrompt = `<Role>
Sisyphus Orchestrator - Master Agent Coordinator for Oh-My-Droid

**IDENTITY**: You are the central orchestrator. Your job is to route tasks to the right specialized agents.
**OUTPUT**: Coordination, delegation decisions, and synthesis of agent outputs.
</Role>

<Critical_Constraints>
YOU ARE AN ORCHESTRATOR, NOT AN EXECUTOR.

Your primary tool is the Task tool for spawning custom droids:
- Task(subagent_type="oracle", prompt="...")
- Task(subagent_type="librarian", prompt="...")
- Task(subagent_type="architect", prompt="...")
- Task(subagent_type="executor", prompt="...")

FORBIDDEN for you:
- Direct file modifications (delegate to executor)
- Long-running implementations (delegate to executor)
- Deep research (delegate to librarian)
- Complex debugging (delegate to architect)
</Critical_Constraints>

<Agent_Catalog>
## Available Custom Droids

| Droid | Model | Tools | Use For |
|-------|-------|-------|---------|
| oracle | claude-opus | read-only | Verification, critical review |
| librarian | claude-sonnet | web | External research, docs |
| architect | claude-opus | read-only | Architecture, debugging |
| architect-medium | claude-sonnet | read-only | Standard analysis |
| architect-low | claude-haiku | read-only | Quick lookups |
| executor | inherit | all | Implementation |
| executor-high | claude-opus | all | Complex implementation |
| executor-low | claude-haiku | edit | Quick fixes |

## Model Routing
- LOW (Haiku): Simple lookups, trivial fixes
- MEDIUM (Sonnet): Standard tasks
- HIGH (Opus): Complex reasoning, architecture
</Agent_Catalog>

<Delegation_Principles>
1. **ALWAYS delegate** substantive work to specialized droids
2. **PARALLEL execution**: Spawn independent agents simultaneously
3. **NEVER do** what a specialized droid can do better
4. **SYNTHESIZE** results from multiple agents
5. **VERIFY** completion through oracle when critical
</Delegation_Principles>

<Workflow>
1. Analyze user request
2. Determine required expertise
3. Spawn appropriate droids via Task tool
4. Synthesize results
5. Present final answer
</Workflow>`;

// ============================================================
// EXPORTS
// ============================================================

export { getAgentDefinitions, getAgent, omdSystemPrompt };
