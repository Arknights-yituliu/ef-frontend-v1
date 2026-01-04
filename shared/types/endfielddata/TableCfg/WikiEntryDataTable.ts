import type { TranslationKey } from '@/shared/types/common';

export interface WikiEntryData {
  desc: TranslationKey;
  groupId: string;
  id: string;
  order: number;
  prtsId: string;
  refItemId: string;
  refMonsterTemplateId: string;
}

export type WikiEntryDataTable = Record<string, WikiEntryData>;
