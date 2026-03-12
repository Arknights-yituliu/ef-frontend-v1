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
export const weapons: Record<string, WeaponPreset> = {
  wpn_claym_0003: {
    weaponId: 'wpn_claym_0003',
    weaponName: '工业零点一',
    weaponType: '双手剑',
    rarity: 4,
    stats: {
      attribute: '力量提升',
      secondary: '攻击提升',
      skill: '压制',
    },
  },
  wpn_claym_0004: {
    weaponId: 'wpn_claym_0004',
    weaponName: '典范',
    weaponType: '双手剑',
    rarity: 6,
    stats: {
      attribute: '主能力提升',
      secondary: '攻击提升',
      skill: '压制',
    },
  },
  wpn_claym_0006: {
    weaponId: 'wpn_claym_0006',
    weaponName: '昔日精品',
    weaponType: '双手剑',
    rarity: 6,
    stats: {
      attribute: '意志提升',
      secondary: '生命提升',
      skill: '效益',
    },
  },
  wpn_claym_0007: {
    weaponId: 'wpn_claym_0007',
    weaponName: '大雷斑',
    weaponType: '双手剑',
    rarity: 6,
    stats: {
      attribute: '力量提升',
      secondary: '生命提升',
      skill: '医疗',
    },
  },
  wpn_claym_0008: {
    weaponId: 'wpn_claym_0008',
    weaponName: '破碎君王',
    weaponType: '双手剑',
    rarity: 6,
    stats: {
      attribute: '力量提升',
      secondary: '暴击率提升',
      skill: '粉碎',
    },
  },
  wpn_claym_0009: {
    weaponId: 'wpn_claym_0009',
    weaponName: '淬火者',
    weaponType: '双手剑',
    rarity: 4,
    stats: {
      attribute: '意志提升',
      secondary: '生命提升',
      skill: '粉碎',
    },
  },
  wpn_claym_0010: {
    weaponId: 'wpn_claym_0010',
    weaponName: '达尔霍夫7',
    weaponType: '双手剑',
    rarity: 3,
    stats: {
      attribute: '主能力提升',
      secondary: null,
      skill: '强攻',
    },
  },
  wpn_claym_0011: {
    weaponId: 'wpn_claym_0011',
    weaponName: '探骊',
    weaponType: '双手剑',
    rarity: 5,
    stats: {
      attribute: '力量提升',
      secondary: '终结技效率提升',
      skill: '迸发',
    },
  },
  wpn_claym_0012: {
    weaponId: 'wpn_claym_0012',
    weaponName: '终点之声',
    weaponType: '双手剑',
    rarity: 5,
    stats: {
      attribute: '力量提升',
      secondary: '生命提升',
      skill: '医疗',
    },
  },
  wpn_claym_0013: {
    weaponId: 'wpn_claym_0013',
    weaponName: '赫拉芬格',
    weaponType: '双手剑',
    rarity: 6,
    stats: {
      attribute: '力量提升',
      secondary: '攻击提升',
      skill: '迸发',
    },
  },
  wpn_claym_0014: {
    weaponId: 'wpn_claym_0014',
    weaponName: '古渠',
    weaponType: '双手剑',
    rarity: 5,
    stats: {
      attribute: '力量提升',
      secondary: '源石技艺提升',
      skill: '残暴',
    },
  },
  wpn_claym_0015: {
    weaponId: 'wpn_claym_0015',
    weaponName: 'O.B.J.重荷',
    weaponType: '双手剑',
    rarity: 5,
    stats: {
      attribute: '力量提升',
      secondary: '生命提升',
      skill: '效益',
    },
  },
  wpn_funnel_0001: {
    weaponId: 'wpn_funnel_0001',
    weaponName: '全自动骇新星',
    weaponType: '施术单元',
    rarity: 4,
    stats: {
      attribute: '智识提升',
      secondary: '法术伤害提升',
      skill: '昂扬',
    },
  },
  wpn_funnel_0002: {
    weaponId: 'wpn_funnel_0002',
    weaponName: '吉米尼12',
    weaponType: '施术单元',
    rarity: 3,
    stats: {
      attribute: '主能力提升',
      secondary: null,
      skill: '强攻',
    },
  },
  wpn_funnel_0003: {
    weaponId: 'wpn_funnel_0003',
    weaponName: '荧光雷羽',
    weaponType: '施术单元',
    rarity: 4,
    stats: {
      attribute: '意志提升',
      secondary: '攻击提升',
      skill: '压制',
    },
  },
  wpn_funnel_0004: {
    weaponId: 'wpn_funnel_0004',
    weaponName: '迷失荒野',
    weaponType: '施术单元',
    rarity: 5,
    stats: {
      attribute: '智识提升',
      secondary: '电磁伤害提升',
      skill: '附术',
    },
  },
  wpn_funnel_0005: {
    weaponId: 'wpn_funnel_0005',
    weaponName: '悼亡诗',
    weaponType: '施术单元',
    rarity: 5,
    stats: {
      attribute: '智识提升',
      secondary: '攻击提升',
      skill: '夜幕',
    },
  },
  wpn_funnel_0006: {
    weaponId: 'wpn_funnel_0006',
    weaponName: '作品：蚀迹',
    weaponType: '施术单元',
    rarity: 6,
    stats: {
      attribute: '意志提升',
      secondary: '自然伤害提升',
      skill: '压制',
    },
  },
  wpn_funnel_0007: {
    weaponId: 'wpn_funnel_0007',
    weaponName: '莫奈何',
    weaponType: '施术单元',
    rarity: 5,
    stats: {
      attribute: '意志提升',
      secondary: '终结技效率提升',
      skill: '昂扬',
    },
  },
  wpn_funnel_0008: {
    weaponId: 'wpn_funnel_0008',
    weaponName: '爆破单元',
    weaponType: '施术单元',
    rarity: 6,
    stats: {
      attribute: '主能力提升',
      secondary: '源石技艺提升',
      skill: '迸发',
    },
  },
  wpn_funnel_0009: {
    weaponId: 'wpn_funnel_0009',
    weaponName: '遗忘',
    weaponType: '施术单元',
    rarity: 6,
    stats: {
      attribute: '智识提升',
      secondary: '法术伤害提升',
      skill: '夜幕',
    },
  },
  wpn_funnel_0010: {
    weaponId: 'wpn_funnel_0010',
    weaponName: '骑士精神',
    weaponType: '施术单元',
    rarity: 6,
    stats: {
      attribute: '意志提升',
      secondary: '生命提升',
      skill: '医疗',
    },
  },
  wpn_funnel_0011: {
    weaponId: 'wpn_funnel_0011',
    weaponName: '使命必达',
    weaponType: '施术单元',
    rarity: 6,
    stats: {
      attribute: '意志提升',
      secondary: '终结技效率提升',
      skill: '追袭',
    },
  },
  wpn_funnel_0012: {
    weaponId: 'wpn_funnel_0012',
    weaponName: '布道自由',
    weaponType: '施术单元',
    rarity: 5,
    stats: {
      attribute: '意志提升',
      secondary: '治疗效率提升',
      skill: '医疗',
    },
  },
  wpn_funnel_0013: {
    weaponId: 'wpn_funnel_0013',
    weaponName: '沧溟星梦',
    weaponType: '施术单元',
    rarity: 6,
    stats: {
      attribute: '智识提升',
      secondary: '治疗效率提升',
      skill: '附术',
    },
  },
  wpn_funnel_0014: {
    weaponId: 'wpn_funnel_0014',
    weaponName: 'O.B.J.术识',
    weaponType: '施术单元',
    rarity: 5,
    stats: {
      attribute: '智识提升',
      secondary: '源石技艺提升',
      skill: '追袭',
    },
  },
  wpn_lance_0003: {
    weaponId: 'wpn_lance_0003',
    weaponName: '寻路者道标',
    weaponType: '长柄武器',
    rarity: 4,
    stats: {
      attribute: '敏捷提升',
      secondary: '攻击提升',
      skill: '昂扬',
    },
  },
  wpn_lance_0004: {
    weaponId: 'wpn_lance_0004',
    weaponName: '嵌合正义',
    weaponType: '长柄武器',
    rarity: 5,
    stats: {
      attribute: '力量提升',
      secondary: '终结技效率提升',
      skill: '残暴',
    },
  },
  wpn_lance_0006: {
    weaponId: 'wpn_lance_0006',
    weaponName: '向心之引',
    weaponType: '长柄武器',
    rarity: 5,
    stats: {
      attribute: '意志提升',
      secondary: '电磁伤害提升',
      skill: '压制',
    },
  },
  wpn_lance_0008: {
    weaponId: 'wpn_lance_0008',
    weaponName: '天使杀手',
    weaponType: '长柄武器',
    rarity: 4,
    stats: {
      attribute: '意志提升',
      secondary: '法术伤害提升',
      skill: '压制',
    },
  },
  wpn_lance_0009: {
    weaponId: 'wpn_lance_0009',
    weaponName: '奥佩罗77',
    weaponType: '长柄武器',
    rarity: 3,
    stats: {
      attribute: '主能力提升',
      secondary: null,
      skill: '强攻',
    },
  },
  wpn_lance_0010: {
    weaponId: 'wpn_lance_0010',
    weaponName: '骁勇',
    weaponType: '长柄武器',
    rarity: 6,
    stats: {
      attribute: '敏捷提升',
      secondary: '物理伤害提升',
      skill: '巧技',
    },
  },
  wpn_lance_0011: {
    weaponId: 'wpn_lance_0011',
    weaponName: 'J.E.T.',
    weaponType: '长柄武器',
    rarity: 6,
    stats: {
      attribute: '主能力提升',
      secondary: '攻击提升',
      skill: '压制',
    },
  },
  wpn_lance_0012: {
    weaponId: 'wpn_lance_0012',
    weaponName: '负山',
    weaponType: '长柄武器',
    rarity: 6,
    stats: {
      attribute: '敏捷提升',
      secondary: '物理伤害提升',
      skill: '效益',
    },
  },
  wpn_lance_0013: {
    weaponId: 'wpn_lance_0013',
    weaponName: 'O.B.J.尖峰',
    weaponType: '长柄武器',
    rarity: 5,
    stats: {
      attribute: '意志提升',
      secondary: '物理伤害提升',
      skill: '附术',
    },
  },
  wpn_pistol_0001: {
    weaponId: 'wpn_pistol_0001',
    weaponName: '佩科5',
    weaponType: '手铳',
    rarity: 3,
    stats: {
      attribute: '主能力提升',
      secondary: null,
      skill: '强攻',
    },
  },
  wpn_pistol_0002: {
    weaponId: 'wpn_pistol_0002',
    weaponName: '呼啸守卫',
    weaponType: '手铳',
    rarity: 4,
    stats: {
      attribute: '智识提升',
      secondary: '攻击提升',
      skill: '压制',
    },
  },
  wpn_pistol_0003: {
    weaponId: 'wpn_pistol_0003',
    weaponName: '长路',
    weaponType: '手铳',
    rarity: 4,
    stats: {
      attribute: '力量提升',
      secondary: '法术伤害提升',
      skill: '追袭',
    },
  },
  wpn_pistol_0004: {
    weaponId: 'wpn_pistol_0004',
    weaponName: '理性告别',
    weaponType: '手铳',
    rarity: 5,
    stats: {
      attribute: '力量提升',
      secondary: '灼热伤害提升',
      skill: '追袭',
    },
  },
  wpn_pistol_0005: {
    weaponId: 'wpn_pistol_0005',
    weaponName: '领航者',
    weaponType: '手铳',
    rarity: 6,
    stats: {
      attribute: '智识提升',
      secondary: '寒冷伤害提升',
      skill: '附术',
    },
  },
  wpn_pistol_0006: {
    weaponId: 'wpn_pistol_0006',
    weaponName: '作品：众生',
    weaponType: '手铳',
    rarity: 5,
    stats: {
      attribute: '敏捷提升',
      secondary: '法术伤害提升',
      skill: '附术',
    },
  },
  wpn_pistol_0007: {
    weaponId: 'wpn_pistol_0007',
    weaponName: '望乡',
    weaponType: '手铳',
    rarity: 6,
    stats: {
      attribute: '敏捷提升',
      secondary: '寒冷伤害提升',
      skill: '压制',
    },
  },
  wpn_pistol_0008: {
    weaponId: 'wpn_pistol_0008',
    weaponName: '楔子',
    weaponType: '手铳',
    rarity: 6,
    stats: {
      attribute: '主能力提升',
      secondary: '暴击率提升',
      skill: '附术',
    },
  },
  wpn_pistol_0009: {
    weaponId: 'wpn_pistol_0009',
    weaponName: '同类相食',
    weaponType: '手铳',
    rarity: 6,
    stats: {
      attribute: '主能力提升',
      secondary: '法术伤害提升',
      skill: '附术',
    },
  },
  wpn_pistol_0010: {
    weaponId: 'wpn_pistol_0010',
    weaponName: '艺术暴君',
    weaponType: '手铳',
    rarity: 6,
    stats: {
      attribute: '智识提升',
      secondary: '暴击率提升',
      skill: '切骨',
    },
  },
  wpn_pistol_0011: {
    weaponId: 'wpn_pistol_0011',
    weaponName: '落草',
    weaponType: '手铳',
    rarity: 6,
    stats: {
      attribute: '敏捷提升',
      secondary: '攻击提升',
      skill: '迸发',
    },
  },
  wpn_pistol_0012: {
    weaponId: 'wpn_pistol_0012',
    weaponName: 'O.B.J.迅极',
    weaponType: '手铳',
    rarity: 5,
    stats: {
      attribute: '敏捷提升',
      secondary: '终结技效率提升',
      skill: '迸发',
    },
  },
  wpn_sword_0003: {
    weaponId: 'wpn_sword_0003',
    weaponName: '塔尔11',
    weaponType: '单手剑',
    rarity: 3,
    stats: {
      attribute: '主能力提升',
      secondary: null,
      skill: '强攻',
    },
  },
  wpn_sword_0005: {
    weaponId: 'wpn_sword_0005',
    weaponName: '钢铁余音',
    weaponType: '单手剑',
    rarity: 5,
    stats: {
      attribute: '敏捷提升',
      secondary: '物理伤害提升',
      skill: '巧技',
    },
  },
  wpn_sword_0006: {
    weaponId: 'wpn_sword_0006',
    weaponName: '熔铸火焰',
    weaponType: '单手剑',
    rarity: 6,
    stats: {
      attribute: '智识提升',
      secondary: '攻击提升',
      skill: '夜幕',
    },
  },
  wpn_sword_0007: {
    weaponId: 'wpn_sword_0007',
    weaponName: '坚城铸造者',
    weaponType: '单手剑',
    rarity: 5,
    stats: {
      attribute: '智识提升',
      secondary: '终结技效率提升',
      skill: '昂扬',
    },
  },
  wpn_sword_0008: {
    weaponId: 'wpn_sword_0008',
    weaponName: '显锋',
    weaponType: '单手剑',
    rarity: 4,
    stats: {
      attribute: '敏捷提升',
      secondary: '物理伤害提升',
      skill: '压制',
    },
  },
  wpn_sword_0009: {
    weaponId: 'wpn_sword_0009',
    weaponName: '浪潮',
    weaponType: '单手剑',
    rarity: 4,
    stats: {
      attribute: '智识提升',
      secondary: '攻击提升',
      skill: '追袭',
    },
  },
  wpn_sword_0010: {
    weaponId: 'wpn_sword_0010',
    weaponName: '黯色火炬',
    weaponType: '单手剑',
    rarity: 6,
    stats: {
      attribute: '智识提升',
      secondary: '灼热伤害提升',
      skill: '附术',
    },
  },
  wpn_sword_0011: {
    weaponId: 'wpn_sword_0011',
    weaponName: '扶摇',
    weaponType: '单手剑',
    rarity: 6,
    stats: {
      attribute: '主能力提升',
      secondary: '暴击率提升',
      skill: '夜幕',
    },
  },
  wpn_sword_0012: {
    weaponId: 'wpn_sword_0012',
    weaponName: '热熔切割器',
    weaponType: '单手剑',
    rarity: 6,
    stats: {
      attribute: '意志提升',
      secondary: '攻击提升',
      skill: '流转',
    },
  },
  wpn_sword_0013: {
    weaponId: 'wpn_sword_0013',
    weaponName: '显赫声名',
    weaponType: '单手剑',
    rarity: 6,
    stats: {
      attribute: '主能力提升',
      secondary: '物理伤害提升',
      skill: '残暴',
    },
  },
  wpn_sword_0014: {
    weaponId: 'wpn_sword_0014',
    weaponName: '白夜新星',
    weaponType: '单手剑',
    rarity: 6,
    stats: {
      attribute: '主能力提升',
      secondary: '源石技艺提升',
      skill: '附术',
    },
  },
  wpn_sword_0015: {
    weaponId: 'wpn_sword_0015',
    weaponName: '仰止',
    weaponType: '单手剑',
    rarity: 5,
    stats: {
      attribute: '敏捷提升',
      secondary: '物理伤害提升',
      skill: '夜幕',
    },
  },
  wpn_sword_0016: {
    weaponId: 'wpn_sword_0016',
    weaponName: '不知归',
    weaponType: '单手剑',
    rarity: 6,
    stats: {
      attribute: '意志提升',
      secondary: '攻击提升',
      skill: '流转',
    },
  },
  wpn_sword_0017: {
    weaponId: 'wpn_sword_0017',
    weaponName: '光荣记忆',
    weaponType: '单手剑',
    rarity: 6,
    stats: {
      attribute: '敏捷提升',
      secondary: '暴击率提升',
      skill: '夜幕',
    },
  },
  wpn_sword_0018: {
    weaponId: 'wpn_sword_0018',
    weaponName: '十二问',
    weaponType: '单手剑',
    rarity: 5,
    stats: {
      attribute: '敏捷提升',
      secondary: '攻击提升',
      skill: '附术',
    },
  },
  wpn_sword_0019: {
    weaponId: 'wpn_sword_0019',
    weaponName: 'O.B.J.轻芒',
    weaponType: '单手剑',
    rarity: 5,
    stats: {
      attribute: '敏捷提升',
      secondary: '攻击提升',
      skill: '流转',
    },
  },
  wpn_sword_0020: {
    weaponId: 'wpn_sword_0020',
    weaponName: '逐鳞3.0',
    weaponType: '单手剑',
    rarity: 5,
    stats: {
      attribute: '力量提升',
      secondary: '寒冷伤害提升',
      skill: '压制',
    },
  },
  wpn_sword_0021: {
    weaponId: 'wpn_sword_0021',
    weaponName: '宏愿',
    weaponType: '单手剑',
    rarity: 6,
    stats: {
      attribute: '敏捷提升',
      secondary: '攻击提升',
      skill: '附术',
    },
  },
};
