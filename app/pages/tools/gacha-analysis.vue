<template>
  <div class="gacha-analysis">
    <h1>{{ $t('抽卡分析') }}</h1>

    <!-- 抽卡概览分析 -->
    <div class="gacha-overview mb-8">
      <h2 class="text-h5 mb-4">{{ $t('抽卡概览') }}</h2>

    <div class="pool-cards">
      <div
        v-for="(info, type) in poolSummary"
        :key="type"
        class="pool-card"
        :class="`pool-card--${type}`"
      >
        <div class="pool-name">{{ getDisplayName(type) }}</div>
        <div class="stats">
          <div class="stat-item">
            <span class="label">{{ $t('总抽数') }}:</span>
            <span class="value">{{ info.total }}</span>
          </div>
          <div class="stat-item">
            <span class="label">{{ $t('平均抽数') }}:</span>
            <span class="value">{{ info.average.toFixed(1) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 卡池分布 -->
    <div class="mt-4">
      <h3 class="text-subtitle-2 mb-2">{{ $t('卡池抽卡分布') }}</h3>
      <div class="d-flex flex-wrap">
        <v-chip
          v-for="(item, pool) in poolDistribution"
          :key="pool"
          size="small"
          :color="getPoolColor(pool)"
          label
          style="margin-right: 5px;"
        >
          {{ pool }}: {{ item.count }} ({{ Math.round(item.ratio * 100) }}%)
        </v-chip>
      </div>
    </div>



    <!-- 角色频次 TOP 3 -->
    <div class="mt-4">
      <h3 class="text-subtitle-2 mb-2">{{ $t('角色抽取频次 TOP 3') }}</h3>
      <div class="d-flex flex-wrap gap-2">
        <v-chip
          v-for="(char, index) in topCharacters"
          :key="char.name"
          size="small"
          :color="index === 0 ? 'purple' : index === 1 ? 'indigo' : 'teal'"
          label
          style="margin-right: 5px;"
        >
          {{ char.name }} ×{{ char.times }}
        </v-chip>
      </div>
    </div>
    </div>

    <!-- 卡池选择器 -->
    <div class="mb-4 d-flex gap-2">
      <v-btn
        variant="tonal"
        color="pink"
        :class="{ 'text-white bg-pink-darken-2': selectedPool === 'limited' }"
        @click="selectPool('limited')"
        style="margin-right: 5px;"
      >
        {{ $t('限定池') }}
      </v-btn>
      <v-btn
        variant="tonal"
        color="blue"
        :class="{ 'text-white bg-blue-darken-2': selectedPool === 'permanent' }"
        @click="selectPool('permanent')"
        style="margin-right: 5px;"
      >
        {{ $t('常驻池') }}
      </v-btn>
      <v-btn
        variant="tonal"
        color="purple"
        :class="{ 'text-white bg-purple-darken-2': selectedPool === 'weapon' }"
        @click="selectPool('weapon')"
        style="margin-right: 5px;"
      >
        {{ $t('武器池') }}
      </v-btn>
    </div>

    <!-- 按时间连续卡池分组展示 -->
    <div v-for="(segment, idx) in filteredConsecutiveGroups" :key="idx" class="mb-8">
      <h2 class="text-h5 mb-3">{{ segment.poolName }}</h2>

      <v-list density="compact">
        <v-list-item
          v-for="(record, index) in segment.records"
          :key="`${idx}-${index}`"
          class="mb-2"
        >
          <v-list-item-title class="font-weight-bold" style="width: 100px;">
            {{ record.character }}
          </v-list-item-title>

          <v-list-item-subtitle class="mr-4" style="width: 60px; text-align: right;">
            {{ record.count }} 抽
          </v-list-item-subtitle>

          <!-- 自定义横向柱状图 -->
          <div class="gacha-bar-container">
            <div
              class="gacha-bar"
              :style="{ width: `${getBarWidth(record.count)}%`, backgroundColor: getBarColor(record.count) }"
            ></div>
          </div>
        </v-list-item>
      </v-list>
    </div>
  </div>

  <div style="margin: 20px auto; max-width: 800px; font-family: Arial, sans-serif;">
    <h2 style="text-align: center; margin-bottom: 16px;">6星出货记录</h2>

    <table style="width: 100%; border-collapse: collapse; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <thead>
        <tr style="background-color: #f5f5f5;">
          <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">卡池ID</th>
          <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">卡池名称</th>
          <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">角色</th>
          <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">抽数</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in rollData"
          :key="index"
          style="border-bottom: 1px solid #eee;"
        >
          <td style="padding: 10px;">{{ row[0] }}</td>
          <td style="padding: 10px;">{{ row[1] }}</td>
          <td style="padding: 10px; font-weight: bold;">{{ row[2] }}</td>
          <td style="padding: 10px; text-align: center; color: #e74c3c; font-weight: bold;">{{ row[3] }}</td>
        </tr>
        <tr v-if="rollData.length === 0">
          <td colspan="4" style="padding: 20px; text-align: center; color: #999;">
            暂无6星记录
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import data from '@/custom/core/gacha-analysis-example.json';

// ========== 工具函数：安全解析时间戳 ==========
function safeTimestamp(ts: string | number): number {
  if (typeof ts === 'number') return ts;
  const num = Number(ts);
  if (!isNaN(num)) return num; // 处理 "1765115170980" 这类字符串
  return new Date(ts).getTime(); // 处理 ISO 字符串如 "2025-01-01T12:00:00Z"
}

// ========== 数据结构定义 ==========
interface GachaRecord {
  id: number;
  poolId: string;
  poolName: string;
  charName: string;
  rarity: number;
  gachaTs: string | number; // 允许数字或字符串
}

// ========== 响应式数据 ==========
const records = ref<GachaRecord[]>([]);
const rollData = ref<Array<[string, string, string, number]>>([]); // [poolId, poolName, charName, rollCount]
const sixStarRecordsWithCount = ref<Array<{
  poolName: string;
  poolId: string;
  character: string;
  count: number;
  timestamp: string | number; // 与 gachaTs 类型一致
}>>([]);

// ========== 卡池类型映射函数 ==========
function getPoolType(poolId: string): 'limited' | 'permanent' | 'weapon' {
  if (poolId.startsWith('special')) {
    return 'limited';
  }
  if (poolId.startsWith('weapon') || poolId.includes('weapon')) {
    return 'weapon';
  }
  return 'permanent';
}

// ========== 显示名称映射 ==========
const DISPLAY_NAMES: Record<'limited' | 'permanent' | 'weapon', string> = {
  limited: '限定',
  permanent: '常驻',
  weapon: '武库配额',
};

function getDisplayName(key: 'limited' | 'permanent' | 'weapon'): string {
  return DISPLAY_NAMES[key];
}

// ========== 卡池颜色映射（按 poolName）==========
const poolColorMap: Record<string, string> = {
  '基础寻访': 'deep-purple',
  '启程寻访': 'cyan',
  '特许寻访': 'amber',
};
function getPoolColor(poolName: string): string {
  return poolColorMap[poolName] || 'grey';
}

// ========== 生命周期：加载并处理数据 ==========
onMounted(async () => {
  try {
    // 1. 解析原始数据，并按时间升序排序（早 → 晚），用于正确计算抽数
    const list: GachaRecord[] = data.data
      .map((item: any) => ({
        id: item.id,
        poolId: item.poolId,
        poolName: item.poolName,
        charName: item.charName,
        rarity: item.rarity,
        gachaTs: item.gachaTs,
      }))
      .sort((a, b) => safeTimestamp(a.gachaTs) - safeTimestamp(b.gachaTs)); // 必须升序！

    records.value = list;

    // 2. 按 poolId 分组所有抽卡记录
    const poolAllRecords: Record<string, GachaRecord[]> = {};
    for (const record of list) {
      if (!poolAllRecords[record.poolId]) {
        poolAllRecords[record.poolId] = [];
      }
      poolAllRecords[record.poolId].push(record);
    }

    // 3. 提取6星并按 poolId 分组
    const sixStarRecords = list.filter(r => r.rarity === 6);
    const poolSixStars: Record<string, GachaRecord[]> = {};
    for (const rec of sixStarRecords) {
      if (!poolSixStars[rec.poolId]) poolSixStars[rec.poolId] = [];
      poolSixStars[rec.poolId].push(rec);
    }

    const result: Array<{
      poolId: string;
      poolName: string;
      character: string;
      count: number;
      timestamp: string | number;
    }> = [];

    // 4. 遍历每个 poolId，计算抽数
    for (const [poolId, allRecords] of Object.entries(poolAllRecords)) {
      const sixStars = poolSixStars[poolId] || [];
      const poolName = allRecords[0]?.poolName || poolId;

      // 构建局部索引映射（基于升序列表）
      const localIdToIndex: Record<number, number> = {};
      allRecords.forEach((rec, idx) => {
        localIdToIndex[rec.id] = idx;
      });

      let lastSixLocalIndex = -1;

      // 处理真实6星
      for (const six of sixStars) {
        const localIdx = localIdToIndex[six.id];
        if (localIdx === undefined) continue;

        const count = lastSixLocalIndex === -1 ? localIdx + 1 : localIdx - lastSixLocalIndex;
        result.push({
          poolId,
          poolName,
          character: six.charName,
          count,
          timestamp: six.gachaTs, // 保留原始时间格式
        });
        lastSixLocalIndex = localIdx;
      }

      // 插入“已垫”虚拟记录（如果末尾有未出6星的抽卡）
      if (allRecords.length > 0) {
        const paddedCount = lastSixLocalIndex === -1
          ? allRecords.length
          : allRecords.length - 1 - lastSixLocalIndex;

        if (paddedCount > 0) {
          const lastRecord = allRecords[allRecords.length - 1];
          result.push({
            poolId,
            poolName: lastRecord.poolName,
            character: '已垫',
            count: paddedCount,
            timestamp: lastRecord.gachaTs, // 使用最后一条抽卡的时间
          });
        }
      }
    }

    // 5. 全局按时间降序排序：从晚到早（最新记录在前）
    result.sort((a, b) => safeTimestamp(b.timestamp) - safeTimestamp(a.timestamp));

    sixStarRecordsWithCount.value = result;
    rollData.value = result.map(item => [
      item.poolId,
      item.poolName,
      item.character,
      item.count,
    ]);

  } catch (err) {
    console.error('处理抽卡数据失败', err);
  }
});

// ========== 计算属性 ==========

const totalPulls = computed(() => {
  return sixStarRecordsWithCount.value.reduce((sum, r) => sum + r.count, 0);
});

const poolSummary = computed(() => {
  const summary = {
    limited: { total: 0, count: 0 },
    permanent: { total: 0, count: 0 },
    weapon: { total: 0, count: 0 },
  };

  for (const record of sixStarRecordsWithCount.value) {
    const type = getPoolType(record.poolId);
    summary[type].total += record.count;
    summary[type].count += 1;
  }

  return {
    limited: {
      total: summary.limited.total,
      average: summary.limited.count > 0 ? summary.limited.total / summary.limited.count : 0,
    },
    permanent: {
      total: summary.permanent.total,
      average: summary.permanent.count > 0 ? summary.permanent.total / summary.permanent.count : 0,
    },
    weapon: {
      total: summary.weapon.total,
      average: summary.weapon.count > 0 ? summary.weapon.total / summary.weapon.count : 0,
    },
  };
});

const poolDistribution = computed(() => {
  const map: Record<string, { count: number; ratio: number }> = {};
  const total = totalPulls.value;

  for (const r of sixStarRecordsWithCount.value) {
    if (!map[r.poolName]) {
      map[r.poolName] = { count: 0, ratio: 0 };
    }
    map[r.poolName].count += r.count;
  }

  Object.values(map).forEach(item => {
    item.ratio = total > 0 ? item.count / total : 0;
  });

  return map;
});

const topCharacters = computed(() => {
  const freq: Record<string, number> = {};
  for (const r of sixStarRecordsWithCount.value) {
    freq[r.character] = (freq[r.character] || 0) + 1;
  }
  return Object.entries(freq)
    .map(([name, times]) => ({ name, times }))
    .sort((a, b) => b.times - a.times)
    .slice(0, 3);
});

// sortedData：直接使用 sixStarRecordsWithCount（已是降序）
const sortedData = computed(() => [...sixStarRecordsWithCount.value]);

// consecutiveGroups：按 sortedData 顺序分组（从晚到早）
const consecutiveGroups = computed(() => {
  const groups: Array<{ poolName: string; records: typeof sixStarRecordsWithCount.value }> = [];
  let currentGroup: { poolName: string; records: typeof sixStarRecordsWithCount.value } | null = null;

  for (const record of sortedData.value) {
    if (!currentGroup || currentGroup.poolName !== record.poolName) {
      currentGroup = { poolName: record.poolName, records: [] };
      groups.push(currentGroup);
    }
    currentGroup.records.push(record);
  }
  return groups;
});

const maxCount = computed(() => {
  return Math.max(...consecutiveGroups.value.flatMap(group => group.records.map(r => r.count)), 1);
});

const getBarWidth = (count: number) => {
  return (count / maxCount.value) * 95;
};

const getBarColor = (count: number) => {
  const hue = 200 - (count / maxCount.value) * 100;
  return `hsl(${hue}, 70%, 65%)`;
};

const selectedPool = ref<'limited' | 'permanent' | 'weapon'>('limited');
const selectPool = (pool: 'limited' | 'permanent' | 'weapon') => {
  selectedPool.value = pool;
};

const filteredConsecutiveGroups = computed(() => {
  if (!selectedPool.value) return consecutiveGroups.value;
  return consecutiveGroups.value.filter(
    segment => getPoolType(segment.records[0]?.poolId || '') === selectedPool.value
  );
});
</script>

<style scoped>
.gacha-overview {
  padding: 16px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
}

/* 使用 CSS Grid 布局，响应式 */
.pool-cards {
  display: grid;
  max-width: 900px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.pool-card {
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pool-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

.pool-name {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 12px;
  text-align: center;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
}

.label {
  color: #6b7280;
}

.value {
  font-weight: 600;
  color: #1f2937;
}

/* 可选：为不同类型添加颜色区分（通过边框或背景） */
.pool-card--limited {
  border-top: 4px solid #ec4899; /* 粉红 - 限定 */
}
.pool-card--permanent {
  border-top: 4px solid #3b82f6; /* 蓝色 - 常驻 */
}
.pool-card--weapon {
  border-top: 4px solid #8b5cf6; /* 紫色 - 武器 */
}

.gacha-bar-container {
  flex-grow: 1;
}

.gacha-bar {
  height: 16px;
  border-radius: 8px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.gacha-bar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}
.gacha-bar-text {
  white-space: nowrap;
}
.progress-text {
  color: white;
  font-size: 0.85rem;
  font-weight: bold;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}
</style>