/**
 * Boulder State for Oh-My-Droid
 * Adapted from oh-my-claudecode for Droid
 *
 * Tracks plan progress and persistence state (Ralph mode)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { BoulderState, PlanProgress, PlanSummary } from '../shared/types.js';

// State paths
export const OMD_DIR = '.omd';
export const STATE_DIR = join(OMD_DIR, 'state');
export const BOULDER_FILE = 'boulder.json';
export const NOTEPAD_DIR = join(OMD_DIR, 'notepads');
export const PLANS_DIR = join(OMD_DIR, 'plans');

export const BOULDER_DIR = STATE_DIR;
export const BOULDER_STATE_PATH = join(STATE_DIR, BOULDER_FILE);
export const NOTEPAD_BASE_PATH = NOTEPAD_DIR;
export const PLANNER_PLANS_DIR = PLANS_DIR;
export const PLAN_EXTENSION = '.md';

/**
 * Get the boulder file path for a plan
 */
export function getBoulderFilePath(planName?: string): string {
  if (!planName) {
    return BOULDER_STATE_PATH;
  }
  return join(STATE_DIR, `${planName}.json`);
}

/**
 * Ensure state directories exist
 */
export function ensureStateDirs(): void {
  if (!existsSync(OMD_DIR)) {
    mkdirSync(OMD_DIR, { recursive: true });
  }
  if (!existsSync(STATE_DIR)) {
    mkdirSync(STATE_DIR, { recursive: true });
  }
  if (!existsSync(NOTEPAD_DIR)) {
    mkdirSync(NOTEPAD_DIR, { recursive: true });
  }
  if (!existsSync(PLANS_DIR)) {
    mkdirSync(PLANS_DIR, { recursive: true });
  }
}

/**
 * Read boulder state
 */
export function readBoulderState(planName?: string): BoulderState | null {
  const path = getBoulderFilePath(planName);
  if (!existsSync(path)) {
    return null;
  }

  try {
    const content = readFileSync(path, 'utf-8');
    return JSON.parse(content) as BoulderState;
  } catch (error) {
    console.warn(`Warning: Could not read boulder state from ${path}`);
    return null;
  }
}

/**
 * Write boulder state
 */
export function writeBoulderState(state: BoulderState, planName?: string): void {
  ensureStateDirs();
  const path = getBoulderFilePath(planName);
  writeFileSync(path, JSON.stringify(state, null, 2));
}

/**
 * Create a new boulder state
 */
export function createBoulderState(planName: string): BoulderState {
  const now = new Date().toISOString();
  return {
    planName,
    sessionIds: [],
    createdAt: now,
    updatedAt: now,
    status: 'active',
    progress: {
      totalTasks: 0,
      completedTasks: 0,
    },
  };
}

/**
 * Append a session ID to boulder state
 */
export function appendSessionId(planName: string, sessionId: string): void {
  const state = readBoulderState(planName) || createBoulderState(planName);
  if (!state.sessionIds.includes(sessionId)) {
    state.sessionIds.push(sessionId);
    state.updatedAt = new Date().toISOString();
    writeBoulderState(state, planName);
  }
}

/**
 * Clear boulder state
 */
export function clearBoulderState(planName?: string): void {
  const path = getBoulderFilePath(planName);
  if (existsSync(path)) {
    try {
      // Rename to backup instead of deleting
      const backupPath = `${path}.backup.${Date.now()}`;
      writeFileSync(backupPath, readFileSync(path));
    } catch (error) {
      // Ignore backup errors
    }
  }
}

/**
 * Check if a boulder exists
 */
export function hasBoulder(planName?: string): boolean {
  return existsSync(getBoulderFilePath(planName));
}

/**
 * Get plan progress
 */
export function getPlanProgress(planName: string): PlanProgress | undefined {
  const state = readBoulderState(planName);
  return state?.progress;
}

/**
 * Update plan progress
 */
export function updatePlanProgress(
  planName: string,
  progress: Partial<PlanProgress>
): void {
  const state = readBoulderState(planName) || createBoulderState(planName);
  state.progress = { ...state.progress, ...progress };
  state.updatedAt = new Date().toISOString();
  writeBoulderState(state, planName);
}

/**
 * Get plan name from active boulder
 */
export function getPlanName(): string | undefined {
  const state = readBoulderState();
  return state?.planName;
}

/**
 * Get active plan path
 */
export function getActivePlanPath(): string | undefined {
  const planName = getPlanName();
  if (!planName) return undefined;
  return join(PLANS_DIR, `${planName}${PLAN_EXTENSION}`);
}

/**
 * Find all planner plans
 */
export function findPlannerPlans(): string[] {
  if (!existsSync(PLANS_DIR)) {
    return [];
  }

  try {
    const { readdirSync } = require('fs');
    return readdirSync(PLANS_DIR)
      .filter((f: string) => f.endsWith(PLAN_EXTENSION))
      .map((f: string) => f.replace(PLAN_EXTENSION, ''));
  } catch (error) {
    return [];
  }
}

/**
 * Get summaries of all plans
 */
export function getPlanSummaries(): PlanSummary[] {
  const plans = findPlannerPlans();
  return plans.map((name) => {
    const state = readBoulderState(name);
    const progress = state?.progress;
    return {
      planName: name,
      status: state?.status || 'unknown',
      progress: progress
        ? `${progress.completedTasks}/${progress.totalTasks}`
        : 'unknown',
      sessions: state?.sessionIds.length || 0,
    };
  });
}
