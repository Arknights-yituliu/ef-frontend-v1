import rawEnergyAlluviums from '@/custom/core/energyAlluviums.json';
import rawWeapons from '@/custom/core/weapons.json';
import rawWeaponToChars from '@/custom/core/weaponToChars.json';

export interface EssenceStat {
  isCustom: boolean;
  weaponId: string | null;
  attribute: string | null;
  secondary: string | null;
  skill: string | null;
}

export interface BattleChoice {
  battleId: string;
  battleName: string;
  selectedAttribute: string[];
  selectedSecondary: string | null;
  selectedSkill: string | null;
  matchedSelectedIndices: number[];
  matchedWeaponIds: string[];
}

export const emptyStat: EssenceStat = {
  isCustom: true,
  weaponId: null,
  attribute: '',
  secondary: '',
  skill: '',
};

export interface EnergyAlluvium {
  battleId: string;
  battleName: string;
  imageUrl: string;
  secondaryStats: string[];
  skillStats: string[];
}

export interface WeaponStat {
  attribute: string | null;
  secondary: string | null;
  skill: string | null;
}

export interface WeaponPreset {
  weaponId: string;
  weaponName: string;
  weaponType: string;
  rarity: number;
  stats: WeaponStat;
}

/** 全部的基础属性 */
export const allAttributeStats = ['weapon.stat.agility', 'weapon.stat.strength', 'weapon.stat.will', 'weapon.stat.intellect', 'weapon.stat.main'];
/** 全部的附加属性 */
export const allSecondaryStats = [
  'weapon.stat.attack',
  'weapon.stat.hp',
  'weapon.stat.physicalDmg',
  'weapon.stat.heatDmg',
  'weapon.stat.electricDmg',
  'weapon.stat.cryoDmg',
  'weapon.stat.natureDmg',
  'weapon.stat.critRate',
  'weapon.stat.artsIntensity',
  'weapon.stat.ultimateGain',
  'weapon.stat.artsBoost',
  'weapon.stat.treatmentEfficiency',
];
/** 全部的技能属性 */
export const allSkillStats = [
  'weapon.stat.assault',
  'weapon.stat.suppression',
  'weapon.stat.pursuit',
  'weapon.stat.crusher',
  'weapon.stat.inspiring',
  'weapon.stat.combative',
  'weapon.stat.brutality',
  'weapon.stat.infliction',
  'weapon.stat.medicant',
  'weapon.stat.fracture',
  'weapon.stat.detonate',
  'weapon.stat.twilight',
  'weapon.stat.flow',
  'weapon.stat.treatment',
];

/** 能量淤积点信息（由 scripts/tasks/makeWeapons.ts 自动生成） */
export const energyAlluviums: Record<string, EnergyAlluvium> = rawEnergyAlluviums;

/** 武器类型 */
export const weaponTypes = ['weapon.type.sword', 'weapon.type.greatSword', 'weapon.type.polearm', 'weapon.type.handcannon', 'weapon.type.artsUnit'];
export const weaponTypeToGroupIconId: Record<string, string> = {
  'weapon.type.sword': 'icon_wiki_group_weapon_sword',
  'weapon.type.greatSword': 'icon_wiki_group_weapon_claymores',
  'weapon.type.polearm': 'icon_wiki_group_weapon_lance',
  'weapon.type.handcannon': 'icon_wiki_group_weapon_pistol',
  'weapon.type.artsUnit': 'icon_wiki_group_weapon_wand',
};

/** 武器稀有度 */
export const rarityLevels = [3, 4, 5, 6];

/** 武器预设（由 scripts/tasks/makeWeapons.ts 自动生成） */
export const weapons: Record<string, WeaponPreset> = rawWeapons;

/** 武器推荐干员（由 scripts/tasks/makeWeaponToChars.ts 自动生成） */
export const weaponToChars: Record<string, string[]> = rawWeaponToChars;
