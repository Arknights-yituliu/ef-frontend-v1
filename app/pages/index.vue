<template>
  <div class="home-page">
    <div class="page-title">
      <TextParticleWord />
    </div>
    <p class="page-description">
      {{ t('page.home.welcome') }}
    </p>
    <p class="page-hint">
      {{ t('page.home.hint') }}
    </p>

    <section class="contributors">
      <div class="contributors__content">
        <h2 class="contributors__title">{{ t('page.home.contributorsTitle') }}</h2>
        <p class="contributors__description">
          {{ t('page.home.contributorsDescription') }}
        </p>
      </div>
      <div class="contributors__cards">
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'default'
})

const { t } = useI18n()
</script>

<style scoped>
.home-page {
  padding: 2rem 0 4rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
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

.contributors {
  margin-top: 2.5rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  justify-items: center;
  gap: 1.5rem;
}

.contributors__content {
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: center;
}

.contributors__title {
  font-size: clamp(1.5rem, 2vw + 1rem, 2.25rem);
  color: var(--theme-text-primary);
  font-weight: 700;
}

.contributors__description {
  font-size: var(--font-size-md);
  color: var(--theme-text-secondary);
  line-height: 1.6;
}

.contributors__cards {
  width: min(100%, 640px);
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .contributors__cards {
    transform: scale(0.85);
  }
}

@media (max-width: 480px) {
  .contributors__cards {
    transform: scale(0.75);
  }
}
</style>
