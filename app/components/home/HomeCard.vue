<script lang="ts" setup>
import type { CardData } from '~/data/homeCards';

const { t } = useI18n();

interface Props {
  card: CardData;
}

const props = defineProps<Props>();

const cardData = computed(() => {
  const baseKey = `component.home.cards.${props.card.i18nKey}`;
  return {
    title: t(`${baseKey}.title`),
    tag: t(`${baseKey}.tag`),
    icon: props.card.icon,
    link: props.card.link,
    image: props.card.image,
    description: props.card.descriptionKey
      ? t(`${baseKey}.${props.card.descriptionKey}`)
      : undefined,
  };
});
</script>

<template>
  <v-card class="home-card">
    <div class="home-card-header">
      <div class="home-card-title">
        <img
          v-if="cardData.icon"
          :alt="cardData.title"
          :src="cardData.icon"
          class="home-card-title-icon"
        />
        <b>{{ cardData.title }}</b>
        <span v-if="cardData.tag" class="home-card-tag">{{ cardData.tag }}</span>
      </div>
      <div class="flex-1" />
      <template v-if="cardData.link">
        <v-btn
          :href="cardData.link.href"
          prepend-icon="mdi-web"
          :text="t(`component.home.cards.${card.i18nKey}.${cardData.link.i18nKey}`)"
          append-icon="mdi-open-in-new"
          color="primary"
          size="small"
          target="_blank"
        />
      </template>
    </div>
    <div class="home-card-content">
      <img
        v-if="cardData.image"
        :alt="cardData.title"
        :src="cardData.image"
        class="home-card-image"
      />
      <p v-if="cardData.description" class="home-card-description">{{ cardData.description }}</p>
    </div>
  </v-card>
</template>

<style scoped>
.home-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.home-card-header {
  background-color: rgba(0, 0, 0, 0.8);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
}

.home-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.home-card-title-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.home-card-title b {
  color: white;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.home-card-tag {
  display: inline-block;
  padding: 2px 8px;
  background-color: var(--theme-accent-color);
  color: white;
  font-size: var(--font-size-xs);
  border-radius: var(--radius-sm);
  margin-left: var(--spacing-xs);
}

.home-card-content {
  padding: 16px;
  flex: 1;
}

.home-card-image {
  width: 100%;
  display: block;
  border-radius: var(--radius-md);
  object-fit: cover;
  margin-bottom: var(--spacing-md);
}

.home-card-description {
  color: var(--theme-text-secondary);
  line-height: 1.6;
  margin: 0;
  font-size: var(--font-size-sm);
}

.home-card-custom :deep(*) {
  margin-bottom: var(--spacing-sm);
}

.home-card-custom :deep(a.simple-link) {
  font-size: var(--font-size-sm);
}

.home-card-custom :deep(.p-title) {
  font-size: var(--font-size-sm);
  font-weight: 600;
  padding: var(--spacing-sm) 0;
}

.home-card-custom :deep(.p-li) {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.home-card-custom :deep(.p-li::before) {
  content: '\2022';
  margin-right: var(--spacing-xs);
}
</style>
