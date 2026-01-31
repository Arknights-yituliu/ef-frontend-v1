import type { CollectReward, Reward } from '#shared/types/gacha-calculator.ts';
import { ref } from 'vue';

const wulingAuryleneCollectRewardTable: CollectReward[] = [
  {
    originiumRecharge: 1,
    stage: 1,
  },
  {
    originiumRecharge: 1,
    stage: 2,
  },
  {
    originiumRecharge: 2,
    stage: 3,
  },
  {
    originiumRecharge: 2,
    stage: 4,
  },
  {
    originiumRecharge: 2,
    stage: 5,
  },
  {
    originiumRecharge: 3,
    stage: 6,
  },
  {
    originiumRecharge: 3,
    stage: 7,
  },
  {
    originiumRecharge: 3,
    stage: 8,
  },
];


const wulingRegionalStockBillStoreReward = ref<Reward>({
  id: 'wuling_regional_stock_bill_store_reward',
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
    ticketgachaStandardSingle: 2,
    ticketgachaSpecialSingle: 0,
  },
});

const wulingRegionalDevelopmentReward = ref<Reward>({
  id: 'wuling_regional_development_reward',
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
    diamond: 1000,
    ticketgachaStandardSingle: 5,
    ticketgachaSpecialSingle: 0,
  },
});

const wulingAuryleneCollectReward = ref<Reward>({
  id: 'wuling_aurylene_collect_reward',
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
    originiumRecharge: 17,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

const wulingCrateRewardMax:number = 94*15+72*30+35*60+26*100

const wulingCrateReward = ref<Reward>({
  id: 'wuling_crate_reward',
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
    diamond: wulingCrateRewardMax,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

const wulingDeltaBotRewardMax:number = 25*20


const wulingDeltaBotReward = ref<Reward>({
  id: 'wuling_delta_bot_reward',
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
    diamond: wulingDeltaBotRewardMax,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});


const wulingSimulationReward = ref<Reward>({
  id: 'wuling_simulation_reward',
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
    diamond: 9*25,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

export {
  wulingRegionalDevelopmentReward,
  wulingRegionalStockBillStoreReward,
  wulingAuryleneCollectRewardTable,
  wulingAuryleneCollectReward,
  wulingCrateRewardMax,
  wulingCrateReward,
  wulingSimulationReward,
  wulingDeltaBotRewardMax,
  wulingDeltaBotReward
};
