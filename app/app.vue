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
const { theme } = useTheme();

// 页面挂载时，给body添加.hide-scrollbar
onMounted(() => {
  document.body.classList.add('hide-scrollbar');
});
onUnmounted(() => {
  document.body.classList.remove('hide-scrollbar');
});
</script>
