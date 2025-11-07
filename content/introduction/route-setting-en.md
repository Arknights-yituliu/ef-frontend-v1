---
title: Route Configuration Guide
description: Learn how to configure and manage routes in the project
---

# Route Configuration Guide

This document introduces the route configuration methods and management approaches in the project.

## Route System Overview

This project uses Nuxt 3's file-based routing mechanism, combined with custom route configuration to manage menus and navigation.

### File-based Routing

Nuxt automatically generates routes based on the file structure in the `app/pages/` directory:

- File paths correspond to route paths
- `index.vue` corresponds to the root route
- Dynamic routes use square brackets, e.g., `[id].vue`
- Catch-all routes use `[...slug].vue`

**Example:**

```
pages/
├── index.vue                    → /
├── introduction/
│   └── [...slug].vue           → /introduction/:slug(.*)
└── material-profit/
    ├── shop-value.vue          → /material-profit/shop-value
    └── package-value.vue       → /material-profit/package-value
```

---

## Custom Route Configuration

### Configuration File Location

The route configuration file is located at: `custom/route/routes.json`

### Configuration File Structure

```json
[
  {
    "i18nKey": "introduction",
    "nameKey": "menu.introduction",
    "vuetifyIcon": "mdi-book-open-variant",
    "children": [
      {
        "i18nKey": "projectStructure",
        "nameKey": "menu.projectStructure",
        "routePath": "/introduction/project-structure",
        "vuetifyIcon": "mdi-file-tree"
      }
    ]
  }
]
```

### Configuration Field Descriptions

- **`i18nKey`**: Internationalization identifier for unique route identification
- **`nameKey`**: i18n translation key pointing to the menu display text
- **`vuetifyIcon`**: Vuetify icon name for menu icons
- **`routePath`**: Route path corresponding to files in the pages directory
- **`children`**: Array of child routes, supporting secondary menus

---

## Adding New Routes

### Step 1: Create Page File

Create the corresponding Vue file in the `app/pages/` directory.

**Example:**

```
app/pages/tutorial/getting-started.vue
```

### Step 2: Update Route Configuration

Add route configuration in `custom/route/routes.json`:

```json
{
  "i18nKey": "gettingStarted",
  "nameKey": "menu.gettingStarted",
  "routePath": "/tutorial/getting-started",
  "vuetifyIcon": "mdi-rocket-launch"
}
```

### Step 3: Add Internationalization Translations

Add translations in `i18n/locales/zh-CN.json` and `i18n/locales/en-US.json`:

**zh-CN.json:**
```json
{
  "menu": {
    "gettingStarted": "快速开始"
  }
}
```

**en-US.json:**
```json
{
  "menu": {
    "gettingStarted": "Getting Started"
  }
}
```

---

## Layout Configuration

### Using Different Layouts

Specify the layout in page files using `definePageMeta`:

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'docs'  // Use docs layout
})
</script>
```

### Available Layouts

- **`default`**: Default layout with sidebar and main content area
- **`docs`**: Documentation layout with document directory, content area, and TOC

---

## Route Navigation

### Using NuxtLink Component

```vue
<NuxtLink to="/introduction/project-structure">
  Project Structure
</NuxtLink>
```

### Programmatic Navigation

```typescript
// Using navigateTo
await navigateTo('/introduction/project-structure')

// Using useRouter
const router = useRouter()
router.push('/introduction/project-structure')
```

---

## Route Meta Information

### Page Title

Use `useHead` to set page title:

```typescript
useHead({
  title: 'Project Structure - EndField Yituliu'
})
```

### SEO Optimization

```typescript
useHead({
  title: 'Project Structure',
  meta: [
    {
      name: 'description',
      content: 'Learn about the technical stack, directory structure, and file organization'
    }
  ]
})
```

---

## Dynamic Routes

### Catch-all Routes

This project uses catch-all routes to handle documentation pages:

```
pages/introduction/[...slug].vue
```

This route matches all paths under `/introduction/`, such as:
- `/introduction/project-structure`
- `/introduction/route-setting`
- `/introduction/common-questions`

### Getting Route Parameters

```typescript
const route = useRoute()
const slug = route.params.slug  // Get slug parameter
```

---

## Route Guards

### Page-level Guards

Define middleware using `definePageMeta`:

```typescript
definePageMeta({
  middleware: ['auth']  // Use auth middleware
})
```

### Global Guards

Create middleware files in the `app/middleware/` directory:

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Route guard logic
  if (!isAuthenticated()) {
    return navigateTo('/login')
  }
})
```

---

## Best Practices

### 1. Route Naming Conventions

- Use kebab-case for file names
- File names should be concise and reflect page content
- Avoid special characters

### 2. Route Organization

- Organize routes by functional modules
- Use directory structure to represent hierarchical relationships
- Keep route structure clear and understandable

### 3. Internationalization

- All menu text must use i18n
- Maintain both Chinese and English translations
- Keep translation key naming consistent

### 4. Icon Usage

- Use Material Design Icons
- Icons should be relevant to page content
- Maintain consistent icon style

---

## Common Questions

### Q: Why isn't my route showing in the menu?

A: Please check the following:
1. Have you added configuration in `routes.json`?
2. Have you added translations in i18n files?
3. Does the route path match the pages file?

### Q: How to create multi-level menus?

A: Currently supports two-level menus, configured through the `children` field:

```json
{
  "i18nKey": "parent",
  "nameKey": "menu.parent",
  "vuetifyIcon": "mdi-folder",
  "children": [
    {
      "i18nKey": "child",
      "nameKey": "menu.child",
      "routePath": "/parent/child",
      "vuetifyIcon": "mdi-file"
    }
  ]
}
```

### Q: How to add external links?

A: External links are not recommended to be added to route configuration. Use regular `<a>` tags in page content instead.

---

## Summary

This project's routing system combines Nuxt's file-based routing with custom route configuration, maintaining flexibility while providing unified menu management. When adding new routes, please follow the guidelines in this document to ensure complete and standardized route configuration.

