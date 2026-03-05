<template>
  <div class="coupon-strategy-page">
    <CustomBackground />
    <div class="content">
      <div class="page-title">{{ t('page.materialProfit.couponStrategy.title') }}</div>
      <div class="page-subtitle">{{ t('page.materialProfit.couponStrategy.subtitle') }}</div>

      <!-- 使用说明模块 -->
      <v-card class="mb-4">
        <v-card-text>
          <div class="explanation-section">
            <div class="explanation-title">
              <v-icon class="mr-2" color="primary">mdi-information</v-icon>
              {{ t('page.materialProfit.couponStrategy.explanation.title') }}
            </div>
            <div class="explanation-items">
              <div class="explanation-item">
                <v-icon class="explanation-icon" color="blue-grey darken-1">mdi-information</v-icon>
                <span class="explanation-text">通过合理规划购买策略，可以降低弹性需求物资的购买成本，提高调度券的收入，本页面用于查询不同价格下应采取的策略</span>
              </div>
              <div class="explanation-item">
                <v-icon class="explanation-icon" color="blue-grey darken-1">mdi-calendar</v-icon>
                <span class="explanation-text">{{ t('page.materialProfit.couponStrategy.explanation.priceFluctuation')
                }}</span>
              </div>
              <div class="explanation-item">
                <v-icon class="explanation-icon" color="blue-grey darken-1">mdi-clock-outline</v-icon>
                <span class="explanation-text">{{ t('page.materialProfit.couponStrategy.refreshCountdown') }}{{
                  countdownText }}</span>
              </div>
              <div class="explanation-item">
                <v-icon class="explanation-icon" color="blue-grey darken-1">mdi-trending-up</v-icon>
                <span class="explanation-text">{{ t('page.materialProfit.couponStrategy.explanation.correctionValue')
                }}</span>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- 武陵 -->
      <v-card class="mb-4">
        <v-card-title class="text-h6">
          <v-icon class="mr-2" color="cyan">mdi-map-marker</v-icon>
          <span class="region-title">{{ t('page.materialProfit.couponStrategy.wuling') }}</span>
          <v-spacer />
        </v-card-title>
        <v-card-text>
          <div class="goods-cards-grid wuling-cards-grid">
            <div v-for="(item, index) in wulingGoodsItems" :key="`wuling-${index}`" class="goods-card">
              <div class="goods-card-content">
                <!-- 图片文字区 -->
                <div class="goods-card-left">
                  <div class="goods-card-image-wrapper">
                    <img :alt="item.name" class="goods-card-image" :src="item.imageUrl" @error="handleImageError" />
                  </div>
                  <div class="goods-card-name">
                    <div class="name-decoration wuling-decoration"></div>
                    <span class="name-text">{{ item.name }}</span>
                  </div>
                </div>
                <!-- 参考区 -->
                <div class="goods-item-data">
                  <div>参考出售价 <span class="minitable-value correction"
                      :class="item.correctionValue > 100 ? 'positive' : item.correctionValue < -100 ? 'negative' : 'zero'">
                      {{ item.referencePrice }}
                    </span>
                  </div>
                  <!-- <div>进价修正值 <span class="minitable-value correction"
                      :class="item.correctionValue > 100 ? 'positive' : item.correctionValue < -100 ? 'negative' : 'zero'">
                      {{ item.correctionValue > 0 ? '+' : '' }}{{ item.correctionValue }}
                    </span>
                  </div> -->
                </div>
                <!-- 策略区 -->
                <div class="goods-card-minitable">
                  <div class="minitable-row">
                    <span class="minitable-label">买到剩1/2配额</span>
                    <span class="minitable-value">>{{ wulingPrices[currentDayIndex] + item.correctionValue
                    }}</span>
                  </div>
                  <div class="minitable-row">
                    <span class="minitable-label">全部购买</span>
                    <span class="minitable-value">≤{{ wulingPrices[currentDayIndex] + item.correctionValue
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- 四号谷地 -->
      <v-card class="mb-4">
        <v-card-title class="text-h6">
          <v-icon class="mr-2" color="light-green">mdi-map-marker</v-icon>
          <span class="region-title">{{ t('page.materialProfit.couponStrategy.fourValley') }}</span>
          <v-spacer />
        </v-card-title>
        <v-card-text>
          <div class="goods-cards-grid">
            <div v-for="(item, index) in goodsItems" :key="index" class="goods-card">
              <div class="goods-card-content">
                <div class="goods-card-left">
                  <div class="goods-card-image-wrapper">
                    <img :alt="item.name" class="goods-card-image" :src="item.imageUrl" @error="handleImageError" />
                  </div>
                  <div class="goods-card-name">
                    <div class="name-decoration four-valley-decoration"></div>
                    <span class="name-text">{{ item.name }}</span>
                  </div>
                </div>

                <!-- 参考区 -->
                <div class="goods-item-data">
                  <div>参考出售价 <span class="minitable-value correction"
                      :class="item.correctionValue > 100 ? 'positive' : item.correctionValue < -100 ? 'negative' : 'zero'">
                      {{ item.referencePrice }}
                    </span>
                  </div>
                  <!-- <div>进价修正值 <span class="minitable-value correction"
                      :class="item.correctionValue > 100 ? 'positive' : item.correctionValue < -100 ? 'negative' : 'zero'">
                      {{ item.correctionValue > 0 ? '+' : '' }}{{ item.correctionValue }}
                    </span>
                  </div> -->
                </div>
                <div class="goods-card-minitable">
                  <div class="minitable-row">
                    <span class="minitable-label">买到剩1/3配额</span>
                    <span class="minitable-value">>{{ fourValleySecondPrices[currentDayIndex] +
                      item.correctionValue }}</span>
                  </div>
                  <div class="minitable-row">
                    <span class="minitable-label">买到剩2/3配额</span>
                    <span class="minitable-value">{{ fourValleyFirstPrices[currentDayIndex] +
                      item.correctionValue }}~{{ fourValleySecondPrices[currentDayIndex] + item.correctionValue
                      }}</span>
                  </div>
                  <div class="minitable-row">
                    <span class="minitable-label">全部购买</span>
                    <span class="minitable-value">
                      <{{ fourValleyFirstPrices[currentDayIndex] + item.correctionValue }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- 策略速查表 -->
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
                <v-data-table class="elevation-0" density="compact" disable-sort :headers="wulingTableHeaders"
                  hide-default-footer :items="wulingTableItems">
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

                <!-- 武陵货品列表表格 -->
                <v-data-table class="elevation-0 mt-4" density="compact" disable-sort :headers="wulingGoodsTableHeaders"
                  hide-default-footer :items="wulingGoodsItems" :items-per-page="100">
                  <template #item.correctionValue="{ item }">
                    <span
                      :class="item.correctionValue > 100 ? 'correction-positive' : item.correctionValue < -100 ? 'correction-negative' : 'correction-zero'">
                      {{ item.correctionValue > 0 ? '+' : '' }}{{ item.correctionValue }}
                    </span>
                  </template>
                  <template #item.referencePrice="{ item }">
                    <span class="reference-price">{{ item.referencePrice }}</span>
                  </template>
                </v-data-table>
              </div>
            </v-col>

            <!-- 四号谷地速查表 -->
            <v-col cols="12" md="6">
              <div class="table-section four-valley-region">
                <div class="region-header">
                  <v-icon class="mr-2" color="light-green">mdi-map-marker</v-icon>
                  <span class="region-title">{{ t('page.materialProfit.couponStrategy.fourValleyStrategyTable')
                  }}</span>
                </div>
                <v-data-table class="elevation-0" density="compact" disable-sort :headers="fourValleyTableHeaders"
                  hide-default-footer :items="fourValleyTableItems">
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

                <!-- 四号谷地货品列表表格 -->
                <v-data-table class="elevation-0 mt-4" density="compact" disable-sort
                  :headers="fourValleyGoodsTableHeaders" hide-default-footer :items="goodsItems" :items-per-page="100">
                  <template #item.correctionValue="{ item }">
                    <span
                      :class="item.correctionValue > 100 ? 'correction-positive' : item.correctionValue < -100 ? 'correction-negative' : 'correction-zero'">
                      {{ item.correctionValue > 0 ? '+' : '' }}{{ item.correctionValue }}
                    </span>
                  </template>
                  <template #item.referencePrice="{ item }">
                    <span class="reference-price">{{ item.referencePrice }}</span>
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
import { onMounted, onUnmounted, ref } from 'vue';
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

const wulingGoodsTableHeaders: TableHeader[] = [
  { title: t('page.materialProfit.couponStrategy.goodsName'), key: 'name', align: 'start' },
  { title: t('page.materialProfit.couponStrategy.referencePrice'), key: 'referencePrice', align: 'center' },
  { title: t('page.materialProfit.couponStrategy.correctionValue'), key: 'correctionValue', align: 'center' },
];

const fourValleyTableHeaders: TableHeader[] = [
  { title: t('page.materialProfit.couponStrategy.weekday'), key: 'weekday', align: 'center' },
  { title: t('page.materialProfit.couponStrategy.buyAll'), key: 'buyAllPrice', align: 'center' },
  { title: t('page.materialProfit.couponStrategy.buyOneThirdQuota'), key: 'buyOneThirdPrice', align: 'center' },
  { title: t('page.materialProfit.couponStrategy.buyTwoThirdsQuota'), key: 'buyTwoThirdsPrice', align: 'center' },
];

const fourValleyGoodsTableHeaders: TableHeader[] = [
  { title: t('page.materialProfit.couponStrategy.goodsName'), key: 'name', align: 'start' },
  { title: t('page.materialProfit.couponStrategy.referencePrice'), key: 'referencePrice', align: 'center' },
  { title: t('page.materialProfit.couponStrategy.correctionValue'), key: 'correctionValue', align: 'center' },
];

const currentDayIndex = ref<number>(0);
const countdown = ref<number>(0);
const countdownText = ref<string>('--:--:--');
let countdownInterval: NodeJS.Timeout | null = null;

// 缓存当前日期字符串，避免不必要的更新
let lastCheckedDate = '';

// 货组数据
interface GoodsItem {
  name: string;
  imageUrl: string;
  correctionValue: number;
  referencePrice: number;
  selected: boolean;
}

// 四号谷地货组数据
const goodsItems = ref<GoodsItem[]>([
  { name: '锚点厨具货组', imageUrl: 'https://cos.yituliu.cn/endfield/unpack-images/coupon-items/item_domainshop_cargo_tundra_1.webp', correctionValue: -313, referencePrice: 4679, selected: false },
  { name: '悬空鼷兽骨雕货组', imageUrl: 'https://cos.yituliu.cn/endfield/unpack-images/coupon-items/item_domainshop_cargo_tundra_2.webp', correctionValue: -313, referencePrice: 4679, selected: false },
  { name: '巫术矿钻货组', imageUrl: 'https://cos.yituliu.cn/endfield/unpack-images/coupon-items/item_domainshop_cargo_tundra_3.webp', correctionValue: -313, referencePrice: 4679, selected: false },
  { name: '天使罐头货组', imageUrl: 'https://cos.yituliu.cn/endfield/unpack-images/coupon-items/item_domainshop_cargo_tundra_4.webp', correctionValue: -313, referencePrice: 4679, selected: false },
  { name: '谷地水培肉货组', imageUrl: 'https://cos.yituliu.cn/endfield/unpack-images/coupon-items/item_domainshop_cargo_tundra_5.webp', correctionValue: -25, referencePrice: 4966, selected: false },
  { name: '团结牌口服液货组', imageUrl: 'https://cos.yituliu.cn/endfield/unpack-images/coupon-items/item_domainshop_cargo_tundra_6.webp', correctionValue: -25, referencePrice: 4966, selected: false },
  { name: '源石树幼苗货组', imageUrl: 'https://cos.yituliu.cn/endfield/unpack-images/coupon-items/item_domainshop_cargo_tundra_7.webp', correctionValue: 338, referencePrice: 5329, selected: false },
  { name: '塞什卡髀石货组', imageUrl: 'https://cos.yituliu.cn/endfield/unpack-images/coupon-items/item_domainshop_cargo_tundra_8.webp', correctionValue: -25, referencePrice: 4966, selected: false },
  { name: '星体晶块货组', imageUrl: 'https://cos.yituliu.cn/endfield/unpack-images/coupon-items/item_domainshop_cargo_tundra_9.webp', correctionValue: -25, referencePrice: 4966, selected: false },
  { name: '警戒者矿镐货组', imageUrl: 'https://cos.yituliu.cn/endfield/unpack-images/coupon-items/item_domainshop_cargo_tundra_10.webp', correctionValue: 338, referencePrice: 5329, selected: false },
  { name: '边角料积木货组', imageUrl: 'https://cos.yituliu.cn/endfield/unpack-images/coupon-items/item_domainshop_cargo_tundra_11.webp', correctionValue: 338, referencePrice: 5329, selected: false },
  { name: '硬脑壳头盔货组', imageUrl: 'https://cos.yituliu.cn/endfield/unpack-images/coupon-items/item_domainshop_cargo_tundra_12.webp', correctionValue: 338, referencePrice: 5329, selected: false },
]);

// 武陵货组数据
const wulingGoodsItems = ref<GoodsItem[]>([
  { name: '武侠电影货组', imageUrl: 'https://cos.yituliu.cn/endfield/unpack-images/coupon-items/item_domainshop_cargo_jinlong_1.webp', correctionValue: 0, referencePrice: 4656, selected: false },
  { name: '岳研避瘴茶货组', imageUrl: 'https://cos.yituliu.cn/endfield/unpack-images/coupon-items/item_domainshop_cargo_jinlong_2.webp', correctionValue: 0, referencePrice: 4656, selected: false },
  { name: '武陵冻梨货组', imageUrl: 'https://cos.yituliu.cn/endfield/unpack-images/coupon-items/item_domainshop_cargo_jinlong_3.webp', correctionValue: 0, referencePrice: 4656, selected: false },
  { name: '冬虫夏笋货组', imageUrl: 'https://cos.yituliu.cn/endfield/unpack-images/coupon-items/item_domainshop_cargo_jinlong_4.webp', correctionValue: 0, referencePrice: 4656, selected: false },
]);

// 切换四号谷地货组选择状态
function toggleGoodsSelection(index: number): void {
  const item = goodsItems.value[index];
  if (item) {
    item.selected = !item.selected;
  }
}

// 切换武陵货组选择状态
function toggleWulingGoodsSelection(index: number): void {
  const item = wulingGoodsItems.value[index];
  if (item) {
    item.selected = !item.selected;
  }
}

// 处理图片加载错误
function handleImageError(e: Event): void {
  const img = e.target as HTMLImageElement;
  img.style.opacity = '0.5';
  img.style.filter = 'grayscale(100%)';
}

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
  color: var(--theme-text-primary);
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--theme-text-secondary);
  margin-bottom: 2rem;
}

/* 使用说明模块样式 */
.explanation-section {
  padding: 16px;
}

.explanation-title {
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--theme-text-primary);
}

.explanation-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.explanation-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.explanation-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.explanation-text {
  font-size: 1rem;
  color: var(--theme-text-secondary);
  line-height: 1.6;
  flex: 1;
}

[data-theme='dark'] .explanation-title {
  color: #e0e0e0;
}

[data-theme='dark'] .explanation-item {
  background: rgba(102, 126, 234, 0.15);
  border-left-color: #7c3aed;
}

[data-theme='dark'] .explanation-text {
  color: #b0b0b0;
}

.region-section,
.table-section {
  padding: 16px;
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  background: var(--theme-bg-secondary);
}

.region-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--theme-border);
}

.region-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--theme-text-primary);
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

/* 武陵货组卡片网格 - 与四号谷地保持一致 */
.wuling-cards-grid {
  /* 使用相同的flex布局，不设置grid-template-columns */
}

/* 武陵货组卡片选中状态 */
.wuling-cards-container .goods-card.selected {
  background: rgba(0, 188, 212, 0.1);
  border-color: #00bcd4;
  box-shadow: 0 2px 6px rgba(0, 188, 212, 0.3);
}

.wuling-cards-container .goods-card.selected:hover {
  background: rgba(0, 188, 212, 0.15);
  border-color: #26c6da;
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

/* 禁用所有表格的排序功能 */
:deep(.v-data-table__th) {
  cursor: default !important;
  user-select: none !important;
}

:deep(.v-data-table__th .v-data-table-header__content) {
  cursor: default !important;
}

/* 隐藏排序图标 */
:deep(.v-data-table__th .v-data-table-header__content .v-data-table-header__sort-icon) {
  display: none !important;
}

/* 禁用表头点击事件 */
:deep(.v-data-table__th:hover) {
  background-color: transparent !important;
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

/* 修正值颜色样式 */
.correction-positive {
  color: #4caf50;
  font-weight: 700;
}

.correction-negative {
  color: #f44336;
  font-weight: 700;
}

.correction-zero {
  color: #ffc107;
  font-weight: 700;
}

/* 出售参考价样式 */
.reference-price {
  color: #666;
  font-weight: 600;
}

[data-theme='dark'] .correction-positive {
  color: #66bb6a;
}

[data-theme='dark'] .correction-negative {
  color: #ef5350;
}

[data-theme='dark'] .correction-zero {
  color: #ffa726;
}

[data-theme='dark'] .reference-price {
  color: #b0b0b0;
}

/* 货组卡片容器 */
.goods-cards-container {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px solid #e0e0e0;
}

/* 货组卡片网格布局 - flex自适应 */
.goods-cards-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

/* 货组卡片基础样式 */
.goods-card {
  display: flex;
  align-items: center;
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 168px;
  max-width: 168px;
  flex: 1 0 168px;
}

.goods-card:hover {
  background: #f5f5f5;
  border-color: #bdbdbd;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 选中状态 */
.goods-card.selected {
  background: rgba(139, 195, 74, 0.1);
  border-color: #8bc34a;
  box-shadow: 0 2px 6px rgba(139, 195, 74, 0.3);
}

.goods-card.selected:hover {
  background: rgba(139, 195, 74, 0.15);
  border-color: #7cb342;
}

/* 货组卡片内容 - 上下布局 */
.goods-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 0px;
}

/* 货组卡片左侧区域（图片+名称） */
.goods-card-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

/* 货组卡片图片容器 */
.goods-card-image-wrapper {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 108px;
  padding-top: 16px;
}

/* 货组卡片名称区域 */
.goods-card-name {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  max-width: 144px;
  width: fit-content;
  font-size: 1rem;
}

/* 名称装饰条 */
.name-decoration {
  width: 3px;
  height: 22px;
  border-radius: 2px;
  flex-shrink: 0;
}

.goods-item-data {

  margin-top: 4px;
  padding: 0px 12px;
  border-radius: 8px;
  background-color: #80808020;
}

/* 武陵装饰条 */
.wuling-decoration {
  background: linear-gradient(180deg, #00bcd4 0%, #26c6da 100%);
  box-shadow: 0 0 8px rgba(0, 188, 212, 0.4);
}

/* 四号谷地装饰条 */
.four-valley-decoration {
  background: linear-gradient(180deg, #8bc34a 0%, #9ccc65 100%);
  box-shadow: 0 0 8px rgba(139, 195, 74, 0.4);
}


/* 货组卡片图片 */
.goods-card-image {
  width: 144px;
  height: 120px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

/* 迷你表格样式 */
.goods-card-minitable {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  padding: 6px;
}

/* 迷你表格行 */
.minitable-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: transparent;
}

/* 修正值行 - 保持水平布局 */
.minitable-row.correction-row {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

/* 迷你表格标签 */
.minitable-label {
  font-size: 1rem;
  color: var(--theme-text-secondary);
  text-align: left;
}

/* 迷你表格值 */
.minitable-value {
  font-size: 1.1rem;
  font-weight: 700;
  text-align: left;
  color: var(--theme-text-primary);
}

/* 修正值颜色类 */
.minitable-value.correction.positive {
  color: #4caf50;
}

.minitable-value.correction.negative {
  color: #f44336;
}

.minitable-value.correction.zero {
  color: #ff9900;
}

/* 武陵价格主题 */
.wuling-price {
  color: #00bcd4;
}

/* 四号谷地价格主题 */
.four-valley-price {
  color: #8bc34a;
}

/* 货组卡片信息区域 - 底部 */
.goods-card-info {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid #e0e0e0;
}

/* 货组卡片文本 */
.goods-card-text {
  font-size: 0.8rem;
  color: #333;
  font-weight: 500;
  line-height: 1.3;
  text-align: center;
}

/* 修正值箭头 */
.correction-arrow {
  flex-shrink: 0;
  font-size: 1rem;
}

/* 修正值数字 */
.correction-value {
  flex-shrink: 0;
  font-weight: 700;
  font-size: 0.9rem;
}

/* 响应式调整 - 移动端只允许换行，不改变卡片宽度 */
@media (max-width: 960px) {
  /* 保持300px固定宽度，flex容器自动换行 */
}

/* 响应式调整 - 超小屏幕下单列 */
@media (max-width: 600px) {
  .content {
    padding: 0;
  }

  .goods-card {
    min-width: 150px;
    max-width: 150px;
    flex: 1 0 150px;
  }
}

[data-theme='dark'] .goods-card {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

[data-theme='dark'] .goods-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

[data-theme='dark'] .goods-card.selected {
  background: rgba(156, 204, 101, 0.15);
  border-color: #9ccc65;
  box-shadow: 0 2px 6px rgba(156, 204, 101, 0.3);
}

[data-theme='dark'] .goods-card.selected:hover {
  background: rgba(156, 204, 101, 0.2);
}

[data-theme='dark'] .goods-cards-container {
  border-color: rgba(255, 255, 255, 0.1);
}

[data-theme='dark'] .goods-card-text {
  color: #e0e0e0;
}

[data-theme='dark'] .goods-card-correction {
  background: rgba(30, 30, 30, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

[data-theme='dark'] .correction-value {
  color: #e0e0e0;
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