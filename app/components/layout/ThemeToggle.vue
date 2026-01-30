<template>
  <v-btn
    :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
    variant="text"
    @click="toggleTheme"
  />
</template>

<script setup lang="ts">
const { theme, toggleTheme } = useTheme();
</script>