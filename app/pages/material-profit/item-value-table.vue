<template>
  <div class="page-container">
    <h1 class="page-title">{{ $t('page.materialProfit.itemValueTable.title') }}</h1>
    <!--    <p class="page-description">{{ $t('page.materialProfit.itemValueTable.description') }}</p>-->

    <!-- 筛选区 -->
    <div class="filter-container">
      <v-text-field
        v-model="searchQuery"
        :placeholder="$t('page.materialProfit.itemValueTable.searchPlaceholder')"
        class="filter-search"
        density="compact"
        hide-details
        variant="outlined"
      />
      <v-btn
        :title="sortOrder === 'asc' ? $t('page.materialProfit.itemValueTable.sortAsc') : $t('page.materialProfit.itemValueTable.sortDesc')"
        class="sort-order-btn"
        density="compact"
        size="large"
        variant="outlined"
        @click="toggleSortOrder"
      >
        <span v-if="sortOrder === 'asc'">↑ {{
            $t('page.materialProfit.itemValueTable.sortAsc')
          }}</span>
        <span v-else>↓ {{ $t('page.materialProfit.itemValueTable.sortDesc') }}</span>
      </v-btn>
    </div>

    <!-- 物品卡片列表 -->
    <div v-if="filteredAndSortedItems.length > 0" class="items-container">
      <div v-for="item in filteredAndSortedItems" :key="item.itemId" class="item-card">
        <!-- 左侧圆形图标 -->
        <div class="item-icon-wrapper">
          <div class="item-icon-placeholder">
            <span class="icon-text">{{ item.itemName?.charAt(0) || '?' }}</span>
          </div>
        </div>
        <!-- 右侧信息标签 -->
        <div class="item-info-bubble">
          <div style="width: 34px;"/>
          <div class="item-info-content flex-1">
            <div class="item-label">{{ item.itemName || item.itemId }}</div>
            <div class="item-value">{{ item.value.toFixed(3) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-data">
      <p>{{ $t('common.noData') }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {itemInfo} from '@/custom/core/itemInfo';
import {computed, ref} from 'vue';
import type {ItemInfo} from '@/shared/types/itemInfo';

definePageMeta({
  layout: 'default',
});

// 原始数据
const allItems = computed(() => {
  return Object.values(itemInfo);
});

// 筛选和排序状态
const searchQuery = ref('');
const sortOrder = ref<'asc' | 'desc'>('asc');

// 筛选和排序后的数据
const filteredAndSortedItems = computed(() => {
  let result = [...allItems.value];

  // 1. 搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase();
    result = result.filter((item: ItemInfo) => {
      const name = (item.itemName || item.itemId || '').toLowerCase();
      const id = (item.itemId || '').toLowerCase();
      return name.includes(query) || id.includes(query);
    });
  }

  // 2. 排序（按价值）
  result.sort((a: ItemInfo, b: ItemInfo) => {
    if (sortOrder.value === 'asc') {
      return a.value - b.value;
    } else {
      return b.value - a.value;
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
</script>

<style scoped>
.item-value-table-page {
  padding: 3rem 0;
}

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

.sort-order-btn {
  flex: 0 0 auto;
  white-space: nowrap;
}

.items-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.item-card {
  width: 260px;
  height: 96px;
  position: relative;
}

/* 左侧圆形图标 */
.item-icon-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}

.item-icon-placeholder {
  width: 6rem;
  height: 6rem;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--theme-bg-tertiary) 0%, var(--theme-bg-secondary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px var(--theme-shadow-base);
  border: 2px solid var(--theme-border);
  position: relative;
  overflow: hidden;
}

.item-icon-placeholder::before {
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
  opacity: 0.3;
  pointer-events: none;
}

.icon-text {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--theme-text-primary);
  position: relative;
  z-index: 1;
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
@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }

  .item-icon-placeholder {
    width: 3.5rem;
    height: 3.5rem;
  }

  .icon-text {
    font-size: var(--font-size-lg);
  }

  .item-info-bubble {
    min-width: 100px;
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .item-label {
    font-size: 0.875rem;
  }

  .item-value {
    font-size: var(--font-size-sm);
  }

  .filter-container {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-search {
    max-width: 100%;
  }
}
</style>
