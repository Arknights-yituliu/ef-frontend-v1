import type { Reward } from '#shared/types/gacha-calculator';
import { ref } from 'vue';
import etchSpaceSalvageRewardJson from '@/custom/core/gacha/data/etch_space_salvage_reward.json';
import valleyIVTaskTable from '@/custom/core/gacha/data/valley_IV_task_table.json';
import wulingTaskTable from '@/custom/core/gacha/data/wuling_task_table.json';
import { etchSpaceSalvageCrateRewardTable } from '@/custom/core/gacha/data/etchSpaceSalvageRewardTable';
const beginnerSignInTaskReward = ref<Reward>({
  id: 'beginner_sign_in_task',
  name: {
    zh: `唤醒签到奖励`,
    en: '',
  },
  start: '2026/01/22 12:00:00',
  end: '2099/12/31 12:00:00',
  type: '通用',
  module: '常驻活动',
  active: true,
  version: '零号委托',
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 11,
  },
});

const newHorizonsTaskReward = ref<Reward[]>([
  {
    id: 'new_horizons_task_reward_1',
    name: {
      zh: `于此启程任务·1`,
      en: '',
    },
    start: '2026/01/22 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '常驻活动',
    active: true,
    version: '零号委托',
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0,
    },
  },
  {
    id: 'new_horizons_task_reward_2',
    name: {
      zh: `于此启程任务·2`,
      en: '',
    },
    start: '2026/01/22 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '常驻活动',
    active: true,
    version: '零号委托',
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0,
    },
  },
  {
    id: 'new_horizons_task_reward_3',
    name: {
      zh: `于此启程任务·2`,
      en: '',
    },
    start: '2026/01/22 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '常驻活动',
    active: true,
    version: '零号委托',
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0,
    },
  },
  {
    id: 'new_horizons_task_reward_4',
    name: {
      zh: `于此启程任务·4`,
      en: '',
    },
    start: '2026/01/22 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '常驻活动',
    active: true,
    version: '零号委托',
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0,
    },
  },
]);

const beginnerTicketgachaSpecialSingleTaskReward = ref<Reward[]>([]);

for (let i = 1; i <= 5; i++) {
  const reward: Reward = {
    id: `新手特许赠礼·${i}`,
    name: {
      zh: `新手特许赠礼·${i}`,
      en: '',
    },
    start: '2026/03/12 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '常驻活动',
    active: true,
    version: '新潮起·故渊离',
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 2,
    },
  };
  beginnerTicketgachaSpecialSingleTaskReward.value.push(reward);
}

const mergedValleyIVTasks = groupAndMergeTasksByVersionAndModule('四号谷地', valleyIVTaskTable);
const valleyIVTaskRewardTable = ref<Reward[]>(mergedValleyIVTasks);
const mergedWulingTasks = groupAndMergeTasksByVersionAndModule('武陵', wulingTaskTable);
const wulingTaskRewardTable = ref<Reward[]>(mergedWulingTasks);

const tempTasksReward: Reward[] = [
  {
    id: '武陵-主线任务-新潮起·故渊离版本',
    name: {
      zh: `主线任务-新潮起·故渊离版本`,
      en: '',
    },
    start: '2026/03/12 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '主线任务',
    active: true,
    version: '新潮起·故渊离',
    content: {
      originiumRecharge: 10,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
    },
  },
  {
    id: '武陵-支线任务-新潮起·故渊离版本',
    name: {
      zh: `支线任务-新潮起·故渊离版本`,
      en: '',
    },
    start: '2026/03/12 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '其他任务',
    active: true,
    version: '新潮起·故渊离',
    content: {
      originiumRecharge: 0,
      diamond: 500,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
    },
  },
];

wulingTaskRewardTable.value.push(...tempTasksReward);

const etchSpaceSalvageReward = ref<Reward[]>([]);

for (const reward of etchSpaceSalvageRewardJson) {
  etchSpaceSalvageReward.value.push(reward);
}

let etchSpaceSalvageCrateRewardMax: number = 0;
for (const reward of etchSpaceSalvageCrateRewardTable) {

  etchSpaceSalvageCrateRewardMax += reward.content.diamond;
}

const etchSpaceSalvageCrateReward = ref<Reward>({
  id: 'etch_space_salvage_crate_reward',
  name: {
    zh: `蚀像寻遗储藏箱`,
    en: '',
  },
  start: '2026/01/21 12:00:00',
  end: '2099/12/31 12:00:00',
  type: '通用',
  module: '蚀刻空间',
  active: true,
  version: '零号委托',
  content: {
    originiumRecharge: 0,
    diamond:etchSpaceSalvageCrateRewardMax,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
  tips: ['通过滑块调节蚀像寻遗储藏箱奖励数量'],
});



const permanentAllReward: Reward[] = [];
permanentAllReward.push(beginnerSignInTaskReward.value);
permanentAllReward.push(...beginnerTicketgachaSpecialSingleTaskReward.value);
permanentAllReward.push(...etchSpaceSalvageReward.value);
permanentAllReward.push(...etchSpaceSalvageCrateRewardTable);
permanentAllReward.push(...newHorizonsTaskReward.value);
permanentAllReward.push(...valleyIVTaskRewardTable.value);
permanentAllReward.push(...wulingTaskRewardTable.value);


export {
  beginnerSignInTaskReward,
  beginnerTicketgachaSpecialSingleTaskReward,
  etchSpaceSalvageReward,
  newHorizonsTaskReward,
  valleyIVTaskRewardTable,
  wulingTaskRewardTable,
  etchSpaceSalvageCrateReward,
  etchSpaceSalvageCrateRewardMax,
  permanentAllReward,
};

/**
 * 根据version和module对wuling_task_table.json的数据进行分组和合并
 * @param regional 区域
 * @param tasks 任务数据数组
 * @returns 按version和module分组并合并后的结果
 */
function groupAndMergeTasksByVersionAndModule(regional: string, tasks: Reward[]): Reward[] {
  // 按version分组
  const versionGroups: Record<string, Reward[]> = {};

  for (const task of tasks) {
    const version = task.version || 'default';
    if (!versionGroups[version]) {
      versionGroups[version] = [];
    }
    versionGroups[version].push(task);
  }

  // 对每个version组，按module分组并合并

  const result: Reward[] = [];
  for (const [version, versionTasks] of Object.entries(versionGroups)) {
    // 按module分组
    const moduleGroups: Record<string, Reward[]> = {};

    for (const task of versionTasks) {
      const module = task.module || 'default';
      if (!moduleGroups[module]) {
        moduleGroups[module] = [];
      }
      moduleGroups[module].push(task);
    }

    // 合并每个module组
    for (const [module, moduleTasks] of Object.entries(moduleGroups)) {
      if (moduleTasks.length === 0) continue;

      // 使用第一个任务的属性作为基础
      const firstTask = moduleTasks[0];
      if (!firstTask) {
        continue;
      }
      const mergedTask: Reward = {
        ...firstTask,
        id: `${regional}_${version}_${module}`,
        name: {
          zh: `${firstTask.module}-${firstTask.version}`,
          en: ``,
        },
        content: {
          originiumRecharge: 0,
          diamond: 0,
          ticketgachaStandardSingle: 0,
          ticketgachaSpecialSingle: 0,
        },
      };

      // 合并content属性
      for (const task of moduleTasks) {
        mergedTask.content.originiumRecharge += task.content.originiumRecharge;
        mergedTask.content.diamond += task.content.diamond;
        mergedTask.content.ticketgachaStandardSingle += task.content.ticketgachaStandardSingle;
        mergedTask.content.ticketgachaSpecialSingle += task.content.ticketgachaSpecialSingle;
      }
      result.push(mergedTask);
    }
  }

  return result;
}
