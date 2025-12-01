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
              {{ $t('page.materialProfit.shopValue.originalPrice') }}
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
            <td>{{ item.itemName || item.itemId }}</td>
            <td>{{ item.quantityPerGroup }}</td>
            <td>{{ item.originalPrice }}</td>
            <td>{{ getTotalValue(item).toFixed(2) }}</td>
            <td>{{ getCostPerformance(item).toFixed(2) }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shops } from '@/custom/core/shops';
import { itemInfo } from '@/custom/core/itemInfo';

type ShopItem = (typeof shops)[number]['shopItems'][number];

function getTotalValue(shopItem: ShopItem): number {
  const itemValue = itemInfo[shopItem.itemId]?.value ?? 0;
  return itemValue * shopItem.quantityPerGroup;
}

function getCostPerformance(item: ShopItem): number {
  const totalValue = getTotalValue(item);
  return totalValue / item.currentPrice;
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
