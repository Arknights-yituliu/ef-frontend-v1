<script setup lang="ts">
import { dateFormat } from '#shared/utils/dateUtil';

import { numberFloor } from '#shared/utils/numberUtil';
import { filterRewardEndAfter, rewardTotalCalc } from '@/custom/core/gacha/versionReward';

const list = filterRewardEndAfter(
  ['零号委托', '新潮起·故渊离', '春晓时'],
  new Date('2026/04/17 12:00:00'),
);
const result: RewardStatisticsResultDetail = rewardTotalCalc(list, [], '总和');
</script>

<template>
  <div>
    <table class="version-reward-table">
      <thead>
        <tr>
          <th>奖励名称</th>
          <th>衍质源石</th>
          <th>嵌晶玉</th>
          <th>标准寻访</th>
          <th>特许寻访</th>
          <th>限时寻访</th>
          <th>来源</th>
          <th>版本</th>
          <th>开始日期</th>
          <th>结束日期</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reward in list" :key="reward.id">
          <td>{{ reward.name.zh }}</td>
          <td>{{ reward.content.originiumRecharge }}</td>
          <td>{{ reward.content.diamond }}</td>
          <td>{{ reward.content.ticketgachaStandardSingle }}</td>
          <td>{{ reward.content.ticketgachaSpecialSingle }}</td>
          <td>{{ reward.content.ticketgachaLimitedSingle }}</td>
          <td>{{ reward.module }}</td>
          <td>{{ reward.version }}</td>
          <td>{{ dateFormat(reward.start) }}</td>
          <td>{{ dateFormat(reward.end) }}</td>
        </tr>
      </tbody>
    </table>
    <table class="version-reward-result-table">
      <thead>
        <tr>
          <th>氪度</th>
          <th>衍质源石</th>
          <th>嵌晶玉</th>
          <th>基准寻访</th>
          <th>特许寻访</th>
          <th>限时寻访</th>
          <th>特训寻访(包含衍质源石嵌晶玉)</th>
          <th>特训寻访+限时寻访</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reward in [result]" :key="reward.name">
          <td>{{ reward.name }}</td>
          <td>{{ reward.originiumRecharge }}</td>
          <td>{{ reward.diamond }}</td>
          <td>{{ reward.ticketgachaStandardSingle }}</td>
          <td>{{ reward.ticketgachaSpecialSingle }}</td>
          <td>{{ reward.ticketgachaLimitedSingle }}</td>
          <td>{{ numberFloor(reward.totalPulls as number) }}抽</td>
          <td>
            {{ numberFloor((reward.totalPulls as number) + reward.ticketgachaLimitedSingle) }}抽
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.version-reward-table {
  margin: auto;
  width: 1000px;
  border-collapse: collapse;

  td,
  th {
    border: 1px solid #000;
    padding: 4px 8px;
    text-align: center;
  }
}

.version-reward-result-table {
  margin: auto;
  border-collapse: collapse;

  td,
  th {
    border: 1px solid #000;
    padding: 4px 12px;
    text-align: center;
  }
}
</style>
