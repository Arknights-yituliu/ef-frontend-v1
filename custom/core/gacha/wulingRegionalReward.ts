import type { Reward } from '#shared/types/gacha-calculator.ts';
import { groupAndMergeRewardsByVersion } from '#shared/utils/gacha-calculator';
import { ref } from 'vue';
import {
  wulingAuryleneCollectStageTable,
  wulingCrateRewardTable,
  wulingRegionalDevelopmentRewardTable,
  wulingSimulationRewardTable,
} from '@/custom/core/gacha/data/wulingRegionalRewardTable';

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
  tips: [
    '通过滑块调节当前地区建设等级',
    '零号协议版本武陵地区建设等级最高为6级',
    '新潮起·故渊离版本武陵地区建设等级最高为*级',
  ],
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
  tips: [
    '通过滑块调节当前醚质收集阶段',
    '零号协议版本醚质收集阶段最高为8级',
    '新潮起·故渊离版本醚质收集阶段最高为*级',
  ],
});

let wulingCrateRewardMax: number = 0;

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
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
  tips: ['储藏箱因数量和种类较多，不提供具体选项，滑块拖动每格为5合成玉'],
});

for (const reward of wulingCrateRewardTable) {
  wulingCrateRewardMax += reward.content.diamond;
  wulingCrateReward.value.content.diamond += reward.content.diamond;
  wulingCrateReward.value.tips?.push(
    `${reward.version}版本奖励为：${reward.content.diamond}嵌晶玉`,
  );
}

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
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
  tips: ['通过滑块调节奖励总量'],
});

for (const reward of wulingSimulationRewardTable) {
  wulingSimulationReward.value.content.diamond += reward.content.diamond;
  wulingSimulationReward.value.tips?.push(
    `${reward.version}版本奖励为：${reward.content.diamond}嵌晶玉`,
  );
}

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

const wulingRegionalAllRewardTable: Reward[] = [];

for (const reward of wulingRegionalStockBillStoreReward.value) {
  wulingRegionalAllRewardTable.push(reward);
}
const auryleneCollectRewards: Reward[] = groupAndMergeRewardsByVersion(
  '醚质收集',
  wulingAuryleneCollectStageTable,
);

for (const reward of auryleneCollectRewards) {
  wulingRegionalAllRewardTable.push(reward);
}

for (const reward of wulingCrateRewardTable) {
  wulingRegionalAllRewardTable.push(reward);
}

const regionalDevelopmentRewards: Reward[] = groupAndMergeRewardsByVersion(
  '地区等级建设',
  wulingRegionalDevelopmentRewardTable,
);

for (const reward of regionalDevelopmentRewards) {
  wulingRegionalAllRewardTable.push(reward);
}

wulingRegionalAllRewardTable.push(
  wulingBattleCrateReward.value,
  wulingSimulationReward.value,
  ...wulingDefenseConstructionReward.value,
);

export {
  wulingAuryleneCollectReward,
  wulingBattleCrateReward,
  wulingBattleCrateRewardMax,
  wulingCrateReward,
  wulingCrateRewardMax,
  wulingDefenseConstructionReward,
  wulingRegionalDevelopmentReward,
  wulingRegionalStockBillStoreReward,
  wulingSimulationReward,
  wulingRegionalAllRewardTable,
};

export {
  wulingAuryleneCollectStageTable,
  wulingRegionalDevelopmentRewardTable,
} from '@/custom/core/gacha/data/wulingRegionalRewardTable';
