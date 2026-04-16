import type { Reward } from '#shared/types/gacha-calculator';

import { ref } from 'vue';

import ActivityRewardTable from '@/custom/core/gacha/data/activity_reward_table.json';
import OtherRewardTableJson from '@/custom/core/gacha/data/activity_other_reward_table.json';
import PoolInfoTable from '@/custom/core/gacha/data/pool_info_table.json';

const activityReward = ref<Reward[]>([]);

for (const reward of ActivityRewardTable as Reward[]) {
  reward.start = new Date(reward.start);
  reward.end = new Date(reward.end);
  if (reward.end < new Date()) {
    reward.active = false;
  }
  activityReward.value.push(reward);
}

for (const reward of OtherRewardTableJson as Reward[]) {
  reward.start = new Date(reward.start);
  reward.end = new Date(reward.end);
  if (reward.end < new Date()) {
    reward.active = false;
  }
  activityReward.value.push(reward);
}

export { activityReward };



createNewPoolActivity();

activityReward.value.sort((a: { start: string | Date; }, b: { start: string |  Date; }) => {
  const aTime = typeof a.start === 'string' ? new Date(a.start).getTime() : a.start.getTime();
  const bTime = typeof b.start === 'string' ? new Date(b.start).getTime() : b.start.getTime();
  return bTime - aTime;
});

function createNewPoolActivity() {
  for (const item of PoolInfoTable) {
    const startDate = new Date(item.poolStart);
    const reward1: Reward = {
      id: `作战演练·${item.character}`,
      name: {
        zh: `作战演练·${item.character}`,
        en: '',
      },
      start: startDate,
      end: new Date(item.versionEnd),
      type: '通用',
      module: '活动',
      active: false,
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

    if (item.narrative) {
      const reward2: Reward = {
        id: `干员叙事·${item.character}`,
        name: {
          zh: `干员叙事·${item.character}`,
          en: '',
        },
        start: startDate,
        end: new Date(item.versionEnd),
        type: '通用',
        module: '活动',
        active: false,
        version: item.version,
        content: {
          originiumRecharge: 0,
          diamond: 600,
          ticketgachaStandardSingle: 0,
          ticketgachaSpecialSingle: 0,
          ticketgachaLimitedSingle: 0,
        },
      };
      activityReward.value.push(reward2);
    }

    const reward3: Reward = {
      id: `${item.poolName}卡池签到`,
      name: {
        zh: `${item.poolName}卡池签到`,
        en: '',
      },
      start: new Date(item.poolStart),
      end: new Date(item.poolEnd),
      type: item.character,
      module: '活动',
      active: false,
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