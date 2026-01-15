<script setup>
const props = defineProps(['title', 'titleEn', 'tips']);
</script>
<template>
  <div class="module-header">
    <div class="module-title">
      <h1>{{ props.title }}</h1>
      <h4>{{ props.titleEn }}</h4>
    </div>
    <slot />
    <div v-for="(tip, index) in tips" :key="index" class="module-tip">{{ tip }}</div>
  </div>
</template>
