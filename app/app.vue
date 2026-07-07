<template>
  <!-- 页面访问记录 -->
  <ToolsPageTracker />
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script lang="ts" setup>
// 初始化主题（确保主题系统在页面加载时就初始化）
useTheme();
</script>
