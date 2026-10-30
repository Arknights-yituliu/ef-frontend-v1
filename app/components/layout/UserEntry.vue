<template>
  <!-- 未登录：展示登录按钮 -->
  <button
    v-if="!isLoggedIn"
    :aria-label="t('component.userCenter.entry.login')"
    class="user-entry"
    type="button"
    @click="openLoginDialog"
  >
    <div class="entry-bg" />
    <v-icon class="entry-icon" icon="mdi-account-circle-outline" />
    <span class="entry-text">{{ t('component.userCenter.entry.login') }}</span>
  </button>

  <!-- 已登录：头像 + 下拉菜单 -->
  <v-menu v-else :close-on-content-click="true" location="bottom end">
    <template #activator="{ props }">
      <button
        v-bind="props"
        :aria-label="displayName"
        class="user-entry user-entry--avatar"
        type="button"
      >
        <v-avatar class="entry-avatar" size="2.75rem">
          <img v-if="profile?.avatar" :alt="displayName" :src="profile.avatar" />
          <span v-else>{{ avatarText }}</span>
        </v-avatar>
      </button>
    </template>

    <v-list class="user-menu" density="compact">
      <v-list-item
        class="user-menu-header"
        :subtitle="profile?.email || uid"
        :title="displayName"
      />
      <v-divider />
      <v-list-item
        prepend-icon="mdi-account-cog-outline"
        :title="t('component.userCenter.entry.center')"
        @click="goToCenter"
      />
      <v-list-item
        prepend-icon="mdi-logout"
        :title="t('component.userCenter.entry.logout')"
        @click="handleLogout"
      />
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
const { t } = useI18n();
const router = useRouter();
const { isLoggedIn, profile, uid, fetchProfile, logout, openLoginDialog } = useUserCenter();

/** 显示名：优先昵称，其次用户名占位 */
const displayName = computed(
  () => profile.value?.nickname || t('component.userCenter.entry.unknownUser'),
);

/** 头像缺省时展示昵称首字符 */
const avatarText = computed(() => displayName.value.slice(0, 1).toUpperCase());

// 已登录且资料未加载时拉取一次资料，用于头像与昵称展示
watch(
  isLoggedIn,
  (loggedIn) => {
    if (loggedIn && !profile.value) {
      fetchProfile().catch(() => {
        // 拉取失败不阻断页面，错误在个人中心页统一提示
      });
    }
  },
  { immediate: true },
);

/** 跳转个人中心 */
function goToCenter(): void {
  router.push('/user/center');
}

/** 退出登录并跳回首页 */
async function handleLogout(): Promise<void> {
  await logout();
  router.push('/');
}
</script>

<style scoped>
.user-entry {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 2.75rem;
  padding: 0 0.875rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--theme-border);
  background-color: var(--theme-bg-secondary);
  color: var(--theme-text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all var(--transition-base);
  box-shadow: 0 0 0.5rem var(--theme-shadow-base);
}

.user-entry::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 0.375rem;
  height: 100%;
  background-color: transparent;
  transition: all var(--transition-base);
}

.user-entry:hover {
  border-color: var(--theme-accent-color);
  transform: scale(1.05);
  box-shadow: 0 0 1rem var(--theme-shadow-accent-strong);
}

.user-entry:hover::before {
  background-color: var(--theme-accent-color);
  box-shadow: 0 0 0.5rem var(--theme-accent-color);
}

.entry-bg {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    -45deg,
    transparent,
    transparent 13.9512529279%,
    var(--theme-decorative-overlay-light) 0,
    var(--theme-decorative-overlay-light) 36.0487470721%,
    transparent 0,
    transparent 63.9512529279%,
    var(--theme-decorative-overlay-light) 0,
    var(--theme-decorative-overlay-light) 86.0487470721%,
    transparent 0,
    transparent
  );
  background-size: 0.5rem 0.5rem;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.user-entry:hover .entry-bg {
  opacity: 1;
}

.entry-icon {
  position: relative;
  z-index: 1;
  font-size: 1.25rem;
}

.entry-text {
  position: relative;
  z-index: 1;
  white-space: nowrap;
}

/* 头像按钮：去掉内边距，只保留头像 */
.user-entry--avatar {
  padding: 0;
  border-radius: 50%;
  overflow: visible;
}

.user-entry--avatar::before {
  display: none;
}

.entry-avatar {
  border: 1px solid var(--theme-border);
  background-color: var(--theme-bg-tertiary);
  color: var(--theme-text-primary);
  font-weight: 600;
}

.user-menu {
  border: 1px solid var(--theme-border);
  background-color: var(--theme-bg-secondary);
  box-shadow: 0 0 1rem var(--theme-shadow-base);
}

.user-menu-header {
  pointer-events: none;
}

@media screen and (max-width: 600px) {
  .entry-text {
    display: none;
  }

  .user-entry {
    padding: 0 0.5rem;
  }
}
</style>
