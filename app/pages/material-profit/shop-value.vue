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
        <img
          v-if="shop.titleIconUrl"
          :alt="shop.shopName"
          aria-hidden="true"
          class="shop-section-title-icon"
          loading="lazy"
          :src="shop.titleIconUrl"
        />
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
            <div class="shop-performance-cell shop-performance-cell--table">
              <div
                class="shop-performance-badge shop-performance-badge--table"
                :style="getCostPerformanceBadgeStyle(item.costPerformance, shop.shopId)"
              >
                <span class="shop-performance-badge-value">
                  {{ numberRound(item.costPerformance, 3) }}
                </span>
              </div>
            </div>
          </template>
        </v-data-table>
      </v-card>
      <div v-else class="shop-cards-grid">
        <article
          v-for="item in getTableItems(shop.shopItems, shop.shopId)"
          :key="getShopItemKey(item)"
          class="shop-item-card"
        >
          <div class="shop-item-card-top">
            <div v-if="item.stockLabel" class="shop-item-stock-badge">
              {{ item.stockLabel }}
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
              x{{ formatCompactNumber(item.quantityPerGroup) }}
            </div>
          </div>

          <div class="shop-item-card-body">
            <div class="shop-item-card-score">
              <div
                class="shop-performance-badge shop-performance-badge--card"
                :style="getCostPerformanceBadgeStyle(item.costPerformance, shop.shopId)"
              >
                <span class="shop-performance-badge-value">
                  {{ numberRound(item.costPerformance, 3) }}
                </span>
              </div>
            </div>

            <div class="shop-item-card-meta">
              <span>总价值 {{ formatCompactNumber(item.totalValue) }}</span>
              <span>性价比 {{ numberRound(item.costPerformance, 3) }}</span>
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

const costPerformanceThresholdByShopId = {
  危机合约·机密圣所: 3.5,
  保障配额交易: 3,
  集成配额交易: 1.5,
  信用交易所: 3.5,
} as const;

const costPerformanceStep = 0.5;

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
  return shopItems.map((item) => ({
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
  }));
}

function getCostPerformanceMultiplier(shopId: string): number {
  return shopId === '信用交易所' ? 100 : 1;
}

function getCostPerformanceThreshold(shopId: string): number {
  return (
    costPerformanceThresholdByShopId[shopId as keyof typeof costPerformanceThresholdByShopId] ?? 3
  );
}

function getCostPerformanceTierIndex(costPerformance: number, shopId: string): number {
  if (!Number.isFinite(costPerformance)) {
    return costPerformanceThemeColors.length - 1;
  }

  const threshold = getCostPerformanceThreshold(shopId);
  if (costPerformance >= threshold) {
    return 0;
  }

  if (costPerformance >= threshold - costPerformanceStep) {
    return 1;
  }

  if (costPerformance >= threshold - costPerformanceStep * 2) {
    return 2;
  }

  return 3;
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
    '--cost-performance-color': color,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    backgroundImage: `linear-gradient(90deg, ${color} 0%, ${color} 66%, rgba(255, 255, 255, 0.08) 100%)`,
  };
}

function getShopItemKey(item: TableItem): string {
  return [item.itemId, item.currentPrice, item.quantityPerGroup, item.stockGroups ?? 'na'].join(
    '-',
  );
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

function formatCompactNumber(value: number): string {
  if (Math.abs(value) >= 10_000) {
    const compact = numberRound(value / 10_000, value >= 100_000 ? 0 : 1);
    return `${compact}万`;
  }

  return `${numberRound(value, 0)}`;
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
  justify-content: flex-end;
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

.shop-performance-cell {
  width: 100%;
  min-width: 8.75rem;
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

.shop-performance-badge--table {
  height: 2.1rem;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0;
}

.shop-performance-badge--card {
  height: 2.3rem;
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: 0;
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

.shop-section-title-icon {
  width: 2.9rem;
  height: 2.9rem;
  flex: 0 0 2.9rem;
  object-fit: contain;
}

.shop-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11.5rem, 1fr));
  gap: var(--spacing-sm);
}

.shop-item-card {
  position: relative;
  overflow: hidden;
  height: 15.9rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--theme-border);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 24%),
    linear-gradient(135deg, var(--theme-bg-secondary), var(--theme-bg-tertiary));
  box-shadow: 0 0.5rem 1.25rem var(--theme-shadow-base);
  display: grid;
  grid-template-rows: 1.5rem 6rem 5.7rem 2.7rem;
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
  height: 1.5rem;
  padding: 0 var(--spacing-sm);
}

.shop-item-stock-badge,
.shop-item-discount-badge {
  border-radius: var(--radius-sm);
  padding: 0.15rem 0.45rem;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;
}

.shop-item-stock-badge {
  position: absolute;
  left: var(--spacing-sm);
  top: 50%;
  color: var(--theme-text-primary);
  background-color: color-mix(in srgb, var(--theme-bg-primary) 72%, transparent);
  border: 1px solid var(--theme-border);
  opacity: 1;
  transform: translateY(-50%);
}

@media (hover: hover) and (pointer: fine) {
  .shop-item-stock-badge {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-50%) translateY(-0.15rem);
    transition:
      opacity 0.16s ease,
      transform 0.16s ease,
      visibility 0s linear 0.16s;
  }

  .shop-item-card:hover .shop-item-stock-badge,
  .shop-item-card:focus-within .shop-item-stock-badge {
    opacity: 1;
    visibility: visible;
    transform: translateY(-50%);
    transition-delay: 0s;
  }
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
  height: 6rem;
  padding: 0.15rem var(--spacing-sm) 0.45rem;
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
}

.shop-item-card-quantity-badge {
  position: absolute;
  left: 0.35rem;
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
}

.shop-item-card-body {
  height: 5.7rem;
  padding: 0 var(--spacing-sm) var(--spacing-xs, 0.3rem);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.2rem;
}

.shop-item-card-score {
  min-height: 2.3rem;
}

.shop-item-card-price-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 1.8rem;
  margin-top: auto;
}

.shop-item-card-price-current {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: clamp(1.08rem, 1.7vw, 1.42rem);
  font-weight: 800;
  line-height: 1;
  color: var(--theme-text-primary);
}

.shop-item-card-price-original {
  font-size: 0.75rem;
  line-height: 1;
  color: var(--theme-text-secondary);
  text-decoration: line-through;
}

.shop-item-card-meta {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.25rem 0.5rem;
  min-height: 1.35rem;
  font-size: 0.72rem;
  color: var(--theme-text-secondary);
  overflow: hidden;
}

.shop-item-card-meta span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.shop-item-card-name {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.7rem;
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
    grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
  }

  .shop-item-card {
    height: 13.9rem;
    grid-template-rows: 1.45rem 5.15rem 4.95rem 2.95rem;
  }

  .shop-item-card-media {
    padding: 0.1rem var(--spacing-sm) 0.35rem;
    height: 5.15rem;
  }

  .shop-item-card-icon {
    width: min(5.1rem, 100%);
  }

  .shop-item-card-body {
    height: 4.95rem;
  }

  .shop-performance-badge--card {
    height: 2.05rem;
    font-size: 1.2rem;
  }
}
</style>
