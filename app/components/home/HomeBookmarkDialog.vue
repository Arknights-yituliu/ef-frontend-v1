<script lang="ts" setup>
import type { HomeBookmark, HomeBookmarkInput } from '@/shared/types/homeBookmark';
import {
  getHomeBookmarkAvatarTextColor,
  getHomeBookmarkInitial,
  HOME_BOOKMARK_AVATAR_COLORS,
} from '@/shared/types/homeBookmark';

const props = defineProps<{
  bookmark?: HomeBookmark;
}>();

const emit = defineEmits<{
  save: [input: HomeBookmarkInput];
}>();

const model = defineModel<boolean>({ default: false });
const { t } = useI18n();

const form = ref();
const title = ref('');
const url = ref('');
const avatarText = ref('');
const avatarColor = ref<string>(HOME_BOOKMARK_AVATAR_COLORS[0]);
const openInNewTab = ref(true);

const dialogTitle = computed(() =>
  props.bookmark ? t('component.home.bookmarks.editTitle') : t('component.home.bookmarks.addTitle'),
);

const titleRules = [
  (value: string) =>
    Boolean(value.trim()) || t('component.home.bookmarks.validation.titleRequired'),
  (value: string) =>
    value.trim().length <= 40 || t('component.home.bookmarks.validation.titleTooLong'),
];

const urlRules = [
  (value: string) => Boolean(value.trim()) || t('component.home.bookmarks.validation.urlRequired'),
  (value: string) =>
    validateHomeBookmarkUrl(value) || t('component.home.bookmarks.validation.urlInvalid'),
];

const avatarTextRules = [
  (value: string) =>
    Boolean(value.trim()) || t('component.home.bookmarks.validation.avatarTextRequired'),
  (value: string) =>
    Array.from(value.trim()).length === 1 ||
    t('component.home.bookmarks.validation.avatarTextTooLong'),
];

const avatarPreviewText = computed(
  () => getHomeBookmarkInitial(avatarText.value) || getHomeBookmarkInitial(title.value) || '?',
);
const avatarPreviewTextColor = computed(() => getHomeBookmarkAvatarTextColor(avatarColor.value));

function resetForm(): void {
  title.value = props.bookmark?.title ?? '';
  url.value = props.bookmark?.url ?? '';
  avatarText.value =
    props.bookmark?.avatarText ?? getHomeBookmarkInitial(props.bookmark?.title ?? '');
  avatarColor.value = props.bookmark?.avatarColor ?? HOME_BOOKMARK_AVATAR_COLORS[0];
  openInNewTab.value = props.bookmark?.openInNewTab ?? true;
  form.value?.resetValidation();
}

async function submit(): Promise<void> {
  const result = await form.value?.validate();
  if (!result?.valid) {
    return;
  }

  emit('save', {
    title: title.value,
    url: url.value,
    avatarText: avatarText.value,
    avatarColor: avatarColor.value,
    openInNewTab: openInNewTab.value,
  });
  model.value = false;
}

watch(
  () => [model.value, props.bookmark],
  ([isOpen]) => {
    if (isOpen) {
      nextTick(resetForm);
    }
  },
);

watch(title, (value, previousValue) => {
  const previousInitial = getHomeBookmarkInitial(previousValue);
  if (!avatarText.value || avatarText.value === previousInitial) {
    avatarText.value = getHomeBookmarkInitial(value);
  }
});
</script>

<template>
  <v-dialog v-model="model" max-width="520">
    <v-card>
      <v-card-title class="bookmark-dialog-title">
        <span>{{ dialogTitle }}</span>
        <v-btn
          :aria-label="t('common.close')"
          icon="mdi-close"
          size="small"
          variant="text"
          @click="model = false"
        />
      </v-card-title>

      <v-form ref="form" @submit.prevent="submit">
        <v-card-text class="bookmark-dialog-fields">
          <v-text-field
            v-model="title"
            autofocus
            counter="40"
            :label="t('component.home.bookmarks.fields.title')"
            maxlength="40"
            :rules="titleRules"
          />
          <v-text-field
            v-model="url"
            :label="t('component.home.bookmarks.fields.url')"
            placeholder="https://example.com"
            :rules="urlRules"
          />
          <div class="bookmark-avatar-fields">
            <div
              class="bookmark-avatar-preview"
              :style="{ backgroundColor: avatarColor, color: avatarPreviewTextColor }"
            >
              {{ avatarPreviewText }}
            </div>
            <v-text-field
              v-model="avatarText"
              counter="1"
              :label="t('component.home.bookmarks.fields.avatarText')"
              maxlength="1"
              :rules="avatarTextRules"
            />
          </div>
          <div class="bookmark-color-field">
            <span>{{ t('component.home.bookmarks.fields.avatarColor') }}</span>
            <div class="bookmark-color-options">
              <button
                v-for="color in HOME_BOOKMARK_AVATAR_COLORS"
                :key="color"
                :aria-label="t('component.home.bookmarks.fields.colorOption', { color })"
                class="bookmark-color-swatch"
                :class="{ 'bookmark-color-swatch-selected': avatarColor === color }"
                :style="{ backgroundColor: color }"
                type="button"
                @click="avatarColor = color"
              >
                <v-icon
                  v-if="avatarColor === color"
                  :color="getHomeBookmarkAvatarTextColor(color)"
                  icon="mdi-check"
                  size="16"
                />
              </button>
              <label
                class="bookmark-custom-color"
                :style="{ backgroundColor: avatarColor }"
                :title="t('component.home.bookmarks.fields.customColor')"
              >
                <v-icon
                  :color="getHomeBookmarkAvatarTextColor(avatarColor)"
                  icon="mdi-palette-outline"
                  size="17"
                />
                <input
                  v-model="avatarColor"
                  :aria-label="t('component.home.bookmarks.fields.customColor')"
                  class="bookmark-custom-color-input"
                  type="color"
                />
              </label>
            </div>
          </div>
          <v-switch
            v-model="openInNewTab"
            color="primary"
            hide-details
            :label="t('component.home.bookmarks.fields.openInNewTab')"
          />
        </v-card-text>

        <v-card-actions class="bookmark-dialog-actions">
          <v-btn variant="text" @click="model = false">
            {{ t('component.home.bookmarks.cancel') }}
          </v-btn>
          <v-btn color="primary" prepend-icon="mdi-content-save" type="submit">
            {{ t('component.home.bookmarks.save') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.bookmark-dialog-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 1.125rem;
  font-weight: 700;
}

.bookmark-dialog-fields {
  display: grid;
  gap: 0.25rem;
}

.bookmark-avatar-fields {
  display: grid;
  align-items: start;
  grid-template-columns: 56px minmax(0, 1fr);
  gap: 0.75rem;
}

.bookmark-avatar-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-top: 4px;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.16);
  border-radius: 6px;
}

.bookmark-color-field {
  display: grid;
  gap: 0.5rem;
  margin-top: -0.25rem;
  margin-bottom: 0.75rem;
  color: var(--theme-text-secondary);
  font-size: 0.75rem;
}

.bookmark-color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.bookmark-color-swatch,
.bookmark-custom-color {
  width: 32px;
  height: 32px;
  padding: 0;
  cursor: pointer;
  border: 1px solid var(--theme-border-secondary);
  border-radius: 6px;
}

.bookmark-color-swatch {
  display: flex;
  align-items: center;
  justify-content: center;
}

.bookmark-color-swatch-selected {
  outline: 2px solid var(--theme-text-primary);
  outline-offset: 2px;
}

.bookmark-color-swatch:focus-visible,
.bookmark-custom-color:focus-within {
  outline: 2px solid var(--theme-accent-color);
  outline-offset: 2px;
}

.bookmark-custom-color {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.bookmark-custom-color-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
}

.bookmark-dialog-actions {
  justify-content: flex-end;
  padding: 0 1.5rem 1.25rem;
}
</style>
