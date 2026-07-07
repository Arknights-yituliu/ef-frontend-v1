import type { Reward } from '#shared/types/gacha-calculator';
import {
  groupAndMergeRewardsByVersion,
  groupAndMergeTasksByVersionAndModule,
} from '#shared/utils/gacha-calculator';
import { ref } from 'vue';
import etchSpaceSalvageRewardJson from '@/custom/core/gacha/data/permanent_etch_space_salvage_reward.json';
import FactoryManualTableJson from '@/custom/core/gacha/data/permanent_factory_manual_table.json';
import IntelArchiveRewardJson from '@/custom/core/gacha/data/permanent_intel_archive_reward.json';
import operationalManualTrainingTableJson from '@/custom/core/gacha/data/permanent_operational_manual_training_table.json';

import permanentOtherTableJson from '@/custom/core/gacha/data/permanent_other_table.json';
import permanentRewardTableJson from '@/custom/core/gacha/data/permanent_reward_table.json';
import valleyIVTableJson from '@/custom/core/gacha/data/permanent_valley_IV_table.json';
import valleyIVTaskTable from '@/custom/core/gacha/data/permanent_valley_IV_task_table.json';
import wulingTableJson from '@/custom/core/gacha/data/permanent_wuling_table.json';
import wulingTaskTable from '@/custom/core/gacha/data/permanent_wuling_task_table.json';
import PoolInfoTable from '@/custom/core/gacha/data/pool_info_table.json';
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

    permanentRewardTable.value.push(reward);
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
    permanentRewardTable.value.push(reward);
  }
}

const _operatorTraining = {
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
  version: `零号委托——${currentVersion}`,
  content: {
    originiumRecharge: 0,
    diamond: operatorTotal * 20,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  },
};

for (const reward of permanentOtherTableJson as Reward[]) {
  reward.start = new Date(reward.start);
  reward.end = new Date(reward.end);
  permanentRewardTable.value.push(reward);
}

const reward1: Reward = {
  id: '干员叙事·狼卫',
  name: {
    zh: '干员叙事·狼卫',
    en: '',
  },
  start: '2026/01/22 12:00:00',
  end: '2099/12/31 12:00:00',
  type: '通用',
  module: '干员叙事',
  regional: '四号谷地',
  active: false,
  version: '零号委托',
  content: {
    originiumRecharge: 0,
    diamond: 600,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  },
};

createNewPoolActivity();

permanentRewardTable.value.sort((a: { start: string | Date }, b: { start: string | Date }) => {
  const aTime = typeof a.start === 'string' ? new Date(a.start).getTime() : a.start.getTime();
  const bTime = typeof b.start === 'string' ? new Date(b.start).getTime() : b.start.getTime();
  return bTime - aTime;
});

function createNewPoolActivity() {
  permanentRewardTable.value.push(reward1);

  for (const item of PoolInfoTable) {
    const startDate = new Date(item.poolStart);

    if (item.narrative) {
      const reward2: Reward = {
        id: `干员叙事·${item.character}`,
        name: {
          zh: `干员叙事·${item.character}`,
          en: '',
        },
        start: startDate,
        end: new Date('2099-12-31 12:00:00'),
        type: '通用',
        module: '干员叙事',
        active: currentVersion === item.version,
        version: item.version,
        content: {
          originiumRecharge: 0,
          diamond: 600,
          ticketgachaStandardSingle: 0,
          ticketgachaSpecialSingle: 0,
          ticketgachaLimitedSingle: 0,
        },
      };
      permanentRewardTable.value.push(reward2);
    }
  }
}

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
  version: '基础资源',
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  },
});

export { authorityLevelUpReward, permanentRewardTable };

export { default as authorityLevelUpRewardTable } from '@/custom/core/gacha/data/authority_level_up_reward_table.json';
