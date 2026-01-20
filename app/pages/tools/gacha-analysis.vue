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
          <!-- 标题区域：精简结构，突出类型 -->
          <div class="pool-card-header">
            <span class="pool-card-name">{{ getDisplayName(type) }}</span>
          </div>
          
          <!-- 核心数据：放大突出，作为视觉焦点 -->
          <div class="pool-card-core">
            <span class="total-gacha-count">{{ info.total }}</span>
            <span class="core-label">{{ $t('抽') }}</span>
          </div>
          
          <div class="stats">
            <div class="stat-item" v-if="type !== 'limited' && type !== 'weapon'">
              <span class="label">{{ $t('六星') }}：</span>
              <span class="value">{{ info.totalCount }}</span>
            </div>
            <div class="stat-item" v-if="type === 'limited' || type === 'weapon'">
              <span class="label">{{ $t('不歪/六星') }}：</span>
              <span class="value">{{ info.nonPityCount }} / {{ info.totalCount }}</span>
            </div>
            <div class="stat-item">
              <span class="label">{{ $t('平均出货数') }}：</span>
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

      <!-- 自定义列表容器 -->
      <div class="custom-gacha-list">
        <div
          v-for="(record, index) in segment.records"
          :key="`${idx}-${index}`"
          class="custom-gacha-item mb-2"
          :class="{ 'on-banner': isOnBanner(record) }"
        >
          <!-- 角色名 -->
          <div class="character-name font-weight-bold" style="width: 100px;">
            {{ record.character }}
          </div>

          <!-- 横向条形图 -->
          <div class="gacha-bar-container">
            <div
              class="gacha-bar"
              :class="getBarType(record)"
              :style="{ width: `${getBarWidth(record.count)}%` }"
            >
              <!-- 抽数 -->
              <div class="pull-count" style="width: 60px; text-align: right; margin-right: 16px;">
                {{ record.count }} 抽
              </div>
            </div>
            <span v-if="isOffPool(record) && record.count > 60" class="off-label">超非</span>
            <span v-if="record.character !== '已垫' && record.count <= 10"  class="lucky-label">超欧</span>
          </div>
        </div>
      </div>
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
import { gachaPools } from '@/custom/core/gacha-pool-info';

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
  seqId: string;
  poolId: string;
  poolName: string;
  charName: string;
  rarity: number;
  gachaTs: string | number;
}

interface SixStarEntry {
  poolName: string;
  poolId: string;
  character: string;
  count: number;
  timestamp: string | number;
}

// ========== 响应式数据 ==========
const records = ref<GachaRecord[]>([]);
const rollData = ref<Array<[string, string, string, number]>>([]); // 含“已垫”，用于 UI 表格/导出
const sixStarRecordsWithCount = ref<SixStarEntry[]>([]); // 含“已垫”，用于前端展示（时间线、分组）
const realSixStarRecords = ref<SixStarEntry[]>([]);       // 仅真实六星，用于所有统计计算

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

// 构建 poolId -> upCharName 的映射
const upCharMap = new Map<string, string>();
gachaPools.forEach(pool => {
  upCharMap.set(pool.poolId, pool.upCharName);
});

//比较seqid
function parseSeqId(seqId: string): number {
  const num = parseInt(seqId, 10);
  return isNaN(num) ? 0 : num;
}
// ========== 生命周期：加载并处理数据 ==========
onMounted(async () => {
  try {
    // 1. 解析数据，并按 seqId 升序排序（旧 → 新），用于正确计算抽数
    const list: GachaRecord[] = data.data
      .map((item: any) => ({
        id: item.id,
        poolId: item.poolId,
        poolName: item.poolName,
        charName: item.charName,
        rarity: item.rarity,
        gachaTs: item.gachaTs,
        seqId: item.seqId, 
      }))
      .sort((a, b) => parseSeqId(a.seqId) - parseSeqId(b.seqId));

    records.value = list;

    // 2. 按 poolId 分组
    const poolAllRecords: Record<string, GachaRecord[]> = {};
    for (const record of list) {
      if (!poolAllRecords[record.poolId]) {
        poolAllRecords[record.poolId] = [];
      }
      poolAllRecords[record.poolId].push(record);
    }

    // 3. 提取6星
    const sixStarRecords = list.filter(r => r.rarity === 6);
    const poolSixStars: Record<string, GachaRecord[]> = {};
    for (const rec of sixStarRecords) {
      if (!poolSixStars[rec.poolId]) poolSixStars[rec.poolId] = [];
      poolSixStars[rec.poolId].push(rec);
    }

    const resultWithPadded: SixStarEntry[] = [];
    const resultRealOnly: SixStarEntry[] = [];

    // 4. 处理每个卡池
    for (const [poolId, allRecords] of Object.entries(poolAllRecords)) {
      const sixStars = poolSixStars[poolId] || [];
      const poolName = allRecords[0]?.poolName || poolId;

      // 构建 seqId 到局部索引的映射（因为已按 seqId 升序排好）
      const localIndexBySeqId: Record<string, number> = {};
      allRecords.forEach((rec, idx) => {
        localIndexBySeqId[rec.seqId] = idx;
      });

      let lastSixLocalIndex = -1;

      // 处理真实6星
      for (const six of sixStars) {
        const localIdx = localIndexBySeqId[six.seqId];
        if (localIdx === undefined) continue;

        const count = lastSixLocalIndex === -1 ? localIdx + 1 : localIdx - lastSixLocalIndex;
        const entry = {
          poolId,
          poolName,
          character: six.charName,
          count,
          timestamp: six.gachaTs,
          seqId: six.seqId, // 👈 保留 seqId 用于最终排序
        };
        resultRealOnly.push(entry);
        resultWithPadded.push(entry);
        lastSixLocalIndex = localIdx;
      }

      // 插入“已垫”记录
      if (allRecords.length > 0) {
        const paddedCount = lastSixLocalIndex === -1
          ? allRecords.length
          : allRecords.length - 1 - lastSixLocalIndex;

        if (paddedCount > 0) {
          const lastRecord = allRecords[allRecords.length - 1];
          resultWithPadded.push({
            poolId,
            poolName: lastRecord.poolName,
            character: '已垫',
            count: paddedCount,
            timestamp: lastRecord.gachaTs,
            seqId: lastRecord.seqId,
          });
        }
      }
    }

    // 5. 最终按 seqId 降序排序（最新在前）
    const sortBySeqIdDesc = (a: { seqId: string }, b: { seqId: string }) =>
      parseSeqId(b.seqId) - parseSeqId(a.seqId);

    resultWithPadded.sort(sortBySeqIdDesc);
    resultRealOnly.sort(sortBySeqIdDesc);

    // 赋值
    sixStarRecordsWithCount.value = resultWithPadded;
    realSixStarRecords.value = resultRealOnly;
    rollData.value = resultWithPadded.map(item => [
      item.poolId,
      item.poolName,
      item.character,
      item.count,
    ]);

  } catch (err) {
    console.error('处理抽卡数据失败', err);
  }
});

// 判断是否歪了（仅对真实六星有效，“已垫”不参与判断）
function isOffPool(record: SixStarEntry): boolean {
  if (record.character === '已垫') {
    return false; 
  }
  const upChar = upCharMap.get(record.poolId);
  if (!upChar) {
    return false;
  }
  return record.character !== upChar;
}
// ========== 计算属性：全部基于 realSixStarRecords ==========

const totalPulls = computed(() => {
  return realSixStarRecords.value.reduce((sum, r) => sum + r.count, 0);
});

const poolSummary = computed(() => {
  // 初始化三类卡池的统计结构
  const summary = {
    limited: { total: 0, average: 0, nonPityCount: 0, totalCount: 0 },
    permanent: { total: 0, average: 0, nonPityCount: 0, totalCount: 0 },
    weapon: { total: 0, average: 0, nonPityCount: 0, totalCount: 0 },
  };

  // Step 1: 统计「总抽数」（来自 sixStarRecordsWithCount，含“已垫”）
  for (const record of sixStarRecordsWithCount.value) {
    const type = getPoolType(record.poolId);
    summary[type].total += record.count;
  }

  // Step 2: 遍历「真实六星」，统计出货总数 + 不歪（UP）次数
  for (const record of realSixStarRecords.value) {
    const type = getPoolType(record.poolId);
    summary[type].totalCount += 1; // 每条都是一个六星出货

    // 判断是否“不歪”：即角色 == 当前卡池 UP 角色
    if (isOnBanner(record)) {
      summary[type].nonPityCount += 1;
    }
  }

  // Step 3: 计算平均抽数（总抽数 / 出货次数），避免除零
  for (const key of ['limited', 'permanent', 'weapon'] as const) {
    const s = summary[key];
    s.average = s.totalCount > 0 ? s.total / s.totalCount : 0;
  }

  return summary;
});

// 卡池分布
const poolDistribution = computed(() => {
  const map: Record<string, { count: number; ratio: number }> = {};
  const total = totalPulls.value;

  for (const r of realSixStarRecords.value) {
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
  for (const r of realSixStarRecords.value) {
    freq[r.character] = (freq[r.character] || 0) + 1;
  }
  return Object.entries(freq)
    .map(([name, times]) => ({ name, times }))
    .sort((a, b) => b.times - a.times)
    .slice(0, 3);
});



// ========== UI 相关：基于 sixStarRecordsWithCount ==========

const sortedData = computed(() => [...sixStarRecordsWithCount.value]);

const consecutiveGroups = computed(() => {
  const groups: Array<{ poolName: string; records: SixStarEntry[] }> = [];
  let currentGroup: { poolName: string; records: SixStarEntry[] } | null = null;

  for (const record of sortedData.value) {
    if (!currentGroup || currentGroup.poolName !== record.poolName) {
      currentGroup = { poolName: record.poolName, records: [] };
      groups.push(currentGroup);
    }
    currentGroup.records.push(record);
  }
  return groups;
});



const getBarWidth = (count: number) => {
  return (count / 80) * 95;
};


// 返回用于样式的状态标识
function getBarType(record: SixStarEntry): string {
  // 特殊条目：已垫

  const upChar = upCharMap.get(record.poolId);
  const isOnBanner = !!upChar && record.character === upChar;
  const isOffPool = !!upChar && record.character !== upChar;

  if (isOnBanner) {
    return 'gacha-on-banner'; 
  }
  if (record.count <= 10) {
    return 'gacha-lucky'; 
  }
  if(record.count > 10 && record.count <= 50) {
    return 'gacha-normal';
  }
  if(record.count > 50) {
    return 'gacha-unlucky';
  }
  if (isOffPool) {
    if (record.count > 70) {
      return 'gacha-unlucky';
    } else {
      return 'gacha-normal';
    }
  }

  // 兜底（比如没有 UP 信息）
  return 'default';
}

function isOnBanner(record: SixStarEntry): boolean {
  const upChar = upCharMap.get(record.poolId);
  return !!upChar && record.character === upChar;
}
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

.pool-cards {
  display: grid;
  margin-top: 10px;
  padding: 16px;
  max-width: 900px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px; 
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}


.pool-card {
  border-radius: 12px;
  padding: 16px 12px; 
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease; /* 统一过渡效果 */
  background-color: rgba(255, 255, 255, 0.6); 
  display: flex;
  flex-direction: column;
  height: 140px; 
}

.pool-card:hover {
  transform: translateY(-1px); 
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.09); 
  background-color: rgba(255, 255, 255, 0.8);
}

.pool-card-header {
  margin-bottom: 8px;
}
.pool-card-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: #1f2937;
}

.pool-card-core {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 12px;
}
.total-gacha-count {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}
.core-label {
  font-size: 0.85rem;
  color: #6b7280;
}

/* 辅助数据：精简排版，弱化次要信息 */
.stats {
  display: flex;
  flex-direction: column;
  gap: 6px; /* 缩小辅助数据间距 */
  margin-top: auto; /* 推到底部，优化空间利用 */
}
.stat-item {
  display: flex;
  justify-content: space-between; /* 标签左，数值右，更清晰 */
  font-size: 0.85rem; /* 缩小字号，突出核心 */
  line-height: 1.2;
}
.label {
  color: #6b7280;
  font-weight: 400;
}
.value {
  font-weight: 600;
  color: #374151;
}

.pool-card--limited {
  border-left: 5px solid rgb(255, 241, 50); 
}
.pool-card--permanent {
  border-left: 5px solid #3b95f6;
}
.pool-card--weapon {
  border-left: 5px solid #8b5cf6;
}

.custom-gacha-item {
  display: flex;
  align-items: center;
  /* 可选：加个内边距或背景让条目更清晰 */
  padding: 8px 0;
}

.character-name,
.pull-count {
  /* 确保文字垂直居中、不换行 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gacha-bar-container {
  display: flex;
  align-items: center;
  flex: 1;
  height: 28px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  overflow: visible; 
}


/* 基础样式 */
.gacha-bar {
  height: 100%;
  border-radius: 4px;
  transition: all 0.3s ease;
  align-items: center;

}


/* 低抽数 */
.gacha-bar.gacha-lucky {
  background: #4ccdf5;
  background: 
    repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15),
      rgba(255, 255, 255, 0.15) 4px,
      rgba(255, 255, 255, 0.05) 4px,
      rgba(255, 255, 255, 0.05) 8px
    ),
    #4ccdf5;
}

/* 普通 */
.gacha-bar.gacha-normal {
  background:
    repeating-linear-gradient(
      135deg,
      rgba(255, 255, 102, 0.8), /* 更亮的黄色条纹 */
      rgba(255, 255, 102, 0.8) 4px,
      rgba(255, 255, 102, 0.4) 4px,
      rgba(255, 255, 102, 0.4) 8px
    ),
    rgb(255, 241, 50); /* 较暗的基础黄色 */
}

/* 高抽数 */
.gacha-bar.gacha-unlucky {
  background: linear-gradient(90deg, #ffffff00, #fb8238);
  background: 
    repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15),
      rgba(255, 255, 255, 0.15) 4px,
      rgba(255, 255, 255, 0.05) 4px,
      rgba(255, 255, 255, 0.05) 8px
    ),
    #fb8238;
}

.gacha-bar.gacha-on-banner {
  background:
    repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15), /* 白色极淡 - 条纹暗部 */
      rgba(255, 255, 255, 0.15) 4px,
      rgba(255, 255, 255, 0.05) 4px,
      rgba(255, 255, 255, 0.05) 8px
    ),
    linear-gradient(
      90deg,         
      #4ccdf5,        
      #79fff5,  
      #93ffbc, 
      #fdfa80,  
      #fdc675,   
      #fb8238  
    );
}



.off-label {
  margin-left: 8px;
  height: 80%;
  font-size: 12px;
  font-weight: bold;
  color: #e74c3c;
  background: #f9d5d5;
  padding: 2px 6px;
  border-radius: 3px;
  white-space: nowrap;
}

.lucky-label {
  margin-left: 8px;
  height: 80%;
  color: black;
  font-size: 12px;
  font-weight: bold;
  background: rgb(253, 250, 38);
  padding: 2px 6px;
  border-radius: 3px;
}
</style>