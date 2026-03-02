import type {  Reward } from '#shared/types/gacha-calculator.ts';
import {  ref } from 'vue';
import FactoryManualTable from './json/factory_manual_table.json';
import GameMaintenance from './json/game_maintenance.json'
import IntelArchiveRewardJson from './json/intel_archive_reward.json';
import OtherRewardTableJson from './json/other.json';

const otherRewardTable= ref<Reward[]>([]);

for(const reward of OtherRewardTableJson as Reward[]){
  reward.start = new Date(reward.start)
  reward.end = new Date(reward.end)
  otherRewardTable.value.push(reward);
}

for(const reward of GameMaintenance as Reward[]){
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
  active: true,version: "零号协议",
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
