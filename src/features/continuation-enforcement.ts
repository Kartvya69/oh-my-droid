/**
 * Continuation Enforcement for Oh-My-Droid
 * Adapted from oh-my-claudecode for Droid
 *
 * Ensures tasks complete before stopping (Ralph mode)
 */

/**
 * System prompt addition for continuation enforcement
 */
export const continuationSystemPromptAddition = `
<Continuation_Enforcement>
YOU MUST NOT STOP UNTIL THE TASK IS VERIFIED COMPLETE.

## Completion Requirements
Before claiming completion, you MUST verify:
1. All requirements from the original task are met
2. Build passes (if applicable)
3. Tests pass (if applicable)
4. No linting errors
5. All TODOs completed
6. Oracle verification (for critical tasks)

## Ralph Mode (Persistence)
When in Ralph mode:
- You CANNOT stop on your own
- Oracle must verify completion
- If rejected, continue fixing
- Track progress in Boulder State

## Anti-Patterns (NEVER DO)
- "The implementation is complete but untested"
- "I've done the main work, minor issues remain"
- "This should work, but I haven't verified"
- Stopping with TODOs remaining

## Completion Format
When truly complete, output:
<task-complete>
- All requirements: [verified]
- Build: [status]
- Tests: [status]
- Oracle: [approved/rejected]
</task-complete>
</Continuation_Enforcement>
`;

/**
 * Check if a completion claim is valid
 */
export function validateCompletionClaim(
  claim: string,
  requirements: string[]
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const req of requirements) {
    if (!claim.toLowerCase().includes(req.toLowerCase())) {
      missing.push(req);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Get continuation prompt for incomplete tasks
 */
export function getContinuationPrompt(
  originalTask: string,
  currentStatus: string,
  attempt: number = 1
): string {
  return `
<ralph-continuation attempt="${attempt}">

**Original Task:**
${originalTask}

**Current Status:**
${currentStatus}

**You CANNOT stop yet.**

The task is NOT complete. Continue working until:
1. ALL requirements are met
2. Verification passes
3. Oracle approves (if required)

**Next Steps:**
- Review what's remaining
- Create/update TODOs
- Continue implementation
- Verify before claiming completion

Remember: You are Sisyphus. Keep pushing.
</ralph-continuation>
`;
}
