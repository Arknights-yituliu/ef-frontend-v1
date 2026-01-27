<script setup lang="ts">
import type {
  PieChartData,
  GachaCalculatorUserConfig,
  ResourceStatisticsResultDetail,
  TotalPullsSingle,
  PoolOption,
} from '@/shared/types/gacha-calculator';
import { gachaResourceStatisticsResult } from '@/custom/core/gacha/resource-statistics-result';
import { numberRound, numberFloor } from '#shared/utils/numberUtil';
import { nextTick, onMounted, ref, watch } from 'vue';
import {
  nodeReward,
  authorityLevelTaskRewards,
  authorityLevelUpReward,
  worldLevelReward,
  etchSpaceSalvageReward,
} from '@/custom/core/gacha/level-reward';

import { activityReward } from '@/custom/core/gacha/activity-reward';

import { AICQuotaReward } from '@/custom/core/gacha/daily-reward';

import {
  valleyIVRegionalDevelopmentReward,
  valleyIVRegionalStockBillStoreReward,
  valleyIVAuryleneCollectRewardTable,
  valleyIVAuryleneCollectReward,
  valleyIVCrateReward,
  valleyIVSimulationReward,
  wulingRegionalDevelopmentReward,
  wulingRegionalStockBillStoreReward,
  wulingAuryleneCollectRewardTable,
  wulingAuryleneCollectReward,
  wulingCrateReward,
  wulingSimulationReward
} from '@/custom/core/gacha/regional-reward';

import {
  taskRewardTable,
  factoryManualMaxReward,
  factoryManualReward,
  beginnerSignInTaskReward,
  defenseConstructionReward,
  newHorizonsTaskReward,
  trainingReward
} from '@/custom/core/gacha/permanent-reward';

const { t } = useI18n();

const leftPartPanel = ref<string[]>(['statisticalResult']);
const rightPartPanel = ref<string[]>([
  'existing',
  'daily',
  'regionalDevelopment',
  'level',
  'activity',
  'permanent',
]);

const poolOptions =  ref<PoolOption[]>( [
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

const startDate:Date = new Date();

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
    saveUserConfig(newValue.id, newValue.active, 'buttonActive');
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

const beginnerCheckInTaskProgress = ref<number[]>([1, 14]);

watch(beginnerCheckInTaskProgress, (newVal) => {
  let result = newVal[1]! - newVal[0]!;

  if (newVal?.[0] !== undefined && newVal[0] < 11) {
    result--;
  }

  if (newVal?.[0] != undefined && newVal[0] < 3) {
    result--;
  }

  beginnerSignInTaskReward.value.content.ticketgachaSpecialSingle = result;
  saveUserConfig(beginnerSignInTaskReward.value.id, newVal, 'rangeSlider');
  gachaResourceStatistics();
});

const nodeRewardProgress = ref<number[]>([0, 12]);

watch(nodeRewardProgress, (newVal) => {
  nodeReward.value.content.diamond = (newVal[1]! - newVal[0]!) * 750;
  saveUserConfig(nodeReward.value.id, newVal, 'rangeSlider');
  gachaResourceStatistics();
});

const authorityLevelUpProgress = ref<number[]>([1, 60]);

watch(authorityLevelUpProgress, (newVal) => {
  let result: number = 0;
  for (let i = newVal[0]!; i < newVal[1]!; i++) {
    console.log('level: ', i, 'result: ', result);
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
    if(i>45){
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
});

//四号谷底地区建设等级进度
const valleyIVRegionalDevelopmentRewardProgress = ref<number[]>([1, 12]);

watch(valleyIVRegionalDevelopmentRewardProgress, (newVal) => {
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
});

const valleyIVCollectRewardProgress = ref<number[]>([0, 18]);

watch(valleyIVCollectRewardProgress, (newVal) => {
  let originiumRecharge: number = 0;
  for (let i = newVal[0]! + 1; i < newVal[1]!; i++) {
    const stageReward = valleyIVAuryleneCollectRewardTable[i];
    if (stageReward !== undefined) {
      originiumRecharge += stageReward.originiumRecharge || 0;
    }
  }

  valleyIVAuryleneCollectReward.value.content.originiumRecharge = originiumRecharge;
  saveUserConfig(valleyIVAuryleneCollectReward.value.id, newVal, 'rangeSlider');
  gachaResourceStatistics();
});

const valleyIVCrateRewardProgress = ref<number[]>([0, 288]);

watch(valleyIVCrateRewardProgress, (newVal) => {
  valleyIVCrateReward.value.content.diamond = (newVal[1]! - newVal[0]!) * 30;
  saveUserConfig(valleyIVCrateReward.value.id, newVal, 'rangeSlider');
  gachaResourceStatistics();
});

const valleyIVSimulationRewardProgress = ref<number[]>([0, 26]);

watch(valleyIVSimulationRewardProgress, (newVal) => {
  valleyIVSimulationReward.value.content.diamond = (newVal[1]! - newVal[0]!) * 25;
  saveUserConfig(valleyIVSimulationReward.value.id, newVal, 'rangeSlider');
  gachaResourceStatistics();
});

//武陵地区建设奖励
const wulingRegionalRewardProgress = ref<number[]>([1, 6]);

watch(wulingRegionalRewardProgress, (newVal) => {
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
});

//武陵醚质收集奖励
const wulingCollectRewardProgress = ref<number[]>([0, 11]);
//武陵醚质收集奖励进度
watch(wulingCollectRewardProgress, (newVal) => {
  let originiumRecharge: number = 0;
  for (let i = newVal[0]! + 1; i < newVal[1]!; i++) {
    const stageReward = wulingAuryleneCollectRewardTable[i];
    if (stageReward !== undefined) {
      originiumRecharge += stageReward.originiumRecharge || 0;
    }
  }

  wulingAuryleneCollectReward.value.content.originiumRecharge = originiumRecharge;
  saveUserConfig(wulingAuryleneCollectReward.value.id, newVal, 'rangeSlider');
  gachaResourceStatistics();
});

//武陵储藏箱奖励
const wulingCrateRewardProgress = ref<number[]>([0, 183]);
//武陵储藏箱奖励进度
watch(wulingCrateRewardProgress, (newVal) => {
  wulingCrateReward.value.content.diamond = (newVal[1]! - newVal[0]!) * 30;
  saveUserConfig(wulingCrateReward.value.id, newVal, 'rangeSlider');
  gachaResourceStatistics();
});


//武陵模拟空间奖励
const wulingSimulationRewardProgress = ref<number[]>([0, 9]);
//武陵模拟空间奖励进度
watch(wulingSimulationRewardProgress, (newVal) => {
  wulingSimulationReward.value.content.diamond = (newVal[1]! - newVal[0]!) * 25;
  saveUserConfig(wulingSimulationReward.value.id, newVal, 'rangeSlider');
  gachaResourceStatistics();
});



//世界探索等级奖励进度
const worldLevelRewardProgress = ref<number[]>([3, 7]);

//世界探索等级奖励进度
watch(worldLevelRewardProgress, (newVal) => {
  worldLevelReward.value.content.ticketgachaStandardSingle = (newVal[1]! - newVal[0]!) * 3;
  saveUserConfig(worldLevelReward.value.id, newVal, 'rangeSlider');
  gachaResourceStatistics();
});

const factoryManualRewardProgress = ref<number>(factoryManualMaxReward);

watch(factoryManualRewardProgress, (newVal) => {
  factoryManualReward.value.content.diamond = newVal;
  saveUserConfig(factoryManualReward.value.id, newVal, 'slider');
  gachaResourceStatistics();
});

//据点防御
const defenseConstructionRewardProgress = ref<number>(1280);
//据点防御奖励进度
watch(defenseConstructionRewardProgress, (newVal) => {
  defenseConstructionReward.value.content.diamond = newVal;
  saveUserConfig(defenseConstructionReward.value.id, newVal, 'slider');
  gachaResourceStatistics();
});



const resourceStatisticsResultDetailList = ref<ResourceStatisticsResultDetail[]>([]);

const totalResourceStatisticsResultDetail = ref({
  name: '全部资源',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
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
    _addReward(result, valleyIVSimulationReward.value);
    _addReward(result, wulingRegionalStockBillStoreReward.value);
    _addReward(result, wulingRegionalDevelopmentReward.value);
    _addReward(result, wulingAuryleneCollectReward.value);
    _addReward(result, wulingCrateReward.value);
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
    _addReward(result, nodeReward.value);
    _addReward(result, worldLevelReward.value);
    _addReward(result, etchSpaceSalvageReward.value);
    _addReward(result, trainingReward.value);
    list.push(result);
    gachaResourceStatisticsResult.value.totalPulls.level = _getPull(result);
  }

  function _activityRewardStatistics(): void {
    const result: ResourceStatisticsResultDetail = {
      name: '活动奖励',
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
    };

    for (const reward of activityReward.value) {
      if (checkRewardIsValid(reward)) {
        _addReward(result, reward);
      }
    }

    console.log(result);
    list.push(result);
    gachaResourceStatisticsResult.value.totalPulls.activity = _getPull(result);
  }

  function _permanentRewardStatistics(): void {
    const result: ResourceStatisticsResultDetail = {
      name: '常驻奖励',
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
    };
    _addReward(result, beginnerSignInTaskReward.value);
    _addReward(result, taskRewardTable.value);
    _addReward(result, factoryManualReward.value);
    _addReward(result, defenseConstructionReward.value);
    _addReward(result, newHorizonsTaskReward.value);
    list.push(result);
    gachaResourceStatisticsResult.value.totalPulls.permanent = _getPull(result);
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
  _dailyRewardStatistics();
  _regionalRewardStatistics();
  _levelRewardStatistics();
  _activityRewardStatistics();
  _permanentRewardStatistics();
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
      value: value,
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
  node_reward: nodeRewardProgress,
  authority_level_up_reward: authorityLevelUpProgress,
  world_level_reward: worldLevelRewardProgress,
  valley_IV_regional_development_reward: valleyIVRegionalDevelopmentRewardProgress,
  valley_IV_aurylene_collect_reward: valleyIVCollectRewardProgress,
  valley_IV_crate_reward: valleyIVCrateRewardProgress,
  valley_IV_simulation_reward:valleyIVSimulationRewardProgress,
  wuling_regional_development_reward: wulingRegionalRewardProgress,
  wuling_aurylene_collect_reward: valleyIVCollectRewardProgress,
  wuling_crate_reward: wulingCrateRewardProgress,
  wuling_simulation_reward:wulingSimulationRewardProgress,
};

const sliderMap: Record<string, Ref<number>> = {
  defense_construction_reward: defenseConstructionRewardProgress,
  factory_manual_reward: factoryManualRewardProgress,
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
          if (
            localConfig.rangeSlider[key] === undefined ||
            !Array.isArray(localConfig.rangeSlider[key])
          ) {
            continue;
          }
          const value: number[] = localConfig.rangeSlider[key];
          if (rangeSliderMap[key]) {
            rangeSliderMap[key].value = value;
          }
        }
      }

      if (localConfig.slider) {
        for (const key in localConfig.slider) {
          const value: number = localConfig.slider[key] || 0;
          if (sliderMap[key]) {
            sliderMap[key].value = value;
          }
        }
      }

      if (localConfig.buttonActive) {
        _setButtonActive(localConfig.buttonActive, valleyIVRegionalStockBillStoreReward);
        _setButtonActive(localConfig.buttonActive, wulingRegionalStockBillStoreReward);
        _setButtonActive(localConfig.buttonActive, newHorizonsTaskReward)
      }

      if (localConfig.buttonGroupActive) {
        _setButtonGroupActive(localConfig.buttonGroupActive, AICQuotaReward);
        _setButtonGroupActive(localConfig.buttonGroupActive, authorityLevelTaskRewards);
        _setButtonGroupActive(localConfig.buttonGroupActive, taskRewardTable);
        _setButtonGroupActive(localConfig.buttonGroupActive, etchSpaceSalvageReward);
        _setButtonGroupActive(localConfig.buttonGroupActive, trainingReward);
        _setButtonGroupActive(localConfig.buttonGroupActive, activityReward);
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
  if(poolOptions.value[0]!==undefined){
    selectedPool(poolOptions.value[0])
  }
});

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

  if ('slider' === type) {
    if (typeof value !== 'number') {
      console.log('传入配置非数字类型');
      return;
    }
    if (gachaCalculatorUserConfig.value.slider === undefined) {
      gachaCalculatorUserConfig.value.slider = {};
    }
    gachaCalculatorUserConfig.value.slider[key] = value;
  }

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

/**
 * 计算排期开始与结束日期的天数差
 * @param {Date|string|number} startDate 开始日期
 * @param {Date|string|number} endDate 结束日期
 * @returns {number} 俩个日期之间的天数差
 */
function calculateDaysDifference(
  startDate: Date | string | number,
  endDate: Date | string | number,
): number {
  // 转换为时间戳
  const startTimestamp = typeof startDate === 'number' ? startDate : new Date(startDate).getTime();
  const endTimestamp = typeof endDate === 'number' ? endDate : new Date(endDate).getTime();
  // 计算天数差
  return (endTimestamp - startTimestamp) / (1000 * 60 * 60 * 24);
}

function checkRewardIsValid(reward: Reward): boolean {
  const currentPoolValue = currentPool.value;

  // 活动结束时间在当前池子开始时间之前，活动已结束
  if (reward.end <= currentPoolValue.start) {
    return false;
  }

  // 活动开始时间在当前池子结束时间之后，活动未开始
  if (reward.start > currentPoolValue.end) {
    return false;
  }

  // 判断奖励类型是否可以被计入
  // 通用类型都可以计入，特殊类型需要与当前池子类型匹配
  return reward.type === '通用' || reward.type === currentPoolValue.type;
}

/**
 * 计算两个时间之间有多少个周二
 * @param startDate 开始时间，可以是Date对象、字符串或时间戳
 * @param endDate 结束时间，可以是Date对象、字符串或时间戳
 * @returns 两个时间之间周二的数量
 */
function countTuesdaysBetween(
  startDate: Date | string | number,
  endDate: Date | string | number,
): number {
  // 将输入转换为Date对象
  const start = new Date(startDate);
  const end = new Date(endDate);

  // 确保开始时间不晚于结束时间
  if (start > end) {
    // [start, end] = [end, start];
  }

  // 设置时间为当天的0点，避免时间部分影响计算
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // 获取星期几（0-6，0是周日）
  const startDay = start.getDay();
  const endDay = end.getDay();

  // 计算开始日期到下一个周二的天数差
  // 周二是2，所以计算：如果是周二，差0天；如果是周三，差6天；如果是周一，差1天，以此类推
  const daysToFirstTuesday = (9 - startDay) % 7;

  // 创建第一个周二的日期
  const firstTuesday = new Date(start);
  firstTuesday.setDate(start.getDate() + daysToFirstTuesday);

  // 如果第一个周二在开始日期之后但开始日期本身就是周二，需要调整
  if (firstTuesday > start && startDay === 2) {
    firstTuesday.setDate(firstTuesday.getDate() - 7);
  }

  // 如果第一个周二已经超过结束日期，说明没有周二
  if (firstTuesday > end) {
    return 0;
  }

  // 计算最后一个周二的日期
  const daysFromLastTuesday = (endDay - 2 + 7) % 7;
  const lastTuesday = new Date(end);
  lastTuesday.setDate(end.getDate() - daysFromLastTuesday);

  // 计算两个周二之间的天数差
  const daysBetween = Math.round(
    (lastTuesday.getTime() - firstTuesday.getTime()) / (1000 * 60 * 60 * 24),
  );

  // 计算周二的数量
  const tuesdayCount = Math.floor(daysBetween / 7) + 1;

  return tuesdayCount;
}

function countTuesdaysBetweenV2(
  startDate: Date | string | number,
  endDate: Date | string | number,
): number {
  // 将输入转换为Date对象
  const start = new Date(startDate);
  const end = new Date(endDate).getTime();

  const startTimestamp = start.getTime();
  let week = 0;

  if (start.getDay() < 2) {
    week++;
  }

  const oneDayTimestamp = 1000 * 60 * 60 * 24;

  for (let i = startTimestamp; i <= end; i++) {
    const date = new Date(i);
    if (date.getDay() === 2) {
      week++;
    }
    i += oneDayTimestamp;
  }

  return week;
}

</script>

<template>
  <div>
    <section class="gacha-calculator-container">
      <div class="gacha-calculator-container-left">
        <v-expansion-panels v-model="leftPartPanel" multiple>
          <v-expansion-panel value="statisticalResult">
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
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
                {{ gachaResourceStatisticsResult.rechargeAmount }}
                {{ t('page.tools.gachaCalculator.yuan') }}
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-btn-group style="margin: 8px auto; width: 100%">
                <v-btn
                  v-for="option in poolOptions"
                  style="width: 33%"

                  :color="currentPool.name===option.name?option.color:'#aaaaaa'"
                  @click="selectedPool(option)"
                  >{{ option.name }}<br >{{ option.dateText }}</v-btn
                >
              </v-btn-group>

              <div class="gacha-calculator-statistical-result">
                <div class="gacha-calculator-warning">
                  攒抽计算器尚在测试与更新中，目前可能bug较多，资源不全，结果仅供参考，切勿轻信本站！
                </div>
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
                      {{ numberFloor(totalResourceStatisticsResultDetail.diamond,0) }}({{
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
            </v-expansion-panel-text>
          </v-expansion-panel>

        </v-expansion-panels>
        <!--        <div style="width: 100%; height: 20px" />-->
      </div>
      <!--      <div>-->
      <!--        {{ JSON.stringify(allGachaResource) }}-->
      <!--      </div>-->
      <div class="gacha-calculator-container-right">
        <v-expansion-panels v-model="rightPartPanel" multiple>
          <!--库存-->
          <v-expansion-panel value="existing">
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
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
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
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
            <v-divider style="margin: 1rem 0" />
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
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
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
            <v-divider style="margin: 1rem 0" />
            <v-expansion-panel-text>
              <GachaCalculatorResourceSingleBtn
                v-for="item in activityReward"
                :key="item.id"
                v-bind="item"
                @click="item.active = !item.active"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!--          地区奖励-->
          <v-expansion-panel value="regionalDevelopment">
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
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
            <v-divider style="margin: 1rem 0" />
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
                    v-model="valleyIVRegionalDevelopmentRewardProgress"
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
                    v-model="valleyIVCollectRewardProgress"
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
                    step="1"
                    max="288"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    class="v-range-slider"
                  />
                  储藏箱按平均一个30嵌晶玉的较低期望计算
                </v-card-text>
              </v-card>

                <v-divider style="margin: 1rem 0" />
                <v-card>
                  <v-card-text>
                    <GachaCalculatorResourceSingle v-bind="valleyIVSimulationReward" />
                    <div style="height: 36px" />
                    <v-range-slider
                      v-model="valleyIVSimulationRewardProgress"
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
                    v-model="wulingRegionalRewardProgress"
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
                    v-model="wulingCollectRewardProgress"
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
                    step="1"
                    max="183"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    class="v-range-slider"
                  />
                  储藏箱按平均一个30嵌晶玉的较低期望计算
                </v-card-text>
              </v-card>

              <v-divider style="margin: 1rem 0" />
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="wulingSimulationReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="wulingSimulationRewardProgress"
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
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
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
            <v-divider style="margin: 1rem 0" />
            <v-expansion-panel-text>
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle v-bind="authorityLevelUpReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="authorityLevelUpProgress"
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
                    v-model="worldLevelRewardProgress"
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
                  <GachaCalculatorResourceSingle v-bind="nodeReward" />
                  <div style="height: 36px" />
                  <v-range-slider
                    v-model="nodeRewardProgress"
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

          <!--任务奖励-->
          <v-expansion-panel value="permanent">
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
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
            <v-divider style="margin: 1rem 0" />
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
                v-bind="newHorizonsTaskReward"
                @click="newHorizonsTaskReward.active = !newHorizonsTaskReward.active"
              />
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
                  <v-slider
                    v-model="factoryManualRewardProgress"
                    step="5"
                    :max="factoryManualMaxReward"
                    min="0"
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
                  <v-slider
                    v-model="defenseConstructionRewardProgress"
                    step="40"
                    max="1280"
                    min="0"
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

            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel value="detail">
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">计算详情</div>
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
  max-width: 620px;
  position: sticky;
  top: 72px;
  max-height: 800px;
  z-index: 1004;
  flex: 3;
}

.gacha-calculator-container-right {
  max-width: 620px;
}

.gacha-calculator-card-title {
  font-size: 1.2rem;
  font-weight: bolder;
}

.gacha-calculator-statistical-result {
  display: block;
}

.gacha-calculator-statistics-result {
  display: flex;
  flex-wrap: wrap;
}

.gacha-calculator-statistics-result-item {
  display: flex;
  align-items: center;
  width: 280px;
}

.gacha-calculator-statistics-result-item-text {
  padding: 0 0 4px 12px;
}

.gacha-calculator-pie-chart {
  width: 450px;
  height: 300px;
  margin: auto;
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
