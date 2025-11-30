<template>
  <div class="package-value-page">
    <h1 class="page-title">{{ $t('page.materialProfit.packageValue.title') }}</h1>
    <p class="page-description">{{ $t('page.materialProfit.packageValue.description') }}</p>

    <!-- 礼包卡片列表 -->
    <div class="packs-container" v-if="displayPacksData.length > 0">
      <ContainerPackCard v-for="(pack, index) in displayPacksData" :key="index"   :pack-data="pack" />
    </div>

    <div class="no-data" v-else>
      <p>{{ $t('common.noData') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import packsDataJson from '@/custom/core/packs.json';
import type {ComparisonBar, PackData, PackDataDTO, PackValueMetrics} from '@/shared/types/pack';
import itemInfoTable from '@/custom/core/itemInfo';
import {gachaItemMap} from "@/custom/core/gachaItem";
import {onMounted} from "vue";


// 全局数据引用
const packsData = ref<PackDataDTO[]>(packsDataJson as PackDataDTO[]);
const displayPacksData = ref<PackData[]>([]);

// 抽卡性价比基准       1衍质源石->75嵌晶玉->0.15抽
const pricePerPullBenchmark = 648 / (350 * 75 / 500);
// 综合性价比基准
const pricePerStoneBenchmark = 648 / 350

// ====================== 工具函数 ======================
/**
 * 获取物品信息（兼容id/name字段），不存在时打印警告
 * @param itemKey 物品ID或名称
 * @returns 物品信息 | undefined
 */
const getItemInfo = (itemKey: string): ItemInfo | undefined => {
  const info = itemInfoTable[itemKey];
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
    const { price, contents } = pack;
    let totalValue = 0; // 礼包内物品总价值
    let totalPulls = 0; // 礼包内抽卡总数

    // 一次遍历完成：物品价值统计 + 抽卡数统计 + 单个物品价值计算
    for (const item of contents) {
      // 优先用id匹配，兼容name字段
      const itemKey = item.id || item.name;
      if (!itemKey) {
        console.warn("物品缺少ID/名称");
        continue;
      }

      const itemInfo = getItemInfo(itemKey);
      if (!itemInfo) {
        item.totalValue = 0;
        item.percentage = 0;
        continue;
      }

      // 计算单个物品总价值和占比
      const itemTotalValue = itemInfo.value * item.quantity;
      item.totalValue = itemTotalValue;
      totalValue += itemTotalValue;

      // 累加抽卡数（如果是抽卡相关物品）
      const gachaInfo = gachaItemMap[itemKey];
      if (gachaInfo) {
        totalPulls += gachaInfo.pulls * item.quantity;
      }
    }

    // ====================== 礼包核心价值指标计算 ======================
    // 等价源石数：总物品价值 / 源石价值系数
    const stoneEquivalent:number = totalValue / 40;
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
        labelZH: "648源石",
        labelEN: "648 Originium",
        percentage: 1,
        widthPx: 100,
      },
      // 仅抽卡性价比对比
      {
        labelZH: "仅抽卡",
        labelEN: "Gacha Only",
        percentage: totalPulls > 0 ? pricePerPullBenchmark / pricePerPull : 0,
        widthPx: totalPulls > 0 ? 100 * (pricePerPullBenchmark / pricePerPull) : 0,
      },
      // 全物品性价比对比
      {
        labelZH: "全物品",
        labelEN: "All Items",
        percentage: stoneEquivalent > 0 ? pricePerStoneBenchmark / pricePerStone : 0,
        widthPx: stoneEquivalent > 0 ? 100 * (pricePerStoneBenchmark / pricePerStone) : 0,
      },
    ];

    // 按性价比从高到低排序对比条
    comparisonBars.sort((a, b) => b.percentage - a.percentage);

    // 计算单个物品价值占比（总价值为0时设为0）
    if (totalValue > 0) {
      contents.forEach(item => {
        item.percentage = (item.totalValue || 0) / totalValue;
      });
    }

    // 合并处理后的数据
    formatPacks.push({
      ...pack,
      comparisonBars,
      valueMetrics,
    });
  }

  // console.log("处理后的礼包数据:", formatPacks);
  displayPacksData.value = formatPacks;
};


onMounted(()=>{
  calculatePackValueMetrics(packsData.value)
})

definePageMeta({
  layout: 'default',
});
</script>

<style scoped>
.package-value-page {
  padding: 2rem 0;
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

@media (max-width: 520px) {
  .packs-container {
    gap: var(--spacing-md);
  }
}
</style>
