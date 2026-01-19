import type { Reward } from '#shared/types/gacha-calculator.ts';
import { ref } from 'vue';


const valleyIVRegionalStockBillStore = ref<Reward>({
  id: 12001,
  name: {
    zh: `调度券商店`,
    en: ''
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '任务奖励',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 5,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0
  }
});

const valleyIVRegionalDevelopmentReward = ref<Reward>({
  id: 12002,
  name: {
    zh: `地区建设等级奖励`,
    en: ''
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
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0
  }
});




const wulingRegionalStockBillStore = ref<Reward>({
  id: 12003,
  name: {
    zh: `调度券商店`,
    en: ''
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
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0
  }
});


const wulingRegionalDevelopmentReward = ref<Reward>({
  id: 12004,
  name: {
    zh: `地区建设等级奖励`,
    en: ''
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
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0
  }
});



export {
valleyIVRegionalDevelopmentReward, valleyIVRegionalStockBillStore, wulingRegionalDevelopmentReward,wulingRegionalStockBillStore
};
