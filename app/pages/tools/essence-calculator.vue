<template>
  <h1 class="page-title">{{ t('page.tools.essenceCalculator.title') }}</h1>
  <v-expansion-panels multiple :model-value="['需求设定', '输出']">
    <v-expansion-panel value="需求设定">
      <v-expansion-panel-title>{{
        t('page.tools.essenceCalculator.demandSet')
      }}</v-expansion-panel-title>
      <v-expansion-panel-text>
        <p>{{ t('page.tools.essenceCalculator.demandSetDescription1') }}</p>
        <p>{{ t('page.tools.essenceCalculator.demandSetDescription2') }}</p>
        <v-container max-width="1280">
          <v-row v-for="(stat, index) in requiredEssenceStats" :key="index" align="center">
            <v-col cols="12" md="3">
              <v-select
                v-model="stat.attribute"
                :items="allAttributeStats"
                :label="t('page.tools.essenceCalculator.attributeStats')"
                density="comfortable"
                hide-details
                variant="outlined"
                :list-props="{ density: 'comfortable' }"
                :menu-props="{ maxHeight: 1024 }"
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="stat.secondary"
                :items="allSecondaryStats"
                :label="t('page.tools.essenceCalculator.secondaryStats')"
                density="comfortable"
                hide-details
                variant="outlined"
                :list-props="{ density: 'comfortable' }"
                :menu-props="{ maxHeight: 1024 }"
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="stat.skill"
                :items="allSkillStats"
                :label="t('page.tools.essenceCalculator.skillStats')"
                density="comfortable"
                hide-details
                variant="outlined"
                :list-props="{ density: 'comfortable' }"
                :menu-props="{ maxHeight: 1024 }"
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <!-- <v-btn
              icon="mdi-plus"
              color="primary"
              variant="text"
              @click="insertStat(index)"
            ></v-btn> -->
              <v-btn
                icon="mdi-chevron-up"
                variant="text"
                :disabled="index === 0"
                @click="moveUp(index)"
              ></v-btn>
              <v-btn
                icon="mdi-chevron-down"
                variant="text"
                :disabled="index === requiredEssenceStats.length - 1"
                @click="moveDown(index)"
              ></v-btn>
              <v-btn
                icon="mdi-delete"
                color="error"
                variant="text"
                @click="removeStat(index)"
              ></v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="9"></v-col>
            <v-col cols="12" md="3">
              <v-btn icon="mdi-plus" color="primary" variant="text">
                <v-icon>mdi-plus</v-icon>
                <v-menu activator="parent" v-model="menu" :close-on-content-click="false">
                  <v-list density="comfortable">
                    <v-list-subheader>{{
                      t('page.tools.essenceCalculator.custom')
                    }}</v-list-subheader>
                    <v-list-item @click="addStatFromPreset({ ...emptyStat })">
                      <v-list-item-title>{{
                        t('page.tools.essenceCalculator.custom')
                      }}</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-subheader>{{
                      t('page.tools.essenceCalculator.weaponPreset')
                    }}</v-list-subheader>
                    <v-list-item
                      v-for="weaponType in weaponTypes"
                      :key="weaponType"
                      append-icon="mdi-menu-right"
                      link
                    >
                      <v-list-item-title>{{ weaponType }}</v-list-item-title>
                      <v-menu
                        activator="parent"
                        submenu
                        open-on-hover
                        :open-on-focus="false"
                        :open-delay="100"
                      >
                        <v-list density="compact">
                          <template v-for="(rarity, index) in rarityLevels" :key="rarity">
                            <v-divider v-if="index > 0" class="my-1"></v-divider>
                            <v-list-subheader>
                              <span :style="{ color: tierColorMap.get(rarity)?.string() }"
                                >{{ rarity }}★</span
                              >
                            </v-list-subheader>
                            <v-list-item
                              v-for="{ weaponId, weaponName, stats } in Object.values(
                                weapons,
                              ).filter(
                                (weapon) =>
                                  weapon.weaponType === weaponType && weapon.rarity === rarity,
                              )"
                              :key="weaponId"
                              @click="addStatFromPreset(stats)"
                            >
                              <v-list-item-title>{{ weaponName }}</v-list-item-title>
                            </v-list-item>
                          </template>
                        </v-list>
                      </v-menu>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel value="输出">
      <v-expansion-panel-title>{{
        t('page.tools.essenceCalculator.output')
      }}</v-expansion-panel-title>
      <v-expansion-panel-text>
        <template v-if="bestChoice && bestChoice.matchedCount > 0">
          <v-alert
            type="success"
            variant="tonal"
            class="mb-4"
            :title="t('page.tools.essenceCalculator.bestStrategy')"
            border="start"
          >
            <i18n-t keypath="page.tools.essenceCalculator.suggestion" tag="p" class="mt-2">
              <template #battleName>
                <strong>{{ bestChoice.battleName }}</strong>
              </template>
              <template #count>
                <strong>{{ bestChoice.matchedCount }}</strong>
              </template>
            </i18n-t>
          </v-alert>

          <v-card variant="outlined">
            <v-card-title>{{ t('page.tools.essenceCalculator.preEngraveStats') }}</v-card-title>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-title class="font-weight-bold mb-1">{{
                t('page.tools.essenceCalculator.selectAttributeStats')
              }}</v-list-item-title>
              <div>
                <v-chip
                  v-for="attr in bestChoice.selectedAttribute"
                  :key="attr"
                  class="ma-1"
                  color="primary"
                  label
                  size="small"
                >
                  {{ attr }}
                </v-chip>
              </div>
            </v-list-item>
            <v-list-item v-if="bestChoice.selectedSecondary">
              <v-list-item-title class="font-weight-bold mb-1">{{
                t('page.tools.essenceCalculator.selectSecondaryAttribute')
              }}</v-list-item-title>
              <v-chip class="ma-1" color="teal" label size="small">
                {{ bestChoice.selectedSecondary }}
              </v-chip>
            </v-list-item>
            <v-list-item v-if="bestChoice.selectedSkill">
              <v-list-item-title class="font-weight-bold mb-1">{{
                t('page.tools.essenceCalculator.selectSkillAttribute')
              }}</v-list-item-title>
              <v-chip class="ma-1" color="blue" label size="small">
                {{ bestChoice.selectedSkill }}
              </v-chip>
            </v-list-item>
          </v-card>
        </template>
        <template v-else>
          <v-alert type="info" variant="tonal" border="start">
            {{ t('page.tools.essenceCalculator.noValidDemand') }}
          </v-alert>
        </template>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-title>{{
        t('page.tools.essenceCalculator.debugInput')
      }}</v-expansion-panel-title>
      <v-expansion-panel-text>
        <pre>{{ requiredEssenceStats }}</pre>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-title>{{
        t('page.tools.essenceCalculator.debugOutput')
      }}</v-expansion-panel-title>
      <v-expansion-panel-text>
        <pre>{{ JSON.stringify(battleChoices, null, 2) }}</pre>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
const { t } = useI18n();

interface EssenceStat {
  attribute: string | null;
  secondary: string | null;
  skill: string | null;
}

interface EnergyAlluvium {
  battleId: string;
  battleName: string;
  secondaryStats: string[];
  skillStats: string[];
}

interface BattleChoice {
  battleId: string;
  battleName: string;
  selectedAttribute: string[];
  selectedSecondary: string | null;
  selectedSkill: string | null;
  matchedCount: number;
}

interface WeaponPreset {
  weaponId: string;
  weaponName: string;
  weaponType: string;
  rarity: number;
  stats: EssenceStat;
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

const emptyStat: EssenceStat = {
  attribute: null,
  secondary: null,
  skill: null,
};

/** 武器类型 */
const weaponTypes = ['单手剑', '双手剑', '长柄武器', '手铳', '施术单元'];

/** 武器稀有度 */
const rarityLevels = [3, 4, 5, 6];

/** 武器预设 */
const weapons: Record<string, WeaponPreset> = {
  塔尔11: {
    weaponId: '塔尔11',
    weaponName: '塔尔11',
    weaponType: '单手剑',
    rarity: 3,
    stats: { attribute: '主能力提升', secondary: null, skill: '强攻' },
  },
  应急手段: {
    weaponId: '应急手段',
    weaponName: '应急手段',
    weaponType: '单手剑',
    rarity: 4,
    stats: { attribute: '敏捷提升', secondary: '物理伤害提升', skill: '压制' },
  },
  浪潮: {
    weaponId: '浪潮',
    weaponName: '浪潮',
    weaponType: '单手剑',
    rarity: 4,
    stats: { attribute: '智识提升', secondary: '攻击提升', skill: '追袭' },
  },
  钢铁余音: {
    weaponId: '钢铁余音',
    weaponName: '钢铁余音',
    weaponType: '单手剑',
    rarity: 5,
    stats: { attribute: '敏捷提升', secondary: '物理伤害提升', skill: '巧技' },
  },
  坚城铸造者: {
    weaponId: '坚城铸造者',
    weaponName: '坚城铸造者',
    weaponType: '单手剑',
    rarity: 5,
    stats: { attribute: '智识提升', secondary: '法术伤害提升', skill: '昂扬' },
  },
  '逐鳞3.0': {
    weaponId: '逐鳞3.0',
    weaponName: '逐鳞3.0',
    weaponType: '单手剑',
    rarity: 5,
    stats: { attribute: '力量提升', secondary: '终结技效率提升', skill: '压制' },
  },
  十二问: {
    weaponId: '十二问',
    weaponName: '十二问',
    weaponType: '单手剑',
    rarity: 5,
    stats: { attribute: '敏捷提升', secondary: '攻击提升', skill: '附术' },
  },
  'O.B.J.轻芒': {
    weaponId: 'O.B.J.轻芒',
    weaponName: 'O.B.J.轻芒',
    weaponType: '单手剑',
    rarity: 5,
    stats: { attribute: '敏捷提升', secondary: '攻击提升', skill: '流转' },
  },
  仰止: {
    weaponId: '仰止',
    weaponName: '仰止',
    weaponType: '单手剑',
    rarity: 5,
    stats: { attribute: '敏捷提升', secondary: '物理伤害提升', skill: '夜幕' },
  },
  宏愿: {
    weaponId: '宏愿',
    weaponName: '宏愿',
    weaponType: '单手剑',
    rarity: 6,
    stats: { attribute: '敏捷提升', secondary: '攻击提升', skill: '附术' },
  },
  不知归: {
    weaponId: '不知归',
    weaponName: '不知归',
    weaponType: '单手剑',
    rarity: 6,
    stats: { attribute: '意志提升', secondary: '攻击提升', skill: '流转' },
  },
  熔铸火焰: {
    weaponId: '熔铸火焰',
    weaponName: '熔铸火焰',
    weaponType: '单手剑',
    rarity: 6,
    stats: { attribute: '智识提升', secondary: '攻击提升', skill: '夜幕' },
  },
  黯色火炬: {
    weaponId: '黯色火炬',
    weaponName: '黯色火炬',
    weaponType: '单手剑',
    rarity: 6,
    stats: { attribute: '主能力提升', secondary: '灼热伤害提升', skill: '附术' },
  },
  扶摇: {
    weaponId: '扶摇',
    weaponName: '扶摇',
    weaponType: '单手剑',
    rarity: 6,
    stats: { attribute: '敏捷提升', secondary: '暴击率提升', skill: '夜幕' },
  },
  热熔切割器: {
    weaponId: '热熔切割器',
    weaponName: '热熔切割器',
    weaponType: '单手剑',
    rarity: 6,
    stats: { attribute: '意志提升', secondary: '攻击提升', skill: '流转' },
  },
  显赫声名: {
    weaponId: '显赫声名',
    weaponName: '显赫声名',
    weaponType: '单手剑',
    rarity: 6,
    stats: { attribute: '敏捷提升', secondary: '物理伤害提升', skill: '残暴' },
  },
  白夜新星: {
    weaponId: '白夜新星',
    weaponName: '白夜新星',
    weaponType: '单手剑',
    rarity: 6,
    stats: { attribute: '智识提升', secondary: '源石技艺提升', skill: '附术' },
  },
  达尔霍夫7: {
    weaponId: '达尔霍夫7',
    weaponName: '达尔霍夫7',
    weaponType: '双手剑',
    rarity: 3,
    stats: { attribute: '主能力提升', secondary: null, skill: '强攻' },
  },
  工业零点一: {
    weaponId: '工业零点一',
    weaponName: '工业零点一',
    weaponType: '双手剑',
    rarity: 4,
    stats: { attribute: '力量提升', secondary: '攻击提升', skill: '压制' },
  },
  淬火者: {
    weaponId: '淬火者',
    weaponName: '淬火者',
    weaponType: '双手剑',
    rarity: 4,
    stats: { attribute: '意志提升', secondary: '生命提升', skill: '粉碎' },
  },
  探骊: {
    weaponId: '探骊',
    weaponName: '探骊',
    weaponType: '双手剑',
    rarity: 5,
    stats: { attribute: '力量提升', secondary: '终结技效率提升', skill: '迸发' },
  },
  古渠: {
    weaponId: '古渠',
    weaponName: '古渠',
    weaponType: '双手剑',
    rarity: 5,
    stats: { attribute: '力量提升', secondary: '源石技艺提升', skill: '残暴' },
  },
  终点之声: {
    weaponId: '终点之声',
    weaponName: '终点之声',
    weaponType: '双手剑',
    rarity: 5,
    stats: { attribute: '力量提升', secondary: '生命提升', skill: '医疗' },
  },
  'O.B.J.重荷': {
    weaponId: 'O.B.J.重荷',
    weaponName: 'O.B.J.重荷',
    weaponType: '双手剑',
    rarity: 5,
    stats: { attribute: '力量提升', secondary: '生命提升', skill: '效益' },
  },
  大雷斑: {
    weaponId: '大雷斑',
    weaponName: '大雷斑',
    weaponType: '双手剑',
    rarity: 6,
    stats: { attribute: '力量提升', secondary: '生命提升', skill: '医疗' },
  },
  赫拉芬格: {
    weaponId: '赫拉芬格',
    weaponName: '赫拉芬格',
    weaponType: '双手剑',
    rarity: 6,
    stats: { attribute: '力量提升', secondary: '寒冷伤害提升', skill: '迸发' },
  },
  典范: {
    weaponId: '典范',
    weaponName: '典范',
    weaponType: '双手剑',
    rarity: 6,
    stats: { attribute: '力量提升', secondary: '攻击提升', skill: '压制' },
  },
  昔日精品: {
    weaponId: '昔日精品',
    weaponName: '昔日精品',
    weaponType: '双手剑',
    rarity: 6,
    stats: { attribute: '意志提升', secondary: '生命提升', skill: '效益' },
  },
  破碎君王: {
    weaponId: '破碎君王',
    weaponName: '破碎君王',
    weaponType: '双手剑',
    rarity: 6,
    stats: { attribute: '力量提升', secondary: '攻击提升', skill: '粉碎' },
  },
  奥佩罗77: {
    weaponId: '奥佩罗77',
    weaponName: '奥佩罗77',
    weaponType: '长柄武器',
    rarity: 3,
    stats: { attribute: '主能力提升', secondary: null, skill: '强攻' },
  },
  寻路者道标: {
    weaponId: '寻路者道标',
    weaponName: '寻路者道标',
    weaponType: '长柄武器',
    rarity: 4,
    stats: { attribute: '敏捷提升', secondary: '攻击提升', skill: '昂扬' },
  },
  天使杀手: {
    weaponId: '天使杀手',
    weaponName: '天使杀手',
    weaponType: '长柄武器',
    rarity: 4,
    stats: { attribute: '意志提升', secondary: '法术伤害提升', skill: '压制' },
  },
  嵌合正义: {
    weaponId: '嵌合正义',
    weaponName: '嵌合正义',
    weaponType: '长柄武器',
    rarity: 5,
    stats: { attribute: '力量提升', secondary: '终结技效率提升', skill: '残暴' },
  },
  'O.B.J.尖峰': {
    weaponId: 'O.B.J.尖峰',
    weaponName: 'O.B.J.尖峰',
    weaponType: '长柄武器',
    rarity: 5,
    stats: { attribute: '意志提升', secondary: '物理伤害提升', skill: '附术' },
  },
  向心之引: {
    weaponId: '向心之引',
    weaponName: '向心之引',
    weaponType: '长柄武器',
    rarity: 5,
    stats: { attribute: '意志提升', secondary: '电磁伤害提升', skill: '压制' },
  },
  负山: {
    weaponId: '负山',
    weaponName: '负山',
    weaponType: '长柄武器',
    rarity: 6,
    stats: { attribute: '敏捷提升', secondary: '物理伤害提升', skill: '效益' },
  },
  骁勇: {
    weaponId: '骁勇',
    weaponName: '骁勇',
    weaponType: '长柄武器',
    rarity: 6,
    stats: { attribute: '敏捷提升', secondary: '物理伤害提升', skill: '巧技' },
  },
  'J.E.T.': {
    weaponId: 'J.E.T.',
    weaponName: 'J.E.T.',
    weaponType: '长柄武器',
    rarity: 6,
    stats: { attribute: '意志提升', secondary: '攻击提升', skill: '压制' },
  },
  佩科5: {
    weaponId: '佩科5',
    weaponName: '佩科5',
    weaponType: '手铳',
    rarity: 3,
    stats: { attribute: '主能力提升', secondary: null, skill: '强攻' },
  },
  呼啸守卫: {
    weaponId: '呼啸守卫',
    weaponName: '呼啸守卫',
    weaponType: '手铳',
    rarity: 4,
    stats: { attribute: '智识提升', secondary: '攻击提升', skill: '压制' },
  },
  长路: {
    weaponId: '长路',
    weaponName: '长路',
    weaponType: '手铳',
    rarity: 4,
    stats: { attribute: '力量提升', secondary: '法术伤害提升', skill: '追袭' },
  },
  '作品：众生': {
    weaponId: '作品：众生',
    weaponName: '作品：众生',
    weaponType: '手铳',
    rarity: 5,
    stats: { attribute: '敏捷提升', secondary: '法术伤害提升', skill: '附术' },
  },
  'O.B.J.迅极': {
    weaponId: 'O.B.J.迅极',
    weaponName: 'O.B.J.迅极',
    weaponType: '手铳',
    rarity: 5,
    stats: { attribute: '敏捷提升', secondary: '终结技效率提升', skill: '迸发' },
  },
  理性告别: {
    weaponId: '理性告别',
    weaponName: '理性告别',
    weaponType: '手铳',
    rarity: 5,
    stats: { attribute: '力量提升', secondary: '灼热伤害提升', skill: '追袭' },
  },
  艺术暴君: {
    weaponId: '艺术暴君',
    weaponName: '艺术暴君',
    weaponType: '手铳',
    rarity: 6,
    stats: { attribute: '智识提升', secondary: '暴击率提升', skill: '切骨' },
  },
  领航者: {
    weaponId: '领航者',
    weaponName: '领航者',
    weaponType: '手铳',
    rarity: 6,
    stats: { attribute: '主能力提升', secondary: '终结技效率提升', skill: '附术' },
  },
  楔子: {
    weaponId: '楔子',
    weaponName: '楔子',
    weaponType: '手铳',
    rarity: 6,
    stats: { attribute: '智识提升', secondary: '攻击提升', skill: '附术' },
  },
  同类相食: {
    weaponId: '同类相食',
    weaponName: '同类相食',
    weaponType: '手铳',
    rarity: 6,
    stats: { attribute: '力量提升', secondary: '攻击提升', skill: '附术' },
  },
  吉米尼12: {
    weaponId: '吉米尼12',
    weaponName: '吉米尼12',
    weaponType: '施术单元',
    rarity: 3,
    stats: { attribute: '主能力提升', secondary: null, skill: '强攻' },
  },
  全自动骇新星: {
    weaponId: '全自动骇新星',
    weaponName: '全自动骇新星',
    weaponType: '施术单元',
    rarity: 4,
    stats: { attribute: '智识提升', secondary: '法术伤害提升', skill: '昂扬' },
  },
  荧光雷羽: {
    weaponId: '荧光雷羽',
    weaponName: '荧光雷羽',
    weaponType: '施术单元',
    rarity: 4,
    stats: { attribute: '意志提升', secondary: '攻击提升', skill: '压制' },
  },
  悼亡诗: {
    weaponId: '悼亡诗',
    weaponName: '悼亡诗',
    weaponType: '施术单元',
    rarity: 5,
    stats: { attribute: '智识提升', secondary: '攻击提升', skill: '夜幕' },
  },
  莫奈何: {
    weaponId: '莫奈何',
    weaponName: '莫奈何',
    weaponType: '施术单元',
    rarity: 5,
    stats: { attribute: '意志提升', secondary: '终结技效率提升', skill: '昂扬' },
  },
  迷失荒野: {
    weaponId: '迷失荒野',
    weaponName: '迷失荒野',
    weaponType: '施术单元',
    rarity: 5,
    stats: { attribute: '智识提升', secondary: '电磁伤害提升', skill: '附术' },
  },
  布道自由: {
    weaponId: '布道自由',
    weaponName: '布道自由',
    weaponType: '施术单元',
    rarity: 5,
    stats: { attribute: '意志提升', secondary: '治疗效率提升', skill: '医疗' },
  },
  'O.B.J.术识': {
    weaponId: 'O.B.J.术识',
    weaponName: 'O.B.J.术识',
    weaponType: '施术单元',
    rarity: 5,
    stats: { attribute: '智识提升', secondary: '源石技艺提升', skill: '追袭' },
  },
  使命必达: {
    weaponId: '使命必达',
    weaponName: '使命必达',
    weaponType: '施术单元',
    rarity: 6,
    stats: { attribute: '意志提升', secondary: '终结技效率提升', skill: '追袭' },
  },
  沧溟星梦: {
    weaponId: '沧溟星梦',
    weaponName: '沧溟星梦',
    weaponType: '施术单元',
    rarity: 6,
    stats: { attribute: '智识提升', secondary: '治疗效率提升', skill: '附术' },
  },
  '作品：蚀象': {
    weaponId: '作品：蚀象',
    weaponName: '作品：蚀象',
    weaponType: '施术单元',
    rarity: 6,
    stats: { attribute: '主能力提升', secondary: '攻击提升', skill: '压制' },
  },
  爆破单元: {
    weaponId: '爆破单元',
    weaponName: '爆破单元',
    weaponType: '施术单元',
    rarity: 6,
    stats: { attribute: '智识提升', secondary: '源石技艺提升', skill: '迸发' },
  },
  遗忘: {
    weaponId: '遗忘',
    weaponName: '遗忘',
    weaponType: '施术单元',
    rarity: 6,
    stats: { attribute: '智识提升', secondary: '攻击提升', skill: '夜幕' },
  },
  骑士精神: {
    weaponId: '骑士精神',
    weaponName: '骑士精神',
    weaponType: '施术单元',
    rarity: 6,
    stats: { attribute: '意志提升', secondary: '生命提升', skill: '医疗' },
  },
};

const menu = ref(false);

/** 需求的基质属性 */
const requiredEssenceStats = ref<EssenceStat[]>([{ ...weapons.熔铸火焰!.stats }]);

function addStatFromPreset(stats: EssenceStat) {
  requiredEssenceStats.value.push({ ...stats });
  menu.value = false;
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

const battleChoices = computed(() => {
  const validEssenceStats = requiredEssenceStats.value.filter(
    ({ attribute, secondary, skill }) =>
      attribute &&
      allAttributeStats.includes(attribute) &&
      secondary &&
      allSecondaryStats.includes(secondary) &&
      skill &&
      allSkillStats.includes(skill),
  );

  const result: BattleChoice[] = [];
  for (const { battleId, battleName, secondaryStats, skillStats } of Object.values(
    EnergyAlluviums,
  )) {
    for (const selectedAttribute of combinations(allAttributeStats, 3)) {
      // 选择附加属性
      for (const selectedSecondary of secondaryStats) {
        let matchedCount = 0;
        for (const stat of validEssenceStats) {
          if (
            stat.attribute &&
            selectedAttribute.includes(stat.attribute) &&
            stat.secondary &&
            selectedSecondary === stat.secondary &&
            stat.skill &&
            skillStats.includes(stat.skill)
          ) {
            matchedCount++;
          }
        }
        if (matchedCount > 0) {
          result.push({
            battleId,
            battleName,
            selectedAttribute,
            selectedSecondary,
            selectedSkill: null,
            matchedCount,
          });
        }
      }
      // 选择技能属性
      for (const selectedSkill of skillStats) {
        let matchedCount = 0;
        for (const stat of validEssenceStats) {
          if (
            stat.attribute &&
            selectedAttribute.includes(stat.attribute) &&
            stat.secondary &&
            secondaryStats.includes(stat.secondary) &&
            stat.skill &&
            selectedSkill === stat.skill
          ) {
            matchedCount++;
          }
        }
        if (matchedCount > 0) {
          result.push({
            battleId,
            battleName,
            selectedAttribute,
            selectedSecondary: null,
            selectedSkill,
            matchedCount,
          });
        }
      }
    }
  }
  return result;
});

const bestChoice = computed(() => {
  if (!battleChoices.value.some(({ matchedCount }) => matchedCount > 0)) {
    return null;
  }
  return battleChoices.value.reduce((prev, current) =>
    prev.matchedCount > current.matchedCount ? prev : current,
  );
});
</script>

<style scoped></style>
