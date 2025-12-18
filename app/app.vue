<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { initGameData } from '@/shared/utils/gameData/gameData';
await initGameData();
// 页面挂载时，给body添加.hide-scrollbar
onMounted(() => {
  document.body.classList.add('hide-scrollbar');
});
onUnmounted(() => {
  document.body.classList.remove('hide-scrollbar');
});
</script>
