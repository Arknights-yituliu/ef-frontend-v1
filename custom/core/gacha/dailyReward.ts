import { ref } from 'vue';
import type { Reward } from '#shared/types/gacha-calculator';
import {
  calculateDaysDifference,
  countTuesdaysBetweenV2,
  addReward,
  getRewardPull,
  getRewardsPull,
} from '#shared/utils/gacha-calculator';
import { numberRound } from '#shared/utils/numberUtil';


const dailyReward = ref<Reward>({
  id: 'day_reward',
  name: {
    zh: `日常奖励X0天`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '日常奖励',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

const weekTaskReward = ref<Reward>({
  id: 'week_task_reward',
  name: {
    zh: `周常奖励X0周`,
    en: '',
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '日常奖励',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

function calculatorDailyReward(start:Date,end:Date): void {
  const remainingDays: number = calculateDaysDifference(start, end);
  dailyReward.value.name = {
    zh: `日常奖励X${numberRound(remainingDays, 0)}天`,
    en: '',
  };
  dailyReward.value.content.diamond = numberRound(remainingDays, 0) * 200;

  const remainingWeek: number = countTuesdaysBetweenV2(start, end);
  weekTaskReward.value.name = {
    zh: `周常奖励X${numberRound(remainingWeek, 0)}周`,
    en: '',
  };
  weekTaskReward.value.content.diamond = numberRound(remainingWeek, 0) * 500;

}


const poolInfos = [
  {name:'熔火灼痕',start:'2026/01/22 10:00:00',end:'2026/02/07 10:00:00'},
  {name:'轻飘飘的信使',start:'2026/02/07 12:00:00',end:'2026/02/24 10:00:00'},
  {name:'热烈色彩',start:'2026/02/24 12:00:00',end:'2026/03/12 10:00:00'}
];


const umbralMonumentVersion = [
  {
    name:"影拓丰碑·零号协议",start:'2026/02/14 12:00:00',end:'2026/03/12 10:00:00',content: {
      originiumRecharge: 0,
      diamond: 2400,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    }
  }
]

const umbralMonumentReward = ref<Reward[]>([]);

for(const version of umbralMonumentVersion) {
  umbralMonumentReward.value.push({
    id: `${version.name}`,
    name: {
      zh: `${version.name}`,
      en: ''
    },
    start: new Date(version.start),
    end: new Date(version.end),
    type: '通用',
    module: '集成配额商店兑换',
    active: true,
    content: {
      originiumRecharge: version.content.originiumRecharge,
      diamond: version.content.diamond,
      ticketgachaStandardSingle: version.content.ticketgachaStandardSingle,
      ticketgachaSpecialSingle: version.content.ticketgachaSpecialSingle,
    }
  })
}


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

export {dailyReward,weekTaskReward,calculatorDailyReward,AICQuotaReward,umbralMonumentReward}
