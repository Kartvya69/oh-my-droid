/**
 * Hooks System for Oh-My-Droid
 * Adapted from oh-my-claudecode for Droid
 *
 * Droid-native hooks for lifecycle events
 */

import type { HookDefinition, HookContext, HookResult } from '../shared/types.js';

// Re-export hook types
export type { HookDefinition, HookContext, HookResult };

/**
 * PostToolUse hook for auto-formatting and validation
 */
export const postToolUseHook: HookDefinition = {
  event: 'PostToolUse',
  matcher: 'Edit|Create',
  command: `
    # Auto-format edited files
    file_path=$(echo "$1" | jq -r '.tool_input.file_path // empty')
    if [ -n "$file_path" ]; then
      # Run prettier for JS/TS files
      if echo "$file_path" | grep -qE '\.(js|ts|jsx|tsx|json|md)$'; then
        npx prettier --write "$file_path" 2>/dev/null || true
      fi
      # Run black for Python files  
      if echo "$file_path" | grep -qE '\.py$'; then
        black "$file_path" 2>/dev/null || true
      fi
    fi
  `,
};

/**
 * PreToolUse hook for file protection
 */
export const preToolUseHook: HookDefinition = {
  event: 'PreToolUse',
  matcher: 'Edit|Create',
  command: `
    # Protect sensitive files
    file_path=$(echo "$1" | jq -r '.tool_input.file_path // empty')
    if [ -n "$file_path" ]; then
      # Block edits to sensitive files
      if echo "$file_path" | grep -qE '(\.env|\.env\.local|secrets|credentials)'; then
        echo "Error: Cannot edit sensitive file: $file_path" >&2
        exit 1
      fi
    fi
  `,
};

/**
 * SessionStart hook for OMD initialization
 */
export const sessionStartHook: HookDefinition = {
  event: 'SessionStart',
  command: `
    # Initialize OMD session
    echo "Oh-My-Droid initialized"
    
    # Check for active modes
    if [ -f ".omd/state/boulder.json" ]; then
      echo "Active plan detected"
    fi
  `,
};

/**
 * SessionEnd hook for cleanup
 */
export const sessionEndHook: HookDefinition = {
  event: 'SessionEnd',
  command: `
    # Cleanup OMD session
    echo "Oh-My-Droid session ended"
  `,
};

/**
 * Get all default hooks
 */
export function getDefaultHooks(): HookDefinition[] {
  return [
    postToolUseHook,
    preToolUseHook,
    sessionStartHook,
    sessionEndHook,
  ];
}

/**
 * Create a hook configuration for Droid settings.json
 */
export function createHookConfig(hooks: HookDefinition[]): Record<string, any> {
  const config: Record<string, any> = { hooks: {} };

  for (const hook of hooks) {
    if (!config.hooks[hook.event]) {
      config.hooks[hook.event] = [];
    }

    config.hooks[hook.event].push({
      matcher: hook.matcher || '*',
      hooks: [
        {
          type: 'command',
          command: hook.command,
        },
      ],
    });
  }

  return config;
}

/**
 * Generate hooks.json content for Droid
 */
export function generateDroidHooksJson(): string {
  const hooks = getDefaultHooks();
  const config = createHookConfig(hooks);
  return JSON.stringify(config, null, 2);
}
