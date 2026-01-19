<script setup lang="ts">
import { itemIdDict } from '@/custom/core/gacha/task-reward-table';
import type { Reward } from '#shared/types/gacha-calculator';
const props = defineProps<{
  reward:Reward,
  sliderValue:number[]
}>();

/**
 *
 */
function getImageUrl(itemId: string): string {
  if(itemIdDict[itemId]){
    return `https://cos.yituliu.cn/endfield/unpack-images/items/item_${itemIdDict[itemId]}.webp`;
  }else {
    return  `https://cos.yituliu.cn/endfield/unpack-images/items/item_1.webp`
  }

}
</script>

<template>
    <div class="gacha-calculator-resource-single">
      <div class="gacha-calculator-resource-single-title">
        {{ props.reward.name.zh }}
      </div>
      <div
        v-for="(reward, name) in props.reward.content"
        v-show="reward > 0"
        :key="`${props.reward.id}-${name}`"
        class="gacha-calculator-resource-single-content"
      >
        <img class="gacha-calculator-gacha-item-icon" :src="getImageUrl(name)" alt="existing" />
        X {{ reward }}
      </div>
    </div>
  <v-range-slider v-model="props.sliderValue"
                  show-ticks="always"
                  step="1"
                  max="14"
                  tick-size="4" thumb-label="always"
                  hide-details="auto"
                  class="v-range-slider">
    <!--                <template v-slot:thumb-label="{ modelValue }">-->
    <!--                  {{ `第` }} {{ modelValue }} {{ `日` }}-->
    <!--                </template>-->
  </v-range-slider>
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
</style>
