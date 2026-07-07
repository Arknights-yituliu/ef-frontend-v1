<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>

<template>
  <div class="gacha-calculator-module-title" style="display: none">
    <svg height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg">
      <!-- 倒三角形 -->
      <polygon
        fill="var(--gacha-calculator-title-color)"
        points="16,24 28,8 4,8"
        stroke="#C92A2A"
        stroke-linejoin="round"
        stroke-width="0"
      />
    </svg>
    <div class="gacha-calculator-module-title-icon" />
    <div>{{ props.title }}</div>
  </div>
</template>

<style scoped>
.gacha-calculator-module-title {
  margin: 12px 0;
  padding: 0 4px;
  width: 100%;
  font-size: 1.5rem;
  background: var(--gacha-calculator-title-bg);
  color: var(--gacha-calculator-title-color);

  display: flex;
  align-items: center;
}
</style>
