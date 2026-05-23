<script setup lang="ts">
import type { Reward } from '#shared/types/gacha-calculator';
import { dateFormat } from '#shared/utils/dateUtil';
import { itemIdDict } from '#shared/utils/gacha-calculator';
const props = defineProps<{
  reward:Reward,
  hideVersion?:boolean
}>();

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
    <v-btn
      :active="props.reward.active"
      class="gacha-calculator-resource-btn"
      :class="{ 'btn-active': props.reward.active }"      
    >
      <div class="gacha-calculator-resource-btn-content">
        <div class="gacha-calculator-resource-btn-content-title">
          {{ props.reward.name.zh }} 
          <!-- {{ dateFormat(props.reward.start) }} -->
        </div>
        <div
          v-for="(reward, name) in props.reward.content"
          v-show="reward > 0"
          :key="`${props.reward.id}-${name}`"
          class="gacha-calculator-resource-btn-content-content"
        >
          <img alt="existing" class="gacha-calculator-gacha-item-icon" :src="getImageUrl(name)" />
          X {{ reward }}
        </div>
      </div>
      <div v-if="!props.hideVersion" class="gacha-calculator-resource-btn-version">{{ props.reward.version }}</div>
    </v-btn>
    <template v-if="props.reward.tips">
      <div v-for="tip in props.reward.tips" :key="tip" class="gacha-calculator-resource-btn-tip">
        {{ tip }}
      </div>
    </template>
  </div>
</template>

<style scoped>
.gacha-calculator-gacha-item-icon {
  width: 42px;
  height: 42px;
}
.gacha-calculator-resource-btn {
  position: relative;
  margin: 4px 0px;
  width: 100%;
  min-height: 42px;
  transition: all 0.2s ease;
  border: 1px solid var(--theme-border-secondary);
}

.gacha-calculator-resource-btn.btn-active {
  border-left: 6px solid var(--gacha-calculator-border) !important;
}

.gacha-calculator-resource-btn:deep([aria-pressed='true']) {
  border-left: 6px solid var(--gacha-calculator-border) !important;
}

.gacha-calculator-resource-btn-content {
  width: 100%;
  display: flex;
  gap: 8px;
  font-size: 1rem;
  align-items: center;
}
.gacha-calculator-resource-btn-content-title {
  flex: 1 1 220px;
  min-width: 0;
  text-align: start;
  padding-left: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gacha-calculator-resource-btn-content-content {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  padding: 0 4px;
}

.gacha-calculator-resource-btn-version {
  position: absolute;
  bottom: 0;
  right: 4px;
  font-size: 0.7rem;
  line-height: 1;
  opacity: 0.3;
}
.gacha-calculator-resource-btn-tip {
  font-size: 0.7rem;
}

@media screen and (max-width: 600px) {
  .gacha-calculator-resource-btn-content {
    font-size: 0.8rem;
  }

  .gacha-calculator-resource-btn-content-title {
    flex-basis: 130px;
  }
}
</style>
