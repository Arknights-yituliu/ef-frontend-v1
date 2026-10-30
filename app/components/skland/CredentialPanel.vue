<template>
  <section class="skland-card">
    <div class="skland-card-head">
      <h3 class="skland-card-title">{{ t('page.sklandEndfield.credential.title') }}</h3>
      <v-btn v-if="hasCredential" color="error" size="small" variant="text" @click="emit('clear')">
        {{ t('page.sklandEndfield.credential.clear') }}
      </v-btn>
    </div>

    <v-alert v-if="hasCredential" class="mb-4" density="compact" type="success" variant="tonal">
      {{ t('page.sklandEndfield.credential.ready') }}
    </v-alert>

    <v-tabs v-model="activeTab" density="comfortable">
      <v-tab value="cred">{{ t('page.sklandEndfield.credential.tabs.cred') }}</v-tab>
      <v-tab value="hg">{{ t('page.sklandEndfield.credential.tabs.hg') }}</v-tab>
      <v-tab value="qr">{{ t('page.sklandEndfield.credential.tabs.qr') }}</v-tab>
    </v-tabs>

    <div class="tab-panel">
      <!-- 方式一：直接输入 cred（步骤式，参考 frontend-v2-plus） -->
      <div v-if="activeTab === 'cred'">
        <v-stepper
          v-model="credStep"
          class="skland-stepper"
          editable
          flat
          hide-actions
          :items="credStepTitles"
        >
          <template #item.1>
            <p class="tab-hint">{{ t('page.sklandEndfield.credential.credLoginHint') }}</p>
            <div class="tab-actions">
              <v-btn
                color="primary"
                href="https://www.skland.com/index"
                prepend-icon="mdi-open-in-new"
                rel="noopener noreferrer"
                target="_blank"
                variant="flat"
              >
                {{ t('page.sklandEndfield.credential.openCredPage') }}
              </v-btn>
              <v-btn variant="text" @click="credStep = 2">
                {{ t('page.sklandEndfield.credential.next') }}
              </v-btn>
            </div>
          </template>

          <template #item.2>
            <p class="tab-hint">{{ t('page.sklandEndfield.credential.consoleTip') }}</p>
            <v-alert class="command-box" color="primary" :icon="false" variant="tonal">
              <code>{{ CONSOLE_CODE }}</code>
            </v-alert>
            <div class="tab-actions">
              <v-btn color="primary" variant="flat" @click="copyText(CONSOLE_CODE, 'command')">
                {{
                  copiedKey === 'command'
                    ? t('page.sklandEndfield.credential.copied')
                    : t('page.sklandEndfield.credential.copyCommand')
                }}
              </v-btn>
              <v-btn variant="text" @click="credStep = 3">
                {{ t('page.sklandEndfield.credential.next') }}
              </v-btn>
            </div>
            <p class="tab-hint mt-3">{{ t('page.sklandEndfield.credential.pasteTip') }}</p>
          </template>

          <template #item.3>
            <v-textarea
              v-model="credInput"
              :disabled="submitting"
              :label="t('page.sklandEndfield.credential.credPlaceholder')"
              rows="3"
              variant="outlined"
            />
            <div class="tab-actions">
              <v-btn
                color="primary"
                :disabled="!credInput.trim()"
                :loading="submitting"
                variant="flat"
                @click="submitCred"
              >
                {{ t('page.sklandEndfield.credential.verify') }}
              </v-btn>
            </div>
          </template>
        </v-stepper>
      </div>

      <!-- 方式二：鹰角 token 换取（步骤式） -->
      <div v-else-if="activeTab === 'hg'">
        <v-stepper
          v-model="hgStep"
          class="skland-stepper"
          editable
          flat
          hide-actions
          :items="hgStepTitles"
        >
          <template #item.1>
            <p class="tab-hint">{{ t('page.sklandEndfield.credential.hgLoginHint') }}</p>
            <div class="tab-actions">
              <v-btn
                color="primary"
                href="https://ak.hypergryph.com/user/home"
                prepend-icon="mdi-open-in-new"
                rel="noopener noreferrer"
                target="_blank"
                variant="flat"
              >
                {{ t('page.sklandEndfield.credential.openHgSite') }}
              </v-btn>
              <v-btn variant="text" @click="hgStep = 2">
                {{ t('page.sklandEndfield.credential.next') }}
              </v-btn>
            </div>
          </template>

          <template #item.2>
            <p class="tab-hint">{{ t('page.sklandEndfield.credential.hgUrlTip') }}</p>
            <v-alert class="command-box" color="primary" :icon="false" variant="tonal">
              <code>{{ HG_ACCOUNT_INFO_URL }}</code>
            </v-alert>
            <div class="tab-actions">
              <v-btn
                color="primary"
                variant="outlined"
                @click="copyText(HG_ACCOUNT_INFO_URL, 'url')"
              >
                {{
                  copiedKey === 'url'
                    ? t('page.sklandEndfield.credential.copied')
                    : t('page.sklandEndfield.credential.copyUrl')
                }}
              </v-btn>
              <v-btn
                color="primary"
                :href="HG_ACCOUNT_INFO_URL"
                prepend-icon="mdi-open-in-new"
                rel="noopener noreferrer"
                target="_blank"
                variant="flat"
              >
                {{ t('page.sklandEndfield.credential.openUrl') }}
              </v-btn>
              <v-btn variant="text" @click="hgStep = 3">
                {{ t('page.sklandEndfield.credential.next') }}
              </v-btn>
            </div>
          </template>

          <template #item.3>
            <v-textarea
              v-model="hgInput"
              :disabled="submitting"
              :label="t('page.sklandEndfield.credential.hgPlaceholder')"
              rows="3"
              variant="outlined"
            />
            <div class="tab-actions">
              <v-btn
                color="primary"
                :disabled="!hgInput.trim()"
                :loading="submitting"
                variant="flat"
                @click="submitHg"
              >
                {{ t('page.sklandEndfield.credential.exchange') }}
              </v-btn>
            </div>
          </template>
        </v-stepper>
      </div>

      <!-- 方式三：扫码登录 -->
      <div v-else>
        <p class="tab-hint">{{ t('page.sklandEndfield.credential.qrHint') }}</p>
        <div class="qr-area">
          <div v-if="qrImage" class="qr-image-wrap">
            <img
              :alt="t('page.sklandEndfield.credential.tabs.qr')"
              class="qr-image"
              :src="qrImage"
            />
            <span class="qr-status">{{ qrStatusText }}</span>
          </div>
          <div v-else class="qr-placeholder">
            <v-icon icon="mdi-qrcode" size="56" />
            <span>{{ t('page.sklandEndfield.credential.qrEmpty') }}</span>
          </div>
        </div>
        <div class="tab-actions">
          <v-btn color="primary" :loading="qrLoading" variant="flat" @click="startQr">
            {{
              qrImage
                ? t('page.sklandEndfield.credential.qrRefresh')
                : t('page.sklandEndfield.credential.qrCreate')
            }}
          </v-btn>
        </div>
      </div>
    </div>

    <v-alert v-if="errorMessage" class="mt-4" density="compact" type="error" variant="tonal">
      {{ errorMessage }}
    </v-alert>
  </section>
</template>

<script lang="ts" setup>
import type { SklandCredential } from '@/shared/types/skland';
import QRCode from 'qrcode';
import { SklandApiError, useSkland } from '~/composables/useSkland';

defineProps<{
  /** 是否已持有可用凭证 */
  hasCredential: boolean;
}>();

const emit = defineEmits<{
  /** 成功获取凭证 */
  success: [credential: SklandCredential];
  /** 清除已持有的凭证 */
  clear: [];
}>();

const { t } = useI18n();
const { refreshTokenByCred, credFromHgToken, createQrSession, checkQrStatus } = useSkland();

/** 控制台一键复制 cred,token 的命令（与 frontend-v2-plus 一致） */
const CONSOLE_CODE =
  "copy(localStorage.getItem('SK_OAUTH_CRED_KEY')+','+localStorage.getItem('SK_TOKEN_CACHE_KEY')),console.log('已复制到粘贴板')";
/** 鹰角通行证账号信息接口地址 */
const HG_ACCOUNT_INFO_URL = 'https://web-api.hypergryph.com/account/info/hg';

/** 当前选中的获取方式 */
const activeTab = ref<'cred' | 'hg' | 'qr'>('cred');
/** 「直接输入」流程的当前步骤 */
const credStep = ref(1);
/** 「Token 换取」流程的当前步骤 */
const hgStep = ref(1);
/** 直接输入的 cred */
const credInput = ref('');
/** 鹰角通行证 token */
const hgInput = ref('');
/** 手动提交中的加载态 */
const submitting = ref(false);
/** 错误提示文案 */
const errorMessage = ref('');
/** 最近一次复制的项目标识，用于按钮反馈 */
const copiedKey = ref<'command' | 'url' | ''>('');
/** 复制反馈的重置定时器 */
let copiedTimer: ReturnType<typeof setTimeout> | null = null;

/** 「直接输入」流程的步骤标题 */
const credStepTitles = computed(() => [
  t('page.sklandEndfield.credential.credSteps.login'),
  t('page.sklandEndfield.credential.credSteps.fetch'),
  t('page.sklandEndfield.credential.credSteps.paste'),
]);
/** 「Token 换取」流程的步骤标题 */
const hgStepTitles = computed(() => [
  t('page.sklandEndfield.credential.hgSteps.login'),
  t('page.sklandEndfield.credential.hgSteps.fetch'),
  t('page.sklandEndfield.credential.hgSteps.paste'),
]);

/**
 * 复制文本到剪贴板，并在按钮上短暂显示「已复制」
 * @param text 待复制的文本
 * @param key 复制来源标识，用于区分按钮的反馈状态
 */
async function copyText(text: string, key: 'command' | 'url'): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    copiedKey.value = key;
    if (copiedTimer) {
      clearTimeout(copiedTimer);
    }
    copiedTimer = setTimeout(() => {
      copiedKey.value = '';
    }, 2000);
  } catch {
    errorMessage.value = t('common.copyFailed');
  }
}

/** 二维码图片（data URL） */
const qrImage = ref('');
/** 二维码生成中的加载态 */
const qrLoading = ref(false);
/** 扫码状态提示 */
const qrStatusText = ref('');
/** 当前扫码会话 ID */
const qrScanId = ref('');
/** 轮询定时器 */
let qrTimer: ReturnType<typeof setInterval> | null = null;

/**
 * 把异常转换成可展示的文案
 * @param error 捕获到的异常
 * @returns 错误文案
 */
function resolveError(error: unknown): string {
  if (error instanceof SklandApiError) {
    return error.message;
  }
  return t('page.sklandEndfield.requestFailed');
}

/**
 * 从输入内容中提取凭据
 * 支持两种粘贴格式：凭据字符串本身，或接口返回的整段 JSON（自动取 data.content，其次 data.token）
 * @param input 输入框原始内容
 * @returns 解析出的凭据；JSON 无法解析或缺少字段时返回空串
 */
function extractSecret(input: string): string {
  const text = input.trim();
  if (!text.startsWith('{')) {
    return text;
  }
  try {
    const parsed = JSON.parse(text) as { data?: { content?: unknown; token?: unknown } };
    const content = parsed.data?.content;
    if (typeof content === 'string' && content.trim()) {
      return content.trim();
    }
    const token = parsed.data?.token;
    return typeof token === 'string' ? token.trim() : '';
  } catch {
    return '';
  }
}

/**
 * 解析「直接输入」的内容，兼容三种粘贴格式：
 * 1. `cred,token`（森空岛网页 localStorage 复制，逗号分隔，匹配 frontend-v2-plus）
 * 2. 整段 JSON（取 data.content 作 cred、data.token 作 token）
 * 3. 仅 cred（后续用 auth/refresh 换取 token）
 * @param input 输入框原始内容
 * @returns cred 与可选的 token；无法解析时 cred 为空串
 */
function parseCredentialInput(input: string): { cred: string; token: string } {
  const text = input.trim();
  if (text.startsWith('{')) {
    try {
      const parsed = JSON.parse(text) as {
        data?: { content?: unknown; cred?: unknown; token?: unknown };
      };
      const data = parsed.data;
      const credRaw = typeof data?.content === 'string' ? data.content : data?.cred;
      const cred = typeof credRaw === 'string' ? credRaw.trim() : '';
      const token = typeof data?.token === 'string' ? data.token.trim() : '';
      return { cred, token };
    } catch {
      return { cred: '', token: '' };
    }
  }
  // 去除空白与引号后按逗号拆分，兼容从控制台复制的内容
  const cleaned = text.replace(/\s+/g, '').replace(/["']/g, '');
  const [cred = '', token = ''] = cleaned.split(',');
  return { cred, token };
}

/** 方式一：解析 cred/token，缺少 token 时用 cred 自动换取 */
async function submitCred(): Promise<void> {
  if (submitting.value) {
    return;
  }
  const { cred, token } = parseCredentialInput(credInput.value);
  if (!cred) {
    errorMessage.value = t('page.sklandEndfield.credential.credInvalid');
    return;
  }
  submitting.value = true;
  errorMessage.value = '';
  try {
    // 已附带 token 时直接使用，否则走 auth/refresh 换取
    const finalToken = token || (await refreshTokenByCred(cred));
    emit('success', { cred, token: finalToken });
    credInput.value = '';
  } catch (error) {
    errorMessage.value = resolveError(error);
  } finally {
    submitting.value = false;
  }
}

/** 方式二：用鹰角 token 换取凭证 */
async function submitHg(): Promise<void> {
  if (submitting.value) {
    return;
  }
  const hgToken = extractSecret(hgInput.value);
  if (!hgToken) {
    errorMessage.value = t('page.sklandEndfield.credential.hgInvalid');
    return;
  }
  submitting.value = true;
  errorMessage.value = '';
  try {
    const credential = await credFromHgToken(hgToken);
    emit('success', credential);
    hgInput.value = '';
  } catch (error) {
    errorMessage.value = resolveError(error);
  } finally {
    submitting.value = false;
  }
}

/** 停止扫码轮询 */
function stopQrPolling(): void {
  if (qrTimer) {
    clearInterval(qrTimer);
    qrTimer = null;
  }
}

/** 启动扫码轮询（约 2 秒一次） */
function startQrPolling(): void {
  stopQrPolling();
  qrTimer = setInterval(async () => {
    if (!qrScanId.value) {
      return;
    }
    try {
      const status = await checkQrStatus(qrScanId.value);
      if (status.status === 0 && status.cred && status.token) {
        stopQrPolling();
        qrStatusText.value = t('page.sklandEndfield.credential.qrSuccess');
        emit('success', { cred: status.cred, token: status.token });
        return;
      }
      if (status.msg) {
        qrStatusText.value = status.msg;
      }
    } catch (error) {
      // 单次轮询失败不中断流程，继续等待用户扫码
      errorMessage.value = resolveError(error);
    }
  }, 2000);
}

/** 方式三：生成（或刷新）登录二维码 */
async function startQr(): Promise<void> {
  if (qrLoading.value) {
    return;
  }
  stopQrPolling();
  qrLoading.value = true;
  errorMessage.value = '';
  qrImage.value = '';
  qrStatusText.value = '';
  try {
    const session = await createQrSession();
    qrScanId.value = session.scanId;
    qrImage.value = await QRCode.toDataURL(session.qrContent, { margin: 1, width: 220 });
    qrStatusText.value = t('page.sklandEndfield.credential.qrWaiting');
    startQrPolling();
  } catch (error) {
    errorMessage.value = resolveError(error);
  } finally {
    qrLoading.value = false;
  }
}

onBeforeUnmount(() => {
  stopQrPolling();
  if (copiedTimer) {
    clearTimeout(copiedTimer);
  }
});
</script>

<style scoped>
.skland-card {
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  border: 1px solid rgba(var(--v-border-color), 0.16);
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
}

.skland-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.skland-card-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}

.tab-panel {
  padding-top: 1rem;
}

.tab-hint {
  margin: 0 0 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.68);
  font-size: 0.875rem;
  line-height: 1.6;
  word-break: break-all;
}

.tab-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.skland-stepper {
  background: transparent;
  box-shadow: none;
}

.skland-stepper :deep(.v-stepper-header) {
  box-shadow: none;
}

.command-box code {
  display: block;
  font-size: 0.8125rem;
  line-height: 1.6;
  word-break: break-all;
  white-space: pre-wrap;
}

.qr-area {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.qr-image-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.qr-image {
  width: 220px;
  height: 220px;
  border: 1px solid rgba(var(--v-border-color), 0.16);
  border-radius: 8px;
}

.qr-status {
  color: rgba(var(--v-theme-on-surface), 0.68);
  font-size: 0.875rem;
}

.qr-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 220px;
  height: 220px;
  color: rgba(var(--v-theme-on-surface), 0.5);
  border: 1px dashed rgba(var(--v-border-color), 0.32);
  border-radius: 8px;
}
</style>
