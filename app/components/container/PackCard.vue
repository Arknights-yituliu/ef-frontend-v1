<template>
  <div
    class="pack-card-container"
    :class="{
      'pack-card-container-expanded': isExpanded,
      'pack-card-container-hidden': props.isHidden,
    }"
  >
    <div class="pack-card-wrapper" @click="toggleExpanded">
      <v-btn
        v-if="isExpanded"
        class="pack-visibility-button"
        :class="{
          'pack-visibility-button-confirm': hideConfirmationPending,
          'pack-visibility-button-restore': props.isHidden,
        }"
        density="compact"
        :prepend-icon="
          props.isHidden
            ? 'mdi-eye-outline'
            : hideConfirmationPending
              ? 'mdi-alert-outline'
              : 'mdi-eye-off-outline'
        "
        size="small"
        variant="flat"
        @click.stop="handleVisibilityButtonClick"
      >
        {{
          $t(
            props.isHidden
              ? 'component.packCard.restorePack'
              : hideConfirmationPending
                ? 'component.packCard.confirmHidePack'
                : 'component.packCard.hidePack',
          )
        }}
      </v-btn>

      <!-- 左侧：图片、价格和标题 -->
      <div class="pack-card-left">
        <!-- 背景图 - 铺满整个左侧区域 -->
        <div class="pack-background-image-wrapper">
          <img
            v-if="props.backgroundImageUrl"
            alt=""
            class="pack-background-image"
            :src="props.backgroundImageUrl"
          />
        </div>

        <!-- 左上：价格和前景图 -->
        <div class="pack-card-left-top">
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
        </div>

        <!-- 左下：组合包名称区域 -->
        <div class="pack-card-left-bottom">
          <span>{{ packDisplayName }}</span>
        </div>
      </div>

      <!-- 右侧：信息区域 -->
      <div class="pack-card-right">
        <!-- 价值信息 -->
        <div class="pack-info-text">
          <div class="value-stone">
            {{ $t('component.packCard.equivalent') }}
            {{
              getPackStoneEquivalent(props, props.weaponQuotaBaseline).toFixed(1)
            }}
            {{ $t('component.packCard.stone') }}
            <br />
            ￥{{ getPackPricePerStone(props, props.weaponQuotaBaseline).toFixed(1) }} /
            {{ $t('component.packCard.stone') }}
          </div>
          <div v-if="showWeaponSummary" class="value-weapon">
            {{ $t('component.packCard.total') }}
            {{ getPackTotalWeaponQuota(props).toFixed(0) }}
            {{ $t('component.packCard.weaponQuota') }}
            <br />
            ￥{{ getPackPricePerWeaponClaim(props).toFixed(1) }} /
            {{ $t('component.packCard.weaponClaim') }}
          </div>
          <div v-else-if="getPackTotalPulls(props) > 0" class="value-pull">
            {{ $t('component.packCard.total') }} {{ getPackTotalPulls(props).toFixed(1) }}
            {{ $t('component.packCard.pulls') }}
            <br />
            ￥{{ getPackPricePerPull(props).toFixed(1) }} / {{ $t('component.packCard.pull') }}
          </div>
        </div>

        <!-- 对比条 -->
        <div class="pack-chart-line">
          <div
            v-for="bar in getPackComparisonBars(props)"
            :key="bar.key"
            class="pack-chart-line-item"
          >
            <div class="pack-chart-line-label">
              <span>{{ bar.barLabel }}</span>
            </div>
            <div
              class="pack-line-bar"
              :style="{
                backgroundColor: bar.color,
                width: `${bar.percentage * 5}em`,
              }"
            >
              <span :style="{ color: bar.textColor }">
                {{ (bar.percentage * 100).toFixed(0) }}%
              </span>
            </div>
          </div>
        </div>

        <!-- 倒计时（右下角） -->
        <!-- <div class="pack-info-countdown" v-if="props.countdownDays > 0">
          {{ countdownText }}
        </div> -->
      </div>
    </div>

    <!-- 描述 - 只在未展开时显示 -->
    <p v-if="packDescription && !isExpanded" class="pack-description">
      <span
        ><em>{{ packDescription }}</em></span
      >
    </p>

    <!-- 展开的内容表格 - 藏在卡片背后 -->
    <div class="pack-contents-table" :class="{ expanded: isExpanded }">
      <table class="contents-table">
        <colgroup>
          <col class="col-item-name" />
          <col class="col-quantity" />
          <col class="col-total-value" />
          <col class="col-percentage" />
        </colgroup>
        <thead>
          <tr>
            <th>{{ $t('component.packCard.itemName') }}</th>
            <th>{{ $t('component.packCard.quantity') }}</th>
            <th>{{ $t('component.packCard.totalValue') }}</th>
            <th>{{ $t('component.packCard.percentage') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(content, index) in sortedContents" :key="index">
            <td>{{ getItemName(content.itemId) }}</td>
            <td>{{ content.quantity }}</td>
            <td>
              {{ getItemBundleAllItemsValue(content, props.weaponQuotaBaseline).toFixed(1) }}
            </td>
            <td>
              {{
                (getItemBundleValuePercentage(content, props, props.weaponQuotaBaseline) * 100).toFixed(
                  1,
                )
              }}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PackData, PackGachaMode, WeaponQuotaBaseline } from '@/shared/types/pack';
import {
  getItemBundleAllItemsValue,
  getItemBundleValuePercentage,
  getPackPricePerPull,
  getPackPricePerStone,
  getPackPricePerWeaponClaim,
  getPackPullsEfficiency,
  getPackSanityEfficiency,
  getPackStoneEquivalent,
  getPackTotalPulls,
  getPackTotalWeaponQuota,
  getPackWeaponEfficiency,
  pack648WeaponQuotaBaseline,
} from '@/shared/utils/gameData/pack';

const props = withDefaults(
  defineProps<
    PackData & {
      gachaMode: PackGachaMode;
      isHidden?: boolean;
      weaponQuotaBaseline?: WeaponQuotaBaseline;
    }
  >(),
  {
    isHidden: false,
    weaponQuotaBaseline: () => pack648WeaponQuotaBaseline,
  },
);
const emit = defineEmits<{
  'set-hidden': [packId: string, hidden: boolean];
}>();

const { locale } = useI18n();
const imageError = ref(false);
const isExpanded = ref(false);
const hideConfirmationPending = ref(false);

const packDisplayName = computed(() => {
  return props.displayName[locale.value];
});

const packDescription = computed(() => {
  return props.description?.[locale.value];
});

const sortedContents = computed(() =>
  props.contents.toSorted(
    (a, b) =>
      getItemBundleValuePercentage(b, props, props.weaponQuotaBaseline) -
      getItemBundleValuePercentage(a, props, props.weaponQuotaBaseline),
  ),
);

const showWeaponSummary = computed(
  () =>
    getPackTotalWeaponQuota(props) > 0 &&
    (props.gachaMode === 'weapon' || getPackTotalPulls(props) === 0),
);

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
  hideConfirmationPending.value = false;
}

function handleVisibilityButtonClick() {
  if (props.isHidden) {
    hideConfirmationPending.value = false;
    emit('set-hidden', props.packId, false);
    return;
  }

  if (!hideConfirmationPending.value) {
    hideConfirmationPending.value = true;
    return;
  }

  hideConfirmationPending.value = false;
  emit('set-hidden', props.packId, true);
}

function getPackComparisonBars(pack: PackData) {
  return [
    {
      key: 'allItems',
      barLabel: $t('component.packCard.packSanityEfficiency'),
      percentage: getPackSanityEfficiency(pack, props.weaponQuotaBaseline),
      color: '#f9c74f',
      textColor: '#212121',
    },
    {
      key: 'operator',
      barLabel: $t('component.packCard.packPullsEfficiency'),
      percentage: getPackPullsEfficiency(pack, props.gachaMode === 'operator'),
      color: '#e53935',
      textColor: '#ffffff',
    },
    {
      key: 'weapon',
      barLabel: $t('component.packCard.packWeaponEfficiency'),
      percentage: getPackWeaponEfficiency(
        pack,
        props.gachaMode === 'weapon',
        props.weaponQuotaBaseline,
      ),
      color: '#fb8c00',
      textColor: '#212121',
    },
    {
      key: '648',
      barLabel: $t('component.packCard.648StoneEfficiency'),
      percentage: 1,
      color: '#9e9e9e',
      textColor: '#212121',
    },
  ];
}
</script>

<style scoped>
.pack-card-container {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  /* 屏幕宽 375px -> 字体大小 12px
     屏幕宽 600px -> 字体大小 16px */
  font-size: clamp(10px, calc(5.33333333px + 1.77777777vw), 16px);
  line-height: 1;
}

.pack-visibility-button {
  position: absolute;
  top: 0;
  right: 0.5em;
  z-index: 0;
  height: 26px !important;
  min-width: 0;
  padding-inline: 8px !important;
  transform: translateY(-50%);
  border: 1px solid var(--theme-border);
  border-radius: var(--radius-sm);
  background-color: var(--theme-bg-secondary);
  color: var(--theme-text-primary);
  font-size: 12px;
  letter-spacing: 0;
  box-shadow: 0 2px 6px var(--theme-shadow-base);
  animation: pack-visibility-button-in var(--transition-base);
}

@keyframes pack-visibility-button-in {
  from {
    opacity: 0;
    transform: translateY(-35%);
  }

  to {
    opacity: 1;
    transform: translateY(-50%);
  }
}

.pack-visibility-button-confirm {
  border-color: #e53935;
  background-color: #e53935;
  color: #ffffff;
}

.pack-visibility-button-restore {
  border-color: #2e7d32;
  background-color: #2e7d32;
  color: #ffffff;
}

.pack-card-wrapper {
  position: relative;
  isolation: isolate;
  z-index: 1;
  display: flex;
  align-items: center;
  max-width: 100%;
  transition:
    transform var(--transition-base),
    filter var(--transition-base);
  cursor: pointer;
}

.pack-card-container-hidden .pack-card-wrapper {
  opacity: 0.55;
}

.pack-card-wrapper:hover {
  transform: translateY(-0.125em);
  filter: brightness(1.02);
}

.pack-card-container-hidden .pack-card-wrapper:hover {
  opacity: 0.75;
}

/* 左侧列容器 */
.pack-card-left {
  position: relative;
  isolation: isolate;
  height: 7.25em;
  width: 11.25em;
  flex-shrink: 2;
  display: flex;
  flex-direction: column;
  z-index: 2;
  overflow: hidden;
  box-shadow: 0 0 0.625em var(--theme-shadow-base);
  /* border: 0.0625em solid var(--theme-border); */
  border-radius: 0.5em;
  transition: transform var(--transition-base);
}

.pack-card-container-expanded .pack-card-left {
  transform: translateY(-0.3125em);
}

/* 背景图 - 铺满整个 left 区域 */
.pack-background-image-wrapper {
  position: absolute;
  inset: 0;
}

.pack-background-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05);
}

/* 左上：价格和前景图 */
.pack-card-left-top {
  position: relative;
  flex: 1;
  min-height: 0;
}

.pack-image {
  height: 100%;
  width: 100%;
  object-fit: cover;
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
  background-size: 0.5em 0.5em;
  background-repeat: repeat;
  opacity: 0.3;
}

.placeholder-icon {
  font-size: 3em;
  opacity: 0.5;
}

/* 价格角标 */
.pack-corner {
  background-color: var(--theme-glass-bg);
  /* 模糊效果和 transition 冲突了，暂时禁用模糊效果 */
  /* backdrop-filter: blur(0.625em); */
  /* -webkit-backdrop-filter: blur(0.625em); */
  position: absolute;
  text-align: center;
  left: -2.25em;
  top: 0.375em;
  transform: rotate(-40deg);
  width: 6.9375em;
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
  background-size: 0.5em 0.5em;
  background-repeat: repeat;
  border-radius: var(--radius-sm);
  pointer-events: none;
}

.price-text {
  font-size: 0.875em;
  font-weight: 700;
  color: var(--theme-text-primary);
  position: relative;
  text-shadow: 0 0.0625em 0.125em var(--theme-glass-text-shadow);
}

/* 标题 */
.pack-card-left-bottom {
  height: 1.5em;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--theme-glass-bg);
  backdrop-filter: blur(0.625em);

  span {
    text-align: center;
    color: var(--theme-text-primary);
    font-size: 0.875em;
    font-weight: 600;
  }
}

/* 右侧信息区域 */
.pack-card-right {
  position: relative;
  z-index: 1;
  display: flex;
  height: 6.625em;
  margin-left: -0.25em;
  background-color: var(--theme-bg-secondary);
  border-radius: 0.5em;
  box-shadow: 0 0 0.625em var(--theme-shadow-base);
  border: 0.0625em solid var(--theme-border);
  overflow: hidden;
}

.pack-card-right::before {
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
  background-size: 0.5em 0.5em;
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

.value-weapon {
  color: #e87900;
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
  width: 4.5em;
  display: flex;
  justify-content: center;
  align-items: center;
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
  margin-block-start: 0.25em;
  margin-inline-start: 0.75em;

  span {
    color: var(--theme-text-secondary);
    font-size: 1em;
  }
}

/* 展开的内容表格 */
.pack-contents-table {
  isolation: isolate;
  display: block;
  width: 32em;
  max-width: 95%;
  height: 0;
  margin-top: -0.5em;
  overflow: hidden;
  background-color: var(--theme-bg-secondary);
  border-radius: 0.5em;
  box-shadow: 0 0 0.625em var(--theme-shadow-base);
  border: 0.0625em solid var(--theme-border);
  opacity: 0;
  transform: translateY(-0.25em);
  transition:
    opacity var(--transition-base),
    transform var(--transition-base);
}

.pack-contents-table.expanded {
  height: unset;
  opacity: 1;
  transform: translateY(0);
}

.col-item-name {
  width: 40%;
  padding: 1em;
}

.col-quantity {
  width: 20%;
}

.col-total-value {
  width: 20%;
}

.col-percentage {
  width: 20%;
}

.contents-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

.contents-table thead {
  background-color: var(--theme-bg-tertiary);
}

.contents-table th {
  padding-block: 0.625em;
  padding-inline: 1em;
  text-align: center;
  font-size: 1em;
  font-weight: 600;
  color: var(--theme-text-primary);
  border-bottom: 0.0625em solid var(--theme-border);
}

.contents-table td {
  padding-block: 0.625em;
  padding-inline: 1em;
  text-align: center;
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
