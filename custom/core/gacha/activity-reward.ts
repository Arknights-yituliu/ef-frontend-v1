import { ref } from 'vue';
import type { Reward } from '#shared/types/gacha-calculator';
import ActivityRewardTable from './json/activity_reward_table.json'

const activityReward = ref<Reward[]>([])

for(const reward of ActivityRewardTable as Reward[]){
  reward.start = new Date(reward.start)
  reward.end = new Date(reward.end)
  activityReward.value.push(reward)
}



const beginnerSignInTaskReward = ref<Reward>({
  id: 'beginner_sign_in_task',
  name: {
    zh: `唤醒签到奖励`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '常驻活动',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 11,
  },
});



export {activityReward, beginnerSignInTaskReward,}
