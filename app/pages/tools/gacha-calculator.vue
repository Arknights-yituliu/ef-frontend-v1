<script setup lang="ts">
import type { PackContent } from '@/shared/types/pack';
import type { AllGachaResourceStatus, PieChartData } from '@/shared/types/gacha-calculator';
import { allGachaResourceStatus } from '@/shared/types/gacha-calculator';
const { t } = useI18n();
import { ref, onMounted, watch, computed, nextTick } from 'vue';

let panel = ref<string[]>(['statisticalResult']);

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
  { value: 22, name: t('page.tools.gachaCalculator.whale') },
  { value: 33, name: t('page.tools.gachaCalculator.activity') },
  { value: 44, name: t('page.tools.gachaCalculator.other') },
]);

// pieChartData.value[0].value = 1;

let myChart: any;

function setPieChart(data: PieChartData[]) {
  let option = {
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
  () => panel.value,
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
  <header class="page-title">{{ t('page.tools.gachaCalculator.title') }}</header>
  <p>{{ t('page.tools.gachaCalculator.underDevelopment') }}</p>
  {{ panel }}
  <section class="gacha-calculator-container">
    <div class="gacha-calculator-container-left">
      <v-expansion-panels v-model="panel" multiple>
        <v-expansion-panel value="statisticalResult">
          <v-expansion-panel-title>
            <div class="gacha-calculator-card-title">
              {{ t('page.tools.gachaCalculator.total')
              }}{{ allGachaResourceStatus.totalGachaResources
              }}{{ t('page.tools.gachaCalculator.pulls') }}，{{
                t('page.tools.gachaCalculator.whaleAmount')
              }}{{ allGachaResourceStatus.whaleAmount }}{{ t('page.tools.gachaCalculator.yuan') }}
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="gacha-calculator-statistical-result">
              <div
                class="gacha-calculator-pie-chart"
                id="gacha-calculator-pie-chart"
                ref="gacha-calculator-pie-chart"
              ></div>

              <table class="gacha-calculator-resource-table">
                <tbody>
                  <tr>
                    <td>{{ t('page.tools.gachaCalculator.existing') }}</td>
                    <td>{{ allGachaResourceStatus.existing.totalGachaResources }}</td>
                    <td>{{ t('page.tools.gachaCalculator.pulls') }}</td>
                  </tr>
                  <tr>
                    <td>{{ t('page.tools.gachaCalculator.daily') }}</td>
                    <td>{{ allGachaResourceStatus.daily.totalGachaResources }}</td>
                    <td>{{ t('page.tools.gachaCalculator.pulls') }}</td>
                  </tr>
                  <tr>
                    <td>{{ t('page.tools.gachaCalculator.potential') }}</td>
                    <td>{{ allGachaResourceStatus.potential.totalGachaResources }}</td>
                    <td>{{ t('page.tools.gachaCalculator.pulls') }}</td>
                  </tr>
                  <tr>
                    <td>{{ t('page.tools.gachaCalculator.whale') }}</td>
                    <td>{{ allGachaResourceStatus.whale.totalGachaResources }}</td>
                    <td>{{ t('page.tools.gachaCalculator.pulls') }}</td>
                  </tr>
                  <tr>
                    <td>{{ t('page.tools.gachaCalculator.activity') }}</td>
                    <td>{{ allGachaResourceStatus.activity.totalGachaResources }}</td>
                    <td>{{ t('page.tools.gachaCalculator.pulls') }}</td>
                  </tr>
                  <tr>
                    <td>{{ t('page.tools.gachaCalculator.other') }}</td>
                    <td>{{ allGachaResourceStatus.other.totalGachaResources }}</td>
                    <td>{{ t('page.tools.gachaCalculator.pulls') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div class="gacha-calculator-container-right"></div>
  </section>
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
}
.gacha-calculator-container-right {
  width: 48%;
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
