<template>
  <v-btn
    class="feedback-action-btn"
    :color="buttonColor"
    :prepend-icon="icon"
    size="small"
    variant="tonal"
    @click="handleAction"
  >
    {{ text }}
  </v-btn>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  actionType: 'copy' | 'link';
  url: string;
}>();

const { t } = useI18n();
const { copy, copied, isSupported } = useClipboard();

const icon = computed(() => {
  if (props.actionType === 'copy') {
    return copied.value ? 'mdi-check' : 'mdi-content-copy';
  } else {
    return 'mdi-open-in-new';
  }
});

const text = computed(() => {
  if (props.actionType === 'copy') {
    return copied.value ? t('feedback.modal.copied') : t('feedback.modal.copyBtn');
  } else {
    return t('feedback.modal.actionBtn');
  }
});

const buttonColor = computed(() => {
  if (props.actionType === 'copy') {
    return copied.value ? 'success' : 'warning';
  } else {
    return 'primary';
  }
});

async function handleAction() {
  if (!props.url) {
    console.warn('No URL or content provided for action');
    return;
  }

  if (props.actionType === 'copy') {
    if (!isSupported.value) {
      console.error('Clipboard API is not supported');
      return;
    }
    await copy(props.url);
  } else {
    window.open(props.url, '_blank', 'noopener,noreferrer');
  }
}
</script>
