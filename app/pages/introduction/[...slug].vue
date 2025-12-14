<template>
  <DocsDocumentPage :collection-name="collectionName" />
</template>

<script lang="ts" setup>
// 使用 docs 布局
definePageMeta({
  layout: 'docs',
});

const collectionName = 'introduction';
</script>
