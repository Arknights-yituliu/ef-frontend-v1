<script lang="ts" setup>
import type { HomeBookmark } from '@/shared/types/homeBookmark';
import { getHomeBookmarkAvatarTextColor } from '@/shared/types/homeBookmark';

const props = defineProps<{
  bookmark: HomeBookmark;
}>();

const emit = defineEmits<{
  edit: [bookmark: HomeBookmark];
  delete: [bookmark: HomeBookmark];
}>();

const { t } = useI18n();
const avatarTextColor = computed(() => getHomeBookmarkAvatarTextColor(props.bookmark.avatarColor));

const destinationLabel = computed(() => {
  if (props.bookmark.url.startsWith('/')) {
    return props.bookmark.url;
  }

  try {
    return new URL(props.bookmark.url).hostname;
  } catch {
    return props.bookmark.url;
  }
});

function openBookmark(): void {
  if (props.bookmark.url.startsWith('/')) {
    if (props.bookmark.openInNewTab) {
      window.open(props.bookmark.url, '_blank', 'noopener,noreferrer');
    } else {
      navigateTo(props.bookmark.url);
    }
    return;
  }

  const target = props.bookmark.openInNewTab ? '_blank' : '_self';
  window.open(props.bookmark.url, target, 'noopener,noreferrer');
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openBookmark();
  }
}
</script>

<template>
  <div
    class="home-bookmark-card"
    role="link"
    tabindex="0"
    @click="openBookmark"
    @keydown="handleKeydown"
  >
    <div class="home-bookmark-card-pattern" />
    <div
      class="home-bookmark-icon"
      :style="{ backgroundColor: bookmark.avatarColor, color: avatarTextColor }"
    >
      {{ bookmark.avatarText }}
    </div>

    <div class="home-bookmark-content">
      <b>{{ bookmark.title }}</b>
      <span>{{ destinationLabel }}</span>
    </div>

    <v-menu location="bottom end">
      <template #activator="{ props: menuProps }">
        <v-btn
          v-bind="menuProps"
          :aria-label="t('component.home.bookmarks.actions')"
          class="home-bookmark-menu"
          icon="mdi-dots-vertical"
          size="small"
          variant="text"
          @click.stop
        />
      </template>
      <v-list density="compact">
        <v-list-item
          prepend-icon="mdi-pencil"
          :title="t('component.home.bookmarks.edit')"
          @click="emit('edit', bookmark)"
        />
        <v-list-item
          class="text-error"
          prepend-icon="mdi-delete"
          :title="t('component.home.bookmarks.delete')"
          @click="emit('delete', bookmark)"
        />
      </v-list>
    </v-menu>
  </div>
</template>

<style scoped>
.home-bookmark-card {
  position: relative;
  display: flex;
  align-items: center;
  width: 280px;
  height: 58px;
  padding: 8px 6px 8px 10px;
  overflow: hidden;
  color: var(--theme-text-primary);
  cursor: pointer;
  background: var(--theme-bg-secondary);
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  box-shadow: 0 1px 3px var(--theme-glass-shadow);
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.home-bookmark-card:hover {
  background: var(--theme-bg-tertiary);
  box-shadow: 0 4px 12px var(--theme-glass-shadow);
  transform: translateY(-2px);
}

.home-bookmark-card:focus-visible {
  outline: 2px solid var(--theme-accent-color);
  outline-offset: 2px;
}

.home-bookmark-card-pattern {
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 0;
  width: 3px;
  z-index: 0;
  pointer-events: none;
  content: '';
  background: var(--theme-text-tertiary);
  border-radius: 0 3px 3px 0;
  opacity: 0.5;
}

.home-bookmark-icon {
  z-index: 1;
  display: flex;
  flex: 0 0 34px;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  overflow: hidden;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.16);
  border-radius: 6px;
}

.home-bookmark-content {
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  margin-left: 8px;
}

.home-bookmark-content b,
.home-bookmark-content span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-bookmark-content b {
  font-size: 0.9rem;
  line-height: 1.2;
}

.home-bookmark-content span {
  font-size: 0.6875rem;
  line-height: 1.25;
  color: var(--theme-text-secondary);
}

.home-bookmark-menu {
  z-index: 1;
  flex: 0 0 36px;
  color: var(--theme-text-secondary);
}
</style>
