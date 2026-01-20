<template>
  <div class="test-page">
    <CustomBackground />
    <div class="content">
      <h1>Empty Test Page</h1>
      <p>This is a blank page to test the background.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomBackground from '~/components/layout/CustomBackground.vue'
</script>

<style scoped>
.test-page {
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.content {
  padding: 20px;
  color: #333;
}
</style>
