<template>
  <v-dialog
    max-width="600px"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="feedback-modal-card" style="position: relative; overflow: visible;">

      <!-- ✅ 移除了之前的独立 Toast 弹窗代码 -->

      <v-card-title class="feedback-modal-title d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-bold"></span>
        <v-btn
          class="feedback-modal-close-btn"
          icon="mdi-close"
          size="small"
          variant="text"
          @click="closeModal"
        />
      </v-card-title>

      <v-card-text class="feedback-modal-content pa-0">
        <v-data-table
          class="feedback-modal-table elevation-0"
          density="comfortable"
          :headers="headers"
          hide-default-footer
          :items="feedbackChannels"
        >
          <template #[`item.method`]="{ item }">
            {{ t(item.method) }}
          </template>

          <template #[`item.description`]="{ item }">
            {{ t(item.description) }}
          </template>

          <template #[`item.action`]="{ item }">
            <v-btn
              class="feedback-action-btn"
              :color="getButtonColor(item)"
              size="small"
              variant="tonal"
              @click="handleAction(item)"
            >
              <!-- ✅ 核心修改：根据 isCopied 状态动态显示文字 -->
              <v-icon v-if="item.isCopied" size="x-small" start>mdi-check</v-icon>
              {{ item.isCopied ? (t('feedback.modal.copied')) : (item.actionType === 'copy' ? t('feedback.modal.copyBtn') : t('feedback.modal.actionBtn')) }}
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface ChannelItem {
  method: string;
  description: string;
  actionType: 'copy' | 'link';
  url: string;
  isCopied?: boolean; // 用于标记复制状态
}

const { modelValue } = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const { t } = useI18n();

const headers = computed(() => [
  { title: t('feedback.table.header.method'), key: 'method', align: 'start' as const, sortable: false },
  { title: t('feedback.table.header.description'), key: 'description', align: 'start' as const, sortable: false },
  { title: t('feedback.table.header.action'), key: 'action', align: 'center' as const, sortable: false },
]);

const feedbackChannels = ref<ChannelItem[]>([
  {
    method: 'feedback.list.qq.title',
    description: 'feedback.list.qq.desc',
    actionType: 'copy',
    url: '3831811497',
    isCopied: false,
  },
  {
    method: 'feedback.list.github.title',
    description: 'feedback.list.github.desc',
    actionType: 'link',
    url: 'https://github.com/Arknights-yituliu/ef-frontend-v1/issues/new',
    isCopied: false,
  },
  {
    method: 'feedback.list.bilibili.title',
    description: 'feedback.list.bilibili.desc',
    actionType: 'link',
    url: 'https://space.bilibili.com/688411531?spm_id_from=333.337.0.0',
    isCopied: false,
  },
  {
    method: 'feedback.list.fanGroup.title',
    description: 'feedback.list.fanGroup.desc',
    actionType: 'link',
    url: 'https://qm.qq.com/q/EdjQZADudW',
    isCopied: false,
  },
  {
    method: 'feedback.list.devGroup.title',
    description: 'feedback.list.devGroup.desc',
    actionType: 'copy',
    url: '696486169',
    isCopied: false,
  },
]);

function getButtonColor(item: ChannelItem) {
  if (item.isCopied) {
    return 'success'; // 复制成功后变绿
  }
  return item.actionType === 'copy' ? '#F4D03F' : '#3b95f6';
}

async function copyToClipboard(text: string, item: ChannelItem) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.append(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }

    item.isCopied = true;

  } catch (error) {
    console.error('Failed to copy:', error);
  }
}

function handleAction(item: ChannelItem) {
  if (!item.url) {
    console.warn('No URL or content provided for action');
    return;
  }

  if (item.actionType === 'copy') {
    copyToClipboard(item.url, item);
  } else if (item.actionType === 'link') {
    if (item.url.startsWith('http')) {
      window.open(item.url, '_blank');
    } else {
      window.location.href = item.url;
    }
  } else {
    console.warn(`Unknown actionType: ${item.actionType}`);
  }
}

function closeModal() {
  emit('update:modelValue', false);
}
</script>

<style scoped>
.feedback-modal-card {
  border-radius: 12px;
  overflow: hidden;
}

.feedback-modal-title {
  padding: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background-color: #fafafa;
}

.feedback-modal-table :deep(th) {
  font-weight: bold !important;
  background-color: #f5f5f5 !important;
  color: #424242;
}

.feedback-modal-table :deep(td) {
  padding: 16px !important;
  color: #555;
}

.feedback-action-btn {
  min-width: 80px;
  transition: all 0.3s ease;
}

.feedback-action-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>
