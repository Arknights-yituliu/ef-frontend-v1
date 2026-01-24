<template>
  <aside class="sidebar">
    <!-- Logo 区域 -->
    <div class="logo-area" @click="navigateToHome">
      <img class="logo-img" src="/android-chrome-512x512.png" alt="Logo" />
      <div class="logo-text">{{ $t('layout.siteName') }}</div>
    </div>

    <!-- 菜单容器（用于高亮区域的定位） -->
    <nav ref="menuContainerRef" class="menu-container hide-scrollbar">
      <!-- 主页链接 -->
      <NuxtLink :class="{ active: route.path === '/' }" to="/" class="secondary-item home-link">
        <v-icon class="secondary-icon" size="20">mdi-home</v-icon>
        <span class="secondary-text">{{ $t('menu.home') }}</span>
      </NuxtLink>

      <!-- 菜单组 -->
      <div v-for="(primaryItem, primaryIndex) in menuItems" :key="primaryIndex" class="menu-group">
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
            v-for="(secondaryItem, secondaryIndex) in primaryItem.children.filter(item => !item.isHidden)"
            :key="secondaryIndex"
            :ref="
              (el) => setSecondaryItemRef(el, primaryIndex, secondaryIndex, secondaryItem.routePath)
            "
            :class="{ active: isActiveRoute(secondaryItem.routePath) }"
            :style="{ '--item-color': getSectionColor(primaryItem.i18nKey) }"
            :to="secondaryItem.routePath"
            class="secondary-item"
            @mouseenter="handleSecondaryHover(secondaryItem.routePath, $event)"
            @mouseleave="handleSecondaryLeave(secondaryItem.routePath)"
          >
            <!-- 左侧装饰条 -->
            <div class="item-decoration-bar" />
            <!-- 二级菜单图标 -->
            <v-icon
              v-if="secondaryItem.vuetifyIcon"
              :ref="(el) => setSecondaryIconRef(el, secondaryItem.routePath)"
              class="secondary-icon"
              size="20"
            >
              {{ secondaryItem.vuetifyIcon }}
            </v-icon>
            <svg
              v-else-if="secondaryItem.iconPath"
              :ref="(el) => setSecondaryIconRef(el, secondaryItem.routePath)"
              class="secondary-icon"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                :d="secondaryItem.iconPath"
                class="secondary-icon-path"
                fill="currentColor"
                stroke="none"
              />
            </svg>
            <span class="secondary-text">{{ $t(`menu.${secondaryItem.i18nKey}`) }}</span>
          </NuxtLink>
        </div>
      </div>

      <!-- 二级菜单高亮区域 -->
      <div
        :style="{
          transform: `translateY(${secondaryHighlightTop}px)`,
          height: `${secondaryHighlightHeight}px`,
          opacity: secondaryHighlightHeight > 0 ? 1 : 0,
        }"
        class="secondary-highlight"
      />
    </nav>

    <!-- 底部装饰 -->
    <div class="sidebar-footer">
      <div class="footer-decorator" />
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { gsap } from 'gsap';

// 菜单项类型
interface SecondaryMenuItem {
  i18nKey: string;
  nameKey: string;
  routePath: string;
  iconPath?: string;
  vuetifyIcon?: string;
}

interface PrimaryMenuItem {
  i18nKey: string;
  nameKey: string;
  iconPath?: string;
  vuetifyIcon?: string;
  isDocs?: boolean;
  children: SecondaryMenuItem[];
}

const route = useRoute();
const router = useRouter();

// 获取路由配置
const appConfig = useAppConfig();
const menuItems = appConfig.menu.routes as PrimaryMenuItem[];

// 定义 CMYK 四色
const cmykColors = {
  cyan: '#00FFFF',   // 青色 (Cyan)
  magenta: '#FF00FF', // 洋红色 (Magenta)
  yellow: '#FFFF00',  // 黄色 (Yellow)
  key: '#000000',    // 黑色 (Key)
};

// 定义section到CMYK颜色的映射
const sectionColors = {
  materialProfit: cmykColors.cyan,    // 青色 - 材料收益
  tools: cmykColors.magenta,        // 洋红色 - 一图流工具箱
  resources: cmykColors.yellow,        // 黄色 - 资源下载
  others: cmykColors.key,             // 黑色 - 其它（包括开发指南、功能操作指南）
};

// 获取section对应的颜色
const getSectionColor = (i18nKey: string) => {
  if (sectionColors[i18nKey as keyof typeof sectionColors]) {
    return sectionColors[i18nKey as keyof typeof sectionColors];
  }
  return cmykColors.key; // 默认返回黑色
};

// 点击 Logo 跳转到首页
const navigateToHome = () => {
  if (route.path !== '/') {
    router.push('/');
  }
};

// 菜单项 ref 存储
const secondaryItemRefs = ref<Map<string, HTMLElement>>(new Map());
const secondaryIconRefs = ref<Map<string, HTMLElement | SVGSVGElement>>(new Map());
const menuContainerRef = ref<HTMLElement | null>(null);

// 旋转动画相关的 ref
const activeRotateAnimations = ref<Map<string, gsap.core.Tween>>(new Map());

// 二级菜单高亮位置
const secondaryHighlightTop = ref(0);
const secondaryHighlightHeight = ref(0);

// 设置二级菜单项 ref
const setSecondaryItemRef = (
  el: any,
  primaryIndex: number,
  secondaryIndex: number,
  path: string,
) => {
  if (el) {
    secondaryItemRefs.value.set(path, el);
  } else {
    secondaryItemRefs.value.delete(path);
  }
};

// 设置二级菜单图标 ref
const setSecondaryIconRef = (el: any, path: string) => {
  if (el) {
    secondaryIconRefs.value.set(path, el);
  } else {
    secondaryIconRefs.value.delete(path);
  }
};

// 计算元素相对于容器的位置
const getRelativeTop = (element: HTMLElement, container: HTMLElement): number => {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return elementRect.top - containerRect.top;
};

// 更新二级菜单高亮位置
const updateSecondaryHighlight = () => {
  nextTick(() => {
    const activePath = route.path;
    const activeSecondaryRef = secondaryItemRefs.value.get(activePath);
    const menuContainerEl = menuContainerRef.value;

    // 获取实际的 DOM 元素
    const activeSecondaryEl = getDOMElement(activeSecondaryRef);

    if (activeSecondaryEl && menuContainerEl) {
      secondaryHighlightTop.value = getRelativeTop(activeSecondaryEl, menuContainerEl);
      secondaryHighlightHeight.value = activeSecondaryEl.offsetHeight;
    } else {
      secondaryHighlightHeight.value = 0;
    }
  });
};

const isActiveRoute = (path: string) => {
  return route.path === path;
};

// 旋转二级菜单图标动画（顺时针旋转一圈）
const rotateSecondaryIcon = (path: string) => {
  const iconRef = secondaryIconRefs.value.get(path);
  if (!iconRef) return;

  // 清理之前的动画
  const existingAnimation = activeRotateAnimations.value.get(path);
  if (existingAnimation) {
    existingAnimation.kill();
  }

  // 获取实际的 DOM 元素（v-icon 组件需要获取其根元素）
  const iconElement = getDOMElement(iconRef) || iconRef;
  if (!iconElement) return;

  // 先重置到 0 度，然后旋转到 360 度
  gsap.set(iconElement, {
    rotation: 0,
    transformOrigin: 'center center',
  });

  // 创建旋转动画（顺时针旋转 360 度）
  const rotateAnimation = gsap.to(iconElement, {
    rotation: 360,
    duration: 0.6,
    ease: 'power2.out',
  });

  // 保存动画引用
  activeRotateAnimations.value.set(path, rotateAnimation);
};

// 重置二级菜单图标（移除旋转动画效果）
const resetSecondaryIcon = (path: string) => {
  const existingAnimation = activeRotateAnimations.value.get(path);
  if (existingAnimation) {
    existingAnimation.kill();
    activeRotateAnimations.value.delete(path);
  }

  const iconRef = secondaryIconRefs.value.get(path);
  if (!iconRef) return;

  const iconElement = getDOMElement(iconRef) || iconRef;
  if (iconElement) {
    // 重置旋转角度
    gsap.set(iconElement, {
      rotation: 0,
    });
  }
};

// 处理二级菜单悬停
const handleSecondaryHover = (path: string, event: MouseEvent) => {
  rotateSecondaryIcon(path);
};

// 处理二级菜单离开
const handleSecondaryLeave = (path: string) => {
  // 重置动画
  resetSecondaryIcon(path);
};

// 监听路由变化，更新二级菜单高亮
watch(
  () => route.path,
  () => {
    updateSecondaryHighlight();
  },
  { immediate: true },
);

// 监听窗口大小变化和滚动（用于响应式）
const handleResize = () => {
  setTimeout(() => {
    updateSecondaryHighlight();
  }, 400);
};

let scrollFrame: number | null = null;
const handleScroll = () => {
  if (scrollFrame !== null) {
    cancelAnimationFrame(scrollFrame);
  }
  scrollFrame = requestAnimationFrame(() => {
    updateSecondaryHighlight();
    scrollFrame = null;
  });
};

let sidebarElement: HTMLElement | null = null;

onMounted(() => {
  sidebarElement = document.querySelector('.sidebar') as HTMLElement;

  setTimeout(() => {
    updateSecondaryHighlight();
  }, 400);

  window.addEventListener('resize', handleResize);

  // 监听 sidebar 的滚动
  if (sidebarElement) {
    sidebarElement.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);

  if (sidebarElement) {
    sidebarElement.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: var(--theme-bg-secondary);
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
  background-color: var(--theme-bg-tertiary);
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

/* 二级菜单高亮区域（用于显示激活的菜单项） */
.secondary-highlight {
  position: absolute;
  left: 0;
  top: 0;
  width: 0.5rem;
  background-color: transparent;
  box-shadow: none;
  transition:
    transform var(--transition-base),
    height var(--transition-base),
    opacity var(--transition-base);
  pointer-events: none;
  display: none;
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
  background-color: rgba(0, 0, 0, 0.3);
  font-size: calc(var(--font-size-sm) * 0.8);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
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
  background-color: var(--theme-bg-tertiary);
}

.secondary-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
  height: 3.5rem;
  padding-left: 3rem;
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
  background-color: var(--item-color);
  transition:
    width var(--transition-base),
    box-shadow var(--transition-base),
    background-color var(--transition-base);
}

/* 激活状态时装饰条加粗阴影 */
.secondary-item.active .item-decoration-bar {
  box-shadow: 0 0 0.5rem var(--item-color);
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
  background-color: var(--theme-bg-tertiary);
  color: var(--theme-text-primary);
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
