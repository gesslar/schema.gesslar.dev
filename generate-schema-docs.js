const fs = require('fs');
const path = require('path');

// Function to generate markdown from a schema
function generateSchemaMarkdown(schemaPath, schemaData, sidebarPosition) {
  const fileName = path.basename(schemaPath, '.json');
  const schemaUrl = schemaData.$id || `https://schema.gesslar.dev/${schemaPath.replace('../src/', '')}`;

  let markdown = `---
sidebar_position: ${sidebarPosition}
---

# ${schemaData.title || fileName}

${schemaData.description || ''}

## Schema URL

\`\`\`json
{
  "$schema": "${schemaUrl}"
}
\`\`\`

`;

  // Add properties table if it's an object schema
  if (schemaData.type === 'object' && schemaData.properties) {
    markdown += `## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
`;

    Object.entries(schemaData.properties).forEach(([key, prop]) => {
      const type = prop.type || prop.const || (prop.$ref ? 'reference' : 'object');
      const required = schemaData.required?.includes(key) ? '✓' : '';
      const description = prop.description || '';
      const defaultVal = prop.default !== undefined ? ` (default: ${JSON.stringify(prop.default)})` : '';
      markdown += `| \`${key}\` | ${type} | ${required} | ${description}${defaultVal} |\n`;
    });

    markdown += '\n';
  }

  // Add array item info
  if (schemaData.type === 'array' && schemaData.items) {
    markdown += `## Array Items

This schema defines an array where each item ${schemaData.items.$ref ? `references: \`${schemaData.items.$ref}\`` : `is of type: \`${schemaData.items.type}\``}

`;
  }

  // Add definitions info
  if (schemaData.definitions || schemaData.$defs) {
    const defs = schemaData.definitions || schemaData.$defs;
    markdown += `## Definitions

This schema includes ${Object.keys(defs).length} reusable definition(s): ${Object.keys(defs).map(k => `\`${k}\``).join(', ')}

`;
  }

  // Add full schema
  markdown += `## Full Schema

\`\`\`json
${JSON.stringify(schemaData, null, 2)}
\`\`\`
`;

  return markdown;
}

// Function to process a schema directory
function processSchemaDirectory(category, srcDir, docsDir) {
  const schemaFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.json'));
  const mdFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.md'));

  // Create category index
  let indexMarkdown = `---
sidebar_position: 1
slug: /${category}
---

# ${category.charAt(0).toUpperCase() + category.slice(1)} Schemas

JSON schemas for ${category}.

## Available Schemas

`;

  schemaFiles.forEach(file => {
    const baseName = path.basename(file, '.json');
    indexMarkdown += `- [${baseName}](${baseName}.md)\n`;
  });

  mdFiles.forEach(file => {
    const baseName = path.basename(file, '.md');
    if (baseName !== 'index.md') {
      indexMarkdown += `- [${baseName.replace('.md', '')}](${file})\n`;
    }
  });

  fs.writeFileSync(path.join(docsDir, 'index.md'), indexMarkdown);

  // Copy .md files directly
  mdFiles.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(docsDir, file);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} to ${path.relative(__dirname, destPath)}`);
  });

  // Generate individual schema pages
  schemaFiles.forEach((file, index) => {
    const schemaPath = path.join(srcDir, file);
    const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    const baseName = path.basename(file, '.json');

    const markdown = generateSchemaMarkdown(
      path.relative(path.join(__dirname, '..'), schemaPath),
      schemaData,
      index + 2
    );

    fs.writeFileSync(path.join(docsDir, `${baseName}.md`), markdown);
  });
}

// Main execution
function generateAllDocs() {
  const categories = [
    { name: 'muddler', srcDir: './static/schemas/muddler/v1', docsDir: './docs/muddler' },
    { name: 'bedoc', srcDir: './static/schemas/bedoc/v1', docsDir: './docs/bedoc' }
  ];

  console.log('Generating documentation from schemas...');
  categories.forEach(({ name, srcDir, docsDir }) => {
    const fullSrcDir = path.join(__dirname, srcDir);
    const fullDocsDir = path.join(__dirname, docsDir);

    // Create docs directory if it doesn't exist
    if (!fs.existsSync(fullDocsDir)) {
      fs.mkdirSync(fullDocsDir, { recursive: true });
    }

    processSchemaDirectory(name, fullSrcDir, fullDocsDir);
    console.log(`Generated documentation for ${name}`);
  });
}

generateAllDocs();
