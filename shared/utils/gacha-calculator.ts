import type {
  ItemDict,
  Reward,
  RewardContent,
  RewardStatisticsResultDetail,
  TotalPullsSingle,
} from '#shared/types/gacha-calculator';
import { numberFloor } from './numberUtil';

export const itemIdDict: ItemDict = {
  originiumRecharge: 'item_originium_recharge',
  diamond: 'item_diamond',
  ticketgachaStandardSingle: 'item_ticketgacha_standard_single',
  ticketgachaSpecialSingle: 'item_ticketgacha_special_single',
  ticketgachaLimitedSingle: 'item_ticketgacha_special_single_lt',
};

/**
 * 计算排期开始与结束日期的天数差
 * @param {Date|string|number} startDate 开始日期
 * @param {Date|string|number} endDate 结束日期
 * @returns {number} 俩个日期之间的天数差
 */
function calculateDaysDifference(
  startDate: Date | string | number,
  endDate: Date | string | number,
): number {
  // 转换为时间戳
  const startTimestamp = typeof startDate === 'number' ? startDate : new Date(startDate).getTime();
  const endTimestamp = typeof endDate === 'number' ? endDate : new Date(endDate).getTime();
  // 计算天数差
  return (endTimestamp - startTimestamp) / (1000 * 60 * 60 * 24);
}

function countTuesdaysBetweenV2(
  startDate: Date | string | number,
  endDate: Date | string | number,
): number {
  // 将输入转换为Date对象
  const start = new Date(startDate);
  const end = new Date(endDate);
  const oneDayTimestamp = 1000 * 60 * 60 * 24;
  const startTimestamp = start.getTime();
  const endTimestamp = end.getTime();
  let week = numberFloor((endTimestamp - startTimestamp) / oneDayTimestamp / 7, 0);
  if (start.getDay() !== 1) {
    week++;
  }

  return week;
}

function addReward(result: RewardStatisticsResultDetail, reward: Reward | Reward[]): void {
  if (Array.isArray(reward)) {
    for (const item of reward) {
      if (item.active) {
        result.originiumRecharge += item.content.originiumRecharge;
        result.diamond += item.content.diamond;
        result.ticketgachaStandardSingle += item.content.ticketgachaStandardSingle;
        result.ticketgachaSpecialSingle += item.content.ticketgachaSpecialSingle;
        result.ticketgachaLimitedSingle += item.content.ticketgachaLimitedSingle;
      }
    }
  } else {
    if (reward.active) {
      result.originiumRecharge += reward.content.originiumRecharge;
      result.diamond += reward.content.diamond;
      result.ticketgachaStandardSingle += reward.content.ticketgachaStandardSingle;
      result.ticketgachaSpecialSingle += reward.content.ticketgachaSpecialSingle;
      result.ticketgachaLimitedSingle += reward.content.ticketgachaLimitedSingle;
    }
  }
  // console.log(result.name,result.ticketgachaLimitedSingle);
}

function getRewardsPull(reward: RewardStatisticsResultDetail[]): TotalPullsSingle {
  const result: TotalPullsSingle = {
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  };
  for (const item of reward) {
    result.ticketgachaStandardSingle += item.ticketgachaStandardSingle;
    result.ticketgachaSpecialSingle +=
      item.diamond / 500 + (item.originiumRecharge * 75) / 500 + item.ticketgachaSpecialSingle;
  }

  return result;
}

function getRewardPull(reward: RewardStatisticsResultDetail): TotalPullsSingle {
  return {
    ticketgachaStandardSingle: reward.ticketgachaStandardSingle,
    ticketgachaSpecialSingle:
      reward.diamond / 500 +
      (reward.originiumRecharge * 75) / 500 +
      reward.ticketgachaSpecialSingle,
    ticketgachaLimitedSingle: reward.ticketgachaLimitedSingle,
  };
}

function createReward(
  name: string,
  content: RewardContent,
  type: string,
  module: string,
  version: string,
): Reward {
  return {
    id: name,
    name: {
      zh: name,
      en: '',
    },
    start: '2026/01/22 12:00:00',
    end: '2099/12/31 12:00:00',
    type: '通用',
    module: '地区探索',
    active: true,
    version,
    content,
  };
}

/**
 * 根据version和module对wuling_task_table.json的数据进行分组和合并
 * @param moduleId 模块名称
 * @param tasks 任务数据数组
 * @returns 按version和module分组并合并后的结果
 */
function groupAndMergeTasksByVersionAndModule(moduleId: string, tasks: Reward[]): Reward[] {
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
        id: `${moduleId}_${version}_${module}`,
        name: {
          zh: firstTask.regional ? `${firstTask.regional}-${moduleId}` : `${moduleId}`,
          en: ``,
        },
        content: {
          originiumRecharge: 0,
          diamond: 0,
          ticketgachaStandardSingle: 0,
          ticketgachaSpecialSingle: 0,
          ticketgachaLimitedSingle: 0,
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

function createRewardModuleTitle(title: string): Reward {
  return {
    id: `${title}`,
    name: {
      zh: `${title}`,
      en: '',
    },
    start: new Date('2025/12/31 12:00:00'),
    end: new Date('2025/12/31 12:00:00'),
    type: '标题',
    module: '标题',
    active: true,
    version: 'default',
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
  };
}

/**
 * 根据version对Reward数组进行分类，并将每组内的元素合并为一个Reward对象
 * @param name
 * @param rewards Reward类型数组
 * @returns 按version分类后的合并结果对象
 */
function groupAndMergeRewardsByVersion(name: string, rewards: Reward[]): Reward[] {
  // 按version分组
  const groupedRewards: Record<string, Reward[]> = {};

  for (const reward of rewards) {
    const version = reward.version || 'default';
    if (!groupedRewards[version]) {
      groupedRewards[version] = [];
    }
    groupedRewards[version].push(reward);
  }

  // 合并每组内的元素
  const mergedRewards: Reward[] = [];

  for (const [, rewardGroup] of Object.entries(groupedRewards)) {
    if (rewardGroup.length === 0) continue;

    // 使用第一个元素的属性作为基础
    const firstReward = rewardGroup[0] as Reward;
    const mergedReward: Reward = {
      ...firstReward,
      name: {
        zh: `${name}`,
        en: '',
      },
      content: {
        originiumRecharge: 0,
        diamond: 0,
        ticketgachaStandardSingle: 0,
        ticketgachaSpecialSingle: 0,
        ticketgachaLimitedSingle: 0,
      },
    };

    // 合并content属性
    for (const reward of rewardGroup) {
      mergedReward.content.originiumRecharge += reward.content.originiumRecharge;
      mergedReward.content.diamond += reward.content.diamond;
      mergedReward.content.ticketgachaStandardSingle += reward.content.ticketgachaStandardSingle;
      mergedReward.content.ticketgachaSpecialSingle += reward.content.ticketgachaSpecialSingle;
    }

    mergedRewards.push(mergedReward);
  }

  return mergedRewards;
}

// 规范化版本名称，去除所有空格，用于版本筛选时的一致性匹配
function normalizeVersionName(version?: string): string {
  return (version ?? '').replace(/\s/g, '');
}

export {
  addReward,
  calculateDaysDifference,
  countTuesdaysBetweenV2,
  createReward,
  createRewardModuleTitle,
  getRewardPull,
  getRewardsPull,
  groupAndMergeRewardsByVersion,
  groupAndMergeTasksByVersionAndModule,
  normalizeVersionName,
};
