import type { TranslationKey } from './common';

export interface ShopGroup {
  shopGroupId: string;
  shopGroupName: TranslationKey;
  shopGroupType: number;
  shopIds: string[];
}

export type ShopGroupTable = Record<string, ShopGroup>;
