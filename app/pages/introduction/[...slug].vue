<template>
  <div class="doc-page">
    <article v-if="page" class="doc-article">
      <!-- 文档标题 -->
      <header class="doc-header">
        <h1 class="doc-title">{{ page.title }}</h1>
        <p v-if="page.description" class="doc-description">{{ page.description }}</p>
      </header>

      <!-- 文档内容 -->
      <div class="doc-body">
        <ContentRenderer :value="page"/>
      </div>
    </article>

    <div v-else class="doc-not-found">
      <h1>{{ $t('docs.notFound') }}</h1>
      <p>{{ $t('docs.notFoundDescription') }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 使用 docs 布局
definePageMeta({
  layout: 'docs'
})

const route = useRoute()
const {locale} = useI18n()

// 从布局中注入设置标题的方法
const setDocHeadings = inject<(headings: Array<{ id: string; text: string; depth: number }>) => void>('setDocHeadings')

// 使用 queryCollection API 获取内容，监听语言变化
const {data: page, refresh} = await useAsyncData(
    `${route.path}-${locale.value}`,
    () => {
      // content/ 下的实际文件路径形如 introduction/route-setting-zh或introduction/route-setting-en
      const contentPath = `${route.path}-${locale.value.substring(0, 2)}`

      return queryCollection('introduction')
          .path(contentPath)
          .first()
    }
)

// 监听语言变化，重新获取文档
watch(locale, () => {
  refresh()
})

// 提取文档标题的函数
const extractHeadings = () => {
  nextTick(() => {
    const headings: Array<{ id: string; text: string; depth: number }> = []
    const headingElements = document.querySelectorAll('.doc-body h2, .doc-body h3, .doc-body h4')

    headingElements.forEach((el) => {
      const tagName = el.tagName.toLowerCase()
      const depth = parseInt(tagName.substring(1))
      const text = el.textContent || ''
      let id = el.id

      // 如果没有 id，生成一个
      if (!id) {
        id = text.toLowerCase()
            .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
            .replace(/^-|-$/g, '')
        el.id = id
      }

      headings.push({id, text, depth})
    })

    // 更新布局中的标题列表
    if (setDocHeadings) {
      setDocHeadings(headings)
    }
  })
}

// 页面挂载时提取标题
onMounted(() => {
  extractHeadings()
})

// 监听 page 数据变化，重新提取标题
watch(page, () => {
  if (page.value) {
    extractHeadings()
  }
})
</script>

<style scoped>
.doc-page {
  width: 100%;
}

.doc-article {
  color: var(--theme-text-primary);
}

/* 文档标题区域 */
.doc-header {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--theme-border);
  position: relative;
}

.doc-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 5rem;
  height: 2px;
  background-color: var(--theme-accent-color);
  box-shadow: 0 0 0.5rem var(--theme-accent-color);
}

.doc-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--theme-text-primary);
  margin-bottom: 1rem;
  line-height: 1.2;
  position: relative;
  padding-left: 1rem;
}

.doc-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 0.375rem;
  height: 100%;
  background-color: var(--theme-accent-color);
  box-shadow: 0 0 0.5rem var(--theme-accent-color);
}

.doc-description {
  font-size: var(--font-size-base);
  color: var(--theme-text-secondary);
  line-height: 1.6;
  margin-top: 1rem;
}

/* 文档内容区域 */
.doc-body {
  font-size: var(--font-size-base);
  line-height: 1.8;
  color: var(--theme-text-primary);
}

/* 文档内容样式 */
.doc-body :deep(h2) {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--theme-text-primary);
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--theme-border);
  position: relative;
  padding-left: 1rem;
}

.doc-body :deep(h2)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 0.25rem;
  height: 100%;
  background-color: var(--theme-accent-color);
}

.doc-body :deep(h3) {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--theme-text-primary);
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;
  position: relative;
  padding-left: 0.75rem;
}

.doc-body :deep(h3)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0.25rem;
  height: 60%;
  background-color: var(--theme-accent-color);
  opacity: 0.6;
}

.doc-body :deep(h4) {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--theme-text-primary);
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.doc-body :deep(p) {
  margin-bottom: 1.5rem;
  color: var(--theme-text-primary);
  line-height: 1.8;
}

.doc-body :deep(ul),
.doc-body :deep(ol) {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

.doc-body :deep(li) {
  margin-bottom: 0.75rem;
  color: var(--theme-text-primary);
  line-height: 1.6;
}

.doc-body :deep(li)::marker {
  color: var(--theme-accent-color);
}

.doc-body :deep(a) {
  color: var(--theme-accent-color);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all var(--transition-fast);
}

.doc-body :deep(a):hover {
  border-bottom-color: var(--theme-accent-color);
  text-shadow: 0 0 0.5rem var(--theme-shadow-accent-strong);
}

.doc-body :deep(code) {
  background-color: var(--theme-bg-tertiary);
  color: var(--theme-accent-color);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.9em;
  font-family: 'Courier New', monospace;
  border: 1px solid var(--theme-border);
}

.doc-body :deep(pre) {
  background-color: var(--theme-bg-tertiary);
  border: 1px solid var(--theme-border);
  border-left: 0.25rem solid var(--theme-accent-color);
  border-radius: var(--radius-sm);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  position: relative;
}

.doc-body :deep(pre code) {
  background-color: transparent;
  padding: 0;
  border: none;
  color: var(--theme-text-primary);
  font-size: var(--font-size-xs);
  line-height: 1.6;
}

.doc-body :deep(blockquote) {
  border-left: 0.375rem solid var(--theme-accent-color);
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  color: var(--theme-text-secondary);
  font-style: italic;
  position: relative;
}

.doc-body :deep(blockquote)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0.375rem;
  background-color: var(--theme-accent-color);
  box-shadow: 0 0 0.5rem var(--theme-accent-color);
}

.doc-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  border: 1px solid var(--theme-border);
}

.doc-body :deep(th),
.doc-body :deep(td) {
  padding: 0.75rem 1rem;
  border: 1px solid var(--theme-border);
  text-align: left;
}

.doc-body :deep(th) {
  background-color: var(--theme-bg-tertiary);
  font-weight: 600;
  color: var(--theme-text-primary);
}

.doc-body :deep(tr:nth-child(even)) {
  background-color: var(--theme-bg-tertiary);
}

.doc-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-sm);
  margin: 1.5rem 0;
  box-shadow: 0 0 1rem var(--theme-shadow-accent);
}

.doc-body :deep(hr) {
  border: none;
  height: 2px;
  background: linear-gradient(
      to right,
      transparent,
      var(--theme-accent-color) 20%,
      var(--theme-accent-color) 80%,
      transparent
  );
  margin: 3rem 0;
  opacity: 0.5;
}

/* 文档未找到 */
.doc-not-found {
  text-align: center;
  padding: 5rem 2rem;
}

.doc-not-found h1 {
  font-size: var(--font-size-4xl);
  color: var(--theme-text-primary);
  margin-bottom: 1rem;
}

.doc-not-found p {
  font-size: var(--font-size-base);
  color: var(--theme-text-secondary);
}

/* 响应式 */
@media (max-width: 768px) {
  .doc-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
  }

  .doc-title {
    font-size: var(--font-size-3xl);
  }

  .doc-description {
    font-size: var(--font-size-sm);
  }

  .doc-body {
    font-size: var(--font-size-sm);
  }

  .doc-body :deep(h2) {
    font-size: var(--font-size-xl);
    margin-top: 2rem;
  }

  .doc-body :deep(h3) {
    font-size: var(--font-size-lg);
    margin-top: 1.5rem;
  }

  .doc-body :deep(h4) {
    font-size: var(--font-size-md);
  }

  .doc-not-found h1 {
    font-size: var(--font-size-3xl);
  }

  .doc-not-found p {
    font-size: var(--font-size-sm);
  }
}
</style>