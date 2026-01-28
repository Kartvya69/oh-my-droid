/**
 * Installer for Oh-My-Droid
 * Adapted from oh-my-claudecode for Droid
 *
 * Sets up custom droids, skills, and hooks
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync, cpSync } from 'fs';
import { join, homedir } from 'path';
import { getDroidTemplates, generateDroidFile, installDroidTemplates } from '../agents/templates.js';
import { getDefaultHooks, generateDroidHooksJson } from '../hooks/index.js';

// Installation paths
export const OMD_CONFIG_DIR = join(homedir(), '.omd');
export const DROIDS_DIR = join(OMD_CONFIG_DIR, 'droids');
export const SKILLS_DIR = join(OMD_CONFIG_DIR, 'skills');
export const HOOKS_DIR = join(OMD_CONFIG_DIR, 'hooks');
export const STATE_DIR = join(OMD_CONFIG_DIR, 'state');

// Factory paths
export const FACTORY_CONFIG_DIR = join(homedir(), '.factory');
export const FACTORY_DROIDS_DIR = join(FACTORY_CONFIG_DIR, 'droids');
export const FACTORY_SKILLS_DIR = join(FACTORY_CONFIG_DIR, 'skills');

// Project paths
export const PROJECT_OMD_DIR = '.omd';
export const PROJECT_DROIDS_DIR = join(PROJECT_OMD_DIR, 'droids');
export const PROJECT_SKILLS_DIR = join(PROJECT_OMD_DIR, 'skills');

export interface InstallOptions {
  global?: boolean;
  project?: boolean;
  droids?: boolean;
  skills?: boolean;
  hooks?: boolean;
  force?: boolean;
}

export interface InstallResult {
  success: boolean;
  installed: string[];
  errors: string[];
  warnings: string[];
}

/**
 * Check if Droid is installed
 */
export function isDroidInstalled(): boolean {
  // Check for Droid CLI
  try {
    // In a real implementation, this would check for droid command
    return existsSync(FACTORY_CONFIG_DIR);
  } catch {
    return false;
  }
}

/**
 * Check if OMD is installed
 */
export function isInstalled(): boolean {
  return existsSync(OMD_CONFIG_DIR);
}

/**
 * Get installation info
 */
export function getInstallInfo(): {
  installed: boolean;
  version: string;
  droidsInstalled: number;
  skillsInstalled: number;
} {
  const templates = getDroidTemplates();
  const installedDroids = existsSync(DROIDS_DIR)
    ? templates.filter((t) => existsSync(join(DROIDS_DIR, `${t.name}.md`))).length
    : 0;

  return {
    installed: isInstalled(),
    version: '1.0.0',
    droidsInstalled: installedDroids,
    skillsInstalled: 0, // TODO: Count skills
  };
}

/**
 * Install OMD
 */
export function install(options: InstallOptions = {}): InstallResult {
  const result: InstallResult = {
    success: true,
    installed: [],
    errors: [],
    warnings: [],
  };

  // Default to all components
  const opts = {
    global: true,
    droids: true,
    skills: true,
    hooks: true,
    ...options,
  };

  // Create directories
  try {
    if (!existsSync(OMD_CONFIG_DIR)) {
      mkdirSync(OMD_CONFIG_DIR, { recursive: true });
      result.installed.push('config directory');
    }
    if (!existsSync(STATE_DIR)) {
      mkdirSync(STATE_DIR, { recursive: true });
    }
  } catch (error: any) {
    result.errors.push(`Failed to create directories: ${error.message}`);
    result.success = false;
    return result;
  }

  // Install custom droids
  if (opts.droids) {
    try {
      // Install to OMD droids directory
      if (!existsSync(DROIDS_DIR)) {
        mkdirSync(DROIDS_DIR, { recursive: true });
      }

      const droidResult = installDroidTemplates(DROIDS_DIR);
      result.installed.push(...droidResult.installed.map((n) => `droid: ${n}`));
      result.errors.push(...droidResult.errors);

      // Also install to Factory droids directory for global access
      if (!existsSync(FACTORY_DROIDS_DIR)) {
        mkdirSync(FACTORY_DROIDS_DIR, { recursive: true });
      }
      installDroidTemplates(FACTORY_DROIDS_DIR);
    } catch (error: any) {
      result.errors.push(`Failed to install droids: ${error.message}`);
    }
  }

  // Install skills
  if (opts.skills) {
    try {
      if (!existsSync(SKILLS_DIR)) {
        mkdirSync(SKILLS_DIR, { recursive: true });
      }
      // Skills are loaded dynamically from the package
      result.installed.push('skills registry');
    } catch (error: any) {
      result.errors.push(`Failed to install skills: ${error.message}`);
    }
  }

  // Install hooks configuration
  if (opts.hooks) {
    try {
      const hooksConfig = generateDroidHooksJson();
      const hooksPath = join(OMD_CONFIG_DIR, 'hooks.json');
      writeFileSync(hooksPath, hooksConfig);
      result.installed.push('hooks configuration');

      // Also create Factory settings snippet
      const factorySettingsPath = join(FACTORY_CONFIG_DIR, 'settings.json');
      if (existsSync(factorySettingsPath)) {
        result.warnings.push(
          'Please manually merge hooks.json into your ~/.factory/settings.json'
        );
      }
    } catch (error: any) {
      result.errors.push(`Failed to install hooks: ${error.message}`);
    }
  }

  // Create default config
  try {
    const configPath = join(OMD_CONFIG_DIR, 'config.json');
    if (!existsSync(configPath) || opts.force) {
      const defaultConfig = {
        agents: {
          sisyphus: { model: 'inherit', enabled: true },
          oracle: { model: 'claude-opus', enabled: true },
          librarian: { model: 'claude-sonnet', enabled: true },
          architect: { model: 'claude-opus', enabled: true },
          executor: { model: 'inherit', enabled: true },
        },
        features: {
          parallelExecution: true,
          continuationEnforcement: true,
          autoContextInjection: true,
          magicKeywords: true,
          verificationProtocol: true,
        },
      };
      writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
      result.installed.push('default configuration');
    }
  } catch (error: any) {
    result.errors.push(`Failed to create config: ${error.message}`);
  }

  result.success = result.errors.length === 0;
  return result;
}

/**
 * Install to project
 */
export function installProject(targetDir: string = process.cwd()): InstallResult {
  const result: InstallResult = {
    success: true,
    installed: [],
    errors: [],
    warnings: [],
  };

  try {
    // Create project directories
    const projectOmdDir = join(targetDir, PROJECT_OMD_DIR);
    const projectDroidsDir = join(targetDir, PROJECT_DROIDS_DIR);
    const projectSkillsDir = join(targetDir, PROJECT_SKILLS_DIR);

    if (!existsSync(projectOmdDir)) {
      mkdirSync(projectOmdDir, { recursive: true });
      result.installed.push('project .omd directory');
    }
    if (!existsSync(projectDroidsDir)) {
      mkdirSync(projectDroidsDir, { recursive: true });
      result.installed.push('project droids directory');
    }
    if (!existsSync(projectSkillsDir)) {
      mkdirSync(projectSkillsDir, { recursive: true });
      result.installed.push('project skills directory');
    }

    // Create sample AGENTS.md
    const agentsMdPath = join(targetDir, 'AGENTS.md');
    if (!existsSync(agentsMdPath)) {
      const agentsMdContent = generateSampleAgentsMd();
      writeFileSync(agentsMdPath, agentsMdContent);
      result.installed.push('sample AGENTS.md');
    }
  } catch (error: any) {
    result.errors.push(`Failed to install project: ${error.message}`);
    result.success = false;
  }

  return result;
}

/**
 * Generate sample AGENTS.md
 */
function generateSampleAgentsMd(): string {
  return `# Project Guidelines

## Build & Test
- Build: \`npm run build\`
- Test: \`npm test\`
- Lint: \`npm run lint\`

## Code Style
- Use TypeScript strict mode
- Prefer functional components
- Write tests for new features

## Oh-My-Droid
This project uses Oh-My-Droid for multi-agent orchestration.

### Magic Keywords
- \`autopilot:\` - Full autonomous execution
- \`ralph:\` - Persistence until verified
- \`ulw:\` - Maximum parallel execution
- \`plan:\` - Specification mode

### Custom Droids
- oracle - Verification specialist
- librarian - Research specialist
- architect - Architecture advisor
- executor - Implementation specialist
`;
}

/**
 * Uninstall OMD
 */
export function uninstall(): InstallResult {
  const result: InstallResult = {
    success: true,
    installed: [],
    errors: [],
    warnings: [],
  };

  try {
    // Remove OMD config directory
    if (existsSync(OMD_CONFIG_DIR)) {
      const { rmSync } = require('fs');
      rmSync(OMD_CONFIG_DIR, { recursive: true });
      result.installed.push('removed config directory');
    }

    // Note: We don't remove Factory droids as they might be used by other tools
    result.warnings.push(
      'Custom droids in ~/.factory/droids/ were not removed. Clean up manually if desired.'
    );
  } catch (error: any) {
    result.errors.push(`Failed to uninstall: ${error.message}`);
    result.success = false;
  }

  return result;
}
