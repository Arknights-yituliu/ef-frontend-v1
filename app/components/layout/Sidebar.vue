<template>
  <nav :class="{ 'drawer-open': isDrawerOpen }" class="sidebar">
    <!-- Logo 区域 -->
    <div class="sidebar-logo" @click="navigateToHome">
      <div class="logo-wrapper">
        <svg class="logo-svg" fill="none" height="32.25199890136719"
             viewBox="0 0 46.20566463470459 32.25199890136719" width="46.20566463470459"
             xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink">
          <rect fill="rgba(249, 249, 249, 1)" height="0" width="0" x="0" y="0"/>
          <g>
            <path
                d="M14.4413 32.252L32.1293 32.252L32.1293 28.908L25.6613 28.908L25.6613 0L22.5813 0C20.8213 1.012 18.7533 1.76 15.8933 2.288L15.8933 4.84L21.6573 4.84L21.6573 28.908L14.4413 28.908L14.4413 32.252Z"
                fill="currentColor">
            </path>
          </g>
          <ellipse cx="22.978261089520018" cy="24.629596248131953"
                   rx="23.408917522625487"
                   ry="4.41759826229211" stroke="currentColor" stroke-width="2"
                   transform="rotate(-19.614696980142693 -0.43065643310546875 20.211997985839844)">
          </ellipse>
          <circle cx="37.06934356689453" cy="15.711997985839844" fill="currentColor" r="3.5">
          </circle>
          <ellipse cx="37.51921338448104" cy="13.823112653989034"
                   rx="7.999996847005453" ry="1.383430647153096"
                   stroke="currentColor" stroke-width="1"
                   transform="rotate(12.416193091380716 29.519216537475586 12.439682006835938)">
          </ellipse>
          <path
              d="M8.56934 8.712L6.7411 8.04025L6.06934 6.212L5.39759 8.04025L3.56934 8.712L5.39759 9.38375L6.06934 11.212L6.7411 9.38375L8.56934 8.712Z"
              fill="currentColor">
          </path>
          <path
              d="M41.5693 25.712L39.7411 25.0402L39.0693 23.212L38.3976 25.0402L36.5693 25.712L38.3976 26.3837L39.0693 28.212L39.7411 26.3837L41.5693 25.712Z"
              fill="currentColor">
          </path>
        </svg>
      </div>
      <!-- 中文的长度不用换行，加个样式进行防抖 -->
      <div :style="{ whiteSpace : currentLocale === 'zh-CN' ? 'nowrap' : 'normal' }" class="logo-text">{{
          $t('layout.siteName')
        }}
      </div>
      <div class="logo-divider"></div>
    </div>

    <!-- 菜单容器（用于高亮区域的定位） -->
    <div ref="menuContainerRef" class="menu-container hide-scrollbar">
      <!-- 一级菜单高亮区域 -->
      <div
          :style="{
            transform: `translateY(${primaryHighlightTop}px)`,
            height: `${primaryHighlightHeight}px`,
            opacity: primaryHighlightHeight > 0 ? 1 : 0
          }"
          class="primary-highlight"
      ></div>

      <!-- 二级菜单高亮区域 -->
      <div
          :style="{
            transform: `translateY(${secondaryHighlightTop}px)`,
            height: `${secondaryHighlightHeight}px`,
        opacity: (!isSecondaryHighlightHidden && secondaryHighlightHeight > 0 && isSidebarExpanded) ? 1 : 0,
        visibility: isSecondaryHighlightHidden ? 'hidden' : 'visible'
          }"
          class="secondary-highlight"
      ></div>

      <!-- 菜单组 -->
      <div
          v-for="(primaryItem, primaryIndex) in menuItems"
          :key="primaryIndex"
          :ref="el => setPrimaryItemRef(el, primaryIndex)"
          class="menu-group"
      >
        <div
            :class="{ active: activePrimary === primaryIndex, expanded: expandedItems.includes(primaryIndex) }"
            class="primary-item"
            @click="togglePrimary(primaryIndex)"
        >

          <!-- 一级菜单图标 -->
          <v-icon
              v-if="primaryItem.vuetifyIcon"
              class="primary-icon"
              size="24"
          >
            {{ primaryItem.vuetifyIcon }}
          </v-icon>
          <svg
              v-else
              class="primary-icon"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path
                :d="primaryItem.iconPath"
                fill="currentColor"
                stroke="none"
            />
          </svg>

          <!-- 菜单项内容 -->
          <span class="primary-text">{{ $t(`menu.${primaryItem.i18nKey}`) }}</span>

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
              v-show="expandedItems.includes(primaryIndex) && (isSidebarExpanded || isDrawerOpen)"
              class="secondary-items"
          >
            <NuxtLink
                v-for="(secondaryItem, secondaryIndex) in primaryItem.children"
                :key="secondaryIndex"
                :ref="el => setSecondaryItemRef(el, primaryIndex, secondaryIndex, secondaryItem.routePath)"
                :class="{ active: isActiveRoute(secondaryItem.routePath) }"
                :to="secondaryItem.routePath"
                class="secondary-item"
                @click="handleSecondaryClick"
                @mouseenter="handleSecondaryHover(secondaryItem.routePath, $event)"
                @mouseleave="handleSecondaryLeave(secondaryItem.routePath)"
            >
              <!-- 二级菜单图标 -->
              <v-icon
                  v-if="secondaryItem.vuetifyIcon"
                  :ref="el => setSecondaryIconRef(el, secondaryItem.routePath)"
                  class="secondary-icon"
                  size="20"
              >
                {{ secondaryItem.vuetifyIcon }}
              </v-icon>
              <svg
                  v-else-if="secondaryItem.iconPath"
                  :ref="el => setSecondaryIconRef(el, secondaryItem.routePath)"
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
        </transition>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="sidebar-footer">
      <div class="footer-decorator"></div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import {gsap} from 'gsap'

interface Props {
  isDrawerOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDrawerOpen: false
})

const emit = defineEmits<{
  'close-drawer': []
}>()

// 菜单项类型
interface SecondaryMenuItem {
  i18nKey: string
  nameKey: string
  routePath: string
  iconPath?: string
  vuetifyIcon?: string
}

interface PrimaryMenuItem {
  i18nKey: string
  nameKey: string
  iconPath?: string
  vuetifyIcon?: string
  children: SecondaryMenuItem[]
}

const route = useRoute()
const router = useRouter()

// 获取路由配置
const appConfig = useAppConfig()
const menuItems = appConfig.menu.routes as PrimaryMenuItem[]

// 点击 Logo 跳转到首页
const navigateToHome = () => {
  if (route.path !== '/') {
    router.push('/')
  }
}

// 默认展开所有菜单
const expandedItems = ref<number[]>(menuItems.map((_, index) => index))
const activePrimary = computed(() => {
  return menuItems.findIndex(item =>
      item.children.some(child => child.routePath === route.path)
  )
})

// 国际化检测
const {locale} = useI18n()

const currentLocale = computed(() => {
  return locale.value
})

// 菜单项 ref 存储
const primaryItemRefs = ref<Map<number, HTMLElement>>(new Map())
const secondaryItemRefs = ref<Map<string, HTMLElement>>(new Map())
const secondaryIconRefs = ref<Map<string, HTMLElement | SVGSVGElement>>(new Map())
const menuContainerRef = ref<HTMLElement | null>(null)

// 旋转动画相关的 ref
const activeRotateAnimations = ref<Map<string, gsap.core.Tween>>(new Map())

// 高亮区域位置和高度
const primaryHighlightTop = ref(0)
const primaryHighlightHeight = ref(0)
const secondaryHighlightTop = ref(0)
const secondaryHighlightHeight = ref(0)

// 侧边栏展开状态（用于控制二级高亮区域的显示）
const isSidebarExpanded = ref(false)

const isSecondaryHighlightHidden = computed(() => {
  const activeIndex = activePrimary.value
  if (activeIndex < 0) {
    return false
  }
  return !expandedItems.value.includes(activeIndex)
})

// 设置一级菜单项 ref
const setPrimaryItemRef = (el: any, index: number) => {
  if (el) {
    primaryItemRefs.value.set(index, el)
  } else {
    primaryItemRefs.value.delete(index)
  }
}

// 设置二级菜单项 ref
const setSecondaryItemRef = (el: any, primaryIndex: number, secondaryIndex: number, path: string) => {
  if (el) {
    secondaryItemRefs.value.set(path, el)
  } else {
    secondaryItemRefs.value.delete(path)
  }
}

// 设置二级菜单图标 ref
const setSecondaryIconRef = (el: any, path: string) => {
  if (el) {
    secondaryIconRefs.value.set(path, el)
  } else {
    secondaryIconRefs.value.delete(path)
  }
}

// 计算元素相对于容器的位置
const getRelativeTop = (element: HTMLElement, container: HTMLElement): number => {
  const elementRect = element.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  return elementRect.top - containerRect.top
}

// 更新一级菜单高亮位置
const updatePrimaryHighlight = () => {
  nextTick(() => {
    const activeIndex = activePrimary.value
    if (activeIndex >= 0) {
      const primaryItemEl = primaryItemRefs.value.get(activeIndex)
      const menuContainerEl = menuContainerRef.value

      if (primaryItemEl && menuContainerEl) {
        const primaryItem = primaryItemEl.querySelector('.primary-item') as HTMLElement

        if (primaryItem) {
          primaryHighlightTop.value = getRelativeTop(primaryItem, menuContainerEl)
          primaryHighlightHeight.value = primaryItem.offsetHeight
        }
      }
    } else {
      primaryHighlightHeight.value = 0
    }
  })
}

// 更新二级菜单高亮位置
const updateSecondaryHighlight = () => {
  nextTick(() => {
    const activePath = route.path
    const activeSecondaryRef = secondaryItemRefs.value.get(activePath)
    const menuContainerEl = menuContainerRef.value

    // 获取实际的 DOM 元素
    const activeSecondaryEl = getDOMElement(activeSecondaryRef)

    if (activeSecondaryEl && menuContainerEl) {
      // 检查元素是否可见（可能在展开动画中）
      const rect = activeSecondaryEl.getBoundingClientRect()
      const computedStyle = window.getComputedStyle(activeSecondaryEl)
      const isVisible = computedStyle.display !== 'none' &&
          computedStyle.visibility !== 'hidden' &&
          computedStyle.opacity !== '0'

      if (isVisible && rect.height > 0 && rect.width > 0) {
        secondaryHighlightTop.value = getRelativeTop(activeSecondaryEl, menuContainerEl)
        secondaryHighlightHeight.value = activeSecondaryEl.offsetHeight
      } else {
        // 如果元素不可见，延迟重试（等待展开动画完成）
        setTimeout(() => {
          const retryRef = secondaryItemRefs.value.get(activePath)
          const retryEl = getDOMElement(retryRef)

          if (retryEl && menuContainerEl) {
            const retryRect = retryEl.getBoundingClientRect()
            const retryComputedStyle = window.getComputedStyle(retryEl)
            const retryIsVisible = retryComputedStyle.display !== 'none' &&
                retryComputedStyle.visibility !== 'hidden' &&
                retryComputedStyle.opacity !== '0'

            if (retryIsVisible && retryRect.height > 0) {
              secondaryHighlightTop.value = getRelativeTop(retryEl, menuContainerEl)
              secondaryHighlightHeight.value = retryEl.offsetHeight
            }
          }
        }, 400)
      }
    } else {
      secondaryHighlightHeight.value = 0
    }
  })
}

const togglePrimary = (index: number) => {
  const idx = expandedItems.value.indexOf(index)
  if (idx > -1) {
    expandedItems.value.splice(idx, 1)
  } else {
    expandedItems.value.push(index)
  }
  // 更新高亮位置
  setTimeout(() => {
    updatePrimaryHighlight()
    updateSecondaryHighlight()
  }, 400)
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

// 旋转二级菜单图标动画（顺时针旋转一圈）
const rotateSecondaryIcon = (path: string) => {
  const iconRef = secondaryIconRefs.value.get(path)
  if (!iconRef) return

  // 清理之前的动画
  const existingAnimation = activeRotateAnimations.value.get(path)
  if (existingAnimation) {
    existingAnimation.kill()
  }

  // 获取实际的 DOM 元素（v-icon 组件需要获取其根元素）
  const iconElement = getDOMElement(iconRef) || iconRef
  if (!iconElement) return

  // 先重置到 0 度，然后旋转到 360 度
  gsap.set(iconElement, {
    rotation: 0,
    transformOrigin: 'center center',
  })

  // 创建旋转动画（顺时针旋转 360 度）
  const rotateAnimation = gsap.to(iconElement, {
    rotation: 360,
    duration: 0.6,
    ease: 'power2.out',
  })

  // 保存动画引用
  activeRotateAnimations.value.set(path, rotateAnimation)
}

// 重置二级菜单图标（移除旋转动画效果）
const resetSecondaryIcon = (path: string) => {
  const existingAnimation = activeRotateAnimations.value.get(path)
  if (existingAnimation) {
    existingAnimation.kill()
    activeRotateAnimations.value.delete(path)
  }

  const iconRef = secondaryIconRefs.value.get(path)
  if (!iconRef) return

  const iconElement = getDOMElement(iconRef) || iconRef
  if (iconElement) {
    // 重置旋转角度
    gsap.set(iconElement, {
      rotation: 0,
    })
  }
}

// 处理二级菜单悬停
const handleSecondaryHover = (path: string, event: MouseEvent) => {
  // 只有侧边栏展开时才执行动画
  if (isSidebarExpanded.value || props.isDrawerOpen) {
    rotateSecondaryIcon(path)
  }
}

// 处理二级菜单离开
const handleSecondaryLeave = (path: string) => {
  // 重置动画
  resetSecondaryIcon(path)
}

// 自动展开当前路由所在的菜单组
watch(() => route.path, () => {
  const primaryIndex = activePrimary.value
  if (primaryIndex >= 0 && !expandedItems.value.includes(primaryIndex)) {
    expandedItems.value.push(primaryIndex)
  }
  // 更新高亮位置
  setTimeout(() => {
    updatePrimaryHighlight()
    updateSecondaryHighlight()
  }, 400)
}, {immediate: true})

// 监听路由变化和菜单展开状态变化
watch([() => route.path, () => activePrimary.value, () => expandedItems.value], () => {
  updatePrimaryHighlight()
  setTimeout(() => {
    updateSecondaryHighlight()
  }, 100)
}, {deep: true})

// 监听抽屉模式状态变化
watch(() => props.isDrawerOpen, (newValue) => {
  isSidebarExpanded.value = newValue || (sidebarElement?.offsetWidth || 0) > 150
  setTimeout(() => {
    updatePrimaryHighlight()
    updateSecondaryHighlight()
  }, 400)
})

watch(isSecondaryHighlightHidden, (hidden) => {
  if (hidden) {
    secondaryHighlightHeight.value = 0
  } else {
    nextTick(() => {
      updateSecondaryHighlight()
    })
  }
})

// 监听窗口大小变化和滚动（用于响应式）
const handleResize = () => {
  setTimeout(() => {
    checkSidebarExpanded()
  }, 400)
  setTimeout(() => {
    updatePrimaryHighlight()
    updateSecondaryHighlight()
  }, 800)
}

let scrollFrame: number | null = null
const handleScroll = () => {
  if (scrollFrame !== null) {
    cancelAnimationFrame(scrollFrame)
  }
  scrollFrame = requestAnimationFrame(() => {
    updatePrimaryHighlight()
    updateSecondaryHighlight()
    scrollFrame = null
  })
}

let sidebarElement: HTMLElement | null = null

// 检查侧边栏是否展开（通过宽度判断：展开时 17.5rem ≈ 280px，收起时 5rem ≈ 80px）
const checkSidebarExpanded = () => {
  // 如果抽屉模式打开，直接认为是展开状态
  if (props.isDrawerOpen) {
    isSidebarExpanded.value = true
    return
  }

  if (sidebarElement) {
    const width = sidebarElement.offsetWidth
    // 如果宽度大于 150px，认为侧边栏已展开
    isSidebarExpanded.value = width > 150
  }
}

const handleMouseEnter = () => {
  // 等待展开动画
  setTimeout(() => {
    checkSidebarExpanded()
  }, 300)
  setTimeout(() => {
    updatePrimaryHighlight()
    updateSecondaryHighlight()
  }, 800)
}

const handleMouseLeave = () => {
  // 等待收起动画
  setTimeout(() => {
    checkSidebarExpanded()
  }, 300)
  setTimeout(() => {
    updatePrimaryHighlight()
    updateSecondaryHighlight()
  }, 800)
}

onMounted(() => {
  // 初始化检查侧边栏展开状态
  sidebarElement = document.querySelector('.sidebar') as HTMLElement
  if (sidebarElement) {
    checkSidebarExpanded()
  }

  setTimeout(() => {
    updatePrimaryHighlight()
    updateSecondaryHighlight()
  }, 400)

  window.addEventListener('resize', handleResize)

  // 监听 sidebar 的滚动
  if (sidebarElement) {
    sidebarElement.addEventListener('scroll', handleScroll)

    // 监听鼠标进入/离开事件（用于 hover 状态）
    sidebarElement.addEventListener('mouseenter', handleMouseEnter)
    sidebarElement.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)

  if (sidebarElement) {
    sidebarElement.removeEventListener('scroll', handleScroll)
    sidebarElement.removeEventListener('mouseenter', handleMouseEnter)
    sidebarElement.removeEventListener('mouseleave', handleMouseLeave)
  }
})
</script>

<style scoped>
.sidebar {
  background-color: var(--theme-bg-secondary);
  border-right: 2px solid var(--theme-accent-color);
  overflow-y: auto  ;
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
  gap: 0.5rem;
  padding: 1rem;
  position: relative;
  background-color: var(--theme-bg-tertiary);
  border-bottom: 2px solid var(--theme-accent-color);
  text-align: center;
  cursor: pointer;
  transition: background-color var(--transition-base);
}

.sidebar-logo:hover {
  background-color: var(--theme-bg-secondary);
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
  transform: scale(1.3) translateY(8%);
  z-index: 1;
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
  transition: all var(--transition-base);
}

/* 展开状态下的logo */
.sidebar:hover .sidebar-logo,
.sidebar.drawer-open .sidebar-logo {
  height: auto;
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

/* 菜单容器 */
.menu-container {
  position: relative;
  flex: 1;
  overflow: auto;
}

/* 一级菜单高亮区域 */
.primary-highlight {
  position: absolute;
  left: 0;
  top: 0;
  width: 0.75rem;
  background-color: var(--theme-accent-color);
  box-shadow: 0 0 0.75rem var(--theme-accent-color);
  transition: transform var(--transition-base), height var(--transition-base), opacity var(--transition-base);
  z-index: 10;
  pointer-events: none;
}

.primary-highlight::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
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
  opacity: 1;
}

.primary-highlight::after {
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

/* 二级菜单高亮区域 */
.secondary-highlight {
  position: absolute;
  left: 0;
  top: 0;
  width: 0.5rem;
  background-color: var(--theme-accent-color);
  box-shadow: 0 0 0.5rem var(--theme-accent-color);
  transition: transform var(--transition-base), height var(--transition-base), opacity var(--transition-base);
  z-index: 11;
  pointer-events: none;
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
  min-height: 4.5rem;
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
  /* 过渡效果由 Vue transition 类控制 */
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

.secondary-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--theme-text-secondary);
  transition: color var(--transition-fast);
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

/* 展开/折叠动画 - 用于点击展开/折叠 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: max-height var(--transition-fast), opacity var(--transition-base);
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0 !important;
  opacity: 0 !important;
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 20rem !important;
  opacity: 1 !important;
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
    box-shadow: 2px 0 1rem var(--theme-shadow-strong);
    /* 确保默认状态下不占据布局空间 */
    visibility: hidden;
  }

  .sidebar.drawer-open {
    transform: translateX(0);
    visibility: visible;
  }

  /* 移除小屏幕下的hover效果 */
  .sidebar:hover {
    width: 17.5rem !important;
    max-width: 80vw;
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
}
</style>

