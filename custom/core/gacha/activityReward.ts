import type { Reward } from '#shared/types/gacha-calculator';

import { ref } from 'vue';

import ActivityRewardTable from '@/custom/core/gacha/data/activity_reward_table.json';

const activityReward = ref<Reward[]>([]);

for (const reward of ActivityRewardTable as Reward[]) {
  reward.start = new Date(reward.start);
  reward.end = new Date(reward.end);
  if (reward.start < new Date()) {
    reward.active = false;
  }
  activityReward.value.push(reward);
}

export { activityReward };

const newPoolActivity = [
  {
    poolName: '熔火灼痕',
    character: '莱万汀',
    start: '2026/01/22 12:00:00',
    end: '2026/02/07 12:00:00',
    signInTime: ['2026/01/22 12:00:00', '2026/01/25 12:00:00', '2026/01/28 12:00:00'],
    versionEnd: '2026/03/12 12:00:00',
    version: '零号委托',
  },
  {
    poolName: '轻飘飘的信使',
    character: '洁尔佩塔',
    start: '2026/02/07 12:00:00',
    end: '2026/02/24 12:00:00',
    signInTime: ['2026/02/07 12:00:00', '2026/02/10 12:00:00', '2026/02/13 12:00:00'],
    versionEnd: '2026/03/12 12:00:00',
    version: '零号委托',
  },
  {
    poolName: '热烈色彩',
    character: '伊冯',
    start: '2026/02/24 12:00:00',
    end: '2026/03/12 12:00:00',
    signInTime: ['2026/02/24 12:00:00', '2026/03/27 12:00:00', '2026/03/02 12:00:00'],
    versionEnd: '2026/03/12 12:00:00',
    version: '零号委托',
  },
  {
    poolName: '汤汤',
    character: '汤汤',
    start: '2026/03/12 12:00:00',
    end: '2026/03/29 12:00:00',
    signInTime: ['2026/03/12 12:00:00', '2026/03/15 12:00:00', '2026/03/18 12:00:00'],
    versionEnd: '2026/04/16 12:00:00',
    version: '新潮起·故渊离',
  },
  {
    poolName: '洛茜',
    character: '洛茜',
    start: '2026/03/29 12:00:00',
    end: '2026/04/16 12:00:00',
    signInTime: ['2026/03/29 12:00:00', '2026/04/01 12:00:00', '2026/04/03 12:00:00'],
    versionEnd: '2026/04/16 12:00:00',
    version: '新潮起·故渊离',
  },
];

function createNewPoolActivity() {
  for (const item of newPoolActivity) {
    const startDate = new Date(item.start);
    const reward1: Reward = {
      id: `作战演练·${item.character}`,
      name: {
        zh: `作战演练·${item.character}`,
        en: '',
      },
      start: startDate,
      end: new Date(item.versionEnd),
      type: '通用',
      module: '活动',
      active: true,
      version: item.version,
      content: {
        originiumRecharge: 0,
        diamond: 100,
        ticketgachaStandardSingle: 0,
        ticketgachaSpecialSingle: 0,
      },
    };
    activityReward.value.push(reward1);

    const reward2: Reward = {
      id: `干员叙事·${item.character}`,
      name: {
        zh: `干员叙事·${item.character}`,
        en: '',
      },
      start: startDate,
      end: '2099/12/31 12:00:00',
      type: '通用',
      module: '活动',
      active: true,
      version: item.version,
      content: {
        originiumRecharge: 0,
        diamond: 600,
        ticketgachaStandardSingle: 0,
        ticketgachaSpecialSingle: 0,
      },
    };
    activityReward.value.push(reward2);
    if (item.character !== '汤汤') {
    }

    let i = 1;
    for (const time of item.signInTime) {
      const reward3: Reward = {
        id: `${item.poolName}卡池签到·${i}`,
        name: {
          zh: `${item.poolName}卡池签到·${i}`,
          en: '',
        },
        start: new Date(time),
        end: new Date(item.end),
        type: item.character,
        module: '活动',
        active: true,
        version: item.version,
        content: {
          originiumRecharge: 0,
          diamond: 0,
          ticketgachaStandardSingle: 0,
          ticketgachaSpecialSingle: i === 1 ? 1 : 2,
        },
      };
      activityReward.value.push(reward3);
      i++;
    }
  }
}

function createActivityReward(): void {
  const springFestivalSignIn = [
    {
      name: '连连乐·好运款2.15',
      diamond: 880,
      start: '2026/02/15 12:00:00',
      end: '2026/03/01 12:00:00',
    },
    {
      name: '连连乐·好运款2.16',
      diamond: 880,
      start: '2026/02/16 12:00:00',
      end: '2026/03/02 12:00:00',
    },
    {
      name: '连连乐·好运款2.17',
      diamond: 880,
      start: '2026/02/17 12:00:00',
      end: '2026/03/03 12:00:00',
    },
    {
      name: '连连乐·福气款2.18',
      diamond: 260,
      start: '2026/02/18 12:00:00',
      end: '2026/03/04 12:00:00',
    },
    {
      name: '连连乐·福气款2.19',
      diamond: 260,
      start: '2026/02/19 12:00:00',
      end: '2026/03/05 12:00:00',
    },
    {
      name: '连连乐·福气款2.20',
      diamond: 260,
      start: '2026/02/20 12:00:00',
      end: '2026/03/06 12:00:00',
    },
    {
      name: '连连乐·福气款2.21',
      diamond: 880,
      start: '2026/02/21 12:00:00',
      end: '2026/03/07 12:00:00',
    },
    {
      name: '连连乐·福气款2.22',
      diamond: 260,
      start: '2026/02/22 12:00:00',
      end: '2026/03/08 12:00:00',
    },
    {
      name: '连连乐·福气款2.23',
      diamond: 260,
      start: '2026/02/23 12:00:00',
      end: '2026/03/09 12:00:00',
    },
  ];

  for (const item of springFestivalSignIn) {
    const reward = {
      id: `${item.name}`,
      name: {
        zh: `${item.name}`,
        en: '',
      },
      start: new Date(item.start),
      end: new Date(item.end),
      type: '通用',
      module: '活动',
      active: true,
      version: '零号委托',
      content: {
        originiumRecharge: 0,
        diamond: item.diamond,
        ticketgachaStandardSingle: 0,
        ticketgachaSpecialSingle: 0,
      },
    };

    if (reward.start < new Date()) {
      reward.active = false;
    }
    activityReward.value.push(reward);
  }
}

createNewPoolActivity();
createActivityReward();
