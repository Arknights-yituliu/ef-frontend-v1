<template>
  <LayoutDesertBackground />
  <v-app :theme="theme">
    <v-navigation-drawer class="navigation-drawer" v-model="drawer" :width="280">
      <LayoutSidebar />
    </v-navigation-drawer>

    <v-app-bar class="app-bar" :elevation="0">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title class="app-bar-title">{{ pageTitle }}</v-app-bar-title>
      <div class="header-decoration"></div>
      <div class="header-controls">
        <LayoutThemeToggle />
        <div class="control-divider"></div>
        <LayoutLanguageToggle />
      </div>
    </v-app-bar>

    <v-main>
      <div class="content-container">
        <slot></slot>
      </div>
      <LayoutFooter />
    </v-main>

    <!-- 回到顶部按钮 -->
    <v-fade-transition>
      <v-btn
        v-show="showBackToTop"
        class="back-to-top-btn"
        :color="theme === 'light' ? 'grey-lighten-3' : 'grey-darken-4'"
        icon="mdi-arrow-up"
        size="large"
        variant="flat"
        rounded="circle"
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

/** 边栏是否展开 */
const drawer = ref(null);

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
  border-bottom: 2px solid var(--theme-accent-color);
}

/* 小屏幕上隐藏标题 */
@media screen and (max-width: 640px) {
  .app-bar-title {
    opacity: 0;
  }
}

/* 左侧装饰条 */
.header-decoration {
  width: 0.375rem;
  height: 100%;
  background-color: var(--theme-accent-color);
  box-shadow: 0 0 0.5rem var(--theme-accent-color);
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

.content-container {
  max-width: 1600px;
  min-width: 50%;
  padding: 1rem;
  margin: auto;
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
</style>
