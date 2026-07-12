<script setup lang="ts">
import type { Reward } from '#shared/types/gacha-calculator';
import { itemIdDict } from '#shared/utils/gacha-calculator';
const props = defineProps<Reward>();

/**
 *
 */
function getImageUrl(itemId: string): string {
  return `https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/${itemIdDict[itemId]}.png`;
}
</script>

<template>
  <div>
    <div>
      <div class="gacha-calculator-resource-single">
        <div class="gacha-calculator-resource-single-title">
          {{ props.name.zh }}
        </div>
        <div
          v-for="(value, name) in props.content"
          v-show="value > 0"
          :key="`${props.id}-${name}`"
          class="gacha-calculator-resource-single-content"
        >
          <img alt="existing" class="gacha-calculator-gacha-item-icon" :src="getImageUrl(name)" />
          × {{ value }}
        </div>
        <!-- <div class="gacha-calculator-resource-single-version">{{ props.version }}</div> -->
      </div>
    </div>
    <template v-if="props.tips">
      <div v-for="tip in props.tips" :key="tip" class="gacha-calculator-resource-single-tip">
        {{ tip }}
      </div>
    </template>
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
  position: relative;
  width: 100%;
  display: flex;
  height: 42px;
  font-size: 1rem;
  align-items: center;
  padding: 0 4px;
  border-radius: 4px;
  margin: 4px 0;
  border: 1px solid var(--theme-border-secondary);
  background-color: rgba(var(--v-theme-on-surface), 0.08);
}
.gacha-calculator-resource-single-title {
  width: 300px;
  text-align: start;
  line-height: 42px;
  padding-left: 4px;
}

.gacha-calculator-resource-single-content {
  display: flex;
  align-items: center;
  padding: 0 4px;
  height: 42px;
}

.gacha-calculator-resource-single-version {
  position: absolute;
  right: 4px;
  bottom: 2px;
  font-size: 0.7rem;
  opacity: 0.3;
}

.gacha-calculator-resource-single-tip {
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
