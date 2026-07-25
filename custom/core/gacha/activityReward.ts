import type { Reward } from '#shared/types/gacha-calculator';

import { ref } from 'vue';

import OtherRewardTableJson from '@/custom/core/gacha/data/activity_other_reward_table.json';
import ActivityRewardTable from '@/custom/core/gacha/data/activity_reward_table.json';
import PoolInfoTable from '@/custom/core/gacha/data/pool_info_table.json';
import sklandSignInTable from '@/custom/core/gacha/data/skland_sign_in_table.json';

const currentVersion = '寻遗散记';
const DEFAULT_ACTIVITY_GACHA_REWARD_DAYS = 1;
const activityGachaRewardDayOverrides: Record<string, number> = {
  宏运连连乐: 15,
  根脉奇境: 7,
  '炽燃·竞技大会': 7,
  '丰碑留名·兽吼': 7,
};

const activityReward = ref<Reward[]>([]);

function applyGachaRewardDays(reward: Reward) {
  reward.gachaRewardDays =
    activityGachaRewardDayOverrides[reward.id] ?? DEFAULT_ACTIVITY_GACHA_REWARD_DAYS;
}

for (const reward of ActivityRewardTable as Reward[]) {
  reward.start = new Date(reward.start);
  reward.end = new Date(reward.end);
  applyGachaRewardDays(reward);

  reward.active = currentVersion === reward.version;
  if (reward.start.getTime() < Date.now()) {
    reward.active = false;
  }

  activityReward.value.push(reward);
}

for (const reward of OtherRewardTableJson as Reward[]) {
  reward.start = new Date(reward.start);
  reward.end = new Date(reward.end);
  applyGachaRewardDays(reward);
  reward.active = currentVersion === reward.version;
  if (reward.start.getTime() < Date.now()) {
    reward.active = false;
  }
  activityReward.value.push(reward);
}

for (const reward of sklandSignInTable as Reward[]) {
  reward.start = new Date(reward.start);
  reward.end = new Date(reward.end);
  applyGachaRewardDays(reward);
  reward.active = currentVersion === reward.version;
  if (reward.start.getTime() < Date.now()) {
    reward.active = false;
  }
  activityReward.value.push(reward);
}

export { activityReward };

createNewPoolActivity();

activityReward.value.sort((a: { start: string | Date }, b: { start: string | Date }) => {
  const aTime = typeof a.start === 'string' ? new Date(a.start).getTime() : a.start.getTime();
  const bTime = typeof b.start === 'string' ? new Date(b.start).getTime() : b.start.getTime();
  return bTime - aTime;
});

function createNewPoolActivity() {
  for (const item of PoolInfoTable) {
    const startDate = new Date(item.poolStart);
    if (item.combatDrills) {
      const reward1: Reward = {
        id: `作战演练·${item.character}`,
        name: {
          zh: `作战演练·${item.character}`,
          en: '',
        },
        start: startDate,
        end: new Date(item.versionEnd),
        gachaRewardDays: DEFAULT_ACTIVITY_GACHA_REWARD_DAYS,
        type: '通用',
        module: '活动',
        active: currentVersion === item.version,
        version: item.version,
        content: {
          originiumRecharge: 0,
          diamond: 100,
          ticketgachaStandardSingle: 0,
          ticketgachaSpecialSingle: 0,
          ticketgachaLimitedSingle: 0,
        },
      };
      activityReward.value.push(reward1);
    }

    const reward3: Reward = {
      id: `${item.poolName}卡池签到`,
      name: {
        zh: `${item.poolName}卡池签到`,
        en: '',
      },
      start: new Date(item.poolStart),
      end: new Date(item.poolEnd),
      gachaRewardDays: 3,
      type: item.character,
      module: '活动',
      active: currentVersion === item.version,
      version: item.version,
      content: {
        originiumRecharge: 0,
        diamond: 0,
        ticketgachaStandardSingle: 0,
        ticketgachaSpecialSingle: 0,
        ticketgachaLimitedSingle: 5,
      },
    };
    activityReward.value.push(reward3);
  }
}
