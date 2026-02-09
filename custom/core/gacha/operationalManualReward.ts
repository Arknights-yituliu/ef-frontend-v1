import { ref } from 'vue';
import type { Reward } from '#shared/types/gacha-calculator';
import OperationalManualTrainingTable from './json/operational_manual_training_table.json';
import OperationalManualIndexTable from './json/operational_manual_index_table.json';



const operationalManualNodeReward = ref<Reward>(
  {
    id: 'operational_manual_node_reward',
    name: {
      zh: `节点奖励`,
      en: ''
    },
    start: '2026/01/22 10:00:00',
    end: '2099/12/31 10:00:00',
    type: '通用',
    module: '权限等阶提升活动',
    active: true,
    content: {
      originiumRecharge: 0,
      diamond: 9000,
      ticketgachaStandardSingle: 0,
      ticketgachaSpecialSingle: 0
    }
  }
);


const operationalManualReward = ref<Reward[]>([]);

for (const reward of OperationalManualTrainingTable) {
  operationalManualReward.value.push(reward);
}

for(const reward  of OperationalManualIndexTable) {
  operationalManualReward.value.push(reward);
}

export {operationalManualNodeReward,operationalManualReward}
