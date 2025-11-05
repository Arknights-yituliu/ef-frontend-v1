<template>
  <div class="layout-container">
    <header class="app-header">
      <!-- 装饰背景 -->
      <div class="header-bg-decorator"></div>
      
      <!-- 左侧装饰条 -->
      <div class="header-left-decoration"></div>
      
      <!-- 扫描线 SVG 动画 -->
      <svg class="header-scanline" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="scanline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color: var(--theme-accent-color); stop-opacity: 0" />
            <stop offset="50%" style="stop-color: var(--theme-accent-color); stop-opacity: 0.3" />
            <stop offset="100%" style="stop-color: var(--theme-accent-color); stop-opacity: 0" />
          </linearGradient>
        </defs>
        <rect class="scanline-rect" x="0" y="0" width="100" height="2" fill="url(#scanline-gradient)" />
      </svg>
      
      <!-- 汉堡包菜单按钮（小屏幕显示） -->
      <button 
        class="hamburger-button"
        :class="{ active: isDrawerOpen }"
        @click="toggleDrawer"
        aria-label="菜单"
      >
        <svg class="hamburger-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path 
            class="hamburger-line hamburger-line-top"
            d="M3 6h18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path 
            class="hamburger-line hamburger-line-middle"
            d="M3 12h18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path 
            class="hamburger-line hamburger-line-bottom"
            d="M3 18h18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
      
      <!-- 控制按钮区域 -->
      <div class="header-controls">
        <ThemeToggle />
        <div class="control-divider"></div>
        <LanguageToggle />
      </div>
    </header>
    <!-- 抽屉遮罩层 -->
    <div 
      v-if="isDrawerOpen"
      class="drawer-overlay"
      @click="closeDrawer"
    ></div>
    <div class="layout-content">
      <Sidebar :is-drawer-open="isDrawerOpen" @close-drawer="closeDrawer" />
      <main class="main-content">
        <slot />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
// 布局组件 - 主题初始化在 useTheme composable 中处理

const isDrawerOpen = ref(false)

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
  // 防止背景滚动
  if (isDrawerOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeDrawer = () => {
  isDrawerOpen.value = false
  document.body.style.overflow = ''
}

// 监听窗口大小变化，自动关闭抽屉
let resizeHandler: (() => void) | null = null

onMounted(() => {
  resizeHandler = () => {
    if (window.innerWidth > 768 && isDrawerOpen.value) {
      closeDrawer()
    }
  }
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
  // 清理body样式
  document.body.style.overflow = ''
})
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  background-color: var(--theme-bg-primary);
  display: flex;
  flex-direction: column;
  position: relative;
}

.app-header {
  position: fixed;
  top: 0;
  right: 0;
  height: 4.5rem;
  background-color: var(--theme-bg-secondary);
  border-bottom: 2px solid var(--theme-accent-color);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 2rem;
  z-index: 50;
  transition: all var(--transition-base);
  box-sizing: border-box;
  overflow: hidden;
}

/* 装饰背景 - 斜条纹 */
.header-bg-decorator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
    -45deg,
    transparent,
    transparent 13.9512529279%,
    var(--theme-decorative-overlay-medium) 0,
    var(--theme-decorative-overlay-medium) 36.0487470721%,
    transparent 0,
    transparent 63.9512529279%,
    var(--theme-decorative-overlay-medium) 0,
    var(--theme-decorative-overlay-medium) 86.0487470721%,
    transparent 0,
    transparent
  );
  background-size: 0.5rem 0.5rem;
  opacity: 0.5;
  pointer-events: none;
}

/* 左侧装饰条 */
.header-left-decoration {
  position: absolute;
  left: 0;
  top: 0;
  width: 0.375rem;
  height: 100%;
  background-color: var(--theme-accent-color);
  opacity: 0.8;
  box-shadow: 0 0 0.5rem var(--theme-accent-color);
}

.header-left-decoration::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    -45deg,
    transparent,
    transparent 13.9512529279%,
    var(--theme-decorative-overlay-strong) 0,
    var(--theme-decorative-overlay-strong) 36.0487470721%,
    transparent 0,
    transparent 63.9512529279%,
    var(--theme-decorative-overlay-strong) 0,
    var(--theme-decorative-overlay-strong) 86.0487470721%,
    transparent 0,
    transparent
  );
  background-size: 0.5rem 0.5rem;
}

/* SVG 扫描线动画 */
.header-scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: visible;
}

.scanline-rect {
  animation: scanlineMove 3s ease-in-out infinite;
  transform-origin: center;
}

@keyframes scanlineMove {
  0% {
    y: -2;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    y: 100;
    opacity: 0;
  }
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  position: relative;
  z-index: 2;
}

.control-divider {
  width: 1px;
  height: 2rem;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--theme-accent-color) 20%,
    var(--theme-accent-color) 80%,
    transparent 100%
  );
  opacity: 0.5;
}

.layout-content {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 4.5rem);
}

.main-content {
  flex: 1;
  padding: 2.5rem 3.75rem;
  margin-top: 1.2rem;
  background-color: var(--theme-bg-primary);
  transition: all var(--transition-base);
}



/* 汉堡包按钮 */
.hamburger-button {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--theme-bg-secondary);
  border: 2px solid var(--theme-accent-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  z-index: 200;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  box-shadow: 0 0 0.5rem var(--theme-shadow-accent-strong);
}

.hamburger-button:hover {
  background-color: var(--theme-bg-tertiary);
  box-shadow: 0 0 0.75rem var(--theme-accent-color);
}

.hamburger-button.active {
  background-color: var(--theme-accent-color);
}



.hamburger-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--theme-text-primary);
  transition: all var(--transition-base);
  flex-shrink: 0;
}

.hamburger-button.active .hamburger-icon {
  color: var(--theme-text-primary);
}

.hamburger-line {
  transition: all var(--transition-base);
  transform-origin: center;
}

.hamburger-button.active .hamburger-line-top {
  transform: translateY(6px) rotate(45deg);
}

.hamburger-button.active .hamburger-line-middle {
  opacity: 0;
}

.hamburger-button.active .hamburger-line-bottom {
  transform: translateY(-6px) rotate(-45deg);
}

/* 抽屉遮罩层 */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 150;
  animation: fadeIn var(--transition-base);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 小屏幕响应式 */
@media (max-width: 768px) {
  .hamburger-button {
    display: flex;
  }
  
  .app-header {
    left: 0;
    border-left: none;
    padding-left: 5rem; /* 为汉堡包按钮留出空间 */
    width: 100%;
    right: 0;
  }
  
  .header-left-decoration {
    display: none;
  }
  
  .layout-content {
    position: relative;
    width: 100%;
    /* 侧边栏使用fixed定位，已脱离文档流，不会影响flex布局 */
  }
  
  .main-content {
    margin-left: 0 !important;
    padding: 1.5rem;
    width: 100%;
    flex: 1;
  }
  
  /* 侧边栏在小屏幕下默认隐藏（通过Sidebar组件内部样式控制） */
}

/* 超小屏幕适配 */
@media (max-width: 480px) {
  .app-header {
    padding-left: 4rem; /* 减小padding以适应更小的汉堡包按钮 */
  }
}

@media (orientation: portrait) {
  .app-header {
    left: 0;
    border-left: none;
  }
  
  .header-left-decoration {
    display: none;
  }
  
  .main-content {
    margin-left: 0;
    padding: 1.5rem;
  }
}
</style>

