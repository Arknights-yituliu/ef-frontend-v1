<template>
  <v-container>
    <header class="page-title">{{ $t('page.materialProfit.shopValue.title') }}</header>
    <p class="page-description shop-value-note">{{ $t('page.materialProfit.shopValue.note') }}</p>

    <section class="view-switch-section">
      <v-btn-toggle
        v-model="viewMode"
        color="primary"
        density="comfortable"
        divided
        mandatory
        variant="outlined"
      >
        <v-btn value="table">
          <v-icon start>mdi-table</v-icon>
          {{ $t('page.materialProfit.shopValue.tableView') }}
        </v-btn>
        <v-btn value="cards">
          <v-icon start>mdi-view-grid</v-icon>
          {{ $t('page.materialProfit.shopValue.cardView') }}
        </v-btn>
      </v-btn-toggle>
    </section>

    <section v-for="section in shopSections" :key="section.shopId" class="mb-4">
      <h2 class="page-sub-title shop-section-title">
        <button
          v-if="section.currencyIconUrl"
          :aria-label="t('page.materialProfit.shopValue.resetSoldOutHint', { name: section.name })"
          class="shop-section-title-icon-button"
          type="button"
          @click.stop="handleShopTitleIconClick(section.shopId)"
        >
          <img
            alt=""
            aria-hidden="true"
            class="shop-section-title-icon"
            loading="lazy"
            :src="section.currencyIconUrl"
          />
        </button>
        <span>{{ section.name }}</span>
      </h2>
      <div v-if="section.totalPrice !== undefined" class="shop-total-price">
        <span class="shop-total-price-label">{{
          $t('page.materialProfit.shopValue.totalPrice')
        }}</span>
        <span class="shop-total-price-value">
          <img
            v-if="section.currencyIconUrl"
            alt=""
            aria-hidden="true"
            class="shop-total-price-icon"
            loading="lazy"
            :src="section.currencyIconUrl"
          />
          {{ section.totalPrice }}
        </span>
      </div>
      <v-card v-if="viewMode === 'table'">
        <v-data-table
          class="mb-4"
          :headers="headers"
          :hover="true"
          :items="section.tableItems"
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
          <template #item.stockGroups="{ item }">
            {{ formatStockCount(item.stockGroups) }}
          </template>
          <template #item.currentPrice="{ item }">
            <div class="shop-price-cell">
              <img
                v-if="section.currencyIconUrl"
                alt=""
                aria-hidden="true"
                class="shop-price-icon"
                loading="lazy"
                :src="section.currencyIconUrl"
              />
              <span>{{ item.currentPrice }}</span>
            </div>
          </template>
          <template #item.totalValue="{ item }">
            {{ numberRound(item.totalValue, 2) }}
          </template>
          <template #item.costPerformance="{ item }">
            {{ numberRound(item.costPerformance, 4) }}
          </template>
        </v-data-table>
      </v-card>
      <div v-else class="shop-cards-grid">
        <ContainerShopItemCard
          v-for="item in section.cardItems"
          :key="item.shopItemKey"
          :currency-icon-url="section.currencyIconUrl"
          :item="item"
          :shop-id="section.shopId"
          @toggle-sold-out="handleShopCardClick(section.shopId, item)"
        />
      </div>
    </section>
  </v-container>
</template>

<script lang="ts" setup>
import type { Shop, ShopCardItem, ShopItem, ShopTableItem } from '#shared/types/shop';
import { getLocalizedText } from '#shared/utils/i18nUtil';
import { numberCompact, numberRound } from '#shared/utils/numberUtil';
import { shops as allShops } from '@/custom/core/shops';
import { getItemIconUrl, getItemName, getItemValue } from '@/shared/utils/gameData/item';

const { locale, t } = useI18n();
const viewMode = ref<'table' | 'cards'>('table');

/** 页面渲染用的商店视图数据：名称、货币图标与商品行都在这里一次性算好 */
interface ShopSection {
  shopId: string;
  name: string;
  currencyIconUrl?: string;
  tableItems: ShopTableItem[];
  cardItems: ShopCardItem[];
  /** 仅「总价」商店有值 */
  totalPrice?: number;
}

/** 展示「总价」的商店（活动商店，无限库存商品不计入） */
const shopIdsWithTotalPrice = new Set<string>(['shop_inn_management_3']);

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
    title: t('page.materialProfit.shopValue.stock'),
    key: 'stockGroups',
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

const shopSections = computed<ShopSection[]>(() => allShops.map((shop) => createShopSection(shop)));

const soldOutItemKeysByShop = ref<Record<string, string[]>>({});
const shopTitleIconClickCounts = ref<Record<string, number>>({});
const shopTitleIconClickResetTimers = new Map<string, ReturnType<typeof setTimeout>>();

onMounted(() => {
  loadSoldOutItemKeysFromStorage();
});

onBeforeUnmount(() => {
  for (const timerId of shopTitleIconClickResetTimers.values()) {
    clearTimeout(timerId);
  }
  shopTitleIconClickResetTimers.clear();
});

function getTotalValue(shopItem: ShopItem): number {
  return getItemValue(shopItem.itemId) * shopItem.quantityPerGroup;
}

function getCostPerformance(item: ShopItem, shopId: string): number {
  return (getTotalValue(item) / item.currentPrice) * getCostPerformanceMultiplier(shopId);
}

function createShopSection(shop: Shop): ShopSection {
  const shopId = shop.shopId;

  return {
    shopId,
    name: getLocalizedText(shop.shopName, locale.value),
    currencyIconUrl: getCurrencyIconUrl(shop.currencyItemId),
    tableItems: shop.shopItems.map((item) => createTableItem(item, shopId)),
    cardItems: createCardItems(shop.shopItems, shopId),
    totalPrice: getShopTotalPrice(shop),
  };
}

function getCurrencyIconUrl(currencyItemId?: string): string | undefined {
  if (!currencyItemId) {
    return undefined;
  }

  return `https://data.akedata.wiki/public/images/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/${currencyItemId}.png`;
}

function createCardItems(shopItems: ShopItem[], shopId: string): ShopCardItem[] {
  return shopItems
    .map((item, index) => {
      const tableItem = createTableItem(item, shopId);
      const shopItemKey = getShopItemKey(item, index);
      const canToggleSoldOut = Number.isFinite(item.stockGroups);

      return {
        ...tableItem,
        shopItemKey,
        canToggleSoldOut,
        isSoldOut: canToggleSoldOut && isShopItemSoldOut(shopId, shopItemKey),
      };
    })
    .toSorted((left, right) => Number(left.isSoldOut) - Number(right.isSoldOut));
}

/** 未售罄商品的总价，仅对需要展示总价的商店计算，无限库存商品不计入 */
function getShopTotalPrice(shop: Shop): number | undefined {
  if (!shopIdsWithTotalPrice.has(shop.shopId)) {
    return undefined;
  }

  const totalPrice = shop.shopItems.reduce((total, item, index) => {
    if (!Number.isFinite(item.stockGroups)) {
      return total;
    }

    if (isShopItemSoldOut(shop.shopId, getShopItemKey(item, index))) {
      return total;
    }

    return total + item.currentPrice * item.stockGroups!;
  }, 0);

  return Math.round(totalPrice);
}

function createTableItem(item: ShopItem, shopId: string): ShopTableItem {
  return {
    itemId: item.itemId,
    itemName: getItemName(item.itemId),
    quantityPerGroup: item.quantityPerGroup,
    currentPrice: item.currentPrice,
    iconUrl: getItemIconUrl(item.itemId),
    originalPrice: item.originalPrice,
    discount: item.discount,
    stockGroups: item.stockGroups,
    stockLabel: formatStockLabel(item.stockGroups),
    discountLabel: formatDiscountLabel(item.discount),
    originalPriceLabel: formatOriginalPriceLabel(item.originalPrice, item.discount),
    totalValue: getTotalValue(item),
    costPerformance: getCostPerformance(item, shopId),
  };
}

function getCostPerformanceMultiplier(shopId: string): number {
  if (
    shopId === 'shop_spaceship_1' ||
    shopId === 'domainshop_page_com_map01' ||
    shopId === 'domainshop_page_com_map02' ||
    shopId === 'shop_inn_management_3'
  ) {
    return 100;
  }

  return 1;
}

function getShopItemKey(
  item: Pick<ShopItem, 'itemId' | 'currentPrice' | 'quantityPerGroup' | 'stockGroups'>,
  index?: number,
): string {
  return [
    item.itemId,
    item.currentPrice,
    item.quantityPerGroup,
    item.stockGroups ?? 'na',
    index ?? 'na',
  ].join('-');
}

function getShopSoldOutStorageKey(shopId: string): string {
  return `material-profit-shop-value:sold-out:${encodeURIComponent(shopId)}`;
}

function isShopItemSoldOut(shopId: string, shopItemKey: string): boolean {
  return soldOutItemKeysByShop.value[shopId]?.includes(shopItemKey) ?? false;
}

function updateShopSoldOutItemKeys(shopId: string, nextKeys: string[]): void {
  const nextState =
    nextKeys.length > 0
      ? {
          ...soldOutItemKeysByShop.value,
          [shopId]: nextKeys,
        }
      : omitShopSoldOutItemKeys(shopId);

  soldOutItemKeysByShop.value = nextState;
  persistShopSoldOutItemKeys(shopId);
}

function toggleShopItemSoldOut(shopId: string, item: ShopCardItem): void {
  if (!item.canToggleSoldOut) {
    return;
  }

  const currentKeys = soldOutItemKeysByShop.value[shopId] ?? [];
  const nextKeys = currentKeys.includes(item.shopItemKey)
    ? currentKeys.filter((key) => key !== item.shopItemKey)
    : [...currentKeys, item.shopItemKey];

  updateShopSoldOutItemKeys(shopId, nextKeys);
}

function handleShopCardClick(shopId: string, item: ShopCardItem): void {
  toggleShopItemSoldOut(shopId, item);
}

function handleShopTitleIconClick(shopId: string): void {
  const nextCount = (shopTitleIconClickCounts.value[shopId] ?? 0) + 1;

  if (nextCount >= 5) {
    clearShopTitleIconClickTimer(shopId);
    shopTitleIconClickCounts.value = {
      ...shopTitleIconClickCounts.value,
      [shopId]: 0,
    };
    resetShopSoldOutState(shopId);
    return;
  }

  shopTitleIconClickCounts.value = {
    ...shopTitleIconClickCounts.value,
    [shopId]: nextCount,
  };

  clearShopTitleIconClickTimer(shopId);
  const timerId = setTimeout(() => {
    shopTitleIconClickCounts.value = {
      ...shopTitleIconClickCounts.value,
      [shopId]: 0,
    };
    shopTitleIconClickResetTimers.delete(shopId);
  }, 1200);
  shopTitleIconClickResetTimers.set(shopId, timerId);
}

function clearShopTitleIconClickTimer(shopId: string): void {
  const timerId = shopTitleIconClickResetTimers.get(shopId);
  if (timerId !== undefined) {
    clearTimeout(timerId);
    shopTitleIconClickResetTimers.delete(shopId);
  }
}

function resetShopSoldOutState(shopId: string): void {
  updateShopSoldOutItemKeys(shopId, []);
}

function omitShopSoldOutItemKeys(shopId: string): Record<string, string[]> {
  const { [shopId]: _removedShopSoldOutItemKeys, ...rest } = soldOutItemKeysByShop.value;
  return rest;
}

function persistShopSoldOutItemKeys(shopId: string): void {
  if (!import.meta.client) {
    return;
  }

  const storageKey = getShopSoldOutStorageKey(shopId);
  const keys = soldOutItemKeysByShop.value[shopId] ?? [];

  if (keys.length === 0) {
    localStorage.removeItem(storageKey);
    return;
  }

  localStorage.setItem(storageKey, JSON.stringify(keys));
}

function loadSoldOutItemKeysFromStorage(): void {
  if (!import.meta.client) {
    return;
  }

  const nextState: Record<string, string[]> = {};

  for (const shop of allShops) {
    const savedValue = localStorage.getItem(getShopSoldOutStorageKey(shop.shopId));
    if (!savedValue) {
      continue;
    }

    try {
      const parsedValue: unknown = JSON.parse(savedValue);
      if (!Array.isArray(parsedValue)) {
        continue;
      }

      const filteredKeys = parsedValue.filter(
        (value): value is string => typeof value === 'string',
      );
      if (filteredKeys.length > 0) {
        nextState[shop.shopId] = filteredKeys;
      }
    } catch {
      // 忽略损坏的本地缓存。
    }
  }

  soldOutItemKeysByShop.value = nextState;
}

function formatStockLabel(stockGroups?: number): string | undefined {
  if (stockGroups === undefined) {
    return undefined;
  }

  if (!Number.isFinite(stockGroups)) {
    return t('page.materialProfit.shopValue.stockInfinite');
  }

  return t('page.materialProfit.shopValue.stockCount', { count: stockGroups });
}

function formatStockCount(stockGroups?: number): string {
  if (stockGroups === undefined) {
    return '';
  }

  if (!Number.isFinite(stockGroups)) {
    return '∞';
  }

  return `${stockGroups}`;
}

function formatDiscountLabel(discount?: number): string | undefined {
  if (discount === undefined || discount >= 0) {
    return undefined;
  }

  return `${Math.round(discount * 100)}%`;
}

function formatOriginalPriceLabel(originalPrice?: number, discount?: number): string | undefined {
  if (originalPrice === undefined || discount === undefined || discount >= 0) {
    return undefined;
  }

  return numberCompact(originalPrice, locale.value);
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
.view-switch-section {
  display: flex;
  justify-content: flex-start;
  margin-bottom: var(--spacing-lg);
}

.shop-value-note {
  max-width: 72rem;
  margin-bottom: var(--spacing-md);
}

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

.shop-price-cell {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.shop-price-icon {
  width: 1.45rem;
  height: 1.45rem;
  flex: 0 0 1.45rem;
  object-fit: contain;
}

.shop-performance-badge {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  overflow: hidden;
  border-radius: 0.35rem;
  padding: 0 0.9rem;
  color: #fff;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0.08rem 0.16rem rgba(0, 0, 0, 0.28);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.1),
    0 0.08rem 0.3rem rgba(0, 0, 0, 0.14);
}

.shop-performance-badge-value {
  position: relative;
  z-index: 1;
  letter-spacing: 0;
}

.shop-section-title {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.shop-section-title-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.9rem;
  height: 2.9rem;
  flex: 0 0 2.9rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.shop-section-title-icon-button:focus-visible {
  outline: 2px solid var(--theme-accent-color);
  outline-offset: 2px;
}

.shop-section-title-icon {
  width: 2.9rem;
  height: 2.9rem;
  object-fit: contain;
}

.shop-total-price {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  color: var(--theme-text-secondary);
  font-variant-numeric: tabular-nums;
}

.shop-total-price-label {
  color: var(--theme-text-primary);
  font-weight: 600;
}

.shop-total-price-value {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--theme-text-primary);
  font-size: 1.1rem;
  font-weight: 700;
}

.shop-total-price-icon {
  width: 1.45rem;
  height: 1.45rem;
  flex: 0 0 1.45rem;
  object-fit: contain;
}

.shop-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10.5rem, 1fr));
  max-width: calc((10.5rem * 7) + (var(--spacing-sm) * 6));
  gap: var(--spacing-sm);
}

@media screen and (max-width: 600px) {
  .view-switch-section {
    justify-content: stretch;
  }

  .view-switch-section :deep(.v-btn-toggle) {
    width: 100%;
  }

  .view-switch-section :deep(.v-btn) {
    flex: 1 1 0;
  }

  .shop-cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(8.8rem, 1fr));
  }
}
</style>
