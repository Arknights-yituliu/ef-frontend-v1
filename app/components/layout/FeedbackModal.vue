<template>
  <v-dialog
    max-width="600px"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="feedback-modal-card">

      <!-- 顶部标题栏 -->
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

      <!-- 表格内容区域 -->
      <v-card-text class="feedback-modal-content pa-0">
        <v-data-table
          class="feedback-modal-table elevation-0"
          density="comfortable"
          :headers="headers"
          hide-default-footer
          :items="feedbackChannels"
        >
          <!-- 自定义“操作”列渲染 -->
          <template #[`item.action`]="{ item }">
            <v-btn
              class="feedback-action-btn"
              color="success"
              size="small"
              @click="handleAction(item)"
            >
              点击前往
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { modelValue } = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const { t } = useI18n();

// 定义表头
const headers = [
  { title: '反馈方式', key: 'method', align: 'start' as const, sortable: false  },
  { title: '说明', key: 'description', align: 'start' as const, sortable: false  },
  { title: '操作', key: 'action', align: 'center' as const, sortable: false },
] as const;

// 定义反馈渠道数据
const feedbackChannels = ref([
  {
    method: '反馈QQ：3831811497',
    description: '一图流问题反馈专用QQ',
    actionType: 'link',
    url: 'tencent://message/?uin=3831811497&Site=&Menu=yes',
  },
  {
    method: 'Github issues',
    description: '国内访问体验稍差一点',
    actionType: 'link',
    url: 'https://github.com/Arknights-yituliu/ef-frontend-v1/issues/new',
  },
  {
    method: 'B站@逻辑元 LogicalByte',
    description: '直接私信反馈',
    actionType: 'link',
    url: 'https://space.bilibili.com/688411531?spm_id_from=333.337.0.0',
  },
  {
    method: '粉丝群539600566',
    description: '进群@山桉反馈，如果不在找管理员',
    actionType: 'link',
    url: 'tencent://group/?code=539600566',
  },
  {
    method: '开发群938710832',
    description: '如果有能力自己解决问题，可以加开发群',
    actionType: 'link',
    url: '',
  },
]);

// 处理点击动作
function handleAction(item: any) {
  if (item.url) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    item.url.startsWith('http')
      ? window.open(item.url, '_blank')
      : window.location.href = item.url;
  }
}

// 关闭弹窗
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
