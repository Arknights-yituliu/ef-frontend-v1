<template>
  <div class="package-value-page">
    <h1 class="page-title">{{ $t('page.materialProfit.packageValue.title') }}</h1>
    <p class="page-description">{{ $t('page.materialProfit.packageValue.description') }}</p>

    <!-- 礼包卡片列表 -->
    <div class="packs-container" v-if="packs.length > 0">
      <ContainerPackCard v-for="(pack, index) in packs" :key="index" v-bind="pack" />
    </div>

    <div class="no-data" v-else>
      <p>{{ $t('common.noData') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import packs from '@/custom/core/packs.json';
import type { PackData } from '@/shared/types/pack';
packs as PackData[];

definePageMeta({
  layout: 'default',
});
</script>

<style scoped>
.package-value-page {
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

.packs-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xl);
  margin-top: var(--spacing-xl);
}

.no-data {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--theme-text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 520px) {
  .packs-container {
    gap: var(--spacing-md);
  }
}
</style>
