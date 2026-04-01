<template>
  <button :aria-label="$t('layout.theme')" class="feedback-btn">
    <div class="toggle-bg" />
    <v-icon class="theme-icon" icon="mdi-comment-multiple-outline" />
    <div class="toggle-glow" />
  </button>
</template>

<style scoped>
.feedback-btn {
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

.feedback-btn::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 0.375rem;
  height: 100%;
  background-color: transparent;
  transition: all var(--transition-base);
}

.feedback-btn:hover {
  border-color: var(--theme-accent-color);
  transform: scale(1.05);
  box-shadow: 0 0 1rem var(--theme-shadow-accent-strong);
}

.feedback-btn:hover::before {
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

.feedback-btn:hover .toggle-bg {
  opacity: 1;
}

.theme-icon {
  font-size: 1.25rem;
  position: relative;
  z-index: 1;
  transition: all var(--transition-base);
}

.feedback-btn:hover .theme-icon {
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

.feedback-btn:active .toggle-glow {
  width: 4rem;
  height: 4rem;
}
</style>
