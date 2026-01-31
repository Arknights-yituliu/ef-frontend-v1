import type { CollectReward, Reward } from '#shared/types/gacha-calculator.ts';
import { ref } from 'vue';

const valleyIVAuryleneCollectRewardTable: CollectReward[] = [
  {
    originiumRecharge: 1,
    stage: 1,
  },
  {
    originiumRecharge: 1,
    stage: 2,
  },
  {
    originiumRecharge: 1,
    stage: 3,
  },
  {
    originiumRecharge: 1,
    stage: 4,
  },
  {
    originiumRecharge: 1,
    stage: 5,
  },
  {
    originiumRecharge: 2,
    stage: 6,
  },
  {
    originiumRecharge: 2,
    stage: 7,
  },
  {
    originiumRecharge: 2,
    stage: 8,
  },
  {
    originiumRecharge: 3,
    stage: 9,
  },
  {
    originiumRecharge: 3,
    stage: 10,
  },
  {
    originiumRecharge: 3,
    stage: 11,
  },
  {
    originiumRecharge: 3,
    stage: 12,
  },
  {
    originiumRecharge: 3,
    stage: 13,
  },
  {
    originiumRecharge: 3,
    stage: 14,
  },
  {
    originiumRecharge: 3,
    stage: 15,
  },
  {
    originiumRecharge: 3,
    stage: 16,
  },
  {
    originiumRecharge: 3,
    stage: 17,
  },
  {
    originiumRecharge: 3,
    stage: 18,
  },
];

const valleyIVRegionalStockBillStoreReward = ref<Reward>({
  id: 'valley_IV_regional_stock_bill_store_reward',
  name: {
    zh: `调度券商店`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: "地区建设",
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 9,
    ticketgachaSpecialSingle: 0,
  },
});

const valleyIVRegionalDevelopmentReward = ref<Reward>({
  id: 'valley_IV_regional_development_reward',
  name: {
    zh: `地区建设等级奖励`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: "地区建设",
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 2200,
    ticketgachaStandardSingle: 14,
    ticketgachaSpecialSingle: 0,
  },
});



const valleyIVAuryleneCollectReward = ref<Reward>({
  id: 'valley_IV_aurylene_collect_reward',
  name: {
    zh: `醚质收集`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: "地区探索",
  active: true,
  content: {
    originiumRecharge: 60,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

const valleyIVCrateRewardMax:number = 93*15+91*30+93*60+11*100+7*75

const valleyIVCrateReward = ref<Reward>({
  id: 'valley_IV_crate_reward',
  name: {
    zh: `储藏箱奖励`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: "地区探索",
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: valleyIVCrateRewardMax,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

const valleyIVDeltaBotRewardMax:number = 48*20


const valleyIVDeltaBotReward = ref<Reward>({
  id: 'valley_IV_delta_bot_reward',
  name: {
    zh: `维修Delta机器人`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: "地区探索",
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: valleyIVDeltaBotRewardMax,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

const valleyIVSimulationReward = ref<Reward>({
  id: 'valley_IV_simulation_reward',
  name: {
    zh: `模拟空间奖励`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: "地区建设",
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 26*25,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});


export {
  valleyIVRegionalDevelopmentReward,
  valleyIVRegionalStockBillStoreReward,
  valleyIVAuryleneCollectRewardTable,
  valleyIVAuryleneCollectReward,
  valleyIVCrateRewardMax,
  valleyIVCrateReward,
  valleyIVSimulationReward,
  valleyIVDeltaBotRewardMax,
  valleyIVDeltaBotReward
};
