<script setup lang="ts">
import type {
  GachaCalculatorUserConfig,
  PieChartData,
  PoolOption,
  ResourceStatisticsResultDetail,
  TotalPullsSingle
} from '@/shared/types/gacha-calculator';
import { packs } from '@/custom/core/packs';
import { gachaResourceStatisticsResult } from '@/custom/core/gacha/resource-statistics-result';
import { numberFloor, numberRound } from '#shared/utils/numberUtil';
import { nextTick, onMounted, ref, watch } from 'vue';

import { calculateDaysDifference, countTuesdaysBetweenV2 } from '#shared/utils/gacha-calculator';
//奖励引入
import {
  authorityLevelTaskRewards,
  authorityLevelUpReward,
  operationalManualNodeReward,
  worldLevelReward
} from '@/custom/core/gacha/level-reward';

import {
  activityReward,
  beginnerSignInTaskReward,

} from '@/custom/core/gacha/activity-reward';

import { otherRewardTable } from '@/custom/core/gacha/other-reward';

import { AICQuotaReward } from '@/custom/core/gacha/daily-reward';

import {
  valleyIVAuryleneCollectReward,
  valleyIVAuryleneCollectStageTable,
  valleyIVCrateRewardMax,
  valleyIVCrateReward,
  valleyIVBattleCrateRewardMax,
  valleyIVBattleCrateReward,
  valleyIVDeltaBotReward,
  valleyIVDeltaBotRewardMax,
  valleyIVRegionalDevelopmentReward,
  valleyIVRegionalStockBillStoreReward,
  valleyIVSimulationReward
} from '@/custom/core/gacha/valley_IV_regional-reward';

import {
  wulingAuryleneCollectReward,
  wulingAuryleneCollectStageTable,
  wulingCrateReward,
  wulingCrateRewardMax,
  wulingDeltaBotReward,
  wulingDeltaBotRewardMax,
  wulingRegionalDevelopmentReward,
  wulingRegionalStockBillStoreReward,
  wulingSimulationReward
} from '@/custom/core/gacha/wuling-regional-reward';

import {
  newHorizonsTaskReward,
  trainingReward,
  defenseConstructionReward,
  etchSpaceSalvageReward,
  factoryManualReward,
  factoryManualRewardMax,
  intelArchiveReward,
  taskRewardTable
} from '@/custom/core/gacha/permanent-reward';

const { t } = useI18n();

const leftPartPanel = ref<string[]>(['statisticalResult']);
const rightPartPanel = ref<string[]>(['existing', 'daily', 'level', 'activity']);

const poolOptions = ref<PoolOption[]>([
  {
    name: '熔火灼痕',
    color: '#B60129',
    start: new Date('2026/01/22 10:00:00'),
    end: new Date('2026/02/07 12:00:00'),
    dateText: '01.22——02.07',
    type: '熔火灼痕',
    disabled: false,
  },
  {
    name: '轻飘飘的信使',
    color: '#BE2F00',
    start: new Date('2026/02/07 10:00:00'),
    end: new Date('2026/02/24 12:00:00'),
    dateText: '02.07——02.24',
    type: '轻飘飘的信使',
    disabled: true,
  },
  {
    name: '热烈色彩',
    color: '#FA5B81',
    start: new Date('2026/02/24 10:00:00'),
    end: new Date('2026/03/12 12:00:00'),
    dateText: '02.24——未知',
    type: '热烈色彩',
    disabled: true,
  },
]);

const currentPool = ref<PoolOption>({
  name: '熔火灼痕',
  color: '#B60129',
  start: new Date('2026/01/22 10:00:00'),
  end: new Date('2026/02/07 12:00:00'),
  dateText: '01.22——02.07',
  type: '熔火灼痕',
  disabled: false,
});

const startDate: Date = new Date();

function selectedPool(option: PoolOption): void {
  currentPool.value = option;
  createDailyReward();
  gachaResourceStatistics();
}

//饼图的数据
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

const existingResource = ref<ResourceStatisticsResultDetail>({
  name: '库存',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
});

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

// 氪金资源状态
const paidResources = ref<{
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

const dailyReward = ref<Reward>({
  id: 'day_reward',
  name: {
    zh: `日常奖励X0天`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '日常奖励',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

const weekTaskReward = ref<Reward>({
  id: 'week_task_reward',
  name: {
    zh: `周常奖励X0周`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '日常奖励',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

function createDailyReward(): void {
  const remainingDays: number = calculateDaysDifference(startDate, currentPool.value.end);
  dailyReward.value.name = {
    zh: `日常奖励X${numberRound(remainingDays, 0)}天`,
    en: '',
  };
  dailyReward.value.content.diamond = numberRound(remainingDays, 0) * 200;

  const remainingWeek: number = countTuesdaysBetweenV2(startDate, currentPool.value.end);
  weekTaskReward.value.name = {
    zh: `周常奖励X${numberRound(remainingWeek, 0)}周`,
    en: '',
  };
  weekTaskReward.value.content.diamond = numberRound(remainingWeek, 0) * 500;
}

watch(
  AICQuotaReward,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }
    gachaResourceStatistics();
  },
  { deep: true },
);

watch(
  valleyIVRegionalStockBillStoreReward,
  (newValue) => {
    saveUserConfig(newValue.id, newValue.active, 'buttonActive');
    gachaResourceStatistics();
  },
  { deep: true },
);

watch(
  wulingRegionalStockBillStoreReward,
  (newValue) => {
    saveUserConfig(newValue.id, newValue.active, 'buttonActive');
    gachaResourceStatistics();
  },
  { deep: true },
);

watch(
  newHorizonsTaskReward,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }
    gachaResourceStatistics();
  },
  { deep: true },
);

watch(
  authorityLevelTaskRewards,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }
    gachaResourceStatistics();
  },
  { deep: true },
);

watch(
  taskRewardTable,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }
    gachaResourceStatistics();
  },
  { deep: true },
);

watch(
  etchSpaceSalvageReward,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }
    gachaResourceStatistics();
  },
  { deep: true },
);

watch(
  intelArchiveReward,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }
    gachaResourceStatistics();
  },
  { deep: true },
);

watch(
  trainingReward,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }
    gachaResourceStatistics();
  },
  { deep: true },
);

watch(
  existingResource,
  (newValue) => {
    gachaResourceStatistics();
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
  },
  { deep: true },
);

watch(
  activityReward,
  (newValue) => {
    gachaResourceStatistics();
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }
  },
  { deep: true },
);

watch(
  paidResources,
  () => {
    gachaResourceStatistics();
  },
  { deep: true },
);

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
    gachaResourceStatistics();
  },
  { deep: true },
);

const operationalManualNodeProgress = ref<number[]>([0, 12]);

watch(
  operationalManualNodeProgress,
  (newVal) => {
    operationalManualNodeReward.value.content.diamond = (newVal[1]! - newVal[0]!) * 750;
    saveUserConfig(operationalManualNodeReward.value.id, newVal, 'rangeSlider');
    gachaResourceStatistics();
  },
  { deep: true },
);

const authorityLevelProgress = ref<number[]>([1, 60]);

watch(
  authorityLevelProgress,
  (newVal) => {
    let result: number = 0;
    for (let i = newVal[0]!; i < newVal[1]!; i++) {
      if (i === 44) {
        result += 200;
        continue;
      }
      if (i === 49) {
        result += 200;
        continue;
      }
      if (i === 54) {
        result += 200;
        continue;
      }
      if (i === 59) {
        result += 200;
        continue;
      }
      if (i > 45) {
        result += 100;
        continue;
      }
      if ((i + 1) % 5 === 0) {
        result += 100;
        continue;
      }
      result += 50;
    }
    authorityLevelUpReward.value.content.diamond = result;
    saveUserConfig(authorityLevelUpReward.value.id, newVal, 'rangeSlider');
    gachaResourceStatistics();
  },
  { deep: true },
);

//四号谷底地区建设等级进度
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
    gachaResourceStatistics();
  },
  { deep: true },
);

const valleyIVAuryleneCollectProgress = ref<number[]>([0, 18]);

watch(
  valleyIVAuryleneCollectProgress,
  (newVal) => {
    let originiumRecharge: number = 0;
    for (let i = newVal[0]! ; i < newVal[1]!; i++) {
      const stageReward = valleyIVAuryleneCollectStageTable[i];
      if (stageReward !== undefined) {
        originiumRecharge += stageReward.originiumRecharge || 0;
      }
    }

    valleyIVAuryleneCollectReward.value.content.originiumRecharge = originiumRecharge;
    saveUserConfig(valleyIVAuryleneCollectReward.value.id, newVal, 'rangeSlider');
    gachaResourceStatistics();
  },
  { deep: true },
);

const valleyIVCrateRewardProgress = ref<number[]>([0, valleyIVCrateRewardMax]);

watch(
  valleyIVCrateRewardProgress,
  (newVal) => {
    valleyIVCrateReward.value.content.diamond = newVal[1]! - newVal[0]!;
    saveUserConfig(valleyIVCrateReward.value.id, newVal, 'rangeSlider');
    gachaResourceStatistics();
  },
  { deep: true },
);


const valleyIVBattleCrateRewardProgress = ref<number[]>([0, valleyIVBattleCrateRewardMax]);

watch(
  valleyIVBattleCrateRewardProgress,
  (newVal) => {
    valleyIVBattleCrateReward.value.content.originiumRecharge = newVal[1]! - newVal[0]!;
    saveUserConfig(valleyIVBattleCrateReward.value.id, newVal, 'rangeSlider');
    gachaResourceStatistics();
  },
  { deep: true },
);


const valleyIVDeltaBotProgress = ref<number[]>([0, valleyIVDeltaBotRewardMax]);

watch(
  valleyIVDeltaBotProgress,
  (newVal) => {
    valleyIVDeltaBotReward.value.content.diamond = newVal[1]! - newVal[0]!;
    saveUserConfig(valleyIVDeltaBotReward.value.id, newVal, 'rangeSlider');
    gachaResourceStatistics();
  },
  { deep: true },
);

const valleyIVSimulationProgress = ref<number[]>([0, 26]);

watch(
  valleyIVSimulationProgress,
  (newVal) => {
    valleyIVSimulationReward.value.content.diamond = (newVal[1]! - newVal[0]!) * 25;
    saveUserConfig(valleyIVSimulationReward.value.id, newVal, 'rangeSlider');
    gachaResourceStatistics();
  },
  { deep: true },
);

//武陵地区建设奖励
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
    gachaResourceStatistics();
  },
  { deep: true },
);

//武陵醚质收集奖励
const wulingAuryleneCollectProgress = ref<number[]>([0, 11]);
//武陵醚质收集奖励进度
watch(
  wulingAuryleneCollectProgress,
  (newVal) => {
    let originiumRecharge: number = 0;
    for (let i = newVal[0]! ; i < newVal[1]!; i++) {
      const stageReward = wulingAuryleneCollectStageTable[i];
      if (stageReward !== undefined) {
        originiumRecharge += stageReward.originiumRecharge || 0;
      }
    }

    wulingAuryleneCollectReward.value.content.originiumRecharge = originiumRecharge;
    saveUserConfig(wulingAuryleneCollectReward.value.id, newVal, 'rangeSlider');
    gachaResourceStatistics();
  },
  { deep: true },
);

//武陵储藏箱奖励
const wulingCrateRewardProgress = ref<number[]>([0, wulingCrateRewardMax]);
//武陵储藏箱奖励进度
watch(
  wulingCrateRewardProgress,
  (newVal) => {
    wulingCrateReward.value.content.diamond = newVal[1]! - newVal[0]!;
    saveUserConfig(wulingCrateReward.value.id, newVal, 'rangeSlider');
    gachaResourceStatistics();
  },
  { deep: true },
);

//武陵储藏箱奖励
const wulingDeltaBotProgress = ref<number[]>([0, wulingDeltaBotRewardMax]);
//武陵储藏箱奖励进度
watch(
  wulingDeltaBotProgress,
  (newVal) => {
    wulingDeltaBotReward.value.content.diamond = newVal[1]! - newVal[0]!;
    saveUserConfig(wulingCrateReward.value.id, newVal, 'rangeSlider');
    gachaResourceStatistics();
  },
  { deep: true },
);

//武陵模拟空间奖励
const wulingSimulationProgress = ref<number[]>([0, 9]);
//武陵模拟空间奖励进度
watch(
  wulingSimulationProgress,
  (newVal) => {
    wulingSimulationReward.value.content.diamond = (newVal[1]! - newVal[0]!) * 25;
    saveUserConfig(wulingSimulationReward.value.id, newVal, 'rangeSlider');
    gachaResourceStatistics();
  },
  { deep: true },
);

//世界探索等级奖励进度
const worldLevelProgress = ref<number[]>([3, 7]);

//世界探索等级奖励进度
watch(
  worldLevelProgress,
  (newVal) => {
    worldLevelReward.value.content.ticketgachaStandardSingle = (newVal[1]! - newVal[0]!) * 3;
    saveUserConfig(worldLevelReward.value.id, newVal, 'rangeSlider');
    gachaResourceStatistics();
  },
  { deep: true },
);

const factoryManualProgress = ref<number[]>([0, factoryManualRewardMax]);

watch(
  factoryManualProgress,
  (newVal) => {
    factoryManualReward.value.content.diamond = newVal[1]! - newVal[0]!;
    saveUserConfig(factoryManualReward.value.id, newVal, 'rangeSlider');
    gachaResourceStatistics();
  },
  { deep: true },
);

//据点防御
const defenseConstructionProgress = ref<number[]>([0, 1280]);
//据点防御奖励进度
watch(
  defenseConstructionProgress,
  (newVal) => {
    defenseConstructionReward.value.content.diamond = newVal[1]! - newVal[0]!;
    saveUserConfig(defenseConstructionReward.value.id, newVal, 'rangeSlider');
    gachaResourceStatistics();
  },
  { deep: true },
);

const resourceStatisticsResultDetailList = ref<ResourceStatisticsResultDetail[]>([]);

const totalResourceStatisticsResultDetail = ref({
  name: '全部资源',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
});

// 计算氪金总金额
const paidResourcesTotalPrice = computed(() => {
  let total = 0;

  // 月卡金额
  if (paidResources.value.monthlyPass) {
    const monthlyPack = packs['月卡'];
    if (monthlyPack) {
      total += monthlyPack.price;
    }
  }

  // 协议定制金额（源石配给是免费的）
  if (paidResources.value.protocolCustomization) {
    total += 68;
  }

  // 礼包金额
  for (const [packId, quantity] of Object.entries(paidResources.value.selectedPacks)) {
    if (quantity > 0) {
      const pack = packs[packId as keyof typeof packs];
      if (pack) {
        total += pack.price * quantity;
      }
    }
  }

  // 普通源石金额
  for (const [stoneId, quantity] of Object.entries(paidResources.value.originiumStones)) {
    if (quantity > 0) {
      const stone = packs[stoneId as keyof typeof packs];
      if (stone) {
        total += stone.price * quantity;
      }
    }
  }

  return total;
});

const gachaResourceStatistics = (): void => {
  const list: ResourceStatisticsResultDetail[] = [];

  function _existingRewardStatistics(): void {
    const result: ResourceStatisticsResultDetail = {
      name: '库存',
      originiumRecharge: existingResource.value.originiumRecharge / 1,
      diamond: existingResource.value.diamond / 1,
      ticketgachaStandardSingle: existingResource.value.ticketgachaStandardSingle / 1,
      ticketgachaSpecialSingle: existingResource.value.ticketgachaSpecialSingle / 1,
    };

    list.push(result);
    gachaResourceStatisticsResult.value.totalPulls.existing = _getPull(result);
  }

  function _dailyRewardStatistics(): void {
    const result: ResourceStatisticsResultDetail = {
      name: '日常奖励',
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
    };

    _addReward(result, dailyReward.value);
    _addReward(result, weekTaskReward.value);
    _addReward(result, AICQuotaReward.value);

    list.push(result);
    gachaResourceStatisticsResult.value.totalPulls.daily = _getPull(result);
  }

  function _activityRewardStatistics(): void {
    const result: ResourceStatisticsResultDetail = {
      name: '活动奖励',
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
    };

    _addReward(result, beginnerSignInTaskReward.value);

    for (const reward of activityReward.value) {
      if (checkRewardIsValid(reward)) {
        _addReward(result, reward);
      }
    }

    list.push(result);
    gachaResourceStatisticsResult.value.totalPulls.activity = _getPull(result);
  }

  function _otherRewardStatistics(): void {
    const result: ResourceStatisticsResultDetail = {
      name: '其他奖励',
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
    };

    for (const reward of otherRewardTable.value) {
      if (checkRewardIsValid(reward)) {
        _addReward(result, reward);
      }
    }

    list.push(result);
    gachaResourceStatisticsResult.value.totalPulls.other = _getPull(result);
  }

  function _regionalRewardStatistics(): void {
    const result: ResourceStatisticsResultDetail = {
      name: '地区奖励',
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
    };

    _addReward(result, valleyIVRegionalStockBillStoreReward.value);
    _addReward(result, valleyIVRegionalDevelopmentReward.value);
    _addReward(result, valleyIVAuryleneCollectReward.value);
    _addReward(result, valleyIVCrateReward.value);
    _addReward(result, valleyIVBattleCrateReward.value);
    _addReward(result, valleyIVDeltaBotReward.value);
    _addReward(result, valleyIVSimulationReward.value);
    _addReward(result, wulingRegionalStockBillStoreReward.value);
    _addReward(result, wulingRegionalDevelopmentReward.value);
    _addReward(result, wulingAuryleneCollectReward.value);
    _addReward(result, wulingCrateReward.value);
    _addReward(result, wulingDeltaBotReward.value);
    _addReward(result, wulingSimulationReward.value);

    list.push(result);
    gachaResourceStatisticsResult.value.totalPulls.regional = _getPull(result);
  }

  function _levelRewardStatistics(): void {
    const result: ResourceStatisticsResultDetail = {
      name: '等级奖励',
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
    };

    _addReward(result, authorityLevelTaskRewards.value);
    _addReward(result, authorityLevelUpReward.value);
    _addReward(result, operationalManualNodeReward.value);
    _addReward(result, worldLevelReward.value);

    _addReward(result, trainingReward.value);
    list.push(result);
    gachaResourceStatisticsResult.value.totalPulls.level = _getPull(result);
  }

  function _permanentRewardStatistics(): void {
    const result: ResourceStatisticsResultDetail = {
      name: '常驻奖励',
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
    };
    _addReward(result, newHorizonsTaskReward.value);
    _addReward(result, taskRewardTable.value);
    _addReward(result, factoryManualReward.value);
    _addReward(result, defenseConstructionReward.value);
    _addReward(result, etchSpaceSalvageReward.value);
    _addReward(result, intelArchiveReward.value);

    list.push(result);
    gachaResourceStatisticsResult.value.totalPulls.permanent = _getPull(result);
  }

  function _paidResourcesStatistics(): void {
    const result: ResourceStatisticsResultDetail = {
      name: '氪金资源',
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
    };

    // 计算月卡
    if (paidResources.value.monthlyPass) {
      const monthlyPack = packs['月卡'];
      if (monthlyPack) {
        result.originiumRecharge += 12; // 一次性12源石
        result.diamond += paidResources.value.monthlyPassDays * 200; // 每天200嵌晶玉
      }
    }

    // 计算源石配给（3源石，免费）
    if (paidResources.value.battlePass) {
      result.originiumRecharge += 3;
    }

    // 计算协议定制（36源石，68元）
    if (paidResources.value.protocolCustomization) {
      result.originiumRecharge += 36;
    }

    // 计算选中的礼包
    for (const [packId, quantity] of Object.entries(paidResources.value.selectedPacks)) {
      if (quantity > 0 && packs[packId as keyof typeof packs]) {
        const pack = packs[packId as keyof typeof packs];
        if (pack && pack.contents) {
          for (const item of pack.contents) {
            if (item.itemId === 'item_originium_recharge') {
              result.originiumRecharge += item.quantity * quantity;
            } else if (item.itemId === 'item_diamond') {
              result.diamond += item.quantity * quantity;
            } else if (item.itemId === 'item_ticketgacha_special_single') {
              result.ticketgachaSpecialSingle += item.quantity * quantity;
            } else if (item.itemId === 'item_ticketgacha_standard_single') {
              result.ticketgachaStandardSingle += item.quantity * quantity;
            } else if (item.itemId.includes('ticketgacha_special_ten')) {
              result.ticketgachaSpecialSingle += item.quantity * 10 * quantity;
            }
          }
        }
      }
    }

    // 计算源石
    for (const [stoneId, quantity] of Object.entries(paidResources.value.originiumStones)) {
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

    list.push(result);
    gachaResourceStatisticsResult.value.totalPulls.recharge = _getPull(result);
  }

  function _totalRewardStatistics(): void {
    const result: ResourceStatisticsResultDetail = {
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

    list.push(result);
    gachaResourceStatisticsResult.value.totalPulls.total = _getPull(result);
  }

  function _addReward(result: ResourceStatisticsResultDetail, reward: Reward | Reward[]): void {
    if (Array.isArray(reward)) {
      for (const item of reward) {
        if (item.active) {
          result.originiumRecharge += item.content.originiumRecharge;
          result.diamond += item.content.diamond;
          result.ticketgachaStandardSingle += item.content.ticketgachaStandardSingle;
          result.ticketgachaSpecialSingle += item.content.ticketgachaSpecialSingle;
        }
      }
    } else {
      if (reward.active) {
        result.originiumRecharge += reward.content.originiumRecharge;
        result.diamond += reward.content.diamond;
        result.ticketgachaStandardSingle += reward.content.ticketgachaStandardSingle;
        result.ticketgachaSpecialSingle += reward.content.ticketgachaSpecialSingle;
      }
    }
  }

  _existingRewardStatistics();
  _activityRewardStatistics();
  _otherRewardStatistics();
  _dailyRewardStatistics();
  _regionalRewardStatistics();
  _levelRewardStatistics();
  _permanentRewardStatistics();
  _paidResourcesStatistics();
  _totalRewardStatistics();

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
      name: t(`page.tools.gachaCalculator.${key}`) + t(`page.tools.gachaCalculator.reward`),
    });
  }

  setPieChart(pieChartData);

  resourceStatisticsResultDetailList.value = list;

  function _getPull(result: ResourceStatisticsResultDetail): TotalPullsSingle {
    return {
      ticketgachaStandardSingle: result.ticketgachaStandardSingle,
      ticketgachaSpecialSingle:
        result.diamond / 500 +
        (result.originiumRecharge * 75) / 500 +
        result.ticketgachaSpecialSingle,
    };
  }
};
// pieChartData.value[0].value = 1;

let myChart: any;

function setPieChart(data: PieChartData[]) {
  const option = {
    tooltip: {
      formatter: (params: any) => {
        // ECharts 饼图的 params 可能是单个对象或数组
        const param = Array.isArray(params) ? params[0] : params;
        return t('page.tools.gachaCalculator.pieChartTooltip', {
          seriesName: param.seriesName || '',
          name: param.name || '',
          value: param.value || 0,
          percent: param.percent || 0,
        });
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
        const pieElement: HTMLElement | null = document.getElementById(
          'gacha-calculator-pie-chart',
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
  valley_IV_battle_crate_reward:valleyIVBattleCrateRewardProgress,
  valley_IV_delta_bot_reward: valleyIVDeltaBotProgress,
  valley_IV_simulation_reward: valleyIVSimulationProgress,
  wuling_regional_development_reward: wulingRegionalDevelopmentProgress,
  wuling_aurylene_collect_reward: wulingAuryleneCollectProgress,
  wuling_crate_reward: wulingCrateRewardProgress,
  wuling_delta_bot_reward: wulingDeltaBotProgress,
  wuling_simulation_reward: wulingSimulationProgress,
  defense_construction_reward: defenseConstructionProgress,
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
          const range = localConfig.rangeSlider[key]
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
        gachaCalculatorUserConfig.value.buttonActive = localConfig.buttonActive
      }

      if (localConfig.buttonGroupActive) {
        _setButtonGroupActive(localConfig.buttonGroupActive, AICQuotaReward);
        _setButtonGroupActive(localConfig.buttonGroupActive, authorityLevelTaskRewards);
        _setButtonGroupActive(localConfig.buttonGroupActive, taskRewardTable);
        _setButtonGroupActive(localConfig.buttonGroupActive, etchSpaceSalvageReward);
        _setButtonGroupActive(localConfig.buttonGroupActive, trainingReward);
        _setButtonGroupActive(localConfig.buttonGroupActive, activityReward);
        _setButtonGroupActive(localConfig.buttonGroupActive, intelArchiveReward);
        _setButtonGroupActive(localConfig.buttonGroupActive, newHorizonsTaskReward);
        gachaCalculatorUserConfig.value.buttonGroupActive = localConfig.buttonGroupActive
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
  myChart = echarts.init(document.getElementById('gacha-calculator-pie-chart'));
  setPieChart(pieChartData);
  if (poolOptions.value[0] !== undefined) {
    selectedPool(poolOptions.value[0]);
  }
});

function clearOrSelectedRewards(action: boolean) {
  _clearOrSelect('button', valleyIVRegionalStockBillStoreReward);
  _clearOrSelect('rangeSlider', valleyIVRegionalDevelopmentProgress, [0, 12]);
  _clearOrSelect('rangeSlider', valleyIVAuryleneCollectProgress, [0, 18]);
  _clearOrSelect('rangeSlider', valleyIVCrateRewardProgress, [0, valleyIVCrateRewardMax]);
  _clearOrSelect('rangeSlider', valleyIVBattleCrateRewardProgress, [0, valleyIVBattleCrateRewardMax]);
  _clearOrSelect('rangeSlider', valleyIVDeltaBotProgress, [0, valleyIVDeltaBotRewardMax]);
  _clearOrSelect('rangeSlider', valleyIVSimulationProgress, [0, 26]);

  _clearOrSelect('button', wulingRegionalStockBillStoreReward);
  _clearOrSelect('rangeSlider', wulingRegionalDevelopmentProgress, [0, 12]);
  _clearOrSelect('rangeSlider', wulingAuryleneCollectProgress, [0, 18]);
  _clearOrSelect('rangeSlider', wulingCrateRewardProgress, [0, wulingCrateRewardMax]);
  _clearOrSelect('rangeSlider', wulingDeltaBotProgress, [0, wulingDeltaBotRewardMax]);
  _clearOrSelect('rangeSlider', wulingSimulationProgress, [0, 9]);

  _clearOrSelect('rangeSlider', authorityLevelProgress, [0, 60]);
  _clearOrSelect('button', authorityLevelTaskRewards);
  _clearOrSelect('rangeSlider', worldLevelProgress, [3, 7]);
  _clearOrSelect('rangeSlider', operationalManualNodeProgress, [0, 12]);

  _clearOrSelect('button', taskRewardTable);
  _clearOrSelect('rangeSlider', factoryManualProgress, [0, factoryManualRewardMax]);
  _clearOrSelect('rangeSlider', defenseConstructionProgress, [0, 1280]);
  _clearOrSelect('button', etchSpaceSalvageReward);
  _clearOrSelect('button', trainingReward);
  _clearOrSelect('button',newHorizonsTaskReward)

  function _clearOrSelect(
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
}

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
 * @param type {string} 奖励UI类型，下面是奖励类型：<br>
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
    // console.log(reward.name.zh,"过期")
    display = false;
  }

  // 活动开始时间在当前池子结束时间之后，活动未开始
  if (reward.start > currentPoolValue.end) {
    // console.log(reward.name.zh,"过期")
    display = false;
  }

  // console.log(currentPool.value.start, currentPoolValue.end);
  // console.log(reward.name.zh,reward.start,reward.end);
  // 判断奖励类型是否可以被计入
  // 通用类型都可以计入，特殊类型需要与当前池子类型匹配

  return display;
}

function exportReward() {
  const list: any = [];

  _addReward('集成配额商店兑换', AICQuotaReward.value);
  _addReward('活动奖励', activityReward.value);
  _addReward('四号谷地·调度券商店', valleyIVRegionalStockBillStoreReward.value);
  _addReward('四号谷地·地区建设等级奖励', valleyIVRegionalDevelopmentReward.value);
  _addReward('四号谷地·醚质收集', valleyIVAuryleneCollectReward.value);
  _addReward('四号谷地·储藏箱', valleyIVCrateReward.value);
  _addReward('四号谷地·模拟空间', valleyIVSimulationReward.value);
  _addReward('武陵·调度券商店', wulingRegionalStockBillStoreReward.value);
  _addReward('武陵·地区建设等级奖励', wulingRegionalDevelopmentReward.value);
  _addReward('武陵·醚质收集', wulingAuryleneCollectReward.value);
  _addReward('武陵·储藏箱', wulingCrateReward.value);
  _addReward('武陵·模拟空间', wulingSimulationReward.value);
  _addReward('权限等级提升', authorityLevelUpReward.value);
  _addReward('权限等级提升任务', authorityLevelTaskRewards.value);
  _addReward('世界探索等级奖励', worldLevelReward.value);
  _addReward('节点手册奖励', operationalManualNodeReward.value);
  _addReward('新手签到奖励', beginnerSignInTaskReward.value);
  _addReward('任务奖励', taskRewardTable.value);
  _addReward('简制手册', factoryManualReward.value);
  _addReward('据点防御任务', defenseConstructionReward.value);
  _addReward('蚀像寻遗', etchSpaceSalvageReward.value);
  _addReward('教学奖励', trainingReward.value);

  console.log(JSON.stringify(list, null, 2));

  function _addReward(type: string, reward: Reward | Reward[]): void {
    if (Array.isArray(reward)) {
      for (const item of reward) {
        list.push({
          type: type,
          name: item.name.zh,
          originiumRecharge: item.content.originiumRecharge,
          diamond: item.content.diamond,
          ticketgachaStandardSingle: item.content.ticketgachaStandardSingle,
          ticketgachaSpecialSingle: item.content.ticketgachaSpecialSingle,
        });
      }
    } else {
      list.push({
        type: type,
        name: reward.name.zh,
        originiumRecharge: reward.content.originiumRecharge,
        diamond: reward.content.diamond,
        ticketgachaStandardSingle: reward.content.ticketgachaStandardSingle,
        ticketgachaSpecialSingle: reward.content.ticketgachaSpecialSingle,
      });
    }
  }
}
</script>

<template>
  <div>
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
                {{ t('page.tools.gachaCalculator.rechargeAmount') }}$
                {{ paidResourcesTotalPrice.toFixed(2) }}
                {{ t('page.tools.gachaCalculator.yuan') }}
              </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-btn-group style="margin: 8px auto; width: 100%">
                <v-btn
                  v-for="option in poolOptions"
                  style="width: 33%"
                  :color="currentPool.name === option.name ? option.color : '#aaaaaa'"
                  @click="selectedPool(option)"
                  >{{ option.name }}<br >{{ option.dateText }}
                </v-btn>
              </v-btn-group>
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
                      class="gacha-calculator-gacha-item-icon"
                      src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp"
                      alt="existing"
                    >
                    <span class="gacha-calculator-statistics-result-item-text">
                      {{ totalResourceStatisticsResultDetail.originiumRecharge }}
                      ({{
                        numberFloor(totalResourceStatisticsResultDetail.originiumRecharge * 0.15)
                      }})
                    </span>
                  </div>

                  <div class="gacha-calculator-statistics-result-item">
                    <img
                      class="gacha-calculator-gacha-item-icon"
                      src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp"
                      alt="existing"
                    >
                    <span class="gacha-calculator-statistics-result-item-text">
                      {{ numberFloor(totalResourceStatisticsResultDetail.diamond, 0) }}({{
                        numberFloor(totalResourceStatisticsResultDetail.diamond / 500)
                      }})
                    </span>
                  </div>

                  <div class="gacha-calculator-statistics-result-item">
                    <img
                      class="gacha-calculator-gacha-item-icon"
                      src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp"
                      alt="existing"
                    >
                    <span class="gacha-calculator-statistics-result-item-text">
                      {{ totalResourceStatisticsResultDetail.ticketgachaStandardSingle }}
                    </span>
                  </div>

                  <div class="gacha-calculator-statistics-result-item">
                    <img
                      class="gacha-calculator-gacha-item-icon"
                      src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp"
                      alt="existing"
                    >
                    <span class="gacha-calculator-statistics-result-item-text">
                      {{ totalResourceStatisticsResultDetail.ticketgachaSpecialSingle }}
                    </span>
                  </div>
                </div>
              </div>

              <div style="display: flex; flex-wrap: wrap; justify-content: center">
                <v-btn
                  color="red"
                  text="清空除日常和活动外的奖励"
                  style="margin: 8px"
                  @click="clearOrSelectedRewards(false)"
                />
                <v-btn
                  color="blue"
                  text="选中所有奖励"
                  style="margin: 8px"
                  @click="clearOrSelectedRewards(true)"
                />
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel value="detail">
            <v-expansion-panel-title class="gacha-calculator-card-title">
              <div>计算详情</div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-table>
                <thead>
                <tr>
                  <th style="font-weight: bolder">奖励来源</th>
                  <th>
                    <img
                      class="gacha-calculator-gacha-item-icon"
                      src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp"
                      alt="existing"
                    >
                  </th>
                  <th>
                    <img
                      class="gacha-calculator-gacha-item-icon"
                      src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp"
                      alt="existing"
                    >
                  </th>
                  <th>
                    <img
                      class="gacha-calculator-gacha-item-icon"
                      src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp"
                      alt="existing"
                    >
                  </th>
                  <th>
                    <img
                      class="gacha-calculator-gacha-item-icon"
                      src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp"
                      alt="existing"
                    >
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in resourceStatisticsResultDetailList">
                  <td>{{ item.name }}</td>
                  <td>
                    {{ item.originiumRecharge }}（{{ numberFloor(item.originiumRecharge * 0.15)
                    }}{{ t('page.tools.gachaCalculator.pulls') }}）
                  </td>
                  <td>
                    {{ item.diamond }}（{{ numberFloor(item.diamond / 500)
                    }}{{ t('page.tools.gachaCalculator.pulls') }}）
                  </td>
                  <td>{{ item.ticketgachaStandardSingle }}</td>
                  <td>{{ item.ticketgachaSpecialSingle }}</td>
                </tr>
                </tbody>
              </v-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
                <div style="width: 100%; height: 80px" />
      </div>
      <!--      <div>-->
      <!--        {{ JSON.stringify(allGachaResource) }}-->
      <!--      </div>-->
      <div class="gacha-calculator-container-right">
        <v-alert type="info" style="margin-bottom: 8px">
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
                    class="gacha-calculator-gacha-item-icon"
                    src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp"
                    alt="existing"
                  >
                  <v-text-field
                    v-model="existingResource.originiumRecharge"
                    hide-details="auto"
                    variant="solo"
                    label="衍质源石"
                  />
                </div>
              </div>
              <div class="gacha-calculator-existing-resource">
                <div class="gacha-calculator-existing-resource-input">
                  <img
                    class="gacha-calculator-gacha-item-icon"
                    src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp"
                    alt="existing"
                  >
                  <v-text-field
                    v-model="existingResource.diamond"
                    hide-details="auto"
                    variant="solo"
                    label="嵌晶玉"
                  />
                </div>
              </div>
              <div class="gacha-calculator-existing-resource">
                <div class="gacha-calculator-existing-resource-input">
                  <img
                    class="gacha-calculator-gacha-item-icon"
                    src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp"
                    alt="existing"
                  >
                  <v-text-field
                    v-model="existingResource.ticketgachaStandardSingle"
                    hide-details="auto"
                    variant="solo"
                    label="基础寻访凭证"
                  />
                </div>
              </div>
              <div class="gacha-calculator-existing-resource">
                <div class="gacha-calculator-existing-resource-input">
                  <img
                    class="gacha-calculator-gacha-item-icon"
                    src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp"
                    alt="existing"
                  >
                  <v-text-field
                    v-model="existingResource.ticketgachaSpecialSingle"
                    hide-details="auto"
                    variant="solo"
                    label="特许寻访凭证"
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
              集成配额交易
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
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle
                    v-bind="beginnerSignInTaskReward"
                    @click="beginnerSignInTaskReward.active = !beginnerSignInTaskReward.active"
                  />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="beginnerCheckInTaskProgress"
                    show-ticks="always"
                    step="1"
                    max="14"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    strict
                    class="v-range-slider"
                  />
                  刻度在1表示第一日签到已完成，不再加入第一日
                </v-card-text>
              </v-card>
              <v-divider style="margin: 1rem 0" />

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
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!--          地区奖励-->
          <v-expansion-panel value="regionalDevelopment">
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
              <GachaCalculatorModuleTitle title="四号谷底地区" />
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
                    show-ticks="always"
                    step="1"
                    max="12"
                    min="1"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    class="v-range-slider"
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
                    show-ticks="always"
                    step="1"
                    max="18"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    class="v-range-slider"
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
                    step="5"
                    :max="valleyIVCrateRewardMax"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    class="v-range-slider"
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
                    step="1"
                    :max="valleyIVBattleCrateRewardMax"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    class="v-range-slider"
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
                    step="5"
                    :max="valleyIVDeltaBotRewardMax"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    class="v-range-slider"
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
                    show-ticks="always"
                    step="1"
                    max="26"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    class="v-range-slider"
                  />
                </v-card-text>
              </v-card>

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
                    show-ticks="always"
                    step="1"
                    max="6"
                    min="1"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    class="v-range-slider"
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
                    show-ticks="always"
                    step="1"
                    max="10"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    class="v-range-slider"
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
                    step="5"
                    :max="wulingCrateRewardMax"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    class="v-range-slider"
                  />
                  储藏箱因数量和种类较多，不提供具体选项，滑块拖动每格为5合成玉
                </v-card-text>
              </v-card>

              <v-divider style="margin: 1rem 0" />
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="wulingDeltaBotReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="wulingDeltaBotProgress"
                    step="5"
                    :max="wulingDeltaBotRewardMax"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    class="v-range-slider"
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
                    show-ticks="always"
                    step="1"
                    max="9"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    class="v-range-slider"
                  />
                </v-card-text>
              </v-card>
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
                    show-ticks="always"
                    step="1"
                    max="60"
                    min="1"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    class="v-range-slider"
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
                    show-ticks="always"
                    step="1"
                    max="7"
                    min="3"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    class="v-range-slider"
                  />
                </v-card-text>
              </v-card>
              <v-divider style="margin: 1rem 0" />
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="operationalManualNodeReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="operationalManualNodeProgress"
                    show-ticks="always"
                    step="1"
                    max="12"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    class="v-range-slider"
                  />
                  共计12节点，每节点750嵌晶玉
                </v-card-text>
              </v-card>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!--常驻奖励-->
          <v-expansion-panel value="permanent">
            <v-expansion-panel-title class="gacha-calculator-card-title">
              <div>
                常驻奖励
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
              <GachaCalculatorResourceSingleBtn
                v-for="item in newHorizonsTaskReward"
                :key="item.id"
                v-bind="item"
                @click="item.active = !item.active"
              />
              <v-divider style="margin: 1rem 0" />
              <GachaCalculatorResourceSingleBtn
                v-for="item in taskRewardTable"
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
                    step="5"
                    :max="factoryManualRewardMax"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    class="v-range-slider"
                  />
                  因手册奖励过于零散，只能通过滑块大致计算
                </v-card-text>
              </v-card>

              <v-divider style="margin: 1rem 0" />
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="defenseConstructionReward" />
                  <v-range-slider
                    v-model="defenseConstructionProgress"
                    step="40"
                    max="1280"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    class="v-range-slider"
                  />
                  据点防御任务每次40嵌晶玉
                </v-card-text>
              </v-card>
              <v-divider style="margin: 1rem 0" />
              <GachaCalculatorResourceSingleBtn
                v-for="item in etchSpaceSalvageReward"
                :key="item.id"
                v-bind="item"
                @click="item.active = !item.active"
              />
              <v-divider style="margin: 1rem 0" />
              <GachaCalculatorModuleTitle title="教学奖励" />

              <GachaCalculatorResourceSingleBtn
                v-for="item in trainingReward"
                :key="item.id"
                v-bind="item"
                @click="item.active = !item.active"
              />

              <GachaCalculatorResourceSingleBtn
                v-for="item in intelArchiveReward"
                :key="item.id"
                v-bind="item"
                @click="item.active = !item.active"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
          <!--氪金资源-->
          <v-expansion-panel value="debug">
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
              <GachaCalculatorPaidResources v-model="paidResources" :current-pool="currentPool" />
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel value="paidResources">
            <v-expansion-panel-title class="gacha-calculator-card-title">
              <div>
                debug
              </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>

              {{gachaCalculatorUserConfig}}
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </section>
  </div>
</template>

<style scoped>
.gacha-calculator-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 1280px;
}

.gacha-calculator-container-left {
  min-width: 600px;
  max-width: 620px;
  padding: 4px;
  position: sticky;
  top: 72px;
  max-height: 640px;
  z-index: 1004;
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

.gacha-calculator-card-title[aria-expanded='true'] {
  border-bottom: 3px solid #ffd700;
}

.gacha-calculator-chart-and-table {
  display: flex;
  justify-content: space-between;
}

.gacha-calculator-statistics-result {
  width: 180px;
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

.gacha-calculator-pie-chart {
  width: 300px;
  height: 240px;
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

@media screen and (max-width: 1280px) {
}

@media screen and (max-width: 600px) {
}

.v-range-slider {
  .v-slider-thumb__label {
    width: 100px;
  }
}

.gacha-calculator-warning {
  background-color: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
  color: #856404;
  font-weight: 600;
  text-align: center;
}
</style>
