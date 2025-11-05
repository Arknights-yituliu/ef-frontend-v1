<template>
  <div class="friend-links-page">
    <h1 class="page-title">{{ $t('page.friendLinks') }}</h1>
    <p class="page-description">{{ $t('page.friendLinksDescription') }}</p>

    <!-- 加载状态 -->
    <div v-if="pending" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">{{ $t('common.loading') }}</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <p class="error-text">{{ $t('common.error') }}: {{ error.message }}</p>
      <button class="retry-button" @click="refresh()">{{ $t('common.retry') }}</button>
    </div>

    <!-- 友情链接列表 -->
    <div v-else-if="data?.data && data.data.length > 0" class="links-grid">
      <ContainerSpotlightCard
        v-for="link in data.data"
        :key="link.id"
        class="friend-link-card"
      >
        <div class="card-content">
          <!-- 图标和标题 -->
          <div class="card-header">
            <img
              v-if="link.icon_url"
              :src="link.icon_url"
              :alt="getLocalizedValue(link.localized_name)"
              class="link-icon"
              @error="handleImageError"
            />
            <h3 class="link-name">{{ getLocalizedValue(link.localized_name) }}</h3>
          </div>

          <!-- 描述 -->
          <p class="link-description">{{ getLocalizedValue(link.localized_description) }}</p>

          <!-- 标语 -->
          <p class="link-slogan">{{ getLocalizedValue(link.localized_slogan) }}</p>

          <!-- 标签 -->
          <div v-if="getLocalizedArray(link.localized_tags).length" class="link-tags">
            <span
              v-for="(tag, index) in getLocalizedArray(link.localized_tags)"
              :key="index"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>

          <!-- 链接按钮 -->
          <div class="link-buttons">
            <a
              v-for="linkItem in getFilteredLinks(link.links)"
              :key="linkItem.url"
              :href="linkItem.url"
              target="_blank"
              rel="noopener noreferrer"
              class="link-button"
              :class="{ primary: linkItem.primary }"
            >
              {{ getLocalizedValue(linkItem.localized_name) }}
              <svg
                class="external-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </ContainerSpotlightCard>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-container">
      <p class="empty-text">{{ $t('common.noData') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

interface LocalizedValue {
  zh_CN: string;
  en_US: string;
}

interface LocalizedArray {
  zh_CN: string[];
  en_US: string[];
}

interface LinkItem {
  primary: boolean;
  regionality: string;
  localized_name: LocalizedValue;
  url: string;
}

interface FriendLink {
  id: string;
  localized_name: LocalizedValue;
  localized_description: LocalizedValue;
  localized_slogan: LocalizedValue;
  localized_tags: LocalizedArray;
  icon_url: string;
  links: LinkItem[];
}

interface ApiResponse {
  code: string;
  message: string;
  data: FriendLink[];
}

const { locale } = useI18n()

// API URL
const apiUrl = 'https://server-cdn.ceobecanteen.top/api/v1/cdn/operate/toolLink/list'

// 获取数据
const { data, pending, error, refresh } = await useFetch<ApiResponse>(apiUrl, {
  server: false, // 只在客户端获取，避免 SSR 问题
  key: 'friend-links'
})

// 获取本地化字符串值
const getLocalizedValue = (localized: LocalizedValue | undefined): string | undefined => {
  if (!localized) return undefined
  
  // 将 locale 从 'zh-CN' 转换为 'zh_CN'，'en-US' 转换为 'en_US'
  const localeKey = locale.value === 'zh-CN' ? 'zh_CN' : 'en_US'
  
  return localized[localeKey as keyof LocalizedValue] as string
}

// 获取本地化数组值
const getLocalizedArray = (localized: LocalizedArray | undefined): string[] => {
  if (!localized) return []
  
  // 将 locale 从 'zh-CN' 转换为 'zh_CN'，'en-US' 转换为 'en_US'
  const localeKey = locale.value === 'zh-CN' ? 'zh_CN' : 'en_US'
  
  return localized[localeKey as keyof LocalizedArray] as string[] || []
}

// 过滤链接（根据区域性和主要链接）
const getFilteredLinks = (links: LinkItem[]): LinkItem[] => {
  // 优先显示主要链接，然后是其他链接
  const primaryLinks = links.filter(link => link.primary)
  const otherLinks = links.filter(link => !link.primary)
  
  // 可以在这里添加区域过滤逻辑，但为了简单起见，显示所有链接
  return [...primaryLinks, ...otherLinks]
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // 可以设置一个默认图标
  img.style.display = 'none'
}
</script>

<style scoped>
.friend-links-page {
  padding: 2rem 0;
}

.page-title {
  font-size: var(--font-size-3xl);
  color: var(--theme-text-primary);
  margin-bottom: 1rem;
  font-weight: 700;
}

.page-description {
  font-size: var(--font-size-md);
  color: var(--theme-text-secondary);
  margin-bottom: 2.5rem;
  line-height: 1.5;
}

.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--theme-border);
  border-top-color: var(--theme-accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text,
.error-text,
.empty-text {
  font-size: var(--font-size-md);
  color: var(--theme-text-secondary);
}

.error-container {
  gap: 1rem;
}

.retry-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--theme-accent-color);
  color: var(--theme-text-primary);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.retry-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem var(--theme-shadow-accent);
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.friend-link-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.link-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: var(--radius-md);
  object-fit: cover;
  border: 1px solid var(--theme-border);
  flex-shrink: 0;
}

.link-name {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--theme-text-primary);
  margin: 0;
  flex: 1;
}

.link-description {
  font-size: var(--font-size-sm);
  color: var(--theme-text-secondary);
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.link-slogan {
  font-size: var(--font-size-xs);
  color: var(--theme-accent-color);
  font-weight: 500;
  font-style: italic;
  margin: 0;
  padding: 0.5rem 0;
  border-top: 1px solid var(--theme-border);
  border-bottom: 1px solid var(--theme-border);
}

.link-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  background-color: var(--theme-bg-secondary);
  border: 1px solid var(--theme-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: var(--theme-text-primary);
  font-weight: 500;
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.tag::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--theme-decorative-overlay-light);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.tag:hover {
  background-color: var(--theme-bg-tertiary);
  color: var(--theme-text-primary);
  border-color: var(--theme-border-active);
  transform: translateY(-1px);
  box-shadow: 0 0.125rem 0.5rem var(--theme-shadow-accent);
}

.tag:hover::before {
  opacity: 1;
}

.link-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1rem;
}

.link-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background-color: var(--theme-bg-secondary);
  border: 1px solid var(--theme-border);
  border-radius: var(--radius-md);
  color: var(--theme-text-primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  z-index: 0;
}

.link-button > * {
  position: relative;
  z-index: 1;
}

.link-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--theme-decorative-overlay-light);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.link-button:hover {
  background-color: var(--theme-bg-tertiary);
  border-color: var(--theme-border-active);
  color: var(--theme-text-primary);
  transform: translateY(-2px);
  box-shadow: 0 0.25rem 0.75rem var(--theme-shadow-accent);
}

.link-button:hover::before {
  opacity: 1;
}

.link-button.primary {
  background-color: var(--theme-bg-tertiary);
  border-color: var(--theme-border-active);
  color: var(--theme-text-primary);
  font-weight: 600;
  border-width: 1.5px;
}

.link-button.primary::before {
  background-color: var(--theme-decorative-overlay-medium);
  opacity: 1;
}

.link-button.primary:hover {
  background-color: var(--theme-bg-tertiary);
  border-color: var(--theme-border-active);
  box-shadow: 0 0.375rem 1rem var(--theme-shadow-accent-strong);
  transform: translateY(-2px);
}

.external-icon {
  width: 1rem;
  height: 1rem;
  opacity: 0.6;
  transition: opacity var(--transition-fast);
  position: relative;
  z-index: 1;
}

.link-button:hover .external-icon {
  opacity: 0.9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .links-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .page-title {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 480px) {
  .friend-links-page {
    padding: 1rem 0;
  }

  .page-title {
    font-size: var(--font-size-xl);
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .link-buttons {
    flex-direction: column;
  }

  .link-button {
    width: 100%;
    justify-content: center;
  }
}
</style>

