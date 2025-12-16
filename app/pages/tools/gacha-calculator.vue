<script setup lang="ts">
import type { PackContent } from '@/shared/types/pack';
const { t } = useI18n();

/**
 * 实现一个函数，传入参数有开始日期，结束日期，两个参数可能是字符串，例如'2025-12-15 04:00:00',也可能是Date对象，也可能是时间戳，根据传入的参数计算俩个日期之间的天数差
 * @param {Date|string|number} startDate 开始日期
 * @param {Date|string|number} endDate 结束日期
 * @returns {number} 俩个日期之间的天数差
 */
function calculateDaysDifference(startDate: Date | string | number, endDate: Date | string | number) {
  // 转换为时间戳
  const startTimestamp = typeof startDate === 'number' ? startDate : new Date(startDate).getTime();
  const endTimestamp = typeof endDate === 'number' ? endDate : new Date(endDate).getTime();
  // 计算天数差
  const daysDifference = (endTimestamp - startTimestamp) / (1000 * 60 * 60 * 24);
  return daysDifference;
}



</script>

<template>
  <h1 class="page-title">{{ t('page.tools.gachaCalculator.title') }}</h1>
  <p>{{ t('page.tools.gachaCalculator.underDevelopment') }}</p>



</template>


<style scoped></style>
