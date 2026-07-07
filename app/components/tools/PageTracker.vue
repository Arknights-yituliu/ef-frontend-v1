<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import baseUrl from '@/custom/config/base-url';

const route = useRoute();

// 监听路由变化
watch(
  () => route.fullPath,
  async (_newPath) => {
    if (!import.meta.client) return;
    try {
      const currentUrl = window.location.href;
      console.log(currentUrl);
      const data = {
        url: currentUrl,
      };

      await fetch(`${baseUrl}/access-log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Page URL uploaded successfully');
    } catch (error) {
      console.error('Failed to upload page URL:', error);
    }
  },
  { immediate: true }, // 页面加载时立即执行一次
);
</script>

<template>
  <div />
</template>
