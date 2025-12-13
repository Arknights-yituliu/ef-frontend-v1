<template>
  <div class="page-container">
    <h1 class="page-title">{{ $t('page.materialProfit.packageValue.title') }}</h1>
    <!--    <p class="page-description">{{ $t('page.materialProfit.packageValue.description') }}</p>-->

    <!-- 筛选区 -->
    <div class="filter-container">
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
    </div>

    <!-- 礼包卡片列表 -->
    <TransitionGroup
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
    </TransitionGroup>

    <div v-else class="no-data">
      <p>{{ $t('common.noData') }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { packs } from '@/custom/core/packs';

// 全局数据引用
const defaultSorting: Map<string, number> = new Map(
  Object.keys(packs).map((packId, index) => [packId, index]),
);
const packsIdFilteredAndSorted = ref<string[]>(Object.keys(packs));

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

// 监听搜索和排序变化
watch([searchQuery, sortField, sortOrder], () => {
  applyFilterAndSort();
});

definePageMeta({
  layout: 'default',
});
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
  gap: var(--spacing-xl);
  margin-top: var(--spacing-xl);
  position: relative;
}

.no-data {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--theme-text-secondary);
}

@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }

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

  .packs-container {
    justify-content: center;
  }
}

@media (max-width: 520px) {
  .packs-container {
    gap: var(--spacing-md);
  }
}

@media (max-width: 320px) {
  .filter-sort {
    flex-direction: column;
  }

  .filter-radio-group {
    display: flex;
    justify-content: center;
  }
}
</style>
