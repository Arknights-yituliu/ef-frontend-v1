---
title: 文档编写指南
description: 学习如何为项目编写和组织新的文档
---

# 文档编写指南

本文档将指导您如何为项目添加新的文档，包括文件创建、导航配置、国际化设置等完整流程。

## 文档系统概述

本项目使用 **Nuxt Content 4.x** 构建文档系统，具有以下特点：

- 📝 支持 Markdown 格式
- 🌍 支持国际化（中文/英文）
- 📑 自动生成文档导航
- 📱 完全响应式布局

## 文档目录结构

```
content/
└── introduction/                   # 文档分类目录（中英文共用）
    ├── project-structure-zh.md     # 项目结构（中文）
    ├── project-structure-en.md     # 项目结构（英文）
    ├── route-setting-zh.md         # 路由设置（中文）
    ├── route-setting-en.md         # 路由设置（英文）
    ├── docs-setting-zh.md          # 文档编写（中文，本文档）
    ├── docs-setting-en.md          # 文档编写（英文）
    ├── common-questions-zh.md      # 常见问题（中文）
    ├── common-questions-en.md      # 常见问题（英文）
    └── ...                         # 更多文档（使用 -zh/-en 后缀）
```

---

## 添加新文档的完整流程

### 第一部分：在已有的一级目录下新增文档

在现有的一级目录（如 [/introduction](file:///d:/development-projects/contribution-projects/ef-frontend-v1/content/introduction)）下添加新文档，请按照以下步骤操作：

#### 步骤 1: 创建 Markdown 文件

在 `content/` 目录下对应分类文件夹中创建新的 `.md` 文件，通过 `-zh` 和 `-en` 后缀区分中文和英文版本，便于成对维护。

**中文文档路径：** `content/{分类}/{文件名}-zh.md`  
**英文文档路径：** `content/{分类}/{文件名}-en.md`

**示例：**

```
content/introduction/new-document-zh.md
content/introduction/new-document-en.md
```

#### 步骤 2: 编写文档内容

每个 Markdown 文件必须包含 **Front Matter**（文件头部的 YAML 格式元数据）。

**基本模板：**

```
---
title: 文档标题
description: 文档简短描述，用于 SEO 和预览
---

# 文档标题

这里是文档的正文内容...

## 一级标题

内容段落...

### 二级标题

更多内容...
```

**Front Matter 字段说明：**

| 字段          | 必填 | 说明                     |
| ------------- | ---- | ------------------------ |
| `title`       | ✅   | 文档标题，显示在页面顶部 |
| `description` | ✅   | 文档描述，显示在标题下方 |

#### 步骤 3: 更新文档导航配置

编辑 `custom/route/docNavigation.json` 文件，添加新文档的导航项。

**配置文件结构：**

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

**字段说明：**

- **`titleKey`**: 国际化翻译键，对应 i18n 文件中的翻译
- **`path`**: 文档路径，对应 content 目录下的文件路径（不含语言前缀）
- **`items`**: 该分类下的文档列表

#### 步骤 4: 更新路由配置

在更新文档导航后，还需要更新 `custom/route/routes.json` 文件，确保新文档出现在主导航菜单中。

找到与文档一级目录对应的章节（例如 "introduction"），然后添加一个新的子项：

```json
{
  "i18nKey": "newDocument",
  "nameKey": "menu.newDocument",
  "routePath": "/introduction/new-document",
  "vuetifyIcon": "mdi-file-document"
}
```

#### 步骤 5: 添加国际化翻译

在 `i18n/locales/zh-CN.json` 和 `i18n/locales/en-US.json` 中添加对应的翻译。

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

### 第二部分：新增一个一级目录

要创建全新的顶级文档目录，请按照以下步骤操作：

#### 步骤 1: 管理文档路由前缀

如果新文档位于不同的一级路径（例如 `/tutorials`），需要在 `app/app.config.ts` 中更新共享配置，以便中间件能够将其识别为文档门户的一部分。

```ts
export default defineAppConfig({
  // ... 其他配置
  docsRoutePrefixes: ['/introduction', '/tutorials'],
});
```

根据需要在 `docsRoutePrefixes` 数组中新增前缀。

#### 步骤 2: 配置内容集合

在 `content.config.ts` 中，为新的一级目录添加集合定义：

```ts
export default defineContentConfig({
  collections: {
    introduction: defineCollection({
      // 指定内容的类型
      type: 'page',
      // 加载`content`目录下的每个文件
      source: '**',
    }),
    [新集合名称]: defineCollection({
      type: 'page',
      source: '**',
    }),
  },
});
```

#### 步骤 3: 为新目录创建路由文件

在 `app/pages/[新一级目录]/[...slug].vue` 创建新文件，内容如下：

```vue
<template>
  <DocumentPage :collection-name="collectionName" />
</template>

<script lang="ts" setup>
// 使用 docs 布局
definePageMeta({
  layout: 'docs',
});

// 设置集合名称以匹配新目录
const collectionName = '[新集合名称]';
</script>
```

将 `[新集合名称]` 替换为实际的新集合名称（例如，如果您创建的是 "tutorials" 目录，则使用 "tutorials"）。

#### 步骤 4: 更新路由配置文件

在 `custom/route/routes.json` 文件中，添加一个新的顶级文档路由项。这个路由项必须设置 `isDocs: true`，以便系统识别为文档路由。

**配置示例：**

```json
{
  "i18nKey": "tutorials",
  "nameKey": "menu.tutorials",
  "vuetifyIcon": "mdi-school",
  "isDocs": true,
  "children": []
}
```

**字段说明：**

- **`i18nKey`**: 国际化键名，用于标识该路由项
- **`nameKey`**: 菜单名称的国际化键，对应 i18n 文件中的翻译
- **`vuetifyIcon`**: Vuetify 图标名称，用于在导航菜单中显示
- **`isDocs`**: 必须设置为 `true`，标识这是一个文档路由
- **`children`**: 子路由数组，初始可以为空数组 `[]`，后续添加文档时再填充

**重要提示：** 只有在完成此步骤后，才能在新的一级文档路由下添加文档。添加文档时，需要在该路由项的 `children` 数组中添加子项（参考第一部分的步骤 4）。

至此您的新的一级目录新增完毕，现在可以参照第一部分的步骤在新的一级目录下新增文档了。

**关于 `isDocs` 配置：**

- 如果父路由已经设置了 `isDocs: true`，子路由会自动继承文档路由的特性，通常不需要在子路由中再次设置。
- 但是，如果某个二级路由需要单独标记为文档路由（例如，在非文档父路由下的某个子路由是文档页面），可以在该子路由中单独设置 `isDocs: true`。
- 系统支持在二级路由中配置 `isDocs`，中间件会正确识别并应用文档路由的路径规范化规则。

**示例：在非文档父路由下配置文档子路由**

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

## 相关资源

### 官方文档

- [Nuxt Content 文档](https://content.nuxt.com)
- [Markdown 语法指南](https://www.markdownguide.org/)
