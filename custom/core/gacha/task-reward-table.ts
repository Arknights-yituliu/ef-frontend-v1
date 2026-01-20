import type { ItemDict, Reward } from '#shared/types/gacha-calculator.ts';
import { ref } from 'vue';


export const itemIdDict: ItemDict = {
  originiumRecharge: 'originium_recharge',
  diamond: 'diamond',
  ticketgachaStandardSingle: 'ticketgacha_standard_single',
  ticketgachaSpecialSingle: 'ticketgacha_special_single'
};

const beginnerSignInTask = ref<Reward>({
  id: 'beginner_sign_in_task',
  name: {
    zh: `新手签到奖励`,
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
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 11,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0
  }
});


for (let i = 0; i <1; i++) {

}

const nodeReward = ref<Reward>(
  {
    id: 'node_reward',
    name: {
      zh: `节点奖励`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '任务奖励',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 9000,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaStandardTen: 0,
      ticketgachaSpecialTen: 0
    }
  }
);

const authorityLevelTaskRewards = ref<Reward[]>([{
  id: 'authority_level_8_task_rewards',
  name: {
    zh: `权限等阶8奖励`,
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
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0
  }
},
  {
    id: 'authority_level_15_task_rewards',
    name: {
      zh: `权限等阶15奖励`,
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
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0,
      ticketgachaStandardTen: 0,
      ticketgachaSpecialTen: 0
    }
  },
  {
    id: 'authority_level_20_task_rewards',
    name: {
      zh: `权限等阶20奖励`,
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
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0,
      ticketgachaStandardTen: 0,
      ticketgachaSpecialTen: 0
    }
  },
  {
    id:'authority_level_30_task_rewards',
    name: {
      zh: `权限等阶30奖励`,
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
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0,
      ticketgachaStandardTen: 0,
      ticketgachaSpecialTen: 0
    }
  },
  {
    id: 'authority_level_45_task_rewards',
    name: {
      zh: `权限等阶45奖励`,
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
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0,
      ticketgachaStandardTen: 0,
      ticketgachaSpecialTen: 0
    }
  }
]);

const authorityLevelUpReward = ref<Reward>( {
  id: 'authority_level_up_reward',
  name: {
    zh: `权限等级提升奖励`,
    en: ''
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '任务奖励',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 3650,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0
  }
});



export {
  beginnerSignInTask, nodeReward,authorityLevelTaskRewards,authorityLevelUpReward
};


