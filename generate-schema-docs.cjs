const fs = require('fs');
const path = require('path');

// Convert Docusaurus <Tabs>/<TabItem> to plain markdown sections
function convertDocusaurusTabsToMarkdown(content) {
  // Remove <Tabs ...> and </Tabs> wrapper
  content = content.replace(/<Tabs[\s\S]*?>/g, '');
  content = content.replace(/<\/Tabs>/g, '');

  // Convert <TabItem value="xxx"> to ### heading, extract label from value
  content = content.replace(/<TabItem\s+value="([^"]+)">/g, (match, value) => {
    return `### ${value}`;
  });

  // Remove </TabItem>
  content = content.replace(/<\/TabItem>/g, '');

  return content;
}

// Function to generate markdown from a JSON schema
function generateSchemaMarkdown(schemaPath, schemaData, order) {
  const fileName = path.basename(schemaPath);
  const schemaUrl = schemaData.$id || `https://schema.gesslar.dev/${schemaPath.replace(/^\.?\/?public\/schemas\//, '')}`;

  let markdown = `---
title: "${fileName}"
sidebar:
  order: ${order}
---

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
      const required = schemaData.required?.includes(key) ? '<i class="codicon codicon-check"></i>' : '';
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

// Function to generate markdown from an XSD schema
function generateXsdMarkdown(xsdPath, order) {
  const fileName = path.basename(xsdPath);
  const xsdContent = fs.readFileSync(xsdPath, 'utf8');
  const schemaUrl = `https://schema.gesslar.dev/${xsdPath.replace(/^\.?\/?public\/schemas\//, '')}`;

  let markdown = `---
title: "${fileName}"
sidebar:
  order: ${order}
---

XML Schema Definition (XSD) for this schema.

## Schema URL

\`\`\`
${schemaUrl}
\`\`\`

## Full Schema

\`\`\`xml
${xsdContent}
\`\`\`
`;

  return markdown;
}

// Function to process a schema directory
function processSchemaDirectory(category, srcDir, docsDir) {
  const schemaFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.json'));
  const xsdFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.xsd'));
  const mdFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.md'));

  // Determine schema type for display
  const hasJson = schemaFiles.length > 0;
  const hasXsd = xsdFiles.length > 0;
  let schemaTypeText = 'Schemas';
  if (hasJson && hasXsd) {
    schemaTypeText = 'JSON schemas and XML Schema Definitions (XSD)';
  } else if (hasJson) {
    schemaTypeText = 'JSON schemas';
  } else if (hasXsd) {
    schemaTypeText = 'XML Schema Definitions (XSD)';
  }

  // Create category index
  const title = category.charAt(0).toUpperCase() + category.slice(1);
  let indexMarkdown = `---
title: "${title} Schemas"
sidebar:
  order: 1
---

${schemaTypeText} for ${category}.

## Available Schemas

`;

  // List JSON schemas
  schemaFiles.forEach(file => {
    const baseName = path.basename(file, '.json');
    indexMarkdown += `- [${baseName}](${baseName}/)\n`;
  });

  // List XSD files
  xsdFiles.forEach(file => {
    const baseName = path.basename(file, '.xsd');
    indexMarkdown += `- [${baseName}](${baseName}/)\n`;
  });

  // List markdown files
  mdFiles.forEach(file => {
    const baseName = path.basename(file, '.md');
    if (baseName !== 'index' && baseName !== 'readme') {
      indexMarkdown += `- [${baseName}](${baseName}/)\n`;
    }
  });

  fs.writeFileSync(path.join(docsDir, 'index.md'), indexMarkdown);

  // Copy .md files, converting Docusaurus frontmatter to Starlight format
  mdFiles.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(docsDir, file);
    let content = fs.readFileSync(srcPath, 'utf8');

    // Convert sidebar_position to Starlight's sidebar.order
    content = content.replace(
      /^(---\s*\n[\s\S]*?)sidebar_position:\s*(\d+)([\s\S]*?---)/m,
      (match, before, pos, after) => {
        const cleaned = before.replace(/\n\s*\n/g, '\n');
        return `${cleaned}sidebar:\n  order: ${pos}${after}`;
      }
    );

    // Strip Docusaurus MDX imports and convert Tabs to Starlight tabs
    content = content.replace(/^import\s+.*from\s+['"]@theme\/.*['"];?\s*\n/gm, '');
    content = convertDocusaurusTabsToMarkdown(content);

    fs.writeFileSync(destPath, content);
    console.log(`Copied ${file} to ${path.relative(__dirname, destPath)}`);
  });

  // Generate individual JSON schema pages
  schemaFiles.forEach((file, index) => {
    const schemaPath = path.join(srcDir, file);
    const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    const baseName = path.basename(file, '.json');

    const markdown = generateSchemaMarkdown(
      path.relative(path.join(__dirname, '..'), schemaPath),
      schemaData,
      index + 100
    );

    fs.writeFileSync(path.join(docsDir, `${baseName}.md`), markdown);
    console.log(`Generated JSON schema doc for ${baseName}`);
  });

  // Generate individual XSD schema pages
  xsdFiles.forEach((file, index) => {
    const xsdPath = path.join(srcDir, file);
    const baseName = path.basename(file, '.xsd');

    const markdown = generateXsdMarkdown(
      path.relative(__dirname, xsdPath),
      schemaFiles.length + index + 100
    );

    fs.writeFileSync(path.join(docsDir, `${baseName}.md`), markdown);
    console.log(`Generated XSD schema doc for ${baseName}`);
  });
}

// Discover all schema directories automatically
function discoverSchemaDirectories() {
  const schemasRoot = path.join(__dirname, 'public/schemas');
  const categories = [];

  if (!fs.existsSync(schemasRoot)) {
    console.warn('Warning: public/schemas directory not found');
    return categories;
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

    // For each version directory, add to categories
    versionDirs.forEach(version => {
      const srcDir = `./public/schemas/${category}/${version}`;
      const docsDir = `./src/content/docs/${category}`;

      categories.push({
        name: category,
        version: version,
        srcDir: srcDir,
        docsDir: docsDir
      });
    });
  });

  return categories;
}

// Clean out a directory's contents
function cleanDirectory(dir) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        cleanDirectory(filePath);
        fs.rmdirSync(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
  }
}

// Generate .htaccess with rewrite rules for all schema categories
function generateHtaccess(categories) {
  const htaccessPath = path.join(__dirname, 'public/.htaccess');
  const rules = categories.map(({ name, version }) =>
    `RewriteRule ^${name}/${version}/(.*)$ schemas/${name}/${version}/$1 [L]`
  );

  const content = `RewriteEngine On

# Auto-generated by generate-schema-docs.cjs
# Serve schema files at clean URLs
${rules.join('\n')}
`;

  fs.writeFileSync(htaccessPath, content);
  console.log(`Generated .htaccess with ${rules.length} rewrite rule(s)`);
}

// Main execution
function generateAllDocs() {
  const categories = discoverSchemaDirectories();

  console.log('Generating documentation from schemas...');
  console.log(`Found ${categories.length} schema directory(ies):\n`);
  categories.forEach(({ name, version, srcDir }) => {
    console.log(`  - ${name} (${version}): ${srcDir}`);
  });
  console.log('');
  categories.forEach(({ name, srcDir, docsDir }) => {
    const fullSrcDir = path.join(__dirname, srcDir);
    const fullDocsDir = path.join(__dirname, docsDir);

    // Clean and recreate docs directory
    if (fs.existsSync(fullDocsDir)) {
      console.log(`Cleaning ${path.relative(__dirname, fullDocsDir)}...`);
      cleanDirectory(fullDocsDir);
    }
    fs.mkdirSync(fullDocsDir, { recursive: true });

    processSchemaDirectory(name, fullSrcDir, fullDocsDir);
    console.log(`Generated documentation for ${name}`);
  });

  generateHtaccess(categories);
}

generateAllDocs();
