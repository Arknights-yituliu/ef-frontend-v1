<template>
  <div class="pack-card-container">
    <div class="pack-card-wrapper" @click="toggleExpanded">
      <!-- 左侧：图片区域 -->
      <div class="pack-card-part-left">
        <img
          v-if="props.imageUrl && !imageError"
          :src="resolvePictureUrl(props.imageUrl, packImageAssets) ?? ''"
          :alt="packDisplayName"
          class="pack-image"
          loading="lazy"
          @error="handleImageError"
        />
        <div class="image-placeholder" v-else>
          <span class="placeholder-icon">📦</span>
        </div>

        <!-- 价格角标 -->
        <div class="pack-corner">
          <span class="price-text">￥{{ props.price }}</span>
        </div>

        <!-- 标题（底部覆盖） -->
        <span class="pack-display-name">{{ packDisplayName }}</span>
      </div>

      <!-- 右侧：信息区域 -->
      <div class="pack-info">
        <!-- 左侧：价值信息 -->
        <div class="pack-info-text">
          <span v-if="stoneEquivalent > 0" class="value-stone">
            {{ $t('component.packCard.equivalent') }}{{ stoneEquivalent.toFixed(1)
            }}{{ $t('component.packCard.stone') }}
          </span>
          <span v-if="pricePerStone > 0" class="value-stone">
            ￥{{ pricePerStone.toFixed(1) }}/{{ $t('component.packCard.stone') }}
          </span>
          <span style="height: 8px" v-if="stoneEquivalent > 0 || pricePerStone > 0"></span>
          <span v-if="totalPulls > 0" class="value-pull">
            {{ $t('component.packCard.total') }}{{ totalPulls.toFixed(1)
            }}{{ $t('component.packCard.pull') }}
          </span>
          <span v-if="pricePerPull > 0" class="value-pull">
            ￥{{ pricePerPull.toFixed(1) }}/{{ $t('component.packCard.pull') }}
          </span>
        </div>

        <!-- 右侧：对比条 -->
        <div class="pack-chart-line">
          <div class="pack-chart-line-item" v-for="(bar, index) in comparisonBars" :key="index">
            <span class="pack-chart-line-label">{{ bar.barLabel }}</span>
            <div
              class="pack-line-bar"
              :style="{
                width: `${bar.percentage * 80}px`,
              }"
            >
              <span>{{ (bar.percentage * 100).toFixed(0) }}%</span>
            </div>
          </div>
        </div>

        <!-- 倒计时（右下角） -->
        <!-- <div class="pack-info-countdown" v-if="props.countdownDays > 0">
          {{ countdownText }}
        </div> -->
      </div>
    </div>

    <!-- 展开的内容表格 - 藏在卡片背后 -->
    <div class="pack-contents-table" :class="{ expanded: isExpanded }">
      <div class="pack-contents-header">
        <h3>{{ $t('component.packCard.contents') }}</h3>
      </div>
      <table class="contents-table">
        <thead>
          <tr>
            <th>{{ $t('component.packCard.itemName') }}</th>
            <th>{{ $t('component.packCard.quantity') }}</th>
            <th>{{ $t('component.packCard.totalValue') }}</th>
            <th>{{ $t('component.packCard.percentage') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(content, index) in props.contents" :key="index">
            <td>{{ getItemName(content.itemId) }}</td>
            <td>{{ content.quantity }}</td>
            <td>{{ getItemBundleValue(content).toFixed(2) }}</td>
            <td>{{ (getItemBundleValuePercentage(content) * 100).toFixed(2) }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import itemInfo from '@/custom/core/itemInfo';
import type { PackData } from '@/shared/types/pack';
import { resolvePictureUrl } from '@/shared/utils/urlUtil';

const packImageAssets = import.meta.glob('~/assets/endfield/packs/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const props = defineProps<PackData>();

const { locale } = useI18n();
const imageError = ref(false);
const isExpanded = ref(false);

const packDisplayName = computed(() => {
  return locale.value === 'en-US' ? props.packDisplayNameEN : props.packDisplayNameZH;
});

// const countdownText = computed(() => {
//   return t('component.packCard.daysLeft', { days: props.countdownDays });
// });

// const visibleComparisonBars = computed(() => {
//   return props.comparisonBars;
// });

// const barLabel = (bar: (typeof props.comparisonBars)[0]) => {
//   return locale.value === 'en-US' ? bar.labelEN : bar.labelZH;
// };

const handleImageError = () => {
  imageError.value = true;
};

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

function getItemName(itemId: string): string {
  return itemInfo[itemId]?.name ?? itemId;
}

function getItemValue(itemId: string): number {
  return itemInfo[itemId]?.value ?? 0;
}

function getItemPulls(itemId: string): number {
  return itemInfo[itemId]?.pulls ?? 0;
}

function getItemBundleValue({ itemId, quantity }: PackContent) {
  return getItemValue(itemId) * quantity;
}

function getItemBundlePulls({ itemId, quantity }: PackContent) {
  return getItemPulls(itemId) * quantity;
}

function getItemBundleValuePercentage(packContent: PackContent) {
  return getItemBundleValue(packContent) / props.price / pack648SanityCostEffectiveness;
}

const totalValue = computed(() => {
  let totalValue = 0;
  for (const content of props.contents) {
    totalValue += getItemBundleValue(content);
  }
  return totalValue;
});

const totalPulls = computed(() => {
  let totalPulls = 0;
  for (const content of props.contents) {
    totalPulls += getItemBundlePulls(content);
  }
  return totalPulls;
});

const stoneEquivalent = computed(() => {
  return totalValue.value / 40;
});

const pricePerStone = computed(() => {
  return props.price / stoneEquivalent.value;
});

const pricePerPull = computed(() => {
  return props.price / totalPulls.value;
});

const pack648SanityCostEffectiveness =
  getItemBundleValue({ itemId: '衍质源石', quantity: 350 }) / 648;
const pack648PullCostEffectiveness =
  getItemBundlePulls({ itemId: '衍质源石', quantity: 350 }) / 648;

const sanityEfficiency = computed(
  () => totalValue.value / props.price / pack648SanityCostEffectiveness,
);

const pullsEfficiency = computed(
  () => totalPulls.value / props.price / pack648PullCostEffectiveness,
);

const comparisonBars = computed(() => [
  {
    barLabel: '全物品',
    percentage: sanityEfficiency.value,
  },
  {
    barLabel: '仅抽卡',
    percentage: pullsEfficiency.value,
  },
  {
    barLabel: '648源石',
    percentage: 1.0,
  },
]);
</script>

<style scoped>
.pack-card-container {
  position: relative;
  width: 500px;
  margin-bottom: var(--spacing-md);
}

.pack-card-wrapper {
  display: flex;
  width: 100%;
  position: relative;
  z-index: 10;
  transition:
    transform var(--transition-base),
    filter var(--transition-base);
  cursor: pointer;
}

.pack-card-wrapper:hover {
  transform: translateY(-2px);
  filter: brightness(1.02);
}

/* 左侧图片区域 */
.pack-card-part-left {
  border-radius: var(--radius-md);
  overflow: hidden;
  position: relative;
  z-index: 11;
  box-shadow: 0 0 0.75rem var(--theme-shadow-base);
  transition:
    box-shadow var(--transition-base),
    transform var(--transition-base);
}

.pack-image {
  height: 110px;
  width: 150px;
  object-fit: cover;
  display: block;
  transition: transform var(--transition-base);
}

.image-placeholder {
  height: 110px;
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--theme-bg-tertiary);
  position: relative;
}

.image-placeholder::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    -45deg,
    transparent,
    transparent 13.9512529279%,
    var(--theme-decorative-overlay-light) 0,
    var(--theme-decorative-overlay-light) 36.0487470721%,
    transparent 0,
    transparent 63.9512529279%,
    var(--theme-decorative-overlay-light) 0,
    var(--theme-decorative-overlay-light) 86.0487470721%,
    transparent 0,
    transparent
  );
  background-size: 0.5rem 0.5rem;
  background-repeat: repeat;
  opacity: 0.3;
}

.placeholder-icon {
  font-size: 3rem;
  opacity: 0.5;
  position: relative;
  z-index: 1;
}

/* 价格角标 */
.pack-corner {
  background: var(--theme-glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: absolute;
  text-align: center;
  font-size: 14px;
  left: -36px;
  top: 6px;
  transform: rotate(-40deg);
  width: 111px;
  z-index: 12;
  padding: 4px 8px;
  font-weight: 700;
  box-shadow: 0 0 0.5rem var(--theme-shadow-accent);
  border-radius: var(--radius-sm);
  border: 1px solid var(--theme-glass-border);
  transition:
    transform var(--transition-base),
    box-shadow var(--transition-base),
    background var(--transition-base);
}

.pack-corner::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    -45deg,
    transparent,
    transparent 13.9512529279%,
    var(--theme-decorative-overlay-light) 0,
    var(--theme-decorative-overlay-light) 36.0487470721%,
    transparent 0,
    transparent 63.9512529279%,
    var(--theme-decorative-overlay-light) 0,
    var(--theme-decorative-overlay-light) 86.0487470721%,
    transparent 0,
    transparent
  );
  background-size: 0.5rem 0.5rem;
  background-repeat: repeat;
  border-radius: var(--radius-sm);
  pointer-events: none;
}

.price-text {
  display: block;
  color: var(--theme-text-primary);
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 2px var(--theme-glass-text-shadow);
  font-weight: 700;
}

/* 标题（底部覆盖） */
.pack-display-name {
  background: var(--theme-glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--theme-text-primary);
  position: absolute;
  text-align: center;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  font-size: 12px;
  font-weight: 600;
  height: 24px;
  left: 0;
  padding-top: 3px;
  top: 86px;
  width: 150px;
  z-index: 13;
  line-height: 1.2;
  border-top: 1px solid var(--theme-decorative-overlay);
  box-shadow: 0 -2px 8px var(--theme-glass-shadow);
  transition:
    background var(--transition-base),
    color var(--transition-base);
}

/* 右侧信息区域 */
.pack-info {
  background-color: var(--theme-bg-secondary);
  border-radius: var(--radius-md);
  box-shadow: 0 0 0.75rem var(--theme-shadow-base);
  display: flex;
  height: 100px;
  margin-left: -4px;
  margin-top: 4px;
  position: relative;
  z-index: 10;
  border: 1px solid var(--theme-border);
  transition:
    box-shadow var(--transition-base),
    transform var(--transition-base),
    border-color var(--transition-base);
  overflow: hidden;
}

.pack-info::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    -45deg,
    transparent,
    transparent 13.9512529279%,
    var(--theme-decorative-overlay-light) 0,
    var(--theme-decorative-overlay-light) 36.0487470721%,
    transparent 0,
    transparent 63.9512529279%,
    var(--theme-decorative-overlay-light) 0,
    var(--theme-decorative-overlay-light) 86.0487470721%,
    transparent 0,
    transparent
  );
  background-size: 0.5rem 0.5rem;
  background-repeat: repeat;
  opacity: 0.15;
  pointer-events: none;
}

/* 左侧价值信息 */
.pack-info-text {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  height: 100%;
  justify-content: center;
  margin-left: 6px;
  margin-right: 6px;
  width: 92px;
  position: relative;
  z-index: 1;
  gap: 4px;
}

.pack-info-text span {
  font-weight: 700;
  line-height: 1;
  text-align: center;
  transition: all var(--transition-fast);
  letter-spacing: 0.02em;
  position: relative;
  white-space: nowrap;
}

/* 源石相关数值*/
.value-stone {
  color: var(--theme-accent-color);
}

/* 抽数相关数值 */
.value-pull {
  color: var(--theme-text-primary);
}

/* 右侧对比条 */
.pack-chart-line {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  white-space: nowrap;
  width: 240px;
  align-content: flex-start;
  color: var(--theme-text-primary);
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 4px 0;
  position: relative;
  z-index: 1;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--theme-decorative-overlay-light) 50%,
    transparent 100%
  );
}

/* 渐变分割线 - 浅-深-浅 */
.pack-chart-line::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--theme-decorative-overlay-light) 20%,
    var(--theme-accent-color) 50%,
    var(--theme-decorative-overlay-light) 80%,
    transparent 100%
  );
  z-index: 1;
  transition: background var(--transition-base);
}

.pack-chart-line-item {
  align-items: center;
  display: flex;
  font-size: 15px;
  line-height: 1;
  margin: 2px 0;
  transition: transform var(--transition-fast);
}

.pack-chart-line-label {
  display: block;
  text-align: center;
  width: 80px;
  font-size: 12px;
  font-weight: 600;
  color: var(--theme-text-primary);
}

.pack-line-bar {
  background-color: var(--theme-accent-color);
  border-radius: 200px;
  box-sizing: border-box;
  color: var(--theme-text-thirdary);
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 8px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-shadow: 0 0 0.25rem var(--theme-shadow-accent);
  transition:
    background-color var(--transition-fast),
    box-shadow var(--transition-fast),
    transform var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.pack-line-bar::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    -45deg,
    transparent,
    transparent 13.9512529279%,
    var(--theme-decorative-overlay) 0,
    var(--theme-decorative-overlay) 36.0487470721%,
    transparent 0,
    transparent 63.9512529279%,
    var(--theme-decorative-overlay) 0,
    var(--theme-decorative-overlay) 86.0487470721%,
    transparent 0,
    transparent
  );
  background-size: 0.25rem 0.25rem;
  background-repeat: repeat;
  opacity: 0.3;
  pointer-events: none;
}

.pack-line-bar span {
  white-space: nowrap;
  position: relative;
  z-index: 1;
  font-weight: 700;
  text-shadow: 0 1px 2px var(--theme-decorative-overlay-strong);
}

/* 倒计时 */
.pack-info-countdown {
  border-radius: var(--radius-sm);
  bottom: 0;
  color: var(--theme-text-secondary);
  font-style: italic;
  padding: 6px 12px;
  position: absolute;
  right: 0;
  font-size: 12px;
  background: linear-gradient(135deg, transparent 0%, var(--theme-decorative-overlay-light) 100%);
  backdrop-filter: blur(4px);
  border-top: 1px solid var(--theme-border);
  border-left: 1px solid var(--theme-border);
  transition:
    color var(--transition-fast),
    background var(--transition-fast);
  z-index: 2;
}

/* 展开的内容表格 */
.pack-contents-table {
  display: block;
  width: 480px;
  height: 0;
  margin: -15px 0 0 5px;
  overflow: hidden;
  background-color: var(--theme-bg-secondary);
  border-radius: var(--radius-md);
  box-shadow: 0 0 0.75rem var(--theme-shadow-base);
  border: 1px solid var(--theme-border);
  transition: all var(--transition-base);
  opacity: 0;
}

.pack-contents-table.expanded {
  height: auto;
  opacity: 1;
}

.pack-contents-header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--theme-border);
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--theme-decorative-overlay-light) 50%,
    transparent 100%
  );
}

.pack-contents-header h3 {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--theme-text-primary);
  margin: 0;
}

.contents-table {
  width: 100%;
  border-collapse: collapse;
}

.contents-table thead {
  background-color: var(--theme-bg-tertiary);
}

.contents-table th {
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--theme-text-primary);
  border-bottom: 1px solid var(--theme-border);
}

.contents-table td {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-xs);
  color: var(--theme-text-primary);
  border-bottom: 1px solid var(--theme-border);
}

.contents-table tbody tr:last-child td {
  border-bottom: none;
}

.contents-table tbody tr:hover {
  background-color: var(--theme-bg-tertiary);
}
</style>
