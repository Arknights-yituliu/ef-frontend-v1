import type { Reward } from '#shared/types/gacha-calculator';
import { ref } from 'vue';
import etchSpaceSalvageRewardJson from './json/etch_space_salvage_reward.json';
import valleyIVTaskTable from './json/valley_IV_task_table.json';

import wulingTaskTable from './json/wuling_task_table.json';

const beginnerSignInTaskReward = ref<Reward>({
  id: 'beginner_sign_in_task',
  name: {
    zh: `唤醒签到奖励`,
    en: '',
  },
  start: '2026/01/22 12:00:00',
  end: '2099/12/31 12:00:00',
  type: '通用',
  module: '常驻活动',
  active: true,
  version: '零号委托',
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 11,
  },
});



const newHorizonsTaskReward = ref<Reward[]>([
  {
    id: 'new_horizons_task_reward_1',
    name: {
      zh: `于此启程任务·1`,
      en: '',
    },
    start: '2026/01/22 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '常驻活动',
    active: true,
    version: '零号委托',
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0,
    },
  },
  {
    id: 'new_horizons_task_reward_2',
    name: {
      zh: `于此启程任务·2`,
      en: '',
    },
    start: '2026/01/22 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '常驻活动',
    active: true,
    version: '零号委托',
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0,
    },
  },
  {
    id: 'new_horizons_task_reward_3',
    name: {
      zh: `于此启程任务·2`,
      en: '',
    },
    start: '2026/01/22 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '常驻活动',
    active: true,
    version: '零号委托',
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0,
    },
  },
  {
    id: 'new_horizons_task_reward_4',
    name: {
      zh: `于此启程任务·4`,
      en: '',
    },
    start: '2026/01/22 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '常驻活动',
    active: true,
    version: '零号委托',
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0,
    },
  },
]);

const beginnerTicketgachaSpecialSingleTaskReward = ref<Reward[]>([]);

for (let i = 1; i <= 5; i++) {
  const reward: Reward = {
    id: `新手特许赠礼·${i}`,
    name: {
      zh: `新手特许赠礼·${i}`,
      en: '',
    },
    start: '2026/03/12 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '常驻活动',
    active: true,
    version: '新潮起·故渊离',
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 2,
    },
  }
  beginnerTicketgachaSpecialSingleTaskReward.value.push(reward);
}

const valleyIVTaskRewardTable = ref<Reward[]>(valleyIVTaskTable);
const wulingTaskRewardTable = ref<Reward[]>(wulingTaskTable);

// for (const reward of valleyIVTaskTable) {
//   valleyIVTaskRewardTable.value.push(reward);
// }

// for (const reward of wulingTaskTable as Reward[]) {
//   wulingTaskRewardTable.value.push(reward);
// }

// export const taskRewardTable1 = ref<Reward[]>(TaskTable as Reward[])

const etchSpaceSalvageCrateRewardMax: number = 15 * 5 + 30 * 4 + 60 * 1;

const etchSpaceSalvageReward = ref<Reward[]>([]);

for (const reward of etchSpaceSalvageRewardJson) {
  etchSpaceSalvageReward.value.push(reward);
}

export {
  beginnerSignInTaskReward,
  beginnerTicketgachaSpecialSingleTaskReward,
  etchSpaceSalvageReward,
  newHorizonsTaskReward,
  valleyIVTaskRewardTable,
  wulingTaskRewardTable,
};
