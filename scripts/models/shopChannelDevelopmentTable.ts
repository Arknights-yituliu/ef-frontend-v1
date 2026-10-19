import type { TranslationKey } from './common';

export interface ShopChannelDevelopmentLevel {
  channelDesc: TranslationKey;
  costItemIdList: string[];
  costItemNumList: number[];
  isFinalMaxLevel: boolean;
  /** 该等级新增的商品 ID，与 newGoodsNum 一一对应 */
  newGoodsList: string[];
  /** 新增商品的可购买次数（库存组数），与 newGoodsList 一一对应 */
  newGoodsNum: number[];
  randGoodsBaseLimitUp: number;
  randGoodsDailyAddLimitUp: number;
  timeId: string;
  upgradeDesc: TranslationKey;
  versionStart: string;
}

export interface ShopChannelDevelopment {
  channelLevelMap: Record<string, ShopChannelDevelopmentLevel>;
  channelName: TranslationKey;
  levelId: string;
  shopGroupId: string;
  skipToMissionChapter: number;
}

export type ShopChannelDevelopmentTable = Record<string, ShopChannelDevelopment>;
