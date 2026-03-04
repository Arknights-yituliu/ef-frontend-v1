<script setup lang="ts">
import { numberFloor } from '#shared/utils/numberUtil';

import { ref } from 'vue';

import { activityReward } from '@/custom/core/gacha/activityReward';

import { AICQuotaReward, createVersionDailyReward } from '@/custom/core/gacha/dailyReward';

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
import type { RewardStatisticsResultDetail } from '#shared/types/gacha-calculator';

const versionReward = ref<Reward[]>([]);

const currentVersionRewardTotal = ref<RewardStatisticsResultDetail>({
  name: '总计',
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
});

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

function filterRewardByVersion() {
  currentVersionReward.value = [];
  currentVersionRewardTotal.value = {
    name: '总计',
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
  };

  for (const reward of versionReward.value) {
    if ('新潮起·故渊离' === reward.version) {
      currentVersionReward.value.push(reward);
    }
  }

  currentVersionReward.value.push(
    {
      id: '新潮起·故渊离版本主线',
      name: {
        zh: `新潮起·故渊离版本主线`,
        en: '',
      },
      start: '2026/03/12 12:00:00',
      end: '2099/12/31 12:00:00',
      type: '通用',
      module: '任务',
      active: true,
      version: '零号委托',
      content: {
        originiumRecharge: 15,
        diamond: 0,
        ticketgachaStandardSingle: 0,
        ticketgachaSpecialSingle: 0,
      },
    },
    {
      id: '新潮起·故渊离版本支线',
      name: {
        zh: `新潮起·故渊离版本支线`,
        en: '',
      },
      start: '2026/03/12 12:00:00',
      end: '2099/12/31 12:00:00',
      type: '通用',
      module: '任务',
      active: true,
      version: '零号委托',
      content: {
        originiumRecharge: 0,
        diamond: 500,
        ticketgachaStandardSingle: 0,
        ticketgachaSpecialSingle: 0,
      },
    },
    {
      id: '维护、问卷、签到等杂项',
      name: {
        zh: `维护、问卷等杂项`,
        en: '',
      },
      start: '2026/03/12 12:00:00',
      end: '2099/12/31 12:00:00',
      type: '通用',
      module: '其他',
      active: true,
      version: '零号委托',
      content: {
        originiumRecharge: 0,
        diamond: 3000,
        ticketgachaStandardSingle: 0,
        ticketgachaSpecialSingle: 0,
      },
    },
  );

  for (const reward of currentVersionReward.value) {
    currentVersionRewardTotal.value.originiumRecharge += reward.content.originiumRecharge;
    currentVersionRewardTotal.value.diamond += reward.content.diamond;
    currentVersionRewardTotal.value.ticketgachaStandardSingle +=
      reward.content.ticketgachaStandardSingle;
    currentVersionRewardTotal.value.ticketgachaSpecialSingle +=
      reward.content.ticketgachaSpecialSingle;
  }
}

filterRewardByVersion();
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
        <td >
             <div class="version-reward-table-reward-single-group">
          <div
            class="version-reward-table-reward-single"
            v-show="reward.content.originiumRecharge > 0"
          >
            <img
              alt="existing"
              class="version-reward-table-icon"
              src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp"
            />X
            {{ reward.content.originiumRecharge }}
          </div>

          <div class="version-reward-table-reward-single" v-show="reward.content.diamond > 0">
            <img
              alt="existing"
              class="version-reward-table-icon"
              src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp"
            />X{{ reward.content.diamond }}
          </div>

          <div
            class="version-reward-table-reward-single"
            v-show="reward.content.ticketgachaStandardSingle > 0"
          >
            <img
              alt="existing"
              class="version-reward-table-icon"
              src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp"
            />X{{ reward.content.ticketgachaStandardSingle }}
          </div>

          <div
            class="version-reward-table-reward-single"
            v-show="reward.content.ticketgachaSpecialSingle > 0"
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
      <tr>
        <td  colspan="4">
          <div class="version-reward-table-reward-single-group">
             <div
            class="version-reward-table-reward-single"
           
          > 总计</div>
          <div
            class="version-reward-table-reward-single"
            v-show="currentVersionRewardTotal.originiumRecharge > 0"
          >
            <img
              alt="existing"
              class="version-reward-table-icon"
              src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp"
            />X
            {{ currentVersionRewardTotal.originiumRecharge }}

            （{{ numberFloor(currentVersionRewardTotal.originiumRecharge * 0.15) }}抽）
          </div>

          <div
            class="version-reward-table-reward-single"
            v-show="currentVersionRewardTotal.diamond > 0"
          >
            <img
              alt="existing"
              class="version-reward-table-icon"
              src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp"
            />X{{ currentVersionRewardTotal.diamond }}

            （{{ numberFloor(currentVersionRewardTotal.diamond / 500) }}抽）
          </div>

          <div
            class="version-reward-table-reward-single"
            v-show="currentVersionRewardTotal.ticketgachaStandardSingle > 0"
          >
            <img
              alt="existing"
              class="version-reward-table-icon"
              src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp"
            />X{{ currentVersionRewardTotal.ticketgachaStandardSingle }}
          </div>

          <div
            class="version-reward-table-reward-single"
            v-show="currentVersionRewardTotal.ticketgachaSpecialSingle > 0"
          >
            <img
              alt="existing"
              class="version-reward-table-icon"
              src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp"
            />X{{ currentVersionRewardTotal.ticketgachaSpecialSingle }}
          </div>
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

.version-reward-table-reward-single-group {
  
  display: flex;
}

.version-reward-table-reward-single {
  padding: 0 12px 0 0 ;
  display: flex;
  align-items: center;
}
</style>
