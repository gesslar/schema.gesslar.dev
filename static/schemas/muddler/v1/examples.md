---
title: Example Usage
sidebar_position: 0
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="vscode"
  values={[
    {label: "VS Code", value: "vscode"},
  ]}>
  <TabItem value="vscode">

`.vscode/settings.json`

  ```

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
</Tabs>
