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

### Part 1: Adding Documents Under Existing Top-Level Directories

To add a new document under an existing top-level directory (like `content/introduction`), follow these steps:

#### Step 1: Create Markdown File

Create new `.md` files under the category folder in the `content/` directory. Use the suffix `-zh` for Chinese and `-en` for English to keep the two language versions together.

**Chinese documentation path:** `content/{category}/{filename}-zh.md`  
**English documentation path:** `content/{category}/{filename}-en.md`

**Example:**

```
content/introduction/new-document-zh.md
content/introduction/new-document-en.md
```

#### Step 2: Write Documentation Content

Each Markdown file must include **Front Matter** (YAML format metadata at the beginning of the file).

**Basic Template:**

```
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

| Field         | Required | Description                                      |
| ------------- | -------- | ------------------------------------------------ |
| `title`       | ✅       | Document title, displayed at the top of the page |
| `description` | ✅       | Document description, displayed below the title  |

#### Step 3: Update Documentation Navigation Configuration

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

#### Step 4: Update Routes Configuration

After updating the documentation navigation, you also need to update the `custom/route/routes.json` file to ensure the new document appears in the main navigation menu.

Find the section corresponding to your document's top-level directory (e.g., "introduction") and add a new child item:

```json
{
  "i18nKey": "newDocument",
  "nameKey": "menu.newDocument",
  "routePath": "/introduction/new-document",
  "vuetifyIcon": "mdi-file-document"
}
```

#### Step 5: Add Internationalization Translations

Add corresponding translations in `i18n/locales/zh-CN.json` and `i18n/locales/en-US.json`.

**en-US.json:**

```json
{
  "menu": {
    "newDocument": "New Document"
  },
  "docs": {
    "items": {
      "newDocument": "New Document"
    }
  }
}
```

**zh-CN.json:**

```json
{
  "menu": {
    "newDocument": "新文档"
  },
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

### Part 2: Creating a New Top-Level Directory

To create a completely new top-level documentation directory, follow these steps:

#### Step 1: Manage Documentation Route Prefixes

If your new document lives under a different top-level path (e.g. `/tutorials`), update the shared configuration in `app/app.config.ts` so every middleware can recognize it as part of the documentation portal.

```ts
export default defineAppConfig({
  // ...other config
  docsRoutePrefixes: ['/introduction', '/tutorials'],
});
```

Add additional prefixes to the `docsRoutePrefixes` array as required.

#### Step 2: Configure Content Collection

In `content.config.ts`, add a new collection definition for your top-level directory:

```ts
export default defineContentConfig({
  collections: {
    introduction: defineCollection({
      // Specify content type
      type: 'page',
      // Load every file under the `content` directory
      source: '**',
    }),
    [newCollectionName]: defineCollection({
      type: 'page',
      source: '**',
    }),
  },
});
```

#### Step 3: Create Route File for the New Directory

Create a new file at `app/pages/[new-top-level-directory]/[...slug].vue` with the following content:

```vue
<template>
  <DocumentPage :collection-name="collectionName" />
</template>

<script lang="ts" setup>
// Use docs layout
definePageMeta({
  layout: 'docs',
});

// Set the collection name to match the new directory
const collectionName = '[newCollectionName]';
</script>
```

Replace `[newCollectionName]` with the actual name of your new collection (e.g., if you're creating a "tutorials" directory, use "tutorials").

#### Step 4: Update Routes Configuration File

In the `custom/route/routes.json` file, add a new top-level documentation route item. This route item must have `isDocs: true` set so the system can recognize it as a documentation route.

**Configuration Example:**

```json
{
  "i18nKey": "tutorials",
  "nameKey": "menu.tutorials",
  "vuetifyIcon": "mdi-school",
  "isDocs": true,
  "children": []
}
```

**Field Description:**

- **`i18nKey`**: Internationalization key name used to identify this route item
- **`nameKey`**: Internationalization key for the menu name, corresponding to translations in i18n files
- **`vuetifyIcon`**: Vuetify icon name, displayed in the navigation menu
- **`isDocs`**: Must be set to `true` to identify this as a documentation route
- **`children`**: Array of child routes, can be initialized as an empty array `[]`, and populated later when adding documents

**Important:** Only after completing this step can you add documents under the new top-level documentation route. When adding documents, you need to add child items to the `children` array of this route item (refer to Step 4 in Part 1).

At this point, your new top-level directory is created. Now follow the steps in "Part 1" to add documents to your new top-level directory.

**About `isDocs` Configuration:**

- If the parent route already has `isDocs: true` set, child routes will automatically inherit the documentation route characteristics, and you typically don't need to set it again on child routes.
- However, if a specific child route needs to be individually marked as a documentation route (e.g., a child route under a non-documentation parent route is a documentation page), you can set `isDocs: true` on that child route.
- The system supports configuring `isDocs` on child routes, and the middleware will correctly identify and apply documentation route path normalization rules.

**Example: Configuring a Documentation Child Route Under a Non-Documentation Parent Route**

```json
{
  "i18nKey": "resources",
  "nameKey": "menu.resources",
  "vuetifyIcon": "mdi-download",
  "children": [
    {
      "i18nKey": "essenceRecognizer",
      "nameKey": "menu.essenceRecognizer",
      "routePath": "/resources/essence-recognizer",
      "vuetifyIcon": "mdi-chart-line",
      "isDocs": true
    }
  ]
}
```

---

## Related Resources

### Official Documentation

- [Nuxt Content Documentation](https://content.nuxt.com)
- [Markdown Syntax Guide](https://www.markdownguide.org/)
