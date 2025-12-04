import { gachaItemMap } from '@/custom/core/gachaItem';
import { itemInfo } from '@/custom/core/itemInfo';
import { itemValueMap } from '@/custom/core/itemValue';

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
