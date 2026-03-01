<template>
  <v-container>
    <header class="page-title">
      {{ t('page.materialProfit.couponStrategy.title') }}
    </header>
    <p class="text-body-1 text-medium-emphasis mb-8">
      {{ t('page.materialProfit.couponStrategy.subtitle') }}
    </p>

    <!-- 第一个大卡片：今日最优策略 -->
    <v-card class="mb-4">
      <v-card-title>
        <v-icon class="mr-2">mdi-calendar-today</v-icon>
        {{ t('page.materialProfit.couponStrategy.todayStrategy') }}
        <v-spacer />
        <div
          class="d-flex align-center text-body-2 font-weight-semibold px-4 py-2 rounded-pill mr-4"
          style="background: rgba(102, 126, 234, 0.1)"
        >
          <span class="text-caption text-medium-emphasis mr-2">{{
            t('page.materialProfit.couponStrategy.refreshCountdown')
          }}</span>
          <v-icon class="mr-1" size="small">mdi-clock-outline</v-icon>
          <span>{{ countdownText }}</span>
        </div>
      </v-card-title>
      <v-card-text>
        <v-row>
          <!-- 武陵 -->
          <v-col cols="12" md="6">
            <div class="wuling-region pa-4 border rounded-lg">
              <div class="region-header d-flex align-center mb-4 pb-3">
                <v-icon class="mr-2" color="cyan">mdi-map-marker</v-icon>
                <span class="text-subtitle-1 font-weight-bold">{{
                  t('page.materialProfit.couponStrategy.wuling')
                }}</span>
              </div>
              <div class="mb-5">
                <div
                  class="strategy-item d-flex align-center ga-3 py-3 px-4 bg-surface rounded-lg mb-3"
                >
                  <v-icon class="flex-shrink-0" color="cyan">mdi-check-circle</v-icon>
                  <span class="text-body-2 font-weight-semibold text-medium-emphasis">{{
                    t('page.materialProfit.couponStrategy.lowestPriceBelow', {
                      price: wulingPrices[currentDayIndex],
                    })
                  }}</span>
                  <span class="wuling-success-text text-body-1 font-weight-bold">{{
                    t('page.materialProfit.couponStrategy.buyAll')
                  }}</span>
                </div>
                <div
                  class="strategy-item d-flex align-center ga-3 py-3 px-4 bg-surface rounded-lg mb-3"
                >
                  <v-icon class="flex-shrink-0" color="blue-grey">mdi-alert-circle</v-icon>
                  <span class="text-body-2 font-weight-semibold text-medium-emphasis">{{
                    t('page.materialProfit.couponStrategy.lowestPriceAbove', {
                      price: wulingPrices[currentDayIndex],
                    })
                  }}</span>
                  <span class="wuling-warning-text text-body-1 font-weight-bold">{{
                    t('page.materialProfit.couponStrategy.buyHalfQuota')
                  }}</span>
                </div>
              </div>
            </div>
          </v-col>

          <!-- 四号谷地 -->
          <v-col cols="12" md="6">
            <div class="four-valley-region pa-4 border rounded-lg">
              <div class="region-header d-flex align-center mb-4 pb-3">
                <v-icon class="mr-2" color="light-green">mdi-map-marker</v-icon>
                <span class="text-subtitle-1 font-weight-bold">{{
                  t('page.materialProfit.couponStrategy.fourValley')
                }}</span>
              </div>
              <div class="mb-5">
                <div
                  class="strategy-item d-flex align-center ga-3 py-3 px-4 bg-surface rounded-lg mb-3"
                >
                  <v-icon class="flex-shrink-0" color="light-green">mdi-check-circle</v-icon>
                  <span class="text-body-2 font-weight-semibold text-medium-emphasis">{{
                    t('page.materialProfit.couponStrategy.lowestPriceBelow', {
                      price: fourValleyFirstPrices[currentDayIndex],
                    })
                  }}</span>
                  <span class="four-valley-success-text text-body-1 font-weight-bold">{{
                    t('page.materialProfit.couponStrategy.buyAll')
                  }}</span>
                </div>
                <div
                  class="strategy-item d-flex align-center ga-3 py-3 px-4 bg-surface rounded-lg mb-3"
                >
                  <v-icon class="flex-shrink-0" color="lime">mdi-information</v-icon>
                  <span class="text-body-2 font-weight-semibold text-medium-emphasis">{{
                    t('page.materialProfit.couponStrategy.priceBetween', {
                      price1: fourValleyFirstPrices[currentDayIndex],
                      price2: fourValleySecondPrices[currentDayIndex],
                    })
                  }}</span>
                  <span class="four-valley-info-text text-body-1 font-weight-bold">{{
                    t('page.materialProfit.couponStrategy.buyOneThirdQuota')
                  }}</span>
                </div>
                <div
                  class="strategy-item d-flex align-center ga-3 py-3 px-4 bg-surface rounded-lg mb-3"
                >
                  <v-icon class="flex-shrink-0" color="amber">mdi-alert-circle</v-icon>
                  <span class="text-body-2 font-weight-semibold text-medium-emphasis">{{
                    t('page.materialProfit.couponStrategy.lowestPriceAbove', {
                      price: fourValleySecondPrices[currentDayIndex],
                    })
                  }}</span>
                  <span class="four-valley-warning-text text-body-1 font-weight-bold">{{
                    t('page.materialProfit.couponStrategy.buyTwoThirdsQuota')
                  }}</span>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 第二个大卡片：策略速查表 -->
    <v-card class="mb-4">
      <v-card-title class="text-h6">
        <v-icon class="mr-2">mdi-table</v-icon>
        {{ t('page.materialProfit.couponStrategy.strategyTable') }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <!-- 武陵速查表 -->
          <v-col cols="12" md="6">
            <div class="wuling-region pa-4 border rounded-lg">
              <div class="region-header d-flex align-center mb-4 pb-3">
                <v-icon class="mr-2" color="cyan">mdi-map-marker</v-icon>
                <span class="text-subtitle-1 font-weight-bold">{{
                  t('page.materialProfit.couponStrategy.wulingStrategyTable')
                }}</span>
              </div>
              <v-data-table
                class="elevation-0"
                density="compact"
                :headers="wulingTableHeaders"
                hide-default-footer
                :items="wulingTableItems"
              >
                <template #item.weekday="{ item }">
                  <span :class="{ 'current-day': item.isCurrentDay }">{{ item.weekday }}</span>
                </template>
                <template #item.buyAllPrice="{ item }">
                  <span class="wuling-buy-all" v-html="item.buyAllPrice"></span>
                </template>
                <template #item.buyHalfPrice="{ item }">
                  <span class="wuling-buy-just" v-html="item.buyHalfPrice"></span>
                </template>
              </v-data-table>
            </div>
          </v-col>

          <!-- 四号谷地速查表 -->
          <v-col cols="12" md="6">
            <div class="four-valley-region pa-4 border rounded-lg">
              <div class="region-header d-flex align-center mb-4 pb-3">
                <v-icon class="mr-2" color="light-green">mdi-map-marker</v-icon>
                <span class="text-subtitle-1 font-weight-bold">{{
                  t('page.materialProfit.couponStrategy.fourValleyStrategyTable')
                }}</span>
              </div>
              <v-data-table
                class="elevation-0"
                density="compact"
                :headers="fourValleyTableHeaders"
                hide-default-footer
                :items="fourValleyTableItems"
              >
                <template #item.weekday="{ item }">
                  <span :class="{ 'current-day': item.isCurrentDay }">{{ item.weekday }}</span>
                </template>
                <template #item.buyAllPrice="{ item }">
                  <span class="four-valley-buy-all" v-html="item.buyAllPrice"></span>
                </template>
                <template #item.buyOneThirdPrice="{ item }">
                  <span class="four-valley-buy-middle" v-html="item.buyOneThirdPrice"></span>
                </template>
                <template #item.buyTwoThirdsPrice="{ item }">
                  <span class="four-valley-buy-just" v-html="item.buyTwoThirdsPrice"></span>
                </template>
              </v-data-table>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface TableHeader {
  title: string;
  key: string;
  align?: 'start' | 'center' | 'end';
  width?: string | number;
}

// 四号谷地第一组数据（周一-周日）
const fourValleyFirstPrices: number[] = [924, 864, 824, 793, 747, 816, 959];

// 四号谷地第二组数据（周一-周日）
const fourValleySecondPrices: number[] = [1014, 1109, 917, 967, 870, 825, 1206];

// 武陵数据（周一-周日）
const wulingPrices: number[] = [1438, 1441, 1349, 1344, 1256, 1198, 1517];

const wulingTableHeaders: TableHeader[] = [
  { title: t('page.materialProfit.couponStrategy.weekday'), key: 'weekday', align: 'center' },
  { title: t('page.materialProfit.couponStrategy.buyAll'), key: 'buyAllPrice', align: 'center' },
  {
    title: t('page.materialProfit.couponStrategy.buyHalfQuota'),
    key: 'buyHalfPrice',
    align: 'center',
  },
];

const fourValleyTableHeaders: TableHeader[] = [
  { title: t('page.materialProfit.couponStrategy.weekday'), key: 'weekday', align: 'center' },
  { title: t('page.materialProfit.couponStrategy.buyAll'), key: 'buyAllPrice', align: 'center' },
  {
    title: t('page.materialProfit.couponStrategy.buyOneThirdQuota'),
    key: 'buyOneThirdPrice',
    align: 'center',
  },
  {
    title: t('page.materialProfit.couponStrategy.buyTwoThirdsQuota'),
    key: 'buyTwoThirdsPrice',
    align: 'center',
  },
];

const currentDayIndex = ref<number>(0);
const countdown = ref<number>(0);
const countdownText = ref<string>('--:--:--');
let countdownInterval: NodeJS.Timeout | null = null;

// 缓存当前日期字符串，避免不必要的更新
let lastCheckedDate = '';

// 四号谷地表格数据（静态，固定顺序）
const fourValleyTableItems = [
  {
    weekday: '周一',
    buyAllPrice: '< 924',
    buyOneThirdPrice: '924 - 1014',
    buyTwoThirdsPrice: '> 1014',
    isCurrentDay: false,
  },
  {
    weekday: '周二',
    buyAllPrice: '< 864',
    buyOneThirdPrice: '864 - 1109',
    buyTwoThirdsPrice: '> 1109',
    isCurrentDay: false,
  },
  {
    weekday: '周三',
    buyAllPrice: '< 824',
    buyOneThirdPrice: '824 - 917',
    buyTwoThirdsPrice: '> 917',
    isCurrentDay: false,
  },
  {
    weekday: '周四',
    buyAllPrice: '< 793',
    buyOneThirdPrice: '793 - 967',
    buyTwoThirdsPrice: '> 967',
    isCurrentDay: false,
  },
  {
    weekday: '周五',
    buyAllPrice: '< 747',
    buyOneThirdPrice: '747 - 870',
    buyTwoThirdsPrice: '> 870',
    isCurrentDay: false,
  },
  {
    weekday: '周六',
    buyAllPrice: '< 816',
    buyOneThirdPrice: '816 - 825',
    buyTwoThirdsPrice: '> 825',
    isCurrentDay: false,
  },
  {
    weekday: '周日',
    buyAllPrice: '< 959',
    buyOneThirdPrice: '959 - 1206',
    buyTwoThirdsPrice: '> 1206',
    isCurrentDay: false,
  },
];

// 武陵表格数据（静态，固定顺序）
const wulingTableItems = [
  { weekday: '周一', buyAllPrice: '≤ 1438', buyHalfPrice: '> 1438', isCurrentDay: false },
  { weekday: '周二', buyAllPrice: '≤ 1441', buyHalfPrice: '> 1441', isCurrentDay: false },
  { weekday: '周三', buyAllPrice: '≤ 1349', buyHalfPrice: '> 1349', isCurrentDay: false },
  { weekday: '周四', buyAllPrice: '≤ 1344', buyHalfPrice: '> 1344', isCurrentDay: false },
  { weekday: '周五', buyAllPrice: '≤ 1256', buyHalfPrice: '> 1256', isCurrentDay: false },
  { weekday: '周六', buyAllPrice: '≤ 1198', buyHalfPrice: '> 1198', isCurrentDay: false },
  { weekday: '周日', buyAllPrice: '≤ 1517', buyHalfPrice: '> 1517', isCurrentDay: false },
];

// 更新表格中当前日期的高亮
function updateCurrentDayHighlight(): void {
  for (const [index, item] of fourValleyTableItems.entries()) {
    item.isCurrentDay = index === currentDayIndex.value;
  }
  for (const [index, item] of wulingTableItems.entries()) {
    item.isCurrentDay = index === currentDayIndex.value;
  }
}

// 获取今天是星期几（考虑凌晨4点刷新）
function getCurrentDayIndex(): void {
  const now = new Date();
  const hour = now.getHours();

  // 商店凌晨4点刷新，0-3点算前一天
  const adjustedDate = new Date(now);
  if (hour < 4) {
    adjustedDate.setDate(adjustedDate.getDate() - 1);
  }

  // 生成日期字符串用于缓存比较
  const dateStr = `${adjustedDate.getFullYear()}-${adjustedDate.getMonth()}-${adjustedDate.getDate()}`;

  // 如果日期没有变化，不执行更新
  if (dateStr === lastCheckedDate) {
    return;
  }

  lastCheckedDate = dateStr;

  const day = adjustedDate.getDay(); // 0-6, 0是周日
  // 转换为周一-周日（周一=0, 周日=6）
  const adjustedDay = day === 0 ? 6 : day - 1;
  currentDayIndex.value = adjustedDay;

  // 更新表格高亮
  updateCurrentDayHighlight();
}

// 计算距离下一次刷新的时间（凌晨4点）
function updateCountdown(): void {
  const now = new Date();
  const hour = now.getHours();

  // 计算目标时间：凌晨4点
  const targetDate = new Date(now);
  targetDate.setHours(4, 0, 0, 0);

  // 如果当前时间已经过了今天4点，则计算到明天4点
  if (hour >= 4) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  const diff = targetDate.getTime() - now.getTime();
  countdown.value = Math.max(0, diff);

  // 格式化时间
  const hours = Math.floor(countdown.value / (1000 * 60 * 60));
  const minutes = Math.floor((countdown.value % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countdown.value % (1000 * 60)) / 1000);

  countdownText.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 启动倒计时
function startCountdown(): void {
  updateCountdown();
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  // 优化：只更新倒计时，定期检查日期变化
  countdownInterval = setInterval(() => {
    updateCountdown();
    // 每10秒检查一次是否需要更新星期，而不是每秒都检查
    const now = new Date();
    if (now.getSeconds() % 10 === 0) {
      getCurrentDayIndex();
    }
  }, 1000);
}

onMounted(() => {
  getCurrentDayIndex();
  startCountdown();
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<style scoped>
/* region-header 底部分割线，颜色由区域主题覆盖 */
.region-header {
  border-bottom: 2px solid #e0e0e0;
}

/* 策略卡片阴影与 hover 动效 */
.strategy-item {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.strategy-item:hover {
  transform: translateX(4px);
}

/* 武陵青蓝色主题 */
.wuling-region {
  border-color: rgba(0, 188, 212, 0.3) !important;
}

.wuling-region .region-header {
  border-color: rgba(0, 188, 212, 0.3);
}

.wuling-success-text {
  color: #00bcd4;
}

.wuling-warning-text {
  color: #607d8b;
}

.wuling-buy-all {
  color: #00bcd4;
  font-weight: 600;
}

.wuling-buy-just {
  color: #607d8b;
  font-weight: 600;
}

/* 四号谷地黄绿色主题 */
.four-valley-region {
  border-color: rgba(139, 195, 74, 0.3) !important;
}

.four-valley-region .region-header {
  border-color: rgba(139, 195, 74, 0.3);
}

.four-valley-success-text {
  color: #8bc34a;
}

.four-valley-info-text {
  color: #cddc39;
}

.four-valley-warning-text {
  color: #ffc107;
}

.four-valley-buy-all {
  color: #8bc34a;
  font-weight: 600;
}

.four-valley-buy-middle {
  color: #cddc39;
  font-weight: 600;
}

.four-valley-buy-just {
  color: #ffc107;
  font-weight: 600;
}

/* 表格单元格样式 */
:deep(.v-data-table__td) {
  font-size: 0.9rem;
}

:deep(.v-data-table__th) {
  font-weight: 600;
  font-size: 0.95rem;
}

/* 隐藏排序图标 */
:deep(.v-data-table__th .v-data-table-header__content .v-data-table-header__sort-icon) {
  display: none !important;
}

.current-day {
  font-weight: 700;
  color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  padding: 4px 8px;
  border-radius: 4px;
}

@media (prefers-color-scheme: dark) {
  .region-header {
    border-color: rgba(255, 255, 255, 0.1);
  }

  .strategy-item {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .wuling-buy-all {
    color: #26c6da;
  }
  .wuling-buy-just {
    color: #78909c;
  }
  .four-valley-buy-all {
    color: #9ccc65;
  }
  .four-valley-buy-middle {
    color: #d0e157;
  }
  .four-valley-buy-just {
    color: #ffb74d;
  }
}

[data-theme='dark'] .region-header {
  border-color: rgba(255, 255, 255, 0.1);
}

[data-theme='dark'] .strategy-item {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

[data-theme='dark'] .wuling-buy-all {
  color: #26c6da;
}
[data-theme='dark'] .wuling-buy-just {
  color: #78909c;
}
[data-theme='dark'] .four-valley-buy-all {
  color: #9ccc65;
}
[data-theme='dark'] .four-valley-buy-middle {
  color: #d0e157;
}
[data-theme='dark'] .four-valley-buy-just {
  color: #ffb74d;
}
</style>
