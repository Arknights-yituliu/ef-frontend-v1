import { ref } from 'vue';
import type { Reward } from '#shared/types/gacha-calculator';
import ActivityRewardTable from './json/activity_reward_table.json'
import {
  calculateDaysDifference,
  countTuesdaysBetweenV2,
} from '#shared/utils/gacha-calculator';
import { numberRound } from '#shared/utils/numberUtil';


const activityReward = ref<Reward[]>([])

for(const reward of ActivityRewardTable as Reward[]){
  reward.start = new Date(reward.start)
  reward.end = new Date(reward.end)
  activityReward.value.push(reward)
}





//春节签到
function createSignInReward(start:Date,end:Date) :void{
  let remainingDays: number = calculateDaysDifference(start, end);
  if(remainingDays>14){
    remainingDays = 14
  }
  // 检查并更新2026连连乐活动的diamond属性
  const activityIndex:number = activityReward.value.findIndex(item => item.id === "2026连连乐活动");
  if (activityIndex !== -1) {
  // 防御性检查，确保content属性存在
  if (activityReward.value[activityIndex]?.content) {
    // 假设我们要将diamond更新为1000
    activityReward.value[activityIndex].content.diamond = numberRound(remainingDays)*260;
  }
}
}



export {activityReward,createSignInReward}
