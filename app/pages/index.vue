<template>
  <div class="page-title">
    <TextParticleWord :text="t('layout.siteName')" class="particle-word" />
  </div>

  <!-- 滚动横幅（我们把它用 v-if="false" 隐藏了） -->
  <v-carousel
    class="index-carousel"
    v-if="false"
    cycle
    hide-delimiter-background
    show-arrows="hover"
  >
    <v-carousel-item v-for="(slide, i) in slides" :key="i">
      <v-sheet :color="colors[i]" height="100%">
        <div class="d-flex fill-height justify-center align-center">
          <div class="text-h2">{{ slide }} Slide</div>
        </div>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>

  <div class="card-group">
    <HomeCheckAccess />
    <HomeContribute />
    <HomeYiTuLiu />
    <HomePenguinStatistics />
  </div>

  <p class="page-description" v-if="false">
    {{ t('page.home.welcome') }}
  </p>
  <p class="page-hint" v-if="false">
    {{ t('page.home.hint') }}
  </p>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'default',
});

const colors = ['indigo', 'warning', 'pink darken-2', 'red lighten-1', 'deep-purple accent-4'];
const slides = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];

const { t } = useI18n();
</script>

<style scoped>
.index-carousel {
  margin: 3rem auto;
}

.page-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3rem auto;
}

.particle-word {
  color: var(--theme-accent-color);
}

.card-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 440px), 1fr));
  gap: 1.5rem;
  max-width: 1320px; /* 每行最多 2 个卡片 */
  margin: 3rem auto;
}

.page-description {
  font-size: var(--font-size-xl);
  color: var(--theme-text-primary);
  line-height: 1.5;
}

.page-hint {
  font-size: var(--font-size-md);
  color: var(--theme-text-secondary);
  line-height: 1.5;
}
</style>
