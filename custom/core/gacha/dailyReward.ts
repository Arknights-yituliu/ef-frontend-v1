import type { Reward } from '#shared/types/gacha-calculator';
import { calculateDaysDifference, countTuesdaysBetweenV2 } from '#shared/utils/gacha-calculator';
import { numberRound } from '#shared/utils/numberUtil';
import { ref } from 'vue';
import PoolInfo from '@/custom/core/gacha/data/pool_info.json';

const MediumExchangeCrate = 20 * 0.05 + 15 * 0.35 + 10 * 0.6;
const LargeExchangeCrate = 30 * 0.05 + 25 * 0.35 + 20 * 0.6;

const bpTrackFreeReward = ref<Reward[]>([
  {
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
      diamond: 600 + MediumExchangeCrate * 23,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
  },
  {
    id: 'bp_track_originium_1',
    name: {
      zh: `源石配给·第一期`,
      en: '',
    },
    start: '2026/01/22 12:00:00',
    end: '2026/03/12 12:00:00',
    type: '通用',
    module: '日常奖励',
    active: true,
    version: '零号委托',
    content: {
      originiumRecharge: 3,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
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
    version: '新潮起·故渊离',
    content: {
      originiumRecharge: 0,
      diamond: 600 + MediumExchangeCrate * 23,
      ticketgachaStandardSingle: 2,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
  },
  {
    id: 'bp_track_originium_2',
    name: {
      zh: `源石配给·第二期`,
      en: '',
    },
    start: '2026/03/12 12:00:00',
    end: '2026/04/16 12:00:00',
    type: '通用',
    module: '日常奖励',
    active: true,
    version: '新潮起·故渊离',
    content: {
      originiumRecharge: 3,
      diamond: 0,
      ticketgachaStandardSingle: 4,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
  },
]);

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
    ticketgachaLimitedSingle: 0,
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
  version: '新潮起·故渊离',
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
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
  const remainingWeek: number = countTuesdaysBetweenV2(start, end) - 1;
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
        ticketgachaLimitedSingle: 0,
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
        ticketgachaLimitedSingle: 0,
      },
    },
  ];
}

const AICQuotaReward = ref<Reward[]>([]);
for (const poolInfo of PoolInfo) {
  AICQuotaReward.value.push({
    id: `${poolInfo.character}卡池商店兑换寻访凭证`,
    name: {
      zh: `${poolInfo.character}卡池集成配额兑换`,
      en: '',
    },
    start: new Date(poolInfo.poolStart),
    end: new Date(poolInfo.poolEnd),
    type: poolInfo.character,
    module: '集成配额商店兑换',
    active: true,
    version: poolInfo.version,
    content: {
      originiumRecharge: 0,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 5,
    },
  });
}

export {
  AICQuotaReward,
  bpTrackFreeReward,
  calculatorDailyReward,
  createVersionDailyReward,
  dailyReward,
  weekTaskReward,
};
