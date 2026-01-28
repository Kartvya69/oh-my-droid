/**
 * Shared types for Oh-My-Droid
 * Adapted from oh-my-claudecode for Factory Droid
 */

export type ModelType = 'inherit' | 'claude-opus' | 'claude-sonnet' | 'claude-haiku' | 'custom';

export type ToolCategory = 'read-only' | 'edit' | 'execute' | 'web' | 'mcp' | 'all';

export interface DroidConfig {
  name: string;
  description: string;
  model: ModelType;
  reasoningEffort?: 'low' | 'medium' | 'high';
  tools: string[] | ToolCategory;
  prompt: string;
}

export interface AgentConfig {
  name: string;
  description: string;
  prompt: string;
  tools: string[];
  model?: ModelType;
  defaultModel?: ModelType;
  reasoningEffort?: 'low' | 'medium' | 'high';
}

export interface PluginConfig {
  // Agent model overrides
  agents?: {
    sisyphus?: { model?: string; enabled?: boolean };
    oracle?: { model?: string; enabled?: boolean };
    librarian?: { model?: string; enabled?: boolean };
    architect?: { model?: string; enabled?: boolean };
    executor?: { model?: string; enabled?: boolean };
    explore?: { model?: string; enabled?: boolean };
    designer?: { model?: string; enabled?: boolean };
    writer?: { model?: string; enabled?: boolean };
    researcher?: { model?: string; enabled?: boolean };
    securityReviewer?: { model?: string; enabled?: boolean };
    codeReviewer?: { model?: string; enabled?: boolean };
    buildFixer?: { model?: string; enabled?: boolean };
    qaTester?: { model?: string; enabled?: boolean };
    prometheus?: { model?: string; enabled?: boolean };
    momus?: { model?: string; enabled?: boolean };
    metis?: { model?: string; enabled?: boolean };
  };

  // Feature toggles
  features?: {
    parallelExecution?: boolean;
    continuationEnforcement?: boolean;
    autoContextInjection?: boolean;
    magicKeywords?: boolean;
    verificationProtocol?: boolean;
  };

  // MCP server configurations
  mcpServers?: {
    context7?: { enabled?: boolean };
    exa?: { enabled?: boolean; apiKey?: string };
    [key: string]: { enabled?: boolean; apiKey?: string } | undefined;
  };

  // Permission settings
  permissions?: {
    allowExecute?: boolean;
    allowEdit?: boolean;
    allowCreate?: boolean;
    maxBackgroundTasks?: number;
    maxParallelDroids?: number;
  };

  // Magic keyword customization
  magicKeywords?: {
    autopilot?: string[];
    ultrawork?: string[];
    ralph?: string[];
    ultrapilot?: string[];
    ecomode?: string[];
    swarm?: string[];
    pipeline?: string[];
    plan?: string[];
    deepsearch?: string[];
    analyze?: string[];
  };

  // Intelligent model routing configuration
  routing?: {
    enabled?: boolean;
    defaultTier?: 'LOW' | 'MEDIUM' | 'HIGH';
    escalationEnabled?: boolean;
    maxEscalations?: number;
    tierModels?: {
      LOW?: string;
      MEDIUM?: string;
      HIGH?: string;
    };
  };
}

export interface SessionState {
  sessionId?: string;
  activeAgents: Map<string, AgentState>;
  backgroundTasks: BackgroundTask[];
  contextFiles: string[];
  activeMode?: string;
  planName?: string;
}

export interface AgentState {
  name: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  lastMessage?: string;
  startTime?: number;
  droidType?: string;
}

export interface BackgroundTask {
  id: string;
  agentName: string;
  droidType: string;
  prompt: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  result?: string;
  error?: string;
  startTime?: number;
  endTime?: number;
}

export interface MagicKeyword {
  triggers: string[];
  action: (prompt: string) => string;
  description: string;
  mode: string;
}

export interface HookDefinition {
  event: 'PreToolUse' | 'PostToolUse' | 'Stop' | 'SessionStart' | 'SessionEnd' | 'UserPromptSubmit' | 'Notification' | 'PreCompact' | 'SubagentStop';
  matcher?: string;
  command?: string;
  handler?: (context: HookContext) => Promise<HookResult>;
}

export interface HookContext {
  toolName?: string;
  toolInput?: unknown;
  toolOutput?: unknown;
  sessionId?: string;
  userPrompt?: string;
}

export interface HookResult {
  continue: boolean;
  message?: string;
  modifiedInput?: unknown;
  decision?: 'continue' | 'stop';
  reason?: string;
}

// Boulder State types
export interface BoulderState {
  planName: string;
  sessionIds: string[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'paused' | 'completed';
  progress: PlanProgress;
}

export interface PlanProgress {
  totalTasks: number;
  completedTasks: number;
  currentTask?: string;
  verificationStatus?: 'pending' | 'in_progress' | 'verified' | 'failed';
}

export interface PlanSummary {
  planName: string;
  status: string;
  progress: string;
  sessions: number;
}

// Notepad Wisdom types
export interface WisdomEntry {
  timestamp: string;
  content: string;
}

export type WisdomCategory = 'learnings' | 'decisions' | 'issues' | 'problems';

export interface PlanWisdom {
  planName: string;
  learnings: WisdomEntry[];
  decisions: WisdomEntry[];
  issues: WisdomEntry[];
  problems: WisdomEntry[];
}

// Skill types
export interface SkillDefinition {
  name: string;
  description: string;
  instructions: string;
  allowedTools?: string[];
  triggerPatterns?: string[];
}

// Custom Droid types
export interface CustomDroidTemplate {
  name: string;
  description: string;
  model: ModelType;
  reasoningEffort?: 'low' | 'medium' | 'high';
  tools: string[] | ToolCategory;
  systemPrompt: string;
  category?: string;
}

// Verification types
export interface VerificationCheck {
  name: string;
  command?: string;
  description: string;
  required: boolean;
}

export interface VerificationResult {
  check: string;
  passed: boolean;
  output?: string;
  error?: string;
}

// Delegation categories
export type DelegationCategory = 
  | 'visual-engineering' 
  | 'ultrabrain' 
  | 'artistry' 
  | 'quick' 
  | 'writing' 
  | 'unspecified-low' 
  | 'unspecified-high';

export interface ResolvedCategory {
  category: DelegationCategory;
  tier: 'LOW' | 'MEDIUM' | 'HIGH';
  temperature: number;
  description: string;
  promptAppend?: string;
}
