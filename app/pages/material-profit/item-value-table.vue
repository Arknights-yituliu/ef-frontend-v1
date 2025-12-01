<template>
  <div class="item-value-table-page">
    <h1 class="page-title">{{ $t('page.materialProfit.itemValueTable.title') }}</h1>
    <p class="page-description">{{ $t('page.materialProfit.itemValueTable.description') }}</p>
    <v-table>
      <thead>
        <tr>
          <th>{{ $t('page.materialProfit.itemValueTable.itemName') }}</th>
          <th>{{ $t('page.materialProfit.itemValueTable.itemValue') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in itemInfo" :key="item.itemId">
          <td>{{ item.itemName || item.itemId }}</td>
          <td>{{ item.value.toFixed(4) }}</td>
        </tr>
      </tbody>
    </v-table>
    <!-- <div class="d-flex flex-column ga-5">
      <div class="d-flex ga-5 align-center" v-for="item in itemInfo">
        <div class="">{{ item.itemName }}</div>
        <div>{{ item.value.toFixed(4) }}</div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { itemInfo } from '@/custom/core/itemInfo';

definePageMeta({
  layout: 'default',
});
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

.item-icon {
  height: 4rem;
  width: 4rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }
}
</style>
