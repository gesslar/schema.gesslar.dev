---
title: Description
sidebar_position: 2
---

## Overview

A Mudlet package (`.mpackage` file) is a ZIP archive containing Mudlet items (triggers, aliases, scripts, etc.) along with metadata and optional assets. This document describes the complete structure and format.

## File Structure

An `.mpackage` file is a standard ZIP archive with the following contents:

```text
package-name.mpackage (ZIP archive)
├── config.lua                    [REQUIRED] Package metadata
├── package-name.xml              [REQUIRED] Mudlet items (triggers, scripts, etc.)
├── .mudlet/
│   └── Icon/
│       └── icon-file.png         [OPTIONAL] Package icon
└── [additional asset files]      [OPTIONAL] Images, sounds, etc.
```

### File Order Requirements

When creating the ZIP archive:

1. **`config.lua`** must be added first
2. Additional asset files are added in the middle
3. **`<package-name>.xml`** must be added last

## config.lua Format

The `config.lua` file contains package metadata in Lua table format:

```lua
mpackage = [[package-name]]
author = [[Author Name]]
icon = [[icon-file.png]]
title = [[Display Title]]
description = [[Package description text]]
version = [[1.0.0]]
dependencies = [[dependency1,dependency2]]
created = "2025-12-22T10:30:45Z"
```

### config.lua Fields

| Field | Type | Required | Description |
| ------ | ----- | --------- | ------------ |
| `mpackage` | string | Yes | Internal package name (must match XML filename) |
| `author` | string | No | Package author name |
| `icon` | string | No | Icon filename (stored in `.mudlet/Icon/`) |
| `title` | string | No | Display title for the package |
| `description` | string | No | Package description (can be multi-line) |
| `version` | string | No | Semantic version string (e.g., "1.0.0") |
| `dependencies` | string | No | Comma-separated list of required packages |
| `created` | string | No | ISO 8601 timestamp of package creation |

**Note:** All string values are enclosed in double square brackets `[[...]]` to support multi-line text and special characters.

## XML Structure

The main package content is stored in `<package-name>.xml` following the schema defined in `mudlet-package.xsd`.

### XML Document Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE MudletPackage>
<MudletPackage version="1.001">
    <TriggerPackage>...</TriggerPackage>
    <TimerPackage>...</TimerPackage>
    <AliasPackage>...</AliasPackage>
    <ActionPackage>...</ActionPackage>
    <ScriptPackage>...</ScriptPackage>
    <KeyPackage>...</KeyPackage>
    <VariablePackage>...</VariablePackage>
    <HelpPackage>...</HelpPackage>
    <HostPackage>...</HostPackage>
</MudletPackage>
```

### XML Version History

- **1.001** (Current): Added support for ASCII control codes (0x01-0x08, 0x0b, 0x0c, 0x0e-0x1f, 0x7f) in script elements
- **1.000** (Initial): Base XML format

### Package Types

Each package type can contain multiple items organized in a hierarchical structure (folders and items).

#### 1. TriggerPackage

Contains triggers that fire when specific text patterns appear.

**Elements:** `TriggerGroup` (folders) and `Trigger` (items)

**Key Attributes:**

- `isActive`: yes/no - Whether trigger is enabled
- `isFolder`: yes/no - Whether this is a folder
- `isTempTrigger`: yes/no - Temporary trigger (deleted after firing once)
- `isMultiline`: yes/no - Matches across multiple lines
- `isPerlSlashGOption`: yes/no - Enable Perl regex /g option
- `isColorizerTrigger`: yes/no - Recolors matching text
- `isFilterTrigger`: yes/no - Removes matching lines
- `isSoundTrigger`: yes/no - Plays sound when triggered
- `isColorTrigger`: yes/no - Triggers on text color
- `isColorTriggerFg`: yes/no - Match foreground color
- `isColorTriggerBg`: yes/no - Match background color

**Key Child Elements:**

- `name`: Display name
- `script`: Lua code to execute
- `triggerType`: Pattern type (0=substring, 1=perl regex, 2=begin of line, 3=exact match, 4=lua code, 5=line spacer, 6=color pattern, 7=prompt)
- `conditonLineDelta`: Lines to check for multiline triggers (note: typo in element name preserved for compatibility)
- `mCommand`: Command to send to server
- `packageName`: Parent package name
- `mFgColor`: Foreground color (#RRGGBB or "transparent")
- `mBgColor`: Background color (#RRGGBB or "transparent")
- `mSoundFile`: Path to sound file
- `regexCodeList`: List of pattern strings
- `regexCodePropertyList`: List of pattern type codes (0-7, same values as triggerType)

#### 2. TimerPackage

Contains timers that execute at specified intervals.

**Elements:** `TimerGroup` (folders) and `Timer` (items)

**Key Attributes:**

- `isActive`: yes/no
- `isFolder`: yes/no
- `isTempTimer`: yes/no - One-time timer
- `isOffsetTimer`: yes/no - Offset from game time

**Key Child Elements:**

- `name`: Display name
- `script`: Lua code to execute
- `command`: Command to send to server
- `packageName`: Parent package name
- `time`: Time value (format: `hh:mm:ss.zzz`, note: hours can exceed 23 for long durations)

#### 3. AliasPackage

Contains aliases that expand user input.

**Elements:** `AliasGroup` (folders) and `Alias` (items)

**Key Attributes:**

- `isActive`: yes/no
- `isFolder`: yes/no

**Key Child Elements:**

- `name`: Display name
- `script`: Lua code to execute
- `command`: Replacement command
- `packageName`: Parent package name
- `regex`: Pattern to match user input

#### 4. ActionPackage

Contains buttons and toolbars.

**Elements:** `ActionGroup` (folders) and `Action` (items)

**Key Attributes:**

- `isActive`: yes/no
- `isFolder`: yes/no

**Key Child Elements:**

- `name`: Display name
- `packageName`: Parent package name
- `script`: Lua code to execute
- `css`: CSS styling for button
- `commandButtonUp`: Command when button is released
- `commandButtonDown`: Command when button is pressed
- `icon`: Icon filename or path
- `orientation`: Button orientation (0=horizontal, 1=vertical)
- `location`: Toolbar location (0=top, 2=right, 3=left, 4=dockable/floating)
- `posX`, `posY`: Button position (non-negative integers)
- `mButtonState`: Button state (1=unchecked/up, 2=checked/down)
- `sizeX`, `sizeY`: Button dimensions (non-negative integers)
- `buttonColumn`: Column number (non-negative integer)
- `buttonRotation`: Rotation in degrees (0, 90, 180, or 270)

#### 5. ScriptPackage

Contains standalone Lua scripts.

**Elements:** `ScriptGroup` (folders) and `Script` (items)

**Key Attributes:**

- `isActive`: yes/no
- `isFolder`: yes/no

**Key Child Elements:**

- `name`: Display name
- `packageName`: Parent package name
- `script`: Lua code
- `eventHandlerList`: List of event names this script handles

#### 6. KeyPackage

Contains key bindings.

**Elements:** `KeyGroup` (folders) and `Key` (items)

**Key Attributes:**

- `isActive`: yes/no
- `isFolder`: yes/no

**Key Child Elements:**

- `name`: Display name
- `packageName`: Parent package name
- `script`: Lua code to execute
- `command`: Command to send to server
- `keyCode`: Qt key code (integer)
- `keyModifier`: Qt key modifier flags (integer)

#### 7. VariablePackage

Contains saved Lua variables.

**Elements:** `VariableGroup`

**Key Attributes:**

- `isActive`: yes/no
- `isFolder`: yes/no

**Key Child Elements:**

- `name`: Variable name
- `keyType`: Key type identifier (integer)
- `value`: Serialized value (string)
- `valueType`: Value type identifier (integer)

#### 8. HelpPackage

Contains package help information.

**Key Child Elements:**

- `helpURL`: URL to documentation

#### 9. HostPackage

Contains profile/host information (used in profile exports).

**Key Child Elements:**

- `Host/name`: Profile name
- `Host/mInstalledPackages`: List of installed package names
- `Host/mInstalledModules`: List of installed modules with metadata
- `Host/url`: Game server URL

## Asset Files

Additional files (images, sounds, fonts, etc.) can be included in the package. These are copied directly into the ZIP archive.

Common locations:

- `.mudlet/Icon/` - Package icon
- Root level - Additional asset files

## Character Encoding

- **XML files**: UTF-8 encoding (specified in XML declaration)
- **config.lua**: UTF-8 encoding
- **Script elements**: Support ASCII control codes (0x01-0x1f, 0x7f) in version 1.001+

## Special Considerations

### Hierarchical Structure

All package types support hierarchical nesting:

- Folders can contain other folders or items
- Items cannot contain other items (except where explicitly documented)
- The tree structure is preserved through recursive XML elements

### Package Names

The `packageName` field in each item links it to the parent package, enabling:

- Selective package uninstallation
- Package membership tracking
- Module system support

### Module System

Modules are special packages with additional flags:

- `mModuleMasterFolder`: Root folder of a module
- `mModuleMember`: Item belongs to a module
- Modules can be synchronized with external files

### Backward Compatibility

The format maintains backward compatibility:

- Old versions can read files with version ≤ 1.001
- `mButtonState` uses legacy values (1/2) instead of boolean
- Color codes in triggers use legacy format for first 16 ANSI colors

## Validation

An XML Schema Definition (XSD) is provided in `mudlet-package.xsd` for validating the XML structure.

To validate:

```bash
xmllint --schema mudlet-package.xsd package-name.xml
```

## Example Package

See `src/mpkg.mpackage` for a reference implementation.

## Version Information

- **Document Version**: 1.0
- **Mudlet XML Format Version**: 1.001
- **Last Updated**: 2025-12-22

## References

- Implementation: `src/XMLexport.cpp`, `src/XMLimport.cpp`
- Package exporter: `src/dlgPackageExporter.cpp`
- Schema: `mudlet-package.xsd`
