import type { PackGroups, Packs, PackShops } from '@/shared/types/pack';
import rawPackGroups from '@/custom/core/packGroups.json';
import rawPacks from '@/custom/core/packs.json';
import rawPackShops from '@/custom/core/packShops.json';

export const packs: Packs = rawPacks;
export const packShops: PackShops = rawPackShops;
export const packGroups: PackGroups = rawPackGroups;
