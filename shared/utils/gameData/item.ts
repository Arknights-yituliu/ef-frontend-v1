import { gachaItemMap } from '@/custom/core/gachaItem';
import { itemInfo } from '@/custom/core/itemInfo';
import { itemValueMap } from '@/custom/core/itemValue';

export const tierColorMap: Record<number, string> = {
  1: '#9b9a9a',
  2: '#abcd41',
  3: '#26bafb',
  4: '#9451f8',
  5: '#ffba03',
  6: '#ff7000',
};

export function getItemName(itemId: string): string {
  return itemInfo[itemId]?.itemName ?? itemId;
}

export function getItemValue(itemId: string): number {
  return itemValueMap[itemId]?.value ?? 0;
}

export function getItemPulls(itemId: string): number {
  return gachaItemMap[itemId]?.pulls ?? 0;
}

export function getItemIconUrl(itemId: string): string | undefined {
  return itemInfo[itemId]?.iconUrl ?? undefined;
}

export function getItemRarity(itemId: string): number | undefined {
  return itemInfo[itemId]?.rarity ?? undefined;
}

export function getItemTierColor(itemId: string, opacity: number = 1): string {
  const rarity = getItemRarity(itemId);
  if (rarity && tierColorMap[rarity]) {
    if (opacity === 1) {
      return tierColorMap[rarity];
    }
    return hexToRGBA(tierColorMap[rarity], opacity);
  }
  return 'transparent';
}
