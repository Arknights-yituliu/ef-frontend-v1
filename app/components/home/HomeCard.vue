<script lang="ts" setup>
import type { CardData, CardTagType } from '~/data/homeCards';

const { t } = useI18n();

interface Props {
  card: CardData;
}

const props = defineProps<Props>();

const cardData = computed(() => {
  const baseKey = `component.home.cards.${props.card.i18nKey}`;

  // Get localized text for each tag type
  const getTagText = (tagType: CardTagType): string => {
    return t(`component.home.tags.${tagType}`);
  };

  const tags =
    props.card.tagTypes?.map((tagType) => ({
      text: getTagText(tagType),
      color: getTagColor(tagType),
    })) || [];

  // Get the first tag color as primary color for button decoration
  const primaryTagColor = tags.length > 0 && tags[0] ? tags[0].color : '#9E9E9E';

  return {
    title: t(`${baseKey}.title`),
    tags,
    primaryTagColor,
    icon: props.card.icon,
    link: props.card.link,
    image: props.card.image,
    description: props.card.descriptionKey
      ? t(`${baseKey}.${props.card.descriptionKey}`)
      : undefined,
  };
});

/**
 * 根据标签类型获取对应的颜色
 */
const getTagColor = (tagType: CardTagType): string => {
  switch (tagType) {
    case 'official':
      return '#FFC107'; // 黄色
    case 'yituliu':
      return '#00BCD4'; // 青色
    case 'yituliu3rd':
      return '#00BCD4'; // 青色
    case 'thirdparty':
      return '#F44336'; // 红色
    default:
      return '#9E9E9E'; // 灰色
  }
};
</script>

<template>
  <v-card class="home-card">
    <div class="home-card-header">
      <img v-if="cardData.icon" :alt="cardData.title" :src="cardData.icon" class="home-card-logo" />
      <div class="home-card-title">
        <b>{{ cardData.title }}</b>
        <div v-if="cardData.tags.length > 0" class="home-card-tags">
          <span
            v-for="(tag, index) in cardData.tags"
            :key="index"
            class="home-card-tag"
            :style="{ backgroundColor: tag.color }"
          >
            {{ tag.text }}
          </span>
        </div>
      </div>
      <template v-if="cardData.link">
        <v-btn
          class="home-card-link-btn"
          :href="cardData.link.href"
          prepend-icon="mdi-web"
          :text="t(`component.home.cards.${card.i18nKey}.${cardData.link.i18nKey}`)"
          append-icon="mdi-open-in-new"
          color="primary"
          size="small"
          target="_blank"
          :style="{ borderLeft: `3px solid ${cardData.primaryTagColor}` }"
        />
      </template>
    </div>
    <div class="home-card-content">
      <div v-if="cardData.image" class="home-card-image-wrapper">
        <img :alt="cardData.title" :src="cardData.image" class="home-card-image" />
        <div v-if="cardData.description" class="home-card-overlay">
          <p class="home-card-description">{{ cardData.description }}</p>
        </div>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
/* 卡片容器：垂直布局 */
.home-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 卡片标题栏：深色背景 */
.home-card-header {
  background-color: rgba(0, 0, 0, 0.8);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 72px;
  position: relative;
  overflow: hidden;
}

.home-card-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/svg/map-bg-white.svg');
  background-size: auto;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.1;
  pointer-events: none;
  z-index: 0;
}

/* 标题区域：占据剩余空间，垂直布局，左对齐 */
.home-card-title {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  justify-content: flex-start;
  align-items: flex-start;
}

/* 卡片logo：左侧独立显示 */
.home-card-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  flex-shrink: 0;
}

/* 卡片标题：单行显示，超长时显示省略号 */
.home-card-title b {
  color: white;
  font-size: 1.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 标签容器 */
.home-card-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

/* 标签样式：背景色根据标签类型动态设置 */
.home-card-tag {
  display: inline-block;
  padding: 1px 6px;
  color: white;
  font-size: 10px;
  border-radius: 3px;
  white-space: nowrap;
  line-height: 1.4;
}

/* 卡片内容区域 */
.home-card-content {
  padding: 0;
  flex: 1;
  overflow: hidden;
}

/* 图片包装容器 */
.home-card-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 卡片图片 */
.home-card-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}

/* 灰色透明字纱覆盖层 */
.home-card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    rgba(0, 0, 0, 0) 100%
  );
  padding: 20px 16px 16px 16px;
  min-height: 100px;
}

/* 卡片描述文本 */
.home-card-description {
  color: white;
  line-height: 1.6;
  margin: 0;
  font-size: var(--font-size-sm);
}

/* 卡片链接按钮 */
.home-card-link-btn {
  border-left: 3px solid transparent;
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
