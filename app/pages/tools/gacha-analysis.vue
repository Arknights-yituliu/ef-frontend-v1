<!--{-->
<!--"i18nKey": "gachaAnalysis",-->
<!--"nameKey": "menu.gachaAnalysis",-->
<!--"routePath": "/tools/gacha-analysis",-->
<!--"vuetifyIcon": "mdi-chart-bar"-->
<!--},-->


<template>

  <div style=" border-radius: 16px; padding: 24px;">
    <!-- 数据收集 -->
    <div v-if="viewMode === 'collect'" class="collect-form">
      <header class="page-title">导入抽卡记录</header>

      <div class="form-group">
        <label>在线更新（粘贴查询链接）</label>
        <textarea
          v-model="inputCredential"
          :disabled="isSubmitting"
          placeholder="请将查询链接内所有内容粘贴进来"
          rows="3"
        />
        <p class="help-text">
          <a href="https://web-api.hypergryph.com/account/info/hg" target="_blank">登陆鹰角通行证后，点击获取查询链接</a>
        </p>
      </div>

      <div class="form-group" style="margin-top: 20px; padding: 16px; border: 2px dashed #eee; border-radius: 8px;">
        <label style="display: block; margin-bottom: 8px; font-weight: bold;">本地导入（JSON备份文件）</label>
        <input 
          accept=".json" 
          :disabled="isSubmitting" 
          style="font-size: 14px;" 
          type="file"
          @change="handleImportFile"
        />
      </div>

      <p v-if="collectError" class="error-text">{{ collectError }}</p>

      <button
        class="submit-btn"
        :disabled="isSubmitting"
        @click="submitAndVerify"
      >
        {{ isSubmitting ? '验证中...' : '开始分析' }}
      </button>
    </div>

    <!-- 分析页面 -->
    <div v-if="viewMode === 'analyze'" class="gacha-analysis">
      <div class="gacha-overview mb-8">
        <div class="gacha-overview-left">
          <div class="user-card">
            <div class="user-avatar">
              <img
                alt="用户头像"
                class="avatar-img"
                src="https://cos.yituliu.cn/endfield/unpack-images/characters/icon_chr_0003_endminf.webp "
              >
            </div>

            <div class="user-info">
              <div >
                <h3 class="user-name">{{ '管理员' }}</h3>
                <p class="user-uid">UID: {{ displayUid }}</p>
              </div>
              <div class="user-stats-basic">
                <div class="stat-item">
                  <span class="stat-label">{{ '总抽数' }}：</span>
                  <span class="stat-value">{{ totalAllPulls }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">{{ '总六星数' }}：</span>
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
                {{ '暂无特色抽卡记录' }}
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
                <span class="core-label">{{ '抽' }}</span>
              </div>

              <div class="stats">
                <div v-if="type !== 'limited' && type !== 'weapon'" class="stat-item">
                  <span class="label">{{ '六星' }}：</span>
                  <span class="value">{{ info.totalCount }}</span>
                </div>
                <div v-if="type === 'limited' || type === 'weapon'" class="stat-item">
                  <span class="label">{{ '不歪/六星' }}：</span>
                  <span class="value">{{ info.nonPityCount }} / {{ info.totalCount }}</span>
                </div>
                <div v-if="type !== 'limited'" class="stat-item">
                  <span class="label">{{ '平均出货数' }}：</span>
                  <span class="value">{{ info.average.toFixed(1) }}</span>
                </div>
                <div v-if="type === 'limited'" class="stat-item">
                  <span class="label">{{ '毕业平均' }}：</span>
                  <span class="value">{{ info.graduateAverage.toFixed(1) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <h3 class="text-subtitle-2 mb-2">{{ '抽数分布' }}</h3>
            <div class="d-flex flex-wrap">
                <v-chip
                  v-for="([pool, item], index) in Object.entries(poolDistribution).slice(0, 5)"
                  :key="pool"
                  :color="getPoolColor(pool)"
                  label
                  size="small"
                  style="margin-right: 5px;"
                >
                {{ pool }}: {{ item.count }} ({{ Math.round(item.ratio * 100) }}%)
              </v-chip>
            </div>
          </div>

          <div class="mt-4">
            <h3 class="text-subtitle-2 mb-2">{{ '角色抽取频次' }}</h3>
            <div class="d-flex flex-wrap gap-2">
              <v-chip
                v-for="(char, index) in topCharacters"
                :key="char.name"
                :color="index === 0 ? 'purple' : index === 1 ? 'indigo' : 'teal'"
                label
                size="small"
                style="margin-right: 5px;"
              >
                {{ char.name }} ×{{ char.times }}
              </v-chip>
            </div>
          </div>
        </div>
      </div>


      <div class="gacha-dashboard">
        <!-- 1. 卡池选择器 -->
        <div style="display: flex; width: 100%; justify-content: center; margin-bottom: 20px;">
          <div class="pool-selector" style="display: flex; gap: 8px;">
            <v-btn
              class="pool-selector__btn"
              :class="{ 'pool-selector__btn--active': selectedPool === 'limited' }"
              elevation="0"
              variant="flat"
              @click="selectPool('limited')"
            >
              限定寻访
            </v-btn>
            <v-btn
              class="pool-selector__btn"
              :class="{ 'pool-selector__btn--active': selectedPool === 'permanent' }"
              elevation="0"
              variant="flat"
              @click="selectPool('permanent')"
            >
              常驻寻访
            </v-btn>
            <v-btn
              class="pool-selector__btn"
              :class="{ 'pool-selector__btn--active': selectedPool === 'weapon' }"
              elevation="0"
              variant="flat"
              @click="selectPool('weapon')"
            >
              武库申领
            </v-btn>
          </div>
        </div>

        <!-- 2. 空状态提示 -->
        <div
          v-if="!currentPoolGroup || currentPoolGroup.length === 0"
          style="width: 100%; margin: 40px 0; text-align: center; padding: 48px 0; background: #f9fafb; border-radius: 8px;"
        >
          <div style="font-size: 1rem; color: #6b7280; font-weight: 500;">
            暂无该卡池的抽卡数据
          </div>
        </div>

        <!-- 3. 数据列表渲染 -->
        <!-- 注意：这里循环的是 currentPoolGroup，它已经根据 selectedPool 过滤过了 -->
        <div v-for="group in currentPoolGroup" :key="group.poolId" class="mb-8">
          <h2 
              class="text-h5 mb-3" 
              style="border-left: 4px solid currentColor; padding-left: 12px; display: flex; justify-content: space-between; align-items: center;"
            >
              <span>{{ group.poolName }}</span>
              
              <div style="font-size: 0.9rem; color: #6b7280; font-weight: normal; display: flex; align-items: baseline; gap: 4px;">
                <span style="font-size: 0.8rem; opacity: 0.8;">共计</span>
                <span style="font-size: 1.1rem; font-weight: bold; color: #374151;">
                  {{ getPoolTotalPulls(group.records) }}
                </span>
                <span style="font-size: 0.8rem; opacity: 0.8;">抽</span>
              </div>
            </h2>

          <div class="custom-gacha-list">
            <div v-if="!group.records || group.records.length === 0" style="padding: 20px; color: #999; font-size: 0.9rem;">
              该卡池暂无记录
            </div>

            <div v-else>
              <div
                v-for="(record) in group.records"
                :key="`${group.poolId}-${record.seqId}`"
                class="custom-gacha-item mb-2"
                :class="{ 'on-banner': isOnBanner(record) }"
                style="cursor: pointer; display: flex; align-items: center; padding: 8px; border-radius: 8px; transition: background 0.2s;"
                @click="toggleExpand(record.seqId)"
                @mouseenter="($event.currentTarget as HTMLElement).style.backgroundColor = '#f3f4f6'"
                @mouseleave="($event.currentTarget as HTMLElement).style.backgroundColor = 'transparent'"
              >
                <!-- 头像区域 -->
                <div class="character-avatar" style="width: 50px; height: 50px; flex-shrink: 0; margin-right: 12px;">
                  <img
                    v-if="record.charId"
                    :alt="record.character"
                    :src="getAvatarUrl(record.charId, getPoolType(record.poolId) === 'weapon')"
                    style="width: 100%; height: 100%; object-fit: contain; background-color: #fff; border-radius: 50%; border: 1px solid #e5e7eb;"
                    @error="handleImageError"
                  />
                </div>

                <!-- 条形图区域 -->
                <div class="gacha-drawer-container" style="flex: 1;">
                  <div class="gacha-bar-container" style="position: relative; height: 32px; display: flex; align-items: center;">
                    <div
                      class="gacha-bar"
                      :class="getBarType(record)"
                      :style="{ width: (Math.min(getBarWidth(record.count), 100) + '%'), height: '100%', borderRadius: '4px', transition: 'width 0.5s ease' }"
                    >
                      <div class="pull-count" style="width: 60px; text-align: right; padding-right: 12px; color: #000; font-weight: bold; font-size: 0.9rem;">
                        {{ record.count }} 抽
                      </div>
                    </div>

                    <div 
                      v-if="!isVirtualRecord(record.character) && selectedPool === 'limited'" 
                      style="position: absolute; right: 8px; display: flex; flex-direction: column; align-items: flex-end; line-height: 1.2;"
                    >
                      <template v-if="getProbabilityInfo(record, group.records)">
                        <span :style="{ 
                          fontSize: '0.75rem', 
                          fontWeight: 'bold', 
                          color: getProbabilityInfo(record, group.records)!.isBig ? '#d97706' : '#374151',
                          backgroundColor: getProbabilityInfo(record, group.records)!.isBig ? '#fef3c7' : 'transparent',
                          padding: getProbabilityInfo(record, group.records)!.isBig ? '2px 4px' : '0',
                          borderRadius: '4px'
                        }">
                          {{ getProbabilityInfo(record, group.records)!.label }}
                        </span>
                        <span :style="{ fontSize: '0.65rem', color: isOnBanner(record) ? '#d97706' : '#ef4444' }">
                          {{ getProbabilityInfo(record, group.records)!.subLabel }}
                        </span>
                      </template>
                    </div>

                    <span v-if="record.character === '已垫'" style="position: absolute; right: 10px; font-size: 0.75rem; color: #6b7280; font-style: italic;">当前垫抽</span>
                    <span v-if="record.character === '赠送十连'" style="position: absolute; right: 10px; font-size: 0.75rem; color: #6b7280; font-style: italic;">赠送十连</span>
                  </div>

                  <div 
                    v-if="expandedSeqId === record.seqId && record.fiveStars?.length" 
                    class="mt-2 ml-2 p-2"
                    style="background-color: #f9fafb; border-radius: 6px;"
                  >
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                      <div
                        v-for="(item, i) in countFiveStars(record.fiveStars || [])"
                        :key="i"
                        class="d-flex flex-column align-center"
                        style="width: 40px;"
                      >
                        <img
                          :alt="item.name"
                          :src="getAvatarUrl(item.name, getPoolType(record.poolId) === 'weapon')"
                          style="width: 32px; height: 32px; object-fit: contain; background-color: #fff; border-radius: 4px; border: 1px solid #eee;"
                          @error="handleImageError"
                        />
                        <span v-if="item.count > 1" style="font-size: 0.65rem; color: #0284c7; margin-top: 2px;">
                          x{{ item.count }}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    v-if="!isVirtualRecord(record.character) && expandedSeqId !== record.seqId" 
                    style="margin-top: 4px; font-size: 0.85rem; color: #374151; font-weight: 500;"
                  >
                    {{ record.character }}
                    <span v-if="isOnBanner(record)" style="color: #d97706; font-size: 0.75rem; margin-left: 4px;">(UP)</span>
                    <span v-if="isOffPool(record)" style="color: #ef4444; font-size: 0.75rem; margin-left: 4px;">(歪)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="action-buttons-container" style="margin-top: 40px; display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
          <button class="btn update-btn" style="padding: 8px 24px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;" @click="goToUpdate">
            更新数据
          </button>
          
          <button class="btn export-btn" style="padding: 8px 24px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer;" @click="exportDataToJson">
            导出数据
          </button>

          <button class="btn clear-btn" style="padding: 8px 24px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer;" @click="confirmClearCache">
            删除记录
          </button>
        </div>
      </div>

      <div style=" margin: 20px auto; max-width: 800px; font-family: Arial, sans-serif;" v-if="USE_DEBUG_DATA">
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
import { computed, onMounted, ref } from 'vue';
import debugGachaData from '@/custom/core/gacha-analysis-example.json';


// ========== 加载/缓存数据相关 ==========

import { gachaPools } from '@/custom/core/gacha-pool-info';

const viewMode = ref<'collect' | 'analyze'>('collect');

const inputCredential = ref('');
const isSubmitting = ref(false);
const collectError = ref('');
const records = ref<GachaRecord[]>([]);
const sixStarRecordsWithCount = computed(() => {
  return [...characterSixStarResults.value, ...weaponSixStarResults.value]
    .sort((a, b) => parseSeqId(b.seqId) - parseSeqId(a.seqId));
});
const realSixStarRecords = computed(() => {
  return sixStarRecordsWithCount.value.filter(r => 
    r.charId !== 'padded' &&      // 排除已垫
    r.charId !== 'free_bundle'    // 排除免费赠送虚拟节点
  );
});

const characterRecords = ref<GachaRecord[]>([]);
const weaponRecords = ref<GachaRecord[]>([]);

const characterSixStarResults = ref<SixStarEntry[]>([]);
const weaponSixStarResults = ref<SixStarEntry[]>([]);

const rollData = ref<Array<[string, string, string, number]>>([]);


// 原始数据
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
  charId: string;
  count: number;
  timestamp: string | number;
  fiveStars?: string[];
}

function safeTimestamp(ts: string | number): number {
  if (typeof ts === 'number') return ts;
  const num = Number(ts);
  if (!isNaN(num)) return num;
  return new Date(ts).getTime();
}

function getPoolType(poolId: string): 'limited' | 'permanent' | 'weapon' {
  if (poolId.includes('weapon') || poolId.includes('wepon')) {
    return 'weapon';
  }
  
  if (poolId.startsWith('special') || poolId.startsWith('activity')) {
    return 'limited';
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
for (const pool of gachaPools) {
  upCharMap.set(pool.poolId, pool.upCharName);
}

// 比较seqid
function parseSeqId(seqId: string): number {
  const num = Number.parseInt(seqId, 10);
  return isNaN(num) ? 0 : num;
}

// 提交并验证用户输入的 UID 和 URL
const CACHE_KEY = 'endfield_gacha_records_v2';
const LAST_ROLE_ID_KEY = 'endfield_last_role_id';


//从本地缓存读取数据（适配物理隔离结构）

function loadCachedRecords(roleId: string): { chars: GachaRecord[], weps: GachaRecord[] } {
  const CACHE_KEY = 'endfield_gacha_records_v2';
  const localData = localStorage.getItem(CACHE_KEY);
  if (!localData) return { chars: [], weps: [] };

  try {
    const parsed = JSON.parse(localData);
    const userData = parsed[roleId] || {};
    // 确保返回的是分流后的对象结构
    return {
      chars: Array.isArray(userData.chars) ? userData.chars : [],
      weps: Array.isArray(userData.weps) ? userData.weps : []
    };
  } catch {
    return { chars: [], weps: [] };
  }
}

// 保存记录到 localStorage
function saveRecordsToCache(roleId: string, data: { chars: GachaRecord[], weps: GachaRecord[] }) {
  const CACHE_KEY = 'endfield_gacha_records_v2';
  const LAST_ROLE_ID_KEY = 'endfield_last_role_id';
  try {
    const localData = localStorage.getItem(CACHE_KEY);
    const allData = localData ? JSON.parse(localData) : {};
    
    // 存入分流后的结构
    allData[roleId] = {
      chars: data.chars,
      weps: data.weps,
      updateTs: Date.now()
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(allData));
    localStorage.setItem(LAST_ROLE_ID_KEY, roleId);
  } catch (error) {
    console.error('保存失败', error);
  }
}

// 调试开关
const USE_DEBUG_DATA = false;

/**
 * 标准化单条记录：处理字段兼容性并映射角色/武器
 */
function normalizeRecord(item: any, isWeapon: boolean): GachaRecord {
  return {
    id: item.id ?? 0,
    endfieldUid: '',
    uid: item.roleId || item.uid || 'unknown',
    poolId: item.poolId || '',
    poolName: item.poolName || '',
    // 关键逻辑：如果是武器池，将武器名称/ID映射到通用的 charName/charId 字段
    charName: isWeapon ? (item.weaponName || item.charName) : item.charName,
    charId: isWeapon ? (item.weaponId || item.charId) : item.charId,
    rarity: Number(item.rarity ?? 0),
    gachaTs: item.gachaTs ?? Date.now(),
    seqId: String(item.seqId ?? ''),
    lang: item.lang || 'zh-cn',
    poolType: item.poolType || '',
    serverId: item.serverId || '',
    isFree: (item.isFree !== undefined ? item.isFree : item.free) ?? false,
    isNew: (item.isNew !== undefined ? item.isNew : item.new) ?? false,
  };
}

// 提交并验证用户输入的 UID 和 URL

async function submitAndVerify() {
  // ==========================================
  // 1. 【调试模式】
  // ==========================================
  if (USE_DEBUG_DATA) {
    console.log('--- [DEBUG MODE] 正在加载本地分流数据 ---');
    try {
      const rawData = debugGachaData.data;
      if (!rawData) throw new Error('调试数据为空');

      // 分别标准化并排序
      characterRecords.value = (rawData.characterPoolRecord || [])
        .map(item => normalizeRecord(item, false))
        .sort((a, b) => parseSeqId(a.seqId) - parseSeqId(b.seqId));

      weaponRecords.value = (rawData.weaponPoolRecord || [])
        .map(item => normalizeRecord(item, true))
        .sort((a, b) => parseSeqId(a.seqId) - parseSeqId(b.seqId));

      // 执行分析逻辑（内部会分别处理两个数组）
      processGachaData();
      
      viewMode.value = 'analyze';
      collectError.value = '';
      return;
    } catch (error: any) {
      collectError.value = '调试模式异常: ' + error.message;
      return;
    }
  }

  // ==========================================
  // 2. 【正式模式：凭证校验】
  // ==========================================
  const credentialJson = inputCredential.value.trim();
  if (!credentialJson) {
    collectError.value = '请粘贴完整的登录凭证 JSON';
    return;
  }

  let hgToken = '';
  try {
    const credentialObj = JSON.parse(credentialJson);
    if (!credentialObj || credentialObj.code !== 0) throw new Error('凭证状态异常');
    hgToken = credentialObj.data?.content || '';
  } catch {
    collectError.value = '凭证格式错误';
    return;
  }

  isSubmitting.value = true;
  collectError.value = '';

  try {
    const BASE_URL = 'https://endfield.backend.yituliu.cn';
    const formData = new FormData();
    formData.append('hgToken', hgToken);

    // Step 1: 创建任务
    const uploadRes = await fetch(`${BASE_URL}/pool-record/create-task`, { method: 'POST', body: formData });
    const taskResponse = await uploadRes.json();
    const taskId = taskResponse?.data;
    if (!taskId) throw new Error('获取任务ID失败');

    // Step 2: 轮询任务状态
    let roleId = '';
    for (let i = 0; i < 30; i++) {
      await new Promise(res => setTimeout(res, 2000));
      const checkRes = await fetch(`${BASE_URL}/pool-record/check-task?taskId=${encodeURIComponent(taskId)}`);
      const checkData = await checkRes.json();
      if (checkData.code === 200 && checkData.data?.roleId) {
        roleId = checkData.data.roleId;
        break;
      }
    }
    if (!roleId) throw new Error('任务处理超时');

    // Step 3: 获取数据并分流处理
    const listRes = await fetch(`${BASE_URL}/pool-record/character/list?taskId=${encodeURIComponent(taskId)}`);
    const listResponse = await listRes.json();
    if (!listResponse?.data) throw new Error('返回数据无效');

    const rawChar = listResponse.data.characterPoolRecord || [];
    const rawWep = listResponse.data.weaponPoolRecord || [];

    // 标准化新抓取的数据
    const newCharRecords = rawChar.map((item: any) => normalizeRecord(item, false));
    const newWepRecords = rawWep.map((item: any) => normalizeRecord(item, true));

    // Step 4: 加载并合并缓存 (针对不同类型分别去重合并)
    const cachedData = loadCachedRecords(roleId); 
    // 注意：这里的 cachedData 结构应修改为 { chars: GachaRecord[], weps: GachaRecord[] }
    
    characterRecords.value = mergeAndSortRecords(cachedData.chars || [], newCharRecords);
    weaponRecords.value = mergeAndSortRecords(cachedData.weps || [], newWepRecords);

    // Step 5: 持久化与分析
    saveRecordsToCache(roleId, {
      chars: characterRecords.value,
      weps: weaponRecords.value
    });

    processGachaData();
    viewMode.value = 'analyze';

  } catch (error: any) {
    console.error('分析失败:', error);
    collectError.value = error.message || '网络错误';
  } finally {
    isSubmitting.value = false;
  }
}


function mergeAndSortRecords(oldList: GachaRecord[], newList: GachaRecord[]): GachaRecord[] {
  const map = new Map<string, GachaRecord>();
  // seqId 在同类卡池内是唯一的，直接作为 Key
  for (const r of oldList) map.set(String(r.seqId), r);
  for (const r of newList) map.set(String(r.seqId), r);
  
  return Array.from(map.values()).sort((a, b) => {
    return parseSeqId(a.seqId) - parseSeqId(b.seqId);
  });
}

// 启动时，若本地有缓存则读取缓存，直接进入分析页面
onMounted(() => {
  const LAST_ROLE_ID_KEY = 'endfield_last_role_id';
  const lastRoleId = localStorage.getItem(LAST_ROLE_ID_KEY);
  
  if (lastRoleId) {
    const cached = loadCachedRecords(lastRoleId);
    // 只有当存在任意记录时才进入分析页
    if (cached.chars.length > 0 || cached.weps.length > 0) {
      characterRecords.value = cached.chars;
      weaponRecords.value = cached.weps;
      
      // 执行全量分析（不需要传参）
      processGachaData(); 
      viewMode.value = 'analyze';
    }
  }
});

// 返回收集页
function goToUpdate() {
  viewMode.value = 'collect';
  inputCredential.value = '';
}

// 确认并清除缓存
function confirmClearCache() {
  if (confirm('⚠️ 确定要删除所有本地抽卡记录吗？')) {
    localStorage.removeItem(CACHE_KEY); 
    localStorage.removeItem(LAST_ROLE_ID_KEY);
    
    characterRecords.value = [];
    weaponRecords.value = [];
    characterSixStarResults.value = [];
    weaponSixStarResults.value = [];
    
    inputCredential.value = '';
    collectError.value = '';
    viewMode.value = 'collect';
    alert('本地数据已完全清除');
  }
}


// ========== 处理抽卡数据：分组、统计、生成时间线，分别计算角色池和武器池的保底进度，互不干扰==========

function processGachaData() {
  const analyzeSingleType = (list: GachaRecord[]) => {
    const resultWithPadded: SixStarEntry[] = [];
    // 增加数据结构：freeRecords 用于存放免费产出
    const poolState: Record<string, { 
      count: number; 
      fiveStars: string[]; 
      freeRecords: { rarity: number; name: string }[] 
    }> = {};

    for (const record of list) {
      if (!poolState[record.poolId]) {
        poolState[record.poolId] = { count: 0, fiveStars: [], freeRecords: [] };
      }
      const state = poolState[record.poolId]!;

      // --- 【核心逻辑：免费抽数分流】 ---
      if (record.isFree) {
        // 1. 完全不增加 state.count (跳过保底水位)
        // 2. 如果是 5 星或 6 星，记录到该池子的免费清单里
        if (record.rarity >= 5) {
          state.freeRecords.push({
            rarity: record.rarity,
            name: record.charId
          });
        }
        continue;
      }

      // --- 【正常保底水位逻辑】 ---
      state.count++;

      if (record.rarity === 6) {
        resultWithPadded.push({
          ...record,
          character: record.charName,
          count: state.count,
          timestamp: record.gachaTs,
          fiveStars: [...state.fiveStars]
        });
        state.count = 0;
        state.fiveStars = [];
      } else if (record.rarity === 5) {
        state.fiveStars.push(record.charId);
      }
    }

    // --- 【特殊处理：将每个池子的免费统计作为虚拟节点插入】 ---
    for (const [poolId, state] of Object.entries(poolState)) {
      if (state.freeRecords.length > 0) {
        // 找到该池子中 seqId 最小的记录作为锚点（用于让它显示在底端）
        const firstInPool = list.find(r => r.poolId === poolId);
        
        resultWithPadded.push({
          poolId,
          poolName: firstInPool?.poolName || '未知卡池',
          character: '赠送十连',
          charId: 'free_bundle',
          count: 10,
          timestamp: firstInPool?.gachaTs || Date.now(),
          seqId: (firstInPool?.seqId || '0') + '_bottom_free',     
          fiveStars: state.freeRecords.map(r => r.name) 
        });
      }
    }

    // 2. 垫刀逻辑
    for (const [poolId, state] of Object.entries(poolState)) {
      if (state.count > 0) {
        const last = list.findLast(r => r.poolId === poolId);
        if (last) {
          resultWithPadded.push({
            poolId,
            poolName: last.poolName,
            character: '已垫',
            charId: 'padded',
            count: state.count,
            timestamp: last.gachaTs,
            seqId: last.seqId,
            fiveStars: [...state.fiveStars]
          });
        }
      }
    }
    return resultWithPadded;
  };

  // 3. 执行分析并赋值给隔离的响应式变量
  // 使用之前定义的 parseSeqId 进行降序排列（最新的在前面）
  const sortByDesc = (a: SixStarEntry, b: SixStarEntry) => parseSeqId(b.seqId) - parseSeqId(a.seqId);
  
  // 分别处理角色和武器
  const charAnalysis = analyzeSingleType(characterRecords.value);
  const wepAnalysis = analyzeSingleType(weaponRecords.value);

  // 4. 更新响应式结果
  characterSixStarResults.value = charAnalysis.sort(sortByDesc);
  weaponSixStarResults.value = wepAnalysis.sort(sortByDesc);

  // 5. 兼容性适配：更新 rollData 供旧版 UI 模板渲染
  // 如果你的 template 还在使用 rollData，这行代码能保证它不会失效
  rollData.value = [...characterSixStarResults.value, ...weaponSixStarResults.value]
    .sort(sortByDesc)
    .map(item => [
      item.poolId,
      item.poolName,
      item.character,
      item.count
    ]);

  console.log('✅ 分析完成：角色 6 星记录', characterSixStarResults.value.length, '条');
  console.log('✅ 分析完成：武器 6 星记录', weaponSixStarResults.value.length, '条');
}

// 判断是否歪了
function isOffPool(record: SixStarEntry): boolean {
  if (record.character === '已垫'|| record.character === '赠送十连') {
    return false;
  }
  const upChar = upCharMap.get(record.poolId);
  if (!upChar) {
    return false;
  }
  return record.character !== upChar;
}

// 在 <script setup> 中
const groupedByPool = computed(() => {
  const map = new Map<string, { poolId: string; poolName: string; records: SixStarEntry[] }>();
  
  // 遍历所有六星记录（含“已垫”）
  for (const record of sixStarRecordsWithCount.value) {
    if (!map.has(record.poolId)) {
      map.set(record.poolId, {
        poolId: record.poolId,
        poolName: record.poolName,
        records: [],
      });
    }
    map.get(record.poolId)!.records.push(record);
  }

  // 转为数组，并按你想要的顺序排序（比如：限定 > 常驻 > 武器）
  const orderMap: Record<string, number> = {
    'limited': 0,
    'permanent': 1,
    'weapon': 2,
    'default': 999,
  };

  console.log('分组结果:', Array.from(map.values()));
  return Array.from(map.values());

  return Array.from(map.values()).sort((a, b) => {
    const aOrder = orderMap[a.poolId] ?? orderMap['default'];
    const bOrder = orderMap[b.poolId] ?? orderMap['default'];
    return aOrder! - bOrder!;
  });
});
// 当前选中的卡池分组
const currentPoolGroup = computed(() => {
  return groupedByPool.value.filter(group => {
    const { poolId } = group;
    const sel = selectedPool.value;

    if (sel === 'permanent') {
      // 常驻池：standard, beginner 等
      return poolId === 'standard' || poolId === 'beginner';
    }

    if (sel === 'limited') {
      // 限定池：special_, activity_ 等
      return poolId.startsWith('special_') || poolId.startsWith('activity_');
    }

    if (sel === 'weapon') {
      return poolId.includes('weapon') || poolId.includes('wepon');
    }

    // 默认不显示
    return false;
  });
});




// ========== 计算相关 ==========

const totalAllPulls = computed(() => {
  const { limited, permanent, weapon } = poolSummary.value;
  return limited.total + permanent.total;
});

// 总六星数（不含已垫）
const totalSixStarCount = computed(() => {
  const { limited, permanent, weapon } = poolSummary.value;
  return limited.totalCount + permanent.totalCount + weapon.totalCount;
});
const totalPulls = computed(() => {
  return realSixStarRecords.value.reduce((sum, r) => sum + r.count, 0);
});

// 五星计数
function countFiveStars(fiveStars: string[]): { name: string; count: number }[] {
  if (!fiveStars || fiveStars.length === 0) return [];

  const counter: Record<string, number> = {};
  for (const char of fiveStars) {
    counter[char] = (counter[char] || 0) + 1;
  }

  // 转为数组，按出现顺序或字母排序（可选）
  return Object.entries(counter).map(([name, count]) => ({ name, count }));
}

const poolSummary = computed(() => {
  interface PoolStats {
    total: number;
    totalCount: number;
    nonPityCount: number;
    average: number;
    graduateAverage: number;
  }

  const summary: Record<'limited' | 'permanent' | 'weapon', PoolStats> = {
    limited: { total: 0, totalCount: 0, nonPityCount: 0, average: 0, graduateAverage: 0 },
    permanent: { total: 0, totalCount: 0, nonPityCount: 0, average: 0, graduateAverage: 0 },
    weapon: { total: 0, totalCount: 0, nonPityCount: 0, average: 0, graduateAverage: 0 },
  };

  // 辅助累加器：记录从上一个 UP 至今，或者从卡池开始至今投入的“有效抽数”
  const runningPullsSinceLastUp: Record<'limited' | 'permanent' | 'weapon', number> = {
    limited: 0, permanent: 0, weapon: 0
  };
  // 累计为了抽到 UP 角色总共花掉的抽数
  const totalPullsForUp: Record<'limited' | 'permanent' | 'weapon', number> = {
    limited: 0, permanent: 0, weapon: 0
  };

  // 按时间正序遍历
  const chronologicalRecords = [...sixStarRecordsWithCount.value].reverse();

  for (const record of chronologicalRecords) {
    const type = getPoolType(record.poolId);
    if (!(type in summary)) continue;

    // 1. 累计水位：排除“免费获取”虚拟节点
    const isFreeBundle = record.charId === 'free_bundle';
    const currentCount = record.count || 0;

    if (!isFreeBundle) {
      runningPullsSinceLastUp[type] += currentCount;
    }

    // 更新总展示抽数（含免费）
    summary[type].total += currentCount;

    // 2. 真实出货逻辑
    const isRealSixStar = record.charId !== 'padded' && !isFreeBundle;

    if (isRealSixStar) {
      summary[type].totalCount += 1;

      // 如果是 UP 角色
      if (isOnBanner(record)) {
        summary[type].nonPityCount += 1;
        
        // 将这一段路程的所有抽数（含之前歪掉的）加入“UP总投入”
        totalPullsForUp[type] += runningPullsSinceLastUp[type];
        
        // 重置“距上一个UP”的计数器，开始下一轮统计
        runningPullsSinceLastUp[type] = 0;
      }
    }
  }

  // 3. 计算结果
  for (const key of (['limited', 'permanent', 'weapon'] as const)) {
    const s = summary[key];
    // 六星平均出货（所有六星）
    s.average = s.totalCount > 0 ? s.total / s.totalCount : 0;
    // UP平均出货：总投入 / UP个数
    s.graduateAverage = s.nonPityCount > 0 ? totalPullsForUp[key] / s.nonPityCount : 0;
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

  for (const item of Object.values(map)) {
    item.ratio = total > 0 ? item.count / total : 0;
  }

  return map;
});

const topCharacters = computed(() => {
  const freq: Record<string, number> = {};
  
  for (const r of realSixStarRecords.value) {
    const type = getPoolType(r.poolId);
    if (type === 'weapon') continue;

    freq[r.character] = (freq[r.character] || 0) + 1;
  }

  return Object.entries(freq)
    .map(([name, times]) => ({ name, times }))
    .sort((a, b) => b.times - a.times)
    .slice(0, 3);
});

// 计算每个卡池的总抽数
function getPoolTotalPulls(records: SixStarEntry[]): number {
  return records.reduce((sum, r) => sum + (r.count || 0), 0);
}



// ========== 特色抽卡 Tag 计算逻辑 ==========
interface GachaTag {
  name: string;
  type: 'lucky' | 'normal' | 'unlucky';
}

// 计算特色抽卡标签
const gachaTags = computed(() => {
  const tags: GachaTag[] = [];
  const realSixStars = realSixStarRecords.value;

  // 1. 先获取所有卡池的总抽数和总出货数
  const { limited, permanent, weapon } = poolSummary.value;

  const graduateAverage = poolSummary.value.limited.graduateAverage;
  // 2. 添加平均出货数对应的等级标签
  if (graduateAverage > 0) {
  if (graduateAverage <= 40) {
      tags.push({ name: '至尊欧皇', type: 'lucky' });
    } else if (graduateAverage <= 65) { 
      tags.push({ name: '欧皇', type: 'lucky' });
    } else if (graduateAverage <= 85) {
      tags.push({ name: '路过的欧洲人', type: 'lucky' });
    } else if (graduateAverage <= 105) {
      tags.push({ name: '小非酋', type: 'unlucky' });
    } else { 
      tags.push({ name: '血统纯正的非酋', type: 'unlucky' });
    }
  }


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
      // 有三金就移除已有的双金标签
      const duplicateIndex = tags.findIndex(t => t.name === '十连双金');
      if (duplicateIndex !== -1) {
        tags.splice(duplicateIndex, 1);
      }
    }
  }

  // 2. 三连不歪
  let consecutiveOnBanner = 0;
  for (const record of realSixStars) {
    if (isOnBanner(record)) {
      consecutiveOnBanner++;
      if (consecutiveOnBanner >= 3 && !tags.some(t => t.name === '三连不歪')) {
        tags.push({ name: '三连不歪', type: 'lucky' });
        break;
      }
    } else {
      consecutiveOnBanner = 0;
    }
  }

  // 3. 单抽出金
  if (realSixStars.some(r => r.count === 1) && !tags.some(t => t.name === '单抽出金')) {
    tags.push({ name: '单抽出金', type: 'lucky' });
  }

  // 4. 八十连保底
  if (realSixStars.some(r => r.count >= 80) && !tags.some(t => t.name === '八十连保底')) {
    tags.push({ name: '小保底吃满', type: 'unlucky' });
  }

  // 5. 全勤不歪
  const limitedSixStars = realSixStars.filter(r => getPoolType(r.poolId) === 'limited');
  if (limitedSixStars.length > 0 && limitedSixStars.every(isOnBanner) && !tags.some(t => t.name === '全勤不歪')) {
    tags.push({ name: '全勤不歪', type: 'lucky' });
  }

  return tags;
});


// 1. 判断虚拟记录的辅助函数
const isVirtualRecord = (name: string) => name === '已垫' || name === '赠送十连';

/**
 * 核心逻辑：获取显示所需的概率和保底状态
 */
function getProbabilityInfo(current: SixStarEntry, allInGroup: SixStarEntry[]) {
  if (isVirtualRecord(current.character)) return null;

  let isBigPity = false;
  let debugPulls = 0; 

  const sortedRecords = [...allInGroup].sort((a, b) => parseInt(a.seqId) - parseInt(b.seqId));
  const currentIndex = sortedRecords.findIndex(r => r.seqId === current.seqId);
  
  if (currentIndex !== -1) {
    // --- 核心修复：向上追溯直到遇到“上一个 UP” ---
    for (let i = currentIndex; i >= 0; i--) {
      const r = sortedRecords[i];
      
      if (r!.character !== '赠送十连') {
        debugPulls += r!.count;
      }

      // 如果不是当前这条记录，且这条记录是“六星”
      if (i !== currentIndex) {
        // 判断这只六星是不是 UP 角色
        // 如果是 UP，说明保底序列在这里重置了，停止累加
        if (isOnBanner(r!)) {
          break;
        }
        // 如果是“歪”了，循环不会 break，会继续向上加更早的抽数
      }
    }

    if (isOnBanner(current) && debugPulls >= 120) {
      isBigPity = true;
    }
  }

  // --- 返回显示对象 ---
  if (isBigPity) {
    return { label: '大保底', subLabel: '100% 不歪', isBig: true };
  }

  let prob = 0.8;
  if (current.count > 65) {
    prob = 0.8 + (current.count - 65) * 5;
  }
  
  return {
    label: `${Math.min(prob, 100).toFixed(1)}%`,
    subLabel: isOnBanner(current) ? '50% 不歪' : '50% 歪',
    isBig: false
  };
}



// ========== UI 相关 ==========

// 横向条形图排序、分组
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



function getBarWidth (count: number) {
  return (count / 80) * 95;
}


// 返回用于样式的状态标识
function getBarType(record: SixStarEntry): string {

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

  return 'default';
}

function isOnBanner(record: SixStarEntry): boolean {
  const upChar = upCharMap.get(record.poolId);
  return !!upChar && record.character === upChar;
}

const selectedPool = ref<'limited' | 'permanent' | 'weapon'>('limited');
function selectPool (pool: 'limited' | 'permanent' | 'weapon') {
  selectedPool.value = pool;
}

const filteredConsecutiveGroups = computed(() => {
  if (!selectedPool.value) return consecutiveGroups.value;
  return consecutiveGroups.value.filter(
    segment => getPoolType(segment.records[0]?.poolId || '') === selectedPool.value
  );
});


const expandedSeqId = ref<string | null>(null);

function toggleExpand(seqId: string) {
  if (expandedSeqId.value === seqId) {
    expandedSeqId.value = null; // 收起
  } else {
    expandedSeqId.value = seqId; // 展开
  }
}

// 获取头像 URL 
function getAvatarUrl(id: string, isWeapon: boolean = false): string {
  if (id === 'padded') {
    return `https://cos.yituliu.cn/endfield/other/blank.webp `; 
  }
  
  if (id === 'free_bundle') {
    return `https://cos.yituliu.cn/endfield/other/blank.webp `;
  }

  if (isWeapon) {
    return `https://cos.yituliu.cn/endfield/unpack-images/items/${id}.webp`;
  }
  
  return `https://cos.yituliu.cn/endfield/unpack-images/characters/icon_${id}.webp`;
}

// 图片加载失败时
function handleImageError(e: Event) {
  const img = e.target as HTMLImageElement;
  img.style.opacity = '0.5';
}

function exportDataToJson () {
  // 1. 尝试从当前响应式变量中构建完整的原始数据
  // 我们模仿后端返回的结构，这样导出的文件以后也可以直接作为“凭证”或“备份”导入
  const exportObj = {
    code: 200,
    data: {
      characterPoolRecord: characterRecords.value,
      weaponPoolRecord: weaponRecords.value,
      exportTs: Date.now()
    }
  };

  // 2. 检查是否有数据（如果两个数组都为空，说明确实没数据）
  if (characterRecords.value.length === 0 && weaponRecords.value.length === 0) {
    // 如果内存没有，尝试去 localStorage 捞一把
    const CACHE_KEY = 'endfield_gacha_records_v2';
    const localRaw = localStorage.getItem(CACHE_KEY);
    if (!localRaw) {
      alert('当前没有可导出的数据，请先更新或获取数据');
      return;
    }
    // 注意：这里导出的将是包含所有 roleId 的完整缓存对象
    const blob = new Blob([localRaw], { type: 'application/json' });
    triggerDownload(blob);
    return;
  }

  // 3. 执行内存数据的导出
  try {
    const jsonString = JSON.stringify(exportObj, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    triggerDownload(blob);
    console.log('✅ 内存数据导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    alert('导出过程中出现错误');
  }
}

// 辅助下载函数，避免重复代码
function triggerDownload(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  
  link.download = `endfield_gacha_backup_${dateStr}.json`;
  link.href = url;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// 上传抽卡数据
async function handleImportFile (event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  isSubmitting.value = true;
  collectError.value = '';

  const reader = new FileReader();
  reader.addEventListener('load', async (e) => {
    try {
      const content = e.target?.result as string;
      const importedData = JSON.parse(content);

      // 1. 结构校验：判断是我们导出的格式还是原始格式
      // 我们在导出时构造了 { data: { characterPoolRecord, weaponPoolRecord } }
      const charData = importedData.data?.characterPoolRecord || importedData.characterPoolRecord || [];
      const wepData = importedData.data?.weaponPoolRecord || importedData.weaponPoolRecord || [];

      if (charData.length === 0 && wepData.length === 0) {
        throw new Error('文件内容不符合规范或记录为空');
      }

      // 2. 获取 RoleId (用于缓存关联)
      // 尝试从第一条记录拿 UID
      const sample = charData[0] || wepData[0];
      const roleId = sample?.roleId || sample?.uid || 'imported_user';

      // 3. 标准化数据 (复用你现有的 normalizeRecord)
      const newCharRecords = charData.map((item: any) => normalizeRecord(item, false));
      const newWepRecords = wepData.map((item: any) => normalizeRecord(item, true));

      // 4. 与本地现有缓存合并 (去重)
      const cached = loadCachedRecords(roleId);
      characterRecords.value = mergeAndSortRecords(cached.chars, newCharRecords);
      weaponRecords.value = mergeAndSortRecords(cached.weps, newWepRecords);

      // 5. 写入缓存并分析
      saveRecordsToCache(roleId, {
        chars: characterRecords.value,
        weps: weaponRecords.value
      });

      processGachaData();
      viewMode.value = 'analyze';

    } catch (error: any) {
      console.error('导入失败:', error);
      collectError.value = '导入失败: ' + (error.message || '格式错误');
    } finally {
      isSubmitting.value = false;
      input.value = '';
    }
  });

  reader.readAsText(file!);
}

const displayUid = computed(() => {
  // 优先从角色记录拿，拿不到再从武器记录拿
  const firstRecord = characterRecords.value[0] || weaponRecords.value[0];
  return firstRecord?.uid || '未知';
});

</script>

<style scoped>
@import "assets/css/gacha-analysis.css";
</style>
