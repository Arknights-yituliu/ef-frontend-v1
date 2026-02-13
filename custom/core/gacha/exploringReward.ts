import { ref } from 'vue';
import type { Reward } from '../../../shared/types/gacha-calculator';

export const crateReward = ref<Reward>({
  id: 'crate_reward',
  name: {
    zh: `储藏箱奖励`,
    en: ''
  },
  start: '2026/01/22 12:00:00',
  end: '2099/12/31 12:00:00',
  type: '通用',
  module: '地图探索',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 18840,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0
  }
});
