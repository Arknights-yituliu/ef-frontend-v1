<template>
  <div class="home-page">
    <div class="page-title">
      <TextParticleWord :text="t('layout.siteName')" class="particle-word"/>
    </div>

    <!-- 滚动横幅（我们把它用 v-if="false" 隐藏了） -->
    <v-carousel
      v-if="false"
      class="index-carousel"
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

    <div class="home-navigation-card-group">
      <HomeCheckAccess></HomeCheckAccess>
      <HomeContribute></HomeContribute>
      <HomeYiTuLiu></HomeYiTuLiu>
      <HomePenguinStatistics></HomePenguinStatistics>
    </div>

    <!-- <p class="page-description">
      {{ t('page.home.welcome') }}
    </p>
    <p class="page-hint">
      {{ t('page.home.hint') }}
    </p> -->
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'default',
});

const colors = ['indigo', 'warning', 'pink darken-2', 'red lighten-1', 'deep-purple accent-4'];
const slides = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];

const {t} = useI18n();
</script>

<style scoped>
.home-page {
  padding: 2rem 0 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .index-carousel {
    max-width: 90%;
    margin: auto;
  }

  .home-navigation-card-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    max-width: 90%;
    margin: auto;
  }


  :deep(.home-navigation-card) {
    width: calc(50% - 0.5rem);
    margin: 0.5rem 0;
  }

  :deep(.home-navigation-card-title) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    font-size: var(--font-size-lg);
  }

  :deep(.home-navigation-card-title-icon) {
    width: 28px;
    height: 28px;
    margin: 0 var(--spacing-sm) 0 0;
  }

  :deep(.p-title) {
    font-size: var(--font-size-sm);
    font-weight: bolder;
    padding: var(--spacing-md) 0;
  }

  :deep(.p-li) {
    padding: var(--spacing-xs) var(--spacing-md);
  }

  :deep(.p-li::before) {
    content: "\2022";
    margin-right: var(--spacing-xs);
  }


  @media (max-width: 660px) {
    .index-carousel {
      max-width: 99%;
    }

    .home-navigation-card-group {
      max-width: 100%;
    }

    :deep(.home-navigation-card) {
      width: 99%;
      margin: var(--spacing-sm) 0;
      font-size: var(--font-size-xs);
    }

    :deep(.home-navigation-card-title ) {
      font-size: var(--font-size-sm);
    }

    :deep(.home-navigation-card-title-icon) {
      width: 28px;
      height: 28px;
      margin: 0 var(--spacing-sm) 0 0;
    }
  }
}

.page-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}

.particle-word {
  color: var(--theme-accent-color);
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
