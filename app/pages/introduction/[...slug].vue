<template>
  <DocsDocumentPage :collection-name="collectionName" />
</template>

<script lang="ts" setup>
// 使用 docs 布局
definePageMeta({
  layout: 'docs',
});

const collectionName = 'introduction';

const { t } = useI18n();
usePageSeo({
  title: () => `${t('docs.sections.introduction')} - ${t('docs.siteTitle')}`,
  description: () => t('docs.siteTitle'),
  type: 'article',
});
</script>
