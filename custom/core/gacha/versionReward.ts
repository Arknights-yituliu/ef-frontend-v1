import type {
  Reward,
  RewardStatisticsResultDetail,
  VersionTableItem,
} from '#shared/types/gacha-calculator';
import {
  calculateDaysDifference,
  groupAndMergeRewardsByVersion,
} from '#shared/utils/gacha-calculator';
import { numberFloor } from '#shared/utils/numberUtil';
import { ref, version } from 'vue';
import { activityReward } from '@/custom/core/gacha/activityReward';
import { createVersionDailyReward, dailyAllRewardTable } from '@/custom/core/gacha/dailyReward';
import {
  authorityLevelUpReward,
  permanentRewardTable,
} from '@/custom/core/gacha/permanentRewardV2';

const rawVersionReward: Reward[] = [];

const versionTable: VersionTableItem[] = [
  {
    start: new Date('2026/01/22 12:00:00'),
    end: new Date('2026/03/12 12:00:00'),
    primaryColor: 'rgba(87, 224, 210,  1)',
    colorOpacity: 'rgba(187, 224, 210,  0.3)',
    heavyColor: 'rgba(57, 146, 137, 1)',
    version: '零号委托',
  },
  {
    start: new Date('2026/03/12 12:00:00'),
    end: new Date('2026/04/17 12:00:00'),
    primaryColor: 'rgba(87, 224, 210,  1)',
    colorOpacity: 'rgba(187, 224, 210,  0.3)',
    heavyColor: 'rgba(57, 146, 137, 1)',
    version: '新潮起·故渊离',
  },
  {
    start: new Date('2026/04/17 12:00:00'),
    end: new Date('2026/06/05 12:00:00'),
    primaryColor: 'rgba(87, 224, 210,  1)',
    colorOpacity: 'rgba(187, 224, 210,  0.3)',
    heavyColor: 'rgba(57, 146, 137, 1)',
    version: '春晓时',
  },
  {
    start: new Date('2026/06/05 12:00:00'),
    end: new Date('2026/07/16 12:00:00'),
    primaryColor: 'rgba(193, 56, 89, 1)',
    colorOpacity: 'rgba(193, 56, 89,  0.3)',
    heavyColor: 'rgba(255, 215, 0, 1)',
    version: '寻遗散记',
  },
  {
    start: new Date('2026/07/16 12:00:00'),
    end: new Date('2026/09/02 12:00:00'),
    primaryColor: 'rgba(106, 141, 150, 1)',
    colorOpacity: 'rgba(106, 141, 150, 0.3)',
    heavyColor: 'rgba(255, 215, 0, 1)',
    version: '向渊行',
  },
];

// for (const item of versionTable) {
//   const rewards = createVersionDailyReward(item.start, item.end, item.version);
//   versionReward.push(rewards[0] as Reward, rewards[1] as Reward);
// }

for (const reward of dailyAllRewardTable.value) {
  if (reward.module === '标题') {
    continue;
  }
  rawVersionReward.push(reward);
}

/**
 * 临时保存 id 包含"森空岛"的奖励，暂不插入 versionReward
 */
const sklandRewards: Reward[] = [];

for (const reward of activityReward.value) {
  if (reward.id.includes('森空岛签到')) {
    sklandRewards.push(reward);
  } else {
    rawVersionReward.push(reward);
  }
}

const sklandRewardGroupByVersion = groupAndMergeRewardsByVersion('森空岛签到', sklandRewards);
console.log(sklandRewardGroupByVersion);
for (const reward of sklandRewardGroupByVersion) {
  rawVersionReward.push(reward);
}

rawVersionReward.push(authorityLevelUpReward.value, ...permanentRewardTable.value);

const currentVersionReward = ref<Reward[]>([]);
const currentVersionRewardTotal = ref<RewardStatisticsResultDetail[]>([]);
function getVersionReward(version: VersionTableItem) {
  const daysDiff = calculateDaysDifference(version.start, version.end);

  currentVersionRewardTotal.value = [];
  currentVersionReward.value = [];
  let dailyReward: Reward[] = [];

  dailyReward = createVersionDailyReward(version.start, version.end, version.version);

  currentVersionReward.value.push(...dailyReward);

  for (const reward of rawVersionReward) {
    if (version.version === reward.version) {
      currentVersionReward.value.push(reward);
    }
  }

  const result1 = calculateRewardTotal('零氪', currentVersionReward.value, []);
  const result2 = calculateRewardTotal('月卡', currentVersionReward.value, [
    _createMonthlyPackReward(daysDiff),
  ]);
  const result3 = calculateRewardTotal('月卡+通行证', currentVersionReward.value, [
    _createMonthlyPackReward(daysDiff),
    _createBattlePassReward(),
  ]);

  currentVersionRewardTotal.value.push(result1, result2, result3);

  // 计算并设置高度
}

function getPoolReward(version: string, character: string, start: Date, end: Date) {
  const daysDiff = calculateDaysDifference(start, end);

  currentVersionRewardTotal.value = [];
  currentVersionReward.value = [];
  let dailyReward: Reward[] = [];

  dailyReward = createVersionDailyReward(start, end, version);

  currentVersionReward.value.push(...dailyReward);

  for (const reward of rawVersionReward) {
    if (version !== reward.version) {
      continue;
    }
    if (character !== reward.type && '通用' !== reward.type) {
      continue;
    } 
    if(new Date(reward.start) < start){
      continue;
    }
    
    currentVersionReward.value.push(reward);
  }

  const result1 = calculateRewardTotal('零氪', currentVersionReward.value, []);
  const result2 = calculateRewardTotal('月卡', currentVersionReward.value, [
    _createMonthlyPackReward(daysDiff),
  ]);
  const result3 = calculateRewardTotal('月卡+通行证', currentVersionReward.value, [
    _createMonthlyPackReward(daysDiff),
    _createBattlePassReward(),
  ]);

  currentVersionRewardTotal.value.push(result1, result2, result3);
}

function calculateRewardTotal(
  name: string,
  rewards: Reward[],
  extraRewards: Reward[],
): RewardStatisticsResultDetail {
  const result: RewardStatisticsResultDetail = {
    name,
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
    totalPulls: 0,
  };

  for (const reward of rewards) {
    result.originiumRecharge += reward.content.originiumRecharge;
    result.diamond += reward.content.diamond;
    result.ticketgachaStandardSingle += reward.content.ticketgachaStandardSingle;
    result.ticketgachaSpecialSingle += reward.content.ticketgachaSpecialSingle;
    result.ticketgachaLimitedSingle += reward.content.ticketgachaLimitedSingle;
  }
  for (const reward of extraRewards) {
    result.originiumRecharge += reward.content.originiumRecharge;
    result.diamond += reward.content.diamond;
    result.ticketgachaStandardSingle += reward.content.ticketgachaStandardSingle;
    result.ticketgachaSpecialSingle += reward.content.ticketgachaSpecialSingle;
    result.ticketgachaLimitedSingle += reward.content.ticketgachaLimitedSingle;
  }

  result.totalPulls =
    result.originiumRecharge * 0.15 + result.diamond / 500 + result.ticketgachaSpecialSingle;

  return result;
}

// 月卡奖励模板（需传入天数差使用）
function _createMonthlyPackReward(daysDiff: number): Reward {
  return {
    id: 'monthly_pack',
    name: {
      zh: '月卡',
      en: '',
    },
    start: new Date(),
    end: new Date('2099/12/31 00:00:00'),
    type: '通用',
    module: '氪金',
    active: true,
    version: '',
    content: {
      originiumRecharge: numberFloor((12 / 30) * daysDiff, 0),
      diamond: numberFloor(daysDiff) * 200,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
  };
}

// 月卡奖励模板（需传入天数差使用）
function _createBattlePassReward(): Reward {
  return {
    id: 'battle_pass',
    name: {
      zh: '通行证',
      en: '',
    },
    start: new Date(),
    end: new Date('2099/12/31 00:00:00'),
    type: '通用',
    module: '氪金',
    active: true,
    version: '',
    content: {
      originiumRecharge: 36,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
  };
}

/**
 * 将 string | Date 统一转为 Date
 */
function toDate(value: string | Date): Date {
  return typeof value === 'string' ? new Date(value) : value;
}

/**
 * 过滤 versionReward 中属于传入版本且未过期的奖励
 * @param versions 版本名称数组，保留 reward.version 在其中的奖励
 * @param currentVersion
 * @param versionStart
 * @returns 过滤并按开始时间倒序排列的奖励数组
 */
function filterRewardEndAfter(
  versions: string[],
  currentVersion: string,
  versionStart: Date,
): Reward[] {
  const list = [];

  for (const reward of rawVersionReward) {
    const endTimeStamp = toDate(reward.end).getTime();

    if (reward.name.zh === '权限等级提升奖励') {
      console.log(111);
    }

    if (reward.id.startsWith('辉光')) {
      continue;
    }

    if (currentVersion === reward.version) {
      list.push(reward);
      continue;
    }

    if (endTimeStamp > versionStart.getTime() && versions.includes(reward.version)) {
      list.push(reward);
    }
  }

  list.sort((a, b) => toDate(b.start).getTime() - toDate(a.start).getTime());

  const dailyReward = createVersionDailyReward(
    new Date('2026/04/17 12:00:00'),
    new Date('2026/06/05 12:00:00'),
    '当前版本',
  );
  list.push(...dailyReward);
  return list;
}

function rewardTotalCalc(
  rewardList: Reward[],
  rechargeReward: Reward[],
  name: string,
): RewardStatisticsResultDetail {
  const result: RewardStatisticsResultDetail = {
    name,
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
    totalPulls: 0,
  };

  // 合并rewardList和rechargeReward
  const mergedRewards = [...rewardList, ...rechargeReward];

  // 遍历合并后的奖励列表进行计算
  for (const reward of mergedRewards) {
    result.originiumRecharge += reward.content.originiumRecharge;
    const tmp = result.diamond;
    const tmp1 = reward.content.diamond;
    result.diamond += reward.content.diamond;
    // console.log(tmp, '+', tmp1, '=', result.diamond);
    result.ticketgachaStandardSingle += reward.content.ticketgachaStandardSingle;
    result.ticketgachaSpecialSingle += reward.content.ticketgachaSpecialSingle;
    result.ticketgachaLimitedSingle += reward.content.ticketgachaLimitedSingle;
  }
  result.totalPulls =
    result.originiumRecharge * 0.15 + result.diamond / 500 + result.ticketgachaSpecialSingle;
  return result;
}

const allVersionReward = ref<Reward[]>([]);
for (const reward of rawVersionReward) {
  if (reward.module !== '标题') {
    allVersionReward.value.push(reward);
  }
}

export {
  allVersionReward,
  currentVersionReward,
  currentVersionRewardTotal,
  filterRewardEndAfter,
  getPoolReward,
  getVersionReward,
  rewardTotalCalc,
  versionTable,
};
