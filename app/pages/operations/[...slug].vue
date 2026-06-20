<template>
  <DocsDocumentPage :collection-name="collectionName" />
</template>

<script lang="ts" setup>
// 使用 docs 布局
definePageMeta({
  layout: 'docs',
});

// 设置集合名称以匹配新目录
const collectionName = 'operations';

const { t } = useI18n();
usePageSeo({
  title: () => `${t('docs.sections.operations')} - ${t('docs.siteTitle')}`,
  description: () => t('docs.siteTitle'),
  type: 'article',
});
</script>
