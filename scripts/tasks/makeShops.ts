import type { Shop as ShopDefinition, ShopGroup } from '../models';
import {
  getTranslation,
  itemTable,
  rewardTable,
  shopGoodsTable,
  shopGroupTable,
  shopTable,
} from '../gameData';

/**
 * 需要生成的商店列表（对应解包 ShopTable.json 的键）。
 * 这里只包含「商店价值」页面展示的商店，其余商店如需展示可在此追加。
 */
export const targetShopIds: string[] = [
  'shop_pay_yellow_1',
  'shop_pay_green_1',
  'shop_spaceship_1',
  'domainshop_page_com_map01',
  'domainshop_page_com_map02',
];

/** 生成后的商品条目（写入 JSON） */
export interface ShopItemOutput {
  itemId: string;
  /** 仅作备注，请勿依赖其值进行逻辑处理 */
  itemName: string;
  quantityPerGroup: number;
  /** 库存组数，null 表示常驻（无限） */
  stockGroups: number | null;
  originalPrice: number;
  discount: number;
  currentPrice: number;
}

/** 生成后的商店（写入 JSON） */
export interface ShopOutput {
  shopId: string;
  shopName: string;
  currencyItemId?: string;
  shopItems: ShopItemOutput[];
}

/** 保留 4 位小数，避免浮点误差（如 0.7 - 1 = -0.30000000000000004） */
function round4(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}

/** 商店显示名：分组名 + 商店名（去掉重复/空部分） */
function getShopDisplayName(shop: ShopDefinition): string {
  const group: ShopGroup | undefined = shopGroupTable[shop.shopGroupId];
  const groupName = group ? getTranslation(group.shopGroupName, 'CN') : '';
  const shopName = getTranslation(shop.shopName, 'CN');

  const parts = [groupName, shopName].filter((name) => name.length > 0);
  const uniqueParts = parts.filter((name, index) => parts.indexOf(name) === index);

  return uniqueParts.join('·') || shop.shopId;
}

/** 商店货币：取该商店任意商品的 moneyId */
function getCurrencyItemId(shopId: string, goodsIds: string[]): string | undefined {
  for (const goodsId of goodsIds) {
    const moneyId = shopGoodsTable[goodsId]?.moneyId;
    if (moneyId && moneyId.length > 0) {
      return moneyId;
    }
  }
  return undefined;
}

/** 生成商品条目：价格为原价，现价 = 原价 × cnDiscount，库存 = limitCount（0 表示常驻） */
function makeShopItem(goodsId: string): ShopItemOutput | undefined {
  const goods = shopGoodsTable[goodsId];
  if (!goods) {
    return undefined;
  }

  const reward = rewardTable[goods.rewardId];
  const bundle = reward?.itemBundles[0] ?? reward?.probItemBundles[0];
  if (!bundle) {
    return undefined;
  }

  const item = itemTable[bundle.id];

  return {
    itemId: bundle.id,
    itemName: item ? getTranslation(item.name, 'CN') : bundle.id,
    quantityPerGroup: bundle.count,
    stockGroups: goods.limitCount === 0 ? null : goods.limitCount,
    originalPrice: goods.price,
    discount: round4(goods.cnDiscount - 1),
    currentPrice: Math.round(goods.price * goods.cnDiscount),
  };
}

/**
 * 生成商店数据
 * 将解包数据中的商店转换为「商店价值」页面使用的结构。
 */
export function makeShops(): ShopOutput[] {
  const shops: ShopOutput[] = [];

  for (const shopId of targetShopIds) {
    const shop = shopTable[shopId];
    if (!shop) {
      throw new Error(`ShopTable 中找不到商店：${shopId}`);
    }

    const shopItems = shop.shopGoodsIds
      .map((goodsId) => ({ goodsId, item: makeShopItem(goodsId) }))
      .filter(
        (entry): entry is { goodsId: string; item: ShopItemOutput } => entry.item !== undefined,
      )
      .toSorted((a, b) => {
        const goodsA = shopGoodsTable[a.goodsId]!;
        const goodsB = shopGoodsTable[b.goodsId]!;
        return goodsA.sortId - goodsB.sortId || a.item.currentPrice - b.item.currentPrice;
      })
      .map((entry) => entry.item);

    shops.push({
      shopId,
      shopName: getShopDisplayName(shop),
      currencyItemId: getCurrencyItemId(shopId, shop.shopGoodsIds),
      shopItems,
    });
  }

  return shops;
}
