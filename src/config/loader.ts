/**
 * Configuration loader for Oh-My-Droid
 * Adapted from oh-my-claudecode for Droid
 */

import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { homedir } from 'os';
import type { PluginConfig } from '../shared/types.js';

// Configuration paths for Droid
export const OMD_DIR = '.omd';
export const OMD_CONFIG_DIR = join(homedir(), '.omd');
export const OMD_STATE_DIR = join(OMD_CONFIG_DIR, 'state');
export const OMD_DROIDS_DIR = join(OMD_CONFIG_DIR, 'droids');
export const OMD_SKILLS_DIR = join(OMD_CONFIG_DIR, 'skills');

// Project-level paths
export const PROJECT_OMD_DIR = '.omd';
export const PROJECT_DROIDS_DIR = join(PROJECT_OMD_DIR, 'droids');
export const PROJECT_SKILLS_DIR = join(PROJECT_OMD_DIR, 'skills');
export const PROJECT_STATE_DIR = join(PROJECT_OMD_DIR, 'state');
export const PROJECT_NOTEPADS_DIR = join(PROJECT_OMD_DIR, 'notepads');

// AGENTS.md paths (Droid uses AGENTS.md instead of CLAUDE.md)
export const AGENTS_MD_PATHS = [
  './AGENTS.md',
  './.factory/AGENTS.md',
  join(homedir(), '.factory/AGENTS.md'),
];

/**
 * Default configuration
 */
export const DEFAULT_CONFIG: PluginConfig = {
  agents: {
    sisyphus: { model: 'inherit', enabled: true },
    oracle: { model: 'claude-opus', enabled: true },
    librarian: { model: 'claude-sonnet', enabled: true },
    architect: { model: 'claude-opus', enabled: true },
    executor: { model: 'inherit', enabled: true },
    explore: { model: 'claude-haiku', enabled: true },
    designer: { model: 'claude-sonnet', enabled: true },
    writer: { model: 'claude-haiku', enabled: true },
    researcher: { model: 'claude-sonnet', enabled: true },
    securityReviewer: { model: 'claude-opus', enabled: true },
    codeReviewer: { model: 'claude-sonnet', enabled: true },
    buildFixer: { model: 'claude-sonnet', enabled: true },
    qaTester: { model: 'claude-sonnet', enabled: true },
  },
  features: {
    parallelExecution: true,
    continuationEnforcement: true,
    autoContextInjection: true,
    magicKeywords: true,
    verificationProtocol: true,
  },
  mcpServers: {
    context7: { enabled: true },
  },
  permissions: {
    allowExecute: true,
    allowEdit: true,
    allowCreate: true,
    maxBackgroundTasks: 10,
    maxParallelDroids: 5,
  },
  magicKeywords: {
    autopilot: ['autopilot:', 'auto:'],
    ultrawork: ['ultrawork:', 'ulw:'],
    ralph: ['ralph:', 'persist:'],
    ultrapilot: ['ultrapilot:', 'ulp:'],
    ecomode: ['ecomode:', 'eco:'],
    swarm: ['swarm:', 'parallel:'],
    pipeline: ['pipeline:', 'pipe:'],
    plan: ['plan:', 'spec:'],
    deepsearch: ['deepsearch:', 'deep:'],
    analyze: ['analyze:', 'analysis:'],
  },
  routing: {
    enabled: true,
    defaultTier: 'MEDIUM',
    escalationEnabled: true,
    maxEscalations: 2,
    tierModels: {
      LOW: 'claude-haiku',
      MEDIUM: 'claude-sonnet',
      HIGH: 'claude-opus',
    },
  },
};

/**
 * Load configuration from file or return defaults
 */
export function loadConfig(override?: Partial<PluginConfig>): PluginConfig {
  // Try to load from ~/.omd/config.json
  const globalConfigPath = join(OMD_CONFIG_DIR, 'config.json');
  let config = { ...DEFAULT_CONFIG };

  if (existsSync(globalConfigPath)) {
    try {
      const content = readFileSync(globalConfigPath, 'utf-8');
      const parsed = JSON.parse(content);
      config = mergeConfig(config, parsed);
    } catch (error) {
      console.warn('Warning: Could not parse global config, using defaults');
    }
  }

  // Try to load from project .omd/config.json
  const projectConfigPath = join(PROJECT_OMD_DIR, 'config.json');
  if (existsSync(projectConfigPath)) {
    try {
      const content = readFileSync(projectConfigPath, 'utf-8');
      const parsed = JSON.parse(content);
      config = mergeConfig(config, parsed);
    } catch (error) {
      console.warn('Warning: Could not parse project config');
    }
  }

  // Apply override
  if (override) {
    config = mergeConfig(config, override);
  }

  return config;
}

/**
 * Merge two config objects deeply
 */
function mergeConfig(base: PluginConfig, override: Partial<PluginConfig>): PluginConfig {
  return {
    ...base,
    ...override,
    agents: { ...base.agents, ...override.agents },
    features: { ...base.features, ...override.features },
    mcpServers: { ...base.mcpServers, ...override.mcpServers },
    permissions: { ...base.permissions, ...override.permissions },
    magicKeywords: { ...base.magicKeywords, ...override.magicKeywords },
    routing: override.routing ? { ...base.routing, ...override.routing } : base.routing,
  };
}

/**
 * Find AGENTS.md files in the project
 */
export function findContextFiles(cwd: string = process.cwd()): string[] {
  const found: string[] = [];

  for (const path of AGENTS_MD_PATHS) {
    const resolved = resolve(cwd, path);
    if (existsSync(resolved)) {
      found.push(resolved);
    }
  }

  return found;
}

/**
 * Load and concatenate context from AGENTS.md files
 */
export function loadContextFromFiles(paths: string[]): string {
  const contents: string[] = [];

  for (const path of paths) {
    if (existsSync(path)) {
      try {
        const content = readFileSync(path, 'utf-8');
        contents.push(`\n<!-- From: ${path} -->\n${content}`);
      } catch (error) {
        console.warn(`Warning: Could not read ${path}`);
      }
    }
  }

  return contents.join('\n---\n');
}

/**
 * Get the active AGENTS.md content
 */
export function getAgentsMdContent(cwd: string = process.cwd()): string {
  const files = findContextFiles(cwd);
  return loadContextFromFiles(files);
}

/**
 * Check if OMD is initialized in the project
 */
export function isOmdInitialized(cwd: string = process.cwd()): boolean {
  return existsSync(join(cwd, PROJECT_OMD_DIR));
}
