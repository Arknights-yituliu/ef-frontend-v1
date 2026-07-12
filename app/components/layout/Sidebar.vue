<template>
  <aside class="sidebar">
    <!-- Logo 区域 -->
    <div class="logo-area" @click="navigateToHome">
      <img alt="Logo" class="logo-img" src="/android-chrome-512x512.png" />
      <div class="logo-text">{{ $t('layout.siteName') }}</div>
    </div>

    <!-- 菜单容器 -->
    <nav class="menu-container">
      <!-- 菜单组 -->
      <div
        v-for="(primaryItem, primaryIndex) in menuItems.filter(isPrimaryItemVisible)"
        :key="`${primaryIndex}-${primaryItem.nameKey}`"
        class="menu-group"
      >
        <!-- 小标题 -->
        <div v-if="!primaryItem.hideHeader" class="section-header">
          <!-- isDocs 标识图标 -->
          <v-icon v-if="primaryItem.isDocs" class="docs-indicator-icon" size="16">
            mdi-book
          </v-icon>
          <span class="section-header-text">{{ $t(`menu.${primaryItem.i18nKey}`) }}</span>
        </div>

        <!-- 二级菜单 -->
        <div class="secondary-items">
          <NuxtLink
            v-for="(secondaryItem, secondaryIndex) in primaryItem.children.filter(
              isSecondaryItemVisible,
            )"
            :key="`${secondaryIndex}-${secondaryItem.nameKey}`"
            class="secondary-item"
            :class="{ active: isActiveRoute(secondaryItem.routePath) }"
            :rel="secondaryItem.external ? 'noopener noreferrer' : undefined"
            :target="secondaryItem.external ? '_blank' : undefined"
            :to="secondaryItem.routePath"
          >
            <!-- 左侧装饰条 -->
            <div
              class="item-decoration-bar"
              :style="{ backgroundColor: getPrimaryItemColor(primaryItem) }"
            />
            <!-- 二级菜单图标 -->
            <v-icon v-if="secondaryItem.vuetifyIcon" class="secondary-icon">
              {{ secondaryItem.vuetifyIcon }}
            </v-icon>
            <span class="secondary-text">{{ $t(`menu.${secondaryItem.i18nKey}`) }}</span>
            <!-- 跳转提示图标 -->
            <v-icon v-if="secondaryItem.external" class="jump-hint-icon" icon="mdi-open-in-new" />
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- 底部装饰 -->
    <div class="sidebar-footer">
      <div class="footer-decorator" />
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { useNow, useWindowSize } from '@vueuse/core';

// 菜单项类型
interface PrimaryMenuItem {
  i18nKey: string;
  nameKey: string;
  vuetifyIcon?: string;
  isDocs?: boolean;
  isHidden?: boolean;
  hideHeader?: boolean;
  color?: string;
  children: SecondaryMenuItem[];
}

interface SecondaryMenuItem {
  i18nKey: string;
  nameKey: string;
  routePath: string;
  vuetifyIcon?: string;
  isHidden?: boolean;
  isDocs?: boolean;
  visibleBefore?: string;
  external?: boolean;
}

const route = useRoute();
const router = useRouter();

// 引入每秒更新一次的响应式时间，用于页面过期判断
const now = useNow({ interval: 1000 });

// 获取路由配置
const appConfig = useAppConfig();
const menuItems = appConfig.menu.routes as PrimaryMenuItem[];

// 根据视口宽度计算侧边栏缩放比例（360px → 0.75, 1200px → 1.0）
const { width: windowWidth } = useWindowSize();
const sidebarScale = computed(() => {
  const scale = 0.75 + ((windowWidth.value - 360) * 0.25) / 840;
  return Math.min(1, Math.max(0.75, scale));
});

/**
 * 判断一级菜单项是否可见
 */
function isPrimaryItemVisible(item: PrimaryMenuItem): boolean {
  if (item.isHidden) {
    return false;
  }

  // 如果一级菜单下没有任何可见的二级菜单，则一级菜单也不可见
  const hasVisibleSecondary = item.children.some((item) => isSecondaryItemVisible(item));
  return hasVisibleSecondary;
}

/**
 * 判断二级菜单项是否可见
 */
function isSecondaryItemVisible(item: SecondaryMenuItem): boolean {
  if (item.isHidden) {
    return false;
  }

  if (item.visibleBefore) {
    const expiryDate = new Date(item.visibleBefore);
    if (Number.isNaN(expiryDate.getTime())) {
      console.warn(`Invalid date format for visibleBefore: ${item.visibleBefore}`);
      return true; // 如果日期格式无效，默认显示
    }
    return expiryDate > now.value;
  }

  return true;
}

const defaultPrimaryColor = '#000000';

// 获取一级菜单的主题颜色
function getPrimaryItemColor(item: PrimaryMenuItem): string {
  return item.color || defaultPrimaryColor;
}

// 获取当前激活项对应的颜色
const currentActiveColor = computed<string>(() => {
  // 遍历菜单项找到对应的颜色
  for (const primaryItem of menuItems) {
    const secondaryItem = primaryItem.children.find((item) => isActiveRoute(item.routePath));
    if (secondaryItem) {
      return getPrimaryItemColor(primaryItem);
    }
  }
  return defaultPrimaryColor;
});

// 点击 Logo 跳转到首页
function navigateToHome() {
  if (route.path !== '/') {
    router.push('/');
  }
}

function normalizePath(path: string): string {
  if (!path) {
    return '/';
  }
  // 移除末尾的斜杠（如果有）
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  return path;
}

function isActiveRoute(path: string) {
  return normalizePath(route.path) === normalizePath(path);
}
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
}

/* Logo 区域 */
.logo-area {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: calc(1rem * v-bind(sidebarScale)) 0;
  gap: calc(1rem * v-bind(sidebarScale));
  border-bottom: 2px solid var(--theme-accent-color);
  cursor: pointer;
  overflow: hidden;
  transition: background-color var(--transition-base);
}

.logo-area:hover {
  background-color: var(--sidebar-item-hover-bg);
}

.logo-img {
  width: calc(5rem * v-bind(sidebarScale));
  height: calc(5rem * v-bind(sidebarScale));
  object-fit: contain;
}

.logo-text {
  font-size: calc(var(--font-size-md) * v-bind(sidebarScale));
  color: var(--theme-text-primary);
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  text-shadow: 0 0 calc(0.5rem * v-bind(sidebarScale)) var(--theme-shadow-accent-hover);
}

/* 菜单容器 */
.menu-group {
  border-bottom: 1px solid var(--theme-border);
}

/* 小标题样式 */
.section-header {
  display: flex;
  align-items: center;
  min-height: calc(2.5rem * v-bind(sidebarScale));
  padding: 0 calc(1rem * v-bind(sidebarScale));
  background-color: var(--theme-bg-tertiary);
  font-size: calc(var(--font-size-sm) * 0.8 * v-bind(sidebarScale));
  color: var(--theme-text-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.section-header .docs-indicator-icon {
  width: 1rem;
  height: 1rem;
  color: var(--theme-text-secondary);
  opacity: 0.4;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.section-header-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.secondary-items {
  overflow: hidden;
}

.secondary-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: calc(0.75rem * v-bind(sidebarScale));
  height: calc(3.5rem * v-bind(sidebarScale));
  padding-left: calc(2.2rem * v-bind(sidebarScale));
  padding-right: calc(1rem * v-bind(sidebarScale));
  color: var(--theme-text-secondary);
  text-decoration: none;
  font-size: calc(var(--font-size-sm) * v-bind(sidebarScale));
  overflow: hidden;
  transition: background-color var(--transition-base);
}

.secondary-item:hover {
  background-color: var(--sidebar-item-hover-bg);
  color: var(--theme-text-primary);
}

/* 左侧装饰条 */
.item-decoration-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0.25rem;
  opacity: 0.6;
}

/* 左侧发光条（激活时显示） */
.secondary-item.active::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, v-bind('currentActiveColor') 0%, transparent 100%);
  opacity: 0.1;
}

.secondary-item.active {
  color: var(--theme-text-primary);
  font-weight: 600;
  box-shadow:
    inset 0 0 0.5rem color-mix(in srgb, v-bind('currentActiveColor'), transparent 90%),
    inset 1px 0 0 color-mix(in srgb, v-bind('currentActiveColor'), transparent 80%);
}

.secondary-icon {
  font-size: 1.2em;
}

.secondary-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: calc(0.5rem * v-bind(sidebarScale));
}

.jump-hint-icon {
  font-size: 1.2em;
  opacity: 0.5;
  transition: opacity var(--transition-base);
}

.secondary-item:hover .jump-hint-icon {
  opacity: 1;
}

/* 底部装饰 */
.sidebar-footer {
  margin-top: auto;
  padding: 1rem;
}

.footer-decorator {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(128, 128, 128, 0.5) 20%,
    rgba(128, 128, 128, 0.5) 80%,
    transparent 100%
  );
  opacity: 0.5;
}
</style>
