<template>
  <div class="language-toggle">
    <button
      v-for="locale in availableLocales"
      :key="locale.code"
      class="language-btn"
      :class="{ active: currentLocale === locale.code }"
      @click="setLocale(locale.code)"
    >
      <div class="btn-bg"></div>
      <div class="btn-left-border"></div>
      <span class="btn-text">{{ locale.label }}</span>
      <svg 
        v-if="currentLocale === locale.code" 
        class="btn-check-icon" 
        viewBox="0 0 12 12" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M2 6 L5 9 L10 2" 
          stroke="currentColor" 
          stroke-width="2" 
          fill="none" 
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()

const currentLocale = computed(() => locale.value)

const availableLocales = computed(() => {
  return [
    { code: 'zh-CN' as const, label: '中' },
    { code: 'en-US' as const, label: 'EN' }
  ]
})
</script>

<style scoped>
.language-toggle {
  display: flex;
  gap: 0.5rem;
}

.language-btn {
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
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.language-btn::before {
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
}

.language-btn:hover::before {
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
}

.btn-left-border {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0.25rem;
  background-color: transparent;
  transition: all var(--transition-fast);
}

.language-btn:hover {
  background-color: var(--theme-bg-tertiary);
  border-color: var(--theme-accent-color);
  transform: translateX(0.125rem);
  box-shadow: 0 0 0.75rem var(--theme-shadow-accent);
}

.language-btn:hover .btn-left-border {
  background-color: var(--theme-accent-color);
  box-shadow: 0 0 0.5rem var(--theme-accent-color);
}

.language-btn.active {
  color: var(--theme-text-primary);
  border-color: var(--theme-accent-color);
  box-shadow: 0 0 1rem var(--theme-shadow-accent-hover);
  font-weight: 700;
}

.language-btn.active .btn-bg {
  background-color: var(--theme-text-primary);
  opacity: 0.1;
}

.language-btn.active .btn-left-border {
  background-color: var(--theme-text-primary);
  width: 0.375rem;
  box-shadow: none;
}

.language-btn.active::before {
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
  z-index: 1;
}

.btn-check-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--theme-text-primary);
  position: relative;
  z-index: 1;
  animation: checkMark 0.3s ease-out;
}

@keyframes checkMark {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-45deg);
  }
  50% {
    transform: scale(1.2) rotate(5deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}


</style>

