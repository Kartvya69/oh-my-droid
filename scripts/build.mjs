#!/usr/bin/env node
/**
 * Build script for Oh-My-Droid
 */

import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

console.log('Building Oh-My-Droid...');

// Ensure dist directory exists
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// Build CLI
await build({
  entryPoints: [join(rootDir, 'src', 'cli', 'index.ts')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: join(distDir, 'cli', 'index.js'),
  format: 'esm',
  banner: {
    js: '#!/usr/bin/env node',
  },
  external: ['@modelcontextprotocol/sdk', 'better-sqlite3'],
}).then(() => {
  console.log('✓ CLI built');
}).catch((err) => {
  console.error('✗ CLI build failed:', err);
  process.exit(1);
});

// Copy skill files
const skillsSrc = join(rootDir, 'skills');
const skillsDest = join(distDir, 'skills');
if (existsSync(skillsSrc)) {
  cpSync(skillsSrc, skillsDest, { recursive: true });
  console.log('✓ Skills copied');
}

// Copy droid templates
const droidsSrc = join(rootDir, 'droids');
const droidsDest = join(distDir, 'droids');
if (existsSync(droidsSrc)) {
  cpSync(droidsSrc, droidsDest, { recursive: true });
  console.log('✓ Droid templates copied');
}

// Copy command definitions
const commandsSrc = join(rootDir, 'commands');
const commandsDest = join(distDir, 'commands');
if (existsSync(commandsSrc)) {
  cpSync(commandsSrc, commandsDest, { recursive: true });
  console.log('✓ Command definitions copied');
}

// Copy hook templates
const hooksSrc = join(rootDir, 'hooks');
const hooksDest = join(distDir, 'hooks');
if (existsSync(hooksSrc)) {
  cpSync(hooksSrc, hooksDest, { recursive: true });
  console.log('✓ Hook templates copied');
}

// Copy templates
const templatesSrc = join(rootDir, 'templates');
const templatesDest = join(distDir, 'templates');
if (existsSync(templatesSrc)) {
  cpSync(templatesSrc, templatesDest, { recursive: true });
  console.log('✓ Templates copied');
}

console.log('\nBuild complete!');
