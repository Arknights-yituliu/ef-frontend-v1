import TaskTable from './task-table.json'
import FactoryManualTable from './factory-manual-table.json'
import { ref } from 'vue';
import type { Reward } from '#shared/types/gacha-calculator';
export const taskRewardTable = ref<Reward[]>(TaskTable as Reward[])

export const factoryManualRewardTable:Reward[] = FactoryManualTable as Reward[]


let factoryManualCountReward = 0
for(const reward of factoryManualRewardTable) {
  factoryManualCountReward+=reward.content.diamond
}

export const factoryManualMaxReward = factoryManualCountReward

export const factoryManualReward = ref<Reward>({
  id: 'factory_manual_reward',
  name: {
    zh: `简制手册奖励`,
    en: ''
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '任务奖励',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: factoryManualCountReward,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0
  }
});


export const defenseConstructionReward  = ref<Reward>({
  id: 'defense_construction_reward',
  name: {
    zh: `据点防御奖励`,
    en: ''
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '任务奖励',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 1280,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0
  }
});


