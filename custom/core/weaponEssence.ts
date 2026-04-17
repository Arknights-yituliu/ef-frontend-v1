import rawWeapons from '@/custom/core/weapons.json';

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
export const allAttributeStats = ['敏捷提升', '力量提升', '意志提升', '智识提升', '主能力提升'];
/** 全部的附加属性 */
export const allSecondaryStats = [
  '攻击提升',
  '生命提升',
  '物理伤害提升',
  '灼热伤害提升',
  '电磁伤害提升',
  '寒冷伤害提升',
  '自然伤害提升',
  '暴击率提升',
  '源石技艺提升',
  '终结技效率提升',
  '法术伤害提升',
  '治疗效率提升',
];
/** 全部的技能属性 */
export const allSkillStats = [
  '强攻',
  '压制',
  '追袭',
  '粉碎',
  '昂扬',
  '巧技',
  '残暴',
  '附术',
  '医疗',
  '切骨',
  '迸发',
  '夜幕',
  '流转',
  '效益',
];

/** 能量淤积点信息 */
export const energyAlluviums: Record<string, EnergyAlluvium> = {
  '重度能量淤积点·枢纽区': {
    battleId: '重度能量淤积点·枢纽区',
    battleName: '重度能量淤积点·枢纽区',
    imageUrl:
      'https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/loading/bg_loading_map01_lv001_1.webp',
    secondaryStats: [
      '攻击提升',
      '灼热伤害提升',
      '电磁伤害提升',
      '寒冷伤害提升',
      '自然伤害提升',
      '源石技艺提升',
      '终结技效率提升',
      '法术伤害提升',
    ],
    skillStats: ['强攻', '压制', '追袭', '粉碎', '巧技', '迸发', '流转', '效益'],
  },
  '重度能量淤积点·源石研究园': {
    battleId: '重度能量淤积点·源石研究园',
    battleName: '重度能量淤积点·源石研究园',
    imageUrl:
      'https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/loading/bg_loading_map01_lv005_1.webp',
    secondaryStats: [
      '攻击提升',
      '物理伤害提升',
      '电磁伤害提升',
      '寒冷伤害提升',
      '自然伤害提升',
      '暴击率提升',
      '终结技效率提升',
      '法术伤害提升',
    ],
    skillStats: ['压制', '追袭', '昂扬', '巧技', '附术', '医疗', '切骨', '效益'],
  },
  '重度能量淤积点·矿脉源区': {
    battleId: '重度能量淤积点·矿脉源区',
    battleName: '重度能量淤积点·矿脉源区',
    imageUrl:
      'https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/loading/bg_loading_map01_lv006_1.webp',
    secondaryStats: [
      '生命提升',
      '物理伤害提升',
      '灼热伤害提升',
      '寒冷伤害提升',
      '自然伤害提升',
      '暴击率提升',
      '源石技艺提升',
      '治疗效率提升',
    ],
    skillStats: ['强攻', '压制', '巧技', '残暴', '附术', '迸发', '夜幕', '效益'],
  },
  '重度能量淤积点·供能高地': {
    battleId: '重度能量淤积点·供能高地',
    battleName: '重度能量淤积点·供能高地',
    imageUrl:
      'https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/loading/bg_loading_map01_lv007_1.webp',
    secondaryStats: [
      '攻击提升',
      '生命提升',
      '物理伤害提升',
      '灼热伤害提升',
      '自然伤害提升',
      '暴击率提升',
      '源石技艺提升',
      '治疗效率提升',
    ],
    skillStats: ['追袭', '粉碎', '昂扬', '残暴', '附术', '医疗', '切骨', '流转'],
  },
  '重度能量淤积点·武陵城': {
    battleId: '重度能量淤积点·武陵城',
    battleName: '重度能量淤积点·武陵城',
    imageUrl:
      'https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/loading/bg_loading_map02_lv002_1.webp',
    secondaryStats: [
      '攻击提升',
      '生命提升',
      '电磁伤害提升',
      '寒冷伤害提升',
      '暴击率提升',
      '终结技效率提升',
      '法术伤害提升',
      '治疗效率提升',
    ],
    skillStats: ['强攻', '粉碎', '残暴', '医疗', '切骨', '迸发', '夜幕', '流转'],
  },
  '重度能量淤积点·清波寨': {
    battleId: '重度能量淤积点·清波寨',
    battleName: '重度能量淤积点·清波寨',
    imageUrl:
      'https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/loading/bg_loading_map02_lv003_1.webp',
    secondaryStats: [
      '生命提升',
      '物理伤害提升',
      '电磁伤害提升',
      '寒冷伤害提升',
      '源石技艺提升',
      '终结技效率提升',
      '法术伤害提升',
      '治疗效率提升',
    ],
    skillStats: ['压制', '粉碎', '昂扬', '巧技', '医疗', '切骨', '迸发', '夜幕'],
  },
  '重度能量淤积点·首墩': {
    battleId: '重度能量淤积点·首墩',
    battleName: '重度能量淤积点·首墩',
    imageUrl:
      'https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/loading/bg_loading_map02_lv003_1.webp',
    secondaryStats: [
      '攻击提升',
      '物理伤害提升',
      '灼热伤害提升',
      '电磁伤害提升',
      '自然伤害提升',
      '暴击率提升',
      '终结技效率提升',
      '法术伤害提升',
    ],
    skillStats: ['强攻', '追袭', '昂扬', '残暴', '附术', '夜幕', '流转', '效益'],
  },
};

/** 武器类型 */
export const weaponTypes = ['单手剑', '双手剑', '长柄武器', '手铳', '施术单元'];
export const weaponTypeToGroupIconId: Record<string, string> = {
  单手剑: 'icon_wiki_group_weapon_sword',
  双手剑: 'icon_wiki_group_weapon_claymores',
  长柄武器: 'icon_wiki_group_weapon_lance',
  手铳: 'icon_wiki_group_weapon_pistol',
  施术单元: 'icon_wiki_group_weapon_wand',
};

/** 武器稀有度 */
export const rarityLevels = [3, 4, 5, 6];

/** 武器预设 */
export const weapons: Record<string, WeaponPreset> = rawWeapons;
