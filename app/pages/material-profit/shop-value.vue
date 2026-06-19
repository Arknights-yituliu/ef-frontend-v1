<template>
  <v-container>
    <header class="page-title">{{ $t('page.materialProfit.shopValue.title') }}</header>
    <p class="page-description shop-value-note">
      数值按理智 / 代币折算，信用按 100
      信用点计算；不同商店不可直接跨店对比，颜色仅用于辅助展示性价比。
    </p>

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
          表格视图
        </v-btn>
        <v-btn value="cards">
          <v-icon start>mdi-view-grid</v-icon>
          卡片视图
        </v-btn>
      </v-btn-toggle>
    </section>

    <section v-for="shop in shops" :key="shop.shopId" class="mb-4">
      <h2 class="page-sub-title shop-section-title">
        <button
          v-if="shop.titleIconUrl"
          :aria-label="`连续点击 5 次重置 ${shop.shopName} 的售罄状态`"
          class="shop-section-title-icon-button"
          type="button"
          @click.stop="handleShopTitleIconClick(shop.shopId)"
        >
          <img
            alt=""
            aria-hidden="true"
            class="shop-section-title-icon"
            loading="lazy"
            :src="shop.titleIconUrl"
          />
        </button>
        <span>{{ shop.shopName }}</span>
      </h2>
      <v-card v-if="viewMode === 'table'">
        <v-data-table
          class="mb-4"
          :headers="headers"
          :hover="true"
          :items="getTableItems(shop.shopItems, shop.shopId)"
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
            <div class="shop-price-cell">
              <img
                v-if="shop.titleIconUrl"
                alt=""
                aria-hidden="true"
                class="shop-price-icon"
                loading="lazy"
                :src="shop.titleIconUrl"
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
        <article
          v-for="item in getCardItems(shop.shopItems, shop.shopId)"
          :key="item.shopItemKey"
          :aria-pressed="item.canToggleSoldOut ? item.isSoldOut : undefined"
          class="shop-item-card"
          :class="{
            'shop-item-card--clickable': item.canToggleSoldOut,
            'shop-item-card--locked': !item.canToggleSoldOut,
            'shop-item-card--sold-out': item.isSoldOut,
          }"
          :role="item.canToggleSoldOut ? 'button' : undefined"
          :tabindex="item.canToggleSoldOut ? 0 : undefined"
          @click="handleShopCardClick(shop.shopId, item)"
          @keydown.enter.prevent="handleShopCardClick(shop.shopId, item)"
          @keydown.space.prevent="handleShopCardClick(shop.shopId, item)"
        >
          <div class="shop-item-card-top">
            <div v-if="item.stockLabel" class="shop-item-stock-panel">
              <span class="shop-item-stock-panel-line">{{ item.stockLabel }}</span>
              <span class="shop-item-stock-panel-line">
                每组价值 {{ formatCompactNumber(item.totalValue, 1) }}
              </span>
            </div>
            <div v-if="item.discountLabel" class="shop-item-discount-badge">
              {{ item.discountLabel }}
            </div>
          </div>

          <div class="shop-item-card-media">
            <div class="shop-item-card-icon">
              <img
                v-if="item.iconUrl"
                :alt="item.itemName"
                class="shop-item-card-image"
                loading="lazy"
                :src="item.iconUrl"
              />
            </div>
            <div class="shop-item-card-quantity-badge">
              ×{{ formatCompactNumber(item.quantityPerGroup) }}
            </div>
          </div>

          <div class="shop-item-card-body">
            <div class="shop-item-card-score-row">
              <div
                class="shop-performance-badge shop-performance-badge--card"
                :style="getCostPerformanceBadgeStyle(item.costPerformance, shop.shopId)"
              >
                <span class="shop-performance-badge-value">
                  {{ formatCostPerformanceDisplay(item.costPerformance) }}
                </span>
              </div>
              <div class="shop-item-card-price-row">
                <div class="shop-item-card-price-current">
                  <img
                    v-if="shop.titleIconUrl"
                    alt=""
                    aria-hidden="true"
                    class="shop-price-icon"
                    loading="lazy"
                    :src="shop.titleIconUrl"
                  />
                  {{ formatCompactNumber(item.currentPrice) }}
                </div>
                <div v-if="item.originalPriceLabel" class="shop-item-card-price-original">
                  {{ item.originalPriceLabel }}
                </div>
              </div>
            </div>
          </div>

          <div class="shop-item-card-name">
            {{ item.itemName }}
          </div>
        </article>
      </div>
    </section>
  </v-container>
</template>

<script lang="ts" setup>
import type { ShopItem } from '@/custom/core/shops';
import { numberRound } from '#shared/utils/numberUtil';
import { shops as allShops } from '@/custom/core/shops';
import { getItemIconUrl, getItemName, getItemValue } from '@/shared/utils/gameData/item';

const shopTitleIconUrls = {
  危机合约·机密圣所:
    'https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_activity_contract_gold_0.png',
  保障配额交易:
    'https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_gachabyproducts_charticket.png',
  集成配额交易:
    'https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_gachabyproducts_weaponticket.png',
  信用交易所:
    'https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_spaceship_credit_shadow.png',
} as const;

const costPerformanceThemeColors = [
  'rgb(255, 184, 0)',
  'rgb(146, 79, 250)',
  'rgb(43, 188, 252)',
  'rgb(166, 204, 51)',
] as const;

const costPerformanceScaleByShopId = {
  危机合约·机密圣所: { threshold: 1, step: 0.25 },
  保障配额交易: { threshold: 3, step: 0.5 },
  集成配额交易: { threshold: 1.5, step: 0.5 },
  信用交易所: { threshold: 3.5, step: 0.5 },
} as const;

const { t } = useI18n();
const viewMode = ref<'table' | 'cards'>('table');

const hiddenShopIds = new Set(['四号谷地物资调度 − 稳定需求物资', '武陵物资调度 − 稳定需求物资']);

interface TableItem {
  itemId: string;
  itemName: string;
  quantityPerGroup: number;
  currentPrice: number;
  iconUrl?: string;
  originalPrice?: number;
  discount?: number;
  stockGroups?: number;
  stockLabel?: string;
  discountLabel?: string;
  originalPriceLabel?: string;
  totalValue: number;
  costPerformance: number;
}

interface CardItem extends TableItem {
  shopItemKey: string;
  canToggleSoldOut: boolean;
  isSoldOut: boolean;
}

interface ShopView {
  shopId: string;
  shopName: string;
  shopItems: ShopItem[];
  titleIconUrl?: string;
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

const shops = computed<ShopView[]>(() =>
  allShops
    .filter((shop) => !hiddenShopIds.has(shop.shopId))
    .map((shop) => ({
      ...shop,
      titleIconUrl: getShopTitleIconUrl(shop.shopId),
    })),
);

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

function getShopTitleIconUrl(shopId: string): string | undefined {
  return shopTitleIconUrls[shopId as keyof typeof shopTitleIconUrls];
}

function getTableItems(shopItems: ShopItem[], shopId: string): TableItem[] {
  return shopItems.map((item) => createTableItem(item, shopId));
}

function getCardItems(shopItems: ShopItem[], shopId: string): CardItem[] {
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

function createTableItem(item: ShopItem, shopId: string): TableItem {
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
  return shopId === '信用交易所' ? 100 : 1;
}

function getCostPerformanceScale(shopId: string): { threshold: number; step: number } {
  return (
    costPerformanceScaleByShopId[shopId as keyof typeof costPerformanceScaleByShopId] ?? {
      threshold: 3,
      step: 0.5,
    }
  );
}

function getCostPerformanceTierIndex(costPerformance: number, shopId: string): number {
  if (!Number.isFinite(costPerformance)) {
    return costPerformanceThemeColors.length - 1;
  }

  const { threshold, step } = getCostPerformanceScale(shopId);
  const difference = threshold - costPerformance;
  if (difference <= 0) {
    return 0;
  }

  return Math.min(Math.ceil(difference / step), costPerformanceThemeColors.length - 1);
}

function getCostPerformanceColor(costPerformance: number, shopId: string): string {
  return costPerformanceThemeColors[getCostPerformanceTierIndex(costPerformance, shopId)];
}

function getCostPerformanceBadgeStyle(
  costPerformance: number,
  shopId: string,
): Record<string, string> {
  const color = getCostPerformanceColor(costPerformance, shopId);

  return {
    backgroundColor: 'transparent',
    backgroundImage: `linear-gradient(90deg, ${color} 0%, ${color} 64%, rgba(255, 255, 255, 0) 100%)`,
  };
}

function formatCostPerformanceDisplay(value: number): string {
  return numberRound(value, 2).toFixed(2);
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

function toggleShopItemSoldOut(shopId: string, item: CardItem): void {
  if (!item.canToggleSoldOut) {
    return;
  }

  const currentKeys = soldOutItemKeysByShop.value[shopId] ?? [];
  const nextKeys = currentKeys.includes(item.shopItemKey)
    ? currentKeys.filter((key) => key !== item.shopItemKey)
    : [...currentKeys, item.shopItemKey];

  updateShopSoldOutItemKeys(shopId, nextKeys);
}

function handleShopCardClick(shopId: string, item: CardItem): void {
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
    return '常驻';
  }

  return `库存 ${stockGroups}`;
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

  return formatCompactNumber(originalPrice);
}

function formatCompactNumber(value: number, fractionDigits = 0): string {
  if (Math.abs(value) >= 10_000) {
    const compact = numberRound(value / 10_000, fractionDigits);
    return `${compact.toFixed(fractionDigits)}万`;
  }

  return fractionDigits > 0
    ? numberRound(value, fractionDigits).toFixed(fractionDigits)
    : `${numberRound(value, 0)}`;
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

.shop-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10.5rem, 1fr));
  max-width: calc((10.5rem * 7) + (var(--spacing-sm) * 6));
  gap: var(--spacing-sm);
}

.shop-item-card {
  position: relative;
  overflow: hidden;
  height: 14.9rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--theme-border);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 24%),
    linear-gradient(135deg, var(--theme-bg-secondary), var(--theme-bg-tertiary));
  box-shadow: 0 0.5rem 1.25rem var(--theme-shadow-base);
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    border-color 0.16s ease,
    filter 0.16s ease;
  user-select: none;
  display: grid;
  grid-template-rows: 2.1rem 5.55rem 4.45rem 2.45rem;
}

.shop-item-card--clickable {
  cursor: pointer;
}

.shop-item-card--locked {
  cursor: default;
}

.shop-item-card--sold-out {
  transform: translateY(0.14rem);
  border-color: color-mix(in srgb, var(--theme-border) 70%, #b0b0b0);
  box-shadow: 0 0.2rem 0.55rem rgba(0, 0, 0, 0.12);
}

.shop-item-card--sold-out::after {
  content: '售罄';
  position: absolute;
  left: 0;
  top: 22%;
  width: 100%;
  height: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(138, 138, 138, 0.96), rgba(104, 104, 104, 0.96));
  color: #fff;
  font-size: 1.12rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-shadow: 0 0.1rem 0.22rem rgba(0, 0, 0, 0.45);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.14),
    0 0.18rem 0.35rem rgba(0, 0, 0, 0.18);
  pointer-events: none;
  z-index: 2;
}

.shop-item-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    -45deg,
    transparent,
    transparent 13.9512529279%,
    var(--theme-decorative-overlay-light) 0,
    var(--theme-decorative-overlay-light) 36.0487470721%,
    transparent 0,
    transparent 63.9512529279%,
    var(--theme-decorative-overlay-light) 0,
    var(--theme-decorative-overlay-light) 86.0487470721%,
    transparent 0,
    transparent
  );
  background-size: 0.5rem 0.5rem;
  opacity: 0.14;
  pointer-events: none;
}

.shop-item-card-top,
.shop-item-card-media,
.shop-item-card-body,
.shop-item-card-name {
  position: relative;
  z-index: 1;
}

.shop-item-card-top {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 2.1rem;
  padding: 0.15rem var(--spacing-sm) 0;
}

.shop-item-stock-panel,
.shop-item-discount-badge {
  border-radius: var(--radius-sm);
  padding: 0.2rem 0.45rem;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.05;
}

.shop-item-stock-panel {
  position: absolute;
  left: var(--spacing-sm);
  top: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.08rem;
  color: var(--theme-text-secondary);
  background-color: color-mix(in srgb, var(--theme-bg-primary) 72%, transparent);
  opacity: 1;
}

.shop-item-stock-panel-line {
  white-space: nowrap;
}

.shop-item-discount-badge {
  color: #3f2a00;
  background: linear-gradient(135deg, #ffd54d, #ffb300);
}

.shop-item-card-media {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5.55rem;
  padding: 0.1rem var(--spacing-sm) 0.35rem;
  transform: translateY(0.5rem);
}

.shop-item-card-icon {
  width: min(6.5rem, 100%);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shop-item-card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 0.35rem 0.55rem rgba(0, 0, 0, 0.35));
  transform: scale(1.2);
  transform-origin: center center;
}

.shop-item-card-quantity-badge {
  position: absolute;
  left: 50%;
  bottom: 0.35rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 1.2rem;
  padding: 0 0.45rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  color: #555;
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1;
  box-shadow: 0 0.12rem 0.3rem rgba(0, 0, 0, 0.18);
  transform: translateX(-50%);
}

.shop-item-card-body {
  height: 4.45rem;
  padding: 0 0.45rem var(--spacing-xs, 0.3rem) 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.12rem;
}

.shop-item-card-score-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  min-height: 2.2rem;
}

.shop-performance-badge--card {
  flex: 0 0 50%;
  width: 50%;
  height: 2.2rem;
  border-radius: 0;
  box-shadow: none;
  font-size: 1.35rem;
  font-weight: 600;
  letter-spacing: 0;
  text-shadow: none;
}

.shop-item-card-price-row {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 0.05rem;
  min-width: 4.5rem;
}

.shop-item-card-price-current {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: clamp(1rem, 1.45vw, 1.22rem);
  font-weight: 800;
  line-height: 1;
  color: var(--theme-text-primary);
}

.shop-item-card-price-original {
  font-size: 0.72rem;
  line-height: 1;
  color: var(--theme-text-secondary);
  text-decoration: line-through;
}

.shop-item-card-name {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.45rem;
  padding: 0 0.5rem;
  text-align: center;
  font-weight: 700;
  line-height: 1.1;
  color: #fff;
  background: linear-gradient(180deg, rgba(58, 58, 58, 0.95), rgba(42, 42, 42, 0.98));
  border-top: 0.2rem solid #ffb300;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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

  .shop-item-card {
    height: 14.1rem;
    grid-template-rows: 1.9rem 4.8rem 4.25rem 2.45rem;
  }

  .shop-item-card-top {
    height: 1.9rem;
    padding-top: 0.1rem;
  }

  .shop-item-card-media {
    padding: 0.08rem var(--spacing-sm) 0.25rem;
    height: 4.8rem;
  }

  .shop-item-card-icon {
    width: min(5rem, 100%);
  }

  .shop-item-card-body {
    height: 4.25rem;
  }

  .shop-performance-badge--card {
    height: 1.9rem;
    font-size: 1.12rem;
  }

  .shop-item-card-price-current {
    font-size: 0.95rem;
  }

  .shop-item-stock-panel {
    font-size: 0.66rem;
  }

  .shop-item-card--sold-out::after {
    font-size: 1rem;
    letter-spacing: 0.1em;
  }
}
</style>
