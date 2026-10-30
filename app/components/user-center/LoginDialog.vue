<template>
  <v-dialog v-model="model" max-width="480px" persistent>
    <v-card class="login-card">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-bold">{{ title }}</span>
        <v-btn icon="mdi-close" size="small" variant="text" @click="close" />
      </v-card-title>

      <v-tabs v-model="activeTab" class="login-tabs" color="primary" density="comfortable" grow>
        <v-tab value="password">{{ t('component.userCenter.login.tabs.password') }}</v-tab>
        <v-tab value="code">{{ t('component.userCenter.login.tabs.code') }}</v-tab>
        <v-tab value="register">{{ t('component.userCenter.login.tabs.register') }}</v-tab>
      </v-tabs>

      <v-card-text>
        <v-alert v-if="errorMessage" class="mb-4" density="compact" type="error" variant="tonal">
          {{ errorMessage }}
        </v-alert>

        <v-window v-model="activeTab">
          <!-- 密码登录 -->
          <v-window-item value="password">
            <v-form ref="passwordFormRef" @submit.prevent="submitPasswordLogin">
              <v-text-field
                v-model="passwordForm.account"
                autocomplete="username"
                :label="t('component.userCenter.login.fields.account')"
                :rules="[requiredRule]"
                variant="outlined"
              />
              <v-text-field
                v-model="passwordForm.password"
                autocomplete="current-password"
                :label="t('component.userCenter.login.fields.password')"
                :rules="[requiredRule]"
                type="password"
                variant="outlined"
              />
            </v-form>
            <div class="d-flex justify-end">
              <v-btn class="text-none px-0" size="small" variant="text" @click="switchTab('reset')">
                {{ t('component.userCenter.login.forgotPassword') }}
              </v-btn>
            </div>
          </v-window-item>

          <!-- 邮箱验证码登录 -->
          <v-window-item value="code">
            <v-form ref="codeFormRef" @submit.prevent="submitCodeLogin">
              <v-text-field
                v-model="codeForm.email"
                autocomplete="email"
                :label="t('component.userCenter.login.fields.email')"
                :rules="[requiredRule, emailRule]"
                type="email"
                variant="outlined"
              />
              <div class="code-field">
                <v-text-field
                  v-model="codeForm.code"
                  :label="t('component.userCenter.login.fields.code')"
                  :rules="[requiredRule, codeRule]"
                  variant="outlined"
                />
                <v-btn
                  class="code-btn"
                  :disabled="codeCountdown > 0"
                  :loading="isSendingCode"
                  variant="tonal"
                  @click="handleSendCode('login')"
                >
                  {{
                    codeCountdown > 0
                      ? `${codeCountdown}s`
                      : t('component.userCenter.login.sendCode')
                  }}
                </v-btn>
              </div>
            </v-form>
          </v-window-item>

          <!-- 注册 -->
          <v-window-item value="register">
            <v-form ref="registerFormRef" @submit.prevent="submitRegister">
              <v-text-field
                v-model="registerForm.userName"
                autocomplete="username"
                :hint="t('component.userCenter.login.hints.userName')"
                :label="t('component.userCenter.login.fields.userName')"
                persistent-hint
                :rules="[requiredRule, userNameRule]"
                variant="outlined"
              />
              <v-text-field
                v-model="registerForm.nickname"
                :label="t('component.userCenter.login.fields.nickname')"
                :rules="[nicknameRule]"
                variant="outlined"
              />
              <v-text-field
                v-model="registerForm.email"
                autocomplete="email"
                :label="t('component.userCenter.login.fields.email')"
                :rules="[requiredRule, emailRule]"
                type="email"
                variant="outlined"
              />
              <div class="code-field">
                <v-text-field
                  v-model="registerForm.code"
                  :label="t('component.userCenter.login.fields.code')"
                  :rules="[requiredRule, codeRule]"
                  variant="outlined"
                />
                <v-btn
                  class="code-btn"
                  :disabled="codeCountdown > 0"
                  :loading="isSendingCode"
                  variant="tonal"
                  @click="handleSendCode('register')"
                >
                  {{
                    codeCountdown > 0
                      ? `${codeCountdown}s`
                      : t('component.userCenter.login.sendCode')
                  }}
                </v-btn>
              </div>
              <v-text-field
                v-model="registerForm.password"
                autocomplete="new-password"
                :hint="t('component.userCenter.login.hints.password')"
                :label="t('component.userCenter.login.fields.password')"
                persistent-hint
                :rules="[requiredRule, passwordRule]"
                type="password"
                variant="outlined"
              />
            </v-form>
          </v-window-item>

          <!-- 找回密码 -->
          <v-window-item value="reset">
            <v-form ref="resetFormRef" @submit.prevent="submitReset">
              <v-text-field
                v-model="resetForm.account"
                :hint="t('component.userCenter.login.hints.resetAccount')"
                :label="t('component.userCenter.login.fields.account')"
                persistent-hint
                :rules="[requiredRule]"
                variant="outlined"
              />
              <div class="code-field">
                <v-text-field
                  v-model="resetForm.code"
                  :label="t('component.userCenter.login.fields.code')"
                  :rules="[requiredRule, codeRule]"
                  variant="outlined"
                />
                <v-btn
                  class="code-btn"
                  :disabled="codeCountdown > 0"
                  :loading="isSendingCode"
                  variant="tonal"
                  @click="handleSendResetCode"
                >
                  {{
                    codeCountdown > 0
                      ? `${codeCountdown}s`
                      : t('component.userCenter.login.sendCode')
                  }}
                </v-btn>
              </div>
              <v-text-field
                v-model="resetForm.newPassword"
                autocomplete="new-password"
                :hint="t('component.userCenter.login.hints.password')"
                :label="t('component.userCenter.login.fields.newPassword')"
                persistent-hint
                :rules="[requiredRule, passwordRule]"
                type="password"
                variant="outlined"
              />
            </v-form>
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn variant="text" @click="close">{{ t('common.cancel') }}</v-btn>
        <v-btn color="primary" :loading="isSubmitting" variant="flat" @click="submitCurrentTab">
          {{
            activeTab === 'register'
              ? t('component.userCenter.login.register')
              : activeTab === 'reset'
                ? t('component.userCenter.login.resetPassword')
                : t('component.userCenter.login.submit')
          }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { UcCodeUsage } from '@/shared/types/userCenter';
import { UcApiError } from '~/composables/useUserCenter';

/** 弹窗显隐（由父组件 v-model 控制） */
const model = defineModel({ required: true, type: Boolean });

const emit = defineEmits<{
  /** 登录或注册成功 */
  success: [];
}>();

const { t } = useI18n();
const { sendCode, loginByPassword, loginByEmail, register, sendResetCode, resetPassword } =
  useUserCenter();

/** 当前展示的 Tab */
type LoginTab = 'password' | 'code' | 'register' | 'reset';
const activeTab = ref<LoginTab>('password');

const passwordFormRef = ref();
const codeFormRef = ref();
const registerFormRef = ref();
const resetFormRef = ref();

const passwordForm = reactive({ account: '', password: '' });
const codeForm = reactive({ email: '', code: '' });
const registerForm = reactive({ userName: '', nickname: '', email: '', code: '', password: '' });
const resetForm = reactive({ account: '', code: '', newPassword: '' });

const errorMessage = ref('');
const isSubmitting = ref(false);
const isSendingCode = ref(false);
/** 验证码重发倒计时（秒） */
const codeCountdown = ref(0);

let countdownTimer: ReturnType<typeof setInterval> | undefined;

const title = computed(() => {
  if (activeTab.value === 'register') {
    return t('component.userCenter.login.tabs.register');
  }
  if (activeTab.value === 'reset') {
    return t('component.userCenter.login.resetTitle');
  }
  return t('component.userCenter.login.title');
});

/** 必填校验 */
function requiredRule(value: string) {
  return Boolean(value && value.trim()) || t('component.userCenter.login.validation.required');
}

/** 邮箱格式校验 */
function emailRule(value: string) {
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value ?? '') ||
    t('component.userCenter.login.validation.email')
  );
}

/** 验证码为 6 位数字 */
function codeRule(value: string) {
  return /^\d{6}$/.test(value ?? '') || t('component.userCenter.login.validation.code');
}

/** 用户名：3-20 位字母、数字或下划线 */
function userNameRule(value: string) {
  return (
    /^[A-Za-z0-9_]{3,20}$/.test(value ?? '') || t('component.userCenter.login.validation.userName')
  );
}

/** 密码：6-32 位字母、数字或 @_ */
function passwordRule(value: string) {
  return (
    /^[A-Za-z0-9@_]{6,32}$/.test(value ?? '') || t('component.userCenter.login.validation.password')
  );
}

/** 昵称可选，填写时最多 24 位中文、字母或数字 */
function nicknameRule(value: string) {
  return (
    !value ||
    /^[\u4E00-\u9FA5A-Za-z0-9]{1,24}$/.test(value) ||
    t('component.userCenter.login.validation.nickname')
  );
}

/**
 * 启动验证码发送倒计时
 */
function startCountdown(): void {
  codeCountdown.value = 60;
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    codeCountdown.value -= 1;
    if (codeCountdown.value <= 0) {
      clearInterval(countdownTimer);
    }
  }, 1000);
}

/** 切换 Tab 时清理错误提示 */
function switchTab(tab: LoginTab): void {
  activeTab.value = tab;
  errorMessage.value = '';
}

/**
 * 统一的错误文案转换：优先展示服务端 msg，网络异常给出通用提示
 * @param error 捕获到的异常
 */
function resolveErrorMessage(error: unknown): string {
  if (error instanceof UcApiError) {
    return error.message;
  }
  return t('component.userCenter.login.validation.failed');
}

/**
 * 发送邮箱验证码（登录/注册场景）
 * @param usage 验证码用途
 */
async function handleSendCode(usage: UcCodeUsage): Promise<void> {
  errorMessage.value = '';
  const email = usage === 'register' ? registerForm.email : codeForm.email;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorMessage.value = t('component.userCenter.login.validation.email');
    return;
  }

  isSendingCode.value = true;
  try {
    await sendCode(email, usage);
    startCountdown();
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
  } finally {
    isSendingCode.value = false;
  }
}

/** 发送重置密码验证码（服务端发往账号已绑定邮箱） */
async function handleSendResetCode(): Promise<void> {
  errorMessage.value = '';
  if (!resetForm.account.trim()) {
    errorMessage.value = t('component.userCenter.login.validation.required');
    return;
  }

  isSendingCode.value = true;
  try {
    await sendResetCode(resetForm.account.trim());
    startCountdown();
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
  } finally {
    isSendingCode.value = false;
  }
}

/**
 * 执行操作并统一处理加载态与错误提示
 * @param action 实际的异步业务逻辑
 * @param onSuccess 成功后的回调
 */
async function runAction(action: () => Promise<void>, onSuccess?: () => void): Promise<void> {
  errorMessage.value = '';
  isSubmitting.value = true;
  try {
    await action();
    onSuccess?.();
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
  } finally {
    isSubmitting.value = false;
  }
}

/** 完成登录后的收尾：关闭弹窗并通知父组件 */
function finishLogin(): void {
  model.value = false;
  emit('success');
}

/** 提交密码登录 */
async function submitPasswordLogin(): Promise<void> {
  const { valid } = (await passwordFormRef.value?.validate()) ?? { valid: false };
  if (!valid) {
    return;
  }

  const account = passwordForm.account.trim();
  await runAction(async () => {
    // 含 @ 视为邮箱登录，否则按用户名登录
    if (account.includes('@')) {
      await loginByPassword({
        accountType: 'password',
        email: account,
        password: passwordForm.password,
      });
    } else {
      await loginByPassword({
        accountType: 'password',
        userName: account,
        password: passwordForm.password,
      });
    }
  }, finishLogin);
}

/** 提交邮箱验证码登录 */
async function submitCodeLogin(): Promise<void> {
  const { valid } = (await codeFormRef.value?.validate()) ?? { valid: false };
  if (!valid) {
    return;
  }

  await runAction(
    () =>
      loginByEmail({
        accountType: 'email',
        email: codeForm.email.trim(),
        verificationCode: codeForm.code.trim(),
      }).then(() => undefined),
    finishLogin,
  );
}

/** 提交注册 */
async function submitRegister(): Promise<void> {
  const { valid } = (await registerFormRef.value?.validate()) ?? { valid: false };
  if (!valid) {
    return;
  }

  await runAction(
    () =>
      register({
        userName: registerForm.userName.trim(),
        nickname: registerForm.nickname.trim() || undefined,
        email: registerForm.email.trim(),
        code: registerForm.code.trim(),
        password: registerForm.password,
      }).then(() => undefined),
    finishLogin,
  );
}

/** 提交重置密码 */
async function submitReset(): Promise<void> {
  const { valid } = (await resetFormRef.value?.validate()) ?? { valid: false };
  if (!valid) {
    return;
  }

  await runAction(async () => {
    await resetPassword(resetForm.account.trim(), resetForm.code.trim(), resetForm.newPassword);
    // 重置成功后服务端已清空全部会话，回到密码登录并保留账号
    passwordForm.account = resetForm.account.trim();
    resetForm.code = '';
    resetForm.newPassword = '';
    switchTab('password');
    errorMessage.value = t('component.userCenter.login.resetSuccess');
  });
}

/** 按当前 Tab 触发对应提交逻辑 */
function submitCurrentTab(): void {
  switch (activeTab.value) {
    case 'password': {
      submitPasswordLogin();

      break;
    }
    case 'code': {
      submitCodeLogin();

      break;
    }
    case 'register': {
      submitRegister();

      break;
    }
    default: {
      submitReset();
    }
  }
}

/** 关闭弹窗并重置临时状态 */
function close(): void {
  model.value = false;
  errorMessage.value = '';
}

onBeforeUnmount(() => {
  clearInterval(countdownTimer);
});
</script>

<style scoped>
.login-card {
  border: 1px solid var(--theme-border);
  background-color: var(--theme-bg-secondary);
  box-shadow: 0 0 1rem var(--theme-shadow-base);
}

.login-tabs {
  border-bottom: 1px solid var(--theme-border);
}

.code-field {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.code-field :deep(.v-input) {
  flex: 1;
}

.code-btn {
  height: 3.5rem;
  min-width: 6.5rem;
  text-transform: none;
}
</style>
