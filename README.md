# 终末地一图流网站

基于 Nuxt 4.x 开发的《明日方舟：终末地》一图流网站

## 📁 项目结构

```
ef-frontend-v1/
├── app/                          # Nuxt 应用目录
│   ├── app.vue                   # 应用根组件
│   ├── app.config.ts             # 应用配置文件，相当于项目配置共享中心
│   ├── error.vue                 # 错误页面
│   ├── assets/                   # 静态资源目录
│   │   ├── css/                  # CSS 样式文件
│   │   ├── images/               # 图片资源
│   │   └── svg/                  # SVG 矢量图
│   ├── components/               # 组件目录
│   │   ├── annimation/           # 动画组件
│   │   ├── container/            # 容器组件
│   │   ├── docs/                 # 文档相关组件
│   │   ├── gacha-calculator/     # 抽卡计算器组件
│   │   ├── home/                 # 首页组件
│   │   ├── icon/                 # 图标组件
│   │   ├── layout/               # 布局组件
│   │   ├── text/                 # 文本相关组件
│   │   └── tools/                # 工具页面组件
│   ├── composables/              # 组合式函数目录
│   │   ├── useDocsSearch.ts      # 文档搜索组合式函数
│   │   ├── usePageSeo.ts         # 页面 SEO 组合式函数
│   │   └── useTheme.ts           # 主题管理组合式函数
│   ├── layouts/                  # 布局目录
│   │   ├── default.vue           # 默认布局
│   │   └── docs.vue              # 文档布局
│   ├── middleware/               # 路由中间件目录
│   │   └── docs-path-normalize.global.ts # 文档路径规范化全局中间件
│   ├── pages/                    # 页面目录
│   │   ├── index.vue             # 首页
│   │   ├── aic/                  # AIC 页面
│   │   ├── blueprint/            # 蓝图页面
│   │   ├── introduction/         # 介绍文档页面
│   │   ├── material-profit/      # 材料收益页面
│   │   ├── operations/           # 行动文档页面
│   │   ├── others/               # 其他页面
│   │   ├── resources/            # 资源页面
│   │   └── tools/                # 工具页面
│   └── plugins/                  # 插件目录
│       └── vuetify.ts            # Vuetify 插件配置
├── content/                      # 文档内容目录，按分类存放中英文后缀 .md 文件
│   ├── introduction/             # 开发指南文档
│   └── operations/               # 操作指南文档
├── public/                       # 公共静态资源目录
│   ├── favicon.ico               # 网站图标
│   ├── images/                   # 公共图片目录
│   ├── svg/                      # 公共 SVG 文件
│   ├── sitemap.xml               # 网站地图文件
│   ├── site.webmanifest          # PWA 清单文件
│   └── _robots.txt               # Robots.txt 文件
├── i18n/                         # 国际化文件目录（由 @nuxtjs/i18n 识别）
│   └── locales/
│       ├── zh-CN.json            # 中文（简体）翻译文件
│       └── en-US.json            # 英文（美国）翻译文件
├── custom/                       # 自定义文件，用于存放不被 Nuxt 自动识别的配置
│   ├── config/                   # 自定义配置
│   │   ├── base-url.ts           # 基础 URL 配置
│   │   └── pre-fetch.ts          # 预加载配置
│   ├── core/                     # 游戏核心数据文件
│   │   ├── gacha/                # 抽卡数据子目录
│   │   ├── items.ts              # 物品数据
│   │   ├── itemValue.ts          # 物品价值数据
│   │   ├── gachaItem.ts          # 抽卡物品数据
│   │   ├── packs.ts              # 礼包数据
│   │   ├── shops.ts              # 商店数据
│   │   ├── gifts.ts              # 礼物数据
│   │   └── weapons.ts            # 武器数据
│   ├── info/                     # 项目信息文件
│   │   ├── contributors.json     # 贡献者信息
│   │   └── friendLinks.json      # 友链信息
│   └── route/                    # 自定义路由与文档导航配置目录
│       ├── docNavigation.json    # 文档导航配置
│       └── routes.json           # 侧边栏菜单路由配置
├── shared/                       # 共享工具目录
│   ├── types/                    # TypeScript 类型定义（Nuxt 自动识别）
│   │   ├── gacha-calculator.ts   # 抽卡计算器类型
│   │   ├── gachaItem.ts          # 抽卡物品类型
│   │   ├── itemValue.ts          # 物品价值类型
│   │   └── pack.ts               # 礼包类型
│   └── utils/                    # 工具函数（Nuxt 自动识别）
│       ├── gameData/             # 游戏数据工具
│       │   ├── item.ts           # 物品数据工具
│       │   └── pack.ts           # 礼包数据工具
│       ├── combinatoricUtil.ts   # 组合数学工具函数
│       ├── dateUtil.ts           # 日期工具函数
│       ├── debounce.ts           # 防抖工具函数
│       ├── domUtil.ts            # DOM 操作工具
│       ├── numberUtil.ts         # 数字工具函数
│       └── urlUtil.ts            # URL 工具函数
├── scripts/                      # 数据处理脚本
│   ├── gameData.ts               # 游戏数据入口
│   ├── makeAllData.ts            # 全量数据生成脚本
│   ├── models/                   # 数据模型定义
│   ├── tasks/                    # 数据处理任务
│   └── tsconfig.json             # 脚本 TypeScript 配置
├── docs/                         # 项目文档
│   └── SVG_BACKGROUND_REPLACE.md # SVG 背景替换指南
├── .github/                      # GitHub 配置
│   ├── copilot-instructions.md   # Copilot 开发指引
│   └── workflows/                # CI/CD 工作流
├── .dockerignore                 # Docker 构建忽略文件配置
├── .gitignore                    # Git 忽略文件配置
├── .editorconfig                 # 编辑器配置文件
├── .prettierrc.json              # Prettier 代码格式化配置
├── eslint.config.mjs             # ESLint 代码检查配置
├── content.config.ts             # Nuxt Content 模块配置
├── nuxt.config.ts                # Nuxt 配置文件
├── tsconfig.json                 # TypeScript 配置文件
├── Dockerfile                    # Docker 镜像构建文件
├── nginx.conf                    # Nginx 配置文件（用于 Docker 容器）
├── LICENSE                       # 项目许可证文件
└── package.json                  # 项目依赖配置
```

## 🚀 快速开始

### 克隆项目

```bash
git clone --depth 1 --branch dev https://github.com/Arknights-yituliu/ef-frontend-v1.git
```

### 安装依赖

```bash
cd ef-frontend-v1
yarn install
```

### 开发环境

启动开发服务器，访问地址：`http://localhost:3000`

```bash
yarn dev
```

### 生产构建

构建生产版本（SSG）：

```bash
yarn generate
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
>
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

### 相关资源

- [Nuxt 4.x 官方文档](https://nuxt.com/docs/4.x/getting-started/introduction)
- [Vue 3 官方文档](https://vuejs.org/)
- [Nuxt Content 文档](https://content.nuxt.com)
