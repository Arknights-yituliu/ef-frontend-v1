<script setup lang="ts">
import type { CurrentVersionRemainingTime, PieChartData } from '@/shared/types/gacha-calculator';
import {
  allGachaResource,
  resourceStatisticsResult
} from '@/custom/core/gacha/resource-statistics-result';
import { numberRound } from '#shared/utils/numberUtil';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import {
  beginnerSignInTask,
  nodeReward,
  authorityLevelTaskRewards,
  authorityLevelUpReward
} from '@/custom/core/gacha/task-reward-table';

import {
  valleyIVRegionalDevelopmentReward,
  valleyIVRegionalStockBillStore,
  valleyIVCollectReward,
  valleyIVCollectRewardTable,
  wulingRegionalDevelopmentReward,
  wulingRegionalStockBillStore
} from '@/custom/core/gacha/regional-development-reward-table';

const { t } = useI18n();

const leftPartPanel = ref<string[]>(['statisticalResult']);
const rightPartPanel = ref<string[]>(['existing', 'daily', 'task', 'permanent', 'regionalDevelopment']);
const currentVersionRemainingTime = ref<CurrentVersionRemainingTime>({
  day: 0,
  week: 0,
  month: 0
});

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
function countTuesdaysBetween(startDate: Date | string | number, endDate: Date | string | number): number {
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
  const daysBetween = Math.round((lastTuesday.getTime() - firstTuesday.getTime()) / (1000 * 60 * 60 * 24));

  // 计算周二的数量
  const tuesdayCount = Math.floor(daysBetween / 7) + 1;

  return tuesdayCount;
}

function countTuesdaysBetweenV2(startDate: Date | string | number, endDate: Date | string | number): number {
            // 将输入转换为Date对象
  const start = new Date(startDate);
  const end = new Date(endDate).getTime();

  let startTimestamp = start.getTime()
  let week = 0

  if( start.getDay()<2){
    week++;
  }

  const oneDayTimestamp = 1000 * 60 * 60 * 24;

  for (let i = startTimestamp; i <= end; i++) {
        const date = new Date(i);
        if (date.getDay() === 2) {
          week++;
        }
        i+=oneDayTimestamp;
  }

  return week;
}

const beginnerCheckInTaskRemainingDays = ref<number[]>([1, 14]);

watch(() => beginnerCheckInTaskRemainingDays.value, (newVal, oldVal) => {
  let result
    = beginnerCheckInTaskRemainingDays.value[1]! - beginnerCheckInTaskRemainingDays.value[0]!;

  if (beginnerCheckInTaskRemainingDays.value?.[0] !== undefined && beginnerCheckInTaskRemainingDays.value[0] < 11) {
    result--;
  }
  if (beginnerCheckInTaskRemainingDays.value?.[0] != undefined && beginnerCheckInTaskRemainingDays.value[0] < 3) {
    result--;
  }
  beginnerSignInTask.value.content.ticketgachaSpecialSingle = result;
});

const nodeRewardProgress = ref<number[]>([0, 12]);

watch(() => nodeRewardProgress.value, (newVal, oldVal) => {
  nodeReward.value.content.diamond =
    (nodeRewardProgress.value[1]! - nodeRewardProgress.value[0]!) * 750;
});

const authorityLevelUpProgress = ref<number[]>([1, 60]);

watch(() => authorityLevelUpProgress.value, (newVal, oldVal) => {
  let result: number = 0;
  for (let i = authorityLevelUpProgress.value[0]! ; i < authorityLevelUpProgress.value[1]!; i++) {
    if (i === 44) {
      result += 200;
      continue;
    }
    if ((i+1) % 5 === 0) {
      result += 100;
      continue;
    }
    result += 50;
    console.log('level: ', 60, 'result: ', result);
  }

  authorityLevelUpReward.value.content.diamond = result;
});

const valleyIVRegionalRewardProgress = ref<number[]>([1, 12]);

watch(() => valleyIVRegionalRewardProgress.value, (newVal, oldVal) => {
  let diamond: number = 0;
  let ticketgachaStandardSingle: number = 0;
  for (let i = valleyIVRegionalRewardProgress.value[0]! ; i <= valleyIVRegionalRewardProgress.value[1]!; i++) {
    if (i === 1) {
      continue;
    }
    if (i < 10) {
      diamond += 200;
      ticketgachaStandardSingle++;
      continue;
    }
    diamond += 200;
    ticketgachaStandardSingle += 2;
  }
  valleyIVRegionalDevelopmentReward.value.content.diamond = diamond
  valleyIVRegionalDevelopmentReward.value.content.ticketgachaStandardSingle = ticketgachaStandardSingle
});

const valleyIVCollectRewardProgress = ref<number[]>([0, 18]);

watch(() => valleyIVCollectRewardProgress.value, (newVal, oldVal) => {
  let originiumRecharge: number = 0;
  for (let i = valleyIVCollectRewardProgress.value[0]!+1 ; i < valleyIVCollectRewardProgress.value[1]!; i++) {
    const stageReward = valleyIVCollectRewardTable[i]
    if(stageReward!==undefined){
      originiumRecharge+=stageReward.originiumRecharge;
    }
  }
  valleyIVCollectReward.value.content.originiumRecharge = originiumRecharge
});

const wulingRegionalRewardProgress = ref<number[]>([1, 6]);

watch(() => wulingRegionalRewardProgress.value, (newVal, oldVal) => {
  let diamond: number = 0;
  let ticketgachaStandardSingle: number = 0;
  for (let i = wulingRegionalRewardProgress.value[0]! ; i < wulingRegionalRewardProgress.value[1]!; i++) {

    if (i < 10) {
      diamond += 200;
      ticketgachaStandardSingle++;
      continue;
    }
    diamond += 200;
    ticketgachaStandardSingle += 2;
  }
  wulingRegionalDevelopmentReward.value.content.diamond = diamond
  wulingRegionalDevelopmentReward.value.content.ticketgachaStandardSingle = ticketgachaStandardSingle
});


const dayTaskReward = ref<Reward>(
  {
    id: 'day_task_reward',
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
      ticketgachaSpecialSingle: 0,
      ticketgachaStandardTen: 0,
      ticketgachaSpecialTen: 0
    }
  }
);

function createDaysReward(): void {
  const remainingDays: number = calculateDaysDifference('2026/01/22', '2026-03-05');
  dayTaskReward.value.name = {
    zh: `日常奖励X${numberRound(remainingDays, 0)}天`,
    en: ''
  };
  dayTaskReward.value.content.diamond = numberRound(remainingDays, 0) * 200;

}

createDaysReward();


const weekTaskReward = ref<Reward>(
  {
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
      ticketgachaSpecialSingle: 0,
      ticketgachaStandardTen: 0,
      ticketgachaSpecialTen: 0
    }
  }
);


function createWeekTaskReward(): void {
  const remainingWeek: number = countTuesdaysBetweenV2('2026/01/22', '2026-03-05');
  weekTaskReward.value.name = {
    zh: `周常奖励X${numberRound(remainingWeek, 0)}周`,
    en: ''
  };
  weekTaskReward.value.content.diamond = numberRound(remainingWeek, 0) * 500;

}

 createWeekTaskReward()
//饼图的数据
const pieChartData = computed(() => [
  { value: 22, name: t('page.tools.gachaCalculator.existing') },
  { value: 33, name: t('page.tools.gachaCalculator.permanent') },
  { value: 44, name: t('page.tools.gachaCalculator.daily') },
  { value: 22, name: t('page.tools.gachaCalculator.recharge') },
  { value: 33, name: t('page.tools.gachaCalculator.activity') },
  { value: 44, name: t('page.tools.gachaCalculator.other') }
]);
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
        setPieChart(pieChartData.value as PieChartData[]);
      });
    }
  }
);

onMounted(() => {
  myChart = echarts.init(document.getElementById('gacha-calculator-pie-chart'));
  setPieChart(pieChartData.value as PieChartData[]);

  currentVersionRemainingTime.value.day = calculateDaysDifference('2026/01/22', '2026-03-05');
});
</script>

<template>
  <div>
    <header class="page-title">{{ t('page.tools.gachaCalculator.title') }}</header>
    <p>{{ t('page.tools.gachaCalculator.underDevelopment') }}</p>
    {{ leftPartPanel }} {{ rightPartPanel }}
    <section class="gacha-calculator-container">
      <div class="gacha-calculator-container-left">
        <v-expansion-panels v-model="leftPartPanel" multiple>
          <v-expansion-panel value="statisticalResult">
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
                {{ t('page.tools.gachaCalculator.total') }}
                {{ resourceStatisticsResult.totalPulls.allResources }}
                {{ t('page.tools.gachaCalculator.pulls') }}，
                {{ t('page.tools.gachaCalculator.rechargeAmount') }}$
                {{ resourceStatisticsResult.rechargeAmount }}
                {{ t('page.tools.gachaCalculator.yuan') }}
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="gacha-calculator-statistical-result">
                <div
                  id="gacha-calculator-pie-chart"
                  ref="gacha-calculator-pie-chart"
                  class="gacha-calculator-pie-chart"
                />

                <table class="gacha-calculator-resource-table">
                  <tbody>
                  <tr>
                    <td>{{ t('page.tools.gachaCalculator.existing') }}</td>
                    <td>{{ resourceStatisticsResult.totalPulls.existingResources }}</td>
                    <td>{{ t('page.tools.gachaCalculator.pulls') }}</td>
                  </tr>
                  <tr>
                    <td>{{ t('page.tools.gachaCalculator.daily') }}</td>
                    <td>{{ resourceStatisticsResult.totalPulls.dailyResources }}</td>
                    <td>{{ t('page.tools.gachaCalculator.pulls') }}</td>
                  </tr>
                  <tr>
                    <td>{{ t('page.tools.gachaCalculator.permanent') }}</td>
                    <td>{{ resourceStatisticsResult.totalPulls.potentialResources }}</td>
                    <td>{{ t('page.tools.gachaCalculator.pulls') }}</td>
                  </tr>
                  <tr>
                    <td>{{ t('page.tools.gachaCalculator.recharge') }}</td>
                    <td>{{ resourceStatisticsResult.totalPulls.rechargeResources }}</td>
                    <td>{{ t('page.tools.gachaCalculator.pulls') }}</td>
                  </tr>
                  <tr>
                    <td>{{ t('page.tools.gachaCalculator.activity') }}</td>
                    <td>{{ resourceStatisticsResult.totalPulls.activityResources }}</td>
                    <td>{{ t('page.tools.gachaCalculator.pulls') }}</td>
                  </tr>
                  <tr>
                    <td>{{ t('page.tools.gachaCalculator.other') }}</td>
                    <td>{{ resourceStatisticsResult.totalPulls.otherResources }}</td>
                    <td>{{ t('page.tools.gachaCalculator.pulls') }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <!--      <div>-->
      <!--        {{ JSON.stringify(allGachaResource) }}-->
      <!--      </div>-->
      <div class="gacha-calculator-container-right">
        <v-expansion-panels v-model="rightPartPanel" multiple>
          <v-expansion-panel value="existing">
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
                库存 {{ resourceStatisticsResult.totalPulls.existingResources }}
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
                  />
                  <v-text-field
                    v-model="allGachaResource.existing.originiumRecharge"
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
                  />
                  <v-text-field
                    v-model="allGachaResource.existing.diamond"
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
                  />
                  <v-text-field
                    v-model="allGachaResource.existing.ticketgachaStandardSingle"
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
                  />
                  <v-text-field
                    v-model="allGachaResource.existing.ticketgachaSpecialSingle"
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
                日常积累 {{ resourceStatisticsResult.totalPulls.dailyResources }}
                {{ t('page.tools.gachaCalculator.pulls') }}
              </div>
            </v-expansion-panel-title>
            <v-divider />
            <v-expansion-panel-text>
              <GachaCalculatorResourceSingle v-bind="dayTaskReward">
              </GachaCalculatorResourceSingle>
              <GachaCalculatorResourceSingle v-bind="weekTaskReward">
              </GachaCalculatorResourceSingle>

            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel value="task">
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
                任务奖励 {{ resourceStatisticsResult.totalPulls.dailyResources }}
                {{ t('page.tools.gachaCalculator.pulls') }}
              </div>
            </v-expansion-panel-title>
            <v-divider />
            <v-expansion-panel-text>




            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel value="regionalDevelopment">
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
                地区奖励 {{ resourceStatisticsResult.totalPulls.dailyResources }}
                {{ t('page.tools.gachaCalculator.pulls') }}
              </div>
            </v-expansion-panel-title>
            <v-divider />
            <v-expansion-panel-text>
              <GachaCalculatorModuleTitle title="四号谷底地区"></GachaCalculatorModuleTitle>
              <GachaCalculatorResourceSingleBtn
                v-bind="valleyIVRegionalStockBillStore"
                @click="valleyIVRegionalStockBillStore.active = !valleyIVRegionalStockBillStore.active"
              />
              <v-divider style="margin: 1rem 0"></v-divider>
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle
                    v-bind="valleyIVRegionalDevelopmentReward"
                  />
                  <div style="height: 36px"></div>
                  <v-range-slider v-model="valleyIVRegionalRewardProgress"
                                  show-ticks="always"
                                  step="1"
                                  max="12"
                                  min="1"
                                  tick-size="4" thumb-label="always"
                                  hide-details="auto"
                                  class="v-range-slider">
                  </v-range-slider>
                  通过滑块调节当前地区建设等级
                </v-card-text>
              </v-card>

              <v-divider style="margin: 1rem 0"></v-divider>
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle
                    v-bind="valleyIVCollectReward"
                  />
                  <div style="height: 36px"></div>
                  <v-range-slider v-model="valleyIVCollectRewardProgress"
                                  show-ticks="always"
                                  step="1"
                                  max="18"
                                  tick-size="4" thumb-label="always"
                                  hide-details="auto"
                                  class="v-range-slider">
                  </v-range-slider>
                  通过滑块调节当前醚质收集阶段
                </v-card-text>
              </v-card>

              <GachaCalculatorModuleTitle title="武陵地区"></GachaCalculatorModuleTitle>
              <GachaCalculatorResourceSingleBtn
                v-bind="wulingRegionalStockBillStore"
                @click="wulingRegionalStockBillStore.active = !wulingRegionalStockBillStore.active"
              />
              <v-divider style="margin: 1rem 0"></v-divider>
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle
                    v-bind="wulingRegionalDevelopmentReward"
                  />
                  <div style="height: 36px"></div>
                  <v-range-slider v-model="wulingRegionalRewardProgress"
                                  show-ticks="always"
                                  step="1"
                                  max="6"
                                  min="1"
                                  tick-size="4" thumb-label="always"
                                  hide-details="auto"
                                  class="v-range-slider">
                  </v-range-slider>
                  通过滑块调节当前地区建设等级
                </v-card-text>
              </v-card>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel value="permanent">
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
                常驻奖励 {{ resourceStatisticsResult.totalPulls.dailyResources }}
                {{ t('page.tools.gachaCalculator.pulls') }}
              </div>
            </v-expansion-panel-title>
            <v-divider />
            <v-expansion-panel-text>
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle
                    v-bind="beginnerSignInTask"
                    @click="beginnerSignInTask.active = !beginnerSignInTask.active"
                  />
                  <div style="height: 36px"></div>
                  <v-range-slider v-model="beginnerCheckInTaskRemainingDays"
                                  show-ticks="always"
                                  step="1"
                                  max="14"
                                  min="1"
                                  tick-size="4" thumb-label="always"
                                  hide-details="auto"
                                  strict
                                  class="v-range-slider">
                  </v-range-slider>
                  刻度在1表示第一日签到已完成，不再加入第一日
                </v-card-text>
              </v-card>
              <v-divider style="margin: 1rem 0"></v-divider>
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle
                    v-bind="authorityLevelUpReward"
                  />
                  <div style="height: 36px"></div>
                  <v-range-slider v-model="authorityLevelUpProgress"
                                  show-ticks="always"
                                  step="1"
                                  max="60"
                                  min="1"
                                  tick-size="4" thumb-label="always"
                                  hide-details="auto"
                                  class="v-range-slider">
                  </v-range-slider>
                </v-card-text>
              </v-card>
              <v-divider style="margin: 1rem 0"></v-divider>
              <v-card>
                <v-card-text>
                  <GachaCalculatorResourceSingle
                    v-bind="nodeReward"
                  />
                  <div style="height: 36px"></div>
                  <v-range-slider v-model="nodeRewardProgress"
                                  show-ticks="always"
                                  step="1"
                                  max="12"
                                  tick-size="4" thumb-label="always"
                                  hide-details="auto"
                                  class="v-range-slider">
                  </v-range-slider>
                  共计12节点，每节点750嵌晶玉
                </v-card-text>
              </v-card>
              <v-divider style="margin: 1rem 0"></v-divider>
              <GachaCalculatorModuleTitle title="权限等阶提升任务"></GachaCalculatorModuleTitle>
              <GachaCalculatorResourceSingleBtn
                v-for="item in authorityLevelTaskRewards"
                :key="item.id"
                v-bind="item"
                @click="item.active = !item.active"
              />

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
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1280px;
}

.gacha-calculator-container-left {
  width: 600px;
  margin: 1%;
}

.gacha-calculator-container-right {
  width: 600px;
  margin: 1%;
}

.gacha-calculator-card-title {
  font-size: var(--font-size-md);
  font-weight: bold;
  color: #333;
}

.gacha-calculator-statistical-result {
  display: flex;
  align-items: center;
}

.gacha-calculator-pie-chart {
  width: 300px;
  height: 240px;
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

</style>
