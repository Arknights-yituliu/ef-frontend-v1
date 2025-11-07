<template>
  <button
    class="theme-toggle"
    @click="toggleTheme"
    :aria-label="$t('layout.theme')"
  >
    <div class="toggle-bg"></div>
    <svg 
      class="theme-icon" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
      :class="{ dark: theme === 'dark' }"
    >
      <!-- 太阳图标 -->
      <g v-if="theme === 'light'" class="sun-icon">
        <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5" fill="none" />
        <line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <line x1="12" y1="20" x2="12" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <line x1="22" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <line x1="4" y1="12" x2="2" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <line x1="18.364" y1="5.636" x2="17.657" y2="6.343" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <line x1="6.343" y1="17.657" x2="5.636" y2="18.364" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <line x1="18.364" y1="18.364" x2="17.657" y2="17.657" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <line x1="6.343" y1="6.343" x2="5.636" y2="5.636" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </g>
      <!-- 月亮图标 -->
      <g v-else class="moon-icon">
        <path 
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
          stroke="currentColor" 
          stroke-width="1.5" 
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle cx="17" cy="7" r="1" fill="currentColor" opacity="0.6" />
      </g>
    </svg>
    <div class="toggle-glow"></div>
  </button>
</template>

<script setup lang="ts">
const { theme, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--theme-border);
  background-color: var(--theme-bg-secondary);
  color: var(--theme-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 0.5rem var(--theme-shadow-base);
}

.theme-toggle::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 0.375rem;
  height: 100%;
  background-color: transparent;
  transition: all var(--transition-base);
}

.theme-toggle:hover {
  border-color: var(--theme-accent-color);
  transform: scale(1.05);
  box-shadow: 0 0 1rem var(--theme-shadow-accent-strong);
}

.theme-toggle:hover::before {
  background-color: var(--theme-accent-color);
  box-shadow: 0 0 0.5rem var(--theme-accent-color);
}

.toggle-bg {
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

.theme-toggle:hover .toggle-bg {
  opacity: 1;
}

.theme-icon {
  width: 1.5rem;
  height: 1.5rem;
  position: relative;
  z-index: 1;
  transition: all var(--transition-base);
}

.theme-toggle:hover .theme-icon {
  color: var(--theme-text-primary);
  filter: drop-shadow(0 0 0.25rem var(--theme-accent-color));
}

.theme-icon.dark {
  animation: moonRotate 0.6s ease-in-out;
}

@keyframes moonRotate {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.2);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.sun-icon {
  animation: sunRotate 0.6s ease-in-out;
}

@keyframes sunRotate {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(-180deg) scale(1.2);
  }
  100% {
    transform: rotate(-360deg) scale(1);
  }
}

.toggle-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-radius: 50%;
  background: radial-gradient(circle, var(--theme-shadow-accent-strong) 0%, transparent 70%);
  transition: all var(--transition-base);
  pointer-events: none;
}

.theme-toggle:active .toggle-glow {
  width: 4rem;
  height: 4rem;
}


</style>

