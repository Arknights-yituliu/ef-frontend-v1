<script setup lang="ts">
import { beginnerCheckInTasks } from '@/custom/core/gacha-task-reward-table';
import type { Reward } from '#shared/types/gacha-calculator';

const props = defineProps<Reward>();

/**
 *
 */
function getImageUrl(itemId: string): string {
  return `https://cos.yituliu.cn/endfield/unpack-images/items/item_${itemIdDict[itemId]}.webp`;
}
</script>

<template>
  <v-btn class="gacha-calculator-resource-single-btn" :active="props.active">
    <div class="gacha-calculator-resource-single">
      <div class="gacha-calculator-resource-single-title">
        {{ props.name.zh }}
      </div>
      <div
        v-for="(reward, name) in props.content"
        v-show="reward > 0"
        :key="`${props.id}-${name}`"
        class="gacha-calculator-resource-single-content"
      >
        <img class="gacha-calculator-gacha-item-icon" :src="getImageUrl(name)" alt="existing" />
        X {{ reward }}
      </div>
    </div>
  </v-btn>
</template>

<style scoped>
.gacha-calculator-gacha-item-icon {
  width: 36px;
  height: 36px;
  margin: 0 12px 0 0;
}
.gacha-calculator-resource-single-btn {
  margin: 4px 0px;
  width: 96%;
  justify-content: start;
}

.gacha-calculator-resource-single {
  width: 98%;
  display: flex;
  font-size: 1.25rem;
  align-items: center;
}
.gacha-calculator-resource-single-title {
  width: 200px;
}
.gacha-calculator-resource-single-content {
  display: flex;
  align-items: center;
}
</style>
