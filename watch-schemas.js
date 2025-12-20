#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const SCHEMA_DIRS = [
  './static/schemas/muddler/v1',
  './static/schemas/bedoc/v1'
];

console.log('Watching schema directories for changes...');
console.log('   - static/schemas/muddler/v1');
console.log('   - static/schemas/bedoc/v1');
console.log('');

let timeout = null;

function regenerateDocs() {
  console.log('Schema change detected, regenerating docs...');

  const child = spawn('npm', ['run', 'generate-docs'], {
    stdio: 'inherit',
    shell: true
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log('Documentation regenerated successfully\n');
    } else {
      console.log('Documentation generation failed\n');
    }
  });
}

function handleChange(eventType, filename) {
  if (!filename || !(filename.endsWith('.json') || filename.endsWith('.md'))) return;

  // Debounce multiple rapid changes
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    regenerateDocs();
  }, 500);
}

// Watch each schema directory
SCHEMA_DIRS.forEach(dir => {
  const fullPath = path.join(__dirname, dir);

  if (fs.existsSync(fullPath)) {
    fs.watch(fullPath, { recursive: false }, handleChange);
  } else {
    console.warn(`Warning: ${dir} does not exist`);
  }
});

console.log('Watching for schema changes (Ctrl+C to stop)...');
