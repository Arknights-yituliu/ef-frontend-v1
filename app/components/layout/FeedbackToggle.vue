<template>
  <button class="feedback-btn" @click="$emit('click')">
    <div class="btn-bg" />
    <div class="btn-left-border" />
    <!-- <span class="btn-text">{{ $t('common.feedback') }}</span> -->
    <svg
      class="btn-icon"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  </button>
</template>

<script lang="ts" setup>
defineEmits<{
  click: []
}>();
</script>

<style scoped>
.feedback-btn {
  min-width: 3rem;
  height: 2.75rem;
  padding: 0 0.875rem;
  border: 1px solid var(--theme-border);
  border-radius: var(--radius-sm);
  background-color: var(--theme-bg-secondary);
  color: var(--theme-text-primary);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 0 0.25rem var(--theme-shadow-base);
  letter-spacing: 0.05em;
}

.feedback-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
    -45deg,
    transparent,
    transparent 13.9512529279%,
    var(--theme-decorative-overlay-light) 0,
    var(--theme-decorative-overlay-light) 36.0487470721%,
    transparent 0,
    transparent 63.9512529279%,
    var(--theme-decorative-overlay-light) 0,
    var(--theme-decorative-overlay-light) 86.0487470721%,
    transparent 0,
    transparent
  );
  background-size: 0.5rem 0.5rem;
  opacity: 0;
  transition: opacity var(--transition-fast);
  z-index: 0;
}

.feedback-btn:hover::before {
  opacity: 1;
}

.btn-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  transition: all var(--transition-fast);
  z-index: 0;
}

.btn-left-border {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0.25rem;
  background-color: transparent;
  transition: all var(--transition-fast);
  z-index: 1;
}

.feedback-btn:hover {
  background-color: var(--theme-bg-tertiary);
  border-color: var(--theme-accent-color);
  transform: translateX(0.125rem);
  box-shadow: 0 0 0.75rem var(--theme-shadow-accent);
}

.feedback-btn:hover .btn-left-border {
  background-color: var(--theme-accent-color);
  box-shadow: 0 0 0.5rem var(--theme-accent-color);
}

.feedback-btn:active {
  transform: translateX(0.05rem) scale(0.98);
  box-shadow: 0 0 0.5rem var(--theme-shadow-accent-hover);
}

.feedback-btn:active .btn-left-border {
  background-color: var(--theme-text-primary);
  width: 0.375rem;
  box-shadow: none;
}

.feedback-btn:active .btn-bg {
  background-color: var(--theme-text-primary);
  opacity: 0.1;
}

.feedback-btn:active::before {
  opacity: 0.3;
  background-image: linear-gradient(
    -45deg,
    transparent,
    transparent 13.9512529279%,
    var(--theme-decorative-overlay) 0,
    var(--theme-decorative-overlay) 36.0487470721%,
    transparent 0,
    transparent 63.9512529279%,
    var(--theme-decorative-overlay) 0,
    var(--theme-decorative-overlay) 86.0487470721%,
    transparent 0,
    transparent
  );
}

.btn-text {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
  color: var(--theme-text-primary);
  position: relative;
  z-index: 2;
  transition: transform var(--transition-fast);
}

.feedback-btn:hover .btn-icon {
  transform: translateY(-1px);
}
</style>
