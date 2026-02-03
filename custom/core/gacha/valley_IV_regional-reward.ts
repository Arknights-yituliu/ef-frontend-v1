import type { CollectReward, Reward } from '#shared/types/gacha-calculator.ts';
import { ref } from 'vue';
import stageTable from './json/valley_IV_aurylene_stage_table.json'

const valleyIVAuryleneCollectStageTable: CollectReward[] = stageTable as CollectReward[];

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
    originiumRecharge: 43,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

const valleyIVCrateRewardMax:number = 93*15+91*30+93*60+11*100

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

const valleyIVBattleCrateRewardMax = 20;

const valleyIVBattleCrateReward = ref<Reward>({
  id: 'valley_IV_battle_crate_reward',
  name: {
    zh: `处理险情储藏箱奖励`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: "地区探索",
  active: true,
  content: {
    originiumRecharge: valleyIVBattleCrateRewardMax,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  }
})

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
  valleyIVAuryleneCollectStageTable,
  valleyIVAuryleneCollectReward,
  valleyIVCrateRewardMax,
  valleyIVCrateReward,
  valleyIVBattleCrateRewardMax,
  valleyIVBattleCrateReward,
  valleyIVSimulationReward,
  valleyIVDeltaBotRewardMax,
  valleyIVDeltaBotReward
};
