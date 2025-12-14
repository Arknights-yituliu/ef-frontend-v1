<template>
  <div class="pack-card-container">
    <div class="pack-card-wrapper" @click="toggleExpanded">
      <!-- 左侧：图片区域 -->
      <div class="pack-card-part-left">
        <img
          v-if="props.imageUrl && !imageError"
          :alt="packDisplayName"
          :src="resolvePictureUrl(props.imageUrl, packImageAssets) ?? ''"
          class="pack-image"
          loading="lazy"
          @error="handleImageError"
        />
        <div v-else class="image-placeholder">
          <span class="placeholder-icon">📦</span>
        </div>

        <!-- 价格角标 -->
        <div class="pack-corner">
          <span class="price-text">￥{{ props.price.toFixed(0) }}</span>
        </div>

        <!-- 标题（底部覆盖） -->
        <div class="pack-display-name">{{ packDisplayName }}</div>
      </div>

      <!-- 右侧：信息区域 -->
      <div class="pack-info">
        <!-- 左侧：价值信息 -->
        <div class="pack-info-text">
          <div class="value-stone">
            {{ $t('component.packCard.equivalent') }}
            {{ getPackStoneEquivalent(props).toFixed(1) }} {{ $t('component.packCard.stone') }}
            <br />
            ￥{{ getPackPricePerStone(props).toFixed(1) }} / {{ $t('component.packCard.stone') }}
          </div>
          <div v-if="getPackTotalPulls(props) > 0" class="value-pull">
            {{ $t('component.packCard.total') }} {{ getPackTotalPulls(props).toFixed(1) }}
            {{ $t('component.packCard.pulls') }}
            <br />
            ￥{{ getPackPricePerPull(props).toFixed(1) }} / {{ $t('component.packCard.pull') }}
          </div>
        </div>

        <!-- 右侧：对比条 -->
        <div class="pack-chart-line">
          <div
            v-for="(bar, index) in getPackComparisonBars(props)"
            :key="index"
            class="pack-chart-line-item"
          >
            <span class="pack-chart-line-label">{{ bar.barLabel }}</span>
            <div
              :style="{
                width: `${bar.percentage * 80}px`,
              }"
              class="pack-line-bar"
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
    <div :class="{ expanded: isExpanded }" class="pack-contents-table">
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
            <td>{{ (getItemBundleValuePercentage(content, props) * 100).toFixed(2) }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PackData } from '@/shared/types/pack';
import { getItemName } from '@/shared/utils/gameData/item';
import {
  getItemBundleValue,
  getItemBundleValuePercentage,
  getPackPricePerPull,
  getPackPricePerStone,
  getPackPullsEfficiency,
  getPackSanityEfficiency,
  getPackStoneEquivalent,
  getPackTotalPulls,
} from '@/shared/utils/gameData/pack';
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

const getPackComparisonBars = (pack: PackData) => [
  {
    barLabel: $t('component.packCard.packSanityEfficiency'),
    percentage: getPackSanityEfficiency(pack),
  },
  {
    barLabel: $t('component.packCard.packPullsEfficiency'),
    percentage: getPackPullsEfficiency(pack),
  },
  {
    barLabel: $t('component.packCard.648StoneEfficiency'),
    percentage: 1.0,
  },
];
</script>

<style scoped>
.pack-card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.pack-card-wrapper {
  display: flex;
  align-items: center;
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
  height: 110px;
  width: 180px;
  border-radius: var(--radius-md);
  overflow: hidden;
  position: relative;
  z-index: 11;
  box-shadow: 0 0 0.75rem var(--theme-shadow-base);
}

.pack-image {
  height: 100%;
  width: 100%;
  object-fit: cover;
  display: block;
}

.image-placeholder {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--theme-bg-tertiary);
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
  z-index: 1;
}

/* 价格角标 */
.pack-corner {
  background-color: var(--theme-glass-bg);
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
  border: 1px solid var(--theme-glass-border);
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
  background-color: var(--theme-glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--theme-text-primary);
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  z-index: 13;
  line-height: 1;
  border-top: 1px solid var(--theme-decorative-overlay);
  box-shadow: 0 -2px 8px var(--theme-glass-shadow);
}

/* 右侧信息区域 */
.pack-info {
  position: relative;
  display: flex;
  height: 100px;
  margin-left: -4px;
  background-color: var(--theme-bg-secondary);
  border-radius: var(--radius-md);
  box-shadow: 0 0 0.75rem var(--theme-shadow-base);
  z-index: 10;
  border: 1px solid var(--theme-border);
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 128px;
  height: 100%;
  font-size: 16px;
  z-index: 1;
  gap: 8px;

  font-weight: 700;
  line-height: 1.3;
  text-align: center;
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
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  overflow: hidden;
  width: 240px;
  white-space: nowrap;
  color: var(--theme-text-primary);
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
}

.pack-chart-line-item {
  align-items: center;
  display: flex;
}

.pack-chart-line-label {
  width: 80px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--theme-text-primary);
}

.pack-line-bar {
  min-width: 40px;
  height: 18px;
  background-color: var(--theme-accent-color);
  border-radius: 9999px;
  color: var(--theme-text-thirdary);
  font-size: 12px;
  padding: 0 8px;
  box-shadow: 0 0 0.25rem var(--theme-shadow-accent);
  position: relative;
  overflow: hidden;
}

.pack-line-bar span {
  white-space: nowrap;
  z-index: 1;
  font-weight: 700;
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
  z-index: 2;
}

/* 展开的内容表格 */
.pack-contents-table {
  display: block;
  width: 95%;
  height: 0;
  margin-top: -12px;
  overflow: hidden;
  background-color: var(--theme-bg-secondary);
  border-radius: var(--radius-md);
  box-shadow: 0 0 0.75rem var(--theme-shadow-base);
  border: 1px solid var(--theme-border);
  opacity: 0;
  transition: opacity var(--transition-base);
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
  margin-top: 8px;
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

.contents-table tbody tr {
  transition: background-color var(--transition-fast);
}

.contents-table tbody tr:hover {
  background-color: var(--theme-bg-tertiary);
}

/* 采用纵向布局 */
@media screen and (max-width: 600px) {
  .pack-card-container {
    width: 100%;
    max-width: 100%;
  }

  .pack-card-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: 100%;
  }

  /* 图片区域 */
  .pack-card-part-left {
    width: 100%;
    height: auto;
  }

  .pack-image,
  .image-placeholder {
    width: 100%;
    height: auto;
  }

  /* 信息区域 */
  .pack-info {
    width: 100%;
    margin-left: 0;
  }
}
</style>
