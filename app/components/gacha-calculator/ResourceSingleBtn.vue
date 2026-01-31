<script setup lang="ts">
import { itemIdDict } from '@/custom/core/gacha/level-reward';
import type { Reward } from '#shared/types/gacha-calculator';
const props = defineProps<Reward>();

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
  <v-btn
    class="gacha-calculator-resource-btn"
    :class="{ 'btn-active': props.active }"
    :active="props.active"
  >
    <div class="gacha-calculator-resource-btn-content">
      <div class="gacha-calculator-resource-btn-content-title">
        {{ props.name.zh }}
      </div>
      <div
        v-for="(reward, name) in props.content"
        v-show="reward > 0"
        :key="`${props.id}-${name}`"
        class="gacha-calculator-resource-btn-content-content"
      >
        <img class="gacha-calculator-gacha-item-icon" :src="getImageUrl(name)" alt="existing" >
        X {{ reward }}
      </div>
    </div>
  </v-btn>
</template>

<style scoped>
.gacha-calculator-gacha-item-icon {
  width: 36px;
  height: 36px;

}
.gacha-calculator-resource-btn {
  margin: 4px 0px;
  width: 100%;
  transition: all 0.2s ease;
  border: 1px solid var(--theme-border-secondary);
  border-bottom: 3px solid transparent;
}

.gacha-calculator-resource-btn.btn-active {
  border-bottom: 3px solid #FFD700 !important;
}

.gacha-calculator-resource-btn:deep([aria-pressed="true"]) {
  border-bottom: 3px solid #FFD700 !important;
}

.gacha-calculator-resource-btn-content {
  width: 560px;
  display: flex;
  font-size: 1rem;
  align-items: center;

}
.gacha-calculator-resource-btn-content-title {
  width: 300px;
  text-align: start;
}

.gacha-calculator-resource-btn-content-content {
  display: flex;
  align-items: center;
  padding: 0 4px;
}
</style>
