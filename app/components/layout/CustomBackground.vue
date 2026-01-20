<template>
  <div class="custom-bg">
    <img :src="mapBg" class="bg-image" alt="Map Background" />
  </div>
</template>

<script setup>
// Import the SVG file
import mapBg from '~/assets/svg/map-bg.svg?url'

// Import the theme composable
import { useTheme } from '~/composables/useTheme'

const { theme } = useTheme()
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

.bg-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  opacity: 0.4;
  transition: filter 0.3s ease;
}

/* Since the theme is always light now, we don't need dark mode inversion */
</style>
