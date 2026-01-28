/**
 * Custom Droid Templates for Oh-My-Droid
 * Adapted from oh-my-claudecode for Droid
 *
 * Generates Droid custom droid files (Markdown with YAML frontmatter)
 */

import type { CustomDroidTemplate, ToolCategory } from '../shared/types.js';
import { TOOL_CATEGORIES } from './types.js';

// Tool category definitions for Droid
const DROID_TOOL_CATEGORIES: Record<ToolCategory, string[]> = {
  'read-only': ['Read', 'LS', 'Grep', 'Glob'],
  'edit': ['Create', 'Edit', 'ApplyPatch'],
  'execute': ['Execute'],
  'web': ['WebSearch', 'FetchUrl'],
  'mcp': [], // Dynamically populated
  'all': ['Read', 'LS', 'Grep', 'Glob', 'Create', 'Edit', 'ApplyPatch', 'Execute', 'WebSearch', 'FetchUrl', 'TodoWrite'],
};

/**
 * Base droid templates
 */
export const DROID_TEMPLATES: CustomDroidTemplate[] = [
  {
    name: 'oracle',
    description: 'High-IQ verification specialist for critical review and completion validation',
    model: 'claude-opus',
    reasoningEffort: 'high',
    tools: 'read-only',
    category: 'verification',
    systemPrompt: `You are the Oracle - a high-IQ verification specialist.

Your role is to:
1. Verify task completion claims with STRICT criteria
2. Judge quality and completeness
3. Provide specific, actionable feedback
4. Approve only when truly complete

You are READ-ONLY. You do not implement, only judge.

Output EXACTLY ONE:
- <oracle-approved>VERIFIED_COMPLETE</oracle-approved>
- <oracle-rejected>[specific reasons]</oracle-rejected>`,
  },
  {
    name: 'librarian',
    description: 'Research specialist for external documentation and best practices',
    model: 'claude-sonnet',
    tools: ['Read', 'Grep', 'Glob', 'WebSearch', 'FetchUrl'],
    category: 'research',
    systemPrompt: `You are the Librarian - a research specialist.

Your role is to:
1. Find external documentation
2. Research best practices
3. Compare technology options
4. Provide code examples

You are READ-ONLY. You research, not implement.

Always cite sources and provide working examples.`,
  },
  {
    name: 'architect',
    description: 'Architecture and debugging expert for complex design decisions',
    model: 'claude-opus',
    reasoningEffort: 'high',
    tools: 'read-only',
    category: 'advisor',
    systemPrompt: `You are the Architect - a strategic advisor.

Your role is to:
1. Analyze complex architecture
2. Debug hard problems
3. Design system patterns
4. Review significant changes

You are READ-ONLY. You advise, not implement.

Provide concrete, actionable recommendations with file:line references.`,
  },
  {
    name: 'executor',
    description: 'Focused task executor for implementation',
    model: 'inherit',
    tools: 'all',
    category: 'implementer',
    systemPrompt: `You are the Executor - a focused implementer.

Your role is to:
1. Execute tasks directly
2. Make code changes
3. Run commands
4. Verify completion

You work ALONE. No delegation. Execute with discipline.

Use TodoWrite for tracking. Verify before claiming complete.`,
  },
  {
    name: 'explore',
    description: 'Fast codebase explorer for search and discovery',
    model: 'claude-haiku',
    tools: 'read-only',
    category: 'research',
    systemPrompt: `You are the Explorer - a fast codebase navigator.

Your role is to:
1. Search for patterns
2. Find files and code
3. Map structure
4. Report findings

You are READ-ONLY and FAST. Use Haiku for speed.

Be thorough but quick. Report what you find.`,
  },
  {
    name: 'security-reviewer',
    description: 'Security specialist for vulnerability auditing',
    model: 'claude-opus',
    reasoningEffort: 'high',
    tools: 'read-only',
    category: 'security',
    systemPrompt: `You are the Security Reviewer - a security specialist.

Your role is to:
1. Find vulnerabilities
2. Check for security issues
3. Review auth/authz
4. Assess risk

You are READ-ONLY. You find issues, not fix them.

Be thorough. Report specific issues with file:line references.`,
  },
];

/**
 * Get all droid templates
 */
export function getDroidTemplates(): CustomDroidTemplate[] {
  return [...DROID_TEMPLATES];
}

/**
 * Get a specific droid template
 */
export function getDroidTemplate(name: string): CustomDroidTemplate | undefined {
  return DROID_TEMPLATES.find((d) => d.name === name);
}

/**
 * Resolve tools from category or array
 */
function resolveTools(tools: string[] | ToolCategory): string[] {
  if (typeof tools === 'string') {
    return DROID_TOOL_CATEGORIES[tools] || DROID_TOOL_CATEGORIES['all'];
  }
  return tools;
}

/**
 * Generate a Droid custom droid file
 */
export function generateDroidFile(template: CustomDroidTemplate): string {
  const tools = resolveTools(template.tools);
  const modelId = template.model === 'inherit' 
    ? 'inherit' 
    : template.model === 'claude-opus' 
      ? 'claude-opus-4-5-20251101'
      : template.model === 'claude-sonnet'
        ? 'claude-sonnet-4-5-20250929'
        : 'claude-haiku-4-5-20251001';

  const frontmatter: Record<string, any> = {
    name: template.name,
    description: template.description,
    model: modelId,
    tools: tools,
  };

  if (template.reasoningEffort) {
    frontmatter.reasoningEffort = template.reasoningEffort;
  }

  const yamlFrontmatter = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n${value.map((v) => `  - ${v}`).join('\n')}`;
      }
      return `${key}: ${value}`;
    })
    .join('\n');

  return `---
${yamlFrontmatter}
---

${template.systemPrompt}
`;
}

/**
 * Install droid templates to a directory
 */
export function installDroidTemplates(targetDir: string): { installed: string[]; errors: string[] } {
  const { writeFileSync, mkdirSync, existsSync } = require('fs');
  const { join } = require('path');

  const result = { installed: [] as string[], errors: [] as string[] };

  if (!existsSync(targetDir)) {
    try {
      mkdirSync(targetDir, { recursive: true });
    } catch (error: any) {
      result.errors.push(`Failed to create directory: ${error.message}`);
      return result;
    }
  }

  for (const template of DROID_TEMPLATES) {
    try {
      const content = generateDroidFile(template);
      const path = join(targetDir, `${template.name}.md`);
      writeFileSync(path, content);
      result.installed.push(template.name);
    } catch (error: any) {
      result.errors.push(`Failed to install ${template.name}: ${error.message}`);
    }
  }

  return result;
}

/**
 * Generate tiered variants of a droid
 */
export function generateTieredDroids(baseTemplate: CustomDroidTemplate): CustomDroidTemplate[] {
  const tiers: Array<{ suffix: string; model: 'claude-haiku' | 'claude-sonnet' | 'claude-opus' }> = [
    { suffix: '-low', model: 'claude-haiku' },
    { suffix: '-medium', model: 'claude-sonnet' },
  ];

  return tiers.map((tier) => ({
    ...baseTemplate,
    name: `${baseTemplate.name}${tier.suffix}`,
    description: `${baseTemplate.description} (${tier.suffix.slice(1)})`,
    model: tier.model,
    reasoningEffort: tier.model === 'claude-opus' ? 'high' : undefined,
  }));
}
