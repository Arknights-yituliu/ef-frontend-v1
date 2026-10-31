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
        <div class="role-title-row">
          <h3 class="plain-card-title">{{ t('page.sklandEndfield.role.title') }}</h3>
          <span v-if="!roleLoading && roleOptions.length > 0" class="role-count">
            {{ t('page.sklandEndfield.role.accountCount', { count: roleOptions.length }) }}
          </span>
        </div>

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
            :placeholder="t('page.sklandEndfield.role.selectPlaceholder')"
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

      <!-- 云端存档 -->
      <section class="plain-card cloud-card">
        <h3 class="plain-card-title">{{ t('page.sklandEndfield.cloud.title') }}</h3>

        <!-- 未登录：引导登录 -->
        <template v-if="!isLoggedIn">
          <p class="plain-hint">{{ t('page.sklandEndfield.cloud.loginHint') }}</p>
          <div class="cloud-actions">
            <v-btn color="primary" variant="flat" @click="openLoginDialog">
              {{ t('page.sklandEndfield.cloud.login') }}
            </v-btn>
          </div>
        </template>

        <template v-else>
          <div v-if="cloudLoading" class="status-row">
            <v-progress-circular indeterminate size="20" />
            <span>{{ t('common.loading') }}</span>
          </div>

          <p v-else-if="cloudAccounts.length === 0 && !cloudError" class="plain-hint">
            {{ t('page.sklandEndfield.cloud.empty') }}
          </p>
          <v-select
            v-else-if="cloudAccounts.length > 0"
            v-model="selectedCloudKey"
            item-title="label"
            item-value="key"
            :items="cloudOptions"
            :label="t('page.sklandEndfield.cloud.select')"
            variant="outlined"
            @update:model-value="handleCloudSelect"
          />

          <div class="cloud-actions">
            <v-btn
              color="primary"
              :disabled="!canUpload"
              :loading="uploading"
              variant="flat"
              @click="uploadCurrentData"
            >
              {{ t('page.sklandEndfield.cloud.upload') }}
            </v-btn>
            <v-btn
              v-if="selectedCloudKey"
              :loading="cloudDetailLoading"
              variant="tonal"
              @click="loadCloudDetail"
            >
              {{ t('page.sklandEndfield.cloud.load') }}
            </v-btn>
          </div>

          <p v-if="!cardDetail && !cardLoading" class="plain-hint cloud-hint">
            {{ t('page.sklandEndfield.cloud.uploadHint') }}
          </p>

          <v-alert v-if="cloudError" class="mt-3" density="compact" type="error" variant="tonal">
            {{ cloudError }}
          </v-alert>
          <v-alert v-if="cloudNotice" class="mt-3" density="compact" type="success" variant="tonal">
            {{ cloudNotice }}
          </v-alert>

          <div v-if="cloudDetailLoading" class="status-row cloud-detail-status">
            <v-progress-circular indeterminate size="20" />
            <span>{{ t('common.loading') }}</span>
          </div>
          <template v-else-if="cloudDetail">
            <p v-if="cloudUpdateTime" class="plain-hint cloud-updated-at">
              {{ t('page.sklandEndfield.cloud.updatedAt', { time: cloudUpdateTimeText }) }}
            </p>
            <skland-card-detail :detail="cloudDetail" />
          </template>
        </template>
      </section>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import type {
  SklandCredential,
  SklandEndfieldCardDetail,
  SklandEndfieldRole,
} from '@/shared/types/skland';
import type { UcEfAccount } from '@/shared/types/userCenter';
import { dateFormat } from '@/shared/utils/dateUtil';
import { isCredentialExpiredError, SklandApiError, useSkland } from '~/composables/useSkland';
import { UcApiError, useUserCenter } from '~/composables/useUserCenter';

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
const { isLoggedIn, openLoginDialog, listEfAccounts, fetchEfPlayerData, saveEfPlayerData } =
  useUserCenter();

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

/** 云端存档：当前用户已绑定的角色列表 */
const cloudAccounts = ref<UcEfAccount[]>([]);
/** 云端角色列表加载态 */
const cloudLoading = ref(false);
/** 当前选中的云端角色标识 */
const selectedCloudKey = ref('');
/** 云端玩家数据详情 */
const cloudDetail = ref<SklandEndfieldCardDetail | null>(null);
/** 云端数据加载态 */
const cloudDetailLoading = ref(false);
/** 云端数据最近更新时间 */
const cloudUpdateTime = ref('');
/** 上传中 */
const uploading = ref(false);
/** 云端操作错误文案 */
const cloudError = ref('');
/** 云端上传成功提示 */
const cloudNotice = ref('');

/** 当前选中的森空岛角色 */
const currentRole = computed(() =>
  roles.value.find((item) => roleKey(item) === selectedRoleKey.value),
);

/** 是否可以把当前角色数据上传到云端 */
const canUpload = computed(
  () => Boolean(cardDetail.value && currentRole.value) && !uploading.value,
);

/**
 * 生成角色或云端账号的唯一标识（serverId + roleId）
 * @param item 角色信息或云端账号
 * @returns 唯一标识
 */
function roleKey(item: { serverId: string; roleId: string }): string {
  return `${item.serverId}-${item.roleId}`;
}

/** 角色下拉选项 */
const roleOptions = computed(() =>
  roles.value.map((role) => ({
    key: roleKey(role),
    label: `${role.nickname}（Lv.${role.level ?? '?'} · ${role.serverName || role.serverId}）`,
  })),
);

/** 云端角色下拉选项 */
const cloudOptions = computed(() =>
  cloudAccounts.value.map((account) => ({
    key: roleKey(account),
    label: cloudAccountLabel(account),
  })),
);

/** 云端数据更新时间的展示文本 */
const cloudUpdateTimeText = computed(() => {
  if (!cloudUpdateTime.value) {
    return '';
  }
  const parsed = dateFormat(new Date(cloudUpdateTime.value), 'yyyy/MM/dd HH:mm');
  return parsed || cloudUpdateTime.value;
});

/**
 * 云端角色展示名：能与当前森空岛角色匹配时优先展示昵称
 * @param account 云端账号
 * @returns 下拉展示文案
 */
function cloudAccountLabel(account: UcEfAccount): string {
  const role = roles.value.find(
    (item) => item.roleId === account.roleId && item.serverId === account.serverId,
  );
  const name = role?.nickname || account.roleId;
  const server = role?.serverName || account.serverId || '-';
  return `${name}（${server}）`;
}

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

/** 加载终末地角色列表（不默认选中，由玩家自行选择要上报的账号） */
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
    selectedRoleKey.value = '';
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

/**
 * 将云端接口异常转换为可展示文案
 * @param error 捕获到的异常
 * @returns 错误文案
 */
function resolveCloudError(error: unknown): string {
  if (error instanceof UcApiError) {
    if (error.code === 30_006) {
      return t('page.sklandEndfield.cloud.rateLimited');
    }
    if (error.code === 80_001 || error.code === 80_002) {
      return t('page.sklandEndfield.cloud.sessionExpired');
    }
    if (error.code === 80_008) {
      return t('page.sklandEndfield.cloud.notBound');
    }
    return error.message || t('page.sklandEndfield.cloud.requestFailed');
  }
  return t('page.sklandEndfield.cloud.requestFailed');
}

/** 清空云端存档状态 */
function resetCloudState(): void {
  cloudAccounts.value = [];
  selectedCloudKey.value = '';
  cloudDetail.value = null;
  cloudUpdateTime.value = '';
  cloudError.value = '';
  cloudNotice.value = '';
}

/**
 * 加载当前用户已绑定的云端角色列表，并修正选中项
 * @returns 是否加载成功
 */
async function loadCloudAccounts(): Promise<boolean> {
  cloudLoading.value = true;
  cloudError.value = '';
  cloudNotice.value = '';
  try {
    cloudAccounts.value = await listEfAccounts();
    const stillExists = cloudAccounts.value.some(
      (item) => roleKey(item) === selectedCloudKey.value,
    );
    if (!stillExists) {
      selectedCloudKey.value = cloudAccounts.value[0] ? roleKey(cloudAccounts.value[0]) : '';
    }
    return true;
  } catch (error) {
    cloudAccounts.value = [];
    selectedCloudKey.value = '';
    cloudDetail.value = null;
    cloudUpdateTime.value = '';
    cloudError.value = resolveCloudError(error);
    return false;
  } finally {
    cloudLoading.value = false;
  }
}

/** 加载当前选中云端角色的玩家数据 */
async function loadCloudDetail(): Promise<void> {
  const account = cloudAccounts.value.find((item) => roleKey(item) === selectedCloudKey.value);
  if (!account) {
    cloudDetail.value = null;
    cloudUpdateTime.value = '';
    return;
  }

  cloudDetailLoading.value = true;
  cloudError.value = '';
  cloudNotice.value = '';
  try {
    const result = await fetchEfPlayerData(account.roleId, account.serverId);
    cloudDetail.value = (result?.playerData ?? null) as SklandEndfieldCardDetail | null;
    cloudUpdateTime.value = result?.updateTime ?? '';
  } catch (error) {
    cloudDetail.value = null;
    cloudUpdateTime.value = '';
    cloudError.value = resolveCloudError(error);
  } finally {
    cloudDetailLoading.value = false;
  }
}

/**
 * 下拉切换云端角色后加载对应数据
 * @param key 选中的云端角色标识
 */
async function handleCloudSelect(key: string): Promise<void> {
  selectedCloudKey.value = key;
  await loadCloudDetail();
}

/** 把当前角色卡片数据上传到云端，并刷新云端列表与详情 */
async function uploadCurrentData(): Promise<void> {
  const role = currentRole.value;
  if (!role || !cardDetail.value) {
    return;
  }

  uploading.value = true;
  cloudError.value = '';
  cloudNotice.value = '';
  try {
    await saveEfPlayerData({
      roleId: role.roleId,
      serverId: role.serverId,
      playerData: cardDetail.value as unknown as Record<string, unknown>,
    });
    selectedCloudKey.value = roleKey(role);
    if (await loadCloudAccounts()) {
      await loadCloudDetail();
    }
    cloudNotice.value = t('page.sklandEndfield.cloud.uploadSuccess');
  } catch (error) {
    cloudError.value = resolveCloudError(error);
  } finally {
    uploading.value = false;
  }
}

// 切换角色时自动刷新卡片详情
watch(selectedRoleKey, (key) => {
  if (key) {
    void loadCardDetail();
  }
});

// 登录状态变化时加载或清空云端存档
watch(
  isLoggedIn,
  (loggedIn) => {
    if (loggedIn) {
      void loadCloudAccounts().then((ok) => {
        if (ok && selectedCloudKey.value) {
          void loadCloudDetail();
        }
      });
    } else {
      resetCloudState();
    }
  },
  { immediate: true },
);
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

.cloud-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.cloud-hint {
  margin-top: 0.75rem;
}

.cloud-updated-at {
  margin: 1rem 0 0.5rem;
}

.cloud-detail-status {
  margin-top: 1rem;
}

.role-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.75rem;
}

.role-count {
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 0.875rem;
}
</style>
