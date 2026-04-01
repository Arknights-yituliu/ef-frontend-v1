<template>
  <v-dialog v-model="model" max-width="600px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-bold">{{ t('feedback.modal.title') }}</span>
        <v-btn icon="mdi-close" size="small" variant="text" @click="model = false" />
      </v-card-title>

      <v-card-text class="px-0">
        <v-data-table
          density="default"
          :headers="headers"
          hide-default-footer
          :items="feedbackChannels"
        >
          <template #item.method="{ item }">
            {{ t(item.method) }}
          </template>

          <template #item.description="{ item }">
            {{ t(item.description) }}
          </template>

          <template #item.action="{ item }">
            <LayoutFeedbackActionBtn :action-type="item.actionType" :url="item.url" />
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
}

const model = defineModel({ required: true, type: Boolean });

const { t } = useI18n();

const headers = computed(() => [
  {
    title: t('feedback.table.header.method'),
    key: 'method',
    align: 'start' as const,
    sortable: false,
  },
  {
    title: t('feedback.table.header.description'),
    key: 'description',
    align: 'start' as const,
    sortable: false,
  },
  {
    title: t('feedback.table.header.action'),
    key: 'action',
    align: 'center' as const,
    sortable: false,
  },
]);

const feedbackChannels = ref<ChannelItem[]>([
  {
    method: 'feedback.list.qq.title',
    description: 'feedback.list.qq.desc',
    actionType: 'copy',
    url: '3831811497',
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
    url: 'https://qm.qq.com/q/EdjQZADudW',
  },
  {
    method: 'feedback.list.devGroup.title',
    description: 'feedback.list.devGroup.desc',
    actionType: 'copy',
    url: '696486169',
  },
]);
</script>
