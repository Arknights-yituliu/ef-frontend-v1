---
title: 项目结构说明
description: 了解项目的技术栈、目录结构以及各个文件和目录的作用
---

# 项目结构说明

本文档将帮助你全面了解项目的技术栈、目录结构以及各个文件和目录的作用。

## 项目主要技术栈

本项目基于以下核心技术构建：

- **Nuxt 4.x** - 基于 Vue.js 的全栈框架
- **Vue 3.x** - 渐进式 JavaScript 框架
- **Vuetify 3.x** - Vue 的 Material Design 组件库
- **TypeScript** - JavaScript 的超集，提供类型系统

---

## 开发所需掌握的技术

在开始开发之前，建议你至少了解以下技术：

### 1. Nuxt

**概念：** Nuxt 是一个基于 Vue.js 的全栈框架，提供了服务端渲染（SSR）、静态站点生成（SSG）、路由、状态管理、模块系统等功能。它遵循"约定优于配置"的理念，自动处理了许多常见的配置任务。

**官方文档：**
- [Nuxt 官方文档（中文）](https://nuxt.com.cn/)
- [Nuxt 官方文档（英文）](https://nuxt.com/docs)

### 2. Vue

**概念：** Vue 是一个渐进式 JavaScript 框架，用于构建用户界面。它采用组件化开发模式，提供了响应式数据绑定、指令系统、组件系统等核心功能。

**官方文档：**
- [Vue 官方文档（中文）](https://cn.vuejs.org/)
- [Vue 官方文档（英文）](https://vuejs.org/)

### 3. Vuetify

**概念：** Vuetify 是基于 Vue 的 Material Design 组件库，提供了大量预构建的 UI 组件，遵循 Google Material Design 设计规范。

**官方文档：**
- [Vuetify 官方文档（中文）](https://vuetifyjs.com/zh-Hans/)
- [Vuetify 官方文档（英文）](https://vuetifyjs.com/en/)

### 4. TypeScript

**概念：** TypeScript 是 JavaScript 的超集，添加了静态类型系统。它可以在开发阶段发现错误，提供更好的 IDE 支持，使代码更易于维护和重构。

**官方文档：**
- [TypeScript 中文网](https://ts.nodejs.cn/)
- [TypeScript 官方文档（英文）](https://www.typescriptlang.org/)

---

## 项目目录结构

### 整体结构

```
ef-frontend-v1/
├── app/                          # Nuxt 应用目录（Nuxt 自动识别）
│   ├── app.vue                   # 应用根组件
│   ├── app.config.ts             # 应用配置文件
│   ├── assets/                   # 静态资源目录
│   ├── components/               # 组件目录
│   ├── composables/              # 组合式函数目录
│   ├── layouts/                  # 布局目录
│   ├── middleware/               # 路由中间件目录
│   ├── pages/                    # 页面目录
│   └── plugins/                  # 插件目录
├── content/                      # 内容目录（@nuxt/content 自动识别）
│   └── introduction/             # 怎么开发这个项目
├── public/                       # 公共静态资源目录（Nuxt 自动识别）
├── i18n/                         # 国际化文件目录（@nuxtjs/i18n 自动识别）
├── custom/                       # 自定义文件目录
│   └── route/                    # 自定义路由配置目录
├── shared/                       # 共享工具目录
├── nuxt.config.ts                # Nuxt 配置文件
├── tsconfig.json                 # TypeScript 配置文件
└── package.json                  # 项目依赖配置
```

---

## 目录详细说明

### Nuxt 自动识别的目录

这些目录遵循 Nuxt 的约定，**不建议随意更改结构或命名**。

#### `app/` - Nuxt 应用目录

Nuxt 3+ 使用 `app/` 目录作为应用根目录，替代了之前的根目录结构。

- **`app/app.vue`** - 应用根组件，是应用的入口组件
- **`app/app.config.ts`** - 应用配置文件，用于存放项目级别的配置信息，相当于项目配置共享中心。例如：静态路由配置、全局设置等

#### `app/pages/` - 页面目录

Nuxt 会根据 `pages/` 目录下的文件结构自动生成路由。

- 文件命名使用短横线命名法（kebab-case），例如：`item-value-table.vue`
- 目录结构对应路由结构，例如：`pages/material-profit/shop-value.vue` 对应路由 `/material-profit/shop-value`
- `pages/index.vue` 对应根路由 `/`

**示例：**
```
pages/
├── index.vue                    # 路由: /
└── material-profit/
    ├── shop-value.vue           # 路由: /material-profit/shop-value
    └── package-value.vue        # 路由: /material-profit/package-value
```

#### `app/components/` - 组件目录

存放 Vue 组件，Nuxt 会自动导入这些组件，无需手动 import。

- 组件命名使用 PascalCase（大驼峰命名法）
- 支持嵌套目录结构
- 组件建议按功能分类存放，例如：`layout/`、`text/`、`container/` 等

**示例：**
```
components/
├── layout/
│   ├── Sidebar.vue
│   └── Footer.vue
└── text/
    └── ParticleWord.vue
```

#### `app/layouts/` - 布局目录

存放布局组件，用于定义页面的整体布局结构。

- `default.vue` - 默认布局
- 可以在页面中通过 `definePageMeta({ layout: 'docs' })` 指定使用的布局。

#### `app/composables/` - 组合式函数目录

存放 Vue 3 Composition API 的组合式函数（Composables），Nuxt 会自动导入这些函数。

- 文件名以 `use` 开头，例如：`useTheme.ts`
- 函数内部可以使用 Nuxt 的自动导入功能

**示例：**
```typescript
// composables/useTheme.ts
export const useTheme = () => {
  // 主题相关逻辑
}
```

#### `app/plugins/` - 插件目录

存放 Nuxt 插件，用于在应用启动时执行代码。

- 插件会在 Vue 应用创建之前执行
- 可以用于注册全局组件、添加 Vue 指令、配置第三方库等
- 文件名会自动注册为插件

**示例：**
```typescript
// plugins/vuetify.ts
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((nuxtApp) => {
  // Vuetify 配置
})
```

#### `app/middleware/` - 中间件目录

存放在页面导航前执行的路由中间件。

- 支持按需路由中间件（例如 `auth.ts`）和全局中间件（例如 `docs-portal.global.ts`）
- 常见用途包括权限校验、跳转控制和埋点分析等

#### `app/assets/` - 静态资源目录

存放需要处理的静态资源文件，如 CSS、图片、字体等。

- CSS 文件需要在 `nuxt.config.ts` 中引入，或在组件中通过 `~/assets/` 导入
- 资源会被 Vite 处理，支持优化和压缩

**示例：**
```
assets/
└── css/
    └── global.css              # 全局样式文件
```

#### `public/` - 公共静态资源目录

存放不需要处理的静态文件，这些文件会直接复制到输出目录。

- 可以通过 `/` 路径直接访问，例如：`/favicon.ico`

---

### 模块自动识别的目录

#### `content/` - 内容目录（@nuxt/content 模块）

存放 Markdown 内容文件，`@nuxt/content` 模块会自动识别和处理。

- 采用共享分类目录，通过 `-zh`、`-en` 等后缀区分语言版本
- 文件路径对应路由路径
- 支持 Markdown 语法和 Front Matter

**示例：**
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

#### `i18n/locales/` - 国际化文件目录（@nuxtjs/i18n 模块）

存放国际化翻译文件，`@nuxtjs/i18n` 模块会自动识别。

- 文件命名对应语言代码，例如：`zh-CN.json`、`en-US.json`
- 在 `nuxt.config.ts` 中配置语言和文件路径
- 可以通过 `$t()` 函数在组件中使用翻译

**示例：**
```
i18n/
└── locales/
    ├── zh-CN.json
    └── en-US.json
```

---

### 自定义目录

这些目录是项目自定义的，**可以根据需要修改**。

#### `custom/` - 自定义文件目录

用于存放不被 Nuxt 自动识别的自定义文件。

- **`custom/route/routes.json`** - 自定义路由配置文件
  - 用于配置侧边栏菜单的路由信息
  - 支持一级和二级路由嵌套
  - 在 `app/app.config.ts` 中引用

- **`custom/route/docNavigation.json`** - 文档导航配置文件
  - 用于配置文档系统的左侧导航菜单
  - 定义文档分类和文档列表
  - 支持国际化翻译键

#### `shared/` - 共享工具目录

存放可在多个地方共享使用的工具函数和工具类。

- **`shared/utils/`** - 工具函数目录
  - 例如：`colorUtil.ts`、`domUtil.ts`
  - 该目录会被Nuxt自动识别，可在无需手动导入的情况下在pages和components目录下直接使用

---

## 目录权限说明

### ⚠️ 不建议更改的目录

以下目录遵循框架约定，**不建议随意更改结构或命名**，否则可能导致功能异常：

1. **`app/`** - Nuxt 应用目录
   - 包括其下的所有子目录：`pages/`、`components/`、`layouts/`、`composables/`、`plugins/`、`middleware/`、`assets/`

2. **`public/`** - 公共静态资源目录

3. **`content/`** - 内容目录（被 @nuxt/content 库自动识别）

4. **`i18n/`** - 国际化文件目录（被 @nuxtjs/i18n 库自动识别）

5. **配置文件** - `nuxt.config.ts`、`tsconfig.json`、`package.json` 等

> 💡 **注意：** 虽然这些目录的结构不建议更改，但可以在其中添加、删除或修改文件内容。

### ✅ 可以更改的目录

以下目录是项目自定义的，**可以根据项目需要自由调整**：

1. **`custom/`** - 自定义文件目录
   - 可以添加新的子目录和文件
   - 可以调整目录结构
   - 建议自定义的文件统一存放在此目录下

2. **`shared/`** - 共享工具目录
   - 可以根据需要添加新的工具模块
   - 可以调整目录结构
   - 需要注意，在shared目录下，只有utils和types目录是会被自动识别的，其它自定义的目录仍需要手动导入才能在其它组件中使用

### 📝 建议

- **自定义文件统一存放在 `custom/` 目录下**，便于管理和维护