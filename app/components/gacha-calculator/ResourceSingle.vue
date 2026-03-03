<script setup lang="ts">
import type { Reward } from '#shared/types/gacha-calculator';
import { itemIdDict } from '@/custom/core/gacha/levelReward';
const props = defineProps<Reward>();

/**
 *
 */
function getImageUrl(itemId: string): string {
  if (itemIdDict[itemId]) {
    return `https://cos.yituliu.cn/endfield/unpack-images/items/item_${itemIdDict[itemId]}.webp`;
  } else {
    return `https://cos.yituliu.cn/endfield/unpack-images/items/item_1.webp`;
  }
}
</script>

<template>
  <div>
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
        <img alt="existing" class="gacha-calculator-gacha-item-icon" :src="getImageUrl(name)" />
        X {{ reward }}
      </div>
    </div>
    <div class="gacha-calculator-resource-single-version">版本：{{ props.version }}</div>
  </div>
</template>

<style scoped>
.gacha-calculator-gacha-item-icon {
  width: 36px;
  height: 36px;
}
.gacha-calculator-resource-single-btn {
  margin: 4px 0px;
  width: 100%;
}

.gacha-calculator-resource-single {
  width: 100%;
  display: flex;
  font-size: 1rem;
  align-items: center;
  padding: 4px 4px;
  border-radius: 4px;
  margin: 4px 0;
  border: 1px solid var(--theme-border-secondary);
}
.gacha-calculator-resource-single-title {
  width: 300px;
  text-align: start;
}

.gacha-calculator-resource-single-content {
  display: flex;
  align-items: center;
  padding: 0 4px;
}

.gacha-calculator-resource-single-version {
  display: flex;
  justify-content: flex-end;
  font-size: 0.7rem;
}

@media screen and (max-width: 600px) {
  .gacha-calculator-resource-single {
    font-size: 0.8rem;
  }

  .gacha-calculator-resource-single-title {
    width: 150px;
    text-align: start;
  }
}
</style>
