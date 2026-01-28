/**
 * Oh-My-Droid
 *
 * A multi-agent orchestration system for Factory Droid CLI.
 * Inspired by oh-my-claudecode, reimagined for Droid.
 *
 * Main features:
 * - Sisyphus: Primary orchestrator that delegates to specialized custom droids
 * - Parallel execution: Background droids run concurrently
 * - Custom droids: Oracle, Librarian, Architect, Executor, etc.
 * - Skills system: Droid-native SKILL.md capabilities
 * - Magic keywords: Special triggers for enhanced behaviors
 * - Verification protocol: Oracle-based completion verification
 */

import { loadConfig, findContextFiles, loadContextFromFiles } from './config/loader.js';
import { getAgentDefinitions, omdSystemPrompt } from './agents/definitions.js';
import type { PluginConfig, SessionState } from './shared/types.js';

// Core exports
export { loadConfig, getAgentDefinitions, omdSystemPrompt };
export * from './shared/types.js';

// Agent exports
export {
  oracleAgent,
  ORACLE_PROMPT_METADATA,
  librarianAgent,
  LIBRARIAN_PROMPT_METADATA,
  architectAgent,
  ARCHITECT_PROMPT_METADATA,
  executorAgent,
  EXECUTOR_PROMPT_METADATA,
  coordinatorAgent,
  COORDINATOR_PROMPT_METADATA,
  researcherAgent,
  RESEARCHER_PROMPT_METADATA,
  designerAgent,
  DESIGNER_PROMPT_METADATA,
  writerAgent,
  WRITER_PROMPT_METADATA,
  criticAgent,
  CRITIC_PROMPT_METADATA,
  analystAgent,
  ANALYST_PROMPT_METADATA,
  plannerAgent,
  PLANNER_PROMPT_METADATA,
  qaTesterAgent,
  QA_TESTER_PROMPT_METADATA,
  scientistAgent,
  SCIENTIST_PROMPT_METADATA,
  visionAgent,
  VISION_PROMPT_METADATA,
  securityReviewerAgent,
  SECURITY_REVIEWER_PROMPT_METADATA,
  buildFixerAgent,
  BUILD_FIXER_PROMPT_METADATA,
  tddGuideAgent,
  TDD_GUIDE_PROMPT_METADATA,
  codeReviewerAgent,
  CODE_REVIEWER_PROMPT_METADATA,
  prometheusAgent,
  PROMETHEUS_PROMPT_METADATA,
  momusAgent,
  MOMUS_PROMPT_METADATA,
  metisAgent,
  METIS_PROMPT_METADATA,
} from './agents/definitions.js';

// Features exports (to be implemented)
export {
  createMagicKeywordProcessor,
  detectMagicKeywords,
} from './features/magic-keywords.js';

export {
  createBackgroundTaskManager,
  shouldRunInBackground,
  getBackgroundTaskGuidance,
  DEFAULT_MAX_BACKGROUND_TASKS,
  type BackgroundTaskManager,
  type TaskExecutionDecision,
} from './features/background-tasks.js';

export {
  continuationSystemPromptAddition,
} from './features/continuation-enforcement.js';

// Boulder State exports
export {
  type BoulderState,
  type PlanProgress,
  type PlanSummary,
  BOULDER_DIR,
  BOULDER_FILE,
  BOULDER_STATE_PATH,
  NOTEPAD_DIR,
  NOTEPAD_BASE_PATH,
  getBoulderFilePath,
  readBoulderState,
  writeBoulderState,
  clearBoulderState,
  hasBoulder,
} from './features/boulder-state.js';

// Notepad Wisdom exports
export {
  type WisdomEntry,
  type WisdomCategory,
  type PlanWisdom,
  initPlanNotepad,
  addLearning,
  addDecision,
  addIssue,
  addProblem,
  readPlanWisdom,
  getWisdomSummary,
} from './features/notepad-wisdom.js';

// Verification exports
export {
  type VerificationCheck,
  type VerificationResult,
  VERIFICATION_CHECKS,
  runVerification,
  formatVerificationResults,
} from './features/verification.js';

// Skills exports
export {
  type SkillDefinition,
  getSkillRegistry,
  getSkill,
  detectSkillFromPrompt,
} from './skills/registry.js';

// Custom Droid exports
export {
  type CustomDroidTemplate,
  getDroidTemplates,
  generateDroidFile,
  installDroidTemplates,
} from './agents/templates.js';

// Config exports
export {
  findContextFiles,
  loadContextFromFiles,
} from './config/loader.js';

// Hooks exports
export * from './hooks/index.js';

// CLI exports
export {
  expandCommand,
  expandCommandPrompt,
  getCommand,
  getAllCommands,
  listCommands,
  commandExists,
} from './commands/index.js';

// Installer exports
export {
  install,
  isInstalled,
  getInstallInfo,
  isDroidInstalled,
  OMD_CONFIG_DIR,
  AGENTS_DIR,
  COMMANDS_DIR,
  DROIDS_DIR,
  SKILLS_DIR,
  type InstallResult,
  type InstallOptions,
} from './installer/index.js';

// Version
export const VERSION = '1.0.0';
export const PACKAGE_NAME = 'oh-my-droid';

/**
 * Options for creating an OMD session
 */
export interface OmdSessionOptions {
  /** Custom configuration (merged with loaded config) */
  config?: Partial<PluginConfig>;
  /** Working directory (default: process.cwd()) */
  cwd?: string;
  /** Session ID for resuming */
  sessionId?: string;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Create a new OMD session
 */
export function createOmdSession(options: OmdSessionOptions = {}) {
  const config = loadConfig(options.config);
  
  return {
    config,
    agents: getAgentDefinitions(),
    systemPrompt: omdSystemPrompt,
    version: VERSION,
  };
}

// Default export
export default {
  VERSION,
  PACKAGE_NAME,
  createOmdSession,
  getAgentDefinitions,
  omdSystemPrompt,
  loadConfig,
};
