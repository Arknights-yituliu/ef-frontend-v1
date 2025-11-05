<template>
  <div
      ref="divRef"
      @mousemove="handleMouseMove"
      @focus="handleFocus"
      @blur="handleBlur"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      :class="['spotlight-card', className]"
  >
    <div
        class="spotlight-overlay"
        :style="{
        opacity,
        background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${computedSpotlightColor}, transparent 80%)`
      }"
    />

    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, computed } from 'vue';

interface Position {
  x: number;
  y: number;
}

interface SpotlightCardProps {
  className?: string;
  spotlightColor?: string;
}

const props = defineProps<SpotlightCardProps>();
const { theme } = useTheme();

const divRef = useTemplateRef<HTMLDivElement>('divRef');
const isFocused = ref<boolean>(false);
const position = ref<Position>({ x: 0, y: 0 });
const opacity = ref<number>(0);

// 计算主题化的 spotlight 颜色
const computedSpotlightColor = computed(() => {
  if (props.spotlightColor) {
    return props.spotlightColor;
  }
  
  // 根据主题自动选择颜色
  return theme.value === 'dark'
    ? 'rgba(255, 250, 0, 0.25)' // 深色主题使用品牌黄色
    : 'rgba(255, 255, 255, 0.25)'; // 浅色主题使用白色
});

const handleMouseMove = (e: MouseEvent) => {
  if (!divRef.value || isFocused.value) return;

  const rect = divRef.value.getBoundingClientRect();
  position.value = { x: e.clientX - rect.left, y: e.clientY - rect.top };
};

const handleFocus = () => {
  isFocused.value = true;
  opacity.value = 0.6;
};

const handleBlur = () => {
  isFocused.value = false;
  opacity.value = 0;
};

const handleMouseEnter = () => {
  opacity.value = 0.6;
};

const handleMouseLeave = () => {
  opacity.value = 0;
};
</script>

<style scoped>
.spotlight-card {
  position: relative;
  border-radius: var(--radius-lg);
  border: 1px solid var(--theme-border);
  overflow: hidden;
  padding: var(--spacing-xl);
  background-color: var(--theme-bg-secondary);
  transition: 
    background-color var(--transition-base),
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.spotlight-card:hover {
  box-shadow: 0 0 0.75rem var(--theme-shadow-accent);
}

.spotlight-overlay {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  z-index: 0;
}

/* 确保 slot 内容在 spotlight 之上 */
.spotlight-card > * {
  position: relative;
  z-index: 1;
}
</style>
