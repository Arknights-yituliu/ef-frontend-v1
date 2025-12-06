export interface ItemInfo {
  itemId: string;
  itemName: string;
  iconUrl: string;
  /** 稀有度，从 1 到 6，有可能是 undefined */
  rarity: number | undefined;
}

export type ItemInfoMap = Record<string, ItemInfo>;
