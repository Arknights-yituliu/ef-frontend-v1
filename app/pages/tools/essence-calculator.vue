<template>
  <h1>基质计算器</h1>
  <v-expansion-panels multiple :model-value="['需求设定', '输出']">
    <v-expansion-panel value="需求设定">
      <v-expansion-panel-title>需求设定</v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-container max-width="1280">
          <v-row v-for="(stat, index) in requiredEssenceStats" :key="index" align="center">
            <v-col cols="12" md="3">
              <v-select
                v-model="stat.attribute"
                :items="allAttributeStats"
                label="基础属性"
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
                label="附加属性"
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
                label="技能属性"
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
                <v-menu activator="parent">
                  <v-list density="comfortable">
                    <v-list-subheader>空白</v-list-subheader>
                    <v-list-item @click="insertStat(requiredEssenceStats.length)">
                      <v-list-item-title>空白</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-subheader>武器预设</v-list-subheader>
                    <v-list-item
                      v-for="{ weaponType, weapons } in groupedWeaponPresets"
                      :key="weaponType"
                      append-icon="mdi-menu-right"
                    >
                      <v-list-item-title>{{ weaponType }}</v-list-item-title>
                      <v-menu
                        activator="parent"
                        submenu
                        open-on-hover
                        :open-on-focus="false"
                        :open-delay="100"
                      >
                        <v-list density="comfortable">
                          <v-list-item
                            v-for="preset in weapons"
                            :key="preset.weaponId"
                            @click="addStatFromPreset(preset.stats)"
                          >
                            <v-list-item-title>{{ preset.weaponName }}</v-list-item-title>
                          </v-list-item>
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
      <v-expansion-panel-title>输出</v-expansion-panel-title>
      <v-expansion-panel-text>
        <template v-if="bestChoice && bestChoice.matchedCount > 0">
          <p>
            建议刷取<strong>{{ bestChoice.battleName }}</strong
            >，
          </p>
          <p>选择基础属性：{{ bestChoice.selectedAttribute.join('、') }}，</p>
          <p v-if="bestChoice.selectedSecondary">
            选择附加属性：{{ bestChoice.selectedSecondary }}，
          </p>
          <p v-if="bestChoice.selectedSkill">选择技能属性：{{ bestChoice.selectedSkill }}，</p>
          <p>可以刷到 {{ bestChoice.matchedCount }} 个需求的基质。</p>
        </template>
        <template v-else>请至少添加一个需求。</template>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-title>调试输入</v-expansion-panel-title>
      <v-expansion-panel-text>
        <pre>{{ requiredEssenceStats }}</pre>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-title>调试输出</v-expansion-panel-title>
      <v-expansion-panel-text>
        <pre>{{ JSON.stringify(battleChoices, null, 2) }}</pre>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { combinations } from '@/shared/utils/CombinatoricUtil';
import { ref, computed } from 'vue';

interface EssenceStat {
  attribute: string;
  secondary: string;
  skill: string;
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
  attribute: '',
  secondary: '',
  skill: '',
};

/** 需求的基质属性 */
const requiredEssenceStats = ref<EssenceStat[]>([{ ...emptyStat }]);

/** 武器类型 */
const weaponTypes = ['单手剑', '双手剑', '长柄武器', '手铳', '施术单元'];

/** 武器预设 */
const weaponPresets: Record<string, WeaponPreset> = {
  白夜新星: {
    weaponId: '白夜新星',
    weaponName: '白夜新星',
    weaponType: '单手剑',
    rarity: 6,
    stats: { attribute: '智识提升', secondary: '源石技艺提升', skill: '附术' },
  },
  显赫声名: {
    weaponId: '显赫声名',
    weaponName: '显赫声名',
    weaponType: '单手剑',
    rarity: 6,
    stats: { attribute: '敏捷提升', secondary: '物理伤害提升', skill: '残暴' },
  },
  热熔切割器: {
    weaponId: '热熔切割器',
    weaponName: '热熔切割器',
    weaponType: '单手剑',
    rarity: 6,
    stats: { attribute: '意志提升', secondary: '攻击提升', skill: '流转' },
  },
  扶摇: {
    weaponId: '扶摇',
    weaponName: '扶摇',
    weaponType: '单手剑',
    rarity: 6,
    stats: { attribute: '敏捷提升', secondary: '暴击率提升', skill: '夜幕' },
  },
  黯色火炬: {
    weaponId: '黯色火炬',
    weaponName: '黯色火炬',
    weaponType: '单手剑',
    rarity: 6,
    stats: { attribute: '主能力提升', secondary: '灼热伤害提升', skill: '附术' },
  },
  熔铸火焰: {
    weaponId: '熔铸火焰',
    weaponName: '熔铸火焰',
    weaponType: '单手剑',
    rarity: 6,
    stats: { attribute: '智识提升', secondary: '攻击提升', skill: '夜幕' },
  },
  不知归: {
    weaponId: '不知归',
    weaponName: '不知归',
    weaponType: '单手剑',
    rarity: 6,
    stats: { attribute: '意志提升', secondary: '攻击提升', skill: '流转' },
  },
  宏愿: {
    weaponId: '宏愿',
    weaponName: '宏愿',
    weaponType: '单手剑',
    rarity: 6,
    stats: { attribute: '敏捷提升', secondary: '攻击提升', skill: '附术' },
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
  JET: {
    weaponId: 'JET',
    weaponName: 'JET',
    weaponType: '长柄武器',
    rarity: 6,
    stats: { attribute: '意志提升', secondary: '攻击提升', skill: '压制' },
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

const groupedWeaponPresets = computed(() => {
  const groups = new Map<string, WeaponPreset[]>(weaponTypes.map((type) => [type, []]));
  for (const preset of Object.values(weaponPresets)) {
    groups.get(preset.weaponType)?.push(preset);
  }
  return weaponTypes.map((weaponType) => ({
    weaponType: weaponType,
    weapons: groups.get(weaponType) ?? [],
  }));
});

function addStatFromPreset(stats: EssenceStat) {
  requiredEssenceStats.value.push({ ...stats });
}

function removeStat(index: number) {
  requiredEssenceStats.value.splice(index, 1);
}

function insertStat(index: number) {
  requiredEssenceStats.value.splice(index, 0, { ...emptyStat });
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
      allAttributeStats.includes(attribute) &&
      allSecondaryStats.includes(secondary) &&
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
            selectedAttribute.includes(stat.attribute) &&
            selectedSecondary === stat.secondary &&
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
            selectedAttribute.includes(stat.attribute) &&
            secondaryStats.includes(stat.secondary) &&
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
