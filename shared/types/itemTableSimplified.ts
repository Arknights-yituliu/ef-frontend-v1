export interface LocalizedText {
  'zh-CN': string;
  'en-US': string;
}

export interface ItemTableSimplifiedEntry {
  id: string;
  name: LocalizedText;
  rarity: number;
  type: number;
  typeName: LocalizedText;
  iconId: string;
}

export type ItemTableSimplified = Record<string, ItemTableSimplifiedEntry>;
