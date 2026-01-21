import { ref } from 'vue';
import type { Reward } from '#shared/types/gacha-calculator';

export const beginnerSignInTaskReward = ref<Reward>({
  id: 'beginner_sign_in_task',
  name: {
    zh: `新手签到奖励`,
    en: ''
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '任务奖励',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 11
  }
});

export const preRegistrationMilestoneReward = ref<Reward>({
  id: 'pre_registration_milestone',
  name: {
    zh: `游戏预约里程碑`,
    en: ''
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '任务奖励',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 20,
    ticketgachaSpecialSingle: 0
  }
});
