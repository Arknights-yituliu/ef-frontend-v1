<template>
  <div class="home-page">
    <h1 class="page-title">终末地一图流</h1>
    <p class="page-description">
      欢迎来到终末地一图流数据展示网站
    </p>
    <p class="page-hint">
      请从左侧菜单选择要查看的内容
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.home-page {
  padding: 2rem 0;
  text-align: center;
}

.page-title {
  font-size: var(--font-size-5xl);
  color: var(--theme-text-primary);
  margin-bottom: 2rem;
  font-weight: 700;
}

.page-description {
  font-size: var(--font-size-xl);
  color: var(--theme-text-primary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.page-hint {
  font-size: var(--font-size-md);
  color: var(--theme-text-secondary);
  line-height: 1.5;
}
</style>
