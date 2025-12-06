export interface ItemValue {
  itemId: string;
  itemName?: string;
  value: number;
}

export type ItemValueMap = Record<string, ItemValue>;
