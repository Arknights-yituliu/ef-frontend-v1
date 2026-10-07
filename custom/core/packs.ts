import type { PackGroups, Packs, PackShops } from '@/shared/types/pack';
import rawPackGroups from '@/custom/core/packGroups.json';
import rawPacks from '@/custom/core/packs.json';
import rawPackShops from '@/custom/core/packShops.json';
import { DELISTED_PACK_CATEGORY } from '@/shared/types/pack';

export const packs: Packs = rawPacks;
// 可购买礼包供计算器使用；完整礼包数据保留已下架礼包供价值查询。
export const availablePacks: Packs = Object.fromEntries(
  Object.entries(packs).filter(([, pack]) => pack.category !== DELISTED_PACK_CATEGORY),
);
export const packShops: PackShops = rawPackShops;
export const packGroups: PackGroups = rawPackGroups;
