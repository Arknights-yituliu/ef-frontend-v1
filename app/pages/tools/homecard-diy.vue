<template>
  <v-container class="home-card-editor">
    <div class="editor-layout">
      <aside ref="previewPanel" class="preview-panel">
        <HomeCard
          :card="previewCard"
          class="preview-large"
          :interactive="true"
          :preview-content="previewContent"
          :show-favorite="false"
        />
        <HomeSmallCard
          :card="previewCard"
          class="preview-small"
          :preview-content="previewContent"
        />
        <v-btn-toggle
          v-model="previewLocale"
          class="preview-language-toggle"
          color="primary"
          density="comfortable"
          divided
          mandatory
        >
          <v-btn value="zh-CN">中</v-btn>
          <v-btn value="en-US">EN</v-btn>
        </v-btn-toggle>
        <v-textarea
          class="export-json"
          hide-details
          :model-value="exportJson"
          readonly
          rows="10"
          variant="outlined"
        />
        <div class="export-actions">
          <v-btn prepend-icon="mdi-download" size="small" variant="outlined" @click="downloadJson">
            下载 JSON
          </v-btn>
          <v-btn
            :disabled="!draft.icon"
            prepend-icon="mdi-image"
            size="small"
            variant="outlined"
            @click="downloadIcon"
          >
            下载调整后的icon
          </v-btn>
          <v-btn
            :disabled="!draft.image"
            prepend-icon="mdi-image-area-close"
            size="small"
            variant="outlined"
            @click="downloadImage"
          >
            下载调整后的主图
          </v-btn>
        </div>
      </aside>

      <main class="settings-panel">
        <section class="settings-group">
          <HomeCardIconInput v-model="draft.icon" v-model:transform="draft.iconTransform" />
          <div class="settings-grid">
            <v-text-field
              v-model="draft.titleZh"
              hide-details
              label="中文标题"
              variant="outlined"
            />
            <v-text-field
              v-model="draft.titleEn"
              hide-details
              label="英文标题"
              variant="outlined"
            />
          </div>
          <v-select
            v-model="draft.tagTypes"
            chips
            hide-details
            item-title="title"
            item-value="value"
            :items="tagOptions"
            label="tag"
            multiple
            variant="outlined"
          />
        </section>

        <section class="settings-group">
          <HomeCardImageInput v-model="draft.image" v-model:transform="draft.imageTransform" />
          <div class="settings-grid">
            <v-textarea
              v-model="draft.descriptionZh"
              auto-grow
              hide-details
              label="中文说明"
              rows="3"
              variant="outlined"
            />
            <v-textarea
              v-model="draft.descriptionEn"
              auto-grow
              hide-details
              label="英文说明"
              rows="3"
              variant="outlined"
            />
          </div>
        </section>

        <section class="settings-group">
          <div class="button-list">
            <div v-for="(button, index) in draft.buttons" :key="button.id" class="button-editor">
              <div class="settings-grid">
                <v-text-field
                  v-model="button.labelZh"
                  hide-details
                  label="中文按钮文字"
                  variant="outlined"
                />
                <v-text-field
                  v-model="button.labelEn"
                  hide-details
                  label="英文按钮文字"
                  variant="outlined"
                />
              </div>

              <div class="button-action-row">
                <v-btn-toggle
                  v-model="button.action"
                  class="action-toggle"
                  color="primary"
                  density="comfortable"
                  divided
                  mandatory
                >
                  <v-btn :value="ButtonActionType.Link">跳转链接</v-btn>
                  <v-btn :value="ButtonActionType.Copy">复制文本</v-btn>
                </v-btn-toggle>

                <v-checkbox
                  v-if="index === 0"
                  v-model="button.main"
                  class="main-button-checkbox"
                  density="compact"
                  hide-details
                  label="主按钮"
                />
              </div>

              <div class="button-value-row">
                <v-text-field
                  v-model="button.actionData"
                  hide-details
                  :label="button.action === ButtonActionType.Link ? '链接' : '文本'"
                  variant="outlined"
                />
                <v-switch
                  v-model="button.showIcon"
                  class="button-icon-toggle"
                  color="primary"
                  density="compact"
                  hide-details
                />
              </div>
            </div>
          </div>

          <v-btn
            class="add-button"
            color="primary"
            prepend-icon="mdi-plus"
            variant="outlined"
            @click="addButton"
          >
            添加按钮
          </v-btn>
        </section>
      </main>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import type { CardButton, CardData } from '@/custom/core/homeCards';
import type {
  HomeCardAssetTransform,
  HomeCardPreviewContent,
  HomeCardPreviewLocale,
} from '@/shared/types/homeCardEditor';
import { ButtonActionType, ButtonType, CardTagType, homeCards } from '@/custom/core/homeCards';
import { getLocalizedText } from '@/shared/utils/i18nUtil';
import HomeCardIconInput from '~/components/tools/HomeCardIconInput.vue';
import HomeCardImageInput from '~/components/tools/HomeCardImageInput.vue';

interface DesignerButton {
  id: string;
  labelZh: string;
  labelEn: string;
  action: ButtonActionType;
  actionData: string;
  showIcon: boolean;
  main: boolean;
}

interface DesignerDraft {
  icon: string;
  iconTransform: HomeCardAssetTransform;
  titleZh: string;
  titleEn: string;
  tagTypes: CardTagType[];
  image: string;
  imageTransform: HomeCardAssetTransform;
  descriptionZh: string;
  descriptionEn: string;
  buttons: DesignerButton[];
}

const STORAGE_KEY = 'homeCardDesigner:v4';
const sourceCard = homeCards[0] as CardData;
const sourceText = {
  titleZh: '可用兑换码',
  titleEn: 'Available Redemption Codes',
  descriptionZh: '于“设置-平台与账户-礼包兑换”处兑换；需要开启【邮箱】功能',
  descriptionEn:
    'Redeem at "Settings - Platform & Account - Gift Code Redemption"; Require [Mail] feature unlocked.',
};
const DEFAULT_ASSET_TRANSFORM: HomeCardAssetTransform = {
  scale: 100,
  x: 0,
  y: 0,
};
const ICON_FILE_NAME = 'home-card-icon.png';
const IMAGE_FILE_NAME = 'home-card-image.png';
const JSON_FILE_NAME = 'home-card.json';
const ICON_FRAME_SIZE = 48;
const LARGE_CARD_WIDTH = 420;
definePageMeta({
  layout: 'default',
});

const { t } = useI18n();
const isHydrated = ref(false);
const previewLocale = ref<HomeCardPreviewLocale>('zh-CN');
const previewPanel = ref<HTMLElement | null>(null);

function createId(): string {
  return 'home-card-' + Date.now() + '-' + Math.random().toString(36).slice(2);
}

function createAssetTransform(): HomeCardAssetTransform {
  return { ...DEFAULT_ASSET_TRANSFORM };
}

function createDesignerButton(source?: CardButton): DesignerButton {
  return {
    id: createId(),
    labelZh: source?.i18nKey ? t(`component.home.${source.i18nKey}`, 'zh-CN') : '示例按钮',
    labelEn: source?.i18nKey ? t(`component.home.${source.i18nKey}`, 'en-US') : 'Example Button',
    action: source?.action ?? ButtonActionType.Link,
    actionData: source?.actionData ?? '',
    showIcon: source ? Boolean(source.icon) : true,
    main: source?.buttonType === ButtonType.Main,
  };
}

function createDefaultDraft(): DesignerDraft {
  return {
    icon: sourceCard.icon ?? '',
    iconTransform: createAssetTransform(),
    titleZh: sourceText.titleZh,
    titleEn: sourceText.titleEn,
    tagTypes: [...(sourceCard.tagTypes ?? [])],
    image: sourceCard.image ?? '',
    imageTransform: createAssetTransform(),
    descriptionZh: sourceText.descriptionZh,
    descriptionEn: sourceText.descriptionEn,
    buttons: sourceCard.buttons?.map((button) => createDesignerButton(button)) ?? [
      createDesignerButton(),
    ],
  };
}

const draft = ref<DesignerDraft>(createDefaultDraft());

const tagOptions = computed(() => [
  { title: t('component.home.tags.official'), value: CardTagType.Official },
  { title: t('component.home.tags.yituliu'), value: CardTagType.YiTuLiu },
  { title: t('component.home.tags.yituliu3rd'), value: CardTagType.YiTuLiu3rd },
  { title: t('component.home.tags.thirdparty'), value: CardTagType.ThirdParty },
  { title: t('component.home.tags.other'), value: CardTagType.Other },
]);

const previewContent = computed<HomeCardPreviewContent>(() => {
  const tagLabels: Partial<Record<CardTagType, string>> = {};

  for (const tagType of Object.values(CardTagType)) {
    tagLabels[tagType] = t(`component.home.tags.${tagType}`, previewLocale.value);
  }

  return {
    title: getLocalizedText(
      { 'zh-CN': draft.value.titleZh, 'en-US': draft.value.titleEn },
      previewLocale.value,
    ),
    description: getLocalizedText(
      { 'zh-CN': draft.value.descriptionZh, 'en-US': draft.value.descriptionEn },
      previewLocale.value,
    ),
    tagLabels,
    iconTransform: draft.value.iconTransform,
    imageTransform: draft.value.imageTransform,
    buttonLabels: Object.fromEntries(
      draft.value.buttons.map((button) => [
        button.id,
        getLocalizedText({ 'zh-CN': button.labelZh, 'en-US': button.labelEn }, previewLocale.value),
      ]),
    ),
  };
});

const previewCard = computed<CardData>(() => ({
  i18nKey: 'homeCardDesignerPreview',
  icon: draft.value.icon || undefined,
  image: draft.value.image || undefined,
  tagTypes: draft.value.tagTypes,
  buttons: draft.value.buttons.map((button, index) => ({
    i18nKey: button.id,
    buttonType:
      index === 0 && button.main
        ? ButtonType.Main
        : button.action === ButtonActionType.Link
          ? ButtonType.Link
          : ButtonType.Text,
    action: button.action,
    actionData: button.actionData,
    target: button.action === ButtonActionType.Link,
    icon: button.showIcon
      ? button.action === ButtonActionType.Link
        ? 'mdi-open-in-new'
        : 'mdi-content-copy'
      : undefined,
  })),
}));

const exportData = computed(() => ({
  icon: draft.value.icon ? ICON_FILE_NAME : '',
  image: draft.value.image ? IMAGE_FILE_NAME : '',
  titleZh: draft.value.titleZh,
  titleEn: draft.value.titleEn,
  tagTypes: [...draft.value.tagTypes],
  descriptionZh: draft.value.descriptionZh,
  descriptionEn: draft.value.descriptionEn,
  buttons: draft.value.buttons.map((button, index) => ({
    labelZh: button.labelZh,
    labelEn: button.labelEn,
    action: button.action,
    actionData: button.actionData,
    showIcon: button.showIcon,
    main: index === 0 && button.main,
  })),
}));

const exportJson = computed(() => JSON.stringify(exportData.value, null, 2));

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function getString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function getNumber(value: unknown, fallback: number): number {
  const numberValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizeAssetTransform(value: unknown, maxScale: number): HomeCardAssetTransform {
  const source = isRecord(value) ? value : {};

  return {
    scale: clamp(getNumber(source.scale, DEFAULT_ASSET_TRANSFORM.scale), 50, maxScale),
    x: getNumber(source.x, DEFAULT_ASSET_TRANSFORM.x),
    y: getNumber(source.y, DEFAULT_ASSET_TRANSFORM.y),
  };
}

function normalizeButton(value: unknown, index: number): DesignerButton {
  const source = isRecord(value) ? value : {};
  const action =
    source.action === ButtonActionType.Copy ? ButtonActionType.Copy : ButtonActionType.Link;
  const legacyLabel = getString(source.label);

  return {
    id: getString(source.id) || createId(),
    labelZh: getString(source.labelZh) || legacyLabel || (index === 0 ? '' : '示例按钮'),
    labelEn: getString(source.labelEn) || legacyLabel || (index === 0 ? '' : 'Example Button'),
    action,
    actionData: getString(source.actionData),
    showIcon: typeof source.showIcon === 'boolean' ? source.showIcon : Boolean(source.icon),
    main: index === 0 && source.main === true,
  };
}

function normalizeDraft(value: unknown): DesignerDraft {
  const source = isRecord(value) ? value : {};
  const validTags = new Set(Object.values(CardTagType));
  const tagTypes = Array.isArray(source.tagTypes)
    ? source.tagTypes.filter(
        (tag): tag is CardTagType => typeof tag === 'string' && validTags.has(tag as CardTagType),
      )
    : [];
  const buttons = Array.isArray(source.buttons)
    ? source.buttons.map((button, index) => normalizeButton(button, index))
    : [];

  return {
    icon: getString(source.icon),
    iconTransform: normalizeAssetTransform(source.iconTransform, 200),
    titleZh: getString(source.titleZh),
    titleEn: getString(source.titleEn),
    tagTypes,
    image: getString(source.image),
    imageTransform: normalizeAssetTransform(source.imageTransform, 300),
    descriptionZh: getString(source.descriptionZh),
    descriptionEn: getString(source.descriptionEn),
    buttons: buttons.length > 0 ? buttons : createDefaultDraft().buttons,
  };
}

function persistDraft(): void {
  if (!import.meta.client) {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft.value));
  } catch (error) {
    console.error('Failed to save home card designer state:', error);
  }
}

function addButton(): void {
  draft.value.buttons.push(createDesignerButton());
}

function getPreviewElement(selector: string): HTMLElement | null {
  return previewPanel.value?.querySelector<HTMLElement>(selector) ?? null;
}

function getElementSize(
  element: HTMLElement | null,
  fallbackWidth: number,
  fallbackHeight: number,
) {
  const rect = element?.getBoundingClientRect();

  return {
    width: Math.max(Math.round(rect?.width ?? fallbackWidth), 1),
    height: Math.max(Math.round(rect?.height ?? fallbackHeight), 1),
  };
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', () => reject(new Error(`Failed to load image: ${source}`)));
    image.src = source;
  });
}

function drawContainImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
): void {
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;

  context.drawImage(
    image,
    (width - drawWidth) / 2,
    (height - drawHeight) / 2,
    drawWidth,
    drawHeight,
  );
}

function renderIcon(image: HTMLImageElement): HTMLCanvasElement {
  const frame = getPreviewElement('.preview-large .home-card-logo-frame');
  const { width, height } = getElementSize(frame, ICON_FRAME_SIZE, ICON_FRAME_SIZE);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas is not available');
  }

  canvas.width = width;
  canvas.height = height;
  context.save();
  context.translate(
    width / 2 + draft.value.iconTransform.x,
    height / 2 + draft.value.iconTransform.y,
  );
  context.scale(draft.value.iconTransform.scale / 100, draft.value.iconTransform.scale / 100);
  context.translate(-width / 2, -height / 2);
  drawContainImage(context, image, width, height);
  context.restore();

  return canvas;
}

function renderMainImage(image: HTMLImageElement): HTMLCanvasElement {
  const wrapper = getPreviewElement('.preview-large .home-card-image-wrapper');
  const { width, height } = getElementSize(
    wrapper,
    LARGE_CARD_WIDTH,
    Math.round((LARGE_CARD_WIDTH * 3) / 4),
  );
  const imageWidth = width;
  const imageHeight = (image.naturalHeight / image.naturalWidth) * imageWidth;
  const imageTop = (height - imageHeight) / 2;
  const imageCenterY = imageTop + imageHeight / 2;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas is not available');
  }

  canvas.width = width;
  canvas.height = height;
  context.save();
  context.translate(
    width / 2 + draft.value.imageTransform.x,
    imageCenterY + draft.value.imageTransform.y,
  );
  context.scale(draft.value.imageTransform.scale / 100, draft.value.imageTransform.scale / 100);
  context.translate(-imageWidth / 2, -imageHeight / 2);
  context.drawImage(image, 0, 0, imageWidth, imageHeight);
  context.restore();

  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to export canvas'));
      }
    }, 'image/png');
  });
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadJson(): void {
  const blob = new Blob([exportJson.value], { type: 'application/json;charset=utf-8' });
  downloadBlob(blob, JSON_FILE_NAME);
}

async function downloadIcon(): Promise<void> {
  if (!draft.value.icon) {
    return;
  }

  try {
    const image = await loadImage(draft.value.icon);
    const blob = await canvasToBlob(renderIcon(image));
    downloadBlob(blob, ICON_FILE_NAME);
  } catch (error) {
    console.error('Failed to export home card icon:', error);
  }
}

async function downloadImage(): Promise<void> {
  if (!draft.value.image) {
    return;
  }

  try {
    const image = await loadImage(draft.value.image);
    const blob = await canvasToBlob(renderMainImage(image));
    downloadBlob(blob, IMAGE_FILE_NAME);
  } catch (error) {
    console.error('Failed to export home card image:', error);
  }
}

watch(
  draft,
  () => {
    if (isHydrated.value) {
      persistDraft();
    }
  },
  { deep: true },
);

onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      draft.value = normalizeDraft(JSON.parse(stored));
    } catch (error) {
      console.error('Failed to load home card designer state:', error);
    }
  }

  isHydrated.value = true;
  persistDraft();
});
</script>

<style scoped>
.home-card-editor {
  max-width: 1440px;
  padding-top: 24px;
  padding-bottom: 48px;
}

.editor-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  align-items: start;
  gap: 32px;
}

.preview-panel {
  position: sticky;
  top: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}

.preview-large {
  width: min(100%, 420px);
}

.preview-small {
  flex: 0 0 auto;
}

.preview-language-toggle {
  align-self: flex-start;
}

.export-json {
  width: 100%;
  height: 480px;
}

.settings-panel {
  display: grid;
  gap: 16px;
  min-width: 0;
}

.settings-group {
  display: grid;
  gap: 16px;
  padding: 20px;
  background: var(--theme-bg-secondary);
  border: 1px solid var(--theme-border);
  border-radius: 8px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.button-list {
  display: grid;
  gap: 16px;
}

.button-editor {
  display: grid;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid var(--theme-border);
}

.button-editor:first-child {
  padding-top: 0;
}

.button-editor:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.button-action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.action-toggle {
  width: auto;
  max-width: 100%;
}

.action-toggle :deep(.v-btn) {
  min-width: 88px;
}

.button-value-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 44px;
  align-items: center;
  gap: 12px;
}

.button-icon-toggle {
  width: 44px;
  justify-self: center;
}

.main-button-checkbox {
  margin: 0;
}

.add-button {
  justify-self: start;
}
</style>
