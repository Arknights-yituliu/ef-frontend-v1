<template>
  <v-container class="home-card-editor">
    <header class="editor-header">
      <div>
        <h1 class="page-title">首页卡片编辑器</h1>
      </div>
      <div class="editor-toolbar">
        <v-select
          v-model="selectedDraftId"
          class="draft-picker"
          density="comfortable"
          hide-details
          item-title="title"
          item-value="value"
          :items="draftOptions"
          label="草稿"
          variant="outlined"
          @update:model-value="selectDraft"
        />
        <v-tooltip text="新建草稿">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              aria-label="新建草稿"
              icon="mdi-file-plus-outline"
              variant="text"
              @click="createNewDraft"
            />
          </template>
        </v-tooltip>
        <v-tooltip text="删除当前草稿">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              aria-label="删除当前草稿"
              :disabled="!selectedDraftId"
              icon="mdi-delete-outline"
              variant="text"
              @click="showDeleteDialog = true"
            />
          </template>
        </v-tooltip>
        <v-btn color="primary" prepend-icon="mdi-content-save-outline" @click="saveCurrentDraft">
          保存草稿
        </v-btn>
      </div>
    </header>

    <div class="editor-layout">
      <aside class="preview-panel">
        <div class="section-heading">
          <h2>首页卡片预览</h2>
          <v-chip :color="draft.visible ? 'success' : 'warning'" size="small" variant="tonal">
            {{ draft.visible ? '显示' : '隐藏' }}
          </v-chip>
        </div>
        <HomeCard
          :card="previewCard"
          class="editor-preview-card"
          :interactive="false"
          :preview-content="previewContent"
          :show-favorite="false"
        />
      </aside>

      <main class="editor-form">
        <section class="form-section">
          <div class="section-heading">
            <h2>草稿</h2>
          </div>
          <div class="form-grid two-columns">
            <v-text-field
              v-model="draft.name"
              counter="60"
              label="草稿名称"
              maxlength="60"
              variant="outlined"
            />
            <v-switch
              v-model="draft.visible"
              color="primary"
              hide-details
              inset
              label="未来发布时显示"
            />
          </div>
        </section>

        <section class="form-section">
          <div class="section-heading">
            <h2>卡片信息</h2>
          </div>
          <div class="form-grid two-columns">
            <v-text-field
              v-model="draft.i18nKey"
              hint="使用英文字母开头的驼峰标识"
              label="卡片标识"
              persistent-hint
              variant="outlined"
            />
            <v-select
              v-model="draft.tagTypes"
              chips
              closable-chips
              :items="tagOptions"
              label="标签"
              multiple
              variant="outlined"
            />
            <v-text-field v-model="draft.icon" label="图标地址" variant="outlined" />
            <v-text-field v-model="draft.image" label="主图地址" variant="outlined" />
          </div>
        </section>

        <section class="form-section">
          <div class="section-heading">
            <h2>文案</h2>
          </div>
          <div class="form-grid two-columns">
            <v-text-field v-model="draft.titleZh" label="中文标题" variant="outlined" />
            <v-text-field v-model="draft.titleEn" label="英文标题" variant="outlined" />
            <v-textarea
              v-model="draft.descriptionZh"
              auto-grow
              label="中文描述"
              rows="3"
              variant="outlined"
            />
            <v-textarea
              v-model="draft.descriptionEn"
              auto-grow
              label="英文描述"
              rows="3"
              variant="outlined"
            />
          </div>
        </section>

        <section class="form-section">
          <div class="section-heading">
            <h2>按钮</h2>
            <v-tooltip text="新增按钮">
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  v-bind="tooltipProps"
                  aria-label="新增按钮"
                  icon="mdi-plus"
                  size="small"
                  variant="text"
                  @click="addButton"
                />
              </template>
            </v-tooltip>
          </div>

          <div class="button-editors">
            <article
              v-for="(button, index) in draft.buttons"
              :key="button.id"
              class="button-editor"
            >
              <header class="button-editor-header">
                <h3>按钮 {{ index + 1 }}</h3>
                <div class="button-editor-actions">
                  <v-tooltip text="上移">
                    <template #activator="{ props: tooltipProps }">
                      <v-btn
                        v-bind="tooltipProps"
                        aria-label="上移"
                        :disabled="index === 0"
                        icon="mdi-arrow-up"
                        size="small"
                        variant="text"
                        @click="moveButton(index, -1)"
                      />
                    </template>
                  </v-tooltip>
                  <v-tooltip text="下移">
                    <template #activator="{ props: tooltipProps }">
                      <v-btn
                        v-bind="tooltipProps"
                        aria-label="下移"
                        :disabled="index === draft.buttons.length - 1"
                        icon="mdi-arrow-down"
                        size="small"
                        variant="text"
                        @click="moveButton(index, 1)"
                      />
                    </template>
                  </v-tooltip>
                  <v-tooltip text="删除按钮">
                    <template #activator="{ props: tooltipProps }">
                      <v-btn
                        v-bind="tooltipProps"
                        aria-label="删除按钮"
                        color="error"
                        icon="mdi-close"
                        size="small"
                        variant="text"
                        @click="removeButton(index)"
                      />
                    </template>
                  </v-tooltip>
                </div>
              </header>

              <div class="form-grid two-columns">
                <v-text-field v-model="button.i18nKey" label="按钮标识" variant="outlined" />
                <v-select
                  v-model="button.action"
                  :items="actionOptions"
                  label="动作"
                  variant="outlined"
                />
                <v-text-field v-model="button.labelZh" label="中文按钮文字" variant="outlined" />
                <v-text-field v-model="button.labelEn" label="英文按钮文字" variant="outlined" />
                <v-text-field
                  v-model="button.actionData"
                  :label="button.action === ButtonActionType.Link ? '跳转地址' : '复制内容'"
                  variant="outlined"
                />
                <v-text-field v-model="button.icon" label="Material 图标名" variant="outlined" />
                <v-select
                  v-if="button.buttonType === ButtonType.Main"
                  v-model="button.color"
                  :items="mainButtonColorOptions"
                  label="主按钮颜色"
                  variant="outlined"
                />
                <v-switch
                  v-if="button.action === ButtonActionType.Link"
                  v-model="button.target"
                  color="primary"
                  hide-details
                  inset
                  label="在新标签页打开"
                />
              </div>

              <div class="button-type-row">
                <span>显示样式</span>
                <v-btn-toggle v-model="button.buttonType" color="primary" divided mandatory>
                  <v-btn
                    v-for="option in buttonTypeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.title }}
                  </v-btn>
                </v-btn-toggle>
              </div>

              <v-expansion-panels class="advanced-options" variant="accordion">
                <v-expansion-panel title="高级选项">
                  <v-expansion-panel-text>
                    <div class="form-grid two-columns">
                      <v-text-field
                        v-model="button.copySuccessTextZh"
                        label="中文复制成功提示"
                        variant="outlined"
                      />
                      <v-text-field
                        v-model="button.copySuccessTextEn"
                        label="英文复制成功提示"
                        variant="outlined"
                      />
                      <v-text-field
                        v-model="button.popupTextZh"
                        label="中文悬浮提示"
                        variant="outlined"
                      />
                      <v-text-field
                        v-model="button.popupTextEn"
                        label="英文悬浮提示"
                        variant="outlined"
                      />
                      <v-text-field
                        v-model="button.codeInnerZh"
                        label="中文兑换码说明"
                        variant="outlined"
                      />
                      <v-text-field
                        v-model="button.codeInnerEn"
                        label="英文兑换码说明"
                        variant="outlined"
                      />
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </article>
          </div>
        </section>

        <v-alert
          v-if="validationMessages.length > 0"
          class="validation-alert"
          density="comfortable"
          title="发布前需处理"
          type="warning"
          variant="tonal"
        >
          <ul>
            <li v-for="message in validationMessages" :key="message">{{ message }}</li>
          </ul>
        </v-alert>
      </main>
    </div>

    <v-snackbar v-model="showSnackbar" :color="snackbarColor" :timeout="2500">
      {{ snackbarText }}
    </v-snackbar>

    <v-dialog v-model="showDeleteDialog" max-width="420">
      <v-card>
        <v-card-title class="text-h6">删除草稿</v-card-title>
        <v-card-text>确定删除当前草稿吗？</v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="showDeleteDialog = false">取消</v-btn>
          <v-btn color="error" prepend-icon="mdi-delete" @click="deleteCurrentDraft">删除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import type { CardData } from '@/custom/core/homeCards';
import { ButtonActionType, ButtonType, CardTagType, homeCards } from '@/custom/core/homeCards';
import {
  cloneHomeCardEditorDraft,
  createHomeCardEditorButton,
  createHomeCardEditorDraft,
  type HomeCardEditorDraft,
  type HomeCardPreviewContent,
} from '@/shared/types/homeCardEditor';

definePageMeta({
  layout: 'default',
});

usePageSeo({
  title: '首页卡片编辑器',
  description: '首页卡片草稿编辑器',
  robots: 'noindex, follow',
});

const { locale } = useI18n();
const { drafts, loadDrafts, saveDraft, removeDraft } = useHomeCardEditorDrafts();

const draft = ref<HomeCardEditorDraft>(createHomeCardEditorDraft());
const selectedDraftId = ref<string>();
const showDeleteDialog = ref(false);
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref<'success' | 'error'>('success');

const tagOptions = [
  { title: '官方', value: CardTagType.Official },
  { title: '一图流', value: CardTagType.YiTuLiu },
  { title: '一图流托管', value: CardTagType.YiTuLiu3rd },
  { title: '第三方', value: CardTagType.ThirdParty },
  { title: '其他', value: CardTagType.Other },
];

const buttonTypeOptions = [
  { title: '主按钮', value: ButtonType.Main },
  { title: '链接按钮', value: ButtonType.Link },
  { title: '文本按钮', value: ButtonType.Text },
  { title: '隐藏', value: ButtonType.Blank },
];

const actionOptions = [
  { title: '跳转链接', value: ButtonActionType.Link },
  { title: '复制文本', value: ButtonActionType.Copy },
];

const mainButtonColorOptions = ['primary', 'secondary', 'success', 'warning', 'error'];

const draftOptions = computed(() =>
  drafts.value.map((item) => ({
    title: item.name.trim() || '未命名草稿',
    value: item.id,
  })),
);

const previewCard = computed<CardData>(() => ({
  i18nKey: draft.value.i18nKey.trim() || 'homeCardEditorPreview',
  icon: draft.value.icon.trim() || undefined,
  image: draft.value.image.trim() || undefined,
  descriptionKey: 'description',
  visible: draft.value.visible,
  tagTypes: draft.value.tagTypes,
  buttons: draft.value.buttons.map((button) => ({
    i18nKey: button.i18nKey.trim() || button.id,
    buttonType: button.buttonType,
    action: button.action,
    actionData: button.actionData,
    target: button.target,
    icon: button.icon.trim() || undefined,
    color: button.color.trim() || undefined,
  })),
}));

const previewContent = computed<HomeCardPreviewContent>(() => {
  const buttonLabels: Record<string, string> = {};
  const buttonPopupTexts: Record<string, string> = {};

  for (const button of draft.value.buttons) {
    const key = button.i18nKey.trim() || button.id;
    buttonLabels[key] = getLocalizedText(button.labelZh, button.labelEn);

    const popupText = getLocalizedText(button.popupTextZh, button.popupTextEn);
    if (popupText) {
      buttonPopupTexts[key] = popupText;
    }
  }

  return {
    title: getLocalizedText(draft.value.titleZh, draft.value.titleEn),
    description: getLocalizedText(draft.value.descriptionZh, draft.value.descriptionEn),
    buttonLabels,
    buttonPopupTexts,
  };
});

const validationMessages = computed(() => {
  const messages: string[] = [];
  const cardKey = draft.value.i18nKey.trim();

  if (!cardKey) {
    messages.push('请填写卡片标识。');
  } else if (!/^[A-Za-z][A-Za-z0-9]*$/.test(cardKey)) {
    messages.push('卡片标识需以英文字母开头，并仅使用英文字母和数字。');
  } else if (homeCards.some((card) => card.i18nKey === cardKey)) {
    messages.push('卡片标识与现有首页卡片重复。');
  }

  const buttonKeys = draft.value.buttons.map((button) => button.i18nKey.trim()).filter(Boolean);
  if (new Set(buttonKeys).size !== buttonKeys.length) {
    messages.push('按钮标识不能重复。');
  }

  if (draft.value.buttons.some((button) => !button.i18nKey.trim())) {
    messages.push('每个按钮都需要填写按钮标识。');
  }

  return messages;
});

function getLocalizedText(zh: string, en: string): string {
  const primaryText = locale.value === 'en-US' ? en : zh;
  const fallbackText = locale.value === 'en-US' ? zh : en;
  return primaryText || fallbackText;
}

function showMessage(message: string, color: 'success' | 'error' = 'success'): void {
  snackbarText.value = message;
  snackbarColor.value = color;
  showSnackbar.value = true;
}

function saveCurrentDraft(): void {
  const result = saveDraft(draft.value);
  draft.value = result.draft;
  selectedDraftId.value = result.draft.id;

  showMessage(
    result.persisted ? '草稿已保存到本机浏览器。' : '草稿保存失败。',
    result.persisted ? 'success' : 'error',
  );
}

function createNewDraft(): void {
  draft.value = createHomeCardEditorDraft();
  selectedDraftId.value = undefined;
  showDeleteDialog.value = false;
}

function selectDraft(id: string | undefined): void {
  if (!id) {
    return;
  }

  const selectedDraft = drafts.value.find((item) => item.id === id);
  if (selectedDraft) {
    draft.value = cloneHomeCardEditorDraft(selectedDraft);
  }
}

function deleteCurrentDraft(): void {
  if (!selectedDraftId.value) {
    showDeleteDialog.value = false;
    return;
  }

  const persisted = removeDraft(selectedDraftId.value);
  draft.value = createHomeCardEditorDraft();
  selectedDraftId.value = undefined;
  showDeleteDialog.value = false;
  showMessage(
    persisted ? '草稿已删除。' : '草稿删除后无法保存到浏览器。',
    persisted ? 'success' : 'error',
  );
}

function addButton(): void {
  draft.value.buttons.push(createHomeCardEditorButton(draft.value.buttons.length + 1));
}

function removeButton(index: number): void {
  draft.value.buttons.splice(index, 1);
}

function moveButton(index: number, direction: -1 | 1): void {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= draft.value.buttons.length) {
    return;
  }

  const [button] = draft.value.buttons.splice(index, 1);
  if (button) {
    draft.value.buttons.splice(targetIndex, 0, button);
  }
}

onMounted(() => {
  loadDrafts();
  const latestDraft = drafts.value[0];
  if (latestDraft) {
    draft.value = cloneHomeCardEditorDraft(latestDraft);
    selectedDraftId.value = latestDraft.id;
  }
});
</script>

<style scoped>
.home-card-editor {
  max-width: 1440px;
  padding-top: 2rem;
  padding-bottom: 3rem;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.page-title {
  margin: 0;
  color: var(--theme-text-primary);
  font-size: 1.75rem;
  font-weight: 700;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
}

.draft-picker {
  width: min(280px, 32vw);
}

.editor-layout {
  display: grid;
  grid-template-columns: minmax(320px, 440px) minmax(0, 1fr);
  align-items: start;
  gap: 2rem;
}

.preview-panel {
  position: sticky;
  top: 1.5rem;
}

.editor-preview-card {
  width: 100%;
}

.editor-form {
  min-width: 0;
}

.form-section {
  padding: 0 0 1.75rem;
  margin-bottom: 1.75rem;
  border-bottom: 1px solid var(--theme-border);
}

.section-heading,
.button-editor-header,
.button-type-row {
  display: flex;
  align-items: center;
}

.section-heading {
  justify-content: space-between;
  gap: 1rem;
  min-height: 2.5rem;
  margin-bottom: 1rem;
}

.section-heading h2,
.button-editor-header h3 {
  margin: 0;
  color: var(--theme-text-primary);
}

.section-heading h2 {
  font-size: 1.125rem;
  font-weight: 700;
}

.form-grid {
  display: grid;
  gap: 0 1rem;
}

.two-columns {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.button-editors {
  display: grid;
  gap: 1rem;
}

.button-editor {
  padding: 1rem;
  background: var(--theme-bg-secondary);
  border: 1px solid var(--theme-border);
  border-radius: 8px;
}

.button-editor-header {
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.button-editor-header h3 {
  font-size: 1rem;
  font-weight: 700;
}

.button-editor-actions {
  display: flex;
  align-items: center;
  gap: 0.125rem;
}

.button-type-row {
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.25rem;
  color: var(--theme-text-secondary);
  font-size: 0.875rem;
}

.advanced-options {
  margin-top: 1rem;
}

.validation-alert {
  margin-top: -0.25rem;
}

.validation-alert ul {
  padding-left: 1.25rem;
  margin: 0.5rem 0 0;
}

@media (max-width: 1050px) {
  .editor-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .preview-panel {
    position: static;
    width: min(100%, 520px);
  }
}

@media (max-width: 700px) {
  .home-card-editor {
    padding-top: 1rem;
  }

  .editor-header {
    align-items: stretch;
    flex-direction: column;
  }

  .editor-toolbar {
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .draft-picker {
    flex: 1 1 220px;
    width: auto;
  }

  .two-columns {
    grid-template-columns: minmax(0, 1fr);
  }

  .button-type-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .button-type-row :deep(.v-btn) {
    padding-right: 0.6rem;
    padding-left: 0.6rem;
    font-size: 0.75rem;
  }
}
</style>
