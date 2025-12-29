# 终末地一图流网站

基于 Nuxt 4.x 开发的《明日方舟：终末地》一图流网站

## 📁 项目结构

```
ef-frontend-v1/
├── app/                          # Nuxt 应用目录
│   ├── app.vue                   # 应用根组件
│   ├── app.config.ts             # 应用配置文件，相当于项目配置共享中心
│   ├── assets/                   # 静态资源目录
│   │   ├── avatar/               # 头像图片目录
│   │   │   └── contributors/     # 贡献者头像
│   │   ├── css/                  # CSS 样式文件
│   │   └── icon/                 # 图标文件
│   ├── components/               # 组件目录
│   │   ├── annimation/           # 动画组件
│   │   ├── container/            # 容器组件
│   │   ├── docs/                 # 文档相关组件
│   │   ├── home/                 # 首页组件
│   │   ├── layout/               # 布局组件
│   │   └── text/                 # 文本相关组件
│   ├── composables/              # 组合式函数目录
│   │   ├── useDocsSearch.ts      # 文档搜索组合式函数
│   │   └── useTheme.ts           # 主题管理组合式函数
│   ├── layouts/                  # 布局目录
│   │   ├── default.vue           # 默认布局
│   │   └── docs.vue              # 文档布局
│   ├── middleware/               # 路由中间件目录
│   │   └── docs-portal.global.ts # 文档门户全局中间件
│   ├── pages/                    # 页面目录
│   │   ├── index.vue             # 首页
│   │   ├── introduction/         # 介绍文档页面
│   │   ├── material-profit/      # 材料收益页面
│   │   ├── operations/           # 行动文档页面
│   │   ├── others/               # 其他页面
│   │   └── tools/                # 工具页面
│   └── plugins/                  # 插件目录
│       └── vuetify.ts            # Vuetify 插件配置
├── content/                      # 文档内容目录，按分类存放中英文后缀 .md 文件
│   └── introduction/
│       ├── project-structure-zh.md
│       ├── project-structure-en.md
│       └── ...
├── public/                       # 公共静态资源目录
│   ├── favicon.ico               # 网站图标
│   ├── images/                   # 公共图片目录
│   ├── sitemap.xml               # 网站地图文件
│   └── _robots.txt               # Robots.txt 文件
├── i18n/                         # 国际化文件目录（由 @nuxtjs/i18n 识别）
│   └── locales/
│       ├── zh-CN.json            # 中文（简体）翻译文件
│       └── en-US.json            # 英文（美国）翻译文件
├── custom/                       # 自定义文件，用于存放不被 Nuxt 自动识别的配置
│   ├── core/                     # 游戏核心数据文件
│   │   ├── gachaItem.ts          # 抽卡物品数据
│   │   ├── itemInfo.ts           # 物品信息数据
│   │   ├── itemValue.ts          # 物品价值数据
│   │   ├── packs.ts              # 礼包数据
│   │   └── shops.ts              # 商店数据
│   ├── info/                     # 项目信息文件
│   │   └── contributors.json     # 贡献者信息
│   └── route/                    # 自定义路由与文档导航配置目录
│       ├── docNavigation.json    # 文档导航配置
│       └── routes.json           # 侧边栏菜单路由配置
├── shared/                       # 共享工具目录
│   ├── types/                    # TypeScript 类型定义（Nuxt 自动识别）
│   │   ├── gachaItem.ts          # 抽卡物品类型
│   │   ├── itemInfo.ts           # 物品信息类型
│   │   ├── itemValue.ts          # 物品价值类型
│   │   └── pack.ts               # 礼包类型
│   └── utils/                    # 工具函数（Nuxt 自动识别）
│       ├── combinatoricUtil.ts   # 组合数学工具函数
│       ├── domUtil.ts            # DOM 操作工具
│       ├── gameData/             # 游戏数据工具
│       │   └── item.ts           # 物品数据工具
│       ├── numberUtil.ts         # 数字工具函数
│       └── urlUtil.ts            # URL 工具函数
├── agent.md                      # AI Agent 开发指南（专为 AI 生成代码时参考）
├── Design.md                     # 网站设计风格文档
├── LICENSE                       # 项目许可证文件
├── Dockerfile                    # Docker 镜像构建文件
├── nginx.conf                    # Nginx 配置文件（用于 Docker 容器）
├── .dockerignore                 # Docker 构建忽略文件配置
├── .gitignore                    # Git 忽略文件配置
├── .editorconfig                 # 编辑器配置文件
├── .prettierrc.json              # Prettier 代码格式化配置
├── eslint.config.mjs             # ESLint 代码检查配置
├── content.config.ts             # Nuxt Content 模块配置
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

### Docker 部署

使用 Docker 可以快速部署生产环境。

#### 构建 Docker 镜像

```bash
docker build -t ef-frontend-v1 .
```

> 💡 **提示：** 如果构建时拉取 node 和 nginx 镜像失败，可以手动拉取：
> ```bash
> docker pull node:20-alpine
> docker pull nginx:1.28-alpine-slim
> ```

#### 运行 Docker 容器

```bash
docker run -d -p 80:80 ef-frontend-v1
```

访问地址：`http://localhost:80`

## 📚 项目文档

### 开发指南

- [格式化规范](./content/introduction/format-specification-zh.md) - 了解项目的代码格式化规范
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
