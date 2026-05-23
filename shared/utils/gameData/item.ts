import type { ColorInstance } from 'color';
import Color from 'color';
import { useI18n } from 'vue-i18n';
import { gachaItemMap } from '@/custom/core/gachaItem';
import { items } from '@/custom/core/items';
import { itemValueMap } from '@/custom/core/itemValue';

export const tierColorMap: Map<number, ColorInstance> = new Map([
  [1, Color('#9b9b9b')],
  [2, Color('#abce42')],
  [3, Color('#26bbfd')],
  [4, Color('#9452fa')],
  [5, Color('#ffbb03')],
  [6, Color('#ff7100')],
]);

export function getLocalizedText(text: Record<string, string>, locale?: string): string {
  if (locale === undefined) {
    locale = useI18n().locale.value;
  }
  return text[locale] ?? '';
}

export function getItemName(itemId: string, locale?: string): string {
  if (items[itemId] === undefined) {
    return itemId;
  }
  return getLocalizedText(items[itemId].name, locale);
}

export function getItemValue(itemId: string): number {
  return itemValueMap[itemId]?.value ?? 0;
}

export function getItemPulls(itemId: string): number {
  return gachaItemMap[itemId]?.pulls ?? 0;
}

export function getCharAvatarUrl(charId: string): string {
  return `https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/charicon/icon_${charId}.webp`;
}

export function getItemIconUrl(itemId: string): string | undefined {
  const iconId = items[itemId]?.iconId;
  if (iconId === undefined) {
    return undefined;
  }
  return `https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/itemicon/${iconId}.webp`;
}

export function getItemRarity(itemId: string): number | undefined {
  return items[itemId]?.rarity ?? undefined;
}

export function getItemTierColor(itemId: string): ColorInstance {
  const rarity = getItemRarity(itemId);
  if (rarity !== undefined && tierColorMap.has(rarity)) {
    return tierColorMap.get(rarity)!;
  }
  return Color('transparent'); // Default to transparent if rarity is undefined or not found
}
