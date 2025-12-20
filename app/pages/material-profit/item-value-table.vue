<template>
  <div class="page-container">
    <header class="page-title">{{ $t('page.materialProfit.itemValueTable.title') }}</header>
    <!--    <p class="page-description">{{ $t('page.materialProfit.itemValueTable.description') }}</p>-->

    <!-- 筛选区 -->
    <section class="filter-container">
      <v-text-field
        v-model="searchQuery"
        :placeholder="$t('page.materialProfit.itemValueTable.searchPlaceholder')"
        class="filter-search"
        density="compact"
        hide-details
        variant="outlined"
      />
      <div class="filter-sort">
        <span class="sort-label">{{ $t('page.materialProfit.itemValueTable.sortBy') }}:</span>
        <v-radio-group
          v-model="sortField"
          class="filter-radio-group"
          density="compact"
          hide-details
          inline
        >
          <v-radio
            :label="$t('page.materialProfit.itemValueTable.sortValue')"
            density="compact"
            value="value"
          />
          <v-radio
            :label="$t('page.materialProfit.itemValueTable.sortRarity')"
            density="compact"
            value="rarity"
          />
        </v-radio-group>
      </div>
      <v-btn
        :title="
          sortOrder === 'asc'
            ? $t('page.materialProfit.itemValueTable.sortAsc')
            : $t('page.materialProfit.itemValueTable.sortDesc')
        "
        class="sort-order-btn"
        density="compact"
        size="large"
        variant="outlined"
        @click="toggleSortOrder"
      >
        <span v-if="sortOrder === 'asc'"
          >↑ {{ $t('page.materialProfit.itemValueTable.sortAsc') }}</span
        >
        <span v-else>↓ {{ $t('page.materialProfit.itemValueTable.sortDesc') }}</span>
      </v-btn>
    </section>

    <!-- 物品卡片列表 -->
    <TransitionGroup
      v-if="filteredAndSortedItemIdList.length > 0"
      class="items-container"
      name="list"
      tag="div"
    >
      <div v-for="itemId in filteredAndSortedItemIdList" :key="itemId" class="item-card">
        <!-- 左侧物品图标 -->
        <div class="item-icon-wrapper">
          <ContainerItemIcon :itemId="itemId" />
        </div>
        <!-- 右侧信息标签 -->
        <div class="item-info-bubble">
          <div style="width: 34px"></div>
          <div class="item-info-content flex-1">
            <div class="item-label">{{ getItemName(itemId) }}</div>
            <div class="item-value">{{ getItemValue(itemId).toFixed(3) }}</div>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <div v-else class="no-data">
      <p>{{ $t('common.noData') }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getItemRarity } from '@/shared/utils/gameData/item';
import { itemValueMap } from '@/custom/core/itemValue';

definePageMeta({
  layout: 'default',
});

// SEO 配置
const { t } = useI18n();
const siteName = computed(() => t('layout.siteName'));
const pageTitle = computed(
  () => `${t('page.materialProfit.itemValueTable.title')} - ${siteName.value}`,
);
const pageDescription = computed(() => t('page.materialProfit.itemValueTable.description'));

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  ogType: 'website',
  twitterCard: 'summary',
});

useHead({
  title: () => pageTitle.value,
});

// 筛选和排序状态
const searchQuery = ref('');
const sortField = ref<'value' | 'rarity'>('value');
const sortOrder = ref<'asc' | 'desc'>('asc');

// 筛选和排序后的数据
const filteredAndSortedItemIdList = computed(() => {
  let result = Object.keys(itemValueMap);

  // 1. 搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase();
    result = result.filter((id) => {
      const name = getItemName(id).toLowerCase();
      return name.includes(query) || id.toLowerCase().includes(query);
    });
  }

  // 2. 排序（按价值或稀有度）
  result.sort((a, b) => {
    let valueA: number;
    let valueB: number;

    switch (sortField.value) {
      case 'value':
        valueA = getItemValue(a);
        valueB = getItemValue(b);
        break;
      case 'rarity':
        valueA = getItemRarity(a) ?? 0;
        valueB = getItemRarity(b) ?? 0;
        break;
      default:
        valueA = getItemValue(a);
        valueB = getItemValue(b);
    }

    if (sortOrder.value === 'asc') {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });

  return result;
});

/**
 * 切换排序方向
 */
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
};

// 监听搜索和排序变化
watch([searchQuery, sortField, sortOrder], () => {
  // 重新计算排序
  filteredAndSortedItemIdList.value;
});
</script>

<style scoped>
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

.items-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  position: relative;
}

.item-card {
  width: 260px;
  height: 96px;
  position: relative;
}

/* 左侧物品图标 */
.item-icon-wrapper {
  width: 6rem;
  height: 6rem;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}

/* 右侧信息标签 */
.item-info-bubble {
  background-color: var(--theme-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  box-shadow: 0 2px 8px var(--theme-shadow-base);
  border: 1px solid var(--theme-border);
  display: flex;
  gap: 0.25rem;
  text-align: center;
  position: absolute;
  min-width: 200px;
  z-index: 1;
  left: 47px;
  bottom: 2px;
}

.item-info-bubble::before {
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
  background-repeat: repeat;
  opacity: 0.15;
  pointer-events: none;
  border-radius: var(--radius-md);
}

.item-info-content {
  display: flex;
  flex-direction: column;
}

.item-label {
  font-size: var(--font-size-xs);
  color: var(--theme-text-secondary);
  line-height: 1.2;
  position: relative;
  z-index: 1;
}

.item-value {
  font-size: var(--font-size-base);
  color: var(--theme-text-primary);
  font-weight: 700;
  line-height: 1.2;
  position: relative;
  z-index: 1;
}

.no-data {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--theme-text-secondary);
}

/* 响应式设计 */
@media screen and (max-width: 600px) {
  .filter-container {
    flex-direction: column;
    align-items: stretch;
  }

  .items-container {
    justify-content: center;
  }
}
</style>
