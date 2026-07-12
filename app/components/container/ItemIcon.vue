<template>
  <div ref="itemIconPlaceholderRef" class="item-icon-placeholder">
    <img :alt="itemName" class="item-icon-img" :src="itemIconUrl" />
    <div class="item-gradient-overlay" />
    <div class="item-tier-bar" />
    <div v-if="props.showItemName" ref="itemNameRef" class="item-name">
      {{ itemName }}
    </div>
    <div v-if="props.charId" class="char-avatar-badge">
      <img :alt="props.charId" class="char-avatar-img" :src="getCharAvatarUrl(props.charId)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCharAvatarUrl } from '@/shared/utils/gameData/item';

const { locale } = useI18n();

interface Props {
  itemId: string;
  itemName?: string;
  showItemName?: boolean;
  charId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  itemName: undefined,
  showItemName: false,
  charId: undefined,
});

const itemIconPlaceholderRef = useTemplateRef<HTMLDivElement>('itemIconPlaceholderRef');
const itemNameRef = useTemplateRef<HTMLDivElement>('itemNameRef');

const itemName = computed(() => {
  if (props.itemName !== undefined) {
    return props.itemName;
  } else {
    return getItemName(props.itemId, locale.value);
  }
});

const itemIconUrl = computed(() => {
  const itemIconUrl = getItemIconUrl(props.itemId);
  if (!itemIconUrl) {
    return 'https://cos.yituliu.cn/endfield/other/默认武器图标.webp';
  } else {
    return itemIconUrl;
  }
});

watch([props, itemNameRef, locale], () => {
  nextTick(() => {
    if (itemNameRef.value) {
      updateText(
        itemNameRef.value,
        (itemIconPlaceholderRef.value?.clientWidth || 96) * 0.95,
        10,
        16,
      );
    }
  });
});
</script>

<style scoped>
.item-icon-placeholder {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--theme-bg-tertiary) 0%, var(--theme-bg-secondary) 100%);
  box-shadow: 0 2px 8px var(--theme-shadow-base);
  border: 2px solid var(--theme-border);
  border-bottom-width: 0;
  position: relative;
  overflow: hidden;
}

.item-icon-placeholder::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    -45deg,
    transparent,
    transparent 13.9512529279%,
    var(--theme-decorative-overlay-light) 0,
    var(--theme-decorative-overlay-light) 36.0487470721%,
    transparent 0,
    transparent 63.9512529279%,
    var(--theme-decorative-overlay-light) 0,
    var(--theme-decorative-overlay-light) 86.0487470721%,
    transparent 0,
    transparent
  );
  background-size: 0.5rem 0.5rem;
  background-repeat: repeat;
  opacity: 0.3;
  pointer-events: none;
}

.item-icon-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-gradient-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 70%,
    v-bind('getItemTierColor(props.itemId).alpha(0.3).string()') 100%
  );
}

.item-tier-bar {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 4%;
  background-color: v-bind('getItemTierColor(props.itemId).string()');
}

.item-name {
  position: absolute;
  bottom: 4%;
  width: 100%;
  font-weight: 500;
  line-height: 1;
  text-align: center;
  font-size: 1rem;
  text-shadow: 0 0 4px var(--theme-bg-primary);
  pointer-events: none;
}

.char-avatar-badge {
  position: absolute;
  top: -5%;
  right: -5%;
  width: 50%;
  height: 50%;
  border-radius: 50%;
  border: 0.125rem solid var(--theme-bg-primary);
  background-color: var(--theme-bg-tertiary);
  box-shadow:
    0 0 0 0.0625rem rgba(255, 255, 255, 0.15),
    0 0.125rem 0.5rem rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

.char-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
