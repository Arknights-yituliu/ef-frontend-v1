import type { PackData, PackGroupData, PackShopData } from '../shared/types/pack';
import fs from 'node:fs';
import { getLocalizedValue, readJSONWithBigInt } from './gameData.ts';

export function makePacks() {
  const cashShopGroupTable = readJSONWithBigInt('TableCfg_Mapped/CashShopGroupTable.json');
  const cashShopTable = readJSONWithBigInt('TableCfg_Mapped/CashShopTable.json');
  const cashShopGoodsTable = readJSONWithBigInt('TableCfg_Mapped/CashShopGoodsTable.json');
  const cashShopHideInGameTable = readJSONWithBigInt(
    'TableCfg_Mapped/CashShopHideInGameTable.json',
  );
  const rewardTable = readJSONWithBigInt('TableCfg_Mapped/RewardTable.json');
  const itemTable = readJSONWithBigInt('TableCfg/ItemTable.json');

  const packs: Record<string, PackData> = {};
  const packShops: Record<string, PackShopData> = {};
  const packGroups: Record<string, PackGroupData> = {};

  // 1. 处理分类
  for (const groupId in cashShopGroupTable) {
    const group = cashShopGroupTable[groupId];
    const groupName = getLocalizedValue(group.shopGroupName);

    packGroups[groupId] = {
      groupId: groupId,
      groupNameZH: groupName['zh-CN'],
      groupNameEN: groupName['en-US'],
      shopIds: group.cashShopIds || [],
    };
  }

  for (const shopId in cashShopTable) {
    const shop = cashShopTable[shopId];
    const shopName = getLocalizedValue(shop.shopName);

    packShops[shopId] = {
      shopId: shopId,
      shopNameZH: shopName['zh-CN'],
      shopNameEN: shopName['en-US'],
      goodsIds: shop.cashGoodsIds || [],
    };
  }

  // 2. 处理礼包
  for (const packId in cashShopGoodsTable) {
    // 检查是否隐藏
    if (cashShopHideInGameTable[packId]?.hideInGame === true) {
      continue;
    }

    const goods = cashShopGoodsTable[packId];
    const localizedNames = getLocalizedValue(goods.goodsName);

    const packData: PackData = {
      packId: packId,
      packDisplayNameZH: localizedNames['zh-CN'],
      packDisplayNameEN: localizedNames['en-US'],
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
        const itemNameZH = item ? getLocalizedValue(item.name)['zh-CN'] : bundle.id;
        return {
          itemId: bundle.id,
          itemName: itemNameZH,
          quantity: bundle.count,
        };
      });
    }

    packs[packId] = packData;
  }

  // 3. 过滤掉没有展示礼包的分类
  const filteredShops: Record<string, PackShopData> = {};
  for (const shopId in packShops) {
    const shop = packShops[shopId];
    shop.goodsIds = shop.goodsIds.filter((id) => packs[id]);
    if (shop.goodsIds.length > 0) {
      filteredShops[shopId] = shop;
    }
  }

  const filteredGroups: Record<string, PackGroupData> = {};
  for (const groupId in packGroups) {
    const group = packGroups[groupId];
    group.shopIds = group.shopIds.filter((id) => filteredShops[id]);
    if (group.shopIds.length > 0) {
      filteredGroups[groupId] = group;
    }
  }

  return { packs, packShops: filteredShops, packGroups: filteredGroups };
}

const { packs, packShops, packGroups } = makePacks();

fs.writeFileSync('custom/core/packs.json', JSON.stringify(packs, null, 2), 'utf8');
fs.writeFileSync('custom/core/packShops.json', JSON.stringify(packShops, null, 2), 'utf8');
fs.writeFileSync('custom/core/packGroups.json', JSON.stringify(packGroups, null, 2), 'utf8');

console.log(`Generated:
- ${Object.keys(packs).length} packs to custom/core/packs.json
- ${Object.keys(packShops).length} shops to custom/core/packShops.json
- ${Object.keys(packGroups).length} groups to custom/core/packGroups.json`);
