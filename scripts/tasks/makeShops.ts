import type { LocalizedText } from '../../shared/types/common';
import type { Shop as ShopDefinition, ShopGroup } from '../models';
import {
  itemTable,
  rewardTable,
  shopChannelDevelopmentTable,
  shopGoodsTable,
  shopGroupTable,
  shopTable,
} from '../gameData';
import { getLocalizedValue, getTranslation } from '../utils/translation';

/**
 * 需要生成的商店列表（对应解包 ShopTable.json 的键）。
 * 这里只包含「商店价值」页面展示的商店，其余商店如需展示可在此追加。
 */
export const targetShopIds: string[] = [
  // 烟火生缘活动「堂头小铺」：仅收录以烟火钱兑换养成材料的「实用货品」分店
  'shop_inn_management_3',
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
  /** 多语言商店名 */
  shopName: LocalizedText;
  currencyItemId?: string;
  shopItems: ShopItemOutput[];
}

/** 保留 4 位小数，避免浮点误差（如 0.7 - 1 = -0.30000000000000004） */
function round4(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}

/** 字符串降序比较：对应游戏内「默认」排序在 sortId 相同时按 goodsId 降序兜底 */
function compareStringDesc(left: string, right: string): number {
  if (left === right) {
    return 0;
  }
  return left < right ? 1 : -1;
}

/** 商店显示名：分组名 + 商店名（去掉重复/空部分） */
function getShopDisplayName(shop: ShopDefinition): LocalizedText {
  const group: ShopGroup | undefined = shopGroupTable[shop.shopGroupId];
  const groupNames: LocalizedText | undefined = group
    ? getLocalizedValue(group.shopGroupName)
    : undefined;
  const shopNames = getLocalizedValue(shop.shopName);
  const locales = Object.keys(shopNames) as (keyof LocalizedText)[];

  return Object.fromEntries(
    locales.map((locale) => [
      locale,
      joinDisplayName(groupNames?.[locale] ?? '', shopNames[locale]) || shop.shopId,
    ]),
  );
}

/** 拼接「分组名·商店名」，去重并忽略空字符串 */
function joinDisplayName(groupName: string, shopName: string): string {
  const parts = [groupName, shopName].filter((name) => name.length > 0);
  const uniqueParts = parts.filter((name, index) => parts.indexOf(name) === index);

  return uniqueParts.join('·');
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

/**
 * 调度券商店（domainshop）商品的 ShopGoodsTable.limitCount 恒为 0，
 * 实际可购买次数由商店频道升级数据 ShopChannelDevelopmentTable 的 newGoodsNum 给出：
 * 同一频道内取最高等级的值（升级会覆盖旧库存），不同频道（据点）的库存相互独立，累加计算总量。
 */
function makeChannelStockMap(): Map<string, number> {
  const stockMap = new Map<string, number>();

  for (const channel of Object.values(shopChannelDevelopmentTable)) {
    const stockInChannel = new Map<string, number>();

    for (const level of Object.values(channel.channelLevelMap)) {
      for (const [index, goodsId] of level.newGoodsList.entries()) {
        const stock = level.newGoodsNum[index];
        // 随机货组（domainshop_goods_rand_*）的 newGoodsNum 为 0，代表数量由随机规则决定，视为无固定库存
        if (stock === undefined || stock <= 0) {
          continue;
        }
        stockInChannel.set(goodsId, Math.max(stockInChannel.get(goodsId) ?? 0, stock));
      }
    }

    for (const [goodsId, stock] of stockInChannel) {
      stockMap.set(goodsId, (stockMap.get(goodsId) ?? 0) + stock);
    }
  }

  return stockMap;
}

/** 生成商品条目：价格为原价，现价 = 原价 × cnDiscount，库存 = limitCount（0 表示查看频道升级数据） */
function makeShopItem(
  goodsId: string,
  channelStockMap: Map<string, number>,
): ShopItemOutput | undefined {
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
    stockGroups: goods.limitCount === 0 ? (channelStockMap.get(goodsId) ?? null) : goods.limitCount,
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
  const channelStockMap = makeChannelStockMap();

  for (const shopId of targetShopIds) {
    const shop = shopTable[shopId];
    if (!shop) {
      throw new Error(`ShopTable 中找不到商店：${shopId}`);
    }

    const shopItems = shop.shopGoodsIds
      .map((goodsId) => ({ goodsId, item: makeShopItem(goodsId, channelStockMap) }))
      .filter(
        (entry): entry is { goodsId: string; item: ShopItemOutput } => entry.item !== undefined,
      )
      .toSorted((a, b) => {
        const goodsA = shopGoodsTable[a.goodsId]!;
        const goodsB = shopGoodsTable[b.goodsId]!;
        // 与游戏内商店「默认」排序保持一致：sortId 降序，sortId 相同时按 goodsId 降序
        return goodsB.sortId - goodsA.sortId || compareStringDesc(a.goodsId, b.goodsId);
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
