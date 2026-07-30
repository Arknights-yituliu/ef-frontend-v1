import { ButtonActionType, ButtonType, CardTagType } from '@/custom/core/homeCards';
import {
  cloneHomeCardEditorDraft,
  createHomeCardEditorButton,
  createHomeCardEditorDraft,
  type HomeCardEditorButton,
  type HomeCardEditorDraft,
} from '@/shared/types/homeCardEditor';

const STORAGE_KEY = 'homeCardEditorDrafts:v1';
const STORAGE_VERSION = 1;

interface HomeCardEditorStorage {
  version: number;
  drafts: unknown[];
}

const buttonTypes = new Set(Object.values(ButtonType));
const buttonActions = new Set(Object.values(ButtonActionType));
const tagTypes = new Set(Object.values(CardTagType));

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function getString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function getBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function getTimestamp(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function migrateStoredButton(value: unknown, index: number): HomeCardEditorButton | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const fallback = createHomeCardEditorButton(index + 1);
  const buttonType = getString(value.buttonType, fallback.buttonType);
  const action = getString(value.action, fallback.action);

  return {
    ...fallback,
    id: getString(value.id, fallback.id),
    i18nKey: getString(value.i18nKey, fallback.i18nKey),
    labelZh: getString(value.labelZh),
    labelEn: getString(value.labelEn),
    buttonType: buttonTypes.has(buttonType) ? (buttonType as ButtonType) : fallback.buttonType,
    action: buttonActions.has(action) ? (action as ButtonActionType) : fallback.action,
    actionData: getString(value.actionData),
    target: getBoolean(value.target, fallback.target),
    icon: getString(value.icon),
    color: getString(value.color),
    copySuccessTextZh: getString(value.copySuccessTextZh),
    copySuccessTextEn: getString(value.copySuccessTextEn),
    popupTextZh: getString(value.popupTextZh),
    popupTextEn: getString(value.popupTextEn),
    codeInnerZh: getString(value.codeInnerZh),
    codeInnerEn: getString(value.codeInnerEn),
  };
}

function migrateStoredDraft(value: unknown): HomeCardEditorDraft | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const fallback = createHomeCardEditorDraft();
  const storedTagTypes = Array.isArray(value.tagTypes)
    ? value.tagTypes.filter(
        (tagType): tagType is CardTagType =>
          typeof tagType === 'string' && tagTypes.has(tagType as CardTagType),
      )
    : fallback.tagTypes;
  const storedButtons = Array.isArray(value.buttons)
    ? value.buttons
        .map((button, index) => migrateStoredButton(button, index))
        .filter((button): button is HomeCardEditorButton => button !== undefined)
    : fallback.buttons;

  return {
    ...fallback,
    id: getString(value.id, fallback.id),
    name: getString(value.name, fallback.name),
    i18nKey: getString(value.i18nKey, fallback.i18nKey),
    icon: getString(value.icon),
    image: getString(value.image),
    visible: getBoolean(value.visible, fallback.visible),
    tagTypes: storedTagTypes,
    titleZh: getString(value.titleZh, fallback.titleZh),
    titleEn: getString(value.titleEn, fallback.titleEn),
    descriptionZh: getString(value.descriptionZh),
    descriptionEn: getString(value.descriptionEn),
    buttons: storedButtons,
    createdAt: getTimestamp(value.createdAt, fallback.createdAt),
    updatedAt: getTimestamp(value.updatedAt, fallback.updatedAt),
  };
}

export function useHomeCardEditorDrafts() {
  const drafts = useState<HomeCardEditorDraft[]>('home-card-editor-drafts', () => []);
  const hasLoaded = useState<boolean>('home-card-editor-drafts-loaded', () => false);

  function persistDrafts(): boolean {
    if (!import.meta.client) {
      return false;
    }

    try {
      const storage: HomeCardEditorStorage = {
        version: STORAGE_VERSION,
        drafts: drafts.value,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
      return true;
    } catch (error) {
      console.error('Failed to save home card editor drafts:', error);
      return false;
    }
  }

  function loadDrafts(): void {
    if (!import.meta.client || hasLoaded.value) {
      return;
    }

    hasLoaded.value = true;
    const rawStorage = localStorage.getItem(STORAGE_KEY);
    if (!rawStorage) {
      drafts.value = [];
      return;
    }

    try {
      const storage = JSON.parse(rawStorage) as Partial<HomeCardEditorStorage>;
      if (storage.version !== STORAGE_VERSION || !Array.isArray(storage.drafts)) {
        drafts.value = [];
        return;
      }

      drafts.value = storage.drafts
        .map((draft) => migrateStoredDraft(draft))
        .filter((draft): draft is HomeCardEditorDraft => draft !== undefined)
        .toSorted((left, right) => right.updatedAt - left.updatedAt);
    } catch (error) {
      console.error('Failed to load home card editor drafts:', error);
      drafts.value = [];
    }
  }

  function saveDraft(draft: HomeCardEditorDraft): {
    draft: HomeCardEditorDraft;
    persisted: boolean;
  } {
    const existingDraft = drafts.value.find((item) => item.id === draft.id);
    const nextDraft: HomeCardEditorDraft = {
      ...cloneHomeCardEditorDraft(draft),
      createdAt: existingDraft?.createdAt ?? draft.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    };

    drafts.value = [nextDraft, ...drafts.value.filter((item) => item.id !== nextDraft.id)];

    return {
      draft: cloneHomeCardEditorDraft(nextDraft),
      persisted: persistDrafts(),
    };
  }

  function removeDraft(id: string): boolean {
    drafts.value = drafts.value.filter((draft) => draft.id !== id);
    return persistDrafts();
  }

  return {
    drafts: readonly(drafts),
    loadDrafts,
    saveDraft,
    removeDraft,
  };
}
