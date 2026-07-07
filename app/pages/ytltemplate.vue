<template>
  <div class="template-page">
    <CustomBackground />
    <div class="content">
      <h1>左右分栏模板测试</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomBackground from '~/components/layout/CustomBackground.vue';
</script>

<style scoped>
.template-page {
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.content {
  padding: 20px;
  color: #333;
}
</style>
