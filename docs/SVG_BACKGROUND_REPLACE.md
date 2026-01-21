# SVG背景图替换指南

## 快速替换步骤

### 1. 获取SVG素材

**方法A：从SVG文件获取**
- 找到你的 `.svg` 文件
- 用文本编辑器打开（记事本、VS Code等）
- 复制 `<svg>` 标签内的所有内容（不包括 `<svg>` 标签本身）

**方法B：从在线资源获取**
- 浏览器中打开SVG文件
- 右键 → 查看页面源代码
- 复制 `<svg>` 内的路径/图形内容

**方法C：使用SVG优化工具**
- 使用 [SVGOMG](https://jakearchibald.github.io/svgomg/) 在线优化
- 粘贴SVG代码，优化后复制结果

### 2. 替换到组件中

打开 `app/components/layout/CustomBackground.vue`，替换 `<svg>` 标签内的内容：

```vue
<template>
  <svg class="custom-bg" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
    <!-- 删除这一行，替换为你的SVG内容 -->
    <!-- 示例：替换为 -->
    <path d="M0 0L1920 0L1920 1080L0 1080Z" fill="currentColor" />
    <circle cx="960" cy="540" r="200" fill="currentColor" opacity="0.3" />
  </svg>
</template>
```

### 3. 调整viewBox（重要）

**viewBox 格式**：`"x y width height"`

- 从原SVG文件中复制 `viewBox` 属性值
- 或根据你的SVG尺寸设置：
  ```html
  viewBox="0 0 1920 1080"  <!-- 1920x1080 分辨率 -->
  viewBox="0 0 1440 900"   <!-- 1440x900 分辨率 -->
  viewBox="0 0 100 100"    <!-- 100x100 小图标 -->
  ```

### 4. 样式调整（根据需要）

**基本样式**（已设置）：
```css
.custom-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}
```

**调整透明度**：
```css
.custom-bg {
  opacity: 0.5;  /* 0-1之间，数值越小越透明 */
}
```

**支持主题切换**：
```css
.custom-bg path {
  fill: var(--wave-bg-color-0);  /* 使用CSS变量 */
  transition: fill var(--transition-base);
}

.custom-bg circle {
  fill: var(--bg-color);
}
```

**添加动画**：
```css
.custom-bg path {
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}
```

## 完整示例

### 示例1：简单的渐变背景

```vue
<template>
  <svg class="custom-bg" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg-gradient)" />
  </svg>
</template>
```

### 示例2：几何图案背景

```vue
<template>
  <svg class="custom-bg" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f5f5f5" />
    <circle cx="200" cy="200" r="150" fill="#e0e0e0" />
    <circle cx="800" cy="400" r="100" fill="#d0d0d0" />
    <circle cx="1200" cy="600" r="120" fill="#e8e8e8" />
  </svg>
</template>
```

### 示例3：波纹背景（类似DesertBackground）

```vue
<template>
  <svg class="custom-bg" viewBox="0 0 1440 700" xmlns="http://www.w3.org/2000/svg">
    <path
      class="wave-1"
      d="M 0,700 C 0,700 0,140 0,140 C 69,117 138,95 188,92 C 237,88 266,102 310,122 C 353,141 410,165 474,155 C 537,144 606,101 662,97 C 717,92 757,128 808,139 C 858,149 917,133 969,136 C 1020,138 1062,158 1118,156 C 1173,153 1241,128 1297,122 C 1352,115 1396,127 1440,140 C 1440,140 1440,700 1440,700 Z"
      fill="var(--wave-bg-color-0)"
    />
  </svg>
</template>
```

## 常见问题

### Q1: SVG显示不完整？
- 检查 `viewBox` 是否正确设置
- 确保 `width` 和 `height` 为 `100%`

### Q2: 背景遮挡了内容？
- 已设置 `z-index: -1`，如果还有问题，可以调整为更小的值（如 `-10`）

### Q3: 颜色不匹配主题？
- 使用 `var(--wave-bg-color-0)` 等 CSS 变量
- 或在 `app/assets/css/theme.css` 中定义自己的颜色变量

### Q4: 性能问题？
- 使用 [SVGOMG](https://jakearchibald.github.io/svgomg/) 优化SVG代码
- 避免使用过多的动画效果

### Q5: 如何实现响应式？
```css
.custom-bg {
  /* 已设置width和height为100%，会自动适应屏幕 */
  width: 100%;
  height: 100%;
}
```

## 在哪里使用

### 在首页使用
```vue
<!-- app/pages/index.vue -->
<template>
  <CustomBackground />
  <div class="content">
    <!-- 首页内容 -->
  </div>
</template>

<script setup>
// 如果需要动态控制，可以这样：
import { ref } from 'vue'
const showBg = ref(true)
</script>

<template>
  <CustomBackground v-if="showBg" />
</template>
```

### 在特定页面使用
```vue
<!-- app/pages/example.vue -->
<template>
  <CustomBackground />
  <div class="page-content">
    <!-- 页面内容 -->
  </div>
</template>
```

### 在全局布局使用（所有页面显示）
```vue
<!-- app/layouts/default.vue -->
<template>
  <CustomBackground />
  <slot />
</template>
```

## 资源推荐

- **免费SVG资源**：
  - [SVGBackgrounds](https://svgbackgrounds.com/)
  - [HeroPatterns](https://www.heropatterns.com/)
  - [PatternMonster](https://patternmonster.com/)

- **SVG优化工具**：
  - [SVGOMG](https://jakearchibald.github.io/svgomg/)
  - [SVGO](https://github.com/svg/svgo)

- **SVG编辑器**：
  - [Figma](https://www.figma.com/)
  - [Inkscape](https://inkscape.org/)
  - [SVG-Edit](https://svg-edit.github.io/svgedit/)
