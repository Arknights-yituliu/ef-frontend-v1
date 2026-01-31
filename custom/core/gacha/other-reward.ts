import type {  Reward } from '#shared/types/gacha-calculator.ts';
import otherRewardTableJson from './json/other.json';
import {  ref } from 'vue';

const otherRewardTable= ref<Reward[]>([]);

for(const reward of otherRewardTableJson){
  otherRewardTable.value.push(reward);
}

export {
  otherRewardTable,
}
