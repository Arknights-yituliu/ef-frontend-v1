import type { PackData, PackGroupData, PackShopData } from '../shared/types/pack';
import {
  cashShopGoodsTable,
  cashShopGroupTable,
  cashShopHideInGameTable,
  cashShopTable,
  getLocalizedValue,
  itemTable,
  rewardTable,
} from './gameData';

export function makePacks() {
  const packs: Record<string, PackData> = {};
  const packShops: Record<string, PackShopData> = {};
  const packGroups: Record<string, PackGroupData> = {};

  // 1. 处理分类
  for (const [groupId, group] of Object.entries(cashShopGroupTable)) {
    const groupName = getLocalizedValue(group.shopGroupName);

    packGroups[groupId] = {
      groupId,
      displayName: {
        'zh-CN': groupName['zh-CN'],
        'en-US': groupName['en-US'],
      },
      shopIds: group.cashShopIds || [],
    };
  }

  for (const [shopId, shop] of Object.entries(cashShopTable)) {
    const shopName = getLocalizedValue(shop.shopName);

    packShops[shopId] = {
      shopId,
      displayName: {
        'zh-CN': shopName['zh-CN'],
        'en-US': shopName['en-US'],
      },
      goodsIds: shop.cashGoodsIds || [],
    };
  }

  // 2. 处理礼包
  for (const [packId, goods] of Object.entries(cashShopGoodsTable)) {
    // 检查是否隐藏
    if (cashShopHideInGameTable[packId]?.hideInGame === true) {
      continue;
    }

    const localizedNames = getLocalizedValue(goods.goodsName);

    const packData: PackData = {
      packId,
      displayName: {
        'zh-CN': localizedNames['zh-CN'],
        'en-US': localizedNames['en-US'],
      },
      category: goods.cashShopId,
      price: goods.priceCNY,
      imageUrl: `https://cos.yituliu.cn/endfield/screenshot-images/packs/${localizedNames['zh-CN']}.webp`,
      contents: [],
    };

    // 解析物品内容
    const rewardId = goods.rewardId;
    const reward = rewardTable[rewardId];
    if (reward && reward.itemBundles) {
      packData.contents = reward.itemBundles.map((bundle: any) => {
        const item = itemTable[bundle.id];
        const itemNames = item
          ? getLocalizedValue(item.name)
          : { 'zh-CN': bundle.id, 'en-US': bundle.id };
        return {
          itemId: bundle.id,
          name: {
            'zh-CN': itemNames['zh-CN'],
            'en-US': itemNames['en-US'],
          },
          quantity: bundle.count,
        };
      });
    }

    packs[packId] = packData;
  }

  // 3. 过滤掉没有展示礼包的分类
  const filteredShops: Record<string, PackShopData> = {};
  for (const [shopId, shop] of Object.entries(packShops)) {
    shop.goodsIds = shop.goodsIds.filter((id) => packs[id]);
    if (shop.goodsIds.length > 0) {
      filteredShops[shopId] = shop;
    }
  }

  const filteredGroups: Record<string, PackGroupData> = {};
  for (const [groupId, group] of Object.entries(packGroups)) {
    group.shopIds = group.shopIds.filter((id) => filteredShops[id]);
    if (group.shopIds.length > 0) {
      filteredGroups[groupId] = group;
    }
  }

  return { packs, packShops: filteredShops, packGroups: filteredGroups };
}
