<template>
  <div class="item-value-table-page">
    <h1 class="page-title">{{ $t('page.materialProfit.itemValueTable.title') }}</h1>
    <p class="page-description">{{ $t('page.materialProfit.itemValueTable.description') }}</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.item-value-table-page {
  padding: 2rem 0;
}

.page-title {
  font-size: var(--font-size-3xl);
  color: var(--theme-text-primary);
  margin-bottom: 1rem;
  font-weight: 700;
}

.page-description {
  font-size: var(--font-size-md);
  color: var(--theme-text-secondary);
  margin-bottom: 2.5rem;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 480px) {
  .item-value-table-page {
    padding: 1rem 0;
  }

  .page-title {
    font-size: var(--font-size-xl);
  }
}
</style>

