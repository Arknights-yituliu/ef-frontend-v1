<template>
  <v-container>
    <div class="page-content">
      <TextParticleWord class="particle-word" :text="t('page.home.welcome')" />
      <p class="page-description">{{ t('page.home.hint') }}</p>

      <!-- 小卡片组容器 - 仅显示收藏的卡片 -->
      <div v-if="favoritedCards.length > 0" class="small-card-section">
        <div class="small-card-group">
          <HomeSmallCard 
            v-for="card in favoritedCards" 
            :key="card.i18nKey" 
            :card="card"
          />
        </div>
      </div>

      <!-- 大卡片组容器 -->
      <div class="card-group">
        <HomeCard 
          v-for="card in visibleCards" 
          :key="card.i18nKey" 
          :card="card"
          :is-favorited="isFavorited(card)"
          :on-toggle-favorite="() => toggleFavorite(card)"
        />
      </div>

      <!-- 复制成功提示 -->
      <v-snackbar v-model="showSnackbar" color="success" :timeout="2000">
        {{ snackbarText }}
      </v-snackbar>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import {
  ButtonActionType,
  type CardData,
  type FooterButton,
  homeCards,
  homeFooterButtons,
} from '@/custom/core/homeCards';

definePageMeta({
  layout: 'default',
});

const { t } = useI18n();

usePageSeo({
  title: () => `${t('page.home.welcome')} - ${t('layout.siteName')}`,
  description: () => t('page.home.hint'),
});

const showSnackbar = ref(false);
const snackbarText = ref('');

// 收藏状态管理
const favorites = ref<Set<string>>(new Set());

// 从 localStorage 加载收藏状态
function loadFavorites () {
  const saved = localStorage.getItem('homeFavorites');
  if (saved) {
    try {
      favorites.value = new Set(JSON.parse(saved));
    } catch (error) {
      console.error('Failed to load favorites:', error);
      favorites.value = new Set();
    }
  }
}

// 保存收藏状态到 localStorage
function saveFavorites () {
  localStorage.setItem('homeFavorites', JSON.stringify([...favorites.value]));
}

// 检查卡片是否被收藏
function isFavorited (card: CardData) {
  return favorites.value.has(card.i18nKey);
}

// 切换收藏状态
function toggleFavorite (card: CardData) {
  if (favorites.value.has(card.i18nKey)) {
    favorites.value.delete(card.i18nKey);
  } else {
    favorites.value.add(card.i18nKey);
  }
  saveFavorites();
}

// 获取收藏的卡片列表
const favoritedCards = computed(() => {
  return homeCards
    .filter(card => card.visible !== false && isFavorited(card))
    .sort((a, b) => {
      // 按收藏时间排序（最近收藏的在前）
      const aIndex = [...favorites.value].indexOf(a.i18nKey);
      const bIndex = [...favorites.value].indexOf(b.i18nKey);
      return aIndex - bIndex;
    });
});

const visibleCards = computed(() => homeCards.filter((card) => card.visible !== false));
const visibleButtons = computed(() =>
  homeFooterButtons.filter((button) => button.visible !== false),
);

// 组件挂载时加载收藏状态
onMounted(() => {
  loadFavorites();
});

/**
 * 处理按钮点击事件
 */
function handleButtonClick (button: FooterButton) {
  if (button.action === ButtonActionType.Link) {
    // 跳转链接
    const target = button.target ? '_blank' : '_self';
    window.open(button.actionData, target);
  } else if (button.action === ButtonActionType.Copy) {
    // 复制文本
    copyToClipboard(button.actionData, button.copySuccessText || t('common.copySuccess'));
  }
}

/**
 * 复制文本到剪贴板
 */
async function copyToClipboard (text: string, successMessage: string) {
  try {
    await navigator.clipboard.writeText(text);
    showSnackbarMessage(successMessage);
  } catch (error) {
    console.error('复制失败:', error);
    showSnackbarMessage(t('common.copyFailed'));
  }
}

/**
 * 显示提示消息
 */
function showSnackbarMessage (message: string) {
  snackbarText.value = message;
  showSnackbar.value = true;
}
</script>

<style scoped>
.particle-word {
  color: var(--theme-accent-color);
}

.page-content {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  margin: 2rem auto 1.5rem;
  width: 100%;
}

/* 小卡片区域 */
.small-card-section {
  max-width: 1320px;
  margin: 2rem auto 0;
  width: 100%;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--theme-text-primary);
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--theme-accent-color);
}

.small-card-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, 280px);
  gap: 1rem;
  margin-bottom: 1rem;
  justify-content: center;
}

.small-card-group :deep(.home-small-card) {
  margin: 0 !important;
  padding: 0 !important;
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
