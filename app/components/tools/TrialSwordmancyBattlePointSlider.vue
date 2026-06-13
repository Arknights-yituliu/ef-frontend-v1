<template>
  <div
    :aria-label="overflow ? `当前战力点：${point}，手牌点数和已溢出` : `当前战力点：${point}`"
    class="battle-point-slider"
    :class="{ 'is-overflow': overflow }"
    role="img"
    :style="{ '--battle-point-position': `${((point + 0.5) / 11) * 100}%` }"
  >
    <div class="battle-point-slider-label">当前战力点</div>
    <div class="battle-point-slider-track">
      <span
        v-for="p in 战力点刻度"
        :key="p"
        class="battle-point-slider-tick"
        :class="{ 'is-active': p === point }"
      >
        {{ p }}
      </span>
      <div class="battle-point-slider-thumb">
        {{ point }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  point: number;
  overflow: boolean;
}>();

const 战力点刻度 = Array.from({ length: 11 }, (_, i) => i);
</script>

<style scoped>
.battle-point-slider {
  display: grid;
  grid-template-columns: minmax(92px, 0.22fr) minmax(0, 1fr);
  min-height: 54px;
  overflow: hidden;
  border: 1px solid var(--theme-border);
  border-radius: 4px;
  background-color: var(--theme-bg-secondary);
  transition:
    background-color 0.24s ease,
    border-color 0.24s ease;
}

.battle-point-slider.is-overflow {
  border-color: rgba(255, 45, 51, 0.95);
  background-image:
    repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.05) 0,
      rgba(255, 255, 255, 0.05) 1px,
      transparent 1px,
      transparent 5px
    ),
    linear-gradient(90deg, rgba(154, 28, 33, 0.64), rgba(102, 32, 34, 0.36));
}

.battle-point-slider-label {
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  font-size: 1rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.96);
  background-color: rgba(20, 27, 29, 0.72);
  border-right: 1px solid rgba(238, 241, 238, 0.28);
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.32);
  white-space: nowrap;
}

.battle-point-slider.is-overflow .battle-point-slider-label {
  background-color: rgba(108, 22, 25, 0.76);
  border-right-color: rgba(255, 45, 51, 0.46);
}

.battle-point-slider-track {
  position: relative;
  display: grid;
  grid-template-columns: repeat(11, minmax(0, 1fr));
  min-width: 0;
  padding-top: 0.45rem;
}

.battle-point-slider-track::before {
  position: absolute;
  top: 0.72rem;
  right: 0.45rem;
  left: 0.45rem;
  height: 2px;
  content: '';
  background-color: var(--theme-border);
}

.battle-point-slider.is-overflow .battle-point-slider-track::before {
  background-color: rgba(255, 255, 255, 0.34);
}

.battle-point-slider-tick {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding-top: 0.75rem;
  font-size: 1.2rem;
  font-weight: 900;
  color: var(--theme-text-tertiary);
  border-left: 1px solid var(--theme-border);
}

.battle-point-slider.is-overflow .battle-point-slider-tick {
  color: rgba(255, 255, 255, 0.66);
  border-left-color: rgba(255, 255, 255, 0.14);
}

.battle-point-slider-tick:first-of-type {
  border-left: 0;
}

.battle-point-slider-tick.is-active {
  color: transparent;
}

.battle-point-slider-thumb {
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--battle-point-position);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% / 11);
  font-size: 1.75rem;
  background-color: rgba(197, 175, 120, 0.82);
  border-top: 4px solid var(--theme-accent-color);
  box-shadow: 0 6px 14px var(--theme-shadow-accent);
  transform: translateX(-50%);
  color: white;
  font-weight: 900;
  transition:
    left 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.24s ease,
    border-color 0.24s ease,
    box-shadow 0.24s ease;
  will-change: left;
}

.battle-point-slider.is-overflow .battle-point-slider-thumb {
  background-color: rgba(182, 34, 39, 0.88);
  border-top-color: rgba(255, 45, 51, 0.95);
}
</style>
