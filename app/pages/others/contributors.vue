<template>
  <div class="page-container">
    <h1 class="page-title">{{ t('page.contributors.title') }}</h1>
    <p class="page-description">{{ t('page.contributors.description') }}</p>

    <div class="contributors__cards" v-if="contributors.length">
      <ContainerContributorCard
        v-for="contributor in contributors"
        :key="contributor.name"
        :contributor="contributor"
      />
    </div>
    <p v-else class="contributors__empty">{{ t('component.contributorCard.empty') }}</p>
  </div>
</template>

<script setup lang="ts">
import contributorsData from '@/custom/info/contributors.json';

definePageMeta({
  layout: 'default',
});

const { t } = useI18n();

type LocalizedInfo = {
  position: string;
  tags: string[];
};

type Contributor = {
  name: string;
  avatarImg: string;
  link?: string;
  english: LocalizedInfo;
  chinese: LocalizedInfo;
};

const contributors = computed<Contributor[]>(() => contributorsData.contributors ?? []);

// SEO 配置
const siteName = computed(() => t('layout.siteName'));
const pageTitle = computed(() => `${t('page.contributors.title')} - ${siteName.value}`);
const pageDescription = computed(() => t('page.contributors.description'));

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  ogType: 'website',
  twitterCard: 'summary',
});

useHead({
  title: () => pageTitle.value,
});
</script>

<style scoped>
.page-title {
  font-size: clamp(2rem, 3vw + 1rem, 2.75rem);
  color: var(--theme-text-primary);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.page-description {
  font-size: var(--font-size-lg);
  color: var(--theme-text-secondary);
  line-height: 1.6;
  max-width: 800px;
  margin-bottom: 2rem;
}

.contributors__cards {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  justify-content: flex-start;
  align-items: stretch;
}

.contributors__empty {
  color: var(--theme-text-secondary);
  font-size: var(--font-size-base);
  margin-top: var(--spacing-lg);
  text-align: left;
}

@media (max-width: 768px) {
  .contributors__cards {
    gap: var(--spacing-md);
  }
}
</style>
