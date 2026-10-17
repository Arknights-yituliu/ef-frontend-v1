export interface ShopGoods {
  goodsId: string;
  shopId: string;
  moneyId: string;
  price: number;
  cnDiscount: number;
  limitCount: number;
  limitCountRefreshType: number;
  rewardId: string;
  sortId: number;
  goodsTagId: string;
}

export type ShopGoodsTable = Record<string, ShopGoods>;
