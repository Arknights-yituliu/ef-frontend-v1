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

const valleyIVRegionalStockBillStoreReward = ref<Reward>({
  id: 'valley_IV_regional_stock_bill_store_reward',
  name: {
    zh: `调度券商店`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '任务奖励',
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
  module: '任务奖励',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 2200,
    ticketgachaStandardSingle: 14,
    ticketgachaSpecialSingle: 0,
  },
});

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

const valleyIVAuryleneCollectReward = ref<Reward>({
  id: 'valley_IV_aurylene_collect_reward',
  name: {
    zh: `醚质收集`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '任务奖励',
  active: true,
  content: {
    originiumRecharge: 60,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

const valleyIVCrateReward = ref<Reward>({
  id: 'valley_IV_crate_reward',
  name: {
    zh: `储藏箱奖励`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '任务奖励',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 8640,
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
  module: '任务奖励',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 26*25,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

const wulingRegionalStockBillStoreReward = ref<Reward>({
  id: 'wuling_regional_stock_bill_store_reward',
  name: {
    zh: `调度券商店`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '任务奖励',
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
  module: '任务奖励',
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
  module: '任务奖励',
  active: true,
  content: {
    originiumRecharge: 17,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

const wulingCrateReward = ref<Reward>({
  id: 'wuling_crate_reward',
  name: {
    zh: `储藏箱奖励`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '任务奖励',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 5490,
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
  module: '任务奖励',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 9*25,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

export {
  valleyIVRegionalDevelopmentReward,
  valleyIVRegionalStockBillStoreReward,
  valleyIVAuryleneCollectRewardTable,
  valleyIVAuryleneCollectReward,
  valleyIVCrateReward,
  valleyIVSimulationReward,
  wulingRegionalDevelopmentReward,
  wulingRegionalStockBillStoreReward,
  wulingAuryleneCollectRewardTable,
  wulingAuryleneCollectReward,
  wulingCrateReward,
  wulingSimulationReward
};
