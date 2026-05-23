<template>
  <NuxtLayout name="default">
    <div class="error-page-container" :data-theme="theme">
      <div class="error-content-wrapper">
        <!-- 404 故障艺术效果 -->
        <div class="glitch-container">
          <h1 class="status-code">404</h1>
          <div class="glitch-layer primary" data-text="404">404</div>
          <div class="glitch-layer secondary" data-text="404">404</div>
        </div>

        <!-- 核心文案区 -->
        <div class="info-card pa-6 pa-sm-10">
          <div class="card-header">
            <div class="header-line"></div>
            <div class="warning-tag">
              <v-icon class="mr-1" icon="mdi-alert-box" size="14" />
              LOST CONNECTION / 链路中断
            </div>
          </div>

          <h2 class="main-title">TERMINAL COMMUNICATION ERROR</h2>
          <h3 class="sub-title">终端协议通讯异常</h3>

          <div class="description-box">
            <p class="description-text">
              由于环境辐射干扰或协议地址偏移，系统无法定位您请求的数据包目标。<br />
              这可能是由于该坐标点尚未开放，或该协议已从当前版本中移除。
            </p>
          </div>

          <div class="actions">
            <v-btn class="back-btn" size="large" variant="flat" @click="handleBackHome">
              <template #prepend>
                <v-icon icon="mdi-home" />
              </template>
              返回首页
            </v-btn>
          </div>
        </div>
      </div>

      <!-- 装饰性元素 -->
      <div class="side-decoration left d-none d-md-flex">
        <div class="line"></div>
        <span class="label">PROTOCOL: ENDFIELD_V1</span>
      </div>

      <div class="side-decoration right d-none d-md-flex">
        <div class="line"></div>
        <span class="label">S-ERROR: 0x00325799</span>
      </div>

      <div class="bottom-info">
        <span class="pulse-icon"></span>
        <span class="system-status">SYSTEM STATUS: INTERRUPTED</span>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const _props = defineProps({
  error: {
    type: Object,
    default: () => ({ statusCode: 404, statusMessage: 'Not Found' }),
  },
});

const { theme } = useTheme();

function handleBackHome() {
  clearError({ redirect: '/' });
}

// 404 页面标题
useHead({
  title: '404 - 终端通讯异常',
});
</script>

<style scoped>
.error-page-container {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 4rem 1rem;
}

.error-content-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
}

/* Glitch Effect Styles */
.glitch-container {
  position: relative;
  margin-bottom: 2rem;
}

.status-code {
  font-size: clamp(6rem, 20vw, 10rem);
  font-weight: 900;
  margin: 0;
  line-height: 0.8;
  letter-spacing: -8px;
  color: var(--theme-text-primary);
  opacity: 0.1;
}

.glitch-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: clamp(6rem, 20vw, 10rem);
  font-weight: 900;
  line-height: 0.8;
  letter-spacing: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glitch-layer.primary {
  color: var(--theme-text-primary);
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  animation: glitch-anim-1 3.5s infinite linear alternate-reverse;
}

.glitch-layer.secondary {
  color: #f9a825;
  clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
  animation: glitch-anim-2 2s infinite linear alternate-reverse;
  opacity: 0.8;
}

@keyframes glitch-anim-1 {
  0% {
    transform: translate(0);
  }
  10% {
    transform: translate(-4px, 1px);
  }
  20% {
    transform: translate(2px, -1px);
  }
  30% {
    transform: translate(-2px, 2px);
  }
  45% {
    transform: translate(4px, -2px);
  }
  50% {
    transform: translate(0);
  }
  100% {
    transform: translate(0);
  }
}

@keyframes glitch-anim-2 {
  0% {
    transform: translate(0);
  }
  15% {
    transform: translate(5px, -2px);
  }
  30% {
    transform: translate(-5px, 2px);
  }
  45% {
    transform: translate(2px, 2px);
  }
  60% {
    transform: translate(0);
  }
  100% {
    transform: translate(0);
  }
}

/* Info Card Styles */
.info-card {
  width: 100%;
  max-width: 500px;
  background: var(--theme-bg-secondary);
  border: 1px solid var(--theme-border);
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px var(--theme-shadow-base);
}

.info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #f9a825;
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.header-line {
  width: 40px;
  height: 1px;
  background: var(--theme-text-light);
}

.warning-tag {
  font-size: 0.7rem;
  letter-spacing: 2px;
  color: #f9a825;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.main-title {
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: 1px;
}

.sub-title {
  font-size: 1.1rem;
  opacity: 0.8;
  margin: 0.25rem 0 1.5rem 0;
  font-weight: 500;
}

.description-box {
  padding: 1rem;
  background: var(--theme-bg-tertiary);
  margin-bottom: 2rem;
  border-left: 2px solid var(--theme-text-light);
}

.description-text {
  font-size: 0.9rem;
  line-height: 1.8;
  color: var(--theme-text-secondary);
  margin: 0;
}

.actions {
  display: flex;
  justify-content: center;
}

.back-btn {
  width: 100%;
  background-color: var(--theme-text-primary) !important;
  color: var(--theme-bg-primary) !important;
  font-weight: 700;
  letter-spacing: 2px;
  border-radius: 0;
  height: 52px !important;
  text-transform: none;
}

/* Decorations */
.side-decoration {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  opacity: 0.2;
}

.side-decoration.left {
  left: 1rem;
}
.side-decoration.right {
  right: 1rem;
}

.side-decoration .line {
  width: 1px;
  height: 10rem;
  background: linear-gradient(to bottom, transparent, var(--theme-text-primary), transparent);
}

.side-decoration .label {
  writing-mode: vertical-rl;
  font-size: 0.7rem;
  letter-spacing: 5px;
  font-weight: 300;
}

.bottom-info {
  position: absolute;
  bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  opacity: 0.5;
}

.pulse-icon {
  width: 8px;
  height: 8px;
  background-color: #ff3d00;
  border-radius: 50%;
  box-shadow: 0 0 10px #ff3d00;
  animation: pulse-red 2s infinite;
}

.system-status {
  font-size: 0.75rem;
  letter-spacing: 2px;
}

@keyframes pulse-red {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.4);
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
