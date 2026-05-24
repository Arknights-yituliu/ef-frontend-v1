<template>
  <v-container>
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
    <!-- 礼包卡片列表 -->
    <ModuleHeader
      :tips="['*在售/即将开售的限时礼包，常驻、半常驻礼包和源石请往下翻']"
      title="在售/即将开售的礼包"
      title-en="New Packs"
    />
    <TransitionGroup
      v-if="categorizedPacks.seasonal.length > 0"
      class="packs-container"
      name="list"
      tag="div"
    >
      <ContainerPackCard
        v-for="packId in categorizedPacks.seasonal"
        :key="packId"
        v-bind="packs[packId]!"
      />
    </TransitionGroup>

    <!-- <ModuleHeader
      title="半常驻礼包"
      title-en="Semi-permanent Packs"
      :tips="[123]"
    ></ModuleHeader> -->

    <ModuleHeader
      :tips="['*每月/每周礼包、新人礼包、源石、武库配额']"
      title="常驻礼包"
      title-en="Permanent Packs"
    />
    <h2 style="margin: 15px">新人礼包</h2>
    <TransitionGroup
      v-if="categorizedPacks.newbie.length > 0"
      class="packs-container"
      name="list"
      tag="div"
    >
      <ContainerPackCard
        v-for="packId in categorizedPacks.newbie"
        :key="packId"
        v-bind="packs[packId]!"
      />
    </TransitionGroup>

    <h2 style="margin: 15px">每月/每周礼包</h2>
    <TransitionGroup
      v-if="categorizedPacks.periodic.length > 0"
      class="packs-container"
      name="list"
      tag="div"
    >
      <ContainerPackCard
        v-for="packId in categorizedPacks.periodic"
        :key="packId"
        v-bind="packs[packId]!"
      />
    </TransitionGroup>

    <h2 style="margin: 15px">武库配额</h2>
    <TransitionGroup
      v-if="categorizedPacks.weapon.length > 0"
      class="packs-container"
      name="list"
      tag="div"
    >
      <ContainerPackCard
        v-for="packId in categorizedPacks.weapon"
        :key="packId"
        v-bind="packs[packId]!"
      />
    </TransitionGroup>

    <h2 style="margin: 15px">源石/首充源石</h2>
    <TransitionGroup
      v-if="categorizedPacks.originium.length > 0"
      class="packs-container"
      name="list"
      tag="div"
    >
      <ContainerPackCard
        v-for="packId in categorizedPacks.originium"
        :key="packId"
        v-bind="packs[packId]!"
      />
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
import ModuleHeader from '@/app/components/layout/ModuleHeader.vue';
import { packs } from '@/custom/core/packs';
// 全局数据引用
const defaultSorting: Map<string, number> = new Map(
  Object.keys(packs).map((packId, index) => [packId, index]),
);
const packsIdFilteredAndSorted = ref<string[]>(Object.keys(packs));

// 使用 computed 代替多个 ref 和繁琐的更新函数
const categorizedPacks = computed(() => {
  const ids = packsIdFilteredAndSorted.value;
  return {
    seasonal: ids.filter((id) => packs[id]?.category === 'seasonal'),
    newbie: ids.filter((id) => packs[id]?.category === 'newbie'),
    weapon: ids.filter((id) => packs[id]?.category === 'weapon'),
    originium: ids.filter((id) => packs[id]?.category === 'originium'),
    // 包含 月卡 和 BP 的逻辑
    monthlyCardAndBp: ids.filter((id) => {
      const cat = packs[id]?.category;
      return cat === 'monthly_card' || cat === 'bp';
    }),
    // 周期性礼包：每月、每周、月卡、BP
    periodic: ids.filter((id) => {
      const cat = packs[id]?.category;
      return cat && ['monthly', 'weekly', 'monthly_card', 'bp'].includes(cat);
    }),
  };
});

// 筛选和排序状态
const searchQuery = ref('');
const sortField = ref<'default' | 'price' | 'gachaOnly' | 'allItems'>('default');
const sortOrder = ref<'asc' | 'desc'>('asc');

// ====================== 筛选和排序逻辑 ======================
/**
 * 应用筛选和排序
 */
function applyFilterAndSort() {
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
      case 'default': {
        valueA = defaultSorting.get(packA.packId)!;
        valueB = defaultSorting.get(packB.packId)!;
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
        valueA = defaultSorting.get(packA.packId)!;
        valueB = defaultSorting.get(packB.packId)!;
      }
    }

    if (sortOrder.value === 'asc') {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });

  packsIdFilteredAndSorted.value = result;
}

/**
 * 切换排序方向
 */
function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
}

// 监听搜索和排序变化
watch(
  [searchQuery, sortField, sortOrder],
  () => {
    applyFilterAndSort();
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
