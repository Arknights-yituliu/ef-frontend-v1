import type { TranslationKey } from './common';

export interface ForesightCharGrowth {
  activityId: string;
  charId: string;
  charTypeId: string;
  isReplica: boolean;
  name: TranslationKey;
  profession: number;
  rarity: number;
  showSkill: boolean;
  sortWeight: number;
  stageMaterials: Record<string, unknown>;
  weaponIds: string[];
}

export type ForesightCharGrowthTable = Record<string, ForesightCharGrowth>;
