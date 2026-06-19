<template>
  <v-container>
    <header class="page-title">{{ $t('page.materialProfit.shopValue.title') }}</header>
    <!--    <p class="page-description">{{ $t('page.materialProfit.shopValue.description') }}</p>-->

    <section v-for="shop in shops" :key="shop.shopId" class="mb-4">
      <h2 class="page-sub-title">{{ shop.shopName }}</h2>
      <v-card>
        <v-data-table
          class="mb-4"
          :headers="headers"
          :hover="true"
          :items="getTableItems(shop.shopItems)"
          :items-per-page="25"
        >
          <template #item.itemName="{ item }">
            <div class="shop-item-name-cell">
              <div class="shop-item-icon-wrapper">
                <ContainerItemIcon :item-id="item.itemId" />
              </div>
              <span class="shop-item-name">{{ item.itemName }}</span>
            </div>
          </template>
          <template #item.quantityPerGroup="{ item }">
            {{ item.quantityPerGroup }}
          </template>
          <template #item.currentPrice="{ item }">
            {{ item.currentPrice }}
          </template>
          <template #item.totalValue="{ item }">
            {{ numberRound(item.totalValue, 2) }}
          </template>
          <template #item.costPerformance="{ item }">
            {{ numberRound(item.costPerformance, 4) }}
          </template>
        </v-data-table>
      </v-card>
    </section>
  </v-container>
</template>

<script lang="ts" setup>
import type { ShopItem } from '@/custom/core/shops';
import { numberRound } from '#shared/utils/numberUtil';
import { shops } from '@/custom/core/shops';
import { getItemName, getItemValue } from '@/shared/utils/gameData/item';

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

usePageSeo({
  title: () => `${t('page.materialProfit.shopValue.title')} - ${t('layout.siteName')}`,
  description: () => t('page.materialProfit.shopValue.description'),
});
</script>

<style scoped>
.shop-item-name-cell {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 12rem;
  padding: 0.25rem 0;
}

.shop-item-icon-wrapper {
  width: 2.75rem;
  height: 2.75rem;
  flex: 0 0 2.75rem;
}

.shop-item-name {
  color: var(--theme-text-primary);
  line-height: 1.25;
}
</style>
