import type { TranslationKey } from './common';

/** wiki 档案条目，refItemId 指向该条目对应的物品（武器/装备等） */
export interface WikiEntryData {
  desc: TranslationKey;
  groupId: string;
  id: string;
  order: number;
  prtsId: string;
  refItemId: string;
  refMonsterTemplateId: string;
}

/** WikiEntryDataTable.json 对应整个表 */
export type WikiEntryDataTable = Record<string, WikiEntryData>;
