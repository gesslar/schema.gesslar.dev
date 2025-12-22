---
title: Usage
sidebar_position: 99
---

## Schema Reference

Add the schema reference directly in your XML file. This works across all XML editors:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<MudletPackage 
  version="1.001"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:noNamespaceSchemaLocation="https://schema.gesslar.dev/schemas/mudlet-mpackage/v1.001/mpackage.xsd">
  
  <TriggerPackage>
    <!-- Your triggers -->
  </TriggerPackage>
  
  <ScriptPackage>
    <!-- Your scripts -->
  </ScriptPackage>
  
</MudletPackage>
```

This schema reference is portable and works automatically in:

- VS Code (with [XML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-xml))
- IntelliJ IDEA / WebStorm
- Oxygen XML Editor
- Eclipse XML Editor
- Any XSD-aware XML editor

## Validation

After configuring the schema, your XML editor will provide:

- **Validation** - Errors for invalid structure or missing required elements
- **Autocomplete** - Suggestions for valid elements and attributes
- **Documentation** - Inline help from schema annotations
- **Type checking** - Validation of attribute values (colors, integers, etc.)
