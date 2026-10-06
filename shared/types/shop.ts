export interface ShopItem {
  itemId: string;
  itemName?: string;
  quantityPerGroup: number; // 每组数量
  stockGroups?: number; // 库存组数
  originalPrice?: number; // 原价
  discount?: number; // 折扣
  currentPrice: number; // 现价
}

export interface Shop {
  shopId: string;
  shopName: string;
  currencyItemId?: string;
  shopItems: ShopItem[];
}

export interface ShopTableItem {
  itemId: string;
  itemName: string;
  quantityPerGroup: number;
  currentPrice: number;
  iconUrl?: string;
  originalPrice?: number;
  discount?: number;
  stockGroups?: number;
  stockLabel?: string;
  discountLabel?: string;
  originalPriceLabel?: string;
  totalValue: number;
  costPerformance: number;
}

export interface ShopCardItem extends ShopTableItem {
  shopItemKey: string;
  canToggleSoldOut: boolean;
  isSoldOut: boolean;
}

export interface ShopView extends Shop {
  titleIconUrl?: string;
}
