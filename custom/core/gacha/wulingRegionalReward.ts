import type { Reward } from '#shared/types/gacha-calculator.ts';
import { groupAndMergeRewardsByVersion } from '#shared/utils/gacha-calculator';
import { ref } from 'vue';
import {
  wulingAuryleneCollectStageTable,
  wulingBattleCrateRewardTable,
  wulingCrateRewardTable,
  wulingRegionalDevelopmentRewardTable,
  wulingRegionalStockBillStoreRewardTable,
  wulingSimulationRewardTable,
} from '@/custom/core/gacha/data/wulingRegionalRewardTable';

const wulingRegionalStockBillStoreReward = ref<Reward[]>(wulingRegionalStockBillStoreRewardTable);

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
    ticketgachaLimitedSingle: 0,
  },
  tips: [
    '通过滑块调节当前地区建设等级',
    '零号协议版本武陵地区建设等级最高为6级',
    '新潮起·故渊离版本武陵地区建设等级最高为9级',
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
    ticketgachaLimitedSingle: 0,
  },
  tips: [
    '通过滑块调节当前醚质收集阶段',
    '零号协议版本醚质收集阶段最高为8级',
    '新潮起·故渊离版本醚质收集阶段最高为9级',
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
    ticketgachaLimitedSingle: 0,
  },
  tips: ['储藏箱因数量和种类较多，不提供具体选项，滑块拖动每格为5嵌晶玉'],
});

for (const reward of wulingCrateRewardTable) {
  wulingCrateRewardMax += reward.content.diamond;
  wulingCrateReward.value.content.diamond += reward.content.diamond;
  wulingCrateReward.value.tips?.push(
    `${reward.version}版本奖励为：${reward.content.diamond}嵌晶玉`,
  );
}

let wulingBattleCrateRewardMax: number = 0;

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
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  },
  tips: ['滑块拖动每格为1衍质源石'],
});

for (const reward of wulingBattleCrateRewardTable) {
  wulingBattleCrateRewardMax += reward.content.originiumRecharge;
  wulingBattleCrateReward.value.content.originiumRecharge += reward.content.originiumRecharge;
  wulingBattleCrateReward.value.tips?.push(
    `${reward.version}版本奖励为：${reward.content.originiumRecharge}衍质源石`,
  );
}






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
    ticketgachaLimitedSingle: 0,
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
      zh: `据点防御`,
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
      ticketgachaLimitedSingle: 0,
    },
  },{
    id: 'wuling_defense_construction_reward_2',
    name: {
      zh: `据点防御`,
      en: '',
    },
    start: '2026/03/12 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '地区建设',
    active: true,
    version: '新潮起· 故渊离',
    content: {
      originiumRecharge: 0,
      diamond: 80,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
  },{
    id: 'wuling_defense_construction_reward_3',
    name: {
      zh: `据点防御`,
      en: '',
    },
    start: '2026/04/17 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '地区建设',
    active: true,
    version: '春晓时',
    content: {
      originiumRecharge: 0,
      diamond: 160,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
  }
]);

const wulingRegionalAllRewardTable: Reward[] = [];

const wulingAuryleneCollectRewardsGroupByVersion: Reward[] = groupAndMergeRewardsByVersion(
  '醚质收集',
  wulingAuryleneCollectStageTable,
);


const wulingRegionalDevelopmentRewardsGroupByVersion: Reward[] = groupAndMergeRewardsByVersion(
  '地区等级建设',
  wulingRegionalDevelopmentRewardTable,
);


// 地区建设奖励包含：
//  调度券商店
//  地区建设等级
//  醚质收集
//  储藏箱+机器人
//  处理险情
//  模拟空间
//  景玉谷据点防御奖励


wulingRegionalAllRewardTable.push(
  ...wulingRegionalStockBillStoreReward.value,
  ...wulingRegionalDevelopmentRewardsGroupByVersion,
  ...wulingAuryleneCollectRewardsGroupByVersion,
  ...wulingCrateRewardTable,
  ...wulingBattleCrateRewardTable,
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
  wulingRegionalAllRewardTable,
  wulingRegionalDevelopmentReward,
  wulingRegionalStockBillStoreReward,
  wulingSimulationReward,
};


