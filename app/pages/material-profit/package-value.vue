<template>
  <v-container>
    <header class="page-title">{{ $t('page.materialProfit.packageValue.title') }}</header>
    <!--    <p class="page-description">{{ $t('page.materialProfit.packageValue.description') }}</p>-->

    <!-- 筛选区 -->
    <section class="filter-container">
      <v-text-field
        v-model="searchQuery"
        :placeholder="$t('page.materialProfit.packageValue.searchPlaceholder')"
        class="filter-search"
        density="compact"
        hide-details
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
            :label="$t('page.materialProfit.packageValue.sortDefault')"
            density="compact"
            value="default"
          />
          <v-radio
            :label="$t('page.materialProfit.packageValue.sortPrice')"
            density="compact"
            value="price"
          />
          <v-radio
            :label="$t('page.materialProfit.packageValue.sortGachaOnly')"
            density="compact"
            value="gachaOnly"
          />
          <v-radio
            :label="$t('page.materialProfit.packageValue.sortAllItems')"
            density="compact"
            value="allItems"
          />
        </v-radio-group>
      </div>

      <v-btn
        :title="
          sortOrder === 'asc'
            ? $t('page.materialProfit.packageValue.sortAsc')
            : $t('page.materialProfit.packageValue.sortDesc')
        "
        class="sort-order-btn"
        density="compact"
        size="large"
        variant="outlined"
        @click="toggleSortOrder"
      >
        <span v-if="sortOrder === 'asc'"
          >↑ {{ $t('page.materialProfit.packageValue.sortAsc') }}</span
        >
        <span v-else>↓ {{ $t('page.materialProfit.packageValue.sortDesc') }}</span>
      </v-btn>
    </section>
    <!-- 礼包卡片列表 -->
    <ModuleHeader
      title="在售/即将开售的礼包"
      title-en="New Packs"
      :tips="['*在售/即将开售的限时礼包，常驻、半常驻礼包和源石请往下翻']"
    />
    <TransitionGroup v-if="seasonalPacks.length > 0" name="list" tag="div" class="packs-container">
      <ContainerPackCard v-for="packId in seasonalPacks" :key="packId" v-bind="packs[packId]!" />
    </TransitionGroup>

    <!-- <ModuleHeader
      title="半常驻礼包"
      title-en="Semi-permanent Packs"
      :tips="[123]"
    ></ModuleHeader> -->

    <ModuleHeader
      title="常驻礼包"
      title-en="Permanent Packs"
      :tips="['*每月/每周礼包、新人礼包、源石、武库配额']"
    />
    <h2 style="margin: 15px">新人礼包</h2>
    <TransitionGroup v-if="newbiePacks.length > 0" name="list" tag="div" class="packs-container">
      <ContainerPackCard v-for="packId in newbiePacks" :key="packId" v-bind="packs[packId]!" />
    </TransitionGroup>

    <h2 style="margin: 15px">每月/每周礼包</h2>
    <TransitionGroup v-if="periodicPacks.length > 0" name="list" tag="div" class="packs-container">
      <ContainerPackCard v-for="packId in periodicPacks" :key="packId" v-bind="packs[packId]!" />
    </TransitionGroup>

    <h2 style="margin: 15px">武库配额</h2>
    <TransitionGroup v-if="weaponsPacks.length > 0" name="list" tag="div" class="packs-container">
      <ContainerPackCard v-for="packId in weaponsPacks" :key="packId" v-bind="packs[packId]!" />
    </TransitionGroup>

    <h2 style="margin: 15px">源石/首充源石</h2>
    <TransitionGroup v-if="originium.length > 0" name="list" tag="div" class="packs-container">
      <ContainerPackCard v-for="packId in originium" :key="packId" v-bind="packs[packId]!" />
    </TransitionGroup>

    <!-- <ModuleHeader
      title="历史礼包"
      title-en="Historical Packs"
      :tips="[123]"
    ></ModuleHeader> -->

    <!-- 礼包卡片列表 -->
    <!-- <TransitionGroup
      v-if="packsIdFilteredAndSorted.length > 0"
      name="list"
      tag="div"
      class="packs-container"
    >
      <ContainerPackCard
        v-for="packId in packsIdFilteredAndSorted"
        :key="packId"
        v-bind="packs[packId]!"
      />
    </TransitionGroup> -->

    <div v-else class="no-data">
      <p>{{ $t('common.noData') }}</p>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { packs } from '@/custom/core/packs';
import ModuleHeader from '@/app/components/layout/ModuleHeader.vue';
// 全局数据引用
const defaultSorting: Map<string, number> = new Map(
  Object.keys(packs).map((packId, index) => [packId, index]),
);
const packsIdFilteredAndSorted = ref<string[]>(Object.keys(packs));

const seasonalPacks = ref<string[]>([]);
const newbiePacks = ref<string[]>([]);
const monthlyPacks = ref<string[]>([]);
const weeklyPacks = ref<string[]>([]);
const weaponsPacks = ref<string[]>([]);
const monthlyCard = ref<string[]>([]);
const originium = ref<string[]>([]);
const periodicPacks = ref<string[]>([]);

// 筛选和排序状态
const searchQuery = ref('');
const sortField = ref<'default' | 'price' | 'gachaOnly' | 'allItems'>('default');
const sortOrder = ref<'asc' | 'desc'>('asc');

// ====================== 筛选和排序逻辑 ======================
/**
 * 应用筛选和排序
 */
const applyFilterAndSort = () => {
  // 1. 搜索筛选
  const query = searchQuery.value.trim().toLowerCase();
  const result = Object.keys(packs).filter((packId) => {
    const nameZH = packs[packId]?.packDisplayNameZH.toLowerCase() ?? '';
    const nameEN = packs[packId]?.packDisplayNameEN.toLowerCase() ?? '';
    return nameZH.includes(query) || nameEN.includes(query);
  });

  // 2. 排序
  result.sort((a, b) => {
    const packA = packs[a]!;
    const packB = packs[b]!;
    let valueA: number;
    let valueB: number;

    switch (sortField.value) {
      case 'default':
        valueA = defaultSorting.get(packA.packId)!;
        valueB = defaultSorting.get(packB.packId)!;
        break;
      case 'price':
        valueA = packA.price;
        valueB = packB.price;
        break;
      case 'gachaOnly':
        valueA = getPackPullsEfficiency(packA);
        valueB = getPackPullsEfficiency(packB);
        break;
      case 'allItems':
        valueA = getPackSanityEfficiency(packA);
        valueB = getPackSanityEfficiency(packB);
        break;
      default:
        valueA = defaultSorting.get(packA.packId)!;
        valueB = defaultSorting.get(packB.packId)!;
    }

    if (sortOrder.value === 'asc') {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });

  packsIdFilteredAndSorted.value = result;
};

/**
 * 切换排序方向
 */
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
};

const updateCategorylPacks = () => {
  seasonalPacks.value = packsIdFilteredAndSorted.value.filter((packId) =>
    packId.includes('seasonal_giftpack'),
  );
  newbiePacks.value = packsIdFilteredAndSorted.value.filter((packId) =>
    packId.includes('newbie_giftpack'),
  );
  monthlyPacks.value = packsIdFilteredAndSorted.value.filter((packId) =>
    packId.includes('monthly_giftpack'),
  );
  weeklyPacks.value = packsIdFilteredAndSorted.value.filter((packId) =>
    packId.includes('weekly_giftpack'),
  );
  weaponsPacks.value = packsIdFilteredAndSorted.value.filter((packId) =>
    packId.includes('武库配额包'),
  );
  monthlyCard.value = packsIdFilteredAndSorted.value.filter(
    (packId) =>
      packId.includes('月卡') ||
      packId.includes('bp_track_pay') ||
      packId.includes('bp_track_originium'),
  );
  originium.value = packsIdFilteredAndSorted.value.filter(
    (packId) => packId.includes('源石') && !packId.includes('bp_track_originium'),
  );
  periodicPacks.value = packsIdFilteredAndSorted.value.filter(
    (packId) =>
      packId.includes('monthly_giftpack') ||
      packId.includes('weekly_giftpack') ||
      packId.includes('月卡') ||
      packId.includes('bp_track_pay') ||
      packId.includes('bp_track_originium'),
  );
};

// 监听搜索和排序变化
watch([searchQuery, sortField, sortOrder], () => {
  applyFilterAndSort();
});

watch(
  packsIdFilteredAndSorted,
  () => {
    updateCategorylPacks();
  },
  { immediate: true },
);

definePageMeta({
  layout: 'default',
});
</script>

<style scoped>
.module-header {
  padding: 12px 0;
  flex-wrap: wrap;
  display: flex;
  align-items: center;
}

.module-header :deep(.module-title) {
  height: 60px;
  position: relative;
}

.module-header :deep(.module-title h1) {
  line-height: 1;
  font-size: 36px;
  padding: 0 4px 0 12px;
  font-weight: bolder;
  position: relative;
  z-index: 1;
}

.module-header :deep(.module-title h4) {
  padding: 12px 4px 0 4px;
  margin-top: -8px;
  background-color: #959595;
  color: #ffffff;
  border-left: 8px solid #fafb34;
  font-size: 14px;
}

.module-header :deep(.module-tip) {
  padding: 0 12px;
  font-style: italic;
  color: #00a1d6;
  font-size: 14px;
  line-height: 16px;
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

.packs-container {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(20px, 6.66666666vw, 40px);
  /* margin-top: var(--spacing-xl); */
  position: relative;
}

.no-data {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--theme-text-secondary);
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
}
</style>
