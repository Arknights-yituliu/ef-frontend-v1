import type { PackData, PackGroupData, PackShopData } from '../shared/types/pack';
import type { CashShopGoods, ItemBundle } from './models';
import {
  cashShopGoodsTable,
  cashShopGroupTable,
  cashShopHideInGameTable,
  cashShopTable,
  getLocalizedValue,
  getTranslation,
  itemTable,
  rewardTable,
} from './gameData';

const nonFirstRechargeOriginiumPackData = [
  { price: 6, originumCount: 3 },
  { price: 30, originumCount: 15 },
  { price: 98, originumCount: 50 },
  { price: 198, originumCount: 102 },
  { price: 328, originumCount: 171 },
  { price: 648, originumCount: 350 },
];

const firstRechargeOriginiumPackData = [
  { price: 6, originumCount: 6 },
  { price: 30, originumCount: 24 },
  { price: 98, originumCount: 84 },
  { price: 198, originumCount: 170 },
  { price: 328, originumCount: 282 },
  { price: 648, originumCount: 560 },
];

const extraPacks: Record<string, PackData> = {
  seasonal_giftpack: {
    packId: 'seasonal_giftpack',
    displayName: {
      'zh-CN': '限时寻访组合包',
      'en-US': 'Gacha HH Bundle',
    },
    category: 'Seasonal_Rec_pack',
    price: 98,
    imageUrl: 'https://cos.yituliu.cn/endfield/screenshot-images/packs/行火寻访组合包.webp',
    contents: [
      {
        itemId: 'ticketgacha_special_ten_lt_1_0_1',
        name: {
          'zh-CN': '行火留烬十连凭证',
          'en-US': "Firewalker's Trail 10×Permit",
        },
        quantity: 1,
      },
      {
        itemId: 'item_gold',
        name: {
          'zh-CN': '折金票',
          'en-US': 'T-Creds',
        },
        quantity: 80_000,
      },
    ],
  },
};

/**
 * 判定是否为限时寻访组合包
 * 标准：98 元，且名称以“寻访组合包”结尾，且含有 80000 折金票
 */
function isSeasonalGachaPack(goods: CashShopGoods): boolean {
  return (
    goods.priceCNY === 98 &&
    getTranslation(goods.goodsName, 'CN').endsWith('寻访组合包') &&
    rewardTable[goods.rewardId]!.itemBundles.some(
      (bundle: ItemBundle) => bundle.id === 'item_gold' && bundle.count === 80_000,
    )
  );
}

export function makePacks(): Record<string, PackData> {
  const packs: Record<string, PackData> = {};

  // 处理礼包
  for (const [packId, goods] of Object.entries(cashShopGoodsTable)) {
    // 忽略隐藏的组合包
    if (cashShopHideInGameTable[packId]?.hideInGame === true) {
      continue;
    }
    // 忽略限时寻访组合包
    if (isSeasonalGachaPack(goods)) {
      continue;
    }
    // 忽略源石组合包
    if (goods.cashShopId === 'originium_recharge') {
      continue;
    }

    const localizedNames = getLocalizedValue(goods.goodsName);

    const packData: PackData = {
      packId,
      displayName: localizedNames,
      category: goods.cashShopId,
      price: goods.priceCNY,
      imageUrl: `https://cos.yituliu.cn/endfield/screenshot-images/packs/${localizedNames['zh-CN']}.webp`,
      contents: [],
    };

    // 解析物品内容
    const reward = rewardTable[goods.rewardId]!;
    packData.contents = reward.itemBundles.map((bundle: ItemBundle) => {
      const item = itemTable[bundle.id]!;
      const itemNames = getLocalizedValue(item.name);
      return {
        itemId: bundle.id,
        name: itemNames,
        quantity: bundle.count,
      };
    });

    packs[packId] = packData;
  }

  // 合并额外礼包
  Object.assign(packs, extraPacks);

  return Object.fromEntries(
    Object.entries(packs).toSorted(([idA], [idB]) => idA.localeCompare(idB)),
  ); // 按 packId 字典序排序，保证 diff 最小
}

export function makePackShops(packs: Record<string, PackData>): Record<string, PackShopData> {
  const packShops: Record<string, PackShopData> = {};

  for (const [shopId, shop] of Object.entries(cashShopTable)) {
    packShops[shopId] = {
      shopId,
      displayName: getLocalizedValue(shop.shopName),
      goodsIds: Object.values(packs)
        .filter((pack) => pack.category === shopId)
        .map((pack) => pack.packId),
    };
  }

  return packShops;
}

export function makePackGroups(): Record<string, PackGroupData> {
  const packGroups: Record<string, PackGroupData> = {};

  // 处理分类
  for (const [groupId, group] of Object.entries(cashShopGroupTable)) {
    packGroups[groupId] = {
      groupId,
      displayName: getLocalizedValue(group.shopGroupName),
      shopIds: group.cashShopIds,
    };
  }

  return packGroups;
}
