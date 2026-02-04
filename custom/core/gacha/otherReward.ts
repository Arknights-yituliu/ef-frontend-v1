import type {  Reward } from '#shared/types/gacha-calculator.ts';
import otherRewardTableJson from './json/other.json';
import {  ref } from 'vue';
import intelArchiveRewardJson from './json/intel_archive_reward.json';
import FactoryManualTable from './json/factory_manual_table.json';

const otherRewardTable= ref<Reward[]>([]);

for(const reward of otherRewardTableJson as Reward[]){
  reward.start = new Date(reward.start)
  reward.end = new Date(reward.end)
  otherRewardTable.value.push(reward);
}

const intelArchiveReward = ref<Reward[]>([]);

for (const reward of intelArchiveRewardJson) {
  intelArchiveReward.value.push(reward);
}

const factoryManualRewardTable: Reward[] = FactoryManualTable as Reward[];

let factoryManualCountReward = 0;
for (const reward of factoryManualRewardTable) {
  factoryManualCountReward += reward.content.diamond;
}

const factoryManualRewardMax = factoryManualCountReward;

const factoryManualReward = ref<Reward>({
  id: 'factory_manual_reward',
  name: {
    zh: `简制手册奖励`,
    en: ''
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '简制手册',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: factoryManualCountReward,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0
  }
});

export {
  factoryManualReward,
  factoryManualRewardMax,
  intelArchiveReward,
  otherRewardTable,
}
