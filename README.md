# 终末地一图流网站

基于 Nuxt 4.x 开发的《明日方舟：终末地》一图流网站

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

### AI 开发建议
项目默认以 AGENTS.md 文件和 .claude 目录作为 AI 开发的主要上下文文件。推荐使用 Claude Code 或 OpenCode 以获得最佳开发体验。若使用其他 AI 编程工具，为避免上下文文件过于杂乱，可将其配置文件添加到 .gitignore 中。
- [OpenCode 兼容性](https://opencode.ai/docs/zh-cn/rules/#claude-code-%E5%85%BC%E5%AE%B9%E6%80%A7)
- [便捷切换 Claude Code / OpenCode 对接的AI服务供应商的工具](https://github.com/farion1231/cc-switch)

### 相关资源

- [Nuxt 4.x 官方文档](https://nuxt.com/docs/4.x/getting-started/introduction)
- [Vue 3 官方文档](https://vuejs.org/)
- [Nuxt Content 文档](https://content.nuxt.com)
