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
      <span class="sort-label">{{ $t('page.materialProfit.packageValue.sortBy') }}:</span>
      <v-radio-group
        v-model="sortField"
        class="filter-radio-group"
        density="compact"
        hide-details
        inline
      >
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
      <v-btn
        :title="sortOrder === 'asc' ? $t('page.materialProfit.packageValue.sortAsc') : $t('page.materialProfit.packageValue.sortDesc')"
        class="sort-order-btn"
        density="compact"
        size="large"
        variant="outlined"
        @click="toggleSortOrder"
      >
        <span v-if="sortOrder === 'asc'">↑ {{
            $t('page.materialProfit.packageValue.sortAsc')
          }}</span>
        <span v-else>↓ {{ $t('page.materialProfit.packageValue.sortDesc') }}</span>
      </v-btn>
    </div>

    <!-- 礼包卡片列表 -->
    <div v-if="filteredAndSortedPacksData.length > 0" class="packs-container">
      <ContainerPackCard v-for="(pack, index) in filteredAndSortedPacksData" :key="index"
                         :pack-data="pack"/>
    </div>

    <div v-else class="no-data">
      <p>{{ $t('common.noData') }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {gachaItemMap} from '@/custom/core/gachaItem';
import {itemInfo} from '@/custom/core/itemInfo';
import {packs} from '@/custom/core/packs';
import type {
  ComparisonBar,
  PackContent,
  PackData,
  PackDataDTO,
  PackValueMetrics
} from '@/shared/types/pack';
import {onMounted, watch} from 'vue';

// 全局数据引用
const packsData = ref<PackDataDTO[]>(packs);
const displayPacksData = ref<PackData[]>([]);
const filteredAndSortedPacksData = ref<PackData[]>([]);

// 筛选和排序状态
const searchQuery = ref('');
const sortField = ref<'price' | 'gachaOnly' | 'allItems'>('price');
const sortOrder = ref<'asc' | 'desc'>('asc');

// 抽卡性价比基准       1衍质源石->75嵌晶玉->0.15抽
const pricePerPullBenchmark = 648 / ((350 * 75) / 500);
// 综合性价比基准
const pricePerStoneBenchmark = 648 / 350;

// ====================== 工具函数 ======================
/**
 * 获取物品信息（兼容id/name字段），不存在时打印警告
 * @param itemKey 物品ID或名称
 * @returns 物品信息 | undefined
 */
const getItemInfo = (itemKey: string): ItemInfo | undefined => {
  const info = itemInfo[itemKey];
  if (!info) {
    console.warn(`物品 "${itemKey}" 未在物品信息表中找到`);
  }
  return info;
};

/**
 * 计算礼包价值指标并生成对比数据
 * @param packDataList 原始礼包数据列表
 * @returns 带价值指标的礼包数据列表
 */
const calculatePackValueMetrics = (packDataList: PackDataDTO[]) => {
  const formatPacks: PackData[] = [];

  for (const pack of packDataList) {
    const {price, contents} = pack;
    let totalValue = 0; // 礼包内物品总价值
    let totalPulls = 0; // 礼包内抽卡总数

    // 转换 PackContentDTO[] 为 PackContent[]
    const processedContents: PackContent[] = [];

    // 一次遍历完成：物品价值统计 + 抽卡数统计 + 单个物品价值计算
    for (const item of contents) {
      // 优先用id匹配，兼容name字段
      const itemKey = item.itemId || item.itemName;
      if (!itemKey) {
        console.warn('物品缺少ID/名称');
        continue;
      }

      const itemInfoData = getItemInfo(itemKey);
      let itemTotalValue = 0;
      let itemPercentage = 0;

      if (itemInfoData) {
        // 计算单个物品总价值
        itemTotalValue = itemInfoData.value * item.quantity;
        totalValue += itemTotalValue;

        // 累加抽卡数（如果是抽卡相关物品）
        const gachaInfo = gachaItemMap[itemKey];
        if (gachaInfo) {
          totalPulls += gachaInfo.pulls * item.quantity;
        }
      }

      // 创建 PackContent 对象
      processedContents.push({
        itemId: item.itemId,
        itemName: item.itemName || item.itemId,
        quantity: item.quantity,
        totalValue: itemTotalValue,
        percentage: itemPercentage,
        iconClass: '', // 如果需要可以后续添加
      });
    }

    // ====================== 礼包核心价值指标计算 ======================
    // 等价源石数：总物品价值 / 源石价值系数
    const stoneEquivalent: number = totalValue / 40;
    // 每源石价格（处理0值避免Infinity）
    const pricePerStone = stoneEquivalent > 0 ? price / stoneEquivalent : 0;
    // 每抽价格（处理0抽避免Infinity）
    const pricePerPull = totalPulls > 0 ? price / totalPulls : 0;

    const valueMetrics: PackValueMetrics = {
      stoneEquivalent,
      pricePerStone,
      totalPulls,
      pricePerPull,
    };

    // ====================== 性价比对比条生成 ======================
    const comparisonBars: ComparisonBar[] = [
      // 基准：648元源石档
      {
        labelZH: '648源石',
        labelEN: '648 Originium',
        percentage: 1,
        widthPx: 100,
      },
      // 仅抽卡性价比对比
      {
        labelZH: '仅抽卡',
        labelEN: 'Gacha Only',
        percentage: totalPulls > 0 ? pricePerPullBenchmark / pricePerPull : 0,
        widthPx: totalPulls > 0 ? 100 * (pricePerPullBenchmark / pricePerPull) : 0,
      },
      // 全物品性价比对比
      {
        labelZH: '全物品',
        labelEN: 'All Items',
        percentage: stoneEquivalent > 0 ? pricePerStoneBenchmark / pricePerStone : 0,
        widthPx: stoneEquivalent > 0 ? 100 * (pricePerStoneBenchmark / pricePerStone) : 0,
      },
    ];

    // 按性价比从高到低排序对比条
    comparisonBars.sort((a, b) => b.percentage - a.percentage);

    // 计算单个物品价值占比（总价值为0时设为0）
    if (totalValue > 0) {
      processedContents.forEach((item) => {
        item.percentage = (item.totalValue || 0) / totalValue;
      });
    }

    // 合并处理后的数据
    formatPacks.push({
      ...pack,
      contents: processedContents,
      comparisonBars,
      valueMetrics,
      startTimestamp: pack.startTimestamp ?? 0,
      endTimestamp: pack.endTimestamp ?? 0,
    });
  }

  // console.log("处理后的礼包数据:", formatPacks);
  displayPacksData.value = formatPacks;
  applyFilterAndSort();
};

// ====================== 筛选和排序逻辑 ======================
/**
 * 应用筛选和排序
 */
const applyFilterAndSort = () => {
  let result = [...displayPacksData.value];

  // 1. 搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase();
    result = result.filter((pack) => {
      const nameZH = pack.packDisplayNameZH.toLowerCase();
      const nameEN = pack.packDisplayNameEN.toLowerCase();
      return nameZH.includes(query) || nameEN.includes(query);
    });
  }

  // 2. 排序
  result.sort((a, b) => {
    let valueA: number;
    let valueB: number;

    switch (sortField.value) {
      case 'price':
        valueA = a.price;
        valueB = b.price;
        break;
      case 'gachaOnly':
        // 仅抽卡性价比：pricePerPull 越小越好，所以用倒数比较
        valueA = a.valueMetrics.pricePerPull > 0 ? 1 / a.valueMetrics.pricePerPull : 0;
        valueB = b.valueMetrics.pricePerPull > 0 ? 1 / b.valueMetrics.pricePerPull : 0;
        break;
      case 'allItems':
        // 全物品性价比：pricePerStone 越小越好，所以用倒数比较
        valueA = a.valueMetrics.pricePerStone > 0 ? 1 / a.valueMetrics.pricePerStone : 0;
        valueB = b.valueMetrics.pricePerStone > 0 ? 1 / b.valueMetrics.pricePerStone : 0;
        break;
      default:
        valueA = a.price;
        valueB = b.price;
    }

    if (sortOrder.value === 'asc') {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });

  filteredAndSortedPacksData.value = result;
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

onMounted(() => {
  calculatePackValueMetrics(packsData.value);
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
}

@media (max-width: 768px) {
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
}

@media (max-width: 520px) {
  .packs-container {
    gap: var(--spacing-md);
  }
}
</style>
