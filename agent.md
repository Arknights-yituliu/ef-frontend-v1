# AI 代码生成指南

本文档为 AI 生成代码时需要了解的项目更新步骤，包括如何新建页面、文档页面以及国际化更新。
_注意：本文档为AI Agent提供，开发者请前往文档站阅读开发者文档。_

## 📋 目录

- 项目概述
- 开发环境与命令
- 新建页面
- 新建文档页面
- 国际化更新
- 项目重要约定
- 数据处理与预获取
- 常见问题

---

## 🎯 项目概述

### 项目信息

- **项目名称**: 终末地一图流 (ef-yituliu)
- **技术栈**: Nuxt 4 + Vue 3 + TypeScript + Vuetify
- **包管理器**: Yarn 1.22.22
- **项目类型**: SPA (单页应用)，SSR 禁用
- **目标**: 为《明日方舟：终末地》提供数据解析平台和工具

### 核心功能模块

1. **材料收益分析** - 商店性价比、礼包性价比、物品价值表
2. **工具箱** - 攒抽计算器、基质计算器
3. **资源下载** - 基质识别工具
4. **文档系统** - 开发指南、功能操作指南
5. **其他功能** - 贡献者展示、友情链接等

---

## 🛠️ 开发环境与命令

### 可用脚本命令

```bash
# 开发模式
yarn dev          # 启动开发服务器

# 构建
yarn build        # 构建生产版本
yarn generate     # 生成静态站点
yarn preview      # 预览构建结果

# 代码质量
yarn lint         # ESLint 检查
yarn lint:fix     # ESLint 自动修复
yarn format       # Prettier 格式化
yarn format:check # Prettier 检查
yarn lint:format  # ESLint 修复 + Prettier 格式化

# 依赖管理
yarn install      # 安装依赖
yarn postinstall  # Nuxt 预处理（自动执行）
```

### 核心依赖

- **框架**: Nuxt 4.2.0, Vue 3.5.22
- **UI库**: Vuetify 3.10.9
- **国际化**: @nuxtjs/i18n 10.2.0
- **内容管理**: @nuxt/content 3.8.0
- **SEO优化**: @nuxtjs/seo 3.3.0
- **数据处理**: better-sqlite3, fuse.js, gsap
- **开发工具**: @nuxt/eslint, typescript

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
  layout: 'default',
});

// 设置页面标题
useHead({
  title: '页面标题',
});
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
- `children`: 子菜单项（可选）

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
  docsRoutePrefixes: ['/introduction', '/operations', '/new-category'],
});
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
    operations: defineCollection({
      type: 'page',
      source: '**',
    }),
    newCategory: defineCollection({
      type: 'page',
      source: '**',
    }),
  },
});
```

#### 步骤 3: 创建路由文件

在 `app/pages/new-category/[...slug].vue` 创建文件：

```vue
<template>
  <DocumentPage :collection-name="collectionName" />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'docs',
});

const collectionName = 'newCategory';
</script>
```

#### 步骤 4: 更新路由配置

在 `custom/route/routes.json` 中添加新的顶级文档路由：

```json
{
  "i18nKey": "newCategory",
  "nameKey": "menu.newCategory",
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

#### 页面和组件翻译

```json
{
  "page": {
    "newFeature": {
      "title": "新功能",
      "description": "功能描述"
    }
  },
  "component": {
    "newComponent": {
      "buttonText": "点击按钮"
    }
  }
}
```

### 翻译键命名规范

- 使用 camelCase 命名
- 菜单项使用 `menu.xxx` 格式
- 文档项使用 `docs.xxx` 格式
- 页面翻译使用 `page.xxx` 格式
- 组件翻译使用 `component.xxx` 格式
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
   - `config/` - 配置文件
   - `core/` - 核心业务逻辑
   - `info/` - 信息数据
   - `route/` - 路由配置

2. **`shared/`** - 共享代码目录
   - `types/` - 类型定义
   - `utils/` - 工具函数

### 文件命名规范

- **页面文件：** 使用 kebab-case，如 `item-value-table.vue`
- **组件文件：** 使用 PascalCase，如 `ContributorCard.vue`
- **文档文件：** 使用 kebab-case + 语言后缀，如 `project-structure-zh.md`
- **类型文件：** 使用 PascalCase，如 `ItemValue.ts`
- **工具文件：** 使用 camelCase，如 `numberUtil.ts`

### 自动导入特性

- **组件：** `app/components/` 下的组件会自动导入
- **组合式函数：** `app/composables/` 下的函数会自动导入
- **工具函数：** `shared/utils/` 下的函数会自动导入
- **类型定义：** `shared/types/` 下的类型会自动导入
- **游戏数据工具：** `shared/utils/gameData/` 下的函数会自动导入

---

## 📊 数据处理与预获取

### 构建时数据预获取

项目在构建阶段会自动从 CDN 获取 Wiki 数据表并嵌入到构建产物中：

```ts
// custom/config/pre-fetch.ts
export async function fetchWikiTables(): Promise<{
  wikiEntryDataTable: WikiEntryDataTable;
  wikiEntryTable: WikiEntryTable;
  wikiGroupTable: WikiGroupTable;
}>
```

### 运行时数据访问

通过 `useRuntimeConfig()` 访问预获取的数据：

```ts
const config = useRuntimeConfig();
const wikiData = config.public.wikiEntryTable;
```

### 自定义业务逻辑

- **核心数据：** `custom/core/` 目录包含游戏相关业务逻辑
- **配置数据：** `custom/info/` 目录包含静态配置信息
- **预获取配置：** `custom/config/pre-fetch.ts` 配置构建时数据获取

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
4. 是否重启了开发服务器

### Q: 如何使用不同的布局？

A: 在页面中使用 `definePageMeta`：

```typescript
definePageMeta({
  layout: 'docs', // 使用 docs 布局
});
```

当前可用布局：
- `default` - 默认布局（带侧边栏）
- `docs` - 文档布局（带侧边栏和目录）

### Q: 如何设置页面标题？

A: 使用 `useHead`：

```typescript
useHead({
  title: '页面标题 - 终末地一图流',
});
```

### Q: 如何添加新的工具函数？

A: 在 `shared/utils/` 目录下创建文件，函数会自动导入：

```typescript
// shared/utils/myUtil.ts
export function myHelperFunction(data: string): string {
  return data.toUpperCase();
}
```

### Q: 如何处理大整数 ID？

A: 使用项目提供的辅助函数：

```typescript
function parseJSONWithBigInt(text: string) {
  const replaced = text.replace(/"id":\s*(-?\d+)/g, '"id": "$1"');
  return JSON.parse(replaced);
}
```

### Q: 如何添加新的类型定义？

A: 在 `shared/types/` 目录下创建文件：

```typescript
// shared/types/myType.ts
export interface MyCustomType {
  id: string;
  name: string;
  value: number;
}
```

---

## 📝 开发建议

1. **遵循约定：** 优先使用 Nuxt 的约定优于配置原则
2. **保持一致：** 保持命名和结构的一致性
3. **国际化优先：** 所有用户可见的文本都必须国际化
4. **组件化：** 优先创建可复用的组件
5. **类型安全：** 充分利用 TypeScript 的类型系统
6. **性能优化：** 利用构建时数据预获取减少运行时请求
7. **代码质量：** 提交前运行 `yarn lint:format` 确保代码质量
8. **SEO 优化：** 使用 `useHead` 正确设置页面元数据

---