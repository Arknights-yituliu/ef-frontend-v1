<script setup lang="ts">
import type { RewardStatisticsResultDetail } from '#shared/types/gacha-calculator';

import { calculateDaysDifference, countTuesdaysBetweenV2 } from '#shared/utils/gacha-calculator';

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
    name: '零氪玩家总计',
    originiumRecharge: 3,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    totalPulls: 0,
  };

  const result2: RewardStatisticsResultDetail = {
    name: '小月卡玩家总计',
    originiumRecharge: 3,
    diamond: numberFloor(daysDiff) * 200,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    totalPulls: 0,
  };

  const result3: RewardStatisticsResultDetail = {
    name: '大小月卡玩家总计',
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
  <div class="version-reward-bg">
    <img
      src="https://cos.yituliu.cn/endfield/other/kv-v1.1.webp"
      alt=""
      class="version-reward-bg-kv"
    />

    <img
      src="https://cos.yituliu.cn/endfield/other/1111.png"
      alt=""
      class="version-reward-title-image"
    />

  
    <div style="text-align: end; width: 100%; font-weight: bolder; padding-right: 40px">
      更新日期：2026-03-05
    </div>
     <div style="text-align: end; width: 100%; font-weight: bolder; padding-right: 40px">
      部分资源为估算，仅供参考
    </div>
    <div class="version-reward-item-group">
      <div class="version-reward-item" v-for="reward in currentVersionReward">
        <div>
          <!-- <div class="version-reward-item-bar red-bar"></div> -->
          <div class="version-reward-item-bar yellow-bar"></div>
          <!-- <div class="version-reward-item-bar blue-bar"></div> -->
        </div>
        <div class="version-reward-item-name">{{ reward.name.zh }}</div>
        <div class="version-reward-item-content" v-show="reward.content.originiumRecharge > 0">
          <img
            alt="existing"
            class="version-reward-item-icon"
            src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp"
          />X
          {{ reward.content.originiumRecharge }}
        </div>
        <div class="version-reward-item-content" v-show="reward.content.diamond > 0">
          <img
            alt="existing"
            class="version-reward-item-icon"
            src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp"
          />X
          {{ reward.content.diamond }}
        </div>
        <div
          class="version-reward-item-content"
          v-show="reward.content.ticketgachaStandardSingle > 0"
        >
          <img
            alt="existing"
            class="version-reward-item-icon"
            src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp"
          />X
          {{ reward.content.ticketgachaStandardSingle }}
        </div>
        <div
          class="version-reward-item-content"
          v-show="reward.content.ticketgachaSpecialSingle > 0"
        >
          <img
            alt="existing"
            class="version-reward-item-icon"
            src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp"
          />X
          {{ reward.content.ticketgachaSpecialSingle }}
        </div>
      </div>
    </div>
    <div class="version-reward-result-group">
      <div v-for="result in currentVersionRewardTotal" class="version-reward-result">
        <div>
          <div class="version-reward-result-color-border red-bg"></div>
          <div class="version-reward-result-color-border yellow-bg"></div>
          <div class="version-reward-result-color-border blue-bg"></div>
        </div>
        <div>
          <div class="version-reward-result-name">{{ result.name }}</div>
          <div>特许寻访{{ numberFloor(result.totalPulls) - 20 }}抽</div>
          <div>限时寻访20抽</div>
          <div>基础寻访{{ result.ticketgachaStandardSingle }}抽</div>

          <div class="version-reward-result-content">
            <div class="version-reward-result-content-item">
              <img
                alt="existing"
                class="version-reward-item-icon"
                src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp"
              />X
              {{ result.originiumRecharge }}
            </div>
            <div class="version-reward-result-content-item">
              <img
                alt="existing"
                class="version-reward-item-icon"
                src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp"
              />X{{ result.diamond }}
            </div>
            <div class="version-reward-result-content-item">
              <img
                alt="existing"
                class="version-reward-item-icon"
                src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp"
              />X{{ result.ticketgachaStandardSingle }}
            </div>
            <div class="version-reward-result-content-item">
              <img
                alt="existing"
                class="version-reward-item-icon"
                src="https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp"
              />X{{ result.ticketgachaSpecialSingle }}
            </div>
          </div>
        </div>
      </div>
    </div>
   <div class="version-reward-footer">
    <div>
     <div>数据来源：终末地一图流攒抽计算器 https://ef.yituliu.cn/tools/gacha-calculator/</div>
      <div>数据整理：逻辑元LogicalByte@Bilibili</div>
      </div>
      <img
        alt="existing"
        style="width: 100px;height: 100px;"
        src="https://cos.yituliu.cn/endfield/QR/httpsef.yituliu.cntoolsgacha-calculator.png"
      />
   </div>
  </div>
</template>

<style>
.version-reward-bg {
  background:
    linear-gradient(to bottom, rgba(255, 250, 0, 1) 100px, rgba(50, 50, 50, 0.1) 600px),
    url('https://cos.yituliu.cn/endfield/other/bg-1.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding-top:400px;
  width: 1000px;
  margin: auto;
  min-height: 1400px;
  font-size: 24px;
  overflow: hidden;
  position: relative;
}

.version-reward-bg-kv {
  width: 1000px;
   position: absolute;
  top: 0;
}

.version-reward-title-image {
  width: 700px;
  position: absolute;
  top: 180px;
  right: 0;
}

.version-reward-bg-bottom-bar {
  display: flex;
}

.version-reward-bg-bottom-bar-1 {
  background-color: #bfbfbf;
  width: 20%;
  height: 10px;
}
.version-reward-bg-bottom-bar-2 {
  background-color: #ff00f0;
  width: 10%;
  height: 10px;
}
.version-reward-bg-bottom-bar-3 {
  background-color: #fffa00;
  width: 10%;
  height: 10px;
}
.version-reward-bg-bottom-bar-4 {
  background-color: #00ffa2;
  width: 10%;
  height: 10px;
}
.version-reward-bg-bottom-bar-5 {
  background-color: #bfbfbf;
  width: 50%;
  height: 10px;
}
.version-reward-item-group {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 1240px;
  align-items: center;

}

.version-reward-item-icon {
  width: 32px;
  height: 32px;
}

.version-reward-item {
  height: 42px;
  width: 490px;
  display: flex;
  align-items: center;
  padding: 0 4px;
  margin: 8px 0;
  /* background: linear-gradient(to right, rgba(189, 189, 189, 1), rgb(243, 243, 243)); */
  background-color: rgb(49, 49, 49);
  color: white;


  .version-reward-item-name {
    padding: 0 4px;
    width: 260px;
    overflow: hidden;
    white-space: nowrap;
  }

  .version-reward-item-content {
   
    padding: 0 4px;
    display: flex;
    align-items: center;
  }

  .version-reward-item-bar {
    height: 24px;
    width: 4px;
  }
}

.version-reward-result-group {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-around;
}

.version-reward-result {
  width: 290px;
  text-align: center;
  background-color: rgb(49, 49, 49);
  color: white;
  line-height: 1.8;
  height: 270px;
  display: flex;
  margin: 20px 0;
  font-size: 22px;
  
  .version-reward-result-color-border {
    height: 90px;
    width: 4px;
  }

  .version-reward-result-name {
    font-size: 32px;
    font-weight: bolder;
  }

  .version-reward-result-content {
  
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
  }

  .version-reward-result-content-item {
    width: 100px;
    padding: 0 8px;
    display: flex;
    align-items: center;
  }
}

.version-reward-footer {
  padding-left:12px ;
 background: linear-gradient(to right, rgba(255, 250, 0, 0.8), rgba(255, 250, 0, 0.3));
  font-size: 22px;
  line-height: 2;
 color: black;
 display: flex;
 justify-content: space-between;
}

.yellow-bg {
  background-color: #fffa00;
}
.green-bg {
  background-color: #00ffa2;
}
.blue-bg {
  background-color: #00ffff;
}
.red-bg {
  background-color: #f44336;
}
</style>
