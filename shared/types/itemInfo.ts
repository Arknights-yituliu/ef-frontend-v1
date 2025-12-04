export interface ItemInfo {
  itemId: string;
  itemName: string;
  iconUrl: string;
}

export type ItemInfoMap = Record<string, ItemInfo>;
