<template>
  <button
    :aria-label="label"
    class="abandon-action-button"
    :disabled="disabled"
    type="button"
    @click="$emit('click')"
  >
    <v-icon icon="mdi-logout"></v-icon>
    <span class="abandon-action-content">
      <span class="abandon-action-text">{{ label }}</span>
    </span>
  </button>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    disabled?: boolean;
    label?: string;
  }>(),
  {
    label: '放弃',
  },
);

defineEmits<{
  click: [];
}>();
</script>

<style scoped>
.abandon-action-button {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 44px;
  padding: 0.34rem 0.5rem;
  overflow: hidden;
  font: inherit;
  color: rgba(255, 255, 255, 0.96);
  cursor: pointer;
  appearance: none;
  background: linear-gradient(90deg, rgba(87, 33, 34, 0.94), rgba(105, 42, 43, 0.88)), #552526;
  border: 2px solid rgba(255, 42, 44, 0.9);
  border-radius: 0;
  transition:
    filter 0.18s ease,
    transform 0.18s ease,
    opacity 0.18s ease;
  isolation: isolate;
}

.abandon-action-button::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: '';
  background:
    repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.04) 0,
      rgba(255, 255, 255, 0.04) 1px,
      transparent 1px,
      transparent 6px
    ),
    linear-gradient(90deg, rgba(255, 42, 44, 0.08), transparent 42%);
}

.abandon-action-button:hover:not(:disabled) {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.abandon-action-button:disabled {
  cursor: default;
  filter: grayscale(0.45);
  opacity: 0.58;
}

.abandon-action-button:focus-visible {
  outline: 2px solid rgba(255, 42, 44, 0.82);
  outline-offset: 2px;
}

.abandon-action-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 0;
}

.abandon-action-text {
  overflow: hidden;
  font-size: 1.28rem;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow: 0 1px 0 rgba(40, 10, 10, 0.34);
}
</style>
