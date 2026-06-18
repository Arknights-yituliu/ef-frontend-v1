<template>
  <button
    :aria-label="label"
    class="start-calculation-button"
    :disabled="disabled"
    type="button"
    @click="$emit('click')"
  >
    <v-icon icon="mdi-code-brackets"></v-icon>
    <span class="start-calculation-text">{{ label }}</span>
  </button>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    disabled?: boolean;
    label?: string;
  }>(),
  {
    label: '开始演算',
  },
);

defineEmits<{
  click: [];
}>();
</script>

<style scoped>
.start-calculation-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 44px;
  padding: 0.35rem 0.55rem;
  overflow: hidden;
  font: inherit;
  color: rgba(255, 255, 255, 0.98);
  cursor: pointer;
  appearance: none;
  background: linear-gradient(90deg, rgba(194, 170, 112, 0.92), rgba(222, 204, 158, 0.86)), #cbb176;
  border: 0;
  border-radius: 2px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
  transition:
    filter 0.18s ease,
    transform 0.18s ease,
    opacity 0.18s ease;
  isolation: isolate;
}

.start-calculation-button::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: '';
  background:
    repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.12) 0,
      rgba(255, 255, 255, 0.12) 1px,
      transparent 1px,
      transparent 6px
    ),
    linear-gradient(120deg, transparent 0 48%, rgba(255, 255, 255, 0.14) 48% 54%, transparent 54%);
}

.start-calculation-button:hover:not(:disabled) {
  filter: brightness(1.04);
  transform: translateY(-1px);
}

.start-calculation-button:disabled {
  cursor: default;
  filter: grayscale(0.55);
  opacity: 0.58;
}

.start-calculation-button:focus-visible {
  outline: 2px solid rgba(215, 184, 104, 0.82);
  outline-offset: 2px;
}

.start-calculation-text {
  min-width: 0;
  overflow: hidden;
  font-size: 1.28rem;
  font-weight: 900;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow: 0 1px 0 rgba(118, 95, 54, 0.2);
}
</style>
