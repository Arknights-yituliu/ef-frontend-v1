<template>
  <div class="particle-word-container">
    <div class="particle-word-wrapper">
      <canvas
        ref="canvasRef"
        :aria-label="text"
        class="particle-canvas"
        :height="CANVAS_HEIGHT"
        role="img"
        :width="CANVAS_WIDTH"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ColorInstance } from 'color';
import Color from 'color';
// 画布尺寸
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 120;

// 动画设置
const ANIMATE_TIME = 20;
const OPACITY_STEP = 1 / ANIMATE_TIME;
const RADIUS = 40; // 鼠标交互半径
const INTENSITY = 0.95; // 排斥/吸引强度
const VELOCITY_THRESHOLD = 0.01; // 速度阈值，低于此值认为粒子已稳定

interface ParticleData {
  x: number;
  y: number;
  color: ColorInstance;
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
  color: ColorInstance;
  opacity: number;

  constructor(totalX: number, totalY: number, time: number, color: ColorInstance) {
    this.x = Math.random() * CANVAS_WIDTH;
    this.y = Math.random() * CANVAS_HEIGHT;
    this.totalX = totalX;
    this.totalY = totalY;
    this.time = time;
    this.r = 1.2;
    this.color = color;
    this.opacity = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const colorString = this.color.alpha(this.opacity).string();
    ctx.fillStyle = colorString;
    ctx.strokeStyle = colorString;
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
      const distance = Math.hypot(dx, dy);

      if (distance < RADIUS) {
        let disPercent = RADIUS / distance;
        disPercent = Math.min(disPercent, 7);

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

  // 检查粒子是否稳定（速度接近0且接近目标位置）
  isSettled(): boolean {
    const dx = Math.abs(this.x - this.totalX);
    const dy = Math.abs(this.y - this.totalY);
    const speed = Math.hypot(this.vx, this.vy);
    return dx < 0.5 && dy < 0.5 && speed < VELOCITY_THRESHOLD && this.opacity >= 1;
  }
}

class ParticleCanvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  particles: Particle[];
  mouseX: number = 0;
  mouseY: number = 0;
  animationId: number = 0;
  isAnimating: boolean = false;
  mouseActive: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.particles = [];
    this.setupMouseEvents();
  }

  setupMouseEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      // 计算缩放比例：画布实际像素尺寸 / 显示尺寸
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;
      // 将鼠标坐标按比例缩放到画布的实际像素坐标
      this.mouseX = (e.clientX - rect.left) * scaleX;
      this.mouseY = (e.clientY - rect.top) * scaleY;

      // 鼠标移动时启动动画
      if (!this.mouseActive) {
        this.mouseActive = true;
        if (!this.isAnimating) {
          this.startAnimation();
        }
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouseX = 0;
      this.mouseY = 0;
      this.mouseActive = false;
    });
  }

  generateTextParticles(text: string, color: ColorInstance = Color('#000000')) {
    // 创建临时画布用于文本渲染
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCanvas.width = CANVAS_WIDTH;
    tempCanvas.height = CANVAS_HEIGHT;

    // 设置文本属性
    tempCtx.font = 'bold 72px Arial, sans-serif';
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';

    // 绘制文本
    tempCtx.fillText(text, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

    // 提取图像数据
    const imageData = tempCtx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const data = imageData.data;

    const particles: ParticleData[] = [];

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
            color: color,
          });
        }
      }
    }

    // 创建粒子实例
    this.particles = particles.map(
      (particle) => new Particle(particle.x, particle.y, ANIMATE_TIME, particle.color),
    );
  }

  startAnimation() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.animate();
    }
  }

  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = 0;
    }
    this.isAnimating = false;
  }

  animate() {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let allSettled = true;

    for (const particle of this.particles) {
      particle.update(this.mouseX, this.mouseY);
      particle.draw(this.ctx);

      // 检查是否有粒子还在移动
      if (!particle.isSettled()) {
        allSettled = false;
      }
    }

    // 如果鼠标不在活动状态且所有粒子都已稳定，停止动画
    if (!this.mouseActive && allSettled) {
      this.stopAnimation();
      return;
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.stopAnimation();
  }
}

interface Props {
  text: string;
}

const props = defineProps<Props>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const particleCanvasRef = ref<ParticleCanvas | null>(null);

function initParticleCanvas() {
  if (canvasRef.value) {
    if (particleCanvasRef.value) {
      particleCanvasRef.value.destroy();
    }
    particleCanvasRef.value = new ParticleCanvas(canvasRef.value);

    const color = Color(getComputedStyle(canvasRef.value).color);

    particleCanvasRef.value.generateTextParticles(props.text, color);
    particleCanvasRef.value.startAnimation();
  }
}

onMounted(() => {
  initParticleCanvas();
});

onUnmounted(() => {
  if (particleCanvasRef.value) {
    particleCanvasRef.value.destroy();
  }
});

// 监听 props 变化
watch(
  () => props.text,
  () => {
    initParticleCanvas();
  },
  { flush: 'post' },
);

// 监听主题变化（通过监听data-theme属性变化）
let themeObserver: MutationObserver | null = null;

onMounted(() => {
  if (typeof window !== 'undefined') {
    themeObserver = new MutationObserver(() => {
      initParticleCanvas();
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
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
  transform: scale(1.1);
  margin: 1rem;
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
</style>
