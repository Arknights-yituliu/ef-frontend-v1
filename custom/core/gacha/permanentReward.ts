import type { Reward } from '#shared/types/gacha-calculator';
import { groupAndMergeTasksByVersionAndModule } from '#shared/utils/gacha-calculator';
import { ref } from 'vue';
import etchSpaceSalvageRewardJson from '@/custom/core/gacha/data/etch_space_salvage_reward.json';
import { etchSpaceSalvageCrateRewardTable } from '@/custom/core/gacha/data/etchSpaceSalvageRewardTable';
import permanentRewardTableJson from '@/custom/core/gacha/data/permanent_reward_table.json';
import valleyIVTaskTable from '@/custom/core/gacha/data/valley_IV_task_table.json';
import wulingTaskTable from '@/custom/core/gacha/data/wuling_task_table.json';

const permanentRewardTable = ref<Reward[]>([]);
for (const reward of permanentRewardTableJson) {
  permanentRewardTable.value.push(reward);
}




const authorityLevelUpReward = ref<Reward>({
  id: 'authority_level_up_reward',
  name: {
    zh: `权限等级提升奖励`,
    en: '',
  },
  start: '2026/01/22 12:00:00',
  end: '2099/12/31 12:00:00',
  type: '通用',
  module: '权限等阶提升',
  active: true,
  version: '零号委托',
  content: {
    originiumRecharge: 0,
    diamond: 4500,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  },
});

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
    ticketgachaSpecialSingle: 12,
    ticketgachaLimitedSingle: 0,
  },
});

const newHorizonsTaskReward = ref<Reward[]>([
  {
    id: 'new_horizons_task_reward',
    name: {
      zh: `于此启程任务`,
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
      ticketgachaStandardSingle: 40,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
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
      ticketgachaLimitedSingle: 0,
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
      ticketgachaLimitedSingle: 0,
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
      ticketgachaLimitedSingle: 0,
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
      ticketgachaLimitedSingle: 0,
    },
  };
  beginnerTicketgachaSpecialSingleTaskReward.value.push(reward);
}

const mergedValleyIVTasks = groupAndMergeTasksByVersionAndModule('四号谷地', valleyIVTaskTable);
const valleyIVTaskRewardTable = ref<Reward[]>(mergedValleyIVTasks);
const mergedWulingTasks = groupAndMergeTasksByVersionAndModule('武陵', wulingTaskTable);
const wulingTaskRewardTable = ref<Reward[]>(mergedWulingTasks);

console.log(mergedWulingTasks);

const tempTasksReward: Reward[] = [
  {
    id: '武陵_春晓时_主线任务',
    name: {
      zh: '主线任务',
      en: '',
    },
    start: '2026/04/17 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '主线任务',
    active: true,
    version: '春晓时',
    content: {
      originiumRecharge: 22,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
  },
  {
    id: '武陵_春晓时_重要任务',
    name: {
      zh: '重要任务',
      en: '',
    },
    start: '2026/04/17 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '重要任务',
    active: true,
    version: '春晓时',
    content: {
      originiumRecharge: 0,
      diamond: 1000,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
  },
  {
    id: '武陵_春晓时_次要任务',
    name: {
      zh: '次要任务',
      en: '',
    },
    start: '2026/04/17 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '次要任务',
    active: true,
    version: '春晓时',
    content: {
      originiumRecharge: 0,
      diamond: 150,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
  },
];

wulingTaskRewardTable.value.push(...tempTasksReward);

const etchSpaceSalvageReward = ref<Reward[]>([]);

const mergedEtchSpaceSalvageRewards = groupAndMergeTasksByVersionAndModule(
  '蚀像寻遗',
  etchSpaceSalvageRewardJson,
);

etchSpaceSalvageReward.value.push(...mergedEtchSpaceSalvageRewards);

let etchSpaceSalvageCrateRewardMax: number = 0;
for (const reward of etchSpaceSalvageCrateRewardTable) {
  etchSpaceSalvageCrateRewardMax += reward.content.diamond;
}

const etchSpaceSalvageCrateReward = ref<Reward>({
  id: 'etch_space_salvage_crate_reward',
  name: {
    zh: `蚀像寻遗储藏箱`,
    en: '',
  },
  start: '2026/01/21 12:00:00',
  end: '2099/12/31 12:00:00',
  type: '通用',
  module: '蚀刻空间',
  active: true,
  version: '零号委托',
  content: {
    originiumRecharge: 0,
    diamond: etchSpaceSalvageCrateRewardMax,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  },
  tips: ['通过滑块调节蚀像寻遗储藏箱奖励数量'],
});

const permanentAllReward: Reward[] = [
  beginnerSignInTaskReward.value,
  ...beginnerTicketgachaSpecialSingleTaskReward.value,
  ...etchSpaceSalvageReward.value,
  ...etchSpaceSalvageCrateRewardTable,
  ...newHorizonsTaskReward.value,
  ...valleyIVTaskRewardTable.value,
  ...wulingTaskRewardTable.value,
];

export {
  authorityLevelUpReward,
  beginnerSignInTaskReward,
  beginnerTicketgachaSpecialSingleTaskReward,
  etchSpaceSalvageCrateReward,
  etchSpaceSalvageCrateRewardMax,
  etchSpaceSalvageReward,
  newHorizonsTaskReward,
  permanentAllReward,
  permanentRewardTable,
  valleyIVTaskRewardTable,
  wulingTaskRewardTable,
};

export { default as authorityLevelUpRewardTable } from '@/custom/core/gacha/data/authority_level_up_reward_table.json';
