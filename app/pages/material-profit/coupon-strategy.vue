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
        <v-icon class="mr-2">mdi-calendar-today</v-icon
        >{{ t('page.materialProfit.couponStrategy.todayStrategy') }}
        <v-spacer />
        <div
          class="d-flex align-center text-body-2 font-weight-semibold px-4 py-2 rounded-pill my-4"
          style="background: rgba(102, 126, 234, 0.1)"
        >
          <span class="text-body-2 text-medium-emphasis">{{
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
                <span class="text-h6 font-weight-bold">{{
                  t('page.materialProfit.couponStrategy.wuling')
                }}</span>
              </div>
              <div class="mb-5">
                <div class="strategy-item d-flex align-center ga-3 py-3 px-4 rounded-lg mb-3">
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
                <div class="strategy-item d-flex align-center ga-3 py-3 px-4 rounded-lg mb-3">
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
                <span class="text-h6 font-weight-bold">{{
                  t('page.materialProfit.couponStrategy.valleyIV')
                }}</span>
              </div>
              <div class="mb-5">
                <div class="strategy-item d-flex align-center ga-3 py-3 px-4 rounded-lg mb-3">
                  <v-icon class="flex-shrink-0" color="light-green">mdi-check-circle</v-icon>
                  <span class="text-body-2 font-weight-semibold text-medium-emphasis">{{
                    t('page.materialProfit.couponStrategy.lowestPriceBelow', {
                      price: valleyIVFirstPrices[currentDayIndex],
                    })
                  }}</span>
                  <span class="four-valley-success-text text-body-1 font-weight-bold">{{
                    t('page.materialProfit.couponStrategy.buyAll')
                  }}</span>
                </div>
                <div class="strategy-item d-flex align-center ga-3 py-3 px-4 rounded-lg mb-3">
                  <v-icon class="flex-shrink-0" color="lime">mdi-information</v-icon>
                  <span class="text-body-2 font-weight-semibold text-medium-emphasis">{{
                    t('page.materialProfit.couponStrategy.priceBetween', {
                      price1: valleyIVFirstPrices[currentDayIndex],
                      price2: valleyIVSecondPrices[currentDayIndex],
                    })
                  }}</span>
                  <span class="four-valley-info-text text-body-1 font-weight-bold">{{
                    t('page.materialProfit.couponStrategy.buyOneThirdQuota')
                  }}</span>
                </div>
                <div class="strategy-item d-flex align-center ga-3 py-3 px-4 rounded-lg mb-3">
                  <v-icon class="flex-shrink-0" color="amber">mdi-alert-circle</v-icon>
                  <span class="text-body-2 font-weight-semibold text-medium-emphasis">{{
                    t('page.materialProfit.couponStrategy.lowestPriceAbove', {
                      price: valleyIVSecondPrices[currentDayIndex],
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
                <span class="text-h6 font-weight-bold">{{
                  t('page.materialProfit.couponStrategy.wulingStrategyTable')
                }}</span>
              </div>
              <v-data-table
                density="compact"
                disable-sort
                :headers="wulingTableHeaders"
                hide-default-footer
                :items="wulingTableItems"
              >
                <template #item.weekday="{ item, index }">
                  <span :class="{ 'current-day': index === currentDayIndex }">{{
                    item.weekday
                  }}</span>
                </template>
                <template #item.buyAllPrice="{ item }">
                  <span class="wuling-buy-all">{{ item.buyAllPrice }}</span>
                </template>
                <template #item.buyHalfPrice="{ item }">
                  <span class="wuling-buy-just">{{ item.buyHalfPrice }}</span>
                </template>
              </v-data-table>
            </div>
          </v-col>

          <!-- 四号谷地速查表 -->
          <v-col cols="12" md="6">
            <div class="four-valley-region pa-4 border rounded-lg">
              <div class="region-header d-flex align-center mb-4 pb-3">
                <v-icon class="mr-2" color="light-green">mdi-map-marker</v-icon>
                <span class="text-h6 font-weight-bold">{{
                  t('page.materialProfit.couponStrategy.valleyIVStrategyTable')
                }}</span>
              </div>
              <v-data-table
                density="compact"
                disable-sort
                :headers="valleyIVTableHeaders"
                hide-default-footer
                :items="valleyIVTableItems"
              >
                <template #item.weekday="{ item, index }">
                  <span :class="{ 'current-day': index === currentDayIndex }">{{
                    item.weekday
                  }}</span>
                </template>
                <template #item.buyAllPrice="{ item }">
                  <span class="four-valley-buy-all">{{ item.buyAllPrice }}</span>
                </template>
                <template #item.buyOneThirdPrice="{ item }">
                  <span class="four-valley-buy-middle">{{ item.buyOneThirdPrice }}</span>
                </template>
                <template #item.buyTwoThirdsPrice="{ item }">
                  <span class="four-valley-buy-just">{{ item.buyTwoThirdsPrice }}</span>
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
import { useNow } from '@vueuse/core';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface TableHeader {
  title: string;
  key: string;
  align?: 'start' | 'center' | 'end';
  width?: string | number;
}

// 四号谷地第一组数据（周一-周日）
const valleyIVFirstPrices: number[] = [924, 864, 824, 793, 747, 816, 959];

// 四号谷地第二组数据（周一-周日）
const valleyIVSecondPrices: number[] = [1014, 1109, 917, 967, 870, 825, 1206];

// 武陵数据（周一-周日）
const wulingPrices: number[] = [1438, 1441, 1349, 1344, 1256, 1198, 1517];

const weekdayNames = computed(() => [
  t('common.weekday.monday'),
  t('common.weekday.tuesday'),
  t('common.weekday.wednesday'),
  t('common.weekday.thursday'),
  t('common.weekday.friday'),
  t('common.weekday.saturday'),
  t('common.weekday.sunday'),
]);

const wulingTableHeaders: ComputedRef<TableHeader[]> = computed(() => [
  {
    title: t('page.materialProfit.couponStrategy.weekday'),
    key: 'weekday',
    align: 'center',
  },
  {
    title: t('page.materialProfit.couponStrategy.buyAll'),
    key: 'buyAllPrice',
    align: 'center',
  },
  {
    title: t('page.materialProfit.couponStrategy.buyHalfQuota'),
    key: 'buyHalfPrice',
    align: 'center',
  },
]);

const valleyIVTableHeaders: ComputedRef<TableHeader[]> = computed(() => [
  {
    title: t('page.materialProfit.couponStrategy.weekday'),
    key: 'weekday',
    align: 'center',
  },
  {
    title: t('page.materialProfit.couponStrategy.buyAll'),
    key: 'buyAllPrice',
    align: 'center',
  },
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
]);

// 每秒更新一次的响应式当前时间
const now = useNow({ interval: 1000 });

// 根据凌晨4点刷新规则推算当前游戏日索引（周一=0，周日=6）
const currentDayIndex = computed<number>(() => {
  const adjusted = new Date(now.value);
  if (adjusted.getHours() < 4) {
    adjusted.setDate(adjusted.getDate() - 1);
  }
  const day = adjusted.getDay(); // 0=周日
  return day === 0 ? 6 : day - 1;
});

// 距离凌晨4点刷新的倒计时文本
const countdownText = computed<string>(() => {
  const target = new Date(now.value);
  target.setHours(4, 0, 0, 0);
  if (now.value.getHours() >= 4) {
    target.setDate(target.getDate() + 1);
  }
  const diff = Math.max(0, target.getTime() - now.value.getTime());
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
});

const valleyIVTableItems = computed(() => {
  return valleyIVFirstPrices.map((price, index) => ({
    weekday: weekdayNames.value[index],
    buyAllPrice: `< ${price}`,
    buyOneThirdPrice: `${price} ~ ${valleyIVSecondPrices[index]}`,
    buyTwoThirdsPrice: `> ${valleyIVSecondPrices[index]}`,
  }));
});

const wulingTableItems = computed(() => {
  return wulingPrices.map((price, index) => ({
    weekday: weekdayNames.value[index],
    buyAllPrice: `≤ ${price}`,
    buyHalfPrice: `> ${price}`,
  }));
});
</script>

<style scoped>
/* 策略卡片阴影与 hover 动效 */
.strategy-item {
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

.strategy-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

/* 武陵青蓝色主题 */
.wuling-region {
  border-color: rgba(0, 188, 212, 0.3) !important;
}

.wuling-region .region-header {
  border-bottom: 2px solid rgba(0, 188, 212, 0.3);
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
  border-bottom: 2px solid rgba(139, 195, 74, 0.3);
}

.four-valley-success-text {
  color: #72a03d;
}

.four-valley-info-text {
  color: #a2ae2e;
}

.four-valley-warning-text {
  color: #cd9b06;
}

.four-valley-buy-all {
  color: #72a03d;
  font-weight: 600;
}

.four-valley-buy-middle {
  color: #a2ae2e;
  font-weight: 600;
}

.four-valley-buy-just {
  color: #cd9b06;
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

[data-theme='dark'] .strategy-item {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
[data-theme='dark'] .four-valley-success-text {
  color: #9ccc65;
}
[data-theme='dark'] .four-valley-info-text {
  color: #d0e157;
}
[data-theme='dark'] .four-valley-warning-text {
  color: #ffb74d;
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
