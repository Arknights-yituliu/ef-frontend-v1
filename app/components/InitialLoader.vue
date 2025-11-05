<script lang="ts" setup>
import {computed, nextTick, onMounted, ref, watch} from 'vue';
import {gsap} from 'gsap';

interface Props {
  isLoading: boolean;
}

const props = defineProps<Props>();

// 阶段管理：'loading' | 'reveal' | 'complete'
const stage = ref<'loading' | 'reveal' | 'complete'>('loading');

// 加载阶段相关
const logoRef = ref<SVGSVGElement | null>(null);
const progressCircleRef = ref<SVGCircleElement | null>(null);
const loadingPhaseRef = ref<HTMLDivElement | null>(null);

// 揭幕阶段相关
const containerRef = ref<SVGSVGElement | null>(null);
const blocks = ref<SVGUseElement[]>([]);
const revealTimeline = ref<gsap.core.Timeline | null>(null);

const row = 15;
const line = 15;

// Logo 3D旋转动画（使用2D变换模拟3D效果）
const animateLogo = () => {
  if (!logoRef.value) return;

  // 创建随机旋转动画（搞笑风格）
  const randomRotation = () => {
    // 使用2D旋转和缩放来模拟3D效果
    const rotation = (Math.random() - 0.5) * 360;
    const scaleX = 0.8 + Math.random() * 0.4; // 0.8-1.2
    const scaleY = 0.8 + Math.random() * 0.4;
    const skewX = (Math.random() - 0.5) * 20; // -10到10度
    const skewY = (Math.random() - 0.5) * 20;
    return {rotation, scaleX, scaleY, skewX, skewY};
  };

  // 连续随机旋转动画
  const rotate = () => {
    const transform = randomRotation();
    gsap.to(logoRef.value, {
      rotation: transform.rotation,
      scaleX: transform.scaleX,
      scaleY: transform.scaleY,
      skewX: transform.skewX,
      skewY: transform.skewY,
      duration: 0.8 + Math.random() * 0.4,
      ease: 'elastic.out(1, 0.5)',
      onComplete: rotate,
    });
  };

  // 开始动画
  gsap.set(logoRef.value, {
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    transformOrigin: 'center center',
  });

  rotate();
};

// 环形进度条动画（2秒）
const animateProgress = () => {
  if (!progressCircleRef.value || !logoRef.value) return;

  const circumference = 2 * Math.PI * 80; // radius = 80
  progressCircleRef.value.style.strokeDasharray = `${circumference}`;
  progressCircleRef.value.style.strokeDashoffset = `${circumference}`;

  // 创建时间线，同时动画进度条和透明度
  const progressTimeline = gsap.timeline({
    onComplete: () => {
      // 停止logo旋转动画
      if (logoRef.value) {
        gsap.killTweensOf(logoRef.value);
      }
      // 立即切换到揭幕阶段（移除加载阶段）并恢复动画播放
      stage.value = 'reveal';
      if (revealTimeline.value) {
        revealTimeline.value.play();
      }
    },
  });

  // 同时动画进度条和透明度
  progressTimeline
    .to(progressCircleRef.value, {
      strokeDashoffset: 0,
      duration: 2,
      ease: 'power2.out',
    }, 0)
    .to([logoRef.value, progressCircleRef.value], {
      opacity: 0,
      duration: 2,
      ease: 'power2.out',
    }, 0);
};

// 创建六边形矩阵（揭幕阶段）
const createBlocks = () => {
  if (!containerRef.value) return;

  // 清空现有内容（保留 defs）
  const existingGroups = containerRef.value.querySelectorAll('g');
  existingGroups.forEach(group => group.remove());
  blocks.value = [];

  // 创建六边形定义（如果不存在）
  let hexagonDef = containerRef.value.querySelector('#loading_hexagon');
  if (!hexagonDef) {
    const defs = containerRef.value.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    hexagonDef = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    hexagonDef.setAttribute('id', 'loading_hexagon');
    hexagonDef.setAttribute('points', '0,-50 43.3,-25 43.3,25 0,50 -43.3,25 -43.3,-25');
    // 使用CSS变量支持主题化
    hexagonDef.setAttribute('fill', 'var(--theme-hexagon-fill)');
    if (!containerRef.value.querySelector('defs')) {
      containerRef.value.insertBefore(defs, containerRef.value.firstChild);
    }
    containerRef.value.querySelector('defs')?.appendChild(hexagonDef);
  }

  // 创建六边形矩阵
  for (let l = 0; l < line; l++) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    for (let r = 0; r < row; r++) {
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('class', 'loading_block');
      use.setAttribute('href', '#loading_hexagon');
      use.setAttribute('x', `${l % 2 ? 86.5 * r : 86.5 * r + 43.3}`);
      use.setAttribute('y', `${74.5 * l}`);
      use.setAttribute('transform-origin', '50 50');
      g.appendChild(use);
      blocks.value.push(use);
    }
    containerRef.value.appendChild(g);
  }
};

// 创建并准备揭幕阶段动画（暂停状态）
const prepareRevealAnimation = () => {
  if (blocks.value.length === 0) return;

  // 创建动画时间线，但立即暂停
  revealTimeline.value = gsap.timeline({
    paused: true,
    onComplete: () => {
      stage.value = 'complete';
    },
  })
      .set(blocks.value, {
        'stroke-dashoffset': () => (Math.random() > 0.5 ? -100 : 100),
      })
      .to(blocks.value, {
        'stroke-dashoffset': 0,
        'stroke-opacity': 1,
        duration: 0.4,
        ease: 'power4.out',
        stagger: {
          from: 'random',
          each: 0.0015,
        },
      })
      .to(blocks.value, {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: {
          from: 'center',
          each: 0.003,
        },
      }, '<0.15');
};

// 初始化所有阶段（同时准备加载和揭幕阶段）
const initAllPhases = () => {
  nextTick(() => {
    // 1. 先创建揭幕阶段的六边形（但动画暂停）
    createBlocks();

    // 2. 延迟一小段时间确保DOM已渲染，然后准备揭幕动画（暂停）
    setTimeout(() => {
      prepareRevealAnimation();

      // 3. 开始加载阶段的动画
      animateLogo();
      animateProgress();
    }, 50);
  });
};

onMounted(() => {
  if (props.isLoading) {
    initAllPhases();
  }
});

watch(() => props.isLoading, (newVal) => {
  if (newVal) {
    stage.value = 'loading';
    // 清理之前的动画
    if (revealTimeline.value) {
      revealTimeline.value.kill();
      revealTimeline.value = null;
    }
    initAllPhases();
  }
});

// 计算是否显示加载阶段
const showLoadingPhase = computed(() => props.isLoading && stage.value === 'loading');
// 计算是否显示揭幕阶段（从一开始就渲染，但动画暂停）
const showRevealPhase = computed(() => props.isLoading && (stage.value === 'reveal' || stage.value === 'loading'));
</script>

<template>
  <Transition name="fade">
    <div v-if="isLoading" class="initial-loader">
      <!-- 加载阶段 -->
      <div v-if="showLoadingPhase" ref="loadingPhaseRef" class="loading-phase">
        <!-- Logo -->
        <div class="logo-container">
          <svg
              ref="logoRef"
              class="logo-svg"
              fill="none"
              height="32.25199890136719"
              viewBox="0 0 46.20566463470459 32.25199890136719"
              width="46.20566463470459"
              xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path
                  d="M14.4413 32.252L32.1293 32.252L32.1293 28.908L25.6613 28.908L25.6613 0L22.5813 0C20.8213 1.012 18.7533 1.76 15.8933 2.288L15.8933 4.84L21.6573 4.84L21.6573 28.908L14.4413 28.908L14.4413 32.252Z"
                  fill="currentColor"
              />
            </g>
            <ellipse
                cx="22.978261089520018"
                cy="24.629596248131953"
                rx="23.408917522625487"
                ry="4.41759826229211"
                stroke="currentColor"
                stroke-width="2"
                transform="rotate(-19.614696980142693 -0.43065643310546875 20.211997985839844)"
            />
            <circle cx="37.06934356689453" cy="15.711997985839844" fill="currentColor" r="3.5"/>
            <ellipse
                cx="37.51921338448104"
                cy="13.823112653989034"
                rx="7.999996847005453"
                ry="1.383430647153096"
                stroke="currentColor"
                stroke-width="1"
                transform="rotate(12.416193091380716 29.519216537475586 12.439682006835938)"
            />
            <path
                d="M8.56934 8.712L6.7411 8.04025L6.06934 6.212L5.39759 8.04025L3.56934 8.712L5.39759 9.38375L6.06934 11.212L6.7411 9.38375L8.56934 8.712Z"
                fill="currentColor"
            />
            <path
                d="M41.5693 25.712L39.7411 25.0402L39.0693 23.212L38.3976 25.0402L36.5693 25.712L38.3976 26.3837L39.0693 28.212L39.7411 26.3837L41.5693 25.712Z"
                fill="currentColor"
            />
          </svg>
          <!-- 环形进度条 -->
          <svg class="progress-ring" viewBox="0 0 200 200">
            <circle
                class="progress-bg"
                cx="100"
                cy="100"
                fill="none"
                r="80"
                stroke-width="3"
            />
            <circle
                ref="progressCircleRef"
                class="progress-circle"
                cx="100"
                cy="100"
                fill="none"
                r="80"
                stroke-width="3"
            />
          </svg>
        </div>
      </div>

      <!-- 揭幕阶段（从一开始就渲染，但动画暂停） -->
      <div v-if="showRevealPhase" :class="{ 'reveal-active': stage === 'reveal' }" class="reveal-phase">
        <svg ref="containerRef" class="loading" viewBox="0 0 1000 1000">
          <defs>
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

<style scoped>
.initial-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden;
}

/* 加载阶段 */
.loading-phase {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--theme-loader-bg);
  transition: background-color var(--transition-base);
  z-index: 2;
}

.logo-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-svg {
  width: 8rem;
  height: auto;
  color: var(--logo-color);
  transition: color var(--transition-base);
  transform-style: preserve-3d;
  perspective: 1000px;
  z-index: 2;
}

.progress-ring {
  position: absolute;
  width: 12rem;
  height: 12rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.progress-bg {
  stroke: var(--theme-progress-bg);
  opacity: 0.3;
  transition: stroke var(--transition-base);
}

.progress-circle {
  stroke: var(--theme-progress-color);
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke var(--transition-base);
}

/* 揭幕阶段 */
.reveal-phase {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 在loading阶段时，隐藏在加载阶段下方且不可见 */
  z-index: 1;
  opacity: 0;
  pointer-events: none;
}

/* 当切换到reveal阶段时，显示在上方并可见 */
.reveal-phase.reveal-active {
  z-index: 2;
  opacity: 1;
  pointer-events: auto;
}

.loading {
  width: 100%;
  height: auto;
}

.loading_block {
  stroke: var(--theme-loader-bg);
  stroke-width: 0.8;
  stroke-dasharray: 100;
  stroke-opacity: 0;
  transition: stroke var(--transition-base);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>