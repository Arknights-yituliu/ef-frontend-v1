<template>
  <article class="pack-card-container">
    <div class="pack-card-wrapper" @click="toggleExpanded">
      <!-- 左侧：图片区域 -->
      <div
        class="pack-card-part-left"
        :style="{
          backgroundImage: `url(${props.backgroundImageUrl})`,
        }"
      >
        <img
          v-if="props.imageUrl && !imageError"
          :alt="packDisplayName"
          class="pack-image"
          loading="lazy"
          :src="props.imageUrl"
          @error="handleImageError"
        />
        <div v-else class="image-placeholder">
          <span class="placeholder-icon">📦</span>
        </div>

        <!-- 价格角标 -->
        <div class="pack-corner">
          <div class="price-text">￥{{ props.price.toFixed(0) }}</div>
        </div>

        <!-- 标题（底部覆盖） -->
        <div class="pack-display-name">
          <span>{{ packDisplayName }}</span>
        </div>
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
            <div class="pack-chart-line-label">
              <span>{{ bar.barLabel }}</span>
            </div>
            <div
              class="pack-line-bar"
              :style="{
                width: `${bar.percentage * 5}em`,
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

    <p v-if="packDescription && !isExpanded" class="pack-description">
      <span
        ><em>{{ packDescription }}</em></span
      >
    </p>

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
            <td>{{ content.name[locale] }}</td>
            <td>{{ content.quantity }}</td>
            <td>{{ getItemBundleValue(content).toFixed(2) }}</td>
            <td>{{ (getItemBundleValuePercentage(content, props) * 100).toFixed(2) }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
</template>

<script lang="ts" setup>
import type { PackData } from '@/shared/types/pack';
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

const props = defineProps<PackData>();

const { locale } = useI18n();
const imageError = ref(false);
const isExpanded = ref(false);

const packDisplayName = computed(() => {
  return props.displayName[locale.value];
});

const packDescription = computed(() => {
  return props.description?.[locale.value];
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

function handleImageError() {
  imageError.value = true;
}

function toggleExpanded() {
  isExpanded.value = !isExpanded.value;
}

function getPackComparisonBars(pack: PackData) {
  return [
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
      percentage: 1,
    },
  ];
}
</script>

<style scoped>
.pack-card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  margin-bottom: 0.75em;
  /* 屏幕宽 375px -> 字体大小 12px
     屏幕宽 600px -> 字体大小 16px */
  font-size: clamp(10px, calc(5.33333333px + 1.77777777vw), 16px);
}

.pack-card-wrapper {
  display: flex;
  align-items: center;
  max-width: 100%;
  z-index: 10;
  transition:
    transform var(--transition-base),
    filter var(--transition-base);
  cursor: pointer;
}

.pack-card-wrapper:hover {
  transform: translateY(-0.125em);
  filter: brightness(1.02);
}

/* 左侧图片区域 */
.pack-card-part-left {
  height: 6.875em;
  width: 11.25em;
  flex-shrink: 2;
  border-radius: 0.5em;
  overflow: hidden;
  position: relative;
  z-index: 11;
  box-shadow: 0 0 0.75em var(--theme-shadow-base);
  background-size: cover;
  background-position: center;
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
  font-size: 3em;
  opacity: 0.5;
  z-index: 1;
}

/* 价格角标 */
.pack-corner {
  background-color: var(--theme-glass-bg);
  backdrop-filter: blur(0.625em);
  -webkit-backdrop-filter: blur(0.625em);
  position: absolute;
  text-align: center;
  left: -2.25em;
  top: 0.375em;
  transform: rotate(-40deg);
  width: 6.9375em;
  z-index: 12;
  padding: 0.25em 0.5em;
  box-shadow: 0 0 0.5em var(--theme-shadow-accent);
  border: 0.0625em solid var(--theme-glass-border);
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
  font-size: 0.875em;
  font-weight: 700;
  color: var(--theme-text-primary);
  position: relative;
  z-index: 1;
  text-shadow: 0 0.0625em 0.125em var(--theme-glass-text-shadow);
}

/* 标题（底部覆盖） */
.pack-display-name {
  background-color: var(--theme-glass-bg);
  backdrop-filter: blur(0.625em);
  -webkit-backdrop-filter: blur(0.625em);
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 1.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 13;
  border-top: 0.0625em solid var(--theme-decorative-overlay);
  box-shadow: 0 -0.125em 0.5em var(--theme-glass-shadow);

  span {
    text-align: center;
    color: var(--theme-text-primary);
    font-size: 0.75em;
    font-weight: 600;
  }
}

/* 右侧信息区域 */
.pack-info {
  position: relative;
  display: flex;
  height: 6.25em;
  margin-left: -0.25em;
  background-color: var(--theme-bg-secondary);
  border-radius: 0.5em;
  box-shadow: 0 0 0.75em var(--theme-shadow-base);
  z-index: 10;
  border: 0.0625em solid var(--theme-border);
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
  width: 8em;
  height: 100%;
  z-index: 1;
  gap: 0.5em;

  div {
    font-size: 1em;
    font-weight: 700;
    line-height: 1.3;
    text-align: center;
    white-space: nowrap;
  }
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
  width: 15em;
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
  width: 0.125em;
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
  width: 5em;
  text-align: center;

  span {
    font-size: 0.75em;
    font-weight: 600;
    color: var(--theme-text-primary);
  }
}

.pack-line-bar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 2.5em;
  height: 1.125em;
  background-color: var(--theme-accent-color);
  border-radius: 9999px;
  padding: 0 0.5em;
  box-shadow: 0 0 0.25em var(--theme-shadow-accent);
  position: relative;
  overflow: hidden;

  span {
    white-space: nowrap;
    color: var(--theme-text-thirdary);
    font-size: 0.75em;
    font-weight: 700;
  }
}

/* 倒计时 */
/* .pack-info-countdown {
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
} */

.pack-description {
  width: 100%;
  padding-left: 0.75em;

  span {
    color: var(--theme-text-secondary);
    font-size: 1em;
  }
}

/* 展开的内容表格 */
.pack-contents-table {
  display: block;
  width: 32em;
  max-width: 95%;
  height: 0;
  margin-top: -0.75em;
  overflow: hidden;
  background-color: var(--theme-bg-secondary);
  border-radius: 0;
  box-shadow: 0 0 0.75em var(--theme-shadow-base);
  border: 0.0625em solid var(--theme-border);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.pack-contents-table.expanded {
  height: auto;
  opacity: 1;
}

.pack-contents-header {
  padding: 1em;
  border-bottom: 0.0625em solid var(--theme-border);
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
  margin-top: 0.5em;
}

.contents-table {
  width: 100%;
  border-collapse: collapse;
}

.contents-table thead {
  background-color: var(--theme-bg-tertiary);
}

.contents-table th {
  padding: 0 1em;
  text-align: left;
  font-size: 1em;
  font-weight: 600;
  color: var(--theme-text-primary);
  border-bottom: 0.0625em solid var(--theme-border);
}

.contents-table td {
  padding: 0.625em 1em;
  font-size: 1em;
  color: var(--theme-text-primary);
  border-bottom: 0.0625em solid var(--theme-border);
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
</style>
