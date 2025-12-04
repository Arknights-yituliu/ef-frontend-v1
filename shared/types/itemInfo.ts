export interface ItemInfo {
  itemId: string;
  itemName: string;
  iconUrl: string;
  value: number;
}

export type ItemInfoMap = Record<string, ItemInfo>;
