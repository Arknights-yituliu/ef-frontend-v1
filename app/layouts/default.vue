<template>
  <v-app :theme="theme">
    <LayoutCustomBackground />
    <!--  <AnnimationInitialLoader-->
    <!--    :is-loading="isInitialLoading"-->
    <!--    :loading-duration="loadingDuration"-->
    <!--    @complete="handleInitialLoaderComplete"-->
    <!--  />-->
    <v-navigation-drawer v-model="drawer" :width="280" class="navigation-drawer">
      <LayoutSidebar />
    </v-navigation-drawer>

    <v-app-bar :elevation="0" class="app-bar">
      <!-- 扫描线 SVG 动画 -->
      <svg class="header-scanline" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="scanline-gradient-default" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" style="stop-color: var(--theme-accent-color); stop-opacity: 0" />
            <stop offset="50%" style="stop-color: var(--theme-accent-color); stop-opacity: 0.3" />
            <stop offset="100%" style="stop-color: var(--theme-accent-color); stop-opacity: 0" />
          </linearGradient>
        </defs>
        <rect
          class="scanline-rect"
          fill="url(#scanline-gradient-default)"
          height="2"
          width="100"
          x="0"
          y="0"
        />
      </svg>

      <v-app-bar-nav-icon @click="() => (drawer = !drawer)" />
      <v-app-bar-title class="app-bar-title">{{ pageTitle }}</v-app-bar-title>
      <div class="header-controls">
        <LayoutThemeToggle />
        <div class="control-divider" />
        <LayoutLanguageToggle />
      </div>
    </v-app-bar>

    <v-main>
      <div class="main-wrapper">
        <main class="content-container">
          <slot />
        </main>
        <LayoutFooter class="footer" />
      </div>
    </v-main>

    <!-- 回到顶部按钮 -->
    <v-fade-transition>
      <v-btn
        v-show="showBackToTop"
        :color="theme === 'light' ? 'grey-lighten-3' : 'grey-darken-4'"
        class="back-to-top-btn"
        icon="mdi-arrow-up"
        rounded="circle"
        size="large"
        variant="flat"
        @click="scrollToTop"
      />
    </v-fade-transition>
  </v-app>
</template>

<script lang="ts" setup>
const route = useRoute();
const appConfig = useAppConfig();
const menuItems = appConfig.menu.routes;
const { t } = useI18n();
const { theme } = useTheme();
const siteName = t('layout.siteName');

// 初始动画加载器
const initialLoaderConfig = appConfig.initialLoader ?? {};
const isInitialLoading = ref(initialLoaderConfig.enabled !== false);
const loadingDuration =
  typeof initialLoaderConfig.loadingDuration === 'number'
    ? initialLoaderConfig.loadingDuration
    : 3000;
const handleInitialLoaderComplete = () => {
  isInitialLoading.value = false;
};

/** 边栏是否展开 */
const drawer = ref(true);

// 根据当前路由查找对应的页面名称
const pageTitle = computed(() => {
  for (const primaryItem of menuItems) {
    for (const secondaryItem of primaryItem.children) {
      if (secondaryItem.routePath === route.path && secondaryItem.nameKey) {
        return t(secondaryItem.nameKey);
      }
    }
  }
  // 返回默认标题
  return siteName;
});

// 动态设置页面标题
useHead(() => ({
  title: `${pageTitle.value} - ${siteName}`,
}));

// 回到顶部功能
const showBackToTop = ref(false);
const scrollThreshold = 300; // 滚动超过300px时显示按钮

const handleScroll = () => {
  showBackToTop.value = window.scrollY > scrollThreshold;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.navigation-drawer {
  border-right: 2px solid var(--theme-accent-color);
}

.app-bar {
  position: relative;
  border-bottom: 2px solid var(--theme-accent-color);
  overflow: hidden;
}

/* 小屏幕上隐藏标题 */
@media screen and (max-width: 600px) {
  .app-bar-title {
    opacity: 0;
  }
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0 1.5rem;
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

/* 包一个容器，使页面至少占满纵向空间 */
.main-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

/* 增加页面内边距，限制页面宽度 */
.content-container {
  width: 100%;
  max-width: 1600px;
  min-width: 50%; /** 最大 1600px，但是如果屏幕太大了，至少也要占满一半宽度 */
  padding: 2rem;
  margin: auto;
  flex: 1; /* 使页面至少占满纵向空间 */
}

/* 小屏幕上减少页面内边距 */
@media screen and (max-width: 600px) {
  .content-container {
    padding: 1rem;
  }
}

/* footer 不可以 flex-grow */
.footer {
  flex: 0;
}

/* 回到顶部按钮 */
.back-to-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
  box-shadow: 0 4px 12px var(--theme-shadow-accent-strong);
  transition: all var(--transition-base);
}

.back-to-top-btn:hover {
  box-shadow: 0 6px 16px var(--theme-shadow-accent-strong);
  transform: translateY(-2px);
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
</style>