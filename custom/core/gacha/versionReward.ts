import type { Reward, RewardStatisticsResultDetail } from '#shared/types/gacha-calculator';
import { calculateDaysDifference, groupAndMergeRewardsByVersion} from '#shared/utils/gacha-calculator';
import { numberFloor } from '#shared/utils/numberUtil';
import { onMounted, ref, watch } from 'vue';
import { activityReward } from '@/custom/core/gacha/activityReward';
import { createVersionDailyReward, dailyAllRewardTable } from '@/custom/core/gacha/dailyReward';
import {
  archivePermanentRewardTable,
  authorityLevelUpReward,
  permanentRewardTable,
} from '@/custom/core/gacha/permanentRewardV2';



const versionReward: Reward[] = [];

const currentVersionRewardTotal = ref<RewardStatisticsResultDetail[]>([]);



/**
 * 版本表条目类型
 */
export interface VersionTableItem {
  /** 版本开始日期 */
  start: Date;
  /** 版本结束日期 */
  end: Date;
  /** 主题色（rgba 格式） */
  primaryColor: string;
  /** 主题色半透明版（rgba 格式，用于渐变等场景） */
  colorOpacity: string;
  /** 重颜色（rgba 格式，比主题色更深的版本） */
  heavyColor: string;
  /** 版本名称 */
  version: string;
}

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
    end: new Date('2026/07/17 12:00:00'),
    primaryColor: 'rgba(193, 56, 89, 1)',
    colorOpacity: 'rgba(193, 56, 89,  0.3)',
    heavyColor: 'rgba(255, 215, 0, 1)',
    version: '寻遗散记',
  },
];

// for (const item of versionTable) {
//   const rewards = createVersionDailyReward(item.start, item.end, item.version);
//   versionReward.push(rewards[0] as Reward, rewards[1] as Reward);
// }

for (const reward of dailyAllRewardTable.value) {
  versionReward.push(reward);
}

/**
 * 临时保存 id 包含"森空岛"的奖励，暂不插入 versionReward
 */
const sklandRewards: Reward[] = [];

for (const reward of activityReward.value) {
  if (reward.id.includes('森空岛签到')) {
    sklandRewards.push(reward);
  } else {
    versionReward.push(reward);
  }
}

let sklandRewardGroupByVersion = groupAndMergeRewardsByVersion('森空岛签到',sklandRewards);
console.log(sklandRewardGroupByVersion);
for (const reward of sklandRewardGroupByVersion) {
  versionReward.push(reward);
}

versionReward.push(
  authorityLevelUpReward.value,
  ...permanentRewardTable.value,
  ...archivePermanentRewardTable.value,
);

const currentVersionReward = ref<Reward[]>([]);

function filterRewardByVersion(type: string, version: VersionTableItem) {
  const daysDiff = calculateDaysDifference(version.start, version.end);

  currentVersionRewardTotal.value = [];
  currentVersionReward.value = [];
  let rewards: Reward[] = [];
  if ('version' === type) {
    rewards = createVersionDailyReward(version.start, version.end, version.version);
  } else {
    rewards = createVersionDailyReward(new Date('2026/01/22 12:00:00'), version.end, '自开服以来');
  }
  currentVersionReward.value.push(rewards[0] as Reward, rewards[1] as Reward);

  const result1: RewardStatisticsResultDetail = {
    name: '零氪',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
    totalPulls: 0,
  };

  const result2: RewardStatisticsResultDetail = {
    name: '月卡',
    originiumRecharge: numberFloor((12 / 30) * daysDiff, 0),
    diamond: numberFloor(daysDiff) * 200,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
    totalPulls: 0,
  };

  const result3: RewardStatisticsResultDetail = {
    name: '月卡+通行证',
    originiumRecharge: numberFloor((12 / 30) * daysDiff, 0) + 36,
    diamond: numberFloor(daysDiff) * 200,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
    totalPulls: 0,
  };

  if ('version' === type) {
    for (const reward of versionReward) {
      if (version.version === reward.version) {
        currentVersionReward.value.push(reward);
      }
    }
  } else {
    for (const reward of versionReward) {
      currentVersionReward.value.push(reward);
    }
  }

  for (const reward of currentVersionReward.value) {
    result1.originiumRecharge += reward.content.originiumRecharge;
    result1.diamond += reward.content.diamond;
    result1.ticketgachaStandardSingle += reward.content.ticketgachaStandardSingle;
    result1.ticketgachaSpecialSingle += reward.content.ticketgachaSpecialSingle;
    result1.ticketgachaLimitedSingle += reward.content.ticketgachaLimitedSingle;
  }

  result2.originiumRecharge += result1.originiumRecharge;
  result2.diamond += result1.diamond;
  result2.ticketgachaStandardSingle += result1.ticketgachaStandardSingle;
  result2.ticketgachaSpecialSingle += result1.ticketgachaSpecialSingle;
  result2.ticketgachaLimitedSingle += result1.ticketgachaLimitedSingle;

  result3.originiumRecharge += result1.originiumRecharge;
  result3.diamond += result1.diamond;
  result3.ticketgachaStandardSingle += result1.ticketgachaStandardSingle;
  result3.ticketgachaSpecialSingle += result1.ticketgachaSpecialSingle;
  result3.ticketgachaLimitedSingle += result1.ticketgachaLimitedSingle;

  result1.totalPulls =
    result1.originiumRecharge * 0.15 + result1.diamond / 500 + result1.ticketgachaSpecialSingle;
  result2.totalPulls =
    result2.originiumRecharge * 0.15 + result2.diamond / 500 + result2.ticketgachaSpecialSingle;
  result3.totalPulls =
    result3.originiumRecharge * 0.15 + result3.diamond / 500 + result3.ticketgachaSpecialSingle;

  currentVersionRewardTotal.value.push(result1, result2, result3);

  // 计算并设置高度
}

const passPack: Reward = {
  id: 'pass_pack',
  name: {
    zh: '通行证',
    en: '',
  },
  start: new Date(),
  end: new Date('2099/12/31 00:00:00'),
  type: '通用',
  module: '通行证',
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

// 月卡奖励模板（需传入天数差使用）
function createMonthlyPackReward(daysDiff: number): Reward {
  return {
    id: 'monthly_pack',
    name: {
      zh: '月卡',
      en: '',
    },
    start: new Date(),
    end: new Date('2099/12/31 00:00:00'),
    type: '通用',
    module: '月卡',
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

function rewardTotalCalc(rewardList: Reward[], rechargeReward: Reward[], name: string) {
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
    result.diamond += reward.content.diamond;
    result.ticketgachaStandardSingle += reward.content.ticketgachaStandardSingle;
    result.ticketgachaSpecialSingle += reward.content.ticketgachaSpecialSingle;
    result.ticketgachaLimitedSingle += reward.content.ticketgachaLimitedSingle;
  }
}

const allVersionReward = ref<Reward[]>([]);
for (const reward of versionReward) {
  if (reward.module !== '标题') {
    allVersionReward.value.push(reward);
  }
}

export {
  allVersionReward,
  currentVersionReward,
  currentVersionRewardTotal,
  filterRewardByVersion,
  versionTable,
};
