# AI 代码生成指南

本文档为 AI 生成代码时需要了解的项目更新步骤，包括如何新建页面、文档页面以及国际化更新。

## 📋 目录

- 新建页面
- 新建文档页面
- 国际化更新
- 项目重要约定
- 常见问题

---

## 🚀 新建页面

### 步骤 1: 创建页面文件

在 `app/pages/` 目录下创建 Vue 文件，文件路径对应路由路径。

**示例：**
```
app/pages/new-feature/index.vue     → /new-feature
app/pages/new-feature/detail.vue    → /new-feature/detail
```

**页面文件模板：**
```vue
<template>
  <div>
    <h1>页面标题</h1>
    <!-- 页面内容 -->
  </div>
</template>

<script setup lang="ts">
// 使用默认布局
definePageMeta({
  layout: 'default'
})

// 设置页面标题
useHead({
  title: '页面标题'
})
</script>
```

### 步骤 2: 更新路由配置

编辑 `custom/route/routes.json` 文件，添加新页面的路由配置。

**配置示例：**
```json
{
  "i18nKey": "newFeature",
  "nameKey": "menu.newFeature",
  "vuetifyIcon": "mdi-star",
  "routePath": "/new-feature"
}
```

**字段说明：**
- `i18nKey`: 国际化标识符
- `nameKey`: i18n 翻译键
- `vuetifyIcon`: Vuetify 图标名称
- `routePath`: 路由路径

### 步骤 3: 添加国际化翻译

在 `i18n/locales/` 目录下更新翻译文件。

**zh-CN.json:**
```json
{
  "menu": {
    "newFeature": "新功能"
  }
}
```

**en-US.json:**
```json
{
  "menu": {
    "newFeature": "New Feature"
  }
}
```

---

## 📚 新建文档页面

### 在已有目录下添加文档

#### 步骤 1: 创建 Markdown 文件

在 `content/` 目录下对应分类文件夹中创建新的 `.md` 文件，使用 `-zh` 和 `-en` 后缀区分语言版本。

**示例：**
```
content/introduction/new-doc-zh.md
content/introduction/new-doc-en.md
```

**文档模板：**
```markdown
---
title: 文档标题
description: 文档简短描述
---

# 文档标题

这里是文档的正文内容...
```

#### 步骤 2: 更新文档导航配置

编辑 `custom/route/docNavigation.json` 文件，添加新文档的导航项。

**配置示例：**
```json
{
  "titleKey": "docs.items.newDoc",
  "path": "/introduction/new-doc"
}
```

#### 步骤 3: 添加国际化翻译

**zh-CN.json:**
```json
{
  "docs": {
    "items": {
      "newDoc": "新文档"
    }
  }
}
```

**en-US.json:**
```json
{
  "docs": {
    "items": {
      "newDoc": "New Document"
    }
  }
}
```

### 创建新的一级文档目录

#### 步骤 1: 更新应用配置

在 `app/app.config.ts` 中添加新的路由前缀：

```ts
export default defineAppConfig({
  docsRoutePrefixes: ['/introduction', '/tutorials']
})
```

#### 步骤 2: 配置内容集合

在 `content.config.ts` 中添加新集合定义：

```ts
export default defineContentConfig({
  collections: {
    introduction: defineCollection({
      type: 'page',
      source: '**',
    }),
    tutorials: defineCollection({
      type: 'page',
      source: '**',
    })
  }
})
```

#### 步骤 3: 创建路由文件

在 `app/pages/tutorials/[...slug].vue` 创建文件：

```vue
<template>
  <DocumentPage :collection-name="collectionName" />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'docs'
})

const collectionName = 'tutorials'
</script>
```

#### 步骤 4: 更新路由配置

在 `custom/route/routes.json` 中添加新的顶级文档路由：

```json
{
  "i18nKey": "tutorials",
  "nameKey": "menu.tutorials",
  "vuetifyIcon": "mdi-school",
  "isDocs": true,
  "children": []
}
```

---

## 🌍 国际化更新

### 翻译文件位置

- **中文翻译：** `i18n/locales/zh-CN.json`
- **英文翻译：** `i18n/locales/en-US.json`

### 常见翻译键

#### 菜单翻译
```json
{
  "menu": {
    "introduction": "开发指南",
    "newFeature": "新功能"
  }
}
```

#### 文档翻译
```json
{
  "docs": {
    "sections": {
      "introduction": "开发指南"
    },
    "items": {
      "projectStructure": "项目结构"
    }
  }
}
```

### 翻译键命名规范

- 使用 camelCase 命名
- 菜单项使用 `menu.xxx` 格式
- 文档项使用 `docs.xxx` 格式
- 保持中英文翻译键一致

---

## 📁 项目重要约定

### ⚠️ 不可更改的目录

以下目录遵循框架约定，**不建议随意更改**：

1. **`app/`** - Nuxt 应用目录
   - `pages/` - 页面目录
   - `components/` - 组件目录
   - `layouts/` - 布局目录
   - `composables/` - 组合式函数目录
   - `plugins/` - 插件目录
   - `middleware/` - 中间件目录
   - `assets/` - 静态资源目录

2. **`content/`** - 内容目录
3. **`i18n/`** - 国际化文件目录
4. **`public/`** - 公共静态资源目录

### ✅ 可以更改的目录

以下目录是项目自定义的，**可以根据需要调整**：

1. **`custom/`** - 自定义文件目录

### 文件命名规范

- **页面文件：** 使用 kebab-case，如 `item-value-table.vue`
- **组件文件：** 使用 PascalCase，如 `ContributorCard.vue`
- **文档文件：** 使用 kebab-case + 语言后缀，如 `project-structure-zh.md`

### 自动导入特性

- **组件：** `app/components/` 下的组件会自动导入
- **组合式函数：** `app/composables/` 下的函数会自动导入
- **工具函数：** `shared/utils/` 下的函数会自动导入

---

## ❓ 常见问题

### Q: 如何创建多级菜单？

A: 在 `routes.json` 中使用 `children` 字段：

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

### Q: 为什么我的页面没有显示在菜单中？

A: 请检查：
1. 是否在 `routes.json` 中添加了配置
2. 是否在 i18n 文件中添加了翻译
3. 路由路径是否与 pages 文件匹配

### Q: 如何使用不同的布局？

A: 在页面中使用 `definePageMeta`：

```typescript
definePageMeta({
  layout: 'docs'  // 使用 docs 布局
})
```

### Q: 如何设置页面标题？

A: 使用 `useHead`：

```typescript
useHead({
  title: '页面标题 - 终末地一图流'
})
```

---

## 📝 开发建议

1. **遵循约定：** 优先使用 Nuxt 的约定优于配置原则
2. **保持一致：** 保持命名和结构的一致性
3. **国际化优先：** 所有用户可见的文本都必须国际化
4. **组件化：** 优先创建可复用的组件
5. **类型安全：** 充分利用 TypeScript 的类型系统

---

*本文档为AI Agent提供，开发者请前往文档站阅读开发者文档。*