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
