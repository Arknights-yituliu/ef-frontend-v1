<script lang="ts" setup>
import type { Reward } from '#shared/types/gacha-calculator';
import { itemIdDict } from '#shared/utils/gacha-calculator';
import { computed } from 'vue';

const props = defineProps<{
  reward: Reward;
  sliderValue: number[];
}>();

const emit = defineEmits<{
  'update:sliderValue': [value: number[]];
}>();

const sliderValue = computed({
  get: () => props.sliderValue,
  set: (value) => emit('update:sliderValue', value),
});

function getImageUrl(itemId: string): string {
  return `https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/${itemIdDict[itemId]}.png`;
}
</script>

<template>
  <div>
    <div class="gacha-calculator-resource-single">
      <div class="gacha-calculator-resource-single-title">
        {{ props.reward.name.zh }}
      </div>
      <div
        v-for="(item, name) in props.reward.content"
        v-show="item > 0"
        :key="`${props.reward.id}-${name}`"
        class="gacha-calculator-resource-single-content"
      >
        <img alt="existing" class="gacha-calculator-gacha-item-icon" :src="getImageUrl(name)" />
        X {{ item }}
      </div>
    </div>
    <v-range-slider
      v-model="sliderValue"
      class="v-range-slider"
      hide-details="auto"
      max="14"
      show-ticks="always"
      step="1"
      thumb-label="always"
      tick-size="4"
    >
      <!--                <template v-slot:thumb-label="{ modelValue }">-->
      <!--                  {{ `第` }} {{ modelValue }} {{ `日` }}-->
      <!--                </template>-->
    </v-range-slider>
    <template v-if="props.reward.tips">
      <div v-for="tip in props.reward.tips" :key="tip" class="gacha-calculator-resource-btn-tip">
        {{ tip }}
      </div>
    </template>
  </div>
</template>

<style scoped>
.gacha-calculator-gacha-item-icon {
  width: 36px;
  height: 36px;
  margin: 0 12px 0 0;
}
.gacha-calculator-resource-single-btn {
  margin: 4px 0px;
  width: 100%;
}

.gacha-calculator-resource-single {
  width: 530px;
  display: flex;
  font-size: 1.25rem;
  align-items: center;
}
.gacha-calculator-resource-single-title {
  width: 200px;
  text-align: start;
}

.gacha-calculator-resource-single-content {
  display: flex;
  align-items: center;
}

.gacha-calculator-resource-single-tip {
  font-size: 0.7rem;
}
</style>
