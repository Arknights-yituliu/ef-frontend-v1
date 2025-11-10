<template>
  <div 
    class="docs-sidebar-wrapper"
    :class="{ 'is-collapsed': isCollapsed, 'is-open': isOpen }"
  >
    <aside 
      class="docs-sidebar" 
      :class="{ 'is-collapsed': isCollapsed, 'is-open': isOpen }"
    >
      <!-- 装饰背景 -->
      <div class="sidebar-bg-decorator"></div>
      
      <!-- 左侧装饰条 -->
      <div class="sidebar-left-decoration"></div>
      
      <!-- 侧边栏内容 -->
      <div class="sidebar-content">
        <div class="sidebar-header">
          <h2 class="sidebar-title">{{ $t('docs.documentation') }}</h2>
        </div>
        
        <nav class="sidebar-nav" ref="sidebarNavRef">
          <div
            class="nav-highlight"
            :style="{
              transform: `translateY(${highlightTop}px)` ,
              height: `${highlightHeight}px` ,
              opacity: highlightHeight > 0 ? 1 : 0
            }"
          ></div>
          <div 
            v-for="(section, sectionIndex) in docNavigation" 
            :key="sectionIndex"
            class="nav-section"
          >
            <h3 class="section-title">{{ $t(section.titleKey) }}</h3>
            <ul class="nav-list">
              <li 
                v-for="(item, itemIndex) in section.items" 
                :key="itemIndex"
                class="nav-item"
                :ref="el => setLinkRef(el, item.path)"
              >
                <NuxtLink 
                  :to="item.path"
                  class="nav-link"
                  :class="{ 'is-active': isActivePath(item.path) }"
                  @click="handleLinkClick"
                >
                  <div class="link-bg"></div>
                  <div class="link-left-border"></div>
                  <span class="link-text">{{ $t(item.titleKey) }}</span>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>

    <!-- 折叠按钮 -->
    <button 
      class="collapse-toggle"
      @click="toggleCollapse"
      :aria-label="isCollapsed ? $t('docs.expand') : $t('docs.collapse')"
    >
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M15 18l-6-6 6-6" 
          stroke="currentColor" 
          stroke-width="2" 
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type {ComponentPublicInstance} from 'vue'
import docNavigationData from '@/custom/route/docNavigation.json'

const route = useRoute()

// 定义 props
interface Props {
  isOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false
})

// 定义 emits
const emit = defineEmits<{
  close: []
}>()

// 折叠状态
const isCollapsed = ref(false)
const sidebarNavRef = ref<HTMLElement | null>(null)
const linkRefs = ref<Map<string, HTMLElement>>(new Map())
const highlightTop = ref(0)
const highlightHeight = ref(0)

// 从 JSON 文件加载文档导航结构
const docNavigation = computed(() => docNavigationData)

// 判断是否是当前激活路径
const isActivePath = (path: string) => {
  return route.path === path
}

const getDOMElement = (el: Element | ComponentPublicInstance | null): HTMLElement | null => {
  if (!el) {
    return null
  }
  if (el instanceof HTMLElement) {
    return el
  }
  if ('$el' in el && el.$el instanceof HTMLElement) {
    return el.$el
  }
  return null
}

const setLinkRef = (el: Element | ComponentPublicInstance | null, path: string) => {
  const element = getDOMElement(el)
  if (!element) {
    linkRefs.value.delete(path)
    return
  }
  linkRefs.value.set(path, element)
}

const getRelativeTop = (element: HTMLElement, container: HTMLElement) => {
  const elementRect = element.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  return elementRect.top - containerRect.top
}

const updateHighlight = () => {
  nextTick(() => {
    const activeEl = linkRefs.value.get(route.path)
    const container = sidebarNavRef.value

    if (!activeEl || !container || isCollapsed.value) {
      highlightHeight.value = 0
      return
    }

    highlightTop.value = getRelativeTop(activeEl, container)
    highlightHeight.value = activeEl.offsetHeight
  })
}

// 切换折叠状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  if (isCollapsed.value) {
    highlightHeight.value = 0
  } else {
    updateHighlight()
  }
}

// 处理链接点击（移动端关闭侧边栏）
const handleLinkClick = () => {
  if (props.isOpen) {
    emit('close')
  }
}

const handleResize = () => {
  if (!isCollapsed.value) {
    updateHighlight()
  }
}

watch(() => route.path, () => {
  updateHighlight()
}, {immediate: true})

watch(() => props.isOpen, (open) => {
  if (open) {
    nextTick(() => {
      updateHighlight()
    })
  }
})

onMounted(() => {
  updateHighlight()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.docs-sidebar-wrapper {
  position: relative;
  z-index: 40;
}

.docs-sidebar {
  position: fixed;
  top: 4.5rem;
  left: 0;
  width: 18rem;
  height: calc(100vh - 4.5rem);
  overflow-y: auto;
  background-color: var(--theme-bg-secondary);
  border-right: 2px solid var(--theme-border);
  transition: all var(--transition-base);
  z-index: 40;
}

.docs-sidebar.is-collapsed {
  width: 3.5rem;
}

/* 装饰背景 - 斜条纹 */
.sidebar-bg-decorator {
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
  opacity: 0.3;
  pointer-events: none;
}

/* 左侧装饰条 */
.sidebar-left-decoration {
  position: fixed;
  left: 0;
  top: 0;
  width: 0.25rem;
  height: 100vh;
  background-color: var(--theme-accent-color);
  opacity: 0.6;
  box-shadow: 0 0 0.5rem var(--theme-accent-color);
  transition: all var(--transition-base);
}

.docs-sidebar:hover .sidebar-left-decoration {
  opacity: 0.8;
}

/* 折叠按钮 */
.collapse-toggle {
  position: fixed;
  top: calc(4.5rem + 1rem);
  left: 17rem;
  width: 2rem;
  height: 2rem;
  background-color: var(--theme-bg-secondary);
  border: 2px solid var(--theme-accent-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  z-index: 45;
  box-shadow: 0 0 0.5rem var(--theme-shadow-accent);
}

.docs-sidebar-wrapper.is-collapsed .collapse-toggle {
  left: 2.5rem;
}

.collapse-toggle svg {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--theme-text-primary);
  transition: transform var(--transition-base);
}

.docs-sidebar-wrapper.is-collapsed .collapse-toggle svg {
  transform: rotate(180deg);
}

/* 侧边栏内容 */
.sidebar-content {
  position: relative;
  z-index: 1;
  padding: 1.5rem 1rem;
  opacity: 1;
  transition: opacity var(--transition-base);
}

.docs-sidebar.is-collapsed .sidebar-content {
  opacity: 0;
  pointer-events: none;
}

/* 侧边栏标题 */
.sidebar-header {
  margin-bottom: 2rem;
}

.sidebar-title {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: var(--theme-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  padding-left: 0.75rem;
}

.sidebar-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0.25rem;
  height: 70%;
  background-color: var(--theme-accent-color);
  box-shadow: 0 0 0.5rem var(--theme-accent-color);
}

/* 导航区域 */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
}

.nav-highlight {
  position: absolute;
  left: 0.2rem;
  right: 0.75rem;
  border-left: 0.25rem solid var(--theme-accent-color);
  background: linear-gradient(90deg, var(--theme-decorative-overlay-light) 0%, transparent 90%);
  border-radius: var(--radius-sm);
  transition: transform var(--transition-base), height var(--transition-base), opacity var(--transition-base);
  pointer-events: none;
  opacity: 0;
}

.sidebar-nav::before {
  content: '';
  position: absolute;
  left: 1.25rem;
  top: 0.75rem;
  bottom: 0.75rem;
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--theme-border) 25%, var(--theme-border) 75%, transparent);
  opacity: 0.35;
}

.docs-sidebar.is-collapsed .nav-highlight {
  opacity: 0 !important;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--theme-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 0.5rem;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid transparent;
  text-decoration: none;
  color: var(--theme-text-primary);
  font-size: var(--font-size-sm);
  position: relative;
  overflow: hidden;
  transition: all var(--transition-fast);
}

.link-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  transition: all var(--transition-fast);
}

.link-left-border {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0.25rem;
  background-color: transparent;
  transition: all var(--transition-fast);
}

.nav-link:hover {
  border-bottom-color: var(--theme-accent-color);
  transform: translateX(0.25rem);
}

.link-text {
  position: relative;
  z-index: 1;
  flex: 1;
}

/* 响应式 - 移动端 */
@media (max-width: 768px) {
  .docs-sidebar {
    transform: translateX(-100%);
    box-shadow: none;
  }
  
  .docs-sidebar.is-open {
    transform: translateX(0);
    box-shadow: 0.5rem 0 2rem var(--theme-shadow-accent-strong);
  }
  
  .collapse-toggle {
    display: none;
  }
}
</style>

