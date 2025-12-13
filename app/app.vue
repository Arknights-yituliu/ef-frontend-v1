<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <!-- 将项目主题与Vuetify的主题进行绑定 -->
    <v-theme-provider :theme="themeValue">
      <v-app>
        <NuxtPage />
      </v-app>
    </v-theme-provider>
  </NuxtLayout>
</template>

<script setup lang="ts">
const { theme } = useTheme();
const themeValue = computed(() => theme.value);
</script>
