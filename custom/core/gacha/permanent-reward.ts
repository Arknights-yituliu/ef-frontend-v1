import { ref } from 'vue';
import type { Reward } from '#shared/types/gacha-calculator';
import valleyIVTaskTable from './json/valley_IV_task_table.json';
import wulingTaskTable from './json/wuling_task_table.json';
import FactoryManualTable from './json/factory_manual_table.json';
import CharProfileTeaching from './json/char_profile_teaching_table.json';
import intelArchiveRewardJson from './json/intel_archive_reward.json';
import etchSpaceSalvageRewardJson from './json/etch_space_salvage_reward.json';


const newHorizonsTaskReward = ref<Reward[]>([
  {
    id: 'new_horizons_task_reward_1',
    name: {
      zh: `于此启程任务·1`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '常驻活动',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0
    }
  },
  {
    id: 'new_horizons_task_reward_2',
    name: {
      zh: `于此启程任务·2`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '常驻活动',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0
    }
  },
  {
    id: 'new_horizons_task_reward_3',
    name: {
      zh: `于此启程任务·2`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '常驻活动',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0
    }
  },
  {
    id: 'new_horizons_task_reward_4',
    name: {
      zh: `于此启程任务·4`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '常驻活动',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0
    }
  }
]);

const taskRewardTable = ref<Reward[]>([]);

const taskNameMap = new Map<string, string>();

for (const reward of valleyIVTaskTable) {
  taskRewardTable.value.push(reward);
  taskNameMap.set(reward.name.zh, reward.name.zh);
}

for (const reward of wulingTaskTable as Reward[]) {
  taskRewardTable.value.push(reward);
  taskNameMap.set(reward.name.zh, reward.name.zh);
}

export { taskRewardTable };

// export const taskRewardTable1 = ref<Reward[]>(TaskTable as Reward[])

const factoryManualRewardTable: Reward[] = FactoryManualTable as Reward[];

let factoryManualCountReward = 0;
for (const reward of factoryManualRewardTable) {
  factoryManualCountReward += reward.content.diamond;
}

const factoryManualRewardMax = factoryManualCountReward;

const factoryManualReward = ref<Reward>({
  id: 'factory_manual_reward',
  name: {
    zh: `简制手册奖励`,
    en: ''
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '简制手册',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: factoryManualCountReward,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0
  }
});


const characterTrainingReward = ref<Reward[]>([
  {
    id: '基础训练-通用战术',
    name: {
      zh: `基础训练-通用战术`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '节点手册·训练',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 60,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    }
  },
  {
    id: '基础训练-物理异常',
    name: {
      zh: `基础训练-物理异常`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '节点手册·训练',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 80,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    }
  },
  {
    id: '基础训练-法术异常',
    name: {
      zh: `基础训练-法术异常`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '节点手册·训练',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 100,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    }
  }
]);

for (const reward of CharProfileTeaching) {
  characterTrainingReward.value.push(reward);
}


const defenseConstructionReward = ref<Reward>({
  id: 'defense_construction_reward',
  name: {
    zh: `据点防御奖励`,
    en: ''
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '地区建设',
  regional: '四号谷地',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 1280,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0
  }
});

const intelArchiveReward = ref<Reward[]>([]);

for (const reward of intelArchiveRewardJson) {
  intelArchiveReward.value.push(reward);
}

const etchSpaceSalvageCrateRewardMax: number = 15 * 5 + 30 * 4 + 60 * 1;

const etchSpaceSalvageReward = ref<Reward[]>([]);

for (const reward of etchSpaceSalvageRewardJson) {
  etchSpaceSalvageReward.value.push(reward);
}


export {
  newHorizonsTaskReward,
  characterTrainingReward,
  defenseConstructionReward,
  factoryManualReward,
  factoryManualRewardMax,
  intelArchiveReward,
  etchSpaceSalvageReward
};


