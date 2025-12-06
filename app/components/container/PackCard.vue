<template>
  <div class="pack-card-container">
    <div class="pack-card-wrapper" @click="toggleExpanded">
      <!-- 左侧：图片区域 -->
      <div class="pack-card-part-left">
        <img
          v-show="packData.imageUrl && !imageError"
          :alt="packDisplayName"
          :src="packData.imageUrl"
          class="pack-image"
          loading="lazy"
          @error="handleImageError"
        />
        <div v-show="imageError" class="image-placeholder">
          <span class="placeholder-icon">📦</span>
        </div>

        <!-- 价格角标 -->
        <!--        <div class="pack-corner">-->
        <!--          <span class="price-text">￥{{ packData.price }}</span>-->
        <!--        </div>-->

        <!-- 标题（底部覆盖） -->
        <!--        <span class="pack-display-name">{{ packDisplayName }}</span>-->
      </div>

      <!-- 右侧：信息区域 -->
      <div class="pack-info">
        <!-- 左侧：价值信息 -->
        <div class="pack-info-text">
          <span v-if="packData.valueMetrics.stoneEquivalent > 0" class="value-stone">
            {{ $t('component.packCard.equivalent') }}
            {{ numberRound(packData.valueMetrics.stoneEquivalent, 1) }}
            {{ $t('component.packCard.stone') }}
          </span>
          <span v-if="packData.valueMetrics.pricePerStone > 0" class="value-stone">
            ￥{{ packData.price }} / {{ $t('component.packCard.stone') }}
          </span>
          <span
            class="value-separate"
            v-if="
              packData.valueMetrics.stoneEquivalent > 0 || packData.valueMetrics.pricePerStone > 0
            "
          ></span>
          <span v-if="packData.valueMetrics.totalPulls > 0" class="value-pull">
            {{ $t('component.packCard.total') }}
            {{ numberRound(packData.valueMetrics.totalPulls, 1) }}
            {{ $t('component.packCard.pulls') }}
          </span>
          <span v-if="packData.valueMetrics.pricePerPull > 0" class="value-pull">
            ￥{{ numberRound(packData.valueMetrics.pricePerPull, 2) }} /
            {{ $t('component.packCard.pull') }}
          </span>
        </div>

        <!-- 右侧：对比条 -->
        <div class="pack-chart-line">
          <div
            v-for="(bar, index) in visibleComparisonBars"
            :key="index"
            :style="{ display: bar.display === false ? 'none' : 'flex' }"
            class="pack-chart-line-item"
          >
            <span class="pack-chart-line-label">{{ barLabel(bar) }}</span>
            <div
              :style="{
                width: `${bar.widthPx}px`,
                maxWidth: '100%',
              }"
              class="pack-line-bar"
            >
              <span>{{ numberRound(bar.percentage * 100, 0) }}%</span>
            </div>
          </div>
        </div>

        <!--        &lt;!&ndash; 倒计时（右下角） &ndash;&gt;-->
        <!--        <div class="pack-info-countdown" v-if="packData.countdownDays > 0">-->
        <!--          {{ countdownText }}-->
        <!--        </div>-->
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
          <tr v-for="(content, index) in packData.contents" :key="index">
            <td>{{ content.itemName }}</td>
            <td>{{ content.quantity }}</td>
            <td>{{ numberFloor(content.totalValue) }}</td>
            <td>{{ numberFloor(content.percentage) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 描述 -->
    <div v-if="packDescription" class="pack-description">
      {{ packDescription }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PackData } from '@/shared/types/pack';
import { numberFloor } from '#shared/utils/numberUtil';

const props = defineProps<{
  packData: PackData;
}>();

const { locale, t } = useI18n();
const imageError = ref(false);
const isExpanded = ref(false);

const packDisplayName = computed(() => {
  return locale.value === 'en-US'
    ? props.packData.packDisplayNameEN
    : props.packData.packDisplayNameZH;
});

const packDescription = computed(() => {
  const desc =
    locale.value === 'en-US' ? props.packData.descriptionEN : props.packData.descriptionZH;
  return desc && desc.trim() ? desc : null;
});

// const countdownText = computed(() =>
//   t('component.packCard.daysLeft', { days: props.packData.countdownDays }),
// );

const visibleComparisonBars = computed(() => {
  return props.packData.comparisonBars;
});

const barLabel = (bar: (typeof props.packData.comparisonBars)[0]) => {
  return locale.value === 'en-US' ? bar.labelEN : bar.labelZH;
};

const handleImageError = () => {
  imageError.value = true;
};

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style scoped>
.pack-card-container {
  position: relative;
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
  width: 230px;
  height: 110px;
  display: block;
  transition: transform var(--transition-base);
}

.image-placeholder {
  height: 110px;
  width: 230px;
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
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
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
  width: 128px;
  height: 100%;
  justify-content: center;
  margin-left: 6px;
  margin-right: 6px;
  position: relative;
  z-index: 1;
  gap: 4px;
}

.pack-info-text span {
  font-weight: 700;
  line-height: 1;
  text-align: center;
  transition: all var(--transition-fast);
  position: relative;
}

/* 源石相关数值*/
.value-stone {
  color: var(--theme-accent-color);
}

.value-separate {
  width: 2px;
  background-color: var(--theme-decorative-overlay-light);
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
  align-content: start;
  color: var(--theme-text-primary);
  flex-wrap: wrap;
  justify-content: space-evenly;
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
  width: 620px;
  height: 0;
  margin: -15px 0 0 6px;
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

/* 描述区域 */
.pack-description {
  width: 100%;
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--theme-text-primary);
  font-style: italic;
  line-height: 1.5;
  text-align: left;
  position: relative;
  z-index: 1;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* 采用纵向布局，合并为一张卡片 */
@media (max-width: 650px) {
  /* 将 container 作为统一的卡片容器 */
  .pack-card-container {
    width: 100%;
    max-width: 100%;
    background-color: var(--theme-bg-secondary);
    border-radius: var(--radius-md);
    box-shadow: 0 0 0.75rem var(--theme-shadow-base);
    border: 1px solid var(--theme-border);
    padding: var(--spacing-sm);
    overflow: hidden;
    position: relative;
  }

  .pack-card-container::before {
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
    z-index: 0;
  }

  /* 将 wrapper 作为内容区域 */
  .pack-card-wrapper {
    flex-direction: column;
    align-items: stretch;
    background-color: transparent;
    border-radius: 0;
    box-shadow: none;
    border: none;
    padding: 0;
    position: relative;
    z-index: 1;
  }

  /* 图片区域 */
  .pack-card-part-left {
    width: 100%;
    max-width: 100%;
    margin-bottom: 0;
    align-self: stretch;
    position: relative;
    border-radius: var(--radius-sm);
    box-shadow: none;
    z-index: 1;
  }

  .pack-image,
  .image-placeholder {
    width: 100%;
    height: auto;
    aspect-ratio: 150 / 110;
    border-radius: var(--radius-sm);
  }

  .pack-display-name {
    display: block;
    width: 100%;
    position: absolute;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    padding: 4px 8px;
    height: 24px;
    border-radius: 0 0 var(--radius-sm) var(--radius-sm);
  }

  /* 信息区域 */
  .pack-info {
    width: 100%;
    margin-left: 0;
    margin-top: var(--spacing-sm);
    height: auto;
    min-height: 100px;
    flex-direction: column;
    padding: var(--spacing-sm) 0;
    background-color: transparent;
    border-radius: 0;
    box-shadow: none;
    border: none;
    position: relative;
    z-index: 1;
  }

  .pack-info::before {
    display: none;
  }

  .pack-info-text {
    width: 100%;
    min-width: auto;
    margin: 0 0 var(--spacing-sm);
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    height: auto;
  }

  .pack-chart-line {
    width: 100%;
    flex: 1;
    background: transparent;
    position: relative;
  }

  /* 恢复渐变分割线 */
  .pack-chart-line::before {
    display: block;
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
  }

  .pack-line-bar {
    max-width: calc(100% - 80px);
  }

  /* 表格区域 */
  .pack-contents-table {
    width: calc(100% + var(--spacing-sm) * 2);
    margin: var(--spacing-sm) calc(-1 * var(--spacing-sm)) 0;
    background-color: transparent;
    border-radius: 0;
    box-shadow: none;
    border: none;
    border-top: 1px solid var(--theme-border);
    position: relative;
    z-index: 1;
  }

  .pack-contents-table.expanded {
    margin-top: var(--spacing-sm);
  }

  .pack-contents-header {
    border-bottom: 1px solid var(--theme-border);
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--theme-decorative-overlay-light) 50%,
      transparent 100%
    );
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .pack-description {
    width: 100%;
    margin-top: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}
</style>
