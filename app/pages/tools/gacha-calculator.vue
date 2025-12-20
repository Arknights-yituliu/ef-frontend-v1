<script setup lang="ts">
import type { PackContent } from '@/shared/types/pack';
import type { AllGachaResourceStatus, PieChartData } from '@/shared/types/gacha-calculator';
import { allGachaResourceStatus } from '@/shared/types/gacha-calculator';
const { t } = useI18n();
import { ref, onMounted, watch } from 'vue';

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
const pieChartData = ref<PieChartData[]>([
  { value: 22, name: '现有' },
  { value: 33, name: '潜在' },
  { value: 44, name: '日常' },
  { value: 22, name: '氪金' },
  { value: 33, name: '活动' },
  { value: 44, name: '其它' },
]);

// pieChartData.value[0].value = 1;

let myChart: any;

function setPieChart(data: PieChartData[]) {
  let option = {
    tooltip: {
      formatter: '{a} {b} : {c}抽,占 ({d}%)',
      position: 'inner',
    },

    series: [
      {
        name: '攒抽占比',
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
        setPieChart(pieChartData.value);
      });
    }
  },
);

onMounted(() => {
  myChart = echarts.init(document.getElementById('gacha-calculator-pie-chart'));
  setPieChart(pieChartData.value);
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
              {{ '共计' }}{{ allGachaResourceStatus.totalGachaResources }}{{ '抽，氪金'
              }}{{ allGachaResourceStatus.whaleAmount }}{{ '元' }}
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
                      <td>现有</td>
                      <td>{{ allGachaResourceStatus.existing.totalGachaResources }}</td>
                      <td>抽</td>
                    </tr>
                    <tr>
                      <td>日常</td>
                      <td>{{ allGachaResourceStatus.daily.totalGachaResources }}</td>
                      <td>抽</td>
                    </tr>
                    <tr>
                      <td>潜在</td>
                      <td>{{ allGachaResourceStatus.potential.totalGachaResources }}</td>
                      <td>抽</td>
                    </tr>
                    <tr>
                      <td>氪金</td>
                      <td>{{ allGachaResourceStatus.whale.totalGachaResources }}</td>
                      <td>抽</td>
                    </tr>
                    <tr>
                      <td>活动</td>
                      <td>{{ allGachaResourceStatus.activity.totalGachaResources }}</td>
                      <td>抽</td>
                    </tr>
                    <tr>
                      <td>其他</td>
                      <td>{{ allGachaResourceStatus.other.totalGachaResources }}</td>
                      <td>抽</td>
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
   td{
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
