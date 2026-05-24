<script lang="ts" setup>
const props = defineProps<{
  title: string;
  titleEn: string;
  tips: string[];
}>();
</script>

<template>
  <div class="module-header">
    <div class="module-title">
      <h1>{{ props.title }}</h1>
      <h4>{{ props.titleEn }}</h4>
    </div>
    <slot />
    <div v-for="(tip, index) in tips" :key="index" class="module-tip">{{ tip }}</div>
  </div>
</template>

<style scoped>
.module-header {
  padding: 12px 0;
  flex-wrap: wrap;
  display: flex;
  align-items: center;
}

.module-title {
  height: 60px;
  position: relative;
}

.module-title h1 {
  line-height: 1;
  font-size: 36px;
  padding: 0 4px 0 12px;
  font-weight: bolder;
  position: relative;
  z-index: 1;
}

.module-title h4 {
  padding: 12px 4px 0 4px;
  margin-top: -8px;
  background-color: #959595;
  color: #ffffff;
  border-left: 8px solid #fafb34;
  font-size: 14px;
}

.module-tip {
  padding: 0 12px;
  font-style: italic;
  color: #00a1d6;
  font-size: 14px;
  line-height: 16px;
}
</style>
