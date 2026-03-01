<script setup lang="ts">
import type {
  GachaCalculatorUserConfig,
  ModuleSelectedStatus,
  PieChartData,
  PoolOption,
  RewardStatisticsResultDetail,
  TotalPullsSingle,
} from '@/shared/types/gacha-calculator';
import {
  addReward,
  calculateDaysDifference,
  countTuesdaysBetweenV2,
  getRewardPull,
  getRewardsPull,
} from '#shared/utils/gacha-calculator';
import { numberFloor, numberRound } from '#shared/utils/numberUtil';
import { nextTick, onMounted, ref, watch } from 'vue';
import { activityReward} from '@/custom/core/gacha/activityReward';

// 奖励引入
import { AICQuotaReward,calculatorDailyReward,dailyReward,weekTaskReward } from '@/custom/core/gacha/dailyReward';

import {
  authorityLevelTaskRewards,
  authorityLevelUpReward,
  authorityLevelUpRewardTable,
  worldLevelReward,
} from '@/custom/core/gacha/levelReward';

import {
  operationalManualNodeReward,
  operationalManualReward,
} from '@/custom/core/gacha/operationalManualReward';

import {
  factoryManualReward,
  factoryManualRewardMax,
  intelArchiveReward,
  otherRewardTable,
} from '@/custom/core/gacha/otherReward';



import {
  beginnerSignInTaskReward,
  etchSpaceSalvageReward,
  newHorizonsTaskReward,
  valleyIVTaskRewardTable,
  wulingTaskRewardTable,
} from '@/custom/core/gacha/permanentReward';

import { gachaResourceStatisticsResult } from '@/custom/core/gacha/resourceStatisticsResult';

import {
  valleyIVAuryleneCollectReward,
  valleyIVAuryleneCollectStageTable,
  valleyIVBattleCrateReward,
  valleyIVBattleCrateRewardMax,
  valleyIVCrateReward,
  valleyIVCrateRewardMax,
  valleyIVDefenseConstructionReward,
  valleyIVDeltaBotReward,
  valleyIVDeltaBotRewardMax,
  valleyIVRegionalDevelopmentReward,
  valleyIVRegionalStockBillStoreReward,
  valleyIVSimulationReward,
} from '@/custom/core/gacha/valleyIVRegionalReward';


import {
  wulingAuryleneCollectReward,
  wulingAuryleneCollectStageTable,
  wulingBattleCrateReward,
  wulingBattleCrateRewardMax,
  wulingCrateReward,
  wulingCrateRewardMax,
  wulingDefenseConstructionReward,
  wulingDeltaBotReward,
  wulingDeltaBotRewardMax,
  wulingRegionalDevelopmentReward,
  wulingRegionalStockBillStoreReward,
  wulingSimulationReward,
} from '@/custom/core/gacha/wulingRegionalReward';

import { packs } from '@/custom/core/packs';

const { t } = useI18n();

//
const leftPartPanel = ref<string[]>(['statisticalResult', 'detail']);
// 'existing', 'daily', 'level', 'activity,'regional','permanent'
const rightPartPanel = ref<string[]>([]);

const poolOptions = ref<PoolOption[]>([
  {
    name: '热烈色彩',
    color: '#FA5B81',
    start: new Date('2026/02/24 12:00:00'),
    end: new Date('2026/03/12 12:00:00'),
    dateText: '02.24——未知',
    type: '热烈色彩',
    disabled: false,
  },
  {
    name: '汤汤卡池',
    color: '#B60129',
    start: new Date('2026/03/12 12:00:00'),
    end: new Date('2026/03/28 12:00:00'),
    dateText: '',
    type: '1111',
    disabled: true,
  },
  {
    name: '敬请期待',
    color: '#B60129',
    start: new Date('2026/03/12 12:00:00'),
    end: new Date('2026/03/28 12:00:00'),
    dateText: '',
    type: '1111',
    disabled: true,
  },
]);

const currentPool = ref<PoolOption>({
  name: '轻飘飘的信使',
  color: '#BE2F00',
  start: new Date('2026/02/07 12:00:00'),
  end: new Date('2026/02/24 12:00:00'),
  dateText: '02.07——02.24',
  type: '轻飘飘的信使',
  disabled: false,
});

const startDate: Date = new Date();

function selectedPool(option: PoolOption): void {
  currentPool.value = option;
  calculatorDailyReward(startDate,option.end);
  existingRewardStatistics();
  dailyRewardStatistics();
  activityRewardStatistics();
  otherRewardStatistics();
  valleyIVRegionalRewardStatistics();
  wulingRegionalRewardStatistics();
  levelRewardStatistics();
  permanentRewardStatistics();
  operationalManualRewardStatistics();
  rechargeResourceStatistics();
  allRewardStatisticsV2();
}

const gachaCalculatorUserConfig = ref<GachaCalculatorUserConfig>({
  existingResource: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
  buttonActive: {},
  buttonGroupActive: {},
  rangeSlider: {},
  slider: {},
});

/**
 * 库存计算相关代码起始
 */

const existingResource = ref<RewardStatisticsResultDetail>({
  name: '库存',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
});

watch(
  existingResource,
  (newValue) => {
    gachaCalculatorUserConfig.value.existingResource.originiumRecharge = newValue.originiumRecharge;
    gachaCalculatorUserConfig.value.existingResource.diamond = newValue.diamond;
    gachaCalculatorUserConfig.value.existingResource.ticketgachaStandardSingle =
      newValue.ticketgachaStandardSingle;
    gachaCalculatorUserConfig.value.existingResource.ticketgachaSpecialSingle =
      newValue.ticketgachaSpecialSingle;
    localStorage.setItem(
      'Gacha_Calculator_User_Config',
      JSON.stringify(gachaCalculatorUserConfig.value),
    );

    existingRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

let existingRewardStatisticsResultDetail: RewardStatisticsResultDetail = {
  name: '库存',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
};

function existingRewardStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '库存',
    originiumRecharge: existingResource.value.originiumRecharge / 1,
    diamond: existingResource.value.diamond / 1,
    ticketgachaStandardSingle: existingResource.value.ticketgachaStandardSingle / 1,
    ticketgachaSpecialSingle: existingResource.value.ticketgachaSpecialSingle / 1,
  };

  existingRewardStatisticsResultDetail = result;
  gachaResourceStatisticsResult.value.totalPulls.existing = getRewardPull(result);
}

/**
 * 库存计算相关代码结尾
 */

/**
 * 日常奖励计算相关代码起始
 */


watch(
  AICQuotaReward,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }

    dailyRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);





let dailyRewardStatisticsResultDetail: RewardStatisticsResultDetail = {
  name: '活动奖励',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
};

function dailyRewardStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '日常奖励',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  };

  addReward(result, dailyReward.value);
  addReward(result, weekTaskReward.value);
  for (const reward of AICQuotaReward.value) {
    if (checkRewardIsValid(reward)) {
      addReward(result, reward);
    }
  }

  dailyRewardStatisticsResultDetail = result;
  gachaResourceStatisticsResult.value.totalPulls.daily = getRewardPull(result);
}

/**
 * 日常奖励计算相关代码结尾
 */

/**
 * 活动奖励计算相关代码起始
 */
watch(
  activityReward,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }

    activityRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

let activityRewardStatisticsResultDetail: RewardStatisticsResultDetail = {
  name: '活动奖励',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
};

function activityRewardStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '活动奖励',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  };

  for (const reward of activityReward.value) {
    if (checkRewardIsValid(reward)) {
      addReward(result, reward);
    }
  }

  activityRewardStatisticsResultDetail = result;
  gachaResourceStatisticsResult.value.totalPulls.activity = getRewardPull(result);
}

/**
 * 活动奖励计算相关代码结尾
 */

/**
 * 其他奖励计算相关代码起始
 */
watch(
  otherRewardTable,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }
    otherRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

const factoryManualProgress = ref<number[]>([0, factoryManualRewardMax]);

watch(
  factoryManualProgress,
  (newVal) => {
    factoryManualReward.value.content.diamond = newVal[1]! - newVal[0]!;
    saveUserConfig(factoryManualReward.value.id, newVal, 'rangeSlider');
    otherRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

watch(
  intelArchiveReward,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }
    otherRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

let otherRewardStatisticsResultDetail: RewardStatisticsResultDetail = {
  name: '活动奖励',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
};

function otherRewardStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '其他奖励',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  };

  for (const reward of otherRewardTable.value) {
    if (checkRewardIsValid(reward)) {
      addReward(result, reward);
    }
  }

  addReward(result, factoryManualReward.value);
  addReward(result, intelArchiveReward.value);

  otherRewardStatisticsResultDetail = result;
  gachaResourceStatisticsResult.value.totalPulls.other = getRewardPull(result);
}

/**
 * 其他奖励计算相关代码结尾
 */

/**
 * 地区奖励计算相关代码起始
 */

/**
 * 四号谷地地区奖励起始
 */

// 四号谷地调度商店
watch(
  valleyIVRegionalStockBillStoreReward,
  (newValue) => {
    saveUserConfig(newValue.id, newValue.active, 'buttonActive');

    valleyIVRegionalRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

// 四号谷地地区建设等级进度
const valleyIVRegionalDevelopmentProgress = ref<number[]>([1, 12]);

watch(
  valleyIVRegionalDevelopmentProgress,
  (newVal) => {
    let diamond: number = 0;
    let ticketgachaStandardSingle: number = 0;
    for (let i = newVal[0]! + 1; i <= newVal[1]!; i++) {
      if (i < 10) {
        diamond += 200;
        ticketgachaStandardSingle++;
        continue;
      }
      diamond += 200;
      ticketgachaStandardSingle += 2;
    }
    valleyIVRegionalDevelopmentReward.value.content.diamond = diamond;
    valleyIVRegionalDevelopmentReward.value.content.ticketgachaStandardSingle =
      ticketgachaStandardSingle;
    saveUserConfig(valleyIVRegionalDevelopmentReward.value.id, newVal, 'rangeSlider');

    valleyIVRegionalRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

// 四号谷地地区醚质收集进度
const valleyIVAuryleneCollectProgress = ref<number[]>([0, 18]);

watch(
  valleyIVAuryleneCollectProgress,
  (newVal) => {
    let originiumRecharge: number = 0;
    for (let i = newVal[0]!; i < newVal[1]!; i++) {
      const stageReward = valleyIVAuryleneCollectStageTable[i];
      if (stageReward !== undefined) {
        originiumRecharge += stageReward.originiumRecharge || 0;
      }
    }

    valleyIVAuryleneCollectReward.value.content.originiumRecharge = originiumRecharge;
    saveUserConfig(valleyIVAuryleneCollectReward.value.id, newVal, 'rangeSlider');

    valleyIVRegionalRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

// 四号谷地地区储藏箱开启进度
const valleyIVCrateRewardProgress = ref<number[]>([0, valleyIVCrateRewardMax]);

watch(
  valleyIVCrateRewardProgress,
  (newVal) => {
    valleyIVCrateReward.value.content.diamond = newVal[1]! - newVal[0]!;
    saveUserConfig(valleyIVCrateReward.value.id, newVal, 'rangeSlider');

    valleyIVRegionalRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

// 四号谷地地区淤积点宝箱
const valleyIVBattleCrateRewardProgress = ref<number[]>([0, valleyIVBattleCrateRewardMax]);

watch(
  valleyIVBattleCrateRewardProgress,
  (newVal) => {
    valleyIVBattleCrateReward.value.content.originiumRecharge = newVal[1]! - newVal[0]!;
    saveUserConfig(valleyIVBattleCrateReward.value.id, newVal, 'rangeSlider');

    valleyIVRegionalRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

// 四号谷地Delta机器人修复
const valleyIVDeltaBotProgress = ref<number[]>([0, valleyIVDeltaBotRewardMax]);

watch(
  valleyIVDeltaBotProgress,
  (newVal) => {
    valleyIVDeltaBotReward.value.content.diamond = newVal[1]! - newVal[0]!;
    saveUserConfig(valleyIVDeltaBotReward.value.id, newVal, 'rangeSlider');

    valleyIVRegionalRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

// 四号谷地模拟
const valleyIVSimulationProgress = ref<number[]>([0, 26]);
watch(
  valleyIVSimulationProgress,
  (newVal) => {
    valleyIVSimulationReward.value.content.diamond = (newVal[1]! - newVal[0]!) * 25;
    saveUserConfig(valleyIVSimulationReward.value.id, newVal, 'rangeSlider');

    valleyIVRegionalRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

// 四号谷地据点防御
watch(
  valleyIVDefenseConstructionReward,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }
    valleyIVRegionalRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

/**
 * 四号谷地地区奖励结尾
 */

/**
 * 武陵地区奖励起始
 */

watch(
  wulingRegionalStockBillStoreReward,
  (newValue) => {
    saveUserConfig(newValue.id, newValue.active, 'buttonActive');

    wulingRegionalRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

// 武陵地区建设奖励
const wulingRegionalDevelopmentProgress = ref<number[]>([1, 6]);

watch(
  wulingRegionalDevelopmentProgress,
  (newVal) => {
    let diamond: number = 0;
    let ticketgachaStandardSingle: number = 0;
    for (let i = newVal[0]!; i < newVal[1]!; i++) {
      if (i < 10) {
        diamond += 200;
        ticketgachaStandardSingle++;
        continue;
      }
      diamond += 200;
      ticketgachaStandardSingle += 2;
    }
    wulingRegionalDevelopmentReward.value.content.diamond = diamond;
    wulingRegionalDevelopmentReward.value.content.ticketgachaStandardSingle =
      ticketgachaStandardSingle;
    saveUserConfig(wulingRegionalDevelopmentReward.value.id, newVal, 'rangeSlider');

    wulingRegionalRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

// 武陵醚质收集奖励
const wulingAuryleneCollectProgress = ref<number[]>([0, 11]);
// 武陵醚质收集奖励进度
watch(
  wulingAuryleneCollectProgress,
  (newVal) => {
    let originiumRecharge: number = 0;
    for (let i = newVal[0]!; i < newVal[1]!; i++) {
      const stageReward = wulingAuryleneCollectStageTable[i];
      if (stageReward !== undefined) {
        originiumRecharge += stageReward.originiumRecharge || 0;
      }
    }

    wulingAuryleneCollectReward.value.content.originiumRecharge = originiumRecharge;
    saveUserConfig(wulingAuryleneCollectReward.value.id, newVal, 'rangeSlider');

    wulingRegionalRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

// 武陵储藏箱奖励
const wulingCrateRewardProgress = ref<number[]>([0, wulingCrateRewardMax]);
// 武陵储藏箱奖励进度
watch(
  wulingCrateRewardProgress,
  (newVal) => {
    wulingCrateReward.value.content.diamond = newVal[1]! - newVal[0]!;
    saveUserConfig(wulingCrateReward.value.id, newVal, 'rangeSlider');

    wulingRegionalRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

// 武陵地区淤积点宝箱
const wulingBattleCrateRewardProgress = ref<number[]>([0, wulingBattleCrateRewardMax]);

watch(
  wulingBattleCrateRewardProgress,
  (newVal) => {
    wulingBattleCrateReward.value.content.originiumRecharge = newVal[1]! - newVal[0]!;
    saveUserConfig( wulingBattleCrateReward.value.id, newVal, 'rangeSlider');

    wulingRegionalRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);


// 武陵维修机器人奖励
const wulingDeltaBotProgress = ref<number[]>([0, wulingDeltaBotRewardMax]);
// 武陵维修机器人奖励进度
watch(
  wulingDeltaBotProgress,
  (newVal) => {
    wulingDeltaBotReward.value.content.diamond = newVal[1]! - newVal[0]!;
    saveUserConfig(wulingCrateReward.value.id, newVal, 'rangeSlider');

    wulingRegionalRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

// 武陵模拟空间奖励
const wulingSimulationProgress = ref<number[]>([0, 9]);
// 武陵模拟空间奖励进度
watch(
  wulingSimulationProgress,
  (newVal) => {
    wulingSimulationReward.value.content.diamond = (newVal[1]! - newVal[0]!) * 25;
    saveUserConfig(wulingSimulationReward.value.id, newVal, 'rangeSlider');

    wulingRegionalRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

// 武陵据点防御
watch(
  wulingDefenseConstructionReward,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }
    wulingRegionalRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

/**
 * 武陵地区奖励计算结尾
 */



let valleyIVRegionalRewardStatisticsResultDetail: RewardStatisticsResultDetail = {
  name: '四号谷地地区奖励',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
};

let wulingRegionalRewardStatisticsResultDetail: RewardStatisticsResultDetail = {
  name: '武陵地区奖励',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
};

function valleyIVRegionalRewardStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '四号谷地地区奖励',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  };

  addReward(result, valleyIVRegionalStockBillStoreReward.value);
  addReward(result, valleyIVRegionalDevelopmentReward.value);
  addReward(result, valleyIVAuryleneCollectReward.value);
  addReward(result, valleyIVCrateReward.value);
  addReward(result, valleyIVBattleCrateReward.value);
  addReward(result, valleyIVDeltaBotReward.value);
  addReward(result, valleyIVSimulationReward.value);
  addReward(result, valleyIVDefenseConstructionReward.value);

  valleyIVRegionalRewardStatisticsResultDetail = result;
  gachaResourceStatisticsResult.value.totalPulls.regional = getRewardsPull([valleyIVRegionalRewardStatisticsResultDetail,wulingRegionalRewardStatisticsResultDetail]);
}

function wulingRegionalRewardStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '武陵地区奖励',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  };

  addReward(result, wulingRegionalStockBillStoreReward.value);
  addReward(result, wulingRegionalDevelopmentReward.value);
  addReward(result, wulingAuryleneCollectReward.value);
  addReward(result, wulingCrateReward.value);
  addReward(result,wulingBattleCrateReward.value);
  addReward(result, wulingDeltaBotReward.value);
  addReward(result, wulingSimulationReward.value);
  addReward(result, wulingDefenseConstructionReward.value);

  wulingRegionalRewardStatisticsResultDetail = result;
  gachaResourceStatisticsResult.value.totalPulls.regional = getRewardsPull([valleyIVRegionalRewardStatisticsResultDetail,wulingRegionalRewardStatisticsResultDetail]);
}



/**
 * 地区奖励计算相关代码结尾
 */

/**
 * 等级奖励计算相关代码起始
 */
watch(
  authorityLevelTaskRewards,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }
    levelRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

const authorityLevelProgress = ref<number[]>([1, 60]);

watch(
  authorityLevelProgress,
  (newVal) => {
    let result: number = 0;
    for (const reward of authorityLevelUpRewardTable) {
      if (reward.level > newVal[0]! && reward.level <= newVal[1]!) {
        result += reward.diamond;
      }
    }

    authorityLevelUpReward.value.content.diamond = result;
    saveUserConfig(authorityLevelUpReward.value.id, newVal, 'rangeSlider');

    levelRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

// 世界探索等级奖励进度
const worldLevelProgress = ref<number[]>([3, 7]);

// 世界探索等级奖励进度
watch(
  worldLevelProgress,
  (newVal) => {
    worldLevelReward.value.content.ticketgachaStandardSingle = (newVal[1]! - newVal[0]!) * 3;
    saveUserConfig(worldLevelReward.value.id, newVal, 'rangeSlider');

    levelRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

let levelRewardStatisticsResultDetail: RewardStatisticsResultDetail = {
  name: '等级奖励',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
};

function levelRewardStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '等级奖励',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  };

  addReward(result, authorityLevelTaskRewards.value);
  addReward(result, authorityLevelUpReward.value);
  addReward(result, worldLevelReward.value);

  levelRewardStatisticsResultDetail = result;
  gachaResourceStatisticsResult.value.totalPulls.level = getRewardPull(result);
}

/**
 * 等级奖励计算相关代码结尾
 */

/**
 * 常驻奖励计算相关代码起始
 */
const beginnerCheckInTaskProgress = ref<number[]>([1, 14]);

watch(
  beginnerCheckInTaskProgress,
  (newVal) => {
    let result = newVal[1]! - newVal[0]!;

    if (newVal?.[0] !== undefined && newVal[0] < 11) {
      result--;
    }

    if (newVal?.[0] != undefined && newVal[0] < 3) {
      result--;
    }

    if (result < 0) {
      result = 0;
    }

    beginnerSignInTaskReward.value.content.ticketgachaSpecialSingle = result;
    saveUserConfig(beginnerSignInTaskReward.value.id, newVal, 'rangeSlider');

    permanentRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

watch(
  newHorizonsTaskReward,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }

    permanentRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

watch(
  valleyIVTaskRewardTable,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }

    permanentRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

watch(
  wulingTaskRewardTable,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }

    permanentRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

watch(
  etchSpaceSalvageReward,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }

    permanentRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

let permanentRewardStatisticsResultDetail: RewardStatisticsResultDetail = {
  name: '常驻奖励',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
};

function permanentRewardStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '常驻奖励',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  };
  addReward(result, beginnerSignInTaskReward.value);
  addReward(result, newHorizonsTaskReward.value);
  addReward(result, valleyIVTaskRewardTable.value);
  addReward(result, wulingTaskRewardTable.value);

  addReward(result, etchSpaceSalvageReward.value);

  permanentRewardStatisticsResultDetail = result;
  gachaResourceStatisticsResult.value.totalPulls.permanent = getRewardPull(result);
}

/**
 * 常驻奖励计算相关代码结尾
 */

/**
 * 行动手册奖励计算相关代码结尾
 */

const operationalManualNodeProgress = ref<number[]>([0, 12]);

watch(
  operationalManualNodeProgress,
  (newVal) => {
    operationalManualNodeReward.value.content.diamond = (newVal[1]! - newVal[0]!) * 750;
    saveUserConfig(operationalManualNodeReward.value.id, newVal, 'rangeSlider');

    operationalManualRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

watch(
  operationalManualReward,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }

    operationalManualRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

let operationalManualRewardStatisticsResultDetail: RewardStatisticsResultDetail = {
  name: '等级奖励',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
};

function operationalManualRewardStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '行动手册',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  };

  addReward(result, operationalManualNodeReward.value);
  addReward(result, operationalManualReward.value);
  operationalManualRewardStatisticsResultDetail = result;
  gachaResourceStatisticsResult.value.totalPulls.operationalManual = getRewardPull(result);
}

/**
 * 行动手册奖励计算相关代码结尾
 */

/**
 * 氪金计算相关代码起始
 *
 */

// 氪金资源状态
const rechargeResources = ref<{
  monthlyPass: boolean;
  battlePass: boolean;
  protocolCustomization: boolean;
  monthlyPassDays: number;
  selectedPacks: Record<string, number>;
  originiumStones: Record<string, number>;
}>({
  monthlyPass: false,
  battlePass: false,
  protocolCustomization: false,
  monthlyPassDays: 30,
  selectedPacks: {},
  originiumStones: {},
});

const resourceStatisticsResultDetailList = ref<RewardStatisticsResultDetail[]>([]);

// 计算氪金总金额
const paidResourcesTotalPrice = computed(() => {
  let total = 0;

  // 月卡金额
  if (rechargeResources.value.monthlyPass) {
    const monthlyPack = packs['月卡'];
    if (monthlyPack) {
      total += monthlyPack.price;
    }
  }

  // 协议定制金额（源石配给是免费的）
  if (rechargeResources.value.protocolCustomization) {
    total += 68;
  }

  // 礼包金额
  for (const [packId, quantity] of Object.entries(rechargeResources.value.selectedPacks)) {
    if (quantity > 0) {
      const pack = packs[packId as keyof typeof packs];
      if (pack) {
        total += pack.price * quantity;
      }
    }
  }

  // 普通源石金额
  for (const [stoneId, quantity] of Object.entries(rechargeResources.value.originiumStones)) {
    if (quantity > 0) {
      const stone = packs[stoneId as keyof typeof packs];
      if (stone) {
        total += stone.price * quantity;
      }
    }
  }

  return total;
});

watch(
  rechargeResources,
  () => {
    rechargeResourceStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

let rechargeResourceStatisticsResultDetail: RewardStatisticsResultDetail = {
  name: '氪金资源',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
};

function rechargeResourceStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '氪金资源',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  };

  // 计算月卡
  if (rechargeResources.value.monthlyPass) {
    const monthlyPack = packs['月卡'];
    if (monthlyPack) {
      result.originiumRecharge += 12; // 一次性12源石
      result.diamond += rechargeResources.value.monthlyPassDays * 200; // 每天200嵌晶玉
    }
  }

  // 计算源石配给（3源石，免费）
  if (rechargeResources.value.battlePass) {
    result.originiumRecharge += 3;
  }

  // 计算协议定制（36源石，68元）
  if (rechargeResources.value.protocolCustomization) {
    result.originiumRecharge += 36;
  }

  // 计算选中的礼包
  for (const [packId, quantity] of Object.entries(rechargeResources.value.selectedPacks)) {
    if (quantity > 0 && packs[packId as keyof typeof packs]) {
      const pack = packs[packId as keyof typeof packs];
      if (pack && pack.contents) {
        for (const item of pack.contents) {
          switch (item.itemId) {
          case 'item_originium_recharge': {
            result.originiumRecharge += item.quantity * quantity;

          break;
          }
          case 'item_diamond': {
            result.diamond += item.quantity * quantity;

          break;
          }
          case 'item_ticketgacha_special_single': {
            result.ticketgachaSpecialSingle += item.quantity * quantity;

          break;
          }
          case 'item_ticketgacha_standard_single': {
            result.ticketgachaStandardSingle += item.quantity * quantity;

          break;
          }
          default: { if (item.itemId.includes('ticketgacha_special_ten')) {
            result.ticketgachaSpecialSingle += item.quantity * 10 * quantity;
          }
          }
          }
        }
      }
    }
  }

  // 计算源石
  for (const [stoneId, quantity] of Object.entries(rechargeResources.value.originiumStones)) {
    if (quantity > 0 && packs[stoneId as keyof typeof packs]) {
      const stone = packs[stoneId as keyof typeof packs];
      if (stone && stone.contents) {
        for (const item of stone.contents) {
          if (item.itemId === 'item_originium_recharge') {
            result.originiumRecharge += item.quantity * quantity;
          }
        }
      }
    }
  }

  rechargeResourceStatisticsResultDetail = result;
  gachaResourceStatisticsResult.value.totalPulls.recharge = getRewardPull(result);
}

/**
 * 氪金计算相关代码结尾
 */

const totalResourceStatisticsResultDetail = ref({
  name: '全部资源',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
});

function allRewardStatisticsV2 (): void {
  const list: RewardStatisticsResultDetail[] = [
    existingRewardStatisticsResultDetail,
    dailyRewardStatisticsResultDetail,
    activityRewardStatisticsResultDetail,
    otherRewardStatisticsResultDetail,
    valleyIVRegionalRewardStatisticsResultDetail,
    wulingRegionalRewardStatisticsResultDetail,
    levelRewardStatisticsResultDetail,
    permanentRewardStatisticsResultDetail,
    operationalManualRewardStatisticsResultDetail,
    rechargeResourceStatisticsResultDetail,
  ];

  const result: RewardStatisticsResultDetail = {
    name: '共计',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  };

  for (const item of list) {
    result.originiumRecharge += item.originiumRecharge;
    result.diamond += item.diamond;
    result.ticketgachaStandardSingle += item.ticketgachaStandardSingle;
    result.ticketgachaSpecialSingle += item.ticketgachaSpecialSingle;
  }

  totalResourceStatisticsResultDetail.value = result;

  gachaResourceStatisticsResult.value.totalPulls.total = getRewardPull(result);

  list.push(result);

  resourceStatisticsResultDetailList.value = list;

  pieChartData = [];
  for (const key in gachaResourceStatisticsResult.value.totalPulls) {
    const totalPullsSingle: TotalPullsSingle = gachaResourceStatisticsResult.value.totalPulls[
      key
    ] as TotalPullsSingle;
    if (totalPullsSingle === undefined) {
      continue;
    }
    const value: number = totalPullsSingle.ticketgachaSpecialSingle || 0;

    if ('total' === key || value === 0) {
      continue;
    }
    pieChartData.push({
      value: numberFloor(value),
      name: t(`page.tools.gachaCalculator.${key}`),
    });
  }

  setPieChart(pieChartData);
}

let myChart: any;

// 饼图的数据
let pieChartData: PieChartData[] = [
  { value: 22, name: t('page.tools.gachaCalculator.existing') },
  { value: 33, name: t('page.tools.gachaCalculator.daily') },
  { value: 44, name: t('page.tools.gachaCalculator.activityReward') },
  { value: 22, name: t('page.tools.gachaCalculator.potentialReward') },
  { value: 33, name: t('page.tools.gachaCalculator.permanentReward') },
  { value: 44, name: t('page.tools.gachaCalculator.rechargeReward') },
  { value: 44, name: t('page.tools.gachaCalculator.regionalReward') },
  { value: 44, name: t('page.tools.gachaCalculator.pieChartName') },
];

function setPieChart(data: PieChartData[]) {
  const option = {
    tooltip: {
      confine: true, // 限制 tooltip 在图表容器内显示
      trigger: 'item',
      formatter: (params: any) => {
        // ECharts 饼图的 params 可能是单个对象或数组
        const param = Array.isArray(params) ? params[0] : params;
        // 使用 HTML 换行标签
        return `
          <div>
            <div> ${param.name || ''}</div>
            <div>${param.seriesName || ''}</div>
            <div> ${(param.percent || 0).toFixed(1)}%</div>
          </div>
        `;
      },
    },

    series: [
      {
        name: t('page.tools.gachaCalculator.pieChartName'),
        type: 'pie',
        radius: '70%',
        center: ['50%', '50%'],
        data: data,
        itemStyle: {},
        label: {
          show: true,
          textStyle: { color: 'rgb(255,69,0)', fontSize: '12' },
        },
        labelLine: {
          length: 4,
          length2: 4,
        },

        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    ],
  };

  myChart.setOption(option);
}

// 由于expansion-panel折叠会销毁组件，需要监听 panel.value 变化, 当包含 statisticalResult 时, 初始化饼图
watch(
  () => leftPartPanel.value,
  (newValue) => {
    if (newValue.includes('statisticalResult')) {
      // 等待组件渲染完成
      nextTick(() => {
        // 等待组件渲染完成, 确保元素存在
        const pieElement: HTMLElement | null = document.querySelector(
          '#gacha-calculator-pie-chart',
        );
        // 检查元素是否存在
        if (!pieElement) {
          return;
        }
        // 检查是否已存在实例，避免重复创建
        myChart = echarts.init(pieElement);
        setPieChart(pieChartData);
      });
    }
  },
);

const rangeSliderMap: Record<string, Ref<number[]>> = {
  beginner_sign_in_task: beginnerCheckInTaskProgress,
  operational_manual_node_reward: operationalManualNodeProgress,
  authority_level_up_reward: authorityLevelProgress,
  world_level_reward: worldLevelProgress,
  valley_IV_regional_development_reward: valleyIVRegionalDevelopmentProgress,
  valley_IV_aurylene_collect_reward: valleyIVAuryleneCollectProgress,
  valley_IV_crate_reward: valleyIVCrateRewardProgress,
  valley_IV_battle_crate_reward: valleyIVBattleCrateRewardProgress,
  valley_IV_delta_bot_reward: valleyIVDeltaBotProgress,
  valley_IV_simulation_reward: valleyIVSimulationProgress,
  wuling_regional_development_reward: wulingRegionalDevelopmentProgress,
  wuling_aurylene_collect_reward: wulingAuryleneCollectProgress,
  wuling_crate_reward: wulingCrateRewardProgress,
  wuling_battle_crate_reward: wulingBattleCrateRewardProgress,
  wuling_delta_bot_reward: wulingDeltaBotProgress,
  wuling_simulation_reward: wulingSimulationProgress,
  factory_manual_reward: factoryManualProgress,
};

const buttonMap: Record<string, Ref<Reward>> = {};

function loadingUserConfig() {
  const localConfigStr = localStorage.getItem('Gacha_Calculator_User_Config');
  if (localConfigStr) {
    try {
      const localConfig: GachaCalculatorUserConfig = JSON.parse(localConfigStr);
      // 使用localConfig
      if (localConfig.rangeSlider) {
        for (const key in localConfig.rangeSlider) {
          const range = localConfig.rangeSlider[key];
          if (range === undefined || !Array.isArray(range)) {
            continue;
          }
          gachaCalculatorUserConfig.value.rangeSlider[key] = range;
          if (rangeSliderMap[key]) {
            rangeSliderMap[key].value = range;
          }
        }
      }

      if (localConfig.buttonActive) {
        _setButtonActive(localConfig.buttonActive, valleyIVRegionalStockBillStoreReward);
        _setButtonActive(localConfig.buttonActive, wulingRegionalStockBillStoreReward);
        gachaCalculatorUserConfig.value.buttonActive = localConfig.buttonActive;
      }

      if (localConfig.buttonGroupActive) {
        _setButtonGroupActive(localConfig.buttonGroupActive, AICQuotaReward);
        _setButtonGroupActive(localConfig.buttonGroupActive, authorityLevelTaskRewards);
        _setButtonGroupActive(localConfig.buttonGroupActive, valleyIVTaskRewardTable);
        _setButtonGroupActive(localConfig.buttonGroupActive, valleyIVDefenseConstructionReward);
        _setButtonGroupActive(localConfig.buttonGroupActive, wulingTaskRewardTable);
        _setButtonGroupActive(localConfig.buttonGroupActive, wulingDefenseConstructionReward);
        _setButtonGroupActive(localConfig.buttonGroupActive, etchSpaceSalvageReward);
        _setButtonGroupActive(localConfig.buttonGroupActive, operationalManualReward);
        _setButtonGroupActive(localConfig.buttonGroupActive, activityReward);
        _setButtonGroupActive(localConfig.buttonGroupActive, intelArchiveReward);
        _setButtonGroupActive(localConfig.buttonGroupActive, newHorizonsTaskReward);
        _setButtonGroupActive(localConfig.buttonGroupActive, otherRewardTable);

        gachaCalculatorUserConfig.value.buttonGroupActive = localConfig.buttonGroupActive;
      }

      if (localConfig.existingResource) {
        gachaCalculatorUserConfig.value.existingResource.originiumRecharge =
          localConfig.existingResource.originiumRecharge || 0;
        gachaCalculatorUserConfig.value.existingResource.diamond =
          localConfig.existingResource.diamond || 0;
        gachaCalculatorUserConfig.value.existingResource.ticketgachaStandardSingle =
          localConfig.existingResource.ticketgachaStandardSingle || 0;
        gachaCalculatorUserConfig.value.existingResource.ticketgachaSpecialSingle =
          localConfig.existingResource.ticketgachaSpecialSingle || 0;
      }
    } catch (error) {
      console.error('Failed to parse user config:', error);
    }
  }

  /**
   * 设置按钮的激活状态
   * @param statusMap 状态映射对象，键为奖励ID，值为激活状态
   * @param reward 奖励对象的Ref引用
   */
  function _setButtonActive(statusMap: Record<string, boolean>, reward: Ref<Reward>) {
    const rewardValue = reward.value;
    // 检查状态映射中是否存在对应ID的状态
    const status = statusMap[rewardValue.id];
    if (status !== undefined) {
      // 设置激活状态，如果状态为falsy值则设为false
      rewardValue.active = status || false;
    }
  }

  /**
   * 设置按钮组的激活状态
   * @param statusMap 状态映射对象，键为奖励ID，值为激活状态
   * @param rewards 奖励对象数组的Ref引用
   */
  function _setButtonGroupActive(statusMap: Record<string, boolean>, rewards: Ref<Reward[]>) {
    // 获取奖励数组的实际值
    const rewardArray = rewards.value;

    // 遍历奖励数组
    for (const reward of rewardArray) {
      // 检查状态映射中是否存在对应ID的状态
      const status = statusMap[reward.id];
      if (status !== undefined) {
        // 设置激活状态，如果状态为falsy值则设为false
        reward.active = status || false;
      }
    }
  }
}

onMounted(() => {
  loadingUserConfig();
  myChart = echarts.init(document.querySelector('#gacha-calculator-pie-chart'));
  setPieChart(pieChartData);
  if (poolOptions.value[0] !== undefined) {
    selectedPool(poolOptions.value[0]);
  }
});

const moduleSelectedStatus: ModuleSelectedStatus = {
  activity: {
    selectAll: true,
  },
  other: {
    selectAll: true,
  },
  regional: {
    selectAll: true,
  },
  level: {
    selectAll: true,
  },
  permanent: {
    selectAll: true,
  },
};

function clearOrSelectAllActivityModule(action: boolean) {
  clearOrSelectAll(action, 'button', activityReward);
}

function clearOrSelectAllOtherModule(action: boolean) {
  clearOrSelectAll(action, 'button', otherRewardTable);
  clearOrSelectAll(action, 'rangeSlider', factoryManualProgress, [0, factoryManualRewardMax]);
  clearOrSelectAll(action, 'button', intelArchiveReward);
}

function clearOrSelectAllValleyIVRegionalModule(action: boolean) {
  clearOrSelectAll(action, 'button', valleyIVRegionalStockBillStoreReward);
  clearOrSelectAll(action, 'rangeSlider', valleyIVRegionalDevelopmentProgress, [1, 12]);
  clearOrSelectAll(action, 'rangeSlider', valleyIVAuryleneCollectProgress, [0, 18]);
  clearOrSelectAll(action, 'rangeSlider', valleyIVCrateRewardProgress, [0, valleyIVCrateRewardMax]);
  clearOrSelectAll(action, 'rangeSlider', valleyIVBattleCrateRewardProgress, [
    0,
    valleyIVBattleCrateRewardMax,
  ]);
  clearOrSelectAll(action, 'rangeSlider', valleyIVDeltaBotProgress, [0, valleyIVDeltaBotRewardMax]);
  clearOrSelectAll(action, 'rangeSlider', valleyIVSimulationProgress, [0, 26]);
  clearOrSelectAll(action,'button',valleyIVDefenseConstructionReward)
}

function clearOrSelectAllWulingRegionalModule(action: boolean) {

  clearOrSelectAll(action, 'button', wulingRegionalStockBillStoreReward);
  clearOrSelectAll(action, 'rangeSlider', wulingRegionalDevelopmentProgress, [0, 6]);
  clearOrSelectAll(action, 'rangeSlider', wulingAuryleneCollectProgress, [0, 18]);
  clearOrSelectAll(action, 'rangeSlider', wulingCrateRewardProgress, [0, wulingCrateRewardMax]);
  clearOrSelectAll(action,'rangeSlider', wulingBattleCrateRewardProgress, [0, wulingBattleCrateRewardMax]);
  clearOrSelectAll(action, 'rangeSlider', wulingDeltaBotProgress, [0, wulingDeltaBotRewardMax]);
  clearOrSelectAll(action, 'rangeSlider', wulingSimulationProgress, [0, 9]);
  clearOrSelectAll(action,'button',wulingDefenseConstructionReward)
}



function clearOrSelectAllLevelModule(action: boolean) {
  clearOrSelectAll(action, 'rangeSlider', authorityLevelProgress, [0, 60]);
  clearOrSelectAll(action, 'button', authorityLevelTaskRewards);
  clearOrSelectAll(action, 'rangeSlider', worldLevelProgress, [3, 7]);
}

function clearOrSelectAllOtherPermanentModule(action: boolean) {
  clearOrSelectAll(action, 'rangeSlider', beginnerCheckInTaskProgress, [0, 14]);
  clearOrSelectAll(action, 'button', newHorizonsTaskReward);
}

function clearOrSelectAllPermanentValleyIVTaskModule(action: boolean) {
  clearOrSelectAll(action, 'button', valleyIVTaskRewardTable);
}

function clearOrSelectAllPermanentWulingTaskModule(action: boolean) {
  clearOrSelectAll(action, 'button', wulingTaskRewardTable);
}

function clearOrSelectAllPermanentEtchSpaceSalvageTaskModule(action: boolean) {
  clearOrSelectAll(action, 'button', etchSpaceSalvageReward);
}

function clearOrSelectAllOperationalManualModule(action: boolean) {
  clearOrSelectAll(action, 'button', operationalManualReward);
  clearOrSelectAll(action, 'rangeSlider', operationalManualNodeProgress, [0, 12]);
}

function clearOrSelectAll(
  action: boolean,
  type: string,
  reward: Ref<Reward> | Ref<Reward[]> | Ref<number[]>,
  range: number[] = [0, 0],
) {
  if ('button' === type) {
    const value = reward.value;
    if (Array.isArray(value)) {
      // 处理 Ref<Reward[]> 类型
      for (const item of value) {
        if (typeof item === 'object' && item !== null && 'active' in item) {
          item.active = action;
        }
      }
    } else if (typeof value === 'object' && value !== null && 'active' in value) {
      // 处理 Ref<Reward> 类型
      value.active = action;
    }
    // 忽略 Ref<number[]> 类型
  }

  if ('rangeSlider' === type) {
    const value = reward.value;

    if (Array.isArray(value) && value.length > 1) {
      value[0] = action ? (range[0] as number) : 0;
      value[1] = action ? (range[1] as number) : 0;
    }
  }
}

const clearBtnGroup = [
  {
    text: '活动奖励',
    func: clearOrSelectAllActivityModule,
  },
  {
    text: '其他奖励',
    func: clearOrSelectAllOtherModule,
  },
  {
    text: '四号谷地-地区奖励',
    func: clearOrSelectAllValleyIVRegionalModule,
  },
  {
    text: '武陵地区奖励',
    func: clearOrSelectAllWulingRegionalModule,
  },
  {
    text: '等级奖励',
    func: clearOrSelectAllLevelModule,
  },
  {
    text: '常驻奖励-其他',
    func: clearOrSelectAllOtherPermanentModule,
  },
  {
    text: '常驻奖励—四号谷地任务',
    func: clearOrSelectAllPermanentValleyIVTaskModule,
  },
  {
    text: '常驻奖励—武陵任务',
    func: clearOrSelectAllPermanentWulingTaskModule,
  },
  {
    text: '常驻奖励—蚀刻遗像',
    func: clearOrSelectAllPermanentEtchSpaceSalvageTaskModule,
  },
  {
    text: '行动手册',
    func: clearOrSelectAllOperationalManualModule,
  },
];

// 工具函数

/**
 * 检查奖励是否在当前池子期间内有效
 * @param reward 奖励对象
 * @returns 是否有效
 */

/**
 * 保存用户输入配置
 * @param key {string} 奖励的唯一key
 * @param value {number | boolean | number[] | boolean[]}奖励的状态值
 * @param type {string} 奖励UI类型，奖励类型如下：<br>
 * 如果是按钮填入 'buttonActive'<br>
 * 如果是多个按钮填入 'buttonGroupActive'<br>
 * 如果是普通滑块填入 'slider'<br>
 * 如果是范围滑块填入 'rangeSlider'
 */
function saveUserConfig(
  key: string,
  value: number | number[] | boolean | boolean[],
  type: string,
): void {
  if ('rangeSlider' === type) {
    if (!(Array.isArray(value) && value.length > 0 && typeof value[0] === 'number')) {
      console.log('传入配置非数组类型');
      return;
    }

    value = value as number[];
    if (gachaCalculatorUserConfig.value.rangeSlider === undefined) {
      gachaCalculatorUserConfig.value.rangeSlider = {};
    }
    gachaCalculatorUserConfig.value.rangeSlider[key] = value;
  }

  // if ('slider' === type) {
  //   if (typeof value !== 'number') {
  //     console.log('传入配置非数字类型');
  //     return;
  //   }
  //   if (gachaCalculatorUserConfig.value.slider === undefined) {
  //     gachaCalculatorUserConfig.value.slider = {};
  //   }
  //   gachaCalculatorUserConfig.value.slider[key] = value;
  // }

  if ('buttonActive' === type) {
    if (typeof value !== 'boolean') {
      console.log('传入配置非布尔类型');
      return;
    }
    if (gachaCalculatorUserConfig.value.buttonActive === undefined) {
      gachaCalculatorUserConfig.value.buttonActive = {};
    }
    gachaCalculatorUserConfig.value.buttonActive[key] = value;
  }

  if ('buttonGroupActive' === type) {
    if (typeof value !== 'boolean') {
      console.log('传入配置非布尔类型');
      return;
    }
    if (gachaCalculatorUserConfig.value.buttonGroupActive === undefined) {
      gachaCalculatorUserConfig.value.buttonGroupActive = {};
    }

    gachaCalculatorUserConfig.value.buttonGroupActive[key] = value;
  }

  localStorage.setItem(
    'Gacha_Calculator_User_Config',
    JSON.stringify(gachaCalculatorUserConfig.value),
  );
}

function checkRewardIsValid(reward: Reward): boolean {
  const currentPoolValue = currentPool.value;

  let display = reward.type === '通用' || reward.type === currentPoolValue.type;

  // 活动结束时间在当前池子开始时间之前，活动已结束
  if (reward.end <= startDate) {
    console.log(reward.name.zh,"过期")
    display = false;
  }

  // 活动开始时间在当前池子结束时间之后，活动未开始
  if (reward.start > currentPoolValue.end) {
    console.log(reward.name.zh,"过期")
    display = false;
  }

  // console.log(currentPool.value.start, currentPoolValue.end);
  // console.log(reward.name.zh,reward.start,reward.end);
  // 判断奖励类型是否可以被计入
  // 通用类型都可以计入，特殊类型需要与当前池子类型匹配

  return display;
}
</script>

<template>

    <section class="gacha-calculator-container">
      <div class="gacha-calculator-container-left">
        <v-expansion-panels v-model="leftPartPanel" multiple variant="popout">
          <v-expansion-panel value="statisticalResult">
            <v-expansion-panel-title class="gacha-calculator-card-title">
              <div>
                {{ t('page.tools.gachaCalculator.total') }}
                {{ gachaResourceStatisticsResult.totalPulls.total?.ticketgachaStandardSingle }}
                {{ t('page.tools.gachaCalculator.standard')
                }}{{ t('page.tools.gachaCalculator.ticketgacha') }}，
                {{
                  numberFloor(
                    gachaResourceStatisticsResult.totalPulls.total?.ticketgachaSpecialSingle,
                    0,
                  )
                }}
                {{ t('page.tools.gachaCalculator.special')
                }}{{ t('page.tools.gachaCalculator.ticketgacha') }}，
                {{ t('page.tools.gachaCalculator.rechargeAmount') }}
                {{ paidResourcesTotalPrice.toFixed(2) }}
                {{ t('page.tools.gachaCalculator.yuan') }}
              </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-btn-group class="gacha-calculator-pool-btn-group-pc">
                <v-btn
                  v-for="option in poolOptions"
                  class="gacha-calculator-pool-btn-pc"
                  :color="currentPool.name === option.name ? option.color : '#aaaaaa'"
                  :disabled  = "option.disabled"
                  @click="selectedPool(option)"
                  >{{ option.name }}<br >{{ option.dateText }}
                </v-btn>
              </v-btn-group>
              <v-btn
                v-for="option in poolOptions"
                class="gacha-calculator-pool-btn-phone"
                :color="currentPool.name === option.name ? option.color : '#aaaaaa'"
                :disabled  = "option.disabled"
                @click="selectedPool(option)"
                >{{ option.name }}<br >{{ option.dateText }}
              </v-btn>

              <div class="gacha-calculator-warning">
                攒抽计算器尚在测试与更新中，目前可能bug较多，资源不全，结果仅供参考，切勿轻信本站！
              </div>

              <div class="gacha-calculator-chart-and-table">
                <div
                  id="gacha-calculator-pie-chart"
                  ref="gacha-calculator-pie-chart"
                  class="gacha-calculator-pie-chart"
                />

                <div class="gacha-calculator-statistics-result">
                  <div class="gacha-calculator-statistics-result-item">
                    <img
                      alt="existing"
                      class="gacha-calculator-gacha-item-icon"
                      src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp"
                    >
                    <span class="gacha-calculator-statistics-result-item-text">
                      {{
                        t('page.tools.gachaCalculator.countWithPulls', {
                          count: totalResourceStatisticsResultDetail.originiumRecharge,
                          pulls: numberFloor(
                            totalResourceStatisticsResultDetail.originiumRecharge * 0.15,
                          ),
                        })
                      }}
                    </span>
                  </div>

                  <div class="gacha-calculator-statistics-result-item">
                    <img
                      alt="existing"
                      class="gacha-calculator-gacha-item-icon"
                      src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp"
                    >
                    <span class="gacha-calculator-statistics-result-item-text">
                      {{
                        t('page.tools.gachaCalculator.countWithPulls', {
                          count: numberFloor(totalResourceStatisticsResultDetail.diamond, 0),
                          pulls: numberFloor(totalResourceStatisticsResultDetail.diamond / 500),
                        })
                      }}
                    </span>
                  </div>

                  <div class="gacha-calculator-statistics-result-item">
                    <img
                      alt="existing"
                      class="gacha-calculator-gacha-item-icon"
                      src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp"
                    >
                    <span class="gacha-calculator-statistics-result-item-text">
                      {{ totalResourceStatisticsResultDetail.ticketgachaStandardSingle }}
                    </span>
                  </div>

                  <div class="gacha-calculator-statistics-result-item">
                    <img
                      alt="existing"
                      class="gacha-calculator-gacha-item-icon"
                      src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp"
                    >
                    <span class="gacha-calculator-statistics-result-item-text">
                      {{ totalResourceStatisticsResultDetail.ticketgachaSpecialSingle }}
                    </span>
                  </div>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel value="detail">
            <v-expansion-panel-title class="gacha-calculator-card-title">
              <div>{{ t('page.tools.gachaCalculator.calculationDetail') }}</div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-table class="gacha-calculator-result-detail-table">
                <thead>
                  <tr>
                    <th style="font-weight: bolder">奖励来源</th>
                    <th>
                      <img
                        alt="existing"
                        class="gacha-calculator-result-detail-table-icon"
                        src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp"
                      >
                    </th>
                    <th>
                      <img
                        alt="existing"
                        class="gacha-calculator-result-detail-table-icon"
                        src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp"
                      >
                    </th>
                    <th>
                      <img
                        alt="existing"
                        class="gacha-calculator-result-detail-table-icon"
                        src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp"
                      >
                    </th>
                    <th>
                      <img
                        alt="existing"
                        class="gacha-calculator-result-detail-table-icon"
                        src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp"
                      >
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in resourceStatisticsResultDetailList">
                    <td>{{ item.name }}</td>
                    <td>
                      {{
                        t('page.tools.gachaCalculator.countWithPulls', {
                          count: item.originiumRecharge,
                          pulls: numberFloor(item.originiumRecharge * 0.15),
                        })
                      }}
                    </td>
                    <td>
                      {{
                        t('page.tools.gachaCalculator.countWithPulls', {
                          count: item.diamond,
                          pulls: numberFloor(item.diamond / 500),
                        })
                      }}
                    </td>
                    <td>{{ item.ticketgachaStandardSingle }}</td>
                    <td>{{ item.ticketgachaSpecialSingle }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-title class="gacha-calculator-card-title">
              <div>{{ t('page.tools.gachaCalculator.shortcutActions') }}</div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-table class="gacha-calculator-shortcut-btn-table">
                <thead>
                  <tr>
                    <td>模块</td>
                    <td>操作</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="action in clearBtnGroup">
                    <td>{{ action.text }}</td>
                    <td>
                      <v-btn
                        class="gacha-calculator-shortcut-btn"
                        color="red"
                        text="清空所有选中奖励"
                        @click="action.func(false)"
                      />
                      <v-btn
                        class="gacha-calculator-shortcut-btn"
                        color="blue"
                        text="选中所有奖励"
                        @click="action.func(true)"
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <div class="placeholder-block" />
      </div>
      <!--      <div>-->
      <!--        {{ JSON.stringify(allGachaResource) }}-->
      <!--      </div>-->
      <div class="gacha-calculator-container-right">
        <v-alert style="margin-bottom: 8px" type="info">
          基础寻访次数仅在总计模块显示，各模块不再单独显示
        </v-alert>
        <v-expansion-panels v-model="rightPartPanel" multiple variant="popout">
          <!--库存-->
          <v-expansion-panel value="existing">
            <v-expansion-panel-title class="gacha-calculator-card-title">
              <div>
                库存
                {{
                  numberFloor(
                    gachaResourceStatisticsResult.totalPulls.existing?.ticketgachaSpecialSingle,
                    1,
                  )
                }}
                {{ t('page.tools.gachaCalculator.pulls') }}
              </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <div class="gacha-calculator-existing-resource">
                <div class="gacha-calculator-existing-resource-input">
                  <img
                    alt="existing"
                    class="gacha-calculator-gacha-item-icon"
                    src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp"
                  >
                  <v-text-field
                    v-model="existingResource.originiumRecharge"
                    hide-details="auto"
                    label="衍质源石"
                    variant="solo"
                  />
                </div>
              </div>
              <div class="gacha-calculator-existing-resource">
                <div class="gacha-calculator-existing-resource-input">
                  <img
                    alt="existing"
                    class="gacha-calculator-gacha-item-icon"
                    src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp"
                  >
                  <v-text-field
                    v-model="existingResource.diamond"
                    hide-details="auto"
                    label="嵌晶玉"
                    variant="solo"
                  />
                </div>
              </div>
              <div class="gacha-calculator-existing-resource">
                <div class="gacha-calculator-existing-resource-input">
                  <img
                    alt="existing"
                    class="gacha-calculator-gacha-item-icon"
                    src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp"
                  >
                  <v-text-field
                    v-model="existingResource.ticketgachaStandardSingle"
                    hide-details="auto"
                    label="基础寻访凭证"
                    variant="solo"
                  />
                </div>
              </div>
              <div class="gacha-calculator-existing-resource">
                <div class="gacha-calculator-existing-resource-input">
                  <img
                    alt="existing"
                    class="gacha-calculator-gacha-item-icon"
                    src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp"
                  >
                  <v-text-field
                    v-model="existingResource.ticketgachaSpecialSingle"
                    hide-details="auto"
                    label="特许寻访凭证"
                    variant="solo"
                  />
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!--日常奖励-->
          <v-expansion-panel value="daily">
            <v-expansion-panel-title class="gacha-calculator-card-title">
              <div>
                日常积累
                {{
                  numberFloor(
                    gachaResourceStatisticsResult.totalPulls.daily?.ticketgachaSpecialSingle,
                    1,
                  )
                }}
                {{ t('page.tools.gachaCalculator.pulls') }}
              </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <GachaCalculatorResourceSingle v-bind="dailyReward" />
              <GachaCalculatorResourceSingle v-bind="weekTaskReward" />
              <v-divider style="margin: 1rem 0" />
              <GachaCalculatorModuleTitle title="集成配额交易"/>
              <GachaCalculatorResourceSingleBtn
                v-for="item in AICQuotaReward"
                v-show="checkRewardIsValid(item)"
                :key="item.id"
                v-bind="item"
                @click="item.active = !item.active"
              />



            </v-expansion-panel-text>
          </v-expansion-panel>

          <!--活动奖励-->
          <v-expansion-panel value="activity">
            <v-expansion-panel-title class="gacha-calculator-card-title">
              <div>
                活动奖励
                {{
                  numberFloor(
                    gachaResourceStatisticsResult.totalPulls.activity?.ticketgachaSpecialSingle,
                    1,
                  )
                }}
                {{ t('page.tools.gachaCalculator.pulls') }}
              </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <GachaCalculatorResourceSingleBtn
                v-for="item in activityReward"
                v-show="checkRewardIsValid(item)"
                :key="item.id"
                v-bind="item"
                @click="item.active = !item.active"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!--其他奖励-->
          <v-expansion-panel value="other">
            <v-expansion-panel-title class="gacha-calculator-card-title">
              <div>
                其他奖励
                {{
                  numberFloor(
                    gachaResourceStatisticsResult.totalPulls.other?.ticketgachaSpecialSingle,
                    1,
                  )
                }}
                {{ t('page.tools.gachaCalculator.pulls') }}
              </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <GachaCalculatorResourceSingleBtn
                v-for="item in otherRewardTable"
                v-show="checkRewardIsValid(item)"
                :key="item.id"
                v-bind="item"
                @click="item.active = !item.active"
              />

              <v-divider style="margin: 1rem 0" />

              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="factoryManualReward" />
                  <v-range-slider
                    v-model="factoryManualProgress"
                    class="v-range-slider"
                    hide-details="auto"
                    :max="factoryManualRewardMax"
                    step="5"
                    thumb-label="always"
                    tick-size="4"
                  />
                  因手册奖励过于零散，只能通过滑块大致计算
                </v-card-text>
              </v-card>
              <v-divider style="margin: 1rem 0" />

              <GachaCalculatorResourceSingleBtn
                v-for="item in intelArchiveReward"
                :key="item.id"
                v-bind="item"
                @click="item.active = !item.active"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!--地区奖励-->
          <v-expansion-panel value="regional">
            <v-expansion-panel-title class="gacha-calculator-card-title">
              <div>
                地区奖励
                {{
                  numberFloor(
                    gachaResourceStatisticsResult.totalPulls.regional?.ticketgachaSpecialSingle,
                    1,
                  )
                }}
                {{ t('page.tools.gachaCalculator.pulls') }}
              </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <GachaCalculatorModuleTitle title="四号谷地地区" />
              <GachaCalculatorResourceSingleBtn
                v-bind="valleyIVRegionalStockBillStoreReward"
                @click="
                  valleyIVRegionalStockBillStoreReward.active =
                    !valleyIVRegionalStockBillStoreReward.active
                "
              />
              <v-divider style="margin: 1rem 0" />
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="valleyIVRegionalDevelopmentReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="valleyIVRegionalDevelopmentProgress"
                    class="v-range-slider"
                    hide-details="auto"
                    max="12"
                    min="1"
                    show-ticks="always"
                    step="1"
                    thumb-label="always"
                    tick-size="4"
                  />
                  通过滑块调节当前地区建设等级
                </v-card-text>
              </v-card>

              <v-divider style="margin: 1rem 0" />
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="valleyIVAuryleneCollectReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="valleyIVAuryleneCollectProgress"
                    class="v-range-slider"
                    hide-details="auto"
                    max="18"
                    show-ticks="always"
                    step="1"
                    thumb-label="always"
                    tick-size="4"
                  />
                  通过滑块调节当前醚质收集阶段
                </v-card-text>
              </v-card>

              <v-divider style="margin: 1rem 0" />
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="valleyIVCrateReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="valleyIVCrateRewardProgress"
                    class="v-range-slider"
                    hide-details="auto"
                    :max="valleyIVCrateRewardMax"
                    step="5"
                    thumb-label="always"
                    tick-size="4"
                  />
                  储藏箱因数量和种类较多，不提供具体选项，滑块拖动每格为5合成玉
                </v-card-text>
              </v-card>

              <v-divider style="margin: 1rem 0" />

              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="valleyIVBattleCrateReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="valleyIVBattleCrateRewardProgress"
                    class="v-range-slider"
                    hide-details="auto"
                    :max="valleyIVBattleCrateRewardMax"
                    step="1"
                    thumb-label="always"
                    tick-size="4"
                  />
                  在地图上的处理险情点位可获得1源石的宝箱
                </v-card-text>
              </v-card>

              <v-divider style="margin: 1rem 0" />
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="valleyIVDeltaBotReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="valleyIVDeltaBotProgress"
                    class="v-range-slider"
                    hide-details="auto"
                    :max="valleyIVDeltaBotRewardMax"
                    step="5"
                    thumb-label="always"
                    tick-size="4"
                  />
                  滑块拖动每格为5合成玉
                </v-card-text>
              </v-card>

              <v-divider style="margin: 1rem 0" />
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="valleyIVSimulationReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="valleyIVSimulationProgress"
                    class="v-range-slider"
                    hide-details="auto"
                    max="26"
                    show-ticks="always"
                    step="1"
                    thumb-label="always"
                    tick-size="4"
                  />
                </v-card-text>
              </v-card>

              <v-divider style="margin: 1rem 0" />

              <GachaCalculatorResourceSingleBtn
                v-for="item in valleyIVDefenseConstructionReward"
                :key="item.id"
                v-bind="item"
                @click="item.active = !item.active"
              />

              <GachaCalculatorModuleTitle title="武陵地区" />
              <GachaCalculatorResourceSingleBtn
                v-bind="wulingRegionalStockBillStoreReward"
                @click="
                  wulingRegionalStockBillStoreReward.active =
                    !wulingRegionalStockBillStoreReward.active
                "
              />
              <v-divider style="margin: 1rem 0" />
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="wulingRegionalDevelopmentReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="wulingRegionalDevelopmentProgress"
                    class="v-range-slider"
                    hide-details="auto"
                    max="6"
                    min="1"
                    show-ticks="always"
                    step="1"
                    thumb-label="always"
                    tick-size="4"
                  />
                  通过滑块调节当前地区建设等级
                </v-card-text>
              </v-card>

              <v-divider style="margin: 1rem 0" />
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="wulingAuryleneCollectReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="wulingAuryleneCollectProgress"
                    class="v-range-slider"
                    hide-details="auto"
                    max="10"
                    show-ticks="always"
                    step="1"
                    thumb-label="always"
                    tick-size="4"
                  />
                  通过滑块调节当前醚质收集阶段
                </v-card-text>
              </v-card>

              <v-divider style="margin: 1rem 0" />
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="wulingCrateReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="wulingCrateRewardProgress"
                    class="v-range-slider"
                    hide-details="auto"
                    :max="wulingCrateRewardMax"
                    step="5"
                    thumb-label="always"
                    tick-size="4"
                  />
                  储藏箱因数量和种类较多，不提供具体选项，滑块拖动每格为5合成玉
                </v-card-text>
              </v-card>

              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="wulingBattleCrateReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="wulingBattleCrateRewardProgress"
                    class="v-range-slider"
                    hide-details="auto"
                    :max="wulingBattleCrateRewardMax"
                    step="1"
                    thumb-label="always"
                    tick-size="4"
                  />
                  在地图上的处理险情点位可获得1源石的宝箱
                </v-card-text>
              </v-card>

              <v-divider style="margin: 1rem 0" />
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="wulingDeltaBotReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="wulingDeltaBotProgress"
                    class="v-range-slider"
                    hide-details="auto"
                    :max="wulingDeltaBotRewardMax"
                    step="5"
                    thumb-label="always"
                    tick-size="4"
                  />
                  滑块拖动每格为5合成玉
                </v-card-text>
              </v-card>

              <v-divider style="margin: 1rem 0" />
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="wulingSimulationReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="wulingSimulationProgress"
                    class="v-range-slider"
                    hide-details="auto"
                    max="9"
                    show-ticks="always"
                    step="1"
                    thumb-label="always"
                    tick-size="4"
                  />
                </v-card-text>
              </v-card>

              <GachaCalculatorResourceSingleBtn
                v-for="item in wulingDefenseConstructionReward"
                :key="item.id"
                v-bind="item"
                @click="item.active = !item.active"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!--等级奖励-->
          <v-expansion-panel value="level">
            <v-expansion-panel-title class="gacha-calculator-card-title">
              <div>
                等级奖励
                {{
                  numberFloor(
                    gachaResourceStatisticsResult.totalPulls.level?.ticketgachaSpecialSingle,
                    1,
                  )
                }}
                {{ t('page.tools.gachaCalculator.pulls') }}
              </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="authorityLevelUpReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="authorityLevelProgress"
                    class="v-range-slider"
                    hide-details="auto"
                    max="60"
                    min="1"
                    show-ticks="always"
                    step="1"
                    thumb-label="always"
                    tick-size="4"
                  />
                </v-card-text>
              </v-card>
              <v-divider style="margin: 1rem 0" />

              <GachaCalculatorModuleTitle title="权限等阶提升任务" />
              <GachaCalculatorResourceSingleBtn
                v-for="item in authorityLevelTaskRewards"
                :key="item.id"
                v-bind="item"
                @click="item.active = !item.active"
              />
              <v-divider style="margin: 1rem 0" />

              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="worldLevelReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="worldLevelProgress"
                    class="v-range-slider"
                    hide-details="auto"
                    max="7"
                    min="3"
                    show-ticks="always"
                    step="1"
                    thumb-label="always"
                    tick-size="4"
                  />
                </v-card-text>
              </v-card>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!--常驻奖励总计-->
          <v-expansion-panel value="permanent">
            <v-expansion-panel-title class="gacha-calculator-card-title">
              <div>
                常驻奖励-其他，以下常驻总计
                {{
                  numberFloor(
                    gachaResourceStatisticsResult.totalPulls.permanent?.ticketgachaSpecialSingle,
                    1,
                  )
                }}
                {{ t('page.tools.gachaCalculator.pulls') }}
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <!--新人签到-->
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle
                    v-bind="beginnerSignInTaskReward"
                    @click="beginnerSignInTaskReward.active = !beginnerSignInTaskReward.active"
                  />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="beginnerCheckInTaskProgress"
                    class="v-range-slider"
                    hide-details="auto"
                    max="14"
                    show-ticks="always"
                    step="1"
                    strict
                    thumb-label="always"
                    tick-size="4"
                  />
                  刻度在1表示第一日签到已完成，不再加入第一日
                </v-card-text>
              </v-card>
              <v-divider style="margin: 1rem 0" />

              <!--启程任务-->
              <GachaCalculatorResourceSingleBtn
                v-for="item in newHorizonsTaskReward"
                :key="item.id"
                v-bind="item"
                @click="item.active = !item.active"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel value="permanent-valleyIVTask">
            <v-expansion-panel-title class="gacha-calculator-card-title">
              <div>常驻奖励-四号谷地任务</div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <!--任务列表-->
              <GachaCalculatorResourceSingleBtn
                v-for="item in valleyIVTaskRewardTable"
                :key="item.id"
                v-bind="item"
                @click="item.active = !item.active"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel value="permanent-wulingTask">
            <v-expansion-panel-title class="gacha-calculator-card-title">
              <div>常驻奖励-武陵任务</div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <!--任务列表-->
              <GachaCalculatorResourceSingleBtn
                v-for="item in wulingTaskRewardTable"
                :key="item.id"
                v-bind="item"
                @click="item.active = !item.active"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel value="permanent-etchSpaceSalvage">
            <v-expansion-panel-title class="gacha-calculator-card-title">
              <div>常驻奖励-蚀像寻遗</div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <!--搜打撤-->
              <GachaCalculatorResourceSingleBtn
                v-for="item in etchSpaceSalvageReward"
                :key="item.id"
                v-bind="item"
                @click="item.active = !item.active"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!--行动手册-->
          <v-expansion-panel value="operationalManual">
            <v-expansion-panel-title class="gacha-calculator-card-title">
              <div>
                行动手册
                {{
                  numberFloor(
                    gachaResourceStatisticsResult.totalPulls.operationalManual
                      ?.ticketgachaSpecialSingle,
                    1,
                  )
                }}
                {{ t('page.tools.gachaCalculator.pulls') }}
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <GachaCalculatorResourceSingleBtn
                v-for="item in operationalManualReward"
                :key="item.id"
                v-bind="item"
                @click="item.active = !item.active"
              />
              <v-divider style="margin: 1rem 0" />
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="operationalManualNodeReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="operationalManualNodeProgress"
                    class="v-range-slider"
                    hide-details="auto"
                    max="12"
                    show-ticks="always"
                    step="1"
                    thumb-label="always"
                    tick-size="4"
                  />
                  共计12节点，每节点750嵌晶玉
                </v-card-text>
              </v-card>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!--氪金资源-->
          <v-expansion-panel value="recharge">
            <v-expansion-panel-title class="gacha-calculator-card-title">
              <div>
                氪金资源
                {{
                  numberFloor(
                    gachaResourceStatisticsResult.totalPulls.recharge?.ticketgachaSpecialSingle,
                    1,
                  )
                }}
                {{ t('page.tools.gachaCalculator.pulls') }}
              </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <GachaCalculatorPaidResources
                v-model="rechargeResources"
                :current-pool="currentPool"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel value="debug">
            <v-expansion-panel-title class="gacha-calculator-card-title">
              <div>debug</div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              {{ gachaCalculatorUserConfig }}
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </section>

</template>

<style scoped>
.gacha-calculator-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 1280px;
}

.gacha-calculator-container-left {
  min-width: 600px;
  max-width: 620px;
  padding: 4px;
  position: sticky;
  top: 72px;
  max-height: calc(100vh - 140px);
  z-index: 1003;
  overflow-y: auto;
  flex: 3;
}

.gacha-calculator-container-right {
  min-width: 600px;
  max-width: 620px;
}

.gacha-calculator-card-title {
  font-size: 1.2rem;
  font-weight: bolder;
}

.gacha-calculator-warning {
  background-color: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 12px 0;
  color: #856404;
  font-weight: 600;
  text-align: center;
}

.gacha-calculator-card-title[aria-expanded='true'] {
  border-bottom: 3px solid #ffd700;
}

.gacha-calculator-pool-btn-group-pc {
  display: flex;
  margin: 8px auto;
  width: 100%;
}

.gacha-calculator-pool-btn-pc {
  width: 33%;
}

.gacha-calculator-pool-btn-phone {
  display: none;
}

.gacha-calculator-chart-and-table {
  display: flex;
  justify-content: space-between;
}

.gacha-calculator-pie-chart {
  width: 300px;
  height: 240px;
}

.gacha-calculator-statistics-result {
  width: 230px;
}

.gacha-calculator-statistics-result-item {
  display: flex;
  align-items: center;
  min-width: 80px;
  margin: 20px 0;
}

.gacha-calculator-statistics-result-item-text {
  padding: 0 0 4px 12px;
}

.gacha-calculator-shortcut-btn-table {
  text-align: center;
}

.gacha-calculator-shortcut-btn {
  margin: 4px;
}

.gacha-calculator-result-detail-table-icon {
  width: 36px;
  height: 36px;
}

.gacha-calculator-existing-resource-input {
  display: flex;
  align-items: center;
  margin: 1rem 0;
}

.gacha-calculator-gacha-item-icon {
  width: 36px;
  height: 36px;
  margin: 0 12px 0 0;
}

.placeholder-block {
  width: 100%;
  height: 80px;
  display: block;
}

@media screen and (max-width: 1400px) {
  .gacha-calculator-container {
    width: 800px;
  }
}


@media screen and (max-width: 600px) {
  .gacha-calculator-container {
    width:100%;

  }

  .gacha-calculator-container-left {
    max-width: 350px;
    min-width: 320px;
    position: static;
    max-height: max-content;
    z-index: auto;
  }

  .gacha-calculator-container-right {
    max-width: 350px;
    min-width: 320px;
  }

  .gacha-calculator-card-title {
    font-size: 1rem;
    font-weight: bolder;
  }

  .gacha-calculator-warning {
    border: 1px solid #ffc107;
    border-radius: 8px;
    padding: 4px 9px;
    font-size: 0.8rem;
  }

  .gacha-calculator-pool-btn-group-pc {
    display: none;
  }

  .gacha-calculator-pool-btn-phone {
    margin: 1%;
    display: inline-grid;
    width: 47%;
  }

  .gacha-calculator-chart-and-table {
    display: block;
  }

  .gacha-calculator-pie-chart {
    width: 300px;
    height: 240px;
  }

  .gacha-calculator-statistics-result {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .gacha-calculator-statistics-result-item {
    display: flex;
    align-items: center;
    width: 140px;
    margin: 0;
  }

  .gacha-calculator-statistics-result-item-text {
    padding: 0;
  }

  .gacha-calculator-shortcut-btn-table {
    font-size: 0.8rem;
  }

  .gacha-calculator-shortcut-btn {
    margin: 4px 0;
    width: 150px;
    font-size: 0.8rem;
  }

  .gacha-calculator-result-detail-table {
    font-size: 0.6rem;
  }

  .gacha-calculator-result-detail-table-icon {
    width: 24px;
    height: 24px;
  }

  .content-container {
    padding: 0.5rem;
  }

  .placeholder-block {
    display: none;
  }
}

.v-range-slider {
  .v-slider-thumb__label {
    width: 100px;
  }
}
</style>
