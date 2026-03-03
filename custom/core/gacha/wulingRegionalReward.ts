import type { CollectReward, Reward } from '#shared/types/gacha-calculator.ts';
import { ref } from 'vue';
import stageTable from './json/wuling_aurylene_stage_table.json';

const wulingAuryleneCollectStageTable: CollectReward[] = stageTable as CollectReward[];

const wulingRegionalStockBillStoreReward = ref<Reward[]>([
  {
    id: 'wuling_regional_stock_bill_store_reward',
    name: {
      zh: `调度券商店`,
      en: '',
    },
    start: '2026/01/22 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '地区建设',
    active: true,
    version: '零号委托',
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 2,
      ticketgachaSpecialSingle: 0,
    },
  },
  {
    id: 'wuling_regional_stock_bill_store_reward_v1_1',
    name: {
      zh: `调度券商店`,
      en: '',
    },
    start: '2026/01/22 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '地区建设',
    active: true,
    version: '新潮起·故渊离',
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 2,
      ticketgachaSpecialSingle: 0,
    },
  },
]);

const wulingRegionalDevelopmentReward = ref<Reward>({
  id: 'wuling_regional_development_reward',
  name: {
    zh: `地区建设等级奖励`,
    en: '',
  },
  start: '2026/01/22 12:00:00',
  end: '2099/12/31 12:00:00',
  type: '通用',
  module: '地区建设',
  active: true,
  version: '零号委托',
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
  start: '2026/01/22 12:00:00',
  end: '2099/12/31 12:00:00',
  type: '通用',
  module: '地区探索',
  active: true,
  version: '零号委托',
  content: {
    originiumRecharge: 17,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

const wulingCrateRewardV1_0: number = 94 * 15 + 68 * 30 + 34 * 60 + 26 * 100 + 15 * 150;
const wulingCrateRewardV1_1: number = 32 * 50;

const wulingCrateRewardMax: number = wulingCrateRewardV1_0 + wulingCrateRewardV1_1;

const wulingCrateReward = ref<Reward>({
  id: 'wuling_crate_reward',
  name: {
    zh: `储藏箱奖励`,
    en: '',
  },
  start: '2026/01/22 12:00:00',
  end: '2099/12/31 12:00:00',
  type: '通用',
  module: '地区探索',
  active: true,
  version: '零号委托',
  content: {
    originiumRecharge: 0,
    diamond: wulingCrateRewardMax,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
  tips: [
    `零号委托版本奖励为：${wulingCrateRewardV1_0}嵌晶玉`,
    `新潮起·故渊离版本奖励为：${wulingCrateRewardV1_1}嵌晶玉`,
  ],
});

const wulingBattleCrateRewardMax = 7;

const wulingBattleCrateReward = ref<Reward>({
  id: 'wuling_battle_crate_reward',
  name: {
    zh: `处理险情储藏箱奖励`,
    en: '',
  },
  start: '2026/01/22 12:00:00',
  end: '2099/12/31 12:00:00',
  type: '通用',
  module: '地区探索',
  active: true,
  version: '零号委托',
  content: {
    originiumRecharge: wulingBattleCrateRewardMax,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

const wulingDeltaBotRewardMax: number = 25 * 20;

const wulingDeltaBotReward = ref<Reward>({
  id: 'wuling_delta_bot_reward',
  name: {
    zh: `维修Delta机器人`,
    en: '',
  },
  start: '2026/01/22 12:00:00',
  end: '2099/12/31 12:00:00',
  type: '通用',
  module: '地区探索',
  active: true,
  version: '零号委托',
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
  start: '2026/01/22 12:00:00',
  end: '2099/12/31 12:00:00',
  type: '通用',
  module: '地区建设',
  active: true,
  version: '零号委托',
  content: {
    originiumRecharge: 0,
    diamond: 9 * 25,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

const wulingDefenseConstructionReward = ref<Reward[]>([
  {
    id: 'wuling_defense_construction_reward_1',
    name: {
      zh: `景玉谷据点防御`,
      en: '',
    },
    start: '2026/01/22 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '地区建设',
    active: true,
    version: '零号委托',
    content: {
      originiumRecharge: 0,
      diamond: 160,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
    },
  },
]);

export {
  wulingAuryleneCollectReward,
  wulingAuryleneCollectStageTable,
  wulingBattleCrateReward,
  wulingBattleCrateRewardMax,
  wulingCrateReward,
  wulingCrateRewardMax,
  wulingDefenseConstructionReward,
  wulingDeltaBotReward,
  wulingDeltaBotRewardMax,
  wulingRegionalDevelopmentReward,
  wulingRegionalStockBillStoreReward,
  wulingSimulationReward,
  wulingCrateRewardV1_0,
  wulingCrateRewardV1_1,
};
