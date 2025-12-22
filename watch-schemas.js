#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Discover all schema directories automatically
function discoverSchemaDirectories() {
  const schemasRoot = path.join(__dirname, 'static/schemas');
  const dirs = [];

  if (!fs.existsSync(schemasRoot)) {
    console.warn('Warning: static/schemas directory not found');
    return dirs;
  }

  // Iterate through each category directory (e.g., muddler, bedoc, mpackage)
  const categoryDirs = fs.readdirSync(schemasRoot, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  categoryDirs.forEach(category => {
    const categoryPath = path.join(schemasRoot, category);
    
    // Find version directories (e.g., v1, v1.001)
    const versionDirs = fs.readdirSync(categoryPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // Add each version directory to the list
    versionDirs.forEach(version => {
      dirs.push(`./static/schemas/${category}/${version}`);
    });
  });

  return dirs;
}

const SCHEMA_DIRS = discoverSchemaDirectories();

console.log('Watching schema directories for changes...');
SCHEMA_DIRS.forEach(dir => {
  console.log(`   - ${dir}`);
});
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
  if (!filename || !(filename.endsWith('.json') || filename.endsWith('.md') || filename.endsWith('.xsd'))) return;

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
