//**
 * Verification Protocol for Oh-My-Droid
 * Adapted from oh-my-claudecode for Droid
 *
 * Multi-layer verification system using Oracle agent
 */

import type { VerificationCheck, VerificationResult } from '../shared/types.js';

// Standard verification checks
export const VERIFICATION_CHECKS: VerificationCheck[] = [
  {
    name: 'BUILD',
    command: 'npm run build',
    description: 'Compilation passes without errors',
    required: true,
  },
  {
    name: 'TEST',
    command: 'npm test',
    description: 'All tests pass',
    required: true,
  },
  {
    name: 'LINT',
    command: 'npm run lint',
    description: 'No linting errors',
    required: false,
  },
  {
    name: 'TYPECHECK',
    command: 'npx tsc --noEmit',
    description: 'TypeScript type checking passes',
    required: true,
  },
  {
    name: 'FUNCTIONALITY',
    description: 'Feature works as expected',
    required: true,
  },
  {
    name: 'ORACLE',
    description: 'Oracle verification approved',
    required: false,
  },
  {
    name: 'TODO',
    description: 'All TODOs completed',
    required: true,
  },
  {
    name: 'ERROR_FREE',
    description: 'No unresolved errors',
    required: true,
  },
];

/**
 * Run a verification check
 */
export async function runVerification(
  check: VerificationCheck,
  cwd: string = process.cwd()
): Promise<VerificationResult> {
  // For checks without commands, return pending
  if (!check.command) {
    return {
      check: check.name,
      passed: false,
      error: 'Manual verification required',
    };
  }

  try {
    const { execSync } = require('child_process');
    const output = execSync(check.command, {
      cwd,
      encoding: 'utf-8',
      timeout: 60000,
    });

    return {
      check: check.name,
      passed: true,
      output: output.slice(0, 1000), // Limit output size
    };
  } catch (error: any) {
    return {
      check: check.name,
      passed: false,
      output: error.stdout?.slice(0, 1000),
      error: error.stderr?.slice(0, 1000) || error.message,
    };
  }
}

/**
 * Run all verification checks
 */
export async function runAllVerifications(
  cwd: string = process.cwd()
): Promise<VerificationResult[]> {
  const results: VerificationResult[] = [];

  for (const check of VERIFICATION_CHECKS) {
    if (check.command) {
      const result = await runVerification(check, cwd);
      results.push(result);
    }
  }

  return results;
}

/**
 * Format verification results
 */
export function formatVerificationResults(results: VerificationResult[]): string {
  const lines: string[] = ['## Verification Results\n'];

  let passed = 0;
  let failed = 0;

  for (const result of results) {
    const icon = result.passed ? '✅' : '❌';
    lines.push(`${icon} **${result.check}**: ${result.passed ? 'PASSED' : 'FAILED'}`);

    if (result.passed) {
      passed++;
    } else {
      failed++;
    }

    if (result.error) {
      lines.push(`   Error: ${result.error.slice(0, 200)}`);
    }
  }

  lines.push(`\n**Summary**: ${passed} passed, ${failed} failed`);

  return lines.join('\n');
}

/**
 * Check if all required verifications pass
 */
export function allRequiredPass(results: VerificationResult[]): boolean {
  const requiredChecks = VERIFICATION_CHECKS.filter((c) => c.required).map((c) => c.name);

  for (const checkName of requiredChecks) {
    const result = results.find((r) => r.check === checkName);
    if (!result || !result.passed) {
      return false;
    }
  }

  return true;
}

/**
 * Get Oracle verification prompt
 */
export function getOracleVerificationPrompt(
  originalTask: string,
  completionClaim: string
): string {
  return `
<oracle-verification-request>

**Original Task:**
${originalTask}

**Completion Claim:**
${completionClaim}

**Your Role:**
Verify this completion claim with STRICT criteria:

1. Are ALL requirements from the original task met?
2. Is the implementation complete, not partial?
3. Are there any obvious bugs or issues?
4. Does the code compile/run without errors?
5. Are tests passing (if applicable)?

**Output EXACTLY ONE:**
- <oracle-approved>VERIFIED_COMPLETE</oracle-approved>
- <oracle-rejected>[specific reasons and required fixes]</oracle-rejected>

Be STRICT. Partial completions should be REJECTED.
</oracle-verification-request>
`;
}
