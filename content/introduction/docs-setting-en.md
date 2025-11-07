---
title: Documentation Writing Guide
description: Learn how to write and organize new documentation for the project
---

# Documentation Writing Guide

This document will guide you through the complete process of adding new documentation to the project, including file creation, navigation configuration, internationalization setup, and more.

## Documentation System Overview

This project uses **Nuxt Content 4.x** to build the documentation system, featuring:

- 📝 Markdown format support
- 🌍 Internationalization support (Chinese/English)
- 📑 Auto-generated documentation navigation
- 📱 Fully responsive layout

## Documentation Directory Structure

```
content/
└── introduction/                   # Documentation category (shared folder)
    ├── project-structure-en.md     # Project Structure (English)
    ├── project-structure-zh.md     # Project Structure (Chinese)
    ├── route-setting-en.md         # Route Setting (English)
    ├── route-setting-zh.md         # Route Setting (Chinese)
    ├── docs-setting-en.md          # Writing Docs (English, this document)
    ├── docs-setting-zh.md          # Writing Docs (Chinese)
    ├── common-questions-en.md      # Common Questions (English)
    ├── common-questions-zh.md      # Common Questions (Chinese)
    └── ...                         # More Docs (use -en/-zh suffix)
```

---

## Complete Process for Adding New Documentation

### Step 0: Manage Documentation Route Prefixes (if needed)

If your new document lives under a different top-level path (e.g. `/tutorials`), update the shared configuration in `app/app.config.ts` so every middleware can recognize it as part of the documentation portal.

```ts
export default defineAppConfig({
  // ...other config
  docsRoutePrefixes: ['/introduction', '/tutorials']
})
```

Add additional prefixes to the `docsRoutePrefixes` array as required. Existing documentation under `/introduction` is already configured.

### Step 1: Create Markdown File

Create new `.md` files under the category folder in the `content/` directory. Use the suffix `-zh` for Chinese and `-en` for English to keep the two language versions together.

**Chinese documentation path:** `content/{category}/{filename}-zh.md`  
**English documentation path:** `content/{category}/{filename}-en.md`

**Example:**

```
content/introduction/new-document-zh.md
content/introduction/new-document-en.md
```

### Step 2: Write Documentation Content

Each Markdown file must include **Front Matter** (YAML format metadata at the beginning of the file).

**Basic Template:**

```markdown
---
title: Document Title
description: Brief description of the document for SEO and preview
---

# Document Title

This is the main content of the document...

## First-level Heading

Content paragraph...

### Second-level Heading

More content...
```

**Front Matter Field Description:**

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ | Document title, displayed at the top of the page |
| `description` | ✅ | Document description, displayed below the title |

### Step 3: Update Documentation Navigation Configuration

Edit the `custom/route/docNavigation.json` file to add navigation items for the new document.

**Configuration File Structure:**

```json
[
  {
    "titleKey": "docs.sections.introduction",
    "items": [
      {
        "titleKey": "docs.items.projectStructure",
        "path": "/introduction/project-structure"
      },
      {
        "titleKey": "docs.items.newDocument",
        "path": "/introduction/new-document"
      }
    ]
  }
]
```

**Field Description:**

- **`titleKey`**: Internationalization translation key, corresponding to translations in i18n files
- **`path`**: Document path, corresponding to file path under content directory (without language prefix)
- **`items`**: List of documents under this category

### Step 4: Add Internationalization Translations

Add corresponding translations in `i18n/locales/zh-CN.json` and `i18n/locales/en-US.json`.

**zh-CN.json:**

```json
{
  "docs": {
    "sections": {
      "introduction": "开发指南"
    },
    "items": {
      "newDocument": "新文档"
    }
  }
}
```

**en-US.json:**

```json
{
  "docs": {
    "items": {
      "newDocument": "New Document"
    }
  }
}
```

---

## Related Resources

### Official Documentation

- [Nuxt Content Documentation](https://content.nuxt.com)
- [Markdown Syntax Guide](https://www.markdownguide.org/)