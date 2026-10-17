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
import { ref } from 'vue';
import { activityReward } from '@/custom/core/gacha/activityReward';
import { createVersionDailyReward, dailyAllRewardTable } from '@/custom/core/gacha/dailyReward';
import {
  authorityLevelUpReward,
  permanentRewardTable,
} from '@/custom/core/gacha/permanentRewardV2';

const rawVersionReward: Reward[] = [];

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

export { currentVersionReward, currentVersionRewardTotal, getVersionReward, rawVersionReward };

export { versionTable } from '@/custom/core/gacha/versionTable';
