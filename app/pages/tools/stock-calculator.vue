<template>
  <v-container style="max-width: 1280px">
    <h1 class="my-4">四号谷地倒货策略速查表</h1>
    <p>根据今日 12 个商品的最低价执行对应的动作</p>
    <div class="my-4 d-flex flex-column gr-4">
      <div
        v-for="(item, index) in valley4ComputedData"
        :key="index"
        class="d-flex gc-3 align-center"
      >
        <div
          class="d-flex justify-center align-center px-4 rounded"
          :class="
            index === todayWeekday
              ? 'bg-light-blue-darken-2 text-white today-label font-weight-bold'
              : 'bg-light-blue-lighten-4 font-weight-medium'
          "
          :style="{ width: '80px', height: '40px' }"
        >
          {{ item.label }}
        </div>
        <div class="flex-1 d-flex rounded overflow-hidden" :style="{ height: '40px' }">
          <div
            class="d-flex align-center justify-center overflow-visible text-no-wrap bg-light-green-darken-1"
            :style="{ width: `${item.width0 * 80}%` }"
          >
            {{ item.text0 }}
          </div>
          <div
            class="d-flex align-center justify-center overflow-visible text-no-wrap bg-amber"
            :style="{ width: `${item.width1 * 80 + 20}%` }"
          >
            {{ item.text1 }}
          </div>
          <div
            class="d-flex align-center justify-center overflow-visible text-no-wrap bg-orange-darken-2"
            :style="{ width: `${item.width2 * 80}%` }"
          >
            {{ item.text2 }}
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex gc-3 align-center my-8">
      <div :style="{ width: '80px', height: '40px' }"></div>
      <div class="flex-1 d-flex rounded overflow-hidden" :style="{ height: '40px' }">
        <div
          class="d-flex align-center justify-center overflow-visible text-no-wrap bg-light-green-darken-1"
          :style="{ width: 'calc(100% / 3)' }"
        >
          All in
        </div>
        <div
          class="d-flex align-center justify-center overflow-visible text-no-wrap bg-amber"
          :style="{ width: 'calc(100% / 3)' }"
        >
          买到剩余 320 额度
        </div>
        <div
          class="d-flex align-center justify-center overflow-visible text-center bg-orange-darken-2"
          :style="{ width: 'calc(100% / 3)', lineHeight: 1.2 }"
        >
          买到剩余 640 额度<br />
          （若当前可购买数量不足则不买）
        </div>
      </div>
    </div>

    <h1 class="mt-12 mb-4">武陵倒货策略速查表</h1>
    <p>根据今日 4 个商品的最低价执行对应的动作</p>
    <div class="my-4 d-flex flex-column gr-4">
      <div
        v-for="(item, index) in wulingComputedData"
        :key="index"
        class="d-flex gc-3 align-center"
      >
        <div
          class="d-flex justify-center align-center px-4 rounded"
          :class="
            index === todayWeekday
              ? 'bg-light-blue-darken-2 text-white today-label font-weight-bold'
              : 'bg-light-blue-lighten-4 font-weight-medium'
          "
          :style="{ width: '80px', height: '40px' }"
        >
          {{ item.label }}
        </div>
        <div class="flex-1 d-flex rounded overflow-hidden" :style="{ height: '40px' }">
          <div
            class="d-flex align-center justify-center overflow-visible text-no-wrap bg-primary"
            :style="{ width: `${item.width0 * 100}%` }"
          >
            {{ item.text0 }}
          </div>
          <div
            class="d-flex align-center justify-center overflow-visible text-no-wrap bg-secondary"
            :style="{ width: `${item.width1 * 100}%` }"
          >
            {{ item.text1 }}
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex gc-3 align-center my-8">
      <div :style="{ width: '80px', height: '40px' }"></div>
      <div class="flex-1 d-flex rounded overflow-hidden" :style="{ height: '40px' }">
        <div
          class="d-flex align-center justify-center w-50 overflow-visible text-no-wrap bg-primary"
        >
          All in
        </div>
        <div
          class="d-flex align-center justify-center w-50 overflow-visible text-no-wrap bg-secondary"
        >
          买到剩余 50 额度
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * 计算鹰历星期
 * 鹰历日期 = 北京时间 - 04:00
 */
const todayWeekday = computed(() => {
  const nowTimestamp = Date.now();
  const beijingOffset = 8 * 60 * 60 * 1000;
  const hypergryphOffset = 4 * 60 * 60 * 1000;
  const adjustedTimestamp = nowTimestamp - beijingOffset - hypergryphOffset;
  const adjustedDate = new Date(adjustedTimestamp);
  const adjustedDay = adjustedDate.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  // 映射到数组下标 0=Mon, ..., 6=Sun
  return (adjustedDay - 1 + 7) % 7;
});

const valley4ChartData = [
  { label: '星期一', number0: 925, number1: 1014 },
  { label: '星期二', number0: 865, number1: 1109 },
  { label: '星期三', number0: 825, number1: 917 },
  { label: '星期四', number0: 794, number1: 967 },
  { label: '星期五', number0: 748, number1: 870 },
  { label: '星期六', number0: 817, number1: 825 },
  { label: '星期日', number0: 960, number1: 1206 },
];

const valley4ComputedData = computed(() => {
  const minValue = 650;
  const maxValue = 1300;
  const range = maxValue - minValue;
  return valley4ChartData.map((item) => ({
    label: item.label,
    width0: (item.number0 - minValue) / range,
    text0: `≤ ${item.number0 - 1}`,
    width1: (item.number1 - item.number0) / range,
    text1: `${item.number0} ~ ${item.number1 - 1}`,
    width2: (maxValue - item.number1) / range,
    text2: `≥ ${item.number1}`,
  }));
});

const wulingData = [
  { label: '星期一', number: 1439 },
  { label: '星期二', number: 1442 },
  { label: '星期三', number: 1350 },
  { label: '星期四', number: 1345 },
  { label: '星期五', number: 1257 },
  { label: '星期六', number: 1199 },
  { label: '星期日', number: 1518 },
];

const wulingComputedData = computed(() => {
  const minValue = 1000;
  const maxValue = 1800;
  const range = maxValue - minValue;
  return wulingData.map((item) => ({
    label: item.label,
    width0: (item.number - minValue) / range,
    text0: `≤ ${item.number - 1}`,
    width1: (maxValue - item.number) / range,
    text1: `≥ ${item.number}`,
  }));
});
</script>

<style scoped></style>
