import type { LocalizedText } from './common';

export interface PackContent {
  itemId: string;
  /** 中文物品名，仅作为数据可读性提示，展示时请使用 `getItemName` 按当前语言查询 */
  itemName?: string;
  quantity: number;
}

export type PackCategory = string;
export const DELISTED_PACK_CATEGORY = 'delisted_pack';
export type PackGachaMode = 'operator' | 'weapon';

export interface WeaponQuotaBaseline {
  totalQuota: number;
  price: number;
}

export interface PackData {
  packId: string;
  displayName: LocalizedText;
  category: PackCategory; // 这里存储 cashShopId (二级分类)
  description?: LocalizedText;
  price: number;
  imageUrl: string;
  backgroundImageUrl?: string;
  contents: PackContent[];
  startTimestamp?: number;
  endTimestamp?: number;
}

export interface PackShopData {
  shopId: string;
  displayName: LocalizedText;
  goodsIds: string[];
}

export interface PackGroupData {
  groupId: string;
  displayName: LocalizedText;
  shopIds: string[];
}

export type Packs = Record<string, PackData>;
export type PackShops = Record<string, PackShopData>;
export type PackGroups = Record<string, PackGroupData>;
