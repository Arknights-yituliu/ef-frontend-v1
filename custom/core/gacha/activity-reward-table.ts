import { ref } from 'vue';
import type { Reward } from '#shared/types/gacha-calculator';

export const preRegistrationMilestoneReward= ref<Reward>(
  {
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
