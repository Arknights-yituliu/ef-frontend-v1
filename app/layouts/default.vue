<template>
  <v-app :theme="theme">
    <LayoutCustomBackground />
    <!--  <AnnimationInitialLoader-->
    <!--    :is-loading="isInitialLoading"-->
    <!--    :loading-duration="loadingDuration"-->
    <!--    @complete="handleInitialLoaderComplete"-->
    <!--  />-->
    <v-navigation-drawer v-model="drawer" class="navigation-drawer" :width="280">
      <!-- 在侧边栏外面包一层，用于添加滚动条的 css -->
      <div class="sidebar-scroll-wrapper">
        <LayoutSidebar />
      </div>
    </v-navigation-drawer>

    <v-app-bar class="app-bar" :elevation="0">
      <v-app-bar-nav-icon @click="() => (drawer = !drawer)" />
      <v-app-bar-title class="app-bar-title">{{ pageTitle }}</v-app-bar-title>
      <div class="header-controls">
        <LayoutFeedbackToggle @click="isFeedbackOpen = true" />
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
        class="back-to-top-btn"
        :color="theme === 'light' ? 'grey-lighten-3' : 'grey-darken-4'"
        icon="mdi-arrow-up"
        rounded="circle"
        size="large"
        variant="flat"
        @click="scrollToTop"
      />
    </v-fade-transition>
    <LayoutFeedbackModal v-model="isFeedbackOpen" />
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
function handleInitialLoaderComplete() {
  isInitialLoading.value = false;
}

/** 边栏是否展开 */
const drawer = ref(true);

/** 反馈组件是否打开 */
const isFeedbackOpen = ref(false);

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

function handleScroll() {
  showBackToTop.value = window.scrollY > scrollThreshold;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

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

.sidebar-scroll-wrapper {
  height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
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
  position: relative; /* 为了让 CustomBackground 的图层正确 */
}

/* 增加页面内边距，限制页面宽度 */
.content-container {
  flex: 1; /* 使页面至少占满纵向空间 */
}

/* 小屏幕上减少页面内边距 */
@media screen and (max-width: 600px) {
  .content-container {
    padding: 0.5rem;
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

/* Vuetify样式覆盖 */
:deep(.v-application) {
  background-color: transparent;
}
</style>
