export interface ItemInfo {
  itemId: string;
  itemName: string;
  value: number;
}

export type ItemInfoMap = Record<string, ItemInfo>;
