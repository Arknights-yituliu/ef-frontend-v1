import type {  Reward } from '#shared/types/gacha-calculator.ts';
import otherRewardTableJson from './json/other.json';
import {  ref } from 'vue';

const otherRewardTable= ref<Reward[]>([]);

for(const reward of otherRewardTableJson as Reward[]){
  reward.start = new Date(reward.start)
  reward.end = new Date(reward.end)
  otherRewardTable.value.push(reward);
}

export {
  otherRewardTable,
}
