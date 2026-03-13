<script setup lang="ts">

const props = defineProps<{title:string}>();

</script>

<template>
  <div class="gacha-calculator-module-title">
    <svg height="36" viewBox="0 0 36 36" width="36" xmlns="http://www.w3.org/2000/svg">
      <!-- 倒三角形 -->
      <polygon
        fill="#ffffff"
        points="18,30 36,6 0,6"
        stroke="#C92A2A"
        stroke-linejoin="round"
        stroke-width="0"
      />
    </svg>
    <div class="gacha-calculator-module-title-icon"/>
  <div>{{props.title}}</div>
  </div>
</template>

<style scoped>
.gacha-calculator-module-title{
  margin: 12px 0;
  padding: 0 4px;
  width: 100%;
  font-size: 1.5rem;
  background: var(--gacha-calculator-moudule-title-bg);
  display: flex;
  align-content: center;
}

</style>
