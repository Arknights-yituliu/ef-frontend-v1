import type { TranslationKey } from './common';

export interface Shop {
  shopId: string;
  shopName: TranslationKey;
  shopEnName: TranslationKey;
  shopGroupId: string;
  shopGoodsIds: string[];
}

export type ShopTable = Record<string, Shop>;
