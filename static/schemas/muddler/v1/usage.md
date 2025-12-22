---
title: Usage
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="vscode"
  values={[
    {label: "VS Code", value: "vscode"},
    {label: "IntelliJ IDEA / WebStorm", value: "intellij"},
    {label: "Sublime Text", value: "sublime"},
  ]}>
  <TabItem value="vscode">

`.vscode/settings.json`

```json
{
  "json.schemas": [
    {
      "fileMatch": [
        "mfile"
      ],
      "url": "https://schema.gesslar.dev/muddler/v1/mfile.json",
    },
    {
      "fileMatch": [
        "src/**/aliases.json"
      ],
      "url": "https://schema.gesslar.dev/muddler/v1/aliases.json",
    },
    {
      "fileMatch": [
        "src/**/keys.json"
      ],
      "url": "https://schema.gesslar.dev/muddler/v1/keys.json",
    },
    {
      "fileMatch": [
        "src/**/scripts.json"
      ],
      "url": "https://schema.gesslar.dev/muddler/v1/scripts.json",
    },
    {
      "fileMatch": [
        "src/**/timers.json"
      ],
      "url": "https://schema.gesslar.dev/muddler/v1/timers.json",
    },
    {
      "fileMatch": [
        "src/**/triggers.json"
      ],
      "url": "https://schema.gesslar.dev/muddler/v1/triggers.json",
    },
  ]
}
```

  </TabItem>
  <TabItem value="intellij">

Create or edit `jsconfig.json` or `tsconfig.json` in your project root:

```json
{
  "compilerOptions": {
    "moduleResolution": "node"
  },
  "json.schemas": [
    {
      "fileMatch": ["mfile"],
      "url": "https://schema.gesslar.dev/muddler/v1/mfile.json"
    },
    {
      "fileMatch": ["src/**/aliases.json"],
      "url": "https://schema.gesslar.dev/muddler/v1/aliases.json"
    },
    {
      "fileMatch": ["src/**/keys.json"],
      "url": "https://schema.gesslar.dev/muddler/v1/keys.json"
    },
    {
      "fileMatch": ["src/**/scripts.json"],
      "url": "https://schema.gesslar.dev/muddler/v1/scripts.json"
    },
    {
      "fileMatch": ["src/**/timers.json"],
      "url": "https://schema.gesslar.dev/muddler/v1/timers.json"
    },
    {
      "fileMatch": ["src/**/triggers.json"],
      "url": "https://schema.gesslar.dev/muddler/v1/triggers.json"
    }
  ]
}
```

Alternatively, add a `$schema` property directly in your JSON files:

```json
{
  "$schema": "https://schema.gesslar.dev/muddler/v1/aliases.json",
  "aliases": [
    // ...
  ]
}
```

  </TabItem>
  <TabItem value="sublime">

Install [LSP](https://packagecontrol.io/packages/LSP) and [LSP-json](https://packagecontrol.io/packages/LSP-json) packages, then configure in `LSP-json.sublime-settings`:

```json
{
  "settings": {
    "json.schemas": [
      {
        "fileMatch": ["**/mfile"],
        "url": "https://schema.gesslar.dev/muddler/v1/mfile.json"
      },
      {
        "fileMatch": ["**/src/**/aliases.json"],
        "url": "https://schema.gesslar.dev/muddler/v1/aliases.json"
      },
      {
        "fileMatch": ["**/src/**/keys.json"],
        "url": "https://schema.gesslar.dev/muddler/v1/keys.json"
      },
      {
        "fileMatch": ["**/src/**/scripts.json"],
        "url": "https://schema.gesslar.dev/muddler/v1/scripts.json"
      },
      {
        "fileMatch": ["**/src/**/timers.json"],
        "url": "https://schema.gesslar.dev/muddler/v1/timers.json"
      },
      {
        "fileMatch": ["**/src/**/triggers.json"],
        "url": "https://schema.gesslar.dev/muddler/v1/triggers.json"
      }
    ]
  }
}
```

  </TabItem>

</Tabs>
