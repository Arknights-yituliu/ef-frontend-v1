# 终末地一图流网站

基于 Nuxt 4.x 开发的《明日方舟：终末地》一图流网站

## 📁 项目结构

```
ef-frontend-v1/
├── app/                          # Nuxt 应用目录
│   ├── app.vue                   # 应用根组件
│   ├── app.config.ts             # 应用配置文件，相当于项目配置共享中心
│   ├── assets/                   # 静态资源目录
│   │   └── css/
│   │       └── global.css        # 全局样式文件
│   ├── components/               # 组件目录
│   ├── composables/              # 组合式函数目录
│   ├── layouts/                  # 布局目录
│   ├── middleware/               # 路由中间件目录
│   ├── pages/                    # 页面目录
│   └── plugins/                  # 插件目录
├── content/                      # 文档内容目录，按分类存放中英文后缀 .md 文件
│   └── introduction/
│       ├── project-structure-zh.md
│       ├── project-structure-en.md
│       └── ...
├── public/                       # 公共静态资源目录
│   ├── favicon.ico
│   ├── images/
│   └── robots.txt
├── i18n/                         # 国际化文件目录（由 @nuxtjs/i18n 识别）
│   └── locales/
│       ├── zh-CN.json
│       └── en-US.json
├── custom/                       # 自定义文件，用于存放不被 Nuxt 自动识别的配置
│   └── route/                    # 自定义路由与文档导航配置目录
│       ├── docNavigation.json
│       └── routes.json
├── shared/                       # 共享工具目录
│   └── utils/                    # 工具函数
│       ├── colorUtil.ts
│       └── domUtil.ts
├── agent.md                      # AI Agent 开发指南（专为 AI 生成代码时参考）
├── .gitignore                    # Git 忽略文件配置
├── nuxt.config.ts                # Nuxt 配置文件
├── tsconfig.json                 # TypeScript 配置文件
└── package.json                  # 项目依赖配置
```

## 🚀 快速开始

### 安装依赖

```bash
yarn install
```

### 开发环境

启动开发服务器，访问地址：`http://localhost:3000`

```bash
yarn dev
```

### 生产构建

构建生产版本：

```bash
yarn build
```

预览生产构建：

```bash
yarn preview
```

## 📚 项目文档

### 开发指南

- [项目结构说明](./content/introduction/project-structure-zh.md) - 了解项目的技术栈和目录结构
- [路由设置指南](./content/introduction/route-setting-zh.md) - 学习如何配置和管理路由
- [文档编写指南](./content/introduction/docs-setting-zh.md) - 学习如何为项目编写新的文档
- [常见问题解答](./content/introduction/common-questions-zh.md) - 解决开发过程中的常见问题

### AI 开发辅助

- [AI Agent 开发指南](./agent.md) - 专为 AI 生成代码时参考的知识文档，包含项目开发流程和规范

### 系统说明

- [Design.md](./Design.md) - 网站设计风格文档

### 相关资源

- [Nuxt 4.x 官方文档](https://nuxt.com/docs/4.x/getting-started/introduction)
- [Vue 3 官方文档](https://vuejs.org/)
- [Nuxt Content 文档](https://content.nuxt.com)