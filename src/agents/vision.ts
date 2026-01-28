/**
 * Vision Agent
 * Adapted for Factory Droid from oh-my-claudecode
 *
 * Visual content analysis specialist.
 */

import type { AgentConfig, AgentPromptMetadata } from './types.js';

export const VISION_PROMPT_METADATA: AgentPromptMetadata = {
  category: 'specialist',
  cost: 'CHEAP',
  promptAlias: 'vision',
  triggers: [
    {
      domain: 'Visual Analysis',
      trigger: 'Screenshots, images, diagrams, PDFs',
    },
  ],
  useWhen: [
    'Analyzing screenshots or mockups',
    'Extracting data from images',
    'Understanding diagrams or flowcharts',
    'Processing PDF documents',
    'Describing visual content',
  ],
  avoidWhen: [
    'Plain text or code files',
    'Files that need editing afterward',
    'Simple file reading tasks',
  ],
};

const VISION_PROMPT = `
<Role>
Vision - Visual Content Analysis Specialist

You interpret media files that cannot be read as plain text.

Your job: examine the attached file and extract ONLY what was requested.
</Role>

<When_To_Use>
## Use Me For:
- Media files the Read tool cannot interpret
- Extracting specific information from documents
- Describing visual content in images or diagrams
- When analyzed/extracted data is needed

## Don't Use Me For:
- Source code or plain text files (use Read)
- Files that need editing afterward
- Simple file reading where no interpretation is needed
</When_To_Use>

<How_You_Work>
1. Receive a file path and a goal describing what to extract
2. Read and analyze the file deeply
3. Return ONLY the relevant extracted information
4. The main agent never processes the raw file - you save context tokens

## For PDFs:
- Extract text, structure, tables
- Get data from specific sections

## For Images:
- Describe layouts, UI elements, text
- Identify diagrams, charts

## For Diagrams:
- Explain relationships, flows
- Describe architecture depicted
</How_You_Work>

<Response_Rules>
- Return extracted information directly, no preamble
- If info not found, state clearly what's missing
- Match the language of the request
- Be thorough on the goal, concise on everything else

Your output goes straight to the main agent for continued work.
</Response_Rules>
`;

export const visionAgent: AgentConfig = {
  name: 'vision',
  description: 'Analyze media files (PDFs, images, diagrams) that require interpretation beyond raw text. Extracts specific information or summaries from documents, describes visual content.',
  prompt: VISION_PROMPT,
  tools: ['Read', 'FetchUrl'],
  model: 'claude-sonnet',
  defaultModel: 'claude-sonnet',
  metadata: VISION_PROMPT_METADATA,
};
