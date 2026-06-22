<template>
  <NuxtLayout name="default">
    <div class="error-page-container" :data-theme="theme">
      <div class="error-content-wrapper">
        <!-- 故障艺术效果 -->
        <div class="glitch-container">
          <h1 class="status-code">{{ errorInfo.code }}</h1>
          <div aria-hidden class="glitch-layer primary" :data-text="errorInfo.code">
            {{ errorInfo.code }}
          </div>
          <div aria-hidden class="glitch-layer secondary" :data-text="errorInfo.code">
            {{ errorInfo.code }}
          </div>
        </div>

        <!-- 核心文案区 -->
        <div class="info-card pa-6 pa-sm-10">
          <div class="card-header">
            <div class="header-line"></div>
            <div class="warning-tag">
              <v-icon class="mr-1" icon="mdi-alert-box" size="14" />
              {{ errorInfo.warningTag }}
            </div>
          </div>

          <h2 class="main-title">{{ errorInfo.mainTitle }}</h2>
          <h3 class="sub-title">{{ errorInfo.subTitle }}</h3>

          <div class="description-box">
            <p class="description-text" v-html="errorInfo.description"></p>
          </div>

          <div class="actions">
            <v-btn class="back-btn" size="large" variant="flat" @click="handleBackHome">
              <template #prepend>
                <v-icon icon="mdi-home" />
              </template>
              返回首页
            </v-btn>
            <v-btn
              class="repair-btn"
              size="large"
              variant="outlined"
              @click="showRepairDialog = true"
            >
              <template #prepend>
                <v-icon icon="mdi-wrench-outline" />
              </template>
              尝试修复
            </v-btn>
          </div>
        </div>
      </div>

      <!-- 修复确认对话框 -->
      <v-dialog v-model="showRepairDialog" content-class="repair-dialog-wrapper" max-width="480px">
        <v-card class="repair-card">
          <!-- 头部 -->
          <div class="repair-header">
            <div class="repair-header-left">
              <v-icon class="repair-header-icon" icon="mdi-wrench-outline" size="18" />
              <span class="repair-header-title">尝试修复 / ATTEMPT REPAIR</span>
            </div>
            <v-btn
              class="repair-close-btn"
              icon="mdi-close"
              size="small"
              variant="text"
              @click="showRepairDialog = false"
            />
          </div>

          <v-divider class="repair-divider" />

          <!-- 正文 -->
          <div class="repair-body">
            <p class="repair-msg">
              尝试清空本地存储或许能解决部分显示异常或运行时故障。 如果问题仍然存在，欢迎提交<button
                class="feedback-link"
                type="button"
                @click="showFeedbackModal = true"
              >
                反馈</button
              >，我们将协助您进一步排查。
            </p>

            <div class="repair-warning">
              <div class="repair-warning-header">
                <v-icon class="repair-warning-icon" icon="mdi-alert-outline" size="16" />
                <span class="repair-warning-label">请注意</span>
              </div>
              <p class="repair-warning-text">
                此操作将清空终末地一图流的本地存储数据，包括攒抽计算器、基质规划器等工具保存的个人设置。此操作不会影响其他网站，亦不会删除您的其他浏览器数据。
              </p>
            </div>
          </div>

          <v-divider class="repair-divider" />

          <!-- 底部按钮 -->
          <div class="repair-footer">
            <v-btn
              class="repair-cancel-btn"
              :disabled="isPurging"
              variant="text"
              @click="showRepairDialog = false"
            >
              取消
            </v-btn>
            <v-btn
              class="repair-execute-btn"
              :loading="isPurging"
              variant="flat"
              @click="handleRepair"
            >
              <template #prepend>
                <v-icon icon="mdi-delete-sweep" />
              </template>
              确认清空并刷新页面
            </v-btn>
          </div>
        </v-card>
      </v-dialog>

      <!-- 反馈渠道弹窗 -->
      <LayoutFeedbackModal v-model="showFeedbackModal" />

      <!-- 装饰性元素 -->
      <div aria-hidden class="side-decoration left d-none d-md-flex">
        <div class="line"></div>
        <span class="label">PROTOCOL: ENDFIELD_V1</span>
      </div>

      <div aria-hidden class="side-decoration right d-none d-md-flex">
        <div class="line"></div>
        <span class="label">S-ERROR: 0x00325799</span>
      </div>

      <div aria-hidden class="bottom-info">
        <span class="pulse-icon"></span>
        <span class="system-status">SYSTEM STATUS: INTERRUPTED</span>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const props = defineProps({
  error: {
    type: Object,
    default: () => ({ statusCode: 404, statusMessage: 'Not Found' }),
  },
});

const { theme } = useTheme();

// 修复对话框状态
const showRepairDialog = ref(false);
const showFeedbackModal = ref(false);
const isPurging = ref(false);

function handleRepair() {
  isPurging.value = true;
  // 小延迟让 UI 更新后再执行阻塞操作
  setTimeout(() => {
    try {
      localStorage.clear();
      showRepairDialog.value = false;
      isPurging.value = false;
      window.location.reload();
    } catch {
      isPurging.value = false;
    }
  }, 300);
}

// 根据错误码派生展示内容
const errorInfo = computed(() => {
  const code = props.error?.statusCode || 500;

  if (code === 404) {
    return {
      code,
      mainTitle: 'TERMINAL COMMUNICATION ERROR',
      subTitle: '终端协议通讯异常',
      description:
        '由于环境辐射干扰或协议地址偏移，系统无法定位您请求的数据包目标。<br />这可能是由于该坐标点尚未开放，或该协议已从当前版本中移除。',
      warningTag: 'LOST CONNECTION / 链路中断',
    };
  }

  return {
    code,
    mainTitle: 'CORE SYSTEM FAILURE',
    subTitle: props.error?.statusMessage || '核心系统运行故障',
    description:
      '检测到关键模块发生未预期的逻辑坍缩，核心服务暂时无法响应请求。<br />可能是由于服务器负载过载或后台数据处理异常，请稍后再试。',
    warningTag: 'SYSTEM CRITICAL / 系统崩溃',
  };
});

function handleBackHome() {
  clearError({ redirect: '/' });
}

// 动态页面标题
useHead({
  title: `${errorInfo.value.code} - ${errorInfo.value.subTitle}`,
});
</script>

<style scoped>
* {
  letter-spacing: 0 !important;
}

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
  color: #f9a825;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.main-title {
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0;
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
  gap: 0.75rem;
}

.back-btn {
  flex: 1;
  min-width: 0;
  background-color: var(--theme-text-primary) !important;
  color: var(--theme-bg-primary) !important;
  font-weight: 700;
  border-radius: 0;
  height: 52px !important;
  text-transform: none;
}

.repair-btn {
  flex: 1;
  min-width: 0;
  border-color: var(--theme-text-light) !important;
  color: var(--theme-text-primary) !important;
  font-weight: 600;
  border-radius: 0;
  height: 52px !important;
  text-transform: none;
  transition: all 0.3s;
}

.repair-btn:hover {
  background-color: var(--theme-decorative-overlay) !important;
  border-color: var(--theme-text-primary) !important;
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

@media (prefers-reduced-motion: reduce) {
  .glitch-layer.primary,
  .glitch-layer.secondary,
  .pulse-icon {
    animation: none;
    transform: none;
  }
}

.repair-dialog-wrapper .repair-card {
  background-color: var(--theme-bg-secondary) !important;
  border: 1px solid var(--theme-border) !important;
  border-radius: 0 !important;
  box-shadow: 0 16px 48px var(--theme-shadow-strong) !important;
}

.repair-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
}

.repair-header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.repair-header-icon {
  color: #f9a825 !important;
}

.repair-header-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--theme-text-primary);
}

.repair-close-btn {
  color: var(--theme-text-light) !important;
}

.repair-divider {
  border-color: var(--theme-border) !important;
  opacity: 0.5;
}

.repair-body {
  padding: 1.25rem;
}

.repair-msg {
  font-size: 0.9rem;
  line-height: 1.8;
  color: var(--theme-text-secondary);
  margin: 0 0 1rem 0;
}

.feedback-link {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  color: #f9a825;
  font-weight: 700;
  font-size: inherit;
  font-family: inherit;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: opacity 0.2s;
}

.feedback-link:hover {
  opacity: 0.8;
}

.repair-warning {
  background: rgba(249, 168, 37, 0.08);
  border: 1px solid rgba(249, 168, 37, 0.25);
  border-left: 3px solid #f9a825;
  padding: 0.85rem 1rem;
}

.repair-warning-header {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.4rem;
}

.repair-warning-icon {
  color: #f9a825 !important;
}

.repair-warning-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: #f9a825;
}

.repair-warning-text {
  font-size: 0.8rem;
  line-height: 1.7;
  color: var(--theme-text-secondary);
  margin: 0;
}

.repair-warning-text strong {
  color: var(--theme-text-primary);
}

.repair-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 0.85rem 1.25rem;
}

.repair-cancel-btn {
  color: var(--theme-text-light) !important;
  font-size: 0.85rem !important;
  font-weight: 500 !important;
}

.repair-execute-btn {
  background-color: #f9a825 !important;
  color: #1a1a1a !important;
  font-weight: 700 !important;
  font-size: 0.85rem !important;
  border-radius: 0;
  text-transform: none;
}
</style>
