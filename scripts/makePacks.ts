import type {
  LocalizedText,
  PackContent,
  PackData,
  PackGroupData,
  PackShopData,
} from '../shared/types/pack';
import type { CashShopGoods, ItemBundle } from './models';
import {
  battlePassLevelTable,
  battlePassOverrideLevelTable,
  battlePassSeasonTable,
  battlePassTrackTable,
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

/**
 * 判定是否为限时寻访组合包
 * 标准：98 元，且类型为 Seasonal_Rec_pack，且名称以“寻访组合包”结尾，且含有 80000 折金票
 */
function isSeasonalGachaPack(goods: CashShopGoods): boolean {
  return (
    goods.priceCNY === 98 &&
    goods.cashShopId === 'Seasonal_Rec_pack' &&
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
    // 忽略限时寻访组合包（单独处理）
    if (isSeasonalGachaPack(goods)) {
      continue;
    }
    // 忽略源石组合包（单独处理）
    if (goods.cashShopId === 'originium_recharge') {
      continue;
    }
    // 忽略协议通行证（单独处理）
    if (goods.cashShopId === 'BP') {
      continue;
    }

    // 常规礼包
    const reward = rewardTable[goods.rewardId]!;
    const packData: PackData = {
      packId,
      displayName: getLocalizedValue(goods.goodsName),
      category: goods.cashShopId,
      price: goods.priceCNY,
      imageUrl: `https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/shop/shopgroupbag/${goods.iconId}.webp`,
      contents: reward.itemBundles.map((bundle: ItemBundle) => {
        const item = itemTable[bundle.id]!;
        return {
          itemId: bundle.id,
          name: getLocalizedValue(item.name),
          quantity: bundle.count,
        };
      }),
    };

    packs[packId] = packData;
  }

  // 添加限时寻访组合包
  packs['seasonal_giftpack'] = {
    packId: 'seasonal_giftpack',
    displayName: {
      'zh-CN': '限时寻访组合包',
      'en-US': 'Gacha HH Bundle',
    },
    category: 'Seasonal_Rec_pack',
    price: 98,
    imageUrl:
      'https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/shop/shopgroupbag/seasonal_giftpack_lt_01_smallicon.webp',
    contents: [
      {
        itemId: 'ticketgacha_special_ten_lt_1_0_1',
        name: getLocalizedValue(itemTable['ticketgacha_special_ten_lt_1_0_1']!.name),
        quantity: 1,
      },
      {
        itemId: 'item_gold',
        name: getLocalizedValue(itemTable['item_gold']!.name),
        quantity: 80_000,
      },
    ],
  };

  // 添加源石礼包（非首充）
  for (const [index, { price, originumCount }] of nonFirstRechargeOriginiumPackData.entries()) {
    const packId = `non_first_recharge_originium_${index}_${price}`;
    packs[packId] = {
      packId,
      displayName: {
        'zh-CN': `${price}元非首充源石`,
        'en-US': `${price} Originium (Non-Bonus)`,
      },
      category: 'non_first_originium_recharge',
      price,
      imageUrl: `https://cos.yituliu.cn/endfield/screenshot-images/packs/${price}元源石.webp`,
      contents: [
        {
          itemId: 'item_originium_recharge',
          name: getLocalizedValue(itemTable['item_originium_recharge']!.name),
          quantity: originumCount,
        },
      ],
    };
  }

  // 添加源石礼包（首充）
  for (const [index, { price, originumCount }] of firstRechargeOriginiumPackData.entries()) {
    const packId = `first_originium_recharge_${index}_${price}`;
    packs[packId] = {
      packId,
      displayName: {
        'zh-CN': `${price}元首充源石`,
        'en-US': `${price} Originium (First Bonus)`,
      },
      category: 'first_originium_recharge',
      price,
      imageUrl: `https://cos.yituliu.cn/endfield/screenshot-images/packs/${price}元源石.webp`,
      contents: [
        {
          itemId: 'item_originium_recharge',
          name: getLocalizedValue(itemTable['item_originium_recharge']!.name),
          quantity: originumCount,
        },
      ],
    };
  }

  // 添加协议通行证
  const latestSeason = Object.values(battlePassSeasonTable).at(-1)!;
  const bpLevelGroup = battlePassLevelTable[latestSeason.levelGroupId]!;
  const bpOverrideGroup = battlePassOverrideLevelTable[latestSeason.ovrLvRewardGroupId]!;
  const allLevels = Object.values(bpLevelGroup.levelInfos).slice(0, -1); // 去掉最后一个通行证等级（循环奖励）
  const overrideLevels = Object.values(bpOverrideGroup.levelInfos);
  /** 奖励的 key，用于在 `bpPassLevelTable` 中查找 `rewardId` */
  const rewardKeyMap: Record<string, 'freeRewardId' | 'originiumRewardId' | 'payRewardId'> = {
    bp_track_free: 'freeRewardId',
    bp_track_originium: 'originiumRewardId',
    bp_track_pay: 'payRewardId',
  };
  const priceMap: Record<string, number> = {
    bp_track_free: 0,
    bp_track_originium: 29 * (648 / 350), // 价格为源石折算
    bp_track_pay: cashShopGoodsTable['bp_pay_track']!.priceCNY, // 68 元
  };
  const descriptionMap: Record<string, LocalizedText> = {
    bp_track_originium: {
      'zh-CN': '价格为源石折算',
      'en-US': 'Price is based on Originium conversion',
    },
  };

  // 添加 3 个协议通行证
  for (const track of Object.values(battlePassTrackTable)) {
    const rewardKey = rewardKeyMap[track.trackId]!;

    const levelMap = new Map<
      string,
      { freeRewardId: string; originiumRewardId: string; payRewardId: string }
    >();
    for (const level of allLevels) {
      levelMap.set(String(level.level), level);
    }
    for (const ovLevel of overrideLevels) {
      levelMap.set(String(ovLevel.level), ovLevel);
    }

    // 协议定制有单独的奖励，需要单独处理
    const payTrackContents: PackContent[] = [];
    if (track.trackId === 'bp_track_pay') {
      const payTrackGoods = cashShopGoodsTable['bp_pay_track']!;
      const payTrackReward = rewardTable[payTrackGoods.rewardId]!;
      payTrackContents.push(
        ...payTrackReward.itemBundles.map((bundle) => ({
          itemId: bundle.id,
          name: getLocalizedValue(itemTable[bundle.id]!.name),
          quantity: bundle.count,
        })),
      );
    }

    // 然后处理等级奖励
    const levelContents: PackContent[] = [...levelMap.values()].flatMap((level) => {
      const reward = rewardTable[level[rewardKey]]!;
      return reward.itemBundles.map((bundle) => ({
        itemId: bundle.id,
        name: getLocalizedValue(itemTable[bundle.id]!.name),
        quantity: bundle.count,
      }));
    });

    // 把协议定制奖励和等级奖励合并，协议定制奖励放在前面
    const contents = [...payTrackContents, ...levelContents];

    packs[track.trackId] = {
      packId: track.trackId,
      displayName: getLocalizedValue(track.name),
      category: 'BP',
      description: descriptionMap[track.trackId],
      price: priceMap[track.trackId]!,
      imageUrl: '',
      contents,
    };
  }

  return Object.fromEntries(
    Object.entries(packs).toSorted(([idA], [idB]) => idA.localeCompare(idB)),
  ); // 按 packId 字典序排序，保证 diff 最小
}

export function makePackShops(packs: Record<string, PackData>): Record<string, PackShopData> {
  const packShops: Record<string, PackShopData> = {};

  for (const [shopId, shop] of Object.entries(cashShopTable)) {
    if (shopId === 'originium_recharge') {
      // 拆分为首充/非首充两个商店
      packShops['first_originium_recharge'] = {
        shopId: 'first_originium_recharge',
        displayName: { 'zh-CN': '首充源石', 'en-US': 'First Bonus Originium' },
        goodsIds: Object.values(packs)
          .filter((pack) => pack.category === 'first_originium_recharge')
          .map((pack) => pack.packId),
      };
      packShops['non_first_originium_recharge'] = {
        shopId: 'non_first_originium_recharge',
        displayName: { 'zh-CN': '非首充源石', 'en-US': 'Originium' },
        goodsIds: Object.values(packs)
          .filter((pack) => pack.category === 'non_first_originium_recharge')
          .map((pack) => pack.packId),
      };
    } else {
      packShops[shopId] = {
        shopId,
        displayName: getLocalizedValue(shop.shopName),
        goodsIds: Object.values(packs)
          .filter((pack) => pack.category === shopId)
          .map((pack) => pack.packId),
      };
    }
  }

  return packShops;
}

export function makePackGroups(): Record<string, PackGroupData> {
  const packGroups: Record<string, PackGroupData> = {};

  for (const [groupId, group] of Object.entries(cashShopGroupTable)) {
    let shopIds: string[];
    if (groupId === 'shop_pay_originium_recharge') {
      // 源石交易所需要特殊处理，包含首充和非首充两个商店
      shopIds = ['first_originium_recharge', 'non_first_originium_recharge'];
    } else {
      shopIds = group.cashShopIds;
    }
    packGroups[groupId] = {
      groupId,
      displayName: getLocalizedValue(group.shopGroupName),
      shopIds,
    };
  }

  return packGroups;
}
