<template>
  <nav :class="{ 'drawer-open': isDrawerOpen }" class="sidebar">
    <!-- Logo 区域 -->
    <div class="sidebar-logo">
      <div class="logo-wrapper">
        <svg class="logo-svg" fill="none" height="26.38799285888672" viewBox="0 0 46.20566463470459 26.38799285888672"
             width="46.20566463470459" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <rect fill="rgba(249, 249, 249, 1)" height="0" width="0" x="0" y="0"/>
          <g>
            <path d="M15.7373 26.388L30.2093 26.388L30.2093 23.652L24.9173 23.652L24.9173 -1.90735e-06L22.3973 -1.90735e-06C20.9573 0.827995 19.2653 1.44 16.9253 1.872L16.9253 3.96L21.6413 3.96L21.6413 23.652L15.7373 23.652L15.7373 26.388Z"
                  fill="currentColor">
            </path>
          </g>
          <ellipse cx="22.978261089520018" cy="22.04559661434289"
                   rx="23.408917522625487"
                   ry="4.41759826229211" stroke="currentColor" stroke-width="2" transform="rotate(-19.614696980142693 -0.43065643310546875 17.62799835205078)">
          </ellipse>
          <circle cx="37.06934356689453" cy="13.127998352050781" fill="currentColor" r="3.5">
          </circle>
          <ellipse cx="37.51921338448104" cy="11.239113020199971"
                   rx="7.999996847005453" ry="1.383430647153096"
                   stroke="currentColor" stroke-width="1" transform="rotate(12.416193091380716 29.519216537475586 9.855682373046875)">
          </ellipse>
        </svg>
      </div>
        <div class="logo-text">终末地一图流</div>
      <div class="logo-divider"></div>
    </div>

    <!-- 菜单组 -->
    <div
        v-for="(primaryItem, primaryIndex) in menuItems"
        :key="primaryIndex"
        class="menu-group"
    >
      <div
          :class="{ active: activePrimary === primaryIndex, expanded: expandedItems.includes(primaryIndex) }"
          class="primary-item"
          @click="togglePrimary(primaryIndex)"
      >
        <!-- 激活指示器 -->
        <div :class="{ active: activePrimary === primaryIndex }" class="active-indicator"></div>

        <!-- 一级菜单图标 -->
        <svg
            :viewBox="primaryItem.iconViewBox || '0 0 24 24'"
            class="primary-icon"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              :d="primaryItem.iconPath"
              fill="currentColor"
              stroke="none"
          />
        </svg>

        <!-- 菜单项内容 -->
        <span class="primary-text">{{ $t(`menu.${primaryItem.key}`) }}</span>

        <!-- SVG 展开图标 -->
        <svg
            :class="{ expanded: expandedItems.includes(primaryIndex) }"
            class="expand-icon"
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M2 4 L6 8 L10 4"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
          />
        </svg>
      </div>

      <!-- 二级菜单 -->
      <transition name="slide-down">
        <div
            v-show="expandedItems.includes(primaryIndex)"
            class="secondary-items"
        >
          <NuxtLink
              v-for="(secondaryItem, secondaryIndex) in primaryItem.children"
              :key="secondaryIndex"
              :class="{ active: isActiveRoute(secondaryItem.path) }"
              :to="secondaryItem.path"
              class="secondary-item"
              @click="handleSecondaryClick"
          >
            <!-- 二级菜单装饰点 -->
            <svg class="secondary-dot" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg">
              <circle cx="3" cy="3" fill="currentColor" r="2"/>
            </svg>
            <span class="secondary-text">{{ $t(`menu.${secondaryItem.key}`) }}</span>
          </NuxtLink>
        </div>
      </transition>
    </div>

    <!-- 底部装饰 -->
    <div class="sidebar-footer">
      <div class="footer-decorator"></div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
interface Props {
  isDrawerOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDrawerOpen: false
})

const emit = defineEmits<{
  'close-drawer': []
}>()

const route = useRoute()
const {t} = useI18n()

const menuItems = [
  {
    key: 'primary1',
    iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z',
    iconViewBox: '0 0 24 24',
    children: [
      {key: 'secondary1_1', path: '/role-list'},
      {key: 'secondary1_2', path: '/role-detail'}
    ]
  },
  {
    key: 'primary2',
    iconPath: 'M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z',
    iconViewBox: '0 0 24 24',
    children: [
      {key: 'secondary2_1', path: '/equipment-list'},
      {key: 'secondary2_2', path: '/equipment-detail'}
    ]
  }
]

const expandedItems = ref<number[]>([0]) // 默认展开第一个菜单
const activePrimary = computed(() => {
  return menuItems.findIndex(item =>
      item.children.some(child => child.path === route.path)
  )
})

const togglePrimary = (index: number) => {
  const idx = expandedItems.value.indexOf(index)
  if (idx > -1) {
    expandedItems.value.splice(idx, 1)
  } else {
    expandedItems.value.push(index)
  }
}

// 点击二级菜单项时关闭抽屉
const handleSecondaryClick = () => {
  if (props.isDrawerOpen) {
    emit('close-drawer')
  }
}

const isActiveRoute = (path: string) => {
  return route.path === path
}

// 自动展开当前路由所在的菜单组
watch(() => route.path, () => {
  const primaryIndex = activePrimary.value
  if (primaryIndex >= 0 && !expandedItems.value.includes(primaryIndex)) {
    expandedItems.value.push(primaryIndex)
  }
}, {immediate: true})
</script>

<style scoped>
.sidebar {
  background-color: var(--theme-bg-secondary);
  border-right: 2px solid var(--theme-accent-color);
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 100;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 5rem; /* 折叠状态宽度 */
  transition: width var(--transition-base);
  position: relative;
  flex-shrink: 0;
}

/* hover 展开状态 */
.sidebar:hover,
.sidebar.drawer-open {
  width: 17.5rem; /* 展开状态宽度 */
}

/* Logo 区域 */
.sidebar-logo {
  height: 4.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: var(--theme-bg-tertiary);
  border-bottom: 2px solid var(--theme-accent-color);
}

.sidebar-logo::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
      -45deg,
      transparent,
      transparent 13.9512529279%,
      var(--theme-decorative-overlay) 0,
      var(--theme-decorative-overlay) 36.0487470721%,
      transparent 0,
      transparent 63.9512529279%,
      var(--theme-decorative-overlay) 0,
      var(--theme-decorative-overlay) 86.0487470721%,
      transparent 0,
      transparent
  );
  background-size: 0.5rem 0.5rem;
  opacity: 0.3;
  pointer-events: none;
}

.logo-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  transform: scale(1.3) translateY(40%);
  z-index: 1;
  transition: all var(--transition-base);
}

.logo-icon {
  width: 3.5rem;
  height: 3.5rem;
  transition: all var(--transition-base);
}

.logo-svg {
  color: var(--logo-color);
  transition: color var(--transition-base);
}

/* 展开/悬停时 logo 颜色 */
.sidebar:hover .logo-svg,
.sidebar.drawer-open .logo-svg {
  color: var(--logo-color-expanded);
}

.logo-text {
  font-size: var(--font-size-md);
  color: var(--theme-text-primary);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 0 0.5rem var(--theme-shadow-accent-hover);
  opacity: 0;
  width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: all var(--transition-base);
}

/* 展开状态下的logo */
.sidebar:hover .sidebar-logo,
.sidebar.drawer-open .sidebar-logo {
  height: 7.5rem;
}

.sidebar:hover .sidebar-logo .logo-wrapper,
.sidebar.drawer-open .sidebar-logo .logo-wrapper {
  transform: scale(1.6) translateY(20%);
}

.sidebar:hover .sidebar-logo .logo-text,
.sidebar.drawer-open .sidebar-logo .logo-text {
  opacity: 1;
  width: auto;
  margin-top: 1.2rem;
}

.logo-divider {
  position: absolute;
  bottom: 0;
  left: 1rem;
  right: 1rem;
  height: 1px;
  background: linear-gradient(
      to right,
      transparent 0%,
      var(--theme-accent-color) 20%,
      var(--theme-accent-color) 80%,
      transparent 100%
  );
  opacity: 0.5;
}

.menu-group {
  border-bottom: 1px solid var(--theme-border);
  position: relative;
}

.menu-group::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0.25rem;
  background-color: var(--theme-border);
  opacity: 0.3;
}

.primary-item {
  height: 4.5rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: var(--theme-bg-secondary);
  cursor: pointer;
  user-select: none;
  position: relative;
  overflow: hidden;
}

/* 展开状态下的padding */
.sidebar:hover .primary-item,
.sidebar.drawer-open .primary-item {
  padding: 0 1.75rem;
  justify-content: space-between;
  transition: all var(--transition-base);
}

.primary-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0.75rem;
  background-image: linear-gradient(
      -45deg,
      transparent,
      transparent 13.9512529279%,
      var(--theme-decorative-overlay) 0,
      var(--theme-decorative-overlay) 36.0487470721%,
      transparent 0,
      transparent 63.9512529279%,
      var(--theme-decorative-overlay) 0,
      var(--theme-decorative-overlay) 86.0487470721%,
      transparent 0,
      transparent
  );
  background-size: 0.5rem 0.5rem;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.primary-item:hover::before {
  opacity: 1;
}

.primary-item:hover {
  background-color: var(--theme-bg-tertiary);
}

.primary-item.active {
  background-color: var(--theme-bg-tertiary);
}

.primary-item.active::before {
  opacity: 1;
  background-color: var(--theme-accent-color);
}

/* 激活指示器 */
.active-indicator {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0.75rem;
  background-color: transparent;
  transition: all var(--transition-fast);
  box-shadow: 0 0 0.5rem transparent;
}

.active-indicator.active {
  background-color: var(--theme-accent-color);
  box-shadow: 0 0 0.75rem var(--theme-accent-color);
}

.active-indicator.active::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0.25rem;
  height: 60%;
  background-color: var(--theme-text-secondary);
  opacity: 0.3;
  border-radius: 0 0.125rem 0.125rem 0;
}

/* 一级菜单图标 */
.primary-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--theme-text-secondary);
  flex-shrink: 0;
  transition: all var(--transition-base);
  position: relative;
  transform: scale(1.5) translateX(1.25rem);
  z-index: 1;
}

.sidebar:hover .primary-icon,
.sidebar.drawer-open .primary-icon {
  transform: scale(1) translateX(0);
}

.primary-item:hover .primary-icon,
.primary-item.active .primary-icon {
  color: var(--theme-text-primary);
}

.primary-text {
  font-size: var(--font-size-sm);
  color: var(--theme-text-primary);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  z-index: 1;
  opacity: 0;
  width: 0;
  transition: all var(--transition-base);
}

/* 展开时显示文字 */
.sidebar:hover .primary-text,
.sidebar.drawer-open .primary-text {
  opacity: 1;
  width: auto;
  margin-left: 0.5rem;
}

.primary-item.active .primary-text {
  color: var(--theme-text-primary);
  font-weight: 700;
}

.expand-icon {
  width: 0.75rem;
  height: 0.75rem;
  color: var(--theme-text-secondary);
  transition: all var(--transition-base);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  opacity: 0;
  overflow: hidden;
}

/* 展开时显示展开图标 */
.sidebar:hover .expand-icon,
.sidebar.drawer-open .expand-icon {
  opacity: 1;
  width: 0.75rem;
}

.expand-icon.expanded {
  transform: rotate(180deg);
  color: var(--theme-text-primary);
}

.secondary-items {
  overflow: hidden;
  background-color: var(--theme-bg-tertiary);
  position: relative;
  opacity: 0;
  max-height: 0;
  transition: all var(--transition-base);
  /* 折叠状态下通过opacity和max-height隐藏，但保留v-show的控制 */
}

/* 展开时显示二级菜单（仅当侧边栏hover展开且菜单项已点击展开时） */
.sidebar:hover .secondary-items,
.sidebar.drawer-open .secondary-items {
  opacity: 1;
  max-height: 20rem;
}

.secondary-items::before {
  content: '';
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
  opacity: 0.5;
  pointer-events: none;
}

.secondary-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  height: 3.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  background-color: transparent;
  color: var(--theme-text-secondary);
  text-decoration: none;
  transition: all var(--transition-base);
  font-size: var(--font-size-sm);
  position: relative;
  justify-content: center;
}

/* 展开时调整二级菜单布局 */
.sidebar:hover .secondary-item,
.sidebar.drawer-open .secondary-item {
  padding-left: 3rem;
  justify-content: flex-start;
}

.secondary-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0.5rem;
  background-color: transparent;
  transition: all var(--transition-fast);
}

.secondary-item:hover {
  background-color: var(--theme-bg-tertiary);
  color: var(--theme-text-primary);
}

.secondary-item.active {
  background-color: var(--theme-bg-tertiary);
  color: var(--theme-text-primary);
}

.secondary-item.active::before {
  background-color: var(--theme-accent-color);
  box-shadow: 0 0 0.5rem var(--theme-accent-color);
}

.secondary-dot {
  width: 0.375rem;
  height: 0.375rem;
  color: var(--theme-text-secondary);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.secondary-item:hover .secondary-dot,
.secondary-item.active .secondary-dot {
  color: var(--theme-text-primary);
}

.secondary-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0;
  width: 0;
  transition: all var(--transition-base);
}

/* 展开时显示二级菜单文字 */
.sidebar:hover .secondary-text,
.sidebar.drawer-open .secondary-text {
  opacity: 1;
  width: auto;
  margin-left: 0.5rem;
}

.secondary-indicator {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0.25rem;
  height: 0;
  background-color: var(--theme-accent-color);
  transition: height var(--transition-fast);
  border-radius: 0.125rem 0 0 0.125rem;
}

.secondary-indicator.active {
  height: 60%;
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
      var(--theme-accent-color) 20%,
      var(--theme-accent-color) 80%,
      transparent 100%
  );
  opacity: 0.3;
}

/* 展开/折叠动画 - 保留用于点击展开/折叠 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all var(--transition-base);
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 20rem;
  opacity: 1;
}


/* 小屏幕抽屉模式 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    max-width: 80vw; /* 限制最大宽度，避免在小屏幕上过宽 */
    transform: translateX(-100%);
    z-index: 160;
    box-shadow: 2px 0 1rem var(--color-shadow-strong);
    /* 禁用hover展开效果 */
    pointer-events: none;
    /* 确保默认状态下不占据布局空间 */
    visibility: hidden;
  }

  .sidebar.drawer-open {
    transform: translateX(0);
    pointer-events: auto;
    visibility: visible;
  }

  /* 移除小屏幕下的hover效果 */
  .sidebar:hover {
    width: 17.5rem !important;
    max-width: 80vw;
  }

  /* 抽屉模式下应用所有hover样式 */
  .sidebar.drawer-open .sidebar-logo {
    height: 7.5rem;
  }

  .sidebar.drawer-open .sidebar-logo .logo-wrapper {
    transform: scale(1.6) translateY(20%);
  }

  .sidebar.drawer-open .logo-text {
    opacity: 1 !important;
    width: auto !important;
    margin-top: 0.5rem;
  }

  .sidebar.drawer-open .primary-item {
    padding: 0 1.75rem;
    justify-content: space-between;
  }

  .sidebar.drawer-open .primary-icon {
    transform: scale(1) translateX(0);
    width: 1.5rem;
    height: 1.5rem;
  }

  .sidebar.drawer-open .primary-text {
    opacity: 1 !important;
    width: auto !important;
    margin-left: 0.5rem;
  }

  .sidebar.drawer-open .expand-icon {
    opacity: 1 !important;
    width: 0.75rem;
  }

  .sidebar.drawer-open .secondary-item {
    padding-left: 3rem;
    justify-content: flex-start;
  }

  .sidebar.drawer-open .secondary-text {
    opacity: 1 !important;
    width: auto !important;
    margin-left: 0.5rem;
  }

  .sidebar.drawer-open .secondary-items {
    opacity: 1;
    max-height: 20rem;
    display: block;
  }

  /* 图标缩放适配 */
  .sidebar.drawer-open .logo-icon {
    width: 3.5rem;
    height: 3.5rem;
  }
}
</style>

