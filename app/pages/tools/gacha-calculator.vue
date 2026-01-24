<script setup lang="ts">
import type {
  CurrentVersionRemainingTime,
  PieChartData,
  GachaCalculatorUserConfig,
  ResourceStatisticsResultDetail,
  TotalPullsSingle
} from '@/shared/types/gacha-calculator';
import { gachaResourceStatisticsResult } from '@/custom/core/gacha/resource-statistics-result';
import { numberRound, numberFloor } from '#shared/utils/numberUtil';
import { nextTick, onMounted, ref, watch } from 'vue';
import {
  nodeReward,
  authorityLevelTaskRewards,
  authorityLevelUpReward,
  worldLevelReward,
  etchSpaceSalvageReward
} from '@/custom/core/gacha/level-reward';
import {
  preRegistrationMilestoneReward,
  beginnerSignInTaskReward
} from '@/custom/core/gacha/activity-reward';

import {
  valleyIVRegionalDevelopmentReward,
  valleyIVRegionalStockBillStoreReward,
  valleyIVCollectReward,
  valleyIVCollectRewardTable,
  valleyIVCrateReward,
  wulingRegionalDevelopmentReward,
  wulingRegionalStockBillStoreReward,
  wulingCollectReward,
  wulingCrateReward
} from '@/custom/core/gacha/regional-reward';

import {
  taskRewardTable,
  factoryManualMaxReward,
  factoryManualReward,
  defenseConstructionReward
} from '@/custom/core/gacha/task-reward';


const { t } = useI18n();

const leftPartPanel = ref<string[]>(['statisticalResult']);
const rightPartPanel = ref<string[]>([
  'existing',
  'daily',
  'regionalDevelopment',
  'level',
  'activity',
  'task'
]);
const currentVersionRemainingTime = ref<CurrentVersionRemainingTime>({
  day: 0,
  week: 0,
  month: 0
});

//饼图的数据
let pieChartData: PieChartData[] = [
  { value: 22, name: t('page.tools.gachaCalculator.existing') },
  { value: 33, name: t('page.tools.gachaCalculator.daily') },
  { value: 44, name: t('page.tools.gachaCalculator.activityReward') },
  { value: 22, name: t('page.tools.gachaCalculator.potentialReward') },
  { value: 33, name: t('page.tools.gachaCalculator.permanentReward') },
  { value: 44, name: t('page.tools.gachaCalculator.rechargeReward') },
  { value: 44, name: t('page.tools.gachaCalculator.regionalReward') },
  { value: 44, name: t('page.tools.gachaCalculator.pieChartName') }
];

const existingResource = ref<ResourceStatisticsResultDetail>({
  name: '库存',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0
});

const gachaCalculatorUserConfig = ref<GachaCalculatorUserConfig>({
  existingResource: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0
  },
  resourceActive: {},
  slider: {}

});

function saveUserConfig(key: string, value: number | boolean | number[]): void {
  if (typeof value === 'boolean') {
    if (gachaCalculatorUserConfig.value.resourceActive === undefined) {
      gachaCalculatorUserConfig.value.resourceActive = {};
    }
    gachaCalculatorUserConfig.value.resourceActive[key] = value;
  }

  if (Array.isArray(value)) {
    if (gachaCalculatorUserConfig.value.slider === undefined) {
      gachaCalculatorUserConfig.value.slider = {};
    }
    gachaCalculatorUserConfig.value.slider[key] = value;
  }
  localStorage.setItem('Gacha_Calculator_User_Config', JSON.stringify(gachaCalculatorUserConfig.value));
}

/**
 * 计算排期开始与结束日期的天数差
 * @param {Date|string|number} startDate 开始日期
 * @param {Date|string|number} endDate 结束日期
 * @returns {number} 俩个日期之间的天数差
 */
function calculateDaysDifference(
  startDate: Date | string | number,
  endDate: Date | string | number
): number {
  // 转换为时间戳
  const startTimestamp = typeof startDate === 'number' ? startDate : new Date(startDate).getTime();
  const endTimestamp = typeof endDate === 'number' ? endDate : new Date(endDate).getTime();
  // 计算天数差
  return (endTimestamp - startTimestamp) / (1000 * 60 * 60 * 24);
}

/**
 * 计算两个时间之间有多少个周二
 * @param startDate 开始时间，可以是Date对象、字符串或时间戳
 * @param endDate 结束时间，可以是Date对象、字符串或时间戳
 * @returns 两个时间之间周二的数量
 */
function countTuesdaysBetween(
  startDate: Date | string | number,
  endDate: Date | string | number
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
    (lastTuesday.getTime() - firstTuesday.getTime()) / (1000 * 60 * 60 * 24)
  );

  // 计算周二的数量
  const tuesdayCount = Math.floor(daysBetween / 7) + 1;

  return tuesdayCount;
}

function countTuesdaysBetweenV2(
  startDate: Date | string | number,
  endDate: Date | string | number
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


watch(valleyIVRegionalStockBillStoreReward,
  (newValue) => {
    saveUserConfig(newValue.id, newValue.active);
    gachaResourceStatistics();
  }, { deep: true });

watch(wulingRegionalStockBillStoreReward,
  (newValue) => {
    saveUserConfig(newValue.id, newValue.active);
    gachaResourceStatistics();
  }, { deep: true });

watch(authorityLevelTaskRewards,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active);
    }
    gachaResourceStatistics();
  }, { deep: true });

watch(taskRewardTable,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active);
    }
    gachaResourceStatistics();
  }, { deep: true });

watch(etchSpaceSalvageReward,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active);
    }
    gachaResourceStatistics();
  }, { deep: true });


watch(existingResource, (newValue) => {

  gachaResourceStatistics();
}, { deep: true });

const beginnerCheckInTaskProgress = ref<number[]>([1, 14]);

watch(beginnerCheckInTaskProgress,
  (newVal) => {
    let result = newVal[1]! - newVal[0]!;

    if (
      newVal?.[0] !== undefined &&
      newVal[0] < 11
    ) {
      result--;
    }
    if (
      newVal?.[0] != undefined &&
      newVal[0] < 3
    ) {
      result--;
    }


    beginnerSignInTaskReward.value.content.ticketgachaSpecialSingle = result;
    saveUserConfig(beginnerSignInTaskReward.value.id, newVal);
    gachaResourceStatistics();
  }
);

const nodeRewardProgress = ref<number[]>([0, 12]);

watch(nodeRewardProgress,
  (newVal) => {
    nodeReward.value.content.diamond =
      (newVal[1]! - newVal[0]!) * 750;
    saveUserConfig(nodeReward.value.id, newVal);
    gachaResourceStatistics();
  }
);

const authorityLevelUpProgress = ref<number[]>([1, 60]);

watch(authorityLevelUpProgress,
  (newVal) => {
    let result: number = 0;
    for (let i = newVal[0]!; i < newVal[1]!; i++) {
      if (i === 44) {
        result += 200;
        continue;
      }
      if ((i + 1) % 5 === 0) {
        result += 100;
        continue;
      }
      result += 50;
      console.log('level: ', 60, 'result: ', result);
    }
    authorityLevelUpReward.value.content.diamond = result;
    saveUserConfig(authorityLevelUpReward.value.id, newVal);
    gachaResourceStatistics();
  }
);


//四号谷底地区建设等级进度
const valleyIVRegionalDevelopmentRewardProgress = ref<number[]>([1, 12]);

watch(valleyIVRegionalDevelopmentRewardProgress,
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

    saveUserConfig(valleyIVRegionalDevelopmentReward.value.id, newVal);
    gachaResourceStatistics();
  }
);

const valleyIVCollectRewardProgress = ref<number[]>([0, 18]);

watch(valleyIVCollectRewardProgress,
  (newVal) => {
    let originiumRecharge: number = 0;
    for (
      let i = newVal[0]! + 1;
      i < newVal[1]!;
      i++
    ) {
      const stageReward = valleyIVCollectRewardTable[i];
      if (stageReward !== undefined) {
        originiumRecharge += stageReward.originiumRecharge || 0;
      }
    }

    valleyIVCollectReward.value.content.originiumRecharge = originiumRecharge;
    saveUserConfig(valleyIVCollectReward.value.id, newVal);
    gachaResourceStatistics();
  }
);

const valleyIVCrateRewardProgress = ref<number>(8640);

watch(valleyIVCrateRewardProgress,
  (newVal) => {
    valleyIVCrateReward.value.content.diamond = newVal * 30;

    // saveUserConfig(worldLevelReward.value.id, newVal);
    gachaResourceStatistics();
  }
);


const wulingRegionalRewardProgress = ref<number[]>([1, 6]);

watch(wulingRegionalRewardProgress,
  (newVal) => {
    let diamond: number = 0;
    let ticketgachaStandardSingle: number = 0;
    for (
      let i = newVal[0]!;
      i < newVal[1]!;
      i++
    ) {
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
    saveUserConfig(wulingRegionalDevelopmentReward.value.id, newVal);
    gachaResourceStatistics();
  }
);


const wulingCollectRewardProgress = ref<number[]>([0, 11]);

watch(wulingCollectRewardProgress,
  (newVal) => {
    let originiumRecharge: number = 0;
    for (
      let i = newVal[0]! + 1;
      i < newVal[1]!;
      i++
    ) {
      const stageReward = valleyIVCollectRewardTable[i];
      if (stageReward !== undefined) {
        originiumRecharge += stageReward.originiumRecharge || 0;
      }
    }

    wulingCollectReward.value.content.originiumRecharge = originiumRecharge;
    saveUserConfig(wulingCollectReward.value.id, newVal);
    gachaResourceStatistics();
  }
);


const wulingCrateRewardProgress = ref<number>(8640);

watch(wulingCrateRewardProgress,
  (newVal) => {
    wulingCrateReward.value.content.diamond = newVal * 30;

    // saveUserConfig(worldLevelReward.value.id, newVal);
    gachaResourceStatistics();
  }
);


//世界探索登记奖励进度
const worldLevelRewardProgress = ref<number[]>([3, 7]);

//世界探索登记奖励进度
watch(worldLevelRewardProgress,
  (newVal) => {
    worldLevelReward.value.content.ticketgachaStandardSingle =
      (newVal[1]! - newVal[0]!) * 3;
    saveUserConfig(worldLevelReward.value.id, newVal);
    gachaResourceStatistics();
  }
);


const factoryManualRewardProgress = ref<number>(factoryManualMaxReward);


watch(factoryManualRewardProgress,
  (newVal) => {
    factoryManualReward.value.content.diamond = newVal;

    // saveUserConfig(worldLevelReward.value.id, newVal);
    gachaResourceStatistics();
  }
);

const defenseConstructionRewardProgress = ref<number>(1280);

//世界探索登记奖励进度
watch(defenseConstructionRewardProgress,
  (newVal) => {
    defenseConstructionReward.value.content.diamond = newVal;

    // saveUserConfig(worldLevelReward.value.id, newVal);
    gachaResourceStatistics();
  }
);

const dailyReward = ref<Reward>({
  id: 'day_reward',
  name: {
    zh: `日常奖励X0天`,
    en: ''
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
    ticketgachaSpecialSingle: 0
  }
});

function createDaysReward(): void {
  const remainingDays: number = calculateDaysDifference('2026/01/22', '2026-03-05');
  dailyReward.value.name = {
    zh: `日常奖励X${numberRound(remainingDays, 0)}天`,
    en: ''
  };
  dailyReward.value.content.diamond = numberRound(remainingDays, 0) * 200;
}

createDaysReward();

const weekTaskReward = ref<Reward>({
  id: 'week_task_reward',
  name: {
    zh: `周常奖励X0周`,
    en: ''
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
    ticketgachaSpecialSingle: 0
  }
});

function createWeekTaskReward(): void {
  const remainingWeek: number = countTuesdaysBetweenV2('2026/01/22', '2026-03-05');
  weekTaskReward.value.name = {
    zh: `周常奖励X${numberRound(remainingWeek, 0)}周`,
    en: ''
  };
  weekTaskReward.value.content.diamond = numberRound(remainingWeek, 0) * 500;
}

createWeekTaskReward();


const resourceStatisticsResultDetailList = ref<ResourceStatisticsResultDetail[]>([]);


const gachaResourceStatistics = (): void => {
  const list: ResourceStatisticsResultDetail[] = [];

  function _existingRewardStatistics(): void {
    const result: ResourceStatisticsResultDetail = {
      name: '库存',
      originiumRecharge: existingResource.value.originiumRecharge / 1,
      diamond: existingResource.value.diamond / 1,
      ticketgachaStandardSingle: existingResource.value.ticketgachaStandardSingle / 1,
      ticketgachaSpecialSingle: existingResource.value.ticketgachaSpecialSingle / 1
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
      ticketgachaSpecialSingle: 0
    };

    _addReward(result, dailyReward.value);
    _addReward(result, weekTaskReward.value);

    list.push(result);
    gachaResourceStatisticsResult.value.totalPulls.daily = _getPull(result);
  }

  function _regionalRewardStatistics(): void {
    const result: ResourceStatisticsResultDetail = {
      name: '地区奖励',
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    };

    _addReward(result, valleyIVRegionalStockBillStoreReward.value);
    _addReward(result, valleyIVRegionalDevelopmentReward.value);
    _addReward(result, valleyIVCollectReward.value);
    _addReward(result, valleyIVCrateReward.value);
    _addReward(result, wulingRegionalStockBillStoreReward.value);
    _addReward(result, wulingRegionalDevelopmentReward.value);
    _addReward(result, wulingCollectReward.value);
    _addReward(result, wulingCrateReward.value);

    list.push(result);
    gachaResourceStatisticsResult.value.totalPulls.regional = _getPull(result);
  }

  function _levelRewardStatistics(): void {
    const result: ResourceStatisticsResultDetail = {
      name: '等级奖励',
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    };

    _addReward(result, authorityLevelTaskRewards.value);
    _addReward(result, authorityLevelUpReward.value);
    _addReward(result, nodeReward.value);
    _addReward(result, worldLevelReward.value);
    _addReward(result, etchSpaceSalvageReward.value);
    list.push(result);
    gachaResourceStatisticsResult.value.totalPulls.level = _getPull(result);
  }

  function _activityRewardStatistics(): void {
    const result: ResourceStatisticsResultDetail = {
      name: '活动奖励',
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    };
    _addReward(result, beginnerSignInTaskReward.value);
    _addReward(result, preRegistrationMilestoneReward.value);

    list.push(result);
    gachaResourceStatisticsResult.value.totalPulls.activity = _getPull(result);
  }

  function _taskRewardStatistics(): void {
    const result: ResourceStatisticsResultDetail = {
      name: '任务奖励',
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    };
    _addReward(result, taskRewardTable.value);
    _addReward(result, factoryManualReward.value);
    _addReward(result, defenseConstructionReward.value);
    list.push(result);
    gachaResourceStatisticsResult.value.totalPulls.task = _getPull(result);

  }

  function _totalRewardStatistics(): void {
    const result: ResourceStatisticsResultDetail = {
      name: '共计',
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    };
    for (const item of list) {
      result.originiumRecharge += item.originiumRecharge;
      result.diamond += item.diamond;
      result.ticketgachaStandardSingle += item.ticketgachaStandardSingle;
      result.ticketgachaSpecialSingle += item.ticketgachaSpecialSingle;
    }

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
      result.originiumRecharge += reward.content.originiumRecharge;
      result.diamond += reward.content.diamond;
      result.ticketgachaStandardSingle += reward.content.ticketgachaStandardSingle;
      result.ticketgachaSpecialSingle += reward.content.ticketgachaSpecialSingle;
    }
  }

  _existingRewardStatistics();
  _dailyRewardStatistics();
  _regionalRewardStatistics();
  _levelRewardStatistics();
  _activityRewardStatistics();
  _taskRewardStatistics();
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
      name: t(`page.tools.gachaCalculator.${key}`) + t(`page.tools.gachaCalculator.reward`)
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
        result.ticketgachaSpecialSingle
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
          percent: param.percent || 0
        });
      },
      position: 'inner'
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
          textStyle: { color: 'rgb(255,69,0)', fontSize: '12' }
        },
        labelLine: {
          length: 4,
          length2: 4
        },

        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    ]
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
          'gacha-calculator-pie-chart'
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
  }
);


const progressMap: Record<string, Ref<number[]>> = {
  'beginner_sign_in_task': beginnerCheckInTaskProgress,
  'node_reward': nodeRewardProgress,
  'authority_level_up_reward': authorityLevelUpProgress,
  'valley_IV_regional_development_reward': valleyIVRegionalDevelopmentRewardProgress,
  'valley_IV_collect_reward': valleyIVCollectRewardProgress,
  'wuling_regional_development_reward': wulingRegionalRewardProgress,
  'world_level_reward': worldLevelRewardProgress
};


function loadingUserConfig() {
  const localConfigStr = localStorage.getItem('Gacha_Calculator_User_Config');
  if (localConfigStr) {
    try {
      const localConfig: GachaCalculatorUserConfig = JSON.parse(localConfigStr);
      // 使用localConfig
      if (localConfig.slider) {
        for (const key in localConfig.slider) {
          if (localConfig.slider[key] === undefined || !Array.isArray(localConfig.slider[key])) {
            continue;
          }
          const value: number[] = localConfig.slider[key];
          if (progressMap[key]) {
            progressMap[key].value = value;
          }
        }
      }
    } catch (error) {
      console.error('Failed to parse user config:', error);
    }
  }
}


onMounted(() => {
  loadingUserConfig();
  myChart = echarts.init(document.getElementById('gacha-calculator-pie-chart'));
  setPieChart(pieChartData);
  gachaResourceStatistics();
  currentVersionRemainingTime.value.day = calculateDaysDifference('2026/01/22', '2026-03-05');
});
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
                    0
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

              <v-btn-group style="margin: 8px auto;width: 100%">
                <v-btn color="#B60129" style="width: 33%">
                  熔火灼痕<br>01.22——02.07
                </v-btn>
                <!--  color="#BE2F00"-->
                <v-btn disabled style="width: 33%">
                  轻飘飘的信使<br>02.07——02.24
                </v-btn>
                <!--  color="#FA5B81"-->
                <v-btn disabled style="width: 33%">
                  热烈色彩<br>02.24——未知
                </v-btn>
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


              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel value="detail">
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
                计算详情
              </div>
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
        <!--        <div style="width: 100%; height: 20px" />-->
      </div>
      <!--      <div>-->
      <!--        {{ JSON.stringify(allGachaResource) }}-->
      <!--      </div>-->
      <div class="gacha-calculator-container-right">
        <v-expansion-panels v-model="rightPartPanel" multiple>
          <v-expansion-panel value="existing">
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
                库存 {{ numberFloor(gachaResourceStatisticsResult.totalPulls.existing.ticketgachaSpecialSingle,1) }}
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
          <v-expansion-panel value="daily">
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
                日常积累 {{ numberFloor(gachaResourceStatisticsResult.totalPulls.daily.ticketgachaSpecialSingle,1)  }}
                {{ t('page.tools.gachaCalculator.pulls') }}
              </div>
            </v-expansion-panel-title>
            <v-divider />
            <v-expansion-panel-text>
              <GachaCalculatorResourceSingle v-bind="dailyReward" />
              <GachaCalculatorResourceSingle v-bind="weekTaskReward" />
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel value="regionalDevelopment">
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
                地区奖励 {{ numberFloor(gachaResourceStatisticsResult.totalPulls.regional.ticketgachaSpecialSingle,1)  }}
                {{ t('page.tools.gachaCalculator.pulls') }}
              </div>
            </v-expansion-panel-title>
            <v-divider />
            <v-expansion-panel-text>
              <GachaCalculatorModuleTitle title="四号谷底地区" />
              <GachaCalculatorResourceSingleBtn
                v-bind="valleyIVRegionalStockBillStoreReward"
                @click="
                  valleyIVRegionalStockBillStoreReward.active = !valleyIVRegionalStockBillStoreReward.active
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
                  <GachaCalculatorResourceSingle v-bind="valleyIVCollectReward" />
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
                  <v-slider
                    v-model="valleyIVCrateRewardProgress"
                    step="1"
                    max="288"
                    thumb-label="always"
                    tick-size="4"
                    hide-details="auto"
                    class="v-range-slider"
                  />
                  宝箱按平均一个30嵌晶玉的较低期望计算
                </v-card-text>
              </v-card>


              <GachaCalculatorModuleTitle title="武陵地区" />
              <GachaCalculatorResourceSingleBtn
                v-bind="wulingRegionalStockBillStoreReward"
                @click="wulingRegionalStockBillStoreReward.active = !wulingRegionalStockBillStoreReward.active"
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
                  <GachaCalculatorResourceSingle v-bind="wulingCollectReward" />
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
                  <v-slider
                    v-model="wulingCrateRewardProgress"
                    step="1"
                    max="183"
                    tick-size="4"
                    thumb-label="always"
                    hide-details="auto"
                    class="v-range-slider"
                  />
                  宝箱按平均一个30嵌晶玉的较低期望计算
                </v-card-text>
              </v-card>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel value="level">
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
                等级奖励 {{ numberFloor(gachaResourceStatisticsResult.totalPulls.level.ticketgachaSpecialSingle,1)  }}
                {{ t('page.tools.gachaCalculator.pulls') }}
              </div>
            </v-expansion-panel-title>
            <v-divider />
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

              <GachaCalculatorResourceSingleBtn
                v-for="item in etchSpaceSalvageReward"
                :key="item.id"
                v-bind="item"
                @click="item.active = !item.active"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel value="activity">
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
                活动奖励  {{ numberFloor(gachaResourceStatisticsResult.totalPulls.activity.ticketgachaSpecialSingle,1)  }}
                {{ t('page.tools.gachaCalculator.pulls') }}
              </div>
            </v-expansion-panel-title>
            <v-divider />
            <v-expansion-panel-text>
              <GachaCalculatorResourceSingleBtn
                v-bind="preRegistrationMilestoneReward"
                @click="
                  preRegistrationMilestoneReward.active = !preRegistrationMilestoneReward.active
                "
              />
              <v-divider style="margin: 1rem 0" />
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

            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel value="task">
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
                任务奖励 {{ numberFloor(gachaResourceStatisticsResult.totalPulls.task.ticketgachaSpecialSingle,1)  }}
                {{ t('page.tools.gachaCalculator.pulls') }}
              </div>
            </v-expansion-panel-title>
            <v-divider />
            <v-expansion-panel-text>
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

.gacha-calculator-pie-chart {
  width: 450px;
  height: 300px;
  margin: auto;
}

.gacha-calculator-resource-table {
  width: 200px;
  height: 200px;
  text-align: center;
  font-weight: bold;

  td {
    padding: 0.1rem 0.3rem;
  }
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
