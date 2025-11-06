<template>
  <AnnimationInitialLoader :is-loading="isInitialLoading"/>
  <div class="layout-container">
    <header class="app-header">
      <!-- 装饰背景 -->
      <div class="header-bg-decorator"></div>

      <!-- 左侧装饰条 -->
      <div class="header-left-decoration"></div>

      <!-- 扫描线 SVG 动画 -->
      <svg class="header-scanline" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="scanline-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" style="stop-color: var(--theme-accent-color); stop-opacity: 0"/>
            <stop offset="50%" style="stop-color: var(--theme-accent-color); stop-opacity: 0.3"/>
            <stop offset="100%" style="stop-color: var(--theme-accent-color); stop-opacity: 0"/>
          </linearGradient>
        </defs>
        <rect class="scanline-rect" fill="url(#scanline-gradient)" height="2" width="100" x="0" y="0"/>
      </svg>

      <!-- 汉堡包菜单按钮（小屏幕显示） -->
      <button
          :class="{ active: isDrawerOpen }"
          aria-label="菜单"
          class="hamburger-button"
          @click="toggleDrawer"
      >
        <svg class="hamburger-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
              class="hamburger-line hamburger-line-top"
              d="M3 6h18"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="2"
          />
          <path
              class="hamburger-line hamburger-line-middle"
              d="M3 12h18"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="2"
          />
          <path
              class="hamburger-line hamburger-line-bottom"
              d="M3 18h18"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="2"
          />
        </svg>
      </button>

      <!-- 控制按钮区域 -->
      <div class="header-controls">
        <LayoutThemeToggle/>
        <div class="control-divider"></div>
        <LayoutLanguageToggle/>
      </div>
    </header>
    <!-- 抽屉遮罩层 -->
    <div
        v-if="isDrawerOpen"
        class="drawer-overlay"
        @click="closeDrawer"
    ></div>
    <div class="layout-content">
      <LayoutSidebar :is-drawer-open="isDrawerOpen" @close-drawer="closeDrawer"/>
      <main class="main-content">
        <!-- 沙漠波纹曲线背景 -->
        <svg id="svg" class="desert-bg" viewBox="0 0 1440 700"
             xmlns="http://www.w3.org/2000/svg">
          <path
              class="transition-all duration-300 ease-in-out delay-150 path-0 wave-path"
              d="M 0,700 C 0,700 0,140 0,140 C 69.33096559378467,117.88624984585029 138.66193118756934,95.77249969170057 188,92 C 237.33806881243066,88.22750030829943 266.68324084350724,102.79625107904798 310,122 C 353.31675915649276,141.20374892095202 410.6051054384018,165.04249599210755 474,155 C 537.3948945615982,144.95750400789245 606.8963374028857,101.03376495252189 662,97 C 717.1036625971143,92.96623504747811 757.8095449500555,128.8224441978049 808,139 C 858.1904550499445,149.1775558021951 917.8654827968921,133.67645825625848 969,136 C 1020.1345172031079,138.32354174374152 1062.7285238623751,158.47172277716118 1118,156 C 1173.2714761376249,153.52827722283882 1241.220421753607,128.43665063509678 1297,122 C 1352.779578246393,115.5633493649032 1396.3897891231964,127.78167468245161 1440,140 C 1440,140 1440,700 1440,700 Z"
              stroke="none"
              stroke-width="0"></path>
          <path
              class="transition-all duration-300 ease-in-out delay-150 path-1 wave-path"
              d="M 0,700 C 0,700 0,280 0,280 C 71.38458502898015,284.1913922801825 142.7691700579603,288.382784560365 189,302 C 235.2308299420397,315.617215439635 256.307904797139,338.6602540387224 303,331 C 349.692095202861,323.3397459612776 421.9992107534838,284.97619928474535 489,263 C 556.0007892465162,241.02380071525465 617.6952521889258,235.43494882229623 659,247 C 700.3047478110742,258.56505117770377 721.2197804908127,287.28400542606977 773,286 C 824.7802195091873,284.71599457393023 907.4256258478233,253.42902947342458 976,259 C 1044.5743741521767,264.5709705265754 1099.0777161178937,306.9998766802318 1146,309 C 1192.9222838821063,311.0001233197682 1232.2635096806018,272.571463805648 1280,261 C 1327.7364903193982,249.42853619435195 1383.8682451596992,264.714268097176 1440,280 C 1440,280 1440,700 1440,700 Z"
              stroke="none"
              stroke-width="0"></path>
          <path
              class="transition-all duration-300 ease-in-out delay-150 path-2 wave-path"
              d="M 0,700 C 0,700 0,420 0,420 C 44.289061536564304,411.6568257491676 88.57812307312861,403.31365149833516 145,389 C 201.4218769268714,374.68634850166484 269.9765692440498,354.4022197558269 323,372 C 376.0234307559502,389.5977802441731 413.515599950672,445.0774694783574 464,457 C 514.484400049328,468.9225305216426 577.9610309532617,437.28790233074363 643,431 C 708.0389690467383,424.71209766925637 774.6402762362808,443.7709211986682 823,441 C 871.3597237637192,438.2290788013318 901.4778641016155,413.6284128745837 955,418 C 1008.5221358983845,422.3715871254163 1085.4482673572575,455.7154273029967 1143,465 C 1200.5517326427425,474.2845726970033 1238.729066469355,459.5098779134295 1285,448 C 1331.270933530645,436.4901220865705 1385.6354667653225,428.24506104328526 1440,420 C 1440,420 1440,700 1440,700 Z"
              stroke="none"
              stroke-width="0"></path>
          <path
              class="transition-all duration-300 ease-in-out delay-150 path-3 wave-path"
              d="M 0,700 C 0,700 0,560 0,560 C 56.701442841287445,566.2378591688248 113.40288568257489,572.4757183376495 173,563 C 232.5971143174251,553.5242816623505 295.0899001109878,528.3349858182268 341,530 C 386.9100998890122,531.6650141817732 416.2375138734739,560.1843383894437 463,578 C 509.7624861265261,595.8156616105563 573.9600443951166,602.927660623998 629,604 C 684.0399556048834,605.072339376002 729.92230854606,600.105019114564 783,578 C 836.07769145394,555.894980885436 896.3507214206437,516.6522629177457 952,510 C 1007.6492785793563,503.3477370822543 1058.674805771365,529.2859292144532 1114,544 C 1169.325194228635,558.7140707855468 1228.9500554938957,562.2040202244419 1284,563 C 1339.0499445061043,563.7959797755581 1389.524972253052,561.897989887779 1440,560 C 1440,560 1440,700 1440,700 Z"
              stroke="none"
              stroke-width="0"></path>
        </svg>

        <div class="main-content-wrapper">
          <slot/>
        </div>
      </main>
    </div>
    <LayoutFooter/>
  </div>
</template>

<script lang="ts" setup>
// 初始动画加载器
// 是否加载中
const isInitialLoading = ref(true);

// 动态设置页面标题
const route = useRoute()
const appConfig = useAppConfig()
const menuItems = appConfig.menu.routes
const {t} = useI18n()

// 根据当前路由查找对应的页面名称
const getPageTitle = () => {
  for (const primaryItem of menuItems) {
    for (const secondaryItem of primaryItem.children) {
      if (secondaryItem.routePath === route.path && secondaryItem.nameKey) {
        const pageName = t(secondaryItem.nameKey)
        const siteName = t('layout.siteName')
        return `${pageName} - ${siteName}`
      }
    }
  }
  // 默认标题
  return t('layout.siteName')
}

useHead({
  title: computed(() => getPageTitle())
})

// 延迟隐藏加载器（2秒加载阶段 + 1秒揭幕阶段 = 约3秒）
onMounted(() => {
  const timer = setTimeout(() => {
    isInitialLoading.value = false;
  }, 3000);

  return () => clearTimeout(timer);
});

// 布局组件 - 主题初始化在 useTheme composable 中处理
const isDrawerOpen = ref(false)

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
  // 防止背景滚动
  if (isDrawerOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeDrawer = () => {
  isDrawerOpen.value = false
  document.body.style.overflow = ''
}

// 监听窗口大小变化，自动关闭抽屉
let resizeHandler: (() => void) | null = null

onMounted(() => {
  resizeHandler = () => {
    if (window.innerWidth > 768 && isDrawerOpen.value) {
      closeDrawer()
    }
  }
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
  // 清理body样式
  document.body.style.overflow = ''
})
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  background-color: var(--theme-bg-primary);
  display: flex;
  flex-direction: column;
  position: relative;
}

.app-header {
  position: fixed;
  top: 0;
  right: 0;
  height: 4.5rem;
  background-color: var(--theme-bg-secondary);
  border-bottom: 2px solid var(--theme-accent-color);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 2rem;
  z-index: 50;
  transition: all var(--transition-base);
  box-sizing: border-box;
  overflow: hidden;
}

/* 装饰背景 - 斜条纹 */
.header-bg-decorator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
      -45deg,
      transparent,
      transparent 13.9512529279%,
      var(--theme-decorative-overlay-medium) 0,
      var(--theme-decorative-overlay-medium) 36.0487470721%,
      transparent 0,
      transparent 63.9512529279%,
      var(--theme-decorative-overlay-medium) 0,
      var(--theme-decorative-overlay-medium) 86.0487470721%,
      transparent 0,
      transparent
  );
  background-size: 0.5rem 0.5rem;
  opacity: 0.5;
  pointer-events: none;
}

/* 左侧装饰条 */
.header-left-decoration {
  position: absolute;
  left: 0;
  top: 0;
  width: 0.375rem;
  height: 100%;
  background-color: var(--theme-accent-color);
  opacity: 0.8;
  box-shadow: 0 0 0.5rem var(--theme-accent-color);
}

.header-left-decoration::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
      -45deg,
      transparent,
      transparent 13.9512529279%,
      var(--theme-decorative-overlay-strong) 0,
      var(--theme-decorative-overlay-strong) 36.0487470721%,
      transparent 0,
      transparent 63.9512529279%,
      var(--theme-decorative-overlay-strong) 0,
      var(--theme-decorative-overlay-strong) 86.0487470721%,
      transparent 0,
      transparent
  );
  background-size: 0.5rem 0.5rem;
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

.header-controls {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  position: relative;
  z-index: 2;
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

.layout-content {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 4.5rem);
}

.main-content {
  flex: 1;
  padding: 2.5rem 3.75rem;
  margin-top: 1.2rem;
  background-color: var(--theme-bg-primary);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

/* 沙漠波纹曲线背景 */
.desert-bg {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-height: 100vh;
  pointer-events: none;
  z-index: 0;
  opacity: 0.2;
  transition: opacity var(--transition-base), stroke var(--transition-base);
  object-fit: contain;
}

/* 沙漠波纹路径颜色 - 支持主题切换 */
.desert-bg .wave-path.path-0 {
  fill: var(--wave-bg-color-0);
  transition: fill var(--transition-base);
}

.desert-bg .wave-path.path-1 {
  fill: var(--wave-bg-color-1);
  transition: fill var(--transition-base);
}

.desert-bg .wave-path.path-2 {
  fill: var(--wave-bg-color-2);
  transition: fill var(--transition-base);
}

.desert-bg .wave-path.path-3 {
  fill: var(--wave-bg-color-3);
  transition: fill var(--transition-base);
}

.desert-bg .desert-path {
  fill: none;
  stroke: var(--theme-accent-color);
  stroke-width: 0.4;
  opacity: 0.2;
  transition: stroke var(--transition-base), opacity var(--transition-base);
}

/* 密集区域的线条稍粗一些 */
.desert-bg .desert-path-dense {
  stroke-width: 0.5;
  opacity: 0.25;
}

/* 次要交叉线条更细更淡 */
.desert-bg .desert-path-subtle {
  stroke-width: 0.3;
  opacity: 0.15;
}

/* 确保内容在背景之上 */
.main-content-wrapper {
  position: relative;
  z-index: 1;
}


/* 汉堡包按钮 */
.hamburger-button {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--theme-bg-secondary);
  border: 2px solid var(--theme-accent-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  z-index: 200;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  box-shadow: 0 0 0.5rem var(--theme-shadow-accent-strong);
}

.hamburger-button:hover {
  background-color: var(--theme-bg-tertiary);
  box-shadow: 0 0 0.75rem var(--theme-accent-color);
}

.hamburger-button.active {
  background-color: var(--theme-accent-color);
}


.hamburger-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--theme-text-primary);
  transition: all var(--transition-base);
  flex-shrink: 0;
}

.hamburger-button.active .hamburger-icon {
  color: var(--theme-text-primary);
}

.hamburger-line {
  transition: all var(--transition-base);
  transform-origin: center;
}

.hamburger-button.active .hamburger-line-top {
  transform: translateY(6px) rotate(45deg);
}

.hamburger-button.active .hamburger-line-middle {
  opacity: 0;
}

.hamburger-button.active .hamburger-line-bottom {
  transform: translateY(-6px) rotate(-45deg);
}

/* 抽屉遮罩层 */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 150;
  animation: fadeIn var(--transition-base);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 小屏幕响应式 */
@media (max-width: 768px) {
  .hamburger-button {
    display: flex;
  }

  .app-header {
    left: 0;
    border-left: none;
    padding-left: 5rem; /* 为汉堡包按钮留出空间 */
    width: 100%;
    right: 0;
  }

  .header-left-decoration {
    display: none;
  }

  .layout-content {
    position: relative;
    width: 100%;
    /* 侧边栏使用fixed定位，已脱离文档流，不会影响flex布局 */
  }

  .main-content {
    margin-left: 0 !important;
    padding: 1.5rem;
    width: 100%;
    flex: 1;
  }

  /* 侧边栏在小屏幕下默认隐藏（通过Sidebar组件内部样式控制） */
}

/* 超小屏幕适配 */
@media (max-width: 480px) {
  .app-header {
    padding-left: 4rem; /* 减小padding以适应更小的汉堡包按钮 */
  }
}

@media (orientation: portrait) {
  .app-header {
    left: 0;
    border-left: none;
  }

  .header-left-decoration {
    display: none;
  }

  .main-content {
    margin-left: 0;
    padding: 1.5rem;
  }
}
</style>

