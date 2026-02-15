<template>
  <div v-if="isOpen" class="search-modal-overlay" @click="closeModal">
    <div class="search-modal" @click.stop>
      <!-- 头部 -->
      <header class="search-modal-header">
        <h3>{{ $t('docs.search') }}</h3>
        <button class="search-modal-close" @click="closeModal">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="2"
            />
          </svg>
        </button>
      </header>

      <!-- 搜索输入框 -->
      <div class="search-input-container">
        <v-icon class="search-icon">mdi-magnify</v-icon>
        <input
          ref="searchInput"
          v-model="searchQuery"
          class="search-input"
          :placeholder="$t('docs.searchPlaceholder')"
          @input="handleSearch"
        >
      </div>

      <!-- 搜索结果 -->
      <div class="search-results">
        <div v-if="isLoading" class="search-loading">
          {{ $t('common.loading') }}
        </div>
        <div v-else-if="searchResults.length === 0 && searchQuery" class="search-no-results">
          {{ $t('docs.noResults') }}
        </div>
        <section v-else-if="searchResults.length > 0" class="search-results-list">
          <article
            v-for="(result, index) in searchResults"
            :key="index"
            class="search-result-item"
            @click="goToResult(result.item.id)"
          >
            <h4 class="search-result-title">
              <span
                v-if="result.item.titles && result.item.titles.length > 0"
                class="search-result-breadcrumb"
              >
                {{ result.item.titles.join(' › ') }} ›
              </span>
              <span class="search-result-title-text">{{ result.item.title }}</span>
            </h4>
            <p class="search-result-description">
              {{ truncateContent(result.item.content, 150) }}
            </p>
            <div class="search-result-path">{{ formatPath(result.item.id) }}</div>
          </article>
        </section>
        <div v-else class="search-empty">
          {{ $t('docs.searchPlaceholder') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDocsSearch } from '~/composables/useDocsSearch';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const searchInput = ref<HTMLInputElement | null>(null);
const searchQuery = ref('');
const searchResults = ref<any[]>([]);
const isLoading = ref(false);

const { search } = useDocsSearch();

// 聚焦搜索输入框
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal && searchInput.value) {
      setTimeout(() => {
        searchInput.value?.focus();
      }, 100);
    }
  },
);

// 处理搜索
async function handleSearch () {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  isLoading.value = true;
  try {
    const results = await search(searchQuery.value);
    searchResults.value = results.slice(0, 10); // 限制显示前10个结果
  } catch (error) {
    console.error('Search error:', error);
    searchResults.value = [];
  } finally {
    isLoading.value = false;
  }
}

// 关闭模态框
function closeModal () {
  emit('close');
  searchQuery.value = '';
  searchResults.value = [];
}

// 格式化路径显示（去除语言后缀和锚点）
function formatPath (id: string): string {
  // id 格式类似: /introduction/docs-setting-zh#section-name
  // 显示为: /introduction/docs-setting
  return id.split('#')[0].replace(/-(zh|en)$/, '');
}

// 截断内容显示
function truncateContent (content: string, maxLength: number): string {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.slice(0, Math.max(0, maxLength)) + '...';
}

// 处理搜索结果的 id，转换为可导航的路径
// id 格式: /introduction/docs-setting-zh#section-name
// 需要去除语言后缀，保留锚点: /introduction/docs-setting#section-name
function formatNavigationPath (id: string): string {
  // 分离路径和锚点
  const [path, anchor] = id.split('#');
  // 去除语言后缀
  const routePath = path.replace(/-(zh|en)$/, '');
  // 如果有锚点，添加回去
  return anchor ? `${routePath}#${anchor}` : routePath;
}

// 跳转到搜索结果
function goToResult (id: string) {
  closeModal();
  // 将 id 转换为可导航的路径（去除语言后缀，保留锚点）
  const navigationPath = formatNavigationPath(id);
  navigateTo(navigationPath);
}

// 监听键盘事件
function handleKeydown (e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeModal();
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.search-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 5rem;
  z-index: 100;
  animation: fadeIn var(--transition-base);
}

.search-modal {
  background-color: var(--theme-bg-secondary);
  border: 2px solid var(--theme-accent-color);
  border-radius: var(--radius-md);
  width: 100%;
  max-width: 37.5rem;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 2rem var(--theme-shadow-strong);
}

.search-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--theme-border);
}

.search-modal-header h3 {
  font-size: var(--font-size-md);
  color: var(--theme-text-primary);
  margin: 0;
}

.search-modal-close {
  background: none;
  border: none;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-text-primary);
  transition: all var(--transition-base);
  border-radius: var(--radius-sm);
}

.search-modal-close:hover {
  background-color: var(--theme-bg-tertiary);
}

.search-input-container {
  position: relative;
  padding: 1.5rem;
  border-bottom: 1px solid var(--theme-border);
}

.search-icon {
  position: absolute;
  left: 2.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--theme-text-secondary);
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background-color: var(--theme-bg-primary);
  border: 1px solid var(--theme-border);
  border-radius: var(--radius-sm);
  color: var(--theme-text-primary);
  font-size: var(--font-size-base);
  transition: all var(--transition-base);
}

.search-input:focus {
  outline: none;
  border-color: var(--theme-accent-color);
  box-shadow: 0 0 0 2px var(--theme-shadow-accent);
}

.search-results {
  flex: 1;
  overflow-y: auto;
  max-height: 60vh;
}

.search-loading,
.search-empty,
.search-no-results {
  padding: 2rem;
  text-align: center;
  color: var(--theme-text-secondary);
}

.search-results-list {
  padding: 0.5rem;
}

.search-result-item {
  padding: 1rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-base);
  border: 1px solid transparent;
}

.search-result-item:hover {
  background-color: var(--theme-bg-tertiary);
  border-color: var(--theme-accent-color);
}

.search-result-title {
  font-size: var(--font-size-sm);
  color: var(--theme-text-primary);
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.search-result-breadcrumb {
  color: var(--theme-text-secondary);
  font-weight: 400;
  font-size: 0.85em;
  opacity: 0.8;
}

.search-result-title-text {
  font-weight: 600;
}

.search-result-description {
  font-size: var(--font-size-xs);
  color: var(--theme-text-secondary);
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.search-result-path {
  font-size: var(--font-size-xs);
  color: var(--theme-text-tertiary);
  font-family: monospace;
}
</style>
