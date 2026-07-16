<template>
  <v-container>
    <div class="page-content">
      <TextParticleWord class="particle-word" :text="t('page.home.welcome')" />
      <p class="page-description">{{ t('page.home.hint') }}</p>

      <section class="small-card-section">
        <div class="small-card-section-header">
          <h2 class="section-title">{{ t('page.home.favorites') }}</h2>
        </div>

        <div class="small-card-group">
          <HomeBookmarkCard
            v-for="bookmark in bookmarks"
            :key="bookmark.id"
            :bookmark="bookmark"
            @delete="requestBookmarkDelete"
            @edit="openEditBookmarkDialog"
          />
          <HomeSmallCard v-for="card in favoritedCards" :key="card.i18nKey" :card="card" />
          <button class="home-bookmark-add-card" type="button" @click="openAddBookmarkDialog">
            <span class="home-bookmark-add-icon">
              <v-icon icon="mdi-plus" size="24" />
            </span>
            <span>{{ t('component.home.bookmarks.add') }}</span>
          </button>
        </div>
      </section>

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

      <HomeBookmarkDialog
        v-model="showBookmarkDialog"
        :bookmark="editingBookmark"
        @save="saveBookmark"
      />

      <v-dialog v-model="showDeleteDialog" max-width="420">
        <v-card>
          <v-card-title class="text-h6">
            {{ t('component.home.bookmarks.deleteTitle') }}
          </v-card-title>
          <v-card-text>
            {{
              t('component.home.bookmarks.deleteMessage', {
                title: bookmarkPendingDelete?.title ?? '',
              })
            }}
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn variant="text" @click="showDeleteDialog = false">
              {{ t('component.home.bookmarks.cancel') }}
            </v-btn>
            <v-btn color="error" prepend-icon="mdi-delete" @click="confirmBookmarkDelete">
              {{ t('component.home.bookmarks.delete') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import type { HomeBookmark, HomeBookmarkInput } from '@/shared/types/homeBookmark';
import { type CardData, homeCards } from '@/custom/core/homeCards';

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
const showBookmarkDialog = ref(false);
const showDeleteDialog = ref(false);
const editingBookmark = ref<HomeBookmark>();
const bookmarkPendingDelete = ref<HomeBookmark>();

const { bookmarks, loadBookmarks, addBookmark, updateBookmark, removeBookmark } =
  useHomeBookmarks();

// 收藏状态管理
const favorites = ref<Set<string>>(new Set());

// 从 localStorage 加载收藏状态
function loadFavorites() {
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
function saveFavorites() {
  localStorage.setItem('homeFavorites', JSON.stringify([...favorites.value]));
}

// 检查卡片是否被收藏
function isFavorited(card: CardData) {
  return favorites.value.has(card.i18nKey);
}

// 切换收藏状态
function toggleFavorite(card: CardData) {
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
    .filter((card) => card.visible !== false && isFavorited(card))
    .toSorted((a, b) => {
      // 按收藏时间排序（最近收藏的在前）
      const aIndex = [...favorites.value].indexOf(a.i18nKey);
      const bIndex = [...favorites.value].indexOf(b.i18nKey);
      return aIndex - bIndex;
    });
});

const visibleCards = computed(() => homeCards.filter((card) => card.visible !== false));

function showSuccess(messageKey: string): void {
  snackbarText.value = t(messageKey);
  showSnackbar.value = true;
}

function openAddBookmarkDialog(): void {
  editingBookmark.value = undefined;
  showBookmarkDialog.value = true;
}

function openEditBookmarkDialog(bookmark: HomeBookmark): void {
  editingBookmark.value = bookmark;
  showBookmarkDialog.value = true;
}

function saveBookmark(input: HomeBookmarkInput): void {
  if (editingBookmark.value) {
    updateBookmark(editingBookmark.value.id, input);
    showSuccess('component.home.bookmarks.updated');
  } else {
    addBookmark(input);
    showSuccess('component.home.bookmarks.added');
  }

  editingBookmark.value = undefined;
}

function requestBookmarkDelete(bookmark: HomeBookmark): void {
  bookmarkPendingDelete.value = bookmark;
  showDeleteDialog.value = true;
}

function confirmBookmarkDelete(): void {
  if (!bookmarkPendingDelete.value) {
    return;
  }

  removeBookmark(bookmarkPendingDelete.value.id);
  bookmarkPendingDelete.value = undefined;
  showDeleteDialog.value = false;
  showSuccess('component.home.bookmarks.deleted');
}

// 组件挂载时加载收藏状态
onMounted(() => {
  loadFavorites();
  loadBookmarks();
});
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

.small-card-section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.875rem;
  padding: 0 0.25rem 0.75rem;
  border-bottom: 1px solid var(--theme-border);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--theme-text-primary);
  margin: 0;
}

.small-card-group {
  display: grid;
  align-items: start;
  grid-template-columns: repeat(auto-fill, 280px);
  gap: 0.875rem;
  margin-bottom: 1rem;
  justify-content: start;
}

.small-card-group :deep(.home-small-card) {
  margin: 0 !important;
  padding: 0 !important;
}

.home-bookmark-add-card {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 280px;
  height: 58px;
  padding: 8px 10px;
  box-sizing: border-box;
  gap: 0.375rem;
  color: var(--theme-text-secondary);
  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  background: transparent;
  border: 1px dashed var(--theme-text-tertiary);
  border-radius: 8px;
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.home-bookmark-add-card:hover {
  color: var(--theme-text-primary);
  background: var(--theme-decorative-overlay-light);
  border-color: var(--theme-text-secondary);
}

.home-bookmark-add-card:focus-visible {
  outline: 2px solid var(--theme-accent-color);
  outline-offset: 2px;
}

.home-bookmark-add-icon {
  display: flex;
  flex: 0 0 24px;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

@media (max-width: 600px) {
  .small-card-group {
    grid-template-columns: minmax(0, 280px);
    justify-content: center;
  }

  .small-card-section-header {
    max-width: 280px;
    margin-right: auto;
    margin-left: auto;
  }
}
</style>
