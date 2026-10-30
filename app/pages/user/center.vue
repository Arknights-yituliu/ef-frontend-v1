<template>
  <v-container>
    <div class="page-content">
      <!-- 未登录 -->
      <section v-if="!isLoggedIn" class="uc-card uc-card--empty">
        <v-icon class="empty-icon" icon="mdi-account-lock-outline" size="48" />
        <p class="empty-text">{{ t('page.userCenter.loginRequired') }}</p>
        <v-btn color="primary" variant="flat" @click="openLoginDialog">
          {{ t('component.userCenter.entry.login') }}
        </v-btn>
      </section>

      <template v-else>
        <!-- 个人信息展示 -->
        <section class="uc-card">
          <div class="profile-head">
            <v-avatar class="profile-avatar" size="4.5rem">
              <img v-if="profile?.avatar" :alt="displayName" :src="profile.avatar" />
              <span v-else>{{ avatarText }}</span>
            </v-avatar>
            <div class="profile-head-info">
              <h2 class="profile-name">{{ displayName }}</h2>
              <v-chip :color="isBanned ? 'error' : 'success'" size="small" variant="tonal">
                {{
                  isBanned ? t('page.userCenter.status.banned') : t('page.userCenter.status.normal')
                }}
              </v-chip>
            </div>
            <v-btn
              class="ml-auto"
              color="error"
              prepend-icon="mdi-logout"
              variant="tonal"
              @click="handleLogout"
            >
              {{ t('component.userCenter.entry.logout') }}
            </v-btn>
          </div>

          <v-alert v-if="isBanned" class="mt-4" density="compact" type="error" variant="tonal">
            {{ t('page.userCenter.banned') }}
          </v-alert>

          <!-- 加载状态 -->
          <div v-if="profileLoading" class="profile-status">
            <v-progress-circular indeterminate size="22" />
            <span>{{ t('common.loading') }}</span>
          </div>

          <!-- 加载失败（空状态） -->
          <div v-else-if="!profile" class="profile-status">
            <span>{{ t('page.userCenter.requestFailed') }}</span>
            <v-btn size="small" variant="text" @click="loadProfile">
              {{ t('common.retry') }}
            </v-btn>
          </div>

          <!-- 标签-值布局 -->
          <dl v-else class="info-grid">
            <div v-for="item in infoItems" :key="item.label" class="info-item">
              <dt class="info-label">{{ item.label }}</dt>
              <dd class="info-value" :class="{ 'info-value--muted': item.muted }">
                {{ item.value }}
              </dd>
            </div>
          </dl>
        </section>

        <!-- 资料编辑 -->
        <section class="uc-card">
          <h3 class="uc-card-title">{{ t('page.userCenter.profile.title') }}</h3>
          <v-form ref="profileFormRef" @submit.prevent="submitProfile">
            <v-text-field
              v-model="profileForm.nickname"
              :label="t('page.userCenter.profile.nickname')"
              :rules="[nicknameRule]"
              variant="outlined"
            />
            <v-text-field
              v-model="profileForm.avatar"
              :hint="t('page.userCenter.profile.avatarHint')"
              :label="t('page.userCenter.profile.avatar')"
              persistent-hint
              :rules="[avatarRule]"
              variant="outlined"
            />
            <div class="form-actions">
              <v-btn
                color="primary"
                :disabled="!isProfileDirty"
                :loading="profileSaving"
                type="submit"
                variant="flat"
              >
                {{ t('page.userCenter.profile.save') }}
              </v-btn>
            </div>
          </v-form>
        </section>

        <!-- 邮箱修改 -->
        <section class="uc-card">
          <h3 class="uc-card-title">{{ t('page.userCenter.email.title') }}</h3>

          <dl class="info-grid info-grid--single">
            <div class="info-item">
              <dt class="info-label">{{ t('page.userCenter.email.current') }}</dt>
              <dd class="info-value" :class="{ 'info-value--muted': !profile?.email }">
                {{ profile?.email || t('page.userCenter.email.notBound') }}
              </dd>
            </div>
          </dl>

          <!-- 未绑定：绑定邮箱 -->
          <v-form v-if="!profile?.email" ref="bindEmailFormRef" @submit.prevent="submitBindEmail">
            <v-text-field
              v-model="bindEmailForm.email"
              :label="t('page.userCenter.email.newEmail')"
              :rules="[requiredRule, emailRule]"
              type="email"
              variant="outlined"
            />
            <v-text-field
              v-model="bindEmailForm.confirmEmail"
              :label="t('page.userCenter.email.confirmEmail')"
              :rules="[requiredRule, bindConfirmEmailRule]"
              type="email"
              variant="outlined"
            />
            <div class="code-field">
              <v-text-field
                v-model="bindEmailForm.code"
                :label="t('page.userCenter.email.code')"
                :rules="[requiredRule, codeRule]"
                variant="outlined"
              />
              <v-btn
                class="code-btn"
                :disabled="bindCountdown > 0"
                :loading="sendingBindCode"
                variant="tonal"
                @click="handleSendBindCode"
              >
                {{ bindCountdown > 0 ? `${bindCountdown}s` : t('page.userCenter.email.sendCode') }}
              </v-btn>
            </div>
            <div class="form-actions">
              <v-btn color="primary" :loading="bindEmailSubmitting" type="submit" variant="flat">
                {{ t('page.userCenter.email.bind') }}
              </v-btn>
            </div>
          </v-form>

          <!-- 已绑定：换绑邮箱 -->
          <v-form v-else ref="changeEmailFormRef" @submit.prevent="submitChangeEmail">
            <v-text-field
              v-model="changeEmailForm.newEmail"
              :label="t('page.userCenter.email.newEmail')"
              :rules="[requiredRule, newEmailRule]"
              type="email"
              variant="outlined"
            />
            <v-text-field
              v-model="changeEmailForm.confirmEmail"
              :label="t('page.userCenter.email.confirmEmail')"
              :rules="[requiredRule, changeConfirmEmailRule]"
              type="email"
              variant="outlined"
            />
            <div class="code-field">
              <v-text-field
                v-model="changeEmailForm.oldCode"
                :label="t('page.userCenter.email.oldCode')"
                :rules="[requiredRule, codeRule]"
                variant="outlined"
              />
              <v-btn
                class="code-btn"
                :disabled="oldCodeCountdown > 0"
                :loading="sendingOldCode"
                variant="tonal"
                @click="handleSendChangeEmailCode"
              >
                {{
                  oldCodeCountdown > 0
                    ? `${oldCodeCountdown}s`
                    : t('page.userCenter.email.sendToCurrent')
                }}
              </v-btn>
            </div>
            <div class="code-field">
              <v-text-field
                v-model="changeEmailForm.newCode"
                :label="t('page.userCenter.email.newCode')"
                :rules="[requiredRule, codeRule]"
                variant="outlined"
              />
              <v-btn
                class="code-btn"
                :disabled="newCodeCountdown > 0"
                :loading="sendingNewCode"
                variant="tonal"
                @click="handleSendNewEmailCode"
              >
                {{
                  newCodeCountdown > 0
                    ? `${newCodeCountdown}s`
                    : t('page.userCenter.email.sendToNew')
                }}
              </v-btn>
            </div>
            <p class="uc-card-hint">{{ t('page.userCenter.email.changeHint') }}</p>
            <div class="form-actions">
              <v-btn color="primary" :loading="changeEmailSubmitting" type="submit" variant="flat">
                {{ t('page.userCenter.email.change') }}
              </v-btn>
            </div>
          </v-form>
        </section>

        <!-- 修改密码 -->
        <section class="uc-card">
          <h3 class="uc-card-title">{{ t('page.userCenter.password.title') }}</h3>
          <v-form ref="passwordFormRef" @submit.prevent="submitPassword">
            <v-text-field
              v-model="passwordForm.oldPassword"
              autocomplete="current-password"
              :label="t('page.userCenter.password.old')"
              :rules="[requiredRule]"
              type="password"
              variant="outlined"
            />
            <v-text-field
              v-model="passwordForm.newPassword"
              autocomplete="new-password"
              :hint="t('component.userCenter.login.hints.password')"
              :label="t('page.userCenter.password.new')"
              persistent-hint
              :rules="[requiredRule, passwordRule]"
              type="password"
              variant="outlined"
            />
            <v-text-field
              v-model="passwordForm.confirmPassword"
              autocomplete="new-password"
              :label="t('page.userCenter.password.confirm')"
              :rules="[requiredRule, confirmRule]"
              type="password"
              variant="outlined"
            />
            <div class="form-actions">
              <v-btn color="primary" type="submit" variant="flat">
                {{ t('page.userCenter.password.submit') }}
              </v-btn>
            </div>
          </v-form>
        </section>
      </template>

      <v-snackbar v-model="showSnackbar" :color="snackbarColor" :timeout="2400">
        {{ snackbarText }}
      </v-snackbar>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { dateFormat } from '@/shared/utils/dateUtil';
import { UcApiError } from '~/composables/useUserCenter';

definePageMeta({
  layout: 'default',
});

const { t } = useI18n();
const router = useRouter();

usePageSeo({
  title: () => `${t('page.userCenter.title')} - ${t('layout.siteName')}`,
  description: () => t('page.userCenter.description'),
  robots: 'noindex, nofollow',
});

const {
  uid,
  profile,
  isLoggedIn,
  openLoginDialog,
  fetchProfile,
  updateProfile,
  changePassword,
  sendCode,
  bindEmail,
  sendChangeEmailCode,
  changeEmail,
  logout,
} = useUserCenter();

/** 显示名：优先昵称 */
const displayName = computed(
  () => profile.value?.nickname || t('component.userCenter.entry.unknownUser'),
);
/** 头像缺省字符 */
const avatarText = computed(() => displayName.value.slice(0, 1).toUpperCase());
/** 账号是否处于封禁状态（status 小于 0 表示已封禁） */
const isBanned = computed(() => Boolean(profile.value) && (profile.value?.status ?? 1) < 0);

/** 个人信息展示项：覆盖资料接口返回的全部字段 */
const infoItems = computed(() => {
  const current = profile.value;
  if (!current) {
    return [];
  }
  return [
    { label: t('page.userCenter.fields.nickname'), value: current.nickname || '-' },
    { label: t('page.userCenter.fields.uid'), value: String(current.uid ?? uid.value ?? '-') },
    {
      label: t('page.userCenter.fields.email'),
      value: current.email || t('page.userCenter.email.notBound'),
      muted: !current.email,
    },
    {
      label: t('page.userCenter.fields.status'),
      value:
        current.status < 0
          ? t('page.userCenter.status.banned')
          : t('page.userCenter.status.normal'),
    },
    { label: t('page.userCenter.fields.registerTime'), value: formatTime(current.registerTime) },
    { label: t('page.userCenter.fields.lastLoginTime'), value: formatTime(current.lastLoginTime) },
  ];
});

const snackbarColor = ref<'success' | 'error'>('success');
const showSnackbar = ref(false);
const snackbarText = ref('');

// ---------------- 通用提示 ----------------

/**
 * 展示底部提示条
 * @param text 提示文案
 * @param isError 是否为错误提示
 */
function notify(text: string, isError = false): void {
  snackbarText.value = text;
  snackbarColor.value = isError ? 'error' : 'success';
  showSnackbar.value = true;
}

/**
 * 将接口异常转为可展示文案
 * @param error 捕获到的异常
 */
function resolveErrorMessage(error: unknown): string {
  return error instanceof UcApiError ? error.message : t('page.userCenter.requestFailed');
}

/**
 * 格式化服务端返回的时间字符串
 * @param value 时间字符串
 */
function formatTime(value?: string | null): string {
  if (!value) {
    return '-';
  }
  const parsed = dateFormat(new Date(value), 'yyyy/MM/dd HH:mm');
  return parsed || '-';
}

// ---------------- 校验规则 ----------------

/** 必填 */
function requiredRule(value: string) {
  return Boolean(value && value.trim()) || t('component.userCenter.login.validation.required');
}
/** 邮箱格式 */
function emailRule(value: string) {
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value ?? '') ||
    t('component.userCenter.login.validation.email')
  );
}
/** 6 位数字验证码 */
function codeRule(value: string) {
  return /^\d{6}$/.test(value ?? '') || t('component.userCenter.login.validation.code');
}
/** 密码格式 */
function passwordRule(value: string) {
  return (
    /^[A-Za-z0-9@_]{6,32}$/.test(value ?? '') || t('component.userCenter.login.validation.password')
  );
}
/** 昵称：最多 64 位 */
function nicknameRule(value: string) {
  return (
    Boolean(value && value.trim() && value.trim().length <= 64) ||
    t('page.userCenter.profile.nicknameRule')
  );
}
/** 头像地址：最多 512 字符 */
function avatarRule(value: string) {
  return !value || value.length <= 512 || t('page.userCenter.profile.avatarRule');
}
/** 换绑：新邮箱不能与当前邮箱相同 */
function newEmailRule(value: string) {
  const formatCheck = emailRule(value);
  if (typeof formatCheck !== 'boolean' || !formatCheck) {
    return formatCheck;
  }
  return value.trim() !== (profile.value?.email ?? '') || t('page.userCenter.email.sameAsCurrent');
}
/** 绑定邮箱：两次输入的邮箱需一致 */
function bindConfirmEmailRule(value: string) {
  return value.trim() === bindEmailForm.email.trim() || t('page.userCenter.email.confirmMismatch');
}
/** 换绑邮箱：两次输入的邮箱需一致 */
function changeConfirmEmailRule(value: string) {
  return (
    value.trim() === changeEmailForm.newEmail.trim() || t('page.userCenter.email.confirmMismatch')
  );
}
/** 两次密码一致 */
function confirmRule(value: string) {
  return value === passwordForm.newPassword || t('page.userCenter.password.confirmMismatch');
}

// ---------------- 资料加载 ----------------

const profileFormRef = ref();
const bindEmailFormRef = ref();
const changeEmailFormRef = ref();
const passwordFormRef = ref();

const profileForm = reactive({ nickname: '', avatar: '' });
const bindEmailForm = reactive({ email: '', confirmEmail: '', code: '' });
const changeEmailForm = reactive({
  oldCode: '',
  newEmail: '',
  confirmEmail: '',
  newCode: '',
});
const passwordForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' });

const profileSaving = ref(false);
const profileLoading = ref(false);
const bindEmailSubmitting = ref(false);
const changeEmailSubmitting = ref(false);

/** 资料是否有改动 */
const isProfileDirty = computed(
  () =>
    Boolean(profile.value) &&
    (profileForm.nickname !== (profile.value?.nickname ?? '') ||
      profileForm.avatar !== (profile.value?.avatar ?? '')),
);

/**
 * 将当前资料同步到编辑表单
 */
function syncProfileForm(): void {
  profileForm.nickname = profile.value?.nickname ?? '';
  profileForm.avatar = profile.value?.avatar ?? '';
}

/**
 * 加载用户资料
 */
async function loadProfile(): Promise<void> {
  profileLoading.value = true;
  try {
    await fetchProfile();
    syncProfileForm();
  } catch (error) {
    notify(resolveErrorMessage(error), true);
  } finally {
    profileLoading.value = false;
  }
}

// ---------------- 资料编辑 ----------------

/** 保存昵称与头像 */
async function submitProfile(): Promise<void> {
  const { valid } = (await profileFormRef.value?.validate()) ?? { valid: false };
  if (!valid) {
    return;
  }

  profileSaving.value = true;
  try {
    await updateProfile({
      nickname: profileForm.nickname.trim(),
      avatar: profileForm.avatar.trim(),
    });
    notify(t('page.userCenter.profile.saved'));
  } catch (error) {
    notify(resolveErrorMessage(error), true);
  } finally {
    profileSaving.value = false;
  }
}

// ---------------- 验证码倒计时 ----------------

const bindCountdown = ref(0);
const oldCodeCountdown = ref(0);
const newCodeCountdown = ref(0);
const sendingBindCode = ref(false);
const sendingOldCode = ref(false);
const sendingNewCode = ref(false);

const countdownTimers: ReturnType<typeof setInterval>[] = [];

/**
 * 启动指定倒计时引用
 * @param target 倒计时秒数引用
 */
function startCountdown(target: Ref<number>, seconds = 60): void {
  target.value = seconds;
  const timer = setInterval(() => {
    target.value -= 1;
    if (target.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
  countdownTimers.push(timer);
}

/** 发送绑定邮箱验证码 */
async function handleSendBindCode(): Promise<void> {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bindEmailForm.email)) {
    notify(t('component.userCenter.login.validation.email'), true);
    return;
  }

  sendingBindCode.value = true;
  try {
    await sendCode(bindEmailForm.email.trim(), 'register');
    startCountdown(bindCountdown);
    notify(t('page.userCenter.email.codeSent'));
  } catch (error) {
    notify(resolveErrorMessage(error), true);
  } finally {
    sendingBindCode.value = false;
  }
}

/** 发送换绑旧邮箱验证码 */
async function handleSendChangeEmailCode(): Promise<void> {
  sendingOldCode.value = true;
  try {
    await sendChangeEmailCode();
    startCountdown(oldCodeCountdown);
    notify(t('page.userCenter.email.codeSent'));
  } catch (error) {
    notify(resolveErrorMessage(error), true);
  } finally {
    sendingOldCode.value = false;
  }
}

/** 发送换绑新邮箱验证码 */
async function handleSendNewEmailCode(): Promise<void> {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(changeEmailForm.newEmail)) {
    notify(t('component.userCenter.login.validation.email'), true);
    return;
  }

  sendingNewCode.value = true;
  try {
    await sendCode(changeEmailForm.newEmail.trim(), 'register');
    startCountdown(newCodeCountdown);
    notify(t('page.userCenter.email.codeSent'));
  } catch (error) {
    notify(resolveErrorMessage(error), true);
  } finally {
    sendingNewCode.value = false;
  }
}

/** 绑定邮箱 */
async function submitBindEmail(): Promise<void> {
  const { valid } = (await bindEmailFormRef.value?.validate()) ?? { valid: false };
  if (!valid) {
    return;
  }

  bindEmailSubmitting.value = true;
  try {
    await bindEmail(bindEmailForm.email.trim(), bindEmailForm.code.trim());
    bindEmailForm.email = '';
    bindEmailForm.confirmEmail = '';
    bindEmailForm.code = '';
    await loadProfile();
    notify(t('page.userCenter.email.bound'));
  } catch (error) {
    notify(resolveErrorMessage(error), true);
  } finally {
    bindEmailSubmitting.value = false;
  }
}

/** 换绑邮箱 */
async function submitChangeEmail(): Promise<void> {
  const { valid } = (await changeEmailFormRef.value?.validate()) ?? { valid: false };
  if (!valid) {
    return;
  }

  changeEmailSubmitting.value = true;
  try {
    await changeEmail(
      changeEmailForm.oldCode.trim(),
      changeEmailForm.newEmail.trim(),
      changeEmailForm.newCode.trim(),
    );
    changeEmailForm.oldCode = '';
    changeEmailForm.newEmail = '';
    changeEmailForm.confirmEmail = '';
    changeEmailForm.newCode = '';
    await loadProfile();
    notify(t('page.userCenter.email.changed'));
  } catch (error) {
    notify(resolveErrorMessage(error), true);
  } finally {
    changeEmailSubmitting.value = false;
  }
}

// ---------------- 修改密码 ----------------

/** 修改密码（成功后服务端会清空全部会话，需重新登录） */
async function submitPassword(): Promise<void> {
  const { valid } = (await passwordFormRef.value?.validate()) ?? { valid: false };
  if (!valid) {
    return;
  }

  try {
    await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
    passwordForm.oldPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
    notify(t('page.userCenter.password.changed'));
    // 服务端已踢出全部会话，本地同步清理并跳回首页
    await logout();
    router.push('/');
  } catch (error) {
    notify(resolveErrorMessage(error), true);
  }
}

// ---------------- 退出登录 ----------------

/** 退出登录并返回首页 */
async function handleLogout(): Promise<void> {
  await logout();
  router.push('/');
}

// 已登录时加载用户资料
watch(
  isLoggedIn,
  async (loggedIn) => {
    if (loggedIn) {
      await loadProfile();
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  for (const timer of countdownTimers) clearInterval(timer);
});
</script>

<style scoped>
.page-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 960px;
  margin: 0 auto;
  padding: 1rem 0 3rem;
}

.uc-card {
  padding: 1.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--theme-border);
  background-color: var(--theme-bg-secondary);
  box-shadow: 0 0 0.75rem var(--theme-shadow-base);
}

.uc-card--empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 1.5rem;
  text-align: center;
}

.empty-icon {
  color: var(--theme-text-secondary);
  opacity: 0.6;
}

.empty-text {
  color: var(--theme-text-secondary);
}

.uc-card-title {
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--theme-text-primary);
}

.uc-card-hint {
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--theme-text-secondary);
}

/* 个人信息头部 */
.profile-head {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.profile-avatar {
  flex-shrink: 0;
  border: 1px solid var(--theme-border);
  background-color: var(--theme-bg-tertiary);
  color: var(--theme-text-primary);
  font-size: 1.75rem;
  font-weight: 700;
}

.profile-head-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  min-width: 0;
}

.profile-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--theme-text-primary);
  overflow-wrap: anywhere;
}

/* 加载 / 失败状态 */
.profile-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
  font-size: 0.875rem;
  color: var(--theme-text-secondary);
}

/* 标签-值网格：桌面两列，窄屏单列 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem 1.5rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--theme-border);
}

.info-grid--single {
  grid-template-columns: minmax(0, 1fr);
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
}

.info-label {
  font-size: 0.8125rem;
  color: var(--theme-text-secondary);
}

.info-value {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--theme-text-primary);
  overflow-wrap: anywhere;
}

.info-value--muted {
  font-weight: 400;
  color: var(--theme-text-secondary);
}

/* 验证码输入行 */
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
  min-width: 7.5rem;
  text-transform: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

@media screen and (max-width: 600px) {
  .uc-card {
    padding: 1rem;
  }

  .info-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .code-field {
    flex-direction: column;
  }

  .code-btn {
    width: 100%;
  }
}
</style>
