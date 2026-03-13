<script lang="ts" setup>
import type { CardData, CardTagType } from '@/custom/core/homeCards';
import { ButtonActionType, ButtonType } from '@/custom/core/homeCards';

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

  // Find the primary action button
  const buttons = props.card.buttons || [];
  const mainButtons = buttons.filter((btn) => btn.buttonType === ButtonType.Main);
  const actionButton = mainButtons.length > 0 ? mainButtons[0] : buttons[0];

  return {
    title: t(`${baseKey}.title`),
    tags,
    primaryTagColor,
    icon: props.card.icon,
    actionButton,
  };
});

/**
 * 根据标签类型获取对应的颜色
 */
function getTagColor (tagType: CardTagType): string {
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
function handleCardClick () {
  if (!cardData.value.actionButton) return;
  
  const button = cardData.value.actionButton;
  if (button.action === ButtonActionType.Link) {
    // 跳转链接
    const target = button.target ? '_blank' : '_self';
    window.open(button.actionData, target);
  } else if (button.action === ButtonActionType.Copy) {
    // 复制文本
    copyToClipboard(button.actionData, t('common.copySuccess'));
  }
}

/**
 * 复制文本到剪贴板
 */
async function copyToClipboard (text: string, successMessage: string) {
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
  <div class="home-small-card" @click="handleCardClick">
    <div class="home-small-card-header">
      <img v-if="cardData.icon" :alt="cardData.title" class="home-small-card-logo" :src="cardData.icon" >
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
      <span v-if="cardData.actionButton" class="home-small-card-arrow">›</span>
    </div>
  </div>
</template>

<style scoped>
/* 小卡片容器 */
.home-small-card {
  display: flex;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: 8px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.8);
  width: 280px;
  height: 58px;
}

.home-small-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 小卡片标题栏：深色背景 */
.home-small-card-header {
  width: 100%;
  background-color: transparent;
  padding: 8px 10px 8px 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 100%;
  position: relative;
  overflow: hidden;
  justify-content: space-between;
  margin: 0;
}

.home-small-card-header::before {
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
  width: 30px;
  height: 30px;
  object-fit: contain;
  flex-shrink: 0;
}

/* 卡片标题：单行显示，超长时显示省略号 */
.home-small-card-title b {
  color: white;
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
  color: rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
  margin: 0;
  padding: 0;
  font-size: 20px;
  line-height: 1;
  font-weight: 300;
}
</style>