<script setup lang="ts">
import type { PackContent } from '@/shared/types/pack';
import type {
  AllGachaResource,
  GachaResourceStatisticsResult,
  PieChartData,
} from '@/shared/types/gacha-calculator';
import { allGachaResource, gachaResourceStatisticsResult } from '@/shared/types/gacha-calculator';
import { ref, onMounted, watch, computed, nextTick } from 'vue';

const { t } = useI18n();

const leftPartPanel = ref<string[]>(['statisticalResult', 'existing']);
const rightPartPanel = ref<string[]>(['statisticalResult', 'existing']);

/**
 * 计算排期开始与结束日期的天数差
 * @param {Date|string|number} startDate 开始日期
 * @param {Date|string|number} endDate 结束日期
 * @returns {number} 俩个日期之间的天数差
 */
function calculateDaysDifference(
  startDate: Date | string | number,
  endDate: Date | string | number,
) {
  // 转换为时间戳
  const startTimestamp = typeof startDate === 'number' ? startDate : new Date(startDate).getTime();
  const endTimestamp = typeof endDate === 'number' ? endDate : new Date(endDate).getTime();
  // 计算天数差
  const daysDifference = (endTimestamp - startTimestamp) / (1000 * 60 * 60 * 24);
  return daysDifference;
}

//饼图的数据
const pieChartData = computed(() => [
  { value: 22, name: t('page.tools.gachaCalculator.existing') },
  { value: 33, name: t('page.tools.gachaCalculator.potential') },
  { value: 44, name: t('page.tools.gachaCalculator.daily') },
  { value: 22, name: t('page.tools.gachaCalculator.recharge') },
  { value: 33, name: t('page.tools.gachaCalculator.activity') },
  { value: 44, name: t('page.tools.gachaCalculator.other') },
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
          percent: param.percent || 0,
        });
      },
      position: 'inner',
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
        setPieChart(pieChartData.value as PieChartData[]);
      });
    }
  },
);

onMounted(() => {
  myChart = echarts.init(document.getElementById('gacha-calculator-pie-chart'));
  setPieChart(pieChartData.value as PieChartData[]);
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
                {{ t('page.tools.gachaCalculator.total')
                }}{{ gachaResourceStatisticsResult.totalPulls.allResources
                }}{{ t('page.tools.gachaCalculator.pulls') }}，{{
                  t('page.tools.gachaCalculator.rechargeAmount')
                }}{{ gachaResourceStatisticsResult.rechargeAmount
                }}{{ t('page.tools.gachaCalculator.yuan') }}
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
                      <td>{{ gachaResourceStatisticsResult.totalPulls.existingResources }}</td>
                      <td>{{ t('page.tools.gachaCalculator.pulls') }}</td>
                    </tr>
                    <tr>
                      <td>{{ t('page.tools.gachaCalculator.daily') }}</td>
                      <td>{{ gachaResourceStatisticsResult.totalPulls.dailyResources }}</td>
                      <td>{{ t('page.tools.gachaCalculator.pulls') }}</td>
                    </tr>
                    <tr>
                      <td>{{ t('page.tools.gachaCalculator.potential') }}</td>
                      <td>{{ gachaResourceStatisticsResult.totalPulls.potentialResources }}</td>
                      <td>{{ t('page.tools.gachaCalculator.pulls') }}</td>
                    </tr>
                    <tr>
                      <td>{{ t('page.tools.gachaCalculator.recharge') }}</td>
                      <td>{{ gachaResourceStatisticsResult.totalPulls.rechargeResources }}</td>
                      <td>{{ t('page.tools.gachaCalculator.pulls') }}</td>
                    </tr>
                    <tr>
                      <td>{{ t('page.tools.gachaCalculator.activity') }}</td>
                      <td>{{ gachaResourceStatisticsResult.totalPulls.activityResources }}</td>
                      <td>{{ t('page.tools.gachaCalculator.pulls') }}</td>
                    </tr>
                    <tr>
                      <td>{{ t('page.tools.gachaCalculator.other') }}</td>
                      <td>{{ gachaResourceStatisticsResult.totalPulls.otherResources }}</td>
                      <td>{{ t('page.tools.gachaCalculator.pulls') }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <div class="gacha-calculator-container-right">
        <v-expansion-panels v-model="rightPartPanel" multiple>
          <v-expansion-panel value="existing">
            <v-expansion-panel-title>
              <div class="gacha-calculator-card-title">
                库存 {{ gachaResourceStatisticsResult.totalPulls.existingResources }}
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
                    density="compact"
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
                    density="compact"
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
                    density="compact"
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
                    density="compact"
                    variant="solo"
                    label="特许寻访凭证"
                  />
                </div>
              </div>
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
  width: 48%;
  margin: 1rem 0;
}

.gacha-calculator-container-right {
  width: 48%;
  margin: 1rem 0;
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
  width: 40px;
  height: 40px;
  margin: 0 12px 0 0;
}

@media screen and (max-width: 1080px) {
  .gacha-calculator-container {
    width: 100%;
  }

  .gacha-calculator-container-left {
    width: 99%;
  }

  .gacha-calculator-container-right {
    width: 99%;
  }
}

@media screen and (max-width: 600px) {
  .gacha-calculator-container {
    width: 100%;
  }

  .gacha-calculator-container-left {
    width: 99%;
  }

  .gacha-calculator-container-right {
    width: 99%;
  }
}
</style>
