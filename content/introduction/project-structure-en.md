---
title: Project Structure
description: Learn about the technical stack, directory structure, and file organization of the project
---

# Project Structure

This document will help you fully understand the project's technology stack, directory structure, and the role of each file and directory.

## Main Technology Stack

This project is built on the following core technologies:

- **Nuxt 4.x** - Full-stack framework based on Vue.js
- **Vue 3.x** - Progressive JavaScript framework
- **Vuetify 3.x** - Material Design component library for Vue
- **TypeScript** - Superset of JavaScript with a type system

---

## Technologies Required for Development

Before starting development, it's recommended that you understand at least the following technologies:

### 1. Nuxt

**Concept:** Nuxt is a full-stack framework based on Vue.js that provides server-side rendering (SSR), static site generation (SSG), routing, state management, module system, and more. It follows the "convention over configuration" philosophy and automatically handles many common configuration tasks.

**Documentation:**
- [Nuxt Official Documentation (English)](https://nuxt.com/docs)

### 2. Vue

**Concept:** Vue is a progressive JavaScript framework for building user interfaces. It adopts component-based development and provides core features such as reactive data binding, directive system, and component system.

**Documentation:**
- [Vue Official Documentation (English)](https://vuejs.org/)

### 3. Vuetify

**Concept:** Vuetify is a Material Design component library based on Vue that provides a large number of pre-built UI components following Google Material Design guidelines.

**Documentation:**
- [Vuetify Official Documentation (English)](https://vuetifyjs.com/en/)

### 4. TypeScript

**Concept:** TypeScript is a superset of JavaScript that adds a static type system. It can detect errors during the development phase, provide better IDE support, and make code easier to maintain and refactor.

**Documentation:**
- [TypeScript Official Documentation (English)](https://www.typescriptlang.org/)

---

## Project Directory Structure

### Overall Structure

```
ef-frontend-v1/
├── app/                          # Nuxt application directory (auto-recognized by Nuxt)
│   ├── app.vue                   # Application root component
│   ├── app.config.ts             # Application configuration file
│   ├── assets/                   # Static resources directory
│   ├── components/               # Components directory
│   ├── composables/              # Composables directory
│   ├── layouts/                  # Layouts directory
│   ├── middleware/               # Route middleware directory
│   ├── pages/                    # Pages directory
│   └── plugins/                  # Plugins directory
├── content/                      # Content directory (auto-recognized by @nuxt/content)
│   └── introduction/             # Introductions for how to develop this project
├── public/                       # Public static resources directory (auto-recognized by Nuxt)
├── i18n/                         # Internationalization files directory (auto-recognized by @nuxtjs/i18n)
├── custom/                       # Custom files directory
│   └── route/                    # Custom configuration of routes directory
├── shared/                       # Shared utilities directory
├── nuxt.config.ts                # Nuxt configuration file
├── tsconfig.json                 # TypeScript configuration file
└── package.json                  # Project dependencies configuration
```

---

## Detailed Directory Descriptions

### Auto-recognized Directories by Nuxt

These directories follow Nuxt conventions and **should not be changed arbitrarily**.

#### `app/` - Nuxt Application Directory

Nuxt 3+ uses the `app/` directory as the application root directory, replacing the previous root directory structure.

- **`app/app.vue`** - Application root component, the entry component of the application
- **`app/app.config.ts`** - Application configuration file for storing project-level configuration information, equivalent to the project configuration sharing center. For example: static route configuration, global settings, etc.

#### `app/pages/` - Pages Directory

Nuxt automatically generates routes based on the file structure in the `pages/` directory.

- File naming uses kebab-case, e.g., `item-value-table.vue`
- Directory structure corresponds to route structure, e.g., `pages/material-profit/shop-value.vue` corresponds to route `/material-profit/shop-value`
- `pages/index.vue` corresponds to root route `/`

**Example:**
```
pages/
├── index.vue                    # Route: /
└── material-profit/
    ├── shop-value.vue           # Route: /material-profit/shop-value
    └── package-value.vue        # Route: /material-profit/package-value
```

#### `app/components/` - Components Directory

Stores Vue components. Nuxt automatically imports these components without manual import.

- Component naming uses PascalCase
- Supports nested directory structure
- Components are recommended to be organized by function, e.g., `layout/`, `text/`, `container/`, etc.

**Example:**
```
components/
├── layout/
│   ├── Sidebar.vue
│   └── Footer.vue
└── text/
    └── ParticleWord.vue
```

#### `app/layouts/` - Layouts Directory

Stores layout components used to define the overall layout structure of pages.

- `default.vue` - Default layout
- You can specify the layout to use in pages via `definePageMeta({ layout: 'docs' })`

#### `app/composables/` - Composables Directory

Stores Vue 3 Composition API composables. Nuxt automatically imports these functions.

- File names start with `use`, e.g., `useTheme.ts`
- Functions can use Nuxt's auto-import feature internally

**Example:**
```typescript
// composables/useTheme.ts
export const useTheme = () => {
  // Theme-related logic
}
```

#### `app/plugins/` - Plugins Directory

Stores Nuxt plugins used to execute code when the application starts.

- Plugins execute before the Vue application is created
- Can be used to register global components, add Vue directives, configure third-party libraries, etc.
- File names are automatically registered as plugins

**Example:**
```typescript
// plugins/vuetify.ts
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((nuxtApp) => {
  // Vuetify configuration
})
```

#### `app/middleware/` - Middleware Directory

Stores route middleware that runs before navigating to a page.

- Supports both per-route middleware (e.g., `auth.ts`) and global middleware (e.g., `docs-portal.global.ts`)
- Common use cases include authentication checks, redirects, and analytics hooks

#### `app/assets/` - Static Resources Directory

Stores static resource files that need processing, such as CSS, images, fonts, etc.

- CSS files need to be imported in `nuxt.config.ts` or in components via `~/assets/`
- Resources are processed by Vite, supporting optimization and compression

**Example:**
```
assets/
└── css/
    └── global.css              # Global style file
```

#### `public/` - Public Static Resources Directory

Stores static files that don't need processing. These files are directly copied to the output directory.

- Can be accessed directly via `/` path, e.g., `/favicon.ico`

---

### Auto-recognized Directories by Modules

#### `content/` - Content Directory (@nuxt/content module)

Stores Markdown content files. The `@nuxt/content` module automatically recognizes and processes them.

- Uses shared category folders with language-specific suffixes such as `-zh` and `-en`
- File paths correspond to route paths
- Supports Markdown syntax and Front Matter

**Example:**
```
content/
└── introduction/
    ├── common-questions-zh.md
    ├── common-questions-en.md
    ├── route-setting-zh.md
    ├── route-setting-en.md
    ├── project-structure-zh.md
    ├── project-structure-en.md
    └── ...
```

#### `i18n/locales/` - Internationalization Files Directory (@nuxtjs/i18n module)

Stores internationalization translation files. The `@nuxtjs/i18n` module automatically recognizes them.

- File names correspond to language codes, e.g., `zh-CN.json`, `en-US.json`
- Configure languages and file paths in `nuxt.config.ts`
- Use translations in components via `$t()` function

**Example:**
```
i18n/
└── locales/
    ├── zh-CN.json
    └── en-US.json
```

---

### Custom Directories

These directories are custom and **can be modified as needed**.

#### `custom/` - Custom Files Directory

Used to store custom files not automatically recognized by Nuxt.

- **`custom/route/routes.json`** - Custom route configuration file
  - Used to configure route information for the sidebar menu
  - Supports first and second-level route nesting
  - Referenced in `app/app.config.ts`

- **`custom/route/docNavigation.json`** - Documentation navigation configuration file
  - Used to configure the left navigation menu of the documentation system
  - Defines document categories and document lists
  - Supports internationalization translation keys

#### `shared/` - Shared Utilities Directory

Stores utility functions and utility classes that can be shared in multiple places.

- **`shared/utils/`** - Utility functions directory
  - E.g., `colorUtil.ts`, `domUtil.ts`
  - This directory is auto-recognized by Nuxt and can be used directly in pages and components without manual import

---

## Directory Permission Notes

### ⚠️ Directories Not Recommended to Change

The following directories follow framework conventions and **should not be changed arbitrarily**, otherwise functionality may be affected:

1. **`app/`** - Nuxt application directory
   - Including all subdirectories: `pages/`, `components/`, `layouts/`, `composables/`, `plugins/`, `middleware/`, `assets/`

2. **`public/`** - Public static resources directory

3. **`content/`** - Content directory (auto-recognized by @nuxt/content)

4. **`i18n/`** - Internationalization files directory (auto-recognized by @nuxtjs/i18n)

5. **Configuration files** - `nuxt.config.ts`, `tsconfig.json`, `package.json`, etc.

> 💡 **Note:** While the structure of these directories is not recommended to change, you can add, delete, or modify file contents within them.

### ✅ Directories That Can Be Changed

The following directories are custom and **can be adjusted freely according to project needs**:

1. **`custom/`** - Custom files directory
   - Can add new subdirectories and files
   - Can adjust directory structure
   - Recommended to store custom files uniformly in this directory

2. **`shared/`** - Shared utilities directory
   - Can add new utility modules as needed
   - Can adjust directory structure
   - Note that only `utils` and `types` directories under `shared` are auto-recognized; other custom directories still need manual import to be used in other components

### 📝 Recommendations

- **Store custom files uniformly in the `custom/` directory** for easier management and maintenance

