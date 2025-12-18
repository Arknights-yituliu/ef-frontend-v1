import { gachaItemMap } from '@/custom/core/gachaItem';
import { itemTable, getLocalizedText } from '@/shared/utils/gameData/gameData';
import { itemValueMap } from '@/custom/core/itemValue';
import type { ColorInstance } from 'color';
import Color from 'color';

export const tierColorMap: Map<number, ColorInstance> = new Map([
  [1, Color('#9b9b9b')],
  [2, Color('#abce42')],
  [3, Color('#26bbfd')],
  [4, Color('#9452fa')],
  [5, Color('#ffbb03')],
  [6, Color('#ff7100')],
]);

export function getItemName(itemId: string, locale?: string): string {
  if (itemTable.value[itemId] === undefined) {
    return itemId;
  }
  return getLocalizedText(itemTable.value[itemId].name, locale);
}

export function getItemValue(itemId: string): number {
  return itemValueMap[itemId]?.value ?? 0;
}

export function getItemPulls(itemId: string): number {
  return gachaItemMap[itemId]?.pulls ?? 0;
}

export function getItemIconUrl(itemId: string): string | undefined {
  const iconId = itemTable.value[itemId]?.iconId;
  if (iconId === undefined) {
    return undefined;
  }
  return `https://cos.yituliu.cn/endfield/unpack-images/items/${iconId}.webp`;
}

export function getItemRarity(itemId: string): number | undefined {
  return itemTable.value[itemId]?.rarity ?? undefined;
}

export function getItemTierColor(itemId: string): ColorInstance {
  const rarity = getItemRarity(itemId);
  if (rarity !== undefined && tierColorMap.has(rarity)) {
    return tierColorMap.get(rarity)!;
  }
  return Color('transparent'); // Default to transparent if rarity is undefined or not found
}
