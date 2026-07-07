<script setup lang="ts">
import type { Reward } from '#shared/types/gacha-calculator';
import { itemIdDict } from '#shared/utils/gacha-calculator';
const props = defineProps<{
  reward: Reward;
  hideVersion?: boolean;
}>();

/**
 *
 */
function getImageUrl(itemId: string): string {
  return `https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/${itemIdDict[itemId]}.png`;
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
          v-for="(value, name) in props.reward.content"
          v-show="value > 0"
          :key="`${props.reward.id}-${name}`"
          class="gacha-calculator-resource-btn-content-content"
        >
          <img alt="existing" class="gacha-calculator-gacha-item-icon" :src="getImageUrl(name)" />
          × {{ reward }}
        </div>
      </div>
      <div v-if="!props.hideVersion" class="gacha-calculator-resource-btn-version">
        {{ props.reward.version }}
      </div>
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
  grid-template-areas: 'content' !important;
  grid-template-columns: 1fr !important;
  justify-content: stretch !important;
  padding-left: 2px !important;
  transition: all 0.2s ease;
  border: 1px solid var(--theme-border-secondary);
  letter-spacing: unset;
}

.gacha-calculator-resource-btn.btn-active {
  border-left: 6px solid var(--gacha-calculator-border) !important;
}

.gacha-calculator-resource-btn:deep([aria-pressed='true']) {
  border-left: 6px solid var(--gacha-calculator-border) !important;
}

.gacha-calculator-resource-btn:deep(.v-btn__content) {
  width: 100%;
  justify-content: flex-start;
  justify-self: stretch;
}

.gacha-calculator-resource-btn-content {
  width: 100%;
  min-width: 0;
  display: flex;
  font-size: 1rem;
  align-items: center;
}
.gacha-calculator-resource-btn-content-title {
  width: 300px;
  text-align: start;
  padding-left: 8px;
}

.gacha-calculator-resource-btn-content-content {
  display: flex;
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
    width: 150px;
  }
}
</style>
