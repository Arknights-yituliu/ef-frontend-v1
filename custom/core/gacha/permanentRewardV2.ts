import type { Reward } from '#shared/types/gacha-calculator';
import { groupAndMergeTasksByVersionAndModule } from '#shared/utils/gacha-calculator';
import { ref } from 'vue';
import etchSpaceSalvageRewardJson from '@/custom/core/gacha/data/etch_space_salvage_reward.json';
import permanentRewardTableJson from '@/custom/core/gacha/data/permanent_reward_table.json';
import valleyIVTaskTable from '@/custom/core/gacha/data/valley_IV_task_table.json';
import wulingTaskTable from '@/custom/core/gacha/data/wuling_task_table.json';


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

const permanentRewardTable = ref<Reward[]>([]);
for (const reward of permanentRewardTableJson) {
  permanentRewardTable.value.push(reward);
}



const mergedValleyIVTasks = groupAndMergeTasksByVersionAndModule('四号谷地', valleyIVTaskTable);
permanentRewardTable.value.push(...mergedValleyIVTasks);


const mergedWulingTasks = groupAndMergeTasksByVersionAndModule('武陵', wulingTaskTable);
permanentRewardTable.value.push(...mergedWulingTasks);



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
    module: '武陵·主线任务',
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
    module: '武陵·重要任务',
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
    module: '武陵·次要任务',
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

permanentRewardTable.value.push(...tempTasksReward);



const mergedEtchSpaceSalvageRewards = groupAndMergeTasksByVersionAndModule(
  '蚀像寻遗',
  etchSpaceSalvageRewardJson,
);

permanentRewardTable.value.push(...mergedEtchSpaceSalvageRewards);

permanentRewardTable.value.sort((a: { start: string | number | Date; }, b: { start: string | number | Date; }) => {
  return new Date(b.start).getTime() - new Date(a.start).getTime();
});

export { authorityLevelUpReward, permanentRewardTable };

export { default as authorityLevelUpRewardTable } from '@/custom/core/gacha/data/authority_level_up_reward_table.json';
