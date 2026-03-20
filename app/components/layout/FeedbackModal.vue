<template>
  <v-dialog
    max-width="600px"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="feedback-modal-card">

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
          <!-- 动态渲染：反馈方式 -->
          <template #[`item.method`]="{ item }">
            {{ t(item.method) }}
          </template>

          <template #[`item.description`]="{ item }">
            {{ t(item.description) }}
          </template>

          <template #[`item.action`]="{ item }">
            <v-btn
              class="feedback-action-btn"
              color="success"
              size="small"
              @click="handleAction(item)"
            >
              {{ t('feedback.modal.actionBtn') }}
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

const feedbackChannels = ref([
  {
    method: 'feedback.list.qq.title',
    description: 'feedback.list.qq.desc',
    actionType: 'link',
    url: 'tencent://message/?uin=3831811497&Site=&Menu=yes',
  },
  {
    method: 'feedback.list.github.title',
    description: 'feedback.list.github.desc',
    actionType: 'link',
    url: 'https://github.com/Arknights-yituliu/ef-frontend-v1/issues/new',
  },
  {
    method: 'feedback.list.bilibili.title',
    description: 'feedback.list.bilibili.desc',
    actionType: 'link',
    url: 'https://space.bilibili.com/688411531?spm_id_from=333.337.0.0',
  },
  {
    method: 'feedback.list.fanGroup.title',
    description: 'feedback.list.fanGroup.desc',
    actionType: 'link',
    url: 'tencent://group/?code=1023465475',
  },
  {
    method: 'feedback.list.devGroup.title',
    description: 'feedback.list.devGroup.desc',
    actionType: 'link',
    url: '',
  },
]);

function handleAction(item: any) {
  if (item.url) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    item.url.startsWith('http')
      ? window.open(item.url, '_blank')
      : window.location.href = item.url;
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

.feedback-action-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  transition: all 0.2s ease;
}
</style>
