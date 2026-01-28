/**
 * Background Task Management for Oh-My-Droid
 * Adapted from oh-my-claudecode for Droid
 *
 * Manages parallel execution of custom droids
 */

import type { BackgroundTask, TaskExecutionDecision } from '../shared/types.js';

// Default limits
export const DEFAULT_MAX_BACKGROUND_TASKS = 10;
export const DEFAULT_MAX_PARALLEL_DROIDS = 5;

// Patterns that indicate long-running tasks
export const LONG_RUNNING_PATTERNS = [
  /build|compile|transpile/i,
  /test.*all|full.*test/i,
  /install|npm install|pip install/i,
  /search.*codebase|explore.*all/i,
  /analyze.*entire|review.*all/i,
  /refactor.*multiple|migrate.*database/i,
];

// Patterns that indicate blocking/waiting tasks
export const BLOCKING_PATTERNS = [
  /wait|sleep|pause/i,
  /listen|watch|monitor/i,
  /server.*start|dev.*mode/i,
  /interactive|prompt|input/i,
];

/**
 * Determine if a task should run in the background
 */
export function shouldRunInBackground(
  taskPrompt: string,
  currentTaskCount: number,
  maxTasks: number = DEFAULT_MAX_BACKGROUND_TASKS
): TaskExecutionDecision {
  // Check if at capacity
  if (currentTaskCount >= maxTasks) {
    return {
      shouldRunInBackground: false,
      reason: 'At maximum background task capacity',
    };
  }

  // Check for long-running patterns
  for (const pattern of LONG_RUNNING_PATTERNS) {
    if (pattern.test(taskPrompt)) {
      return {
        shouldRunInBackground: true,
        reason: 'Long-running task detected',
        estimatedDuration: 'long',
      };
    }
  }

  // Check for blocking patterns (should NOT be background)
  for (const pattern of BLOCKING_PATTERNS) {
    if (pattern.test(taskPrompt)) {
      return {
        shouldRunInBackground: false,
        reason: 'Task requires blocking/interactive execution',
      };
    }
  }

  // Default: run in foreground
  return {
    shouldRunInBackground: false,
    reason: 'Standard task, foreground execution',
  };
}

/**
 * Get guidance for background task execution
 */
export function getBackgroundTaskGuidance(
  taskType: string,
  droidType: string
): string {
  const guidance: Record<string, string> = {
    explore: `Spawn explore droid in background for ${taskType}:
Task(subagent_type="explore", prompt="${taskType}", run_in_background=true)`,

    research: `Spawn librarian in background for ${taskType}:
Task(subagent_type="librarian", prompt="${taskType}", run_in_background=true)`,

    analyze: `Spawn architect in background for ${taskType}:
Task(subagent_type="architect", prompt="${taskType}", run_in_background=true)`,

    implement: `Spawn executor in background for ${taskType}:
Task(subagent_type="executor", prompt="${taskType}", run_in_background=true)`,
  };

  return guidance[droidType] || `Spawn ${droidType} droid in background for ${taskType}`;
}

/**
 * Create a background task manager
 */
export function createBackgroundTaskManager(
  maxTasks: number = DEFAULT_MAX_BACKGROUND_TASKS
): {
  tasks: Map<string, BackgroundTask>;
  addTask: (task: Omit<BackgroundTask, 'id' | 'status'>) => string;
  updateTask: (id: string, updates: Partial<BackgroundTask>) => void;
  getTask: (id: string) => BackgroundTask | undefined;
  getAllTasks: () => BackgroundTask[];
  getActiveTasks: () => BackgroundTask[];
  getCompletedTasks: () => BackgroundTask[];
  clearCompleted: () => void;
} {
  const tasks = new Map<string, BackgroundTask>();
  let taskIdCounter = 0;

  return {
    tasks,

    addTask: (task) => {
      const id = `task-${++taskIdCounter}`;
      const newTask: BackgroundTask = {
        ...task,
        id,
        status: 'pending',
        startTime: Date.now(),
      };
      tasks.set(id, newTask);
      return id;
    },

    updateTask: (id, updates) => {
      const task = tasks.get(id);
      if (task) {
        Object.assign(task, updates);
        if (updates.status === 'completed' || updates.status === 'error') {
          task.endTime = Date.now();
        }
      }
    },

    getTask: (id) => tasks.get(id),

    getAllTasks: () => Array.from(tasks.values()),

    getActiveTasks: () =>
      Array.from(tasks.values()).filter(
        (t) => t.status === 'pending' || t.status === 'running'
      ),

    getCompletedTasks: () =>
      Array.from(tasks.values()).filter(
        (t) => t.status === 'completed' || t.status === 'error'
      ),

    clearCompleted: () => {
      for (const [id, task] of tasks) {
        if (task.status === 'completed' || task.status === 'error') {
          tasks.delete(id);
        }
      }
    },
  };
}

export type BackgroundTaskManager = ReturnType<typeof createBackgroundTaskManager>;
