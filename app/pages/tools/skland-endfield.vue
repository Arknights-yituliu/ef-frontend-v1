<!--{-->
<!--"i18nKey": "sklandEndfield",-->
<!--"nameKey": "menu.sklandEndfield",-->
<!--"routePath": "/tools/skland-endfield",-->
<!--"vuetifyIcon": "mdi-account-box"-->
<!--},-->

<template>
  <v-container>
    <div class="skland-page">
      <header class="page-header">
        <h1 class="page-title">{{ t('page.sklandEndfield.title') }}</h1>
        <p class="page-subtitle">{{ t('page.sklandEndfield.description') }}</p>
      </header>

      <!-- 凭证获取 -->
      <skland-credential-panel
        :has-credential="Boolean(credential)"
        @clear="resetAll"
        @success="handleCredentialSuccess"
      />

      <!-- 角色选择 -->
      <section v-if="credential" class="plain-card">
        <h3 class="plain-card-title">{{ t('page.sklandEndfield.role.title') }}</h3>

        <div v-if="roleLoading" class="status-row">
          <v-progress-circular indeterminate size="20" />
          <span>{{ t('common.loading') }}</span>
        </div>

        <template v-else>
          <v-alert v-if="roleError" density="compact" type="error" variant="tonal">
            {{ roleError }}
          </v-alert>
          <p v-else-if="roleOptions.length === 0" class="plain-hint">
            {{ t('page.sklandEndfield.role.empty') }}
          </p>
          <v-select
            v-else
            v-model="selectedRoleKey"
            item-title="label"
            item-value="key"
            :items="roleOptions"
            :label="t('page.sklandEndfield.role.select')"
            variant="outlined"
          />
        </template>
      </section>

      <!-- 角色数据 -->
      <div v-if="cardLoading" class="plain-card status-row">
        <v-progress-circular indeterminate size="20" />
        <span>{{ t('common.loading') }}</span>
      </div>
      <v-alert v-else-if="cardError" density="compact" type="error" variant="tonal">
        {{ cardError }}
      </v-alert>
      <skland-card-detail v-else-if="cardDetail" :detail="cardDetail" />
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import type {
  SklandCredential,
  SklandEndfieldCardDetail,
  SklandEndfieldRole,
} from '@/shared/types/skland';
import { isCredentialExpiredError, SklandApiError, useSkland } from '~/composables/useSkland';

definePageMeta({
  layout: 'default',
});

const { t } = useI18n();

usePageSeo({
  title: () => `${t('page.sklandEndfield.title')} - ${t('layout.siteName')}`,
  description: () => t('page.sklandEndfield.description'),
  robots: 'noindex, nofollow',
});

const { fetchEndfieldRoles, fetchCardDetail } = useSkland();

/** 当前持有的森空岛凭证 */
const credential = ref<SklandCredential | null>(null);
/** 角色列表加载态 */
const roleLoading = ref(false);
/** 角色列表错误文案 */
const roleError = ref('');
/** 终末地角色列表 */
const roles = ref<SklandEndfieldRole[]>([]);
/** 账号级 userId（card/detail 入参） */
const userId = ref('');
/** 当前选中的角色标识 */
const selectedRoleKey = ref('');
/** 角色卡片详情 */
const cardDetail = ref<SklandEndfieldCardDetail | null>(null);
/** 卡片详情加载态 */
const cardLoading = ref(false);
/** 卡片详情错误文案 */
const cardError = ref('');

/**
 * 生成角色的唯一标识（serverId + roleId）
 * @param role 角色信息
 * @returns 唯一标识
 */
function roleKey(role: SklandEndfieldRole): string {
  return `${role.serverId}-${role.roleId}`;
}

/** 角色下拉选项 */
const roleOptions = computed(() =>
  roles.value.map((role) => ({
    key: roleKey(role),
    label: `${role.nickname}（Lv.${role.level ?? '?'} · ${role.serverName || role.serverId}）`,
  })),
);

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

/** 清空凭证与全部查询结果 */
function resetAll(): void {
  credential.value = null;
  roles.value = [];
  userId.value = '';
  selectedRoleKey.value = '';
  cardDetail.value = null;
  roleError.value = '';
  cardError.value = '';
}

/**
 * 凭证获取成功后的回调：保存凭证并加载角色列表
 * @param value 凭证对
 */
async function handleCredentialSuccess(value: SklandCredential): Promise<void> {
  credential.value = value;
  roles.value = [];
  roleError.value = '';
  selectedRoleKey.value = '';
  cardDetail.value = null;
  cardError.value = '';
  await loadRoles();
}

/** 加载终末地角色列表，成功后自动选中首个角色 */
async function loadRoles(): Promise<void> {
  if (!credential.value) {
    return;
  }
  roleLoading.value = true;
  roleError.value = '';
  try {
    const result = await fetchEndfieldRoles(credential.value.cred, credential.value.token);
    roles.value = result.roles;
    userId.value = result.userId;
    if (roles.value.length > 0) {
      selectedRoleKey.value = roleKey(roles.value[0]);
    }
  } catch (error) {
    if (isCredentialExpiredError(error)) {
      resetAll();
      roleError.value = t('page.sklandEndfield.credential.expired');
      return;
    }
    roleError.value = resolveError(error);
  } finally {
    roleLoading.value = false;
  }
}

/** 加载当前选中角色的卡片详情 */
async function loadCardDetail(): Promise<void> {
  if (!credential.value) {
    return;
  }
  const role = roles.value.find((item) => roleKey(item) === selectedRoleKey.value);
  if (!role) {
    return;
  }

  cardLoading.value = true;
  cardError.value = '';
  cardDetail.value = null;
  try {
    cardDetail.value = await fetchCardDetail(credential.value.cred, credential.value.token, {
      roleId: role.roleId,
      serverId: role.serverId,
      userId: userId.value,
    });
  } catch (error) {
    if (isCredentialExpiredError(error)) {
      resetAll();
      cardError.value = t('page.sklandEndfield.credential.expired');
      return;
    }
    cardError.value = resolveError(error);
  } finally {
    cardLoading.value = false;
  }
}

// 切换角色时自动刷新卡片详情
watch(selectedRoleKey, (key) => {
  if (key) {
    void loadCardDetail();
  }
});
</script>

<style scoped>
.skland-page {
  display: flex;
  flex-direction: column;
}

.page-header {
  margin-bottom: 1.25rem;
}

.page-title {
  margin: 0 0 0.375rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.page-subtitle {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.66);
  font-size: 0.9rem;
  line-height: 1.6;
}

.plain-card {
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  border: 1px solid rgba(var(--v-border-color), 0.16);
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
}

.plain-card-title {
  margin: 0 0 0.75rem;
  font-size: 1.05rem;
  font-weight: 700;
}

.plain-hint {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.66);
  font-size: 0.875rem;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-size: 0.875rem;
}
</style>
