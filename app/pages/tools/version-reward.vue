<script setup lang="ts">
import { numberFloor, numberRound } from '#shared/utils/numberUtil';
import { nextTick, onMounted, ref, watch } from 'vue';

import { activityReward ,createSignInReward} from '@/custom/core/gacha/activityReward';

import { AICQuotaReward,calculatorDailyReward,dailyReward,umbralMonumentReward, weekTaskReward } from '@/custom/core/gacha/dailyReward';

import {
  authorityLevelTaskRewards,
  authorityLevelUpReward,
  authorityLevelUpRewardTable,
  worldLevelReward,
} from '@/custom/core/gacha/levelReward';

import {
  operationalManualNodeReward,
  operationalManualReward,
} from '@/custom/core/gacha/operationalManualReward';

import {
  factoryManualReward,
  factoryManualRewardMax,
  intelArchiveReward,
  otherRewardTable,
} from '@/custom/core/gacha/otherReward';

import {
  beginnerSignInTaskReward,
  etchSpaceSalvageReward,
  newHorizonsTaskReward,
  valleyIVTaskRewardTable,
  wulingTaskRewardTable,
} from '@/custom/core/gacha/permanentReward';

import {
  valleyIVAuryleneCollectReward,
  valleyIVAuryleneCollectStageTable,
  valleyIVBattleCrateReward,
  valleyIVBattleCrateRewardMax,
  valleyIVCrateReward,
  valleyIVCrateRewardMax,
  valleyIVDefenseConstructionReward,
  valleyIVDeltaBotReward,
  valleyIVDeltaBotRewardMax,
  valleyIVRegionalDevelopmentReward,
  valleyIVRegionalStockBillStoreReward,
  valleyIVSimulationReward,
} from '@/custom/core/gacha/valleyIVRegionalReward';

import {
  wulingAuryleneCollectReward,
  wulingAuryleneCollectStageTable,
  wulingCrateReward,
  wulingCrateRewardMax,
  wulingDefenseConstructionReward,
  wulingDeltaBotReward,
  wulingDeltaBotRewardMax,
  wulingRegionalDevelopmentReward,
  wulingRegionalStockBillStoreReward,
  wulingSimulationReward,
} from '@/custom/core/gacha/wulingRegionalReward';


const version1Reward = ref<Reward[]>([]);

calculatorDailyReward(new Date('2026/01/22 12:00:00'),new Date('2026/03/12 10:00:00'))

version1Reward.value.push(dailyReward.value, weekTaskReward.value)

for (const reward of AICQuotaReward.value) {
  version1Reward.value.push(reward);
}

for (const reward of umbralMonumentReward.value) {
  version1Reward.value.push(reward);
}

createSignInReward(new Date('2026/01/22 12:00:00'),new Date('2026/03/12 10:00:00'));
for (const reward of activityReward.value) {
  version1Reward.value.push(reward);
}

for (const reward of otherRewardTable.value) {
  version1Reward.value.push(reward);
}

version1Reward.value.push(factoryManualReward.value);

for (const reward of intelArchiveReward.value) {
  version1Reward.value.push(reward);
}

version1Reward.value.push(valleyIVAuryleneCollectReward.value, valleyIVCrateReward.value, valleyIVBattleCrateReward.value, valleyIVDeltaBotReward.value, valleyIVRegionalDevelopmentReward.value, valleyIVRegionalStockBillStoreReward.value, valleyIVSimulationReward.value);
for (const reward of valleyIVDefenseConstructionReward.value) {
  version1Reward.value.push(reward);
}

version1Reward.value.push(wulingAuryleneCollectReward.value, wulingCrateReward.value, wulingDeltaBotReward.value, wulingRegionalDevelopmentReward.value, wulingRegionalStockBillStoreReward.value, wulingSimulationReward.value);
for (const reward of wulingDefenseConstructionReward.value) {
  version1Reward.value.push(reward);
}

for (const reward of authorityLevelTaskRewards.value) {
  version1Reward.value.push(reward);
}

version1Reward.value.push(authorityLevelUpReward.value, worldLevelReward.value, beginnerSignInTaskReward.value);

for (const reward of newHorizonsTaskReward.value) {
  version1Reward.value.push(reward);
}

for (const reward of etchSpaceSalvageReward.value) {
  version1Reward.value.push(reward);
}

for (const reward of valleyIVTaskRewardTable.value) {
  version1Reward.value.push(reward);
}

for (const reward of wulingTaskRewardTable.value) {
  version1Reward.value.push(reward);
}

for (const reward of operationalManualReward.value) {
  version1Reward.value.push(reward);
}

version1Reward.value.push(operationalManualNodeReward.value);

const version1RewardTotal:Reward =  {
  id: 'total',
  name: {
    zh: `总和`,
    en: ''
  },
  start: '2026/01/22 10:00:00',
  end: '2099/12/31 10:00:00',
  type: '通用',
  module: '总和',
  active: true,
  content: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0
  }
}

for (const reward of version1Reward.value) {
  version1RewardTotal.content.originiumRecharge+=reward.content.originiumRecharge;
  version1RewardTotal.content.diamond+=reward.content.diamond;
  version1RewardTotal.content.ticketgachaStandardSingle+=reward.content.ticketgachaStandardSingle;
  version1RewardTotal.content.ticketgachaSpecialSingle+=reward.content.ticketgachaSpecialSingle;
}
version1Reward.value.push(version1RewardTotal)


</script>
<template>
  <v-table style="width: 1000px;margin: auto">
    <thead>
      <tr>
        <th style="font-weight: bolder">奖励名称</th>
        <th style="font-weight: bolder">是否通用</th>
        <th style="font-weight: bolder">来源</th>
        <th>
          <img
            alt="existing"
            class="version-reward-table-icon"
            src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp"
          >
        </th>
        <th>
          <img
            alt="existing"
            class="version-reward-table-icon"
            src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp"
          >
        </th>
        <th>
          <img
            alt="existing"
            class="version-reward-table-icon"
            src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp"
          >
        </th>
        <th>
          <img
            alt="existing"
            class="version-reward-table-icon"
            src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp"
          >
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="reward in version1Reward">
        <td>{{reward.name.zh}}</td>
        <td>{{reward.type}}</td>
        <td>{{reward.module}}</td>
        <td>{{reward.content.originiumRecharge}}
          （{{ numberFloor(reward.content.originiumRecharge * 0.15) }}抽）
        </td>
        <td>{{reward.content.diamond}}
          （{{ numberFloor(reward.content.diamond /500) }}抽）
        </td>
        <td>{{reward.content.ticketgachaStandardSingle}}</td>
        <td>{{reward.content.ticketgachaSpecialSingle}}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<style>
.version-reward-table-icon {
  width: 36px;
  height: 36px;
}

</style>
