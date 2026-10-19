import type { LocalizedText } from '#shared/types/common';
import type { Shop, ShopItem } from '#shared/types/shop';
import rawShops from '@/custom/core/shops.json';

// 本文件由 scripts/tasks/makeShops.ts 生成（写入 custom/core/shops.json），此处仅做类型转换。
// 需要修改商店数据请修改 scripts/tasks/makeShops.ts 中的 targetShopIds，然后运行 yarn makedata。

interface RawShopItem {
  itemId: string;
  itemName?: string;
  quantityPerGroup: number;
  stockGroups: number | null;
  originalPrice: number;
  discount: number;
  currentPrice: number;
}

interface RawShop {
  shopId: string;
  shopName: LocalizedText;
  currencyItemId?: string;
  shopItems: RawShopItem[];
}

const rawShopList = rawShops as RawShop[];

export const shops: Shop[] = rawShopList.map((shop) => ({
  shopId: shop.shopId,
  shopName: shop.shopName,
  currencyItemId: shop.currencyItemId,
  shopItems: shop.shopItems.map(
    (item): ShopItem => ({
      itemId: item.itemId,
      itemName: item.itemName,
      quantityPerGroup: item.quantityPerGroup,
      stockGroups: item.stockGroups === null ? Infinity : item.stockGroups,
      originalPrice: item.originalPrice,
      discount: item.discount,
      currentPrice: item.currentPrice,
    }),
  ),
}));
