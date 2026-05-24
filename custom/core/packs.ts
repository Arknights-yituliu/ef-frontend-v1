import type { PackGroups, Packs, PackShops } from '@/shared/types/pack';
import groupData from './packGroups.json';
import packData from './packs.json';
import shopData from './packShops.json';

export const packs: Packs = packData as Packs;
export const packShops: PackShops = shopData as PackShops;
export const packGroups: PackGroups = groupData as PackGroups;
