import rawItems from '@/custom/core/items.json';

export interface Item {
  id: string;
  name: Record<string, string>;
  rarity: number;
  type: number;
  typeName: Record<string, string>;
  iconId: string | null;
}

export const items: Record<string, Item> = rawItems;
