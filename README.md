# 终末地一图流网站

基于 Nuxt 4.x 开发的明日方舟：终末地风格网站，采用工业科幻风格设计，完整实现 Design.md 中定义的设计规范。

## 设计特色

- 🎨 **工业科幻风格**: 斜条纹图案、几何元素、高对比度色彩
- 🟡 **品牌识别**: 标志性黄色 `#fffa00` 作为强调色
- 📱 **响应式设计**: 基于方向检测的响应式布局
- ✨ **流畅动画**: 按钮悬停效果、页面过渡动画
- 🎯 **设计规范**: 严格遵循 Design.md 中的设计系统

## 项目结构

```
ef-frontend-v1/
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── global.css      # 全局样式和设计系统
│   ├── pages/
│   │   └── index.vue           # 首页
│   └── app.vue                  # 应用根组件
├── Design.md                    # 设计风格文档
└── nuxt.config.ts              # Nuxt 配置
```

## 设计文档

详细的设计规范请参考 [Design.md](./Design.md)，包含：
- 色彩系统
- 字体系统
- 设计模式与装饰元素
- 组件设计规范
- 交互与动画
- 响应式设计策略

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
