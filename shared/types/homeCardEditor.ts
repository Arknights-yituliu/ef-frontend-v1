import { ButtonActionType, ButtonType, CardTagType } from '@/custom/core/homeCards';

export interface HomeCardPreviewContent {
  title: string;
  description?: string;
  buttonLabels: Record<string, string>;
  buttonPopupTexts?: Record<string, string>;
}

export interface HomeCardEditorButton {
  id: string;
  i18nKey: string;
  labelZh: string;
  labelEn: string;
  buttonType: ButtonType;
  action: ButtonActionType;
  actionData: string;
  target: boolean;
  icon: string;
  color: string;
  copySuccessTextZh: string;
  copySuccessTextEn: string;
  popupTextZh: string;
  popupTextEn: string;
  codeInnerZh: string;
  codeInnerEn: string;
}

export interface HomeCardEditorDraft {
  id: string;
  name: string;
  i18nKey: string;
  icon: string;
  image: string;
  visible: boolean;
  tagTypes: CardTagType[];
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  buttons: HomeCardEditorButton[];
  createdAt: number;
  updatedAt: number;
}

function createLocalId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createHomeCardEditorButton(index: number): HomeCardEditorButton {
  return {
    id: createLocalId(),
    i18nKey: `action${index}`,
    labelZh: '',
    labelEn: '',
    buttonType: ButtonType.Main,
    action: ButtonActionType.Link,
    actionData: '',
    target: true,
    icon: 'mdi-open-in-new',
    color: 'primary',
    copySuccessTextZh: '',
    copySuccessTextEn: '',
    popupTextZh: '',
    popupTextEn: '',
    codeInnerZh: '',
    codeInnerEn: '',
  };
}

export function createHomeCardEditorDraft(): HomeCardEditorDraft {
  const now = Date.now();

  return {
    id: createLocalId(),
    name: '未命名卡片',
    i18nKey: 'newHomeCard',
    icon: '',
    image: '',
    visible: true,
    tagTypes: [CardTagType.Other],
    titleZh: '新首页卡片',
    titleEn: 'New Home Card',
    descriptionZh: '',
    descriptionEn: '',
    buttons: [createHomeCardEditorButton(1)],
    createdAt: now,
    updatedAt: now,
  };
}

export function cloneHomeCardEditorDraft(draft: HomeCardEditorDraft): HomeCardEditorDraft {
  return structuredClone(draft);
}
