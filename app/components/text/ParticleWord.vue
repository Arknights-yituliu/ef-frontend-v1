<template>
  <div class="particle-word-container" :class="className">
    <div class="particle-word-wrapper">
      <canvas
        ref="canvasRef"
        :width="CANVAS_WIDTH"
        :height="CANVAS_HEIGHT"
        class="particle-canvas"
      />
      <div
        v-if="!isLoaded"
        class="particle-loading"
        :style="{ color: textColor }"
      >
        {{ $t('common.particleLoading') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const {t} = useI18n()

// 画布尺寸
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 200;

// 动画设置
const ANIMATE_TIME = 30;
const OPACITY_STEP = 1 / ANIMATE_TIME;
const RADIUS = 40; // 鼠标交互半径
const INTENSITY = 0.95; // 排斥/吸引强度

interface ParticleData {
  x: number;
  y: number;
  color: number[];
}

class Particle {
  x: number;
  y: number;
  totalX: number;
  totalY: number;
  mx: number = 0;
  my: number = 0;
  vx: number = 0;
  vy: number = 0;
  time: number;
  r: number;
  color: number[];
  opacity: number;

  constructor(totalX: number, totalY: number, time: number, color: number[]) {
    this.x = Math.random() * CANVAS_WIDTH;
    this.y = Math.random() * CANVAS_HEIGHT;
    this.totalX = totalX;
    this.totalY = totalY;
    this.time = time;
    this.r = 1.2;
    this.color = [...color];
    this.opacity = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(${this.color.join(',')}, ${this.opacity})`;
    ctx.strokeStyle = `rgba(${this.color.join(',')}, ${this.opacity})`;
    ctx.fillRect(this.x, this.y, this.r * 2, this.r * 2);
  }

  update(mouseX?: number, mouseY?: number) {
    this.mx = this.totalX - this.x;
    this.my = this.totalY - this.y;
    this.vx = this.mx / this.time;
    this.vy = this.my / this.time;

    if (mouseX !== undefined && mouseY !== undefined && mouseX > 0 && mouseY > 0) {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx ** 2 + dy ** 2);

      if (distance < RADIUS) {
        let disPercent = RADIUS / distance;
        disPercent = disPercent > 7 ? 7 : disPercent;

        const angle = Math.atan2(dy, dx);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const repX = cos * disPercent * -INTENSITY;
        const repY = sin * disPercent * -INTENSITY;
        this.vx += repX;
        this.vy += repY;
      }
    }

    this.x += this.vx;
    this.y += this.vy;
    if (this.opacity < 1) this.opacity += OPACITY_STEP;
  }
}

class ParticleCanvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  particles: Particle[];
  mouseX: number = 0;
  mouseY: number = 0;
  animationId: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.particles = [];
    this.setupMouseEvents();
  }

  setupMouseEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouseX = 0;
      this.mouseY = 0;
    });
  }

  generateTextParticles(text: string, color: string = '#000000') {
    // 创建临时画布用于文本渲染
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCanvas.width = CANVAS_WIDTH;
    tempCanvas.height = CANVAS_HEIGHT;

    // 设置文本属性
    tempCtx.font = 'bold 100px Arial, sans-serif';
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';

    // 绘制文本
    tempCtx.fillText(text, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

    // 提取图像数据
    const imageData = tempCtx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const data = imageData.data;

    const particles: ParticleData[] = [];

    // 将颜色转换为RGB数组
    const rgbColor = hexToRGB(color);

    // 采样像素（每3个像素采样一次以提高性能）
    for (let y = 0; y < CANVAS_HEIGHT; y += 3) {
      for (let x = 0; x < CANVAS_WIDTH; x += 3) {
        const index = (x + y * CANVAS_WIDTH) * 4;
        const a = data[index + 3];

        // 只为可见像素创建粒子
        if (a !== undefined && a > 128) {
          particles.push({
            x,
            y,
            color: [...rgbColor]
          });
        }
      }
    }

    // 创建粒子实例
    this.particles = particles.map(
      particle => new Particle(particle.x, particle.y, ANIMATE_TIME, particle.color)
    );
  }

  animate() {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    this.particles.forEach(particle => {
      particle.update(this.mouseX, this.mouseY);
      particle.draw(this.ctx);
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

interface Props {
  text?: string;
  className?: string;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  text: t('common.siteName'),
  className: '',
  color: undefined
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const particleCanvasRef = ref<ParticleCanvas | null>(null);
const isLoaded = ref(false);

// 获取主题颜色
const textColor = computed(() => {
  if (props.color) {
    return props.color;
  }
  // 从CSS变量获取主题颜色
  if (typeof window !== 'undefined') {
    return getCSSVariableColor('--theme-accent-color');
  }
  return '#000000';
});

const initParticleCanvas = () => {
  if (canvasRef.value) {
    if (particleCanvasRef.value) {
      particleCanvasRef.value.destroy();
    }
    particleCanvasRef.value = new ParticleCanvas(canvasRef.value);
    
    const color = props.color || (typeof window !== 'undefined' ? getCSSVariableColor('--theme-accent-color') : '#000000');
    particleCanvasRef.value.generateTextParticles(props.text, color);
    particleCanvasRef.value.animate();
    isLoaded.value = true;
  }
};

onMounted(() => {
  initParticleCanvas();
});

onUnmounted(() => {
  if (particleCanvasRef.value) {
    particleCanvasRef.value.destroy();
  }
});

// 监听text和color变化
watch([() => props.text, () => props.color], () => {
  initParticleCanvas();
}, { flush: 'post' });

// 监听主题变化（通过监听data-theme属性变化）
let themeObserver: MutationObserver | null = null;

onMounted(() => {
  if (typeof window !== 'undefined') {
    themeObserver = new MutationObserver(() => {
      initParticleCanvas();
    });
    
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }
});

onUnmounted(() => {
  if (themeObserver) {
    themeObserver.disconnect();
    themeObserver = null;
  }
});
</script>

<style scoped>
.particle-word-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.particle-word-wrapper {
  position: relative;
}

.particle-canvas {
  border-radius: var(--radius-md);
  cursor: default;
  max-width: 100%;
  height: auto;
}

.particle-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

