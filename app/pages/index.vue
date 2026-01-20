<template>
  <div class="page-content">
    <h1 class="welcome-title">{{ t('page.home.welcome') }}</h1>
    <p class="page-description">{{ t('page.home.hint') }}</p>

    <!-- 卡片组容器 -->
    <div class="card-group">
      <HomeCard v-for="card in visibleCards" :key="card.i18nKey" :card="card" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { homeCards } from '~/data/homeCards';

definePageMeta({
  layout: 'default',
});

const { t } = useI18n();

const visibleCards = computed(() => homeCards.filter((card) => card.visible !== false));
</script>

<style scoped>
.page-content {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.welcome-title {
  font-size: 3rem;
  font-weight: bold;
  color: var(--theme-text-primary);
  text-align: center;
  margin: 2rem;
}

.page-description {
  font-size: 1.125rem;
  color: var(--theme-text-secondary);
  text-align: center;
  max-width: 600px;
  line-height: 1.6;
}

.card-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
  gap: 1.5rem;
  max-width: 1320px;
  margin: 3rem auto 2rem;
  width: 100%;
}
</style>
