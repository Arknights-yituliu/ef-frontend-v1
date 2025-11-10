<!-- 引入 Vue 相关 API -->
<script lang="ts" setup>
import {computed, nextTick, onMounted, ref, watch} from 'vue';
// 引入 GSAP 动画库
import {gsap} from 'gsap';

// 定义组件接收的 props 接口
interface Props {
  isLoading: boolean;  // 控制加载器是否显示
  loadingDuration?: number;  // 加载阶段持续时间，默认值在后面定义
}

// 设置 props 默认值
const props = withDefaults(defineProps<Props>(), {
  loadingDuration: 2000,  // 默认加载时间为 2000 毫秒
});

// 定义组件发出的事件
const emit = defineEmits<{
  (event: 'complete'): void;  // 完成动画时触发的事件
}>();

// 阶段管理：'loading' | 'reveal' | 'complete'
const stage = ref<'loading' | 'reveal' | 'complete'>('loading');

//这个变量不知道干啥的
const loadingPhaseRef = ref<HTMLDivElement | null>(null);  // 加载阶段容器引用

// 初始化所有阶段（同时准备加载和揭幕阶段）
const initAllPhases = () => {
  nextTick(() => {  // 在下次 DOM 更新后执行
    // 1. 先创建揭幕阶段的六边形（但动画暂停）
    createBlocks();  // 创建六边形矩阵

    // 2. 延迟一小段时间确保DOM已渲染，然后准备揭幕动画（暂停）
    setTimeout(() => {
      // 收集logo路径
      collectLogoPaths();  // 收集 Logo 路径元素
      prepareRevealAnimation();  // 准备揭幕动画

      // 3. 开始加载阶段的动画
      animateLogo();  // 启动 Logo 动画
      animateProgress();  // 启动进度条动画
    }, 50);  // 延迟 50 毫秒
  });
};

// 揭幕阶段相关
const containerRef = ref<SVGSVGElement | null>(null);  // 揭幕阶段 SVG 容器引用
const blocks = ref<SVGUseElement[]>([]);  // 六边形元素数组

const row = 15;  // 六边形网格行数
const line = 15;  // 六边形网格列数
// 创建六边形矩阵（揭幕阶段）
const createBlocks = () => {
  // 如果没有容器元素则返回
  if (!containerRef.value) return;

  // 清空现有内容（保留 defs）
  const existingGroups = containerRef.value.querySelectorAll('g');  // 查找所有 g 元素
  existingGroups.forEach(group => group.remove());  // 移除所有 g 元素
  blocks.value = [];  // 清空 blocks 数组

  // 创建六边形定义（如果不存在）
  let hexagonDef = containerRef.value.querySelector('#loading_hexagon');  // 查找已有的六边形定义
  if (!hexagonDef) {  // 如果不存在
    const defs = containerRef.value.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');  // 获取或创建 defs 元素
    hexagonDef = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');  // 创建多边形元素
    hexagonDef.setAttribute('id', 'loading_hexagon');  // 设置 ID
    hexagonDef.setAttribute('points', '0,-50 43.3,-25 43.3,25 0,50 -43.3,25 -43.3,-25');  // 设置顶点坐标
    // 支持主题变化
    hexagonDef.setAttribute('fill', 'var(--theme-hexagon-fill)');  // 设置填充颜色
    if (!containerRef.value.querySelector('defs')) {  // 如果没有 defs 元素
      containerRef.value.insertBefore(defs, containerRef.value.firstChild);  // 插入 defs 元素
    }
    containerRef.value.querySelector('defs')?.appendChild(hexagonDef);  // 添加六边形定义到 defs
  }

  // 创建六边形矩阵
  for (let l = 0; l < line; l++) {  // 遍历每一行
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');  // 创建 g 元素
    for (let r = 0; r < row; r++) {  // 遍历每一列
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');  // 创建 use 元素
      use.setAttribute('class', 'loading_block');  // 设置类名
      use.setAttribute('href', '#loading_hexagon');  // 引用六边形定义
      use.setAttribute('x', `${l % 2 ? 86.5 * r : 86.5 * r + 43.3}`);  // 设置 x 坐标，奇偶行错位排列
      use.setAttribute('y', `${74.5 * l}`);  // 设置 y 坐标
      use.setAttribute('transform-origin', '50 50');  // 设置变换原点
      g.appendChild(use);  // 添加 use 元素到 g 元素
      blocks.value.push(use);  // 添加到 blocks 数组
    }
    containerRef.value.appendChild(g);  // 添加 g 元素到容器
  }
};


// 加载阶段相关
const logoRef = ref<SVGSVGElement | null>(null);  // Logo SVG 元素引用
const logoPaths = ref<Array<SVGPathElement | SVGEllipseElement | SVGCircleElement>>([]);  // Logo 中所有路径元素


// 收集logo中的所有路径元素
const collectLogoPaths = () => {
  // 如果没有 Logo 元素则返回
  if (!logoRef.value) return;

  logoPaths.value = [];  // 清空路径数组
  // 收集所有 path 元素
  const paths = logoRef.value.querySelectorAll('path');  // 查找所有 path 元素
  paths.forEach((path) => {
    logoPaths.value.push(path);  // 添加到路径数组
  });
  // 收集所有 ellipse 元素
  const ellipses = logoRef.value.querySelectorAll('ellipse');  // 查找所有 ellipse 元素
  ellipses.forEach((ellipse) => {
    logoPaths.value.push(ellipse);  // 添加到路径数组
  });
  // 收集所有 circle 元素
  const circles = logoRef.value.querySelectorAll('circle');  // 查找所有 circle 元素
  circles.forEach((circle) => {
    logoPaths.value.push(circle);  // 添加到路径数组
  });
};

const revealTimeline = ref<gsap.core.Timeline | null>(null);  // GSAP 动画时间线
// 创建并准备揭幕阶段动画（暂停状态）
const prepareRevealAnimation = () => {
  // 如果 blocks 为空则返回
  if (blocks.value.length === 0) return;

  // 创建动画时间线，但立即暂停
  revealTimeline.value = gsap.timeline({
    paused: true,  // 初始状态为暂停
    onComplete: () => {  // 动画完成后的回调
      stage.value = 'complete';  // 设置阶段为 complete
      emit('complete');  // 发出 complete 事件
    },
  })
      .set(blocks.value, {  // 设置初始状态
        'stroke-dashoffset': () => (Math.random() > 0.5 ? -100 : 100),  // 随机设置虚线偏移量
      })
      .to(blocks.value, {  // 第一段动画
        'stroke-dashoffset': 0,  // 虚线偏移量归零
        'stroke-opacity': 1,  // 边框不透明度设为 1
        duration: 0.4,  // 动画持续时间
        ease: 'power4.out',  // 缓动函数
        stagger: {  // 错开动画
          from: 'random',  // 从随机位置开始
          each: 0.0015,  // 每个元素间隔 0.0015 秒
        },
      })
      .to(blocks.value, {  // 第二段动画
        scale: 0,  // 缩放至 0
        opacity: 0,  // 不透明度降至 0
        duration: 0.6,  // 动画持续时间
        ease: 'power2.out',  // 缓动函数
        stagger: {  // 错开动画
          from: 'center',  // 从中心开始
          each: 0.003,  // 每个元素间隔 0.003 秒
        },
      }, '<0.15');  // 在前一个动画结束前 0.15 秒开始
};

// Logo 线条逐步绘制动画
const animateLogo = () => {
  // 如果没有 Logo 元素或路径为空，则返回
  if (!logoRef.value || logoPaths.value.length === 0) return;

  // 为每个路径设置初始状态（完全隐藏）
  logoPaths.value.forEach((path) => {
    const length = path.getTotalLength();  // 获取路径总长度
    gsap.set(path, {
      strokeDasharray: length,  // 设置虚线长度等于路径长度
      strokeDashoffset: length,  // 设置偏移量使路径不可见
      opacity: 1,  // 保持不透明度为 1
    });
  });

  // 创建时间线，逐个绘制路径
  const drawTimeline = gsap.timeline();

  logoPaths.value.forEach((path, index) => {
    drawTimeline.to(
        path,
        {
          strokeDashoffset: 0,  // 将偏移量设为 0，使路径完全显示
          duration: 0.6,  // 动画持续时间
          ease: 'power2.out',  // 缓动函数
        },
        index * 0.1, // 每个路径间隔0.1秒开始
    );
  });
};

const progressCircleRef = ref<SVGCircleElement | null>(null);  // 进度圆环元素引用
// 环形进度条动画（可配置时长）
const animateProgress = () => {
  // 如果没有进度圆环或 Logo 元素，则返回
  if (!progressCircleRef.value || !logoRef.value) return;

  const circumference = 2 * Math.PI * 80; // 计算半径为 80 的圆周长
  progressCircleRef.value.style.strokeDasharray = `${circumference}`;  // 设置虚线长度
  progressCircleRef.value.style.strokeDashoffset = `${circumference}`;  // 设置初始偏移量

  // 创建时间线，同时动画进度条和透明度
  const progressTimeline = gsap.timeline({
    onComplete: () => {  // 动画完成后的回调
      // 停止logo绘制动画
      if (logoPaths.value.length > 0) {
        logoPaths.value.forEach((path) => {
          gsap.killTweensOf(path);  // 停止路径上的所有动画
        });
      }
      // 立即切换到揭幕阶段（移除加载阶段）并恢复动画播放
      stage.value = 'reveal';  // 切换阶段到 'reveal'
      if (revealTimeline.value) {
        revealTimeline.value.play();  // 播放揭幕动画
      }
    },
  });

  // 同时动画进度条和透明度
  progressTimeline
      .to(progressCircleRef.value, {
        strokeDashoffset: 0,  // 将偏移量设为 0，使进度条完全显示
        duration: Math.max(props.loadingDuration, 0) / 1000,  // 动画持续时间，单位转换为秒
        ease: 'power2.out',  // 缓动函数
      }, 0)  // 立即开始
      .to([logoRef.value, progressCircleRef.value], {
        opacity: 0,  // 设置透明度为 0
        duration: Math.max(props.loadingDuration, 0) / 1000,  // 动画持续时间，单位转换为秒
        ease: 'power2.out',  // 缓动函数
      }, 0);  // 与上一个动画同时开始
};

// 组件挂载时的钩子
onMounted(() => {
  if (props.isLoading) {  // 如果正在加载
    initAllPhases();  // 初始化所有阶段
  }
});

// 监听 isLoading 属性的变化
watch(() => props.isLoading, (newVal) => {
  if (newVal) {  // 如果变为加载状态
    stage.value = 'loading';  // 设置阶段为 loading
    // 清理之前的动画
    if (revealTimeline.value) {
      revealTimeline.value.kill();  // 停止并销毁时间线
      revealTimeline.value = null;  // 清空引用
    }
    initAllPhases();  // 重新初始化所有阶段
  }
});

// 计算是否显示加载阶段
const showLoadingPhase = computed(() => props.isLoading && stage.value === 'loading');
// 计算是否显示揭幕阶段（从一开始就渲染，但动画暂停）
const showRevealPhase = computed(() => props.isLoading && (stage.value === 'reveal' || stage.value === 'loading'));
</script>

<!-- 模板部分 -->
<template>
  <!-- 使用 fade 过渡效果包装整个加载器 -->
  <Transition name="fade">
    <!-- 如果正在加载则显示加载器 -->
    <div v-if="isLoading" class="initial-loader">
      <!-- 加载阶段 -->
      <div v-if="showLoadingPhase" ref="loadingPhaseRef" class="loading-phase">
        <!-- Logo -->
        <div class="logo-container">
          <!-- Logo SVG 元素 -->
          <svg
              ref="logoRef"
              class="logo-svg"
              fill="none"
              height="32.25199890136719"
              viewBox="0 0 46.20566463470459 32.25199890136719"
              width="46.20566463470459"
              xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Logo 的第一个路径元素 -->
            <g>
              <path
                  class="logo-path"
                  d="M14.4413 32.252L32.1293 32.252L32.1293 28.908L25.6613 28.908L25.6613 0L22.5813 0C20.8213 1.012 18.7533 1.76 15.8933 2.288L15.8933 4.84L21.6573 4.84L21.6573 28.908L14.4413 28.908L14.4413 32.252Z"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
              />
            </g>
            <!-- Logo 的椭圆元素 -->
            <ellipse
                class="logo-path"
                cx="22.978261089520018"
                cy="24.629596248131953"
                rx="23.408917522625487"
                ry="4.41759826229211"
                stroke="currentColor"
                stroke-width="2"
                transform="rotate(-19.614696980142693 -0.43065643310546875 20.211997985839844)"
            />
            <!-- Logo 的圆形元素 -->
            <circle
                class="logo-path"
                cx="37.06934356689453"
                cy="15.711997985839844"
                r="3.5"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.5"
            />
            <!-- Logo 的第二个椭圆元素 -->
            <ellipse
                class="logo-path"
                cx="37.51921338448104"
                cy="13.823112653989034"
                rx="7.999996847005453"
                ry="1.383430647153096"
                stroke="currentColor"
                stroke-width="1"
                transform="rotate(12.416193091380716 29.519216537475586 12.439682006835938)"
            />
            <!-- Logo 的第二个路径元素 -->
            <path
                class="logo-path"
                d="M8.56934 8.712L6.7411 8.04025L6.06934 6.212L5.39759 8.04025L3.56934 8.712L5.39759 9.38375L6.06934 11.212L6.7411 9.38375L8.56934 8.712Z"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
            />
            <!-- Logo 的第三个路径元素 -->
            <path
                class="logo-path"
                d="M41.5693 25.712L39.7411 25.0402L39.0693 23.212L38.3976 25.0402L36.5693 25.712L38.3976 26.3837L39.0693 28.212L39.7411 26.3837L41.5693 25.712Z"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
            />
          </svg>
          <!-- 环形进度条 -->
          <div class="progress-ring-container">
            <div class="progress-ring-pattern"></div>  <!-- 斜条纹背景装饰 -->
            <!-- 进度条 SVG 元素 -->
            <svg class="progress-ring" viewBox="0 0 200 200">
              <defs>
                <!-- 进度条发光滤镜 -->
                <filter id="progress-glow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>  <!-- 高斯模糊 -->
                  <feOffset dx="0" dy="0" result="offsetblur"/>  <!-- 偏移 -->
                  <feComponentTransfer>
                    <feFuncA slope="0.5" type="linear"/>  <!-- 透明度调整 -->
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode/>  <!-- 合并节点 -->
                    <feMergeNode in="SourceGraphic"/>  <!-- 合并原始图形 -->
                  </feMerge>
                </filter>
              </defs>
              <!-- 外圈装饰 -->
              <circle
                  class="progress-outer"
                  cx="100"
                  cy="100"
                  fill="none"
                  r="85"
                  stroke-width="2"
              />
              <!-- 背景圆环 -->
              <circle
                  class="progress-bg"
                  cx="100"
                  cy="100"
                  fill="none"
                  r="80"
                  stroke-width="4"
              />
              <!-- 进度圆环 -->
              <circle
                  ref="progressCircleRef"
                  class="progress-circle"
                  cx="100"
                  cy="100"
                  fill="none"
                  r="80"
                  stroke-width="4"
              />
              <!-- 内圈装饰 -->
              <circle
                  class="progress-inner"
                  cx="100"
                  cy="100"
                  fill="none"
                  r="75"
                  stroke-width="1"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- 揭幕阶段（从一开始就渲染，但动画暂停） -->
      <div v-if="showRevealPhase" :class="{ 'reveal-active': stage === 'reveal' }" class="reveal-phase">
        <!-- 揭幕阶段 SVG 容器 -->
        <svg ref="containerRef" class="reveal-svg" viewBox="0 0 1000 1000">
          <defs>
            <!-- 六边形定义 -->
            <polygon
                id="loading_hexagon"
                fill="var(--theme-loader-bg)"
                points="0,-50 43.3,-25 43.3,25 0,50 -43.3,25 -43.3,-25"
            />
          </defs>
        </svg>
      </div>
    </div>
  </Transition>
</template>

<!-- 样式部分 -->
<style scoped>
.initial-loader {
  position: fixed;  /* 固定定位 */
  top: 0;  /* 上边界 */
  left: 0;  /* 左边界 */
  width: 100vw;  /* 宽度占满视窗 */
  height: 100vh;  /* 高度占满视窗 */
  display: flex;  /* 弹性布局 */
  justify-content: center;  /* 水平居中 */
  align-items: center;  /* 垂直居中 */
  z-index: 9999;  /* 高层级 */
  overflow: hidden;  /* 隐藏溢出内容 */
}

/* 加载阶段 */
.loading-phase {
  position: absolute;  /* 绝对定位 */
  top: 0;  /* 上边界 */
  left: 0;  /* 左边界 */
  width: 100%;  /* 宽度 100% */
  height: 100%;  /* 高度 100% */
  display: flex;  /* 弹性布局 */
  justify-content: center;  /* 水平居中 */
  align-items: center;  /* 垂直居中 */
  background-color: var(--theme-loader-bg);  /* 背景颜色 */
  transition: background-color var(--transition-base);  /* 背景颜色过渡 */
  z-index: 2;  /* 层级 */
}

.logo-container {
  position: relative;  /* 相对定位 */
  display: flex;  /* 弹性布局 */
  justify-content: center;  /* 水平居中 */
  align-items: center;  /* 垂直居中 */
}

.logo-svg {
  width: 8rem;  /* 宽度 */
  height: auto;  /* 高度自适应 */
  color: var(--logo-color);  /* 颜色 */
  transition: color var(--transition-base);  /* 颜色过渡 */
  z-index: 2;  /* 层级 */
}

.logo-path {
  fill: none;  /* 不填充 */
  opacity: 1;  /* 不透明度 */
  stroke-dasharray: 0;  /* 虚线长度 */
  stroke-dashoffset: 0;  /* 虚线偏移量 */
}

/* 进度条容器 */
.progress-ring-container {
  position: absolute;  /* 绝对定位 */
  width: 14rem;  /* 宽度 */
  height: 14rem;  /* 高度 */
  top: 50%;  /* 上边界 */
  left: 50%;  /* 左边界 */
  transform: translate(-50%, -50%);  /* 居中 */
  z-index: 1;  /* 层级 */
}

/* 斜条纹背景装饰 */
.progress-ring-pattern {
  position: absolute;  /* 绝对定位 */
  top: 0;  /* 上边界 */
  left: 0;  /* 左边界 */
  width: 100%;  /* 宽度 */
  height: 100%;  /* 高度 */
  border-radius: 50%;  /* 圆角 */
  background-image: linear-gradient(  /* 渐变背景 */
      -45deg,
      transparent,
      transparent 13.9512529279%,
      var(--theme-progress-color) 0,
      var(--theme-progress-color) 36.0487470721%,
      transparent 0,
      transparent 63.9512529279%,
      var(--theme-progress-color) 0,
      var(--theme-progress-color) 86.0487470721%,
      transparent 0,
      transparent
  );
  background-size: 0.5rem 0.5rem;  /* 背景大小 */
  background-repeat: repeat;  /* 背景重复 */
  opacity: 0.08;  /* 不透明度 */
  pointer-events: none;  /* 不响应鼠标事件 */
}

.progress-ring {
  position: absolute;  /* 绝对定位 */
  width: 100%;  /* 宽度 */
  height: 100%;  /* 高度 */
  top: 0;  /* 上边界 */
  left: 0;  /* 左边界 */
}

/* 浅色主题：使用灰色阴影 */
.progress-ring {
  filter: drop-shadow(0 0 0.5rem rgba(0, 0, 0, 0.15));  /* 投影效果 */
}

/* 深色主题：使用黄色阴影 */
[data-theme="dark"] .progress-ring {
  filter: drop-shadow(0 0 0.5rem rgba(255, 250, 0, 0.3));  /* 深色主题投影效果 */
}

.progress-outer {
  stroke: var(--theme-progress-color);  /* 描边颜色 */
  opacity: 0.2;  /* 不透明度 */
  transition: stroke var(--transition-base), opacity var(--transition-base);  /* 过渡效果 */
}

.progress-bg {
  stroke: var(--theme-progress-bg);  /* 描边颜色 */
  opacity: 0.25;  /* 不透明度 */
  transition: stroke var(--transition-base), opacity var(--transition-base);  /* 过渡效果 */
}

.progress-circle {
  stroke: var(--theme-progress-color);  /* 描边颜色 */
  stroke-linecap: round;  /* 线帽样式 */
  stroke-linejoin: round;  /* 线连接样式 */
  transform: rotate(-90deg);  /* 旋转 */
  transform-origin: center;  /* 变换原点 */
  filter: url(#progress-glow);  /* 应用滤镜 */
  transition: stroke var(--transition-base);  /* 过渡效果 */
}

.progress-inner {
  stroke: var(--theme-progress-color);  /* 描边颜色 */
  opacity: 0.15;  /* 不透明度 */
  transition: stroke var(--transition-base), opacity var(--transition-base);  /* 过渡效果 */
}

/* 揭幕阶段 */
.reveal-phase {
  position: absolute;  /* 绝对定位 */
  inset: 0;  /* 上下左右边界为 0 */
  display: flex;  /* 弹性布局 */
  justify-content: center;  /* 水平居中 */
  align-items: center;  /* 垂直居中 */
  /* 在loading阶段时，隐藏在加载阶段下方且不可见 */
  z-index: 1;  /* 层级 */
  opacity: 0;  /* 不透明度 */
  pointer-events: none;  /* 不响应鼠标事件 */
}

/* 当切换到reveal阶段时，显示在上方并可见 */
.reveal-phase.reveal-active {
  z-index: 2;  /* 层级 */
  opacity: 1;  /* 不透明度 */
  pointer-events: auto;  /* 响应鼠标事件 */
}

/* 预防svg高度不够 */
@media (max-width: 940px) {
  .reveal-svg {
    transform: scale(2.5);  /* 缩放 */
  }
}

.loading_block {
  stroke: var(--theme-loader-bg);  /* 描边颜色 */
  stroke-width: 0.8;  /* 描边宽度 */
  stroke-dasharray: 100;  /* 虚线长度 */
  stroke-opacity: 0;  /* 描边不透明度 */
  transition: stroke var(--transition-base);  /* 过渡效果 */
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;  /* 透明度过渡 */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;  /* 不透明度为 0 */
}
</style>
