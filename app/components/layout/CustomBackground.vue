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
  /* background-color: #808080;
  opacity: 0.5; */
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
  /* 将点阵图的颜色固定为 #808080 */
  /* 使用 sepia + hue-rotate 将黑色转换为 #808080 */
  filter: brightness(100%) contrast(100%) sepia(100%) hue-rotate(0deg) saturate(50%) brightness(0.5);
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
</style>