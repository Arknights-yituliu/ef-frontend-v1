<!--{-->
<!--"i18nKey": "gachaAnalysis",-->
<!--"nameKey": "menu.gachaAnalysis",-->
<!--"routePath": "/tools/gacha-analysis",-->
<!--"vuetifyIcon": "mdi-chart-bar"-->
<!--},-->


<template>

  <div style=" border-radius: 16px; padding: 24px;">
    <h2>锐意开发中···</h2>
    <!-- 数据收集 -->
    <div v-if="viewMode === 'collect'" class="collect-form">
      <header class="page-title">导入抽卡记录</header>

      <div class="form-group">
        <label>查询链接</label>
        <textarea
          v-model="inputCredential"
          :disabled="isSubmitting"
          placeholder="粘贴完整的URL"
          rows="3"
        />
        <p class="help-text">
          <a href="#">如何获取url</a>
        </p>
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
                <p class="user-uid">UID: {{ records[0]?.uid || '未知' }}</p>
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
                  <span class="label">{{ 'UP平均' }}：</span>
                  <span class="value">{{ info.nonPityAverage.toFixed(1) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <h3 class="text-subtitle-2 mb-2">{{ '卡池抽卡分布' }}</h3>
            <div class="d-flex flex-wrap">
              <v-chip
                v-for="(item, pool) in poolDistribution"
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
            <h3 class="text-subtitle-2 mb-2">{{ '角色抽取频次 TOP 3' }}</h3>
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
        武器熔铸
      </v-btn>
    </div>
  </div>

  <!-- 2. 空状态提示 -->
  <div
    v-if="!currentPoolGroup || currentPoolGroup.length === 0"
    style="width: 100%; margin: 40px 0; text-align: center; padding: 48px 0; background: #f9fafb; border-radius: 8px;"
  >
    <div style="font-size: 1rem; color: #6b7280; font-weight: 500;">
      {{ selectedPool === 'weapon' ? '暂无武器池抽卡数据' : '暂无该卡池的抽卡数据' }}
    </div>
  </div>

  <!-- 3. 数据列表渲染 -->
  <!-- 注意：这里循环的是 currentPoolGroup，它已经根据 selectedPool 过滤过了 -->
  <div v-for="group in currentPoolGroup" :key="group.poolId" class="mb-8">
    <h2 class="text-h5 mb-3" style="border-left: 4px solid currentColor; padding-left: 12px;">
      {{ group.poolName }}
    </h2>

    <div class="custom-gacha-list">
      <div v-if="!group.records || group.records.length === 0" style="padding: 20px; color: #999; font-size: 0.9rem;">
        该卡池暂无记录
      </div>

      <div v-else>
        <div
          v-for="(record, index) in group.records"
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
              v-if="record.charId && record.character !== '已垫'"
              :alt="record.character"
              :src="getAvatarUrl(record.charId)"
              style="width: 100%; height: 100%; object-fit: contain; background-color: #fff; border-radius: 50%; border: 1px solid #e5e7eb;"
              @error="handleImageError"
            />
            <div
              v-else
              style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #e5e7eb; border-radius: 50%; font-size: 0.8rem; color: #6b7280;"
            >
              {{ record.character === '已垫' ? '垫' : '?' }}
            </div>
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
              
              <!-- 标签 -->
              <span v-if="isOffPool(record) && record.count > 60" class="off-label" style="position: absolute; right: 0; font-size: 0.75rem; color: #ef4444; font-weight: bold;">超非</span>
              <span v-if="record.character !== '已垫' && record.count <= 10" class="lucky-label" style="position: absolute; right: 0; font-size: 0.75rem; color: #10b981; font-weight: bold;">超欧</span>
              <span v-if="record.character === '已垫'" style="position: absolute; right: 10px; font-size: 0.75rem; color: #6b7280; font-style: italic;">当前垫抽</span>
            </div>

            <!-- 展开的五星/四星详情 -->
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
                    :src="getAvatarUrl(item.name)"
                    style="width: 32px; height: 32px; object-fit: contain; background-color: #fff; border-radius: 4px; border: 1px solid #eee;"
                    @error="handleImageError"
                  />
                  <span v-if="item.count > 1" style="font-size: 0.65rem; color: #0284c7; margin-top: 2px;">
                    x{{ item.count }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- 名称显示 (可选，如果想直接显示名字) -->
            <div v-if="record.character !== '已垫'" style="margin-top: 4px; font-size: 0.85rem; color: #374151; font-weight: 500;">
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
  <div class="action-buttons-container" style="margin-top: 40px; display: flex; justify-content: center; gap: 16px;">
    <button class="btn update-btn" @click="goToUpdate" style="padding: 8px 24px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
      更新数据
    </button>
    <button class="btn clear-btn" @click="confirmClearCache" style="padding: 8px 24px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer;">
      清除缓存
    </button>
  </div>
</div>

      <div style=" margin: 20px auto; max-width: 800px; font-family: Arial, sans-serif;">
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
// 提交并验证（含缓存合并
import debugGachaData from '@/custom/core/gacha-analysis-example.json';




// ========== 加载/缓存数据相关 ==========

import { gachaPools } from '@/custom/core/gacha-pool-info';

const viewMode = ref<'collect' | 'analyze'>('collect');

const inputCredential = ref('');
const isSubmitting = ref(false);
const collectError = ref('');
const records = ref<GachaRecord[]>([]);
const rollData = ref<Array<[string, string, string, number]>>([]);
const sixStarRecordsWithCount = ref<SixStarEntry[]>([]);
const realSixStarRecords = ref<SixStarEntry[]>([]);

// const fetchedRecords = ref<GachaRecord[]>([]);


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

// 从 localStorage 加载缓存记录
function loadCachedRecords(roleId: string): GachaRecord[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];

    const cache = JSON.parse(raw) as { roleId: string; records: GachaRecord[] };
    return cache.roleId === roleId ? cache.records : [];
  } catch (error) {
    console.warn('缓存读取失败，清空旧数据', error);
    localStorage.removeItem(CACHE_KEY);
    return [];
  }
}

// 保存记录到 localStorage
function saveRecordsToCache(roleId: string, records: GachaRecord[]) {
  try {
    const cache = { roleId, records };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    localStorage.setItem(LAST_ROLE_ID_KEY, roleId);
  } catch (error) {
    console.error('缓存保存失败', error);
  }
}

// 调试开关
const USE_DEBUG_DATA = false;

async function submitAndVerify() {
  // 调试数据逻辑（保持兼容，但缓存 key 改为 debug_roleId）
  if (USE_DEBUG_DATA) {
    console.log('【调试模式】使用示例数据进行分析');
    try {
      const mergedRecords: GachaRecord[] = debugGachaData.data;

      saveRecordsToCache('debug_roleId', mergedRecords);
      records.value = mergedRecords;
      processGachaData(mergedRecords);
      viewMode.value = 'analyze';
      collectError.value = '';
      return;
    } catch (error: any) {
      console.error('调试数据处理失败:', error);
      collectError.value = '调试数据加载失败：' + error.message;
      return;
    }
  }

  // 用户输入：登录凭证 JSON 内容
  const credentialJson = inputCredential.value.trim();
  if (!credentialJson) {
    collectError.value = '请粘贴完整的登录凭证 JSON';
    return;
  }

  let hgToken = '';
  try {
    // 解析 JSON
    const credentialObj = JSON.parse(credentialJson);
    
    // 验证 JSON 结构
    if (!credentialObj || typeof credentialObj !== 'object') {
      throw new Error('无效的 JSON 对象');
    }
    
    if (credentialObj.code !== 0) {
      throw new Error('凭证状态异常，请重新获取');
    }
    
    // 提取 token
    hgToken = credentialObj.data?.content || '';
  } catch (error: any) {
    console.error('凭证解析失败:', error);
    collectError.value = '凭证格式不正确，请粘贴完整的 JSON 内容';
    return;
  }

  if (!hgToken) {
    collectError.value = '凭证中未找到有效 token，请确认是否为完整凭证';
    return;
  }

  isSubmitting.value = true;
  collectError.value = '';

   try {
    const BASE_URL = 'https://endfield.backend.yituliu.cn';

    // Step 1: 创建导入任务 - 使用 FormData
    const formData = new FormData();
    formData.append('hgToken', hgToken);

    const uploadRes = await fetch(`${BASE_URL}/pool-record/create-task`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) {
      const errorData = await uploadRes.json().catch(() => ({}));
      throw new Error(errorData.msg || `任务创建失败（状态码 ${uploadRes.status}）`);
    }

    const taskResponse = await uploadRes.json();
    console.log('任务创建响应:', taskResponse);  // 调试用

    const taskId = taskResponse?.data;
    if (!taskId) {
      throw new Error('未收到任务 ID，请稍后重试');
    }

    // Step 2: 轮询检查任务进度（最多 60 秒）
    let roleId = '';
    let retryCount = 0;
    const maxRetries = 30; // 30 * 2s = 60s

    while (retryCount < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 等待 2 秒

      const checkRes = await fetch(`${BASE_URL}/pool-record/check-task?taskId=${encodeURIComponent(taskId)}`);
      if (!checkRes.ok) {
        retryCount++;
        continue;
      }

      const checkData = await checkRes.json();
      if (checkData.code === 200 && checkData.data?.roleId) {
        roleId = checkData.data.roleId;
        break;
      } else {
        retryCount++;
      }
    }

    if (!roleId) {
      throw new Error('任务处理超时，请稍后重试');
    }

    // Step 3: 获取抽卡记录
    const listRes = await fetch(`${BASE_URL}/pool-record/character/list?taskId=${encodeURIComponent(taskId)}`);
    if (!listRes.ok) {
      throw new Error(`获取记录失败（状态码 ${listRes.status}）`);
    }

    const listResponse = await listRes.json();
    
    // 验证新结构：确保 data 对象存在且包含 characterPoolRecord
    if (!listResponse?.data || !Array.isArray(listResponse.data.characterPoolRecord)) {
      throw new Error('未返回有效抽卡数据');
    }

    // Step 4: 转换新数据 (从 data.characterPoolRecord 中读取)
    const charRecords = listResponse.data.characterPoolRecord || [];
    const weaponRecords = listResponse.data.weaponPoolRecord || [];

    // 1. 转换角色数据
    const processedCharRecords: GachaRecord[] = charRecords.map((item: any) => ({
      id: item.id,
      poolId: item.poolId,
      poolName: item.poolName,
      charName: item.charName,
      rarity: item.rarity,
      gachaTs: item.gachaTs,
      seqId: item.seqId,
      uid: item.uid || '',
      charId: item.charId || '',
      isFree: item.isFree ?? false,
      isNew: item.isNew ?? false,
      lang: item.lang || 'zh-cn',
      poolType: item.poolType || '',
      serverId: item.serverId || '',
    }));

    // 2. 转换武器数据 (映射到 GachaRecord 结构)
    const processedWeaponRecords: GachaRecord[] = weaponRecords.map((item: any) => ({
      id: item.id,
      poolId: item.poolId,
      poolName: item.poolName,
      // 关键映射：将武器信息填入角色字段，以便复用后续逻辑
      charName: item.weaponName, 
      charId: item.weaponId,   
      rarity: item.rarity,
      gachaTs: item.gachaTs,
      seqId: item.seqId,
      uid: item.uid || '', // 如果武器数据没uid，保持空字符串
      isFree: false,       // 武器池通常没有免费单抽概念，或根据实际字段调整
      isNew: item.new ?? false,
      lang: item.lang || 'zh-cn',
      poolType: item.poolType || '',
      serverId: item.serverId || '',
    }));

    // 3. 合并并排序 (全局按 seqId 排序)
    const allNewRecords = [...processedCharRecords, ...processedWeaponRecords];
    
    const newRecords: GachaRecord[] = allNewRecords.sort(
      (a, b) => parseSeqId(a.seqId) - parseSeqId(b.seqId)
    );

    if (newRecords.length === 0) {
      throw new Error('未找到任何抽卡记录（角色或武器）');
    }
    // Step 5: 加载缓存并合并（按 seqId 去重），使用 roleId 作为缓存 key
    const cachedRecords = loadCachedRecords(roleId);

    const recordMap = new Map<string, GachaRecord>();
    for (const rec of cachedRecords) {
      recordMap.set(rec.seqId, rec);
    }
    for (const rec of newRecords) {
      recordMap.set(rec.seqId, rec);
    }

    const mergedRecords = Array.from(recordMap.values())
      .sort((a: GachaRecord, b: GachaRecord) => parseSeqId(a.seqId) - parseSeqId(b.seqId));

    // Step 6: 保存到缓存（key 为 roleId）
    saveRecordsToCache(roleId, mergedRecords);

    // Step 7: 更新响应式状态
    records.value = mergedRecords;
    processGachaData(mergedRecords);
    viewMode.value = 'analyze';

  } catch (error: any) {
    console.error('数据验证失败:', error);
    collectError.value = error.message || '网络错误，请稍后重试';
  } finally {
    isSubmitting.value = false;
  }
}
// 启动时，若本地有缓存则读取缓存，直接进入分析页面
onMounted(() => {
  const lastRoleId = localStorage.getItem(LAST_ROLE_ID_KEY);
  if (lastRoleId) {
    const cached = loadCachedRecords(lastRoleId);
    if (cached.length > 0) {
      records.value = cached;
      processGachaData(cached);
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
    } catch (error) {
      console.error('清除缓存失败', error);
      alert('清除失败，请手动清除浏览器数据');
    }
  }
}



// ========== 处理抽卡数据：分组、统计、生成时间线 ==========
function processGachaData(list: GachaRecord[]) {
  // 1. 确保全局按 seqId 升序
  const sortedRecords = [...list].sort((a, b) => parseSeqId(a.seqId) - parseSeqId(b.seqId));

  // 2. 为每个 poolId 维护状态
  interface PoolState {
    pullsSinceLastSix: number;
    fiveStars: string[]; // 存储该池子两次金之间的 5 星记录 ID (无论是角色还是武器)
  }

  const poolState: Record<string, PoolState> = {};
  const resultRealOnly: SixStarEntry[] = [];
  const resultWithPadded: SixStarEntry[] = [];

  // 3. 遍历每一条记录（全局时序）
  for (const record of sortedRecords) {
    const { poolId, poolName, rarity, charName, seqId, gachaTs } = record;

    // 初始化池子状态
    if (!poolState[poolId]) {
      poolState[poolId] = {
        pullsSinceLastSix: 0,
        fiveStars: [],
      };
    }

    const state = poolState[poolId];
    state.pullsSinceLastSix += 1;

    // 【统一逻辑】只要 rarity === 6 视为出货 (金)
    // 适用于角色池 (6星角色) 和 武器池 (6星武器)
    if (rarity === 6) {
      const entry: SixStarEntry = {
        poolId,
        poolName,
        seqId,
        character: charName, // 这里可能是角色名，也可能是武器名
        charId: record.charId, // 这里可能是角色ID，也可能是武器ID
        count: state.pullsSinceLastSix,
        timestamp: gachaTs,
        fiveStars: [...state.fiveStars],
      };

      resultRealOnly.push(entry);
      resultWithPadded.push(entry);

      // 重置状态
      state.pullsSinceLastSix = 0;
      state.fiveStars = [];
    } 
    // 【统一逻辑】只要 rarity === 5 视为垫刀记录 (紫)
    // 适用于角色池 (5星角色) 和 武器池 (5星武器)
    else if (rarity === 5) {
      state.fiveStars.push(record.charId);
    }
  }

  // 4. 补充“已垫”记录（对每个池子当前未出金的部分）
  for (const [poolId, state] of Object.entries(poolState)) {
    if (state.pullsSinceLastSix > 0) {
      // 找到该池子最后一抽的记录（用于 seqId 和 timestamp）
      const lastRecord = sortedRecords.findLast(r => r.poolId === poolId);

      if (lastRecord) {
        resultWithPadded.push({
          poolId,
          poolName: lastRecord.poolName,
          character: '已垫',
          charId: 'padded',
          count: state.pullsSinceLastSix,
          timestamp: lastRecord.gachaTs,
          seqId: lastRecord.seqId,
          fiveStars: [...state.fiveStars],
        });
      }
    }
  }

  // 5. 排序：按 seqId 降序，“已垫”同 seqId 时靠后
  const sortBySeqIdDesc = (a: SixStarEntry, b: SixStarEntry) => {
    const aSeq = parseSeqId(a.seqId);
    const bSeq = parseSeqId(b.seqId);
    if (aSeq !== bSeq) return bSeq - aSeq;
    if (a.character === '已垫' && b.character !== '已垫') return 1;
    if (b.character === '已垫' && a.character !== '已垫') return -1;
    return 0;
  };

  sixStarRecordsWithCount.value = resultWithPadded.sort(sortBySeqIdDesc);
  realSixStarRecords.value = resultRealOnly.sort(sortBySeqIdDesc);

  // 6. 更新 rollData（保持兼容）
  rollData.value = sixStarRecordsWithCount.value.map(item => [
    item.poolId,
    item.poolName,
    item.character,
    item.count,
  ]);
}

// 判断是否歪了
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
      // 【修改点】武器池：匹配 poolId 中包含 'weapon' 或 'wepon' (注意后端拼写可能是 weponbox)
      // 根据你提供的示例数据 poolId: "weponbox_1_0_1"
      return poolId.includes('weapon') || poolId.includes('wepon');
    }

    // 默认不显示
    return false;
  });
});




// ========== 计算相关 ==========

const totalAllPulls = computed(() => {
  const { limited, permanent, weapon } = poolSummary.value;
  return limited.total + permanent.total + weapon.total;
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

  for (const item of Object.values(map)) {
    item.ratio = total > 0 ? item.count / total : 0;
  }

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
  const tags: GachaTag[] = [];
  const realSixStars = realSixStarRecords.value;

  // 1. 先获取所有卡池的总抽数和总出货数
  const { limited, permanent, weapon } = poolSummary.value;
  // 计算全卡池综合平均出货数
  const totalAllPools = limited.total + permanent.total + weapon.total;
  const totalAllCounts = limited.totalCount + permanent.totalCount + weapon.totalCount;
  // 复用现有平均计算逻辑：总抽数 / 出货次数
  const avgPulls = totalAllCounts > 0 ? totalAllPools / totalAllCounts : 0;

  // 2. 添加平均出货数对应的等级标签
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
    tags.push({ name: '八十连保底', type: 'unlucky' });
  }

  // 5. 全勤不歪
  const limitedSixStars = realSixStars.filter(r => getPoolType(r.poolId) === 'limited');
  if (limitedSixStars.length > 0 && limitedSixStars.every(isOnBanner) && !tags.some(t => t.name === '全勤不歪')) {
    tags.push({ name: '全勤不歪', type: 'lucky' });
  }

  return tags;
});



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

  // 兜底（比如没有 UP 信息）
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
function getAvatarUrl(charId: string): string {
  return `https://cos.yituliu.cn/endfield/unpack-images/characters/icon_${charId}.webp`;
}

// 图片加载失败时的兜底处理
function handleImageError(e: Event) {
  const img = e.target as HTMLImageElement;
  img.style.opacity = '0.5';
  // 或者替换为默认图：img.src = '/default-avatar.png';
}


</script>

<style scoped>
@import "assets/css/gacha-analysis.css";
</style>
