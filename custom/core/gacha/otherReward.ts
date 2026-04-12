import type {  Reward } from '#shared/types/gacha-calculator.ts';
import { groupAndMergeRewardsByVersion } from '#shared/utils/gacha-calculator.ts';
import {  ref } from 'vue';
import FactoryManualTable from '@/custom/core/gacha/data/factory_manual_table.json';
import IntelArchiveRewardJson from '@/custom/core/gacha/data/intel_archive_reward.json';
import OtherRewardTableJson from '@/custom/core/gacha/data/other.json';

const otherRewardTable= ref<Reward[]>([]);

for(const reward of OtherRewardTableJson as Reward[]){
  reward.start = new Date(reward.start)
  reward.end = new Date(reward.end)
  otherRewardTable.value.push(reward);
}

const intelArchiveReward = ref<Reward[]>([]);

for (const reward of IntelArchiveRewardJson) {
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
  start: '2026/01/22 12:00:00',
  end: '2099/12/31 12:00:00',
  type: '通用',
  module: '简制手册',
  active: true,version: "零号委托",
  content: {
    originiumRecharge: 0,
    diamond: factoryManualCountReward,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0
  },
  tips: [
    '通过滑块调节当前简制手册奖励阶段',
  ]
});


const factoryManualMergeRewards: Reward[] = groupAndMergeRewardsByVersion(
  '简制手册奖励',
  FactoryManualTable,
);





const otherAllRewardTable = ref<Reward[]>([]);
otherAllRewardTable.value.push(...otherRewardTable.value, ...intelArchiveReward.value, ...factoryManualMergeRewards);

export {
  factoryManualReward,
  factoryManualRewardMax,
  intelArchiveReward,
  otherAllRewardTable,
  otherRewardTable,
}
