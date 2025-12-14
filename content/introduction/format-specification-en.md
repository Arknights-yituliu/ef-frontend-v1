---
title: Project Development Format Specification Setup
description: Configure the same formatting specifications using different IDEs to improve Diff readability
---

# Project Development Format Specification Setup

This document will help you configure the same formatting specifications across different IDEs to ensure consistent code style and improve Diff readability.

---

## 1. Webstorm Configuration

### Configuration Steps

1. Go to `Settings -> Languages & Frameworks -> JavaScript -> Prettier`
2. Select `Automatic Prettier configuration`

### Formatting Shortcuts

- **Windows**: Type `Ctrl+Alt+L` to format
- **Mac**: Type `Option+Command+L` (⌥+⌘+L) to format

---

## 2. VSCode Configuration

### Configuration Steps

1. Install the `Prettier - Code formatter` extension
2. Go to `Settings -> Workspace -> Extensions -> Prettier`
3. Configure `Prettier: Config Path` to the `.prettierrc.json` file in the project root directory

### Formatting Shortcuts

- **Windows**: Type `Shift+Alt+F` to format
- **Mac**: Type `Shift+Option+F` (⇧+⌥+F) to format