<script setup lang="ts">
import { dateFormat } from '#shared/utils/dateUtil';

import { numberFloor, numberRound } from '#shared/utils/numberUtil';

import { onMounted, ref, watch } from 'vue';
import {
  currentVersionRewardTotal,
  currentVersionReward,
  filterRewardByVersion,
  versionTable,
} from '@/custom/core/gacha/versionReward';

filterRewardByVersion('date', versionTable[2]);
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
          <th>开始日期</th>
          <th>结束日期</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reward in currentVersionReward" :key="reward.id">
          <td>{{ reward.name.zh }}</td>
          <td>{{ reward.content.originiumRecharge }}</td>
          <td>{{ reward.content.diamond }}</td>
          <td>{{ reward.content.ticketgachaStandardSingle }}</td>
          <td>{{ reward.content.ticketgachaSpecialSingle }}</td>
          <td>{{ reward.content.ticketgachaLimitedSingle }}</td>
          <td>{{ reward.module }}</td>
          <td>{{ dateFormat(reward.start) }}</td>
          <td>{{ dateFormat(reward.end) }}</td>
        </tr>
        <tr v-for="reward in currentVersionRewardTotal" :key="reward.name">
          <td>{{ reward.name }}</td>
          <td>{{ reward.originiumRecharge }}</td>
          <td>{{ reward.diamond }}</td>
          <td>{{ reward.ticketgachaStandardSingle }}</td>
          <td>{{ reward.ticketgachaSpecialSingle }}</td>
          <td>{{ reward.ticketgachaLimitedSingle }}</td>
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
  td {
    padding: 4px 8px;
  }
}
</style>
