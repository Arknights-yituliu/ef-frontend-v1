import type { Reward } from '#shared/types/gacha-calculator';
import { calculateDaysDifference, countTuesdaysBetweenV2 } from '#shared/utils/gacha-calculator';
import { numberRound } from '#shared/utils/numberUtil';
import { ref } from 'vue';

const bpTrackFreeReward = ref<Reward[]>([{
  id: 'bp_track_free_1',
  name: {
    zh: `基础配给·第一期`,
    en: '',
  },
  start: '2026/01/22 12:00:00',
  end: '2026/03/12 12:00:00',
  type: '通用',
  module: '日常奖励',
  active: true,
  version: '零号委托',
  content: {
    originiumRecharge: 0,
    diamond: 600,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
},
{
  id: 'bp_track_free_2',
  name: {
    zh: `基础配给·第二期`,
    en: '',
  },
  start: '2026/03/12 12:00:00',
  end: '2026/04/16 12:00:00',
  type: '通用',
  module: '日常奖励',
  active: true,
  version: '零号委托',
  content: {
    originiumRecharge: 0,
    diamond: 600,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
}]);


const dailyReward = ref<Reward>({
  id: 'day_reward',
  name: {
    zh: `日常奖励X0天`,
    en: '',
  },
  start: '2026/01/22 12:00:00',
  end: '2099/12/31 12:00:00',
  type: '通用',
  module: '日常奖励',
  active: true,
  version: '零号委托',
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
  start: '2026/01/22 12:00:00',
  end: '2099/12/31 12:00:00',
  type: '通用',
  module: '日常奖励',
  active: true,
  version: '零号委托',
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  },
});

function calculatorDailyReward(start: Date, end: Date): void {
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

function createVersionDailyReward(start: Date, end: Date, version: string): Reward[] {
  const remainingDays: number = calculateDaysDifference(start, end);
  const remainingWeek: number = countTuesdaysBetweenV2(start, end);
  return [
    {
      id: 'day_reward',
      name: {
        zh: `日常奖励X${numberRound(remainingDays, 0)}天`,
        en: '',
      },
      start: '2026/01/22 12:00:00',
      end: '2099/12/31 12:00:00',
      type: '通用',
      module: '日常奖励',
      active: true,
      version,
      content: {
        originiumRecharge: 0,
        diamond: numberRound(remainingDays, 0) * 200,
        ticketgachaStandardSingle: 0,
        ticketgachaSpecialSingle: 0,
      },
    },
    {
      id: 'week_task_reward',
      name: {
        zh: `周常奖励X${numberRound(remainingWeek, 0)}周`,
        en: '',
      },
      start: '2026/01/22 12:00:00',
      end: '2099/12/31 12:00:00',
      type: '通用',
      module: '日常奖励',
      active: true,
      version,
      content: {
        originiumRecharge: 0,
        diamond: numberRound(remainingWeek, 0) * 500,
        ticketgachaStandardSingle: 0,
        ticketgachaSpecialSingle: 0,
      },
    }
  ];
}

const poolInfos = [
  {
    name: '熔火灼痕',
    start: '2026/01/22 12:00:00',
    end: '2026/02/07 12:00:00',
    version: '零号委托',
  },
  {
    name: '轻飘飘的信使',
    start: '2026/02/07 12:00:00',
    end: '2026/02/24 12:00:00',
    version: '零号委托',
  },
  {
    name: '热烈色彩',
    start: '2026/02/24 12:00:00',
    end: '2026/03/12 12:00:00',
    version: '零号委托',
  },
  {
    name: '汤汤',
    start: '2026/03/12 12:00:00',
    end: '2026/03/29 12:00:00',
    version: '新潮起·故渊离',
  },
  {
    name: '洛茜',
    start: '2026/03/29 12:00:00',
    end: '2026/04/16 12:00:00',
    version: '新潮起·故渊离',
  },
];

const AICQuotaReward = ref<Reward[]>([]);
for (const poolInfo of poolInfos) {
  AICQuotaReward.value.push({
    id: `${poolInfo.name}卡池商店兑换寻访凭证`,
    name: {
      zh: `${poolInfo.name}卡池集成配额兑换`,
      en: '',
    },
    start: new Date(poolInfo.start),
    end: new Date(poolInfo.end),
    type: poolInfo.name,
    module: '集成配额商店兑换',
    active: true,
    version: poolInfo.version,
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 5,
    },
  });
}

export { AICQuotaReward,bpTrackFreeReward, calculatorDailyReward, createVersionDailyReward, dailyReward,weekTaskReward };
