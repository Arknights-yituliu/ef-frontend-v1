import { gachaItemMap } from '@/custom/core/gachaItem';
import { itemInfo } from '@/custom/core/itemInfo';
import { itemValueMap } from '@/custom/core/itemValue';
import { hexToRGBA } from '@/shared/utils/colorUtil';

export const tierColorMap: Record<number, string> = {
  1: '#9b9b9b',
  2: '#abce42',
  3: '#26bbfd',
  4: '#9452fa',
  5: '#ffbb03',
  6: '#ff7100',
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
