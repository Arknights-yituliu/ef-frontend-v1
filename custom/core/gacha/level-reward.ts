import type { ItemDict, Reward } from '#shared/types/gacha-calculator.ts';
import { ref } from 'vue';


export const itemIdDict: ItemDict = {
  originiumRecharge: 'originium_recharge',
  diamond: 'diamond',
  ticketgachaStandardSingle: 'ticketgacha_standard_single',
  ticketgachaSpecialSingle: 'ticketgacha_special_single'
};




for (let i = 0; i < 1; i++) {

}

export const operationalManualNodeReward = ref<Reward>(
  {
    id: 'operational_manual_node_reward',
    name: {
      zh: `节点奖励`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '权限等阶提升活动',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 9000,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    }
  }
);

export const authorityLevelTaskRewards = ref<Reward[]>([{
  id: 'authority_level_8_task_rewards',
  name: {
    zh: `权限等阶8奖励`,
    en: ''
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '权限等阶提升活动',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 10,
    ticketgachaSpecialSingle: 0
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
    module: '权限等阶提升活动',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 1000,
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0
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
    module: '权限等阶提升活动',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 1000,
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0
    }
  },
  {
    id: 'authority_level_30_task_rewards',
    name: {
      zh: `权限等阶30奖励`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '权限等阶提升活动',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 1000,
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0
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
    module: '权限等阶提升活动',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 1000,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    }
  }
]);

export const authorityLevelUpReward = ref<Reward>({
  id: 'authority_level_up_reward',
  name: {
    zh: `权限等级提升奖励`,
    en: ''
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '权限等阶提升',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 4500,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0
  }
});

export const worldLevelReward = ref<Reward>({
  id: 'world_level_reward',
  name: {
    zh: `探索等级奖励`,
    en: ''
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '探索等级',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 12,
    ticketgachaSpecialSingle: 0
  }
});

export const etchSpaceSalvageReward = ref<Reward[]>([
  {
    id: 'etch_space_salvage_300_reward',
    name: {
      zh: `蚀像寻遗`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '蚀像寻遗',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 2,
      ticketgachaSpecialSingle: 0
    }
  },
  {
    id: 'etch_space_salvage_1200_reward',
    name: {
      zh: `蚀像寻遗`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '蚀像寻遗',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 400,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    }
  },{
    id: 'etch_space_salvage_2500_reward',
    name: {
      zh: `蚀像寻遗`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '蚀像寻遗',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 2,
      ticketgachaSpecialSingle: 0
    }
  },
  {
    id: 'etch_space_salvage_5000_reward',
    name: {
      zh: `蚀像寻遗`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '蚀像寻遗',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 400,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    }
  },
  {
    id: 'etch_space_salvage_10000_reward',
    name: {
      zh: `蚀像寻遗`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '蚀像寻遗',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 2,
      ticketgachaSpecialSingle: 0
    }
  },
  {
    id: 'etch_space_salvage_20000_reward',
    name: {
      zh: `蚀像寻遗`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '蚀像寻遗',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 400,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    }
  },{
    id: 'etch_space_salvage_30000_reward',
    name: {
      zh: `蚀像寻遗`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '蚀像寻遗',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 2,
      ticketgachaSpecialSingle: 0
    }
  },
  {
    id: 'etch_space_salvage_40000_reward',
    name: {
      zh: `蚀像寻遗`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '蚀像寻遗',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 400,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    }
  },
  {
    id: 'etch_space_salvage_50000_reward',
    name: {
      zh: `蚀像寻遗`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '蚀像寻遗',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 2,
      ticketgachaSpecialSingle: 0
    }
  }
]);



