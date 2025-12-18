import type { PackContent, PackData } from '@/shared/types/pack';
import { getItemPulls, getItemValue } from '@/shared/utils/gameData/item';

export function getItemBundleValue({ itemId, quantity }: PackContent) {
  return getItemValue(itemId) * quantity;
}

export function getItemBundlePulls({ itemId, quantity }: PackContent) {
  return getItemPulls(itemId) * quantity;
}

export function getItemBundleValuePercentage(packContent: PackContent, pack: PackData) {
  return getItemBundleValue(packContent) / pack.price / pack648SanityCostEffectiveness;
}

export function getPackTotalValue(pack: PackData) {
  return pack.contents.reduce((sum, content) => sum + getItemBundleValue(content), 0);
}

export function getPackTotalPulls(pack: PackData) {
  return pack.contents.reduce((sum, content) => sum + getItemBundlePulls(content), 0);
}

export function getPackStoneEquivalent(pack: PackData) {
  return getPackTotalValue(pack) / 40;
}

export function getPackPricePerStone(pack: PackData) {
  return pack.price / getPackStoneEquivalent(pack);
}

export function getPackPricePerPull(pack: PackData) {
  return pack.price / getPackTotalPulls(pack);
}

export const pack648SanityCostEffectiveness =
  getItemBundleValue({ itemId: 'item_originium_recharge', quantity: 350 }) / 648;

export const pack648PullCostEffectiveness =
  getItemBundlePulls({ itemId: 'item_originium_recharge', quantity: 350 }) / 648;

export function getPackSanityEfficiency(pack: PackData) {
  return getPackTotalValue(pack) / pack.price / pack648SanityCostEffectiveness;
}

export function getPackPullsEfficiency(pack: PackData) {
  return getPackTotalPulls(pack) / pack.price / pack648PullCostEffectiveness;
}
