import { ref } from 'vue';
import type { Reward } from '#shared/types/gacha-calculator';
import ActivityRewardTable from './json/activity_reward_table.json'

const activityReward = ref<Reward[]>([])

for(const reward of ActivityRewardTable as Reward[]){
  reward.start = new Date(reward.start)
  reward.end = new Date(reward.end)
  activityReward.value.push(reward)
}


export {activityReward}
