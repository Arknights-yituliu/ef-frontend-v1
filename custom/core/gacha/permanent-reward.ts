import valleyIVTaskTable from './json/valley_IV_task_table.json';
import wulingTaskTable from './json/wuling_task_table.json';
import FactoryManualTable from './json/factory_manual_table.json';
import { ref } from 'vue';
import type { Reward } from '#shared/types/gacha-calculator';
import CharProfileTeaching from './json/char_profile_teaching_table.json'

const taskRewardTable = ref<Reward[]>([]);

const taskNameMap = new Map<string, string>();

for (const reward of valleyIVTaskTable) {
  taskRewardTable.value.push(reward);
  taskNameMap.set(reward.name.zh, reward.name.zh);
}

for(const reward of wulingTaskTable as Reward[]) {
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

const factoryManualMaxReward = factoryManualCountReward;

const factoryManualReward = ref<Reward>({
  id: 'factory_manual_reward',
  name: {
    zh: `简制手册奖励`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '常驻奖励',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: factoryManualCountReward,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

const beginnerSignInTaskReward = ref<Reward>({
  id: 'beginner_sign_in_task',
  name: {
    zh: `新手签到奖励`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '常驻奖励',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 11,
  },
});

const newHorizonsTaskReward = ref<Reward>({
  id: 'new_horizons_task_reward',
  name: {
    zh: `于此启程常驻奖励`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '常驻奖励',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 40,
    ticketgachaSpecialSingle: 0,
  },
});



const trainingReward = ref<Reward[]>([
  {
    id: '基础训练-通用战术',
    name: {
      zh: `基础训练-通用战术`,
      en: '',
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '常驻奖励',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 60,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
    },
  },
  {
    id: '基础训练-物理异常',
    name: {
      zh: `基础训练-物理异常`,
      en: '',
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '常驻奖励',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 80,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
    },
  },
  {
    id: '基础训练-法术异常',
    name: {
      zh: `基础训练-法术异常`,
      en: '',
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '常驻奖励',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 100,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
    },
  }
]);

for(const reward of CharProfileTeaching) {
  trainingReward.value.push(reward);
}



const defenseConstructionReward = ref<Reward>({
  id: 'defense_construction_reward',
  name: {
    zh: `据点防御奖励`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '常驻奖励',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 1280,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});




export {trainingReward,defenseConstructionReward,newHorizonsTaskReward,beginnerSignInTaskReward,factoryManualReward,factoryManualMaxReward}
