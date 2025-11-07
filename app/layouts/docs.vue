<template>
  <div class="docs-layout">
    <!-- 顶部导航栏 -->
    <header class="docs-header">
      <!-- 装饰背景 -->
      <div class="header-bg-decorator"></div>
      
      <!-- 左侧装饰条 -->
      <div class="header-left-decoration"></div>

      <!-- 文档站标题 -->
      <div class="header-title">
        <span class="title-emblem"></span>
        <span class="title-text">{{ $t('docs.siteTitle') }}</span>
      </div>
      
      <!-- 扫描线 SVG 动画 -->
      <svg class="header-scanline" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="scanline-gradient-docs" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" style="stop-color: var(--theme-accent-color); stop-opacity: 0"/>
            <stop offset="50%" style="stop-color: var(--theme-accent-color); stop-opacity: 0.3"/>
            <stop offset="100%" style="stop-color: var(--theme-accent-color); stop-opacity: 0"/>
          </linearGradient>
        </defs>
        <rect class="scanline-rect" fill="url(#scanline-gradient-docs)" height="2" width="100" x="0" y="0"/>
      </svg>

      <!-- 移动端菜单按钮（左侧） -->
      <button
        class="mobile-menu-button mobile-menu-left"
        :class="{ active: isSidebarOpen }"
        @click="toggleSidebar"
        :aria-label="$t('docs.toggleSidebar')"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- 移动端菜单按钮（右侧） -->
      <button
        class="mobile-menu-button mobile-menu-right"
        :class="{ active: isTocOpen }"
        @click="toggleToc"
        :aria-label="$t('docs.toggleToc')"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6h16M4 12h12M4 18h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- 控制按钮区域 -->
      <div class="header-controls">
        <LayoutThemeToggle/>
        <div class="control-divider"></div>
        <LayoutLanguageToggle/>
      </div>
    </header>

    <!-- 遮罩层 -->
    <div
      v-if="isSidebarOpen || isTocOpen"
      class="overlay"
      @click="closeAll"
    ></div>

    <!-- 左侧文档目录 -->
    <DocsSidebar 
      :is-open="isSidebarOpen"
      @close="closeSidebar"
    />

    <!-- 右侧文档TOC -->
    <DocsToc 
      :headings="headings"
      :is-open="isTocOpen"
      @close="closeToc"
    />

    <!-- 主内容区域 -->
    <main class="docs-main" :class="{ 'sidebar-collapsed': false, 'toc-collapsed': false }">
      <div class="docs-content">
        <slot />
      </div>
    </main>

    <!-- 底部页脚 -->
    <LayoutFooter class="docs-footer" />
  </div>
</template>

<script setup lang="ts">
// 侧边栏和TOC状态
const isSidebarOpen = ref(false)
const isTocOpen = ref(false)

// 文档标题列表（由页面组件传入）
const headings = ref<Array<{ id: string; text: string; depth: number }>>([])

// 提供给页面组件设置标题的方法
const setHeadings = (newHeadings: Array<{ id: string; text: string; depth: number }>) => {
  headings.value = newHeadings
}

// 提供到页面组件
provide('setDocHeadings', setHeadings)

// 切换侧边栏
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  if (isSidebarOpen.value) {
    isTocOpen.value = false
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// 切换TOC
const toggleToc = () => {
  isTocOpen.value = !isTocOpen.value
  if (isTocOpen.value) {
    isSidebarOpen.value = false
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// 关闭侧边栏
const closeSidebar = () => {
  isSidebarOpen.value = false
  document.body.style.overflow = ''
}

// 关闭TOC
const closeToc = () => {
  isTocOpen.value = false
  document.body.style.overflow = ''
}

// 关闭所有
const closeAll = () => {
  isSidebarOpen.value = false
  isTocOpen.value = false
  document.body.style.overflow = ''
}

// 监听窗口大小变化
let resizeHandler: (() => void) | null = null

onMounted(() => {
  resizeHandler = () => {
    if (window.innerWidth > 768) {
      closeAll()
    }
  }
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
  document.body.style.overflow = ''
})
</script>

<style scoped>
.docs-layout {
  min-height: 100vh;
  background-color: var(--theme-bg-primary);
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 顶部导航栏 */
.docs-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4.5rem;
  background-color: var(--theme-bg-secondary);
  border-bottom: 2px solid var(--theme-accent-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem 0 3rem;
  z-index: 50;
  transition: all var(--transition-base);
  overflow: hidden;
}

.header-title {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: var(--font-size-sm);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--theme-text-primary);
  font-weight: 700;
  padding-left: 1.5rem;
  z-index: 2;
}

.title-emblem {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 2.5rem;
  background: linear-gradient(
    180deg,
    var(--theme-accent-color) 0%,
    transparent 70%
  );
  border-radius: 0.125rem;
  box-shadow: 0 0 0.5rem var(--theme-shadow-accent);
  opacity: 0.85;
}

.title-text {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.title-text::after {
  content: '';
  display: block;
  width: 2.5rem;
  height: 0.25rem;
  margin-left: 0.75rem;
  background: linear-gradient(
    to right,
    var(--theme-accent-color),
    transparent
  );
  border-radius: 0.125rem;
  opacity: 0.6;
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

/* 移动端菜单按钮 */
.mobile-menu-button {
  display: none;
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--theme-bg-secondary);
  border: 2px solid var(--theme-accent-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  box-shadow: 0 0 0.5rem var(--theme-shadow-accent);
  z-index: 2;
}

.mobile-menu-button:hover {
  background-color: var(--theme-bg-tertiary);
  box-shadow: 0 0 0.75rem var(--theme-accent-color);
}

.mobile-menu-button.active {
  background-color: var(--theme-accent-color);
}

.mobile-menu-button svg {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--theme-text-primary);
}

.mobile-menu-left {
  position: fixed;
  top: 1rem;
  left: 1rem;
}

.mobile-menu-right {
  position: fixed;
  top: 1rem;
  right: 1rem;
}

/* 控制按钮区域 */
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

/* 遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 30;
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

/* 主内容区域 */
.docs-main {
  margin-top: 4.5rem;
  margin-left: 18rem;
  margin-right: 15rem;
  min-height: calc(100vh - 4.5rem);
  padding: 3rem 4rem;
  transition: all var(--transition-base);
  position: relative;
}

.docs-content {
  max-width: 50rem;
  margin: 0 auto;
}

/* 底部页脚 */
.docs-footer {
  margin-left: 18rem;
  margin-right: 15rem;
  transition: margin var(--transition-base);
}

/* 响应式 - 移动端 */
@media (max-width: 768px) {
  .docs-header {
    padding: 0 5rem;
  }

  .header-title {
    display: none;
  }
  
  .mobile-menu-button {
    display: flex;
  }
  
  .header-left-decoration {
    display: none;
  }
  
  .docs-main {
    margin-left: 0;
    margin-right: 0;
    padding: 2rem 1.5rem;
  }
  
  .docs-footer {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>