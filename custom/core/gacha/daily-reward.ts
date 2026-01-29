import { ref } from 'vue';
import type { Reward } from '#shared/types/gacha-calculator';

const poolInfos = [
  {name:'熔火灼痕',start:'2026/01/22 10:00:00',end:'2026/02/07 10:00:00'},
  {name:'轻飘飘的信使',start:'2026/02/07 12:00:00',end:'2026/02/24 10:00:00'},
  {name:'热烈色彩',start:'2026/02/24 12:00:00',end:'2026/03/12 10:00:00'}
];

const AICQuotaReward = ref<Reward[]>([]);
for(const poolInfo of poolInfos) {
    AICQuotaReward.value.push({
      id: `${poolInfo.name}卡池商店兑换寻访凭证`,
      name: {
        zh: `${poolInfo.name}卡池集成配额兑换`,
        en: ''
      },
      start: new Date(poolInfo.start),
      end: new Date(poolInfo.end),
      type: poolInfo.name,
      module: '集成配额商店兑换',
      active: true,
      content: {
        originiumRecharge: 0,
        diamond: 0,
        ticketgachaStandardSingle: 0,
        ticketgachaSpecialSingle: 5
      }
    })
}

export {AICQuotaReward}
