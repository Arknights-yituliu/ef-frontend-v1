import type {
  RewardStatisticsResultDetail,
  Reward,
  TotalPullsSingle
} from '#shared/types/gacha-calculator';
import { AICQuotaReward } from '@/custom/core/gacha/dailyReward';
import { activityReward } from '@/custom/core/gacha/activityReward';
import {
  valleyIVAuryleneCollectReward,
  valleyIVCrateReward,
  valleyIVRegionalDevelopmentReward,
  valleyIVRegionalStockBillStoreReward,
  valleyIVSimulationReward,
} from '@/custom/core/gacha/valleyIVRegionalReward';
import {
  wulingAuryleneCollectReward, wulingCrateReward,
  wulingRegionalDevelopmentReward,
  wulingRegionalStockBillStoreReward, wulingSimulationReward
} from '@/custom/core/gacha/wulingRegionalReward';
import { authorityLevelTaskRewards, authorityLevelUpReward, worldLevelReward } from '@/custom/core/gacha/levelReward';
import { operationalManualNodeReward, operationalManualReward } from '@/custom/core/gacha/operationalManualReward';
import { beginnerSignInTaskReward, defenseConstructionReward, etchSpaceSalvageReward, valleyIVTaskRewardTable } from '@/custom/core/gacha/permanentReward';
import { factoryManualReward } from '@/custom/core/gacha/otherReward';

/**
 * 计算排期开始与结束日期的天数差
 * @param {Date|string|number} startDate 开始日期
 * @param {Date|string|number} endDate 结束日期
 * @returns {number} 俩个日期之间的天数差
 */
function calculateDaysDifference(
  startDate: Date | string | number,
  endDate: Date | string | number
): number {
  // 转换为时间戳
  const startTimestamp = typeof startDate === 'number' ? startDate : new Date(startDate).getTime();
  const endTimestamp = typeof endDate === 'number' ? endDate : new Date(endDate).getTime();
  // 计算天数差
  return (endTimestamp - startTimestamp) / (1000 * 60 * 60 * 24);
}


/**
 * 计算两个时间之间有多少个周二
 * @param startDate 开始时间，可以是Date对象、字符串或时间戳
 * @param endDate 结束时间，可以是Date对象、字符串或时间戳
 * @returns 两个时间之间周二的数量
 */
function countTuesdaysBetween(
  startDate: Date | string | number,
  endDate: Date | string | number
): number {
  // 将输入转换为Date对象
  const start = new Date(startDate);
  const end = new Date(endDate);

  // 确保开始时间不晚于结束时间
  if (start > end) {
    // [start, end] = [end, start];
  }

  // 设置时间为当天的0点，避免时间部分影响计算
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // 获取星期几（0-6，0是周日）
  const startDay = start.getDay();
  const endDay = end.getDay();

  // 计算开始日期到下一个周二的天数差
  // 周二是2，所以计算：如果是周二，差0天；如果是周三，差6天；如果是周一，差1天，以此类推
  const daysToFirstTuesday = (9 - startDay) % 7;

  // 创建第一个周二的日期
  const firstTuesday = new Date(start);
  firstTuesday.setDate(start.getDate() + daysToFirstTuesday);

  // 如果第一个周二在开始日期之后但开始日期本身就是周二，需要调整
  if (firstTuesday > start && startDay === 2) {
    firstTuesday.setDate(firstTuesday.getDate() - 7);
  }

  // 如果第一个周二已经超过结束日期，说明没有周二
  if (firstTuesday > end) {
    return 0;
  }

  // 计算最后一个周二的日期
  const daysFromLastTuesday = (endDay - 2 + 7) % 7;
  const lastTuesday = new Date(end);
  lastTuesday.setDate(end.getDate() - daysFromLastTuesday);

  // 计算两个周二之间的天数差
  const daysBetween = Math.round(
    (lastTuesday.getTime() - firstTuesday.getTime()) / (1000 * 60 * 60 * 24)
  );

  // 计算周二的数量
  const tuesdayCount = Math.floor(daysBetween / 7) + 1;

  return tuesdayCount;
}

function countTuesdaysBetweenV2(
  startDate: Date | string | number,
  endDate: Date | string | number
): number {
  // 将输入转换为Date对象
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startTimestamp = start.getTime();
  const endTimestamp = end.getTime();
  let week = 0;

  if (start.getDay() < 2) {
    week++;
  }
  if(start.getDay() >2) {
    week++;
  }

  const oneDayTimestamp = 1000 * 60 * 60 * 24;

  for (let i = startTimestamp; i <= endTimestamp; i++) {
    const date = new Date(i);
    if (date.getDay() === 2) {
      week++;
    }
    i += oneDayTimestamp;
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
      }
    }
  } else {
    if (reward.active) {
      result.originiumRecharge += reward.content.originiumRecharge;
      result.diamond += reward.content.diamond;
      result.ticketgachaStandardSingle += reward.content.ticketgachaStandardSingle;
      result.ticketgachaSpecialSingle += reward.content.ticketgachaSpecialSingle;
    }
  }
}

function getPull(result: RewardStatisticsResultDetail): TotalPullsSingle {
  return {
    ticketgachaStandardSingle: result.ticketgachaStandardSingle,
    ticketgachaSpecialSingle:
      result.diamond / 500 +
      (result.originiumRecharge * 75) / 500 +
      result.ticketgachaSpecialSingle
  };
}

//
// function exportReward() {
//   const list: any = [];
//
//   _addReward('集成配额商店兑换', AICQuotaReward.value);
//   _addReward('活动奖励', activityReward.value);
//   _addReward('四号谷地·调度券商店', valleyIVRegionalStockBillStoreReward.value);
//   _addReward('四号谷地·地区建设等级奖励', valleyIVRegionalDevelopmentReward.value);
//   _addReward('四号谷地·醚质收集', valleyIVAuryleneCollectReward.value);
//   _addReward('四号谷地·储藏箱', valleyIVCrateReward.value);
//   _addReward('四号谷地·模拟空间', valleyIVSimulationReward.value);
//   _addReward('武陵·调度券商店', wulingRegionalStockBillStoreReward.value);
//   _addReward('武陵·地区建设等级奖励', wulingRegionalDevelopmentReward.value);
//   _addReward('武陵·醚质收集', wulingAuryleneCollectReward.value);
//   _addReward('武陵·储藏箱', wulingCrateReward.value);
//   _addReward('武陵·模拟空间', wulingSimulationReward.value);
//   _addReward('权限等级提升', authorityLevelUpReward.value);
//   _addReward('权限等级提升任务', authorityLevelTaskRewards.value);
//   _addReward('世界探索等级奖励', worldLevelReward.value);
//   _addReward('节点手册奖励', operationalManualNodeReward.value);
//   _addReward('新手签到奖励', beginnerSignInTaskReward.value);
//   _addReward('任务奖励', taskRewardTable.value);
//   _addReward('简制手册', factoryManualReward.value);
//   _addReward('据点防御任务', defenseConstructionReward.value);
//   _addReward('蚀像寻遗', etchSpaceSalvageReward.value);
//   _addReward('教学奖励', operationalManualReward.value);
//
//   console.log(JSON.stringify(list, null, 2));
//
//   function _addReward(type: string, reward: Reward | Reward[]): void {
//     if (Array.isArray(reward)) {
//       for (const item of reward) {
//         list.push({
//           type: type,
//           name: item.name.zh,
//           originiumRecharge: item.content.originiumRecharge,
//           diamond: item.content.diamond,
//           ticketgachaStandardSingle: item.content.ticketgachaStandardSingle,
//           ticketgachaSpecialSingle: item.content.ticketgachaSpecialSingle,
//         });
//       }
//     } else {
//       list.push({
//         type: type,
//         name: reward.name.zh,
//         originiumRecharge: reward.content.originiumRecharge,
//         diamond: reward.content.diamond,
//         ticketgachaStandardSingle: reward.content.ticketgachaStandardSingle,
//         ticketgachaSpecialSingle: reward.content.ticketgachaSpecialSingle,
//       });
//     }
//   }
// }

export { calculateDaysDifference, countTuesdaysBetween, countTuesdaysBetweenV2, addReward,getPull };
