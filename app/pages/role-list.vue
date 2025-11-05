<template>
  <div class="page-container">
    <h1 class="page-title">{{ $t('page.roleList') }}</h1>
    <p class="page-description">
      一级菜单：{{ $t('menu.primary1') }} - 二级菜单：{{ $t('menu.secondary1_1') }}
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.page-container {
  padding: 2rem 0;
}

.page-title {
  font-size: var(--font-size-3xl);
  color: var(--theme-text-primary);
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.page-description {
  font-size: var(--font-size-md);
  color: var(--theme-text-secondary);
  line-height: 1.5;
}
</style>

