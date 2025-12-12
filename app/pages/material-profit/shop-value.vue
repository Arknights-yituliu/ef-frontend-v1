<template>
  <div class="page-container">
    <h1 class="page-title">{{ $t('page.materialProfit.shopValue.title') }}</h1>
<!--    <p class="page-description">{{ $t('page.materialProfit.shopValue.description') }}</p>-->

    <div v-for="shop in shops" :key="shop.shopId" class="shop-section">
      <h2 class="shop-title">{{ shop.shopName }}</h2>
      <v-data-table
        :headers="headers"
        :items="getTableItems(shop.shopItems)"
        :hover="true"
        :items-per-page="25"
        class="shop-table"
      >
        <template #item.itemName="{ item }">
          {{ item.itemName }}
        </template>
        <template #item.quantityPerGroup="{ item }">
          {{ item.quantityPerGroup }}
        </template>
        <template #item.currentPrice="{ item }">
          {{ item.currentPrice }}
        </template>
        <template #item.totalValue="{ item }">
          {{ item.totalValue.toFixed(2) }}
        </template>
        <template #item.costPerformance="{ item }">
          {{ item.costPerformance.toFixed(4) }}
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShopItem } from '@/custom/core/shops';
import { shops } from '@/custom/core/shops';
import { getItemName, getItemValue } from '@/shared/utils/gameData/item';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface TableItem {
  itemId: string;
  itemName: string;
  quantityPerGroup: number;
  currentPrice: number;
  totalValue: number;
  costPerformance: number;
}

const headers = computed(() => [
  {
    title: t('page.materialProfit.shopValue.itemName'),
    key: 'itemName',
    sortable: true,
  },
  {
    title: t('page.materialProfit.shopValue.quantityPerGroup'),
    key: 'quantityPerGroup',
    sortable: true,
  },
  {
    title: t('page.materialProfit.shopValue.currentPrice'),
    key: 'currentPrice',
    sortable: true,
  },
  {
    title: t('page.materialProfit.shopValue.totalValue'),
    key: 'totalValue',
    sortable: true,
  },
  {
    title: t('page.materialProfit.shopValue.costPerformance'),
    key: 'costPerformance',
    sortable: true,
  },
]);

function getTotalValue(shopItem: ShopItem): number {
  return getItemValue(shopItem.itemId) * shopItem.quantityPerGroup;
}

function getCostPerformance(item: ShopItem): number {
  return getTotalValue(item) / item.currentPrice;
}

function getTableItems(shopItems: ShopItem[]): TableItem[] {
  return shopItems.map((item) => ({
    itemId: item.itemId,
    itemName: getItemName(item.itemId),
    quantityPerGroup: item.quantityPerGroup,
    currentPrice: item.currentPrice,
    totalValue: getTotalValue(item),
    costPerformance: getCostPerformance(item),
  }));
}

definePageMeta({
  layout: 'default',
});

// SEO 配置
const siteName = computed(() => t('layout.siteName'))
const pageTitle = computed(() => `${t('page.materialProfit.shopValue.title')} - ${siteName.value}`)
const pageDescription = computed(() => t('page.materialProfit.shopValue.description'))

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  ogType: 'website',
  twitterCard: 'summary',
})

useHead({
  title: () => pageTitle.value
})
</script>

<style scoped>
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

.shop-section {
  margin-bottom: 2.5rem;
}

.shop-title {
  font-size: var(--font-size-lg);
  color: var(--theme-text-primary);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.shop-table {
  margin-bottom: 2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }

  .shop-title {
    font-size: var(--font-size-xl);
  }
}
</style>
