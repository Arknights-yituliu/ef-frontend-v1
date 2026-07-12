<script lang="ts" setup>
import type { CardButton, CardData, CardTagType } from '@/custom/core/homeCards';
import { ButtonActionType, ButtonType } from '@/custom/core/homeCards';

const { t } = useI18n();
const isExpanded = ref(false);

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

  // Find the primary action button
  const buttons = (props.card.buttons || []).filter(
    (button) => button.buttonType !== ButtonType.Blank,
  );
  const mainButtons = buttons.filter((button) => button.buttonType === ButtonType.Main);
  const pageButtons = buttons.filter((button) => button.action === ButtonActionType.Link);
  const actionButton = mainButtons.length > 0 ? mainButtons[0] : buttons[0];

  return {
    title: t(`${baseKey}.title`),
    tags,
    primaryTagColor,
    icon: props.card.icon,
    actionButton,
    pageButtons,
    hasMultiplePages: pageButtons.length > 1,
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
 * 处理卡片点击事件
 */
function handleCardClick(): void {
  if (cardData.value.hasMultiplePages) {
    isExpanded.value = !isExpanded.value;
    return;
  }

  if (!cardData.value.actionButton) return;

  handleButtonAction(cardData.value.actionButton);
}

function handlePageButtonClick(button: CardButton): void {
  isExpanded.value = false;
  handleButtonAction(button);
}

function handleButtonAction(button: CardButton): void {
  if (button.action === ButtonActionType.Link) {
    // 跳转链接
    const target = button.target ? '_blank' : '_self';
    window.open(button.actionData, target);
  } else if (button.action === ButtonActionType.Copy) {
    // 复制文本
    copyToClipboard(button.actionData, t('common.copySuccess'));
  }
}

function closeLinkPicker(): void {
  isExpanded.value = false;
}

/**
 * 复制文本到剪贴板
 */
async function copyToClipboard(text: string, successMessage: string) {
  try {
    await navigator.clipboard.writeText(text);
    alert(successMessage);
  } catch (error) {
    console.error('复制失败:', error);
    alert(t('common.copyFailed'));
  }
}
</script>

<template>
  <div
    v-click-outside="closeLinkPicker"
    class="home-small-card"
    :class="{ 'is-expanded': isExpanded }"
  >
    <button
      :aria-expanded="cardData.hasMultiplePages ? isExpanded : undefined"
      class="home-small-card-header"
      type="button"
      @click="handleCardClick"
    >
      <img
        v-if="cardData.icon"
        :alt="cardData.title"
        class="home-small-card-logo"
        :src="cardData.icon"
      />
      <div class="home-small-card-title">
        <b>{{ cardData.title }}</b>
        <div v-if="cardData.tags.length > 0" class="home-small-card-tags">
          <span
            v-for="(tag, index) in cardData.tags"
            :key="index"
            class="home-small-card-tag"
            :style="{ backgroundColor: tag.color }"
          >
            {{ tag.text }}
          </span>
        </div>
      </div>
      <v-icon
        v-if="cardData.actionButton"
        class="home-small-card-arrow"
        :icon="cardData.hasMultiplePages && isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-right'"
        size="20"
      />
    </button>

    <Transition name="home-small-card-picker">
      <div v-if="cardData.hasMultiplePages && isExpanded" class="home-small-card-pages">
        <button
          v-for="button in cardData.pageButtons"
          :key="button.i18nKey"
          class="home-small-card-page"
          type="button"
          @click="handlePageButtonClick(button)"
        >
          <span class="home-small-card-page-icon">
            <v-icon :icon="button.icon || 'mdi-link-variant'" size="18" />
          </span>
          <span class="home-small-card-page-label">
            {{ t(`component.home.${button.i18nKey}`) }}
          </span>
          <v-icon
            class="home-small-card-page-arrow"
            :icon="button.target ? 'mdi-open-in-new' : 'mdi-chevron-right'"
            size="17"
          />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 小卡片容器 */
.home-small-card {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: visible;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
  color: var(--theme-text-primary);
  background: var(--theme-bg-secondary);
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 0 1px 3px var(--theme-glass-shadow);
  width: 280px;
  height: 58px;
}

.home-small-card:not(.is-expanded):hover {
  background: var(--theme-bg-tertiary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--theme-glass-shadow);
}

.home-small-card.is-expanded {
  z-index: 1000;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 4px 12px var(--theme-glass-shadow);
}

/* 小卡片标题栏 */
.home-small-card-header {
  display: flex;
  flex: 0 0 58px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 58px;
  padding: 8px 10px 8px 8px;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: 0;
  box-sizing: border-box;
  gap: 6px;
  position: relative;
  overflow: hidden;
  margin: 0;
}

.home-small-card-header:focus-visible,
.home-small-card-page:focus-visible {
  outline: 2px solid var(--theme-accent-color);
  outline-offset: -2px;
}

.home-small-card-header::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 0;
  bottom: 8px;
  width: 3px;
  background: var(--theme-text-tertiary);
  border-radius: 0 3px 3px 0;
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
}

/* 标题区域：占据剩余空间，垂直布局，左对齐 */
.home-small-card-title {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  justify-content: center;
  align-items: flex-start;
}

/* 卡片logo：左侧独立显示 */
.home-small-card-logo {
  width: 34px;
  height: 34px;
  padding: 4px;
  object-fit: contain;
  background: var(--theme-decorative-overlay-medium);
  border-radius: 6px;
  box-sizing: border-box;
  flex-shrink: 0;
}

/* 卡片标题：单行显示，超长时显示省略号 */
.home-small-card-title b {
  color: var(--theme-text-primary);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.1;
  margin: 0;
}

/* 标签容器 */
.home-small-card-tags {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}

/* 标签样式：背景色根据标签类型动态设置 */
.home-small-card-tag {
  display: inline-block;
  padding: 0 4px;
  color: white;
  font-size: 8px;
  border-radius: 2px;
  white-space: nowrap;
  line-height: 1.2;
}

/* 右侧箭头图标 */
.home-small-card-arrow {
  color: var(--theme-text-tertiary);
  flex-shrink: 0;
}

.home-small-card-pages {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: calc(100% - 1px);
  right: -1px;
  left: -1px;
  z-index: 1;
  gap: 2px;
  padding: 6px;
  background: var(--theme-bg-secondary);
  border: 1px solid var(--theme-border);
  border-top: 1px solid var(--theme-border);
  border-radius: 0 0 8px 8px;
  box-shadow: 0 12px 24px var(--theme-glass-shadow);
}

.home-small-card-picker-enter-active,
.home-small-card-picker-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.home-small-card-picker-enter-from,
.home-small-card-picker-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.home-small-card-page {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 40px;
  padding: 5px 7px;
  color: var(--theme-text-primary);
  font: inherit;
  font-size: 0.84rem;
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 6px;
  transition: background-color 0.15s ease;
}

.home-small-card-page:hover {
  background: var(--theme-bg-tertiary);
}

.home-small-card-page-icon {
  display: flex;
  flex: 0 0 30px;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin-right: 8px;
  color: var(--theme-text-secondary);
  background: var(--theme-decorative-overlay-medium);
  border-radius: 6px;
}

.home-small-card-page-label {
  overflow: hidden;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.home-small-card-page-arrow {
  flex-shrink: 0;
  margin-left: 8px;
  color: var(--theme-text-tertiary);
}
</style>
