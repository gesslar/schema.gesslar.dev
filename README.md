# Schema Documentation Site

This repository contains JSON schemas and their documentation website built with Docusaurus.

## Structure

- `docs/` - Docusaurus website
  - `static/schemas/muddler/v1/` - Muddler schemas (source of truth)
  - `static/schemas/bedoc/v1/` - BeDoc schemas (source of truth)
  - `docs/muddler/` - Auto-generated documentation (gitignored)
  - `docs/bedoc/` - Auto-generated documentation (gitignored)

## Development

The documentation is automatically generated from the JSON schema files.

### Running Locally

```bash
cd docs
npm install
npm start
```

The site will be available at `http://localhost:3000`

### Building for Production

```bash
cd docs
npm run build
```

### Adding New Schemas

1. Add your JSON schema file to `docs/static/schemas/muddler/v1/` or `docs/static/schemas/bedoc/v1/`
2. Documentation pages are automatically generated when you run `npm start` or `npm run build`
3. To manually regenerate documentation:

   ```bash
   npm run generate-docs
   ```

### Schema URLs

Schemas are accessible at:

- `https://schema.gesslar.dev/muddler/v1/{schema-name}.json`
- `https://schema.gesslar.dev/bedoc/v1/{schema-name}.json`

These URLs are rewritten via `.htaccess` to serve files from `static/schemas/` directory.
The `$id` fields in your schema files should use these cleaner URLs.

## Schema Categories

### Muddler

JSON schemas for the muddler build system for Mudlet packages.

### BeDoc

JSON schemas for the bedoc documentation system.

## License

Copyright © 2025
