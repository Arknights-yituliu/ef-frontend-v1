<script setup lang="ts">
import type {
  GachaCalculatorUserConfig,
  PieChartData,
  PoolOption,
  RewardStatisticsResultDetail,
  TotalPullsSingle,
} from '@/shared/types/gacha-calculator';
import { addReward, getRewardPull, getRewardsPull } from '#shared/utils/gacha-calculator';
import { numberFloor, stringToNumber } from '#shared/utils/numberUtil';
import * as echarts from 'echarts';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { activityReward } from '@/custom/core/gacha/activityReward';

// 奖励引入
import {
  calculatorDailyReward,
  dailyAllRewardTable,
  dailyReward,
  freeMonthlyPass,
  weekTaskReward,
} from '@/custom/core/gacha/dailyReward';

import gachaProbabilityTable from '@/custom/core/gacha/data/gacha_probability_table.json';

import {
  archivePermanentRewardTable,
  authorityLevelUpReward,
  authorityLevelUpRewardTable,
  permanentRewardTable,
} from '@/custom/core/gacha/permanentRewardV2';

import { gachaResourceStatisticsResult } from '@/custom/core/gacha/resourceStatisticsResult';

import { packs } from '@/custom/core/packs';

const { t } = useI18n();

//
const leftPartPanel = ref<string[]>(['statisticalResult']);
// 'existing', 'daily','activity,'regional', 'level', 'regional','permanent'
const rightPartPanel = ref<string[]>(['permanent', 'archivePermanent']);

const poolOptions = ref<PoolOption[]>([
  {
    name: '洛茜卡池',
    start: new Date('2026/03/29 12:00:00'),
    end: new Date('2026/04/17 12:00:00'),
    dateText: '3.29-版本末',
    type: '洛茜',
    disabled: false,
  },
  {
    name: '庄方宜卡池',
    start: new Date('2026/04/17 12:00:00'),
    end: new Date('2026/05/22 12:00:00'),
    dateText: '04.17——05.22',
    type: '庄方宜',
    disabled: false,
  },
  {
    name: '待定',
    start: new Date('2026/02/24 12:00:00'),
    end: new Date('2026/03/12 12:00:00'),
    dateText: '',
    type: '热烈色彩',
    disabled: true,
  },
]);

//  {
//     name: '待定',
//     color: '#FA5B81',
//     start: new Date('2026/02/24 12:00:00'),
//     end: new Date('2026/03/12 12:00:00'),
//     dateText: '',
//     type: '热烈色彩',
//     disabled: true,
//   },

const currentPool = ref<PoolOption>({
  name: '轻飘飘的信使',
  start: new Date('2026/02/07 12:00:00'),
  end: new Date('2026/02/24 12:00:00'),
  dateText: '02.07——02.24',
  type: '轻飘飘的信使',
  disabled: false,
});

const startDate: Date = new Date();
let remainingDays: number = 0;
function selectedPool(option: PoolOption): void {
  currentPool.value = option;
  remainingDays = calculateDaysDifference(startDate, option.end);
  calculatorDailyReward(startDate, option.end);
  existingRewardStatistics();
  dailyRewardStatistics();
  activityRewardStatistics();

  permanentRewardStatistics();

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
  ticketgachaLimitedSingle: 0,
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

const seekIntelBook = ref({
  id: 'seek_intel_book',
  name: { zh: '寻访情报书', en: 'Seek Intel Book' },
  active: false,
  type: '通用',
  module: '库存',
  version: '通用',
  start: new Date('2026/01/01'),
  end: new Date('2099/12/31'),
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 10,
  },
});

watch(
  seekIntelBook,
  (newValue) => {
    saveUserConfig(newValue.id, newValue.active, 'buttonActive');
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
  ticketgachaLimitedSingle: 0,
};

function existingRewardStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '库存',
    originiumRecharge: existingResource.value.originiumRecharge / 1,
    diamond: existingResource.value.diamond / 1,
    ticketgachaStandardSingle: existingResource.value.ticketgachaStandardSingle / 1,
    ticketgachaSpecialSingle: existingResource.value.ticketgachaSpecialSingle / 1,
    ticketgachaLimitedSingle: seekIntelBook.value.active ? 10 : 0,
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

// 日常奖励重构
watch(
  dailyAllRewardTable,
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
  ticketgachaLimitedSingle: 0,
};

function dailyRewardStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '日常奖励',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  };

  addReward(result, dailyReward.value);
  addReward(result, weekTaskReward.value);
  addReward(result, freeMonthlyPass.value);
  // 日常奖励重构
  for (const reward of dailyAllRewardTable.value) {
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
  ticketgachaLimitedSingle: 0,
};

function activityRewardStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '活动奖励',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
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
 * 常驻奖励计算相关代码起始
 */

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

    permanentRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

watch(
  permanentRewardTable,
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
  archivePermanentRewardTable,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }

    aprchivePermanentRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

let permanentRewardStatisticsResultDetail: RewardStatisticsResultDetail = {
  name: '常驻奖励·新版本',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
  ticketgachaLimitedSingle: 0,
};

let archivePermanentRewardStatisticsResultDetail: RewardStatisticsResultDetail = {
  name: '常驻奖励·旧版本',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
  ticketgachaLimitedSingle: 0,
};

function permanentRewardStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '常驻奖励·新版本',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  };
  addReward(result, permanentRewardTable.value);
  addReward(result, authorityLevelUpReward.value);

  permanentRewardStatisticsResultDetail = result;
  gachaResourceStatisticsResult.value.totalPulls.permanent = getRewardPull(result);
}

function aprchivePermanentRewardStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '常驻奖励·旧版本',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  };

  addReward(result, archivePermanentRewardTable.value);

  archivePermanentRewardStatisticsResultDetail = result;
  gachaResourceStatisticsResult.value.totalPulls.archivePermanent = getRewardPull(result);
}

/**
 * 常驻奖励计算相关代码结尾
 */

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
  ticketgachaLimitedSingle: 0,
};

function rechargeResourceStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '氪金资源',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  };

  // 计算月卡
  if (rechargeResources.value.monthlyPass) {
    const monthlyPack = packs['月卡'];
    if (monthlyPack) {
      result.originiumRecharge += 12; // 一次性12源石
      result.diamond += remainingDays * 200; // 每天200嵌晶玉
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
            default: {
              if (item.itemId.includes('ticketgacha_special_ten')) {
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

const totalResourceStatisticsResultDetail = ref<RewardStatisticsResultDetail>({
  name: '全部资源',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
  ticketgachaLimitedSingle: 0,
});

const gachaProbability = ref(0);

function allRewardStatisticsV2(): void {
  const list: RewardStatisticsResultDetail[] = [
    existingRewardStatisticsResultDetail,
    dailyRewardStatisticsResultDetail,
    activityRewardStatisticsResultDetail,
    archivePermanentRewardStatisticsResultDetail,
    permanentRewardStatisticsResultDetail,
    rechargeResourceStatisticsResultDetail,
  ];

  const result: RewardStatisticsResultDetail = {
    name: '共计',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  };

  for (const item of list) {
    result.originiumRecharge += item.originiumRecharge;
    result.diamond += item.diamond;
    result.ticketgachaStandardSingle += item.ticketgachaStandardSingle;
    result.ticketgachaSpecialSingle += item.ticketgachaSpecialSingle;
    result.ticketgachaLimitedSingle += item.ticketgachaLimitedSingle;
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
    const value: number =
      (totalPullsSingle.ticketgachaSpecialSingle || 0) +
      (totalPullsSingle.ticketgachaLimitedSingle || 0);

    if ('total' === key || value === 0) {
      continue;
    }
    pieChartData.push({
      value: numberFloor(value),
      name: t(`page.tools.gachaCalculator.${key}`),
    });
  }

  const totalPulls = numberFloor(getSpecialAndLimitedPulls(gachaResourceStatisticsResult.value.totalPulls.total), 0);
  if(totalPulls>119){
    gachaProbability.value = 1;
  }else{
    console.log(totalPulls)
    console.log(gachaProbabilityTable[totalPulls])
    gachaProbability.value = gachaProbabilityTable[totalPulls] as number;
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
            <div> ${numberRound(param.percent || 0, 1)}%</div>
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
  authority_level_up_reward: authorityLevelProgress,
};

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
        gachaCalculatorUserConfig.value.buttonActive = localConfig.buttonActive;

        // 加载寻访情报书状态
        if (localConfig.buttonActive['seek_intel_book'] !== undefined) {
          seekIntelBook.value.active = localConfig.buttonActive['seek_intel_book'] || false;
        }
      }

      if (localConfig.buttonGroupActive) {
        // 日常奖励重构
        _setButtonGroupActive(localConfig.buttonGroupActive, dailyAllRewardTable);

        // 常驻奖励重构
        _setButtonGroupActive(localConfig.buttonGroupActive, permanentRewardTable);
        _setButtonGroupActive(localConfig.buttonGroupActive, archivePermanentRewardTable);

        // 活动奖励
        _setButtonGroupActive(localConfig.buttonGroupActive, activityReward);

        gachaCalculatorUserConfig.value.buttonGroupActive = localConfig.buttonGroupActive;
      }

      if (localConfig.existingResource) {
        const localExistingResource = localConfig.existingResource;

        gachaCalculatorUserConfig.value.existingResource.originiumRecharge = stringToNumber(
          localExistingResource.originiumRecharge,
        );
        existingResource.value.originiumRecharge = stringToNumber(
          localExistingResource.originiumRecharge,
        );

        gachaCalculatorUserConfig.value.existingResource.diamond = stringToNumber(
          localExistingResource.diamond,
        );
        existingResource.value.diamond = stringToNumber(localExistingResource.diamond);

        gachaCalculatorUserConfig.value.existingResource.ticketgachaStandardSingle = stringToNumber(
          localExistingResource.ticketgachaStandardSingle,
        );
        existingResource.value.ticketgachaStandardSingle = stringToNumber(
          localExistingResource.ticketgachaStandardSingle,
        );

        gachaCalculatorUserConfig.value.existingResource.ticketgachaSpecialSingle = stringToNumber(
          localExistingResource.ticketgachaSpecialSingle,
        );
        existingResource.value.ticketgachaSpecialSingle = stringToNumber(
          localExistingResource.ticketgachaSpecialSingle,
        );
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
  const gachaCalculatorPieChart: HTMLElement | null = document.querySelector(
    '#gacha-calculator-pie-chart',
  );
  if (gachaCalculatorPieChart) {
    myChart = echarts.init(gachaCalculatorPieChart);
  }

  setPieChart(pieChartData);
  for (const option of poolOptions.value) {
    if (option.end > new Date()) {
      selectedPool(option);
      break;
    }
  }
});

function clearOrSelectAllActivityModule(action: boolean) {
  clearOrSelectAll(action, 'button', activityReward);
}

function clearOrSelectAllCurrentVersion(version: string) {
  // 日常奖励重构
  _filterByVersion(dailyAllRewardTable, version);
  _filterByVersion(activityReward, version);

  authorityLevelProgress.value = [60, 60];

  function _filterByVersion(
    reward: Ref<Reward> | Ref<Reward[]> | Ref<number[]>,

    version: string,
  ) {
    const value = reward.value;
    if (Array.isArray(value)) {
      // 处理 Ref<Reward[]> 类型
      for (const item of value) {
        if (typeof item === 'object' && item !== null && 'active' in item) {
          console.log('item', item.name.zh, item.version, version === item.version);
          if (version === item.version) {
            item.active = true;
          } else {
            item.active = false;
          }
        }
      }
    } else if (typeof value === 'object' && value !== null && 'active' in value) {
      // 处理 Ref<Reward> 类型
      console.log('item', value.name.zh, value.version, version === value.version);
      if (version === value.version) {
        value.active = true;
      } else {
        value.active = false;
      }
    }
  }
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

  console.log(reward.name.zh, reward.type, currentPoolValue.type);

  // 活动结束时间在当前池子开始时间之前，活动已结束
  if (reward.end <= startDate) {
    console.log(reward.name.zh, '过期');
    display = false;
  }

  // 活动开始时间在当前池子结束时间之后，活动未开始
  if (reward.start >= currentPoolValue.end) {
    console.log(reward.name.zh, '过期');
    display = false;
  }

  console.log(reward.name.zh, reward.end, startDate);
  console.log(reward.name.zh, reward.start, currentPoolValue.end);
  console.log(reward.name.zh, reward.start, reward.end);
  // 判断奖励类型是否可以被计入
  // 通用类型都可以计入，特殊类型需要与当前池子类型匹配
  console.log(reward.name.zh, display);
  return display;
}

// 武库配额计算
const arsenalStandardPulls = ref<number>(0);
const arsenalSpecialPulls = ref<number>(0);
const arsenalCoefficient = ref<number>(80);

// 实际抽数 = 基础 + 特许，如果特许>30则额外+10
const arsenalActualPulls = computed(() => {
  let pulls = arsenalStandardPulls.value + arsenalSpecialPulls.value;
  if (arsenalSpecialPulls.value > 30) {
    pulls += 10;
  }
  return pulls;
});

// 武库配额 = 实际抽数 × 系数
const arsenalQuotaResult = computed(() => arsenalActualPulls.value * arsenalCoefficient.value);

// 监听总计数据变化，自动填入武库配额
watch(
  () => gachaResourceStatisticsResult.value.totalPulls.total,
  () => {
    fillStandardPulls();
    fillSpecialPulls();
  },
  { deep: true, immediate: true },
);

// 填入计算得到的基础凭证抽数
function fillStandardPulls() {
  arsenalStandardPulls.value =
    gachaResourceStatisticsResult.value.totalPulls.total?.ticketgachaStandardSingle || 0;
}

// 填入计算得到的特许凭证抽数
function fillSpecialPulls() {
  arsenalSpecialPulls.value = getSpecialAndLimitedPulls(
    gachaResourceStatisticsResult.value.totalPulls.total,
  );
}

function getSpecialAndLimitedPulls(pullsSignle: TotalPullsSingle | undefined) {
  let pulls = 0;

  pulls += pullsSignle?.ticketgachaSpecialSingle || 0;
  pulls += pullsSignle?.ticketgachaLimitedSingle || 0;

  return numberFloor(pulls, 0);
}
</script>

<template>
  <section class="gacha-calculator-container">
    <div class="gacha-calculator-container-left">
      <v-expansion-panels v-model="leftPartPanel" multiple>
        <v-expansion-panel value="statisticalResult">
          <v-expansion-panel-title class="gacha-calculator-card-title">
            <div>
              {{ t('page.tools.gachaCalculator.total') }}
              {{ gachaResourceStatisticsResult.totalPulls.total?.ticketgachaStandardSingle }}
              {{ t('page.tools.gachaCalculator.standard')
              }}{{ t('page.tools.gachaCalculator.ticketgacha') }}
              {{ getSpecialAndLimitedPulls(gachaResourceStatisticsResult.totalPulls.total) }}
              {{ t('page.tools.gachaCalculator.special')
              }}{{ t('page.tools.gachaCalculator.ticketgacha') }}
              {{ t('page.tools.gachaCalculator.rechargeAmount') }}
              {{ numberFloor(paidResourcesTotalPrice, 2) }}
              {{ t('page.tools.gachaCalculator.yuan') }}
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <v-btn-group class="gacha-calculator-pool-btn-group-pc">
              <v-btn
                v-for="option in poolOptions"
                :key="option.name"
                class="gacha-calculator-pool-btn-pc"
                :class="currentPool.name === option.name ? '' : 'gacha-calculator-pool-btn'"
                color="rgb(33, 150, 243)"
                :disabled="option.disabled"
                @click="selectedPool(option)"
                >{{ option.name }}<br />{{ option.dateText }}
              </v-btn>
            </v-btn-group>
            <v-btn
              v-for="option in poolOptions"
              class="gacha-calculator-pool-btn-phone"
              :class="currentPool.name === option.name ? '' : 'gacha-calculator-pool-btn'"
              color="rgb(33, 150, 243)"
              :disabled="option.disabled"
              @click="selectedPool(option)"
              >{{ option.name }}<br />{{ option.dateText }}
            </v-btn>

            <div class="gacha-calculator-warning">
              《春晓时》资源尚在更新中，结果仅供参考，切勿轻信本站！
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
                  />
                  <span class="gacha-calculator-statistics-result-item-text">
                    {{ totalResourceStatisticsResultDetail.originiumRecharge }}
                    ({{ numberFloor(totalResourceStatisticsResultDetail.originiumRecharge * 0.15) }}
                    {{ t('page.tools.gachaCalculator.pulls') }})
                  </span>
                </div>

                <div class="gacha-calculator-statistics-result-item">
                  <img
                    alt="existing"
                    class="gacha-calculator-gacha-item-icon"
                    src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp"
                  />
                  <span class="gacha-calculator-statistics-result-item-text">
                    {{ totalResourceStatisticsResultDetail.diamond }}
                    ({{ numberFloor(totalResourceStatisticsResultDetail.diamond / 500) }}
                    {{ t('page.tools.gachaCalculator.pulls') }})
                  </span>
                </div>

                <div class="gacha-calculator-statistics-result-item">
                  <img
                    alt="existing"
                    class="gacha-calculator-gacha-item-icon"
                    src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp"
                  />
                  <span class="gacha-calculator-statistics-result-item-text">
                    {{ totalResourceStatisticsResultDetail.ticketgachaStandardSingle }}
                  </span>
                </div>

                <div class="gacha-calculator-statistics-result-item">
                  <img
                    alt="existing"
                    class="gacha-calculator-gacha-item-icon"
                    src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp"
                  />
                  <span class="gacha-calculator-statistics-result-item-text">
                    {{ totalResourceStatisticsResultDetail.ticketgachaSpecialSingle }}
                  </span>
                </div>

                <div class="gacha-calculator-statistics-result-item">
                  <img
                    alt="existing"
                    class="gacha-calculator-gacha-item-icon"
                    src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single_lt_1_0_1.webp"
                  />
                  <span class="gacha-calculator-statistics-result-item-text">
                    {{ totalResourceStatisticsResultDetail.ticketgachaLimitedSingle }}
                  </span>
                </div>
              </div>
            </div>
           
            <div>
              拿到卡池UP干员的概率：{{ numberFloor(gachaProbability * 100) }}%
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel value="arsenalQuota">
          <v-expansion-panel-title class="gacha-calculator-card-title">
            <div>武库配额估算</div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="gacha-calculator-arsenal-quota">
              <div class="gacha-calculator-arsenal-quota-row">
                <label class="gacha-calculator-arsenal-quota-label">基础凭证抽数</label>
                <v-number-input
                  v-model="arsenalStandardPulls"
                  class="gacha-calculator-arsenal-quota-input-field"
                  control-variant="hidden"
                  density="compact"
                  hide-details="auto"
                  variant="solo"
                />
                <v-btn
                  class="gacha-calculator-arsenal-quota-btn"
                  color="primary"
                  size="small"
                  variant="tonal"
                  @click="fillStandardPulls"
                >
                  填入计算得到的抽数
                </v-btn>
              </div>
              <div class="gacha-calculator-arsenal-quota-row">
                <label class="gacha-calculator-arsenal-quota-label">特许凭证抽数</label>
                <v-number-input
                  v-model="arsenalSpecialPulls"
                  class="gacha-calculator-arsenal-quota-input-field"
                  control-variant="hidden"
                  density="compact"
                  hide-details="auto"
                  variant="solo"
                />
                <v-btn
                  class="gacha-calculator-arsenal-quota-btn"
                  color="primary"
                  size="small"
                  variant="tonal"
                  @click="fillSpecialPulls"
                >
                  填入计算得到的抽数
                </v-btn>
              </div>
              <div class="gacha-calculator-arsenal-quota-row">
                <label class="gacha-calculator-arsenal-quota-label">武库配额系数</label>
                <v-number-input
                  v-model="arsenalCoefficient"
                  class="gacha-calculator-arsenal-quota-input-field"
                  control-variant="hidden"
                  density="compact"
                  hide-details="auto"
                  variant="solo"
                />
                <v-btn
                  class="gacha-calculator-arsenal-quota-btn"
                  color="orange"
                  size="small"
                  variant="tonal"
                  @click="arsenalCoefficient = 38"
                >
                  保底值(38)
                </v-btn>
                <v-btn
                  class="gacha-calculator-arsenal-quota-btn"
                  color="blue"
                  size="small"
                  variant="tonal"
                  @click="arsenalCoefficient = 50"
                >
                  期望值(50)
                </v-btn>
                <v-btn
                  class="gacha-calculator-arsenal-quota-btn"
                  color="green"
                  size="small"
                  variant="tonal"
                  @click="arsenalCoefficient = 80"
                >
                  统计值(80)
                </v-btn>
              </div>
              <v-divider style="margin: 0.5rem 0" />
              <div class="gacha-calculator-arsenal-quota-formula">
                <span>实际抽数 × 武库配额系数 = 武库配额</span>
              </div>
              <div class="gacha-calculator-arsenal-quota-formula-detail">
                <span class="gacha-calculator-arsenal-quota-formula-num">
                  {{ arsenalActualPulls }}
                </span>
                <span class="gacha-calculator-arsenal-quota-formula-op"> × </span>
                <span class="gacha-calculator-arsenal-quota-formula-num">
                  {{ arsenalCoefficient }}
                </span>
                <span class="gacha-calculator-arsenal-quota-formula-op"> = </span>
                <span class="gacha-calculator-arsenal-quota-result-value">
                  {{ arsenalQuotaResult }}
                </span>
              </div>
              <div class="gacha-calculator-arsenal-quota-formula">
                <span>*特许凭证抽数>30时，实际抽数会增加赠送的10连</span>
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
                    />
                  </th>
                  <th>
                    <img
                      alt="existing"
                      class="gacha-calculator-result-detail-table-icon"
                      src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp"
                    />
                  </th>
                  <th>
                    <img
                      alt="existing"
                      class="gacha-calculator-result-detail-table-icon"
                      src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp"
                    />
                  </th>
                  <th>
                    <img
                      alt="existing"
                      class="gacha-calculator-result-detail-table-icon"
                      src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp"
                    />
                  </th>
                  <th>
                    <img
                      alt="existing"
                      class="gacha-calculator-result-detail-table-icon"
                      src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single_lt_1_0_1.webp"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in resourceStatisticsResultDetailList">
                  <td>{{ item.name }}</td>

                  <td>{{ item.originiumRecharge }}</td>
                  <td>{{ item.diamond }}</td>
                  <td>{{ item.ticketgachaStandardSingle }}</td>
                  <td>{{ item.ticketgachaSpecialSingle }}</td>
                  <td>{{ item.ticketgachaLimitedSingle }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel style="display: none">
          <v-expansion-panel-title class="gacha-calculator-card-title">
            <div>{{ t('page.tools.gachaCalculator.shortcutActions') }}</div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-btn color="blue" @click="clearOrSelectAllCurrentVersion('春晓时')"
              >一键选择[春晓时]版本内奖励，并取消选择旧版本奖励</v-btn
            >
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
      <!-- <v-alert style="margin-bottom: 8px" type="info">
        基础寻访次数仅在总计模块显示，各模块不再单独显示
      </v-alert> -->
      <v-expansion-panels v-model="rightPartPanel" multiple>
        <!--库存-->
        <v-expansion-panel value="existing">
          <v-expansion-panel-title class="gacha-calculator-card-title">
            <div>
              库存与自定义
              {{ getSpecialAndLimitedPulls(gachaResourceStatisticsResult.totalPulls.existing) }}
              {{ t('page.tools.gachaCalculator.pulls') }}
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="gacha-calculator-existing-resource-grid">
              <div class="gacha-calculator-existing-resource-input">
                <img
                  alt="existing"
                  class="gacha-calculator-gacha-item-icon"
                  src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp"
                />
                <v-number-input
                  v-model="existingResource.originiumRecharge"
                  control-variant="hidden"
                  density="compact"
                  hide-details="auto"
                  variant="solo"
                />
              </div>
              <div class="gacha-calculator-existing-resource-input">
                <img
                  alt="existing"
                  class="gacha-calculator-gacha-item-icon"
                  src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp"
                />
                <v-number-input
                  v-model="existingResource.diamond"
                  control-variant="hidden"
                  density="compact"
                  hide-details="auto"
                  variant="solo"
                />
              </div>
              <div class="gacha-calculator-existing-resource-input">
                <img
                  alt="existing"
                  class="gacha-calculator-gacha-item-icon"
                  src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp"
                />
                <v-number-input
                  v-model="existingResource.ticketgachaStandardSingle"
                  control-variant="hidden"
                  density="compact"
                  hide-details="auto"
                  variant="solo"
                />
              </div>
              <div class="gacha-calculator-existing-resource-input">
                <img
                  alt="existing"
                  class="gacha-calculator-gacha-item-icon"
                  src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp"
                />
                <v-number-input
                  v-model="existingResource.ticketgachaSpecialSingle"
                  control-variant="hidden"
                  density="compact"
                  hide-details="auto"
                  variant="solo"
                />
              </div>
            </div>
            <GachaCalculatorResourceSingleBtn
              v-bind="seekIntelBook"
              @click="seekIntelBook.active = !seekIntelBook.active"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!--日常奖励-->
        <v-expansion-panel value="daily">
          <v-expansion-panel-title class="gacha-calculator-card-title">
            <div>
              日常积累
              {{ getSpecialAndLimitedPulls(gachaResourceStatisticsResult.totalPulls.daily) }}
              {{ t('page.tools.gachaCalculator.pulls') }}
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <GachaCalculatorResourceSingle v-bind="dailyReward" />
            <GachaCalculatorResourceSingle v-bind="weekTaskReward" />
            <GachaCalculatorResourceSingle v-bind="freeMonthlyPass" />
            <v-divider style="margin: 1rem 0" />

            <template v-for="item in dailyAllRewardTable">
              <GachaCalculatorModuleTitle v-if="item.type === '标题'" :title="item.name.zh" />
              <GachaCalculatorResourceSingleBtn
                v-show="checkRewardIsValid(item)"
                v-bind="item"
                @click="item.active = !item.active"
              />
            </template>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!--活动奖励-->
        <v-expansion-panel value="activity">
          <v-expansion-panel-title class="gacha-calculator-card-title">
            <div>
              版本限时活动
              {{ getSpecialAndLimitedPulls(gachaResourceStatisticsResult.totalPulls.activity) }}
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
        <!--常驻奖励重构-->
        <v-expansion-panel value="permanent-re">
          <v-expansion-panel-title class="gacha-calculator-card-title">
            <div>
              版本新增常驻奖励
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

            <template v-for="reward in permanentRewardTable">
              <GachaCalculatorResourceSingleBtn
                v-bind="reward"
                @click="reward.active = !reward.active"
              />
            </template>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!--常驻奖励重构-->
        <v-expansion-panel value="archivePermanent">
          <v-expansion-panel-title class="gacha-calculator-card-title">
            <div>
              往期版本常驻奖励
              {{
                numberFloor(
                  gachaResourceStatisticsResult.totalPulls.archivePermanent
                    ?.ticketgachaSpecialSingle,
                  1,
                )
              }}
              {{ t('page.tools.gachaCalculator.pulls') }}
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <template v-for="reward in archivePermanentRewardTable">
              <GachaCalculatorResourceSingleBtn
                v-bind="reward"
                @click="reward.active = !reward.active"
              />
            </template>
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
            <GachaCalculatorPaidResources v-model="rechargeResources" :current-pool="currentPool" />
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
  margin: auto;
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

.gacha-calculator-container-right .v-expansion-panel {
  margin: 8px 0px;
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
  border-bottom: 1px groove var(--gacha-calculator-border);
}

.gacha-calculator-pool-btn-group-pc {
  display: flex;
  margin: 8px auto;
  width: 100%;
}

.gacha-calculator-pool-btn-pc {
  width: 33%;
  color: #ffffff;
}

.gacha-calculator-pool-btn {
  opacity: 0.4;
}

.gacha-calculator-pool-btn-phone {
  display: none;
  color: #ffffff;
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
  margin: 12px 0;
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

.gacha-calculator-existing-resource-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

.gacha-calculator-arsenal-quota {
  padding: 0.5rem 0;
}

.gacha-calculator-arsenal-quota-row {
  display: flex;
  align-items: center;
  margin: 0.75rem 0;
  gap: 8px;
}

.gacha-calculator-arsenal-quota-label {
  min-width: 100px;
  font-weight: bold;
  white-space: nowrap;
}

.gacha-calculator-arsenal-quota-input-field {
  flex: 1;
  min-width: 60px;
}

.gacha-calculator-arsenal-quota-btn {
  white-space: nowrap;
  font-size: 0.75rem;
  margin-left: 4px;
}

.gacha-calculator-arsenal-quota-formula {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.gacha-calculator-arsenal-quota-formula-detail {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
}

.gacha-calculator-arsenal-quota-formula-num {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.gacha-calculator-arsenal-quota-formula-op {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 4px;
}

.gacha-calculator-arsenal-quota-result-value {
  font-size: 1.4rem;
  font-weight: bold;
  color: rgb(33, 150, 243);
  margin-left: 4px;
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
    width: 100%;
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
