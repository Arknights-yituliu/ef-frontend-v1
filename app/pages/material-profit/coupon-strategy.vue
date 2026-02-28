<template>
  <div class="coupon-strategy-page">
    <CustomBackground />
    <div class="content">
      <header class="page-title">{{ t('page.materialProfit.couponStrategy.title') }}</header>
      <p class="page-subtitle">{{ t('page.materialProfit.couponStrategy.subtitle') }}</p>

      <!-- 第一个大卡片：今日最优策略 -->
      <v-card class="mb-4">
        <v-card-title class="text-h6">
          <v-icon class="mr-2">mdi-calendar-today</v-icon>
          {{ t('page.materialProfit.couponStrategy.todayStrategy') }}
          <v-spacer />
          <div class="refresh-countdown mr-4">
            <span class="countdown-label mr-2">{{ t('page.materialProfit.couponStrategy.refreshCountdown') }}</span>
            <v-icon class="mr-1" size="small">mdi-clock-outline</v-icon>
            <span>{{ countdownText }}</span>
          </div>
        </v-card-title>
        <v-card-text>
          <v-row>
            <!-- 武陵 -->
            <v-col cols="12" md="6">
              <div class="region-section wuling-region">
                <div class="region-header">
                  <v-icon class="mr-2" color="cyan">mdi-map-marker</v-icon>
                  <span class="region-title">{{ t('page.materialProfit.couponStrategy.wuling') }}</span>
                </div>
                <div class="strategy-display">
                  <div class="strategy-item">
                    <v-icon class="strategy-icon" color="cyan">mdi-check-circle</v-icon>
                    <span class="strategy-label">{{ t('page.materialProfit.couponStrategy.lowestPriceBelow', { price: wulingPrices[currentDayIndex] }) }}</span>
                    <span class="strategy-value wuling-success-text">{{ t('page.materialProfit.couponStrategy.buyAll') }}</span>
                  </div>
                  <div class="strategy-item">
                    <v-icon class="strategy-icon" color="blue-grey">mdi-alert-circle</v-icon>
                    <span class="strategy-label">{{ t('page.materialProfit.couponStrategy.lowestPriceAbove', { price: wulingPrices[currentDayIndex] }) }}</span>
                    <span class="strategy-value wuling-warning-text">{{ t('page.materialProfit.couponStrategy.buyHalfQuota') }}</span>
                  </div>
                </div>
              </div>
            </v-col>

            <!-- 四号谷地 -->
            <v-col cols="12" md="6">
              <div class="region-section four-valley-region">
                <div class="region-header">
                  <v-icon class="mr-2" color="light-green">mdi-map-marker</v-icon>
                  <span class="region-title">{{ t('page.materialProfit.couponStrategy.fourValley') }}</span>
                </div>
                <div class="strategy-display">
                  <div class="strategy-item">
                    <v-icon class="strategy-icon" color="light-green">mdi-check-circle</v-icon>
                    <span class="strategy-label">{{ t('page.materialProfit.couponStrategy.lowestPriceBelow', { price: fourValleyFirstPrices[currentDayIndex] }) }}</span>
                    <span class="strategy-value four-valley-success-text">{{ t('page.materialProfit.couponStrategy.buyAll') }}</span>
                  </div>
                  <div class="strategy-item">
                    <v-icon class="strategy-icon" color="lime">mdi-information</v-icon>
                    <span class="strategy-label">{{ t('page.materialProfit.couponStrategy.priceBetween', { price1: fourValleyFirstPrices[currentDayIndex], price2: fourValleySecondPrices[currentDayIndex] }) }}</span>
                    <span class="strategy-value four-valley-info-text">{{ t('page.materialProfit.couponStrategy.buyOneThirdQuota') }}</span>
                  </div>
                  <div class="strategy-item">
                    <v-icon class="strategy-icon" color="amber">mdi-alert-circle</v-icon>
                    <span class="strategy-label">{{ t('page.materialProfit.couponStrategy.lowestPriceAbove', { price: fourValleySecondPrices[currentDayIndex] }) }}</span>
                    <span class="strategy-value four-valley-warning-text">{{ t('page.materialProfit.couponStrategy.buyTwoThirdsQuota') }}</span>
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
              <div class="table-section wuling-region">
                <div class="region-header">
                  <v-icon class="mr-2" color="cyan">mdi-map-marker</v-icon>
                  <span class="region-title">{{ t('page.materialProfit.couponStrategy.wulingStrategyTable') }}</span>
                </div>
                <v-data-table
                  :headers="wulingTableHeaders"
                  :items="wulingTableItems"
                  class="elevation-0"
                  density="compact"
                  hide-default-footer
                >
                  <template v-slot:item.weekday="{ item }">
                    <span :class="{ 'current-day': item.isCurrentDay }">{{ item.weekday }}</span>
                  </template>
                  <template v-slot:item.buyAllPrice="{ item }">
                    <span class="wuling-buy-all" v-html="item.buyAllPrice"></span>
                  </template>
                  <template v-slot:item.buyHalfPrice="{ item }">
                    <span class="wuling-buy-just" v-html="item.buyHalfPrice"></span>
                  </template>
                </v-data-table>
              </div>
            </v-col>

            <!-- 四号谷地速查表 -->
            <v-col cols="12" md="6">
              <div class="table-section four-valley-region">
                <div class="region-header">
                  <v-icon class="mr-2" color="light-green">mdi-map-marker</v-icon>
                  <span class="region-title">{{ t('page.materialProfit.couponStrategy.fourValleyStrategyTable') }}</span>
                </div>
                <v-data-table
                  :headers="fourValleyTableHeaders"
                  :items="fourValleyTableItems"
                  class="elevation-0"
                  density="compact"
                  hide-default-footer
                >
                  <template v-slot:item.weekday="{ item }">
                    <span :class="{ 'current-day': item.isCurrentDay }">{{ item.weekday }}</span>
                  </template>
                  <template v-slot:item.buyAllPrice="{ item }">
                    <span class="four-valley-buy-all" v-html="item.buyAllPrice"></span>
                  </template>
                  <template v-slot:item.buyOneThirdPrice="{ item }">
                    <span class="four-valley-buy-middle" v-html="item.buyOneThirdPrice"></span>
                  </template>
                  <template v-slot:item.buyTwoThirdsPrice="{ item }">
                    <span class="four-valley-buy-just" v-html="item.buyTwoThirdsPrice"></span>
                  </template>
                </v-data-table>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import CustomBackground from '~/components/layout/CustomBackground.vue';

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
  { title: t('page.materialProfit.couponStrategy.buyHalfQuota'), key: 'buyHalfPrice', align: 'center' },
];

const fourValleyTableHeaders: TableHeader[] = [
  { title: t('page.materialProfit.couponStrategy.weekday'), key: 'weekday', align: 'center' },
  { title: t('page.materialProfit.couponStrategy.buyAll'), key: 'buyAllPrice', align: 'center' },
  { title: t('page.materialProfit.couponStrategy.buyOneThirdQuota'), key: 'buyOneThirdPrice', align: 'center' },
  { title: t('page.materialProfit.couponStrategy.buyTwoThirdsQuota'), key: 'buyTwoThirdsPrice', align: 'center' },
];

const currentDayIndex = ref<number>(0);
const countdown = ref<number>(0);
const countdownText = ref<string>('--:--:--');
let countdownInterval: NodeJS.Timeout | null = null;

// 缓存当前日期字符串，避免不必要的更新
let lastCheckedDate = '';

// 四号谷地表格数据（静态，固定顺序）
const fourValleyTableItems = [
  { weekday: '周一', buyAllPrice: '< 924', buyOneThirdPrice: '924 - 1014', buyTwoThirdsPrice: '> 1014', isCurrentDay: false },
  { weekday: '周二', buyAllPrice: '< 864', buyOneThirdPrice: '864 - 1109', buyTwoThirdsPrice: '> 1109', isCurrentDay: false },
  { weekday: '周三', buyAllPrice: '< 824', buyOneThirdPrice: '824 - 917', buyTwoThirdsPrice: '> 917', isCurrentDay: false },
  { weekday: '周四', buyAllPrice: '< 793', buyOneThirdPrice: '793 - 967', buyTwoThirdsPrice: '> 967', isCurrentDay: false },
  { weekday: '周五', buyAllPrice: '< 747', buyOneThirdPrice: '747 - 870', buyTwoThirdsPrice: '> 870', isCurrentDay: false },
  { weekday: '周六', buyAllPrice: '< 816', buyOneThirdPrice: '816 - 825', buyTwoThirdsPrice: '> 825', isCurrentDay: false },
  { weekday: '周日', buyAllPrice: '< 959', buyOneThirdPrice: '959 - 1206', buyTwoThirdsPrice: '> 1206', isCurrentDay: false },
];

// 武陵表格数据（静态，固定顺序）
const wulingTableItems = [
  { weekday: '周一', buyAllPrice: '< 1438', buyHalfPrice: '> 1438', isCurrentDay: false },
  { weekday: '周二', buyAllPrice: '< 1441', buyHalfPrice: '> 1441', isCurrentDay: false },
  { weekday: '周三', buyAllPrice: '< 1349', buyHalfPrice: '> 1349', isCurrentDay: false },
  { weekday: '周四', buyAllPrice: '< 1344', buyHalfPrice: '> 1344', isCurrentDay: false },
  { weekday: '周五', buyAllPrice: '< 1256', buyHalfPrice: '> 1256', isCurrentDay: false },
  { weekday: '周六', buyAllPrice: '< 1198', buyHalfPrice: '> 1198', isCurrentDay: false },
  { weekday: '周日', buyAllPrice: '< 1517', buyHalfPrice: '> 1517', isCurrentDay: false },
];

// 更新表格中当前日期的高亮
function updateCurrentDayHighlight(): void {
  fourValleyTableItems.forEach((item, index) => {
    item.isCurrentDay = index === currentDayIndex.value;
  });
  wulingTableItems.forEach((item, index) => {
    item.isCurrentDay = index === currentDayIndex.value;
  });
}

// 获取今天是星期几（考虑凌晨4点刷新）
function getCurrentDayIndex(): void {
  const now = new Date();
  const hour = now.getHours();
  
  // 商店凌晨4点刷新，0-3点算前一天
  let adjustedDate = new Date(now);
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
.coupon-strategy-page {
  position: relative;
  z-index: 1;
}

.content {
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #333;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.region-section,
.table-section {
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

.region-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e0e0e0;
}

.region-title {
  font-size: 1.3rem;
  font-weight: 700;
}

.strategy-display {
  margin-bottom: 20px;
}

.strategy-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.strategy-item:hover {
  background: #f5f5f5;
  transform: translateX(4px);
}

.strategy-icon {
  flex-shrink: 0;
}

.strategy-label {
  font-size: 1rem;
  color: #666;
  font-weight: 600;
}

.strategy-value {
  font-size: 1.1rem;
  font-weight: 700;
}

/* 武陵青蓝色主题 */
.wuling-region {
  border-color: rgba(0, 188, 212, 0.3);
}

.wuling-region .region-header {
  border-color: rgba(0, 188, 212, 0.3);
}

.wuling-success-text {
  color: #00bcd4;
  font-weight: 700;
}

.wuling-warning-text {
  color: #607d8b;
  font-weight: 700;
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
  border-color: rgba(139, 195, 74, 0.3);
}

.four-valley-region .region-header {
  border-color: rgba(139, 195, 74, 0.3);
}

.four-valley-success-text {
  color: #8bc34a;
  font-weight: 700;
}

.four-valley-info-text {
  color: #cddc39;
  font-weight: 700;
}

.four-valley-warning-text {
  color: #ffc107;
  font-weight: 700;
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

.refresh-countdown {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  color: #666;
  background: rgba(102, 126, 234, 0.1);
  padding: 6px 16px;
  border-radius: 16px;
  font-weight: 600;
}

.countdown-label {
  font-size: 0.9rem;
  color: #666;
}

@media (prefers-color-scheme: dark) {
  .page-title {
    color: #e0e0e0;
  }

  .page-subtitle {
    color: #b0b0b0;
  }

  .region-section,
  .table-section {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .region-header {
    border-color: rgba(255, 255, 255, 0.1);
  }

  .strategy-item {
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .strategy-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .strategy-label {
    color: #b0b0b0;
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

  .refresh-countdown {
    color: #b0b0b0;
    background: rgba(255, 255, 255, 0.1);
  }

  .countdown-label {
    color: #b0b0b0;
  }
}

[data-theme='dark'] .page-title {
  color: #e0e0e0;
}

[data-theme='dark'] .page-subtitle {
  color: #b0b0b0;
}

[data-theme='dark'] .region-section,
[data-theme='dark'] .table-section {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}

[data-theme='dark'] .region-header {
  border-color: rgba(255, 255, 255, 0.1);
}

[data-theme='dark'] .strategy-item {
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

[data-theme='dark'] .strategy-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

[data-theme='dark'] .strategy-label {
  color: #b0b0b0;
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

[data-theme='dark'] .refresh-countdown {
  color: #b0b0b0;
  background: rgba(255, 255, 255, 0.1);
}

[data-theme='dark'] .countdown-label {
  color: #b0b0b0;
}
</style>