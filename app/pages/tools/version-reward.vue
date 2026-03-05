<script setup lang="ts">
import type { RewardStatisticsResultDetail } from '#shared/types/gacha-calculator';

import { numberFloor } from '#shared/utils/numberUtil';

import { ref } from 'vue';

import { activityReward } from '@/custom/core/gacha/activityReward';

import { AICQuotaReward, createVersionDailyReward } from '@/custom/core/gacha/dailyReward';

import { calculateDaysDifference, countTuesdaysBetweenV2 } from '#shared/utils/gacha-calculator';

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
  beginnerTicketgachaSpecialSingleTaskReward,
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
import { wulingRegionalAllRewardTable } from '@/custom/core/gacha/wulingRegionalReward';

const versionReward = ref<Reward[]>([]);

const currentVersionRewardTotal = ref<RewardStatisticsResultDetail[]>([]);

const versionTime = [
  {
    start: new Date('2026/01/22 12:00:00'),
    end: new Date('2026/03/12 12:00:00'),
    version: '零号委托',
  },
  {
    start: new Date('2026/03/12 12:00:00'),
    end: new Date('2026/04/16 12:00:00'),
    version: '新潮起·故渊离',
  },
];

for (const item of versionTime) {
  const rewards = createVersionDailyReward(item.start, item.end, item.version);
  versionReward.value.push(rewards[0] as Reward, rewards[1] as Reward);
}

for (const reward of AICQuotaReward.value) {
  versionReward.value.push(reward);
}

for (const reward of activityReward.value) {
  versionReward.value.push(reward);
}

for (const reward of otherRewardTable.value) {
  versionReward.value.push(reward);
}

versionReward.value.push(factoryManualReward.value);

for (const reward of intelArchiveReward.value) {
  versionReward.value.push(reward);
}

versionReward.value.push(
  valleyIVAuryleneCollectReward.value,
  valleyIVCrateReward.value,
  valleyIVBattleCrateReward.value,
  valleyIVDeltaBotReward.value,
  valleyIVRegionalDevelopmentReward.value,
  valleyIVRegionalStockBillStoreReward.value,
  valleyIVSimulationReward.value,
);

for (const reward of valleyIVDefenseConstructionReward.value) {
  versionReward.value.push(reward);
}

for (const reward of wulingRegionalAllRewardTable) {
  versionReward.value.push(reward);
}

for (const reward of authorityLevelTaskRewards.value) {
  versionReward.value.push(reward);
}

versionReward.value.push(
  authorityLevelUpReward.value,
  worldLevelReward.value,
  beginnerSignInTaskReward.value,
);

for (const reward of newHorizonsTaskReward.value) {
  versionReward.value.push(reward);
}

for (const reward of beginnerTicketgachaSpecialSingleTaskReward.value) {
  versionReward.value.push(reward);
}

for (const reward of etchSpaceSalvageReward.value) {
  versionReward.value.push(reward);
}

for (const reward of valleyIVTaskRewardTable.value) {
  versionReward.value.push(reward);
}

for (const reward of wulingTaskRewardTable.value) {
  versionReward.value.push(reward);
}

for (const reward of operationalManualReward.value) {
  versionReward.value.push(reward);
}

versionReward.value.push(operationalManualNodeReward.value);

const currentVersionReward = ref<Reward[]>([]);

function filterRewardByVersion(version: any) {
  const daysDiff = calculateDaysDifference(version.start, version.end);

  currentVersionRewardTotal.value = [];
  currentVersionReward.value = [];
  const result1: RewardStatisticsResultDetail = {
    name: '零氪抽卡资源总计',
    originiumRecharge: 3,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    totalPulls: 0,
  };

  const result2: RewardStatisticsResultDetail = {
    name: '小月卡抽卡资源总计',
    originiumRecharge: 3,
    diamond: numberFloor(daysDiff) * 200,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    totalPulls: 0,
  };

  const result3: RewardStatisticsResultDetail = {
    name: '大小月卡抽卡资源总计',
    originiumRecharge: 3 + 36,
    diamond: numberFloor(daysDiff) * 200,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    totalPulls: 0,
  };

  for (const reward of versionReward.value) {
    if ('新潮起·故渊离' === reward.version) {
      currentVersionReward.value.push(reward);
    }
  }

  for (const reward of currentVersionReward.value) {
    result1.originiumRecharge += reward.content.originiumRecharge;
    result1.diamond += reward.content.diamond;
    result1.ticketgachaStandardSingle += reward.content.ticketgachaStandardSingle;
    result1.ticketgachaSpecialSingle += reward.content.ticketgachaSpecialSingle;
  }

  result2.originiumRecharge += result1.originiumRecharge;
  result2.diamond += result1.diamond;
  result2.ticketgachaStandardSingle += result1.ticketgachaStandardSingle;
  result2.ticketgachaSpecialSingle += result1.ticketgachaSpecialSingle;

  result3.originiumRecharge += result1.originiumRecharge;
  result3.diamond += result1.diamond;
  result3.ticketgachaStandardSingle += result1.ticketgachaStandardSingle;
  result3.ticketgachaSpecialSingle += result1.ticketgachaSpecialSingle;

  result1.totalPulls =
    result1.originiumRecharge * 0.15 + result1.diamond / 500 + result1.ticketgachaSpecialSingle;
  result2.totalPulls =
    result2.originiumRecharge * 0.15 + result2.diamond / 500 + result2.ticketgachaSpecialSingle;
  result3.totalPulls =
    result3.originiumRecharge * 0.15 + result3.diamond / 500 + result3.ticketgachaSpecialSingle;

  currentVersionRewardTotal.value.push(result1, result2, result3);
}

filterRewardByVersion(versionTime[1]);
</script>
<template>
  <v-table class="version-reward-table">
    <thead>
      <tr>
        <th style="font-weight: bolder">奖励名称</th>
        <th style="font-weight: bolder">是否通用</th>
        <th style="font-weight: bolder">来源</th>
        <th>抽卡资源</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="reward in currentVersionReward">
        <td>{{ reward.name.zh }}</td>
        <td>{{ reward.type }}</td>
        <td>{{ reward.module }}</td>
        <td>
          <div class="version-reward-table-reward-single-group">
            <div
              v-show="reward.content.originiumRecharge > 0"
              class="version-reward-table-reward-single"
            >
              <img
                alt="existing"
                class="version-reward-table-icon"
                src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp"
              />X
              {{ reward.content.originiumRecharge }}
            </div>

            <div v-show="reward.content.diamond > 0" class="version-reward-table-reward-single">
              <img
                alt="existing"
                class="version-reward-table-icon"
                src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp"
              />X{{ reward.content.diamond }}
            </div>

            <div
              v-show="reward.content.ticketgachaStandardSingle > 0"
              class="version-reward-table-reward-single"
            >
              <img
                alt="existing"
                class="version-reward-table-icon"
                src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp"
              />X{{ reward.content.ticketgachaStandardSingle }}
            </div>

            <div
              v-show="reward.content.ticketgachaSpecialSingle > 0"
              class="version-reward-table-reward-single"
            >
              <img
                alt="existing"
                class="version-reward-table-icon"
                src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp"
              />X{{ reward.content.ticketgachaSpecialSingle }}
            </div>
          </div>
        </td>
      </tr>
      <tr v-for="result in currentVersionRewardTotal">
        <td>{{ result.name }}</td>
        <td colspan="3">
          <div class="version-reward-table-reward-single-group">
            <div v-show="result.originiumRecharge > 0" class="version-reward-table-reward-single">
              <img
                alt="existing"
                class="version-reward-table-icon"
                src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp"
              />X
              {{ result.originiumRecharge }}

              （{{ numberFloor(result.originiumRecharge * 0.15) }}抽）
            </div>

            <div v-show="result.diamond > 0" class="version-reward-table-reward-single">
              <img
                alt="existing"
                class="version-reward-table-icon"
                src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp"
              />X{{ result.diamond }}

              （{{ numberFloor(result.diamond / 500) }}抽）
            </div>

            <div
              v-show="result.ticketgachaStandardSingle > 0"
              class="version-reward-table-reward-single"
            >
              <img
                alt="existing"
                class="version-reward-table-icon"
                src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp"
              />X{{ result.ticketgachaStandardSingle }}
            </div>

            <div
              v-show="result.ticketgachaSpecialSingle > 0"
              class="version-reward-table-reward-single"
            >
              <img
                alt="existing"
                class="version-reward-table-icon"
                src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp"
              />X{{ result.ticketgachaSpecialSingle }}
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </v-table>

  <v-table class="version-reward-table-result">
    <tbody>
      <tr v-for="result in currentVersionRewardTotal">
        <td>
          <div class="version-reward-table-reward-single">{{ result.name }}</div>
        </td>
        <td><div class="version-reward-table-reward-single">特许寻访{{ numberFloor(result.totalPulls) }}抽</div></td>
        <td><div class="version-reward-table-reward-single">基础寻访{{ result.ticketgachaStandardSingle }}抽</div></td>
        <td>
          <div v-show="result.originiumRecharge > 0" class="version-reward-table-reward-single">
            <img
              alt="existing"
              class="version-reward-table-icon"
              src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp"
            />X
            {{ result.originiumRecharge }}

            （{{ numberFloor(result.originiumRecharge * 0.15) }}抽）
          </div>
        </td>
        <td>
          <div v-show="result.diamond > 0" class="version-reward-table-reward-single">
            <img
              alt="existing"
              class="version-reward-table-icon"
              src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp"
            />X{{ result.diamond }}

            （{{ numberFloor(result.diamond / 500) }}抽）
          </div>
        </td>
        <td>
          <div
            v-show="result.ticketgachaStandardSingle > 0"
            class="version-reward-table-reward-single"
          >
            <img
              alt="existing"
              class="version-reward-table-icon"
              src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp"
            />X{{ result.ticketgachaStandardSingle }}
          </div>
        </td>
        <td>
          <div v-show="result.ticketgachaSpecialSingle > 0" class="version-reward-table-reward-single">
            <img
              alt="existing"
              class="version-reward-table-icon"
              src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp"
            />X{{ result.ticketgachaSpecialSingle }}
          </div>
        </td>
      </tr>
    </tbody>
  </v-table>

  
</template>

<style>
.version-reward-table-icon {
  width: 36px;
  height: 36px;
}

.version-reward-table {
  width: 800px;
  margin: auto;
}

.version-reward-table-result {
   width: 1000px;
  margin: auto;
}



.version-reward-table-reward-single-group {
  display: flex;
}

.version-reward-table-reward-single {
  padding: 0 12px 0 0;
  display: flex;
  align-items: center;
}
</style>
