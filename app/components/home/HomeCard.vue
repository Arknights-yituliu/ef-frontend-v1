<script lang="ts" setup>
import type { CardButton, CardData, CardTagType } from '@/custom/core/homeCards';
import { useClipboard } from '@vueuse/core';
import { ButtonActionType, ButtonType } from '@/custom/core/homeCards';

const { t } = useI18n();
const { copy } = useClipboard();

interface Props {
  card: CardData;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
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

  // 分类按钮，过滤掉 Blank 类型的按钮
  const buttons = props.card.buttons || [];
  const mainButtons = buttons.filter((btn) => btn.buttonType === ButtonType.Main);
  const linkButtons = buttons.filter((btn) => btn.buttonType === ButtonType.Link);
  const textButtons = buttons.filter((btn) => btn.buttonType === ButtonType.Text);
  // Blank 类型的按钮不会显示

  const isFavorited = props.isFavorited || false;

  return {
    title: t(`${baseKey}.title`),
    tags,
    primaryTagColor,
    icon: props.card.icon,
    image: props.card.image,
    description: props.card.descriptionKey
      ? t(`${baseKey}.${props.card.descriptionKey}`)
      : undefined,
    buttons,
    mainButtons,
    linkButtons,
    textButtons,
    isFavorited,
  };
});

/**
 * 根据标签类型获取对应的颜色
 */
function getTagColor(tagType: CardTagType): string {
  switch (tagType) {
    case 'official': {
      return '#FFC107';
    } // 黄色
    case 'yituliu': {
      return '#00BCD4';
    } // 青色
    case 'yituliu3rd': {
      return '#00BCD4';
    } // 青色
    case 'thirdparty': {
      return '#F44336';
    } // 红色
    default: {
      return '#9E9E9E';
    } // 灰色
  }
}

/**
 * 处理卡片内按钮点击事件
 */
function handleCardButtonClick(button: CardButton) {
  if (button.action === ButtonActionType.Link) {
    // 跳转链接
    const target = button.target ? '_blank' : '_self';
    window.open(button.actionData, target);
  } else if (button.action === ButtonActionType.Copy) {
    // 复制文本
    copyToClipboard(button.actionData, t(button.copySuccessText || 'common.copySuccess'));
  }
}

/**
 * 复制文本到剪贴板
 */
async function copyToClipboard(text: string, successMessage: string) {
  try {
    // await navigator.clipboard.writeText(text);
    await copy(text);
    alert(successMessage);
  } catch (error) {
    console.error('复制失败:', error);
    alert(t('common.copyFailed'));
  }
}

/**
 * 切换收藏状态
 */
function toggleFavorite() {
  if (props.onToggleFavorite) {
    props.onToggleFavorite();
  }
}
</script>

<template>
  <v-card class="home-card">
    <div class="home-card-header">
      <img v-if="cardData.icon" :alt="cardData.title" class="home-card-logo" :src="cardData.icon" />
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
      <!-- 收藏按钮 -->
      <v-btn
        class="favorite-btn"
        :color="cardData.isFavorited ? 'warning' : 'grey'"
        density="comfortable"
        :icon="cardData.isFavorited ? 'mdi-star' : 'mdi-star-outline'"
        size="large"
        variant="text"
        @click.stop="toggleFavorite"
      />
    </div>
    <div class="home-card-content">
      <div v-if="cardData.image" class="home-card-image-wrapper">
        <img :alt="cardData.title" class="home-card-image" :src="cardData.image" />
        <div v-if="cardData.description" class="home-card-overlay">
          <p class="home-card-description">{{ cardData.description }}</p>
        </div>
      </div>
    </div>
    <!-- 卡片内按钮区域 -->
    <div
      v-if="
        (cardData.mainButtons && cardData.mainButtons.length > 0) ||
        (cardData.linkButtons && cardData.linkButtons.length > 0) ||
        (cardData.textButtons && cardData.textButtons.length > 0)
      "
      class="home-card-buttons"
    >
      <!-- 链接按钮和文本按钮 - 统一使用文字按钮样式，黑色 -->
      <v-btn
        v-for="button in cardData.linkButtons"
        :key="button.i18nKey"
        class="card-button card-button-text"
        :prepend-icon="button.icon"
        size="small"
        :text="t(`component.home.${button.i18nKey}`)"
        variant="text"
        @click="handleCardButtonClick(button)"
      />
      <v-btn
        v-for="button in cardData.textButtons"
        :key="button.i18nKey"
        class="card-button card-button-text"
        :prepend-icon="button.icon"
        size="small"
        variant="text"
        @click="handleCardButtonClick(button)"
      >
        {{ t(`component.home.${button.i18nKey}`) }}
        <v-tooltip v-if="button.popupText" activator="parent" location="top">{{
          t(button.popupText)
        }}</v-tooltip>
      </v-btn>
      <!-- 主按钮 - 永远置于最右侧 -->
      <v-btn
        v-for="button in cardData.mainButtons"
        :key="button.i18nKey"
        class="card-button"
        :color="button.color || 'primary'"
        :prepend-icon="button.icon"
        size="small"
        :style="{ borderLeft: `3px solid ${cardData.primaryTagColor}` }"
        :text="t(`component.home.${button.i18nKey}`)"
        @click="handleCardButtonClick(button)"
      />
    </div>
  </v-card>
</template>

<style scoped>
/* 卡片容器：垂直布局 */
.home-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--theme-text-primary);
  background: var(--theme-bg-secondary);
  border: 1px solid var(--theme-border);
}

/* 卡片标题栏：深色背景 */
.home-card-header {
  padding: 16px 0px 16px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 72px;
  position: relative;
  overflow: hidden;
  justify-content: space-between;
  background-color: var(--theme-bg-tertiary);
  border-bottom: 1px solid var(--theme-border);
}

/* 标题栏右侧小按钮容器 */
.home-card-header-actions {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

/* 收藏按钮 */
.favorite-btn {
  width: 54px;
  height: 54px;
  min-width: 54px;
  opacity: 0.7;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  flex-shrink: 0;
  align-self: center;
}

.favorite-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.home-card-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/svg/map-bg.svg');
  background-size: auto;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.04;
  pointer-events: none;
  z-index: 0;
}

[data-theme='dark'] .home-card-header::before {
  background-image: url('/svg/map-bg-white.svg');
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
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.45)) drop-shadow(0 0 3px rgba(0, 0, 0, 0.2));
}

[data-theme='dark'] .home-card-logo {
  filter: none;
}

/* 卡片标题：单行显示，超长时显示省略号 */
.home-card-title b {
  color: var(--theme-text-primary);
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
  display: flex;
  align-items: flex-end;
}

/* 卡片描述文本 */
.home-card-description {
  color: white;
  line-height: 1.6;
  margin: 0;
  font-size: var(--font-size-sm);
}

/* 卡片内按钮区域 - 白灰色背景 */
.home-card-buttons {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.75rem 1rem;
  min-height: 48px;
  justify-content: flex-end;
  flex-wrap: wrap;
  position: relative;
  overflow: hidden;
  background-color: var(--theme-bg-secondary);
  border-top: 1px solid var(--theme-border);
}

.home-card-buttons::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/svg/map-bg.svg');
  background-size: auto;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.05;
  pointer-events: none;
  z-index: 0;
}

[data-theme='dark'] .home-card-buttons::before {
  background-image: url('/svg/map-bg-white.svg');
}

/* 主按钮 - 保持原样式 */
.card-button {
  min-width: 80px;
  max-width: 216px;
  height: 36px;
  font-size: 0.875rem;
  flex-shrink: 0;
  border-left: 3px solid transparent;
}

/* 文本按钮样式 - 用于链接按钮和文本按钮 */
.card-button-text {
  min-width: 60px;
  max-width: 160px;
  height: 32px;
  color: var(--theme-text-primary) !important;
  font-size: 0.8125rem;
  opacity: 0.85;
}

.card-button-text:hover {
  opacity: 1;
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
