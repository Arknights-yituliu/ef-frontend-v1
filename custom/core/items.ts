import type { LocalizedText } from '#shared/types/common';
import rawItems from '@/custom/core/items.json';

export interface Item {
  id: string;
  name: LocalizedText;
  rarity: number;
  iconId: string | null;
}

export const items: Record<string, Item> = rawItems;
