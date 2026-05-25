import type { Reward } from '#shared/types/gacha-calculator';
import {
  groupAndMergeRewardsByVersion,
  groupAndMergeTasksByVersionAndModule,
  markRewardDefaultActive,
} from '#shared/utils/gacha-calculator';
import { ref } from 'vue';
import etchSpaceSalvageRewardJson from '@/custom/core/gacha/data/permanent_etch_space_salvage_reward.json';
import FactoryManualTableJson from '@/custom/core/gacha/data/permanent_factory_manual_table.json';
import IntelArchiveRewardJson from '@/custom/core/gacha/data/permanent_intel_archive_reward.json';
import operationalManualTrainingTableJson from '@/custom/core/gacha/data/permanent_operational_manual_training_table.json';

import permanentRewardTableJson from '@/custom/core/gacha/data/permanent_reward_table.json';
import valleyIVTableJson from '@/custom/core/gacha/data/permanent_valley_IV_table.json';
import valleyIVTaskTable from '@/custom/core/gacha/data/permanent_valley_IV_task_table.json';
import wulingTableJson from '@/custom/core/gacha/data/permanent_wuling_table.json';
import wulingTaskTable from '@/custom/core/gacha/data/permanent_wuling_task_table.json';

const currentVersion = '寻遗散记';

const permanentRewardTable = ref<Reward[]>([]);


function mergeReward(rewards: Reward[]) {
  for (const reward of rewards) {
    reward.start = new Date(reward.start);
    reward.end = new Date(reward.end);
    if (currentVersion === reward.version) {
      reward.active = true;
    } else {
      reward.active = false;
    }

    permanentRewardTable.value.push(markRewardDefaultActive(reward));
  }
}

mergeReward(permanentRewardTableJson as Reward[]);

mergeReward(valleyIVTableJson as Reward[]);

const mergedValleyIVTasks = groupAndMergeTasksByVersionAndModule('四号谷地', valleyIVTaskTable);

mergeReward(mergedValleyIVTasks as Reward[]);

mergeReward(wulingTableJson as Reward[]);

const mergedWulingTasks = groupAndMergeTasksByVersionAndModule('武陵', wulingTaskTable);

mergeReward(mergedWulingTasks as Reward[]);

const mergedEtchSpaceSalvageRewards = groupAndMergeTasksByVersionAndModule(
  '蚀像寻遗',
  etchSpaceSalvageRewardJson,
);

mergeReward(mergedEtchSpaceSalvageRewards as Reward[]);

const factoryManualMergeRewards = groupAndMergeRewardsByVersion(
  '简制手册奖励',
  FactoryManualTableJson,
);

mergeReward(factoryManualMergeRewards as Reward[]);

mergeReward(IntelArchiveRewardJson as Reward[]);

let operatorTotal = 0;

for (const reward of operationalManualTrainingTableJson as Reward[]) {
  if (reward.id.includes('干员教学')) {
    operatorTotal++;
  } else {
    reward.start = new Date(reward.start);
    reward.end = new Date(reward.end);
    permanentRewardTable.value.push(markRewardDefaultActive(reward));
    
  }
}

const operatorTraining = {
  id: 'operator_training',
  name: {
    zh: `干员教学`,
    en: '',
  },
  start: new Date('2026/01/22 12:00:00'),
  end: new Date('2099/12/31 12:00:00'),
  type: '通用',
  module: '行动手册',
  active: false,
  defaultActive: false,
  version: `零号委托——${currentVersion}`,
  content: {
    originiumRecharge: 0,
    diamond: operatorTotal * 20,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  },
};



permanentRewardTable.value.sort((a: { start: string | Date }, b: { start: string | Date }) => {
  const aTime = typeof a.start === 'string' ? new Date(a.start).getTime() : a.start.getTime();
  const bTime = typeof b.start === 'string' ? new Date(b.start).getTime() : b.start.getTime();
  return bTime - aTime;
});



// 这是一个独立的常驻奖励，使用滑块组件
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
  defaultActive: true,
  version: '零号委托',
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  },
});

export {  authorityLevelUpReward, permanentRewardTable };

export { default as authorityLevelUpRewardTable } from '@/custom/core/gacha/data/authority_level_up_reward_table.json';
