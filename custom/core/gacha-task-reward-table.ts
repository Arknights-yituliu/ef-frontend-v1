import type { Reward } from '#shared/types/gacha-calculator.ts';
import { ref } from 'vue';

export const beginnerCheckInTasks = ref<Reward[]>([]);

for (let i = 0; i < 12; i++) {
  beginnerCheckInTasks.value.push({
    id: 100000 + i,
    name: {
      zh: `新手签到奖励day${i + 1}`,
      en: '',
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
      ticketgachaSpecialSingle: 1,
      ticketgachaStandardTen: 0,
      ticketgachaSpecialTen: 0,
    },
  });
}
