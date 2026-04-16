import type { Reward } from '#shared/types/gacha-calculator';
import { groupAndMergeTasksByVersionAndModule } from '#shared/utils/gacha-calculator';
import { ref } from 'vue';
import etchSpaceSalvageRewardJson from '@/custom/core/gacha/data/etch_space_salvage_reward.json';
import FactoryManualTableJson from '@/custom/core/gacha/data/factory_manual_table.json';
import IntelArchiveRewardJson from '@/custom/core/gacha/data/intel_archive_reward.json';
import operationalManualTrainingTableJson from '@/custom/core/gacha/data/operational_manual_training_table.json';
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
const archivePermanentRewardTable = ref<Reward[]>([]);

const currentVersion = '春晓时';

for(const reward of IntelArchiveRewardJson as Reward[]){
  reward.start = new Date(reward.start)
  reward.end = new Date(reward.end)
  if(currentVersion === reward.version){
    permanentRewardTable.value.push(reward);
  }else{
    archivePermanentRewardTable.value.push(reward);
  }
}

let operatorTotal = 0;

for (const reward of operationalManualTrainingTableJson as Reward[]) {
  if(reward.id.includes('干员教学')){
   operatorTotal++
  }else{
    reward.start = new Date(reward.start)
    reward.end = new Date(reward.end)
    if(currentVersion === reward.version){
      permanentRewardTable.value.push(reward);
    }else{
      archivePermanentRewardTable.value.push(reward);
    }
  }
}

const operatorTraining =  {
  id: 'operator_training',
  name: {
    zh: `干员教学`,
    en: '',
  },
  start: new Date('2026/01/22 12:00:00'),
  end: new Date('2099/12/31 12:00:00'),
  type: '通用',
  module: '权限等阶提升',
  active: true,
  version: `零号委托——${currentVersion}`,
  content: {
    originiumRecharge: 0,
    diamond: operatorTotal * 20,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  },
}

permanentRewardTable.value.push(operatorTraining);

const factoryManualMergeRewards: Reward[] = groupAndMergeRewardsByVersion(
  '简制手册奖励',
  FactoryManualTableJson,
);

for (const reward of permanentRewardTableJson as Reward[]) {
  reward.start = new Date(reward.start)
  reward.end = new Date(reward.end)
  if(currentVersion === reward.version){
    permanentRewardTable.value.push(reward);
  }else{
    archivePermanentRewardTable.value.push(reward);
  }
}

for (const reward of factoryManualMergeRewards as Reward[]) {
  reward.start = new Date(reward.start)
  reward.end = new Date(reward.end)
  if(currentVersion === reward.version){
    permanentRewardTable.value.push(reward);
  }else{
    archivePermanentRewardTable.value.push(reward);
  }
}






const mergedValleyIVTasks = groupAndMergeTasksByVersionAndModule('四号谷地', valleyIVTaskTable);
for (const reward of mergedValleyIVTasks as Reward[]) {
  reward.start = new Date(reward.start)
  reward.end = new Date(reward.end)
  if(currentVersion === reward.version){
    permanentRewardTable.value.push(reward);
  }else{
    archivePermanentRewardTable.value.push(reward);
  }
}



const mergedWulingTasks = groupAndMergeTasksByVersionAndModule('武陵', wulingTaskTable);
for (const reward of mergedWulingTasks as Reward[]) {
  reward.start = new Date(reward.start)
  reward.end = new Date(reward.end)
  if(currentVersion === reward.version){
    permanentRewardTable.value.push(reward);
  }else{
    archivePermanentRewardTable.value.push(reward);
  }
}






const tempTasksReward: Reward[] = [
  {
    id: '武陵_春晓时_主线任务',
    name: {
      zh: '主线任务',
      en: '',
    },
    start: new Date('2026/04/17 12:00:00'),
    end: new Date('2099/12/31 12:00:00'),
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
    start: new Date('2026/04/17 12:00:00'),
    end: new Date('2099/12/31 12:00:00'),
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
    start: new Date('2026/04/17 12:00:00'),
    end: new Date('2099/12/31 12:00:00'),
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

for (const reward of mergedEtchSpaceSalvageRewards as Reward[]) {
  reward.start = new Date(reward.start)
  reward.end = new Date(reward.end)
  if(currentVersion === reward.version){
    permanentRewardTable.value.push(reward);
  }else{
    archivePermanentRewardTable.value.push(reward);
  }
}



permanentRewardTable.value.sort((a: { start: string | Date; }, b: { start: string |  Date; }) => {
  const aTime = typeof a.start === 'string' ? new Date(a.start).getTime() : a.start.getTime();
  const bTime = typeof b.start === 'string' ? new Date(b.start).getTime() : b.start.getTime();
  return bTime - aTime;
});

export { archivePermanentRewardTable, authorityLevelUpReward, permanentRewardTable };

export { default as authorityLevelUpRewardTable } from '@/custom/core/gacha/data/authority_level_up_reward_table.json';
