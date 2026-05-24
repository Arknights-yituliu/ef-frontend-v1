<template>
  <aside class="sidebar">
    <!-- Logo 区域 -->
    <div class="logo-area" @click="navigateToHome">
      <img alt="Logo" class="logo-img" src="/android-chrome-512x512.png" />
      <div class="logo-text">{{ $t('layout.siteName') }}</div>
    </div>

    <!-- 菜单容器 -->
    <nav class="menu-container hide-scrollbar">
      <!-- 主页链接 -->
      <NuxtLink class="secondary-item home-link" :class="{ active: route.path === '/' }" to="/">
        <v-icon class="secondary-icon" size="20">mdi-home</v-icon>
        <span class="secondary-text">{{ $t('menu.home') }}</span>
      </NuxtLink>

      <!-- 菜单组 -->
      <div
        v-for="(primaryItem, primaryIndex) in menuItems.filter(isPrimaryItemVisible)"
        :key="`${primaryIndex}-${primaryItem.nameKey}`"
        class="menu-group"
      >
        <!-- 小标题 -->
        <div class="section-header">
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
            <v-icon v-if="secondaryItem.vuetifyIcon" class="secondary-icon" size="20">
              {{ secondaryItem.vuetifyIcon }}
            </v-icon>
            <svg
              v-else-if="secondaryItem.iconPath"
              class="secondary-icon"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                class="secondary-icon-path"
                :d="secondaryItem.iconPath"
                fill="currentColor"
                stroke="none"
              />
            </svg>
            <span class="secondary-text">{{ $t(`menu.${secondaryItem.i18nKey}`) }}</span>
            <!-- 跳转提示图标 -->
            <v-icon v-if="secondaryItem.external" class="jump-hint-icon" size="20">
              mdi-open-in-new
            </v-icon>
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
import { useNow } from '@vueuse/core';

// 菜单项类型
interface PrimaryMenuItem {
  i18nKey: string;
  nameKey: string;
  iconPath?: string;
  vuetifyIcon?: string;
  isDocs?: boolean;
  isHidden?: boolean;
  color?: string;
  children: SecondaryMenuItem[];
}

interface SecondaryMenuItem {
  i18nKey: string;
  nameKey: string;
  routePath: string;
  iconPath?: string;
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
  const activePath = route.path;
  // 遍历菜单项找到对应的颜色
  for (const primaryItem of menuItems) {
    const secondaryItem = primaryItem.children.find((item) => item.routePath === activePath);
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

function isActiveRoute(path: string) {
  return route.path === path;
}
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

/* Logo 区域 */
.logo-area {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  gap: 1rem;
  border-bottom: 2px solid var(--theme-accent-color);
  cursor: pointer;
  overflow: hidden;
}

.logo-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--sidebar-item-hover-bg);
  opacity: 0;
  transition: opacity var(--transition-base);
  z-index: 0;
}

.logo-area:hover::before {
  opacity: 1;
}

.logo-img {
  position: relative;
  width: 5rem;
  height: 5rem;
  object-fit: contain;
  transition: transform var(--transition-base);
  z-index: 1;
}

.logo-text {
  position: relative;
  font-size: var(--font-size-md);
  color: var(--theme-text-primary);
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  text-shadow: 0 0 0.5rem var(--theme-shadow-accent-hover);
  z-index: 1;
}

/* 菜单容器 */
.menu-container {
  position: relative;
}

.menu-group {
  border-bottom: 1px solid var(--theme-border);
}

/* 小标题样式 */
.section-header {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 2.5rem;
  padding: 0 1rem;
  background-color: var(--theme-bg-tertiary);
  font-size: calc(var(--font-size-sm) * 0.8);
  color: var(--theme-text-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.section-header .docs-indicator-icon {
  position: relative;
  width: 1rem;
  height: 1rem;
  color: var(--theme-text-secondary);
  opacity: 0.4;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.section-header-text {
  position: relative;
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
  gap: 0.75rem;
  height: 3.5rem;
  padding-left: 2.2rem;
  padding-right: 1rem;
  color: var(--theme-text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  overflow: hidden;
}

/* 左侧装饰条 */
.item-decoration-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0.25rem;
  transition:
    width var(--transition-base),
    box-shadow var(--transition-base),
    background-color var(--transition-base),
    opacity var(--transition-base);
  opacity: 0.6;
}

/* 左侧发光条（激活时显示） */
.secondary-item.active::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, v-bind(currentActiveColor) 0%, transparent 100%);
  opacity: 0.1;
}

.secondary-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--sidebar-item-hover-bg);
  opacity: 0;
  transition: opacity var(--transition-base);
  z-index: 0;
}

.secondary-item:hover::before {
  opacity: 1;
}

.secondary-item:hover {
  color: var(--theme-text-primary);
}

.secondary-item.active {
  color: var(--theme-text-primary);
  font-weight: 600;
  box-shadow:
    inset 0 0 0.5rem color-mix(in srgb, v-bind(currentActiveColor), transparent 90%),
    inset 1px 0 0 color-mix(in srgb, v-bind(currentActiveColor), transparent 80%);
}

.secondary-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--theme-text-secondary);
  z-index: 1;
}

.secondary-icon-path {
  fill: currentColor;
  stroke: none;
}

.secondary-item:hover .secondary-icon,
.secondary-item.active .secondary-icon {
  color: var(--theme-text-primary);
}

.secondary-text {
  position: relative;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 0.5rem;
  z-index: 1;
}

.jump-hint-icon {
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
  position: relative;
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
