<template>
  <div class="page-container">
    <header v-if="page" class="page-title">{{ page.title }}</header>
    <p v-if="page?.description" class="page-description">{{ page.description }}</p>

    <div v-if="page" class="page-content">
      <ContentRenderer :value="page" />
    </div>

    <div v-else class="page-not-found">
      <h1>{{ $t('docs.notFound') }}</h1>
      <p>{{ $t('docs.notFoundDescription') }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 使用默认布局
definePageMeta({
  layout: 'default',
});

const route = useRoute();
const { locale, t } = useI18n();

// 定义页面数据类型
interface PageData {
  title?: string;
  description?: string;
  body?: any;
  [key: string]: any;
}

// 使用 queryCollection API 获取内容，监听语言变化
const { data: page, refresh } = await useAsyncData<PageData | null>(
  `${route.path}-${locale.value}-resources`,
  () => {
    // content/ 下的实际文件路径形如 resources/essence-recognizer-zh或resources/essence-recognizer-en
    const contentPath = `${route.path}-${locale.value.substring(0, 2)}`;

    // queryCollection 的类型定义不支持动态字符串，但运行时可以正常工作
    return (queryCollection('resources') as any).path(contentPath).first();
  },
  { default: () => null },
);

// 监听语言变化，重新获取文档
watch(locale, () => {
  refresh();
});

// SEO 配置
const siteName = computed(() => t('layout.siteName'));
const pageTitle = computed(() => {
  if (page.value?.title) {
    return `${page.value.title} - ${siteName.value}`;
  }
  return siteName.value;
});
const pageDescription = computed(() => {
  return page.value?.description || siteName.value;
});

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  ogType: 'article',
  twitterCard: 'summary',
});

useHead({
  title: () => pageTitle.value,
});
</script>

<style scoped>
@import '../../assets/css/pageMarkdown.css';
</style>
