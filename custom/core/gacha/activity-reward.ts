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

const newHorizonsTaskReward = ref<Reward[]>([
  {
    id: 'new_horizons_task_reward_1',
    name: {
      zh: `于此启程任务·1`,
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
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '常驻活动',
    active: true,
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
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '常驻活动',
    active: true,
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
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '常驻活动',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 10,
      ticketgachaSpecialSingle: 0,
    },
  },
]);

export {activityReward,newHorizonsTaskReward, beginnerSignInTaskReward,}
