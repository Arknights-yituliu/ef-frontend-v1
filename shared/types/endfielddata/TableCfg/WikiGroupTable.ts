import type { TranslationKey } from '@/shared/types/common';

export interface WikiGroupEntry {
  groupId: string;
  groupName: TranslationKey;
  iconId: string;
}

export interface WikiCategory {
  list: WikiGroupEntry[];
}

export type WikiGroupTable = Record<string, WikiCategory>;
