/**
 * Agent types for Oh-My-Droid
 * Adapted from oh-my-claudecode
 */

export type ModelType = 'inherit' | 'claude-opus' | 'claude-sonnet' | 'claude-haiku' | 'custom';

export interface AgentPromptMetadata {
  category: 'advisor' | 'specialist' | 'orchestrator' | 'research' | 'creative';
  cost: 'CHEAP' | 'MODERATE' | 'EXPENSIVE';
  promptAlias: string;
  triggers: Array<{
    domain: string;
    trigger: string;
  }>;
  useWhen: string[];
  avoidWhen: string[];
}

export interface AgentConfig {
  name: string;
  description: string;
  prompt: string;
  tools: string[];
  model?: ModelType;
  defaultModel?: ModelType;
  reasoningEffort?: 'low' | 'medium' | 'high';
  metadata?: AgentPromptMetadata;
}

// Tool category mapping for Droid
export const TOOL_CATEGORIES: Record<string, string[]> = {
  'read-only': ['Read', 'LS', 'Grep', 'Glob'],
  'edit': ['Create', 'Edit', 'ApplyPatch'],
  'execute': ['Execute'],
  'web': ['WebSearch', 'FetchUrl'],
  'mcp': [], // Dynamically populated
  'all': ['Read', 'LS', 'Grep', 'Glob', 'Create', 'Edit', 'ApplyPatch', 'Execute', 'WebSearch', 'FetchUrl', 'TodoWrite']
};

// Model mapping for Droid
export const MODEL_MAPPING: Record<string, string> = {
  'opus': 'claude-opus-4-5-20251101',
  'sonnet': 'claude-sonnet-4-5-20250929',
  'haiku': 'claude-haiku-4-5-20251001',
  'inherit': 'inherit'
};
