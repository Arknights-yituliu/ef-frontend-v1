<template>
  <aside 
    class="docs-toc" 
    :class="{ 'is-collapsed': isCollapsed, 'is-open': isOpen }"
  >
    <!-- 装饰背景 -->
    <div class="toc-bg-decorator"></div>
    
    <!-- 右侧装饰条 -->
    <div class="toc-right-decoration"></div>
    
    <!-- 折叠按钮 -->
    <button 
      class="collapse-toggle"
      @click="toggleCollapse"
      :aria-label="isCollapsed ? $t('docs.expand') : $t('docs.collapse')"
    >
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M9 18l6-6-6-6" 
          stroke="currentColor" 
          stroke-width="2" 
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    
    <!-- TOC 内容 -->
    <div class="toc-content">
      <div class="toc-header">
        <h2 class="toc-title">{{ $t('docs.tableOfContents') }}</h2>
      </div>
      
      <nav class="toc-nav" v-if="headings.length > 0" ref="tocNavRef">
        <div
          class="toc-highlight"
          :style="{
            transform: `translateY(${highlightTop}px)` ,
            height: `${highlightHeight}px` ,
            opacity: highlightHeight > 0 ? 1 : 0
          }"
        ></div>
        <ul class="toc-list">
          <li 
            v-for="(heading, index) in headings" 
            :key="index"
            class="toc-item"
            :class="`toc-item-level-${heading.depth}`"
            :ref="el => setHeadingRef(el, heading.id)"
          >
            <a 
              :href="`#${heading.id}`"
              class="toc-link"
              :class="{ 'is-active': activeHeading === heading.id }"
              @click.prevent="scrollToHeading(heading.id)"
            >
              <svg
                class="toc-marker"
                :class="[
                  `depth-${heading.depth}`,
                  { 'is-active': activeHeading === heading.id }
                ]"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <template v-if="heading.depth === 2">
                  <polygon points="16,4 28,16 16,28 4,16" class="marker-diamond-outer" />
                  <polygon points="16,8 24,16 16,24 8,16" class="marker-diamond-inner" />
                  <polygon points="16,12 20,16 16,20 12,16" class="marker-diamond-core" />
                  <line x1="16" y1="10" x2="16" y2="22" class="marker-cross" />
                  <line x1="10" y1="16" x2="22" y2="16" class="marker-cross" />
                </template>
                <template v-else-if="heading.depth === 3">
                  <polygon points="16,6 26,16 16,26 6,16" class="marker-diamond-outer" />
                  <polygon points="16,11 21,16 16,21 11,16" class="marker-diamond-inner" />
                  <line x1="16" y1="12" x2="16" y2="20" class="marker-cross" />
                  <line x1="12" y1="16" x2="20" y2="16" class="marker-cross" />
                </template>
                <template v-else-if="heading.depth === 4">
                  <polygon points="16,8 24,16 16,24 8,16" class="marker-diamond-outer" />
                  <polygon points="16,13 19,16 16,19 13,16" class="marker-diamond-core" />
                </template>
                <template v-else>
                  <polygon points="16,12 20,16 16,20 12,16" class="marker-diamond-dot" />
                </template>
              </svg>
              <span class="link-text">{{ heading.text }}</span>
            </a>
          </li>
        </ul>
      </nav>
      
      <div v-else class="toc-empty">
        <p>{{ $t('docs.noTableOfContents') }}</p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type {ComponentPublicInstance} from 'vue'
// 定义 props
interface Props {
  headings?: Array<{
    id: string
    text: string
    depth: number
  }>
  isOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  headings: () => [],
  isOpen: false
})

// 定义 emits
const emit = defineEmits<{
  close: []
}>()

// 折叠状态
const isCollapsed = ref(false)

// 当前激活的标题
const activeHeading = ref<string>('')
const tocNavRef = ref<HTMLElement | null>(null)
const headingRefs = ref<Map<string, HTMLElement>>(new Map())
const highlightTop = ref(0)
const highlightHeight = ref(0)

// 切换折叠状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  if (isCollapsed.value) {
    highlightHeight.value = 0
  } else {
    updateHighlight()
  }
}

// 滚动到指定标题
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const top = element.offsetTop - 80 // 减去顶部导航栏高度
    window.scrollTo({
      top,
      behavior: 'smooth'
    })
    activeHeading.value = id
    
    // 移动端关闭 TOC
    if (props.isOpen) {
      emit('close')
    }
  }
}

// 监听滚动，更新激活的标题
let scrollHandler: (() => void) | null = null

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

const setHeadingRef = (el: Element | ComponentPublicInstance | null, id: string) => {
  const element = getDOMElement(el)
  if (!element) {
    headingRefs.value.delete(id)
    return
  }
  headingRefs.value.set(id, element)
}

const getRelativeTop = (element: HTMLElement, container: HTMLElement) => {
  const elementRect = element.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  return elementRect.top - containerRect.top
}

const resolveActiveHeading = () => {
  if (activeHeading.value) {
    return activeHeading.value
  }
  return props.headings[0]?.id || ''
}

const updateHighlight = () => {
  nextTick(() => {
    const container = tocNavRef.value
    if (!container || isCollapsed.value) {
      highlightHeight.value = 0
      return
    }

    const targetId = resolveActiveHeading()
    const activeEl = targetId ? headingRefs.value.get(targetId) : null

    if (!activeEl) {
      highlightHeight.value = 0
      return
    }

    highlightTop.value = getRelativeTop(activeEl, container)
    highlightHeight.value = activeEl.offsetHeight
  })
}

onMounted(() => {
  scrollHandler = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    
    // 找到当前滚动位置对应的标题
    for (let i = props.headings.length - 1; i >= 0; i--) {
      const heading = props.headings[i]
      if (!heading) {
        continue
      }
      const element = document.getElementById(heading.id)
      if (element) {
        const elementTop = element.offsetTop - 100
        if (scrollTop >= elementTop) {
          activeHeading.value = heading.id
          updateHighlight()
          break
        }
      }
    }
  }
  
  window.addEventListener('scroll', scrollHandler, { passive: true })
  updateHighlight()
  window.addEventListener('resize', updateHighlight)
})

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
  window.removeEventListener('resize', updateHighlight)
})

watch(activeHeading, () => {
  updateHighlight()
})

watch(() => props.headings, () => {
  nextTick(() => {
    updateHighlight()
  })
}, { deep: true })

watch(() => props.isOpen, (open) => {
  if (open) {
    nextTick(() => {
      updateHighlight()
    })
  }
})
</script>

<style scoped>
.docs-toc {
  position: fixed;
  top: 4.5rem;
  right: 0;
  width: 20rem;
  height: calc(100vh - 4.5rem);
  background-color: var(--theme-bg-secondary);
  border-left: 2px solid var(--theme-border);
  transition: all var(--transition-base);
  z-index: 40;
}

.docs-toc.is-collapsed {
  width: 3.5rem;
}

/* 装饰背景 - 斜条纹 */
.toc-bg-decorator {
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

/* 右侧装饰条 */
.toc-right-decoration {
  position: absolute;
  right: 0;
  top: 0;
  width: 0.25rem;
  height: 100%;
  background-color: var(--theme-accent-color);
  opacity: 0.6;
  box-shadow: 0 0 0.5rem var(--theme-accent-color);
  transition: all var(--transition-base);
}

.docs-toc:hover .toc-right-decoration {
  opacity: 0.8;
}

/* 折叠按钮 */
.collapse-toggle {
  position: absolute;
  top: 1rem;
  left: -1rem;
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
  z-index: 10;
  box-shadow: 0 0 0.5rem var(--theme-shadow-accent);
}

.collapse-toggle:hover {
  background-color: var(--theme-bg-tertiary);
  box-shadow: 0 0 0.75rem var(--theme-accent-color);
  transform: scale(1.1);
}

.collapse-toggle svg {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--theme-text-primary);
  transition: transform var(--transition-base);
}

.docs-toc.is-collapsed .collapse-toggle svg {
  transform: rotate(180deg);
}

/* TOC 内容 */
.toc-content {
  position: relative;
  z-index: 1;
  padding: 1.5rem 1.5rem;
  opacity: 1;
  transition: opacity var(--transition-base);
}

.docs-toc.is-collapsed .toc-content {
  opacity: 0;
  pointer-events: none;
}

/* TOC 标题 */
.toc-header {
  margin-bottom: 1.5rem;
  margin-left: 1rem;
}

.toc-title {
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--theme-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  padding-left: 0.75rem;
}

.toc-title::before {
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

/* TOC 导航 */
.toc-nav {
  position: relative;
}

.toc-highlight {
  position: absolute;
  left: 0.3rem;
  transition: transform var(--transition-base), height var(--transition-base);
  opacity: 0;
  pointer-events: none;
}

.toc-highlight::before {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 0.2rem;
  background-color: var(--theme-accent-color);
}

.docs-toc.is-collapsed .toc-highlight {
  opacity: 0 !important;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0 0 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toc-item {
  position: relative;
}

.toc-nav::before {
  content: '';
  position: absolute;
  left: 2.5rem;
  top: 0.75rem;
  bottom: 0.75rem;
  width: 1px;
  border-radius: var(--radius-lg);
  background: linear-gradient(to bottom, transparent, var(--theme-border) 30%, var(--theme-border) 70%, transparent);
  opacity: 0.25;
}

.toc-item-level-2 {
  padding-left: 0;
}

.toc-item-level-3 {
  padding-left: 1rem;
}

.toc-item-level-4 {
  padding-left: 2rem;
}

.toc-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--theme-text-secondary);
  font-size: var(--font-size-xs);
  position: relative;
  transition: all var(--transition-fast);
}

.toc-link:hover {
  color: var(--theme-text-primary);
  transform: translateX(-0.125rem);
}

.toc-link.is-active {
  color: var(--theme-text-primary);
  font-weight: 600;
}

.toc-marker {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  transition: transform var(--transition-fast), color var(--transition-fast);
  color: var(--theme-text-secondary);
}

.toc-marker .marker-diamond-outer,
.toc-marker .marker-diamond-inner,
.toc-marker .marker-cross {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.toc-marker .marker-cross {
  stroke-width: 1.25;
}

.toc-marker .marker-diamond-core,
.toc-marker .marker-diamond-dot {
  fill: currentColor;
  stroke: none;
}

.toc-marker.depth-2 {
  filter: drop-shadow(0 0 0.25rem rgba(0, 0, 0, 0.2));
}

.toc-marker.depth-2 .marker-diamond-inner {
  stroke-dasharray: 6 2;
}

.toc-marker.depth-2 .marker-cross {
  opacity: 0.7;
}

.toc-marker.depth-3 .marker-diamond-outer {
  stroke-dasharray: 5 2;
}

.toc-marker.depth-3 .marker-diamond-inner {
  stroke-width: 1.5;
}

.toc-marker.depth-4 .marker-diamond-outer {
  stroke-width: 1.5;
  stroke-dasharray: 3 2;
}

.toc-marker.is-active {
  color: var(--theme-accent-color);
  transform: scale(1.08);
  animation: markerPulse 1.8s ease-in-out infinite;
}

.link-text {
  flex: 1;
  line-height: 1.4;
  word-break: break-word;
}

@keyframes markerPulse {
  0%, 100% {
    filter: drop-shadow(0 0 0.1rem rgba(0, 0, 0, 0.25));
  }
  50% {
    filter: drop-shadow(0 0 0.6rem var(--theme-shadow-accent));
  }
}

/* 空状态 */
.toc-empty {
  padding: 1rem;
  color: var(--theme-text-tertiary);
  font-size: var(--font-size-xs);
  text-align: center;
}

/* 响应式 - 移动端 */
@media (max-width: 768px) {
  .docs-toc {
    transform: translateX(100%);
    box-shadow: none;
  }
  
  .docs-toc.is-open {
    transform: translateX(0);
    box-shadow: -0.5rem 0 2rem var(--theme-shadow-accent-strong);
  }
  
  .collapse-toggle {
    display: none;
  }
}
</style>

