import type { Reward } from '#shared/types/gacha-calculator';

import { ref } from 'vue';

import ActivityRewardTable from './json/activity_reward_table.json';


const activityReward = ref<Reward[]>([]);

for (const reward of ActivityRewardTable as Reward[]) {
  reward.start = new Date(reward.start);
  reward.end = new Date(reward.end);
  activityReward.value.push(reward);
}

const springFestivalSignIn = [
  {
    name: '连连乐·好运款2.15',
    diamond: 880,
    start: '2026/02/15 12:00:00',
    end: '2026/03/01 12:00:00'
  },
  {
    name: '连连乐·好运款2.16',
    diamond: 880,
    start: '2026/02/16 12:00:00',
    end: '2026/03/02 12:00:00'
  },
  {
    name: '连连乐·好运款2.17',
    diamond: 880,
    start: '2026/02/17 12:00:00',
    end: '2026/03/03 12:00:00'
  },
  {
    name: '连连乐·福气款2.18',
    diamond: 260,
    start: '2026/02/18 12:00:00',
    end: '2026/03/04 12:00:00'
  },
  {
    name: '连连乐·福气款2.19',
    diamond: 260,
    start: '2026/02/19 12:00:00',
    end: '2026/03/05 12:00:00'
  },
  {
    name: '连连乐·福气款2.20',
    diamond: 260,
    start: '2026/02/20 12:00:00',
    end: '2026/03/06 12:00:00'
  }, {
    name: '连连乐·福气款2.21',
    diamond: 880,
    start: '2026/02/21 12:00:00',
    end: '2026/03/07 12:00:00'
  }, {
    name: '连连乐·福气款2.22',
    diamond: 260,
    start: '2026/02/22 12:00:00',
    end: '2026/03/08 12:00:00'
  }, {
    name: '连连乐·福气款2.23',
    diamond: 260,
    start: '2026/02/23 12:00:00',
    end: '2026/03/09 12:00:00'
  }

];


for(const item of springFestivalSignIn) {
  activityReward.value.push({
    id: `${item.name}`,
    name: {
      zh: `${item.name}`,
      en: ''
    },
    start: new Date(item.start),
    end: new Date(item.end),
    type: '通用',
    module: '集成配额商店兑换',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: item.diamond,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0,
    }
  })
}


export { activityReward };
