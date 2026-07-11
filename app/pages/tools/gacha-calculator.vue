<script setup lang="ts">
import type {
  GachaCalculatorUserConfig,
  PieChartData,
  PoolOption,
  Reward,
  RewardStatisticsResultDetail,
  TotalPullsSingle,
} from '@/shared/types/gacha-calculator';
import { addReward, getRewardPull, normalizeVersionName } from '#shared/utils/gacha-calculator';
import { numberFloor, stringToNumber } from '#shared/utils/numberUtil';
import * as echarts from 'echarts';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { activityReward } from '@/custom/core/gacha/activityReward';

// 奖励引入
import {
  calculatorDailyReward,
  dailyAllRewardTable,
  dailyReward,
  poolStartDate,
  updateFreeMonthlyPass,
  weekTaskReward,
} from '@/custom/core/gacha/dailyReward';
import gachaProbabilityTable from '@/custom/core/gacha/data/gacha_probability_table.json';
import PoolInfoTable from '@/custom/core/gacha/data/pool_info_table.json';
import VersionTable from '@/custom/core/gacha/data/version_table.json';

import {
  authorityLevelUpReward,
  authorityLevelUpRewardTable,
  permanentRewardTable,
} from '@/custom/core/gacha/permanentRewardV2';

import { gachaResourceStatisticsResult } from '@/custom/core/gacha/resourceStatisticsResult';

import { packs } from '@/custom/core/packs';



// 当前路由
const route = useRoute();
const router = useRouter();

const { t } = useI18n();

usePageSeo({
  title: () => `${t('page.tools.gachaCalculator.title')} - ${t('layout.siteName')}`,
  description: () => t('page.tools.gachaCalculator.underDevelopment'),
});

//
const leftPartPanel = ref<string[]>(['statisticalResult', 'controlPanel', 'dev']);
// 'existing', 'daily','activity,'regional', 'level', 'regional','permanent'
const rightPartPanel = ref<string[]>(['existing', 'daily', 'activity']);

const poolOptions = ref<PoolOption[]>([]);

const displayPoolOptions = ref<string[]>([]);

/**
 * 初始化卡池选项
 *
 * */
function initPoolOptions() {
  for (const pool of PoolInfoTable) {
    const poolOption: PoolOption = {
      name: `${pool.poolName}卡池`,
      start: new Date(pool.poolStart),
      end: new Date(pool.poolEnd),
      dateText: pool.poolDateStr,
      type: pool.poolName,
      disabled: false,
    };
    poolOptions.value.push(poolOption);
    if (poolOption.end.getTime() > Date.now()) {
      displayPoolOptions.value.push(poolOption.name);
    }
  }

  const poolOption: PoolOption = {
    name: '敬请期待',
    start: new Date('2026/06/05 12:00:00'),
    end: new Date('2026/06/23 12:00:00'),
    dateText: '',
    type: '敬请期待',
    disabled: true,
  };

  const allVersionOption: PoolOption = {
    name: '所有版本',
    start: new Date('2026/01/22 12:00:00'),
    end: new Date('2026/12/31 12:00:00'),
    dateText: '',
    type: '所有版本',
    disabled: true,
  };

  poolOptions.value.push(poolOption, allVersionOption);
}

//  {
//     name: '待定',
//     color: '#FA5B81',
//     start: new Date('2026/02/24 12:00:00'),
//     end: new Date('2026/03/12 12:00:00'),
//     dateText: '',
//     type: '热烈色彩',
//     disabled: true,
//   },

const currentPool = ref<PoolOption>({
  name: '轻飘飘的信使',
  start: new Date('2026/02/07 12:00:00'),
  end: new Date('2026/02/24 12:00:00'),
  dateText: '02.07——02.24',
  type: '轻飘飘的信使',
  disabled: false,
});

// let startDate: Date = new Date();

const devStartDate = ref(new Date());

const currentMode = ref('normal');
const devModeTriggerClicks = ref(0);
const devModeTriggerThreshold = 8;
const devDebugGreenBackground = ref(false);
const devDebugHideCardShadow = ref(false);
const devDebugHideWarning = ref(false);
const devDebugHideProbability = ref(false);
const isDevScreenshotCapturing = ref(false);
const devScreenshotStatus = ref('');
const GACHA_CALCULATOR_SCREENSHOT_SCALE = 4;
const GACHA_CALCULATOR_SCREENSHOT_STAGE_ATTR = 'data-gacha-screenshot-stage';
const rightPanelScreenshotTargets = [
  { value: 'existing', label: '库存与寻访情报书' },
  { value: 'daily', label: '日常积累' },
  { value: 'activity', label: '版本限时活动' },
  { value: 'permanent-re', label: '常驻奖励' },
  { value: 'recharge', label: '氪金资源' },
  { value: 'debug', label: 'debug' },
] as const;
const leftPanelScreenshotTargets = [
  { value: 'statistical-result', label: '总览卡片' },
  { value: 'arsenal-quota', label: '武库配额估算' },
  { value: 'control-panel', label: '控制面板' },
] as const;
type RightPanelScreenshotTargetValue = (typeof rightPanelScreenshotTargets)[number]['value'];
type LeftPanelScreenshotTargetValue = (typeof leftPanelScreenshotTargets)[number]['value'];
let devScreenshotStatusTimer: number | null = null;
let devScreenshotStageIndex = 0;

/**
 * 同步当前模式从路由参数
 *
 * */
function syncCurrentModeFromRoute() {
  currentMode.value = route.query.mode === 'dev' ? 'dev' : 'normal';
  if (currentMode.value !== 'dev') {
    devModeTriggerClicks.value = 0;
  }
}

/**
 * 点击触发开发模式
 *
 * */
function triggerDevModeByDailyReward() {
  if (currentMode.value === 'dev') {
    return;
  }

  devModeTriggerClicks.value += 1;
  if (devModeTriggerClicks.value >= devModeTriggerThreshold) {
    currentMode.value = 'dev';
    void router.replace({
      path: route.path,
      query: {
        ...route.query,
        mode: 'dev',
      },
    });
  }
}

/**
 * 开发模式下，调试开始日期
 *
 * @param date 开始日期
 * */
function startDateDebug() {
  const newDate = new Date(devStartDate.value);
  newDate.setHours(12, 0, 0, 0);

  poolStartDate.value = newDate;
  calc();
}

function clearDevScreenshotStatusTimer() {
  if (devScreenshotStatusTimer !== null) {
    window.clearTimeout(devScreenshotStatusTimer);
    devScreenshotStatusTimer = null;
  }
}

function setDevScreenshotStatus(message: string, autoClear = true) {
  devScreenshotStatus.value = message;
  clearDevScreenshotStatusTimer();
  if (autoClear) {
    devScreenshotStatusTimer = window.setTimeout(() => {
      devScreenshotStatus.value = '';
      devScreenshotStatusTimer = null;
    }, 3000);
  }
}

function getRightPanelScreenshotTargetLabel(target: RightPanelScreenshotTargetValue) {
  return rightPanelScreenshotTargets.find((item) => item.value === target)?.label ?? target;
}

function getLeftPanelScreenshotTargetLabel(target: LeftPanelScreenshotTargetValue) {
  return leftPanelScreenshotTargets.find((item) => item.value === target)?.label ?? target;
}

function getGachaScreenshotTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function waitForNextFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

async function waitForGachaScreenshotAssets(element: HTMLElement) {
  const imageLoadPromises = Array.from(element.querySelectorAll('img'))
    .filter((image) => !image.complete)
    .map(
      (image) =>
        new Promise<void>((resolve) => {
          image.addEventListener('load', () => resolve(), { once: true });
          image.addEventListener('error', () => resolve(), { once: true });
        }),
    );

  await Promise.all([document.fonts?.ready.catch(() => undefined), ...imageLoadPromises]);
}

function getGachaScreenshotElementSize(element: HTMLElement) {
  const rect = element.getBoundingClientRect();

  return {
    height: Math.ceil(Math.max(rect.height, element.scrollHeight, element.offsetHeight)),
    width: Math.ceil(Math.max(rect.width, element.scrollWidth, element.offsetWidth)),
  };
}

function copyVueScopeAttributes(source: Element | null, target: Element) {
  if (!source) {
    return;
  }

  for (const attribute of source.attributes) {
    if (attribute.name.startsWith('data-v-')) {
      target.setAttribute(attribute.name, attribute.value);
    }
  }
}

function createGachaScreenshotStage(sourceElement: HTMLElement) {
  const sourceRect = sourceElement.getBoundingClientRect();
  const sourceWidth = Math.ceil(sourceRect.width || sourceElement.offsetWidth);
  const appContainer = document.querySelector<HTMLElement>('.gacha-calculator-container');
  const isRightColumn = sourceElement.classList.contains('gacha-calculator-container-right');
  const capturePadding = isRightColumn ? 0 : 8;
  const captureWidth = sourceWidth + capturePadding * 2;
  const stageId = `${Date.now()}-${(devScreenshotStageIndex += 1)}`;
  const stage = document.createElement('div');
  const rightColumn = isRightColumn
    ? (sourceElement.cloneNode(true) as HTMLElement)
    : document.createElement('div');
  const target = isRightColumn ? rightColumn : (sourceElement.cloneNode(true) as HTMLElement);
  const style = document.createElement('style');

  copyVueScopeAttributes(appContainer, stage);
  copyVueScopeAttributes(document.querySelector('.gacha-calculator-container-right'), rightColumn);

  stage.className = [
    'gacha-calculator-container',
    'gacha-calculator-screenshot-stage',
    appContainer?.classList.contains('gacha-calculator-container-debug-green')
      ? 'gacha-calculator-container-debug-green'
      : '',
    appContainer?.classList.contains('gacha-calculator-container-debug-no-shadow')
      ? 'gacha-calculator-container-debug-no-shadow'
      : '',
    appContainer?.classList.contains('gacha-calculator-container-debug-no-warning')
      ? 'gacha-calculator-container-debug-no-warning'
      : '',
    appContainer?.classList.contains('gacha-calculator-container-debug-no-probability')
      ? 'gacha-calculator-container-debug-no-probability'
      : '',
  ]
    .filter(Boolean)
    .join(' ');
  stage.setAttribute(GACHA_CALCULATOR_SCREENSHOT_STAGE_ATTR, stageId);
  stage.style.cssText = [
    'position: fixed',
    'left: 0',
    'top: 0',
    'z-index: 2147483647',
    'display: block',
    'width: auto',
    'max-width: none',
    'height: auto',
    'max-height: none',
    'margin: 0',
    'padding: 0',
    'overflow: visible',
    'pointer-events: none',
    'opacity: 0',
    'transform: none',
  ].join(';');

  rightColumn.classList.add('gacha-calculator-container-right');
  rightColumn.style.cssText = [
    `width: ${captureWidth}px`,
    'max-width: none',
    'max-height: none',
    'height: auto',
    'position: static',
    'top: auto',
    'overflow: visible',
    'overscroll-behavior: auto',
    `padding: ${isRightColumn ? '0 8px 8px' : `${capturePadding}px`}`,
    'box-sizing: border-box',
    'scrollbar-width: none',
    '-ms-overflow-style: none',
    'transform: none',
  ].join(';');

  target.style.width = `${sourceWidth}px`;
  target.style.maxWidth = 'none';
  target.style.maxHeight = 'none';
  target.style.overflow = 'visible';
  target.style.position = 'relative';
  target.style.top = 'auto';
  target.style.left = 'auto';
  target.style.margin = '0';
  target.style.opacity = '1';
  target.style.pointerEvents = 'auto';
  target.style.transform = 'none';

  style.textContent = `
    .gacha-calculator-screenshot-stage,
    .gacha-calculator-screenshot-stage * {
      animation: none !important;
      transition: none !important;
    }
    .gacha-calculator-screenshot-stage .gacha-calculator-container-right::-webkit-scrollbar {
      display: none !important;
    }
    .gacha-calculator-screenshot-stage .gacha-calculator-sticky-summary-panel {
      position: relative !important;
      top: auto !important;
      left: auto !important;
      right: auto !important;
      width: auto !important;
      transform: none !important;
      z-index: auto !important;
    }
    .gacha-calculator-screenshot-stage .v-expansion-panel__shadow {
      display: none !important;
    }
    .gacha-calculator-screenshot-stage:not(.gacha-calculator-container-debug-no-shadow) .v-expansion-panel {
      box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3) !important;
    }
    .gacha-calculator-screenshot-stage .gacha-calculator-card-title {
      box-shadow: none !important;
    }
    .gacha-calculator-screenshot-stage .gacha-calculator-card-title[aria-expanded='true'] {
      border-bottom: 1px solid var(--gacha-calculator-border) !important;
    }
  `;

  if (!isRightColumn) {
    rightColumn.append(target);
  }

  stage.append(style, rightColumn);
  document.body.append(stage);

  return {
    captureElement: rightColumn,
    stageId,
    stage,
    target,
  };
}

async function downloadCanvasAsPng(canvas: HTMLCanvasElement, fileName: string) {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) {
        resolve(result);
      } else {
        reject(new Error('截图生成失败'));
      }
    }, 'image/png');
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function captureGachaCalculatorScreenshot(
  element: HTMLElement,
  label: string,
  fileKey: string,
) {
  if (typeof window === 'undefined' || isDevScreenshotCapturing.value) {
    return;
  }

  isDevScreenshotCapturing.value = true;
  setDevScreenshotStatus(`正在截取${label}...`, false);

  let screenshotStage: ReturnType<typeof createGachaScreenshotStage> | null = null;
  try {
    const { default: html2canvas } = await import('html2canvas');
    await nextTick();
    await waitForNextFrame();
    screenshotStage = createGachaScreenshotStage(element);
    await waitForNextFrame();
    const captureElement = screenshotStage.captureElement;
    await waitForGachaScreenshotAssets(captureElement);
    const screenshotSize = getGachaScreenshotElementSize(captureElement);
    const canvas = await html2canvas(captureElement, {
      backgroundColor: null,
      height: screenshotSize.height,
      imageTimeout: 20_000,
      logging: false,
      onclone: (clonedDocument) => {
        const clonedStage = clonedDocument.querySelector<HTMLElement>(
          `[${GACHA_CALCULATOR_SCREENSHOT_STAGE_ATTR}="${screenshotStage?.stageId}"]`,
        );

        if (clonedStage) {
          clonedStage.style.opacity = '1';
          clonedStage.style.zIndex = '0';
        }
      },
      scale: GACHA_CALCULATOR_SCREENSHOT_SCALE,
      scrollX: 0,
      scrollY: 0,
      useCORS: true,
      width: screenshotSize.width,
      windowHeight: screenshotSize.height + 32,
      windowWidth: screenshotSize.width + 32,
    });
    await downloadCanvasAsPng(
      canvas,
      `gacha-calculator-${fileKey}-${getGachaScreenshotTimestamp()}.png`,
    );
    setDevScreenshotStatus(`已下载${label}截图`);
  } catch (error) {
    console.error('Failed to capture gacha calculator screenshot:', error);
    setDevScreenshotStatus(`${label}截图失败`);
  } finally {
    screenshotStage?.stage.remove();
    isDevScreenshotCapturing.value = false;
  }
}

async function captureRightPanelScreenshot(target?: RightPanelScreenshotTargetValue) {
  if (typeof window === 'undefined' || isDevScreenshotCapturing.value) {
    return;
  }

  const selector = target
    ? `[data-gacha-screenshot-target="${target}"]`
    : '.gacha-calculator-container-right';
  const element = document.querySelector<HTMLElement>(selector);
  const label = target ? getRightPanelScreenshotTargetLabel(target) : '整个右栏';
  if (!element) {
    setDevScreenshotStatus(`未找到${label}`);
    return;
  }

  await captureGachaCalculatorScreenshot(element, label, target ?? 'right-column');
}

async function captureLeftPanelScreenshot(target: LeftPanelScreenshotTargetValue) {
  if (typeof window === 'undefined' || isDevScreenshotCapturing.value) {
    return;
  }

  const element = document.querySelector<HTMLElement>(
    `[data-gacha-left-screenshot-target="${target}"]`,
  );
  const label = getLeftPanelScreenshotTargetLabel(target);
  if (!element) {
    setDevScreenshotStatus(`未找到${label}`);
    return;
  }

  await captureGachaCalculatorScreenshot(element, label, `left-${target}`);
}

/**
 * 选择卡池
 *
 * @param option 卡池选项
 * */
function selectedPool(option: PoolOption): void {
  if ('敬请期待' === option.name) {
    return;
  }
  currentPool.value = option;
  calc();
}

/**
 * 计算奖励
 *
 * */
function calc() {
  calculatorDailyReward(poolStartDate.value, currentPool.value.end);
  existingRewardStatistics();
  dailyRewardStatistics();
  activityRewardStatistics();
  permanentRewardStatistics();
  rechargeResourceStatistics();
  allRewardStatisticsV2();
}

/**
 * 用户配置对象
 *
 * */
const gachaCalculatorUserConfig = ref<GachaCalculatorUserConfig>({
  existingResource: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
  buttonActive: {},
  buttonGroupActive: {},
  rangeSlider: {},
  slider: {},
  versionVisible: {},
});

/**
 * 保存用户配置
 *
 * */
function saveGachaCalculatorUserConfig() {
  localStorage.setItem(
    'Gacha_Calculator_User_Config',
    JSON.stringify(gachaCalculatorUserConfig.value),
  );
}

/**
 * 库存计算相关代码起始
 */

/**
 * 库存对象
 *
 * */
const existingResource = ref<RewardStatisticsResultDetail>({
  name: '库存',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
  ticketgachaLimitedSingle: 0,
});

/**
 * 监听库存对象变化
 *
 * */
watch(
  existingResource,
  (newValue) => {
    gachaCalculatorUserConfig.value.existingResource.originiumRecharge = newValue.originiumRecharge;
    gachaCalculatorUserConfig.value.existingResource.diamond = newValue.diamond;
    gachaCalculatorUserConfig.value.existingResource.ticketgachaStandardSingle =
      newValue.ticketgachaStandardSingle;
    gachaCalculatorUserConfig.value.existingResource.ticketgachaSpecialSingle =
      newValue.ticketgachaSpecialSingle;
    saveGachaCalculatorUserConfig();

    existingRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

/**
 * 寻访情报书对象
 *
 * */
const seekIntelBook = ref({
  id: 'seek_intel_book',
  name: { zh: '寻访情报书', en: 'Seek Intel Book' },
  active: false,
  type: '通用',
  module: '库存',
  version: '通用',
  start: new Date('2026/01/01'),
  end: new Date('2099/12/31'),
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 10,
  },
});

/**
 * 监听寻访情报书对象变化
 *
 * */
watch(
  seekIntelBook,
  (newValue) => {
    saveUserConfig(newValue.id, newValue.active, 'buttonActive');
    existingRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

/**
 * 库存奖励统计结果
 *
 * */
let existingRewardStatisticsResultDetail: RewardStatisticsResultDetail = {
  name: '库存',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
  ticketgachaLimitedSingle: 0,
};

/**
 * 计算库存奖励统计结果
 *
 * */
function existingRewardStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '库存',
    originiumRecharge: existingResource.value.originiumRecharge / 1,
    diamond: existingResource.value.diamond / 1,
    ticketgachaStandardSingle: existingResource.value.ticketgachaStandardSingle / 1,
    ticketgachaSpecialSingle: existingResource.value.ticketgachaSpecialSingle / 1,
    ticketgachaLimitedSingle: seekIntelBook.value.active ? 10 : 0,
  };

  existingRewardStatisticsResultDetail = result;
  gachaResourceStatisticsResult.value.totalPulls.existing = getRewardPull(result);
}

/**
 * 库存计算相关代码结尾
 */

/**
 * 日常奖励计算相关代码起始
 */
updateFreeMonthlyPass();
// 日常奖励重构
watch(
  dailyAllRewardTable,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }

    dailyRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

let dailyRewardStatisticsResultDetail: RewardStatisticsResultDetail = {
  name: '活动奖励',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
  ticketgachaLimitedSingle: 0,
};

function dailyRewardStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '日常奖励',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  };

  addReward(result, dailyReward.value);
  addReward(result, weekTaskReward.value);

  // 日常奖励重构
  for (const reward of dailyAllRewardTable.value) {
    if (shouldDisplayAndCount(reward)) {
      addReward(result, reward);
    }
  }

  dailyRewardStatisticsResultDetail = result;
  gachaResourceStatisticsResult.value.totalPulls.daily = getRewardPull(result);
}

/**
 * 日常奖励计算相关代码结尾
 */

/**
 * 活动奖励计算相关代码起始
 */
watch(
  activityReward,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }

    activityRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

let activityRewardStatisticsResultDetail: RewardStatisticsResultDetail = {
  name: '版本限时活动',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
  ticketgachaLimitedSingle: 0,
};

function activityRewardStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '版本限时活动',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  };

  for (const reward of activityReward.value) {
    if (shouldDisplayAndCount(reward)) {
      addReward(result, reward);
    }
  }

  activityRewardStatisticsResultDetail = result;
  gachaResourceStatisticsResult.value.totalPulls.activity = getRewardPull(result);
}

/**
 * 活动奖励计算相关代码结尾
 */

/**
 * 常驻奖励计算相关代码起始
 */

const authorityLevelProgress = ref<number[]>([60, 60]);

watch(
  authorityLevelProgress,
  (newVal) => {
    let result: number = 0;
    for (const reward of authorityLevelUpRewardTable) {
      if (reward.level > newVal[0]! && reward.level <= newVal[1]!) {
        result += reward.diamond;
      }
    }

    authorityLevelUpReward.value.content.diamond = result;
    saveUserConfig(authorityLevelUpReward.value.id, newVal, 'rangeSlider');

    permanentRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

watch(
  permanentRewardTable,
  (newValue) => {
    for (const item of newValue) {
      saveUserConfig(item.id, item.active, 'buttonGroupActive');
    }

    permanentRewardStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

let permanentRewardStatisticsResultDetail: RewardStatisticsResultDetail = {
  name: '常驻奖励',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
  ticketgachaLimitedSingle: 0,
};

function permanentRewardStatistics(): void {
  const result: RewardStatisticsResultDetail = {
    name: '常驻奖励',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  };
  for (const reward of permanentRewardTable.value) {
    if (rewardMatchesVersion(reward)) {
      addReward(result, reward);
    }
  }

  if (rewardMatchesVersion(authorityLevelUpReward.value)) {
    addReward(result, authorityLevelUpReward.value);
  }

  permanentRewardStatisticsResultDetail = result;
  gachaResourceStatisticsResult.value.totalPulls.permanent = getRewardPull(result);
  gachaResourceStatisticsResult.value.totalPulls.archivePermanent = {
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  };
}

/**
 * 常驻奖励计算相关代码结尾
 */

/**
 * 行动手册奖励计算相关代码结尾
 */

/**
 * 氪金计算相关代码起始
 *
 */

// 氪金资源状态
const rechargeResources = ref<{
  monthlyPass: boolean;
  battlePass: boolean;
  protocolCustomization: boolean;
  monthlyPassDays: number;
  selectedPacks: Record<string, number>;
  originiumStones: Record<string, number>;
}>({
  monthlyPass: false,
  battlePass: false,
  protocolCustomization: false,
  monthlyPassDays: 30,
  selectedPacks: {},
  originiumStones: {},
});

const resourceStatisticsResultDetailList = ref<RewardStatisticsResultDetail[]>([]);

// 计算氪金总金额
const paidResourcesTotalPrice = computed(() => {
  let total = 0;

  // 月卡金额（按天数向上取整计算所需月卡张数）
  if (rechargeResources.value.monthlyPass) {
    const monthlyPack = packs['payshop_giftpack_monthlycard'];
    if (monthlyPack) {
      const monthlyCardCount = Math.ceil(rechargeResources.value.monthlyPassDays / 30);
      total += monthlyPack.price * monthlyCardCount;
    }
  }

  // 协议定制金额（源石配给是免费的）
  if (rechargeResources.value.protocolCustomization) {
    total += 68;
  }

  // 礼包金额
  for (const [packId, quantity] of Object.entries(rechargeResources.value.selectedPacks)) {
    if (quantity > 0) {
      const pack = packs[packId as keyof typeof packs];
      if (pack) {
        total += pack.price * quantity;
      }
    }
  }

  // 普通源石金额
  for (const [stoneId, quantity] of Object.entries(rechargeResources.value.originiumStones)) {
    if (quantity > 0) {
      const stone = packs[stoneId as keyof typeof packs];
      if (stone) {
        total += stone.price * quantity;
      }
    }
  }

  return total;
});

watch(
  rechargeResources,
  () => {
    rechargeResourceStatistics();
    allRewardStatisticsV2();
  },
  { deep: true },
);

let rechargeResourceStatisticsResultDetail: RewardStatisticsResultDetail = {
  name: '氪金资源',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
  ticketgachaLimitedSingle: 0,
};

function resetRechargeResourcesKeepMonthlyPass() {
  rechargeResources.value = {
    monthlyPass: rechargeResources.value.monthlyPass,
    battlePass: false,
    protocolCustomization: false,
    monthlyPassDays: rechargeResources.value.monthlyPassDays,
    selectedPacks: {},
    originiumStones: {},
  };
}

function rechargeResourceStatistics(): void {
  const remainingDays = calculateDaysDifference(poolStartDate.value, currentPool.value.end);

  const result: RewardStatisticsResultDetail = {
    name: '氪金资源',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  };

  // 计算月卡
  if (rechargeResources.value.monthlyPass) {
    const monthlyPack = packs['payshop_giftpack_monthlycard'];
    if (monthlyPack) {
      result.originiumRecharge += numberFloor((12 / 30) * remainingDays, 0); // 一次性12源石
      result.diamond += numberFloor(remainingDays, 0) * 200; // 每天200嵌晶玉
    }
  }

  // 计算源石配给（3源石，免费）
  if (rechargeResources.value.battlePass) {
    result.originiumRecharge += 3;
  }

  // 计算协议定制（36源石，68元）
  if (rechargeResources.value.protocolCustomization) {
    result.originiumRecharge += 36;
  }

  // 计算选中的礼包
  for (const [packId, quantity] of Object.entries(rechargeResources.value.selectedPacks)) {
    if (quantity > 0 && packs[packId as keyof typeof packs]) {
      const pack = packs[packId as keyof typeof packs];
      if (pack && pack.contents) {
        for (const item of pack.contents) {
          const itemId = item.itemId;
          if (itemId === 'item_originium_recharge') {
            result.originiumRecharge += item.quantity * quantity;
          } else if (itemId === 'item_diamond') {
            result.diamond += item.quantity * quantity;
          } else if (itemId.includes('ticketgacha_special_single')) {
            if (itemId.includes('_lt_')) {
              result.ticketgachaLimitedSingle += item.quantity * quantity;
            } else {
              result.ticketgachaSpecialSingle += item.quantity * quantity;
            }
          } else if (itemId.includes('ticketgacha_standard_single')) {
            result.ticketgachaStandardSingle += item.quantity * quantity;
          } else if (itemId.includes('ticketgacha_special_ten')) {
            result.ticketgachaSpecialSingle += item.quantity * 10 * quantity;
          } else if (itemId.includes('ticketgacha_standard_ten')) {
            result.ticketgachaStandardSingle += item.quantity * 10 * quantity;
          }
        }
      }
    }
  }

  // 计算源石
  for (const [stoneId, quantity] of Object.entries(rechargeResources.value.originiumStones)) {
    if (quantity > 0 && packs[stoneId as keyof typeof packs]) {
      const stone = packs[stoneId as keyof typeof packs];
      if (stone && stone.contents) {
        for (const item of stone.contents) {
          if (item.itemId === 'item_originium_recharge') {
            result.originiumRecharge += item.quantity * quantity;
          }
        }
      }
    }
  }

  rechargeResourceStatisticsResultDetail = result;
  gachaResourceStatisticsResult.value.totalPulls.recharge = getRewardPull(result);
}

/**
 * 氪金计算相关代码结尾
 */

const totalResourceStatisticsResultDetail = ref<RewardStatisticsResultDetail>({
  name: '全部资源',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
  ticketgachaLimitedSingle: 0,
});

const gachaProbability = ref(0);

function allRewardStatisticsV2(): void {
  const list: RewardStatisticsResultDetail[] = [
    existingRewardStatisticsResultDetail,
    dailyRewardStatisticsResultDetail,
    activityRewardStatisticsResultDetail,
    permanentRewardStatisticsResultDetail,
    rechargeResourceStatisticsResultDetail,
  ];

  const result: RewardStatisticsResultDetail = {
    name: '共计',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  };

  for (const item of list) {
    result.originiumRecharge += item.originiumRecharge;
    result.diamond += item.diamond;
    result.ticketgachaStandardSingle += item.ticketgachaStandardSingle;
    result.ticketgachaSpecialSingle += item.ticketgachaSpecialSingle;
    result.ticketgachaLimitedSingle += item.ticketgachaLimitedSingle;
  }

  totalResourceStatisticsResultDetail.value = result;

  gachaResourceStatisticsResult.value.totalPulls.total = getRewardPull(result);

  list.push(result);

  resourceStatisticsResultDetailList.value = list;

  pieChartData = [];
  for (const key in gachaResourceStatisticsResult.value.totalPulls) {
    const totalPullsSingle: TotalPullsSingle = gachaResourceStatisticsResult.value.totalPulls[
      key
    ] as TotalPullsSingle;
    if (totalPullsSingle === undefined) {
      continue;
    }
    const value: number =
      (totalPullsSingle.ticketgachaSpecialSingle || 0) +
      (totalPullsSingle.ticketgachaLimitedSingle || 0);

    if ('total' === key || value === 0) {
      continue;
    }
    pieChartData.push({
      value: numberFloor(value),
      name: t(`page.tools.gachaCalculator.${key}`),
    });
  }

  const totalPulls = numberFloor(
    getSpecialAndLimitedPulls(gachaResourceStatisticsResult.value.totalPulls.total),
    0,
  );
  if (totalPulls > 119) {
    gachaProbability.value = 1;
  } else {
    // console.log(totalPulls);
    // console.log(gachaProbabilityTable[totalPulls]);
    gachaProbability.value = gachaProbabilityTable[totalPulls] as number;
  }
  setPieChart(pieChartData);
}

let myChart: any;

// 饼图的数据
let pieChartData: PieChartData[] = [
  { value: 22, name: t('page.tools.gachaCalculator.existing') },
  { value: 33, name: t('page.tools.gachaCalculator.daily') },
  { value: 44, name: t('page.tools.gachaCalculator.activityReward') },
  { value: 22, name: t('page.tools.gachaCalculator.potentialReward') },
  { value: 33, name: t('page.tools.gachaCalculator.permanentReward') },
  { value: 44, name: t('page.tools.gachaCalculator.rechargeReward') },
  { value: 44, name: t('page.tools.gachaCalculator.regionalReward') },
  { value: 44, name: t('page.tools.gachaCalculator.pieChartName') },
];

function setPieChart(data: PieChartData[]) {
  const option = {
    tooltip: {
      confine: true, // 限制 tooltip 在图表容器内显示
      trigger: 'item',
      formatter: (params: any) => {
        // ECharts 饼图的 params 可能是单个对象或数组
        const param = Array.isArray(params) ? params[0] : params;
        // 使用 HTML 换行标签
        return `
          <div>
            <div> ${param.name || ''}</div>
            <div>${param.seriesName || ''}</div>
            <div> ${numberRound(param.percent || 0, 1)}%</div>
          </div>
        `;
      },
    },

    series: [
      {
        name: t('page.tools.gachaCalculator.pieChartName'),
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
  () => [...leftPartPanel.value],
  (newValue) => {
    scheduleSummaryPanelHeightUpdates();
    if (newValue.includes('statisticalResult')) {
      // 等待组件渲染完成
      nextTick(() => {
        // 等待组件渲染完成, 确保元素存在
        const pieElement: HTMLElement | null = document.querySelector(
          '#gacha-calculator-pie-chart',
        );
        // 检查元素是否存在
        if (!pieElement) {
          return;
        }
        // 检查是否已存在实例，避免重复创建
        myChart = echarts.init(pieElement);
        setPieChart(pieChartData);
      });
    }
  },
);

const rangeSliderMap: Record<string, Ref<number[]>> = {
  authority_level_up_reward: authorityLevelProgress,
};

function loadingUserConfig() {
  const localConfigStr = localStorage.getItem('Gacha_Calculator_User_Config');
  if (localConfigStr) {
    try {
      const localConfig: GachaCalculatorUserConfig = JSON.parse(localConfigStr);
      // 使用localConfig
      if (localConfig.rangeSlider) {
        for (const key in localConfig.rangeSlider) {
          const range = localConfig.rangeSlider[key];
          if (range === undefined || !Array.isArray(range)) {
            continue;
          }
          gachaCalculatorUserConfig.value.rangeSlider[key] = range;
          if (rangeSliderMap[key]) {
            rangeSliderMap[key].value = range;
          }
        }
      }

      if (localConfig.buttonActive) {
        gachaCalculatorUserConfig.value.buttonActive = localConfig.buttonActive;

        // 加载寻访情报书状态
        if (localConfig.buttonActive['seek_intel_book'] !== undefined) {
          seekIntelBook.value.active = localConfig.buttonActive['seek_intel_book'] || false;
        }
      }

      if (localConfig.buttonGroupActive) {
        // 日常奖励重构
        _setButtonGroupActive(localConfig.buttonGroupActive, dailyAllRewardTable);

        // 常驻奖励重构
        _setButtonGroupActive(localConfig.buttonGroupActive, permanentRewardTable);

        // 活动奖励
        _setButtonGroupActive(localConfig.buttonGroupActive, activityReward);

        gachaCalculatorUserConfig.value.buttonGroupActive = localConfig.buttonGroupActive;
      }

      if (localConfig.versionVisible) {
        for (const version of versionOptions.value) {
          const visible = localConfig.versionVisible[version];
          if (visible !== undefined) {
            versionVisibleMap.value[version] = visible;
          }
        }
        gachaCalculatorUserConfig.value.versionVisible = {
          ...gachaCalculatorUserConfig.value.versionVisible,
          ...localConfig.versionVisible,
        };
      }

      if (localConfig.existingResource) {
        const localExistingResource = localConfig.existingResource;

        gachaCalculatorUserConfig.value.existingResource.originiumRecharge = stringToNumber(
          localExistingResource.originiumRecharge,
        );
        existingResource.value.originiumRecharge = stringToNumber(
          localExistingResource.originiumRecharge,
        );

        gachaCalculatorUserConfig.value.existingResource.diamond = stringToNumber(
          localExistingResource.diamond,
        );
        existingResource.value.diamond = stringToNumber(localExistingResource.diamond);

        gachaCalculatorUserConfig.value.existingResource.ticketgachaStandardSingle = stringToNumber(
          localExistingResource.ticketgachaStandardSingle,
        );
        existingResource.value.ticketgachaStandardSingle = stringToNumber(
          localExistingResource.ticketgachaStandardSingle,
        );

        gachaCalculatorUserConfig.value.existingResource.ticketgachaSpecialSingle = stringToNumber(
          localExistingResource.ticketgachaSpecialSingle,
        );
        existingResource.value.ticketgachaSpecialSingle = stringToNumber(
          localExistingResource.ticketgachaSpecialSingle,
        );
      }
    } catch (error) {
      console.error('Failed to parse user config:', error);
    }
  }

  /**
   * 设置按钮的激活状态
   * @param statusMap 状态映射对象，键为奖励ID，值为激活状态
   * @param reward 奖励对象的Ref引用
   */
  function _setButtonActive(statusMap: Record<string, boolean>, reward: Ref<Reward>) {
    const rewardValue = reward.value;
    // 检查状态映射中是否存在对应ID的状态
    const status = statusMap[rewardValue.id];
    if (status !== undefined) {
      // 设置激活状态，如果状态为falsy值则设为false
      rewardValue.active = status || false;
    }
  }

  /**
   * 设置按钮组的激活状态
   * @param statusMap 状态映射对象，键为奖励ID，值为激活状态
   * @param rewards 奖励对象数组的Ref引用
   */
  function _setButtonGroupActive(statusMap: Record<string, boolean>, rewards: Ref<Reward[]>) {
    // 获取奖励数组的实际值
    const rewardArray = rewards.value;

    // 遍历奖励数组
    for (const reward of rewardArray) {
      // 检查状态映射中是否存在对应ID的状态
      const status = statusMap[reward.id];
      if (status !== undefined) {
        // 设置激活状态，如果状态为falsy值则设为false
        reward.active = status || false;
      }
    }
  }
}

let summaryPanelResizeObserver: ResizeObserver | null = null;
let summaryPanelHeightUpdateTimers: number[] = [];

function updateSummaryPanelHeight() {
  const container = document.querySelector<HTMLElement>('.gacha-calculator-container');
  const summaryPanel = document.querySelector<HTMLElement>(
    '.gacha-calculator-sticky-summary-panel',
  );
  if (!container || !summaryPanel) {
    return;
  }

  const style = getComputedStyle(summaryPanel);
  const verticalMargin =
    Number.parseFloat(style.marginTop || '0') + Number.parseFloat(style.marginBottom || '0');
  const summaryHeight = summaryPanel.getBoundingClientRect().height + verticalMargin;
  container.style.setProperty('--gacha-calculator-summary-panel-height', `${summaryHeight}px`);
}

function clearSummaryPanelHeightUpdateTimers() {
  for (const timer of summaryPanelHeightUpdateTimers) {
    window.clearTimeout(timer);
  }
  summaryPanelHeightUpdateTimers = [];
}

function scheduleSummaryPanelHeightUpdates() {
  if (typeof window === 'undefined') {
    return;
  }

  clearSummaryPanelHeightUpdateTimers();
  updateSummaryPanelHeight();
  nextTick(() => {
    updateSummaryPanelHeight();
    for (const delay of [80, 180, 320]) {
      summaryPanelHeightUpdateTimers.push(window.setTimeout(updateSummaryPanelHeight, delay));
    }
  });
}

function initSummaryPanelHeightObserver() {
  nextTick(() => {
    scheduleSummaryPanelHeightUpdates();
    const summaryPanel = document.querySelector<HTMLElement>(
      '.gacha-calculator-sticky-summary-panel',
    );
    if (!summaryPanel) {
      return;
    }

    if (typeof ResizeObserver !== 'undefined') {
      summaryPanelResizeObserver = new ResizeObserver(updateSummaryPanelHeight);
      summaryPanelResizeObserver.observe(summaryPanel);
    }
    window.addEventListener('resize', updateSummaryPanelHeight);
  });
}

onMounted( () => {
  initPoolOptions();
  loadingUserConfig();
  const gachaCalculatorPieChart: HTMLElement | null = document.querySelector(
    '#gacha-calculator-pie-chart',
  );
  if (gachaCalculatorPieChart) {
     myChart = echarts.init(gachaCalculatorPieChart);
  }

  setPieChart(pieChartData);
  for (const option of poolOptions.value) {
    if (option.end > new Date()) {
      selectedPool(option);
      break;
    }
  }

  syncCurrentModeFromRoute();
  initSummaryPanelHeightObserver();
});

onUnmounted(() => {
  summaryPanelResizeObserver?.disconnect();
  clearSummaryPanelHeightUpdateTimers();
  clearDevScreenshotStatusTimer();
  window.removeEventListener('resize', updateSummaryPanelHeight);
});

watch(
  () => route.query.mode,
  () => {
    syncCurrentModeFromRoute();
  },
);

function clearOrSelectAll(
  action: boolean,
  type: string,
  reward: Ref<Reward> | Ref<Reward[]> | Ref<number[]>,
  range: number[] = [0, 0],
  targetVersion = selectedVersion.value,
) {
  if ('button' === type) {
    const value = reward.value;
    if (Array.isArray(value)) {
      // 处理 Ref<Reward[]> 类型
      for (const item of value) {
        if (
          typeof item === 'object' &&
          item !== null &&
          'active' in item &&
          isRewardMatchedVersion(item, targetVersion)
        ) {
          item.active = action;
        }
      }
    } else if (
      typeof value === 'object' &&
      value !== null &&
      'active' in value && // 处理 Ref<Reward> 类型
      isRewardMatchedVersion(value, targetVersion)
    ) {
      value.active = action;
    }
    // 忽略 Ref<number[]> 类型
  }

  if ('rangeSlider' === type) {
    const value = reward.value;

    if (Array.isArray(value) && value.length > 1) {
      value[0] = action ? (range[0] as number) : 0;
      value[1] = action ? (range[1] as number) : 0;
    }
  }
}

// 工具函数

/**
 * 检查奖励是否在当前池子期间内有效
 * @param reward 奖励对象
 * @returns 是否有效
 */

/**
 * 保存用户输入配置
 * @param key {string} 奖励的唯一key
 * @param value {number | boolean | number[] | boolean[]}奖励的状态值
 * @param type {string} 奖励UI类型，奖励类型如下：<br>
 * 如果是按钮填入 'buttonActive'<br>
 * 如果是多个按钮填入 'buttonGroupActive'<br>
 * 如果是普通滑块填入 'slider'<br>
 * 如果是范围滑块填入 'rangeSlider'
 */
function saveUserConfig(
  key: string,
  value: number | number[] | boolean | boolean[],
  type: string,
): void {
  if ('rangeSlider' === type) {
    if (!(Array.isArray(value) && value.length > 0 && typeof value[0] === 'number')) {
      console.log('传入配置非数组类型');
      return;
    }

    value = value as number[];
    if (gachaCalculatorUserConfig.value.rangeSlider === undefined) {
      gachaCalculatorUserConfig.value.rangeSlider = {};
    }
    gachaCalculatorUserConfig.value.rangeSlider[key] = value;
  }

  if ('buttonActive' === type) {
    if (typeof value !== 'boolean') {
      console.log('传入配置非布尔类型');
      return;
    }
    if (gachaCalculatorUserConfig.value.buttonActive === undefined) {
      gachaCalculatorUserConfig.value.buttonActive = {};
    }
    gachaCalculatorUserConfig.value.buttonActive[key] = value;
  }

  if ('buttonGroupActive' === type) {
    if (typeof value !== 'boolean') {
      console.log('传入配置非布尔类型');
      return;
    }
    if (gachaCalculatorUserConfig.value.buttonGroupActive === undefined) {
      gachaCalculatorUserConfig.value.buttonGroupActive = {};
    }

    gachaCalculatorUserConfig.value.buttonGroupActive[key] = value;
  }

  saveGachaCalculatorUserConfig();
}

// 武库配额计算
// 用户持有的标准寻访凭证数量
const arsenalStandardPulls = ref<number>(0);
// 用户持有的特许寻访凭证数量
const arsenalSpecialPulls = ref<number>(0);
// 武库配额系数，默认80，即每抽换算为80武库配额
const arsenalCoefficient = ref<number>(80);
// 源石兑换武库配额的倍率，每1个源石 = 25武库配额
const ARSENAL_ORIGINIUM_QUOTA_RATE = 25;
// 用户输入的源石兑换数量，null表示未输入
const arsenalOriginiumExchange = ref<number | null>(0);

// 实际抽数的计算：标准券 + 特许券，特许券超过30张时额外赠送10抽
const arsenalActualPulls = computed(() => {
  let pulls = arsenalStandardPulls.value + arsenalSpecialPulls.value;
  if (arsenalSpecialPulls.value > 30) {
    pulls += 10;
  }
  return pulls;
});

// 规范化后的源石兑换数量，通过normalizeArsenalOriginiumExchange保证值为非负整数
const arsenalOriginiumExchangeValue = computed(() =>
  normalizeArsenalOriginiumExchange(arsenalOriginiumExchange.value),
);
// 源石兑换产生的武库配额 = 源石数量 × 25
const arsenalOriginiumQuota = computed(
  () => arsenalOriginiumExchangeValue.value * ARSENAL_ORIGINIUM_QUOTA_RATE,
);
// 是否进行了源石兑换，用于控制UI显示
const hasArsenalOriginiumExchange = computed(() => arsenalOriginiumExchangeValue.value > 0);

// 武库配额总结果 = 实际抽数 × 系数 + 源石兑换配额
const arsenalQuotaResult = computed(
  () => arsenalActualPulls.value * arsenalCoefficient.value + arsenalOriginiumQuota.value,
);

// 设置源石兑换数量，自动规范化处理
function setArsenalOriginiumExchange(value: number | null) {
  arsenalOriginiumExchange.value = normalizeArsenalOriginiumExchange(value);
}

// 输入框输入时触发，规范化用户输入并回写至input
function normalizeArsenalOriginiumExchangeInput(event: Event) {
  const input = event.target as HTMLInputElement | null;
  const normalizedValue = normalizeArsenalOriginiumExchange(
    input?.value ?? arsenalOriginiumExchange.value,
  );
  arsenalOriginiumExchange.value = normalizedValue;
  if (input) {
    input.value = String(normalizedValue);
  }
}

// 将源石兑换输入规范化为非负整数，非法值返回0
function normalizeArsenalOriginiumExchange(value: number | string | null | undefined) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return 0;
  }
  return Math.max(0, Math.floor(numericValue));
}

// 监听总计数据变化，自动填入武库配额
watch(
  () => gachaResourceStatisticsResult.value.totalPulls.total,
  () => {
    fillStandardPulls();
    fillSpecialPulls();
  },
  { deep: true, immediate: true },
);

// 填入计算得到的基础凭证抽数
function fillStandardPulls() {
  arsenalStandardPulls.value =
    gachaResourceStatisticsResult.value.totalPulls.total?.ticketgachaStandardSingle || 0;
}

// 填入计算得到的特许凭证抽数
function fillSpecialPulls() {
  arsenalSpecialPulls.value = getSpecialAndLimitedPulls(
    gachaResourceStatisticsResult.value.totalPulls.total,
  );
}

function getSpecialAndLimitedPulls(pullsSignle: TotalPullsSingle | undefined) {
  let pulls = 0;

  pulls += pullsSignle?.ticketgachaSpecialSingle || 0;
  pulls += pullsSignle?.ticketgachaLimitedSingle || 0;

  return numberFloor(pulls, 0);
}

const versionOptions = ref<string[]>([]);
const versionVisibleMap = ref<Record<string, boolean>>({});

for (const version of VersionTable) {
  versionOptions.value.push(version.version);
  versionVisibleMap.value[version.version] = true;
}

const reversedVersionOptions = computed(() => versionOptions.value.toReversed());

const selectedVersion = ref<string>('all');

// 获取奖励对象所关联的版本名称列表
// 通过 reward.version 在全局版本列表中查找匹配项（去空格后比对）
// 返回空数组表示该奖励没有 version 属性（如库存、寻访情报书等不需版本筛选的项）
function getRewardVersionControlVersions(reward: Reward): string[] {
  // 取出奖励的版本字段并去除空格
  const rewardVersion = normalizeVersionName(reward.version);
  // 如果奖励没有版本信息，返回空数组表示不参与版本筛选
  if (!rewardVersion) {
    return [];
  }
  console.log(
    'rewardVersion',
    rewardVersion,
    ';RewardVersionControlVersions',
    versionOptions.value.filter((version) => normalizeVersionName(version) === rewardVersion),
  );
  // 在全局版本列表中查找与奖励版本名匹配的项
  return versionOptions.value.filter((version) => normalizeVersionName(version) === rewardVersion);
}

// 判断某个奖励是否属于指定版本
// version 为 'all' 时匹配全部，用于快捷操作中未选择版本时的全量操作
function isRewardMatchedVersion(reward: Reward, version: string): boolean {
  // 'all' 表示不筛选版本，所有奖励都匹配
  if (version === 'all') {
    return true;
  }

  console.log('debug', getRewardVersionControlVersions(reward));
  // 获取奖励关联的版本列表，检查其中是否有与目标版本匹配的
  return getRewardVersionControlVersions(reward).some(
    (rewardVersion) => normalizeVersionName(rewardVersion) === normalizeVersionName(version),
  );
}

// 检查指定版本是否在控制面板中被用户勾选为"可见"
function isVersionVisible(version: string): boolean {
  // versionVisibleMap 中值为 false 才隐藏，未设置的版本默认为可见
  return versionVisibleMap.value[version] !== false;
}

// 设置某个版本的可见性开关，同时持久化到 localStorage 并触发全量重算
function setVersionVisible(version: string, visible: boolean) {
  // 更新内存中的版本可见性映射
  versionVisibleMap.value[version] = visible;
  // 确保用户配置对象中存在 versionVisible 字段
  if (!gachaCalculatorUserConfig.value.versionVisible) {
    gachaCalculatorUserConfig.value.versionVisible = {};
  }
  // 同步写入用户配置对象
  gachaCalculatorUserConfig.value.versionVisible[version] = visible;
  // 持久化到 localStorage
  saveGachaCalculatorUserConfig();
  // 重新计算全部资源（因为版本可见性变化会影响该版本所有奖励是否计入统计）
  calc();
}

function setVersionRewardsActive(version: string, active: boolean) {
  clearOrSelectAll(active, 'button', dailyAllRewardTable, [0, 0], version);
  clearOrSelectAll(active, 'button', activityReward, [0, 0], version);
  clearOrSelectAll(active, 'button', permanentRewardTable, [0, 0], version);

  if (isRewardMatchedVersion(authorityLevelUpReward.value, version)) {
    authorityLevelProgress.value = active ? [1, 60] : [60, 60];
  }
}

/**
 * 判断奖励是否在时间范围外，即已过期或尚未开始
 * @param reward 奖励对象
 * @returns 是否在时间范围外
 */
function rewardIsExpired(reward: Reward): boolean {
  // 奖励结束时间在当前卡池开始之前：活动已结束
  if (reward.end <= poolStartDate.value) {
    return false;
  }
  // 奖励开始时间在当前卡池结束之后：活动尚未开始
  if (reward.start >= currentPool.value.end) {
    return false;
  }
  return true;
}

/**
 * 判断奖励类型是否匹配当前池子类型
 * @param reward 奖励对象
 * @returns 是否匹配
 */
function rewardMatchesType(reward: Reward): boolean {
  return '通用' === reward.type || reward.type === currentPool.value.type;
}

/**
 * 判断奖励版本是否匹配当前选择的版本
 * @param reward 奖励对象
 * @returns 是否匹配
 */
function rewardMatchesVersion(reward: Reward): boolean {
  return '基础资源' === reward.version || versionVisibleMap.value[reward.version] !== false;
}

/**
 * 判断奖励是否应该在页面上渲染显示
 * @param reward 奖励对象
 * @returns 是否应该在页面上渲染显示
 */

function shouldDisplayAndCount(reward: Reward): boolean {
  return rewardIsExpired(reward) && rewardMatchesType(reward) && rewardMatchesVersion(reward);
}

function resetGachaCalculator() {
  const lastVersion = versionOptions.value.at(-1);
  if (!lastVersion) {
    return;
  }

  for (const version of versionOptions.value) {
    const active = version === lastVersion;
    setVersionVisible(version, active);
    setVersionRewardsActive(version, active);
  }

  calc();
}

// 常驻奖励的分类名称列表，包含五个分类
const permanentRewardCategoryNames = [
  '地图资源',
  '任务',
  '档案采集',
  '蚀像寻遗',
  '新手活动',
  '行动手册',
  '未分类',
] as const;

// 常驻奖励分类名称的类型定义，取permanentRewardCategoryNames数组元素的联合类型
type PermanentRewardCategoryName = (typeof permanentRewardCategoryNames)[number];

// 常驻奖励模块到分类名称的映射表，键为module字段值，值为对应的分类名
const permanentRewardModuleCategoryMap: Record<string, PermanentRewardCategoryName> = {
  地区探索与建设: '地图资源',
  主线任务: '任务',
  支线任务: '任务',
  重要任务: '任务',
  次要任务: '任务',
  功能任务: '任务',
  其他: '档案采集',
  蚀像寻遗刻度: '蚀像寻遗',
  蚀像寻遗储藏箱: '蚀像寻遗',
  蚀像寻遗探索任务: '蚀像寻遗',
  行动手册: '行动手册',
  新手活动: '新手活动',
};

// 根据奖励对象的module字段返回对应的分类名称
function getPermanentRewardCategory(reward: Reward): PermanentRewardCategoryName {
  // 获取奖励的module字段并去除首尾空格
  const module = reward.module?.trim();
  // 如果module为空，则返回"未分类"
  if (!module) {
    return '未分类';
  }
  // 在映射表中查找对应的分类名称，找不到则返回"未分类"
  return permanentRewardModuleCategoryMap[module] ?? '未分类';
}

// 常驻奖励的分组计算结果，将奖励按分类名称分组
const permanentRewardGroups = computed(() => {
  // 合并常驻奖励表、权限等级奖励和归档常驻奖励表
  const rewards = [...permanentRewardTable.value, authorityLevelUpReward.value];
  // 遍历分类名称列表，构建分组对象
  return (
    permanentRewardCategoryNames
      .map((name) => ({
        name,
        // 筛选出属于当前分类的奖励列表
        rewards: rewards.filter((reward) => getPermanentRewardCategory(reward) === name),
      }))
      // 过滤掉没有奖励的分组
      .filter((group) => group.rewards.length > 0)
  );
});

function selectDisplayPoolOptions(poolName: string) {
  displayPoolOptions.value = toggleStringInArray(poolName, displayPoolOptions.value);
}

/**
 * 处理字符串在数组中的存在性判断和插入/删除操作
 * @param str 要处理的字符串
 * @param arr 目标数组
 * @returns 更新后的数组
 */
function toggleStringInArray(str: string, arr: string[]): string[] {
  const index = arr.indexOf(str);
  if (index !== -1) {
    // 字符串存在，删除它
    arr.splice(index, 1);
  } else {
    // 字符串不存在，添加它
    arr.push(str);
  }
  return arr;
}
</script>

<template>
  <section
    class="gacha-calculator-container"
    :class="{
      'gacha-calculator-container-debug-green': currentMode === 'dev' && devDebugGreenBackground,
      'gacha-calculator-container-debug-no-shadow': currentMode === 'dev' && devDebugHideCardShadow,
      'gacha-calculator-container-debug-no-warning': currentMode === 'dev' && devDebugHideWarning,
      'gacha-calculator-container-debug-no-probability':
        currentMode === 'dev' && devDebugHideProbability,
    }"
  >
    <div class="gacha-calculator-container-left">
      <v-expansion-panels v-model="leftPartPanel" multiple>
        <v-expansion-panel
          class="gacha-calculator-sticky-summary-panel"
          data-gacha-left-screenshot-target="statistical-result"
          value="statisticalResult"
        >
          <v-expansion-panel-title class="gacha-calculator-card-title">
            <div>
              {{ t('page.tools.gachaCalculator.total') }}
              {{ gachaResourceStatisticsResult.totalPulls.total?.ticketgachaStandardSingle }}
              {{ t('page.tools.gachaCalculator.standard')
              }}{{ t('page.tools.gachaCalculator.ticketgacha') }}
              {{ getSpecialAndLimitedPulls(gachaResourceStatisticsResult.totalPulls.total) }}
              {{ t('page.tools.gachaCalculator.special')
              }}{{ t('page.tools.gachaCalculator.ticketgacha') }}
              {{ t('page.tools.gachaCalculator.rechargeAmount') }}
              {{ numberFloor(paidResourcesTotalPrice, 2) }}
              {{ t('page.tools.gachaCalculator.yuan') }}
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <div class="gacha-calculator-pool-selector">
              <v-btn
                v-for="option in poolOptions"
                v-show="displayPoolOptions.includes(option.name)"
                :key="option.name"
                class="gacha-calculator-pool-btn"
                :class="{ 'gacha-calculator-pool-btn-active': currentPool.name === option.name }"
                color="rgb(33, 150, 243)"
                @click="selectedPool(option)"
              >
                <span class="gacha-calculator-pool-btn-name">{{ option.name }}</span>
                <span class="gacha-calculator-pool-btn-date">{{ option.dateText }}</span>
              </v-btn>
            </div>

            <!-- 当前时间：{{ dateFormat(poolStartDate) }} -->
            <div class="gacha-calculator-warning">
              《寻遗散记》资源尚在更新中，结果仅供参考，切勿轻信本站！
            </div>

            <div class="gacha-calculator-chart-and-table">
              <div
                id="gacha-calculator-pie-chart"
                ref="gacha-calculator-pie-chart"
                class="gacha-calculator-pie-chart"
              />

              <div class="gacha-calculator-statistics-result">
                <div class="gacha-calculator-statistics-result-item">
                  <img
                    alt="existing"
                    class="gacha-calculator-gacha-item-icon"
                    src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_originium_recharge.png"
                  />
                  <span class="gacha-calculator-statistics-result-item-text">
                    {{ totalResourceStatisticsResultDetail.originiumRecharge }}
                    ({{
                      numberFloor(totalResourceStatisticsResultDetail.originiumRecharge * 0.15, 0)
                    }}
                    {{ t('page.tools.gachaCalculator.pulls') }})
                  </span>
                </div>

                <div class="gacha-calculator-statistics-result-item">
                  <img
                    alt="existing"
                    class="gacha-calculator-gacha-item-icon"
                    src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_diamond.png"
                  />
                  <span class="gacha-calculator-statistics-result-item-text">
                    {{ numberFloor(totalResourceStatisticsResultDetail.diamond, 0) }}
                    ({{ numberFloor(totalResourceStatisticsResultDetail.diamond / 500, 0) }}
                    {{ t('page.tools.gachaCalculator.pulls') }})
                  </span>
                </div>

                <div class="gacha-calculator-statistics-result-item">
                  <img
                    alt="existing"
                    class="gacha-calculator-gacha-item-icon"
                    src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_ticketgacha_standard_single.png"
                  />
                  <span class="gacha-calculator-statistics-result-item-text">
                    {{ totalResourceStatisticsResultDetail.ticketgachaStandardSingle }}
                  </span>
                </div>

                <div class="gacha-calculator-statistics-result-item">
                  <img
                    alt="existing"
                    class="gacha-calculator-gacha-item-icon"
                    src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_ticketgacha_special_single.png"
                  />
                  <span class="gacha-calculator-statistics-result-item-text">
                    {{ totalResourceStatisticsResultDetail.ticketgachaSpecialSingle }}
                  </span>
                </div>

                <div class="gacha-calculator-statistics-result-item">
                  <img
                    alt="existing"
                    class="gacha-calculator-gacha-item-icon"
                    src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_ticketgacha_special_single_lt.png"
                  />
                  <span class="gacha-calculator-statistics-result-item-text">
                    {{ totalResourceStatisticsResultDetail.ticketgachaLimitedSingle }}
                  </span>
                </div>
              </div>
            </div>

            <div v-show="'辉光庆典' !== currentPool.name">
              拿到卡池UP干员的概率：{{ numberFloor(gachaProbability * 100) }}%
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel data-gacha-left-screenshot-target="arsenal-quota" value="arsenalQuota">
          <v-expansion-panel-title class="gacha-calculator-card-title">
            <div>武库配额估算</div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="gacha-calculator-arsenal-quota">
              <div class="gacha-calculator-arsenal-quota-row">
                <label class="gacha-calculator-arsenal-quota-label">基础凭证抽数</label>
                <v-number-input
                  v-model="arsenalStandardPulls"
                  class="gacha-calculator-arsenal-quota-input-field"
                  control-variant="hidden"
                  density="compact"
                  hide-details="auto"
                  variant="solo"
                />
                <v-btn
                  class="gacha-calculator-arsenal-quota-btn"
                  color="primary"
                  size="small"
                  variant="tonal"
                  @click="fillStandardPulls"
                >
                  填入计算得到的抽数
                </v-btn>
              </div>
              <div class="gacha-calculator-arsenal-quota-row">
                <label class="gacha-calculator-arsenal-quota-label">特许凭证抽数</label>
                <v-number-input
                  v-model="arsenalSpecialPulls"
                  class="gacha-calculator-arsenal-quota-input-field"
                  control-variant="hidden"
                  density="compact"
                  hide-details="auto"
                  variant="solo"
                />
                <v-btn
                  class="gacha-calculator-arsenal-quota-btn"
                  color="primary"
                  size="small"
                  variant="tonal"
                  @click="fillSpecialPulls"
                >
                  填入计算得到的抽数
                </v-btn>
              </div>
              <div class="gacha-calculator-arsenal-quota-row">
                <label class="gacha-calculator-arsenal-quota-label">武库配额系数</label>
                <v-number-input
                  v-model="arsenalCoefficient"
                  class="gacha-calculator-arsenal-quota-input-field"
                  control-variant="hidden"
                  density="compact"
                  hide-details="auto"
                  variant="solo"
                />
                <v-btn
                  class="gacha-calculator-arsenal-quota-btn"
                  color="orange"
                  size="small"
                  variant="tonal"
                  @click="arsenalCoefficient = 38"
                >
                  保底值(38)
                </v-btn>
                <v-btn
                  class="gacha-calculator-arsenal-quota-btn"
                  color="blue"
                  size="small"
                  variant="tonal"
                  @click="arsenalCoefficient = 50"
                >
                  期望值(50)
                </v-btn>
                <v-btn
                  class="gacha-calculator-arsenal-quota-btn"
                  color="green"
                  size="small"
                  variant="tonal"
                  @click="arsenalCoefficient = 80"
                >
                  统计值(80)
                </v-btn>
              </div>
              <div class="gacha-calculator-arsenal-quota-row">
                <label class="gacha-calculator-arsenal-quota-label">源石兑换武库配额</label>
                <v-number-input
                  class="gacha-calculator-arsenal-quota-input-field"
                  control-variant="hidden"
                  density="compact"
                  hide-details="auto"
                  :min="0"
                  :model-value="arsenalOriginiumExchange"
                  :precision="0"
                  :step="1"
                  variant="solo"
                  @blur="normalizeArsenalOriginiumExchangeInput"
                  @input="normalizeArsenalOriginiumExchangeInput"
                  @update:model-value="setArsenalOriginiumExchange"
                />
              </div>
              <v-divider style="margin: 0.5rem 0" />
              <div class="gacha-calculator-arsenal-quota-formula">
                <span>
                  实际抽数 × 武库配额系数
                  <template v-if="hasArsenalOriginiumExchange">
                    + 源石数 × {{ ARSENAL_ORIGINIUM_QUOTA_RATE }}
                  </template>
                  = 武库配额
                </span>
              </div>
              <div class="gacha-calculator-arsenal-quota-formula-detail">
                <span class="gacha-calculator-arsenal-quota-formula-num">
                  {{ arsenalActualPulls }}
                </span>
                <span class="gacha-calculator-arsenal-quota-formula-op"> × </span>
                <span class="gacha-calculator-arsenal-quota-formula-num">
                  {{ arsenalCoefficient }}
                </span>
                <template v-if="hasArsenalOriginiumExchange">
                  <span class="gacha-calculator-arsenal-quota-formula-op"> + </span>
                  <span class="gacha-calculator-arsenal-quota-formula-num">
                    {{ arsenalOriginiumExchangeValue }}
                  </span>
                  <span class="gacha-calculator-arsenal-quota-formula-op"> × </span>
                  <span class="gacha-calculator-arsenal-quota-formula-num">
                    {{ ARSENAL_ORIGINIUM_QUOTA_RATE }}
                  </span>
                </template>
                <span class="gacha-calculator-arsenal-quota-formula-op"> = </span>
                <span class="gacha-calculator-arsenal-quota-result-value">
                  {{ arsenalQuotaResult }}
                </span>
              </div>
              <div class="gacha-calculator-arsenal-quota-formula">
                <span>*特许凭证抽数>30时，实际抽数会增加赠送的10连</span>
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel data-gacha-left-screenshot-target="control-panel" value="controlPanel">
          <v-expansion-panel-title class="gacha-calculator-card-title">
            <div>控制面板</div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="gacha-calculator-control-panel">
              <section class="gacha-calculator-control-section">
                <div class="gacha-calculator-control-section-title">重置</div>
                <div class="gacha-calculator-control-actions">
                  <v-btn
                    color="orange"
                    prepend-icon="mdi-refresh"
                    size="small"
                    variant="tonal"
                    @click="resetRechargeResourcesKeepMonthlyPass"
                  >
                    重置月卡以外的氪金项目
                  </v-btn>
                  <v-btn
                    color="red"
                    prepend-icon="mdi-restore"
                    size="small"
                    variant="tonal"
                    @click="resetGachaCalculator"
                  >
                    重置攒抽计算器
                  </v-btn>
                </div>
              </section>
              <section class="gacha-calculator-control-section">
                <div class="gacha-calculator-control-section-title">版本筛选</div>
                <div class="gacha-calculator-version-control-list">
                  <div
                    v-for="option in reversedVersionOptions"
                    :key="option"
                    class="gacha-calculator-version-control-row"
                  >
                    <v-switch
                      class="gacha-calculator-version-control-switch"
                      color="primary"
                      density="compact"
                      hide-details
                      :label="option"
                      :model-value="isVersionVisible(option)"
                      @update:model-value="setVersionVisible(option, !!$event)"
                    />
                    <div class="gacha-calculator-version-control-actions">
                      <v-btn
                        class="gacha-calculator-version-action-btn"
                        color="blue"
                        size="small"
                        variant="tonal"
                        @click="setVersionRewardsActive(option, true)"
                      >
                        全选
                      </v-btn>
                      <v-btn
                        class="gacha-calculator-version-action-btn"
                        color="red"
                        size="small"
                        variant="tonal"
                        @click="setVersionRewardsActive(option, false)"
                      >
                        全不选
                      </v-btn>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel v-show="'dev' === currentMode" value="detail">
          <v-expansion-panel-title class="gacha-calculator-card-title">
            <div>{{ t('page.tools.gachaCalculator.calculationDetail') }}</div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-table class="gacha-calculator-result-detail-table">
              <thead>
                <tr>
                  <th style="font-weight: bolder">奖励来源</th>
                  <th>
                    <img
                      alt="existing"
                      class="gacha-calculator-result-detail-table-icon"
                      src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_originium_recharge.png"
                    />
                  </th>
                  <th>
                    <img
                      alt="existing"
                      class="gacha-calculator-result-detail-table-icon"
                      src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_diamond.png"
                    />
                  </th>
                  <th>
                    <img
                      alt="existing"
                      class="gacha-calculator-result-detail-table-icon"
                      src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_ticketgacha_standard_single.png"
                    />
                  </th>
                  <th>
                    <img
                      alt="existing"
                      class="gacha-calculator-result-detail-table-icon"
                      src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_ticketgacha_special_single.png"
                    />
                  </th>
                  <th>
                    <img
                      alt="existing"
                      class="gacha-calculator-result-detail-table-icon"
                      src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_ticketgacha_special_single_lt.png"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in resourceStatisticsResultDetailList" :key="item.name">
                  <td>{{ item.name }}</td>

                  <td>{{ item.originiumRecharge }}</td>
                  <td>{{ item.diamond }}</td>
                  <td>{{ item.ticketgachaStandardSingle }}</td>
                  <td>{{ item.ticketgachaSpecialSingle }}</td>
                  <td>{{ item.ticketgachaLimitedSingle }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel v-show="'dev' === currentMode" value="dev">
          <v-expansion-panel-title class="gacha-calculator-card-title">
            开发模式
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <div class="gacha-calculator-debug-tools">
              <div class="gacha-calculator-debug-switches">
                <v-switch
                  v-model="devDebugGreenBackground"
                  color="green"
                  density="compact"
                  hide-details
                  label="背景变绿"
                />
                <v-switch
                  v-model="devDebugHideCardShadow"
                  color="primary"
                  density="compact"
                  hide-details
                  label="去掉卡片阴影"
                />
                <v-switch
                  v-model="devDebugHideWarning"
                  color="warning"
                  density="compact"
                  hide-details
                  label="隐藏警告提示"
                />
                <v-switch
                  v-model="devDebugHideProbability"
                  color="warning"
                  density="compact"
                  hide-details
                  label="隐藏概率提示"
                />
              </div>

              <h3>截图调试</h3>
              <div class="gacha-calculator-debug-screenshot-actions">
                <v-btn
                  class="gacha-calculator-debug-screenshot-btn"
                  color="primary"
                  :disabled="isDevScreenshotCapturing"
                  :loading="isDevScreenshotCapturing"
                  prepend-icon="mdi-monitor-screenshot"
                  size="small"
                  variant="tonal"
                  @click="captureRightPanelScreenshot()"
                >
                  整个右栏
                </v-btn>
                <v-btn
                  v-for="target in leftPanelScreenshotTargets"
                  :key="target.value"
                  class="gacha-calculator-debug-screenshot-btn"
                  color="primary"
                  :disabled="isDevScreenshotCapturing"
                  prepend-icon="mdi-view-dashboard"
                  size="small"
                  variant="tonal"
                  @click="captureLeftPanelScreenshot(target.value)"
                >
                  {{ target.label }}
                </v-btn>
                <v-btn
                  v-for="target in rightPanelScreenshotTargets"
                  :key="target.value"
                  class="gacha-calculator-debug-screenshot-btn"
                  color="primary"
                  :disabled="isDevScreenshotCapturing"
                  prepend-icon="mdi-camera"
                  size="small"
                  variant="tonal"
                  @click="captureRightPanelScreenshot(target.value)"
                >
                  {{ target.label }}
                </v-btn>
              </div>
              <v-alert
                v-if="devScreenshotStatus"
                class="gacha-calculator-debug-screenshot-status"
                density="compact"
                type="info"
                variant="tonal"
              >
                {{ devScreenshotStatus }}
              </v-alert>
            </div>

            <h3>选择卡池的起始时间</h3>
            {{ poolStartDate }}
            <v-date-picker
              v-model="devStartDate"
              color="primary"
              label="开发日期"
              type="date"
              @update:model-value="startDateDebug"
            ></v-date-picker>

            <h3>选择显示的卡池</h3>
            {{ displayPoolOptions }}
            <div>
              <v-btn
                v-for="option in poolOptions"
                :key="option.name"
                class="gacha-calculator-pool-btn-dev"
                :class="
                  displayPoolOptions.includes(option.name)
                    ? ''
                    : 'gacha-calculator-pool-btn-enabled'
                "
                color="rgb(33, 150, 243)"
                @click="selectDisplayPoolOptions(option.name)"
                >{{ option.name }}<br />{{ option.dateText }}
              </v-btn>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <div class="placeholder-block" />
    </div>

    <div class="gacha-calculator-container-right">
      <!-- <v-alert style="margin-bottom: 8px" type="info">
        基础寻访次数仅在总计模块显示，各模块不再单独显示
      </v-alert> -->
      <v-expansion-panels v-model="rightPartPanel" multiple>
        <!--库存-->
        <v-expansion-panel data-gacha-screenshot-target="existing" value="existing">
          <v-expansion-panel-title class="gacha-calculator-card-title">
            <div>
              库存与寻访情报书
              {{ getSpecialAndLimitedPulls(gachaResourceStatisticsResult.totalPulls.existing) }}
              {{ t('page.tools.gachaCalculator.pulls') }}
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="gacha-calculator-existing-resource-grid">
              <div class="gacha-calculator-existing-resource-input">
                <img
                  alt="existing"
                  class="gacha-calculator-gacha-item-icon"
                  src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_originium_recharge.png"
                />
                <v-number-input
                  v-model="existingResource.originiumRecharge"
                  control-variant="hidden"
                  density="compact"
                  hide-details="auto"
                  variant="solo"
                />
              </div>
              <div class="gacha-calculator-existing-resource-input">
                <img
                  alt="existing"
                  class="gacha-calculator-gacha-item-icon"
                  src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_diamond.png"
                />
                <v-number-input
                  v-model="existingResource.diamond"
                  control-variant="hidden"
                  density="compact"
                  hide-details="auto"
                  variant="solo"
                />
              </div>
              <div class="gacha-calculator-existing-resource-input">
                <img
                  alt="existing"
                  class="gacha-calculator-gacha-item-icon"
                  src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_ticketgacha_standard_single.png"
                />
                <v-number-input
                  v-model="existingResource.ticketgachaStandardSingle"
                  control-variant="hidden"
                  density="compact"
                  hide-details="auto"
                  variant="solo"
                />
              </div>
              <div class="gacha-calculator-existing-resource-input">
                <img
                  alt="existing"
                  class="gacha-calculator-gacha-item-icon"
                  src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_ticketgacha_special_single.png"
                />
                <v-number-input
                  v-model="existingResource.ticketgachaSpecialSingle"
                  control-variant="hidden"
                  density="compact"
                  hide-details="auto"
                  variant="solo"
                />
              </div>
            </div>
            <GachaCalculatorResourceSingleBtn
              :hide-version="true"
              :reward="seekIntelBook"
              @click="seekIntelBook.active = !seekIntelBook.active"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!--日常奖励-->
        <v-expansion-panel data-gacha-screenshot-target="daily" value="daily">
          <v-expansion-panel-title class="gacha-calculator-card-title">
            <div>
              日常积累
              {{ getSpecialAndLimitedPulls(gachaResourceStatisticsResult.totalPulls.daily) }}
              {{ t('page.tools.gachaCalculator.pulls') }}
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <div @click="triggerDevModeByDailyReward">
              <GachaCalculatorResourceSingle v-bind="dailyReward" />
            </div>
            <GachaCalculatorResourceSingle v-bind="weekTaskReward" />

            <v-divider style="margin: 1rem 0" />

            <template v-for="item in dailyAllRewardTable" :key="item.id">
              <GachaCalculatorModuleTitle v-if="item.type === '标题'" :title="item.name.zh" />
              <GachaCalculatorResourceSingleBtn
                v-else
                v-show="shouldDisplayAndCount(item)"
                :reward="item"
                @click="item.active = !item.active"
              />
            </template>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!--活动奖励-->
        <v-expansion-panel data-gacha-screenshot-target="activity" value="activity">
          <v-expansion-panel-title class="gacha-calculator-card-title">
            <div>
              版本限时活动
              {{ getSpecialAndLimitedPulls(gachaResourceStatisticsResult.totalPulls.activity) }}
              {{ t('page.tools.gachaCalculator.pulls') }}
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <GachaCalculatorResourceSingleBtn
              v-for="item in activityReward"
              v-show="shouldDisplayAndCount(item)"
              :key="item.id"
              :reward="item"
              @click="item.active = !item.active"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>
        <!--常驻奖励重构-->
        <v-expansion-panel data-gacha-screenshot-target="permanent-re" value="permanent-re">
          <v-expansion-panel-title class="gacha-calculator-card-title">
            <div>
              常驻奖励
              {{
                numberFloor(
                  gachaResourceStatisticsResult.totalPulls.permanent?.ticketgachaSpecialSingle,
                  1,
                )
              }}
              {{ t('page.tools.gachaCalculator.pulls') }}
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text class="gacha-calculator-permanent-panel-text">
            <section
              v-for="group in permanentRewardGroups"
              :key="group.name"
              class="gacha-calculator-permanent-category"
            >
              <div class="gacha-calculator-permanent-category-title">{{ group.name }}</div>
              <template v-for="reward in group.rewards" :key="reward.id">
                <v-card
                  v-if="reward.id === authorityLevelUpReward.id"
                  v-show="rewardMatchesVersion(authorityLevelUpReward)"
                >
                  <v-card-text>
                    <GachaCalculatorResourceSingle v-bind="authorityLevelUpReward" />
                    <div style="height: 36px" />
                    <v-range-slider
                      v-model="authorityLevelProgress"
                      class="v-range-slider"
                      hide-details="auto"
                      max="60"
                      min="1"
                      show-ticks="always"
                      step="1"
                      thumb-label="always"
                      tick-size="4"
                    />
                  </v-card-text>
                </v-card>
                <GachaCalculatorResourceSingleBtn
                  v-else
                  v-show="rewardMatchesVersion(reward)"
                  :reward="reward"
                  @click="reward.active = !reward.active"
                />
              </template>
            </section>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!--氪金资源-->
        <v-expansion-panel data-gacha-screenshot-target="recharge" value="recharge">
          <v-expansion-panel-title class="gacha-calculator-card-title">
            <div>
              氪金资源
              {{
                numberFloor(
                  gachaResourceStatisticsResult.totalPulls.recharge?.ticketgachaSpecialSingle,
                  1,
                )
              }}
              {{ t('page.tools.gachaCalculator.pulls') }}
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <GachaCalculatorPaidResources v-model="rechargeResources" :current-pool="currentPool" />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel
          v-show="'dev' === currentMode"
          data-gacha-screenshot-target="debug"
          value="debug"
        >
          <v-expansion-panel-title class="gacha-calculator-card-title">
            <div>debug</div>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            {{ gachaCalculatorUserConfig }}
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </section>
</template>

<style scoped>
.gacha-calculator-container {
  --gacha-calculator-column-height: calc(100vh - 72px);
  --gacha-calculator-summary-panel-height: 0px;
  --gacha-calculator-summary-fixed-top: 64px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  width: min(100%, 1280px);
  box-sizing: border-box;
  margin: auto;
  padding: 0 12px;
  align-items: start;
}

.gacha-calculator-container-left {
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 8px 8px;
  position: sticky;
  top: 64px;
  max-height: var(--gacha-calculator-column-height);
  z-index: 2;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.gacha-calculator-container-right {
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 8px 8px;
  position: sticky;
  top: 64px;
  max-height: var(--gacha-calculator-column-height);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.gacha-calculator-container-left::-webkit-scrollbar,
.gacha-calculator-container-right::-webkit-scrollbar {
  display: none;
}

.gacha-calculator-container-left > .v-expansion-panels {
  padding-bottom: 80px;
}

.gacha-calculator-container-left > .placeholder-block {
  display: none;
}

.gacha-calculator-container-left .v-expansion-panel,
.gacha-calculator-container-right .v-expansion-panel {
  margin: 8px 0px;
  border-radius: 4px !important;
}

.gacha-calculator-sticky-summary-panel {
  position: sticky;
  top: 8px;
  z-index: 3;
}

.gacha-calculator-container .v-expansion-panel:deep(.v-expansion-panel__shadow) {
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3) !important;
}

.gacha-calculator-container-debug-green {
  background: #00ff00;
}

.gacha-calculator-container-debug-no-shadow .v-expansion-panel:deep(.v-expansion-panel__shadow) {
  box-shadow: none !important;
}

.gacha-calculator-container-debug-no-warning .gacha-calculator-warning {
  display: none !important;
}

.gacha-calculator-container-debug-no-probability .gacha-calculator-probability {
  display: none !important;
}

.gacha-calculator-debug-tools {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
}

.gacha-calculator-debug-switches {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.gacha-calculator-debug-screenshot-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
  gap: 8px;
}

.gacha-calculator-debug-screenshot-btn {
  min-width: 0;
}

.gacha-calculator-debug-screenshot-status {
  margin-top: 4px;
}

.gacha-calculator-card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px !important;
  padding: 0 16px 0 0 !important;
  box-shadow: inset 0 -1px transparent;
  font-size: 1.2rem;
  font-weight: bolder;
  transition: box-shadow 0.2s ease !important;
}

.gacha-calculator-card-title:deep(.v-expansion-panel-title__icon) {
  margin-inline-start: auto;
}

.gacha-calculator-card-title::before {
  content: '';
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  margin: 16px 0 16px 16px;
  border-radius: 3px;
  background: var(--gacha-calculator-border);
}

.gacha-calculator-warning {
  background-color: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 12px 0;
  color: #856404;
  font-weight: 600;
  text-align: center;
}

.gacha-calculator-card-title[aria-expanded='true'] {
  box-shadow: inset 0 -1px var(--gacha-calculator-border);
}

.gacha-calculator-pool-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
  gap: 8px;
  margin: 8px auto 12px;
  width: 100%;
}

.gacha-calculator-pool-btn {
  min-width: 0;
  min-height: 54px;
  color: rgb(33, 150, 243) !important;
  background: rgba(33, 150, 243, 0.12) !important;
  border: 1px solid rgba(33, 150, 243, 0.35);
}

.gacha-calculator-pool-btn:deep(.v-btn__content) {
  width: 100%;
  display: grid;
  gap: 2px;
  line-height: 1.15;
  text-align: left;
  justify-items: start;
}

.gacha-calculator-pool-btn-active {
  color: #ffffff !important;
  background: rgb(33, 150, 243) !important;
  border-color: rgb(33, 150, 243);
}

.gacha-calculator-pool-btn-name,
.gacha-calculator-pool-btn-date {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gacha-calculator-pool-btn-name {
  font-weight: 700;
}

.gacha-calculator-pool-btn-date {
  opacity: 0.78;
  font-size: 0.78rem;
}

.gacha-calculator-pool-btn-enabled {
  background-color: rgba(33, 150, 243, 0.2) !important;
  color: rgb(33, 150, 243) !important;
}

.gacha-calculator-chart-and-table {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.gacha-calculator-pie-chart {
  width: min(300px, 100%);
  height: 240px;
  flex: 1 1 230px;
  min-width: 220px;
}

.gacha-calculator-statistics-result {
  flex: 1 1 150px;
  min-width: 150px;
}

.gacha-calculator-statistics-result-item {
  display: flex;
  align-items: center;
  min-width: 80px;
  margin: 12px 0;
}

.gacha-calculator-statistics-result-item-text {
  padding: 0 0 4px 12px;
}

.gacha-calculator-control-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.gacha-calculator-control-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gacha-calculator-control-section-title {
  font-size: 0.95rem;
  font-weight: 700;
}

.gacha-calculator-version-control-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gacha-calculator-version-control-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
  padding: 8px;
  border: 1px solid var(--theme-border-secondary);
  border-radius: 4px;
  background: rgba(var(--v-theme-on-surface), 0.04);
}

.gacha-calculator-version-control-switch {
  min-width: 0;
}

.gacha-calculator-version-control-switch:deep(.v-label) {
  font-weight: 700;
  opacity: 1;
}

.gacha-calculator-version-control-actions {
  display: flex;
  gap: 6px;
}

.gacha-calculator-version-action-btn {
  min-width: 64px;
}

.gacha-calculator-control-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
}

.gacha-calculator-permanent-category {
  margin: 0 0 12px;
}

.gacha-calculator-permanent-category-title {
  width: calc(100% + 48px);
  box-sizing: border-box;
  margin: 4px -24px;
  padding: 6px 8px;
  border-radius: 4px;
  background: rgba(128, 128, 128, 0.5);
  font-size: 0.95rem;
  font-weight: 700;
}

.gacha-calculator-permanent-panel-text:deep(.v-expansion-panel-text__wrapper) {
  overflow: hidden;
}

.gacha-calculator-shortcut-btn-table {
  text-align: center;
}

.gacha-calculator-shortcut-btn {
  margin: 4px;
}

.gacha-calculator-result-detail-table-icon {
  width: 36px;
  height: 36px;
}

.gacha-calculator-existing-resource-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-block: 1rem;
}

.gacha-calculator-existing-resource-input {
  display: flex;
  align-items: center;
}

.gacha-calculator-gacha-item-icon {
  width: 36px;
  height: 36px;
  margin: 0 12px 0 0;
}

.gacha-calculator-arsenal-quota {
  padding: 0.5rem 0;
}

.gacha-calculator-arsenal-quota-row {
  display: flex;
  align-items: center;
  margin: 0.75rem 0;
  gap: 8px;
}

.gacha-calculator-arsenal-quota-label {
  min-width: 100px;
  font-weight: bold;
  white-space: nowrap;
}

.gacha-calculator-arsenal-quota-input-field {
  flex: 1;
  min-width: 60px;
}

.gacha-calculator-arsenal-quota-btn {
  white-space: nowrap;
  font-size: 0.75rem;
  margin-left: 4px;
}

.gacha-calculator-arsenal-quota-formula {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.gacha-calculator-arsenal-quota-formula-detail {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
}

.gacha-calculator-arsenal-quota-formula-num {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.gacha-calculator-arsenal-quota-formula-op {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 4px;
}

.gacha-calculator-arsenal-quota-result-value {
  font-size: 1.4rem;
  font-weight: bold;
  color: rgb(33, 150, 243);
  margin-left: 4px;
}

.placeholder-block {
  width: 100%;
  height: 80px;
  display: block;
}

.gacha-calculator-pool-btn-dev {
  margin: 1%;
  display: inline-grid;
  width: 47%;
}

@media screen and (max-width: 1100px) {
  .gacha-calculator-container {
    grid-template-columns: 1fr;
    width: min(100%, 760px);
  }
  .gacha-calculator-container-left {
    position: relative;
    top: 0;
    max-height: max-content;
    padding-top: var(--gacha-calculator-summary-panel-height);
    z-index: 2;
    overflow-y: visible;
  }

  .gacha-calculator-container-left > .v-expansion-panels {
    padding-bottom: 0;
    z-index: 2;
  }

  .gacha-calculator-sticky-summary-panel {
    position: fixed;
    top: var(--gacha-calculator-summary-fixed-top);
    left: 50%;
    right: auto;
    width: calc(min(100vw, 760px) - 40px);
    transform: translateX(-50%);
    z-index: 3;
  }

  .gacha-calculator-container-right {
    position: relative;
    top: 0;
    max-height: max-content;
    z-index: 1;
    overflow-y: visible;
  }
}

@media screen and (max-width: 600px) {
  .gacha-calculator-container {
    width: 100%;
    padding: 0;
  }

  .gacha-calculator-container-left {
    width: 100%;
    padding: 0 0 8px;
    padding-top: var(--gacha-calculator-summary-panel-height);
    position: relative;
    max-height: max-content;
    z-index: 2;
    overflow-y: visible;
  }

  .gacha-calculator-sticky-summary-panel {
    left: 0;
    right: auto;
    width: 100vw;
    transform: none;
  }

  .gacha-calculator-container-right {
    width: 100%;
    padding: 0 0 8px;
    position: relative;
    max-height: max-content;
    z-index: 1;
    overflow-y: visible;
  }

  .gacha-calculator-card-title {
    font-size: 1rem;
    font-weight: bolder;
  }

  .gacha-calculator-pie-chart {
    display: none;
  }

  .gacha-calculator-warning {
    display: none;
  }

  .gacha-calculator-pool-selector {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }

  .gacha-calculator-chart-and-table {
    display: block;
  }

  .gacha-calculator-pie-chart {
    width: 300px;
    height: 240px;
  }

  .gacha-calculator-statistics-result {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .gacha-calculator-statistics-result-item {
    display: flex;
    align-items: center;
    width: 140px;
    margin: 0;
  }

  .gacha-calculator-statistics-result-item-text {
    padding: 0;
  }

  .gacha-calculator-version-control-row {
    grid-template-columns: 1fr;
  }

  .gacha-calculator-version-control-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .gacha-calculator-shortcut-btn-table {
    font-size: 0.8rem;
  }

  .gacha-calculator-shortcut-btn {
    margin: 4px 0;
    width: 150px;
    font-size: 0.8rem;
  }

  .gacha-calculator-result-detail-table {
    font-size: 0.6rem;
  }

  .gacha-calculator-result-detail-table-icon {
    width: 24px;
    height: 24px;
  }

  .content-container {
    padding: 0.5rem;
  }

  .placeholder-block {
    display: none;
  }
}

.v-range-slider {
  .v-slider-thumb__label {
    width: 100px;
  }
}
</style>
