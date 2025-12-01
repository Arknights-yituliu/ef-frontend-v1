<template>
  <div class="shop-value-page">
    <h1 class="page-title">{{ $t('page.materialProfit.shopValue.title') }}</h1>
    <p class="page-description">{{ $t('page.materialProfit.shopValue.description') }}</p>

    <div v-for="shop in shops" :key="shop.shopId">
      <h2>{{ shop.shopName }}</h2>
      <v-table :hover="true">
        <thead>
          <tr>
            <th>
              {{ $t('page.materialProfit.shopValue.itemName') }}
            </th>
            <th>
              {{ $t('page.materialProfit.shopValue.quantityPerGroup') }}
            </th>
            <th>
              {{ $t('page.materialProfit.shopValue.currentPrice') }}
            </th>
            <th>
              {{ $t('page.materialProfit.shopValue.totalValue') }}
            </th>
            <th>
              {{ $t('page.materialProfit.shopValue.costPerformance') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in shop.shopItems" :key="item.itemId">
            <td>{{ getItemName(item.itemId) }}</td>
            <td>{{ item.quantityPerGroup }}</td>
            <td>{{ item.currentPrice }}</td>
            <td>{{ getTotalValue(item).toFixed(2) }}</td>
            <td>{{ getCostPerformance(item).toFixed(2) }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShopItem } from '@/custom/core/shops';
import { shops } from '@/custom/core/shops';
import { getItemName, getItemValue } from '@/shared/utils/gameData/item';

function getTotalValue(shopItem: ShopItem): number {
  return getItemValue(shopItem.itemId) * shopItem.quantityPerGroup;
}

function getCostPerformance(item: ShopItem): number {
  return getTotalValue(item) / item.currentPrice;
}

definePageMeta({
  layout: 'default',
});
</script>

<style scoped>
.shop-value-page {
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
</style>
