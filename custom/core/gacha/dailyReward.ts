import type { Reward } from '#shared/types/gacha-calculator';
import {
  calculateDaysDifference,
  countTuesdaysBetweenV2,
  createRewardModuleTitle,
} from '#shared/utils/gacha-calculator';
import { numberRound } from '#shared/utils/numberUtil';
import { ref } from 'vue';
import PoolInfoTable from '@/custom/core/gacha/data/pool_info_table.json';
import VersionTable from '@/custom/core/gacha/data/version_table.json';
const MediumExchangeCrate = 20 * 0.05 + 15 * 0.35 + 10 * 0.6;
const LargeExchangeCrate = 30 * 0.05 + 25 * 0.35 + 20 * 0.6;

const poolStartDate = ref(new Date());

const freeMonthlyPass = ref<Reward>({
  id: 'free_monthly_pass_1',
  name: {
    zh: `焕新月卡赠礼`,
    en: '',
  },
  start: new Date('2026/04/17 12:00:00'),
  end: new Date('2026/05/22 12:00:00'),
  type: '通用',
  module: '日常',
  active: true,
  version: '春晓时',
  content: {
    originiumRecharge: 0,
    diamond: 6000,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaLimitedSingle: 0,
  },
});

watch(poolStartDate, (newVal) => {
  updateFreeMonthlyPass();
});


function updateFreeMonthlyPass() {
  // 计算焕新月卡赠礼剩余天数
  const freeMonthlyPassRemainingDays = Math.min(
    numberRound(calculateDaysDifference(new Date('2026/04/17 12:00:00'), poolStartDate.value), 0),
    30,
  );

  console.log('按活动结束时间焕新月卡赠礼剩余天数:', freeMonthlyPassRemainingDays);
  freeMonthlyPass.value.content.diamond = 200 * (30 - freeMonthlyPassRemainingDays);
}

const dailyReward = ref<Reward>({
  id: 'day_reward',
  name: {
    zh: `日常X0天`,
    en: '',
  },
  start: new Date('2026/01/22 12:00:00'),
  end: new Date('2099/12/31 12:00:00'),
  type: '通用',
  module: '日常',
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
  start: new Date('2026/01/22 12:00:00'),
  end: new Date('2099/12/31 12:00:00'),
  type: '通用',
  module: '日常',
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
    zh: `日常X${numberRound(remainingDays, 0)}天`,
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
        zh: `日常X${numberRound(remainingDays, 0)}天`,
        en: '',
      },
      start: new Date('2026/01/22 12:00:00'),
      end: new Date('2099/12/31 12:00:00'),
      type: '通用',
      module: '日常',
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
      start: new Date('2026/01/22 12:00:00'),
      end: new Date('2099/12/31 12:00:00'),
      type: '通用',
      module: '日常',
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

const dailyAllRewardTable = ref<Reward[]>([freeMonthlyPass.value]);

dailyAllRewardTable.value.push(createRewardModuleTitle('通行证'));

let bpTrackIndex = 1;
for (const version of VersionTable) {
  const bpTrackFree = {
    id: `bp_track_free_${bpTrackIndex}`,
    name: {
      zh: `基础配给·${version.version}`,
      en: '',
    },
    start: new Date(version.start),
    end: new Date(version.end),
    type: '通用',
    module: '日常',
    active: true,
    version: version.version,
    content: {
      originiumRecharge: 0,
      diamond: 600 + MediumExchangeCrate * 23,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
  };

  const bpTrackOriginium = {
    id: `bp_track_originium_${bpTrackIndex}`,
    name: {
      zh: `源石配给·${version.version}`,
      en: '',
    },
    start: new Date(version.start),
    end: new Date(version.end),
    type: '通用',
    module: '日常',
    active: true,
    version: version.version,
    content: {
      originiumRecharge: 3,
      diamond: 0,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
      ticketgachaLimitedSingle: 0,
    },
  };

  if (bpTrackIndex > 1) {
    bpTrackFree.content.ticketgachaStandardSingle = 2;
    bpTrackOriginium.content.ticketgachaStandardSingle = 4;
  }

  dailyAllRewardTable.value.push(bpTrackFree, bpTrackOriginium);
  bpTrackIndex++;
}

dailyAllRewardTable.value.push(createRewardModuleTitle('集成配额商店兑换'));

for (const poolInfo of PoolInfoTable) {
  dailyAllRewardTable.value.push({
    id: `${poolInfo.character}卡池商店兑换寻访凭证`,
    name: {
      zh: `${poolInfo.character}卡池集成配额兑换`,
      en: '',
    },
    start: new Date(poolInfo.poolStart),
    end: new Date(poolInfo.poolEnd),
    type: poolInfo.character,
    module: '日常',
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
  calculatorDailyReward,
  createVersionDailyReward,
  updateFreeMonthlyPass,
  dailyAllRewardTable,
  dailyReward,
  poolStartDate,
  weekTaskReward,
};
