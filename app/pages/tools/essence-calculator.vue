<template>
  <v-container fluid class="page-container">
    <v-row>
      <v-col cols="12" lg="6">
        <v-expansion-panels model-value="计算结果">
          <v-expansion-panel value="计算结果">
            <v-expansion-panel-title>{{
              t('page.tools.essenceCalculator.output')
            }}</v-expansion-panel-title>
            <v-expansion-panel-text>
              <template v-if="bestChoices.length > 0">
                <div v-for="(choice, i) in bestChoices" :key="i" class="mb-6">
                  <v-card class="result-card" elevation="2" rounded="lg">
                    <v-card-item class="bg-info py-3">
                      <v-card-title class="text-h6 font-weight-bold">
                        {{ t('page.tools.essenceCalculator.plan') }} {{ i + 1 }}
                      </v-card-title>
                      <template #append>
                        <v-chip
                          class="font-weight-bold mr-2"
                          color="success"
                          size="small"
                          variant="flat"
                        >
                          {{ choice.matchedSelectedIndices.length }}
                          {{ t('page.tools.essenceCalculator.requirementsMet') }}
                        </v-chip>
                        <v-chip
                          class="font-weight-bold"
                          color="success"
                          size="small"
                          variant="flat"
                        >
                          {{ choice.matchedWeaponIds.length }}
                          {{ t('page.tools.essenceCalculator.weaponsMatched') }}
                        </v-chip>
                      </template>
                    </v-card-item>

                    <v-divider />

                    <v-card-text class="pt-4">
                      <v-row>
                        <!-- Left Column: Configuration -->
                        <v-col cols="12" md="5">
                          <div class="d-flex align-center mb-3">
                            <v-icon
                              class="mr-2"
                              color="primary"
                              icon="mdi-map-marker"
                              size="small"
                            />
                            <span class="text-subtitle-1 font-weight-bold">{{
                              t('page.tools.essenceCalculator.farmLocation')
                            }}</span>
                          </div>

                          <div class="pl-1 mb-6">
                            <v-chip color="info" label variant="outlined">
                              {{ choice.battleName }}
                            </v-chip>
                          </div>

                          <div class="d-flex align-center mb-3">
                            <v-icon class="mr-2" color="primary" icon="mdi-tune" size="small" />
                            <span class="text-subtitle-1 font-weight-bold">{{
                              t('page.tools.essenceCalculator.preEngraveStats')
                            }}</span>
                          </div>

                          <div class="pl-1">
                            <!-- Primary Attributes -->
                            <div class="mb-4">
                              <div class="text-medium-emphasis mb-1">
                                {{ t('page.tools.essenceCalculator.selectAttributeStats') }}
                              </div>
                              <div class="d-flex flex-wrap ga-2">
                                <v-chip
                                  v-for="attr in choice.selectedAttribute"
                                  :key="attr"
                                  color="primary"
                                  label
                                  variant="flat"
                                >
                                  {{ attr }}
                                </v-chip>
                              </div>
                            </div>

                            <!-- Secondary Attribute -->
                            <div v-if="choice.selectedSecondary" class="mb-4">
                              <div class="text-medium-emphasis mb-1">
                                {{ t('page.tools.essenceCalculator.selectSecondaryAttribute') }}
                              </div>
                              <v-chip color="teal" label variant="flat">
                                {{ choice.selectedSecondary }}
                              </v-chip>
                            </div>

                            <!-- Skill Attribute -->
                            <div v-if="choice.selectedSkill" class="mb-4">
                              <div class="text-medium-emphasis mb-1">
                                {{ t('page.tools.essenceCalculator.selectSkillAttribute') }}
                              </div>
                              <v-chip color="blue" label variant="flat">
                                {{ choice.selectedSkill }}
                              </v-chip>
                            </div>
                          </div>
                        </v-col>

                        <v-divider vertical class="hidden-sm-and-down" />
                        <v-divider class="hidden-md-and-up my-4" />

                        <!-- Right Column: Results -->
                        <v-col cols="12" md="7">
                          <div class="d-flex align-center mb-3">
                            <v-icon
                              class="mr-2"
                              color="success"
                              icon="mdi-check-circle-outline"
                              size="small"
                            />
                            <span class="text-subtitle-1 font-weight-bold">{{
                              t('page.tools.essenceCalculator.planDescription', {
                                count: choice.matchedSelectedIndices.length,
                                weaponCount: choice.matchedWeaponIds.length,
                              })
                            }}</span>
                          </div>

                          <div class="pl-1">
                            <!-- Satisfied Requirements -->
                            <div class="mb-4">
                              <div class="text-medium-emphasis mb-1">
                                {{ t('page.tools.essenceCalculator.satisfiedRequirements') }}
                              </div>
                              <div class="d-flex flex-wrap ga-2">
                                <div v-for="index in choice.matchedSelectedIndices" :key="index">
                                  <v-tooltip activator="parent" location="bottom">
                                    {{
                                      [
                                        requiredEssenceStats[index]!.attribute,
                                        requiredEssenceStats[index]!.secondary,
                                        requiredEssenceStats[index]!.skill,
                                      ]
                                        .filter(Boolean)
                                        .join('、')
                                    }}
                                  </v-tooltip>
                                  <v-card
                                    v-if="requiredEssenceStats[index]!.isCustom"
                                    class="weapon-item"
                                    variant="outlined"
                                  >
                                    <div class="d-flex flex-column justify-center h-100 m-auto">
                                      <div class="text-center font-weight-bold">
                                        #{{ index + 1 }}
                                        {{
                                          getEssenceStatDescription(requiredEssenceStats[index]!)
                                        }}
                                      </div>
                                      <div class="text-center text-no-wrap">
                                        {{ requiredEssenceStats[index]!.attribute ?? '' }}
                                      </div>
                                      <div class="text-center text-no-wrap">
                                        {{ requiredEssenceStats[index]!.secondary ?? '' }}
                                      </div>
                                      <div class="text-center text-no-wrap">
                                        {{ requiredEssenceStats[index]!.skill ?? '' }}
                                      </div>
                                    </div>
                                  </v-card>
                                  <ContainerItemIcon
                                    v-else
                                    class="weapon-item"
                                    :item-id="requiredEssenceStats[index]!.weaponId!"
                                    show-item-name
                                  />
                                </div>
                              </div>
                            </div>

                            <!-- Matched Weapons -->
                            <div>
                              <div class="text-medium-emphasis mb-1">
                                {{ t('page.tools.essenceCalculator.matchedWeapons') }}
                              </div>
                              <div class="d-flex flex-wrap ga-2">
                                <div
                                  v-for="weaponId in choice.matchedWeaponIds.toSorted(
                                    (weaponIdA, weaponIdB) => {
                                      const weaponA = weapons[weaponIdA]!;
                                      const weaponB = weapons[weaponIdB]!;
                                      return weaponB.rarity - weaponA.rarity;
                                    },
                                  )"
                                  :key="weaponId"
                                >
                                  <ContainerItemIcon
                                    class="weapon-item"
                                    :item-id="weaponId"
                                    show-item-name
                                  />
                                  <v-tooltip activator="parent" location="bottom">
                                    {{
                                      [
                                        weapons[weaponId]!.stats.attribute,
                                        weapons[weaponId]!.stats.secondary,
                                        weapons[weaponId]!.stats.skill,
                                      ]
                                        .filter(Boolean)
                                        .join('、')
                                    }}
                                  </v-tooltip>
                                </div>
                              </div>
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </div>
              </template>
              <template v-else>
                <v-alert border="start" type="info" variant="tonal">
                  {{ t('page.tools.essenceCalculator.noValidDemand') }}
                </v-alert>
              </template>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>

      <v-col cols="12" lg="6">
        <v-expansion-panels model-value="需求设定">
          <v-expansion-panel value="需求设定">
            <v-expansion-panel-title>{{
              t('page.tools.essenceCalculator.demandSet')
            }}</v-expansion-panel-title>
            <v-expansion-panel-text>
              <p>{{ t('page.tools.essenceCalculator.demandSetDescription1') }}</p>
              <p>{{ t('page.tools.essenceCalculator.demandSetDescription2') }}</p>
              <div class="mb-8" />
              <v-row v-for="(stat, index) in requiredEssenceStats" :key="index" align="center">
                <v-col cols="0" md="1" />
                <v-col cols="12" md="2">
                  <div>
                    <span class="font-weight-bold mr-4">#{{ index + 1 }}</span
                    ><span>{{ getEssenceStatDescription(stat) }}</span>
                  </div>
                </v-col>
                <v-col cols="12" md="2">
                  <v-select
                    v-model="stat.attribute"
                    :items="allAttributeStats"
                    :label="t('page.tools.essenceCalculator.attributeStats')"
                    :list-props="{ density: 'compact' }"
                    :menu-props="{ maxHeight: 1024 }"
                    :disabled="!stat.isCustom"
                    density="compact"
                    hide-details
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="2">
                  <v-select
                    v-model="stat.secondary"
                    :items="allSecondaryStats"
                    :label="t('page.tools.essenceCalculator.secondaryStats')"
                    :list-props="{ density: 'compact' }"
                    :menu-props="{ maxHeight: 1024 }"
                    :disabled="!stat.isCustom"
                    density="compact"
                    hide-details
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="2">
                  <v-select
                    v-model="stat.skill"
                    :items="allSkillStats"
                    :label="t('page.tools.essenceCalculator.skillStats')"
                    :list-props="{ density: 'compact' }"
                    :menu-props="{ maxHeight: 1024 }"
                    :disabled="!stat.isCustom"
                    density="compact"
                    hide-details
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn
                    :disabled="index === 0"
                    icon="mdi-chevron-up"
                    variant="text"
                    @click="moveUp(index)"
                  />
                  <v-btn
                    :disabled="index === requiredEssenceStats.length - 1"
                    icon="mdi-chevron-down"
                    variant="text"
                    @click="moveDown(index)"
                  />
                  <v-btn
                    color="error"
                    icon="mdi-delete"
                    variant="text"
                    @click="removeStat(index)"
                  />
                </v-col>
              </v-row>
              <div class="mt-8 mb-8">
                <div class="d-flex align-center mb-4 mt-8 ga-2">
                  <v-icon>mdi-pencil</v-icon>
                  <h3>{{ $t('page.tools.essenceCalculator.custom') }}</h3>
                </div>
                <div>
                  <v-btn
                    class="customize-button"
                    prepend-icon="mdi-plus"
                    stacked
                    @click="addStatFromPreset({ ...emptyStat })"
                    >{{ $t('page.tools.essenceCalculator.blank') }}</v-btn
                  >
                </div>
                <div v-for="weaponType in weaponTypes" :key="weaponType">
                  <div class="d-flex align-center mb-4 mt-8 ga-2">
                    <img
                      :src="getGroupIconUrl(weaponTypeToGroupIconId[weaponType]!)"
                      :alt="weaponType"
                      class="group-icon"
                    >
                    <h3>{{ weaponType }}</h3>
                  </div>
                  <div class="weapon-grid">
                    <div
                      v-for="[weaponId, weapon] in Object.entries(weapons)
                        .filter(([weaponId, weapon]) => weapon.weaponType === weaponType)
                        .toSorted(
                          ([weaponIdA, weaponA], [weaponIdB, weaponB]) =>
                            weaponB.rarity - weaponA.rarity,
                        )"
                      :key="weaponId"
                      class="weapon-item"
                      @click="addStatFromPreset({ ...weapon.stats, isCustom: false, weaponId })"
                    >
                      <ContainerItemIcon :item-id="weaponId" show-item-name />
                    </div>
                  </div>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const { t } = useI18n();

interface EssenceStat {
  isCustom: boolean;
  weaponId: string | null;
  attribute: string | null;
  secondary: string | null;
  skill: string | null;
}

interface BattleChoice {
  battleId: string;
  battleName: string;
  selectedAttribute: string[];
  selectedSecondary: string | null;
  selectedSkill: string | null;
  matchedSelectedIndices: number[];
  matchedWeaponIds: string[];
}

const emptyStat: EssenceStat = {
  isCustom: true,
  weaponId: null,
  attribute: '',
  secondary: '',
  skill: '',
};

interface EnergyAlluvium {
  battleId: string;
  battleName: string;
  secondaryStats: string[];
  skillStats: string[];
}

interface WeaponStat {
  attribute: string | null;
  secondary: string | null;
  skill: string | null;
}

interface WeaponPreset {
  weaponId: string;
  weaponName: string;
  weaponType: string;
  rarity: number;
  stats: WeaponStat;
}

/** 全部的基础属性 */
const allAttributeStats = ['敏捷提升', '力量提升', '意志提升', '智识提升', '主能力提升'];
/** 全部的附加属性 */
const allSecondaryStats = [
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
const allSkillStats = [
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
const EnergyAlluviums: Record<string, EnergyAlluvium> = {
  '重度能量淤积点·枢纽区': {
    battleId: '重度能量淤积点·枢纽区',
    battleName: '重度能量淤积点·枢纽区',
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
const weaponTypes = ['单手剑', '双手剑', '长柄武器', '手铳', '施术单元'];
const weaponTypeToGroupIconId: Record<string, string> = {
  单手剑: 'icon_wiki_group_weapon_sword',
  双手剑: 'icon_wiki_group_weapon_claymores',
  长柄武器: 'icon_wiki_group_weapon_lance',
  手铳: 'icon_wiki_group_weapon_pistol',
  施术单元: 'icon_wiki_group_weapon_wand',
};

/** 武器稀有度 */
const rarityLevels = [3, 4, 5, 6];

/** 武器预设 */
const weapons: Record<string, WeaponPreset> = {
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
  wpn_sword_0008: {
    weaponId: 'wpn_sword_0008',
    weaponName: '应急手段',
    weaponType: '单手剑',
    rarity: 4,
    stats: {
      attribute: '敏捷提升',
      secondary: '物理伤害提升',
      skill: '压制',
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

/** 需求的基质属性 */
const requiredEssenceStats = ref<EssenceStat[]>([{ ...emptyStat }]);

function getGroupIconUrl(iconId: string): string {
  return `https://cos.yituliu.cn/endfield/sprites_selective/wiki/groupicon/${iconId}.png`;
}

function addStatFromPreset(stats: EssenceStat) {
  requiredEssenceStats.value.push({ ...stats });
}

function removeStat(index: number) {
  requiredEssenceStats.value.splice(index, 1);
}

function moveUp(index: number) {
  if (index === 0) {
    return;
  }
  const item = requiredEssenceStats.value.splice(index, 1)[0]!;
  requiredEssenceStats.value.splice(index - 1, 0, item);
}

function moveDown(index: number) {
  if (index === requiredEssenceStats.value.length - 1) {
    return;
  }
  const item = requiredEssenceStats.value.splice(index, 1)[0]!;
  requiredEssenceStats.value.splice(index + 1, 0, item);
}

function getEssenceStatDescription(stat: EssenceStat): string {
  if (stat.isCustom) {
    return t('page.tools.essenceCalculator.custom');
  } else {
    return weapons[stat.weaponId!]!.weaponName;
  }
}

const battleChoices = computed(() => {
  const result: BattleChoice[] = [];
  // 枚举所有能量淤积点
  for (const { battleId, battleName, secondaryStats, skillStats } of Object.values(
    EnergyAlluviums,
  )) {
    // 枚举基础属性组合
    for (const selectedAttribute of combinations(allAttributeStats, 3)) {
      // 枚举附加属性
      for (const selectedSecondary of secondaryStats) {
        const matchedSelectedIndices: number[] = [];
        const matchedWeaponIds: string[] = [];
        for (const [
          index,
          { attribute, secondary, skill },
        ] of requiredEssenceStats.value.entries()) {
          if (
            attribute &&
            selectedAttribute.includes(attribute) &&
            secondary &&
            selectedSecondary === secondary &&
            skill &&
            skillStats.includes(skill)
          ) {
            matchedSelectedIndices.push(index);
          }
        }
        for (const {
          weaponId,
          stats: { attribute, secondary, skill },
        } of Object.values(weapons)) {
          if (
            attribute &&
            selectedAttribute.includes(attribute) &&
            secondary &&
            selectedSecondary === secondary &&
            skill &&
            skillStats.includes(skill)
          ) {
            matchedWeaponIds.push(weaponId);
          }
        }
        if (matchedSelectedIndices.length > 0) {
          result.push({
            battleId,
            battleName,
            selectedAttribute,
            selectedSecondary,
            selectedSkill: null,
            matchedSelectedIndices,
            matchedWeaponIds,
          });
        }
      }
      // 枚举技能属性
      for (const selectedSkill of skillStats) {
        const matchedSelectedIndices: number[] = [];
        const matchedWeaponIds: string[] = [];
        for (const [
          index,
          { attribute, secondary, skill },
        ] of requiredEssenceStats.value.entries()) {
          if (
            attribute &&
            selectedAttribute.includes(attribute) &&
            secondary &&
            secondaryStats.includes(secondary) &&
            skill &&
            selectedSkill === skill
          ) {
            matchedSelectedIndices.push(index);
          }
        }
        for (const {
          weaponId,
          stats: { attribute, secondary, skill },
        } of Object.values(weapons)) {
          if (
            attribute &&
            selectedAttribute.includes(attribute) &&
            secondary &&
            secondaryStats.includes(secondary) &&
            skill &&
            selectedSkill === skill
          ) {
            matchedWeaponIds.push(weaponId);
          }
        }
        if (matchedSelectedIndices.length > 0) {
          result.push({
            battleId,
            battleName,
            selectedAttribute,
            selectedSecondary: null,
            selectedSkill,
            matchedSelectedIndices,
            matchedWeaponIds,
          });
        }
      }
    }
  }
  return result;
});

const bestChoices = computed(() => {
  const result = battleChoices.value.filter(
    ({ matchedSelectedIndices }) => matchedSelectedIndices.length > 0,
  );
  result.sort((a, b) => {
    // First, sort by matchedSelectedIndices.length (descending)
    if (b.matchedSelectedIndices.length !== a.matchedSelectedIndices.length) {
      return b.matchedSelectedIndices.length - a.matchedSelectedIndices.length;
    }
    // Then, sort by matchedWeaponIds.length (descending)
    return b.matchedWeaponIds.length - a.matchedWeaponIds.length;
  });
  return result.slice(0, 5);
});
</script>

<style scoped>
.page-container {
  --weapon-icon-size: clamp(2.5rem, 14vw, 5rem);
}

.group-icon {
  width: 2rem;
  height: 2rem;
}

[data-theme='light'] .group-icon {
  filter: invert(1);
}

[data-theme='dark'] .group-icon {
  filter: none;
}

.customize-button {
  height: var(--weapon-icon-size) !important;
  width: var(--weapon-icon-size) !important;
}

.weapon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, var(--weapon-icon-size));
  gap: calc(var(--weapon-icon-size) / 10);
}

.weapon-item {
  width: var(--weapon-icon-size);
  height: var(--weapon-icon-size);
}
</style>
