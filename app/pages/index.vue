<template>
  <div class="page-content">
    <h1 class="welcome-title">{{ t('page.home.welcome') }}</h1>
    <p class="page-description">{{ t('page.home.hint') }}</p>

    <!-- 卡片组容器 -->
    <div class="card-group">
      <HomeCard v-for="card in visibleCards" :key="card.i18nKey" :card="card" />
    </div>

    <!-- 复制成功提示 -->
    <v-snackbar v-model="showSnackbar" :timeout="2000" color="success">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script lang="ts" setup>
import { homeFooterButtons, homeCards, type FooterButton, ButtonActionType } from '~/data/homeCards';

definePageMeta({
  layout: 'default',
});

const { t } = useI18n();

const showSnackbar = ref(false);
const snackbarText = ref('');

const visibleCards = computed(() => homeCards.filter((card) => card.visible !== false));
const visibleButtons = computed(() => homeFooterButtons.filter((button) => button.visible !== false));

/**
 * 处理按钮点击事件
 */
const handleButtonClick = (button: FooterButton) => {
  if (button.action === ButtonActionType.Link) {
    // 跳转链接
    const target = button.target ? '_blank' : '_self';
    window.open(button.actionData, target);
  } else if (button.action === ButtonActionType.Copy) {
    // 复制文本
    copyToClipboard(button.actionData, button.copySuccessText || t('common.copySuccess'));
  }
};

/**
 * 复制文本到剪贴板
 */
const copyToClipboard = async (text: string, successMessage: string) => {
  try {
    await navigator.clipboard.writeText(text);
    showSnackbarMessage(successMessage);
  } catch (error) {
    console.error('复制失败:', error);
    showSnackbarMessage(t('common.copyFailed'));
  }
};

/**
 * 显示提示消息
 */
const showSnackbarMessage = (message: string) => {
  snackbarText.value = message;
  showSnackbar.value = true;
};
</script>

<style scoped>
.page-content {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.welcome-title {
  font-size: 3rem;
  font-weight: bold;
  color: var(--theme-text-primary);
  text-align: center;
  margin: 2rem;
}

.page-description {
  font-size: 1.125rem;
  color: var(--theme-text-secondary);
  text-align: center;
  max-width: 600px;
  line-height: 1.6;
}

.card-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
  gap: 1.5rem;
  max-width: 1320px;
  margin: 3rem auto 2rem;
  width: 100%;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  max-width: 1320px;
  margin: 2rem auto 3rem;
  width: 100%;
  padding: 0 1rem;
}

.home-button {
  min-width: 160px;
  height: 48px;
}
</style>
