<template>
  <div>
    <!-- 数据收集 -->
    <div v-if="viewMode === 'collect'" class="collect-form">
      <header class="page-title">导入抽卡记录</header>

      <div class="form-group">
        <label>UID</label>
        <input
          v-model="inputUid"
          type="text"
          placeholder="请输入UID"
          :disabled="isSubmitting"
        />
      </div>

      <div class="form-group">
        <label>查询链接</label>
        <textarea
          v-model="inputUrl"
          placeholder="粘贴完整的URL"
          rows="3"
          :disabled="isSubmitting"
        ></textarea>
        <p class="help-text">
          <a href="#">如何获取url</a>
        </p>
      </div>

      <p v-if="collectError" class="error-text">{{ collectError }}</p>

      <button
        @click="submitAndVerify"
        :disabled="isSubmitting"
        class="submit-btn"
      >
        {{ isSubmitting ? '验证中...' : '开始分析' }}
      </button>
    </div>

    <!-- 分析页面 -->
    <div v-if="viewMode === 'analyze'" class="gacha-analysis">
      <header class="page-title">抽卡分析</header>
      <div class="gacha-overview mb-8">
        <div class="gacha-overview-left">
          <div class="user-card">
            <div class="user-avatar">
              <img 
                src="" 
                alt="用户头像" 
                class="avatar-img"
              >
            </div>
              
            <div class="user-info">
              <div >
                <h3 class="user-name">{{ '管理员' }}</h3>
                <p class="user-uid">UID: {{ records[0]?.uid || '未知' }}</p>
              </div>
              <div class="user-stats-basic">
                <div class="stat-item">
                  <span class="stat-label">{{ $t('总抽数') }}：</span>
                  <span class="stat-value">{{ totalAllPulls }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">{{ $t('总六星数') }}：</span>
                  <span class="stat-value">{{ totalSixStarCount }}</span>
                </div>
              </div>
            </div>
              
            <div class="user-tags">
              <div 
                v-for="(tag, index) in gachaTags" 
                :key="index"
                class="gacha-tag"
                :class="`gacha-tag--${tag.type}`"
              >
                {{ tag.name }}
              </div>
              <div v-if="gachaTags.length === 0" class="no-tags">
                {{ $t('暂无特色抽卡记录') }}
              </div>
            </div>
          </div>
        </div>

        <div class="gacha-overview-right">
          <div class="pool-cards">
            <div
              v-for="(info, type) in poolSummary"
              :key="type"
              class="pool-card"
              :class="`pool-card--${type}`"
            >
              <div class="pool-card-header">
                <span class="pool-card-name">{{ getDisplayName(type) }}</span>
              </div>
              
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
                <div class="stat-item" v-if="type !== 'limited'">
                  <span class="label">{{ $t('平均出货数') }}：</span>
                  <span class="value">{{ info.average.toFixed(1) }}</span>
                </div>
                <div class="stat-item" v-if="type === 'limited'">
                  <span class="label">{{ $t('UP平均') }}：</span>
                  <span class="value">{{ info.nonPityAverage.toFixed(1) }}</span>
                </div>
              </div>
            </div>
          </div>
          
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
      </div>


      <div class="gacha-dashboard">
        <div style="display: flex; width: 100%; justify-content: center;">
          <div class="pool-selector">
            <v-btn
              class="pool-selector__btn"
              :class="{ 'pool-selector__btn--active': selectedPool === 'limited' }"
              @click="selectPool('limited')"
              variant="flat" 
              elevation="0" 
            >
              {{ $t('限定池') }}
            </v-btn>
            <v-btn
              class="pool-selector__btn"
              :class="{ 'pool-selector__btn--active': selectedPool === 'permanent' }"
              @click="selectPool('permanent')"
              variant="flat"
              elevation="0"
            >
              {{ $t('常驻池') }}
            </v-btn>
            <v-btn
              class="pool-selector__btn"
              :class="{ 'pool-selector__btn--active': selectedPool === 'weapon' }"
              @click="selectPool('weapon')"
              variant="flat"
              elevation="0"
            >
              {{ $t('武器池') }}
            </v-btn>
          </div>
        </div>

        <div 
          v-if="!filteredConsecutiveGroups || filteredConsecutiveGroups.length === 0" 
          style="width: 100%; margin: 20px 0; text-align: center; padding: 48px 0;"
        >
          <div style="font-size: 1rem; color: #6b7280; font-weight: 500;">
            {{ $t('暂无该卡池的抽卡数据') }}
          </div>
        </div>

        <div v-else v-for="(segment, idx) in filteredConsecutiveGroups" :key="idx" class="mb-8">
          <h2 class="text-h5 mb-3">{{ segment.poolName }}</h2>

          <div class="custom-gacha-list">
            <div 
              v-if="!segment.records || segment.records.length === 0" 
              style="width: 100%; background-color: #f9fafb; border-radius: 8px; margin: 8px 0; padding: 24px 0; text-align: center;"
            >
              <div style="font-size: 0.9rem; color: #9ca3af;">
                {{ $t('该卡池分组暂无抽卡记录') }}
              </div>
            </div>

            <div v-else>
              <div
                v-for="(record, index) in segment.records"
                :key="`${idx}-${index}`"
                class="custom-gacha-item mb-2"
                :class="{ 'on-banner': isOnBanner(record) }"
              >
                <div class="character-name font-weight-bold" style="width: 80px;">
                  {{ record.character }}
                </div>
                <div class="gacha-bar-container">
                  <div
                    class="gacha-bar"
                    :class="getBarType(record)"
                    :style="{ width: `${getBarWidth(record.count)}%` }"
                  >
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

        <div class="action-buttons-container">
          <div class="action-buttons">
            <button @click="goToUpdate" class="btn update-btn">
              更新抽卡数据
            </button>
            <button @click="confirmClearCache" class="btn clear-btn">
              删除本地数据
            </button>
          </div>
        </div>

      </div>

      <div style=" display: none;margin: 20px auto; max-width: 800px; font-family: Arial, sans-serif;">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
// import data from '@/custom/core/gacha-analysis-example.json';
import { gachaPools } from '@/custom/core/gacha-pool-info';

const viewMode = ref<'collect' | 'analyze'>('collect');

const inputUid = ref('');
const inputUrl = ref('');
const isSubmitting = ref(false);
const collectError = ref('');
const records = ref<GachaRecord[]>([]);
const rollData = ref<Array<[string, string, string, number]>>([]);
const sixStarRecordsWithCount = ref<SixStarEntry[]>([]);
const realSixStarRecords = ref<SixStarEntry[]>([]); 

// const fetchedRecords = ref<GachaRecord[]>([]);


//原始数据
interface GachaRecord {
  id: number;
  endfieldUid: string;
  uid: string;
  poolId: string;
  poolName: string;
  charId: string;
  charName: string;
  rarity: number;
  isFree: boolean;
  isNew: boolean;
  gachaTs: string | number;
  seqId: string;
  lang: string;
  poolType: string;
  serverId: string;
}

interface SixStarEntry {
  poolName: string;
  poolId: string;
  seqId: string;
  character: string;
  count: number;
  timestamp: string | number;
}

function safeTimestamp(ts: string | number): number {
  if (typeof ts === 'number') return ts;
  const num = Number(ts);
  if (!isNaN(num)) return num;
  return new Date(ts).getTime();
}

function getPoolType(poolId: string): 'limited' | 'permanent' | 'weapon' {
  if (poolId.startsWith('special')) {
    return 'limited';
  }
  if (poolId.startsWith('weapon') || poolId.includes('weapon')) {
    return 'weapon';
  }
  return 'permanent';
}

const DISPLAY_NAMES: Record<'limited' | 'permanent' | 'weapon', string> = {
  limited: '限定',
  permanent: '常驻',
  weapon: '武库配额',
};

function getDisplayName(key: 'limited' | 'permanent' | 'weapon'): string {
  return DISPLAY_NAMES[key];
}

const poolColorMap: Record<string, string> = {
  '基础寻访': 'deep-purple',
  '启程寻访': 'cyan',
  '特许寻访': 'amber',
};
function getPoolColor(poolName: string): string {
  return poolColorMap[poolName] || 'amber darken-3';
}

const upCharMap = new Map<string, string>();
gachaPools.forEach(pool => {
  upCharMap.set(pool.poolId, pool.upCharName);
});

//比较seqid
function parseSeqId(seqId: string): number {
  const num = parseInt(seqId, 10);
  return isNaN(num) ? 0 : num;
}

// ========== 提交并验证用户输入的 UID 和 URL ==========
// ========== 缓存相关常量 ==========
const CACHE_KEY = 'endfield_gacha_records_v1';
const LAST_UID_KEY = 'endfield_last_uid';

// ========== 从 localStorage 加载缓存记录 ==========
function loadCachedRecords(uid: string): GachaRecord[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];

    const cache = JSON.parse(raw) as { uid: string; records: GachaRecord[] };
    return cache.uid === uid ? cache.records : [];
  } catch (e) {
    console.warn('缓存读取失败，清空旧数据', e);
    localStorage.removeItem(CACHE_KEY);
    return [];
  }
}

// ========== 保存记录到 localStorage ==========
function saveRecordsToCache(uid: string, records: GachaRecord[]) {
  try {
    const cache = { uid, records };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    localStorage.setItem(LAST_UID_KEY, uid); // 同时保存 UID 用于恢复
  } catch (e) {
    console.error('缓存保存失败', e);
  }
}

// ========== 提交并验证（含缓存合并）==========
async function submitAndVerify() {
  const uid = inputUid.value.trim();
  const url = inputUrl.value.trim();

  if (!uid || !url) {
    collectError.value = '请填写 UID 和抽卡链接';
    return;
  }

  try {
    new URL(url);
  } catch {
    collectError.value = '抽卡链接格式不正确，请粘贴完整的网页地址';
    return;
  }

  isSubmitting.value = true;
  collectError.value = '';

  try {
    const BASE_URL = 'https://endfield.backend.yituliu.cn';

    // Step 1: 上传记录
    const uploadRes = await fetch(`${BASE_URL}/pool-record/character/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, url }),
    });

    if (!uploadRes.ok) {
      throw new Error(`上传失败（状态码 ${uploadRes.status}）`);
    }

    // Step 2: 查询记录
    const listUrl = `${BASE_URL}/pool-record/character/list?uid=${encodeURIComponent(uid)}`;
    const listRes = await fetch(listUrl, { method: 'GET' });

    if (!listRes.ok) {
      throw new Error(`查询失败（状态码 ${listRes.status}）`);
    }

    const data = await listRes.json();

    // Step 3: 转换新数据
    const newRecords: GachaRecord[] = (data.data || [])
      .map((item: any) => ({
        id: item.id,
        poolId: item.poolId,
        poolName: item.poolName,
        charName: item.charName,
        rarity: item.rarity,
        gachaTs: item.gachaTs,
        seqId: item.seqId,
        endfieldUid: item.endfieldUid || '',
        uid: item.uid || '',
        charId: item.charId || '',
        isFree: item.isFree ?? false,
        isNew: item.isNew ?? false,
        lang: item.lang || 'zh-cn',
        poolType: item.poolType || '',
        serverId: item.serverId || '',
      }))
      .sort((a: GachaRecord, b: GachaRecord) => parseSeqId(a.seqId) - parseSeqId(b.seqId));

    if (newRecords.length === 0) {
      throw new Error('未找到任何抽卡记录，请确认链接有效且包含数据');
    }

    // ✅ Step 4: 加载缓存并合并（按 seqId 去重）
    const cachedRecords = loadCachedRecords(uid);

    const recordMap = new Map<string, GachaRecord>();
    // 先加缓存（旧数据）
    for (const rec of cachedRecords) {
      recordMap.set(rec.seqId, rec);
    }
    // 再加新数据（自动覆盖同 seqId，但通常不会冲突）
    for (const rec of newRecords) {
      recordMap.set(rec.seqId, rec);
    }

    const mergedRecords = Array.from(recordMap.values())
      .sort((a: GachaRecord, b: GachaRecord) => parseSeqId(a.seqId) - parseSeqId(b.seqId));

    // ✅ Step 5: 保存合并后的数据到缓存
    saveRecordsToCache(uid, mergedRecords);

    // ✅ Step 6: 更新响应式状态
    records.value = mergedRecords;
    processGachaData(mergedRecords);
    viewMode.value = 'analyze';

  } catch (err: any) {
    console.error('数据验证失败:', err);
    collectError.value = err.message || '网络错误，请稍后重试';
  } finally {
    isSubmitting.value = false;
  }
}

// ========== 处理抽卡数据：分组、统计、生成时间线 ==========
function processGachaData(list: GachaRecord[]) {
  // 1. 按 poolId 分组所有记录
  const poolAllRecords: Record<string, GachaRecord[]> = {};
  for (const record of list) {
    if (!poolAllRecords[record.poolId]) {
      poolAllRecords[record.poolId] = [];
    }
    poolAllRecords[record.poolId]!.push(record);
  }

  // 2. 提取所有六星记录，并按 poolId 分组
  const sixStarRecords = list.filter(r => r.rarity === 6);
  const poolSixStars: Record<string, GachaRecord[]> = {};
  for (const rec of sixStarRecords) {
    if (!poolSixStars[rec.poolId]) poolSixStars[rec.poolId] = [];
    poolSixStars[rec.poolId]!.push(rec);
  }

  // 3. 构建结果数组
  const resultWithPadded: SixStarEntry[] = []; // 含“已垫”
  const resultRealOnly: SixStarEntry[] = [];   // 仅真实六星

  for (const [poolId, allRecords] of Object.entries(poolAllRecords)) {
    const sixStars = poolSixStars[poolId] || [];
    const poolName = allRecords[0]?.poolName || poolId;

    // 构建 seqId → 局部索引映射（因已按 seqId 升序排）
    const localIndexBySeqId: Record<string, number> = {};
    allRecords.forEach((rec, idx) => {
      localIndexBySeqId[rec.seqId] = idx;
    });

    let lastSixLocalIndex = -1;

    // 处理真实六星
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
        seqId: six.seqId,
      };
      resultRealOnly.push(entry);
      resultWithPadded.push(entry);
      lastSixLocalIndex = localIdx;
    }

    // 插入“已垫”记录（如果最后有未出六星的抽数）
    if (allRecords.length > 0) {
      const paddedCount = lastSixLocalIndex === -1
        ? allRecords.length
        : allRecords.length - 1 - lastSixLocalIndex;

      if (paddedCount > 0) {
        const lastRecord = allRecords[allRecords.length - 1];
        resultWithPadded.push({
          poolId,
          poolName: lastRecord!.poolName,
          character: '已垫',
          count: paddedCount,
          timestamp: lastRecord!.gachaTs,
          seqId: lastRecord!.seqId,
        });
      }
    }
  }

  // 4. 按 seqId 降序排序（最新在前）
  const sortBySeqIdDesc = (a: { seqId: string }, b: { seqId: string }) =>
    parseSeqId(b.seqId) - parseSeqId(a.seqId);

  resultWithPadded.sort(sortBySeqIdDesc);
  resultRealOnly.sort(sortBySeqIdDesc);

  // 5. 更新响应式数据（供 UI 使用）
  sixStarRecordsWithCount.value = resultWithPadded;
  realSixStarRecords.value = resultRealOnly;
  rollData.value = resultWithPadded.map(item => [
    item.poolId,
    item.poolName,
    item.character,
    item.count,
  ]);
}

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
// ========== 新增：总抽数/总六星数计算属性 ==========
// 总抽数（所有卡池总抽数，含已垫）
const totalAllPulls = computed(() => {
  const { limited, permanent, weapon } = poolSummary.value;
  return limited.total + permanent.total + weapon.total;
});

// 总六星数（仅真实六星，不含已垫）
const totalSixStarCount = computed(() => {
  const { limited, permanent, weapon } = poolSummary.value;
  return limited.totalCount + permanent.totalCount + weapon.totalCount;
});
const totalPulls = computed(() => {
  return realSixStarRecords.value.reduce((sum, r) => sum + r.count, 0);
});

const poolSummary = computed(() => {
  // 初始化三类卡池的统计结构
  // 新增 nonPityTotal（不歪角色的总抽数）、nonPityAverage（出不歪的平均抽数）
  const summary = {
    limited: { 
      total: 0,
      average: 0, 
      nonPityCount: 0, 
      totalCount: 0, 
      nonPityTotal: 0, 
      nonPityAverage: 0 
    },
    permanent: { 
      total: 0, 
      average: 0, 
      nonPityCount: 0, 
      totalCount: 0, 
      nonPityTotal: 0, 
      nonPityAverage: 0 
    },
    weapon: { 
      total: 0, 
      average: 0, 
      nonPityCount: 0, 
      totalCount: 0, 
      nonPityTotal: 0, 
      nonPityAverage: 0 
    },
  };

  // Step 1: 统计「总抽数」（来自 sixStarRecordsWithCount，含“已垫”）
  // 同时统计「不歪角色的总抽数」
  for (const record of sixStarRecordsWithCount.value) {
    const type = getPoolType(record.poolId);
    summary[type].total += record.count;

    // 仅对「真实六星记录」且「不歪」的情况，累加不歪总抽数
    // 先找到对应的真实六星记录，匹配 seqId/poolId 确保数据对应
    const realRecord = realSixStarRecords.value.find(
      r => r.poolId === record.poolId && r.seqId === record.seqId
    );
    if (realRecord && isOnBanner(realRecord)) {
      summary[type].nonPityTotal += record.count;
    }
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

  // Step 3: 计算平均抽数
  for (const key of ['limited', 'permanent', 'weapon'] as const) {
    const s = summary[key];
    // 所有六星的平均抽数（总抽数 / 总出货次数）
    s.average = s.totalCount > 0 ? s.total / s.totalCount : 0;
    // 出不歪的平均抽数（不歪总抽数 / 不歪次数），避免除零
    s.nonPityAverage = s.nonPityCount > 0 ? s.total / s.nonPityCount : 0;
  }

  return summary;
});

// 卡池分布
const poolDistribution = computed(() => {
  const map: Record<string, { count: number; ratio: number }> = {};
  // 1. 先统计真实六星的抽数（原有逻辑）
  for (const r of realSixStarRecords.value) {
    if (!map[r.poolName]) {
      map[r.poolName] = { count: 0, ratio: 0 };
    }
    map[r.poolName]!.count += r.count;
  }

  // 2. 新增：统计“已垫”的抽数
  const paddedRecords = sixStarRecordsWithCount.value.filter(r => r.character === '已垫');
  for (const r of paddedRecords) {
    if (!map[r.poolName]) {
      map[r.poolName] = { count: 0, ratio: 0 };
    }
    map[r.poolName]!.count += r.count;
  }

  // 3. 计算总抽数（包含已垫）和占比
  const total = Object.values(map).reduce((sum, item) => sum + item.count, 0);
  
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

// ========== 特色抽卡 Tag 计算逻辑 ==========
interface GachaTag {
  name: string;
  type: 'lucky' | 'normal' | 'unlucky';
}

// 计算特色抽卡标签
const gachaTags = computed(() => {
  // 用 let 声明，允许后续修改
  let tags: GachaTag[] = [];
  const realSixStars = realSixStarRecords.value;
  
  // ========== 核心修改：使用 poolSummary 中已有的平均逻辑 ==========
  // 1. 先获取所有卡池的总抽数和总出货数（复用 poolSummary 的计算结果）
  const { limited, permanent, weapon } = poolSummary.value;
  // 计算全卡池综合平均出货数（和 poolSummary 逻辑一致）
  const totalAllPools = limited.total + permanent.total + weapon.total;
  const totalAllCounts = limited.totalCount + permanent.totalCount + weapon.totalCount;
  // 复用现有平均计算逻辑：总抽数 / 出货次数（避免除零）
  const avgPulls = totalAllCounts > 0 ? totalAllPools / totalAllCounts : 0;

  // 2. 添加平均出货数对应的等级标签（最前面展示）
  if (avgPulls > 0) {
    if (avgPulls <= 30) {
      tags.push({ name: '至尊欧皇', type: 'lucky' });
    } else if (avgPulls <= 40) {
      tags.push({ name: '欧皇', type: 'lucky' });
    } else if (avgPulls <= 60) {
      tags.push({ name: '路过的欧洲人', type: 'lucky' });
    } else if (avgPulls <= 76) {
      tags.push({ name: '小非酋', type: 'unlucky' });
    } else { // >75
      tags.push({ name: '血统纯正的非酋', type: 'unlucky' });
    }
  }

  // ========== 原有标签逻辑（保持不变，仅修复 const 报错） ==========
  // 1. 统计十连内多金标签（十连双金/三金）
  const sortedByTime = [...realSixStars].sort((a, b) => {
    const tsA = safeTimestamp(a.timestamp);
    const tsB = safeTimestamp(b.timestamp);
    return tsA - tsB;
  });

  for (let i = 0; i < sortedByTime.length; i++) {
    const current = sortedByTime[i];
    let multiCount = 1; // 至少1个六星
    let totalPullsInRange = current!.count;

    // 检查后续的六星是否在当前六星的10抽范围内
    for (let j = i + 1; j < sortedByTime.length; j++) {
      const next = sortedByTime[j];
      totalPullsInRange += next!.count;
      
      if (totalPullsInRange <= 10) {
        multiCount++;
      } else {
        break;
      }
    }

    // 添加对应标签（只添加一次，避免重复）
    if (multiCount === 2 && !tags.some(t => t.name === '十连双金')) {
      tags.push({ name: '十连双金', type: 'lucky' });
    } else if (multiCount >= 3 && !tags.some(t => t.name === '十连三金')) {
      tags.push({ name: '十连三金', type: 'lucky' });
      // 有三金就移除已有的双金标签（修复 const 赋值问题）
      const duplicateIndex = tags.findIndex(t => t.name === '十连双金');
      if (duplicateIndex !== -1) {
        tags.splice(duplicateIndex, 1);
      }
    }
  }

  // 2. 三连不歪（连续3次出UP角色）
  let consecutiveOnBanner = 0;
  for (const record of realSixStars) {
    if (isOnBanner(record)) {
      consecutiveOnBanner++;
      if (consecutiveOnBanner >= 3 && !tags.some(t => t.name === '三连不歪')) {
        tags.push({ name: '三连不歪', type: 'lucky' });
        break; // 找到就停止，避免重复
      }
    } else {
      consecutiveOnBanner = 0; // 歪了就重置计数
    }
  }

  // 3. 单抽出金（1抽出六星）
  if (realSixStars.some(r => r.count === 1) && !tags.some(t => t.name === '单抽出金')) {
    tags.push({ name: '单抽出金', type: 'lucky' });
  }

  // 4. 八十连保底（超过80抽才出六星）
  if (realSixStars.some(r => r.count >= 80) && !tags.some(t => t.name === '八十连保底')) {
    tags.push({ name: '八十连保底', type: 'unlucky' });
  }

  // 5. 全勤不歪（所有限定池六星都没歪）
  const limitedSixStars = realSixStars.filter(r => getPoolType(r.poolId) === 'limited');
  if (limitedSixStars.length > 0 && limitedSixStars.every(isOnBanner) && !tags.some(t => t.name === '全勤不歪')) {
    tags.push({ name: '全勤不歪', type: 'lucky' });
  }

  return tags;
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


//若本地有缓存则读取缓存，直接进入分析页面
onMounted(() => {
  const lastUid = localStorage.getItem(LAST_UID_KEY);
  if (lastUid) {
    const cached = loadCachedRecords(lastUid);
    if (cached.length > 0) {
      inputUid.value = lastUid;
      records.value = cached;
      processGachaData(cached);
      viewMode.value = 'analyze';
    }
  }
});

// ========== 返回收集页 ==========
function goToUpdate() {
  viewMode.value = 'collect';
  inputUid.value = '';
  inputUrl.value = '';
}

// ========== 确认并清除缓存 ==========
function confirmClearCache() {
  if (confirm('⚠️ 确定要删除所有本地抽卡记录吗？\n此操作不可恢复！（抽卡数据均保存在本地）')) {
    try {
      localStorage.removeItem('endfield_gacha_records_v1');
      localStorage.removeItem('endfield_last_uid');
      
      // 清空当前响应式数据
      records.value = [];
      sixStarRecordsWithCount.value = [];
      realSixStarRecords.value = [];
      rollData.value = [];
      
      // 跳转回收集页
      viewMode.value = 'collect';
      alert('本地数据已清除');
    } catch (e) {
      console.error('清除缓存失败', e);
      alert('清除失败，请手动清除浏览器数据');
    }
  }
}
</script>

<style scoped>
@import "assets/css/gacha-analysis.css";
</style>