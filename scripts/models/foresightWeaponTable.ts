import type { TranslationKey } from './common';

export interface ForesightWeapon {
  gemTagIds: string[];
  iconId: string;
  name: TranslationKey;
  rarity: number;
  skIds: string[];
  skNames: TranslationKey[];
  stageMaterials: Record<string, unknown>;
  tgtLv: number;
  weaponId: string;
  wpnType: number;
}

export type ForesightWeaponTable = Record<string, ForesightWeapon>;
