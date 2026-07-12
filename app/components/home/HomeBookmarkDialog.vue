<script lang="ts" setup>
import type { HomeBookmark, HomeBookmarkInput } from '@/shared/types/homeBookmark';

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
const icon = ref('');
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

const iconRules = [
  (value: string) =>
    !value.trim() ||
    validateHomeBookmarkUrl(value) ||
    t('component.home.bookmarks.validation.iconInvalid'),
];

function resetForm(): void {
  title.value = props.bookmark?.title ?? '';
  url.value = props.bookmark?.url ?? '';
  icon.value = props.bookmark?.icon ?? '';
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
    icon: icon.value || undefined,
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
          <v-text-field
            v-model="icon"
            clearable
            :label="t('component.home.bookmarks.fields.icon')"
            placeholder="https://example.com/favicon.ico"
            :rules="iconRules"
          />
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

.bookmark-dialog-actions {
  justify-content: flex-end;
  padding: 0 1.5rem 1.25rem;
}
</style>
