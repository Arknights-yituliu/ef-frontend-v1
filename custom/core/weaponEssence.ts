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
  weaponType: string;
  rarity: number;
  stats: WeaponStat;
}

/** 全部的基础属性 */
export const allAttributeStats = [
  'weapon.stat.gat_passive_attr_agi',
  'weapon.stat.gat_passive_attr_str',
  'weapon.stat.gat_passive_attr_will',
  'weapon.stat.gat_passive_attr_wisd',
  'weapon.stat.gat_passive_attr_main'
];
/** 全部的附加属性 */
export const allSecondaryStats = [
  'weapon.stat.gat_passive_attr_atk',
  'weapon.stat.gat_passive_attr_crirate',
  'weapon.stat.gat_passive_attr_pulsedam',
  'weapon.stat.gat_passive_attr_firedam',
  'weapon.stat.gat_passive_attr_heal',
  'weapon.stat.gat_passive_attr_hp',
  'weapon.stat.gat_passive_attr_icedam',
  'weapon.stat.gat_passive_attr_magicdam',
  'weapon.stat.gat_passive_attr_naturaldam',
  'weapon.stat.gat_passive_attr_phydam',
  'weapon.stat.gat_passive_attr_physpell',
  'weapon.stat.gat_passive_attr_usp',
];
/** 全部的技能属性 */
export const allSkillStats = [
  'weapon.stat.gst_passive_tacafter',
  'weapon.stat.gst_passive_magabn',
  'weapon.stat.gst_passive_crit',
  'weapon.stat.gst_passive_spirit',
  'weapon.stat.gst_passive_ult',
  'weapon.stat.gst_passive_break',
  'weapon.stat.gst_passive_smash',
  'weapon.stat.gst_passive_burst',
  'weapon.stat.gst_passive_combo',
  'weapon.stat.gst_passive_force',
  'weapon.stat.gst_passive_heal',
  'weapon.stat.gst_passive_keyword',
  'weapon.stat.gst_passive_phyabn',
  'weapon.stat.gst_passive_tactic',
];

/** 能量淤积点信息（由 scripts/tasks/makeWeapons.ts 自动生成） */
export const energyAlluviums: Record<string, EnergyAlluvium> = rawEnergyAlluviums;

/** 武器类型 */
export const weaponTypes = [
  'weapon.type.wpn_sword',
  'weapon.type.wpn_claym',
  'weapon.type.wpn_lance',
  'weapon.type.wpn_pistol',
  'weapon.type.wpn_funnel'
];
export const weaponTypeToGroupIconId: Record<string, string> = {
  'weapon.type.wpn_sword': 'icon_wiki_group_weapon_sword',
  'weapon.type.wpn_claym': 'icon_wiki_group_weapon_claymores',
  'weapon.type.wpn_lance': 'icon_wiki_group_weapon_lance',
  'weapon.type.wpn_pistol': 'icon_wiki_group_weapon_pistol',
  'weapon.type.wpn_funnel': 'icon_wiki_group_weapon_wand',
};

/** 武器稀有度 */
export const rarityLevels = [3, 4, 5, 6];

/** 武器预设（由 scripts/tasks/makeWeapons.ts 自动生成） */
export const weapons: Record<string, WeaponPreset> = rawWeapons;

/** 武器推荐干员（由 scripts/tasks/makeWeaponToChars.ts 自动生成） */
export const weaponToChars: Record<string, string[]> = rawWeaponToChars;
