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
      <div class="gacha-mode-controls">
        <v-btn-toggle
          v-model="gachaMode"
          class="gacha-mode-toggle"
          color="primary"
          density="compact"
          divided
          mandatory
          variant="outlined"
        >
          <v-btn value="operator">
            <v-icon start>mdi-account</v-icon>
            {{ $t('page.materialProfit.packageValue.gachaOperator') }}
          </v-btn>
          <v-btn value="weapon">
            <v-icon start>mdi-sword-cross</v-icon>
            {{ $t('page.materialProfit.packageValue.gachaWeapon') }}
          </v-btn>
        </v-btn-toggle>
        <v-menu
          v-model="showWeaponBaselineMenu"
          :close-on-content-click="false"
          location="bottom start"
        >
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              :aria-label="$t('page.materialProfit.packageValue.weaponBaselineSettings')"
              class="weapon-baseline-settings"
              density="compact"
              :ripple="false"
              size="small"
              variant="outlined"
            >
              <v-icon>mdi-cog-outline</v-icon>
            </v-btn>
          </template>
          <v-sheet class="weapon-baseline-menu" rounded="sm">
            <div class="weapon-baseline-menu-title">
              {{ $t('page.materialProfit.packageValue.weaponBaselineTitle') }}
            </div>
            <div class="weapon-baseline-switch">
              <span>{{ $t('page.materialProfit.packageValue.weaponBaseline648') }}</span>
              <v-switch
                v-model="weaponQuotaBaselineMode"
                color="primary"
                density="compact"
                :false-value="'originium648'"
                hide-details
                :true-value="'standardWeaponPack'"
              />
              <span>
                {{ $t('page.materialProfit.packageValue.weaponBaselineStandardPack') }}
              </span>
            </div>
          </v-sheet>
        </v-menu>
      </div>
      <div class="filter-sort">
        <v-btn-toggle
          v-model="sortField"
          class="sort-field-toggle"
          color="primary"
          density="compact"
          divided
          mandatory
          variant="outlined"
        >
          <v-btn value="category">
            {{ $t('page.materialProfit.packageValue.sortCategory') }}
          </v-btn>
          <v-btn value="price">
            {{ $t('page.materialProfit.packageValue.sortPrice') }}
          </v-btn>
          <v-btn value="operator">
            {{ $t('page.materialProfit.packageValue.sortOperator') }}
          </v-btn>
          <v-btn value="weapon">
            {{ $t('page.materialProfit.packageValue.sortWeapon') }}
          </v-btn>
          <v-btn value="allItems">
            {{ $t('page.materialProfit.packageValue.sortAllItems') }}
          </v-btn>
        </v-btn-toggle>
      </div>
      <v-btn
        class="hidden-packs-toggle"
        density="compact"
        :disabled="hiddenPackCount === 0 && !showHiddenPacks"
        :prepend-icon="showHiddenPacks ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
        variant="outlined"
        @click="showHiddenPacks = !showHiddenPacks"
      >
        {{
          $t(
            showHiddenPacks
              ? 'page.materialProfit.packageValue.hideHiddenPacks'
              : 'page.materialProfit.packageValue.showHiddenPacks',
          )
        }}
        <span class="hidden-packs-count">({{ hiddenPackCount }})</span>
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
            v-if="shop.showTitle"
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
              :gacha-mode="gachaMode"
              :is-hidden="hiddenPackIdSet.has(packId)"
              :weapon-quota-baseline="weaponQuotaBaseline"
              v-bind="packs[packId]!"
              @set-hidden="setPackHidden"
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
import type {
  LocalizedText,
  PackData,
  PackGachaMode,
  WeaponQuotaBaseline,
} from '@/shared/types/pack';
import ModuleHeader from '@/app/components/layout/ModuleHeader.vue';
import { packGroups, packs, packShops } from '@/custom/core/packs';
import {
  getPackPullsEfficiency,
  getPackSanityEfficiency,
  getPackTotalWeaponQuota,
  getPackWeaponEfficiency,
  pack648WeaponQuotaBaseline,
} from '@/shared/utils/gameData/pack';

// 全局数据引用-原始顺序（用于分类排序）
const categorySorting: Map<string, number> = new Map(
  Object.keys(packs).map((packId, index) => [packId, index]),
);
const bundlePackGroupId = 'shop_pay_gift_pack';
const hiddenPackStorageKey = 'material-profit-package-value:hidden-pack-ids';

const { locale, t } = useI18n();

// 筛选和排序状态
const searchQuery = ref('');
const gachaMode = ref<PackGachaMode>('operator');
const weaponQuotaBaselineMode = ref<'originium648' | 'standardWeaponPack'>('originium648');
const showWeaponBaselineMenu = ref(false);
const sortField = ref<'category' | 'price' | 'operator' | 'weapon' | 'allItems'>('category');
const route = useRoute();
const router = useRouter();
const currentMode = ref('normal');
const devModeTriggerClicks = ref(0);
const devModeTriggerThreshold = 8;
const devModeTriggerShopId = 'SP_weapon_supply';
const devDebugHideCardShadow = ref(false);
const devDebugGreenBackground = ref(false);
const hiddenPackIds = ref<string[]>([]);
const showHiddenPacks = ref(false);

const hiddenPackIdSet = computed(() => new Set(hiddenPackIds.value));
const hiddenPackCount = computed(() => hiddenPackIds.value.length);
const weaponQuotaBaseline = computed<WeaponQuotaBaseline>(() => {
  if (weaponQuotaBaselineMode.value === 'standardWeaponPack') {
    const standardWeaponPack = packs['weapon_giftpack_03']!;
    return {
      totalQuota: getPackTotalWeaponQuota(standardWeaponPack),
      price: standardWeaponPack.price,
    };
  }

  return pack648WeaponQuotaBaseline;
});

onMounted(() => {
  loadHiddenPackIds();
});

function syncCurrentModeFromRoute() {
  currentMode.value = route.query.mode === 'dev' ? 'dev' : 'normal';
  if (currentMode.value !== 'dev') {
    devModeTriggerClicks.value = 0;
  }
}

watch(() => route.query.mode, syncCurrentModeFromRoute, { immediate: true });

function compareCategoryOrder(packA: PackData, packB: PackData) {
  return (
    (categorySorting.get(packA.packId) ?? Number.MAX_SAFE_INTEGER) -
    (categorySorting.get(packB.packId) ?? Number.MAX_SAFE_INTEGER)
  );
}

function comparePacks(packA: PackData, packB: PackData) {
  switch (sortField.value) {
    case 'category': {
      return compareCategoryOrder(packA, packB);
    }
    case 'price': {
      return (
        packA.price - packB.price ||
        getPackSanityEfficiency(packB, weaponQuotaBaseline.value) -
          getPackSanityEfficiency(packA, weaponQuotaBaseline.value) ||
        compareCategoryOrder(packA, packB)
      );
    }
    case 'operator': {
      return (
        getPackPullsEfficiency(packB, gachaMode.value === 'operator') -
          getPackPullsEfficiency(packA, gachaMode.value === 'operator') ||
        packA.price - packB.price ||
        compareCategoryOrder(packA, packB)
      );
    }
    case 'weapon': {
      return (
        getPackWeaponEfficiency(
          packB,
          gachaMode.value === 'weapon',
          weaponQuotaBaseline.value,
        ) -
          getPackWeaponEfficiency(packA, gachaMode.value === 'weapon', weaponQuotaBaseline.value) ||
        packA.price - packB.price ||
        compareCategoryOrder(packA, packB)
      );
    }
    case 'allItems': {
      return (
        getPackSanityEfficiency(packB, weaponQuotaBaseline.value) -
          getPackSanityEfficiency(packA, weaponQuotaBaseline.value) ||
        packA.price - packB.price ||
        compareCategoryOrder(packA, packB)
      );
    }
    default: {
      return 0;
    }
  }
}

function sortPackIds(packIds: string[]) {
  return packIds.toSorted((a, b) => comparePacks(packs[a]!, packs[b]!));
}

function setPackHidden(packId: string, hidden: boolean) {
  if (!(packId in packs)) {
    return;
  }

  const nextHiddenPackIds = new Set(hiddenPackIds.value);
  if (hidden) {
    nextHiddenPackIds.add(packId);
  } else {
    nextHiddenPackIds.delete(packId);
  }

  hiddenPackIds.value = [...nextHiddenPackIds].toSorted(
    (a, b) =>
      (categorySorting.get(a) ?? Number.MAX_SAFE_INTEGER) -
      (categorySorting.get(b) ?? Number.MAX_SAFE_INTEGER),
  );
  persistHiddenPackIds();

  if (hiddenPackIds.value.length === 0) {
    showHiddenPacks.value = false;
  }
}

function persistHiddenPackIds() {
  if (!import.meta.client) {
    return;
  }

  if (hiddenPackIds.value.length === 0) {
    localStorage.removeItem(hiddenPackStorageKey);
    return;
  }

  localStorage.setItem(hiddenPackStorageKey, JSON.stringify(hiddenPackIds.value));
}

function loadHiddenPackIds() {
  if (!import.meta.client) {
    return;
  }

  const savedValue = localStorage.getItem(hiddenPackStorageKey);
  if (!savedValue) {
    return;
  }

  try {
    const parsedValue: unknown = JSON.parse(savedValue);
    if (!Array.isArray(parsedValue)) {
      return;
    }

    hiddenPackIds.value = [
      ...new Set(
        parsedValue.filter((value): value is string => typeof value === 'string' && value in packs),
      ),
    ].toSorted(
      (a, b) =>
        (categorySorting.get(a) ?? Number.MAX_SAFE_INTEGER) -
        (categorySorting.get(b) ?? Number.MAX_SAFE_INTEGER),
    );
  } catch {
    localStorage.removeItem(hiddenPackStorageKey);
  }
}

// 使用 computed 生成层级数据
const displayGroups = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  // 1. 获取所有符合筛选条件的 packId
  const filteredPackIds = new Set(
    Object.keys(packs).filter((id) => {
      const p = packs[id]!;
      const name = p.displayName[locale.value as keyof LocalizedText] || '';
      return (
        name.toLowerCase().includes(query) &&
        (showHiddenPacks.value || !hiddenPackIdSet.value.has(id))
      );
    }),
  );

  // 2. 构建并排序层级结构
  const groups = Object.values(packGroups).map((group) => {
    if (sortField.value !== 'category' && group.groupId === bundlePackGroupId) {
      const goodsIds = sortPackIds(
        group.shopIds.flatMap((shopId) => {
          const shop = packShops[shopId];
          return shop ? shop.goodsIds.filter((id) => filteredPackIds.has(id)) : [];
        }),
      );

      return {
        ...group,
        shops:
          goodsIds.length > 0
            ? [
                {
                  shopId: `${group.groupId}-merged`,
                  displayName: group.displayName,
                  goodsIds,
                  showTitle: false,
                },
              ]
            : [],
      };
    }

    const shops = group.shopIds
      .map((shopId) => packShops[shopId])
      .filter((shop) => !!shop)
      .map((shop) => {
        const goodsIds = sortPackIds(shop.goodsIds.filter((id) => filteredPackIds.has(id)));
        return { ...shop, goodsIds, showTitle: true };
      })
      .filter((shop) => shop.goodsIds.length > 0);

    return { ...group, shops };
  });

  return groups.filter((group) => group.shops.length > 0);
});

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

.gacha-mode-toggle {
  flex: 0 0 auto;
}

.gacha-mode-controls {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 4px;
}

.weapon-baseline-settings {
  flex: 0 0 auto;
  width: 36px !important;
  min-width: 36px !important;
  height: 28px !important;
  padding: 0 !important;
  border-radius: var(--radius-sm) !important;
  background-color: transparent !important;
  border-color: var(--theme-border) !important;
  color: var(--theme-text-primary) !important;
  box-shadow: none !important;
  outline: none !important;
  transition: none !important;
}

.weapon-baseline-settings:hover,
.weapon-baseline-settings:focus,
.weapon-baseline-settings:focus-visible,
.weapon-baseline-settings:active {
  background-color: transparent !important;
  border-color: var(--theme-border) !important;
  color: var(--theme-text-primary) !important;
  box-shadow: none !important;
  outline: none !important;
  transform: none !important;
  transition: none !important;
}

.weapon-baseline-settings::before {
  opacity: 0 !important;
}

.weapon-baseline-menu {
  min-width: 250px;
  padding: 12px;
  border: 1px solid var(--theme-border);
  background-color: var(--theme-bg-secondary);
  box-shadow: 0 4px 12px var(--theme-shadow-base);
}

.weapon-baseline-menu-title {
  margin-bottom: 8px;
  color: var(--theme-text-primary);
  font-size: var(--font-size-sm);
  font-weight: 700;
}

.weapon-baseline-switch {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  color: var(--theme-text-primary);
  font-size: var(--font-size-xs);
}

.weapon-baseline-switch span:last-child {
  text-align: right;
}

.filter-sort {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-left: var(--spacing-xs);
}

.hidden-packs-toggle {
  flex: 0 0 auto;
  letter-spacing: 0;
}

.hidden-packs-count {
  margin-left: 4px;
}

.sort-field-toggle {
  flex: 0 0 auto;
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
  row-gap: clamp(28px, calc(4vw + 4px), 36px);
  column-gap: 20px;
  position: relative;
}

.group-section :deep(.module-header) {
  margin-bottom: 20px;
}

.group-section:first-child :deep(.module-header) {
  margin-top: 40px;
}

.category-title {
  margin-block: 20px var(--spacing-md);
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

  .gacha-mode-toggle {
    align-self: center;
  }

  .gacha-mode-controls {
    align-self: center;
  }

  .filter-sort {
    flex-direction: column;
    align-items: stretch;
    margin-left: 0;
    min-width: 0;
    width: 100%;
  }

  .hidden-packs-toggle {
    width: 100%;
  }

  .group-section :deep(.module-header) {
    margin-bottom: 16px;
  }

  .group-section:first-child :deep(.module-header) {
    margin-top: 32px;
  }

  .category-title {
    margin-top: 16px;
  }

  .sort-field-toggle {
    display: flex;
    justify-content: center;
    max-width: 100%;
    min-width: 0;
    width: 100%;
  }

  .sort-field-toggle :deep(.v-btn) {
    flex: 1 1 0;
    min-width: 0 !important;
    padding-inline: var(--spacing-xs);
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
