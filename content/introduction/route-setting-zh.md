---
title: 路由设置说明
description: 了解如何在项目中配置和管理路由
---

# 路由设置说明

本文档介绍项目中的路由配置方法和管理方式。

## 路由系统概述

本项目使用 Nuxt 3 的文件系统路由（File-based Routing）机制，同时结合自定义路由配置来管理菜单和导航。

### 文件系统路由

Nuxt 会根据 `app/pages/` 目录下的文件结构自动生成路由：

- 文件路径对应路由路径
- `index.vue` 对应根路由
- 动态路由使用方括号，如 `[id].vue`
- Catch-all 路由使用 `[...slug].vue`

**示例：**

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

## 自定义路由配置

### 配置文件位置

路由配置文件位于：`custom/route/routes.json`

### 配置文件结构

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

### 配置字段说明

- **`i18nKey`**: 国际化标识符，用于唯一标识该路由
- **`nameKey`**: i18n 翻译键，指向菜单显示的文本
- **`vuetifyIcon`**: Vuetify 图标名称，用于菜单图标
- **`routePath`**: 路由路径，对应 pages 目录中的文件
- **`children`**: 子路由数组，支持二级菜单

---

## 添加新路由

### 步骤 1: 创建页面文件

在 `app/pages/` 目录下创建对应的 Vue 文件。

**示例：**

```
app/pages/tutorial/getting-started.vue
```

### 步骤 2: 更新路由配置

在 `custom/route/routes.json` 中添加路由配置：

```json
{
  "i18nKey": "gettingStarted",
  "nameKey": "menu.gettingStarted",
  "routePath": "/tutorial/getting-started",
  "vuetifyIcon": "mdi-rocket-launch"
}
```

### 步骤 3: 添加国际化翻译

在 `i18n/locales/zh-CN.json` 和 `i18n/locales/en-US.json` 中添加翻译：

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

## 布局配置

### 使用不同布局

在页面文件中使用 `definePageMeta` 指定布局：

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'docs'  // 使用 docs 布局
})
</script>
```

### 可用布局

- **`default`**: 默认布局，包含侧边栏和主内容区
- **`docs`**: 文档布局，包含文档目录、内容区和 TOC

---

## 路由导航

### 使用 NuxtLink 组件

```vue
<NuxtLink to="/introduction/project-structure">
  项目结构
</NuxtLink>
```

### 编程式导航

```typescript
// 使用 navigateTo
await navigateTo('/introduction/project-structure')

// 使用 useRouter
const router = useRouter()
router.push('/introduction/project-structure')
```

---

## 路由元信息

### 页面标题

使用 `useHead` 设置页面标题：

```typescript
useHead({
  title: '项目结构 - 终末地一图流'
})
```

### SEO 优化

```typescript
useHead({
  title: '项目结构',
  meta: [
    {
      name: 'description',
      content: '了解项目的技术栈、目录结构以及各个文件和目录的作用'
    }
  ]
})
```

---

## 动态路由

### Catch-all 路由

本项目使用 catch-all 路由来处理文档页面：

```
pages/introduction/[...slug].vue
```

这个路由会匹配所有 `/introduction/` 下的路径，如：
- `/introduction/project-structure`
- `/introduction/route-setting`
- `/introduction/common-questions`

### 获取路由参数

```typescript
const route = useRoute()
const slug = route.params.slug  // 获取 slug 参数
```

---

## 路由守卫

### 页面级守卫

使用 `definePageMeta` 定义中间件：

```typescript
definePageMeta({
  middleware: ['auth']  // 使用 auth 中间件
})
```

### 全局守卫

在 `app/middleware/` 目录下创建中间件文件：

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // 路由守卫逻辑
  if (!isAuthenticated()) {
    return navigateTo('/login')
  }
})
```

---

## 最佳实践

### 1. 路由命名规范

- 使用 kebab-case 命名文件
- 文件名应简洁明了，反映页面内容
- 避免使用特殊字符

### 2. 路由组织

- 按功能模块组织路由
- 使用目录结构表示层级关系
- 保持路由结构清晰易懂

### 3. 国际化

- 所有菜单文本必须使用 i18n
- 同时维护中英文翻译
- 保持翻译键命名一致

### 4. 图标使用

- 使用 Material Design Icons
- 图标应与页面内容相关
- 保持图标风格统一

---

## 常见问题

### Q: 为什么我的路由没有显示在菜单中？

A: 请检查以下几点：
1. 是否在 `routes.json` 中添加了配置
2. 是否在 i18n 文件中添加了翻译
3. 路由路径是否与 pages 文件匹配

### Q: 如何创建多级菜单？

A: 目前支持二级菜单，通过 `children` 字段配置：

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

### Q: 如何添加外部链接？

A: 外部链接不建议添加到路由配置中，建议在页面内容中使用普通的 `<a>` 标签。

---

## 总结

本项目的路由系统结合了 Nuxt 的文件系统路由和自定义路由配置，既保持了灵活性，又提供了统一的菜单管理方式。在添加新路由时，请遵循本文档的指南，确保路由配置完整且规范。
