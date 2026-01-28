<template>
  <div class="custom-bg">
    <div class="bg-color-layer" />
    <img :src="mapBg" class="bg-image" alt="Map Background" >
  </div>
</template>

<script setup>
// Import SVG file
import mapBg from '~/assets/svg/map-bg.svg?url';
</script>

<style scoped>
.custom-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}

.bg-color-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--theme-bg-primary);
  z-index: 1;
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  opacity: 0.3;
  transition: filter 0.3s ease;
  z-index: 2;
  /* 颜色混合算法：将 SVG 转换为灰度背景 */
  /* 1. grayscale(100%) - 将图像完全转换为灰度 */
  /* 2. brightness(200%) - 提高亮度使灰色变浅 */
  /* 3. contrast(50%) - 降低对比度使颜色更柔和 */
  filter: grayscale(100%) brightness(200%) contrast(100%);
  /* 从左上(完全可见)到右下(完全透明)的渐变 */
  -webkit-mask-image: linear-gradient(
    to top left,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.4) 40%,
    rgba(0, 0, 0, 0.2) 70%,
    rgba(0, 0, 0, 0) 100%
  );
  mask-image: linear-gradient(
    to top left,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.4) 40%,
    rgba(0, 0, 0, 0.2) 70%,
    rgba(0, 0, 0, 0) 100%
  );
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}

/* Dark mode adjustments */
[data-theme='dark'] .bg-image {
  filter: grayscale(100%) brightness(50%) contrast(120%);
}
</style>
