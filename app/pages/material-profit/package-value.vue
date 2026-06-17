<template>
  <v-container
    class="package-value-page"
    :class="{
      'package-value-page-debug-green': devDebugGreenBackground,
      'package-value-page-debug-no-shadow': devDebugHideCardShadow,
    }"
  >
    <header class="page-title">{{ $t('page.materialProfit.packageValue.title') }}</header>
    <!--    <p class="page-description">{{ $t('page.materialProfit.packageValue.description') }}</p>-->

    <!-- 筛选区 -->
    <section class="filter-container">
      <v-text-field
        v-model="searchQuery"
        class="filter-search"
        density="compact"
        hide-details
        :placeholder="$t('page.materialProfit.packageValue.searchPlaceholder')"
        variant="outlined"
      />
      <div class="filter-sort">
        <span class="sort-label">{{ $t('page.materialProfit.packageValue.sortBy') }}:</span>
        <v-radio-group
          v-model="sortField"
          class="filter-radio-group"
          density="compact"
          hide-details
          inline
        >
          <v-radio
            density="compact"
            :label="$t('page.materialProfit.packageValue.sortDefault')"
            value="default"
          />
          <v-radio
            density="compact"
            :label="$t('page.materialProfit.packageValue.sortPrice')"
            value="price"
          />
          <v-radio
            density="compact"
            :label="$t('page.materialProfit.packageValue.sortGachaOnly')"
            value="gachaOnly"
          />
          <v-radio
            density="compact"
            :label="$t('page.materialProfit.packageValue.sortAllItems')"
            value="allItems"
          />
        </v-radio-group>
      </div>

      <v-btn
        class="sort-order-btn"
        density="compact"
        size="large"
        :title="
          sortOrder === 'asc'
            ? $t('page.materialProfit.packageValue.sortAsc')
            : $t('page.materialProfit.packageValue.sortDesc')
        "
        variant="outlined"
        @click="toggleSortOrder"
      >
        <span v-if="sortOrder === 'asc'"
          >↑ {{ $t('page.materialProfit.packageValue.sortAsc') }}</span
        >
        <span v-else>↓ {{ $t('page.materialProfit.packageValue.sortDesc') }}</span>
      </v-btn>
    </section>

    <section v-show="'dev' === currentMode" class="debug-panel">
      <div class="debug-panel-title">
        {{ $t('page.materialProfit.packageValue.devMode') }}
      </div>
      <div class="debug-switches">
        <v-switch
          v-model="devDebugHideCardShadow"
          color="primary"
          density="compact"
          hide-details
          :label="$t('page.materialProfit.packageValue.hideCardShadow')"
        />
        <v-switch
          v-model="devDebugGreenBackground"
          color="green"
          density="compact"
          hide-details
          :label="$t('page.materialProfit.packageValue.greenBackground')"
        />
      </div>
    </section>

    <!-- 礼包分类展示 -->
    <div v-if="displayGroups.length > 0">
      <div v-for="group in displayGroups" :key="group.groupId" class="group-section">
        <ModuleHeader
          :tips="[]"
          :title="group.displayName['zh-CN']"
          :title-en="group.displayName['en-US']"
        />

        <div v-for="shop in group.shops" :key="shop.shopId" class="shop-section">
          <h2
            class="category-title"
            :data-shop-id="shop.shopId"
            @click="triggerDevModeByShop(shop.shopId)"
          >
            {{ shop.displayName[locale as keyof LocalizedText] }}
          </h2>
          <TransitionGroup class="packs-container" name="list" tag="div">
            <ContainerPackCard
              v-for="packId in shop.goodsIds"
              :key="packId"
              v-bind="packs[packId]!"
            />
          </TransitionGroup>
        </div>
      </div>
    </div>

    <div v-else class="no-data">
      <p>{{ $t('common.noData') }}</p>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import type { LocalizedText } from '@/shared/types/pack';
import ModuleHeader from '@/app/components/layout/ModuleHeader.vue';
import { packGroups, packs, packShops } from '@/custom/core/packs';
import { getPackPullsEfficiency, getPackSanityEfficiency } from '@/shared/utils/gameData/pack';

// 全局数据引用-原始顺序（用于默认排序）
const defaultSorting: Map<string, number> = new Map(
  Object.keys(packs).map((packId, index) => [packId, index]),
);

const { locale, t } = useI18n();

// 筛选和排序状态
const searchQuery = ref('');
const sortField = ref<'default' | 'price' | 'gachaOnly' | 'allItems'>('default');
const sortOrder = ref<'asc' | 'desc'>('asc');
const route = useRoute();
const router = useRouter();
const currentMode = ref('normal');
const devModeTriggerClicks = ref(0);
const devModeTriggerThreshold = 8;
const devModeTriggerShopId = 'SP_weapon_supply';
const devDebugHideCardShadow = ref(false);
const devDebugGreenBackground = ref(false);

function syncCurrentModeFromRoute() {
  currentMode.value = route.query.mode === 'dev' ? 'dev' : 'normal';
  if (currentMode.value !== 'dev') {
    devModeTriggerClicks.value = 0;
  }
}

watch(() => route.query.mode, syncCurrentModeFromRoute, { immediate: true });

// 使用 computed 生成层级数据
const displayGroups = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  // 1. 获取所有符合筛选条件的 packId
  const filteredPackIds = new Set(
    Object.keys(packs).filter((id) => {
      const p = packs[id]!;
      const name = p.displayName[locale.value as keyof LocalizedText] || '';
      return name.toLowerCase().includes(query);
    }),
  );

  // 2. 构建并排序层级结构
  const groups = Object.values(packGroups).map((group) => {
    const shops = group.shopIds
      .map((shopId) => packShops[shopId])
      .filter((shop) => !!shop)
      .map((shop) => {
        // 过滤 goods
        const goodsIds = shop.goodsIds.filter((id) => filteredPackIds.has(id));

        // 对 goods 进行排序
        goodsIds.sort((a, b) => {
          const packA = packs[a]!;
          const packB = packs[b]!;
          let valueA: number;
          let valueB: number;

          switch (sortField.value) {
            case 'default': {
              valueA = defaultSorting.get(packA.packId) ?? 999;
              valueB = defaultSorting.get(packB.packId) ?? 999;
              break;
            }
            case 'price': {
              valueA = packA.price;
              valueB = packB.price;
              break;
            }
            case 'gachaOnly': {
              valueA = getPackPullsEfficiency(packA);
              valueB = getPackPullsEfficiency(packB);
              break;
            }
            case 'allItems': {
              valueA = getPackSanityEfficiency(packA);
              valueB = getPackSanityEfficiency(packB);
              break;
            }
            default: {
              valueA = 0;
              valueB = 0;
            }
          }

          return sortOrder.value === 'asc' ? valueA - valueB : valueB - valueA;
        });

        return { ...shop, goodsIds };
      })
      .filter((shop) => shop.goodsIds.length > 0);

    return { ...group, shops };
  });

  return groups.filter((group) => group.shops.length > 0);
});

/**
 * 切换排序方向
 */
function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
}

function triggerDevModeByShop(shopId: string) {
  if (shopId !== devModeTriggerShopId || currentMode.value === 'dev') {
    return;
  }

  devModeTriggerClicks.value += 1;
  if (devModeTriggerClicks.value >= devModeTriggerThreshold) {
    currentMode.value = 'dev';
    void router.replace({
      path: route.path,
      query: {
        ...route.query,
        mode: 'dev',
      },
    });
  }
}

definePageMeta({
  layout: 'default',
});

usePageSeo({
  title: () => `${t('page.materialProfit.packageValue.title')} - ${t('layout.siteName')}`,
  description: () => t('page.materialProfit.packageValue.description'),
});
</script>

<style scoped>
.package-value-page {
  transition: background-color var(--transition-base);
}

.package-value-page-debug-green {
  background-color: #dff8df;
}

.package-value-page-debug-no-shadow :deep(.pack-card-left),
.package-value-page-debug-no-shadow :deep(.pack-card-right),
.package-value-page-debug-no-shadow :deep(.pack-contents-table) {
  box-shadow: none !important;
}

.filter-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
}

.filter-search {
  flex: 0 0 auto;
  min-width: 200px;
  max-width: 300px;
}

.filter-sort {
  display: flex;
  align-items: center;
  gap: 5px;
}

.sort-label {
  font-size: var(--font-size-base);
  color: var(--theme-text-primary);
  white-space: nowrap;
  flex: 0 0 auto;
}

.filter-radio-group {
  flex: 0 0 auto;
}

.sort-order-btn {
  flex: 0 0 auto;
  white-space: nowrap;
}

.debug-panel {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-sm) var(--spacing-md);
  flex-wrap: wrap;
  border: 1px dashed var(--theme-border);
  border-radius: var(--radius-md);
  background-color: var(--theme-bg-secondary);
}

.debug-panel-title {
  color: var(--theme-text-primary);
  font-size: var(--font-size-sm);
  font-weight: 700;
}

.debug-switches {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.packs-container {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(20px, 6.66666666vw, 40px);
  position: relative;
}

.category-title {
  margin-block: var(--spacing-lg) var(--spacing-md);
  color: var(--theme-text-primary);
  font-size: var(--font-size-md);
}

.no-data {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--theme-text-secondary);
}

.group-section {
  margin-bottom: var(--spacing-2xl);
}

.shop-section {
  margin-bottom: var(--spacing-xl);
}

@media screen and (max-width: 600px) {
  .filter-container {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-search {
    max-width: 100%;
  }

  .filter-radio-group {
    width: 100%;
  }

  .filter-sort {
    flex-direction: column;
  }

  .filter-radio-group {
    display: flex;
    justify-content: center;
  }

  .debug-panel {
    align-items: stretch;
    flex-direction: column;
  }

  .debug-switches {
    flex-direction: column;
  }
}
</style>
